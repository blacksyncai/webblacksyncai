import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/section";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
import { BookCallDialog } from "@/components/book-call-dialog";
import {
  ArrowRight,
  Check,
  Truck,
  MapPin,
  MessageSquare,
  Bell,
  Clock,
  Satellite,
  PhoneOff,
  ClipboardCheck,
  Settings2,
  Sparkles,
  Rocket,
  PhoneCall,
} from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/track-desk-ai";

// Pricing tiers are intentionally priceless. Loads/week bands below are a
// starting suggestion from the product brief, not finalized numbers -- final
// pricing is set per pilot. Don't invent a dollar figure here.
const CHECK_CALL_FEATURES = [
  {
    icon: PhoneCall,
    title: "Calls or texts every driver",
    description: "The AI reaches out at pickup and every few hours en route, on the schedule you set — no dispatcher has to dial.",
  },
  {
    icon: MapPin,
    title: "Logs location, loaded status & ETA",
    description: "Every check-in — by call or SMS reply — is parsed and written to the load's timeline automatically.",
  },
  {
    icon: ClipboardCheck,
    title: "Scores On Time, At Risk, or Late",
    description: "ETA is checked against the delivery window after every update, so the board always reflects real status.",
  },
  {
    icon: Bell,
    title: "Alerts you before the shipper calls",
    description: "You're only pinged on the loads that need you — late, unresponsive, or flagged by the driver — with the transcript attached.",
  },
];

const OBJECTION_FEATURES = [
  {
    icon: MessageSquare,
    title: "SMS-first, not call-first",
    description: "Drivers who won't answer an unknown number still get a text. A reply is logged as a check-in — no call needed that round.",
  },
  {
    icon: Clock,
    title: "Never calls during quiet hours",
    description: "No calls between 10pm–6am driver-local time unless a load is already late and you override it. Text only overnight.",
  },
  {
    icon: Satellite,
    title: "GPS-aware, not GPS-replacing",
    description: "Already on MacroPoint, FourKites, or Trucker Tools? Connect it and Track Desk only calls when the feed goes stale or shows a stop — never just to ask what GPS already proves.",
  },
  {
    icon: PhoneOff,
    title: "One text to opt out",
    description: "A driver who replies STOP or asks to stop being called is marked Do Not Call for that load, and you're notified immediately.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Settings2,
    title: "Send us your load list",
    description: "CSV upload or a shared sheet with driver name, phone, and pickup/delivery windows — no TMS integration required to start.",
  },
  {
    step: "2",
    icon: Sparkles,
    title: "We run every check call",
    description: "Pickup, en-route, pre-delivery, and delivery confirmation checks go out on schedule, logged to a live board for every load.",
  },
  {
    step: "3",
    icon: Rocket,
    title: "You see the board, not the dial pad",
    description: "Check status anytime, or just wait for the alert — you're notified the moment a load needs your attention.",
  },
];

type Plan = {
  key: string;
  name: string;
  band: string;
  tagline: string;
  features: string[];
  popular: boolean;
};

const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Starter",
    band: "~50 loads/week",
    tagline: "For a small broker ready to stop dialing drivers themselves.",
    features: [
      "AI check calls: pickup, en-route, pre-delivery, delivery",
      "SMS fallback on every call",
      "Live load board",
      "Email/SMS alerts on late or unresponsive loads",
    ],
    popular: false,
  },
  {
    key: "growth",
    name: "Growth",
    band: "~125 loads/week",
    tagline: "For a broker running real volume — this is where check calls alone start eating dozens of hours a week.",
    features: [
      "Everything in Starter",
      "Higher check-call volume & concurrency",
      "Manual check-in + one-tap call driver from the board",
      "Weekly stats: answer rate, hours saved, late loads flagged early",
    ],
    popular: true,
  },
  {
    key: "scale",
    name: "Scale",
    band: "250+ loads/week",
    tagline: "For a broker with multiple dispatchers and a real volume of active loads.",
    features: [
      "Everything in Growth",
      "Multiple team users & roles",
      "Priority support",
      "First look at GPS/ELD and TMS integrations as they ship",
    ],
    popular: false,
  },
];

