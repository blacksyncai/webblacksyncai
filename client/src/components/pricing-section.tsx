import { Link } from "wouter";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section";
import { BookCallDialog } from "@/components/book-call-dialog";
import { PLANS, type Plan } from "@shared/pricing";
import { trackPlanCta } from "@/lib/pricing-analytics";
import { cn } from "@/lib/utils";

/** The plan's call to action: a real link for self-serve plans, the sales booking dialog for Custom Solutions. */
function PlanCta({ plan, location }: { plan: Plan; location: string }) {
  const className = "w-full";
  if (!plan.href) {
    return (
      <BookCallDialog context="enterprise">
        <Button
          size="lg"
          variant="outline"
          className={className}
          onClick={() => trackPlanCta(plan.key, location)}
          data-testid={`button-pricing-${plan.key}`}
        >
          {plan.cta}
        </Button>
      </BookCallDialog>
    );
  }
  return (
    <Button
      asChild
      size="lg"
      variant={plan.popular ? "default" : "outline"}
      className={cn(className, plan.popular && "shadow-md")}
    >
      <a href={plan.href} onClick={() => trackPlanCta(plan.key, location)} data-testid={`button-pricing-${plan.key}`}>
        {plan.cta}
        {plan.popular && <ArrowRight className="ml-1.5 h-4 w-4" aria-hidden="true" />}
      </a>
    </Button>
  );
}

function PlanCard({ plan, location }: { plan: Plan; location: string }) {
  const featured = !!plan.popular;
  return (
    <article
      aria-labelledby={`plan-${plan.key}`}
      className={cn(
        "relative flex h-full flex-col rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md",
        featured && "card-glow border-primary/50 shadow-lg ring-1 ring-primary/30",
      )}
      data-testid={`card-pricing-${plan.key}`}
    >
      {featured && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <Badge className="px-3 py-1 font-mono text-[10px] uppercase tracking-wider shadow-md" data-testid="badge-most-popular">
            Most Popular
          </Badge>
        </div>
      )}

      <h3 id={`plan-${plan.key}`} className="font-display text-xl font-semibold tracking-tight">
        {plan.name}
      </h3>
      <p className="mt-1.5 min-h-[3.75rem] text-sm leading-snug text-muted-foreground">{plan.subtitle}</p>

      <p className="mt-4 flex h-10 items-end gap-1.5">
        <span className="font-display text-4xl font-semibold leading-none tracking-tight" data-testid={`text-plan-price-${plan.key}`}>
          {plan.price}
        </span>
        {plan.period ? (
          <span className="text-sm text-muted-foreground">{plan.period}</span>
        ) : (
          <span className="text-sm text-muted-foreground">pricing</span>
        )}
      </p>

      <div className="mt-5">
        <PlanCta plan={plan} location={location} />
      </div>

      {plan.keyBenefits && (
        <ul className="mt-6 space-y-2.5 rounded-xl border border-primary/20 bg-primary/[0.06] p-3.5">
          {plan.keyBenefits.map((b) => (
            <li key={b.title} className="flex gap-2.5">
              <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="text-sm">
                <span className="font-semibold text-foreground">{b.title}</span>
                <span className="block text-xs text-muted-foreground">{b.detail}</span>
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-6 flex-1">
        {plan.highlightsTitle && (
          <p className="mb-3 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">{plan.highlightsTitle}</p>
        )}
        <ul className="space-y-2.5">
          {plan.highlights.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm">
              <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10">
                <Check className="h-3 w-3 text-primary" aria-hidden="true" />
              </span>
              <span className="text-foreground/90">{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {plan.note && <p className="mt-6 border-t pt-4 text-xs leading-relaxed text-muted-foreground">{plan.note}</p>}
    </article>
  );
}

/** The four plan cards. */
export function PlanGrid({ location }: { location: string }) {
  return (
    <div className="mx-auto mt-14 grid max-w-7xl items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {PLANS.map((plan) => (
        <PlanCard key={plan.key} plan={plan} location={location} />
      ))}
    </div>
  );
}

type PricingSectionProps = {
  /**
   * "summary" is the homepage teaser: the same plan cards and a link to /pricing, which keeps the full detail
   * (credits, comparison, FAQ) on one URL so Google doesn't treat /pricing as a duplicate of the homepage.
   * The pricing page itself renders PlanGrid inside its own layout.
   */
  variant?: "summary";
};

export function PricingSection(_props: PricingSectionProps) {
  return (
    <section id="pricing" data-testid="section-pricing" className="relative py-20 md:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Plans"
          title={
            <>
              Start free. <span className="text-accent-grad">Scale when you&apos;re ready.</span>
            </>
          }
          lead={`Plans from $98/month, or start free with no card. Phone numbers from $3.50/mo.`}
        />
        <PlanGrid location="home" />
        <div className="mt-12 text-center">
          <Button asChild variant="outline" size="lg" data-testid="button-see-full-pricing">
            <Link href="/pricing">
              Compare plans, credits and FAQ
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
