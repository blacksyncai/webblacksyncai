/**
 * Real Estate Lead Generation funnel — pure logic.
 *
 * No DOM, no localStorage, no network calls in this file. Question content,
 * conditional branching, lead scoring, and recommendation logic all live here
 * as plain functions over a single `Answers` object, so the step count, the
 * scoring weights, and the recommendation rules each have exactly one place
 * to change rather than being scattered across components.
 */

// ---------------------------------------------------------------------------
// Answers
// ---------------------------------------------------------------------------

export type Objective = "listings" | "buyers" | "both" | "brand" | "team" | "unsure";

export type Answers = {
  objective?: Objective;
  /** Plain ids for a single-focus objective; "seller:x" / "buyer:x" prefixed ids when objective is "both". */
  leadTypes?: string[];
  marketCity?: string;
  marketState?: string;
  serviceArea?: string;
  currentTransactions?: string;
  targetTransactions?: string;
  currentChannels?: string[];
  primaryProblem?: string;
  opportunityPreference?: string;
  desiredLeadVolume?: string;
  transactionValue?: string;
  currentMarketingSpend?: string;
  availableBudget?: string;
  timeline?: string;
  implementationPreference?: "diy" | "dfy";
};

export type ContactInfo = {
  firstName?: string;
  email?: string;
  phone?: string;
  smsConsent?: boolean;
};

// ---------------------------------------------------------------------------
// Question option/type definitions
// ---------------------------------------------------------------------------

export type Option = { value: string; label: string };

export const OBJECTIVE_OPTIONS: Option[] = [
  { value: "listings", label: "Get more listings" },
  { value: "buyers", label: "Find more buyers" },
  { value: "both", label: "Generate both buyer & seller opportunities" },
  { value: "brand", label: "Grow my personal brand" },
  { value: "team", label: "Grow my team or brokerage" },
  { value: "unsure", label: "I'm not sure — recommend the best opportunity" },
];

export const SELLER_LEAD_TYPE_OPTIONS: Option[] = [
  { value: "homeowners-considering", label: "Homeowners considering selling" },
  { value: "home-valuation", label: "Home valuation leads" },
  { value: "motivated-sellers", label: "Motivated sellers" },
  { value: "luxury-homeowners", label: "Luxury homeowners" },
  { value: "absentee-investor", label: "Absentee / investor owners" },
  { value: "downsizers", label: "Downsizers" },
  { value: "probate-lifeevent", label: "Probate / life-event opportunities" },
  { value: "expired-listings", label: "Expired listings" },
  { value: "fsbo", label: "FSBO opportunities" },
  { value: "recommend-best", label: "Recommend the best opportunity for my market" },
];

export const BUYER_LEAD_TYPE_OPTIONS: Option[] = [
  { value: "first-time", label: "First-time buyers" },
  { value: "move-up", label: "Move-up buyers" },
  { value: "luxury-buyers", label: "Luxury buyers" },
  { value: "investors", label: "Investors" },
  { value: "relocation", label: "Relocation buyers" },
  { value: "new-construction", label: "New construction buyers" },
  { value: "general-inquiries", label: "General buyer inquiries" },
  { value: "recommend-best", label: "Recommend the best opportunity for my market" },
];

export const SERVICE_AREA_OPTIONS: Option[] = [
  { value: "specific-neighborhoods", label: "Specific neighborhoods" },
  { value: "one-city", label: "One city" },
  { value: "multiple-cities", label: "Multiple nearby cities" },
  { value: "county-region", label: "Entire county / region" },
  { value: "metro-area", label: "Larger metro area" },
];

export const TRANSACTION_BAND_OPTIONS: Option[] = [
  { value: "0-1", label: "0–1" },
  { value: "2-3", label: "2–3" },
  { value: "4-7", label: "4–7" },
  { value: "8-15", label: "8–15" },
  { value: "15-plus", label: "15+" },
];

