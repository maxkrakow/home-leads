// Payment stub. Demo shows an "active" state; real accounts get a placeholder.
import React from "react";
import { usePortalAuth } from "../portalAuth";
import { Card, Stat, formatDate } from "./uiBits";

export default function Payment({ view }) {
  const { payment } = view;
  const { isDemo } = usePortalAuth();

  if (!payment || !isDemo) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
          <p className="text-sm text-gray-500 mt-1">Update your billing method and see your monthly invoices.</p>
        </div>
        <Card>
          <div className="text-center py-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 text-amber-800 text-xs font-semibold px-3 py-1 mb-4">
              Coming soon
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Self-serve billing rolls out next month</h3>
            <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
              For now, contact <a href="mailto:billing@untappedhomes.com" className="text-emerald-700 underline">billing@untappedhomes.com</a> to update your card or change your plan.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Payment</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your billing method and monthly plan.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <Stat label="Current method" value={`${payment.brand} •••• ${payment.last4}`} accent="text-gray-900" />
        <Stat label="Next invoice" value={formatDate(payment.nextInvoice)} accent="text-indigo-600" />
        <Stat label="Est. next total" value={`$${(payment.currentPeriodTotal || 0).toLocaleString()}`} accent="text-emerald-600" sub={`${payment.currentPeriodFlyers.toLocaleString()} flyers @ $${payment.perFlyer}`} />
      </div>

      <Card title="Plan" subtitle="Base + per-flyer pricing.">
        <div className="rounded-xl border border-gray-100 p-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Monthly base</span>
            <span className="font-semibold text-gray-900">${payment.monthlyBase}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Per flyer</span>
            <span className="font-semibold text-gray-900">${payment.perFlyer.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-2">
            <span className="text-gray-700 font-medium">Estimated this period</span>
            <span className="font-bold text-emerald-700">${payment.currentPeriodTotal.toLocaleString()}</span>
          </div>
        </div>
      </Card>

      <Card
        title="Payment method"
        action={<button className="rounded-full bg-white border border-gray-300 text-xs font-semibold text-gray-800 px-4 py-2 hover:bg-gray-50">Update card</button>}
      >
        <p className="text-sm text-gray-700">{payment.brand} ending in <span className="font-semibold">{payment.last4}</span></p>
        <p className="text-xs text-gray-500 mt-1">Billing email: {payment.billingEmail}</p>
      </Card>
    </div>
  );
}
