import { ArrowRight, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildRecommendation, type Answers } from "@/lib/ai-sdr-funnel-engine";

export function AiSdrResults({ answers, onGetPlan }: { answers: Answers; onGetPlan: () => void }) {
  const rec = buildRecommendation(answers);

  return (
    <div data-testid="ai-sdr-results">
      <p className="font-mono text-[10px] uppercase tracking-wider text-primary mb-3">
        Your Recommended Deployment
      </p>
      <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-8 text-zinc-50 text-balance">
        Your Recommended BlackSync Deployment
      </h2>

      <div className="rounded-2xl border border-zinc-700 bg-zinc-900 p-6 md:p-8 mb-8">
        <dl className="grid sm:grid-cols-2 gap-5">
          <div className="sm:col-span-2">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">
              AI SDR Deployment
            </dt>
            <dd className="text-lg font-semibold text-zinc-50">
              <span className="text-primary">{rec.workflowCount}</span>{" "}
              {rec.workflowCount === 1 ? "outbound workflow" : "outbound workflows"}
            </dd>
          </div>

          <div className="sm:col-span-2">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
              Recommended Campaigns
            </dt>
            <ul className="space-y-1.5">
              {rec.campaigns.map((c) => (
                <li key={c} className="flex items-center gap-2 text-sm text-zinc-200" data-testid={`campaign-${c}`}>
                  <Check className="h-3.5 w-3.5 text-primary shrink-0" strokeWidth={3} />
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">Primary Handoff</dt>
            <dd className="text-sm font-semibold text-zinc-100">{rec.handoffLabel}</dd>
          </div>
          <div>
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">CRM</dt>
            <dd className="text-sm font-semibold text-zinc-100">{rec.crmLabel}</dd>
          </div>
          <div className="sm:col-span-2 pt-3 border-t border-zinc-800">
            <dt className="font-mono text-[10px] uppercase tracking-wider text-zinc-500 mb-1.5">Deployment Type</dt>
            <dd className="text-sm font-semibold text-primary">{rec.deploymentType}</dd>
          </div>
        </dl>
      </div>

      <Button size="lg" onClick={onGetPlan} data-testid="button-get-plan">
        Get My Outbound Plan
        <ArrowRight className="w-4 h-4 ml-1.5" />
      </Button>
    </div>
  );
}
