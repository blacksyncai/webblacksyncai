import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { Loader2, CheckCircle2, MailX } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function UnsubscribePage() {
  usePageMeta({ path: "/unsubscribe" });

  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/unsubscribe", {
        email: email.trim(),
        useCase: "Unsubscribe request",
      });
    },
    onSuccess: () => setSubmitted(true),
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    if (isBot()) {
      setSubmitted(true);
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-unsubscribe">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden flex-1">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-lg mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Email Preferences</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            Unsubscribe
          </h1>
          <p className="text-base md:text-lg text-muted-foreground leading-relaxed text-pretty mb-10">
            Enter the email address you've been receiving messages at, and we'll remove it from our list.
          </p>

          <Reveal>
            {submitted ? (
              <div
                className="rounded-2xl border border-card-border bg-card p-8 text-center"
                data-testid="unsubscribe-confirmation"
              >
                <CheckCircle2 className="w-9 h-9 text-primary mx-auto mb-4" />
                <h2 className="font-display text-xl font-semibold tracking-tight mb-2">Request received</h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  We'll remove <span className="font-medium text-foreground">{email}</span> from our list within
                  10 business days, in line with CAN-SPAM.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="rounded-2xl border border-card-border bg-card p-8 text-left"
                data-testid="form-unsubscribe"
              >
                <HoneypotInput inputRef={hpRef} />
                <div className="space-y-1.5 mb-5">
                  <Label htmlFor="unsubscribe-email">Email address</Label>
                  <Input
                    id="unsubscribe-email"
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-unsubscribe-email"
                  />
                </div>
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                  data-testid="button-unsubscribe-submit"
                >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <MailX className="w-4 h-4 mr-2" />}
                  Unsubscribe
                </Button>
              </form>
            )}
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
