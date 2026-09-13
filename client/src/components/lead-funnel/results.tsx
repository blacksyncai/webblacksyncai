import { useState } from "react";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CalendlyEmbed } from "@/components/calendly-embed";
import {
  objectiveLabel,
  labelFor,
  leadTypeNoun,
  buildRecommendation,
  scoreLead,
  SELLER_LEAD_TYPE_OPTIONS,
  BUYER_LEAD_TYPE_OPTIONS,
  TRANSACTION_BAND_OPTIONS,
  BUDGET_OPTIONS,
  SERVICE_AREA_OPTIONS,
  type Answers,
} from "@/lib/lead-funnel-engine";
import { track } from "@/lib/lead-funnel-session";

function leadTypeLabels(answers: Answers): string[] {
  const types = answers.leadTypes || [];
  if (answers.objective === "both") {
    return types.map((v) => {
      if (v.startsWith("seller:")) return labelFor(SELLER_LEAD_TYPE_OPTIONS, v.slice(7)) || v;
      if (v.startsWith("buyer:")) return `${labelFor(BUYER_LEAD_TYPE_OPTIONS, v.slice(6)) || v} (buyer)`;
      return v;
    });
  }
  const noun = leadTypeNoun(answers.objective);
  const options = noun === "buyer" ? BUYER_LEAD_TYPE_OPTIONS : SELLER_LEAD_TYPE_OPTIONS;
  return types.map((v) => labelFor(options, v) || v);
}

export function ResultsPanel({
  answers,
  firstName,
  onSwitchToDfy,
}: {
  answers: Answers;
  firstName?: string;
  onSwitchToDfy?: () => void;
}) {
  const rec = buildRecommendation(answers);
  const { tier } = scoreLead(answers);
  const isPriority = tier === "HIGH INTENT" || tier === "PRIORITY";

  const market = [answers.marketCity, answers.marketState].filter(Boolean).join(", ");
  const leadTypes = leadTypeLabels(answers);
  const currentTx = labelFor(TRANSACTION_BAND_OPTIONS, answers.currentTransactions);
  const targetTx = labelFor(TRANSACTION_BAND_OPTIONS, answers.targetTransactions);
  const budget = labelFor(BUDGET_OPTIONS, answers.availableBudget);
  const serviceArea = labelFor(SERVICE_AREA_OPTIONS, answers.serviceArea);

  return (
    <div data-testid="results-panel">
      <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-3">
        {firstName ? `${firstName}'s Plan` : "Your Plan"}
      </p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-balance">
        Your Real Estate Lead Generation Plan
      </h2>

      <dl className="grid sm:grid-cols-2 gap-4 mb-10">
        {objectiveLabel(answers.objective) && (
          <SummaryItem label="Primary Goal" value={objectiveLabel(answers.objective)!} />
        )}
        {market && <SummaryItem label="Market" value={serviceArea ? `${market} — ${serviceArea}` : market} />}
        {leadTypes.length > 0 && <SummaryItem label="Target Opportunities" value={leadTypes.join(", ")} />}
        {currentTx && targetTx && (
          <SummaryItem label="Growth Goal" value={`${currentTx} → ${targetTx} transactions/quarter`} />
        )}
        {budget && <SummaryItem label="Marketing Investment" value={`${budget}/month`} />}
      </dl>

      <div className="rounded-2xl border border-card-border bg-card p-6 md:p-7 mb-8">
        <h3 className="font-display text-lg font-semibold tracking-tight mb-1.5">Recommended Acquisition Strategy</h3>
        <p className="text-sm text-muted-foreground mb-5">{rec.concentrationNote}</p>
        <ol className="space-y-3">
          {rec.channels.map((c, i) => (
            <li key={c.channel} className="flex items-start gap-3" data-testid={`channel-${i}`}>
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 font-mono text-[11px] font-bold text-primary">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">{c.channel}</p>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.reason}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-5 text-xs text-muted-foreground">
          This is a strategy recommendation based on your answers, not a guarantee of lead volume, cost per lead, or
          closed transactions. Actual performance depends on your market, creative, and offer.
        </p>
      </div>

      {answers.implementationPreference === "diy" ? (
        <DiyBlock onSwitchToDfy={onSwitchToDfy} />
      ) : (
        <DfyBlock isPriority={isPriority} />
      )}
    </div>
  );
}

function SummaryItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-muted/30 p-4">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{label}</dt>
      <dd className="text-sm font-semibold text-foreground text-pretty">{value}</dd>
    </div>
  );
}

