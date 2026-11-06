// Single source of truth for the public pricing page.
//
// The React page (client/src/pages/pricing.tsx), the homepage plan teaser, the
// build-time prerender (scripts/prerender-meta.ts: crawlable HTML + JSON-LD)
// and the Markdown served to agents all read from here, so what a crawler
// sees can never drift from what a visitor sees.
//
// Prices and limits must match the app's billing catalog
// (AICALLING backend/app/services/billing/catalog.py). The Teams plan is still
// sold privately and kept for existing subscribers; it is just not listed here.

// Kept local (not imported from route-meta) so the two modules can import each other safely.
const SITE_URL = "https://www.blacksync.ai";

export const APP_URL = "https://blacksync.si";
export const PRICING_URL = `${SITE_URL}/pricing`;
export const BUY_CREDITS_URL = `${APP_URL}/billing?tab=credits`;
export const EXTRA_NUMBER_PRICE = "$3.50";

export type PlanKey = "start" | "solo" | "growth" | "enterprise";

export type Plan = {
  key: PlanKey;
  name: string;
  /** Display price, e.g. "$98". */
  price: string;
  /** Monthly price in USD for structured data; null = custom pricing. */
  priceUsd: number | null;
  period: string;
  subtitle: string;
  /** Shown on the card. Short. */
  highlights: string[];
  /** Line above the highlights, e.g. "Everything in Solo, plus". */
  highlightsTitle?: string;
  /** The three headline benefits shown on the featured plan. */
  keyBenefits?: { title: string; detail: string }[];
  /** The plan's full feature list (crawlable content and Markdown). */
  features: string[];
  cta: string;
  /** Real destination. Enterprise opens the sales booking dialog instead. */
  href: string | null;
  popular?: boolean;
  note?: string;
};

