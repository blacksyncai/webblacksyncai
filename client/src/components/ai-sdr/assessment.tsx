import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OptionGrid } from "@/components/lead-funnel/option-grid";
import { AiSdrResults } from "@/components/ai-sdr/results";
import {
  STEP_ORDER,
  QUESTION_STEPS,
  questionNumber,
  TEAM_SIZE_OPTIONS,
  PRIMARY_USE_OPTIONS,
  VOLUME_OPTIONS,
  HANDOFF_OPTIONS,
  CRM_OPTIONS,
  BOTTLENECK_OPTIONS,
  type StepId,
  type Answers,
} from "@/lib/ai-sdr-funnel-engine";
import {
  startOrResumeSession,
  loadSession,
  saveSession,
  clearSession,
  track,
  submitFirstNameCaptured,
  submitEmailCaptured,
  submitCompanyCaptured,
  submitPhoneCaptured,
  submitFunnelCompleted,
  type FunnelSession,
} from "@/lib/ai-sdr-funnel-session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AiSdrAssessment() {
  const [session, setSession] = useState<FunnelSession | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [resumeBanner, setResumeBanner] = useState(false);
  const [contactErrors, setContactErrors] = useState<{ email?: string }>({});
  const hasFiredView = useRef(false);
  const reducedMotion = useReducedMotion();

  const sessionRef = useRef<FunnelSession | null>(null);
  const stepIndexRef = useRef(0);

  useEffect(() => {
    const existing = loadSession();
    const s = startOrResumeSession();
    sessionRef.current = s;
    setSession(s);
    if (existing && (Object.keys(existing.answers).length > 0 || existing.contact.email)) {
      setResumeBanner(true);
      const idx = Math.min(existing.currentStepIndex, STEP_ORDER.length - 1);
      stepIndexRef.current = idx;
      setStepIndex(idx);
    }
    if (!hasFiredView.current) {
      hasFiredView.current = true;
      track("ai_sdr_funnel_start");
    }
  }, []);

  if (!session) return <AssessmentSkeleton />;

  const step = STEP_ORDER[stepIndex];
  const qNum = questionNumber(step);
  const progressPct = Math.round(((stepIndex + 1) / STEP_ORDER.length) * 100);

  function persist(next: Partial<FunnelSession>) {
    const merged = { ...sessionRef.current!, ...next };
    sessionRef.current = merged;
    saveSession(merged);
    setSession(merged);
  }

  function updateAnswers(partial: Partial<Answers>, eventProps: Record<string, unknown> = {}) {
    const nextAnswers = { ...sessionRef.current!.answers, ...partial };
    persist({ answers: nextAnswers });
    track("ai_sdr_funnel_step", { step, questionNumber: qNum ?? undefined, ...eventProps });
  }

  function goTo(index: number, dir: 1 | -1) {
    const clamped = Math.max(0, Math.min(index, STEP_ORDER.length - 1));
    stepIndexRef.current = clamped;
    setDirection(dir);
    setStepIndex(clamped);
    persist({ currentStepIndex: clamped });
  }

  function next() {
    goTo(stepIndexRef.current + 1, 1);
  }
  function back() {
    goTo(stepIndexRef.current - 1, -1);
  }
  function startOver() {
    clearSession();
    const fresh = startOrResumeSession();
    sessionRef.current = fresh;
    stepIndexRef.current = 0;
    setSession(fresh);
    setResumeBanner(false);
    setStepIndex(0);
    track("ai_sdr_funnel_start");
  }
  function autoAdvance() {
    window.setTimeout(() => goTo(stepIndexRef.current + 1, 1), reducedMotion ? 0 : 280);
  }

  const answers = session.answers;

  return (
    <div id="assessment" className="scroll-mt-24" data-testid="ai-sdr-assessment">
      {resumeBanner && (
        <div
          className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-zinc-700 bg-zinc-800/60 px-4 py-3 text-sm"
          data-testid="banner-resume"
        >
          <span className="text-zinc-200">Continuing your deployment plan.</span>
          <button
            type="button"
            onClick={startOver}
            className="font-medium text-zinc-400 underline underline-offset-2 hover:text-zinc-100"
            data-testid="button-start-over"
          >
            Start over
          </button>
        </div>
      )}

      <div className="mb-8">
        <div className="flex items-center justify-between mb-2.5">
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {qNum ? `Question ${qNum} of ${QUESTION_STEPS.length}` : "Your deployment"}
          </span>
          {qNum && <span className="font-mono text-[10px] text-zinc-500">{progressPct}%</span>}
        </div>
        <div
          className="h-1 w-full overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuenow={progressPct}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Assessment progress"
        >
          <motion.div
            className="h-full rounded-full bg-primary"
            animate={{ width: `${progressPct}%` }}
            transition={{ duration: reducedMotion ? 0 : 0.3, ease: [0.16, 1, 0.3, 1] }}
          />
        </div>
      </div>

      <div aria-live="polite" className="sr-only">
        {qNum ? `Question ${qNum} of ${QUESTION_STEPS.length}` : "Your recommended deployment"}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={step}
          initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -14 }}
          transition={{ duration: reducedMotion ? 0.1 : 0.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <StepContent
            step={step}
            answers={answers}
            session={session}
            onAnswer={updateAnswers}
            onNext={next}
            onAutoAdvance={autoAdvance}
            contactErrors={contactErrors}
            setContactErrors={setContactErrors}
          />
        </motion.div>
      </AnimatePresence>

      {step !== "teamSize" && step !== "results" && (
        <div className="mt-6">
          <button
            type="button"
            onClick={back}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-zinc-500 hover:text-zinc-200 transition-colors"
            data-testid="button-back"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back
          </button>
        </div>
      )}
    </div>
  );
}

