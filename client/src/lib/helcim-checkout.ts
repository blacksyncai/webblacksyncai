/**
 * Custom (on-site) Helcim checkout.
 *
 * Renders the card form in a HelcimPay.js modal instead of sending the buyer to
 * a hosted subscription page. Falls back to the hosted link whenever the custom
 * flow isn't available, so checkout keeps working regardless:
 *
 *   - the deploy has no HELCIM_* env vars set (`configured: false`)
 *   - the HelcimPay.js script is blocked or slow
 *   - the initialize call fails
 *
 * Only ever fails *towards* a working checkout — never strands the buyer.
 */

const HELCIM_PAY_SRC = "https://secure.helcim.app/helcim-pay/services/start.js";

declare global {
  interface Window {
    appendHelcimPayIframe?: (checkoutToken: string, allowExit?: boolean) => void;
  }
}

export type PlanKey = "solo" | "team";

let scriptPromise: Promise<void> | null = null;
function loadHelcimPay(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.appendHelcimPayIframe) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${HELCIM_PAY_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("HelcimPay.js failed")));
      return;
    }
    const s = document.createElement("script");
    s.src = HELCIM_PAY_SRC;
    s.onload = () => resolve();
    s.onerror = () => reject(new Error("HelcimPay.js failed"));
    document.head.appendChild(s);
  });
  return scriptPromise;
}

export type CheckoutResult =
  | { status: "subscribed"; subscriptionId: string }
  | { status: "cancelled" }
  | { status: "unavailable" };

type Buyer = { email: string; name?: string; company?: string; phone?: string };

/**
 * Opens the on-site checkout. Resolves "unavailable" when the caller should
 * fall back to the hosted subscription link.
 */
export async function startHelcimCheckout(
  plan: PlanKey,
  buyer: Buyer,
): Promise<CheckoutResult> {
  let checkoutToken: string;
  try {
    const res = await fetch("/api/helcim/initialize", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan }),
      signal: AbortSignal.timeout(15000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.configured || !data?.checkoutToken) return { status: "unavailable" };
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

  const cardToken = await new Promise<string | null>((resolve) => {
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
        const payload =
          typeof eventMessage === "string" ? safeParse(eventMessage) : eventMessage;
        resolve(payload?.data?.cardToken ?? payload?.cardToken ?? null);
      }
    }
    window.addEventListener("message", onMessage);
    window.appendHelcimPayIframe!(checkoutToken, true);
  });

  if (!cardToken) return { status: "cancelled" };

  try {
    const res = await fetch("/api/helcim/subscribe", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ plan, cardToken, ...buyer }),
      signal: AbortSignal.timeout(20000),
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data?.ok) throw new Error(data?.error || "subscribe failed");
    return { status: "subscribed", subscriptionId: String(data.subscriptionId) };
  } catch (err) {
    // The card was tokenized but the subscription didn't attach. Surface this
    // loudly rather than silently — it needs a human to reconcile in Helcim.
    console.error("Helcim subscribe failed after tokenization", err);
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
