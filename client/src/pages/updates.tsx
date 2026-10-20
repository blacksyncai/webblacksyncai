import { Link } from "wouter";
import { ArrowRight, CalendarDays } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { Badge } from "@/components/ui/badge";
import { usePageMeta } from "@/hooks/use-page-meta";

export const UPDATES = [
  {
    slug: "chatgpt-integration",
    date: "2026-10-20",
    dateLabel: "October 20, 2026",
    title: "Introducing BlackSync AI for ChatGPT",
    excerpt:
      "Manage your AI agents, campaigns, calls, contacts, and analytics straight from ChatGPT. Complimentary signup credits, no credit card required.",
    image: "/images/blacksync-chatgpt-launch.jpg",
    tag: "New",
  },
];

export default function UpdatesPage() {
  usePageMeta({ path: "/updates" });
  return (
    <div className="min-h-screen bg-background" data-testid="page-updates">
      <Navbar />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Reveal>
          <Eyebrow>Product Updates</Eyebrow>
          <h1
            className="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-tight text-balance"
            data-testid="updates-heading"
          >
            What&apos;s new at BlackSync
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-2xl">
            Product announcements, integrations, and improvements — straight
            from the team building your AI workforce.
          </p>
        </Reveal>

        <div className="mt-14 space-y-8">
          {UPDATES.map((u) => (
            <Reveal key={u.slug}>
              <Link
                href={`/updates/${u.slug}`}
                className="group block rounded-2xl border border-border/60 bg-card/40 overflow-hidden hover-elevate transition-all duration-200"
                data-testid="update-card"
              >
                <div className="grid md:grid-cols-[2fr_3fr]">
                  <div className="overflow-hidden aspect-[1491/1055] md:aspect-auto md:h-full">
                    <img
                      src={u.image}
                      alt={u.title}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-6 sm:p-8 flex flex-col">
                    <div className="flex items-center gap-3">
                      <Badge variant="secondary">{u.tag}</Badge>
                      <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <CalendarDays className="w-3.5 h-3.5" aria-hidden="true" />
                        {u.dateLabel}
                      </span>
                    </div>
                    <h2 className="mt-4 text-xl sm:text-2xl font-semibold tracking-tight">
                      {u.title}
                    </h2>
                    <p className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {u.excerpt}
                    </p>
                    <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
                      Read the announcement
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
