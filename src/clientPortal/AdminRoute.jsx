// Admin route (/portal-admin). Gated by ADMIN_EMAILS.
// v1 capabilities:
//   - list clients
//   - create a client (email + legal name)
//   - open a client -> add a campaign row, upload a proof, mark onboarding done
// Everything writes directly to Firestore; more polish comes later.
import React, { useEffect, useRef, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db, storage } from "../firebase";
import { PortalAuthProvider, usePortalAuth } from "./portalAuth";
import PortalLogin from "./PortalLogin";
import { Card, StageChip, formatDate } from "./tabs/uiBits";

function AdminGate() {
  const { user, loading, isAdmin, signOut } = usePortalAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center text-sm text-gray-500">Loading…</div>;
  if (!user) return <PortalLogin />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
        <p className="text-sm text-gray-700 mb-2">Admin access required.</p>
        <p className="text-xs text-gray-500 mb-4">Signed in as {user.email}. Ask Max to add this email to ADMIN_EMAILS.</p>
        <button onClick={signOut} className="text-xs font-medium rounded-full border border-gray-200 px-4 py-2 text-gray-700 hover:bg-gray-100">
          Sign out
        </button>
      </div>
    );
  }
  return <AdminShell />;
}

function AdminShell() {
  const { user, signOut } = usePortalAuth();
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(query(collection(db, "clients"), orderBy("createdAt", "desc")));
      setClients(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg font-extrabold text-gray-900 tracking-tight">
              Untapped<span className="text-emerald-600">Homes</span>
            </a>
            <span className="text-xs text-gray-400">/ Admin</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <a href="/portal" className="hover:text-gray-900">Client portal →</a>
            <span>{user?.email}</span>
            <button onClick={signOut} className="rounded-full border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-100">Sign out</button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {!selected ? (
          <>
            <div className="flex items-end justify-between gap-3 flex-wrap">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
                <p className="text-sm text-gray-500 mt-1">{clients.length} accounts.</p>
              </div>
            </div>

            <CreateClient onCreated={load} />

            {loading ? (
              <div className="text-center text-sm text-gray-500 py-12">Loading…</div>
            ) : clients.length === 0 ? (
              <Card><p className="text-center text-sm text-gray-500 py-8">No clients yet — create one above.</p></Card>
            ) : (
              <Card title="All clients">
                <div className="divide-y divide-gray-100">
                  {clients.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className="w-full flex items-center justify-between py-3 text-left hover:bg-gray-50 -mx-2 px-2 rounded"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {c.dbaName || c.legalName || c.email || "(unnamed)"}
                        </p>
                        <p className="text-xs text-gray-500 truncate">{c.email}</p>
                      </div>
                      <div className="text-xs text-gray-400 flex-shrink-0">
                        {c.onboardingComplete ? (
                          <span className="rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 font-medium">Onboarded</span>
                        ) : (
                          <span className="rounded-full bg-amber-100 text-amber-800 px-2 py-0.5 font-medium">Onboarding</span>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            )}
          </>
        ) : (
          <ClientDetail client={selected} onBack={() => { setSelected(null); load(); }} />
        )}
      </main>
    </div>
  );
}

function CreateClient({ onCreated }) {
  const [email, setEmail] = useState("");
  const [legalName, setLegalName] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim() || !legalName.trim()) return;
    setBusy(true);
    try {
      // Use email as the doc id for pre-provisioned clients so the resolveClient
      // step in portalAuth can find them before the user first signs in.
      const id = email.trim().toLowerCase();
      await setDoc(doc(db, "clients", id), {
        email: id,
        legalName: legalName.trim(),
        createdAt: serverTimestamp(),
        onboardingComplete: false,
        provisioned: true,
      }, { merge: true });
      setEmail("");
      setLegalName("");
      onCreated?.();
    } catch (err) {
      console.error(err);
      alert("Could not create client: " + (err.message || err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <Card title="Create client">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-3 gap-2">
        <input
          type="email"
          required
          placeholder="client@company.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="text"
          required
          placeholder="Legal business name"
          value={legalName}
          onChange={(e) => setLegalName(e.target.value)}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-lg bg-emerald-600 text-white text-sm font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
        >
          {busy ? "Creating…" : "Create client"}
        </button>
      </form>
      <p className="text-[11px] text-gray-500 mt-2">
        The client can sign in at <a href="/portal" className="underline">/portal</a> using this email. They'll get a passwordless sign-in link.
      </p>
    </Card>
  );
}

function ClientDetail({ client, onBack }) {
  const [campaigns, setCampaigns] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const [c, p] = await Promise.all([
        getDocs(query(collection(db, "clients", client.id, "campaigns"), orderBy("dropDate", "desc"))).catch(() => ({ docs: [] })),
        getDocs(query(collection(db, "clients", client.id, "proofs"), orderBy("uploadedAt", "desc"))).catch(() => ({ docs: [] })),
      ]);
      setCampaigns(c.docs.map((d) => ({ id: d.id, ...d.data() })));
      setProofs(p.docs.map((d) => ({ id: d.id, ...d.data() })));
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => { load(); }, [client.id]);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="text-xs font-medium text-gray-600 hover:text-gray-900">← All clients</button>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{client.dbaName || client.legalName || client.email}</h1>
        <p className="text-sm text-gray-500 mt-1">{client.email}</p>
      </div>

      <SubscriptionPanel client={client} onChanged={onBack} />
      <AddCampaign clientId={client.id} onAdded={load} />
      <AddProof clientId={client.id} campaigns={campaigns} onAdded={load} />

      <Card title={`Campaigns (${campaigns.length})`}>
        {loading ? (
          <p className="text-xs text-gray-500 italic">Loading…</p>
        ) : campaigns.length === 0 ? (
          <p className="text-xs text-gray-500 italic">None yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {campaigns.map((c) => (
              <CampaignRow key={c.id} clientId={client.id} campaign={c} onDone={load} />
            ))}
          </div>
        )}
      </Card>

      <Card title={`Proofs (${proofs.length})`}>
        {proofs.length === 0 ? (
          <p className="text-xs text-gray-500 italic">None yet.</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {proofs.map((p) => (
              <div key={p.id} className="rounded-lg border border-gray-200 p-2">
                <a href={p.fullUrl} target="_blank" rel="noopener noreferrer">
                  <img src={p.thumbUrl} alt="" className="w-full aspect-[4/5] object-cover rounded" />
                </a>
                <p className="text-[11px] font-medium text-gray-900 mt-1 truncate">{p.version}</p>
                <p className="text-[10px] text-gray-500 truncate">{p.status}</p>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}

function AddCampaign({ clientId, onAdded }) {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [dropDate, setDropDate] = useState("");
  const [status, setStatus] = useState("design_review");
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await addDoc(collection(db, "clients", clientId, "campaigns"), {
        name,
        quantity: Number(quantity) || 0,
        dropDate: dropDate || null,
        status,
        delivered: 0,
        inTransit: 0,
        scans: 0,
        calls: 0,
        texts: 0,
        landingPageVisits: 0,
        createdAt: serverTimestamp(),
      });
      setName(""); setQuantity(""); setDropDate(""); setStatus("design_review");
      onAdded?.();
    } finally { setBusy(false); }
  };

  return (
    <Card title="Add a campaign">
      <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-5 gap-2 items-end">
        <label className="text-xs text-gray-600 md:col-span-2">
          Name
          <input value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs text-gray-600">
          Quantity
          <input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs text-gray-600">
          Drop date
          <input type="date" value={dropDate} onChange={(e) => setDropDate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <label className="text-xs text-gray-600">
          Stage
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
            <option value="design_review">Design review</option>
            <option value="scheduled">Scheduled</option>
            <option value="in_transit">In transit</option>
            <option value="delivered">Delivered</option>
          </select>
        </label>
        <button disabled={busy} className="rounded-lg bg-emerald-600 text-white text-sm font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50 md:col-span-5">
          {busy ? "Adding…" : "Add campaign"}
        </button>
      </form>
    </Card>
  );
}

function AddProof({ clientId, campaigns, onAdded }) {
  const [campaignId, setCampaignId] = useState(campaigns[0]?.id || "");
  const [version, setVersion] = useState("v1");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => { if (!campaignId && campaigns[0]?.id) setCampaignId(campaigns[0].id); }, [campaigns, campaignId]);

  const submit = async (e) => {
    e.preventDefault();
    const file = inputRef.current?.files?.[0];
    if (!file) { alert("Pick a proof file first."); return; }
    if (!campaignId) { alert("Add a campaign before uploading a proof."); return; }
    setBusy(true);
    setProgress(0);
    try {
      const safe = file.name.replace(/[^\w.\-]/g, "_");
      const path = `clients/${clientId}/proofs/${Date.now()}_${safe}`;
      const sref = ref(storage, path);
      const task = uploadBytesResumable(sref, file);
      await new Promise((resolve, reject) => {
        task.on("state_changed",
          (snap) => setProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100)),
          reject,
          resolve);
      });
      const url = await getDownloadURL(task.snapshot.ref);
      await addDoc(collection(db, "clients", clientId, "proofs"), {
        campaignId,
        version,
        notes: notes || null,
        thumbUrl: url,
        fullUrl: url,
        storagePath: path,
        status: "in_review",
        uploadedAt: serverTimestamp(),
      });
      setNotes("");
      setVersion("v1");
      inputRef.current.value = "";
      onAdded?.();
    } catch (err) {
      alert("Upload failed: " + (err.message || err));
    } finally {
      setBusy(false);
      setProgress(0);
    }
  };

  return (
    <Card title="Upload a proof">
      <form onSubmit={submit} className="space-y-2">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <label className="text-xs text-gray-600">
            Campaign
            <select value={campaignId} onChange={(e) => setCampaignId(e.target.value)} required className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm">
              <option value="">Pick a campaign…</option>
              {campaigns.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <label className="text-xs text-gray-600">
            Version
            <input value={version} onChange={(e) => setVersion(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-gray-600">
            File (image)
            <input ref={inputRef} type="file" accept="image/*" required className="mt-1 w-full text-xs" />
          </label>
        </div>
        <label className="text-xs text-gray-600 block">
          Notes to client
          <textarea rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
        </label>
        <div className="flex items-center gap-3">
          <button disabled={busy} className="rounded-lg bg-emerald-600 text-white text-sm font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50">
            {busy ? `Uploading… ${progress}%` : "Upload proof"}
          </button>
        </div>
      </form>
    </Card>
  );
}

// Admin subscription controls. Shows current status, and if the client has
// no subscription, gives the admin a plan+quantity picker to launch a
// Checkout session on their behalf. The Checkout link needs to go to the
// CLIENT, not to the admin, so we show a "copy link" button rather than
// redirecting the admin's browser.
function SubscriptionPanel({ client, onChanged }) {
  const [busy, setBusy] = useState(false);
  const [busySync, setBusySync] = useState(false);
  const [plan, setPlan] = useState("standard");
  const [quantity, setQuantity] = useState(1);
  const [checkoutUrl, setCheckoutUrl] = useState(null);
  const [error, setError] = useState(null);

  const hasSub = Boolean(client?.stripeSubscriptionId);
  const status = client?.subscriptionStatus || null;
  const priceLabel = plan === "standard" ? "$499/mo" : "$249/mo";
  const total = plan === "standard" ? 499 * quantity : 249 * quantity;

  const start = async () => {
    setBusy(true);
    setError(null);
    try {
      const fn = httpsCallable(getFunctions(), "createCheckoutSession");
      const res = await fn({
        plan,
        quantity,
        targetClientId: client.id,
        returnUrl: `${window.location.origin}/portal`,
      });
      setCheckoutUrl(res.data?.url || null);
    } catch (err) {
      setError(err.message || "Could not create checkout link.");
    } finally {
      setBusy(false);
    }
  };

  const syncNow = async () => {
    setBusySync(true);
    setError(null);
    try {
      // syncStripeSubscription requires an auth call, so it only works for
      // the signed-in user's own uid. For admin use we just tell the admin
      // to have the client sign in, or write a separate admin-side sync if
      // needed — for now this button just refreshes the page.
      onChanged?.();
    } catch (err) {
      setError(err.message || err);
    } finally {
      setBusySync(false);
    }
  };

  return (
    <Card
      title="Subscription"
      subtitle={
        hasSub
          ? `Status: ${status || "unknown"} · Plan ${client?.subscriptionPriceId || "—"} · Qty ${client?.subscriptionQuantity || 1}`
          : "No subscription linked to this client yet."
      }
      action={
        hasSub && (
          <button
            type="button"
            onClick={syncNow}
            disabled={busySync}
            className="rounded-full border border-gray-300 text-xs font-semibold text-gray-700 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
          >
            {busySync ? "…" : "Refresh"}
          </button>
        )
      }
    >
      {!hasSub && (
        <div className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 items-end">
            <label className="text-xs text-gray-600">
              Plan
              <select
                value={plan}
                onChange={(e) => setPlan(e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              >
                <option value="standard">$499/mo standard</option>
                <option value="discount">$249/mo discount</option>
              </select>
            </label>
            <label className="text-xs text-gray-600">
              Quantity
              <input
                type="number"
                min={1}
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number(e.target.value) || 1))}
                className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm"
              />
            </label>
            <div className="text-xs text-gray-600">
              <div className="text-gray-500">Recurring total</div>
              <div className="mt-1 text-lg font-bold text-emerald-700">
                ${total.toLocaleString()}
                <span className="text-xs font-medium text-gray-500"> / mo</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={start}
              disabled={busy}
              className="rounded-full bg-emerald-600 text-white text-sm font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy ? "Creating…" : "Create Checkout link"}
            </button>
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>

          {checkoutUrl && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 space-y-2">
              <p className="text-xs font-medium text-emerald-800">Checkout link ready — send it to the client to complete payment:</p>
              <input
                readOnly
                value={checkoutUrl}
                onFocus={(e) => e.target.select()}
                className="w-full rounded-md border border-emerald-300 bg-white px-3 py-2 text-xs font-mono"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => { navigator.clipboard.writeText(checkoutUrl); }}
                  className="text-xs font-semibold rounded-full bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
                >
                  Copy link
                </button>
                <a
                  href={checkoutUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-semibold rounded-full border border-emerald-300 text-emerald-800 bg-white px-3 py-1.5 hover:bg-emerald-100"
                >
                  Open link
                </a>
              </div>
            </div>
          )}
        </div>
      )}

      {hasSub && (
        <p className="text-xs text-gray-500">
          Subscription is active on Stripe. Client can manage card / cancel via the "Manage subscription" button on their Payment tab.
        </p>
      )}
    </Card>
  );
}

// Campaign row with a "Send flyer invoice" button. Calls the sendFlyerInvoice
// callable, which builds a Stripe invoice for {quantity} × $unitAmount and
// mails it via Stripe's hosted invoice page. Also records the resulting
// invoice id / URL / status back onto the campaign doc so we don't ask twice.
function CampaignRow({ clientId, campaign, onDone }) {
  const [qty, setQty] = useState(campaign.quantity || "");
  const [rate, setRate] = useState("1.00");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const send = async () => {
    setError(null);
    const quantity = Number(qty);
    const unitAmount = Math.round(Number(rate) * 100);
    if (!quantity || quantity <= 0) return setError("Enter a quantity.");
    if (!unitAmount || unitAmount <= 0) return setError("Enter a per-flyer rate.");
    setBusy(true);
    try {
      const fn = httpsCallable(getFunctions(), "sendFlyerInvoice");
      const res = await fn({
        clientId,
        campaignId: campaign.id,
        quantity,
        unitAmount,
        description: `Flyer charges — ${campaign.name || "campaign"}`,
      });
      if (res.data?.hostedInvoiceUrl) {
        window.open(res.data.hostedInvoiceUrl, "_blank");
      }
      setShowForm(false);
      onDone?.();
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not send invoice.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="py-3">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <p className="text-sm font-semibold text-gray-900">{campaign.name}</p>
            <StageChip stage={campaign.status} />
            {campaign.stripeInvoiceStatus && (
              <span className={`text-[10px] rounded-full px-1.5 py-0.5 font-medium ${
                campaign.stripeInvoiceStatus === "paid"
                  ? "bg-emerald-100 text-emerald-800"
                  : "bg-amber-100 text-amber-800"
              }`}>
                Invoice {campaign.stripeInvoiceStatus}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500">
            Drops {formatDate(campaign.dropDate)} · {(campaign.quantity || 0).toLocaleString()} flyers
            {typeof campaign.stripeInvoiceTotalCents === "number" && (
              <> · Invoiced ${(campaign.stripeInvoiceTotalCents / 100).toLocaleString()}</>
            )}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {campaign.stripeInvoiceHostedUrl && (
            <a
              href={campaign.stripeInvoiceHostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium rounded-full border border-gray-300 px-3 py-1.5 text-gray-700 hover:bg-gray-50"
            >
              View invoice
            </a>
          )}
          <button
            onClick={() => setShowForm((v) => !v)}
            className="text-xs font-semibold rounded-full bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700"
          >
            {showForm ? "Cancel" : "Send flyer invoice"}
          </button>
        </div>
      </div>

      {showForm && (
        <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 grid grid-cols-1 md:grid-cols-4 gap-2 items-end">
          <label className="text-xs text-gray-600">
            Quantity
            <input type="number" value={qty} onChange={(e) => setQty(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <label className="text-xs text-gray-600">
            $ per flyer
            <input type="number" step="0.01" value={rate} onChange={(e) => setRate(e.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm" />
          </label>
          <div className="text-xs text-gray-600 md:col-span-2">
            <div className="text-gray-500">Total</div>
            <div className="mt-1 text-lg font-bold text-emerald-700">
              ${(Number(qty || 0) * Number(rate || 0)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
          <div className="md:col-span-4 flex items-center gap-2 flex-wrap">
            <button
              onClick={send}
              disabled={busy}
              className="rounded-full bg-emerald-600 text-white text-sm font-semibold px-4 py-2 hover:bg-emerald-700 disabled:opacity-50"
            >
              {busy ? "Sending…" : "Send invoice to client"}
            </button>
            {error && <span className="text-xs text-red-600">{error}</span>}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminRoute() {
  return (
    <PortalAuthProvider>
      <AdminGate />
    </PortalAuthProvider>
  );
}
