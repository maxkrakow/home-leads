// Tiny helper: write a doc to activity/ that shows up in the admin bell.
// Any client-side action calls this after its main write succeeds. Failures
// are swallowed so a broken activity write can't take down the primary flow.
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

export async function logActivity({
  type,           // 'proof_approved' | 'proof_changes_requested' | 'upload_added' | 'onboarding_updated' | ...
  clientId,
  clientName,    // display string — brokerage/DBA/email
  title,          // short one-liner shown in the bell
  message,        // optional detail line
  href,           // relative URL for the click target
  meta,           // arbitrary payload
}) {
  try {
    await addDoc(collection(db, "activity"), {
      type,
      clientId: clientId || null,
      clientName: clientName || null,
      title: title || "Portal activity",
      message: message || null,
      href: href || null,
      meta: meta || null,
      createdAt: serverTimestamp(),
      readBy: {},
    });
  } catch (err) {
    // Non-fatal — log and move on.
    console.warn("logActivity failed:", err?.message || err);
  }
}
