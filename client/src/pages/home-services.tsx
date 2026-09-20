import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
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
  PhoneCall,
} from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { runHomeServicesSignup } from "@/lib/home-services-signup";
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

const INTEGRATIONS = ["ServiceTitan", "Housecall Pro", "QuickBooks", "HubSpot", "GoHighLevel", "No CRM? Fine too."];

const TRADE_OPTIONS = [
  "HVAC",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Landscaping / Lawn Care",
  "Pest Control",
  "Garage Door",
  "Pool Service",
  "General Contractor",
  "Other",
];

const CALL_VOLUME_OPTIONS = ["0–50", "50–100", "100–150", "150+"];

const HELP_WITH_OPTIONS = [
  "Missed calls",
  "After-hours calls",
  "Booking jobs",
  "Screening calls",
  "Following up with old leads (outbound)",
];

type Step1Form = { name: string; phone: string; email: string };
type Step2Form = { trade: string; callVolume: string; helpWith: string[] };

const EMPTY_STEP1: Step1Form = { name: "", phone: "", email: "" };
const EMPTY_STEP2: Step2Form = { trade: "", callVolume: "", helpWith: [] };

/** US/Canada numbers: 10 digits, or 11 with a leading 1 country code. */
function isValidPhone(phone: string): boolean {
  const digits = phone.replace(/\D/g, "");
  return digits.length === 10 || (digits.length === 11 && digits.startsWith("1"));
}

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

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [step1, setStep1] = useState<Step1Form>(EMPTY_STEP1);
  const [step2, setStep2] = useState<Step2Form>(EMPTY_STEP2);
  const [paymentState, setPaymentState] = useState<"idle" | "pending" | "error">("idle");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [activationDate, setActivationDate] = useState<string | null>(null);
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  function updateStep1<K extends keyof Step1Form>(key: K, value: Step1Form[K]) {
    setStep1((prev) => ({ ...prev, [key]: value }));
  }

  function toggleHelpWith(value: string) {
    setStep2((prev) => ({
      ...prev,
      helpWith: prev.helpWith.includes(value)
        ? prev.helpWith.filter((v) => v !== value)
        : [...prev.helpWith, value],
    }));
  }

  const step1Mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: step1.name.trim(),
        email: step1.email.trim() || undefined,
        phone: step1.phone.trim() || undefined,
        industry: "Home Services",
        useCase: "Home Services landing page — quick capture (step 1 of 2)",
      });
    },
    onSuccess: () => setStep(2),
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  const step2Mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: step1.name.trim(),
        email: step1.email.trim() || undefined,
        phone: step1.phone.trim() || undefined,
        industry: "Home Services",
        trade: step2.trade || undefined,
        callVolume: step2.callVolume || undefined,
        helpWith: step2.helpWith.join(", ") || undefined,
        useCase: "Home Services landing page — $49/mo start offer (step 2 of 2)",
      });
    },
    onSuccess: () => setStep(3),
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  function handleStep1Submit(e: React.FormEvent) {
    e.preventDefault();
    if (!step1.name.trim() || (!step1.phone.trim() && !step1.email.trim())) {
      toast({ title: "Enter your name and a phone number or email", variant: "destructive" });
      return;
    }
    if (step1.phone.trim() && !isValidPhone(step1.phone)) {
      toast({ title: "Enter a valid 10-digit phone number", variant: "destructive" });
      return;
    }
    if (step1.email.trim() && !step1.email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    if (isBot()) {
      setStep(2);
      return;
    }
    step1Mutation.mutate();
  }

  function handleStep2Submit(e: React.FormEvent) {
    e.preventDefault();
    if (isBot()) {
      setStep(3);
      return;
    }
    step2Mutation.mutate();
  }

  async function handlePayment() {
    setPaymentState("pending");
    setPaymentError(null);
    try {
      const result = await runHomeServicesSignup({
        name: step1.name.trim(),
        email: step1.email.trim() || undefined,
        phone: step1.phone.trim() || undefined,
      });
      if (result.status === "complete") {
        setActivationDate(result.activationDate);
        setPaymentState("idle");
        setStep(4);
        return;
      }
      if (result.status === "cancelled") {
        setPaymentState("idle");
        return;
      }
      if (result.status === "declined") {
        setPaymentState("error");
        setPaymentError(result.message);
        return;
      }
      setPaymentState("error");
      setPaymentError("Payment isn't available right now. We already have your info — a rep will reach out to get you set up.");
    } catch {
      setPaymentState("error");
      setPaymentError("Something went wrong finishing your signup. Please try again, or we'll follow up using the info you gave us.");
    }
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-home-services">
      <div className="dark">
        <Navbar />
      </div>

      {/* ============ HERO + PRICING + CTA (dark, dramatic) ============ */}
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

        <div className="relative max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1.5 mb-7"
            data-testid="badge-home-services"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
            <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400">
              AI Answering Service for Home Services
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance text-zinc-50"
            data-testid="text-home-services-h1"
          >
            Never miss another <span className="text-accent-grad">service call.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty mb-3"
          >
            An AI answering service and AI voice agent for home service businesses — answers every call, books
            the job to your calendar, and follows up so no lead falls through the cracks.
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.22 }}
            className="text-sm text-zinc-500 leading-relaxed text-pretty mb-10"
          >
            Built for you by our team, not a DIY setup. One missed $300–$400 job pays for months of this.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="card-glow rounded-2xl border border-zinc-800 bg-zinc-900 p-8 md:p-10 max-w-md mx-auto">
              <span className="inline-flex items-center rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-mono text-[10px] uppercase tracking-wider text-primary mb-5">
                50% off to start
              </span>
              <div className="flex items-end justify-center gap-2.5 mb-1">
                <span className="text-lg text-zinc-600 line-through pb-1.5" data-testid="text-price-original">
                  $98
                </span>
                <span className="font-display text-6xl font-semibold tracking-tight text-zinc-50" data-testid="text-price-intro">
                  $49
                </span>
              </div>
              <p className="text-sm text-zinc-500 mb-7" data-testid="text-price-ongoing">
                your first month, then $98/month — cancel anytime
              </p>

              <a href="#get-started">
                <Button size="lg" className="w-full" data-testid="button-hero-cta">
                  Get My Agent Built
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </a>

              <p className="mt-4 text-xs text-zinc-500">An expert builds your agent for you — no setup on your end.</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.38 }}
            className="mt-10 max-w-sm mx-auto rounded-xl border border-zinc-800 bg-zinc-900/60 p-4 text-left"
            data-testid="live-call-mock"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-zinc-500">
                <PhoneCall className="h-3 w-3 text-primary" /> Incoming Call
              </span>
              <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-emerald-500">
                <span className="relative flex w-1.5 h-1.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-emerald-500" />
                </span>
                Answered in 2 rings
              </span>
            </div>
            <p className="text-xs text-zinc-300 leading-relaxed">
              "Thanks for calling — I can get a tech out for that. Are mornings or afternoons better for you this
              week?"
            </p>
          </motion.div>
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

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-3">
            {CORE_INCLUDED.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.body }}
                data-testid={`included-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUE STAT ============ */}
      <section className="py-16 md:py-20 bg-zinc-950" aria-labelledby="stat-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p
            id="stat-heading"
            className="font-display text-6xl sm:text-7xl font-semibold tracking-tight text-accent-grad mb-3"
          >
            $300–$400
          </p>
          <p className="text-base md:text-lg text-zinc-400 leading-relaxed text-pretty max-w-lg mx-auto">
            The average job value most home service businesses lose every time a call goes to voicemail. Your
            agent picks up every time.
          </p>
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

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed bg-background sm:grid-cols-3">
            {ADD_ONS.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.body }}
                data-testid={`addon-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ INTEGRATIONS ============ */}
      <section className="py-16 md:py-20" aria-labelledby="integrations-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 id="integrations-heading" className="text-sm font-medium text-muted-foreground mb-5">
            Works with the CRM you already use
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            {INTEGRATIONS.map((name) => (
              <span
                key={name}
                className="inline-flex items-center rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-foreground/80"
                data-testid={`integration-${name}`}
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ============ GET STARTED FORM ============ */}
      <section id="get-started" className="py-20 md:py-28 bg-zinc-950" aria-labelledby="get-started-heading">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 id="get-started-heading" className="font-display text-2xl sm:text-3xl font-semibold tracking-tight text-balance text-zinc-50">
              Get started for $49
            </h2>
            <p className="mt-3 text-sm text-zinc-500">
              Tell us about your business and an expert will reach out to build your agent.
            </p>
          </div>

          <Reveal>
            {step === 4 ? (
              <div
                className="card-glow rounded-2xl border border-zinc-800 bg-zinc-900 p-8 text-center"
                data-testid="home-services-confirmation"
              >
                <CheckCircle2 className="w-9 h-9 text-primary mx-auto mb-4" />
                <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-50 mb-2">You're in!</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  $49 was charged for your first month. Your $98/month subscription starts{" "}
                  {activationDate ? <span className="text-zinc-200">{activationDate}</span> : "next month"}. An
                  expert will reach out within 24 hours to get your agent built.
                </p>
              </div>
            ) : step === 3 ? (
              <div
                className="card-glow rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-4"
                data-testid="form-home-services-step3"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Step 3 of 3</p>
                <div>
                  <h3 className="font-display text-xl font-semibold tracking-tight text-zinc-50 mb-1">
                    Add your card to activate
                  </h3>
                  <p className="text-sm text-zinc-400 leading-relaxed">
                    $49 charged today, then $98/month starting next month. Handled securely by Helcim — we never
                    see or store your card details.
                  </p>
                </div>

                {paymentState === "error" && paymentError ? (
                  <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3.5 py-2.5 text-sm text-red-300">
                    {paymentError}
                  </p>
                ) : null}

                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  disabled={paymentState === "pending"}
                  onClick={handlePayment}
                  data-testid="button-home-services-pay"
                >
                  {paymentState === "pending" ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  {paymentState === "pending" ? "Opening secure payment…" : "Continue to Payment"}
                  {paymentState !== "pending" && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
                <p className="text-xs text-center text-zinc-500">$49 your first month, then $98/month. Cancel anytime.</p>
              </div>
            ) : step === 1 ? (
              <form
                onSubmit={handleStep1Submit}
                className="card-glow rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-4"
                data-testid="form-home-services-step1"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Step 1 of 3</p>
                <HoneypotInput inputRef={hpRef} />
                <div className="space-y-1.5">
                  <Label htmlFor="hs-name" className="text-zinc-300">Your name</Label>
                  <Input
                    id="hs-name"
                    placeholder="Jane Doe"
                    value={step1.name}
                    onChange={(e) => updateStep1("name", e.target.value)}
                    className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                    data-testid="input-home-services-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-phone" className="text-zinc-300">Phone</Label>
                  <Input
                    id="hs-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={step1.phone}
                    onChange={(e) => updateStep1("phone", e.target.value)}
                    className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                    data-testid="input-home-services-phone"
                  />
                </div>
                <div className="relative flex items-center py-1">
                  <div className="flex-1 border-t border-zinc-800" />
                  <span className="px-3 text-[11px] uppercase tracking-wider text-zinc-600">or</span>
                  <div className="flex-1 border-t border-zinc-800" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-email" className="text-zinc-300">Email</Label>
                  <Input
                    id="hs-email"
                    type="email"
                    placeholder="you@company.com"
                    value={step1.email}
                    onChange={(e) => updateStep1("email", e.target.value)}
                    className="border-zinc-700 bg-zinc-800 text-zinc-100 placeholder:text-zinc-500"
                    data-testid="input-home-services-email"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={step1Mutation.isPending}
                  data-testid="button-home-services-step1-submit"
                >
                  {step1Mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue
                  {!step1Mutation.isPending && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
                <p className="text-xs text-center text-zinc-500">$49 your first month, then $98/month. Cancel anytime.</p>
              </form>
            ) : (
              <form
                onSubmit={handleStep2Submit}
                className="card-glow rounded-2xl border border-zinc-800 bg-zinc-900 p-8 space-y-5"
                data-testid="form-home-services-step2"
              >
                <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">Step 2 of 3</p>
                <div className="space-y-1.5">
                  <Label htmlFor="hs-trade" className="text-zinc-300">What's your trade?</Label>
                  <Select value={step2.trade} onValueChange={(v) => setStep2((p) => ({ ...p, trade: v }))}>
                    <SelectTrigger
                      id="hs-trade"
                      className="border-zinc-700 bg-zinc-800 text-zinc-100"
                      data-testid="select-home-services-trade"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {TRADE_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="hs-call-volume" className="text-zinc-300">How many calls do you get a month?</Label>
                  <Select
                    value={step2.callVolume}
                    onValueChange={(v) => setStep2((p) => ({ ...p, callVolume: v }))}
                  >
                    <SelectTrigger
                      id="hs-call-volume"
                      className="border-zinc-700 bg-zinc-800 text-zinc-100"
                      data-testid="select-home-services-call-volume"
                    >
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {CALL_VOLUME_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-zinc-300">What do you want help with?</Label>
                  <div className="space-y-2.5 rounded-lg border border-zinc-700 bg-zinc-800/60 p-3.5">
                    {HELP_WITH_OPTIONS.map((opt) => (
                      <label
                        key={opt}
                        htmlFor={`hs-help-${opt}`}
                        className="flex items-center gap-2.5 text-sm text-zinc-300 cursor-pointer"
                      >
                        <Checkbox
                          id={`hs-help-${opt}`}
                          checked={step2.helpWith.includes(opt)}
                          onCheckedChange={() => toggleHelpWith(opt)}
                          className="border-zinc-600"
                          data-testid={`checkbox-home-services-help-${opt}`}
                        />
                        {opt}
                      </label>
                    ))}
                  </div>
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={step2Mutation.isPending}
                  data-testid="button-home-services-step2-submit"
                >
                  {step2Mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue to Payment
                  {!step2Mutation.isPending && <ArrowRight className="w-4 h-4 ml-1.5" />}
                </Button>
                <p className="text-xs text-center text-zinc-500">$49 your first month, then $98/month. Cancel anytime.</p>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
