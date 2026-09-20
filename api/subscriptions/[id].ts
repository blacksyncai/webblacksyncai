/**
 * DELETE /api/subscriptions/:id
 *
 * Cancels a Front Desk Starter subscription so no further $98 charges
 * occur. No self-serve UI calls this yet — it exists for support/ops use.
 */
import { helcimFetch, type Req, type Res } from "../_helcim";
import { getSignupConfig } from "../_signup";

export default async function handler(req: Req, res: Res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getSignupConfig();
  if (!config) {
    return res.status(503).json({ error: "Checkout not configured" });
  }

  const idParam = req.query?.id;
  const id = Array.isArray(idParam) ? idParam[0] : idParam;
  if (!id) {
    return res.status(400).json({ error: "Missing subscription id" });
  }

  try {
    const result = await helcimFetch(`/subscriptions/${id}`, config.apiToken, undefined, "DELETE");
    if (!result.ok) {
      console.error("subscriptions/[id] cancel failed", { status: result.status, data: result.data });
      return res.status(502).json({ error: "Could not cancel subscription" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("subscriptions/[id] cancel threw", err);
    return res.status(502).json({ error: "Could not cancel subscription" });
  }
}
