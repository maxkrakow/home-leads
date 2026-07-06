// Skip trace stub. Demo shows an "active" state so you can preview the layout;
// real accounts see a coming-soon panel.
import React from "react";
import { usePortalAuth } from "../portalAuth";
import { Card, Stat, formatDate } from "./uiBits";

export default function SkipTrace({ view }) {
  const { skipTrace } = view;
  const { isDemo } = usePortalAuth();

  if (!skipTrace || !isDemo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Skip Trace</h1>
          <p className="text-sm text-gray-500 mt-1">Pull contact details (phone, email) for new movers in your service area.</p>
        </div>

        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 mb-4">
              Coming soon
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Skip trace access unlocks next month</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              We're finalizing the vendor integration. Once it's live, your monthly plan will include a batch of skip
              traces so you can follow up with new movers who don't respond to the mailer.
            </p>
            <button
              disabled
              className="inline-flex items-center rounded-full bg-gray-200 text-gray-500 text-xs font-semibold px-5 py-2 cursor-not-allowed"
            >
              Request early access
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const usedPct = Math.round(((skipTrace.monthlyUsed || 0) / (skipTrace.monthlyIncluded || 1)) * 100);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Skip Trace</h1>
        <p className="text-sm text-gray-500 mt-1">Pull contact details on new movers in your area to follow up outside the mailer.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="Status" value={skipTrace.entitlementStatus === "active" ? "Active" : "Inactive"} accent="text-emerald-600" />
        <Stat label="Used this month" value={`${skipTrace.monthlyUsed || 0}`} sub={`${skipTrace.monthlyIncluded || 0} included`} accent="text-indigo-600" />
        <Stat label="Last pull" value={formatDate(skipTrace.lastPull)} accent="text-gray-900" />
      </div>

      <Card title="This month's usage">
        <div className="mb-2 flex items-center justify-between text-xs text-gray-500">
          <span>{skipTrace.monthlyUsed} / {skipTrace.monthlyIncluded}</span>
          <span>{usedPct}%</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-500" style={{ width: `${Math.min(usedPct, 100)}%` }} />
        </div>
      </Card>

      <Card
        title="Pull skip trace"
        action={
          <button className="rounded-full bg-emerald-600 text-white text-xs font-semibold px-4 py-2 hover:bg-emerald-700">
            Start a new pull
          </button>
        }
      >
        <p className="text-xs text-gray-500">Upload a list of addresses and we'll enrich each row with phone + email where available. Results downloadable as CSV.</p>
      </Card>
    </div>
  );
}
