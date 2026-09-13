import { Link } from "wouter";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Database,
  Gauge,
  Layers,
  PhoneCall,
  Plug,
  Repeat,
  Settings2,
  Wallet,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Eyebrow, Reveal, SectionHeading } from "@/components/ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { BookCallDialog } from "@/components/book-call-dialog";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { SITE_URL } from "@shared/route-meta";

/**
 * Competitor comparison pages.
 *
 * Every factual statement about a competitor on these pages has to be traceable
 * to that competitor's own published material. The `sources` list is rendered on
 * the page so a reader can check the claims, and anything that could not be
 * verified is written in neutral language ("varies by plan", "confirm with
 * Ylopo") rather than asserted.
 */

/** Cell value in the comparison table. `tone` only affects emphasis, never truth. */
type Cell = { text: string; tone?: "yes" | "neutral" };

const CAMPAIGNS = [
  "Old buyer lead reactivation",
  "Old seller lead reactivation",
  "Speed to lead",
  "First-touch follow-up",
  "Expired listing outreach",
  "FSBO outreach",
  "Circle prospecting",
  "Database reactivation",
  "Recruiting",
  "Appointment reminders",
  "Inbound lead qualification",
];

const DIFFERENTIATORS: {
  icon: typeof PhoneCall;
  title: string;
  body: string[];
}[] = [
  {
    icon: Settings2,
    title: "Agents built for one job, not one template",
    body: [
      "BlackSync does not ship a single generic agent that every team has to work around. Each agent is built for a specific job, and a team can run several at once.",
      "Scripts, objection handling, qualification criteria, transfer rules, booking behavior, follow-up cadence, and agent personality are all set per agent. An agent working a five year old buyer database should not sound like one calling a lead that came in ninety seconds ago, and here it does not have to.",
    ],
  },
  {
    icon: PhoneCall,
    title: "Built for high-volume outbound",
    body: [
      "BlackSync runs its own ISA platform designed for outbound calling at scale, not only for answering new inbound leads.",
      "That covers large calling campaigns, redial logic, retrying no-answers, callback handling, warm transfers, calendar booking, dispositioning, and tagging. Campaign-specific logic means a database reactivation push and a speed-to-lead queue can run side by side under different rules.",
    ],
  },
  {
    icon: Database,
    title: "Calls that use your CRM context",
    body: [
      "BlackSync integrates with CRMs including Follow Up Boss, Sierra, and kvCORE, and the agent can use what is already on the record.",
      "Lead name, property address, area of interest, budget, last interaction, assigned agent, prior notes, buyer or seller status, and other CRM fields all feed the conversation. The call lands as a continuation of a relationship your team already has, not a cold call from a stranger.",
    ],
  },
  {
    icon: Repeat,
    title: "Follow-up logic you actually set",
    body: [
      "Persistence is a preference, and teams disagree about it. BlackSync workflows are configured around when to redial, how often to call, when to stop, when to switch campaigns, when to escalate to a human, when to book, when to warm transfer, and how to handle callbacks.",
      "Teams that want more control over outreach frequency, redial logic, and campaign-specific calling behavior may prefer a more configurable platform.",
    ],
  },
  {
    icon: Wallet,
    title: "Spend your budget on conversations, not ringing",
    body: [
      "BlackSync is structured so credits are primarily used when the agent actually reaches and speaks with a lead. No answer, a busy line, and voicemail do not consume the same usage as a real conversation, and a quick hang-up is not counted as a full one.",
      "Working a large old database means a lot of calls that nobody picks up. Pricing that charges the same for those as for live conversations makes reactivation expensive for the wrong reason.",
    ],
  },
  {
    icon: Layers,
    title: "Start small, prove it, then scale",
    body: [
      "You can start with one campaign, one agent, and one segment of your database, then expand once the numbers hold up.",
      "Ylopo's published Platform as a Service Agreement states that a subscription term renews automatically unless a party gives written notice at least ninety days before expiration, and that either party may terminate for convenience on at least ninety days prior written notice, with prepaid fees non-refundable. BlackSync is designed to make it easier to test a smaller pilot and expand based on results.",
    ],
  },
  {
    icon: Gauge,
    title: "Voice quality and response speed",
    body: [
      "A lead decides whether they are talking to a machine in the first few seconds. BlackSync puts real weight on natural conversation, low latency, fast response times, handling interruptions, and conversational pacing.",
      "Custom voices are available, and the target is a call that moves the way a person moves, without the robotic pause before every reply.",
    ],
  },
  {
    icon: Plug,
    title: "It plugs into your stack",
    body: [
      "BlackSync is not trying to replace everything you run. If you already like Follow Up Boss, your lead sources, your ad spend, and the rest of your stack, BlackSync can act as the AI calling and follow-up layer on top of it.",
      "You keep your CRM, your lead flow, and your process. The agent works inside them.",
    ],
  },
];