const FAQS = [
  {
    q: "Will drivers know they're talking to an AI?",
    a: "Yes. The agent identifies itself as an AI assistant calling on the broker's behalf — it never claims to be human, and it never argues with a driver.",
  },
  {
    q: "What happens if a driver doesn't answer?",
    a: "It leaves a short voicemail with no callback pressure, then sends the same 3 questions by text within 15 minutes. If there's still no reply, it retries the call once and then marks the load Unresponsive and alerts you.",
  },
  {
    q: "Do you replace our GPS or ELD tracking?",
    a: "No. If you already have GPS/ELD tracking connected, Track Desk uses it as the source of truth and only calls when the feed is stale, missing, or shows a stop — it doesn't call just to ask what GPS already proves.",
  },
  {
    q: "Can a driver opt out of being called?",
    a: "Yes — a driver who replies STOP, or asks on a call to stop being contacted, is marked Do Not Call for that load immediately, and you're notified. We never call that driver again for that load.",
  },
  {
    q: "Do you call drivers at night?",
    a: "No. Quiet hours (10pm–6am driver-local time) are respected by default — SMS only overnight, unless a load is already Late and you've explicitly overridden it.",
  },
  {
    q: "Can we try this before committing?",
    a: "Yes — the standard start is a 2-week pilot on one load board. You send your load list, we run the check calls, and you decide from there.",
  },
];

