/**
 * Untapped Homes — Stripe wiring for the client portal.
 *
 * Functions:
 *   - createCheckoutSession  (callable)  — user starts a subscription
 *   - createBillingPortalSession (callable) — user manages their sub / card
 *   - sendFlyerInvoice (callable, admin only) — one-off invoice for a campaign
 *   - stripeWebhook (HTTP) — persists subscription + invoice state back onto
 *     clients/{clientId}.payment and a payments/ subcollection
 *
 * Secrets (set with `firebase functions:secrets:set NAME`):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *
 * Env vars (baked in code below):
 *   PRICE_499  price_1TZCeNF7R4hDasepwuKgGAzs   $499/mo standard
 *   PRICE_249  price_1ThCiiF7R4hDasepIZebNvaN   $249/mo discounted
 */

const { onCall, onRequest, HttpsError } = require("firebase-functions/v2/https");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");

admin.initializeApp();
const db = admin.firestore();

const STRIPE_SECRET_KEY = defineSecret("STRIPE_SECRET_KEY");
const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_WEBHOOK_SECRET");

// Explicit CORS origin list. `cors: true` on 2nd-gen onCall doesn't cover
// production hosted domains reliably, so we pin the ones we serve from.
const CORS_ORIGINS = [
  "https://untappedhomes.com",
  "https://www.untappedhomes.com",
  "https://home-leads-6bbae.web.app",
  "https://home-leads-6bbae.firebaseapp.com",
  "http://localhost:5173",
  "http://localhost:3000",
];

// Stripe Price IDs — keep in sync with the products in Stripe dashboard.
const PRICE_IDS = {
  standard: "price_1TZCeNF7R4hDasepwuKgGAzs", // $499/mo
  discount: "price_1ThCiiF7R4hDasepIZebNvaN", // $249/mo
};

// Admin allow-list — mirrors ADMIN_EMAILS in src/firebase.js. Callable
// functions check `context.auth.token.email` against this set.
const ADMIN_EMAILS = new Set([
  "max@untappedhomes.com",
  "max@lended.ai",
  "maxkrakow@gmail.com",
]);

// Lazy stripe instance — created once per warm invocation.
let _stripe = null;
function stripeClient(secretValue) {
  if (!_stripe) {
    const Stripe = require("stripe");
    _stripe = new Stripe(secretValue, { apiVersion: "2024-06-20" });
  }
  return _stripe;
}

