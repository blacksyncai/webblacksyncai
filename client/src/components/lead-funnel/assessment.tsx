import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { OptionGrid } from "@/components/lead-funnel/option-grid";
import { ResultsPanel } from "@/components/lead-funnel/results";
import {
  STEP_ORDER,
  QUESTION_STEPS,
  questionNumber,
  OBJECTIVE_OPTIONS,
  SELLER_LEAD_TYPE_OPTIONS,
  BUYER_LEAD_TYPE_OPTIONS,
  SERVICE_AREA_OPTIONS,
  TRANSACTION_BAND_OPTIONS,
  CURRENT_CHANNEL_OPTIONS,
  PRIMARY_PROBLEM_OPTIONS,
  opportunityPreferenceOptionsFor,
  DESIRED_VOLUME_OPTIONS,
  TRANSACTION_VALUE_OPTIONS,
  SPEND_OPTIONS,
  BUDGET_OPTIONS,
  TIMELINE_OPTIONS,
  IMPLEMENTATION_OPTIONS,
  objectiveLabel,
  type StepId,
  type Answers,
} from "@/lib/lead-funnel-engine";
import {
  startOrResumeSession,
  loadSession,
  saveSession,
  clearSession,
  track,
  submitFirstNameCaptured,
  submitEmailCaptured,
  submitPhoneCaptured,
  submitFunnelCompleted,
  type FunnelSession,
} from "@/lib/lead-funnel-session";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LeadGenAssessment() {
  const [session, setSession] = useState<FunnelSession | null>(null);
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [resumeBanner, setResumeBanner] = useState(false);
  const [contactErrors, setContactErrors] = useState<{ email?: string; phone?: string }>({});
  const hasFiredView = useRef(false);
  const reducedMotion = useReducedMotion();

  // `session` and `stepIndex` state exist to trigger re-renders; every handler
  // below reads/writes through these refs instead, kept in lockstep with the
  // state on every update. Reading React state captured in a closure created
  // before a delayed callback (autoAdvance's setTimeout) fires would otherwise
  // read stale data and silently clobber an answer saved in between -- refs
  // sidestep that regardless of timing.
  const sessionRef = useRef<FunnelSession | null>(null);
  const stepIndexRef = useRef(0);

  // Bootstrap: resume a session already in progress, otherwise wait for the
  // hero CTA anchor scroll to bring this into view -- either way, a session
  // (and sessionId) exists before the first question renders.
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
      track("real_estate_lead_funnel_view");
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
    track("real_estate_lead_question_answered", { step, questionNumber: qNum ?? undefined, ...eventProps });
  }

  function goTo(index: number, dir: 1 | -1) {
    const clamped = Math.max(0, Math.min(index, STEP_ORDER.length - 1));
    const fromStep = STEP_ORDER[stepIndexRef.current];
    const fromQNum = questionNumber(fromStep);
    stepIndexRef.current = clamped;
    setDirection(dir);
    setStepIndex(clamped);
    persist({ currentStepIndex: clamped });
    if (dir === 1) {
      track("real_estate_lead_step_completed", { step: fromStep, questionNumber: fromQNum ?? undefined });
    }
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
    track("real_estate_lead_funnel_started");
  }

  // Auto-advance is used for single-select "click and go" steps; multi-select
  // and free-text steps show an explicit Continue button instead.
  function autoAdvance() {
    window.setTimeout(() => goTo(stepIndexRef.current + 1, 1), reducedMotion ? 0 : 320);
  }

  const answers = session.answers;

  return (
    <div id="assessment" className="scroll-mt-24" data-testid="lead-funnel-assessment">
      <div className="mx-auto max-w-2xl">
        {resumeBanner && step !== "results" && (
          <div
            className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3 text-sm"
            data-testid="banner-resume"
          >
            <span className="text-foreground/90">Continuing where you left off.</span>
            <button
              type="button"
              onClick={startOver}
              className="font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
              data-testid="button-start-over"
            >
              Start over
            </button>
          </div>
        )}

        {step !== "results" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2.5">
              <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                {qNum ? `Question ${qNum} of ${QUESTION_STEPS.length}` : "Building your lead generation plan"}
              </span>
              {qNum && <span className="font-mono text-[10px] text-muted-foreground">{progressPct}%</span>}
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-muted"
              role="progressbar"
              aria-valuenow={progressPct}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Assessment progress"
            >
              <div
                className="h-full rounded-full bg-primary transition-[width] duration-300 ease-out"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div aria-live="polite" className="sr-only">
          {qNum ? `Question ${qNum} of ${QUESTION_STEPS.length}` : step === "results" ? "Your plan is ready" : ""}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={step}
            initial={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reducedMotion ? { opacity: 0 } : { opacity: 0, x: direction * -16 }}
            transition={{ duration: reducedMotion ? 0.1 : 0.22, ease: [0.16, 1, 0.3, 1] }}
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

        {step !== "objective" && step !== "results" && (
          <div className="mt-6">
            <button
              type="button"
              onClick={back}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              data-testid="button-back"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function AssessmentSkeleton() {
  return (
    <div id="assessment" className="scroll-mt-24 mx-auto max-w-2xl">
      <div className="h-1.5 w-full rounded-full bg-muted mb-8" />
      <div className="h-8 w-3/4 rounded-lg bg-muted mb-6" />
      <div className="space-y-2.5">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-14 rounded-xl bg-muted" />
        ))}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Per-step content
// ---------------------------------------------------------------------------

type StepProps = {
  step: StepId;
  answers: Answers;
  session: FunnelSession;
  onAnswer: (partial: Partial<Answers>, eventProps?: Record<string, unknown>) => void;
  onNext: () => void;
  onAutoAdvance: () => void;
  contactErrors: { email?: string; phone?: string };
  setContactErrors: (e: { email?: string; phone?: string }) => void;
};

function QuestionHeading({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="font-display text-xl md:text-2xl font-semibold tracking-tight mb-6 text-balance">
      {children}
    </h2>
  );
}

function ContinueButton({
  onClick,
  disabled,
  children = "Continue",
  loading = false,
}: {
  onClick: () => void;
  disabled?: boolean;
  children?: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <Button
      size="lg"
      className="mt-6 w-full sm:w-auto"
      onClick={onClick}
      disabled={disabled || loading}
      data-testid="button-continue"
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
      {children}
      {!loading && <ArrowRight className="w-4 h-4 ml-1.5" />}
    </Button>
  );
}

function StepContent(props: StepProps) {
  const { step, answers, onAnswer, onNext, onAutoAdvance } = props;

  switch (step) {
    case "objective":
      return (
        <div>
          <QuestionHeading>What's your #1 focus right now?</QuestionHeading>
          <OptionGrid
            options={OBJECTIVE_OPTIONS}
            value={answers.objective ? [answers.objective] : []}
            onSelect={([v]) => {
              onAnswer({ objective: v as Answers["objective"], leadTypes: [] }, { objective: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "leadTypes":
      return <LeadTypesStep {...props} />;

    case "market":
      return <MarketStep {...props} />;

    case "transactions":
      return <TransactionsStep {...props} />;

    case "currentChannels":
      return (
        <div>
          <QuestionHeading>How are you generating new opportunities today?</QuestionHeading>
          <p className="text-sm text-muted-foreground mb-4">Select all that apply.</p>
          <OptionGrid
            multi
            columns="two"
            options={CURRENT_CHANNEL_OPTIONS}
            value={answers.currentChannels || []}
            onSelect={(v) => onAnswer({ currentChannels: v }, { channelCount: v.length })}
          />
          <ContinueButton onClick={onNext} disabled={!answers.currentChannels?.length} />
        </div>
      );

    case "primaryProblem":
      return (
        <div>
          <QuestionHeading>What's the biggest problem with your lead generation today?</QuestionHeading>
          <OptionGrid
            options={PRIMARY_PROBLEM_OPTIONS}
            value={answers.primaryProblem ? [answers.primaryProblem] : []}
            onSelect={([v]) => {
              onAnswer({ primaryProblem: v }, { primaryProblem: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "interstitial":
      return <Interstitial {...props} />;

    case "opportunityPreference":
      return (
        <div>
          <QuestionHeading>
            If you could generate more of ONE type of opportunity, which would be most valuable?
          </QuestionHeading>
          <OptionGrid
            options={opportunityPreferenceOptionsFor(answers.objective)}
            value={answers.opportunityPreference ? [answers.opportunityPreference] : []}
            onSelect={([v]) => {
              onAnswer({ opportunityPreference: v }, { opportunityPreference: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "desiredLeadVolume":
      return (
        <div>
          <QuestionHeading>How many new opportunities per month would make this worthwhile?</QuestionHeading>
          <OptionGrid
            options={DESIRED_VOLUME_OPTIONS}
            value={answers.desiredLeadVolume ? [answers.desiredLeadVolume] : []}
            onSelect={([v]) => {
              onAnswer({ desiredLeadVolume: v }, { desiredLeadVolume: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "transactionValue":
      return (
        <div>
          <QuestionHeading>
            What's an average closed transaction worth to you in gross commission or income?
          </QuestionHeading>
          <OptionGrid
            options={TRANSACTION_VALUE_OPTIONS}
            value={answers.transactionValue ? [answers.transactionValue] : []}
            onSelect={([v]) => {
              onAnswer({ transactionValue: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "currentMarketingSpend":
      return (
        <div>
          <QuestionHeading>Approximately how much are you currently investing in marketing each month?</QuestionHeading>
          <OptionGrid
            options={SPEND_OPTIONS}
            value={answers.currentMarketingSpend ? [answers.currentMarketingSpend] : []}
            onSelect={([v]) => {
              onAnswer({ currentMarketingSpend: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "availableBudget":
      return (
        <div>
          <QuestionHeading>
            What would you realistically invest each month into a lead generation system that was producing measurable
            results?
          </QuestionHeading>
          <OptionGrid
            options={BUDGET_OPTIONS}
            value={answers.availableBudget ? [answers.availableBudget] : []}
            onSelect={([v]) => {
              onAnswer({ availableBudget: v }, { budgetRange: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "timeline":
      return (
        <div>
          <QuestionHeading>How quickly do you want to start generating more opportunities?</QuestionHeading>
          <OptionGrid
            options={TIMELINE_OPTIONS}
            value={answers.timeline ? [answers.timeline] : []}
            onSelect={([v]) => {
              onAnswer({ timeline: v }, { timeline: v });
              onAutoAdvance();
            }}
          />
        </div>
      );

    case "implementationPreference":
      return <ImplementationStep {...props} />;

    case "contactFirstName":
      return <ContactFirstNameStep {...props} />;

    case "contactEmail":
      return <ContactEmailStep {...props} />;

    case "contactPhone":
      return <ContactPhoneStep {...props} />;

    case "results":
      return <ResultsStep {...props} />;

    default:
      return null;
  }
}

function LeadTypesStep({ answers, onAnswer, onNext }: StepProps) {
  const objective = answers.objective;

  if (objective === "both") {
    const sellerVals = (answers.leadTypes || []).filter((v) => v.startsWith("seller:")).map((v) => v.slice(7));
    const buyerVals = (answers.leadTypes || []).filter((v) => v.startsWith("buyer:")).map((v) => v.slice(6));
    const combine = (s: string[], b: string[]) => [...s.map((v) => `seller:${v}`), ...b.map((v) => `buyer:${v}`)];
    return (
      <div>
        <QuestionHeading>Which seller and buyer opportunities matter most to you?</QuestionHeading>
        <p className="text-sm text-muted-foreground mb-3">Select all that apply for each.</p>
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 mt-5">Seller opportunities</p>
        <OptionGrid
          multi
          columns="two"
          options={SELLER_LEAD_TYPE_OPTIONS}
          value={sellerVals}
          onSelect={(v) => onAnswer({ leadTypes: combine(v, buyerVals) })}
          testIdPrefix="seller-"
        />
        <p className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-2 mt-6">Buyer opportunities</p>
        <OptionGrid
          multi
          columns="two"
          options={BUYER_LEAD_TYPE_OPTIONS}
          value={buyerVals}
          onSelect={(v) => onAnswer({ leadTypes: combine(sellerVals, v) })}
          testIdPrefix="buyer-"
        />
        <ContinueButton onClick={onNext} disabled={sellerVals.length === 0 && buyerVals.length === 0} />
      </div>
    );
  }

  const isBuyer = objective === "buyers";
  const options = isBuyer ? BUYER_LEAD_TYPE_OPTIONS : SELLER_LEAD_TYPE_OPTIONS;
  const heading = isBuyer
    ? "What kind of buyer opportunities do you want more of?"
    : "What kind of seller opportunities do you want more of?";

  return (
    <div>
      <QuestionHeading>{heading}</QuestionHeading>
      <p className="text-sm text-muted-foreground mb-4">Select all that apply.</p>
      <OptionGrid
        multi
        columns="two"
        options={options}
        value={answers.leadTypes || []}
        onSelect={(v) => onAnswer({ leadTypes: v })}
      />
      <ContinueButton onClick={onNext} disabled={!answers.leadTypes?.length} />
    </div>
  );
}

function MarketStep({ answers, onAnswer, onNext }: StepProps) {
  const [city, setCity] = useState(answers.marketCity || "");
  const [state, setState] = useState(answers.marketState || "");

  return (
    <div>
      <QuestionHeading>Where do you want to generate leads?</QuestionHeading>
      <div className="grid sm:grid-cols-2 gap-3 mb-6">
        <div>
          <Label htmlFor="market-city" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            City / market
          </Label>
          <Input
            id="market-city"
            value={city}
            onChange={(e) => {
              setCity(e.target.value);
              onAnswer({ marketCity: e.target.value });
            }}
            placeholder="e.g. Tampa"
            className="h-12"
            data-testid="input-market-city"
          />
        </div>
        <div>
          <Label htmlFor="market-state" className="mb-1.5 block text-xs font-medium text-muted-foreground">
            State / province
          </Label>
          <Input
            id="market-state"
            value={state}
            onChange={(e) => {
              setState(e.target.value);
              onAnswer({ marketState: e.target.value });
            }}
            placeholder="e.g. Florida"
            className="h-12"
            data-testid="input-market-state"
          />
        </div>
      </div>

      <p className="text-sm font-medium text-foreground mb-3">How large of an area are you willing to cover?</p>
      <OptionGrid
        options={SERVICE_AREA_OPTIONS}
        value={answers.serviceArea ? [answers.serviceArea] : []}
        onSelect={([v]) => onAnswer({ serviceArea: v })}
      />
      <ContinueButton onClick={onNext} disabled={!city.trim() || !answers.serviceArea} />
    </div>
  );
}

function TransactionsStep({ answers, onAnswer, onNext }: StepProps) {
  return (
    <div>
      <QuestionHeading>How many transactions are you currently closing in an average quarter?</QuestionHeading>
      <OptionGrid
        options={TRANSACTION_BAND_OPTIONS}
        value={answers.currentTransactions ? [answers.currentTransactions] : []}
        onSelect={([v]) => onAnswer({ currentTransactions: v }, { currentTransactions: v })}
        testIdPrefix="current-"
      />

      <p className="text-sm font-medium text-foreground mb-3 mt-8">
        Where would you like that number to be 6 months from now?
      </p>
      <OptionGrid
        options={TRANSACTION_BAND_OPTIONS}
        value={answers.targetTransactions ? [answers.targetTransactions] : []}
        onSelect={([v]) => onAnswer({ targetTransactions: v })}
        testIdPrefix="target-"
      />
      <ContinueButton onClick={onNext} disabled={!answers.currentTransactions || !answers.targetTransactions} />
    </div>
  );
}

function Interstitial({ answers, onNext, session }: StepProps) {
  const objective = objectiveLabel(answers.objective);
  const city = answers.marketCity?.trim();

  let line: string;
  if (city && objective) {
    const focusNoun = answers.objective === "buyers" ? "buyer" : answers.objective === "both" ? "buyer and seller" : "seller";
    line = `A ${focusNoun}-focused strategy in ${city} should be structured differently from a generic campaign. Your next few answers will help us determine the right acquisition mix and investment level.`;
  } else if (city) {
    line = `Your next few answers will help us determine the right acquisition mix and investment level for ${city}.`;
  } else {
    line = "Your next few answers will help us determine the right acquisition mix and investment level for your market.";
  }

  useEffect(() => {
    track("real_estate_lead_step_completed", { step: "interstitial_view" });
  }, []);

  return (
    <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6 md:p-8">
      <p className="font-display text-lg md:text-xl font-semibold tracking-tight mb-3 text-balance">
        We're starting to get a picture of your market.
      </p>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty mb-6">{line}</p>
      <Button size="lg" onClick={onNext} data-testid="button-continue-interstitial">
        Continue Building My Plan
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
}

function ImplementationStep({ answers, onAnswer, onNext }: StepProps) {
  return (
    <div>
      <QuestionHeading>Last question. How involved do you want to be?</QuestionHeading>
      <div className="grid gap-3 sm:grid-cols-2">
        {IMPLEMENTATION_OPTIONS.map((opt) => {
          const selected = answers.implementationPreference === opt.value;
          const isDfy = opt.value === "dfy";
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onAnswer({ implementationPreference: opt.value }, { implementationPreference: opt.value });
                track(opt.value === "dfy" ? "real_estate_lead_dfy_selected" : "real_estate_lead_diy_selected");
                window.setTimeout(onNext, 250);
              }}
              className={`relative flex h-full flex-col items-start rounded-2xl border p-5 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                selected
                  ? "border-primary bg-primary/5"
                  : isDfy
                    ? "border-primary/40 bg-card hover:border-primary"
                    : "border-border bg-card hover:border-primary/40"
              }`}
              data-testid={`option-implementation-${opt.value}`}
            >
              {isDfy && (
                <span className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-primary">
                  Most teams choose this
                </span>
              )}
              <span className="font-display text-base font-semibold tracking-tight mb-1.5">{opt.label}</span>
              <span className="text-sm text-muted-foreground leading-relaxed text-pretty">{opt.description}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ContactFirstNameStep({ session, onNext }: StepProps) {
  const [firstName, setFirstName] = useState(session.contact.firstName || "");

  function handleContinue() {
    if (!firstName.trim()) return;
    session.contact.firstName = firstName.trim();
    saveSession(session);
    track("real_estate_lead_contact_started");
    // Fire-and-forget, matching every other form on the site (see
    // lead-funnel-session.ts) -- a slow or unreachable webhook must never
    // stall the visitor's progress through the funnel.
    void submitFirstNameCaptured(session);
    onNext();
  }

  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-3">Almost there</p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-3 text-balance">
        Your Real Estate Lead Generation Plan Is Ready
      </h2>
      <p className="text-sm md:text-base text-muted-foreground leading-relaxed text-pretty mb-6">
        We've built your recommendation around your market, lead type, growth target, and budget. Where should we
        send your plan?
      </p>
      <Label htmlFor="contact-first-name" className="mb-1.5 block text-xs font-medium text-muted-foreground">
        First name
      </Label>
      <Input
        id="contact-first-name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="Your first name"
        className="h-12 max-w-sm"
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
      setContactErrors({ ...contactErrors, email: "Enter a valid email address." });
      return;
    }
    setContactErrors({ ...contactErrors, email: undefined });
    session.contact.email = email.trim();
    saveSession(session);
    void submitEmailCaptured(session);
    track("real_estate_lead_email_captured");
    onNext();
  }

  return (
    <div>
      <QuestionHeading>What's the best email for your plan?</QuestionHeading>
      <Label htmlFor="contact-email" className="mb-1.5 block text-xs font-medium text-muted-foreground">
        Email
      </Label>
      <Input
        id="contact-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="you@email.com"
        className="h-12 max-w-sm"
        autoFocus
        aria-invalid={!!contactErrors.email}
        aria-describedby={contactErrors.email ? "email-error" : undefined}
        data-testid="input-email"
      />
      {contactErrors.email && (
        <p id="email-error" className="mt-1.5 text-sm text-destructive" role="alert">
          {contactErrors.email}
        </p>
      )}
      <ContinueButton onClick={handleContinue} disabled={!email.trim()} />
    </div>
  );
}

function ContactPhoneStep({ session, onNext, contactErrors, setContactErrors }: StepProps) {
  const [phone, setPhone] = useState(session.contact.phone || "");
  const [consent, setConsent] = useState(session.contact.smsConsent || false);

  function handleContinue() {
    const digits = phone.replace(/[^\d]/g, "");
    if (digits.length < 7) {
      setContactErrors({ ...contactErrors, phone: "Enter a valid phone number." });
      return;
    }
    setContactErrors({ ...contactErrors, phone: undefined });
    session.contact.phone = phone.trim();
    session.contact.smsConsent = consent;
    saveSession(session);
    void submitPhoneCaptured(session);
    track("real_estate_lead_phone_captured");
    onNext();
  }

  return (
    <div>
      <QuestionHeading>And a phone number, in case a quick call is easier?</QuestionHeading>
      <Label htmlFor="contact-phone" className="mb-1.5 block text-xs font-medium text-muted-foreground">
        Phone number
      </Label>
      <Input
        id="contact-phone"
        type="tel"
        inputMode="tel"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleContinue()}
        placeholder="(555) 555-5555"
        className="h-12 max-w-sm"
        autoFocus
        aria-invalid={!!contactErrors.phone}
        aria-describedby={contactErrors.phone ? "phone-error" : undefined}
        data-testid="input-phone"
      />
      {contactErrors.phone && (
        <p id="phone-error" className="mt-1.5 text-sm text-destructive" role="alert">
          {contactErrors.phone}
        </p>
      )}

      <label className="mt-4 flex max-w-md items-start gap-2.5 text-sm text-muted-foreground">
        <Checkbox
          checked={consent}
          onCheckedChange={(v) => setConsent(v === true)}
          className="mt-0.5"
          data-testid="checkbox-sms-consent"
        />
        <span>
          I agree to be contacted by BlackSync about this plan by phone, text, and email. Message and data rates may
          apply. See our{" "}
          <a href="/privacy" className="underline underline-offset-2 hover:text-foreground">
            Privacy Policy
          </a>{" "}
          and{" "}
          <a href="/terms" className="underline underline-offset-2 hover:text-foreground">
            Terms
          </a>
          .
        </span>
      </label>

      <ContinueButton onClick={handleContinue} disabled={!phone.trim()}>
        Reveal My Plan
      </ContinueButton>
    </div>
  );
}

function ResultsStep({ answers, session, onAnswer }: StepProps) {
  const fired = useRef(false);
  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    // Fire-and-forget: the plan is already computed client-side from answers
    // already in hand, so it renders immediately regardless of whether this
    // webhook call succeeds, is slow, or the visitor is offline.
    void submitFunnelCompleted(session);
    track("real_estate_lead_funnel_completed", {
      objective: answers.objective,
      budgetRange: answers.availableBudget,
      timeline: answers.timeline,
      implementationPreference: answers.implementationPreference,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ResultsPanel
      answers={answers}
      firstName={session.contact.firstName}
      onSwitchToDfy={() => onAnswer({ implementationPreference: "dfy" }, { implementationPreference: "dfy" })}
    />
  );
}
