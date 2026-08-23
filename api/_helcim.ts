/**
 * Shared Helcim server-side helpers.
 *
 * The API token is read from the environment and never leaves the server —
 * HelcimPay.js requires the initialize call to be made server-side precisely so
 * the token is never exposed to the browser.
 *
 * Required environment variables (set in Vercel → Settings → Environment Variables):
 *   HELCIM_API_TOKEN      — Helcim API token. Restrict it to
 *                           "Transaction Processing: Positive Transaction" only;
 *                           General and Settings should be "No access".
 *   HELCIM_PLAN_ID_SOLO   — Recurring payment plan ID for the Solo Agent plan.
 *   HELCIM_PLAN_ID_TEAM   — Recurring payment plan ID for the Team plan.
 *
 * If any are missing the endpoints report `configured: false` and the pricing
 * page falls back to the hosted Helcim subscription links, so an unconfigured
 * deploy degrades gracefully instead of breaking checkout.
 */

export const HELCIM_API = "https://api.helcim.com/v2";

export type PlanKey = "solo" | "team";

export function isPlanKey(v: unknown): v is PlanKey {
  return v === "solo" || v === "team";
}

export type HelcimConfig = {
  apiToken: string;
  planIds: Record<PlanKey, string>;
};

/** Returns null when the deploy hasn't been given credentials yet. */
export function getConfig(): HelcimConfig | null {
  const apiToken = process.env.HELCIM_API_TOKEN;
  const solo = process.env.HELCIM_PLAN_ID_SOLO;
  const team = process.env.HELCIM_PLAN_ID_TEAM;
  if (!apiToken || !solo || !team) return null;
  return { apiToken, planIds: { solo, team } };
}

export async function helcimFetch(
  path: string,
  apiToken: string,
  body?: unknown,
  method: "GET" | "POST" = "POST",
): Promise<{ ok: boolean; status: number; data: any }> {
  const res = await fetch(`${HELCIM_API}${path}`, {
    method,
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-token": apiToken,
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => null);
  return { ok: res.ok, status: res.status, data };
}

/** Minimal shapes for Vercel's Node function signature (avoids a @vercel/node dep). */
export type Req = {
  method?: string;
  body?: any;
  headers: Record<string, string | string[] | undefined>;
};
export type Res = {
  status(code: number): Res;
  json(body: unknown): void;
  setHeader(name: string, value: string): void;
};

/** Parses a JSON body whether Vercel pre-parsed it or handed us a raw string. */
export function readBody(req: Req): Record<string, unknown> {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body as Record<string, unknown>;
}
