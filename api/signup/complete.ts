/**
 * POST /api/signup/complete
 *
 * Step 2 of the Front Desk Starter signup: called once the frontend relays
 * the HelcimPay.js transaction response back. Validates the response hash
 * (proves it actually came from Helcim, not a tampered postMessage), then:
 *   1. charges the $49 first month as an ordinary one-time purchase
 *   2. only if that's approved, creates the $98/month subscription with
 *      activationDate one calendar month out
 *
 * Body:  { signupId, helcimResponseData, hash }
 * Reply: { ok: true, activationDate, subscriptionId } | { error }
 */
import { helcimFetch, readBody, type Req, type Res } from "../_helcim";
import {
  getSignupConfig,
  getPendingCheckout,
  deletePendingCheckout,
  getOrCreateIdempotencyKey,
  calculateActivationDateOneMonthOut,
  validateHelcimPayResponse,
} from "../_signup";
import { getDb } from "../_db";

function clientIp(req: Req): string | undefined {
  const forwarded = req.headers["x-forwarded-for"];
  const value = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  if (value) return value.split(",")[0].trim();
  const real = req.headers["x-real-ip"];
  return Array.isArray(real) ? real[0] : real;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getSignupConfig();
  const db = getDb();
  if (!config || !db) {
    return res.status(503).json({ error: "Checkout not configured" });
  }

  const body = readBody(req);
  const signupId = typeof body.signupId === "string" ? body.signupId : undefined;
  const helcimResponseData = body.helcimResponseData;
  const hash = typeof body.hash === "string" ? body.hash : undefined;

  if (!signupId || !helcimResponseData || !hash) {
    return res.status(400).json({ error: "Missing signupId, helcimResponseData, or hash" });
  }

  const ipAddress = clientIp(req);
  if (!ipAddress) {
    return res.status(400).json({ error: "Could not determine client IP" });
  }

  try {
    const pending = await getPendingCheckout(signupId);
    if (!pending) {
      return res.status(400).json({ error: "This checkout has expired or is invalid. Please start again." });
    }

    if (!validateHelcimPayResponse(helcimResponseData, hash, pending.secretToken)) {
      console.error("signup/complete: hash validation failed", { signupId });
      return res.status(400).json({ error: "Could not verify payment response" });
    }

    const cardToken = (helcimResponseData as Record<string, unknown>).cardToken;
    if (typeof cardToken !== "string" || !cardToken) {
      return res.status(400).json({ error: "Payment response did not include a card token" });
    }

    // 1) $49 first month — ordinary one-time purchase, fully decoupled from
    // the plan's own recurring billing.
    const chargeKey = await getOrCreateIdempotencyKey(`first-month-charge:${signupId}`, 32);
    const purchase = await helcimFetch(
      "/payment/purchase",
      config.apiToken,
      {
        ipAddress,
        currency: config.currency,
        amount: config.firstMonthAmount,
        cardData: { cardToken },
        customerCode: pending.customerCode,
        invoiceNumber: `FIRST-MONTH-${signupId}`,
        ecommerce: true,
      },
      "POST",
      chargeKey,
    );

    const chargeStatus = purchase.data?.status;
    const approved = chargeStatus ? String(chargeStatus).toUpperCase() === "APPROVED" : purchase.ok;
    if (!purchase.ok || !approved) {
      console.error("signup/complete: first-month charge not approved", {
        signupId,
        status: purchase.status,
        data: purchase.data,
      });
      return res.status(402).json({ error: "Your card was declined. Please try a different card." });
    }

    // 2) $98/month subscription, activationDate one calendar month out so
    // it never also bills on signup day.
    const activationDate = calculateActivationDateOneMonthOut(pending.signupDate);
    const subKey = await getOrCreateIdempotencyKey(`subscription-create:${signupId}`, 25);
    const subscription = await helcimFetch(
      "/subscriptions",
      config.apiToken,
      {
        subscriptions: [
          {
            customerId: pending.customerId,
            paymentPlanId: config.planId,
            activationDate,
          },
        ],
      },
      "POST",
      subKey,
    );

    const created = Array.isArray(subscription.data) ? subscription.data[0] : subscription.data;
    const subscriptionId = created?.subscriptionId ?? created?.id;

    if (!subscription.ok || !subscriptionId) {
      // The $49 charge succeeded but the subscription didn't attach. This
      // needs a human to reconcile in Helcim — surface it loudly.
      console.error("signup/complete: subscription create failed after successful charge", {
        signupId,
        chargeStatus: purchase.data,
        status: subscription.status,
        data: subscription.data,
      });
      return res.status(502).json({
        error:
          "Your $49 payment went through, but we couldn't finish setting up your subscription. Our team has been notified — we'll follow up shortly.",
      });
    }

    await deletePendingCheckout(signupId);

    return res.status(200).json({ ok: true, activationDate, subscriptionId: String(subscriptionId) });
  } catch (err) {
    console.error("signup/complete threw", err);
    return res.status(502).json({ error: "Something went wrong completing your signup. Please try again." });
  }
}
