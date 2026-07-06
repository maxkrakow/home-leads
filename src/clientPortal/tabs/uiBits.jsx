// Small shared UI atoms for the portal tabs. Keeps each tab file focused.
import React from "react";

export function Card({ title, subtitle, children, action, className = "" }) {
  return (
    <section className={`bg-white rounded-2xl border border-gray-100 shadow-sm p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="min-w-0">
            {title && <h3 className="text-base font-semibold text-gray-900">{title}</h3>}
            {subtitle && <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>}
          </div>
          {action && <div className="flex-shrink-0">{action}</div>}
        </div>
      )}
      {children}
    </section>
  );
}

export function Stat({ label, value, sub, accent = "text-emerald-600" }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <p className="text-[11px] uppercase tracking-wider text-gray-500 font-semibold">{label}</p>
      <p className={`mt-1 text-2xl font-extrabold leading-none ${accent}`}>{value}</p>
      {sub && <p className="mt-1 text-xs text-gray-500 truncate">{sub}</p>}
    </div>
  );
}

export function StageChip({ stage }) {
  const map = {
    delivered: "bg-emerald-100 text-emerald-800",
    in_transit: "bg-blue-100 text-blue-800",
    design_review: "bg-amber-100 text-amber-800",
    scheduled: "bg-indigo-100 text-indigo-800",
    canceled: "bg-red-100 text-red-800",
  };
  const cls = map[stage] || "bg-gray-100 text-gray-800";
  return <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${cls}`}>{stage.replace(/_/g, " ")}</span>;
}

export function formatDate(v) {
  if (!v) return "—";
  const d = v?.toDate ? v.toDate() : new Date(v);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
