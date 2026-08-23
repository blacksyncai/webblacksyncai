import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Loader2, Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { startHelcimCheckout, type PlanKey } from "@/lib/helcim-checkout";

export type CheckoutPlan = {
  key: PlanKey;
  name: string;
  price: string;
  period: string;
  /** Hosted Helcim subscription page, used whenever on-site checkout isn't available. */
  hostedUrl: string;
};

export function CheckoutDialog({
  plan,
  open,
  onOpenChange,
}: {
  plan: CheckoutPlan | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [company, setCompany] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const { toast } = useToast();

  function reset() {
    setBusy(false);
    setDone(false);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!plan) return;
    if (!email.includes("@")) {
      toast({
        title: "Enter a valid email",
        description: "We need it for your receipt and account.",
        variant: "destructive",
      });
      return;
    }

    setBusy(true);

    // Record the lead first so a started checkout is never invisible to sales.
    apiRequest("POST", "/api/leads", {
      name: name.trim() || email.split("@")[0],
      email: email.trim(),
      company: company.trim() || undefined,
      useCase: `Checkout started — ${plan.name}`,
    }).catch(() => {});

    try {
      const result = await startHelcimCheckout(plan.key, {
        email: email.trim(),
        name: name.trim() || undefined,
        company: company.trim() || undefined,
      });

      if (result.status === "unavailable") {
        // On-site checkout not configured/reachable — hand off to the hosted page.
        window.location.href = plan.hostedUrl;
        return;
      }
      if (result.status === "cancelled") {
        setBusy(false);
        return;
      }
      setDone(true);
    } catch {
      toast({
        title: "Payment couldn't be completed",
        description: "Your card was not charged. Please try again or contact us.",
        variant: "destructive",
      });
      setBusy(false);
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (busy) return;
        onOpenChange(v);
        if (!v) reset();
      }}
    >
      <DialogContent className="sm:max-w-md" data-testid="dialog-checkout">
        {done ? (
          <div className="py-4 text-center" data-testid="checkout-success">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" />
            </div>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight mb-2">
              You're subscribed
            </DialogTitle>
            <DialogDescription className="text-base">
              Check {email} for your receipt — we'll be in touch shortly to get your AI agent set
              up.
            </DialogDescription>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
                {plan ? `Subscribe to ${plan.name}` : "Subscribe"}
              </DialogTitle>
              <DialogDescription>
                {plan ? (
                  <>
                    <span className="font-semibold text-foreground">
                      {plan.price}
                      {plan.period}
                    </span>{" "}
                    · Cancel anytime
                  </>
                ) : null}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={submit} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="checkout-email">Work email</Label>
                <Input
                  id="checkout-email"
                  type="email"
                  placeholder="you@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-checkout-email"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-name">Your name</Label>
                  <Input
                    id="checkout-name"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    data-testid="input-checkout-name"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="checkout-company">
                    Company <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Input
                    id="checkout-company"
                    placeholder="Acme Realty"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    data-testid="input-checkout-company"
                  />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={busy}
                data-testid="button-checkout-continue"
              >
                {busy ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Continue to payment
                {!busy && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
                <Lock className="w-3.5 h-3.5" /> Card details are handled by Helcim — they never
                touch our servers.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
