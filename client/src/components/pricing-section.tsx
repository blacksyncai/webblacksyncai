import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Zap, CreditCard, Puzzle, ShieldCheck } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

const creditFairness = [
  "No answer? 0 credits.",
  "Busy line? 0 credits.",
  "Voicemail? 0 credits.",
  "Quick hang-up? We don't count it as a full conversation.",
];

const plans = [
  {
    name: "Solo Agent",
    price: "$98",
    originalPrice: "$125",
    discountNote: "Save $27/mo · Founding rate",
    period: "/mo",
    tag: "Self-Serve",
    features: [
      "1 AI voice agent",
      "AI agent builder",
      "Calendar booking",
      "500 outbound calls/mo",
      "Unlimited SMS & email",
      "Call recordings + transcripts",
      "Zapier/webhook",
      "Email support",
    ],
    popular: false,
    checkoutUrl: "https://square.link/u/JzEAvDnq",
    cta: "Get Started",
  },
  {
    name: "Team",
    price: "$296",
    originalPrice: "$399",
    discountNote: "Save $103/mo · Founding rate",
    period: "/mo",
    tag: "Most Popular",
    features: [
      "Up to 5 AI voice agents",
      "Everything in Solo",
      "Emotion detection + tone mirroring",
      "Native CRM sync",
      "Custom objection handling",
      "Round-robin",
      "Advanced analytics",
      "Priority support",
    ],
    popular: true,
    checkoutUrl: "https://square.link/u/idJmGOmO",
    cta: "Get Started",
  },
  {
    name: "Enterprise",
    price: "Custom",
    originalPrice: null,
    discountNote: null,
    period: "",
    tag: "White Glove",
    features: [
      "Unlimited agents",
      "Unlimited calls",
      "Dedicated account manager",
      "Custom AI voice persona",
      "Full CRM + workflow",
      "White-label",
      "Custom AI training",
      "Weekly reviews",
      "API access & SLA",
    ],
    popular: false,
    checkoutUrl: null,
    cta: "Talk to Sales",
  },
];

const credits = [
  {
    amount: "500 Credits",
    price: "$197",
    detail: "~500 minutes",
    highlight: false,
  },
  {
    amount: "1,000 Credits",
    price: "$350",
    detail: "Best value",
    highlight: true,
  },
  {
    amount: "3,000 Credits",
    price: "$800",
    detail: "High-volume",
    highlight: false,
  },
];

const addons = [
  {
    title: "Expert Dev Build",
    description:
      "Our team builds your entire AI agent from scratch — scripts, objection flows, CRM connections, calendar routing, and testing. You describe what you need, we deliver a production-ready agent.",
    pricing: "One-time fee",
    icon: Zap,
  },
  {
    title: "Workflow Automation",
    description:
      "We design and build your full automation pipeline — lead routing, follow-up sequences, CRM updates, notifications, and multi-step workflows using Zapier, Make.com, or native integrations.",
    pricing: "One-time fee",
    icon: Puzzle,
  },
  {
    title: "CRM Sync + Agentic AI",
    description:
      "Deep two-way CRM integration with agentic AI that autonomously updates records, triggers actions, and manages lead status across your entire pipeline without manual intervention.",
    pricing: "Contact for pricing",
    icon: CreditCard,
  },
];