export const CURRENT_CHANNEL_OPTIONS: Option[] = [
  { value: "meta", label: "Meta / Facebook / Instagram Ads" },
  { value: "google-ads", label: "Google Ads" },
  { value: "zillow", label: "Zillow" },
  { value: "realtor", label: "Realtor.com" },
  { value: "youtube", label: "YouTube" },
  { value: "seo-organic", label: "SEO / Google organic" },
  { value: "social-content", label: "Social media / content" },
  { value: "direct-mail", label: "Direct mail" },
  { value: "referrals", label: "Referrals" },
  { value: "cold-prospecting", label: "Cold prospecting" },
  { value: "agency", label: "Another marketing agency" },
  { value: "nothing-consistent", label: "Nothing consistently" },
  { value: "other", label: "Other" },
];

export const PRIMARY_PROBLEM_OPTIONS: Option[] = [
  { value: "not-enough-leads", label: "Not enough leads" },
  { value: "low-quality", label: "Lead quality is too low" },
  { value: "not-ready", label: "Too many leads aren't ready" },
  { value: "cost-too-high", label: "Cost per lead is too high" },
  { value: "not-converting-appts", label: "Leads aren't turning into appointments" },
  { value: "inconsistent", label: "Marketing is inconsistent" },
  { value: "dont-know-whats-working", label: "I don't know what's actually working" },
  { value: "no-predictable-system", label: "I don't have a predictable system yet" },
];

/** Opportunity-preference options are the same shape for seller/buyer/both; only the noun changes. */
function opportunityPreferenceOptions(noun: string): Option[] {
  return [
    { value: "likely-3-6mo", label: `${noun} likely to transact within the next 3–6 months` },
    { value: "higher-intent", label: `Higher-intent, more motivated ${noun.toLowerCase()}` },
    { value: "more-appointments", label: "More appointments, even at lower lead volume" },
    { value: "max-volume-lowest-cost", label: "Maximum lead volume at the lowest practical acquisition cost" },
    { value: "recommend-balance", label: "Recommend the best balance for me" },
  ];
}

export const DESIRED_VOLUME_OPTIONS: Option[] = [
  { value: "3-5", label: "3–5" },
  { value: "8-15", label: "8–15" },
  { value: "25-50", label: "25–50" },
  { value: "50-100", label: "50–100" },
  { value: "100-plus", label: "100+" },
  { value: "recommend-target", label: "Recommend a realistic target for me" },
];

export const TRANSACTION_VALUE_OPTIONS: Option[] = [
  { value: "under-5k", label: "Under $5,000" },
  { value: "5k-10k", label: "$5,000–$10,000" },
  { value: "10k-20k", label: "$10,000–$20,000" },
  { value: "20k-plus", label: "$20,000+" },
  { value: "not-sure", label: "I'm not sure" },
];

export const SPEND_OPTIONS: Option[] = [
  { value: "0", label: "$0" },
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500–$1,000" },
  { value: "1000-2500", label: "$1,000–$2,500" },
  { value: "2500-5000", label: "$2,500–$5,000" },
  { value: "5000-10000", label: "$5,000–$10,000" },
  { value: "10000-plus", label: "$10,000+" },
];

export const BUDGET_OPTIONS: Option[] = [
  { value: "under-500", label: "Under $500" },
  { value: "500-1000", label: "$500–$1,000" },
  { value: "1000-2500", label: "$1,000–$2,500" },
  { value: "2500-5000", label: "$2,500–$5,000" },
  { value: "5000-10000", label: "$5,000–$10,000" },
  { value: "10000-plus", label: "$10,000+" },
  { value: "help-determine", label: "Help me determine the right budget" },
];

export const TIMELINE_OPTIONS: Option[] = [
  { value: "asap", label: "As soon as possible" },
  { value: "within-30-days", label: "Within 30 days" },
  { value: "one-to-three-months", label: "1–3 months" },
  { value: "researching", label: "I'm researching what's possible" },
];

