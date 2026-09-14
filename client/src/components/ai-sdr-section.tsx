import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

const CAPABILITIES = [
  "Prospects target accounts and qualifies interest",
  "Follows up automatically until a prospect is ready",
  "Hands live opportunities straight to your closers",
];

export function AiSdrSection() {
  return (
    <section data-testid="section-ai-sdr" className="py-20 md:py-28 relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="AI SDR"
          title={
            <>
              Need a <span className="text-accent-grad">Sales Development Representative</span>?
            </>
          }
          lead="BlackSync's AI SDR — short for Sales Development Representative — prospects, qualifies, and hands live opportunities to your sales team. Built for outbound-heavy teams that need more capacity, not more headcount."
        />

        <Reveal delay={0.12}>
          <ul className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-2 max-w-2xl mx-auto">
            {CAPABILITIES.map((c) => (
              <li key={c} className="flex items-center gap-2 text-sm text-foreground/85" data-testid={`text-ai-sdr-capability-${c.slice(0, 12).toLowerCase().replace(/\s+/g, "-")}`}>
                <span className="h-1 w-1 rounded-full bg-primary shrink-0" aria-hidden="true" />
                {c}
              </li>
            ))}
          </ul>
        </Reveal>

        <Reveal delay={0.18}>
          <div className="mt-9 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/ai-sdr">
              <Button size="lg" className="w-full sm:w-auto" data-testid="button-ai-sdr-explore">
                Explore the AI SDR
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <a href="#enterprise">
              <Button size="lg" variant="outline" className="w-full sm:w-auto" data-testid="button-ai-sdr-enterprise">
                Enterprise
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