export const PLANS: Plan[] = [
  {
    key: "start",
    name: "Start",
    price: "$0",
    priceUsd: 0,
    period: "/month",
    subtitle: "For exploring AI calling and building your first agent.",
    highlights: [
      "10 complimentary credits (one-time)",
      "1 customizable AI voice agent",
      "Up to 75 outbound call attempts per day",
      "2 concurrent calls",
      "AI agent builder and voice library",
      "CSV imports, recordings and transcripts",
      "Pay-as-you-go credits anytime",
    ],
    features: [
      "10 complimentary credits, one-time allocation",
      "1 customizable AI voice agent",
      "Up to 75 outbound call attempts per day",
      "2 concurrent calls",
      "AI agent builder",
      "Voice library",
      "CSV lead imports",
      "Call recordings and transcripts",
      "Basic analytics",
      "Purchase additional credits anytime (pay as you go)",
    ],
    cta: "Start for Free",
    href: `${APP_URL}/sign-up`,
    note: "The 75-attempt daily limit stays in place when you buy more credits.",
  },
  {
    key: "solo",
    name: "Solo",
    price: "$98",
    priceUsd: 98,
    period: "/month",
    subtitle: "For individuals and businesses ready to automate their outreach.",
    highlights: [
      "150 monthly calling credits",
      "2 customizable AI agents",
      "10 concurrent calls",
      "No fixed daily outbound call cap",
      "1 local phone number included",
      "Inbound and outbound campaigns with follow-ups",
      "Calendar booking",
      "Zapier and webhook integrations",
    ],
    features: [
      "150 monthly calling credits",
      "2 customizable AI agents",
      "10 concurrent calls",
      "No fixed daily outbound call cap",
      "1 local phone number included",
      "AI agent builder and voice library",
      "Inbound and outbound calling",
      "Campaign scheduling and follow-ups",
      "Calendar booking",
      "Zapier and webhook integrations",
      "Call recordings and transcripts",
      "Standard analytics",
      "Self-service onboarding",
      "Purchase additional credits anytime",
    ],
    cta: "Get Started",
    href: `${APP_URL}/sign-up?plan=solo`,
  },
  {
    key: "growth",
    name: "Growth",
    price: "$197",
    priceUsd: 197,
    period: "/month",
    subtitle: "For growing teams connecting AI calling directly to their sales operations.",
    popular: true,
    keyBenefits: [
      { title: "Deep native CRM integration", detail: "Calls, outcomes and lead status flow into your CRM." },
      { title: "3 local numbers + 25 concurrent calls", detail: "Capacity for real daily volume." },
      { title: "Guided onboarding + priority support", detail: "We help you configure it right." },
    ],
    highlightsTitle: "Everything in Solo, plus",
    highlights: [
      "400 monthly calling credits",
      "5 customizable AI agents",
      "Two-way CRM sync where supported",
      "CRM field and pipeline mapping",
      "CRM-triggered calling workflows",
      "Automatic lead status and call outcome updates",
      "Advanced analytics and reporting",
    ],
    features: [
      "Everything in Solo",
      "400 monthly calling credits",
      "5 customizable AI agents",
      "25 concurrent calls",
      "No fixed daily outbound call cap",
      "3 local phone numbers included",
      "Deep native CRM integration",
      "Two-way CRM synchronization where supported",
      "Custom CRM field and pipeline mapping",
      "CRM-triggered calling workflows",
      "Automated lead status and call outcome updates",
      "Advanced campaign workflows and lead routing",
      "Advanced analytics and reporting",
      "Guided onboarding and initial configuration",
      "Priority support",
      "Purchase additional credits anytime",
    ],
    cta: "Start Growing",
    href: `${APP_URL}/sign-up?plan=growth`,
  },
  {
    key: "enterprise",
    name: "Custom Solutions",
    price: "Custom",
    priceUsd: null,
    period: "",
    subtitle: "Purpose-built AI solutions for complex operations and larger organizations.",
    highlights: [
      "Custom credits, agent capacity and concurrency",
      "Private cloud, VPC or on-premise deployment",
      "Custom API and CRM integrations",
      "Multi-team, multi-location and white-label",
      "Dedicated account manager",
      "Security, compliance and custom SLAs",
    ],
    features: [
      "Custom calling credits and usage allowances",
      "Custom AI agent capacity and concurrency",
      "Custom local phone number configurations",
      "Dedicated or private infrastructure options",
      "On-premise deployment options",
      "Private cloud / VPC deployment options",
      "Custom API and CRM integrations",
      "Enterprise workflow automation",
      "Multi-team and multi-location deployments",
      "White-label solutions",
      "Custom agent development and implementation",
      "Dedicated onboarding and deployment assistance",
      "Dedicated account manager",
      "Security and compliance options",
      "Custom service-level agreements",
      "Ongoing enterprise support",
    ],
    cta: "Talk to Sales",
    href: null,
    note: "Available under a custom agreement, scoped to your organization.",
  },
];

export const COMMON_FEATURES = [
  { title: "AI agent builder", detail: "Build an agent with AI or from scratch." },
  { title: "Natural-sounding AI voices", detail: "A library of voices in 16+ languages." },
  { title: "Inbound and outbound voice AI", detail: "Answer calls and run outbound campaigns." },
  { title: "Custom scripts and knowledge", detail: "Your script, your facts, your tone." },
  { title: "CSV lead imports", detail: "Upload contacts with any custom fields." },
  { title: "Recordings and transcripts", detail: "Every call recorded, transcribed and summarized." },
  { title: "Campaign analytics", detail: "See outcomes, connects and booked calls." },
];

/** One-time calling-credit packs (same packs and prices as the app's billing). */
export const CREDIT_PACKS = [
  { credits: 75, price: "$29", priceUsd: 29, label: "Quick top-up" },
  { credits: 500, price: "$139", priceUsd: 139, label: "Standard", popular: true },
  { credits: 1000, price: "$260", priceUsd: 260, label: "Volume" },
];

/** CRMs with native integrations in the app. What each supports varies by CRM. */
export const CRMS = [
  "Follow Up Boss",
  "HubSpot",
  "Salesforce",
  "GoHighLevel",
  "Close",
  "Pipedrive",
  "Zoho CRM",
  "Attio",
  "Lofty",
  "BoldTrail",
  "Sierra Interactive",
  "Real Geeks",
  "Cloze",
];