const TABLE: { feature: string; blacksync: Cell; ylopo: Cell }[] = [
  {
    feature: "Platform focus",
    blacksync: { text: "Custom AI calling and follow-up layer", tone: "yes" },
    ylopo: { text: "Broad real estate marketing and lead generation platform with AI", tone: "neutral" },
  },
  {
    feature: "Custom AI agent workflows",
    blacksync: { text: "Built around your workflow", tone: "yes" },
    ylopo: { text: "Available, more standardized", tone: "neutral" },
  },
  {
    feature: "Custom scripts and objection handling",
    blacksync: { text: "Fully customizable per agent", tone: "yes" },
    ylopo: { text: "Scripts designed per use case and customizable", tone: "neutral" },
  },
  {
    feature: "High-volume outbound calling",
    blacksync: { text: "Yes, core of the platform", tone: "yes" },
    ylopo: { text: "Available, varies by plan and setup", tone: "neutral" },
  },
  {
    feature: "Database reactivation",
    blacksync: { text: "Yes, dedicated campaigns", tone: "yes" },
    ylopo: { text: "Available through AI Text and AI Voice", tone: "neutral" },
  },
  {
    feature: "Expired and FSBO campaigns",
    blacksync: { text: "Yes, dedicated agents", tone: "yes" },
    ylopo: { text: "Not documented publicly, confirm with Ylopo", tone: "neutral" },
  },
  {
    feature: "Redial logic",
    blacksync: { text: "Configurable per campaign", tone: "yes" },
    ylopo: { text: "Available, Ylopo publishes a 90 day calling window", tone: "neutral" },
  },
  {
    feature: "CRM context personalization",
    blacksync: { text: "Yes, uses your fields and notes", tone: "yes" },
    ylopo: { text: "Available, varies by CRM and integration depth", tone: "neutral" },
  },
  {
    feature: "Follow Up Boss integration",
    blacksync: { text: "Yes, alongside Sierra, kvCORE and more", tone: "yes" },
    ylopo: { text: "Yes, and AI Voice currently requires Follow Up Boss", tone: "neutral" },
  },
  {
    feature: "Warm transfers",
    blacksync: { text: "Yes", tone: "yes" },
    ylopo: { text: "Yes, live transfer to agents", tone: "neutral" },
  },
  {
    feature: "Calendar booking",
    blacksync: { text: "Yes", tone: "yes" },
    ylopo: { text: "Available, includes scheduled callbacks", tone: "neutral" },
  },
  {
    feature: "Campaign-specific agents",
    blacksync: { text: "Yes, different agents per campaign", tone: "yes" },
    ylopo: { text: "More standardized, confirm with Ylopo", tone: "neutral" },
  },
  {
    feature: "Flexible pilot option",
    blacksync: { text: "Yes, start with one campaign", tone: "yes" },
    ylopo: { text: "Agreement specifies 90 days written notice to terminate", tone: "neutral" },
  },
  {
    feature: "Pay-for-real-conversation model",
    blacksync: { text: "Yes, credits weighted to live conversations", tone: "yes" },
    ylopo: { text: "Pricing not published, varies by market and setup", tone: "neutral" },
  },
  {
    feature: "Broader marketing and lead generation ecosystem",
    blacksync: { text: "No, BlackSync is the calling layer", tone: "neutral" },
    ylopo: { text: "Strong, including ads, PPC, retargeting and seller tools", tone: "yes" },
  },
];

