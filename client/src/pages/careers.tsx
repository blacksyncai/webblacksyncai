import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { JobApplyDialog, type JobField } from "@/components/job-apply-dialog";
import { usePageMeta } from "@/hooks/use-page-meta";
import { CheckCircle2, ArrowRight, AlertTriangle } from "lucide-react";

type Role = {
  slug: string;
  title: string;
  meta: string;
  tagline: string;
  strict?: boolean;
  about: string;
  responsibilities: string[];
  requirements: string[];
  fields: JobField[];
};

const ROLES: Role[] = [
  {
    slug: "sales",
    title: "Sales — SDR / Account Executive",
    meta: "Full-time · Remote · Commission + base",
    tagline: "Turn qualified conversations into closed customers.",
    about:
      "BlackSync's AI already books the appointments — we need people who can run the conversation from there. We're hiring for both tracks at once: SDR (outbound prospecting, booking demos) and Account Executive (running demos, closing deals). Tell us which fits you, or both.",
    responsibilities: [
      "Run outbound prospecting and/or demo calls with real estate, mortgage, and insurance teams",
      "Qualify inbound leads booked by BlackSync's own AI agent",
      "Run product demos and close new accounts (AE track)",
      "Keep the CRM current — every call, every outcome, logged",
      "Feed product and marketing what you're hearing on calls",
    ],
    requirements: [
      "Comfortable on the phone daily — this is a calling-heavy role",
      "Some background in SaaS, real estate tech, or B2B sales preferred, not required",
      "Coachable — we'll train you on the product and the script",
      "Self-motivated; this is a remote role with real autonomy",
    ],
    fields: [
      { id: "name", label: "Full name", type: "text", placeholder: "Jane Doe" },
      { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
      { id: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567" },
      {
        id: "track",
        label: "Which track are you applying for?",
        type: "select",
        options: ["SDR (outbound prospecting)", "Account Executive (closing)", "Open to either"],
      },
      {
        id: "experience",
        label: "Years of sales experience",
        type: "select",
        options: ["0–1 years", "1–3 years", "3–5 years", "5+ years"],
      },
      {
        id: "coldCalling",
        label: "How comfortable are you making outbound cold calls every day?",
        type: "select",
        options: ["Very comfortable — I do it now", "Comfortable with training", "New to it, but eager"],
      },
      {
        id: "soldSaas",
        label: "Have you sold SaaS or another subscription product before?",
        type: "select",
        options: ["Yes", "No", "Sort of — adjacent experience"],
      },
      {
        id: "linkedin",
        label: "LinkedIn or resume link",
        type: "text",
        placeholder: "linkedin.com/in/...",
        optional: true,
      },
      {
        id: "why",
        label: "Why BlackSync?",
        type: "textarea",
        placeholder: "Keep it specific to us, not generic.",
      },
    ],
  },
  {
    slug: "software-engineer",
    title: "Software Engineer",
    meta: "Full-time · Remote · High bar",
    tagline: "We hire rarely for this role, and the bar is high.",
    strict: true,
    about:
      "This isn't a volume-hire role. We're looking for one engineer who can own real features in production — our AI calling infrastructure, CRM integrations, and the dashboard our customers live in every day — with minimal hand-holding. If you need a lot of structure to be productive, this probably isn't the right fit right now.",
    responsibilities: [
      "Ship production features across our React/TypeScript frontend and Node backend",
      "Own integrations with CRMs, telephony providers, and calendar systems end-to-end",
      "Make real architectural calls, not just implement someone else's spec",
      "Write code other engineers can read and build on without you explaining it in Slack",
    ],
    requirements: [
      "3+ years of professional experience shipping production software, not just personal projects",
      "Strong TypeScript, and real experience with React and Node — not \"used it in a tutorial\"",
      "A public GitHub, portfolio, or shipped product we can actually look at — required, not optional",
      "Comfortable owning ambiguity: we won't hand you a fully-specced ticket every time",
      "Our process includes a paid take-home assessment and a live pairing session — only apply if you're prepared for both",
    ],
    fields: [
      { id: "name", label: "Full name", type: "text", placeholder: "Jane Doe" },
      { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
      { id: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567", optional: true },
      {
        id: "portfolio",
        label: "GitHub or portfolio URL",
        type: "text",
        placeholder: "github.com/...",
        helper: "Required. We will look at this before anything else.",
      },
      {
        id: "yearsExperience",
        label: "Years of professional software engineering experience",
        type: "select",
        options: ["Less than 3 years", "3–5 years", "5–8 years", "8+ years"],
      },
      {
        id: "stack",
        label: "Primary stack",
        type: "text",
        placeholder: "e.g. TypeScript, React, Node, Postgres",
      },
      {
        id: "hardestDecision",
        label: "Link to something you built, plus one sentence on the hardest technical decision you made building it",
        type: "textarea",
        placeholder: "Be specific. This matters more than your resume.",
      },
      {
        id: "readyForAssessment",
        label: "Our process includes a paid take-home and a live pairing session. Are you prepared for that?",
        type: "select",
        options: ["Yes", "No"],
      },
      {
        id: "why",
        label: "Why this role, specifically",
        type: "textarea",
        placeholder: "Generic cover letters are an instant no.",
      },
    ],
  },
  {
    slug: "developer",
    title: "Developer",
    meta: "Full-time · Remote · Junior–mid level",
    tagline: "Good fundamentals and a willingness to learn matter more than a resume.",
    about:
      "This is a friendlier entry point into the team than our Software Engineer role — great if you're earlier in your career, self-taught, or coming from a bootcamp. You'll work on smaller, well-scoped tasks alongside more senior engineers, get real code review, and grow into bigger ownership over time. We care more about how you think and how you take feedback than your years on a resume.",
    responsibilities: [
      "Build and fix smaller, well-scoped features across the frontend and backend",
      "Pair with and learn from senior engineers on the team",
      "Squash bugs and chip away at tech debt",
      "Ask questions — we'd rather you ask than guess",
    ],
    requirements: [
      "Solid fundamentals in JavaScript/TypeScript — bootcamp, self-taught, or degree, we don't care which",
      "Some exposure to React or a similar framework",
      "Coachable and open to feedback",
      "A portfolio or side projects are a nice-to-have, not a requirement",
    ],
    fields: [
      { id: "name", label: "Full name", type: "text", placeholder: "Jane Doe" },
      { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
      { id: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567", optional: true },
      {
        id: "portfolio",
        label: "GitHub, portfolio, or side projects",
        type: "text",
        placeholder: "github.com/... (optional, but happy to see what you've built)",
        optional: true,
      },
      {
        id: "yearsExperience",
        label: "Experience level",
        type: "select",
        options: ["Learning to code / bootcamp grad", "Less than 1 year", "1–2 years", "2–4 years"],
      },
      {
        id: "background",
        label: "How did you learn to code?",
        type: "text",
        placeholder: "Bootcamp, self-taught, degree, all of the above…",
      },
      {
        id: "why",
        label: "Why this role?",
        type: "textarea",
        placeholder: "Tell us a bit about yourself — no need to be formal.",
      },
    ],
  },
  {
    slug: "marketing",
    title: "Marketing / Social Media",
    meta: "Full-time · Remote",
    tagline: "Own how BlackSync sounds and shows up everywhere.",
    about:
      "We need someone who can own content and social from strategy to execution — video, copy, paid, organic — for a B2B audience that doesn't look like typical SaaS Twitter. Real estate agents, mortgage brokers, and insurance agencies live on Instagram, TikTok, and Facebook groups, not just LinkedIn.",
    responsibilities: [
      "Plan and produce content across social platforms — video, graphics, and copy",
      "Run and optimize paid social campaigns",
      "Grow BlackSync's organic presence in real estate, mortgage, and insurance communities",
      "Work with sales to turn customer wins into case studies and content",
    ],
    requirements: [
      "A portfolio of content you've made or managed — not just a marketing degree",
      "Comfortable with short-form video (TikTok/Reels style), not just static graphics",
      "Some paid social ad experience preferred",
      "Understands B2B audiences that aren't your typical tech crowd",
    ],
    fields: [
      { id: "name", label: "Full name", type: "text", placeholder: "Jane Doe" },
      { id: "email", label: "Email", type: "email", placeholder: "you@email.com" },
      { id: "phone", label: "Phone", type: "tel", placeholder: "(555) 123-4567", optional: true },
      {
        id: "portfolio",
        label: "Portfolio, social handles, or work samples",
        type: "text",
        placeholder: "instagram.com/... or a portfolio link",
      },
      {
        id: "experience",
        label: "What kind of content have you made or managed before?",
        type: "textarea",
        placeholder: "Video editing, copywriting, paid ads, community management, etc.",
      },
      {
        id: "bestWork",
        label: "Link to a piece of content you made that performed well",
        type: "text",
        placeholder: "A link, or describe it if it's not online",
        optional: true,
      },
      {
        id: "why",
        label: "Why BlackSync?",
        type: "textarea",
        placeholder: "Keep it specific to us, not generic.",
      },
    ],
  },
];

export default function CareersPage() {
  usePageMeta({
    title: "Careers",
    description:
      "Join BlackSync. We're hiring for Sales (SDR/Account Executive), Software Engineering, and Marketing/Social Media roles.",
    path: "/careers",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-careers">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Careers</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            Come build the AI colleague, sell it, or spread the word.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            We're a small, remote team hiring for three roles right now. Read the details, then apply directly —
            no separate portal.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          {ROLES.map((role) => (
            <Reveal key={role.slug}>
              <div
                className={`rounded-2xl border bg-card shadow-sm p-6 md:p-8 ${role.strict ? "border-primary/40 ring-1 ring-primary/10" : ""}`}
                data-testid={`role-card-${role.slug}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-5">
                  <div>
                    {role.strict && (
                      <span className="inline-flex items-center gap-1.5 mb-2 text-[11px] font-mono uppercase tracking-wide text-primary">
                        <AlertTriangle className="w-3.5 h-3.5" /> High bar — read before applying
                      </span>
                    )}
                    <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-1">
                      {role.title}
                    </h2>
                    <p className="text-sm font-mono uppercase tracking-wide text-muted-foreground">{role.meta}</p>
                  </div>
                  <JobApplyDialog roleTitle={role.title} fields={role.fields}>
                    <Button size="lg" data-testid={`button-apply-${role.slug}`} className="shrink-0">
                      Apply <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </JobApplyDialog>
                </div>

                <p className="text-muted-foreground leading-relaxed mb-6 text-pretty">{role.tagline}</p>
                <p className="text-sm text-muted-foreground leading-relaxed mb-6 text-pretty">{role.about}</p>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                      What you'll do
                    </p>
                    <ul className="space-y-2">
                      {role.responsibilities.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
                      What we're looking for
                    </p>
                    <ul className="space-y-2">
                      {role.requirements.map((r) => (
                        <li key={r} className="flex items-start gap-2 text-sm leading-relaxed">
                          <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-20 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3">
              Don't see your role?
            </h2>
          </Reveal>
          <Reveal delay={0.05}>
            <p className="text-muted-foreground mb-6">
              We're a small team — if you think you'd be a strong addition, reach out anyway.
            </p>
          </Reveal>
          <Reveal delay={0.1}>
            <a href="mailto:hello@blacksync.ai">
              <Button size="lg" variant="outline" data-testid="button-careers-contact">
                Email hello@blacksync.ai
              </Button>
            </a>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
