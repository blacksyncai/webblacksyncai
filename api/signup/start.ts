/**
 * POST /api/signup/start
 *
 * Step 1 of the Front Desk Starter signup (see ../_signup.ts): finds or
 * creates the Helcim customer, then opens a HelcimPay.js "verify" session
 * that will tokenize their card and set it as their default payment
 * method — a $0 transaction, no charge yet. The browser renders that
 * session as a modal using the returned checkoutToken.
 *
 * Body:  { contactName, businessName?, email?, cellPhone? }
 *        (at least one of email/cellPhone required)
 * Reply: { configured: true, signupId, checkoutToken }  on success
 *        { configured: false }                          when Helcim
 *          credentials or DATABASE_URL aren't set yet — the frontend falls
 *          back to "we'll follow up" messaging instead of erroring
 */
import { helcimFetch, readBody, type Req, type Res } from "../_helcim.js";
import { getSignupConfig, findOrCreateCustomer, savePendingCheckout, newSignupId } from "../_signup.js";
import { getDb } from "../_db.js";

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim() ? v.trim() : undefined;
}

export default async function handler(req: Req, res: Res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const config = getSignupConfig();
  const db = getDb();
  if (!config || !db) {
    return res.status(200).json({ configured: false });
  }

  const body = readBody(req);
  const contactName = str(body.contactName);
  const email = str(body.email);
  const cellPhone = str(body.cellPhone);
  const businessName = str(body.businessName);

  if (!contactName) return res.status(400).json({ error: "Missing contactName" });
  if (!email && !cellPhone) return res.status(400).json({ error: "Provide an email or phone number" });

  try {
    const { customerCode, customerId } = await findOrCreateCustomer(config.apiToken, {
      contactName,
      businessName,
      email,
      cellPhone,
    });

    const init = await helcimFetch("/helcim-pay/initialize", config.apiToken, {
      paymentType: "verify",
      currency: config.currency,
      customerCode,
      setAsDefaultPaymentMethod: "1",
    });

    const checkoutToken = init.data?.checkoutToken;
    const secretToken = init.data?.secretToken;
    if (!init.ok || !checkoutToken || !secretToken) {
      console.error("Helcim signup initialize failed", { status: init.status, data: init.data });
      return res.status(502).json({ error: "Could not start checkout" });
    }

    const signupId = newSignupId();
    await savePendingCheckout(signupId, {
      customerCode,
      customerId,
      secretToken,
      signupDate: new Date(),
    });

    return res.status(200).json({ configured: true, signupId, checkoutToken });
  } catch (err) {
    console.error("signup/start threw", err);
    return res.status(502).json({ error: "Could not start checkout" });
  }
}
