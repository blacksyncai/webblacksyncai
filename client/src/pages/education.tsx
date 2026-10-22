import { Fragment } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { FeatureCard } from "@/components/ui/grid-feature-cards";
import { BookCallDialog } from "@/components/book-call-dialog";
import { Link } from "wouter";
import {
  ArrowRight,
  PhoneCall,
  Users,
  Clock,
  Megaphone,
  ShieldCheck,
  CalendarCheck,
  ClipboardList,
  MapPin,
  Repeat,
  Settings2,
  Sparkles,
  Rocket,
  GraduationCap,
  School,
  Baby,
  HardHat,
} from "lucide-react";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useJsonLd } from "@/hooks/use-json-ld";
import { SITE_URL } from "@shared/route-meta";

type PainPoint = {
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  title: string;
  description: string;
  /** Short label for the hero capability pill, e.g. "Zone Calling". Falls back to `title`. */
  pillLabel?: string;
};
type FAQ = { q: string; a: string };

type ValueMath = {
  /** What one conversion is called for this vertical, e.g. "enrolled student". */
  unit: string;
  rows: { label: string; value: string }[];
  total: string;
  note: string;
};

type Vertical = {
  slug: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  navLabel: string;
  metaTitle: string;
  metaDescription: string;
  badge: string;
  headline: string;
  headlineAccent: string;
  subheadline: string;
  heroNote: string;
  painPoints: PainPoint[];
  whatWeDo: PainPoint[];
  valueMath: ValueMath;
  faqs: FAQ[];
};

const HOW_IT_WORKS = [
  {
    step: "1",
    icon: Settings2,
    title: "Tell us about your program",
    description: "Your enrollment area, openings, tuition or funding model, and what families usually ask about.",
  },
  {
    step: "2",
    icon: Sparkles,
    title: "We build & connect your agent",
    description: "Our team writes the script, loads your enrollment area or contact list, and connects your admissions calendar — no setup on your end.",
  },
  {
    step: "3",
    icon: Rocket,
    title: "Calls go out, tours get booked",
    description: "Families get a warm, informative call and a tour or info session lands directly on your admissions calendar.",
  },
];

