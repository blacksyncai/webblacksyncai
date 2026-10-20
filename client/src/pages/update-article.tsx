import { Link } from "wouter";
import { ArrowRight, CalendarDays, ChevronRight } from "lucide-react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/ui/section";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { SITE_URL } from "@shared/route-meta";
import { UPDATES } from "@/pages/updates";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-3 text-muted-foreground leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export default function UpdateArticlePage({ slug }: { slug: string }) {
  const update = UPDATES.find((u) => u.slug === slug);
  usePageMeta({ path: `/updates/${slug}` });
  useJsonLd("update-article-schema", update && {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: update.title,
    datePublished: update.date,
    image: `${SITE_URL}${update.image}`,
    author: { "@type": "Organization", name: "BlackSync.ai", url: `${SITE_URL}/` },
    publisher: { "@type": "Organization", name: "BlackSync.ai", url: `${SITE_URL}/` },
    mainEntityOfPage: `${SITE_URL}/updates/${slug}`,
  });

  if (!update) {
    return (
      <div className="min-h-screen bg-background" data-testid="page-update-not-found">
        <Navbar />
        <main className="max-w-3xl mx-auto px-4 pt-32 pb-24 text-center">
          <h1 className="text-3xl font-semibold">Update not found</h1>
          <p className="mt-4 text-muted-foreground">
            <Link href="/updates" className="text-primary hover:underline">
              Back to Product Updates
            </Link>
          </p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background" data-testid="page-update-article">
      <Navbar />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24">
        <Reveal>
          <nav aria-label="Breadcrumb" className="mb-7 flex items-center gap-1.5 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <Link href="/updates" className="hover:text-foreground transition-colors">Product Updates</Link>
            <ChevronRight className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
            <span aria-current="page" className="text-foreground font-medium truncate">{update.title}</span>
          </nav>

          <div className="flex items-center gap-3">
            <Badge variant="secondary">{update.tag}</Badge>
            <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CalendarDays className="w-4 h-4" aria-hidden="true" />
              {update.dateLabel}
            </span>
          </div>

          <h1
            className="mt-5 font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance"
            data-testid="update-title"
          >
            {update.title}
          </h1>
        </Reveal>

        <Reveal delay={0.1}>
          <img
            src={update.image}
            alt="BlackSync AI for ChatGPT launch graphic"
            className="mt-10 w-full rounded-2xl border border-border/60"
            width={1491}
            height={1055}
            data-testid="update-featured-image"
          />
        </Reveal>

        <article className="mt-8 text-base sm:text-lg">
          <p className="text-muted-foreground leading-relaxed">
            Your AI workforce just moved into the tool you already use. With
            the new BlackSync integration for ChatGPT, you can run your entire
            voice-agent operation — agents, campaigns, calls, contacts, and
            analytics — without ever opening a separate dashboard.
          </p>

          <Section title="Build agents right inside your chat">
            <p>
              Describe the agent you want — the persona, the script, the
              objection handling, the guardrails — and BlackSync builds it
              inside your ChatGPT conversation. Want it warmer? More direct?
              Bilingual? Ask, and the agent updates on the spot. No builder
              UI, no forms, no setup wizard: if you can describe it, you can
              ship it.
            </p>
          </Section>

          <Section title="Launch campaigns from a prompt">
            <p>
              Point BlackSync at a lead list or CRM segment, tell it your
              cadence and follow-up rules, and the campaign starts dialing —
              hundreds of personalized calls in minutes. Live results stream
              back into the conversation as calls complete, so you can steer
              mid-campaign instead of waiting for a report.
            </p>
          </Section>

          <Section title="All your context, already with you">
            <p>
              The integration carries your context into every request. Your
              agents, campaigns, contacts, and call history are all available
              conversationally, so a question like &ldquo;how did the expired
              listing campaign do yesterday?&rdquo; gets a real answer with
              transcripts, outcomes, and booked appointments — not a link to
              a dashboard.
            </p>
          </Section>

          <Section title="And everything else you can yap about">
            <p>
              Because it runs on natural language, the integration flexes
              beyond the basics. Draft a new script variant and A/B it against
              your current one. Ask for a weekly digest of connect rates and
              bookings. Pull the full transcript of the call that closed your
              best appointment last Tuesday. Segment your contacts by
              qualification score and re-dial only the warm ones. If it can
              be asked, BlackSync can usually do it — and when it can&rsquo;t,
              it tells you exactly what it needs.
            </p>
          </Section>

          <Section title="Every call, logged and searchable">
            <p>
              Ask what happened on any call and get the summary, transcript,
              outcome, and next-best-action. Missed a follow-up? Ask BlackSync
              to re-dial the lead and it handles the rest.
            </p>
          </Section>

          <Section title="Contacts, on command">
            <p>
              Add, update, and segment contacts conversationally. BlackSync
              keeps your CRM in sync automatically, so the records you manage
              in ChatGPT are the same ones your team sees everywhere else.
            </p>
          </Section>

          <Section title="Analytics, asked and answered">
            <p>
              Skip the reports tab. Ask for connect rates, appointment counts,
              or cost-per-booking in plain English and get the numbers — with
              the context you need to act on them.
            </p>
          </Section>

          <Section title="Try it free">
            <p>
              Sign up today and get complimentary signup credits to test the
              integration with your own agents and lead lists. No credit card
              required.
            </p>
          </Section>
        </article>

        <Reveal delay={0.1}>
          <div className="mt-12 rounded-2xl border border-border/60 bg-card/40 p-8 sm:p-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              Run your AI workforce from ChatGPT
            </h2>
            <p className="mt-3 text-muted-foreground max-w-md mx-auto">
              Complimentary signup credits included. No credit card required.
            </p>
            <a
              href="https://blacksync.si/sign-up"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block"
            >
              <Button size="lg" data-testid="update-cta">
                Try It Free
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </Reveal>
      </main>
      <Footer />
    </div>
  );
}
