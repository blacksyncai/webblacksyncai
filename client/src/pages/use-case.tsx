import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eyebrow, Reveal } from "@/components/ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { goToRegister } from "@/lib/register";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";

type UseCase = {
  slug: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  headline: string;
  subhead: string;
  painPoints: string[];
  helps: { title: string; description: string }[];
  integrations: string[];
  testimonial: { quote: string; name: string; role: string };
  faqs: { q: string; a: string }[];
  related: { label: string; href: string }[];
};

export const USE_CASES: Record<string, UseCase> = {
  "real-estate-ai-caller": {
    slug: "real-estate-ai-caller",
    metaTitle: "AI Cold Caller for Real Estate Teams",
    metaDescription:
      "BlackSync is the AI cold caller built for real estate teams — calls FSBOs, Expireds, and new leads within seconds, qualifies them, and books the appointment on your calendar.",
    eyebrow: "Real Estate",
    headline: "The AI Cold Caller Built for Real Estate Teams",
    subhead:
      "BlackSync calls every real estate lead — Zillow inquiries, sphere reactivation, open house sign-ins, FSBOs, and Expireds — within seconds of it coming in, qualifies it, and books the appointment on your calendar.",
    painPoints: [
      "Zillow and Realtor.com leads getting called by 5 agents in 4 minutes — and you're #6",
      "Old database sitting on 2,000+ past clients nobody has touched in a year",
      "Hot buyer leads coming in at 9pm and Saturdays — and nobody's dialing",
      "ISAs costing $4K–$6K/mo, quitting every 6 months, and ghosting half the list",
    ],
    helps: [
      {
        title: "Calls Within Seconds",
        description:
          "The AI agent calls a new lead the moment it hits your CRM or lead source — before another agent gets there first.",
      },
      {
        title: "Qualifies Like a Trained ISA",
        description:
          "Handles objections, reads tone, and asks the right questions to gauge budget, timeline, and motivation — then scores the lead in real time.",
      },
      {
        title: "Books Straight to Your Calendar",
        description:
          "Syncs with Google Calendar, Outlook, and Calendly. Qualified leads land on your calendar with a confirmation sent automatically.",
      },
    ],
    integrations: [
      "Follow Up Boss",
      "Sierra Interactive",
      "kvCORE",
      "BoomTown",
      "Lofty (Chime)",
      "Zillow Premier",
      "Realtor.com",
      "Calendly",
    ],
    testimonial: {
      quote:
        "We replaced two ISAs with BlackSync. It works FSBOs and Expireds all morning, hits speed-to-lead the second a Zillow inquiry comes in, and books showings straight onto our calendars. 8 appointments our first week.",
      name: "Marcus K.",
      role: "Broker/Owner, Atlanta GA",
    },
    faqs: [
      {
        q: "Does the AI sound like a robot?",
        a: "No — it's built to hold a natural conversation, not read a script word-for-word. It handles objections, answers questions, and keeps the conversation flowing.",
      },
      {
        q: "What CRMs does it work with?",
        a: "Native integrations with Follow Up Boss, Sierra, kvCORE, Salesforce, HubSpot, and 100+ platforms via bi-directional sync.",
      },
      {
        q: "How fast does it call a new lead?",
        a: "Within seconds of the lead hitting your CRM or lead source — speed-to-lead is the whole point.",
      },
      {
        q: "Can it work my old database, not just new leads?",
        a: "Yes. Sphere and past-client reactivation is one of the most common ways teams use BlackSync.",
      },
    ],
    related: [
      { label: "Expired Listing AI", href: "/expired-listing-ai" },
      { label: "FSBO AI", href: "/fsbo-ai" },
      { label: "Real Estate industry page", href: "/industry/real-estate" },
    ],
  },

  "expired-listing-ai": {
    slug: "expired-listing-ai",
    metaTitle: "AI Cold Caller for Expired Listings",
    metaDescription:
      "BlackSync's AI calls your expired listings within minutes of pulling the list, handles seller objections, and books the listing appointment — before the next agent does.",
    eyebrow: "Expired Listings",
    headline: "Call Every Expired Listing Before the Next Agent Does",
    subhead:
      "The moment a listing expires, every agent in town pulls the same list. BlackSync's AI calls your expired leads within minutes, works through the objections of a seller who's already heard from four other agents that day, and books the listing appointment.",
    painPoints: [
      "Expired lists go stale by lunchtime — every agent in your market pulls the same list the same morning",
      "Sellers are already annoyed after fielding calls from agents #1 through #4",
      "Manually dialing 50–100 expireds a day burns out ISAs fast, and turnover means retraining constantly",
      "The most motivated sellers (price already reduced, on-market 60+ days) get buried in a long list",
    ],
    helps: [
      {
        title: "Dials the List the Moment It's Pulled",
        description:
          "Connect Vulcan7, REDX, Espresso Agent, or a CSV export, and the AI starts calling as soon as the list refreshes — not whenever an ISA gets to it.",
      },
      {
        title: "Handles the 'I've Already Talked to 5 Agents' Objection",
        description:
          "The agent is built to work through skepticism and rejection-heavy calls naturally instead of freezing or hanging up.",
      },
      {
        title: "Follows Up Without Being Told To",
        description:
          "No answer on the first call? Automated SMS and email follow-up sequences keep working the lead over the following days.",
      },
    ],
    integrations: ["Vulcan7", "REDX", "Espresso Agent", "Follow Up Boss", "kvCORE", "Calendly"],
    testimonial: {
      quote:
        "We replaced two ISAs with BlackSync. It works FSBOs and Expireds all morning, hits speed-to-lead the second a Zillow inquiry comes in, and books showings straight onto our calendars. 8 appointments our first week.",
      name: "Marcus K.",
      role: "Broker/Owner, Atlanta GA",
    },
    faqs: [
      {
        q: "How do I get my expired listing leads into BlackSync?",
        a: "Import from Vulcan7, REDX, Espresso Agent, or any CSV/API pull the moment your list refreshes.",
      },
      {
        q: "Will a seller notice it's not calling from a live agent?",
        a: "The agent is built to hold a natural back-and-forth conversation, including objection handling, rather than reading a fixed script.",
      },
      {
        q: "Who controls which numbers get called?",
        a: "You do — BlackSync only calls the leads and lists you upload, same as you'd control for a live caller.",
      },
    ],
    related: [
      { label: "FSBO AI", href: "/fsbo-ai" },
      { label: "Real Estate AI Caller", href: "/real-estate-ai-caller" },
      { label: "Real Estate industry page", href: "/industry/real-estate" },
    ],
  },

  "fsbo-ai": {
    slug: "fsbo-ai",
    metaTitle: "AI Caller for FSBO Leads",
    metaDescription:
      "BlackSync's AI opens FSBO conversations with value instead of a pitch, works through commission objections, and stays in the follow-up cadence until the seller's ready to talk.",
    eyebrow: "FSBO",
    headline: "Turn FSBO Sellers Into Listing Appointments — On Autopilot",
    subhead:
      "FSBO sellers are actively trying to avoid agents. BlackSync's AI opens with value instead of a pitch, works through the \"why should I pay a commission\" objection naturally, and keeps following up over the weeks it usually takes to convert a FSBO.",
    painPoints: [
      "FSBO sellers screen calls from agents on sight",
      "The commission objection kills most scripts in the first 10 seconds",
      "FSBO conversion is a weeks-long nurture, not a one-call close — and that follow-up rarely happens consistently",
      "The best FSBO leads (price already reduced, listed 30+ days) get lost in a long list",
    ],
    helps: [
      {
        title: "Leads With Value, Not a Pitch",
        description:
          "The agent is built to hold a consultative conversation and work through the commission objection instead of opening with a hard sell.",
      },
      {
        title: "Keeps Following Up for Weeks",
        description:
          "Multi-touch SMS and email sequences, triggered by lead behavior and time-based rules, keep the seller warm long after the first call.",
      },
      {
        title: "Flags the Most Motivated Sellers",
        description:
          "Lead scoring tracks conversation signals — motivation, timeline, price flexibility — so you know which FSBOs to prioritize.",
      },
    ],
    integrations: ["Vulcan7", "REDX", "Espresso Agent", "Zillow Premier", "Realtor.com", "Follow Up Boss"],
    testimonial: {
      quote:
        "We replaced two ISAs with BlackSync. It works FSBOs and Expireds all morning, hits speed-to-lead the second a Zillow inquiry comes in, and books showings straight onto our calendars. 8 appointments our first week.",
      name: "Marcus K.",
      role: "Broker/Owner, Atlanta GA",
    },
    faqs: [
      {
        q: "Does the AI push for the listing on the first call?",
        a: "No — it's built for a consultative approach on the first touch, then follows up over time rather than pushing for a same-call commitment.",
      },
      {
        q: "How long does the AI keep following up?",
        a: "As long as your sequence rules say to — multi-touch SMS and email cadences can run for weeks, matching how long FSBO conversion typically takes.",
      },
      {
        q: "Can it tell which FSBOs are actually motivated?",
        a: "Yes — lead scoring tracks signals from each conversation (timeline, price flexibility, tone) and updates in real time.",
      },
    ],
    related: [
      { label: "Expired Listing AI", href: "/expired-listing-ai" },
      { label: "Real Estate AI Caller", href: "/real-estate-ai-caller" },
      { label: "Real Estate industry page", href: "/industry/real-estate" },
    ],
  },

  "mortgage-ai-caller": {
    slug: "mortgage-ai-caller",
    metaTitle: "AI Cold Caller for Mortgage & Lending",
    metaDescription:
      "BlackSync's AI calls LendingTree, Zillow Home Loans, and webform leads within seconds, pre-qualifies them on credit, intent, and loan amount, and books them with your loan officers.",
    eyebrow: "Mortgage & Lending",
    headline: "Call Every Mortgage Lead Before They Shop Another Lender",
    subhead:
      "BlackSync's AI calls LendingTree, Zillow Home Loans, and webform leads within seconds of submission, pre-screens credit, intent, and loan amount, and books the qualified ones directly with your loan officers.",
    painPoints: [
      "$80+ LendingTree leads going to whoever calls first",
      "Loan officers buried in unqualified leads",
      "Refi opportunities lost to slow callbacks",
      "Compliance-heavy scripts hard to train humans on consistently",
    ],
    helps: [
      {
        title: "Calls Before They Shop Another Lender",
        description:
          "The agent reaches out within seconds of a lead submitting a form — before it goes stale or gets bought by a competing lender's callback.",
      },
      {
        title: "Pre-Qualifies on Credit, Intent, and Loan Amount",
        description:
          "Conversation-driven qualification gathers the details your loan officers need before the lead ever reaches their desk.",
      },
      {
        title: "Syncs With Encompass",
        description:
          "Native integration keeps loan officers working from current data instead of re-entering it manually.",
      },
    ],
    integrations: ["LendingTree", "Encompass", "Salesforce", "HubSpot", "Calendly", "Zapier"],
    testimonial: {
      quote:
        "We were missing 60% of leads after-hours. Now BlackSync calls them all and books them on my calendar before I wake up.",
      name: "James R.",
      role: "Loan Officer, Phoenix AZ",
    },
    faqs: [
      {
        q: "What information does the AI collect before booking?",
        a: "Credit range, loan amount, and purchase-vs-refi intent — the qualifying details your loan officers need before taking the call.",
      },
      {
        q: "Does it integrate with Encompass?",
        a: "Yes, along with Salesforce, HubSpot, Calendly, and Zapier.",
      },
      {
        q: "Can it call leads that come in after hours?",
        a: "Yes — the agent doesn't clock out. One loan officer using BlackSync was missing 60% of after-hours leads before switching.",
      },
    ],
    related: [
      { label: "Insurance AI", href: "/insurance-ai" },
      { label: "Mortgage industry page", href: "/industry/mortgage" },
    ],
  },

  "insurance-ai": {
    slug: "insurance-ai",
    metaTitle: "AI Caller for Insurance Agencies",
    metaDescription:
      "BlackSync's AI calls auto, home, life, and commercial insurance leads within seconds, gathers underwriting info, and books the call with your licensed agent.",
    eyebrow: "Insurance",
    headline: "Quote More Policies Without Hiring Another Agent",
    subhead:
      "BlackSync's AI calls auto, home, life, and commercial leads within seconds, gathers the underwriting info your CSRs would normally ask for, and books the call with your licensed agent.",
    painPoints: [
      "Lead vendors selling the same leads to 5 agencies",
      "CSRs spending all day on unqualified callers",
      "Renewal opportunities slipping through the cracks",
      "Multi-state campaigns hard to scale with a live calling team",
    ],
    helps: [
      {
        title: "Calls Every Lead Type in Seconds",
        description:
          "Auto, home, life, and commercial leads all get called the moment they come in, not whenever a CSR gets to them.",
      },
      {
        title: "Gathers Underwriting Info Up Front",
        description:
          "The agent asks the qualifying questions your CSR normally would, so your licensed agent gets on the phone with a ready-to-quote prospect.",
      },
      {
        title: "Handles Renewal Reminders Too",
        description:
          "AI-written email and SMS reminders keep renewal opportunities from slipping through the cracks.",
      },
    ],
    integrations: ["Applied", "EZLynx", "HubSpot", "Salesforce", "Zapier", "Twilio"],
    testimonial: {
      quote:
        "Our AI agent calls every quote request, qualifies it, and books my CSR's calendar. Closing rate went up, payroll went down.",
      name: "Sarah T.",
      role: "Agency Owner, Austin TX",
    },
    faqs: [
      {
        q: "What types of insurance leads can it handle?",
        a: "Auto, home, life, and commercial — the AI adjusts its qualifying questions to the lead type.",
      },
      {
        q: "Does it gather underwriting info before the agent gets on the phone?",
        a: "Yes — that's the point of the qualifying call, so your licensed agent starts the conversation with the details already in hand.",
      },
      {
        q: "Can it help with renewals, not just new quotes?",
        a: "Yes, via automated renewal reminder sequences over email and SMS.",
      },
    ],
    related: [
      { label: "Mortgage AI Caller", href: "/mortgage-ai-caller" },
      { label: "Insurance industry page", href: "/industry/insurance" },
    ],
  },
};