export const IMPLEMENTATION_OPTIONS: { value: "diy" | "dfy"; label: string; description: string }[] = [
  {
    value: "diy",
    label: "Build It With Me",
    description:
      "Give me the strategy, campaigns, targeting, funnels, tracking, and workflows. I'll implement the system.",
  },
  {
    value: "dfy",
    label: "Build It For Me",
    description:
      "I want BlackSync to build, launch, track, and optimize the lead generation system for me.",
  },
];

// ---------------------------------------------------------------------------
// Step graph
// ---------------------------------------------------------------------------

export type StepId =
  | "objective"
  | "leadTypes"
  | "market"
  | "transactions"
  | "currentChannels"
  | "primaryProblem"
  | "interstitial"
  | "opportunityPreference"
  | "desiredLeadVolume"
  | "transactionValue"
  | "currentMarketingSpend"
  | "availableBudget"
  | "timeline"
  | "implementationPreference"
  | "contactFirstName"
  | "contactEmail"
  | "contactPhone"
  | "results";

/** Fixed order. Every visitor sees every step -- what conditionally changes is the
 *  CONTENT of a step (which options render), not whether the step is skipped. This
 *  keeps "question N of 13" a stable, honest number instead of a moving target. */
export const STEP_ORDER: StepId[] = [
  "objective",
  "leadTypes",
  "market",
  "transactions",
  "currentChannels",
  "primaryProblem",
  "interstitial",
  "opportunityPreference",
  "desiredLeadVolume",
  "transactionValue",
  "currentMarketingSpend",
  "availableBudget",
  "timeline",
  "implementationPreference",
  "contactFirstName",
  "contactEmail",
  "contactPhone",
  "results",
];

/** The 13 steps the visitor is told about ("Question N of 13"). Interstitial,
 *  contact capture, and the results screen aren't counted as questions. */
export const QUESTION_STEPS: StepId[] = [
  "objective",
  "leadTypes",
  "market",
  "transactions",
  "currentChannels",
  "primaryProblem",
  "opportunityPreference",
  "desiredLeadVolume",
  "transactionValue",
  "currentMarketingSpend",
  "availableBudget",
  "timeline",
  "implementationPreference",
];

export function questionNumber(step: StepId): number | null {
  const i = QUESTION_STEPS.indexOf(step);
  return i === -1 ? null : i + 1;
}

/** Lead-type noun used for copy that adapts to the visitor's objective. */
export function leadTypeNoun(objective: Objective | undefined): "seller" | "buyer" | "both" {
  if (objective === "buyers") return "buyer";
  if (objective === "both") return "both";
  return "seller";
}

export function opportunityPreferenceOptionsFor(objective: Objective | undefined): Option[] {
  if (objective === "buyers") return opportunityPreferenceOptions("Buyers");
  if (objective === "both") return opportunityPreferenceOptions("Opportunities");
  return opportunityPreferenceOptions("Sellers");
}

// ---------------------------------------------------------------------------
// Lead scoring
// ---------------------------------------------------------------------------

/**
 * Centralized scoring weights. Every number that feeds the score lives here --
 * nothing scattered in components. Raw score is never shown to the visitor;
 * only the derived tier ever reaches the UI (and even then, only internally).
 */