export const FAQS: { q: string; a: string }[] = [
  {
    q: "Can I try BlackSync AI for free?",
    a: "Yes. The Start plan is free: you get 10 complimentary credits, one AI voice agent and up to 75 outbound call attempts per day, with no card required. You can buy more credits whenever you want to keep calling.",
  },
  {
    q: "How do calling credits work?",
    a: "Credits are spent on connected call time. How many a call uses depends on its length and the AI model your agent runs on. Calls that never connect, like no answer or a busy line, don't use credits. Paid plans include credits every month, and purchased credits are used after your monthly ones.",
  },
  {
    q: "What happens when I run out of credits?",
    a: "Your agents pause outbound calling until you add credits. Your agents, contacts, campaigns and call history stay exactly as they are. You can turn on auto-recharge so a credit pack is bought automatically when your balance runs low.",
  },
  {
    q: "Can I purchase additional credits?",
    a: "Yes, on any plan. Packs start at $29 for 75 credits, with 500 and 1,000 credit packs for higher volume. Credit packs are a one-time purchase, separate from your monthly subscription.",
  },
  {
    q: "Are there daily calling limits?",
    a: "The free Start plan allows up to 75 outbound call attempts per day, and that limit stays in place even if you buy more credits. Solo and Growth have no fixed daily outbound cap; your volume is set by your credits and your plan's concurrent call limit.",
  },
  {
    q: "Are local phone numbers included?",
    a: "Solo includes 1 local number and Growth includes 3. Additional numbers start at $3.50 per month on any plan. Custom Solutions can include custom number configurations.",
  },
  {
    q: "Which CRMs does BlackSync integrate with?",
    a: `Growth includes native integrations with CRMs including ${CRMS.slice(0, -1).join(", ")} and ${CRMS[CRMS.length - 1]}. Two-way sync, field mapping and CRM-triggered calls are available where the CRM supports them, so the exact features vary by CRM. Every paid plan can also connect to other tools through Zapier and webhooks.`,
  },
  {
    q: "What's the difference between Solo and Growth?",
    a: "Solo is for running your own calling campaigns: 150 monthly credits, 2 agents, 10 concurrent calls and 1 number. Growth connects BlackSync to your CRM so calls are triggered by your pipeline and outcomes are written back automatically, with 400 monthly credits, 5 agents, 25 concurrent calls, 3 numbers, guided onboarding and priority support.",
  },
  {
    q: "Does BlackSync offer on-premise or private cloud deployment?",
    a: "Yes, through Custom Solutions. Dedicated infrastructure, private cloud or VPC, and on-premise deployments are available under a custom agreement scoped to your organization. Talk to sales to discuss your requirements.",
  },
  {
    q: "Can I upgrade or change my plan?",
    a: "Yes. You can upgrade, downgrade or cancel from Billing in your BlackSync account at any time, and nothing you've built is deleted when you change plans. For Custom Solutions, talk to our sales team.",
  },
];

