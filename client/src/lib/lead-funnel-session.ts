/**
 * Real Estate Lead Generation funnel — session persistence, analytics, and
 * lead submission. This is the DOM/network-touching half of the funnel;
 * client/src/lib/lead-funnel-engine.ts is the pure half.
 *
 * Infrastructure notes (read before changing how this submits data):
 *
 * - This site has no working server-side API in production and no database.
 *   Every existing form (contact, book-demo, enterprise, careers) submits by
 *   POSTing to a fixed set of URLs that `apiRequest()` in queryClient.ts
 *   intercepts client-side and fans out to a GoHighLevel webhook + Web3Forms
 *   — "static-host friendly, no backend" by design (see that file's
 *   comments). This funnel follows the same pattern rather than inventing a
 *   new database-backed endpoint that would silently 405 the way the Helcim
 *   checkout endpoints currently do.
 * - There is no analytics SDK (no GA4/GTM snippet) and no cookie-consent
 *   platform installed anywhere on the site today. `track()` below pushes to
 *   `window.dataLayer`, creating it if absent — the standard GTM contract.
 *   If/when GTM or GA4 is installed, every event this funnel already fired
 *   becomes usable with zero code changes; until then this is an inert,
 *   harmless queue.
 * - Because a webhook call here becomes an email to admin@blacksync.network
 *   and a GHL contact (not a silent database write), this does NOT fire a
 *   webhook on every multiple-choice click — that would be 13+ emails per
 *   visitor. Answers are saved to localStorage immediately (as required);
 *   the webhook fires at real lead-capture milestones (first name, email,
 *   phone, completion) and each call sends the FULL answer snapshot + the
 *   same sessionId, so a CRM contact is updated in place rather than
 *   duplicated, and an abandoned-then-resumed session stays one lead.
 */
import { apiRequest } from "@/lib/queryClient";
import type { Answers, ContactInfo, StepId } from "@/lib/lead-funnel-engine";
import { scoreLead } from "@/lib/lead-funnel-engine";

const STORAGE_KEY = "bs_re_leadgen_session_v1";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

