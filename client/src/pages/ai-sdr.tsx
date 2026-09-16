import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, XCircle, PhoneCall, Mail, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { BookCallDialog } from "@/components/book-call-dialog";
import { AiSdrAssessment } from "@/components/ai-sdr/assessment";
import { StackDockSection } from "@/components/ai-sdr/stack-dock";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { track } from "@/lib/ai-sdr-funnel-session";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/ai-sdr";

// ---------------------------------------------------------------------------
// Content
// ---------------------------------------------------------------------------

const OPERATING_STRIP = ["Outbound Calls", "Qualified Conversations", "Live Transfers", "Meetings Booked"];

const TRADITIONAL_SDR = [
  "Limited daily call volume",
  "One conversation at a time",
  "Manual follow-up",
  "Ramp time",
  "Turnover",
  "Repetitive qualification",
  "Management overhead",
  "Inconsistent activity",
];

const BLACKSYNC_SDR = [
  "High-volume outbound",
  "Simultaneous calling",
  "Automated re-dials",
  "Persistent follow-up",
  "Consistent qualification",
  "Calendar booking",
  "Live transfers",
  "CRM updates, multiple campaigns",
];

const PIPELINE = [
  {
    n: "01",
    title: "Prospect",
    body: "Connect existing lead lists and CRM segments, or let BlackSync auto-prospect and build new target lists that match your ICP — everything flows into one pipeline.",
  },
  {
    n: "02",
    title: "Personalize",
    body: "BlackSync uses available context to tailor the call around the prospect, campaign, account, or opportunity.",
  },
  {
    n: "03",
    title: "Call",
    body: "The AI SDR handles first-touch outreach, qualification, common objections, and intent detection.",
  },
  {
    n: "04",
    title: "Follow Up",
    body: "No answer, callback request, not ready yet, stale opportunity? BlackSync keeps working the contact automatically.",
  },
  {
    n: "05",
    title: "Hand Off",
    body: "Book a meeting, live transfer, route to the right AE, or trigger the next sales workflow.",
  },
  {
    n: "06",
    title: "Sync",
    body: "Push disposition, notes, recordings, transcripts, and next actions back into the sales system.",
  },
];

const WORKFLOWS = [
  { title: "Prospecting", body: "Call target accounts and qualify interest." },
  { title: "Database Reactivation", body: "Wake up old leads, dormant accounts, and stale opportunities." },
  { title: "Follow-Up", body: "Work callbacks and prospects that were not ready the first time." },
  { title: "Speed to Lead", body: "Respond to inbound leads immediately." },
  { title: "Partner / Dealer Acquisition", body: "Recruit dealers, vendors, brokers, channel partners, or referral partners." },
  { title: "Account Expansion", body: "Reach existing customers around new offers, renewals, or additional services." },
  { title: "Event / Campaign Follow-Up", body: "Call webinar attendees, event leads, content downloads, demo requests, or quote inquiries." },
];

const CHANNELS = [
  {
    title: "Calling",
    body: "Dials leads the moment they hit your pipeline — dozens of lines at once, with automated re-dials until someone picks up.",
  },
  {
    title: "Email",
    body: "Sends a personalized follow-up after every call, nurtures leads that aren't ready yet, and keeps the thread alive until they are.",
  },
  {
    title: "LinkedIn",
    body: "Connects with target accounts, opens conversations, and works replies in the same cadence as your calls and emails.",
  },
  {
    title: "Landing Pages & Funnels",
    body: "Spins up campaign-specific landing pages to capture inbound interest, then routes it straight into outbound follow-up.",
  },
];

const INDUSTRIES = [
  {
    name: "Equipment Finance",
    points: ["Dealer acquisition", "Borrower prospecting", "Lease maturity outreach", "Dormant account reactivation"],
  },
  {
    name: "Commercial Insurance",
    points: ["Renewal-date prospecting", "Business-owner outreach", "Appointment setting", "Old quote follow-up"],
  },
  {
    name: "Logistics / 3PL",
    points: ["Shipper acquisition", "Lane-specific outreach", "Dormant shipper reactivation"],
  },
  {
    name: "Commercial Services",
    points: ["Facility manager prospecting", "Contract renewal outreach", "Quote follow-up"],
  },
  {
    name: "Vertical SaaS",
    points: ["Target account prospecting", "Demo booking", "Event lead follow-up"],
  },
  {
    name: "Staffing",
    points: ["Employer acquisition", "Hiring-demand qualification"],
  },
  {
    name: "Merchant Services",
    points: ["Business acquisition", "Rate-review outreach", "Dormant account reactivation", "Appointment setting"],
  },
  {
    name: "Payroll & HR Services",
    points: ["Target account prospecting", "Demo booking", "Renewal-date outreach", "Event lead follow-up"],
  },
];

