import { Check, X, Clock, Bot, PhoneCall, DollarSign, BarChart3, Repeat } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

const comparisonData = [
  { feature: "Calls leads within 60 seconds", blacksync: true, others: false },
  { feature: "Works nights, weekends & holidays", blacksync: true, others: false },
  { feature: "Never calls in sick or quits", blacksync: true, others: false },
  { feature: "Handles 1,000+ calls per day", blacksync: true, others: false },
  { feature: "No salary, commissions, or benefits", blacksync: true, others: false },
  { feature: "Scales up or down instantly", blacksync: true, others: false },
  { feature: "Detects emotion and mirrors tone", blacksync: true, others: true },
  { feature: "Speaks 40+ languages", blacksync: true, others: false },
  { feature: "Powered by GPT-5, Claude & Gemini", blacksync: true, others: false },
];

const advantages = [
  { icon: Clock, title: "Speed to Lead", desc: "Under 60 seconds to first contact, every single time." },
  { icon: Bot, title: "Sounds Human", desc: "Trained on millions of real sales conversations." },
  { icon: PhoneCall, title: "Relentless Follow-Up", desc: "8-12 touches across calls, texts, and email." },
  { icon: DollarSign, title: "1/10th the Cost", desc: "Fraction of a human ISA, 10x the volume." },
  { icon: BarChart3, title: "Full Visibility", desc: "Every call recorded, transcribed, and scored." },
  { icon: Repeat, title: "Your Playbook", desc: "Trained on your scripts and qualifying criteria." },
];

export function WhySection() {
  return (
    <section id="why" data-testid="section-why" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Why BlackSync"
          title={<>AI Colleague vs. <span className="text-accent-grad">Hiring Another Human</span></>}
          lead="The same job, done faster, cheaper, and around the clock — with none of the overhead."
        />

        <div className="mt-14 grid lg:grid-cols-2 gap-8 lg:gap-10 items-start">
          <Reveal delay={0.05}>
            <div className="overflow-hidden rounded-2xl border border-card-border bg-card shadow-md">
              <div className="grid grid-cols-[1fr_5rem_5rem] items-center gap-3 px-5 py-4 border-b border-card-border bg-muted/40">
                <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Capability
                </span>
                <span className="flex justify-center">
                  <span className="rounded-full bg-primary px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-primary-foreground font-semibold shadow-sm">
                    AI
                  </span>
                </span>
                <span className="text-center font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
                  Human
                </span>
              </div>
              {comparisonData.map((row, i) => (
                <div
                  key={row.feature}
                  className={`grid grid-cols-[1fr_5rem_5rem] items-center gap-3 px-5 py-3.5 text-sm ${
                    i % 2 === 1 ? "bg-muted/20" : ""
                  } ${i < comparisonData.length - 1 ? "border-b border-card-border/60" : ""}`}
                  data-testid={`comparison-row-${i}`}
                >
                  <span className="font-medium text-foreground/90">{row.feature}</span>
                  <span className="flex justify-center">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-primary/10 text-primary">
                      <Check className="w-4 h-4" strokeWidth={3} />
                    </span>
                  </span>
                  <span className="flex justify-center">
                    {row.others ? (
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-green-500/10 text-green-600 dark:text-green-500">
                        <Check className="w-4 h-4" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-muted text-muted-foreground/40">
                        <X className="w-4 h-4" strokeWidth={2.5} />
                      </span>
                    )}
                  </span>
                </div>
              ))}
            </div>
          </Reveal>

          <div className="grid sm:grid-cols-2 gap-5">
            {advantages.map((item, index) => (
              <Reveal key={item.title} delay={index * 0.06}>
                <div
                  className="group h-full rounded-2xl border border-card-border bg-card p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                  data-testid={`advantage-${index}`}
                >
                  <div className="w-11 h-11 rounded-xl bg-accent text-accent-foreground flex items-center justify-center mb-4 shadow-sm">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-base font-semibold tracking-tight mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                    {item.desc}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