function AssessmentSkeleton() {
  return (
    <div id="assessment" className="scroll-mt-24">
      <div className="h-1 w-full rounded-full bg-zinc-800 mb-8" />
      <div className="h-8 w-3/4 rounded-lg bg-zinc-800 mb-6" />
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-zinc-800" />
        ))}
      </div>
    </div>
  );
}

type StepProps = {
  step: StepId;
  answers: Answers;
  session: FunnelSession;
  onAnswer: (partial: Partial<Answers>, eventProps?: Record<string, unknown>) => void;
  onNext: () => void;
  onAutoAdvance: () => void;
  contactErrors: { email?: string };
  setContactErrors: (e: { email?: string }) => void;
};

function QuestionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl sm:text-2xl md:text-[1.7rem] font-semibold tracking-tight leading-[1.15] mb-6 text-zinc-50 text-balance">
      {children}
    </h2>
  );
}

function ContinueButton({
  onClick,
  disabled,
  children = "Continue",
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Button size="lg" className="mt-6 w-full sm:w-auto" onClick={onClick} disabled={disabled} data-testid="button-continue">
      {children}
      <ArrowRight className="w-4 h-4 ml-1.5" />
    </Button>
  );
}

function StepContent(props: StepProps) {
  const { step, answers, onAnswer, onNext, onAutoAdvance } = props;

  switch (step) {
    case "teamSize":
      return (
        <div>
          <QuestionHeading>What does your outbound team look like today?</QuestionHeading>
          <OptionGrid
            options={TEAM_SIZE_OPTIONS}
            value={answers.teamSize ? [answers.teamSize] : []}
            onSelect={([v]) => {
              onAnswer({ teamSize: v }, { teamSize: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "primaryUse":
      return (
        <div>
          <QuestionHeading>What are you primarily using outbound for?</QuestionHeading>
          <p className="text-sm text-zinc-400 mb-4">Select all that apply.</p>
          <OptionGrid
            multi
            columns="two"
            options={PRIMARY_USE_OPTIONS}
            value={answers.primaryUse || []}
            onSelect={(v) => onAnswer({ primaryUse: v })}
          />
          <ContinueButton onClick={onNext} disabled={!answers.primaryUse?.length} />
        </div>
      );

    case "monthlyVolume":
      return (
        <div>
          <QuestionHeading>Roughly how many prospects should your team be contacting each month?</QuestionHeading>
          <OptionGrid
            options={VOLUME_OPTIONS}
            value={answers.monthlyVolume ? [answers.monthlyVolume] : []}
            onSelect={([v]) => {
              onAnswer({ monthlyVolume: v }, { monthlyVolume: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "handoff":
      return (
        <div>
          <QuestionHeading>What happens when someone is interested?</QuestionHeading>
          <OptionGrid
            options={HANDOFF_OPTIONS}
            value={answers.handoff ? [answers.handoff] : []}
            onSelect={([v]) => {
              onAnswer({ handoff: v }, { handoff: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "crm":
      return (
        <div>
          <QuestionHeading>What CRM or sales system are you using?</QuestionHeading>
          <OptionGrid
            columns="two"
            options={CRM_OPTIONS}
            value={answers.crm ? [answers.crm] : []}
            onSelect={([v]) => {
              onAnswer({ crm: v }, { crm: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "bottleneck":
      return (
        <div>
          <QuestionHeading>What's the biggest bottleneck today?</QuestionHeading>
          <OptionGrid
            options={BOTTLENECK_OPTIONS}
            value={answers.bottleneck ? [answers.bottleneck] : []}
            onSelect={([v]) => {
              onAnswer({ bottleneck: v }, { bottleneck: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "results":
      return <AiSdrResults answers={answers} onGetPlan={onNext} />;

    case "contactFirstName":
      return <ContactFirstNameStep {...props} />;
    case "contactEmail":
      return <ContactEmailStep {...props} />;
    case "contactCompany":
      return <ContactCompanyStep {...props} />;
    case "contactPhone":
      return <ContactPhoneStep {...props} />;

    default:
      return null;
  }
}

function ContactFirstNameStep({ session, onNext }: StepProps) {
  const [firstName, setFirstName] = useState(session.contact.firstName || "");

  function handleContinue() {
    if (!firstName.trim()) return;
    session.contact.firstName = firstName.trim();
    saveSession(session);
    track("ai_sdr_lead_submit", { step: "first_name" });
    void submitFirstNameCaptured(session);
    onNext();
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-3">Almost there</p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-zinc-50 text-balance">
        Get Your Outbound Plan
      </h2>
      <p className="text-sm md:text-base text-zinc-400 leading-relaxed mb-6">
        Tell us where to send it.
      </p>
      <Label htmlFor="sdr-first-name" className="mb-1.5 block text-xs font-medium text-zinc-400">
        First name
      </Label>
      <Input
        id="sdr-first-name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="Your first name"
        className="h-12 max-w-sm bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
        autoFocus
        data-testid="input-first-name"
      />
      <ContinueButton onClick={handleContinue} disabled={!firstName.trim()} />
    </div>
  );
}

function ContactEmailStep({ session, onNext, contactErrors, setContactErrors }: StepProps) {
  const [email, setEmail] = useState(session.contact.email || "");

  function handleContinue() {
    if (!EMAIL_RE.test(email.trim())) {
      setContactErrors({ email: "Enter a valid work email." });
      return;
    }
    setContactErrors({});
    session.contact.email = email.trim();
    saveSession(session);
    void submitEmailCaptured(session);
    track("ai_sdr_lead_submit", { step: "email" });
    onNext();
  }

  return (
    <div>
      <QuestionHeading>What's your work email?</QuestionHeading>
      <Label htmlFor="sdr-email" className="mb-1.5 block text-xs font-medium text-zinc-400">
        Work email
      </Label>
      <Input
        id="sdr-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="you@company.com"
        className="h-12 max-w-sm bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
        autoFocus
        aria-invalid={!!contactErrors.email}
        aria-describedby={contactErrors.email ? "sdr-email-error" : undefined}
        data-testid="input-email"
      />
      {contactErrors.email && (
        <p id="sdr-email-error" className="mt-1.5 text-sm text-red-400" role="alert">
          {contactErrors.email}
        </p>
      )}
      <ContinueButton onClick={handleContinue} disabled={!email.trim()} />
    </div>
  );
}

function ContactCompanyStep({ session, onNext }: StepProps) {
  const [company, setCompany] = useState(session.contact.company || "");

  function handleContinue() {
    if (!company.trim()) return;
    session.contact.company = company.trim();
    saveSession(session);
    void submitCompanyCaptured(session);
    track("ai_sdr_lead_submit", { step: "company" });
    onNext();
  }

  return (
    <div>
      <QuestionHeading>What company are you with?</QuestionHeading>
      <Label htmlFor="sdr-company" className="mb-1.5 block text-xs font-medium text-zinc-400">
        Company
      </Label>
      <Input
        id="sdr-company"
        value={company}
        onChange={(e) => setCompany(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="Company name"
        className="h-12 max-w-sm bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
        autoFocus
        data-testid="input-company"
      />
      <ContinueButton onClick={handleContinue} disabled={!company.trim()} />
    </div>
  );
}

function ContactPhoneStep({ session }: StepProps) {
  const [phone, setPhone] = useState(session.contact.phone || "");
  const [website, setWebsite] = useState(session.contact.website || "");
  const [error, setError] = useState<string | undefined>();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit() {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 7) {
      setError("Enter a valid phone number.");
      return;
    }
    setError(undefined);
    session.contact.phone = phone.trim();
    session.contact.website = website.trim() || undefined;
    saveSession(session);
    void submitPhoneCaptured(session);
    void submitFunnelCompleted(session);
    track("ai_sdr_lead_submit", { step: "phone" });
    track("ai_sdr_funnel_complete", { teamSize: session.answers.teamSize, crm: session.answers.crm });
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div data-testid="submission-confirmation">
        <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-zinc-50 text-balance">
          Request received.
        </h2>
        <p className="text-sm md:text-base text-zinc-400 leading-relaxed max-w-md">
          Someone from BlackSync will follow up shortly to walk through your deployment plan and next steps.
        </p>
      </div>
    );
  }

  return (
    <div>
      <QuestionHeading>Best phone number to reach you?</QuestionHeading>
      <Label htmlFor="sdr-phone" className="mb-1.5 block text-xs font-medium text-zinc-400">
        Phone number
      </Label>
      <Input
        id="sdr-phone"
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        placeholder="(555) 555-5555"
        className="h-12 max-w-sm bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
        autoFocus
        aria-invalid={!!error}
        aria-describedby={error ? "sdr-phone-error" : undefined}
        data-testid="input-phone"
      />
      {error && (
        <p id="sdr-phone-error" className="mt-1.5 text-sm text-red-400" role="alert">
          {error}
        </p>
      )}

      <Label htmlFor="sdr-website" className="mb-1.5 mt-5 block text-xs font-medium text-zinc-400">
        Company website <span className="text-zinc-600">(optional)</span>
      </Label>
      <Input
        id="sdr-website"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
        placeholder="company.com"
        className="h-12 max-w-sm bg-zinc-900 border-zinc-700 text-zinc-50 placeholder:text-zinc-600"
        data-testid="input-website"
      />

      <ContinueButton onClick={handleSubmit} disabled={!phone.trim()}>
        Submit
      </ContinueButton>
    </div>
  );
}
