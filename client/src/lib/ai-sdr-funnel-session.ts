/**
 * AI SDR funnel — session persistence, analytics, and lead submission.
 * Same infrastructure and the same reasoning as lead-funnel-session.ts
 * (real estate lead-gen funnel): no server-side API runs reliably in this
 * project's production deployment and there is no database, so this follows
 * the identical fire-and-forget pattern every form on the site already uses
 * (see queryClient.ts) rather than inventing a new backend dependency.
 */
import { apiRequest } from "@/lib/queryClient";
import type { Answers, ContactInfo, StepId } from "@/lib/ai-sdr-funnel-engine";

const STORAGE_KEY = "bs_ai_sdr_session_v1";
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
  status: "in_progress" | "completed";
  submittedMilestones: string[];
};

function newSessionId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `sdr-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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
    // non-browser context
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
    // localStorage unavailable -- funnel still works in-memory for this view
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
// Analytics -- pushes to window.dataLayer (GTM contract). No GA4/GTM snippet
// is installed on the site yet, so this is currently an inert queue; every
// event already fires and needs zero code changes once one is added.
// ---------------------------------------------------------------------------

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export type FunnelEventName =
  | "ai_sdr_cta_click"
  | "ai_sdr_funnel_start"
  | "ai_sdr_funnel_step"
  | "ai_sdr_funnel_complete"
  | "ai_sdr_lead_submit"
  | "ai_sdr_enterprise_click"
  | "ai_sdr_integration_click";

/** Non-sensitive properties only -- never pass name/email/phone/company here. */
export type FunnelEventProps = {
  step?: StepId | string;
  questionNumber?: number;
  teamSize?: string;
  monthlyVolume?: string;
  crm?: string;
  handoff?: string;
  label?: string;
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
// Lead submission
// ---------------------------------------------------------------------------

function baseLeadPayload(session: FunnelSession) {
  return {
    formType: "ai-sdr",
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
    teamSize: session.answers.teamSize,
    primaryUse: session.answers.primaryUse?.join(", "),
    monthlyVolume: session.answers.monthlyVolume,
    handoff: session.answers.handoff,
    crm: session.answers.crm,
    bottleneck: session.answers.bottleneck,
    status: session.status,
  };
}

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
    company: contactFields.company ?? session.contact.company,
    phone: contactFields.phone ?? session.contact.phone,
    website: contactFields.website ?? session.contact.website,
    milestone,
  };

  try {
    await apiRequest("POST", "/api/ai-sdr-lead", payload);
  } catch {
    // apiRequest already fails open (fire-and-forget)
  }
}

// Contact-capture milestones fire without being awaited by the caller --
// a slow or unreachable webhook must never stall the visitor's progress
// through the funnel (this was a real bug in the first version of the real
// estate funnel; fixed there, so it's built in correctly here from the start).
export function submitFirstNameCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "first_name_captured", {});
}
export function submitEmailCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "email_captured", {});
}
export function submitCompanyCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "company_captured", {});
}
export function submitPhoneCaptured(session: FunnelSession): Promise<void> {
  return submitMilestone(session, "phone_captured", {});
}
export function submitFunnelCompleted(session: FunnelSession): Promise<void> {
  session.status = "completed";
  saveSession(session);
  return submitMilestone(session, "funnel_completed", {});
}
