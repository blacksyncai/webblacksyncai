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
  PhoneIncoming,
  CalendarCheck,
  ClipboardList,
  Bell,
  RotateCcw,
  Users,
  Sparkles,
  Megaphone,
  Target,
  Trees,
  Home as HomeIcon,
  Wind,
  Wrench,
  Settings2,
  Rocket,
  PhoneCall,
} from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/front-desk-ai";

// ---------------------------------------------------------------------
// Pricing placeholders. The Growth plan's overage price and the Custom
// tier's implementation fee are NOT finalized -- clearly-labeled
// placeholders, not invented numbers. Swap once real figures are decided;
// everything else in the plan objects below is safe to edit freely.
// ---------------------------------------------------------------------
const OVERAGE_PLACEHOLDER = "Additional credits available a la carte (pricing TBD)";
const CUSTOM_FEE_PLACEHOLDER = "One-time implementation fee (custom quote) + monthly service & usage";

const INBOUND_FEATURES = [
  {
    icon: PhoneIncoming,
    title: "Answers every call, 24/7",
    description: "Nights, weekends, mid-job — every inbound call gets picked up, not sent to voicemail.",
  },
  {
    icon: ClipboardList,
    title: "Qualifies the request",
    description: "Collects the customer's name, number, address, and what they need done.",
  },
  {
    icon: CalendarCheck,
    title: "Books the estimate",
    description: "Checks your availability and gets it on the calendar without you touching your phone.",
  },
  {
    icon: Bell,
    title: "Notifies you instantly",
    description: "You get the call summary and next steps the moment it happens — nothing sits in a voicemail box.",
  },
];

const OUTBOUND_FEATURES = [
  {
    icon: RotateCcw,
    title: "Old estimate follow-up",
    description: "Calls back through quotes that went quiet and gets a real answer — yes, no, or reschedule.",
  },
  {
    icon: Users,
    title: "Past customer reactivation",
    description: "Reaches out to customers you haven't serviced in a while before a competitor does.",
  },
  {
    icon: Megaphone,
    title: "Seasonal promotions",
    description: "Calls your list with a seasonal offer — like 10% off for returning customers — at the right time of year.",
  },
  {
    icon: Target,
    title: "New prospect calling",
    description: "Works a list of new leads or cold prospects with a personalized, natural conversation.",
  },
];

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Settings2,
    title: "Tell us about your business",
    description: "Your services, service area, availability, and how you want calls and jobs handled.",
  },
  {
    step: "2",
    icon: Sparkles,
    title: "We build & connect your agent",
    description: "Our team sets up your AI Front Desk agent and connects your phone number and calendar — no technical setup on your end.",
  },
  {
    step: "3",
    icon: Rocket,
    title: "Go live",
    description: "Calls start getting answered, qualified, and booked. Add outbound campaigns whenever you're ready.",
  },
];

const INDUSTRY_USE_CASES = [
  {
    icon: Trees,
    title: "Landscaping",
    description: "Books spring cleanups and recurring mowing routes, and calls last year's customers before the season starts.",
  },
  {
    icon: HomeIcon,
    title: "Roofing",
    description: "Qualifies storm-damage calls with urgency, books inspections, and follows up on estimates that went quiet.",
  },
  {
    icon: Wind,
    title: "HVAC",
    description: "Catches after-hours no-heat/no-cool emergencies and books maintenance plan renewals before they lapse.",
  },
  {
    icon: Wrench,
    title: "Plumbing",
    description: "Answers urgent calls day or night, qualifies the job, and reactivates customers due for a check-up.",
  },
];

const FAQS = [
  {
    q: "How fast can this be set up?",
    a: "An expert on our team builds and connects your agent for you — most businesses are live within a few business days of signing up. You don't configure anything yourself.",
  },
  {
    q: "Do I need a new phone number, or can I use my existing one?",
    a: "In most cases we can work with your existing business number. We'll walk you through the options that make sense for your phone carrier during setup.",
  },
  {
    q: "What happens to calls the AI can't handle?",
    a: "The agent is built around your instructions for what to do with edge cases — that can include warm-transferring the call to you or your team, or taking a detailed message and notifying you immediately.",
  },
  {
    q: "What's a \"credit\" and what happens if I go over my monthly allowance?",
    a: "A credit represents one real conversation (a call that's actually answered and handled — missed calls, busy signals, and voicemails don't count). If you go over your plan's monthly allowance, additional credits are available separately rather than cutting off calls.",
  },
  {
    q: "Can I customize what the agent says and does?",
    a: "The Front Desk Starter plan is a standardized, easy-to-onboard setup. The Growth and Custom Buildout plans support more customization — from outbound campaign scripts to fully custom workflows built around how your business operates.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes — both the Starter and Growth plans are month-to-month with no long-term contract. Cancel anytime.",
  },
];