const BEST_FOR = [
  "You already have a CRM and lead sources you like",
  "You have thousands of old leads sitting in a database",
  "You want AI making hundreds or thousands of calls",
  "You want different agents for different campaigns",
  "You want more control over scripts and calling logic",
  "You want to test one use case before rolling out broadly",
  "You care about voice quality and response speed",
  "You want AI to work around your process instead of changing it",
];

const FAQS = [
  {
    q: "What is the best Ylopo alternative for AI calling?",
    a: "It depends on what you want the AI to do. If you want one platform that handles advertising, lead generation, nurturing and AI together, Ylopo is a strong fit. If you already have lead sources and a CRM you like and you want a highly configurable AI calling and follow-up layer on top of them, BlackSync is built for that. BlackSync lets you build separate agents per campaign, set your own redial and escalation logic, and use your existing CRM context on every call.",
  },
  {
    q: "Does BlackSync integrate with Follow Up Boss?",
    a: "Yes. BlackSync integrates with Follow Up Boss, and also with Sierra, kvCORE, Salesforce, HubSpot and other platforms through native integrations, Zapier and webhooks. Your agent can read lead context from the CRM before the call and write call outcomes, recordings, transcripts, dispositions and tags back afterwards.",
  },
  {
    q: "Can BlackSync call old buyer and seller leads?",
    a: "Yes. Old buyer and seller lead reactivation is one of the most common reasons teams start with BlackSync. You can point an agent at a segment of your database, give it its own script and qualification criteria, and let it work the list. Because credits are weighted toward real conversations, working a large old database does not cost the same as it would if every unanswered call were billed the same way.",
  },
  {
    q: "Can BlackSync run expired listing and FSBO campaigns?",
    a: "Yes. Expired listing and FSBO outreach each get their own agent, with scripts and objection handling written for that conversation. BlackSync also runs circle prospecting, recruiting, appointment reminders, speed to lead and inbound qualification as separate campaigns.",
  },
  {
    q: "Does BlackSync charge for unanswered calls?",
    a: "BlackSync is structured so credits are primarily used when the agent actually reaches and speaks with a lead. No answer, busy lines and voicemails do not consume the same usage as a real conversation, and a quick hang-up is not counted as a full one. Current details are on the pricing page.",
  },
  {
    q: "Can I use BlackSync without replacing my CRM?",
    a: "Yes, and that is the intended setup. BlackSync is the AI calling and follow-up layer, not a replacement for your CRM, your lead sources or your ad spend. If Follow Up Boss and your current lead flow are working, you keep them and BlackSync works inside them.",
  },
  {
    q: "Can BlackSync warm transfer leads to an agent?",
    a: "Yes. When a lead qualifies, the agent can warm transfer them to a live person, book the appointment straight into your calendar, or trigger an alert, depending on the rules you set. Transfer criteria, routing and fallback behavior are configured per campaign.",
  },
  {
    q: "Is BlackSync only for real estate teams?",
    a: "No. Real estate is the largest use case, but BlackSync also runs mortgage and lending, insurance, home services, property management, funeral homes and law firm intake. The platform is industry agnostic because the agent is built around your workflow rather than a fixed template.",
  },
];

const SOURCES = [
  {
    label: "Ylopo Platform as a Service Agreement",
    href: "https://www.ylopo.com/platform-agreement",
    note: "Renewal and termination notice periods",
  },
  {
    label: "Ylopo AI Voice",
    href: "https://www.ylopo.com/ylopo-ai-voice",
    note: "Calling window, live transfers, scheduled callbacks",
  },
  {
    label: "Ylopo AI²",
    href: "https://www.ylopo.com/ai2",
    note: "AI Text and AI Voice, database re-engagement",
  },
  {
    label: "Ylopo FAQ",
    href: "https://www.ylopo.com/faq",
    note: "Pricing approach and contract statements",
  },
];

