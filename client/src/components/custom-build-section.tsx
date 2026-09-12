import { Workflow, Plug, Database, ListChecks, Route, Repeat } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

// Each point names the thing the customer already owns, then what we do with it.
// The "Your X" label is the whole argument: the agent bends to the business.
const points = [
  {
    icon: Workflow,
    label: "Your workflows",
    title: "Built around your workflows",
    description: "We map how your team already works, then build to match it.",
  },
  {
    icon: Plug,
    label: "Your tools",
    title: "Connected to your CRM and tools",
    description: "It lives inside your stack — not beside it.",
  },
  {
    icon: Database,
    label: "Your data",
    title: "Uses your lead and customer data",
    description: "Your history, your fields, your notes. Nothing generic.",
  },
  {
    icon: ListChecks,
    label: "Your criteria",
    title: "Custom qualification logic",
    description: "It asks what your closers ask, and scores the way you score.",
  },
  {
    icon: Route,
    label: "Your team",
    title: "Smart routing and handoffs",
    description: "The right rep, the right moment, with the full context.",
  },
  {
    icon: Repeat,
    label: "Your cadence",
    title: "Follow-up at scale",
    description: "Every lead chased on your schedule until they answer.",
  },
];

export function CustomBuildSection() {
  return (
    <section
      id="custom-build"
      data-testid="section-custom-build"
      className="py-20 md:py-28 relative"
    >
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Custom Built"
          title={
            <>
              Not another{" "}
              <span className="text-accent-grad">
                {/* non-breaking hyphens keep "off-the-shelf" from splitting across lines */}
                off&#8209;the&#8209;shelf AI agent.
              </span>
            </>
          }
          lead="We learn how your business already operates, then build the agent around your funnels, CRM, qualification process, routing, follow-up, and team."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
          {points.map((point, index) => (
            <Reveal key={point.title} delay={index * 0.06} className="h-full">
              <div
                className="group relative flex h-full flex-col items-start rounded-2xl border border-card-border bg-card p-6 md:p-7 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                data-testid={`custom-build-point-${index}`}
              >
                <div className="mb-5 flex w-full items-center justify-between gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <point.icon className="h-5 w-5" />
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                    {point.label}
                  </span>
                </div>

                <h3 className="font-display text-lg font-semibold tracking-tight mb-2 text-pretty">
                  {point.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed text-pretty">
                  {point.description}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <p
            className="mt-12 text-center text-base md:text-lg font-medium text-foreground/80 text-pretty"
            data-testid="text-custom-build-closer"
          >
            One platform. Built different for every customer.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
