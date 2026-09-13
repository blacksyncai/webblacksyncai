import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { LeadGenAssessment } from "@/components/lead-funnel/assessment";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { track } from "@/lib/lead-funnel-session";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/real-estate-lead-generation";

const CONTENT_SECTIONS: { title: string; body: string[] }[] = [
  {
    title: "What Real Estate Lead Generation Actually Means",
    body: [
      "Real estate lead generation is the marketing work that gets a new buyer or seller opportunity in front of you — ads, search, a landing page, and the tracking that ties a click back to a person. It's different from lead qualification, which is what happens after you already have a name and number.",
      "Zillow and Realtor.com leads are lead generation you're renting. Building your own — through Meta, Google, and a funnel you own — means the lead, the data, and the relationship are yours from the first click.",
    ],
  },
  {
    title: "Buyer vs Seller Lead Generation",
    body: [
      "Seller lead generation runs on intent signals: someone researching their home's value, looking at 'how to sell my house,' or matching a demographic likely to sell (downsizers, recent inheritance, long-time owners). It converts on home valuation offers and neighborhood-specific creative.",
      "Buyer lead generation runs on search and browsing behavior: people actively looking at listings, searching specific neighborhoods, or researching first-time buyer programs. It converts on property search tools and new listing alerts more than on a generic 'contact an agent' form.",
      "The targeting, ad creative, and landing page are different for each — a campaign built for one rarely performs well for the other.",
    ],
  },
  {
    title: "Choosing the Right Acquisition Channel",
    body: [
      "There's no single best channel — the right one depends on your objective, your budget, and how fast you need results. Search-based channels (Google) capture people already looking; social channels (Meta) reach people who match your target before they've started searching.",
      "Smaller budgets do better concentrated on one or two channels run well than split thin across five. Once a channel is proven, adding a second one — usually retargeting — extends it rather than replacing it.",
    ],
  },
  {
    title: "Meta vs Google for Real Estate Leads",
    body: [
      "Google Search reaches people typing 'homes for sale in [city]' or 'what's my home worth' — high intent, but limited by how many people are actively searching that month. Cost per click is usually higher, and cost per appointment is often lower because the intent is already there.",
      "Meta reaches people who match your target profile based on behavior and demographics, whether or not they're actively searching yet. Volume is typically higher and cost per lead lower, but more of those leads are earlier in the process and need more follow-up before they're ready to talk.",
      "Most agents do better running both than picking one — Google for intent, Meta for volume — once the budget supports it.",
    ],
  },
  {
    title: "Why Lead Quality Matters More Than Raw Lead Volume",
    body: [
      "A hundred leads that never answer the phone cost more in wasted follow-up time than fifty leads that do. Cost per lead is the number that gets quoted; cost per appointment and cost per closed transaction are the numbers that actually matter to your business.",
      "Lead quality comes from targeting and creative that pre-qualify before the click — a home valuation ad attracts a different person than a generic 'thinking about selling?' ad, even though both count as one lead.",
    ],
  },
  {
    title: "How Much Should Real Estate Agents Invest in Lead Generation?",
    body: [
      "There's no universal number — it depends on your market's cost per click, your transaction value, and how many opportunities you need. An agent closing $10K+ per transaction can justify a higher acquisition cost per lead than one closing $5K deals.",
      "As a starting point: enough budget to run one channel consistently for 60–90 days beats a larger budget spread across several channels for two weeks. Underfunded tests get shut down before they have enough data to read.",
    ],
  },
  {
    title: "DIY vs Done-For-You Real Estate Lead Generation",
    body: [
      "Building it yourself means you control the timeline and keep 100% of the budget in ad spend, but you're also the one setting up tracking, writing ad creative, and reading the data to know what to adjust. It works well for agents who already have some marketing experience or the time to learn.",
      "Done-for-you means someone else builds, launches, and optimizes the system — campaigns, funnels, tracking, and the ongoing adjustments that come from watching the data. It costs more than the ad spend alone, but removes the setup and the learning curve.",
    ],
  },
  {
    title: "How BlackSync Builds a Lead Generation Strategy Around the Market",
    body: [
      "The assessment above is the starting point, not the finished plan — it's how we learn your market, your objective, your current channels, and your budget before recommending anything. A seller-focused strategy in a competitive metro looks different from a buyer-focused strategy in a smaller market, and the acquisition mix reflects that rather than a fixed template.",
      "For teams that already have AI calling or lead qualification in place, this is the piece upstream of it — new opportunities generated through marketing, not leads you already have. See BlackSync's AI lead qualification if the leads are already coming in and the gap is what happens after the click.",
    ],
  },
];

