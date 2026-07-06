// Passwordless email login. User enters email, gets a sign-in link.
import React, { useState } from "react";
import { usePortalAuth } from "./portalAuth";
import { DEMO_EMAIL } from "../firebase";

export default function PortalLogin() {
  const { sendLink, linkError } = usePortalAuth();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | sent | error
  const [error, setError] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("sending");
    setError(null);
    try {
      await sendLink(email);
      setStatus("sent");
    } catch (err) {
      console.error(err);
      setError(err.message || "Could not send the link. Try again.");
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
        <a href="/" className="block text-xl font-extrabold text-gray-900 tracking-tight text-center mb-2">
          Untapped<span className="text-emerald-600">Homes</span>
        </a>
        <p className="text-center text-sm text-gray-500 mb-8">Client portal — sign in with your email.</p>

        {status === "sent" ? (
          <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-5 text-center">
            <div className="text-emerald-700 font-semibold mb-1">Check your inbox</div>
            <p className="text-sm text-emerald-800">
              We just sent a sign-in link to <span className="font-medium">{email}</span>. Click it from this device to
              finish signing in.
            </p>
            <button
              type="button"
              onClick={() => setStatus("idle")}
              className="mt-4 text-xs text-emerald-700 underline"
            >
              Send to a different email
            </button>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Business email</label>
              <input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none"
              />
            </div>
            {(error || linkError) && (
              <p className="text-xs text-red-600">{error || linkError}</p>
            )}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-emerald-600 py-3 text-sm font-semibold text-white hover:bg-emerald-700 disabled:opacity-50"
            >
              {status === "sending" ? "Sending link…" : "Send sign-in link"}
            </button>
            <p className="text-[11px] text-gray-400 text-center">
              Preview the portal with the demo account: <button type="button" onClick={() => setEmail(DEMO_EMAIL)} className="underline">{DEMO_EMAIL}</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