// Look up (or create) the Stripe Customer that maps to a portal user.
async function ensureStripeCustomer(stripe, uid, email, name) {
  const clientRef = db.collection("clients").doc(uid);
  const snap = await clientRef.get();
  const data = snap.exists ? snap.data() : {};
  if (data?.stripeCustomerId) return data.stripeCustomerId;

  const customer = await stripe.customers.create({
    email: email || undefined,
    name: name || undefined,
    metadata: { clientId: uid, source: "untapped_homes_portal" },
  });
  await clientRef.set(
    {
      stripeCustomerId: customer.id,
      email: email || null,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return customer.id;
}

// Helper: pull the client's subscription summary off Stripe and write a
// consistent shape onto their clients/{uid} doc. Used by syncStripeSubscription
// (on demand from the portal) and via webhook when Stripe pushes updates.
async function writeSubscriptionSummary(stripe, uid, subscription) {
  const first = subscription.items?.data?.[0];
  const patch = {
    stripeCustomerId: subscription.customer,
    stripeSubscriptionId: subscription.id,
    subscriptionStatus: subscription.status,
    subscriptionPriceId: first?.price?.id || null,
    subscriptionQuantity: first?.quantity || 1,
    subscriptionCurrentPeriodEnd: subscription.current_period_end
      ? admin.firestore.Timestamp.fromMillis(subscription.current_period_end * 1000)
      : null,
    cancelAtPeriodEnd: !!subscription.cancel_at_period_end,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  // Also pull the customer's default payment method inline so the Payment
  // tab can render "Visa •••• 4242" immediately without waiting for a
  // customer.updated webhook.
  try {
    const pm = await readDefaultPaymentMethod(stripe, subscription.customer, subscription.default_payment_method);
    if (pm) patch.paymentMethod = pm;
  } catch (e) {
    console.warn("readDefaultPaymentMethod failed:", e.message);
  }

  await db.collection("clients").doc(uid).set(patch, { merge: true });
  return patch;
}

// Best-effort: return { brand, last4 } for the customer's default payment
// method. Tries the subscription's own default first, then the customer's
// invoice_settings default, then the first payment method on file.
async function readDefaultPaymentMethod(stripe, customerId, subDefaultPm) {
  const summarize = (pm) => {
    if (!pm) return null;
    const c = pm.card || {};
    return { brand: c.brand || null, last4: c.last4 || null, expMonth: c.exp_month || null, expYear: c.exp_year || null };
  };

  if (subDefaultPm && typeof subDefaultPm === "string") {
    const pm = await stripe.paymentMethods.retrieve(subDefaultPm).catch(() => null);
    if (pm) return summarize(pm);
  }
  if (!customerId) return null;

  const customer = await stripe.customers.retrieve(customerId).catch(() => null);
  const invoiceDefault = customer?.invoice_settings?.default_payment_method;
  if (invoiceDefault && typeof invoiceDefault === "string") {
    const pm = await stripe.paymentMethods.retrieve(invoiceDefault).catch(() => null);
    if (pm) return summarize(pm);
  }
  if (invoiceDefault && typeof invoiceDefault === "object") {
    return summarize(invoiceDefault);
  }

  const list = await stripe.paymentMethods.list({ customer: customerId, type: "card", limit: 1 }).catch(() => null);
  if (list?.data?.[0]) return summarize(list.data[0]);
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// syncStripeSubscription — link a signed-in user to any existing Stripe
// subscription that matches their email. Called by the portal on load so
// pre-portal clients don't have to re-checkout.
// ─────────────────────────────────────────────────────────────────────────────
exports.syncStripeSubscription = onCall(
  { secrets: [STRIPE_SECRET_KEY], cors: CORS_ORIGINS },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
    const uid = request.auth.uid;
    const email = (request.auth.token.email || "").toLowerCase();
    if (!email) return { linked: false, reason: "no-email" };

    const stripe = stripeClient(STRIPE_SECRET_KEY.value());

    // Read current state first — if we already know their Stripe customer id,
    // just refresh from it instead of doing an email search.
    const clientRef = db.collection("clients").doc(uid);
    const clientSnap = await clientRef.get();
    let customerId = clientSnap.exists ? clientSnap.data()?.stripeCustomerId : null;

    if (!customerId) {
      // Look up by email. Stripe returns most-recent first; we take the one
      // with an active subscription if there is one.
      const customers = await stripe.customers.list({ email, limit: 10 });
      if (customers.data.length === 0) return { linked: false, reason: "no-customer" };

      // Prefer a customer that has any non-canceled subscription.
      let chosen = null;
      for (const c of customers.data) {
        const subs = await stripe.subscriptions.list({ customer: c.id, status: "all", limit: 10 });
        const alive = subs.data.find((s) =>
          ["active", "trialing", "past_due", "unpaid", "incomplete"].includes(s.status)
        );
        if (alive) { chosen = { customer: c, subscription: alive }; break; }
        if (!chosen) chosen = { customer: c, subscription: null };
      }
      if (!chosen) return { linked: false, reason: "no-customer" };

      customerId = chosen.customer.id;
      await clientRef.set(
        {
          stripeCustomerId: customerId,
          email,
          uid,
          claimedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      if (chosen.subscription) {
        // Backfill the subscription metadata with our clientId so webhooks
        // land in the right place going forward.
        try {
          await stripe.subscriptions.update(chosen.subscription.id, {
            metadata: { ...(chosen.subscription.metadata || {}), clientId: uid },
          });
        } catch (e) { /* ignore metadata write failure */ }
        const patch = await writeSubscriptionSummary(stripe, uid, chosen.subscription);
        // Serialize Timestamp → epoch millis for the callable response.
        return {
          linked: true,
          subscriptionId: chosen.subscription.id,
          status: chosen.subscription.status,
          patch: serializePatch(patch),
        };
      }
      return { linked: true, subscriptionId: null, status: null, patch: { stripeCustomerId: customerId } };
    }

    // Already linked — refresh from the known customer id.
    const subs = await stripe.subscriptions.list({ customer: customerId, status: "all", limit: 5 });
    const alive = subs.data.find((s) =>
      ["active", "trialing", "past_due", "unpaid", "incomplete"].includes(s.status)
    );
    if (alive) {
      const patch = await writeSubscriptionSummary(stripe, uid, alive);
      return {
        linked: true,
        subscriptionId: alive.id,
        status: alive.status,
        patch: serializePatch(patch),
      };
    }
    return { linked: true, subscriptionId: null, status: null };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// listStripeInvoices — pull invoices straight from Stripe on demand.
// Used as a bootstrap so newly-issued flyer invoices show up on the Payment
// tab even before the webhook has caught up. Auth-scoped to the caller;
// admins can pass targetClientId to look at anyone.
// ─────────────────────────────────────────────────────────────────────────────
exports.listStripeInvoices = onCall(
  { secrets: [STRIPE_SECRET_KEY], cors: CORS_ORIGINS },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
    const callerEmail = (request.auth.token.email || "").toLowerCase();
    const callerIsAdmin = ADMIN_EMAILS.has(callerEmail);
    const { targetClientId, limit: rawLimit } = request.data || {};
    const clientId = (callerIsAdmin && targetClientId) ? targetClientId : request.auth.uid;

    const snap = await db.collection("clients").doc(clientId).get();
    if (!snap.exists) return { invoices: [] };
    const customerId = snap.data()?.stripeCustomerId;
    if (!customerId) return { invoices: [] };

    const stripe = stripeClient(STRIPE_SECRET_KEY.value());
    const list = await stripe.invoices.list({
      customer: customerId,
      limit: Math.min(Math.max(Number(rawLimit) || 25, 1), 100),
    });

    const invoices = list.data.map((inv) => ({
      id: inv.id,
      description: inv.description || inv.lines?.data?.[0]?.description || "Invoice",
      status: inv.status,
      amountDue: inv.amount_due,
      amountPaid: inv.amount_paid,
      total: inv.total,
      hostedInvoiceUrl: inv.hosted_invoice_url,
      invoicePdf: inv.invoice_pdf,
      periodStart: inv.period_start ? inv.period_start * 1000 : null,
      periodEnd: inv.period_end ? inv.period_end * 1000 : null,
      created: inv.created ? inv.created * 1000 : null,
      metadata: inv.metadata || null,
    }));

    return { invoices };
  }
);

// Convert Firestore Timestamps → epoch millis so the callable can return them.
function serializePatch(patch) {
  const out = {};
  for (const [k, v] of Object.entries(patch || {})) {
    if (v && typeof v === "object" && typeof v.toMillis === "function") {
      out[k] = { _millis: v.toMillis() };
    } else if (v && typeof v === "object" && typeof v.seconds === "number") {
      out[k] = { _millis: v.seconds * 1000 + Math.round((v.nanoseconds || 0) / 1e6) };
    } else {
      out[k] = v;
    }
  }
  return out;
}

// ─────────────────────────────────────────────────────────────────────────────
// createCheckoutSession — user starts a subscription. Client-side calls always
// use the standard $499 plan (quantity 1). Admins can pass plan + quantity to
// subscribe someone on the $249 tier or for multiple flyer streams.
// ─────────────────────────────────────────────────────────────────────────────
exports.createCheckoutSession = onCall(
  { secrets: [STRIPE_SECRET_KEY], cors: CORS_ORIGINS },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
    const callerEmail = (request.auth.token.email || "").toLowerCase();
    const callerIsAdmin = ADMIN_EMAILS.has(callerEmail);

    // Two use cases:
    //   1. Client-side "Start subscription" button → subscribes the caller.
    //   2. Admin-side "Start subscription for this client" panel →
    //      subscribes the target clientId, may specify plan + quantity.
    const {
      plan: rawPlan,
      quantity: rawQuantity,
      returnUrl,
      targetClientId, // admin-only
    } = request.data || {};

    // Only admins can override the plan or quantity or target another client.
    const plan = callerIsAdmin ? (rawPlan || "standard") : "standard";
    const quantity = callerIsAdmin ? Math.max(1, Number(rawQuantity) || 1) : 1;
    const priceId = PRICE_IDS[plan];
    if (!priceId) throw new HttpsError("invalid-argument", `Unknown plan: ${plan}`);

    // Resolve which client we're subscribing for.
    let clientId = request.auth.uid;
    let subscriberEmail = callerEmail;
    if (callerIsAdmin && targetClientId) {
      const snap = await db.collection("clients").doc(targetClientId).get();
      if (!snap.exists) throw new HttpsError("not-found", "Target client not found.");
      clientId = targetClientId;
      subscriberEmail = (snap.data()?.email || "").toLowerCase() || null;
    }

    const stripe = stripeClient(STRIPE_SECRET_KEY.value());
    const customer = await ensureStripeCustomer(stripe, clientId, subscriberEmail, null);

    const successBase = returnUrl || "https://untappedhomes.com/portal";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer,
      line_items: [{ price: priceId, quantity }],
      allow_promotion_codes: true,
      success_url: `${successBase}?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${successBase}?checkout=cancel`,
      subscription_data: {
        metadata: { clientId, plan, quantity: String(quantity) },
      },
    });

    return { url: session.url };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// createBillingPortalSession — user manages card / cancels / downloads invoices
// ─────────────────────────────────────────────────────────────────────────────
exports.createBillingPortalSession = onCall(
  { secrets: [STRIPE_SECRET_KEY], cors: CORS_ORIGINS },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
    const uid = request.auth.uid;
    const returnUrl = request.data?.returnUrl || "https://untappedhomes.com/portal";

    const snap = await db.collection("clients").doc(uid).get();
    const customerId = snap.exists ? snap.data()?.stripeCustomerId : null;
    if (!customerId) {
      throw new HttpsError(
        "failed-precondition",
        "No Stripe customer yet — start a subscription first."
      );
    }

    const stripe = stripeClient(STRIPE_SECRET_KEY.value());
    const session = await stripe.billingPortal.sessions.create({
      customer: customerId,
      return_url: returnUrl,
    });
    return { url: session.url };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// sendFlyerInvoice (admin) — one-off invoice for a campaign's flyer count
// ─────────────────────────────────────────────────────────────────────────────
exports.sendFlyerInvoice = onCall(
  { secrets: [STRIPE_SECRET_KEY], cors: CORS_ORIGINS },
  async (request) => {
    if (!request.auth) throw new HttpsError("unauthenticated", "Sign in first.");
    const callerEmail = (request.auth.token.email || "").toLowerCase();
    if (!ADMIN_EMAILS.has(callerEmail)) {
      throw new HttpsError("permission-denied", "Admin only.");
    }

    const {
      clientId,
      campaignId,
      quantity,
      unitAmount = 100, // cents — $1.00 per flyer default
      description,
    } = request.data || {};
    if (!clientId || !campaignId || !quantity || quantity <= 0) {
      throw new HttpsError("invalid-argument", "clientId, campaignId, quantity required.");
    }

    const clientSnap = await db.collection("clients").doc(clientId).get();
    if (!clientSnap.exists) throw new HttpsError("not-found", "Client not found.");
    const client = clientSnap.data();
    const customerId = client.stripeCustomerId;
    if (!customerId) {
      throw new HttpsError(
        "failed-precondition",
        "Client has no Stripe customer yet — subscribe them first."
      );
    }

    const campaignSnap = await db
      .collection("clients")
      .doc(clientId)
      .collection("campaigns")
      .doc(campaignId)
      .get();
    const campaignName = campaignSnap.exists
      ? campaignSnap.data()?.name || "Flyer campaign"
      : "Flyer campaign";

    const stripe = stripeClient(STRIPE_SECRET_KEY.value());

    // Create the invoice with a description, then attach an item, then finalize
    // + send. Doing it in this order lets us set `pending_invoice_items_behavior`
    // to include only what we added, not any stray line items on the customer.
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      description: description || `Flyer charges — ${campaignName}`,
      metadata: {
        clientId,
        campaignId,
        campaignName,
        source: "untapped_homes_portal",
      },
      pending_invoice_items_behavior: "exclude",
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      invoice: invoice.id,
      quantity,
      unit_amount: unitAmount,
      currency: "usd",
      description: `${campaignName} — ${quantity.toLocaleString()} flyers @ $${(unitAmount / 100).toFixed(2)}`,
    });

    const finalized = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(finalized.id);

    // Persist a summary on the campaign so the admin UI can show status.
    if (campaignSnap.exists) {
      await campaignSnap.ref.update({
        stripeInvoiceId: finalized.id,
        stripeInvoiceStatus: finalized.status,
        stripeInvoiceHostedUrl: finalized.hosted_invoice_url,
        stripeInvoiceSentAt: admin.firestore.FieldValue.serverTimestamp(),
        stripeInvoiceTotalCents: finalized.total,
      });
    }

    return {
      invoiceId: finalized.id,
      hostedInvoiceUrl: finalized.hosted_invoice_url,
      total: finalized.total,
      status: finalized.status,
    };
  }
);

// ─────────────────────────────────────────────────────────────────────────────
// stripeWebhook — persists sub + invoice state back to Firestore
// ─────────────────────────────────────────────────────────────────────────────
exports.stripeWebhook = onRequest(
  { secrets: [STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET], cors: false, invoker: "public" },
  async (req, res) => {
    const stripe = stripeClient(STRIPE_SECRET_KEY.value());
    let event;
    try {
      const sig = req.headers["stripe-signature"];
      // req.rawBody is a Buffer provided by firebase-functions for the raw payload.
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        STRIPE_WEBHOOK_SECRET.value()
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const s = event.data.object;
          const clientId = s.metadata?.clientId || s.subscription_details?.metadata?.clientId;
          if (clientId && s.customer) {
            const patch = {
              stripeCustomerId: s.customer,
              stripeSubscriptionId: s.subscription || null,
              subscriptionStatus: s.subscription ? "active" : "incomplete",
              lastCheckoutAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db.collection("clients").doc(clientId).set(patch, { merge: true });
          }
          break;
        }

        case "customer.subscription.created":
        case "customer.subscription.updated":
        case "customer.subscription.deleted": {
          const sub = event.data.object;
          const clientId = sub.metadata?.clientId;
          if (clientId) {
            const first = sub.items?.data?.[0];
            await db.collection("clients").doc(clientId).set(
              {
                stripeSubscriptionId: sub.id,
                subscriptionStatus: sub.status,
                subscriptionPriceId: first?.price?.id || null,
                subscriptionCurrentPeriodEnd: sub.current_period_end
                  ? admin.firestore.Timestamp.fromMillis(sub.current_period_end * 1000)
                  : null,
                cancelAtPeriodEnd: !!sub.cancel_at_period_end,
                updatedAt: admin.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          break;
        }

        case "invoice.paid":
        case "invoice.finalized":
        case "invoice.payment_failed":
        case "invoice.voided":
        case "invoice.marked_uncollectible": {
          const inv = event.data.object;
          const clientId =
            inv.metadata?.clientId ||
            inv.subscription_details?.metadata?.clientId ||
            null;
          if (clientId) {
            const paymentDoc = {
              stripeInvoiceId: inv.id,
              status: inv.status,
              paid: inv.status === "paid",
              amountDue: inv.amount_due,
              amountPaid: inv.amount_paid,
              hostedInvoiceUrl: inv.hosted_invoice_url,
              periodStart: inv.period_start
                ? admin.firestore.Timestamp.fromMillis(inv.period_start * 1000)
                : null,
              periodEnd: inv.period_end
                ? admin.firestore.Timestamp.fromMillis(inv.period_end * 1000)
                : null,
              description: inv.description || null,
              metadata: inv.metadata || null,
              updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            };
            await db
              .collection("clients")
              .doc(clientId)
              .collection("payments")
              .doc(inv.id)
              .set(paymentDoc, { merge: true });
            await db.collection("clients").doc(clientId).set(
              {
                lastInvoiceStatus: inv.status,
                lastInvoiceAt: admin.firestore.FieldValue.serverTimestamp(),
              },
              { merge: true }
            );
          }
          break;
        }

        case "payment_method.attached":
        case "customer.updated": {
          const customer = event.data.object;
          // Find the client with this customer id (if any) and refresh the
          // default payment method summary.
          const q = await db
            .collection("clients")
            .where("stripeCustomerId", "==", customer.id)
            .limit(1)
            .get();
          if (!q.empty) {
            const cardId =
              customer.invoice_settings?.default_payment_method ||
              customer.default_source ||
              null;
            let brand = null;
            let last4 = null;
            if (cardId && typeof cardId === "string") {
              try {
                const pm = await stripe.paymentMethods.retrieve(cardId);
                brand = pm.card?.brand || null;
                last4 = pm.card?.last4 || null;
              } catch (e) { /* ignore */ }
            }
            await q.docs[0].ref.set(
              {
                paymentMethod: cardId ? { brand, last4 } : null,
                billingEmail: customer.email || null,
              },
              { merge: true }
            );
          }
          break;
        }

        default:
          // Ignore other events.
          break;
      }
    } catch (err) {
      console.error("Webhook handler failed:", err);
      return res.status(500).send("Handler error");
    }

    res.status(200).send("ok");
  }
);
