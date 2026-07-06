// Router-facing wrapper. Renders login or shell based on auth state.
import React from "react";
import { PortalAuthProvider, usePortalAuth } from "./portalAuth";
import PortalLogin from "./PortalLogin";
import PortalShell from "./PortalShell";

function PortalGate() {
  const { user, loading } = usePortalAuth();
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
