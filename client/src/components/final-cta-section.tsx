import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { StartTrialDialog } from "@/components/start-trial-dialog";

export function FinalCtaSection() {
  const [email, setEmail] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  // Safety net: record the email the moment it's entered, so an abandoned
  // qualification step doesn't lose the lead. The dialog sends the full,
  // qualified lead on completion (same email → CRM enriches the contact).
  const capture = useMutation({
    mutationFn: async (emailValue: string) => {
      await apiRequest("POST", "/api/leads", {
        name: emailValue.split("@")[0],
        email: emailValue,
        useCase: "Get Access — email captured",
      });
    },
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({ title: "Invalid email", description: "Please enter a valid work email.", variant: "destructive" });
      return;
    }
    if (isBot()) {
      // Spam: mimic success, don't send.
      toast({ title: "You're in!", description: "Check your inbox to get started." });
      setEmail("");
      return;
    }
    capture.mutate(email);
    // Qualify by industry before routing anywhere — ineligible industries get
    // the Free Pilot / book-a-call path instead of self-serve access.
    setDialogOpen(true);
  }

  return (
    <section data-testid="section-final-cta" className="relative py-20 md:py-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] bg-foreground text-background px-6 py-16 md:px-12 md:py-24 shadow-2xl"
        >
          {/* Warm glow + dot texture */}
          <div
            className="absolute inset-0 opacity-90"
            style={{
              background:
                "radial-gradient(ellipse 60% 80% at 50% -10%, hsl(14 82% 55% / 0.55), transparent 60%), radial-gradient(ellipse 50% 60% at 90% 110%, hsl(32 80% 55% / 0.35), transparent 60%)",
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage:
                "radial-gradient(currentColor 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative text-center max-w-2xl mx-auto">
            <span className="inline-flex items-center gap-2 rounded-full border border-background/20 bg-background/10 px-3 py-1 font-mono text-[11px] font-medium uppercase tracking-[0.16em] text-background/80 backdrop-blur">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              Get access today
            </span>

            <h2
              className="mt-6 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.04] mb-4 text-balance"
              data-testid="text-final-cta-headline"
            >
              Your next 10 appointments are{" "}
              <span className="bg-gradient-to-r from-orange-300 to-amber-200 bg-clip-text text-transparent">
                already waiting.
              </span>
            </h2>

            <p
              className="text-base md:text-lg text-background/70 mb-8 leading-relaxed text-pretty"
              data-testid="text-final-cta-subhead"
            >
              No long-term contracts. No sales call required. Live in under 5 minutes.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-center justify-center gap-2.5 w-full max-w-md mx-auto p-1.5 sm:rounded-2xl sm:border sm:border-background/15 sm:bg-background/10 sm:backdrop-blur"
            >
              <HoneypotInput inputRef={hpRef} />
              <Input
                type="email"
                placeholder="Enter your work email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 border-background/20 bg-background/10 text-background placeholder:text-background/50 sm:border-transparent sm:bg-transparent sm:shadow-none sm:focus-visible:ring-0"
                data-testid="input-final-cta-email"
              />
              <Button
                size="lg"
                type="submit"
                disabled={capture.isPending}
                className="w-full sm:w-auto bg-background text-foreground hover:bg-background/90"
                data-testid="button-final-cta"
              >
                {capture.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Get Access
                {!capture.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </form>

            <StartTrialDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              initialEmail={email}
            />

            <p className="mt-4 text-xs text-background/60" data-testid="text-final-cta-subtext">
              Phone number from $3.50/mo · Cancel anytime
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