function DiyBlock({ onSwitchToDfy }: { onSwitchToDfy?: () => void }) {
  const [revealed, setRevealed] = useState(false);

  return (
    <div className="rounded-2xl border border-card-border bg-card p-6 md:p-7">
      <h3 className="font-display text-lg font-semibold tracking-tight mb-2">Build it yourself, with our blueprint</h3>
      {revealed ? (
        <div className="flex items-start gap-3 rounded-xl bg-primary/5 border border-primary/20 p-4">
          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            Your blueprint request is in. We'll send the detailed implementation guide for your market — campaign
            setup, targeting, landing page structure, tracking, and budget allocation — to the email you gave us.
          </p>
        </div>
      ) : (
        <>
          <p className="text-sm text-muted-foreground leading-relaxed mb-5">
            We'll put together the campaign setup, targeting, landing page structure, tracking, and testing framework
            for the strategy above, so you can implement it yourself.
          </p>
          <Button
            size="lg"
            onClick={() => {
              setRevealed(true);
              track("real_estate_lead_strategy_call_clicked", { step: "diy_blueprint_reveal" });
            }}
            data-testid="button-diy-reveal"
          >
            Show Me Exactly How To Build This
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </>
      )}
      {onSwitchToDfy && (
        <button
          type="button"
          onClick={onSwitchToDfy}
          className="mt-4 block text-sm font-medium text-muted-foreground underline underline-offset-2 hover:text-foreground"
          data-testid="button-switch-dfy"
        >
          Have BlackSync Build It Instead
        </button>
      )}
    </div>
  );
}

function DfyBlock({ isPriority }: { isPriority: boolean }) {
  const [confirmed, setConfirmed] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-primary/30 bg-primary/[0.04] p-6 md:p-7">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles className="h-4 w-4 text-primary" />
        <h3 className="font-display text-lg font-semibold tracking-tight">Want BlackSync To Build This For You?</h3>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
        BlackSync builds the acquisition system around your market and goals — strategy, campaign architecture,
        advertising setup, funnels, tracking and attribution, and ongoing optimization.
      </p>

      {confirmed ? (
        <div className="flex items-start gap-3 rounded-xl bg-background border border-border p-4 mb-4">
          <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <p className="text-sm text-foreground/90 leading-relaxed">
            You're all set. Your plan is on its way, and our team will follow up shortly to walk through it.
          </p>
        </div>
      ) : (
        <Button
          size="lg"
          className="mb-3"
          onClick={() => {
            setConfirmed(true);
            track("real_estate_lead_strategy_call_clicked", { step: "dfy_plan_confirmed" });
          }}
          data-testid="button-dfy-confirm"
        >
          Get My Custom Lead Generation Plan
          <ArrowRight className="w-4 h-4 ml-1.5" />
        </Button>
      )}

      <div>
        <Button
          size={isPriority ? "lg" : "default"}
          variant={isPriority ? "default" : "outline"}
          onClick={() => {
            setBookingOpen(true);
            track("real_estate_lead_strategy_call_clicked", { step: "book_call_open" });
          }}
          data-testid="button-book-strategy-call"
        >
          Book My Strategy Call
        </Button>
      </div>

      <Dialog
        open={bookingOpen}
        onOpenChange={(v) => {
          setBookingOpen(v);
          if (v) track("real_estate_lead_strategy_call_booked", { step: "book_call_dialog_open" });
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Book your strategy call</DialogTitle>
            <DialogDescription>Pick a time that works — we'll walk through your plan live.</DialogDescription>
          </DialogHeader>
          <CalendlyEmbed height={640} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