export default function TrackDeskAiPage() {
  usePageMeta({ path: PATH });
  useScrollToHash();

  useJsonLd("track-desk-ai-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "BlackSync Track Desk",
    description:
      "AI check calls for small freight brokers — BlackSync Track Desk calls or texts every driver, logs location and ETA, and alerts the broker only when a load is late or unresponsive.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  useJsonLd("track-desk-ai-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-track-desk-ai">
      <div className="dark">
        <Navbar />
      </div>

      {/* ============ HERO ============ */}
      <header className="relative bg-zinc-950 pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
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
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 mb-7"
            data-testid="badge-track-desk-ai"
          >
            <Truck className="w-3.5 h-3.5 text-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              BlackSync Track Desk
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance text-zinc-50"
            data-testid="text-track-desk-ai-h1"
          >
            Check calls, <span className="text-accent-grad">done for you.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty mb-8"
          >
            BlackSync Track Desk calls or texts every driver on your load board, logs location, loaded status, and
            ETA, and alerts you only when a load is late or unresponsive — before your shipper calls to ask.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <BookCallDialog context="general">
              <Button size="lg" data-testid="button-hero-request-pilot">
                Request a Pilot
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </BookCallDialog>
            <BookCallDialog context="general">
              <Button size="lg" variant="outline" className="border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50" data-testid="button-hero-talk-to-sales">
                Talk to Sales
              </Button>
            </BookCallDialog>
          </motion.div>
        </div>
      </header>

      {/* ============ THE PROBLEM ============ */}
      <section className="py-20 md:py-28" aria-labelledby="problem-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">The Problem</p>
            <h2 id="problem-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              "Where are you?" is a full-time job.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              On every active load, someone has to ask it, over and over — is the driver loaded, where are they now,
              what's the ETA. On a busy load board that's easily dozens of hours a week of dialing, and it's the
              first thing that slips when the phones get busy.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {[
              "A dedicated assistant to run check calls alone can run ~$1,900/month — for one person, one shift.",
              "Drivers screen unknown numbers, so calls go to voicemail and the status update never comes back.",
              "Shippers call to ask where their freight is before the broker even knows it's running late.",
              "Big brokers run AI check-call services like HappyRobot. Small brokers are left dialing by hand.",
            ].map((p) => (
              <div key={p} className="flex items-start gap-3 p-4 rounded-xl bg-card border shadow-sm">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                  <Truck className="w-3 h-3 text-primary" />
                </span>
                <span className="text-sm leading-relaxed">{p}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW TRACK DESK WORKS ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="how-track-desk-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">How Track Desk Works</p>
            <h2 id="how-track-desk-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Every load, checked on — without a dispatcher dialing.
            </h2>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed bg-background sm:grid-cols-2 lg:grid-cols-4">
            {CHECK_CALL_FEATURES.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`check-call-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ BUILT AROUND HOW TRUCKING ACTUALLY WORKS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="objections-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Built For The Road</p>
            <h2 id="objections-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Built around how trucking actually works.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              Drivers don't always answer unknown callers, and plenty of brokers already have GPS. Track Desk is
              designed around both.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 lg:grid-cols-4">
            {OBJECTION_FEATURES.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`objection-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS (onboarding) ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="onboarding-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Getting Started</p>
            <h2 id="onboarding-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Live on your first load board this week.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <Reveal key={item.step} delay={Number(item.step) * 0.06}>
                <div className="relative rounded-2xl border border-border bg-card p-6 h-full" data-testid={`step-${item.step}`}>
                  <span className="font-display text-4xl font-semibold text-primary/25 leading-none">{item.step}</span>
                  <item.icon className="w-5 h-5 text-primary mt-4 mb-3" strokeWidth={1.5} />
                  <h3 className="font-display text-base font-semibold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ PRICING ============ */}
      <section className="py-20 md:py-28" id="pricing" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Pricing</p>
            <h2 id="pricing-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Priced against what you're paying to dial by hand.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              Tiers scale with loads/week, not seats. Final pricing is set per pilot — talk to sales for current
              numbers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan, index) => (
              <Reveal key={plan.key} delay={index * 0.08} className={`h-full ${plan.popular ? "md:scale-[1.03] md:z-10" : ""}`}>
                <Card
                  className={`relative h-full rounded-2xl border bg-card shadow-sm ${
                    plan.popular ? "card-glow border-primary/40 shadow-lg" : ""
                  }`}
                  data-testid={`card-track-desk-plan-${plan.key}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="shadow-md font-mono text-[10px] uppercase tracking-wider px-3 py-1" data-testid="badge-plan-popular">
                        Most Common
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 md:p-7 flex flex-col h-full">
                    <h3 className="font-display text-lg font-semibold tracking-tight mb-2" data-testid={`text-plan-name-${plan.key}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-1">
                      <span className="font-display text-4xl md:text-5xl font-semibold tracking-tight" data-testid={`text-plan-price-${plan.key}`}>
                        Custom
                      </span>
                    </div>
                    <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">{plan.band}</p>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-6">{plan.tagline}</p>

                    <ul className="flex-1 space-y-2.5 mb-6">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-start gap-2.5 text-sm">
                          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                            <Check className="w-3 h-3 text-primary" />
                          </span>
                          <span className="text-foreground/90">{f}</span>
                        </li>
                      ))}
                    </ul>

                    <BookCallDialog context="general">
                      <Button className="w-full mt-auto" size="lg" variant={plan.popular ? "default" : "outline"} data-testid={`button-plan-cta-${plan.key}`}>
                        Talk to Sales
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </BookCallDialog>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            Loads/week bands above are a starting point, not a hard limit — your rep will size a plan to your actual
            board.
          </p>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 id="faq-heading" className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance">
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            {FAQS.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-testid={`track-desk-ai-faq-question-${i}`}>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="relative bg-zinc-950 py-20 md:py-28 overflow-hidden" aria-labelledby="final-cta-heading">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent 75%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 50%, black, transparent 75%)",
          }}
          aria-hidden="true"
        />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <Truck className="w-8 h-8 text-primary mx-auto mb-5" strokeWidth={1.5} />
            <h2 id="final-cta-heading" className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance text-zinc-50 mb-4">
              Stop dialing drivers to find out where they are.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty mb-8 max-w-lg mx-auto">
              Start with a 2-week pilot on one load board — no commitment, no integration required.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <BookCallDialog context="general">
                <Button size="lg" data-testid="button-final-cta-request-pilot">
                  Request a Pilot
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
              <BookCallDialog context="general">
                <Button size="lg" variant="outline" className="border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50" data-testid="button-final-cta-talk-to-sales">
                  Talk to Sales
                </Button>
              </BookCallDialog>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
