// Campaign list + inline proof approvals.
import React, { useState } from "react";
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { usePortalAuth } from "../portalAuth";
import { Card, Stat, StageChip, formatDate } from "./uiBits";
import { logActivity } from "../activity";

export default function Campaigns({ view }) {
  const { client, campaigns, proofs } = view;
  const { isDemo } = usePortalAuth();

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns & Proofs</h1>
          <p className="text-sm text-gray-500 mt-1">Every drop we've built for you plus flyer proofs awaiting review.</p>
        </div>
      </div>

      {campaigns.length === 0 ? (
        <Card>
          <p className="text-sm text-gray-500 italic text-center py-10">
            No campaigns yet. As soon as we build your first drop it will show up here.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {campaigns.map((c) => {
            const cProofs = proofs.filter((p) => p.campaignId === c.id);
            const delivered = c.delivered || 0;
            const inTransit = c.inTransit || 0;
            const target = (c.quantity || delivered + inTransit) || 1;
            const pctDelivered = Math.round((delivered / target) * 100);
            return (
              <Card key={c.id} title={c.name} subtitle={`Drops ${formatDate(c.dropDate)} · ${(c.quantity || 0).toLocaleString()} flyers`} action={<StageChip stage={c.status} />}>
                {/* Progress bar */}
                <div className="mb-4">
                  <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
                    <span>{delivered.toLocaleString()} delivered</span>
                    <span>{inTransit.toLocaleString()} in transit</span>
                    <span>Target {(c.quantity || 0).toLocaleString()}</span>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500" style={{ width: `${Math.min(pctDelivered, 100)}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-4">
                  <Stat label="QR scans" value={(c.scans || 0).toLocaleString()} accent="text-indigo-600" />
                  <Stat label="Calls" value={(c.calls || 0).toLocaleString()} accent="text-blue-600" />
                  <Stat label="Texts" value={(c.texts || 0).toLocaleString()} accent="text-purple-600" />
                  <Stat label="Landing hits" value={(c.landingPageVisits || 0).toLocaleString()} accent="text-gray-900" />
                  <Stat label="Response rate" value={c.responseRatePct != null ? `${c.responseRatePct}%` : "—"} accent="text-emerald-600" />
                </div>

                {c.zipCodes?.length > 0 && (
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-1">ZIPs</p>
                    <div className="flex flex-wrap gap-1">
                      {c.zipCodes.map((z) => (
                        <span key={z} className="text-[11px] rounded-full bg-gray-100 text-gray-700 px-2 py-0.5">{z}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-gray-100 pt-4">
                  <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold mb-2">Proofs for this campaign</p>
                  {cProofs.length === 0 ? (
                    <p className="text-xs text-gray-400 italic">No proofs uploaded yet.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {cProofs.map((p) => (
                        <ProofRow key={p.id} proof={p} clientId={client.id} clientName={client.dbaName || client.legalName || client.email || "Client"} disabled={isDemo} />
                      ))}
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ProofRow({ proof, clientId, clientName, disabled }) {
  const [status, setStatus] = useState(proof.status);
  const [saving, setSaving] = useState(false);
  const [comment, setComment] = useState("");

  const update = async (newStatus) => {
    if (disabled) {
      setStatus(newStatus);
      return;
    }
    setSaving(true);
    try {
      await updateDoc(doc(db, "clients", clientId, "proofs", proof.id), {
        status: newStatus,
        clientComment: comment || null,
        clientDecisionAt: serverTimestamp(),
      });
      setStatus(newStatus);
      // Fire an admin notification. Non-fatal.
      logActivity({
        type: newStatus === "approved" ? "proof_approved" : "proof_changes_requested",
        clientId,
        clientName,
        title:
          newStatus === "approved"
            ? `${clientName} approved proof ${proof.version || ""}`.trim()
            : `${clientName} requested changes on proof ${proof.version || ""}`.trim(),
        message: comment || (newStatus === "approved" ? "Ready for print." : "Awaiting revisions."),
        href: "/portal-admin",
        meta: { proofId: proof.id, campaignId: proof.campaignId, comment: comment || null },
      });
    } catch (err) {
      console.error(err);
      alert("Could not update this proof. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const isApproved = status === "approved";
  const isRejected = status === "changes_requested";

  return (
    <div className={`rounded-xl border p-3 flex gap-3 items-start ${isApproved ? "border-emerald-300 bg-emerald-50" : isRejected ? "border-red-300 bg-red-50" : "border-gray-200 bg-white"}`}>
      <a href={proof.fullUrl} target="_blank" rel="noopener noreferrer" className="flex-shrink-0">
        <img src={proof.thumbUrl} alt="" className="w-24 h-32 object-cover rounded-lg border border-gray-200" />
      </a>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-sm font-semibold text-gray-900">Proof {proof.version}</p>
          <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${isApproved ? "bg-emerald-200 text-emerald-800" : isRejected ? "bg-red-200 text-red-800" : "bg-amber-200 text-amber-800"}`}>
            {isApproved ? "Approved" : isRejected ? "Changes requested" : "Awaiting your OK"}
          </span>
        </div>
        {proof.notes && <p className="text-xs text-gray-500 mb-2">{proof.notes}</p>}
        {!isApproved && (
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Any notes for the designer? (optional)"
            rows={2}
            className="w-full text-xs rounded-md border border-gray-200 px-2 py-1.5 mb-2"
          />
        )}
        <div className="flex items-center gap-2">
          {!isApproved && (
            <button
              onClick={() => update("approved")}
              disabled={saving}
              className="text-xs font-semibold rounded-full bg-emerald-600 text-white px-3 py-1.5 hover:bg-emerald-700 disabled:opacity-50"
            >
              {saving ? "…" : "Approve for print"}
            </button>
          )}
          {!isRejected && (
            <button
              onClick={() => update("changes_requested")}
              disabled={saving}
              className="text-xs font-medium rounded-full bg-white border border-gray-300 text-gray-700 px-3 py-1.5 hover:bg-gray-50 disabled:opacity-50"
            >
              Request changes
            </button>
          )}
        </div>
        <p className="text-[10px] text-gray-400 mt-2">Uploaded {formatDate(proof.uploadedAt)}</p>
      </div>
    </div>
  );
}