export function PricingSection() {
  function handlePlanClick(plan: (typeof plans)[0]) {
    if (plan.checkoutUrl) {
      window.location.href = plan.checkoutUrl;
    } else {
      document
        .getElementById("enterprise")
        ?.scrollIntoView({ behavior: "smooth" });
    }
  }

  return (
    <section
      id="pricing"
      data-testid="section-pricing"
      className="py-20 md:py-28 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div data-testid="badge-pricing">
          <SectionHeading
            eyebrow="Pricing"
            title={
              <>
                Less Than a <span className="text-accent-grad">Part-Time ISA</span>
              </>
            }
            lead="No hidden fees. Cancel anytime. Phone number from $3.50/mo."
          />
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto mt-16 items-stretch">
          {plans.map((plan, index) => (
            <Reveal
              key={plan.name}
              delay={index * 0.08}
              className={`h-full ${plan.popular ? "md:scale-[1.03] md:z-10" : ""}`}
            >
              <Card
                className={`relative h-full rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow ${
                  plan.popular ? "card-glow border-primary/40 shadow-lg" : ""
                }`}
                data-testid={`card-pricing-${index}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-20">
                    <Badge
                      className="shadow-md font-mono text-[10px] uppercase tracking-wider px-3 py-1"
                      data-testid="badge-most-popular"
                    >
                      Most Popular
                    </Badge>
                  </div>
                )}
                <CardContent className="p-6 md:p-7 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="flex items-center gap-2 flex-wrap mb-3">
                      <h3
                        className="font-display text-lg font-semibold tracking-tight"
                        data-testid={`text-plan-name-${index}`}
                      >
                        {plan.name}
                      </h3>
                      <Badge
                        variant="outline"
                        className="font-mono text-[10px] uppercase tracking-wider"
                        data-testid={`badge-plan-tag-${index}`}
                      >
                        {plan.tag}
                      </Badge>
                    </div>
                    <div className="flex items-baseline gap-2 flex-wrap">
                      <span
                        className="font-display text-4xl md:text-5xl font-semibold tracking-tight"
                        data-testid={`text-plan-price-${index}`}
                      >
                        {plan.price}
                      </span>
                      {plan.period && (
                        <span className="text-muted-foreground text-sm">
                          {plan.period}
                        </span>
                      )}
                      {plan.originalPrice && (
                        <span
                          className="text-base text-muted-foreground line-through"
                          data-testid={`text-plan-original-price-${index}`}
                        >
                          {plan.originalPrice}
                        </span>
                      )}
                    </div>
                    {plan.discountNote && (
                      <p
                        className="text-xs text-primary font-medium mt-2"
                        data-testid={`text-plan-discount-${index}`}
                      >
                        {plan.discountNote}
                      </p>
                    )}
                  </div>
                  <ul className="flex-1 space-y-3 mb-7">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-sm">
                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                          <Check className="w-3 h-3 text-primary" />
                        </span>
                        <span className="text-foreground/90">{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="w-full"
                    size="lg"
                    variant={plan.popular ? "default" : "outline"}
                    onClick={() => handlePlanClick(plan)}
                    data-testid={`button-pricing-${plan.name.toLowerCase().replace(/\s/g, "-")}`}
                  >
                    {plan.cta}
                  </Button>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 max-w-3xl mx-auto">
          <Reveal>
            <div
              className="relative overflow-hidden rounded-2xl border border-primary/25 bg-gradient-to-br from-primary/[0.07] via-card to-card p-6 md:p-9 shadow-md"
              data-testid="card-credit-fairness"
            >
              <div className="pointer-events-none absolute -top-16 -right-16 w-48 h-48 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <div className="flex items-center justify-center gap-2 mb-6">
                  <ShieldCheck className="w-5 h-5 text-primary" />
                  <h3 className="font-display text-xl md:text-2xl font-bold tracking-tight text-center">
                    Only Pay for Real Conversations
                  </h3>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 mb-6">
                  {creditFairness.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 p-3.5 rounded-xl bg-background/70 border border-border/60"
                      data-testid={`text-credit-fairness-${item.slice(0, 8).toLowerCase().replace(/\s/g, "-")}`}
                    >
                      <span className="flex items-center justify-center w-5 h-5 rounded-full bg-green-500/10 text-green-600 dark:text-green-500 shrink-0 mt-0.5">
                        <Check className="w-3 h-3" strokeWidth={3} />
                      </span>
                      <span className="text-sm font-medium text-foreground/90">{item}</span>
                    </div>
                  ))}
                </div>
                <p className="text-sm md:text-base text-muted-foreground text-center max-w-xl mx-auto text-pretty">
                  Run thousands of outbound calls with confidence — you only pay for real conversations, not
                  unanswered dials.
                </p>
              </div>
            </div>
          </Reveal>
        </div>

        <div className="mt-24 max-w-5xl mx-auto">
          <div data-testid="text-credits-title">
            <SectionHeading
              eyebrow="Call Credits"
              title="Credits That Power Your Calls"
              lead="Credits power your outbound calls. Buy once, use anytime. Unused credits roll over."
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-3xl mx-auto mt-12">
            {credits.map((credit, index) => (
              <Reveal key={credit.amount} delay={index * 0.08} className="h-full">
                <Card
                  className={`relative h-full rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow ${
                    credit.highlight ? "card-glow border-primary/40" : ""
                  }`}
                  data-testid={`card-credit-${index}`}
                >
                  {credit.highlight && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
                      <Badge
                        className="shadow-md font-mono text-[10px] uppercase tracking-wider px-3 py-1"
                        data-testid="badge-best-value"
                      >
                        Best Value
                      </Badge>
                    </div>
                  )}
                  <CardContent className="p-6 text-center">
                    <p
                      className="font-mono text-xs uppercase tracking-wider text-muted-foreground mb-3"
                      data-testid={`text-credit-amount-${index}`}
                    >
                      {credit.amount}
                    </p>
                    <p
                      className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-2"
                      data-testid={`text-credit-price-${index}`}
                    >
                      {credit.price}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {credit.detail}
                    </p>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="mt-24 max-w-5xl mx-auto">
          <div data-testid="text-addons-title">
            <SectionHeading
              eyebrow="Add-Ons"
              title="Done-For-You Builds"
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-5 max-w-4xl mx-auto mt-12">
            {addons.map((addon, index) => (
              <Reveal key={addon.title} delay={index * 0.08} className="h-full">
                <Card
                  className="h-full rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow"
                  data-testid={`card-addon-${index}`}
                >
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="mb-4">
                      <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                        <addon.icon className="w-5 h-5 text-primary shrink-0" />
                      </span>
                    </div>
                    <h4
                      className="font-display text-base font-semibold tracking-tight mb-2"
                      data-testid={`text-addon-title-${index}`}
                    >
                      {addon.title}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                      {addon.description}
                    </p>
                    <Badge
                      variant="outline"
                      className="self-start font-mono text-[10px] uppercase tracking-wider"
                      data-testid={`badge-addon-pricing-${index}`}
                    >
                      {addon.pricing}
                    </Badge>
                  </CardContent>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-12">
          * Prices are in USD
        </p>
      </div>
    </section>
  );
}