export const SCORING_CONFIG = {
  weights: {
    currentTransactions: { "0-1": 2, "2-3": 4, "4-7": 6, "8-15": 9, "15-plus": 12 } as Record<string, number>,
    targetTransactions: { "0-1": 1, "2-3": 3, "4-7": 5, "8-15": 8, "15-plus": 11 } as Record<string, number>,
    transactionValue: { "under-5k": 2, "5k-10k": 5, "10k-20k": 9, "20k-plus": 13, "not-sure": 3 } as Record<string, number>,
    currentMarketingSpend: {
      "0": 1,
      "under-500": 2,
      "500-1000": 4,
      "1000-2500": 7,
      "2500-5000": 10,
      "5000-10000": 13,
      "10000-plus": 15,
    } as Record<string, number>,
    availableBudget: {
      "under-500": 1,
      "500-1000": 3,
      "1000-2500": 7,
      "2500-5000": 12,
      "5000-10000": 17,
      "10000-plus": 22,
      "help-determine": 6,
    } as Record<string, number>,
    desiredLeadVolume: {
      "3-5": 2,
      "8-15": 5,
      "25-50": 8,
      "50-100": 11,
      "100-plus": 13,
      "recommend-target": 4,
    } as Record<string, number>,
    timeline: { asap: 14, "within-30-days": 10, "one-to-three-months": 5, researching: 1 } as Record<string, number>,
    implementationPreference: { dfy: 12, diy: 3 } as Record<string, number>,
    /** Having zero consistent acquisition today reads as higher intent to fix it now. */
    sophisticationBonus: {
      nothingConsistentOnly: 4,
      hasAgencyOrPaidChannel: 2,
      none: 0,
    },
  },
  /** Tier cutoffs against the max possible score (~110). */
  tiers: [
    { max: 24, tier: "LOW INTENT" as const },
    { max: 49, tier: "MEDIUM INTENT" as const },
    { max: 74, tier: "HIGH INTENT" as const },
    { max: Infinity, tier: "PRIORITY" as const },
  ],
};

export type LeadTier = "LOW INTENT" | "MEDIUM INTENT" | "HIGH INTENT" | "PRIORITY";

export function scoreLead(answers: Answers): { score: number; tier: LeadTier } {
  const w = SCORING_CONFIG.weights;
  let score = 0;
  score += (answers.currentTransactions && w.currentTransactions[answers.currentTransactions]) || 0;
  score += (answers.targetTransactions && w.targetTransactions[answers.targetTransactions]) || 0;
  score += (answers.transactionValue && w.transactionValue[answers.transactionValue]) || 0;
  score += (answers.currentMarketingSpend && w.currentMarketingSpend[answers.currentMarketingSpend]) || 0;
  score += (answers.availableBudget && w.availableBudget[answers.availableBudget]) || 0;
  score += (answers.desiredLeadVolume && w.desiredLeadVolume[answers.desiredLeadVolume]) || 0;
  score += (answers.timeline && w.timeline[answers.timeline]) || 0;
  score += (answers.implementationPreference && w.implementationPreference[answers.implementationPreference]) || 0;

  const channels = answers.currentChannels || [];
  if (channels.length === 1 && channels[0] === "nothing-consistent") {
    score += w.sophisticationBonus.nothingConsistentOnly;
  } else if (channels.includes("agency") || channels.includes("meta") || channels.includes("google-ads")) {
    score += w.sophisticationBonus.hasAgencyOrPaidChannel;
  }

  const tier = SCORING_CONFIG.tiers.find((t) => score <= t.max)?.tier ?? "LOW INTENT";
  return { score, tier };
}

// ---------------------------------------------------------------------------
// Recommendation
// ---------------------------------------------------------------------------

export type ChannelRec = { channel: string; reason: string };

export type Recommendation = {
  channels: ChannelRec[];
  concentrationNote: string;
};

const CHANNEL_LABEL = {
  meta: "Meta (Facebook & Instagram) Ads",
  googleSearch: "Google Search Ads",
  retargeting: "Retargeting",
  funnel: "Landing Page / Lead Funnel",
  content: "Content / Organic",
};

/**
 * Deterministic, budget-scaled channel mix. No fabricated CPL or lead-volume
 * numbers -- just which channels, in what order, and how many, based on the
 * visitor's own stated objective, budget, and problem.
 */
