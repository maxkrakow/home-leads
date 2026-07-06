// Client portal auth context.
// - Watches Firebase auth state.
// - Looks up the user's client doc by uid (or by email fallback so admins can
//   assign a doc before the client's first sign-in).
// - Exposes helpers: signInWithLink, sendLink, signOut, and isAdmin.
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  sendSignInLinkToEmail,
  signInWithEmailLink,
  isSignInWithEmailLink,
  signInAnonymously,
  signOut as fbSignOut,
} from "firebase/auth";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { auth, db, ADMIN_EMAILS, DEMO_EMAIL, DEMO_CLIENT_ID } from "../firebase";

const PortalAuthContext = createContext(null);

export function usePortalAuth() {
  return useContext(PortalAuthContext);
}

const EMAIL_STORAGE_KEY = "uh_signin_email";

export function PortalAuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [client, setClient] = useState(null); // clients/{uid} doc
  const [loading, setLoading] = useState(true);
  const [linkError, setLinkError] = useState(null);

  // Resolve the client doc for a signed-in user. Two lookups:
  //   1. clients/{uid} — the normal case after first sign-in.
  //   2. clients where email == user.email — case where the admin created
  //      a client doc before the user first logged in. If found, we copy it
  //      into clients/{uid} so subsequent reads are cheap.
  const resolveClient = useCallback(async (u) => {
    if (!u) return null;
    // Demo mode users are anonymous — no Firestore doc, no writes. Shell reads
    // demoData.js when isDemo is true.
    const inDemo = typeof window !== "undefined" && window.sessionStorage.getItem("uh_demo_mode") === "1";
    if (u.isAnonymous || inDemo) return null;

    const byUid = await getDoc(doc(db, "clients", u.uid));
    if (byUid.exists()) return { id: byUid.id, ...byUid.data() };

    // Look for an admin-provisioned doc keyed by email (that's how the admin
    // "Create client" form seeds them). Direct getDoc — no collection query,
    // so it works under owner-only Firestore rules.
    if (u.email) {
      const emailKey = u.email.toLowerCase();
      try {
        const byEmail = await getDoc(doc(db, "clients", emailKey));
        if (byEmail.exists()) {
          const seed = byEmail.data();
          await setDoc(
            doc(db, "clients", u.uid),
            {
              ...seed,
              email: emailKey,
              uid: u.uid,
              claimedAt: serverTimestamp(),
            },
            { merge: true }
          );
          return { id: u.uid, ...seed, uid: u.uid };
        }
      } catch (e) {
        // Rules may reject if the doc exists but isn't owned by this user's
        // email — that's fine, just fall through to the auto-create path.
        console.warn("email-keyed client lookup failed:", e.message);
      }
    }

    // No admin-provisioned record — auto-create a bare doc so the client can
    // fill out onboarding. Admin can promote / edit later.
    await setDoc(
      doc(db, "clients", u.uid),
      {
        uid: u.uid,
        email: u.email?.toLowerCase() || null,
        createdAt: serverTimestamp(),
        onboardingComplete: false,
      },
      { merge: true }
    );
    return { id: u.uid, uid: u.uid, email: u.email?.toLowerCase() || null };
  }, []);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u);
      if (u) {
        try {
          const c = await resolveClient(u);
          setClient(c);
        } catch (err) {
          console.error("resolveClient failed:", err);
          setClient(null);
        }
      } else {
        setClient(null);
      }
      setLoading(false);
    });
    return unsub;
  }, [resolveClient]);

  // Complete a magic-link sign-in on load. If the current URL is a Firebase
  // sign-in link, exchange it for a session.
  useEffect(() => {
    (async () => {
      if (!isSignInWithEmailLink(auth, window.location.href)) return;
      let email = window.localStorage.getItem(EMAIL_STORAGE_KEY);
      if (!email) {
        email = window.prompt("Confirm the email you used to request the sign-in link:");
      }
      if (!email) return;
      try {
        await signInWithEmailLink(auth, email, window.location.href);
        window.localStorage.removeItem(EMAIL_STORAGE_KEY);
        // Clean the URL of the link params.
        const clean = new URL(window.location.href);
        clean.searchParams.delete("apiKey");
        clean.searchParams.delete("oobCode");
        clean.searchParams.delete("mode");
        clean.searchParams.delete("continueUrl");
        clean.searchParams.delete("lang");
        window.history.replaceState({}, "", clean.toString());
      } catch (err) {
        console.error("signInWithEmailLink failed:", err);
        setLinkError(err.message || String(err));
      }
    })();
  }, []);

  const sendLink = useCallback(async (email) => {
    const normalized = email.trim().toLowerCase();
    const actionCodeSettings = {
      url: `${window.location.origin}/portal`,
      handleCodeInApp: true,
    };
    await sendSignInLinkToEmail(auth, normalized, actionCodeSettings);
    window.localStorage.setItem(EMAIL_STORAGE_KEY, normalized);
  }, []);

  const signOut = useCallback(async () => {
    try { window.sessionStorage.removeItem("uh_demo_mode"); } catch {}
    await fbSignOut(auth);
  }, []);

  // Instant demo access: signs in anonymously and flags this browser tab as
  // the demo user. The dashboard reads the flag and swaps in fake data.
  // Anonymous auth has to be enabled in the Firebase console once.
  const signInAsDemo = useCallback(async () => {
    window.sessionStorage.setItem("uh_demo_mode", "1");
    await signInAnonymously(auth);
  }, []);

  const isAdmin = Boolean(user?.email && ADMIN_EMAILS.has(user.email.toLowerCase()));
  // Demo mode is set when the user explicitly clicked "Try demo" — checked via
  // sessionStorage, or when the signed-in email literally matches DEMO_EMAIL
  // (for anyone who does provision that mailbox).
  const isDemo =
    user?.email?.toLowerCase() === DEMO_EMAIL ||
    (typeof window !== "undefined" && window.sessionStorage.getItem("uh_demo_mode") === "1");

  return (
    <PortalAuthContext.Provider
      value={{
        user,
        client,
        setClient,
        loading,
        linkError,
        sendLink,
        signInAsDemo,
        signOut,
        isAdmin,
        isDemo,
        DEMO_CLIENT_ID,
      }}
    >
      {children}
    </PortalAuthContext.Provider>
  );
}
