import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { motion } from "framer-motion";
import { useRoute, Link } from "wouter";
import {
  Home,
  Building2,
  Shield,
  Wrench,
  Heart,
  Car,
  KeyRound,
  ArrowRight,
  CheckCircle2,
  Phone,
  Calendar,
  Clock,
  TrendingUp,
  Flower2,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { goToRegister, BOOK_CALL_URL } from "@/lib/register";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { User, Users } from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";

type Industry = {
  slug: string;
  name: string;
  icon: any;
  headline: string;
  subhead: string;
  painPoints: string[];
  outcomes: { label: string; value: string; icon: any }[];
  integrations: string[];
  testimonial?: { quote: string; name: string; role: string };
};

const INDUSTRIES: Record<string, Industry> = {
  "real-estate": {
    slug: "real-estate",
    name: "Real Estate",
    icon: Home,
    headline: "A full ISA team — built, trained, and ready to dial for you.",
    subhead:
      "BlackSync replaces your entire ISA bench with specialized AI agents for FSBOs, Expireds, Just Listed/Just Sold circle prospecting, speed-to-lead, sphere reactivation, and open house follow-up. Every lead called before your competition even sees the notification.",
    painPoints: [
      "FSBO and Expired lists going stale while you're on appointments",
      "Zillow and Realtor.com leads getting called by 5 agents in 4 minutes — and you're #6",
      "ISAs costing $4K–$6K/mo, quitting every 6 months, and ghosting half the list",
      "Old database sitting on 2,000+ past clients nobody has touched in a year",
      "Open house sign-ins never get a real follow-up call",
      "Hot buyer leads coming in at 9pm and Saturdays — and nobody's dialing",
    ],
    outcomes: [
      { label: "Speed to lead", value: "11s", icon: Clock },
      { label: "Lead-to-appt rate", value: "3.4x", icon: TrendingUp },
      { label: "Cost vs human ISA", value: "−92%", icon: Phone },
    ],
    integrations: [
      "Follow Up Boss",
      "Sierra Interactive",
      "kvCORE",
      "BoomTown",
      "Lofty (Chime)",
      "Zillow Premier",
      "Realtor.com",
      "Vulcan7",
      "REDX",
      "Espresso Agent",
      "Calendly",
    ],
    testimonial: {
      quote:
        "We replaced two ISAs with BlackSync. It works FSBOs and Expireds all morning, hits speed-to-lead the second a Zillow inquiry comes in, and books showings straight onto our calendars. 8 appointments our first week.",
      name: "Marcus K.",
      role: "Broker/Owner, Atlanta GA",
    },
  },
  mortgage: {
    slug: "mortgage",
    name: "Mortgage & Lending",
    icon: Building2,
    headline: "Call every refi lead before they shop another lender.",
    subhead:
      "BlackSync's AI qualifies LendingTree, Zillow Home Loans, and webform leads instantly — pre-screens credit, intent, and loan amount before booking the call.",
    painPoints: [
      "$80+ LendingTree leads going to whoever calls first",
      "Loan officers buried in unqualified leads",
      "Refi opportunities lost to slow callbacks",
      "Compliance-heavy scripts hard to train humans on",
    ],
    outcomes: [
      { label: "Avg response time", value: "11s", icon: Clock },
      { label: "Qualified-rate lift", value: "+42%", icon: TrendingUp },
      { label: "Cost per qualified lead", value: "−68%", icon: Phone },
    ],
    integrations: ["LendingTree", "Encompass", "Salesforce", "HubSpot", "Calendly", "Zapier"],
    testimonial: {
      quote:
        "We were missing 60% of leads after-hours. Now BlackSync calls them all and books them on my calendar before I wake up.",
      name: "James R.",
      role: "Loan Officer, Phoenix AZ",
    },
  },
  insurance: {
    slug: "insurance",
    name: "Insurance",
    icon: Shield,
    headline: "Quote 10x more policies without hiring another agent.",
    subhead:
      "BlackSync's AI calls auto, home, life, and commercial leads within seconds, gathers underwriting info, and books the call with your licensed agent.",
    painPoints: [
      "Lead vendors selling the same leads to 5 agencies",
      "CSRs spending all day on unqualified callers",
      "Renewal opportunities slipping through cracks",
      "Multi-state campaigns hard to scale",
    ],
    outcomes: [
      { label: "Avg response time", value: "11s", icon: Clock },
      { label: "Quote-to-bind lift", value: "+38%", icon: TrendingUp },
      { label: "Languages supported", value: "40+", icon: Phone },
    ],
    integrations: ["Applied", "EZLynx", "HubSpot", "Salesforce", "Zapier", "Twilio"],
    testimonial: {
      quote:
        "Our AI agent calls every quote request, qualifies it, and books my CSR's calendar. Closing rate went up, payroll went down.",
      name: "Sarah T.",
      role: "Agency Owner, Austin TX",
    },
  },
  "home-services": {
    slug: "home-services",
    name: "Home Services",
    icon: Wrench,
    headline: "Book every service call. Even at 2am on a Sunday.",
    subhead:
      "BlackSync's AI answers and dials inbound + outbound leads 24/7 — qualifies job type, urgency, and location, then books trucks to the calendar.",
    painPoints: [
      "Missing $500+ jobs because nobody answers after hours",
      "Yelp/Google leads going to whoever calls back first",
      "Dispatchers double-booked or idle",
      "Seasonal spikes (HVAC, plumbing) impossible to staff",
    ],
    outcomes: [
      { label: "24/7 coverage", value: "100%", icon: Clock },
      { label: "Booking-rate lift", value: "+47%", icon: TrendingUp },
      { label: "Avg response time", value: "11s", icon: Phone },
    ],
    integrations: ["ServiceTitan", "Housecall Pro", "Jobber", "Google LSA", "Zapier", "Twilio"],
    testimonial: {
      quote:
        "We doubled bookings without adding a single dispatcher. BlackSync just works — nights, weekends, holidays.",
      name: "Marcus K.",
      role: "Operations Lead, Atlanta GA",
    },
  },
  healthcare: {
    slug: "healthcare",
    name: "Healthcare",
    icon: Heart,
    headline: "HIPAA-ready AI that fills your schedule.",
    subhead:
      "BlackSync's AI handles appointment scheduling, recall outreach, and lead intake — fully HIPAA-aligned and integrated with your EHR.",
    painPoints: [
      "Front-desk staff buried in phone tag",
      "Recall outreach falling through the cracks",
      "No-show rates eating revenue",
      "Spanish-speaking patients underserved",
    ],
    outcomes: [
      { label: "Recall response", value: "11s", icon: Clock },
      { label: "Schedule fill rate", value: "+34%", icon: TrendingUp },
      { label: "Languages", value: "40+", icon: Phone },
    ],
    integrations: ["Athena", "Epic", "DrChrono", "Calendly", "Twilio", "Zapier"],
    testimonial: {
      quote:
        "Our front desk got their day back. BlackSync handles recalls, confirmations, and new patient intake.",
      name: "Sarah T.",
      role: "Practice Manager, Austin TX",
    },
  },
  "auto-pc": {
    slug: "auto-pc",
    name: "Auto & P&C Insurance",
    icon: Car,
    headline: "Quote every auto lead before it shops the competition.",
    subhead:
      "BlackSync's AI dials auto and P&C leads in seconds, captures full underwriting info, and books the bind call with your licensed producer.",
    painPoints: [
      "Multi-state auto leads going stale",
      "Commercial P&C leads need fast, knowledgeable responses",
      "Comp shoppers won by whoever calls first",
      "After-hours leads completely lost",
    ],
    outcomes: [
      { label: "Avg response time", value: "11s", icon: Clock },
      { label: "Bind-rate lift", value: "+29%", icon: TrendingUp },
      { label: "Coverage", value: "24/7", icon: Phone },
    ],
    integrations: ["EZLynx", "Applied", "PL Rating", "HubSpot", "Salesforce", "Zapier"],
    testimonial: {
      quote:
        "We bind more policies per producer now because BlackSync filters every lead before it hits their desk.",
      name: "James R.",
      role: "Agency Principal, Phoenix AZ",
    },
  },
  "property-management": {
    slug: "property-management",
    name: "Property Management",
    icon: KeyRound,
    headline: "Fill vacancies and triage maintenance — without a leasing team.",
    subhead:
      "BlackSync's AI qualifies prospective tenants, schedules showings, and triages maintenance calls 24/7 across your entire portfolio.",
    painPoints: [
      "Leasing agents stretched across too many properties",
      "Maintenance calls flooding the front desk after hours",
      "Tour no-shows wasting time",
      "Spanish-speaking residents underserved",
    ],
    outcomes: [
      { label: "Lead response", value: "11s", icon: Clock },
      { label: "Showing-rate lift", value: "+41%", icon: TrendingUp },
      { label: "Coverage", value: "24/7", icon: Phone },
    ],
    integrations: ["AppFolio", "Buildium", "Yardi", "Rentvine", "Calendly", "Zapier"],
    testimonial: {
      quote:
        "Maintenance triage alone paid for BlackSync three times over. Vacancies fill faster too.",
      name: "Marcus K.",
      role: "Portfolio Manager, Atlanta GA",
    },
  },
  "funeral-homes": {
    slug: "funeral-homes",
    name: "Funeral Homes",
    icon: Flower2,
    headline: "Your dedicated 24/7 funeral home assistant.",
    subhead:
      "Replace expensive answering services with an AI receptionist trained specifically for your funeral home's procedures, staff, and preferences. BlackSync answers every call with professionalism and empathy, schedules arrangements, performs warm transfers when needed, captures every caller's information, documents every conversation, and integrates directly with your existing systems — so no family is ever sent to voicemail and every call is handled as if your staff answered it themselves.",
    painPoints: [
      "Generic answering services don't know your procedures, staff, or preferences — families can tell",
      "Missed calls mean a grieving family gets voicemail instead of a person",
      "Expensive 24/7 human answering services that still can't schedule arrangements or warm-transfer the right call",
      "Every call needs to be documented and routed to the right staff member — most services don't do this well",
    ],
    outcomes: [
      { label: "Average response time", value: "11s", icon: Clock },
      { label: "Coverage", value: "24/7", icon: Phone },
      { label: "Calls sent to voicemail", value: "0", icon: TrendingUp },
    ],
    integrations: [
      "Your funeral home management software",
      "Calendar & scheduling tools",
      "CRM / case management systems",
      "Text & email",
    ],
  },
};

export default function IndustryPage() {
  const [, params] = useRoute<{ slug: string }>("/industry/:slug");
  const slug = params?.slug ?? "real-estate";
  const industry = INDUSTRIES[slug] ?? INDUSTRIES["real-estate"];

  usePageMeta({
    title: `${industry.name} AI Sales Agent`,
    description: industry.subhead,
    path: `/industry/${industry.slug}`,
  });

  const [email, setEmail] = useState("");
  const [qualifyOpen, setQualifyOpen] = useState(false);
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  // Open the discovery-call prompt once the visitor has scrolled a bit
  // (not immediately on load), only on the real-estate page.
  useEffect(() => {
    if (slug !== "real-estate") return;
    let fired = false;
    const onScroll = () => {
      if (!fired && window.scrollY > 700) {
        fired = true;
        setQualifyOpen(true);
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [slug]);

  // Both choices book a free 15-min discovery call. Never Stripe.
  function handleQualify(_choice: "solo" | "team") {
    setQualifyOpen(false);
    window.open(BOOK_CALL_URL, "_blank", "noopener");
  }

  const mutation = useMutation({
    mutationFn: async (emailValue: string) => {
      await apiRequest("POST", "/api/leads", {
        name: emailValue.split("@")[0],
        email: emailValue,
        company: industry.name,
      });
    },
    onSuccess: (_d, emailValue) => {
      toast({ title: "You're in!", description: "Taking you to set up your access…" });
      goToRegister({ email: emailValue, company: industry.name });
    },
    onError: () => {
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid work email.",
        variant: "destructive",
      });
      return;
    }
    if (isBot()) {
      toast({ title: "You're in!", description: "We'll be in touch shortly." });
      setEmail("");
      return;
    }
    mutation.mutate(email);
  }

  const Icon = industry.icon;

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid={`page-industry-${slug}`}>
      <Navbar />

      <Dialog open={qualifyOpen} onOpenChange={setQualifyOpen}>
        <DialogContent className="sm:max-w-md" data-testid="dialog-qualify">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight">Get a free discovery call + demo</DialogTitle>
            <DialogDescription className="text-base">
              Tell us where you're at and we'll set up a personalized walkthrough — no commitment.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
            <button
              type="button"
              onClick={() => handleQualify("solo")}
              className="flex flex-col items-center justify-center text-center gap-2 p-5 rounded-xl border bg-card shadow-sm hover:shadow-md hover-elevate active-elevate-2 transition-all"
              data-testid="button-qualify-solo"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <User className="w-5 h-5" />
              </div>
              <div className="font-semibold">Solo Agent</div>
              <div className="text-xs text-muted-foreground leading-snug">
                I run my own book of business
              </div>
              <div className="text-xs font-semibold text-primary mt-1">Book my demo →</div>
            </button>
            <button
              type="button"
              onClick={() => handleQualify("team")}
              className="flex flex-col items-center justify-center text-center gap-2 p-5 rounded-xl border-2 border-primary bg-primary/5 shadow-sm hover:shadow-md hover-elevate active-elevate-2 transition-all"
              data-testid="button-qualify-team"
            >
              <div className="w-11 h-11 rounded-xl bg-primary text-primary-foreground flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-semibold">Team Owner / Broker</div>
              <div className="text-xs text-muted-foreground leading-snug">
                I lead a team or brokerage
              </div>
              <div className="text-xs font-semibold text-primary mt-1">Book my demo →</div>
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground text-center mt-2">
            Free 15-minute call + live demo. No commitment.
          </p>
          <button
            type="button"
            onClick={() => setQualifyOpen(false)}
            className="mx-auto block text-xs text-muted-foreground hover:text-foreground transition-colors"
            data-testid="button-qualify-skip"
          >
            Skip for now
          </button>
        </DialogContent>
      </Dialog>


      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex mb-6"
            data-testid="badge-industry-name"
          >
            <Eyebrow>
              <Icon className="w-3.5 h-3.5" />
              {industry.name}
            </Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance"
            data-testid="text-industry-headline"
          >
            {industry.headline.split("—")[0]}
            {industry.headline.includes("—") && (
              <>
                <br className="hidden md:block" />
                <span className="text-accent-grad">— {industry.headline.split("—")[1]}</span>
              </>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-pretty"
          >
            {industry.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="flex flex-col items-center gap-3"
          >
            <form
              id="get-demo"
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-md scroll-mt-28"
            >
              <HoneypotInput inputRef={hpRef} />
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11"
                data-testid="input-industry-email"
              />
              <Button size="lg" type="submit" disabled={mutation.isPending} data-testid="button-industry-cta">
                Get My Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">
              Built for {industry.name} teams · 11s response time · Cancel anytime
            </p>
          </motion.div>
        </div>
      </section>

      {/* Outcomes */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {industry.outcomes.map((o, i) => (
              <motion.div
                key={o.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-8 rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow text-center"
                data-testid={`outcome-${o.label.toLowerCase().replace(/\s/g, "-")}`}
              >
                <div className="inline-flex items-center justify-center w-11 h-11 rounded-xl bg-primary/10 text-primary mb-4">
                  <o.icon className="w-5 h-5" />
                </div>
                <div className="font-display text-4xl md:text-5xl font-semibold tracking-tight text-accent-grad mb-1">{o.value}</div>
                <div className="text-sm font-mono uppercase tracking-wide text-muted-foreground">{o.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain points */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Reveal>
                <Eyebrow>Why teams switch</Eyebrow>
              </Reveal>
              <Reveal delay={0.05}>
                <h2 className="mt-5 font-display text-3xl md:text-4xl font-semibold tracking-tight leading-[1.1] mb-4 text-balance">
                  Stop losing leads to{" "}
                  <span className="text-accent-grad">slow follow-up.</span>
                </h2>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="text-muted-foreground leading-relaxed text-pretty">
                  Every {industry.name.toLowerCase()} team we work with comes to us
                  with the same problems. BlackSync solves them on day one.
                </p>
              </Reveal>
            </div>
            <ul className="space-y-3">
              {industry.painPoints.map((p) => (
                <li
                  key={p}
                  className="flex items-start gap-3 p-4 rounded-xl bg-card border shadow-sm"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <Eyebrow>Native integrations</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-3xl md:text-4xl font-semibold tracking-tight mb-3 text-balance">
              Plugs into the tools{" "}
              <span className="text-accent-grad">{industry.name} runs on.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="text-muted-foreground mb-10 max-w-xl mx-auto text-pretty">
              Two-way sync. Leads in, appointments out, everything logged.
            </p>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap justify-center gap-2.5">
              {industry.integrations.map((name) => (
                <div
                  key={name}
                  className="px-4 py-2 rounded-full bg-card border shadow-sm text-sm font-medium hover:shadow-md transition-shadow"
                >
                  {name}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      {industry.testimonial && (
        <section className="py-16 md:py-24 bg-muted">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Reveal>
              <p className="font-display text-2xl md:text-3xl font-medium leading-snug mb-8 text-foreground text-balance">
                "{industry.testimonial.quote}"
              </p>
            </Reveal>
            <Reveal delay={0.05}>
              <p className="text-sm font-semibold">{industry.testimonial.name}</p>
              <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">{industry.testimonial.role}</p>
            </Reveal>
          </div>
        </section>
      )}

      {/* Final CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-4 leading-[1.1] text-balance">
              Ready to scale <span className="text-accent-grad">{industry.name}</span>?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted-foreground text-lg mb-8 text-pretty">
              Get a custom plan built for your team in under 24 hours.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/enterprise">
                <Button size="lg" data-testid="button-industry-talk">
                  Talk to Sales <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-industry-pricing">
                  See pricing
                </Button>
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