const IMPLEMENTATION = [
  { n: "01", body: "We map your ICP, offer, objections, qualification criteria, and handoff." },
  { n: "02", body: "We build and train your AI SDR." },
  { n: "03", body: "We connect your CRM, calendar, lead sources, and routing." },
  { n: "04", body: "We launch controlled campaigns and review real conversations." },
  { n: "05", body: "We optimize scripts, targeting, follow-up logic, and capacity as volume grows." },
];

const OUTCOMES = [
  { label: "Qualified", tone: "primary" },
  { label: "Live Transfer", tone: "primary" },
  { label: "Booked", tone: "primary" },
  { label: "Follow-Up", tone: "neutral" },
  { label: "Not Interested", tone: "neutral" },
] as const;

const ENTERPRISE_CAPABILITIES = [
  "Multiple AI SDRs",
  "Multiple offers",
  "Multiple brands",
  "Territories",
  "Language-specific campaigns",
  "Inbound + outbound",
  "Custom qualification logic",
  "Salesforce / Oracle / CRM integration",
  "Custom APIs",
  "Larger concurrency",
  "Advanced reporting",
  "Dedicated optimization",
];

const FAQS = [
  {
    q: "What is an AI SDR?",
    a: "SDR stands for Sales Development Representative. An AI SDR is a managed AI agent that handles outbound sales development — prospecting, calling, qualifying, following up, and handing off interested prospects — the same job a human Sales Development Representative does, deployed as software your team configures around its own process.",
  },
  {
    q: "Does BlackSync replace our existing SDR team?",
    a: "No. BlackSync is built to run alongside your closers and any SDRs you keep, taking on the repetitive outbound execution — dialing, re-dials, first-touch qualification — so your team's time goes toward conversations that are further along.",
  },
  {
    q: "Can BlackSync work with Salesforce?",
    a: "Yes, natively.",
  },
  {
    q: "Can BlackSync work with Oracle?",
    a: "Yes, via API integration.",
  },
  {
    q: "Can BlackSync integrate with our existing CRM?",
    a: "In most cases, yes — through a native connector, API integration, or a custom workflow layer depending on the system. See the integrations section above for what's available today.",
  },
  {
    q: "Can BlackSync use our existing scripts?",
    a: "Yes. Your scripts, objection handling, and qualification criteria are the starting point for how your AI SDR is built.",
  },
  {
    q: "Can it qualify prospects?",
    a: "Yes. Qualification criteria are configured around your process, not a generic template.",
  },
  {
    q: "Can it handle objections?",
    a: "Yes. Objection handling is trained on the objections your team actually hears.",
  },
  {
    q: "Can it transfer calls live?",
    a: "Yes. When a prospect qualifies, the call can be transferred live to an AE or the right person on your team.",
  },
  {
    q: "Can it book meetings?",
    a: "Yes, directly onto your calendar or your reps' calendars.",
  },
  {
    q: "Can it follow up automatically?",
    a: "Yes. No answer, a callback request, or a stale opportunity all trigger automated follow-up on the schedule you configure.",
  },
  {
    q: "Can it run multiple campaigns?",
    a: "Yes. Different campaigns, territories, offers, and qualification logic can run at the same time.",
  },
  {
    q: "How does pricing work?",
    a: "Deployments are priced based on outbound capacity, campaign complexity, integrations, and workflow requirements. BlackSync supports managed single-agent deployments and larger enterprise configurations.",
  },
  {
    q: "How quickly can we launch?",
    a: "Timeline depends on integration complexity and how many campaigns are launching at once — this is covered on your deployment call.",
  },
];

