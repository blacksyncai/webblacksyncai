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
  // Wraps the entire handler, not just the network-call section below.
  // Nothing in here — including a bug in a response branch itself — should
  // ever be able to escape as an unhandled crash (a real prior incident:
  // Helcim returning a 400 here was logged correctly but then produced a
  // raw platform 502 instead of the clean JSON this function intends to
  // always send).
  try {
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

      // "verify" still requires `amount` in the request body even though it
      // doesn't charge anything — 0 here, same as the pricing page's
      // initialize call (api/helcim/initialize.ts). Omitting it is a 400
      // from Helcim ("Missing required data amount"), which is what caused
      // the crash referenced above.
      const init = await helcimFetch("/helcim-pay/initialize", config.apiToken, {
        paymentType: "verify",
        amount: 0,
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
  } catch (outerErr) {
    console.error("signup/start: unhandled error escaped inner handling", outerErr);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
