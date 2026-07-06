// Payment tab.
// Real clients: reads stripeCustomerId + subscription state off the client doc
// (populated by the stripeWebhook Cloud Function). Two CTAs — "Start
// subscription" (Stripe Checkout) and "Manage subscription" (Stripe Customer
// Portal). Recent invoices live in clients/{uid}/payments.
// Demo mode: renders the same layout with hard-coded fake numbers.
import React, { useEffect, useState } from "react";
import { getFunctions, httpsCallable } from "firebase/functions";
import { collection, getDocs, orderBy, query, limit } from "firebase/firestore";
import { db } from "../../firebase";
import { usePortalAuth } from "../portalAuth";
import { Card, Stat, formatDate } from "./uiBits";

export default function Payment({ view }) {
  const { payment } = view;
  const { isDemo, client, setClient } = usePortalAuth();
  const [busyCheckout, setBusyCheckout] = useState(false);
  const [busyPortal, setBusyPortal] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState(null);
  const [invoices, setInvoices] = useState([]);

  // Look up an existing Stripe subscription by email so pre-portal clients
  // don't have to re-checkout. Runs once when a real client mounts the tab.
  useEffect(() => {
    if (isDemo || !client?.id) return;
    // Only sync if we don't already know they have a subscription.
    if (client?.stripeSubscriptionId) return;
    let cancelled = false;
    (async () => {
      setSyncing(true);
      try {
        const fn = httpsCallable(getFunctions(), "syncStripeSubscription");
        const res = await fn({});
        if (cancelled) return;
        if (res.data?.linked && res.data?.patch) {
          // Hydrate the client state with the exact fields the sync function
          // just wrote to Firestore, converting the serialized-millis timestamps
          // back to Date objects so the UI can format them.
          const patch = { ...res.data.patch };
          for (const [k, v] of Object.entries(patch)) {
            if (v && typeof v === "object" && typeof v._millis === "number") {
              patch[k] = new Date(v._millis);
            }
          }
          setClient((c) => ({ ...(c || {}), ...patch }));
        }
      } catch (err) {
        console.warn("syncStripeSubscription failed:", err.message || err);
      } finally {
        if (!cancelled) setSyncing(false);
      }
    })();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo, client?.id]);

  // Load recent invoices for the real client. Tries Stripe live first so newly
  // sent invoices show up before the webhook lands, then falls back to the
  // Firestore payments/ mirror if the Stripe call fails.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (isDemo || !client?.id) return;
      try {
        const listFn = httpsCallable(getFunctions(), "listStripeInvoices");
        const res = await listFn({ limit: 25 });
        if (cancelled) return;
        const live = (res.data?.invoices || []).map((inv) => ({
          id: inv.id,
          description: inv.description,
          status: inv.status,
          amountDue: inv.amountDue,
          hostedInvoiceUrl: inv.hostedInvoiceUrl,
          updatedAt: inv.created ? new Date(inv.created) : null,
        }));
        if (live.length > 0) {
          setInvoices(live);
          return;
        }
      } catch (err) {
        console.warn("listStripeInvoices failed, falling back to Firestore:", err.message);
      }
      // Fallback: read whatever the webhook has written to payments/.
      try {
        const snap = await getDocs(query(
          collection(db, "clients", client.id, "payments"),
          orderBy("updatedAt", "desc"),
          limit(12)
        ));
        if (cancelled) return;
        setInvoices(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("load invoices failed", err);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [isDemo, client?.id]);

  const startCheckout = async () => {
    setBusyCheckout(true);
    setError(null);
    try {
      const fn = httpsCallable(getFunctions(), "createCheckoutSession");
      // Client-side always uses the default $499 standard plan. Admins can
      // start a $249 subscription via the admin route.
      const res = await fn({ returnUrl: window.location.href });
      const url = res.data?.url;
      if (url) window.location.assign(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not start checkout.");
    } finally {
      setBusyCheckout(false);
    }
  };

  const openPortal = async () => {
    setBusyPortal(true);
    setError(null);
    try {
      const fn = httpsCallable(getFunctions(), "createBillingPortalSession");
      const res = await fn({ returnUrl: window.location.href });
      const url = res.data?.url;
      if (url) window.location.assign(url);
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not open billing portal.");
    } finally {
      setBusyPortal(false);
    }
  };

  // DEMO MODE — hard-coded snapshot from demoData.js.
  if (isDemo && payment) {
    return (
      <div className="space-y-6">
        <PageHeader />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <Stat label="Current method" value={`${payment.brand} •••• ${payment.last4}`} accent="text-gray-900" />
          <Stat label="Next invoice" value={formatDate(payment.nextInvoice)} accent="text-indigo-600" />
          <Stat label="Est. next total" value={`$${(payment.currentPeriodTotal || 0).toLocaleString()}`} accent="text-emerald-600" sub={`${payment.currentPeriodFlyers.toLocaleString()} flyers @ $${payment.perFlyer}`} />
        </div>
        <Card title="Plan" subtitle="Base + per-flyer pricing.">
          <div className="rounded-xl border border-gray-100 p-4 space-y-2">
            <Row label="Monthly base" value={`$${payment.monthlyBase}`} />
            <Row label="Per flyer" value={`$${payment.perFlyer.toFixed(2)}`} />
            <Row bold label="Estimated this period" value={`$${payment.currentPeriodTotal.toLocaleString()}`} accent="text-emerald-700" />
          </div>
        </Card>
        <Card title="Payment method" action={<DisabledDemoButton label="Update card" />}>
          <p className="text-sm text-gray-700">{payment.brand} ending in <span className="font-semibold">{payment.last4}</span></p>
          <p className="text-xs text-gray-500 mt-1">Billing email: {payment.billingEmail}</p>
        </Card>
        <p className="text-[11px] text-gray-400 text-center">Demo mode — real clients get live Stripe buttons here.</p>
      </div>
    );
  }

  // REAL CLIENT — Stripe-backed.
  const hasSub = Boolean(client?.stripeSubscriptionId);
  const status = client?.subscriptionStatus || null;
  const pm = client?.paymentMethod || null;
  const nextRenewal = client?.subscriptionCurrentPeriodEnd
    ? (client.subscriptionCurrentPeriodEnd.toDate?.() || new Date(client.subscriptionCurrentPeriodEnd))
    : null;

  return (
    <div className="space-y-6">
      <PageHeader />

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 text-sm text-red-700 px-4 py-3">
          {error}
        </div>
      )}

      {syncing && !hasSub && (
        <div className="rounded-lg border border-gray-200 bg-white text-xs text-gray-500 px-4 py-3">
          Checking Stripe for an existing subscription…
        </div>
      )}
      {!hasSub ? (
        <Card
          title="Start your subscription"
          subtitle="$499/mo covers weekly drops, tracking, and monthly reporting."
        >
          <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 mb-4">
            <p className="text-lg font-bold text-gray-900">$499/mo</p>
            <p className="text-xs text-gray-600 mt-1">Base subscription. Flyer print/postage billed separately per campaign.</p>
          </div>
          <button
            onClick={startCheckout}
            disabled={busyCheckout}
            className="w-full sm:w-auto rounded-full bg-emerald-600 text-white text-sm font-semibold px-6 py-3 hover:bg-emerald-700 disabled:opacity-50"
          >
            {busyCheckout ? "Redirecting…" : "Continue to checkout"}
          </button>
          <p className="text-[11px] text-gray-500 mt-3">
            If you already have a subscription with us, sign in with the email you paid with — we'll link it automatically.
          </p>
        </Card>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <Stat
              label="Status"
              value={status || "Unknown"}
              accent={status === "active" ? "text-emerald-600" : status === "trialing" ? "text-blue-600" : "text-amber-600"}
            />
            <Stat label="Payment method" value={pm ? `${cap(pm.brand)} •••• ${pm.last4}` : "—"} accent="text-gray-900" />
            <Stat label="Renews" value={formatDate(nextRenewal)} accent="text-indigo-600" sub={client?.cancelAtPeriodEnd ? "Cancels at period end" : undefined} />
          </div>

          <Card
            title="Manage subscription"
            subtitle="Update card, download invoices, cancel — all through Stripe."
            action={
              <button
                onClick={openPortal}
                disabled={busyPortal}
                className="rounded-full bg-emerald-600 text-white text-xs font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
              >
                {busyPortal ? "Opening…" : "Open billing portal"}
              </button>
            }
          >
            <p className="text-sm text-gray-500">Opens Stripe's hosted portal in this window. You'll come right back when you're done.</p>
          </Card>

          <Card title="Recent invoices" subtitle="Includes your subscription and any flyer-drop charges we've sent.">
            {invoices.length === 0 ? (
              <p className="text-xs text-gray-500 italic">No invoices yet.</p>
            ) : (
              <div className="divide-y divide-gray-100">
                {invoices.map((inv) => (
                  <div key={inv.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {inv.description || "Invoice"}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {formatDate(inv.updatedAt)} · <StatusPill status={inv.status} />
                      </p>
                    </div>
                    <div className="flex items-center gap-3 flex-shrink-0">
                      <span className="text-sm font-semibold text-gray-900">
                        ${((inv.amountDue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                      {inv.hostedInvoiceUrl && (
                        <a
                          href={inv.hostedInvoiceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs font-semibold text-emerald-700 hover:text-emerald-900"
                        >
                          View →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </>
      )}

      <p className="text-[11px] text-gray-400">
        Billing questions? Reply to any invoice or email <a href="mailto:billing@untappedhomes.com" className="underline">billing@untappedhomes.com</a>.
      </p>
    </div>
  );
}

function PageHeader() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
      <p className="text-sm text-gray-500 mt-1">Manage your billing method and monthly plan.</p>
    </div>
  );
}

function Row({ label, value, bold, accent }) {
  return (
    <div className={`flex items-center justify-between text-sm ${bold ? "border-t border-gray-100 pt-2" : ""}`}>
      <span className={bold ? "text-gray-700 font-medium" : "text-gray-500"}>{label}</span>
      <span className={`font-semibold ${accent || "text-gray-900"} ${bold ? "font-bold" : ""}`}>{value}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const cls =
    status === "paid" ? "text-emerald-700 bg-emerald-100"
    : status === "open" ? "text-amber-700 bg-amber-100"
    : status === "void" || status === "uncollectible" ? "text-gray-700 bg-gray-100"
    : "text-blue-700 bg-blue-100";
  return <span className={`inline-flex items-center rounded-full text-[10px] font-medium px-1.5 py-0.5 ${cls}`}>{status || "—"}</span>;
}

function DisabledDemoButton({ label }) {
  return (
    <button disabled className="rounded-full bg-white border border-gray-300 text-xs font-semibold text-gray-500 px-4 py-2 cursor-not-allowed">
      {label}
    </button>
  );
}

function cap(s) {
  if (!s) return s;
  return s.charAt(0).toUpperCase() + s.slice(1);
}