type Plan = {
  key: string;
  name: string;
  price: string;
  period: string;
  tagline: string;
  features: string[];
  footnote?: string;
  popular: boolean;
  cta: string;
  ctaVariant: "default" | "outline";
};

const PLANS: Plan[] = [
  {
    key: "starter",
    name: "Front Desk Starter",
    price: "$49",
    period: "/mo",
    tagline: "For solo operators and small businesses that want a simple, affordable answering service.",
    features: [
      "24/7 AI answering",
      "Basic customer intake & qualification",
      "Collects name, number, address & service request",
      "Email notifications & call summaries",
      "1 AI agent, 1 phone number",
    ],
    footnote: "Advanced customization, outbound campaigns, and complex integrations aren't included at this tier.",
    popular: false,
    cta: "Get Started",
    ctaVariant: "outline",
  },
  {
    key: "growth",
    name: "Front Desk + Growth",
    price: "$125",
    period: "/mo",
    tagline: "Everything in Starter, plus outbound campaigns that go find you more jobs.",
    features: [
      "Everything in Starter",
      "Automated outbound calling campaigns",
      "Old quote & estimate follow-up",
      "Past customer reactivation",
      "Seasonal promotions (e.g. 10% off for returning customers)",
      "Cold prospecting campaigns",
      "Personalized calls using customer/lead info",
      "Calendar integration & appointment booking",
      "CSV contact uploads",
      "Campaign reporting & lead notifications",
    ],
    footnote: OVERAGE_PLACEHOLDER,
    popular: true,
    cta: "Get Started",
    ctaVariant: "default",
  },
  {
    key: "custom",
    name: "Custom AI Buildout",
    price: "Custom",
    period: "",
    tagline: "For larger businesses that need more sophisticated workflows, integrations, and ongoing management.",
    features: [
      "Custom inbound & outbound AI agents",
      "CRM integrations",
      "Advanced lead qualification",
      "Multiple agents & locations",
      "Custom appointment scheduling & routing",
      "Lead sourcing & automated prospecting",
      "Multi-step follow-up sequences",
      "Ongoing campaign management & optimization",
      "Dedicated implementation & support",
    ],
    footnote: CUSTOM_FEE_PLACEHOLDER,
    popular: false,
    cta: "Talk to Sales",
    ctaVariant: "outline",
  },
];

