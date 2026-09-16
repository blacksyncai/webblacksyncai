/**
 * AI SDR funnel — pure logic. No DOM, no localStorage, no network calls.
 * Mirrors the split used by the real estate lead-gen funnel
 * (lead-funnel-engine.ts): question content and the recommendation builder
 * live here as plain functions over a single Answers object, so there's one
 * place to change either.
 */

export type Option = { value: string; label: string };

export type Answers = {
  teamSize?: string;
  primaryUse?: string[];
  monthlyVolume?: string;
  handoff?: string;
  crm?: string;
  bottleneck?: string;
};

export type ContactInfo = {
  firstName?: string;
  email?: string;
  company?: string;
  phone?: string;
  website?: string;
};

// ---------------------------------------------------------------------------
// Question options
// ---------------------------------------------------------------------------

export const TEAM_SIZE_OPTIONS: Option[] = [
  { value: "none", label: "No SDR team yet" },
  { value: "1-3", label: "1–3 SDRs" },
  { value: "4-10", label: "4–10 SDRs" },
  { value: "11-25", label: "11–25 SDRs" },
  { value: "25-plus", label: "25+ SDRs" },
];

export const PRIMARY_USE_OPTIONS: Option[] = [
  { value: "cold-prospecting", label: "Cold prospecting" },
  { value: "appointment-setting", label: "Appointment setting" },
  { value: "lead-qualification", label: "Lead qualification" },
  { value: "database-reactivation", label: "Database reactivation" },
  { value: "speed-to-lead", label: "Inbound speed-to-lead" },
  { value: "opportunity-followup", label: "Old opportunity follow-up" },
  { value: "partner-acquisition", label: "Dealer / partner acquisition" },
  { value: "account-expansion", label: "Account expansion" },
  { value: "other", label: "Other" },
];

export const VOLUME_OPTIONS: Option[] = [
  { value: "under-1k", label: "Under 1,000" },
  { value: "1k-5k", label: "1,000–5,000" },
  { value: "5k-15k", label: "5,000–15,000" },
  { value: "15k-50k", label: "15,000–50,000" },
  { value: "50k-plus", label: "50,000+" },
];

export const HANDOFF_OPTIONS: Option[] = [
  { value: "book-meeting", label: "Book a meeting" },
  { value: "live-transfer", label: "Live transfer" },
  { value: "send-to-ae", label: "Send to an AE / closer" },
  { value: "followup-sequence", label: "Start a follow-up sequence" },
  { value: "depends", label: "Depends on campaign" },
];

export const CRM_OPTIONS: Option[] = [
  { value: "salesforce", label: "Salesforce" },
  { value: "oracle", label: "Oracle" },
  { value: "dynamics", label: "Microsoft Dynamics" },
  { value: "hubspot", label: "HubSpot" },
  { value: "close", label: "Close" },
  { value: "zoho", label: "Zoho" },
  { value: "pipedrive", label: "Pipedrive" },
  { value: "other", label: "Other" },
  { value: "none", label: "No CRM" },
];

export const BOTTLENECK_OPTIONS: Option[] = [
  { value: "not-enough-volume", label: "Not enough outbound volume" },
  { value: "reps-dialing", label: "Reps spend too much time dialing" },
  { value: "inconsistent-followup", label: "Follow-up is inconsistent" },
  { value: "lists-not-worked", label: "Lead lists aren't being worked" },
  { value: "hiring-turnover", label: "SDR hiring / turnover" },
  { value: "appointment-quality", label: "Appointment quality" },
  { value: "speed-to-lead", label: "Speed-to-lead" },
  { value: "other", label: "Other" },
];

// ---------------------------------------------------------------------------
// Step graph -- fixed order, six real questions plus contact capture and results.
// ---------------------------------------------------------------------------

export type StepId =
  | "teamSize"
  | "primaryUse"
  | "monthlyVolume"
  | "handoff"
  | "crm"
  | "bottleneck"
  | "results"
  | "contactFirstName"
  | "contactEmail"
  | "contactCompany"
  | "contactPhone";

// The recommendation is revealed as soon as the six questions are answered --
// contact capture comes AFTER the visitor has already seen the plan, not
// before, per the "result card first" requirement.
export const STEP_ORDER: StepId[] = [
  "teamSize",
  "primaryUse",
  "monthlyVolume",
  "handoff",
  "crm",
  "bottleneck",
  "results",
  "contactFirstName",
  "contactEmail",
  "contactCompany",
  "contactPhone",
];

export const QUESTION_STEPS: StepId[] = [
  "teamSize",
  "primaryUse",
  "monthlyVolume",
  "handoff",
  "crm",
  "bottleneck",
];

export function questionNumber(step: StepId): number | null {
  const i = QUESTION_STEPS.indexOf(step);
  return i === -1 ? null : i + 1;
}

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

const CAMPAIGN_LABEL: Record<string, string> = {
  "cold-prospecting": "New prospect outreach",
  "appointment-setting": "Appointment setting",
  "lead-qualification": "Inbound lead qualification",
  "database-reactivation": "Database & dormant account reactivation",
  "speed-to-lead": "Inbound speed-to-lead",
  "opportunity-followup": "Old opportunity reactivation",
  "partner-acquisition": "Partner & dealer acquisition",
  "account-expansion": "Account expansion outreach",
};

export function labelFor(options: Option[], value: string | undefined): string | undefined {
  return options.find((o) => o.value === value)?.label;
}

export type Recommendation = {
  workflowCount: number;
  campaigns: string[];
  handoffLabel: string;
  crmLabel: string;
  deploymentType: string;
};

/**
 * Deterministic, built only from answers actually given. Workflow count and
 * campaign list both come directly from the "primary use" multi-select;
 * deployment type escalates only when the visitor's own answers (team size
 * or volume) indicate an enterprise-scale operation.
 */
export function buildRecommendation(answers: Answers): Recommendation {
  const uses = (answers.primaryUse || []).filter((u) => u !== "other");
  const campaigns = uses.map((u) => CAMPAIGN_LABEL[u]).filter(Boolean) as string[];
  const workflowCount = Math.max(1, campaigns.length || (answers.primaryUse?.length ? 1 : 0));

  const isEnterpriseScale = answers.teamSize === "25-plus" || answers.monthlyVolume === "50k-plus";

  return {
    workflowCount,
    campaigns: campaigns.length ? campaigns : ["Outbound prospecting"],
    handoffLabel: labelFor(HANDOFF_OPTIONS, answers.handoff) || "Configured per campaign",
    crmLabel: labelFor(CRM_OPTIONS, answers.crm) || "Not specified",
    deploymentType: isEnterpriseScale ? "Enterprise AI SDR Deployment" : "Managed AI SDR",
  };
}
