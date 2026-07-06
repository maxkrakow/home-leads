// Signed-in client portal.
// Tabs: Overview, Campaigns & Proofs, Onboarding, Uploads, Skip Trace, Payment.
import React, { useState, useEffect, useMemo } from "react";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { db } from "../firebase";
import { usePortalAuth } from "./portalAuth";
import { demoClient, demoCampaigns, demoProofs, demoUploads, demoSkipTrace, demoPayment, demoInvoices } from "./demoData";
import Overview from "./tabs/Overview";
import Campaigns from "./tabs/Campaigns";
import Onboarding from "./tabs/Onboarding";
import Uploads from "./tabs/Uploads";
import SkipTrace from "./tabs/SkipTrace";
import Payment from "./tabs/Payment";

const TABS = [
  { key: "overview", label: "Overview" },
  { key: "campaigns", label: "Campaigns & Proofs" },
  { key: "onboarding", label: "Onboarding" },
  { key: "uploads", label: "Logo & Photos" },
  { key: "skiptrace", label: "Skip Trace" },
  { key: "payment", label: "Payment" },
];

export default function PortalShell() {
  const { user, client, isDemo, signOut, isAdmin } = usePortalAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [campaigns, setCampaigns] = useState([]);
  const [proofs, setProofs] = useState([]);
  const [uploads, setUploads] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingSub, setLoadingSub] = useState(true);

  // Load subcollections for real (non-demo) clients.
  useEffect(() => {
    let cancelled = false;
    async function load() {
      if (!client?.id || isDemo) {
        setLoadingSub(false);
        return;
      }
      try {
        setLoadingSub(true);
        const [c, p, u] = await Promise.all([
          getDocs(query(collection(db, "clients", client.id, "campaigns"), orderBy("dropDate", "desc"))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, "clients", client.id, "proofs"), orderBy("uploadedAt", "desc"))).catch(() => ({ docs: [] })),
          getDocs(query(collection(db, "clients", client.id, "uploads"), orderBy("uploadedAt", "desc"))).catch(() => ({ docs: [] })),
        ]);
        if (cancelled) return;
        setCampaigns(c.docs.map((d) => ({ id: d.id, ...d.data() })));
        setProofs(p.docs.map((d) => ({ id: d.id, ...d.data() })));
        setUploads(u.docs.map((d) => ({ id: d.id, ...d.data() })));

        // Live invoices from Stripe — so the Overview alert can surface
        // unpaid ones without waiting on webhook writes to Firestore.
        try {
          const listFn = httpsCallable(getFunctions(), "listStripeInvoices");
          const res = await listFn({ limit: 25 });
          if (cancelled) return;
          const live = (res.data?.invoices || []).map((inv) => ({
            id: inv.id,
            description: inv.description,
            status: inv.status,
            amountDue: inv.amountDue,
            amountPaid: inv.amountPaid,
            hostedInvoiceUrl: inv.hostedInvoiceUrl,
            invoicePdf: inv.invoicePdf,
            created: inv.created ? new Date(inv.created) : null,
            metadata: inv.metadata || null,
          }));
          setInvoices(live);
        } catch (invErr) {
          console.warn("live invoice fetch failed, will fall through to Payment tab fallback:", invErr.message);
        }
      } catch (err) {
        console.error("portal load failed:", err);
      } finally {
        if (!cancelled) setLoadingSub(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [client?.id, isDemo]);

  // Resolve which data to render — demo replaces every subcollection.
  const view = useMemo(() => {
    if (isDemo) {
      return {
        client: demoClient,
        campaigns: demoCampaigns,
        proofs: demoProofs,
        uploads: demoUploads,
        skipTrace: demoSkipTrace,
        payment: demoPayment,
        invoices: demoInvoices,
      };
    }
    return {
      client: client || {},
      campaigns,
      proofs,
      uploads,
      skipTrace: null,
      payment: null,
      invoices,
    };
  }, [isDemo, client, campaigns, proofs, uploads, invoices]);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-lg font-extrabold text-gray-900 tracking-tight">
              Untapped<span className="text-emerald-600">Homes</span>
            </a>
            <span className="hidden sm:inline text-xs text-gray-400">/ Client portal</span>
            {isDemo && (
              <span className="ml-2 rounded-full bg-amber-100 text-amber-800 text-[10px] font-semibold px-2 py-0.5">
                DEMO MODE
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <a href="/portal-admin" className="text-xs font-medium text-gray-600 hover:text-gray-900">
                Admin
              </a>
            )}
            <span className="hidden sm:inline text-xs text-gray-500">{user?.email}</span>
            <button
              onClick={signOut}
              className="text-xs font-medium rounded-full border border-gray-200 px-3 py-1.5 text-gray-700 hover:bg-gray-100"
            >
              Sign out
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-1 overflow-x-auto -mb-px">
            {TABS.map((tab) => {
              const active = activeTab === tab.key;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`whitespace-nowrap px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    active
                      ? "border-emerald-600 text-emerald-700"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {loadingSub && !isDemo && (
          <div className="text-center py-16 text-sm text-gray-500">Loading your data…</div>
        )}
        {!loadingSub && (
          <>
            {activeTab === "overview" && <Overview view={view} onNavigate={setActiveTab} />}
            {activeTab === "campaigns" && <Campaigns view={view} />}
            {activeTab === "onboarding" && <Onboarding view={view} />}
            {activeTab === "uploads" && <Uploads view={view} />}
            {activeTab === "skiptrace" && <SkipTrace view={view} />}
            {activeTab === "payment" && <Payment view={view} />}
          </>
        )}
      </main>
    </div>
  );
}
