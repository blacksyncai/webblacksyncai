import { useEffect } from "react";
import {
  ArrowRight,
  BarChart3,
  Bot,
  Check,
  ChevronDown,
  Database,
  FileAudio,
  FileText,
  Mic,
  PhoneCall,
  Server,
  ShieldCheck,
  Upload,
  Workflow,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FinalCtaSection } from "@/components/final-cta-section";
import { PlanGrid } from "@/components/pricing-section";
import { BookCallDialog } from "@/components/book-call-dialog";
import { Button } from "@/components/ui/button";
import { Eyebrow } from "@/components/ui/section";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { trackPricing } from "@/lib/pricing-analytics";
import {
  BUY_CREDITS_URL,
  COMMON_FEATURES,
  CREDIT_PACKS,
  CRMS,
  EXTRA_NUMBER_PRICE,
  FAQS,
  PLANS,
  pricingJsonLd,
} from "@shared/pricing";
import { cn } from "@/lib/utils";

const COMMON_ICONS = [Bot, Mic, PhoneCall, FileText, Upload, FileAudio, BarChart3];
const JSON_LD = pricingJsonLd();

function SectionTitle({ eyebrow, title, lead, id }: { eyebrow: string; title: string; lead?: string; id: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 id={id} className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
        {title}
      </h2>
      {lead && <p className="mt-3 text-base text-muted-foreground text-pretty">{lead}</p>}
    </div>
  );
}