export function buildRecommendation(answers: Answers): Recommendation {
  const budget = answers.availableBudget;
  const problem = answers.primaryProblem;
  const objective = answers.objective;

  // How many channels to run at once, driven by budget -- small budgets get
  // focus, not five simultaneous channels split too thin to learn from.
  const slots =
    budget === "under-500" || budget === "500-1000"
      ? 2
      : budget === "1000-2500"
        ? 3
        : budget === "2500-5000" || budget === "5000-10000"
          ? 4
          : budget === "10000-plus"
            ? 5
            : 3; // "help-determine" or unanswered: a moderate default, finalized on a call

  // Search-intent channels (Google) get pulled forward when cost or conversion
  // is the stated problem; otherwise lead volume via Meta comes first.
  const prioritizeSearch = problem === "cost-too-high" || problem === "not-converting-appts";

  const primaryPair: ChannelRec[] = prioritizeSearch
    ? [
        { channel: CHANNEL_LABEL.googleSearch, reason: "Captures people already searching with intent, which tends to convert at a lower cost per appointment." },
        { channel: CHANNEL_LABEL.meta, reason: "Builds volume and awareness with sellers/buyers who haven't started searching yet." },
      ]
    : [
        { channel: CHANNEL_LABEL.meta, reason: "Reaches homeowners and buyers who match your target before they start actively searching." },
        { channel: CHANNEL_LABEL.googleSearch, reason: "Captures the portion of your market already searching with intent." },
      ];

  const ordered: ChannelRec[] = [
    {
      channel: CHANNEL_LABEL.funnel,
      reason: "Where every click lands -- built around the specific opportunity you're after, not a generic contact form.",
    },
    ...primaryPair,
    { channel: CHANNEL_LABEL.retargeting, reason: "Brings back the people who clicked but didn't convert on the first visit." },
    { channel: CHANNEL_LABEL.content, reason: "Longer-term organic reach that compounds once the paid channels are proven." },
  ];

  // Funnel is foundational and always included; fill remaining slots in order.
  const channels = [ordered[0], ...ordered.slice(1, Math.max(1, slots))];

  const concentrationNote =
    slots <= 2
      ? "At this budget, spend is concentrated on one acquisition channel plus the funnel it feeds -- enough volume in one place to actually learn what's working before splitting it further."
      : slots === 3
        ? "This budget supports one primary acquisition channel alongside a secondary one, both feeding the same funnel."
        : slots === 4
          ? "This budget supports a small diversified mix -- enough to run two acquisition channels plus retargeting without spreading either too thin."
          : "This budget supports a fuller acquisition mix, including organic content as a longer-term channel alongside paid.";

  return { channels, concentrationNote };
}

// ---------------------------------------------------------------------------
// Labels for the results summary (answers -> human-readable strings)
// ---------------------------------------------------------------------------

export function labelFor(options: Option[], value: string | undefined): string | undefined {
  return options.find((o) => o.value === value)?.label;
}

export function objectiveLabel(objective: Objective | undefined): string | undefined {
  return labelFor(OBJECTIVE_OPTIONS, objective);
}

/**
 * Short, live-updating recap of what's been answered so far -- rendered as
 * chips during the assessment so it reads as a plan assembling in real time
 * rather than a form being filled in. Only ever reflects answers actually
 * given; nothing here is inferred.
 */
export function buildRecapChips(answers: Answers): string[] {
  const chips: string[] = [];
  const obj = objectiveLabel(answers.objective);
  if (obj) chips.push(obj);
  if (answers.marketCity) {
    chips.push(answers.marketState ? `${answers.marketCity}, ${answers.marketState}` : answers.marketCity);
  }
  if (answers.currentTransactions && answers.targetTransactions) {
    chips.push(`${answers.currentTransactions} → ${answers.targetTransactions}/qtr`);
  }
  const budget = labelFor(BUDGET_OPTIONS, answers.availableBudget);
  if (budget) chips.push(`${budget}/mo`);
  if (answers.timeline) {
    const t = labelFor(TIMELINE_OPTIONS, answers.timeline);
    if (t) chips.push(t);
  }
  return chips;
}
