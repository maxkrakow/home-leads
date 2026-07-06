// Notification bell for the admin header. Live-listens to the `activity`
// collection, shows the last 20 events, and lets the admin mark them read.
import React, { useEffect, useMemo, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase";
import { usePortalAuth } from "./portalAuth";

const TYPE_META = {
  proof_approved:          { emoji: "✅", cls: "bg-emerald-100 text-emerald-800" },
  proof_changes_requested: { emoji: "✏️", cls: "bg-amber-100 text-amber-800" },
  invoice_paid:            { emoji: "💰", cls: "bg-emerald-100 text-emerald-800" },
  invoice_payment_failed:  { emoji: "⚠️", cls: "bg-red-100 text-red-800" },
  subscription_started:    { emoji: "🎉", cls: "bg-indigo-100 text-indigo-800" },
  subscription_canceled:   { emoji: "❌", cls: "bg-gray-100 text-gray-800" },
  upload_added:            { emoji: "📎", cls: "bg-blue-100 text-blue-800" },
  onboarding_updated:      { emoji: "📝", cls: "bg-gray-100 text-gray-800" },
  onboarding_completed:    { emoji: "🎯", cls: "bg-emerald-100 text-emerald-800" },
};

function timeAgo(v) {
  if (!v) return "";
  const d = v?.toDate ? v.toDate() : new Date(v);
  const secs = (Date.now() - d.getTime()) / 1000;
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  if (secs < 86400 * 7) return `${Math.floor(secs / 86400)}d ago`;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export default function AdminBell() {
  const { user } = usePortalAuth();
  const [open, setOpen] = useState(false);
  const [events, setEvents] = useState([]);
  const emailKey = useMemo(() => (user?.email || "").toLowerCase().replace(/[.$/[\]#]/g, "_"), [user?.email]);

  // Live subscription — refreshes as new events land, unread count updates
  // in the header without a page reload.
  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "activity"), orderBy("createdAt", "desc"), limit(20));
    const unsub = onSnapshot(q,
      (snap) => setEvents(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
      (err) => console.warn("activity snapshot failed:", err.message)
    );
    return unsub;
  }, [user]);

  const unread = events.filter((e) => !(e.readBy && e.readBy[emailKey]));

  const markAllRead = async () => {
    if (unread.length === 0) return;
    const batch = writeBatch(db);
    unread.forEach((e) => {
      batch.update(doc(db, "activity", e.id), { [`readBy.${emailKey}`]: true });
    });
    try { await batch.commit(); } catch (err) { console.warn("markAllRead failed:", err.message); }
  };

  const markOneRead = async (id) => {
    try {
      await updateDoc(doc(db, "activity", id), { [`readBy.${emailKey}`]: true });
    } catch (err) { console.warn("markOneRead failed:", err.message); }
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 h-8 w-8 flex items-center justify-center"
        aria-label="Notifications"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9a6 6 0 00-12 0v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        {unread.length > 0 && (
          <span className="absolute -top-1 -right-1 h-4 min-w-[16px] px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread.length > 9 ? "9+" : unread.length}
          </span>
        )}
      </button>

      {open && (
        <>
          {/* click-away overlay */}
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Recent activity</h3>
                <p className="text-[11px] text-gray-500">
                  {unread.length > 0 ? `${unread.length} unread` : "You're caught up"}
                </p>
              </div>
              {unread.length > 0 && (
                <button
                  onClick={markAllRead}
                  className="text-[11px] font-medium text-emerald-700 hover:text-emerald-900"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto divide-y divide-gray-100">
              {events.length === 0 ? (
                <p className="text-xs text-gray-400 italic text-center py-8">No activity yet.</p>
              ) : (
                events.map((e) => {
                  const meta = TYPE_META[e.type] || { emoji: "🔔", cls: "bg-gray-100 text-gray-800" };
                  const isUnread = !(e.readBy && e.readBy[emailKey]);
                  return (
                    <button
                      key={e.id}
                      type="button"
                      onClick={() => markOneRead(e.id)}
                      className={`w-full text-left px-4 py-3 flex gap-3 items-start hover:bg-gray-50 transition-colors ${isUnread ? "bg-emerald-50/40" : ""}`}
                    >
                      <span className={`flex-shrink-0 rounded-full h-8 w-8 flex items-center justify-center text-sm ${meta.cls}`}>
                        {meta.emoji}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium text-gray-900 truncate">{e.title}</p>
                          <span className="flex-shrink-0 text-[10px] text-gray-400">{timeAgo(e.createdAt)}</span>
                        </div>
                        {e.clientName && (
                          <p className="text-[11px] text-gray-500 truncate">{e.clientName}</p>
                        )}
                        {e.message && (
                          <p className="text-[11px] text-gray-600 mt-0.5 line-clamp-2">{e.message}</p>
                        )}
                      </div>
                      {isUnread && <span className="flex-shrink-0 h-2 w-2 rounded-full bg-emerald-500 mt-1.5" aria-hidden="true" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
