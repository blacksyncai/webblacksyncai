import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Globe } from "lucide-react";
import { Link } from "wouter";
import { Eyebrow, Reveal } from "@/components/ui/section";

const otherModels = [
  { provider: "OpenAI", names: ["GPT-5", "GPT-5.1", "GPT-5.2", "GPT-5 Mini", "GPT-5 Nano", "GPT-4.1", "GPT-4.1 Mini", "GPT-4.1 Nano", "GPT-4o Realtime", "GPT-4o Mini Realtime"] },
  { provider: "Anthropic", names: ["Claude 4.5 Sonnet", "Claude 4.5 Haiku"] },
  { provider: "Google", names: ["Gemini 3.0 Flash", "Gemini 2.5 Flash", "Gemini 2.5 Flash Lite"] },
];

const stats = [
  { value: "1,000s", label: "tokens per second" },
  { value: "Low", label: "latency, every turn" },
  { value: "Long", label: "multi-step workflows" },
];

const points = [
  { title: "Built for the phone", body: "Tuned in-house for live sales calls: openers, objections, qualifying and booking." },
  { title: "Dedicated wafer-scale hardware", body: "Runs on wafer-scale AI chips instead of shared GPU clouds, so replies land before the pause gets awkward." },
  { title: "Holds long workflows", body: "Keeps context across long calls, transfers, follow-ups and CRM updates without losing the thread." },
  { title: "Private by default", body: "Your call data is never used to train public models." },
];

/**
 * Hardware clip, used with permission, looped. Its first and last frames are
 * different camera angles (one continuous assembly -> factory -> exploded-
 * view shot, not loopable B-roll), so a native loop jump-cuts every repeat.
 * A still of the first frame fades in over the last ~0.35s and fades back
 * out over the first ~0.35s after each restart, turning that cut into a
 * soft dissolve instead of a visible pop.
 */
function Wafer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const overlayRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    const overlay = overlayRef.current;
    if (!video || !overlay) return;
    const FADE_WINDOW = 0.35;
    let raf = 0;

    const tick = () => {
      const { currentTime, duration } = video;
      if (Number.isFinite(duration) && duration > 0) {
        const timeToEnd = duration - currentTime;
        let opacity = 0;
        if (timeToEnd < FADE_WINDOW) opacity = 1 - timeToEnd / FADE_WINDOW;
        else if (currentTime < FADE_WINDOW) opacity = 1 - currentTime / FADE_WINDOW;
        overlay.style.opacity = String(Math.min(1, Math.max(0, opacity)));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="relative w-full">
      <div className="absolute inset-0 rounded-[1.75rem] bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="relative overflow-hidden rounded-[1.75rem] border border-border bg-[#F4F2EF] shadow-2xl">
        <video
          ref={videoRef}
          className="block aspect-video w-full object-cover"
          poster="/media/wafer-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-label="Wafer-scale AI hardware"
          data-testid="video-ai-hardware"
        >
          <source src="/media/wafer.webm" type="video/webm" />
          <source src="/media/wafer.mp4" type="video/mp4" />
        </video>
        <img
          ref={overlayRef}
          src="/media/wafer-first-frame.jpg"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 block aspect-video w-full object-cover opacity-0"
        />
      </div>
    </div>
  );
}

/** Relative speed bars. Kept qualitative on the GPU side. */
function SpeedBars() {
  const bars = [
    { label: "Standard GPU cloud", width: "8%", tone: "bg-muted-foreground/40", value: "" },
    { label: "BlackSync Super Intelligence", width: "100%", tone: "bg-primary", value: "1,000s tk/s" },
  ];
  return (
    <div className="mt-10 space-y-4">
      {bars.map((b, i) => (
        <div key={b.label}>
          <div className="mb-1.5 flex items-baseline justify-between font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
            <span>{b.label}</span>
            <span className="normal-case text-foreground">{b.value}</span>
          </div>
          <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className={`h-full rounded-full ${b.tone}`}
              initial={{ width: 0 }}
              whileInView={{ width: b.width }}
              viewport={{ once: true }}
              transition={{ duration: i ? 1.1 : 1.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

export function AIModelsSection() {
  return (
    <section id="ai-models" data-testid="section-ai-models" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal>
          <div className="relative rounded-[2rem] border border-card-border bg-card p-7 md:p-12 shadow-lg overflow-hidden">
            <div className="dot-bg pointer-events-none absolute inset-0 opacity-[0.35]" aria-hidden="true" />
            <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/10 blur-3xl" aria-hidden="true" />

            <div className="relative grid md:grid-cols-2 gap-12 items-center">
              {/* LEFT */}
              <div>
                <Eyebrow data-testid="text-ai-models-eyebrow">In-house AI</Eyebrow>
                <h2
                  className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight leading-[1.05] text-balance"
                  data-testid="text-ai-models-headline"
                >
                  Our own AI, running on <span className="text-accent-grad">wafer-scale silicon</span>
                </h2>
                <p
                  className="mt-4 text-muted-foreground text-base md:text-lg leading-relaxed text-pretty max-w-lg"
                  data-testid="text-ai-models-subhead"
                >
                  BlackSync Super Intelligence is our in-house model for live phone calls. It runs on
                  dedicated wafer-scale chips that process thousands of tokens per second, so your
                  agent thinks, answers and moves through long workflows without the lag.
                </p>

                <div className="mt-8 grid grid-cols-3 gap-3">
                  {stats.map((s) => (
                    <div key={s.label} className="rounded-xl border border-border bg-background/70 p-3">
                      <div className="font-display text-xl md:text-2xl font-semibold text-primary">{s.value}</div>
                      <div className="mt-0.5 text-xs text-muted-foreground leading-snug">{s.label}</div>
                    </div>
                  ))}
                </div>

                <SpeedBars />

                <div className="flex flex-wrap gap-3 mt-8">
                  <Link href="/pricing">
                    <Button size="lg" data-testid="button-ai-models-pricing">
                      See Pricing
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </Link>
                  <a href="#enterprise">
                    <Button variant="outline" size="lg" data-testid="button-ai-models-enterprise">
                      Talk to Sales
                    </Button>
                  </a>
                </div>
              </div>

              {/* RIGHT */}
              <div>
                <Wafer />
                <div className="mt-12 grid sm:grid-cols-2 gap-x-6 gap-y-5">
                  {points.map((p) => (
                    <div key={p.title} className="border-l-2 border-primary pl-3">
                      <div className="font-display text-sm font-semibold">{p.title}</div>
                      <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{p.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* ALSO AVAILABLE */}
            <div className="relative mt-12 border-t border-border pt-8">
              <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
                Also available on every plan
              </div>
              <div className="mt-4 space-y-3">
                {otherModels.map((g) => (
                  <div key={g.provider} className="flex flex-wrap items-center gap-2">
                    <span className="w-20 shrink-0 text-xs font-semibold text-foreground">{g.provider}</span>
                    {g.names.map((m) => (
                      <span
                        key={m}
                        className="rounded-full border border-border bg-background px-2.5 py-1 text-xs text-muted-foreground"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
              <div className="mt-6 flex items-center gap-2 text-sm text-muted-foreground">
                <Globe className="w-4 h-4 text-primary shrink-0" />
                <p data-testid="text-languages-supported">
                  40+ languages including English, Spanish, Arabic, Mandarin, French, Portuguese and Hindi.
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
