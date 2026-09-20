/**
 * Helcim "Front Desk Starter" signup flow — $49 first month, then $98/month
 * until canceled. Backs the /home-services page's step-3 payment step.
 *
 * Ported from a reference Express backend (see the PR that added this file
 * for the original) into this project's Vercel serverless functions, since
 * this repo already has the exact same HelcimPay.js pattern wired up for
 * the pricing page (see api/_helcim.ts, api/helcim/*.ts) — a second
 * standalone service would just duplicate that infrastructure and add a
 * CORS hop for no benefit.
 *
 * Two charges, deliberately decoupled:
 *   1. chargeFirstMonth()            -> ordinary one-time $49 purchase, today
 *   2. createRecurringSubscription() -> $98/month plan, activationDate set
 *      one calendar month out so it never also bills on signup day
 * The $98/month plan itself (HELCIM_FRONT_DESK_STARTER_PLAN_ID) has no
 * setup fee configured on it — the $49 is charged directly, not modeled as
 * a plan-level fee.
 *
 * Required environment variables (Vercel → Settings → Environment Variables):
 *   HELCIM_API_TOKEN                 — Helcim API token (server-side only).
 *   HELCIM_FRONT_DESK_STARTER_PLAN_ID — Recurring payment plan id ($98/mo).
 *   FIRST_MONTH_AMOUNT               — Defaults to 49.00.
 *   BILLING_CURRENCY                 — Defaults to USD.
 *   DATABASE_URL                     — Postgres connection string; without
 *                                       it the endpoints report
 *                                       `configured: false` rather than
 *                                       losing signup state to a cold start.
 */
import { eq } from "drizzle-orm";
import { randomUUID, randomBytes, createHash } from "crypto";
import { getDb } from "./_db.js";
import { helcimPendingCheckouts, helcimIdempotencyKeys } from "../shared/schema.js";
import { helcimFetch, HELCIM_API } from "./_helcim.js";

export type SignupConfig = {
  apiToken: string;
  planId: number;
  firstMonthAmount: number;
  currency: string;
};

export function getSignupConfig(): SignupConfig | null {
  const apiToken = process.env.HELCIM_API_TOKEN;
  const planId = process.env.HELCIM_FRONT_DESK_STARTER_PLAN_ID;
  if (!apiToken || !planId) return null;
  return {
    apiToken,
    planId: Number(planId),
    firstMonthAmount: Number(process.env.FIRST_MONTH_AMOUNT || 49.0),
    currency: process.env.BILLING_CURRENCY || "USD",
  };
}

// ---------------------------------------------------------------------
// Date math: activationDate must land exactly one CALENDAR MONTH after
// signup (not "30 days"), and never on the signup date itself. Clamps to
// the last valid day of the target month (Jan 31 -> Feb 28/29, not Mar 3).
// ---------------------------------------------------------------------

export function addOneCalendarMonthClamped(date: Date): Date {
  const year = date.getUTCFullYear();
  const month = date.getUTCMonth();
  const day = date.getUTCDate();

  const targetMonth = month + 1;
  const targetYear = year + Math.floor(targetMonth / 12);
  const normalizedMonth = ((targetMonth % 12) + 12) % 12;

  const lastDayOfTargetMonth = new Date(Date.UTC(targetYear, normalizedMonth + 1, 0)).getUTCDate();
  const clampedDay = Math.min(day, lastDayOfTargetMonth);

  return new Date(Date.UTC(targetYear, normalizedMonth, clampedDay));
}

