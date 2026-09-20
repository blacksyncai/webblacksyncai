/**
 * On-site checkout for the /home-services $49-then-$98/month signup.
 *
 * Distinct from lib/helcim-checkout.ts (the pricing page's solo/team plan
 * checkout): that flow tokenizes a card and hands it straight to a
 * subscribe endpoint. This flow needs a customer record up front (so the
 * card verification ties to it and becomes their default payment method),
 * then a one-time $49 purchase, then a $98/month subscription activated a
 * month out — see api/_signup.ts for why those are two separate charges.
 *
 * Reuses loadHelcimPay() from helcim-checkout.ts rather than loading the
 * HelcimPay.js script twice.
 */
import { loadHelcimPay } from "./helcim-checkout";

export type SignupBuyer = { name: string; email?: string; phone?: string };

export type SignupResult =
  | { status: "complete"; activationDate: string }
  | { status: "cancelled" }
  | { status: "declined"; message: string }
  | { status: "unavailable" };

export async function runHomeServicesSignup(buyer: SignupBuyer): Promise<SignupResult> {
  let signupId: string;
  let checkoutToken: string;
  try {
    const res = await fetch("/api/signup/start", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        contactName: buyer.name,
        email: buyer.email || undefined,
        cellPhone: buyer.phone || undefined,
      }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.configured || !data?.signupId || !data?.checkoutToken) {
      return { status: "unavailable" };
    }
    signupId = data.signupId;
    checkoutToken = data.checkoutToken;
  } catch {
    return { status: "unavailable" };
  }

  try {
    await Promise.race([
      loadHelcimPay(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 12000)),
    ]);
  } catch {
    return { status: "unavailable" };
  }

  if (!window.appendHelcimPayIframe) return { status: "unavailable" };

  const verified = await new Promise<{ data: unknown; hash: string } | null>((resolve) => {
    function onMessage(event: MessageEvent) {
      if (typeof event.data !== "object" || event.data === null) return;
      const { eventName, eventStatus, eventMessage } = event.data as Record<string, any>;
      if (eventName !== `helcim-pay-js-${checkoutToken}`) return;

      if (eventStatus === "ABORTED") {
        window.removeEventListener("message", onMessage);
        resolve(null);
      }
      if (eventStatus === "SUCCESS") {
        window.removeEventListener("message", onMessage);
        const parsed = typeof eventMessage === "string" ? safeParse(eventMessage) : eventMessage;
        const helcimResponseData = parsed?.data?.data;
        const hash = parsed?.data?.hash;
        resolve(helcimResponseData && hash ? { data: helcimResponseData, hash } : null);
      }
    }
    window.addEventListener("message", onMessage);
    window.appendHelcimPayIframe!(checkoutToken, true);
  });

  if (!verified) return { status: "cancelled" };

  try {
    const res = await fetch("/api/signup/complete", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ signupId, helcimResponseData: verified.data, hash: verified.hash }),
      signal: AbortSignal.timeout(25000),
    });
    const data = await res.json().catch(() => null);
    if (res.status === 402) {
      return { status: "declined", message: data?.error || "Your card was declined." };
    }
    if (!res.ok || !data?.ok) {
      throw new Error(data?.error || "Could not complete signup");
    }
    return { status: "complete", activationDate: data.activationDate };
  } catch (err) {
    // The card was verified but finishing the signup failed server-side.
    // Surface this loudly rather than silently — it needs a human to
    // reconcile in Helcim.
    console.error("Home services signup failed after card verification", err);
    throw err;
  }
}

function safeParse(s: string): any {
  try {
    return JSON.parse(s);
  } catch {
    return null;
  }
}
