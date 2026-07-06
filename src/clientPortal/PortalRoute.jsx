// Router-facing wrapper. Renders login or shell based on auth state, and
// auto-redirects admins to /portal-admin once they've authenticated. Admins
// can always come back to /portal manually to preview the client view.
import React, { useEffect } from "react";
import { PortalAuthProvider, usePortalAuth } from "./portalAuth";
import PortalLogin from "./PortalLogin";
import PortalShell from "./PortalShell";

function PortalGate() {
  const { user, loading, isAdmin } = usePortalAuth();

  // Sends admins over to /portal-admin the moment they finish signing in.
  // Skipped when the URL already indicates they explicitly wanted /portal
  // (e.g. ?client=1) so admins can still preview the client dashboard.
  useEffect(() => {
    if (loading || !user || !isAdmin) return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("client") === "1") return;
    window.location.replace("/portal-admin");
  }, [loading, user, isAdmin]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 text-sm text-gray-500">
        Loading…
      </div>
    );
  }
  return user ? <PortalShell /> : <PortalLogin />;
}

export default function PortalRoute() {
  return (
    <PortalAuthProvider>
      <PortalGate />
    </PortalAuthProvider>
  );
}
