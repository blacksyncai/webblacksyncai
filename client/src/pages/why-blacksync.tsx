import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { BookCallDialog } from "@/components/book-call-dialog";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { ArrowRight } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/why-blacksync";

const WHAT_WE_DO = [
  "Prospect and qualify new leads over the phone",
  "Reactivate old or dormant leads sitting in your CRM",
  "Book appointments directly onto your calendar",
  "Warm-transfer qualified calls live to your team",
  "Answer inbound calls as a 24/7 front desk",
  "Pull context from your CRM and business systems mid-call",
];

const BUILT_AROUND = [
  "Custom workflows for how your business actually operates",
  "Scripts written around your offer, objections, and process",
  "Live CRM context — not a generic, disconnected script",
  "Integrations with the tools you already run on",
  "A custom voice, not a one-size-fits-all default",
];

const MORE_THAN_COLD_CALLING = [
  "Database reactivation",
  "Outbound prospecting",
  "Inbound receptionist / front desk",
  "Lead qualification",
  "Appointment setting",
  "Follow-up",
  "Call routing",
  "Customer service",
];

const WHO_ITS_FOR = [
  "Real estate teams and brokerages",
  "Home services companies",
  "Mortgage and lending teams",
  "Property management companies",
  "Professional services firms",
  "Any business with meaningful call volume",
];

export default function WhyBlackSyncPage() {
  usePageMeta({ path: PATH });

  useJsonLd("why-blacksync-webpage", {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "Why BlackSync",
    description:
      "BlackSync builds custom AI voice agents around your workflows, CRM, and business processes — for outbound sales, inbound calls, lead follow-up, and appointment booking.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync", url: `${SITE_URL}/` },
    about: { "@type": "Organization", name: "BlackSync", url: `${SITE_URL}/` },
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-why-blacksync">
      <Navbar />

      {/* ============ HERO ============ */}
      <header className="pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <Eyebrow data-testid="badge-why-blacksync">About BlackSync</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h1
              className="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-balance"
              data-testid="text-why-blacksync-h1"
            >
              Why BlackSync
            </h1>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed text-pretty">
              BlackSync is a custom AI voice agent platform built around a company's workflows,
              data, CRM, call logic, and business processes — not a generic bot dropped into your
              phone line. Every deployment is built around how your business actually runs.
            </p>
          </Reveal>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 md:pb-28 space-y-16">
        {/* ============ WHAT IS BLACKSYNC ============ */}
        <section aria-labelledby="what-is-heading">
          <h2 id="what-is-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            What is BlackSync?
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty mb-5">
            BlackSync builds AI voice agents that handle real phone conversations, both inbound
            and outbound. They're built to work the way a good employee would — with context on
            who they're calling, why, and what to do next.
          </p>
          <ul className="space-y-2.5">
            {WHAT_WE_DO.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ============ BUILT AROUND YOUR BUSINESS ============ */}
        <section aria-labelledby="built-around-heading">
          <h2 id="built-around-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Built Around Your Business
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty mb-5">
            BlackSync isn't positioned as one generic agent for everyone. Every deployment starts
            with your business, not a template.
          </p>
          <ul className="space-y-2.5">
            {BUILT_AROUND.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ============ MORE THAN A COLD CALLING TOOL ============ */}
        <section aria-labelledby="more-than-heading">
          <h2 id="more-than-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            More Than a Cold Calling Tool
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty mb-5">
            Outbound prospecting is one job a BlackSync AI voice agent can do — it's not the only
            one. The same platform supports:
          </p>
          <div className="grid grid-cols-2 gap-x-6 gap-y-2.5">
            {MORE_THAN_COLD_CALLING.map((item) => (
              <div key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {item}
              </div>
            ))}
          </div>
        </section>

        {/* ============ HOW BLACKSYNC IS DIFFERENT ============ */}
        <section aria-labelledby="different-heading">
          <h2 id="different-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            How BlackSync Is Different
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty">
            The difference isn't a gimmick — it's what the agent is built around. BlackSync agents
            run on real conversation-based workflows instead of rigid scripts, pull context from
            your CRM and business systems mid-call instead of starting from zero every time, and
            integrate with the tools your team already uses instead of asking you to switch
            systems. The goal is an agent that can represent your business in a call, not one that
            sounds like a generic AI bot reading from a script.
          </p>
        </section>

        {/* ============ WHO IT'S FOR ============ */}
        <section aria-labelledby="who-for-heading">
          <h2 id="who-for-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            Who BlackSync Is For
          </h2>
          <p className="text-base text-muted-foreground leading-relaxed text-pretty mb-5">
            BlackSync is built for businesses with real call volume — first-touch outreach, lead
            follow-up, or inbound that's too much for a small team to keep up with, including:
          </p>
          <ul className="space-y-2.5">
            {WHO_ITS_FOR.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground/90">
                <span className="mt-1.5 h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </section>

        {/* ============ BLACKSYNC AI VOICE AGENTS ============ */}
        <section
          aria-labelledby="agents-heading"
          className="rounded-2xl border border-border bg-card p-8 md:p-10 text-center"
        >
          <h2 id="agents-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight mb-4">
            BlackSync AI Voice Agents
          </h2>
          <p className="max-w-xl mx-auto text-base text-muted-foreground leading-relaxed text-pretty mb-8">
            BlackSync is the company. AI voice agents are the product — custom-built, deployed
            around your business, and designed to work like part of your team from the first call.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <BookCallDialog>
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-why-blacksync-start-free">
                Request a Pilot
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </BookCallDialog>
            <BookCallDialog>
              <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-why-blacksync-book-call">
                Book a Call
              </Button>
            </BookCallDialog>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2.5 text-sm">
            <Link
              href="/ai-sdr"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
              data-testid="link-why-blacksync-ai-sdr"
            >
              AI SDR
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
              data-testid="link-why-blacksync-pricing"
            >
              Pricing
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/industry/real-estate"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
              data-testid="link-why-blacksync-real-estate"
            >
              Real Estate
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/industry/mortgage"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
              data-testid="link-why-blacksync-mortgage"
            >
              Mortgage &amp; Lending
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2 font-medium text-foreground/85 hover:text-foreground hover:border-primary/40 transition-colors"
              data-testid="link-why-blacksync-home"
            >
              Back to Home
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