export function toHelcimDateString(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function calculateActivationDateOneMonthOut(signupDate: Date = new Date()): string {
  return toHelcimDateString(addOneCalendarMonthClamped(signupDate));
}

// ---------------------------------------------------------------------
// HelcimPay.js response validation. Per Helcim's documented algorithm:
//   sha256( JSON.stringify(responseData) + secretToken ) === hash
// Proves the payload actually came from Helcim and wasn't forged/tampered
// with in transit through the browser. Never trust cardToken or any other
// field in responseData before this passes.
// ---------------------------------------------------------------------

export function validateHelcimPayResponse(responseData: unknown, hash: string, secretToken: string): boolean {
  const computedHash = createHash("sha256")
    .update(JSON.stringify(responseData) + secretToken)
    .digest("hex");
  return computedHash === hash;
}

// ---------------------------------------------------------------------
// Customer API: find-or-create so a signup retry (or a customer who
// abandons checkout and comes back) never creates a duplicate Helcim
// customer record.
// ---------------------------------------------------------------------

type CustomerInput = { contactName: string; businessName?: string; email?: string; cellPhone?: string };
type HelcimCustomer = { customerCode?: string; customer_code?: string; id?: string | number; customerId?: string | number };

async function findCustomerByContact(apiToken: string, searchTerm: string): Promise<HelcimCustomer | null> {
  const query = new URLSearchParams({ search: searchTerm, limit: "5" });
  const res = await fetch(`${HELCIM_API}/customers?${query.toString()}`, {
    headers: { accept: "application/json", "api-token": apiToken },
    signal: AbortSignal.timeout(15000),
  });
  if (!res.ok) return null;
  const data = await res.json().catch(() => null);
  const customers = Array.isArray(data) ? data : data?.data || [];
  return customers[0] || null;
}

export async function findOrCreateCustomer(
  apiToken: string,
  { contactName, businessName, email, cellPhone }: CustomerInput,
): Promise<{ customerCode: string; customerId: string }> {
  const searchTerm = email || cellPhone;
  let customer: HelcimCustomer | null = null;

  if (searchTerm) {
    customer = await findCustomerByContact(apiToken, searchTerm);
  }

  if (!customer) {
    const created = await helcimFetch("/customers", apiToken, {
      contactName,
      businessName,
      email,
      cellPhone,
    });
    if (!created.ok) {
      throw new Error(`Could not create Helcim customer (status ${created.status})`);
    }
    customer = Array.isArray(created.data) ? created.data[0] : created.data;
  }

  const customerCode = customer?.customerCode ?? customer?.customer_code;
  const customerId = customer?.id ?? customer?.customerId;
  if (!customerCode || customerId === undefined) {
    throw new Error("Helcim customer response was missing customerCode/id");
  }
  return { customerCode: String(customerCode), customerId: String(customerId) };
}

// ---------------------------------------------------------------------
// Idempotency keys, persisted per logical operation so a retry (our own
// timeout, a client double-submit) reuses the SAME key instead of risking
// a duplicate charge or subscription. Backed by Postgres instead of the
// reference implementation's JSON file, which can't survive a serverless
// cold start on a different instance.
// ---------------------------------------------------------------------

const ALPHANUMERIC = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

function randomAlphanumeric(length: number): string {
  const bytes = randomBytes(length);
  let out = "";
  for (let i = 0; i < length; i++) {
    out += ALPHANUMERIC[bytes[i] % ALPHANUMERIC.length];
  }
  return out;
}

/**
 * @param length 25 for Helcim's Subscription Create (exact-25, alphanumeric
 *   only); 25-36 for the Payment API's purchase endpoint (looser, so a UUID
 *   also works there).
 */
export async function getOrCreateIdempotencyKey(operationKey: string, length = 25): Promise<string> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");

  const existing = await db
    .select()
    .from(helcimIdempotencyKeys)
    .where(eq(helcimIdempotencyKeys.operationKey, operationKey))
    .limit(1);
  if (existing[0]) return existing[0].idempotencyKey;

  const key = randomAlphanumeric(length);
  await db
    .insert(helcimIdempotencyKeys)
    .values({ operationKey, idempotencyKey: key })
    .onConflictDoNothing({ target: helcimIdempotencyKeys.operationKey });

  const row = await db
    .select()
    .from(helcimIdempotencyKeys)
    .where(eq(helcimIdempotencyKeys.operationKey, operationKey))
    .limit(1);
  return row[0]?.idempotencyKey ?? key;
}

// ---------------------------------------------------------------------
// Pending checkouts: tracks in-flight signups between "initialize
// checkout" and "card verified callback", since HelcimPay.js round-trips
// through the browser. Rows are short-lived (HelcimPay.js checkout tokens
// expire after ~60 minutes) and deleted once a signup completes.
// ---------------------------------------------------------------------

export type PendingCheckout = {
  customerCode: string;
  customerId: string;
  secretToken: string;
  signupDate: Date;
};

export async function savePendingCheckout(signupId: string, pending: PendingCheckout): Promise<void> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  await db.insert(helcimPendingCheckouts).values({ id: signupId, ...pending });
}

export async function getPendingCheckout(signupId: string): Promise<PendingCheckout | null> {
  const db = getDb();
  if (!db) throw new Error("Database not configured");
  const rows = await db
    .select()
    .from(helcimPendingCheckouts)
    .where(eq(helcimPendingCheckouts.id, signupId))
    .limit(1);
  if (!rows[0]) return null;
  const { customerCode, customerId, secretToken, signupDate } = rows[0];
  return { customerCode, customerId, secretToken, signupDate };
}

export async function deletePendingCheckout(signupId: string): Promise<void> {
  const db = getDb();
  if (!db) return;
  await db.delete(helcimPendingCheckouts).where(eq(helcimPendingCheckouts.id, signupId));
}

export function newSignupId(): string {
  return randomUUID();
}
