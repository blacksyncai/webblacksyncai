import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { Link } from "wouter";
import { Eyebrow, Reveal } from "@/components/ui/section";

const models = [
  // OpenAI — GPT-5.6 shipped Jul 2026 in three tiers (Sol / Terra / Luna).
  { name: "GPT-5.6 Sol", provider: "OpenAI", short: "5.6 Sol", color: "bg-emerald-500", premium: true },
  { name: "GPT-5.6 Terra", provider: "OpenAI", short: "5.6 Terra", color: "bg-emerald-500", premium: true },
  { name: "GPT-5.6 Luna", provider: "OpenAI", short: "5.6 Luna", color: "bg-emerald-500", premium: false },
  // Kept deliberately: the realtime voice model, which is what powers calling.
  { name: "GPT-4o Realtime", provider: "OpenAI", short: "4o-RT", color: "bg-emerald-500", premium: true },

  { name: "Claude Opus 5", provider: "Anthropic", short: "Opus 5", color: "bg-orange-500", premium: true },
  { name: "Claude Sonnet 5", provider: "Anthropic", short: "Sonnet 5", color: "bg-orange-500", premium: true },
  { name: "Claude Haiku 4.5", provider: "Anthropic", short: "Haiku 4.5", color: "bg-orange-500", premium: false },

  { name: "Gemini 3.1 Pro", provider: "Google", short: "Gemini 3.1", color: "bg-blue-500", premium: true },
  { name: "Gemini 3.6 Flash", provider: "Google", short: "3.6 Flash", color: "bg-blue-500", premium: false },

  { name: "Grok 4.6", provider: "xAI", short: "Grok 4.6", color: "bg-violet-500", premium: true },
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
                    Talk to Sales →
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
            <div className="relative grid grid-cols-2 sm:grid-cols-5 gap-2.5">
              {models.map((model, idx) => (
                <motion.div
                  key={model.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: idx * 0.03 }}
                  className="group relative aspect-square p-2 bg-background border border-border flex flex-col items-center justify-center text-center shadow-sm hover:border-primary hover:shadow-md transition-all duration-300 cursor-default"
                  style={{
                    clipPath:
                      "polygon(25% 0%, 75% 0%, 100% 25%, 100% 75%, 75% 100%, 25% 100%, 0% 75%, 0% 25%)",
                  }}
                  data-testid={`tile-model-${idx}`}
                  title={`${model.name} · ${model.provider}`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${model.color} mb-1 ring-2 ring-transparent group-hover:ring-primary/20 transition-all`}
                  />
                  <span className="font-display text-[10px] sm:text-[11px] font-semibold leading-tight text-foreground">
                    {model.short}
                  </span>
                  {model.premium && (
                    <Badge
                      variant="secondary"
                      className="mt-1 font-mono text-[8px] px-1.5 py-0 h-3.5 leading-none tracking-wider"
                    >
                      PRO
                    </Badge>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
