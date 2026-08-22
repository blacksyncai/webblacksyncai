import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { Reveal } from "@/components/ui/section";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "How do credits work?",
    a: "Credits power your outbound calls — buy once and use them anytime, since unused credits roll over. You're not charged for a failed or empty call: no answer, a busy line, and voicemails are all 0 credits, and a quick hang-up isn't counted as a full conversation.",
  },
  {
    q: "What's the difference between Solo Agent and Team?",
    a: "Solo Agent includes 1 AI voice agent with up to 500 outbound calls/mo, calendar booking, and call recordings — built for a single user running their own pipeline. Team includes everything in Solo plus up to 5 AI voice agents, emotion detection and tone mirroring, native CRM sync, custom objection handling, round-robin lead distribution, and advanced analytics.",
  },
  {
    q: "Is there a setup fee or long-term contract?",
    a: "No hidden fees, and you can cancel anytime. Solo Agent and Team are self-serve — pick a plan and you're set up immediately. A phone number for your AI agent starts at $3.50/mo.",
  },
  {
    q: "What if I need more than the standard plans?",
    a: "Enterprise plans include unlimited agents and calls, a dedicated account manager, a custom AI voice persona, full CRM and workflow integration, white-label options, and API access with an SLA. Talk to Sales for custom pricing.",
  },
  {
    q: "Can your team build a custom AI agent or workflow for me?",
    a: "Yes. Add-ons include an Expert Dev Build (our team builds your entire AI agent — scripts, objection flows, CRM connections, and testing — for a one-time fee), Workflow Automation (a full automation pipeline across your tools), and CRM Sync + Agentic AI for deep two-way integration.",
  },
  {
    q: "How do I buy more credits?",
    a: "Credit packs are available anytime in 500, 1,000, or 3,000 credit increments, with better per-credit value at higher volumes — no need to change your plan to add more calling capacity.",
  },
];

export default function PricingPage() {
  usePageMeta({ path: "/pricing" });

  useJsonLd("pricing-faq-schema", {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-pricing">
      <Navbar />
      <div className="pt-16" />
      <PricingSection />

      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance">
              Frequently asked questions
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={f.q} value={`item-${i}`}>
                  <AccordionTrigger data-testid={`faq-question-${i}`}>{f.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </Reveal>
        </div>
      </section>

      <FinalCtaSection />
      <Footer />
    </div>
  );
}
