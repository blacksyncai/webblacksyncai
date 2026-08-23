/**
 * POST /api/helcim/initialize
 *
 * Starts a HelcimPay.js checkout session so the card form can render in a modal
 * on our own site. Helcim requires this call to come from a server — sending it
 * from the browser both leaks the API token and fails CORS.
 *
 * Body:  { plan: "solo" | "team" }
 * Reply: { configured: true, checkoutToken }        on success
 *        { configured: false }                      when env vars aren't set,
 *                                                   which tells the client to
 *                                                   use the hosted Helcim link
 */
import { getConfig, helcimFetch, isPlanKey, readBody, type Req, type Res } from "../_helcim";

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getConfig();
  if (!config) {
    // Not an error — the deploy simply hasn't been given credentials yet.
    return res.status(200).json({ configured: false });
  }

  const body = readBody(req);
  if (!isPlanKey(body.plan)) {
    return res.status(400).json({ error: "Unknown plan" });
  }

  try {
    // "verify" tokenizes the card without charging it; the recurring plan then
    // drives the actual billing, so we never hardcode an amount here.
    const { ok, status, data } = await helcimFetch("/helcim-pay/initialize", config.apiToken, {
      paymentType: "verify",
      amount: 0,
      currency: "USD",
      language: "en",
    });

    if (!ok || !data?.checkoutToken) {
      console.error("Helcim initialize failed", { status, data });
      return res.status(502).json({ error: "Could not start checkout" });
    }

    // Only the checkoutToken goes to the browser. secretToken stays server-side.
    return res.status(200).json({ configured: true, checkoutToken: data.checkoutToken });
  } catch (err) {
    console.error("Helcim initialize threw", err);
    return res.status(502).json({ error: "Could not start checkout" });
  }
}
