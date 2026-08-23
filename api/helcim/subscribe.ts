/**
 * POST /api/helcim/subscribe
 *
 * Runs after the HelcimPay.js modal returns a card token. Creates the customer
 * in Helcim (or reuses one) and subscribes them to the recurring plan.
 *
 * The plan IDs come from the environment rather than the request body — the
 * browser only says "solo" or "team", so a caller can't point the subscription
 * at an arbitrary or cheaper plan.
 *
 * Body:  { plan, cardToken, email, name?, company?, phone? }
 * Reply: { ok: true, subscriptionId } | { error }
 */
import { getConfig, helcimFetch, isPlanKey, readBody, type Req, type Res } from "../_helcim";

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getConfig();
  if (!config) return res.status(503).json({ error: "Checkout not configured" });

  const body = readBody(req);
  const plan = body.plan;
  const cardToken = str(body.cardToken);
  const email = str(body.email);

  if (!isPlanKey(plan)) return res.status(400).json({ error: "Unknown plan" });
  if (!cardToken) return res.status(400).json({ error: "Missing card token" });
  if (!email) return res.status(400).json({ error: "Missing email" });

  const name = str(body.name);
  const company = str(body.company);
  const phone = str(body.phone);

  try {
    // 1) Customer — Helcim keys these by customerCode.
    const customerRes = await helcimFetch("/customers", config.apiToken, {
      contactName: name || email,
      businessName: company || name || email,
      email,
      ...(phone ? { cellPhone: phone } : {}),
    });

    const customerCode =
      customerRes.data?.customerCode ?? customerRes.data?.customer?.customerCode;

    if (!customerRes.ok || !customerCode) {
      console.error("Helcim customer create failed", {
        status: customerRes.status,
        data: customerRes.data,
      });
      return res.status(502).json({ error: "Could not create customer" });
    }

    // 2) Subscription against the server-held plan ID.
    const subRes = await helcimFetch("/subscriptions", config.apiToken, {
      subscriptions: [
        {
          customerCode,
          paymentPlanId: Number(config.planIds[plan]),
          paymentMethod: "card",
          cardToken,
          dateActivated: new Date().toISOString().slice(0, 10),
        },
      ],
    });

    const created = Array.isArray(subRes.data) ? subRes.data[0] : subRes.data;
    const subscriptionId = created?.subscriptionId ?? created?.id;

    if (!subRes.ok || !subscriptionId) {
      console.error("Helcim subscription create failed", {
        status: subRes.status,
        data: subRes.data,
      });
      return res.status(502).json({ error: "Could not start subscription" });
    }

    return res.status(200).json({ ok: true, subscriptionId });
  } catch (err) {
    console.error("Helcim subscribe threw", err);
    return res.status(502).json({ error: "Could not start subscription" });
  }
}