/** Schema.org JSON-LD for /pricing. Only real, published prices; no ratings or reviews. */
export function pricingJsonLd(): object {
  const org = { "@id": `${SITE_URL}/#organization` };
  const offers = PLANS.filter((p) => p.priceUsd !== null).map((p) => ({
    "@type": "Offer",
    name: `${p.name} plan`,
    description: p.subtitle,
    price: p.priceUsd!.toFixed(2),
    priceCurrency: "USD",
    url: PRICING_URL,
    availability: "https://schema.org/InStock",
    seller: org,
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: p.priceUsd!.toFixed(2),
      priceCurrency: "USD",
      unitCode: "MON",
      billingDuration: "P1M",
      referenceQuantity: { "@type": "QuantitativeValue", value: 1, unitCode: "MON" },
    },
  }));
  const packs = CREDIT_PACKS.map((c) => ({
    "@type": "Offer",
    name: `${c.credits.toLocaleString("en-US")} calling credits`,
    price: c.priceUsd.toFixed(2),
    priceCurrency: "USD",
    url: PRICING_URL,
    availability: "https://schema.org/InStock",
    seller: org,
  }));
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${PRICING_URL}#webpage`,
        url: PRICING_URL,
        name: "AI Calling Pricing & Plans | BlackSync AI",
        description:
          "BlackSync AI pricing: a free Start plan, Solo at $98/month, Growth at $197/month and Custom Solutions for larger organizations.",
        isPartOf: { "@type": "WebSite", url: `${SITE_URL}/`, name: "BlackSync" },
        publisher: org,
        breadcrumb: { "@id": `${PRICING_URL}#breadcrumb` },
        mainEntity: { "@id": `${PRICING_URL}#software` },
        inLanguage: "en",
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${PRICING_URL}#breadcrumb`,
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
          { "@type": "ListItem", position: 2, name: "Pricing", item: PRICING_URL },
        ],
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${PRICING_URL}#software`,
        name: "BlackSync AI",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: `${SITE_URL}/`,
        description:
          "AI voice agents for inbound and outbound calling, lead follow-up, appointment booking and CRM-connected calling workflows.",
        publisher: org,
        offers,
      },
      {
        "@type": "OfferCatalog",
        "@id": `${PRICING_URL}#credit-packs`,
        name: "Calling credit packs",
        itemListElement: packs,
      },
    ],
  };
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** The whole pricing page as plain semantic HTML, for clients that don't run JS. */
export function pricingCrawlableHtml(): string {
  const plan = (p: Plan) =>
    [
      `<article><h3>${esc(p.name)}: ${esc(p.price)}${esc(p.period)}</h3>`,
      `<p>${esc(p.subtitle)}</p><ul>`,
      ...p.features.map((f) => `<li>${esc(f)}</li>`),
      `</ul>`,
      p.href ? `<p><a href="${esc(p.href)}">${esc(p.cta)}</a></p>` : `<p><a href="/enterprise">${esc(p.cta)}</a></p>`,
      p.note ? `<p>${esc(p.note)}</p>` : "",
      `</article>`,
    ].join("");
  return [
    `<h1>AI Calling Plans &amp; Pricing</h1>`,
    `<p>Start free, then scale with AI voice agents, outbound calling, CRM integrations and enterprise solutions. Plans from $98/month. Prices in USD.</p>`,
    `<h2>Plans</h2>`,
    ...PLANS.map(plan),
    `<h2>Every plan includes</h2><ul>`,
    ...COMMON_FEATURES.map((f) => `<li>${esc(f.title)}: ${esc(f.detail)}</li>`),
    `</ul>`,
    `<h2>Need more calling credits?</h2>`,
    `<p>Purchase additional credits whenever you need them. Credit packs are one-time purchases, separate from your monthly subscription. Credit use varies with the AI model and call length. Additional phone numbers start at ${EXTRA_NUMBER_PRICE}/month.</p><ul>`,
    ...CREDIT_PACKS.map((c) => `<li>${c.credits.toLocaleString("en-US")} credits: ${c.price}</li>`),
    `</ul><p><a href="${esc(BUY_CREDITS_URL)}">Buy credits</a></p>`,
    `<h2>CRM integrations</h2><p>Growth includes native integrations with ${esc(CRMS.join(", "))}. Features vary by CRM.</p>`,
    `<h2>Frequently asked questions</h2>`,
    ...FAQS.map((f) => `<h3>${esc(f.q)}</h3><p>${esc(f.a)}</p>`),
  ].join("\n");
}

/** The pricing page as Markdown for agents (Accept: text/markdown). */
export function pricingMarkdown(): string {
  return [
    "# AI Calling Plans & Pricing",
    "Start free, then scale with AI voice agents, outbound calling, CRM integrations and enterprise solutions. Prices in USD.",
    ...PLANS.map((p) =>
      [`## ${p.name}: ${p.price}${p.period}`, p.subtitle, ...p.features.map((f) => `- ${f}`), p.note ?? ""]
        .filter(Boolean)
        .join("\n"),
    ),
    "## Calling credit packs",
    "One-time purchases, separate from the subscription. Credit use varies with the AI model and call length. Additional phone numbers from $3.50/month.",
    CREDIT_PACKS.map((c) => `- ${c.credits.toLocaleString("en-US")} credits: ${c.price}`).join("\n"),
    "## FAQ",
    ...FAQS.map((f) => `### ${f.q}\n\n${f.a}`),
  ].join("\n\n");
}