export default function FrontDeskAiPage() {
  usePageMeta({ path: PATH });
  useScrollToHash();

  useJsonLd("front-desk-ai-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "BlackSync Front Desk AI",
    description:
      "AI front desk and answering service for home service businesses — answers every call, books estimates, and grows your job pipeline with outbound calling. Starting at $49/month.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  useJsonLd("front-desk-ai-faq", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-front-desk-ai">
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
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.div
            animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-[4%] w-40 h-40 md:w-56 md:h-56 rounded-full opacity-60 blur-[2px]"
            style={{
              background: "radial-gradient(circle at 32% 28%, #ffe2cf 0%, #f08a4f 42%, #c5491f 74%, #8f300f 100%)",
            }}
          />
          <motion.div
            animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
            transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-[38%] right-[2%] w-28 h-28 md:w-40 md:h-40 rounded-full opacity-40 blur-[2px]"
            style={{
              background: "radial-gradient(circle at 34% 30%, #fff0d8 0%, #f4b56a 44%, #d98a35 76%, #a8631f 100%)",
            }}
          />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 mb-7"
            data-testid="badge-front-desk-ai"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              BlackSync Front Desk AI
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance text-zinc-50"
            data-testid="text-front-desk-ai-h1"
          >
            Never miss another <span className="text-accent-grad">job.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty mb-8"
          >
            An AI front desk built for home service businesses — answers every call, qualifies the job, books the
            estimate, and calls out to bring in more work. Starting at <span className="text-zinc-100 font-medium">$49/month</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3"
          >
            <BookCallDialog context="general">
              <Button size="lg" data-testid="button-hero-get-started">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </BookCallDialog>
            <BookCallDialog context="general">
              <Button size="lg" variant="outline" className="border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50" data-testid="button-hero-book-demo">
                Book a Demo
              </Button>
            </BookCallDialog>
          </motion.div>
        </div>
      </header>

      {/* ============ INBOUND FRONT DESK ============ */}
      <section className="py-20 md:py-28" aria-labelledby="inbound-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Inbound Front Desk</p>
            <h2
              id="inbound-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Someone's always answering the phone.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              While you're on a job, in the truck, or off the clock — your Front Desk AI is picking up, qualifying
              the request, and getting it on your calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 lg:grid-cols-4">
            {INBOUND_FEATURES.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`inbound-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ OUTBOUND GROWTH ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="outbound-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Outbound Growth</p>
            <h2
              id="outbound-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Go find the jobs that got away.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              Hundreds of personalized calls to the people most likely to book — old quotes, past customers, and
              new prospects. Complements the Front Desk, doesn't replace it.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed bg-background sm:grid-cols-2 lg:grid-cols-4">
            {OUTBOUND_FEATURES.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`outbound-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="how-it-works-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">How It Works</p>
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Live in a few days, not months.
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
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" id="pricing" aria-labelledby="pricing-heading">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Pricing</p>
            <h2
              id="pricing-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Simple pricing, built for home service businesses.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan, index) => (
              <Reveal key={plan.key} delay={index * 0.08} className={`h-full ${plan.popular ? "md:scale-[1.03] md:z-10" : ""}`}>
                <Card
                  className={`relative h-full rounded-2xl border bg-card shadow-sm ${
                    plan.popular ? "card-glow border-primary/40 shadow-lg" : ""
                  }`}
                  data-testid={`card-front-desk-plan-${plan.key}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                      <Badge className="shadow-md font-mono text-[10px] uppercase tracking-wider px-3 py-1" data-testid="badge-plan-popular">
                        Most Popular
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 md:p-7 flex flex-col h-full">
                    <h3 className="font-display text-lg font-semibold tracking-tight mb-2" data-testid={`text-plan-name-${plan.key}`}>
                      {plan.name}
                    </h3>
                    <div className="flex items-baseline gap-1.5 mb-3">
                      <span className="font-display text-4xl md:text-5xl font-semibold tracking-tight" data-testid={`text-plan-price-${plan.key}`}>
                        {plan.price}
                      </span>
                      {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                    </div>
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

                    {plan.footnote && (
                      <p className="text-xs text-muted-foreground/80 mb-6 leading-relaxed">{plan.footnote}</p>
                    )}

                    <BookCallDialog context="general">
                      <Button className="w-full mt-auto" size="lg" variant={plan.ctaVariant} data-testid={`button-plan-cta-${plan.key}`}>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4 ml-1.5" />
                      </Button>
                    </BookCallDialog>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>

          <p className="mt-8 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
            Exact overage pricing shown above is a placeholder pending final decision — ask your rep for current
            numbers.
          </p>
        </div>
      </section>

      {/* ============ INDUSTRY USE CASES ============ */}
      <section className="py-20 md:py-28" aria-labelledby="industries-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Built For Your Trade</p>
            <h2
              id="industries-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Works the way your business runs.
            </h2>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 lg:grid-cols-4">
            {INDUSTRY_USE_CASES.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`industry-usecase-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="faq-heading">
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
                <AccordionTrigger data-testid={`front-desk-ai-faq-question-${i}`}>{f.q}</AccordionTrigger>
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
            <PhoneCall className="w-8 h-8 text-primary mx-auto mb-5" strokeWidth={1.5} />
            <h2
              id="final-cta-heading"
              className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance text-zinc-50 mb-4"
            >
              Stop losing jobs to voicemail.
            </h2>
            <p className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty mb-8 max-w-lg mx-auto">
              Get your Front Desk AI built and connected — starting at $49/month.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <BookCallDialog context="general">
                <Button size="lg" data-testid="button-final-cta-get-started">
                  Get Started
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
              <BookCallDialog context="general">
                <Button size="lg" variant="outline" className="border-zinc-600 text-zinc-200 bg-transparent hover:bg-zinc-800 hover:text-zinc-50" data-testid="button-final-cta-book-demo">
                  Book a Demo
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