const INTERNAL_LINKS = [
  { label: "Real Estate AI Solutions", href: "/real-estate-ai-caller" },
  { label: "Real Estate AI Sales Agent", href: "/industry/real-estate" },
  { label: "AI Appointment Setter", href: "/ai-appointment-setter" },
  { label: "AI Lead Qualification Software", href: "/ai-lead-qualification-software" },
  { label: "Expired Listing AI", href: "/expired-listing-ai" },
  { label: "FSBO AI", href: "/fsbo-ai" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book a Demo", href: "/book-demo" },
];

const PATH = "/compare/ylopo-alternative";

export default function ComparePage() {
  usePageMeta({ path: PATH });

  useJsonLd("compare-ylopo-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  useJsonLd("compare-ylopo-breadcrumb", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Comparisons", item: `${SITE_URL}/compare` },
      { "@type": "ListItem", position: 3, name: "Ylopo Alternative", item: `${SITE_URL}${PATH}` },
    ],
  });

  useJsonLd("compare-ylopo-software", {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "BlackSync AI",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "Custom AI voice agents for real estate teams. High-volume outbound calling, CRM context, configurable follow-up logic, and pricing weighted toward real conversations.",
    offers: {
      "@type": "Offer",
      price: "98",
      priceCurrency: "USD",
      url: `${SITE_URL}/pricing`,
    },
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-compare-ylopo">
      <Navbar />

      {/* Hero */}
      <header className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient">
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-7">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <li>Comparisons</li>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <li aria-current="page" className="text-foreground font-medium">
                Ylopo Alternative
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <Eyebrow>BlackSync vs Ylopo</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance"
            data-testid="text-compare-headline"
          >
            Looking for a More Customizable{" "}
            <span className="text-accent-grad">Ylopo Alternative?</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty"
            data-testid="text-compare-subhead"
          >
            BlackSync AI is built for real estate teams that want more control
            over how their AI agents call, follow up, qualify, and work inside
            their existing CRM.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-col sm:flex-row gap-3"
          >
            <BookCallDialog>
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-compare-demo">
                Build My Custom Demo
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </BookCallDialog>
            <Link href="/pricing" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
                data-testid="button-compare-pricing"
              >
                See Pricing
              </Button>
            </Link>
          </motion.div>
        </div>
      </header>

      {/* Positioning */}
      <section className="py-16 md:py-20" aria-labelledby="positioning-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2
              id="positioning-heading"
              className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-5 text-balance"
            >
              Two different jobs, not two versions of the same thing
            </h2>
            <div className="space-y-4 text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
              <p>
                Ylopo is a strong platform. If your priority is a broad real
                estate marketing ecosystem that combines lead generation,
                advertising, nurturing, and AI in one place, it does that well
                and it has the track record to back it up.
              </p>
              <p>
                BlackSync is built for a different situation. It is for teams
                that already have lead sources and a CRM they like, and want a
                highly customized AI calling and follow-up layer built around
                the workflows they already run.
              </p>
              <p className="text-foreground font-medium">
                Ylopo may be the better fit for teams wanting an all-in-one
                marketing ecosystem. BlackSync is built for teams that want a
                more customized AI calling and follow-up layer built around
                their existing workflows.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Differentiators */}
      <section className="py-16 md:py-24 bg-muted/40 border-y border-border" aria-labelledby="diff-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="diff-heading">
            <SectionHeading
              eyebrow="What Is Different"
              title={
                <>
                  Where BlackSync <span className="text-accent-grad">takes a different approach</span>
                </>
              }
              lead="Eight things teams tell us matter most when they are comparing BlackSync and Ylopo."
            />
          </div>

          <div className="grid md:grid-cols-2 gap-6 mt-14">
            {DIFFERENTIATORS.map((d, i) => (
              <Reveal key={d.title} delay={i * 0.05} className="h-full">
                <article
                  className="flex h-full flex-col rounded-2xl border border-card-border bg-card p-6 md:p-7 shadow-sm"
                  data-testid={`card-differentiator-${i}`}
                >
                  <span className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <d.icon className="h-5 w-5" />
                  </span>
                  <h3 className="font-display text-lg md:text-xl font-semibold tracking-tight mb-3 text-pretty">
                    {d.title}
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
                    {d.body.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-12 rounded-2xl border border-card-border bg-card p-6 md:p-8">
              <h3 className="font-display text-lg font-semibold tracking-tight mb-2">
                Campaigns teams run on BlackSync
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                Each of these can be its own agent, with its own script, criteria, and follow-up rules.
              </p>
              <ul className="flex flex-wrap gap-2">
                {CAMPAIGNS.map((c) => (
                  <li
                    key={c}
                    className="inline-flex items-center rounded-full border border-border bg-background px-3 py-1.5 text-xs md:text-sm font-medium text-foreground/85"
                    data-testid={`chip-campaign-${c.toLowerCase().replace(/\s+/g, "-")}`}
                  >
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Comparison table */}
      <section className="py-16 md:py-24" aria-labelledby="table-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div id="table-heading">
            <SectionHeading
              eyebrow="Side by Side"
              title={
                <>
                  BlackSync vs Ylopo <span className="text-accent-grad">at a glance</span>
                </>
              }
              lead="Ylopo does not publish every detail, so anything we could not verify from their own material is marked as such rather than guessed at."
            />
          </div>

          <Reveal delay={0.05}>
            <div className="mt-12 overflow-hidden rounded-2xl border border-card-border bg-card shadow-sm">
              <table className="w-full text-left" data-testid="table-comparison">
                <caption className="sr-only">
                  Feature comparison between BlackSync AI and Ylopo
                </caption>
                <thead className="hidden md:table-header-group">
                  <tr className="border-b border-border bg-muted/50">
                    <th scope="col" className="p-4 font-display text-sm font-semibold w-[30%]">
                      Capability
                    </th>
                    <th scope="col" className="p-4 font-display text-sm font-semibold text-primary w-[35%]">
                      BlackSync AI
                    </th>
                    <th scope="col" className="p-4 font-display text-sm font-semibold w-[35%]">
                      Ylopo
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {TABLE.map((row, i) => (
                    <tr
                      key={row.feature}
                      className="block border-b border-border last:border-0 p-4 md:p-0 md:table-row"
                      data-testid={`row-compare-${i}`}
                    >
                      <th
                        scope="row"
                        className="block text-left font-display text-base font-semibold md:table-cell md:p-4 md:align-top md:text-sm"
                      >
                        {row.feature}
                      </th>
                      <td className="block pt-3 md:table-cell md:p-4 md:align-top md:pt-4">
                        <span className="md:hidden font-mono text-[10px] uppercase tracking-wider text-primary block mb-1">
                          BlackSync AI
                        </span>
                        <span
                          className={`flex items-start gap-2 text-sm ${
                            row.blacksync.tone === "yes"
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {row.blacksync.tone === "yes" && (
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                          {row.blacksync.text}
                        </span>
                      </td>
                      <td className="block pt-3 md:table-cell md:p-4 md:align-top md:pt-4">
                        <span className="md:hidden font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-1">
                          Ylopo
                        </span>
                        <span
                          className={`flex items-start gap-2 text-sm ${
                            row.ylopo.tone === "yes"
                              ? "text-foreground font-medium"
                              : "text-muted-foreground"
                          }`}
                        >
                          {row.ylopo.tone === "yes" && (
                            <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
                          )}
                          {row.ylopo.text}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mt-6 rounded-xl border border-border bg-muted/40 p-5">
              <h3 className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-3">
                Where the Ylopo details come from
              </h3>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {SOURCES.map((s) => (
                  <li key={s.href}>
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer nofollow"
                      className="text-foreground underline underline-offset-2 hover:text-primary transition-colors"
                    >
                      {s.label}
                    </a>{" "}
                    <span className="text-muted-foreground">({s.note})</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-muted-foreground">
                Ylopo is a trademark of its respective owner. BlackSync is not
                affiliated with Ylopo. Details change, so confirm current terms
                with Ylopo directly before making a decision.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Who it is for / when Ylopo wins */}
      <section className="py-16 md:py-24 bg-muted/40 border-y border-border" aria-labelledby="fit-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="fit-heading" className="sr-only">
            Which platform fits your team
          </h2>
          <div className="grid lg:grid-cols-2 gap-6">
            <Reveal className="h-full">
              <article className="h-full rounded-2xl border border-primary/30 bg-card p-7 md:p-9 shadow-sm">
                <Eyebrow>Best fit for BlackSync</Eyebrow>
                <h3 className="mt-5 font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-balance">
                  BlackSync may be the better fit if your team:
                </h3>
                <ul className="space-y-3">
                  {BEST_FOR.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm md:text-base">
                      <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                        <Check className="w-3 h-3 text-primary" />
                      </span>
                      <span className="text-foreground/90 text-pretty">{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>

            <Reveal delay={0.06} className="h-full">
              <article className="h-full rounded-2xl border border-card-border bg-card p-7 md:p-9 shadow-sm">
                <Eyebrow>Best fit for Ylopo</Eyebrow>
                <h3 className="mt-5 font-display text-2xl md:text-3xl font-semibold tracking-tight mb-6 text-balance">
                  When Ylopo may make more sense
                </h3>
                <div className="space-y-4 text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
                  <p>
                    Ylopo may make more sense if your priority is a broader real
                    estate marketing ecosystem that combines lead generation,
                    advertising, nurturing, and AI within one platform.
                  </p>
                  <p>
                    Their strength is breadth. Dynamic listing ads, Google PPC,
                    retargeting, seller valuation tools, and AI text and voice
                    all sit under one roof, which matters a lot if you want one
                    vendor responsible for filling the top of your funnel as
                    well as working it.
                  </p>
                  <p>
                    BlackSync does not do your advertising or generate leads for
                    you. It is more focused on becoming a highly customizable AI
                    calling and sales automation layer on top of the lead flow
                    you already have.
                  </p>
                  <p className="text-foreground font-medium">
                    If you need the whole ecosystem, Ylopo is the stronger
                    answer. If you need the calling layer to bend to your
                    process, that is where BlackSync fits.
                  </p>
                </div>
              </article>
            </Reveal>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2
              id="cta-heading"
              className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-5 text-balance"
            >
              Want to Hear the Difference on Your Own Leads?
            </h2>
            <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8">
              Send us a use case or a small batch of leads and we can show you
              what a BlackSync agent would look like using your workflow, CRM
              context, and qualification rules.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <BookCallDialog>
                <Button size="lg" className="w-full sm:w-auto" data-testid="button-compare-demo-footer">
                  Build My Custom Demo
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
              <Link href="/pricing" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                  data-testid="button-compare-pricing-footer"
                >
                  See Pricing
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted border-y border-border" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2
              id="faq-heading"
              className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance"
            >
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion type="single" collapsible>
              {FAQS.map((f, i) => (
                <AccordionItem key={f.q} value={`faq-${i}`}>
                  <AccordionTrigger data-testid={`compare-faq-question-${i}`}>
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-14 md:py-16" aria-labelledby="explore-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2
              id="explore-heading"
              className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-6"
            >
              Keep exploring
            </h2>
            <ul className="flex flex-wrap gap-2.5">
              {INTERNAL_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
                    data-testid={`link-related-${l.href.replace(/\//g, "-")}`}
                  >
                    {l.label}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
