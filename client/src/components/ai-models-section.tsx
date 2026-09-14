import { Button } from "@/components/ui/button";
import { ArrowRight, Globe } from "lucide-react";
import { Link } from "wouter";
import { Eyebrow, Reveal } from "@/components/ui/section";

const MODEL_GROUPS = [
  // OpenAI — GPT-5.6 shipped Jul 2026 in three tiers (Sol / Terra / Luna).
  // GPT-4o Realtime is kept deliberately: it's the realtime voice model that powers calling.
  { provider: "OpenAI", models: ["GPT-5.6 Sol", "GPT-5.6 Terra", "GPT-5.6 Luna", "GPT-4o Realtime"] },
  { provider: "Anthropic", models: ["Claude Opus 5", "Claude Sonnet 5", "Claude Haiku 4.5"] },
  { provider: "Google", models: ["Gemini 3.1 Pro", "Gemini 3.6 Flash"] },
  { provider: "xAI", models: ["Grok 4.6"] },
];

export function AIModelsSection() {
  return (
    <section
      id="ai-models"
      data-testid="section-ai-models"
      className="py-20 md:py-28 relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative grid md:grid-cols-2 gap-10 md:gap-12 items-center rounded-[2rem] border border-card-border bg-card p-7 md:p-12 shadow-lg overflow-hidden">
            {/* subtle inner texture */}
            <div
              className="dot-bg pointer-events-none absolute inset-0 opacity-[0.35]"
              aria-hidden="true"
            />
            <div
              className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl"
              aria-hidden="true"
            />

            {/* LEFT */}
            <div className="relative">
              <Eyebrow data-testid="text-ai-models-eyebrow">AI Models</Eyebrow>
              <h2
                className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-balance"
                data-testid="text-ai-models-headline"
              >
                Powered by the world's most{" "}
                <span className="text-accent-grad">advanced AI</span>
              </h2>
              <p
                className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed text-pretty max-w-lg"
                data-testid="text-ai-models-subhead"
              >
                Choose your model. Every plan includes access to GPT-5.6, Claude Opus,
                Gemini, and Grok — you pick what runs your agent.
              </p>

              <div className="flex flex-wrap gap-3 mt-7">
                <Link href="/pricing">
                  <Button size="lg" data-testid="button-ai-models-pricing">
                    See Pricing
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <a href="#enterprise">
                  <Button
                    variant="outline"
                    size="lg"
                    data-testid="button-ai-models-enterprise"
                  >
                    Talk to Sales
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </div>

              <div className="mt-7 flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <p data-testid="text-languages-supported">
                  40+ languages including English, Spanish, Arabic, Mandarin, French, Portuguese & Hindi.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div
              className="relative rounded-2xl border border-border bg-background/60 divide-y divide-border"
              data-testid="list-model-groups"
            >
              {MODEL_GROUPS.map((group) => (
                <div key={group.provider} className="flex flex-col sm:flex-row sm:items-baseline gap-x-4 gap-y-1 px-5 py-4">
                  <span className="shrink-0 w-24 font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                    {group.provider}
                  </span>
                  <p className="text-sm text-foreground leading-relaxed">
                    {group.models.join(", ")}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
