import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { usePageMeta } from "@/hooks/use-page-meta";
import { DollarSign, Repeat, Users, ArrowRight, Loader2 } from "lucide-react";

const STEPS = [
  {
    icon: Users,
    title: "Refer a company",
    description: "Send us a real estate, mortgage, insurance, or home services team that could use BlackSync.",
  },
  {
    icon: DollarSign,
    title: "They become a paying customer",
    description: "Once they sign up and their first payment goes through, you get a one-time referral bonus.",
  },
  {
    icon: Repeat,
    title: "Keep referring, unlock recurring commission",
    description:
      "After your 4th paying customer referral, you start earning recurring commission on every account you've referred, for as long as they stay a customer.",
  },
];

const FAQS = [
  {
    q: "Who can become an affiliate?",
    a: "Anyone — agents, brokers, consultants, industry influencers, or existing customers. No minimum audience size required.",
  },
  {
    q: "How much do I earn?",
    a: "A one-time bonus for every new paying customer you refer, plus recurring commission on all of your referred accounts once you've referred 4 paying customers. Exact rates are confirmed when you're approved.",
  },
  {
    q: "How do I get paid?",
    a: "We'll confirm payout details (timing and method) directly with you once you're approved as an affiliate.",
  },
];

export default function AffiliatesPage() {
  usePageMeta({
    title: "Affiliates",
    description:
      "Refer companies to BlackSync and earn a one-time referral bonus plus recurring commission after your 4th referral.",
    path: "/affiliates",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: name.trim(),
        email: email.trim(),
        company: company.trim() || undefined,
        useCase: "Affiliate Program Application",
        message: message.trim() || undefined,
      });
    },
    onSuccess: () => {
      toast({ title: "You're in!", description: "We'll follow up with your affiliate details shortly." });
      setName("");
      setEmail("");
      setCompany("");
      setMessage("");
    },
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@")) {
      toast({ title: "Name and a valid email are required", variant: "destructive" });
      return;
    }
    if (isBot()) {
      toast({ title: "You're in!", description: "We'll be in touch shortly." });
      setName("");
      setEmail("");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-affiliates">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Affiliate Program</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            Refer BlackSync. Get paid <span className="text-accent-grad">twice.</span>
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            A generous one-time bonus for every company you refer, plus recurring commission once you've sent us a
            handful of paying customers.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s, i) => (
              <Reveal key={s.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border bg-card shadow-sm h-full">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{s.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-3xl md:text-4xl font-semibold tracking-tight mb-8 text-center text-balance">
              Frequently asked questions
            </h2>
          </Reveal>
          <div className="space-y-6">
            {FAQS.map((f) => (
              <Reveal key={f.q}>
                <div>
                  <h3 className="font-semibold mb-1.5">{f.q}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight mb-2 text-center">
              Become an affiliate
            </h2>
            <p className="text-sm text-muted-foreground text-center mb-8">
              Tell us a bit about yourself and we'll follow up with your referral details.
            </p>
          </Reveal>
          <Reveal delay={0.05}>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-affiliate">
              <HoneypotInput inputRef={hpRef} />
              <div className="space-y-1.5">
                <Label htmlFor="aff-name">Full name</Label>
                <Input
                  id="aff-name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-affiliate-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aff-email">Email</Label>
                <Input
                  id="aff-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-affiliate-email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aff-company">
                  Company / website <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Input
                  id="aff-company"
                  placeholder="acmerealty.com"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  data-testid="input-affiliate-company"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="aff-message">
                  How do you plan to refer companies? <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="aff-message"
                  placeholder="e.g. my brokerage network, a newsletter, my client base…"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  data-testid="input-affiliate-message"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="button-affiliate-submit"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Apply to the Affiliate Program
                {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
              </Button>
            </form>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
