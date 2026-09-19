// Single source of truth for per-route SEO metadata.
//
// Both the runtime hook (usePageMeta, which injects tags client-side) and the
// build-time prerender step (scripts/prerender-meta.ts, which bakes them into
// static HTML) read from this table. Keeping one source means the HTML a
// non-JS crawler sees can never drift from what the app renders.
//
// Adding a page? Add it here AND to client/public/sitemap.xml -- the build
// fails if the two disagree.

export const SITE_NAME = "BlackSync.ai";
export const SITE_URL = "https://www.blacksync.ai";

export const DEFAULT_TITLE =
  "BlackSync | Custom AI Voice Agents for Sales and AI SDR Software";
export const DEFAULT_DESCRIPTION =
  "BlackSync builds custom AI voice agents for outbound sales, inbound calls, lead follow-up, appointment booking, and customer service. Built around your workflows, tools, and data.";

export type RouteMeta = {
  /** Page title, without the " | BlackSync.ai" suffix. Omit for the homepage. */
  title?: string;
  description?: string;
  /** Excluded from the sitemap and served with robots: noindex, nofollow. */
  noindex?: boolean;
};

/** Full <title> for a page title, matching what usePageMeta produces. */
export function fullTitle(title?: string): string {
  return title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
}

export const ROUTE_META: Record<string, RouteMeta> = {
  "/": {},

  "/why-blacksync": {
    title: "Why BlackSync",
    description:
      "BlackSync builds custom AI voice agents around your workflows, CRM, and business processes — for outbound sales, inbound calls, lead follow-up, and appointment booking.",
  },

  "/ai-sdr": {
    title: "AI SDR for Outbound Sales Teams",
    description:
      "Deploy managed AI SDRs that prospect, qualify, follow up, book meetings, and hand live opportunities to your sales team. Scale outbound capacity without adding more SDR headcount.",
  },
  "/real-estate-lead-generation": {
    title: "Real Estate AI Lead Generation",
    description:
      "Answer a few questions and get a personalized real estate lead generation strategy built around your market, lead type, growth goals, and budget. Buyer and seller lead generation, done for you or DIY.",
  },

  // Core marketing pages
  "/home-services": {
    title: "AI Answering Service for Home Services — $49/mo",
    description:
      "AI answering service and AI voice agent for home service businesses. Never miss a call, capture $300-$400+ jobs your voicemail is losing, and book straight to your calendar. Start for $49 your first month, then $98/month.",
  },
  "/pricing": {
    title: "Pricing - AI Calling Plans from $98/mo",
    description:
      "BlackSync AI calling plans: Solo Agent $98/mo, Team $296/mo, and custom Enterprise. Call credits from $197, add-on builds, and answers to the questions we get asked most. No hidden fees, cancel anytime.",
  },
  // Competitor comparisons
  "/compare/ylopo-alternative": {
    title: "Ylopo Alternative for Real Estate Teams",
    description:
      "Looking for a more customizable alternative to Ylopo? See how BlackSync AI gives real estate teams custom AI agents, high-volume calling, CRM context, flexible workflows, and pay-for-real-conversations pricing.",
  },

  "/book-demo": {
    title: "Book a Demo",
    description:
      "Book a free 15-minute demo call and see BlackSync's AI agent handle a real call scenario for your industry.",
  },
  "/enterprise": {
    title: "Enterprise",
    description:
      "BlackSync for brokerages, agencies, and teams that need unlimited capacity, white-glove onboarding, and enterprise-grade infrastructure.",
  },
  "/contact": {
    title: "Contact",
    description:
      "Get in touch with the BlackSync team — questions, support, or just want to talk before booking a call.",
  },
  "/careers": {
    title: "Careers",
    description:
      "Join BlackSync. We're hiring for Sales (SDR/Account Executive), Software Engineering, and Marketing/Social Media roles.",
  },
  "/affiliates": {
    title: "Affiliates",
    description:
      "Refer companies to BlackSync and earn a one-time referral bonus plus recurring commission after your 4th referral.",
  },

  // Legal
  "/privacy": {
    title: "Privacy Policy",
    description:
      "How BlackSync AI collects, uses, and protects your information.",
  },
  "/terms": {
    title: "Terms of Service",
    description:
      "The terms that govern your use of BlackSync AI.",
  },
  "/security": {
    title: "Security",
    description:
      "How BlackSync AI protects your data and your customers' data.",
  },

  // Industry pages (/industry/:slug)
  "/industry/real-estate": {
    title: "Real Estate AI Sales Agent",
    description:
      "BlackSync replaces your entire ISA bench with specialized AI agents for FSBOs, Expireds, Just Listed/Just Sold circle prospecting, speed-to-lead, sphere reactivation, and open house follow-up. Every lead called before your competition even sees the notification.",
  },
  "/industry/mortgage": {
    title: "Mortgage & Lending AI Sales Agent",
    description:
      "BlackSync's AI qualifies LendingTree, Zillow Home Loans, and webform leads instantly — pre-screens credit, intent, and loan amount before booking the call.",
  },
  "/industry/insurance": {
    title: "Insurance AI Sales Agent",
    description:
      "BlackSync's AI calls auto, home, life, and commercial leads within seconds, gathers underwriting info, and books the call with your licensed agent.",
  },
  "/industry/home-services": {
    title: "Home Services AI Sales Agent",
    description:
      "BlackSync's AI answers and dials inbound + outbound leads 24/7 — qualifies job type, urgency, and location, then books trucks to the calendar.",
  },
  "/industry/healthcare": {
    title: "Healthcare AI Sales Agent",
    description:
      "BlackSync's AI handles appointment scheduling, recall outreach, and lead intake — fully HIPAA-aligned and integrated with your EHR.",
  },
  "/industry/auto-pc": {
    title: "Auto & P&C Insurance AI Sales Agent",
    description:
      "BlackSync's AI dials auto and P&C leads in seconds, captures full underwriting info, and books the bind call with your licensed producer.",
  },
  "/industry/property-management": {
    title: "Property Management AI Sales Agent",
    description:
      "BlackSync's AI qualifies prospective tenants, schedules showings, and triages maintenance calls 24/7 across your entire portfolio.",
  },
  "/industry/funeral-homes": {
    title: "24/7 AI Receptionist for Funeral Homes",
    description:
      "Replace expensive answering services with an AI receptionist trained exclusively for your funeral home. Answers every call with professionalism and empathy, books arrangements, warm-transfers urgent calls, and documents every conversation automatically.",
  },
  "/industry/law-firms": {
    title: "AI Client Intake & Missed Call Answering for Law Firms",
    description:
      "An AI intake assistant trained on your firm's practice areas and screening criteria. Answers every call, runs your intake questionnaire, flags conflicts and statute-of-limitations risk for your team, and books consultations. It gathers information — it never gives legal advice.",
  },

  // Use-case landing pages
  "/real-estate-ai-caller": {
    title: "AI Cold Caller for Real Estate Teams",
    description:
      "BlackSync is the AI cold caller built for real estate teams — calls FSBOs, Expireds, and new leads within seconds, qualifies them, and books the appointment on your calendar.",
  },
  "/ai-cold-caller": {
    title: "AI Cold Caller for Batch Calling Real Estate Leads",
    description:
      "BlackSync is an AI cold caller built for batch calling — load a list of hundreds or thousands of real estate leads and it works the whole thing, qualifies who's worth a callback, and books the appointment.",
  },
  "/expired-listing-ai": {
    title: "AI Cold Caller for Expired Listings",
    description:
      "BlackSync's AI calls your expired listings within minutes of pulling the list, handles seller objections, and books the listing appointment — before the next agent does.",
  },
  "/fsbo-ai": {
    title: "AI Caller for FSBO Leads",
    description:
      "BlackSync's AI opens FSBO conversations with value instead of a pitch, works through commission objections, and stays in the follow-up cadence until the seller's ready to talk.",
  },
  "/mortgage-ai-caller": {
    title: "AI Cold Caller for Mortgage & Lending",
    description:
      "BlackSync's AI calls LendingTree, Zillow Home Loans, and webform leads within seconds, pre-qualifies them on credit, intent, and loan amount, and books them with your loan officers.",
  },
  "/ai-lead-generation": {
    title: "AI Lead Generation & Qualification Software",
    description:
      "BlackSync's AI agent calls, texts, and qualifies the leads your ads, forms, and CRM already bring in — within seconds, before they go cold.",
  },
  "/ai-appointment-setter": {
    title: "AI Appointment Setter",
    description:
      "BlackSync's AI appointment setter calls and texts every lead, qualifies them in conversation, and books the meeting directly on your calendar.",
  },
  "/ai-lead-qualification-software": {
    title: "AI Lead Qualification Software",
    description:
      "BlackSync's AI agent calls and texts every new lead, scores it on budget, timeline, and intent, and only routes the ones worth your team's time.",
  },
  "/insurance-ai": {
    title: "AI Caller for Insurance Agencies",
    description:
      "BlackSync's AI calls auto, home, life, and commercial insurance leads within seconds, gathers underwriting info, and books the call with your licensed agent.",
  },

  "/unsubscribe": {
    title: "Unsubscribe",
    description: "Unsubscribe an email address from BlackSync communications.",
    noindex: true,
  },

  // Account flow -- intentionally kept out of the index and the sitemap.
  "/login": {
    title: "Log In",
    description: "Log in to your BlackSync account to manage your AI sales agent.",
    noindex: true,
  },
  "/signup": {
    title: "Sign Up",
    description:
      "Create your BlackSync account and get your AI sales agent calling leads in minutes.",
    noindex: true,
  },
  "/dashboard": { title: "Dashboard", noindex: true },
};

/** Routes that should be prerendered and appear in the sitemap. */
export const INDEXABLE_ROUTES = Object.entries(ROUTE_META)
  .filter(([, m]) => !m.noindex)
  .map(([path]) => path);