export type FunnelSession = {
  sessionId: string;
  createdAt: number;
  updatedAt: number;
  expiresAt: number;
  landingUrl: string;
  referrer: string;
  utm: {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    gclid?: string;
    fbclid?: string;
  };
  answers: Answers;
  contact: ContactInfo;
  currentStepIndex: number;
  status: "in_progress" | "contact_captured" | "completed";
  /** Milestones already sent to the webhook, so a re-render never double-fires one. */
  submittedMilestones: string[];
};

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `re-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function captureAttribution() {
  let utm: FunnelSession["utm"] = {};
  let landingUrl = "";
  let referrer = "";
  try {
    const params = new URLSearchParams(window.location.search);
    utm = {
      source: params.get("utm_source") || undefined,
      medium: params.get("utm_medium") || undefined,
      campaign: params.get("utm_campaign") || undefined,
      content: params.get("utm_content") || undefined,
      term: params.get("utm_term") || undefined,
      gclid: params.get("gclid") || undefined,
      fbclid: params.get("fbclid") || undefined,
    };
    landingUrl = window.location.href;
    referrer = document.referrer || "";
  } catch {
    // non-browser context; leave attribution empty
  }
  return { utm, landingUrl, referrer };
}

function createSession(): FunnelSession {
  const now = Date.now();
  const { utm, landingUrl, referrer } = captureAttribution();
  return {
    sessionId: newSessionId(),
    createdAt: now,
    updatedAt: now,
    expiresAt: now + SESSION_TTL_MS,
    landingUrl,
    referrer,
    utm,
    answers: {},
    contact: {},
    currentStepIndex: 0,
    status: "in_progress",
    submittedMilestones: [],
  };
}

export function loadSession(): FunnelSession | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as FunnelSession;
    if (!session.expiresAt || session.expiresAt < Date.now()) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveSession(session: FunnelSession): void {
  try {
    session.updatedAt = Date.now();
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // localStorage unavailable (private mode, quota) -- funnel still works
    // in-memory for this page view, it just won't resume on return.
  }
}

export function startOrResumeSession(): FunnelSession {
  return loadSession() ?? createSession();
}

export function clearSession(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

// ---------------------------------------------------------------------------
// Analytics
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type FunnelEventName =
  | "real_estate_lead_funnel_view"
  | "real_estate_lead_funnel_started"
  | "real_estate_lead_question_answered"
  | "real_estate_lead_step_completed"
  | "real_estate_lead_contact_started"
  | "real_estate_lead_email_captured"
  | "real_estate_lead_phone_captured"
  | "real_estate_lead_funnel_completed"
  | "real_estate_lead_diy_selected"
  | "real_estate_lead_dfy_selected"
  | "real_estate_lead_strategy_call_clicked"
  | "real_estate_lead_strategy_call_booked";

/** Non-sensitive properties only -- never pass name/email/phone/raw free text here. */
export type FunnelEventProps = {
  step?: StepId | string;
  questionNumber?: number;
  objective?: string;
  leadType?: string;
  budgetRange?: string;
  timeline?: string;
  implementationPreference?: string;
  sessionId?: string;
};

export function track(event: FunnelEventName, props: FunnelEventProps = {}): void {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
  } catch {
    // never let analytics break the funnel
  }
}

// ---------------------------------------------------------------------------
// Lead submission (webhook milestones)
// ---------------------------------------------------------------------------

function baseLeadPayload(session: FunnelSession) {
  const { score, tier } = scoreLead(session.answers);
  return {
    formType: "real-estate-lead-gen",
    sessionId: session.sessionId,
    landingUrl: session.landingUrl,
    referrer: session.referrer,
    utmSource: session.utm.source,
    utmMedium: session.utm.medium,
    utmCampaign: session.utm.campaign,
    utmContent: session.utm.content,
    utmTerm: session.utm.term,
    gclid: session.utm.gclid,
    fbclid: session.utm.fbclid,
    objective: session.answers.objective,
    leadTypes: session.answers.leadTypes?.join(", "),
    marketCity: session.answers.marketCity,
    marketState: session.answers.marketState,
    serviceArea: session.answers.serviceArea,
    currentTransactionsPerQuarter: session.answers.currentTransactions,
    targetTransactionsPerQuarter: session.answers.targetTransactions,
    currentChannels: session.answers.currentChannels?.join(", "),
    primaryProblem: session.answers.primaryProblem,
    opportunityPreference: session.answers.opportunityPreference,
    desiredLeadVolume: session.answers.desiredLeadVolume,
    transactionValue: session.answers.transactionValue,
    currentMarketingSpend: session.answers.currentMarketingSpend,
    availableBudget: session.answers.availableBudget,
    timeline: session.answers.timeline,
    implementationPreference: session.answers.implementationPreference,
    leadScore: score,
    leadTier: tier,
    status: session.status,
  };
}

/** Fires the milestone webhook exactly once per session, even across re-renders. */
async function submitMilestone(
  session: FunnelSession,
  milestone: string,
  contactFields: Partial<ContactInfo>,
): Promise<void> {
  if (session.submittedMilestones.includes(milestone)) return;
  session.submittedMilestones.push(milestone);
  saveSession(session);

  const payload = {
    ...baseLeadPayload(session),
    firstName: contactFields.firstName ?? session.contact.firstName,
    email: contactFields.email ?? session.contact.email,
    phone: contactFields.phone ?? session.contact.phone,
    smsConsent: contactFields.smsConsent ?? session.contact.smsConsent,
    milestone,
  };

  try {
    await apiRequest("POST", "/api/real-estate-lead-gen", payload);
  } catch {
    // apiRequest already fails open (fire-and-forget); nothing further to do.
  }
}

export function submitFirstNameCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "first_name_captured", {});
}

export function submitEmailCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "email_captured", {});
}

export function submitPhoneCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "phone_captured", {});
}

export function submitFunnelCompleted(session: FunnelSession): Promise<void> {
  session.status = "completed";
  saveSession(session);
  return submitMilestone(session, "funnel_completed", {});
}