export default function UseCasePage({ slug }: { slug: string }) {
  const useCase = USE_CASES[slug];
  const [email, setEmail] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  usePageMeta({
    title: useCase.metaTitle,
    description: useCase.metaDescription,
    path: `/${useCase.slug}`,
  });

  useJsonLd("faq-schema", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: useCase.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  const mutation = useMutation({
    mutationFn: async (emailValue: string) => {
      await apiRequest("POST", "/api/leads", {
        name: emailValue.split("@")[0],
        email: emailValue,
        company: useCase.eyebrow,
        useCase: useCase.headline,
      });
    },
    onSuccess: (_d, emailValue) => {
      toast({ title: "You're in!", description: "Taking you to set up your access…" });
      goToRegister({ email: emailValue, company: useCase.eyebrow });
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

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid={`page-use-case-${useCase.slug}`}>
      <Navbar />

      {/* Hero */}
      <section className="relative pt-28 pb-16 md:pt-36 md:pb-24 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="inline-flex mb-6"
          >
            <Eyebrow>{useCase.eyebrow}</Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance"
          >
            {useCase.headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed text-pretty"
          >
            {useCase.subhead}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="flex flex-col items-center gap-3"
          >
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-2 w-full max-w-md"
            >
              <HoneypotInput inputRef={hpRef} />
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-11"
                data-testid="input-use-case-email"
              />
              <Button size="lg" type="submit" disabled={mutation.isPending} data-testid="button-use-case-cta">
                Get My Plan <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </motion.div>
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
                  What's slowing you down today.
                </h2>
              </Reveal>
            </div>
            <ul className="space-y-3">
              {useCase.painPoints.map((p) => (
                <li key={p} className="flex items-start gap-3 p-4 rounded-xl bg-card border shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{p}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* How it helps */}
      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {useCase.helps.map((h, i) => (
              <motion.div
                key={h.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
                className="p-6 rounded-2xl border bg-card shadow-sm"
              >
                <h3 className="font-display text-lg font-semibold tracking-tight mb-2">{h.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{h.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <Eyebrow>Native integrations</Eyebrow>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-5 font-display text-3xl md:text-4xl font-semibold tracking-tight mb-10 text-balance">
              Plugs into the tools you already run on.
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-wrap justify-center gap-2.5">
              {useCase.integrations.map((name) => (
                <div
                  key={name}
                  className="px-4 py-2 rounded-full bg-card border shadow-sm text-sm font-medium"
                >
                  {name}
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <p className="font-display text-2xl md:text-3xl font-medium leading-snug mb-8 text-foreground text-balance">
              "{useCase.testimonial.quote}"
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-sm font-semibold">{useCase.testimonial.name}</p>
            <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">
              {useCase.testimonial.role}
            </p>
          </Reveal>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion type="single" collapsible>
              {useCase.faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger data-testid={`faq-question-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      {/* Related + final CTA */}
      <section className="py-16 md:py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-3xl md:text-5xl font-semibold tracking-tight mb-4 leading-[1.1] text-balance">
              Ready to see it on your leads?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted-foreground text-lg mb-8 text-pretty">
              Get a custom plan built for your team in under 24 hours.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-10">
              <Link href="/#enterprise">
                <Button size="lg" data-testid="button-use-case-talk">
                  Talk to Sales <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button size="lg" variant="outline" data-testid="button-use-case-pricing">
                  See pricing
                </Button>
              </Link>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {useCase.related.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="text-muted-foreground hover:text-foreground underline underline-offset-4"
                  data-testid={`link-related-${r.href.replace(/\//g, "")}`}
                >
                  {r.label}
                </Link>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