export default function PricingPage() {
  usePageMeta({ path: "/pricing" });
  useJsonLd("pricing-schema", JSON_LD);
  useEffect(() => trackPricing("pricing_page_view"), []);

  return (
    <div className="min-h-screen bg-background" data-testid="page-pricing">
      <Navbar />
      <main className="pt-16">
        {/* Plans */}
        <section aria-labelledby="pricing-title" className="relative py-16 md:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl text-center">
              <Eyebrow>Pricing</Eyebrow>
              <h1 id="pricing-title" className="mt-4 font-display text-4xl font-semibold tracking-tight text-balance md:text-6xl">
                AI Calling <span className="text-accent-grad">Plans &amp; Pricing</span>
              </h1>
              <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground text-pretty">
                Start free and build your first agent today. Upgrade when you&apos;re ready to run real campaigns, connect your CRM,
                or deploy across your whole organization.
              </p>
            </div>
            <h2 className="sr-only">Plans</h2>
            <PlanGrid location="pricing" />
            <p className="mt-8 text-center text-xs text-muted-foreground">
              Prices in USD. Taxes may apply. Cancel or change plans anytime.
            </p>
          </div>
        </section>

        {/* Every plan includes */}
        <section aria-labelledby="included-title" className="border-y bg-muted/40 py-16 md:py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <SectionTitle id="included-title" eyebrow="Included" title="Every plan includes" />
            <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {COMMON_FEATURES.map((f, i) => {
                const Icon = COMMON_ICONS[i] ?? Check;
                return (
                  <li key={f.title} className="flex items-start gap-3 rounded-xl border bg-card p-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold">{f.title}</span>
                      <span className="block text-xs text-muted-foreground">{f.detail}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* CRM integrations (the Growth story) */}
        <section aria-labelledby="crm-title" className="py-16 md:py-24">
          <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
            <div>
              <Eyebrow>Growth plan</Eyebrow>
              <h2 id="crm-title" className="mt-4 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                AI calling that works inside your CRM
              </h2>
              <p className="mt-4 text-muted-foreground text-pretty">
                Growth doesn&apos;t just add capacity. It connects BlackSync to the CRM your team already lives in, so calling becomes
                part of your daily sales workflow.
              </p>
              <ul className="mt-6 space-y-3">
                {[
                  ["CRM-triggered calls", "New leads and pipeline changes can start a call automatically."],
                  ["Outcomes written back", "Lead status, call outcomes and notes update in your CRM after each call."],
                  ["Your fields, your pipeline", "Map custom fields and pipeline stages to how you already work."],
                  ["Two-way sync where supported", "Contacts and updates move in both directions on CRMs that allow it."],
                ].map(([t, d]) => (
                  <li key={t} className="flex gap-3">
                    <Workflow className="mt-0.5 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
                    <div>
                      <h3 className="text-sm font-semibold">{t}</h3>
                      <p className="text-sm text-muted-foreground">{d}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border bg-card p-6 shadow-sm">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Database className="h-4 w-4 text-primary" aria-hidden="true" /> Native CRM integrations
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {CRMS.map((c) => (
                  <li key={c} className="rounded-full border bg-background px-3 py-1 text-xs font-medium">
                    {c}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-muted-foreground">
                Features vary by CRM. Every paid plan also connects to other tools through Zapier and webhooks.
              </p>
            </div>
          </div>
        </section>

        {/* Credits */}
        <section aria-labelledby="credits-title" className="border-t bg-muted/40 py-16 md:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <SectionTitle
              id="credits-title"
              eyebrow="Credits"
              title="Need more calling credits?"
              lead="Purchase additional credits whenever you need them. Scale your calling without switching plans."
            />
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {CREDIT_PACKS.map((c) => (
                <div
                  key={c.credits}
                  className={cn(
                    "relative rounded-2xl border bg-card p-6 text-center shadow-sm",
                    c.popular && "border-primary/40 ring-1 ring-primary/20",
                  )}
                >
                  <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{c.label}</h3>
                  <p className="mt-3 font-display text-3xl font-semibold tracking-tight">{c.price}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{c.credits.toLocaleString("en-US")} credits</p>
                </div>
              ))}
            </div>
            <div className="mt-8 grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <p>
                <span className="font-semibold text-foreground">Separate from your plan.</span> Credit packs are one-time purchases on top
                of your monthly subscription.
              </p>
              <p>
                <span className="font-semibold text-foreground">Usage varies.</span> Credits are spent on connected call time, and the
                rate depends on the AI model your agent uses. Unanswered and busy calls use none.
              </p>
              <p>
                <span className="font-semibold text-foreground">More numbers.</span> Phone numbers beyond your plan&apos;s allowance start
                at {EXTRA_NUMBER_PRICE}/month.
              </p>
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">
              Buying credits doesn&apos;t change your plan&apos;s limits: on Start, the 75-attempt daily limit still applies.
            </p>
            <div className="mt-8 text-center">
              <Button asChild size="lg" variant="outline">
                <a href={BUY_CREDITS_URL} onClick={() => trackPricing("pricing_buy_credits_click", { location: "credits" })}>
                  Buy credits in your account
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Enterprise */}
        <section aria-labelledby="enterprise-title" className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <div className="relative overflow-hidden rounded-[2rem] bg-foreground p-8 text-background shadow-2xl md:p-12">
              {/* Warm glow + dot texture, matching the final-CTA band */}
              <div
                className="pointer-events-none absolute inset-0 opacity-90"
                aria-hidden="true"
                style={{
                  background:
                    "radial-gradient(ellipse 60% 80% at 15% -10%, hsl(14 82% 55% / 0.5), transparent 60%), radial-gradient(ellipse 50% 60% at 100% 110%, hsl(32 80% 55% / 0.3), transparent 60%)",
                }}
              />
              <div
                className="pointer-events-none absolute inset-0 opacity-[0.07]"
                aria-hidden="true"
                style={{ backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)", backgroundSize: "22px 22px" }}
              />

              <div className="relative grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background/80 backdrop-blur">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    Enterprise
                  </span>
                  <h2 id="enterprise-title" className="mt-5 font-display text-3xl font-semibold tracking-tight text-balance md:text-4xl">
                    Enterprise AI calling, built{" "}
                    <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                      around your operation
                    </span>
                  </h2>
                  <p className="mt-4 text-background/75 text-pretty">
                    Private infrastructure, deep integrations and a team that builds and deploys with you. Every Enterprise
                    engagement is scoped to your organization under a custom agreement.
                  </p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <BookCallDialog context="enterprise">
                      <Button
                        size="lg"
                        className="bg-background text-foreground hover:bg-background/90"
                        onClick={() => trackPricing("pricing_enterprise_contact_click", { plan: "enterprise", location: "enterprise_band" })}
                      >
                        Talk to Sales
                        <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                      </Button>
                    </BookCallDialog>
                    <Button asChild size="lg" variant="ghost" className="text-background hover:bg-background/10 hover:text-background">
                      <a href="/enterprise">Explore Enterprise</a>
                    </Button>
                  </div>
                </div>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {[
                    [Server, "Private cloud, VPC or on-premise"],
                    [ShieldCheck, "Security, compliance and SLAs"],
                    [Workflow, "Custom API and CRM integrations"],
                    [Bot, "Custom agent development"],
                  ].map(([Icon, label]) => {
                    const I = Icon as typeof Server;
                    return (
                      <li
                        key={label as string}
                        className="flex items-start gap-3 rounded-xl border border-background/15 bg-background/[0.07] p-4 text-sm backdrop-blur"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/20">
                          <I className="h-4 w-4 text-primary" aria-hidden="true" />
                        </span>
                        <span className="pt-1.5">{label as string}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ: native <details>, so every answer is in the HTML even while collapsed */}
        <section aria-labelledby="faq-title" className="border-t bg-muted/40 py-16 md:py-24">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <SectionTitle id="faq-title" eyebrow="FAQ" title="Pricing questions" />
            <div className="mt-10 divide-y rounded-2xl border bg-card">
              {FAQS.map((f, i) => (
                <details key={f.q} className="group px-5" data-testid={`faq-${i}`}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
                    <h3 className="text-left text-sm font-semibold md:text-base">{f.q}</h3>
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180" aria-hidden="true" />
                  </summary>
                  <p className="pb-5 text-sm leading-relaxed text-muted-foreground">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
