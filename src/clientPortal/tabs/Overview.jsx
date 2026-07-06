// Overview tab — pipeline at a glance + a "what needs your attention" callout.
import React from "react";
import { Card, Stat, StageChip, formatDate } from "./uiBits";

export default function Overview({ view, onNavigate }) {
  const { client, campaigns, proofs } = view;

  const totalDelivered = campaigns.reduce((s, c) => s + (c.delivered || 0), 0);
  const totalScans = campaigns.reduce((s, c) => s + (c.scans || 0), 0);
  const totalCalls = campaigns.reduce((s, c) => s + (c.calls || 0), 0);
  const totalTexts = campaigns.reduce((s, c) => s + (c.texts || 0), 0);
  const pendingProofs = proofs.filter((p) => p.status === "in_review");
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
