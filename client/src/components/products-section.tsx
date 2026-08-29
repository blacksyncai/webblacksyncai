import { Home, Shield, Landmark, Building2, Car, Wrench, Stethoscope, Flower2, Scale } from "lucide-react";
import { SectionHeading, Reveal } from "@/components/ui/section";

const industries = [
  {
    name: "Real Estate",
    tagline: "AI ISA for Agents & Brokerages",
    description:
      "Calls every lead in 60 seconds, qualifies buyers and sellers, books showings, and follows up until they transact.",
    icon: Home,
    gradient: "from-amber-700 to-amber-900",
  },
  {
    name: "Insurance",
    tagline: "AI SDR for Agents & Carriers",
    description:
      "Prospects for new policies, re-engages lapsed customers, handles renewals, and books consultations across all lines.",
    icon: Shield,
    gradient: "from-stone-500 to-stone-700",
  },
  {
    name: "Mortgage & Lending",
    tagline: "AI Loan Officer Assistant",
    description:
      "Pre-qualifies borrowers, nurtures rate shoppers, follows up on incomplete apps, and keeps your pipeline warm.",
    icon: Landmark,
    gradient: "from-yellow-700 to-yellow-900",
  },
];

const moreIndustries = [
  { icon: Wrench, name: "Home Services", href: "/industry/home-services" },
  { icon: Flower2, name: "Funeral Homes", href: "/industry/funeral-homes" },
  { icon: Scale, name: "Law Firms", href: "/industry/law-firms" },
  { icon: Stethoscope, name: "Healthcare", href: "/industry/healthcare" },
  { icon: Building2, name: "Property Management", href: "/industry/property-management" },
  { icon: Car, name: "Auto & P&C", href: "/industry/auto-pc" },
];

export function ProductsSection() {
  return (
    <section id="industries" data-testid="section-products" className="py-20 md:py-28 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Industries"
          title={<>Built for <span className="text-accent-grad">High-Value Sales</span></>}
          lead="Trained on millions of real conversations in your industry — so it speaks the language your leads expect from day one."
        />

        <div className="mt-14 grid md:grid-cols-3 gap-6">
          {industries.map((industry, index) => (
            <Reveal key={industry.name} delay={index * 0.06}>
              <div
                className="group flex h-full flex-col rounded-2xl border border-card-border bg-card p-7 md:p-8 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
                data-testid={`card-product-${index}`}
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${industry.gradient} flex items-center justify-center mb-6 shadow-md`}
                >
                  <industry.icon className="w-6 h-6 text-white" />
                </div>
                <p className="font-mono text-[11px] uppercase tracking-wider text-primary font-semibold mb-2">
                  {industry.tagline}
                </p>
                <h3 className="font-display text-2xl font-semibold tracking-tight mb-3">
                  {industry.name}
                </h3>
                <p className="text-[15px] text-muted-foreground leading-relaxed text-pretty">
                  {industry.description}
                </p>
                <div className="mt-auto pt-6">
                  <div className="flex items-center gap-2 border-t border-card-border/60 pt-5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground/80">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary" />
                    Trained on millions of real conversations
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="flex flex-wrap items-center justify-center gap-3 mt-12">
            <span className="font-mono text-[11px] uppercase tracking-wider text-muted-foreground">
              Also:
            </span>
            {moreIndustries.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="flex items-center gap-2 px-3.5 py-2 rounded-full border border-card-border bg-card text-sm text-foreground/80 shadow-sm hover:shadow-md hover:border-primary/40 hover:text-foreground transition-all"
                data-testid={`badge-industry-${item.name.toLowerCase().replace(/\s/g, "-")}`}
              >
                <item.icon className="w-4 h-4 text-primary" />
                {item.name}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