const FAQS = [
  {
    q: "How does real estate lead generation work?",
    a: "It combines targeted advertising (Meta, Google, or both), a landing page or funnel built for a specific offer, and tracking that connects a click to a lead. The mix that works depends on your market, your objective, and your budget — which is what the assessment above is built to figure out.",
  },
  {
    q: "Can BlackSync generate buyer and seller leads?",
    a: "Yes. Seller and buyer lead generation use different targeting, creative, and landing pages, and BlackSync builds each around the specific opportunity you're after rather than one generic campaign for both.",
  },
  {
    q: "What is the difference between buyer and seller lead generation?",
    a: "Seller lead generation targets homeowners and converts on offers like a home valuation. Buyer lead generation targets active searchers and converts on property search and listing alerts. The campaigns, ad creative, and landing pages are built differently for each.",
  },
  {
    q: "Should real estate agents use Meta Ads or Google Ads?",
    a: "It depends on your budget and your priority. Google Search reaches people already searching with intent, usually at a higher cost per click but a lower cost per appointment. Meta reaches a broader audience at higher volume and typically lower cost per lead, with more of those leads earlier in the process. Most agents eventually run both — which one first usually comes down to budget and the problem you're solving for.",
  },
  {
    q: "How much should I spend on real estate lead generation?",
    a: "Enough to run one channel consistently for 60–90 days before judging it. The right number depends on your market's cost per click and what a closed transaction is worth to you — the assessment above factors both in before recommending a channel mix.",
  },
  {
    q: "Can BlackSync build the campaigns for me?",
    a: "Yes — that's the Done-For-You path. BlackSync builds the strategy, campaign architecture, advertising setup, funnels, tracking, and attribution, and handles ongoing optimization.",
  },
  {
    q: "Can I use the strategy and build it myself?",
    a: "Yes — that's the Build It With Me path. You get the recommended strategy, targeting, funnel structure, and tracking setup to implement on your own.",
  },
  {
    q: "How long does it take to launch a real estate lead generation campaign?",
    a: "For the Done-For-You path, campaign setup and launch typically follows strategy approval within the timeframe discussed on your strategy call — it depends on ad account status, creative turnaround, and how many channels are launching at once.",
  },
];

const INTERNAL_LINKS = [
  { label: "Real Estate AI Sales Agent", href: "/industry/real-estate" },
  { label: "Real Estate AI Caller", href: "/real-estate-ai-caller" },
  { label: "AI Lead Qualification Software", href: "/ai-lead-qualification-software" },
  { label: "AI Cold Caller for Batch Calling", href: "/ai-cold-caller" },
  { label: "Pricing", href: "/pricing" },
  { label: "Book a Demo", href: "/book-demo" },
];

export default function RealEstateLeadGenerationPage() {
  usePageMeta({ path: PATH });

  useJsonLd("re-leadgen-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Real Estate Lead Generation, Built Around Your Market",
    description:
      "Answer a few questions and build a personalized real estate lead generation strategy around your market, lead type, growth goals, and budget.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  useJsonLd("re-leadgen-breadcrumb", {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Real Estate Lead Generation", item: `${SITE_URL}${PATH}` },
    ],
  });

  useJsonLd("re-leadgen-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-real-estate-lead-generation">
      <Navbar />

      {/* Hero */}
      <header className="relative pt-28 pb-10 md:pt-36 md:pb-12 hero-gradient">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <nav aria-label="Breadcrumb" className="mb-6 flex justify-center">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
              <li>
                <Link href="/" className="hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <li aria-current="page" className="text-foreground font-medium">
                Real Estate Lead Generation
              </li>
            </ol>
          </nav>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <Eyebrow>Real Estate Marketing</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.05] text-balance"
            data-testid="text-hero-headline"
          >
            Real Estate Lead Generation,{" "}
            <span className="text-accent-grad">Built Around Your Market</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="mt-6 text-lg md:text-xl text-muted-foreground leading-relaxed text-pretty"
          >
            Answer a few questions and build a personalized lead generation strategy around your market, the
            opportunities you want, your growth goals, and your budget.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="mt-8 flex flex-col items-center gap-3"
          >
            <a
              href="#assessment"
              onClick={() => track("real_estate_lead_funnel_started")}
              data-testid="button-start-assessment"
            >
              <Button size="lg">
                Build My Lead Generation Plan
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
            <p className="text-xs text-muted-foreground">Takes about 2 minutes · Personalized to your business</p>
          </motion.div>

          <motion.a
            href="#assessment"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, y: [0, 6, 0] }}
            transition={{ opacity: { duration: 0.6, delay: 0.6 }, y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 0.6 } }}
            className="mt-9 inline-flex flex-col items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
            data-testid="link-scroll-hint"
          >
            <span className="font-mono text-[10px] uppercase tracking-wider">13 quick questions</span>
            <ChevronDown className="h-4 w-4" aria-hidden="true" />
          </motion.a>
        </div>
      </header>

      {/* Assessment -- a distinct "live tool" surface, not another content card */}
      <section className="relative py-10 md:py-16 overflow-hidden" aria-label="Lead generation assessment">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.05] via-transparent to-primary/[0.04]" />
          <div className="absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-orange-300/10 blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-[2rem] border-2 border-primary/15 bg-gradient-to-b from-card to-card/95 p-6 md:p-10 shadow-[0_0_0_1px_hsl(var(--primary)/0.06),0_24px_60px_-24px_hsl(var(--primary)/0.25)]">
            <LeadGenAssessment />
          </div>
        </div>
      </section>

      {/* Crawlable supporting content */}
      <section className="py-16 md:py-24 bg-muted/40 border-y border-border" aria-labelledby="learn-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="learn-heading" className="sr-only">
            Real estate lead generation, explained
          </h2>
          <div className="space-y-14">
            {CONTENT_SECTIONS.map((section) => (
              <Reveal key={section.title}>
                <article>
                  <h3 className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-4 text-balance">
                    {section.title}
                  </h3>
                  <div className="space-y-3 text-sm md:text-base text-muted-foreground leading-relaxed text-pretty">
                    {section.body.map((p) => (
                      <p key={p.slice(0, 40)}>{p}</p>
                    ))}
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24" aria-labelledby="faq-heading">
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
                  <AccordionTrigger data-testid={`leadgen-faq-question-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Internal links */}
      <section className="py-14 md:py-16 bg-muted/40 border-t border-border" aria-labelledby="explore-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
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
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