const INTERNAL_LINKS = [
  { label: "Enterprise", href: "/enterprise" },
  { label: "Real Estate AI Sales Agent", href: "/industry/real-estate" },
  { label: "Mortgage & Lending AI Sales Agent", href: "/industry/mortgage" },
  { label: "AI Cold Caller for Batch Calling", href: "/ai-cold-caller" },
  { label: "How It Works", href: "/#how-it-works" },
];

export default function AiSdrPage() {
  usePageMeta({ path: PATH });

  useJsonLd("ai-sdr-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI SDR for Outbound Sales Teams",
    description:
      "Deploy managed AI SDRs that prospect, qualify, follow up, book meetings, and hand live opportunities to your sales team.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  useJsonLd("ai-sdr-breadcrumb", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "AI SDR", item: `${SITE_URL}${PATH}` },
    ],
  });

  useJsonLd("ai-sdr-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-ai-sdr">
      {/* Navbar is transparent until scrolled, so it inherits the page's text
          color at the top of the page. Every other page has a light hero, so
          that default (near-black) text reads fine; this page's hero is dark,
          so the navbar instance here is scoped to the dark token set -- same
          Navbar component, unmodified, just resolving bg-background/
          text-foreground to their dark values so the logo and links stay
          legible over a dark hero for its entire fixed lifetime on this page. */}
      <div className="dark">
        <Navbar />
      </div>

      {/* ============ HERO — dark, enterprise ============ */}
      <header className="relative bg-zinc-950 pt-28 pb-16 md:pt-36 md:pb-20 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 20%, black, transparent 75%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Breadcrumb" className="mb-7 flex justify-center">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-zinc-500">
              <li>
                <Link href="/" className="hover:text-zinc-300 transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <li aria-current="page" className="text-zinc-300 font-medium">
                AI SDR
              </li>
            </ol>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 mb-7"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              AI Sales Development Representative (SDR)
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance text-zinc-50"
            data-testid="text-hero-headline"
          >
            Add <span className="text-primary">2,500–5,000</span> Outbound Calls a Day
            <br className="hidden sm:block" /> Without Adding Another SDR Team.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-6 text-lg md:text-xl text-zinc-400 leading-relaxed text-pretty max-w-2xl mx-auto"
          >
            First touch, follow-up, qualification, warm transfer to your SDR/BDR team, or direct booking onto AE
            calendars — BlackSync's managed AI SDRs handle it and hand live opportunities to your sales team.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="mt-3 text-sm text-zinc-500"
          >
            Built around your offer, your ICP, your CRM, and your sales process.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-9 flex flex-col sm:flex-row gap-3 justify-center"
          >
            <a href="#assessment" onClick={() => track("ai_sdr_cta_click", { label: "hero_primary" })}>
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-hero-primary">
                Hire My AI SDR
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <a href="#how-it-works" onClick={() => track("ai_sdr_cta_click", { label: "hero_secondary" })}>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50"
                data-testid="button-hero-secondary"
              >
                See How It Works
              </Button>
            </a>
          </motion.div>
        </div>

        {/* Operating strip -- labels only, no fabricated metrics */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="relative mt-16 border-t border-zinc-800"
        >
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-zinc-800">
              {OPERATING_STRIP.map((label) => (
                <div key={label} className="py-6 px-4 text-center">
                  <div className="mx-auto mb-2 h-px w-6 bg-primary" aria-hidden="true" />
                  <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </header>

      {/* ============ STACK DOCK ============ */}
      <StackDockSection />

      {/* ============ HEADCOUNT VS CAPACITY ============ */}
      <section className="py-20 md:py-28" aria-labelledby="capacity-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Headcount vs. Capacity</p>
            <h2
              id="capacity-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              You don't need more headcount.
              <br />
              You need more outbound capacity.
            </h2>
          </div>

          <div className="grid md:grid-cols-2 rounded-2xl border border-border overflow-hidden">
            <div className="p-7 md:p-9 border-b md:border-b-0 md:border-r border-border">
              <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-5">
                Traditional SDR Model
              </p>
              <ul className="space-y-3">
                {TRADITIONAL_SDR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                    <XCircle className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-7 md:p-9 bg-zinc-950">
              <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-5">BlackSync AI SDR</p>
              <ul className="space-y-3">
                {BLACKSYNC_SDR.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-200">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-10 max-w-2xl mx-auto text-center">
            <p className="font-display text-lg md:text-xl font-semibold tracking-tight mb-3 text-balance">
              Keep your closers. Automate the repetitive outbound work around them.
            </p>
            <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
              Your highest-value salespeople should not spend their day dialing, leaving voicemails, chasing
              callbacks, and repeating the same qualification questions. BlackSync handles the outbound execution
              layer so your team spends more time in real sales conversations.
            </p>
          </div>
        </div>
      </section>

      {/* ============ INTERACTIVE FUNNEL ============ */}
      <section className="py-16 md:py-24 bg-zinc-950" aria-label="AI SDR deployment assessment">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Build Your Deployment</p>
            <h2 className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance text-zinc-50">
              Answer six questions. Get a deployment plan.
            </h2>
          </div>
          <div className="dark rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 md:p-10">
            <AiSdrAssessment />
          </div>
        </div>
      </section>

      {/* ============ HOW BLACKSYNC WORKS ============ */}
      <section id="how-it-works" className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="how-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Operating Pipeline</p>
            <h2 id="how-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              How BlackSync Works
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {PIPELINE.map((step) => (
              <div key={step.n} className="rounded-2xl border border-card-border bg-card p-6" data-testid={`pipeline-${step.n}`}>
                <span className="font-mono text-xs text-primary">{step.n}</span>
                <h3 className="font-display text-base font-semibold tracking-tight mt-2 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ONE AI SDR, MULTIPLE JOBS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="workflows-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Deployment Scope</p>
            <h2 id="workflows-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              One AI SDR. Multiple Outbound Workflows.
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {WORKFLOWS.map((w) => (
              <div key={w.title} className="rounded-2xl border border-card-border bg-card p-6" data-testid={`workflow-${w.title}`}>
                <h3 className="font-display text-base font-semibold tracking-tight mb-1.5">{w.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{w.body}</p>
              </div>
            ))}
          </div>

          <p className="mt-10 text-center font-display text-lg md:text-xl font-semibold tracking-tight text-balance">
            You are not buying a bot. You are deploying outbound capacity.
          </p>
        </div>
      </section>

      {/* ============ CHANNELS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="channels-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Every Channel</p>
            <h2
              id="channels-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              One AI SDR. Every Channel Your Prospects Are On.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              Calling is the core of it — but it doesn't work alone.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {CHANNELS.map((c) => (
              <div key={c.title} className="rounded-2xl border border-card-border bg-card p-6" data-testid={`channel-${c.title}`}>
                <h3 className="font-display text-base font-semibold tracking-tight mb-1.5">{c.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INDUSTRIES ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="industries-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Where It Runs</p>
            <h2
              id="industries-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Built for Outbound-Heavy Sales Teams
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {INDUSTRIES.map((ind) => (
              <div key={ind.name} className="rounded-2xl border border-card-border bg-card p-5" data-testid={`industry-${ind.name}`}>
                <h3 className="font-display text-sm font-semibold tracking-tight mb-2">{ind.name}</h3>
                <ul className="space-y-1">
                  {ind.points.map((p) => (
                    <li key={p} className="text-xs text-muted-foreground leading-relaxed">
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ LIVE CALL DEMO ============ */}
      <section className="py-20 md:py-28" aria-labelledby="demo-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-4">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Sample Call</p>
            <h2 id="demo-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              What a First-Touch Call Sounds Like
            </h2>
          </div>
          <p className="text-center text-sm text-muted-foreground mb-12">
            Example: BlackSync deployed inside an equipment finance company.
          </p>

          <div className="rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8" data-testid="call-demo">
            <div className="mb-6 pb-5 border-b border-zinc-800">
              <div className="flex items-center gap-2 mb-4">
                <PhoneCall className="h-4 w-4 text-primary" />
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  AI SDR · Dealer Acquisition
                </span>
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-4" data-testid="live-dialing">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-500">Live Dialing</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-500">
                    <span className="relative flex w-1.5 h-1.5">
                      <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                      <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    </span>
                    90 calls running at once
                  </span>
                </div>
                <div className="space-y-1.5">
                  <DialRow number="(415) 555-0134" status="Ringing · 1" />
                  <DialRow number="(212) 555-0198" status="Ringing · 3" />
                  <DialRow number="(305) 555-0122" status="Connected · Ring 4" connected />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <CallLine speaker="AI SDR — Lilly">Hey Mark, can you hear me?</CallLine>
              <CallLine speaker="Prospect" muted>
                Yeah.
              </CallLine>
              <CallLine speaker="AI SDR — Lilly">
                Perfect. This is Lilly calling with Summit Equipment Finance. Quick reason for the call, we work with
                equipment dealers that want to give customers more financing options without slowing down the sales
                desk. Are you currently using one finance partner, or a few?
              </CallLine>
              <CallLine speaker="Prospect" muted>
                We have a couple.
              </CallLine>
              <CallLine speaker="AI SDR — Lilly">
                Got it. And when a customer doesn't fit your primary lender, do you normally have a second option in
                place, or does the deal usually stall there?
              </CallLine>
              <CallLine speaker="Prospect" muted>
                Depends on the deal.
              </CallLine>
              <CallLine speaker="AI SDR — Lilly">
                Makes sense. That's exactly why I called. Summit works as an additional financing option for deals
                that don't fit cleanly with a dealer's primary lender. If it makes sense, I can connect you with
                someone on the team for a quick conversation.
              </CallLine>
            </div>

            <div className="mt-7 pt-5 border-t border-zinc-800">
              <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-3">This call's outcome</p>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Qualified
                </span>
                <ArrowRight className="h-3.5 w-3.5 text-zinc-600 shrink-0" aria-hidden="true" />
                <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Live Transfer
                </span>
                <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">or</span>
                <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Meeting Booked
                </span>
              </div>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-wider text-zinc-600 mb-2">
                Other calls route to
              </p>
              <div className="flex flex-wrap gap-2">
                {OUTCOMES.filter((o) => o.tone !== "primary").map((o) => (
                  <span
                    key={o.label}
                    className="inline-flex items-center rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-400"
                  >
                    {o.label}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950 p-6 md:p-8" data-testid="followup-email">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-zinc-800">
              <Mail className="h-4 w-4 text-primary" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                Automated Follow-Up · Email
              </span>
            </div>
            <div className="space-y-1.5 mb-4">
              <div className="flex gap-2 text-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600 w-12 shrink-0 pt-0.5">To</span>
                <span className="text-zinc-400">mark@[dealership].com</span>
              </div>
              <div className="flex gap-2 text-xs">
                <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-600 w-12 shrink-0 pt-0.5">Subject</span>
                <span className="text-sm font-semibold text-zinc-100">
                  Great talking, Mark — here's the info you requested
                </span>
              </div>
            </div>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Hey Mark, thanks for hopping on the call. Attached is a quick overview of how Summit works alongside a
              dealer's primary lender, plus next steps to get you in front of the team. Let me know if anything
              comes up before then.
            </p>
            <p className="mt-5 font-mono text-[10px] uppercase tracking-wider text-zinc-600">
              Sent automatically · 3 minutes after the call
            </p>
          </div>

          <p className="mt-8 text-center font-display text-xl sm:text-2xl font-semibold tracking-tight text-balance">
            Lilly doesn't sell BlackSync. <span className="text-primary">She sells for you.</span>
          </p>
        </div>
      </section>

      {/* ============ IMPLEMENTATION ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="implementation-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Implementation</p>
            <h2
              id="implementation-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Not Another Tool Your Team Has to Figure Out.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              BlackSync builds the system around your existing sales process.
            </p>
          </div>

          <ol className="space-y-4">
            {IMPLEMENTATION.map((step) => (
              <li
                key={step.n}
                className="flex items-start gap-4 rounded-xl border border-card-border bg-card p-5"
                data-testid={`implementation-${step.n}`}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-zinc-900 font-mono text-xs font-bold text-primary">
                  {step.n}
                </span>
                <p className="text-sm md:text-base text-foreground/90 leading-relaxed pt-1">{step.body}</p>
              </li>
            ))}
          </ol>

          <p className="mt-8 text-center font-display text-lg md:text-xl font-semibold tracking-tight text-balance">
            We don't hand you software and tell you to configure it. We deploy the outbound system with you.
          </p>
        </div>
      </section>

      {/* ============ SCALE ============ */}
      <section className="py-20 md:py-28 bg-zinc-950" aria-labelledby="scale-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Scale</p>
          <h2 id="scale-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance text-zinc-50">
            Scale Calls Without Scaling Headcount.
          </h2>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm font-mono uppercase tracking-wider text-zinc-400">
            <span className="rounded-full border border-primary/40 bg-primary/10 px-4 py-2 text-primary">1 AI SDR</span>
            <ArrowRight className="h-4 w-4 text-zinc-600 rotate-90 sm:rotate-0" />
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">Multiple Workflows</span>
            <ArrowRight className="h-4 w-4 text-zinc-600 rotate-90 sm:rotate-0" />
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">Thousands of Prospects</span>
            <ArrowRight className="h-4 w-4 text-zinc-600 rotate-90 sm:rotate-0" />
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">Qualified Conversations</span>
            <ArrowRight className="h-4 w-4 text-zinc-600 rotate-90 sm:rotate-0" />
            <span className="rounded-full border border-zinc-700 bg-zinc-900 px-4 py-2">Human Closers</span>
          </div>

          <p className="mt-10 max-w-xl mx-auto text-base text-zinc-400 leading-relaxed text-pretty">
            Designed to handle substantially more outbound activity than a single human rep. Expand capacity through
            additional calling credits, concurrent workflows, territories, and campaigns as your outbound operation
            grows.
          </p>
        </div>
      </section>

      {/* ============ ENTERPRISE DEPLOYMENTS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="enterprise-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-border bg-card p-8 md:p-12 text-center">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Enterprise</p>
            <h2 id="enterprise-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Need an Entire Outbound Layer?
            </h2>

            <ul className="mt-8 grid sm:grid-cols-2 gap-x-8 gap-y-2.5 text-left max-w-lg mx-auto">
              {ENTERPRISE_CAPABILITIES.map((c) => (
                <li key={c} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                  {c}
                </li>
              ))}
            </ul>

            <div className="mt-9">
              <BookCallDialog
                context="enterprise"
                onOpen={() => track("ai_sdr_enterprise_click", { label: "enterprise_section" })}
              >
                <Button size="lg" data-testid="button-talk-enterprise">
                  Talk to Enterprise
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
            </div>
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 md:py-28 bg-zinc-950" aria-labelledby="final-cta-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2
            id="final-cta-heading"
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance text-zinc-50"
          >
            Your Closers Should Be Closing.
          </h2>
          <p className="mt-5 text-base md:text-lg text-zinc-400 leading-relaxed text-pretty max-w-xl mx-auto">
            Build an AI outbound layer that keeps prospecting, qualifying, and following up while your sales team
            focuses on conversations that can actually turn into revenue.
          </p>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <a href="#assessment" onClick={() => track("ai_sdr_cta_click", { label: "final_primary" })}>
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-final-primary">
                Hire My AI SDR
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <BookCallDialog
              context="enterprise"
              onOpen={() => track("ai_sdr_cta_click", { label: "final_secondary" })}
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50"
                data-testid="button-final-secondary"
              >
                Talk to Sales
              </Button>
            </BookCallDialog>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance"
          >
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-testid={`ai-sdr-faq-question-${i}`}>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ INTERNAL LINKS ============ */}
      <section className="py-14 md:py-16 bg-muted/40 border-t border-border" aria-labelledby="explore-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="explore-heading" className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-6">
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
        </div>
      </section>

      <Footer />
    </div>
  );
}

function DialRow({
  number,
  status,
  connected = false,
}: {
  number: string;
  status: string;
  connected?: boolean;
}) {
  return (
    <div className="flex items-center justify-between rounded-lg bg-zinc-900 border border-zinc-800 px-3 py-2">
      <span className="font-mono text-xs text-zinc-400">{number}</span>
      <span
        className={`font-mono text-[10px] uppercase tracking-wider ${connected ? "text-primary" : "text-zinc-500"}`}
      >
        {status}
      </span>
    </div>
  );
}

function CallLine({
  speaker,
  children,
  muted = false,
}: {
  speaker: string;
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className={`flex gap-3 ${muted ? "justify-end" : ""}`}>
      <div className={`max-w-[85%] rounded-xl px-4 py-3 ${muted ? "bg-zinc-800" : "bg-zinc-900 border border-zinc-800"}`}>
        <p className="font-mono text-[9px] uppercase tracking-wider text-zinc-500 mb-1">{speaker}</p>
        <p className="text-sm text-zinc-100 leading-relaxed">{children}</p>
      </div>
    </div>
  );
}
