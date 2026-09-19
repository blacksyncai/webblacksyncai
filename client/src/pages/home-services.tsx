import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eyebrow, Reveal } from "@/components/ui/section";
import {
  ArrowRight,
  Loader2,
  CheckCircle2,
  PhoneIncoming,
  CalendarCheck,
  Clock,
  Zap,
  RotateCcw,
  BellRing,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { SITE_URL } from "@shared/route-meta";

const PATH = "/home-services";

const CORE_INCLUDED = [
  {
    icon: PhoneIncoming,
    title: "Every call, answered",
    body: "Say goodbye to voicemail. Your AI agent picks up every inbound call, day or night, and never sends a customer to a machine.",
  },
  {
    icon: CalendarCheck,
    title: "Booked straight to your calendar",
    body: "Qualifies the job, gets the details, and books it directly onto your schedule — no back-and-forth.",
  },
  {
    icon: Clock,
    title: "Live in days, not weeks",
    body: "An expert on our team builds and trains your agent around your business. You're not configuring anything yourself.",
  },
];

const ADD_ONS = [
  {
    icon: Zap,
    title: "Speed-to-Lead",
    body: "Answers leads from your ads within seconds of them coming in, before they call a competitor.",
  },
  {
    icon: RotateCcw,
    title: "Old Quote Follow-Up",
    body: "Outbound campaigns that work back through old quotes and estimates sitting in your CRM.",
  },
  {
    icon: BellRing,
    title: "Appointment Reminders",
    body: "Automated calls and texts that cut down on no-shows before the job.",
  },
];

type LeadForm = {
  name: string;
  email: string;
  phone: string;
  company: string;
};

const EMPTY_FORM: LeadForm = { name: "", email: "", phone: "", company: "" };

export default function HomeServicesPage() {
  usePageMeta({ path: PATH });

  useJsonLd("home-services-webpage", {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "AI Voice Agent for Home Services",
    description:
      "BlackSync builds a custom AI voice agent for home service businesses — answers every call, books jobs to your calendar, and follows up on old quotes.",
    url: `${SITE_URL}${PATH}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  const [form, setForm] = useState<LeadForm>(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  function update<K extends keyof LeadForm>(key: K, value: LeadForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || undefined,
        company: form.company.trim() || undefined,
        industry: "Home Services",
        useCase: "Home Services landing page — $49/mo start offer",
      });
    },
    onSuccess: () => setSubmitted(true),
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim() || !form.email.includes("@") || !form.phone.trim()) {
      toast({ title: "Fill in your name, email, and phone", variant: "destructive" });
      return;
    }
    if (isBot()) {
      setSubmitted(true);
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-home-services">
      <Navbar />

      {/* ============ HERO + PRICING + CTA ============ */}
      <header className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow data-testid="badge-home-services">AI Answering Service for Home Services</Eyebrow>
          <h1
            className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance"
            data-testid="text-home-services-h1"
          >
            Never miss another service call.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-3">
            An AI answering service and AI voice agent for home service businesses — answers every call, books
            the job to your calendar, and follows up so no lead falls through the cracks.
          </p>
          <p className="text-sm text-muted-foreground leading-relaxed text-pretty mb-10">
            Built for you by our team, not a DIY setup. One missed $300–$400 job pays for months of this.
          </p>

          <Reveal>
            <div className="rounded-2xl border border-card-border bg-card p-8 md:p-10 shadow-lg max-w-md mx-auto">
              <div className="flex items-end justify-center gap-2 mb-1">
                <span className="font-display text-5xl font-semibold tracking-tight" data-testid="text-price-intro">
                  $49
                </span>
                <span className="text-sm text-muted-foreground pb-1.5">your first month</span>
              </div>
              <p className="text-sm text-muted-foreground mb-7" data-testid="text-price-ongoing">
                then $98/month — cancel anytime
              </p>

              <a href="#get-started">
                <Button size="lg" className="w-full" data-testid="button-hero-cta">
                  Get My Agent Built
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </a>

              <p className="mt-4 text-xs text-muted-foreground">An expert builds your agent for you — no setup on your end.</p>
            </div>
          </Reveal>
        </div>
      </header>

      {/* ============ WHAT'S INCLUDED ============ */}
      <section className="py-20 md:py-28" aria-labelledby="included-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">What's Included</p>
            <h2
              id="included-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              One agent. Every inbound call covered.
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {CORE_INCLUDED.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-card-border bg-card p-6"
                data-testid={`included-${item.title}`}
              >
                <item.icon className="w-6 h-6 text-primary mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-base font-semibold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ ADD-ONS ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="addons-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">Optional Add-Ons</p>
            <h2
              id="addons-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Need more than inbound? Add it later.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              These aren't part of the $49 start — ask your rep to add them once you're up and running.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {ADD_ONS.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-card-border bg-card p-6"
                data-testid={`addon-${item.title}`}
              >
                <item.icon className="w-6 h-6 text-muted-foreground mb-4" strokeWidth={1.5} />
                <h3 className="font-display text-base font-semibold tracking-tight mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS ============ */}
      <section className="py-16 md:py-20" aria-labelledby="integrations-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="integrations-heading" className="text-sm font-medium text-muted-foreground mb-4">
            Works with the CRM you already use
          </h2>
          <p className="text-sm text-muted-foreground">
            Follow Up Boss, ServiceTitan, HubSpot, GoHighLevel, Zoho, and more — or no CRM at all to start.
          </p>
        </div>
      </section>

      {/* ============ GET STARTED FORM ============ */}
      <section id="get-started" className="py-20 md:py-28 bg-muted/40 border-t border-border" aria-labelledby="get-started-heading">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 id="get-started-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance">
              Get started for $49
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Tell us about your business and an expert will reach out to build your agent.
            </p>
          </div>

          <Reveal>
            {submitted ? (
              <div
                className="rounded-2xl border border-card-border bg-card p-8 text-center"
                data-testid="home-services-confirmation"
              >
                <CheckCircle2 className="w-9 h-9 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold tracking-tight mb-2">You're in!</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Someone from our team will reach out within 24 hours to get your agent built.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-card-border bg-card p-8 space-y-4"
                data-testid="form-home-services"
              >
                <HoneypotInput inputRef={hpRef} />
                <div className="space-y-1.5">
                  <Label htmlFor="hs-name">Your name</Label>
                  <Input
                    id="hs-name"
                    placeholder="Jane Doe"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    data-testid="input-home-services-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-email">Email</Label>
                  <Input
                    id="hs-email"
                    type="email"
                    placeholder="you@company.com"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    data-testid="input-home-services-email"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-phone">Phone</Label>
                  <Input
                    id="hs-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    data-testid="input-home-services-phone"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-company">
                    Company <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="hs-company"
                    placeholder="Acme Plumbing"
                    value={form.company}
                    onChange={(e) => update("company", e.target.value)}
                    data-testid="input-home-services-company"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                  data-testid="button-home-services-submit"
                >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Get My Agent Built
                  {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
                <p className="text-xs text-center text-muted-foreground">$49 your first month, then $98/month. Cancel anytime.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
