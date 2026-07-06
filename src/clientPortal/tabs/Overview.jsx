// Overview tab — pipeline at a glance + a "what needs your attention" callout.
import React from "react";
import { Card, Stat, StageChip, formatDate } from "./uiBits";

export default function Overview({ view, onNavigate }) {
  const { client, campaigns, proofs, invoices = [] } = view;

  const totalDelivered = campaigns.reduce((s, c) => s + (c.delivered || 0), 0);
  const totalScans = campaigns.reduce((s, c) => s + (c.scans || 0), 0);
  const totalCalls = campaigns.reduce((s, c) => s + (c.calls || 0), 0);
  const totalTexts = campaigns.reduce((s, c) => s + (c.texts || 0), 0);
  const pendingProofs = proofs.filter((p) => p.status === "in_review");
  // Unpaid Stripe invoices — "open" is the state where a hosted invoice has
  // been sent but not paid yet. past_due is also worth flagging.
  const unpaidInvoices = (invoices || []).filter((i) => ["open", "past_due", "uncollectible"].includes(i.status));
  const nextCampaign = [...campaigns].sort((a, b) => new Date(a.dropDate || 0) - new Date(b.dropDate || 0)).find((c) => c.status !== "delivered");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Welcome{client?.contactName ? `, ${client.contactName.split(" ")[0]}` : ""}.
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          {client?.dbaName || client?.legalName || "Your business"} · here's the campaign snapshot.
        </p>
      </div>

      {pendingProofs.length > 0 && (
        <Card
          title="Design proofs awaiting your review"
          subtitle="You have flyer proofs waiting for approval — approve or request changes to keep the drop on schedule."
          action={
            <button
              onClick={() => onNavigate("campaigns")}
              className="rounded-full bg-amber-600 text-white text-xs font-semibold px-4 py-2 hover:bg-amber-700"
            >
              Review {pendingProofs.length} proof{pendingProofs.length === 1 ? "" : "s"}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {pendingProofs.slice(0, 2).map((p) => (
              <div key={p.id} className="rounded-lg border border-amber-200 bg-amber-50 p-3 flex gap-3 items-start">
                <img src={p.thumbUrl} alt="" className="w-16 h-20 object-cover rounded" />
                <div className="min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">Proof {p.version}</p>
                  <p className="text-xs text-gray-500 truncate">{p.notes || "Awaiting your OK"}</p>
                  <p className="text-[10px] text-gray-400 mt-1">Uploaded {formatDate(p.uploadedAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {unpaidInvoices.length > 0 && (
        <Card
          title={`Invoice${unpaidInvoices.length === 1 ? "" : "s"} awaiting payment`}
          subtitle="Pay these to keep your campaigns moving. Opens Stripe's hosted invoice page."
          action={
            <button
              onClick={() => onNavigate("payment")}
              className="rounded-full bg-rose-600 text-white text-xs font-semibold px-4 py-2 hover:bg-rose-700"
            >
              View {unpaidInvoices.length} invoice{unpaidInvoices.length === 1 ? "" : "s"}
            </button>
          }
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {unpaidInvoices.slice(0, 2).map((i) => (
              <a
                key={i.id}
                href={i.hostedInvoiceUrl || "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-rose-200 bg-rose-50 p-3 flex gap-3 items-start hover:bg-rose-100 transition-colors"
              >
                <div className="flex-shrink-0 w-16 h-20 rounded bg-white border border-rose-200 flex items-center justify-center">
                  <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-gray-900 truncate flex-1">{i.description || "Invoice"}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full font-semibold bg-rose-200 text-rose-800 flex-shrink-0">
                      {i.status === "past_due" ? "PAST DUE" : "UNPAID"}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-rose-700">
                    ${((i.amountDue || 0) / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-1">Sent {formatDate(i.created)}</p>
                </div>
              </a>
            ))}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Stat label="Delivered" value={totalDelivered.toLocaleString()} sub="Mailers dropped, all-time" />
        <Stat label="QR scans" value={totalScans.toLocaleString()} accent="text-indigo-600" sub="From flyer landing pages" />
        <Stat label="Calls" value={totalCalls.toLocaleString()} accent="text-blue-600" sub="Tracked to campaign numbers" />
        <Stat label="Texts" value={totalTexts.toLocaleString()} accent="text-purple-600" sub="Inbound to tracked numbers" />
      </div>

      <Card title="Next drop" subtitle="Upcoming campaign schedule and progress.">
        {nextCampaign ? (
          <div className="rounded-xl border border-gray-100 p-4 flex flex-wrap items-center gap-4 justify-between">
            <div className="min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StageChip stage={nextCampaign.status} />
                <p className="text-sm font-semibold text-gray-900 truncate">{nextCampaign.name}</p>
              </div>
              <p className="text-xs text-gray-500">
                {(nextCampaign.quantity || 0).toLocaleString()} flyers · drops {formatDate(nextCampaign.dropDate)}
              </p>
            </div>
            <button onClick={() => onNavigate("campaigns")} className="text-xs font-semibold text-emerald-700 hover:text-emerald-900">
              Open campaign →
            </button>
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No upcoming drops scheduled yet.</p>
        )}
      </Card>

      <Card title="Complete your onboarding" subtitle="The more we know about your brand and offer, the better your flyer performs.">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-gray-600">
            {client?.onboardingComplete ? (
              <span className="inline-flex items-center gap-1 text-emerald-700 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500" /> Onboarding complete
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-amber-700 font-medium">
                <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" /> Onboarding in progress
              </span>
            )}
          </div>
          <button
            onClick={() => onNavigate("onboarding")}
            className="text-xs font-semibold rounded-full bg-gray-900 text-white px-4 py-2 hover:bg-gray-800"
          >
            Open onboarding form
          </button>
        </div>
      </Card>
    </div>
  );
}