const VERTICALS: Record<string, Vertical> = {
  "charter-schools": {
    slug: "charter-schools",
    icon: School,
    navLabel: "Charter Schools",
    metaTitle: "AI Enrollment Calling for Charter Schools",
    metaDescription:
      "BlackSync calls families in your enrollment zone and lottery waitlist, explains what makes your charter school different, answers the questions parents actually ask, and books the tour — so you fill every seat before the deadline.",
    badge: "For Charter Schools",
    headline: "Fill every seat",
    headlineAccent: "before the deadline.",
    subheadline:
      "Lottery windows and open-enrollment deadlines don't wait. BlackSync calls families in your zone, explains what makes your school different, and books the tour — by consultation only.",
    heroNote: "Built for charter school admissions and outreach teams — not a self-serve signup.",
    painPoints: [
      {
        icon: Users,
        title: "Families don't know you exist",
        description: "A flyer in a backpack isn't competing with the district's marketing budget. Most zoned families have never heard your pitch.",
      },
      {
        icon: Clock,
        title: "Waitlist families go cold",
        description: "A lottery waitlist is a list of people who already said yes once. Most schools never call them back fast enough.",
      },
      {
        icon: ShieldCheck,
        title: "Safety and rigor questions go unanswered",
        description: "Bullying policy, class size, academic track record — the questions that actually convert a family rarely make it into a mailer.",
      },
      {
        icon: Megaphone,
        title: "Enrollment deadlines create a ticking clock",
        description: "Every week closer to the deadline, your admissions team has less time to reach every family on the list.",
      },
    ],
    whatWeDo: [
      {
        icon: PhoneCall,
        title: "Calls your enrollment zone",
        pillLabel: "Zone Calling",
        description: "Reaches households in your district boundary or zoned area with a warm, natural call about open seats.",
      },
      {
        icon: Repeat,
        title: "Works the lottery waitlist",
        pillLabel: "Waitlist Follow-Up",
        description: "Calls back through waitlisted families the moment a seat opens, instead of waiting on an email they'll miss.",
      },
      {
        icon: ClipboardList,
        title: "Answers the real questions",
        pillLabel: "Live Q&A",
        description: "Class size, academic programs, extended day, online/hybrid options, and your safety and anti-bullying policies — handled in conversation, not a FAQ page.",
      },
      {
        icon: CalendarCheck,
        title: "Books the tour or info session",
        pillLabel: "Tour Booking",
        description: "Qualified, interested families land straight on your admissions team's calendar.",
      },
    ],
    valueMath: {
      unit: "enrolled student",
      rows: [
        { label: "Example per-pupil funding", value: "$9,000 / year" },
        { label: "Typical years enrolled (K–8)", value: "× 5 years" },
      ],
      total: "$45,000",
      note: "Illustrative example only — your actual per-pupil funding and average enrollment length will vary by state and school. Ask us to run the real numbers for your district.",
    },
    faqs: [
      {
        q: "Is this compliant with how we're allowed to contact families?",
        a: "We call from lists you provide or geographic areas you define — your own inquiry lists, waitlists, or a zoned area you choose. We don't scrape or buy random minors' data, and every call includes a clear way to opt out. We'll walk through your specific requirements during the consultation.",
      },
      {
        q: "Does this replace our admissions staff?",
        a: "No — it handles the volume of outbound calling your staff doesn't have time for, and hands your team a qualified, interested family with a tour already on the calendar. Your admissions team still runs the tour and makes the final connection.",
      },
      {
        q: "Can the agent explain our specific programs and policies?",
        a: "Yes. We build the script around your actual programs, academic focus, extended-day options, and policies (including safety and anti-bullying) so every call reflects your school accurately.",
      },
      {
        q: "Why isn't there a self-serve signup for this?",
        a: "Education outreach needs real setup — your enrollment zone, your lottery rules, your specific programs and deadlines. We build it with you on a consultation call rather than handing you a generic signup form.",
      },
    ],
  },

  "private-schools": {
    slug: "private-schools",
    icon: GraduationCap,
    navLabel: "Private & Independent Schools",
    metaTitle: "AI Admissions Calling for Private & Independent K-12 Schools",
    metaDescription:
      "BlackSync calls inquiry families, open-house no-shows, and past prospects for your private or independent school, communicates financial aid and what makes your school different, and books the tour — by consultation only.",
    badge: "For Private & Independent K-12 Schools",
    headline: "Turn inquiries into",
    headlineAccent: "enrolled families.",
    subheadline:
      "Most admissions offices are buried in follow-up calls they never get to. BlackSync calls your inquiry list, answers the financial aid question, and books the tour.",
    heroNote: "Built for independent school admissions offices — by consultation only.",
    painPoints: [
      {
        icon: Megaphone,
        title: "Paid inquiries go cold fast",
        description: "You're paying for every lead, and most of them never hear back from you before they hear back from a competing school.",
      },
      {
        icon: Clock,
        title: "Open house no-shows disappear",
        description: "A family that RSVP'd and didn't show is still interested — they just need a reason to reschedule, and nobody calls to give them one.",
      },
      {
        icon: Users,
        title: "Admissions staff can't out-dial a full-time call center",
        description: "A small admissions office working a growing inquiry list the same week as tours, interviews, and applications falls behind fast.",
      },
      {
        icon: ShieldCheck,
        title: "The financial aid question kills momentum",
        description: "Families who assume they can't afford it drop off before anyone tells them about aid, scholarships, or payment plans.",
      },
    ],
    whatWeDo: [
      {
        icon: PhoneCall,
        title: "Calls every inquiry",
        description: "Follows up on website inquiries, open-house RSVPs, and past prospects while they're still warm.",
      },
      {
        icon: Repeat,
        title: "Re-engages no-shows and old leads",
        description: "Calls back through open-house no-shows and prospects from prior admissions cycles who never got a final answer.",
      },
      {
        icon: ClipboardList,
        title: "Covers financial aid and differentiators",
        description: "Tuition assistance, scholarships, curriculum, class size, and what makes your school the right fit — addressed directly in conversation.",
      },
      {
        icon: CalendarCheck,
        title: "Books the tour or admissions interview",
        description: "Interested families land on your admissions calendar, not in a follow-up queue.",
      },
    ],
    valueMath: {
      unit: "enrolled student",
      rows: [
        { label: "Example annual tuition", value: "$18,000 / year" },
        { label: "Typical years enrolled", value: "× 6 years" },
      ],
      total: "$108,000",
      note: "Illustrative example only — plug in your own tuition and average enrollment length. Private school per-student value is usually the highest of any vertical we work with.",
    },
    faqs: [
      {
        q: "Will this feel like a telemarketing call to families?",
        a: "No — it's built around your school's actual admissions process and voice, not a generic script. Families get a warm, informative call about a school they already inquired about.",
      },
      {
        q: "Can it handle sensitive questions like financial aid?",
        a: "Yes. We script it around your real aid/scholarship policies so the agent can speak to it accurately, or route the question straight to your admissions team if you'd rather keep that conversation human.",
      },
      {
        q: "Does this replace our admissions director?",
        a: "No — it handles the volume of follow-up calling that realistically never happens today, and hands your admissions team a qualified family with a tour already booked.",
      },
      {
        q: "How is this different from the self-serve plans on your pricing page?",
        a: "This is a dedicated, built-with-you program for schools — your enrollment process, aid policies, and admissions calendar, set up on a consultation call rather than a generic self-serve signup.",
      },
    ],
  },

  "daycare-preschool": {
    slug: "daycare-preschool",
    icon: Baby,
    navLabel: "Daycare & Preschool",
    metaTitle: "AI Enrollment Calling for Daycares & Preschools",
    metaDescription:
      "BlackSync calls nearby families about open infant, toddler, and pre-K slots, follows up on your waitlist, and books the tour for your daycare or preschool — by consultation only.",
    badge: "For Daycares & Preschools",
    headline: "Every empty slot",
    headlineAccent: "is lost revenue, every month.",
    subheadline:
      "Parents call five daycares and enroll with whoever calls back first. BlackSync calls nearby families about your open slots and books the tour before a competitor does.",
    heroNote: "Built for daycare and preschool directors — by consultation only.",
    painPoints: [
      {
        icon: Clock,
        title: "An open slot that sits empty costs you every single month",
        description: "Unlike a one-time sale, an unfilled infant or toddler slot is recurring revenue you're losing week after week.",
      },
      {
        icon: PhoneCall,
        title: "First callback usually wins",
        description: "A parent searching for care calls several centers the same day — the one that calls back first is usually the one that gets the tour.",
      },
      {
        icon: Users,
        title: "Your front desk can't call while watching kids",
        description: "Staff is busy caring for the children in the building, not working the phones to fill the next opening.",
      },
      {
        icon: Megaphone,
        title: "Waitlist families go quiet",
        description: "A family that joined your waitlist months ago is still a real lead — most centers never call them back when a spot opens.",
      },
    ],
    whatWeDo: [
      {
        icon: PhoneCall,
        title: "Calls nearby families about open slots",
        description: "Reaches working-parent households in your service area with a warm call about current infant, toddler, or pre-K openings.",
      },
      {
        icon: Repeat,
        title: "Works your waitlist",
        description: "Calls back through waitlisted families the moment a spot actually opens, instead of an email that gets missed.",
      },
      {
        icon: ClipboardList,
        title: "Answers the parent questions",
        description: "Hours, ratios, curriculum, meals, and multi-child discounts — handled in conversation, the way a real front-desk call would.",
      },
      {
        icon: CalendarCheck,
        title: "Books the tour",
        description: "Interested families land a facility tour directly on your calendar.",
      },
    ],
    valueMath: {
      unit: "enrolled child",
      rows: [
        { label: "Example monthly tuition", value: "$1,400 / month" },
        { label: "Typical months enrolled", value: "× 30 months" },
      ],
      total: "$42,000",
      note: "Illustrative example only — plug in your own tuition and typical enrollment length. One filled infant slot compounds fast once you count a sibling or two.",
    },
    faqs: [
      {
        q: "Who are you calling — do you have access to our families' data?",
        a: "We call from your own inquiry list and waitlist, or a geographic area you define for general awareness calling. We don't buy or scrape data about children or families, and every call includes a clear opt-out.",
      },
      {
        q: "Can parents actually book a tour on the call?",
        a: "Yes — the agent checks your real availability and books the tour directly on your center's calendar, not just a callback request.",
      },
      {
        q: "Does this replace our front desk?",
        a: "No — it handles the outbound calling your front desk doesn't have time for while caring for the kids already in the building, and hands them a booked tour.",
      },
      {
        q: "Why book a consultation instead of just signing up?",
        a: "Your service area, current openings, and waitlist all need to be set up correctly before the first call goes out — we do that with you directly rather than a generic signup flow.",
      },
    ],
  },

  "trade-schools": {
    slug: "trade-schools",
    icon: HardHat,
    navLabel: "Trade & Vocational Schools",
    metaTitle: "AI Enrollment Calling for Trade & Vocational Schools",
    metaDescription:
      "BlackSync calls inquiry leads the same hour they come in, follows up on past prospects, and books the admissions call for your trade or vocational school — by consultation only.",
    badge: "For Trade & Vocational Schools",
    headline: "Call every lead",
    headlineAccent: "before they enroll somewhere else.",
    subheadline:
      "An inquiry that sits for a few hours is already talking to a competing program. BlackSync calls every lead fast, answers the real questions, and books the admissions call.",
    heroNote: "Built for trade school and vocational program admissions teams — by consultation only.",
    painPoints: [
      {
        icon: Clock,
        title: "Inquiry leads go cold in hours, not days",
        description: "Someone researching a trade program is usually comparing two or three schools the same day. Whoever calls first has the advantage.",
      },
      {
        icon: Users,
        title: "Admissions reps can't out-dial the lead volume",
        description: "A busy enrollment period means more leads than any small admissions team can realistically call through fast enough.",
      },
      {
        icon: Megaphone,
        title: "Students ghost after one info session",
        description: "Interested prospects go quiet between the first conversation and actually enrolling — most schools never follow up enough to close the gap.",
      },
      {
        icon: PhoneCall,
        title: "Competing programs call back faster",
        description: "For-profit and community programs alike are aggressive about follow-up. Slow response loses enrollments that were otherwise winnable.",
      },
    ],
    whatWeDo: [
      {
        icon: PhoneCall,
        title: "Calls every new inquiry fast",
        description: "Reaches leads from your website, ads, or inquiry forms while they're still actively comparing programs.",
      },
      {
        icon: Repeat,
        title: "Follows up on past prospects",
        description: "Calls back through prospects from prior cohorts or start dates who didn't enroll last time but might this time.",
      },
      {
        icon: ClipboardList,
        title: "Covers program details and financial aid",
        description: "Program length, cost, financial aid or payment plans, and job placement outcomes — addressed directly in conversation.",
      },
      {
        icon: CalendarCheck,
        title: "Books the admissions call",
        description: "Interested leads land a real conversation with your admissions team on the calendar, not just a form fill.",
      },
    ],
    valueMath: {
      unit: "enrolled student",
      rows: [
        { label: "Example program tuition", value: "$15,000" },
        { label: "Typical cohorts referred per student", value: "× 1.2x (referrals)" },
      ],
      total: "$18,000+",
      note: "Illustrative example only — plug in your own program tuition. Trade programs often have the shortest sales cycle of any vertical here, which is exactly where fast follow-up matters most.",
    },
    faqs: [
      {
        q: "How fast can a new inquiry actually get called?",
        a: "Calls can go out within minutes of a new inquiry coming in — that speed is most of the value here, since trade-school leads convert on who responds first.",
      },
      {
        q: "Can it speak to job placement rates and program outcomes?",
        a: "Yes, if you share them with us. We build the script around your real completion rates, placement outcomes, and program details so every call is accurate.",
      },
      {
        q: "Does this replace our admissions reps?",
        a: "No — it handles the first-touch volume your reps can't get to fast enough, and hands them a qualified lead with real interest and a booked call.",
      },
      {
        q: "Why isn't there a self-serve option for this?",
        a: "Your programs, cohorts, financial aid structure, and admissions calendar all need to be set up correctly first — we do that with you on a call rather than a generic signup.",
      },
    ],
  },
};

