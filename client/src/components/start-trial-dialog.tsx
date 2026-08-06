import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2, Sparkles, ShieldCheck, Check, PhoneCall } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { goToRegister } from "@/lib/register";
import { BookCallDialog } from "@/components/book-call-dialog";
import { INDUSTRY_OPTIONS, isTrialEligible, TRIAL_INELIGIBLE_MESSAGE } from "@/lib/trial-eligibility";

const PERKS = [
  "AI voice agent set up for your industry",
  "Calls & qualifies your leads in ~11 seconds",
  "Books straight to your calendar",
];

export function StartTrialDialog({
  children,
  onOpen,
}: {
  children: React.ReactNode;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [industry, setIndustry] = useState("");
  const [company, setCompany] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();
  const blocked = industry !== "" && !isTrialEligible(industry);

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: name.trim() || email.split("@")[0],
        email: email.trim(),
        industry: industry || undefined,
        company: company.trim() || undefined,
        useCase: "Free trial signup",
      });
    },
    onSuccess: () => {
      toast({ title: "You're in!", description: "Setting up your access…" });
      goToRegister({ email, name, company });
    },
    onError: () =>
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      }),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!industry) {
      toast({ title: "Pick your industry", description: "So we tune your agent.", variant: "destructive" });
      return;
    }
    if (blocked) return;
    if (!email || !email.includes("@")) {
      toast({ title: "Enter a valid email", description: "We need it to create your access.", variant: "destructive" });
      return;
    }
    if (isBot()) {
      goToRegister({ email, name, company });
      return;
    }
    mutation.mutate();
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!mutation.isPending) { setOpen(v); if (v) onOpen?.(); } }}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md p-0 overflow-hidden gap-0" data-testid="dialog-start-trial">
        {/* Accent header */}
        <div className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-primary/12 via-orange-500/8 to-transparent">
          <DialogHeader className="space-y-1 text-left">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-card px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-primary">
              <Sparkles className="w-3 h-3" /> Free trial
            </span>
            <DialogTitle className="font-display text-2xl font-semibold tracking-tight pt-1">
              Start your free trial
            </DialogTitle>
            <DialogDescription className="text-sm">
              Two quick details — we'll tune your AI agent and set up your access next.
            </DialogDescription>
          </DialogHeader>
        </div>

        <form onSubmit={submit} className="px-6 pb-6 pt-5 space-y-4">
          <HoneypotInput inputRef={hpRef} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label htmlFor="trial-name">Your name</Label>
              <Input id="trial-name" placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} data-testid="input-trial-name" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="trial-industry">Industry</Label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="trial-industry" data-testid="select-trial-industry">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRY_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {blocked ? (
            <div
              className="rounded-xl border border-primary/20 bg-primary/5 p-5 text-center space-y-4"
              data-testid="panel-trial-blocked"
            >
              <p className="text-sm text-foreground leading-relaxed">{TRIAL_INELIGIBLE_MESSAGE}</p>
              <BookCallDialog>
                <Button type="button" className="w-full" data-testid="button-trial-blocked-book-call">
                  <PhoneCall className="w-4 h-4 mr-2" /> Book a Call
                </Button>
              </BookCallDialog>
            </div>
          ) : (
            <>
              <div className="space-y-1.5">
                <Label htmlFor="trial-email">Work email</Label>
                <Input id="trial-email" type="email" placeholder="you@company.com" value={email} onChange={(e) => setEmail(e.target.value)} data-testid="input-trial-email" />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="trial-company">Company / team <span className="text-muted-foreground font-normal">(optional)</span></Label>
                <Input id="trial-company" placeholder="Acme Realty" value={company} onChange={(e) => setCompany(e.target.value)} data-testid="input-trial-company" />
              </div>

              <Button type="submit" size="lg" className="w-full" disabled={mutation.isPending} data-testid="button-trial-submit">
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Start Free Trial
                {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>

              <ul className="space-y-1.5 pt-1">
                {PERKS.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Check className="w-3.5 h-3.5 text-primary shrink-0" /> {p}
                  </li>
                ))}
              </ul>

              <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground pt-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Next: create your login to get instant access — your details carry over.
              </p>

              <div className="flex items-center gap-3 pt-1">
                <span className="h-px flex-1 bg-border" />
                <span className="text-[11px] text-muted-foreground">or</span>
                <span className="h-px flex-1 bg-border" />
              </div>
              <BookCallDialog>
                <button
                  type="button"
                  className="block w-full text-center text-sm font-medium text-primary hover:underline"
                  data-testid="link-trial-book-call"
                >
                  Prefer to talk first? Book a free 15-min call →
                </button>
              </BookCallDialog>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