export default function EducationPage({ slug }: { slug: string }) {
  const vertical = VERTICALS[slug];
  // Richer hero treatment (capability pill row, bigger type, dual CTA) --
  // piloting on charter-schools first before extending to the other
  // education verticals.
  const richHero = slug === "charter-schools";
  const path = `/${slug}`;

  usePageMeta({ path });

  useJsonLd(`education-${slug}-webpage`, {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: vertical?.metaTitle,
    description: vertical?.metaDescription,
    url: `${SITE_URL}${path}`,
    isPartOf: { "@type": "WebSite", name: "BlackSync.ai", url: `${SITE_URL}/` },
  });

  useJsonLd(`education-${slug}-faq`, {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: (vertical?.faqs ?? []).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  if (!vertical) return null;

  const otherVerticals = Object.values(VERTICALS).filter((v) => v.slug !== slug);

  return (
    <div className="min-h-screen bg-background" data-testid={`page-education-${slug}`}>
      <div className="dark">
        <Navbar />
      </div>

      {/* ============ HERO ============ */}
      <header
        className={cn(
          "relative pt-20 pb-20 md:pt-28 md:pb-28 overflow-hidden",
          !richHero && "hero-gradient",
        )}
      >
        {richHero ? (
          <div
            className="pointer-events-none absolute -top-40 left-1/2 z-0 h-[32rem] w-[72rem] -translate-x-1/2 opacity-40 dark:opacity-50"
            style={{
              background: "linear-gradient(90deg, #D2522B 0%, #F97316 50%, #F59E0B 100%)",
              filter: "blur(140px)",
            }}
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        )}

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {richHero && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-8 flex justify-center"
            >
              <div
                className="inline-flex max-w-full flex-wrap items-center justify-center rounded-full border border-border bg-card px-1.5 py-1 shadow-sm"
                data-testid="pill-education-capabilities"
              >
                {vertical.whatWeDo.map((item, index) => (
                  <Fragment key={item.title}>
                    <span className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs whitespace-nowrap sm:text-sm">
                      <item.icon className="w-3.5 h-3.5 text-primary shrink-0" aria-hidden="true" />
                      <span className="text-muted-foreground">{item.pillLabel ?? item.title}</span>
                    </span>
                    {index < vertical.whatWeDo.length - 1 && (
                      <span aria-hidden className="h-3.5 w-px shrink-0 bg-border" />
                    )}
                  </Fragment>
                ))}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex mb-7"
            data-testid="badge-education-hero"
          >
            <Eyebrow>
              <vertical.icon className="w-3.5 h-3.5" aria-hidden="true" />
              {vertical.badge}
            </Eyebrow>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "font-display tracking-tight leading-[1.05] mb-6 text-balance",
              richHero
                ? "font-bold text-4xl sm:text-6xl md:text-7xl"
                : "font-semibold text-4xl sm:text-5xl md:text-6xl",
            )}
            data-testid="text-education-h1"
          >
            {vertical.headline} <span className="text-accent-grad">{vertical.headlineAccent}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16 }}
            className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8"
          >
            {vertical.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col items-center gap-3"
          >
            <div className="flex flex-wrap items-center justify-center gap-3">
              <BookCallDialog context="general">
                <Button
                  size="lg"
                  data-testid="button-hero-book-consultation"
                  className={
                    richHero
                      ? "rounded-full bg-foreground text-background hover:bg-foreground/90 hover:scale-[1.03] transition-transform px-7"
                      : undefined
                  }
                >
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
              {richHero && (
                <a href="#how-it-works-heading">
                  <Button
                    size="lg"
                    variant="outline"
                    data-testid="button-hero-how-it-works"
                    className="rounded-full hover:shadow-md hover:scale-[1.03] transition-all px-7"
                  >
                    See How It Works
                  </Button>
                </a>
              )}
            </div>
            <p className="text-xs text-muted-foreground font-mono uppercase tracking-wide">{vertical.heroNote}</p>
          </motion.div>
        </div>
      </header>

      {/* ============ PAIN POINTS ============ */}
      <section className="py-20 md:py-28" aria-labelledby="pain-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">The Problem</p>
            <h2 id="pain-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance">
              Every open seat has a deadline attached.
            </h2>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed sm:grid-cols-2 lg:grid-cols-4">
            {vertical.painPoints.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`pain-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ WHAT WE DO ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="what-we-do-heading">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">What BlackSync Does</p>
            <h2
              id="what-we-do-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance"
            >
              Outbound calling, built around your enrollment.
            </h2>
            <p className="mt-4 text-base text-muted-foreground leading-relaxed text-pretty">
              Not a generic robocall — a real, natural conversation built around your program, your questions, and
              your calendar.
            </p>
          </div>

          <div className="grid grid-cols-1 divide-x divide-y divide-dashed border border-dashed bg-background sm:grid-cols-2 lg:grid-cols-4">
            {vertical.whatWeDo.map((item) => (
              <FeatureCard
                key={item.title}
                feature={{ title: item.title, icon: item.icon, description: item.description }}
                data-testid={`what-we-do-${item.title}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ============ VALUE MATH ============ */}
      <section className="py-20 md:py-28" aria-labelledby="value-heading">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">What's It Worth?</p>
          <h2 id="value-heading" className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance mb-10">
            What's one {vertical.valueMath.unit} actually worth to you?
          </h2>

          <Reveal>
            <div
              className="rounded-2xl border border-border bg-card p-8 md:p-10 text-left max-w-xl mx-auto"
              data-testid="card-value-math"
            >
              <div className="space-y-4 mb-6">
                {vertical.valueMath.rows.map((row) => (
                  <div key={row.label} className="flex items-center justify-between gap-4">
                    <span className="text-sm text-muted-foreground">{row.label}</span>
                    <span className="font-display text-lg font-semibold tracking-tight">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-border pt-6 flex items-center justify-between gap-4">
                <span className="text-sm font-semibold uppercase tracking-wide">Lifetime value</span>
                <span className="font-display text-3xl md:text-4xl font-semibold tracking-tight text-accent-grad">
                  {vertical.valueMath.total}
                </span>
              </div>
            </div>
          </Reveal>

          <p className="mt-6 text-xs text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {vertical.valueMath.note}
          </p>

          <p className="mt-8 text-base text-muted-foreground leading-relaxed max-w-xl mx-auto text-pretty">
            Converting even a handful of extra families a month compounds fast against a number like that — which is
            why this is priced as a partnership, not a per-lead tool.
          </p>
        </div>
      </section>

      {/* ============ HOW IT WORKS ============ */}
      <section className="py-20 md:py-28 bg-muted/40 border-y border-border" aria-labelledby="how-it-works-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center mb-14">
            <p className="font-mono text-xs uppercase tracking-wider text-primary mb-3">How It Works</p>
            <h2
              id="how-it-works-heading"
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-balance scroll-mt-28"
            >
              Built with you, not self-serve.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {HOW_IT_WORKS.map((item) => (
              <Reveal key={item.step} delay={Number(item.step) * 0.06}>
                <div className="relative rounded-2xl border border-border bg-card p-6 h-full" data-testid={`step-${item.step}`}>
                  <span className="font-display text-4xl font-semibold text-primary/25 leading-none">{item.step}</span>
                  <item.icon className="w-5 h-5 text-primary mt-4 mb-3" strokeWidth={1.5} />
                  <h3 className="font-display text-base font-semibold tracking-tight mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="text-center mt-10">
            <BookCallDialog context="general">
              <Button size="lg" data-testid="button-how-it-works-book-consultation">
                Book a Consultation
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </BookCallDialog>
          </div>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section className="py-20 md:py-28" aria-labelledby="faq-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            id="faq-heading"
            className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance"
          >
            Frequently asked questions
          </h2>
          <Accordion type="single" collapsible>
            {vertical.faqs.map((f, i) => (
              <AccordionItem key={f.q} value={`faq-${i}`}>
                <AccordionTrigger data-testid={`education-faq-question-${i}`}>{f.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{f.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* ============ RELATED PROGRAMS ============ */}
      <section className="py-14 bg-muted/40 border-y border-border" aria-labelledby="related-heading">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <p id="related-heading" className="text-center text-xs font-mono uppercase tracking-wider text-muted-foreground mb-6">
            Also built for
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {otherVerticals.map((v) => (
              <Link
                key={v.slug}
                href={`/${v.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium hover:border-primary/40 hover:shadow-sm transition-all"
                data-testid={`link-related-${v.slug}`}
              >
                <v.icon className="w-3.5 h-3.5 text-primary" />
                {v.navLabel}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============ FINAL CTA ============ */}
      <section className="py-20 md:py-28" aria-labelledby="final-cta-heading">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-10 md:p-14 text-center">
              <MapPin className="w-8 h-8 text-primary mx-auto mb-5" strokeWidth={1.5} />
              <h2
                id="final-cta-heading"
                className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-balance mb-4"
              >
                Let's talk about your enrollment goals.
              </h2>
              <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-8 max-w-lg mx-auto">
                A real conversation about your program, your area, and what filling every seat is actually worth to
                you — no self-serve signup, no platform access until we've built it together.
              </p>
              <BookCallDialog context="general">
                <Button size="lg" data-testid="button-final-cta-book-consultation">
                  Book a Consultation
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </BookCallDialog>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
