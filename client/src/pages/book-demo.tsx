import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { ArrowRight, Loader2, CalendarCheck, PhoneCall, ListChecks } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { BOOK_CALL_URL } from "@/lib/register";
import { usePageMeta } from "@/hooks/use-page-meta";

const INDUSTRY_OPTIONS = [
  "Real Estate",
  "Insurance",
  "Mortgage & Lending",
  "Property Management",
  "Healthcare",
  "Home Services",
  "Auto & P&C",
  "Funeral Homes",
  "Other",
];

const EXPECTATIONS = [
  {
    icon: PhoneCall,
    title: "A live walkthrough",
    description: "We'll show you how the AI agent handles a real call scenario for your industry — not a canned video.",
  },
  {
    icon: ListChecks,
    title: "Questions about your workflow",
    description: "Bring your CRM, your lead sources, and your actual bottlenecks. We'll tell you honestly if it's a fit.",
  },
  {
    icon: CalendarCheck,
    title: "No pressure",
    description: "15 minutes, no slide deck, no hard sell. If it's not a fit, we'll tell you.",
  },
];

export default function BookDemoPage() {
  usePageMeta({
    title: "Book a Demo",
    description:
      "Book a free 15-minute demo call and see BlackSync's AI agent handle a real call scenario for your industry.",
    path: "/book-demo",
  });

  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  function goToBooking() {
    window.open(BOOK_CALL_URL, "_blank", "noopener");
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: phone.trim(),
        phone: phone.trim(),
        industry: industry || undefined,
        message: message.trim() || undefined,
        useCase: "Book a demo",
      });
    },
    onSuccess: goToBooking,
    onError: () =>
      toast({
        title: "Something went wrong",
        description: "Please try again.",
        variant: "destructive",
      }),
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!phone.trim()) {
      toast({
        title: "Enter your phone number",
        description: "So we can reach you if the call drops.",
        variant: "destructive",
      });
      return;
    }
    if (isBot()) {
      goToBooking();
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-book-demo">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Book a Demo</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            See BlackSync on your own leads.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Book a free 15-minute call — we'll walk through exactly how the AI agent would handle your leads,
            answer your questions, and give you a straight answer on fit.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-6">
            {EXPECTATIONS.map((e, i) => (
              <Reveal key={e.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl border bg-card shadow-sm h-full">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <e.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-display text-lg font-semibold tracking-tight mb-2">{e.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{e.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8">
          <Reveal>
            <div className="rounded-2xl border bg-card shadow-sm p-6 md:p-8">
              <h2 className="font-display text-2xl font-semibold tracking-tight mb-1 text-center">
                Book your demo
              </h2>
              <p className="text-sm text-muted-foreground text-center mb-6">
                Just a couple details so we can tailor the call to you.
              </p>
              <form onSubmit={submit} className="space-y-4" data-testid="form-book-demo">
                <HoneypotInput inputRef={hpRef} />

                <div className="space-y-1.5">
                  <Label htmlFor="demo-phone">Phone number</Label>
                  <Input
                    id="demo-phone"
                    type="tel"
                    placeholder="(555) 123-4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    data-testid="input-demo-phone"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="demo-industry">
                    Industry <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Select value={industry} onValueChange={setIndustry}>
                    <SelectTrigger id="demo-industry" data-testid="select-demo-industry">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      {INDUSTRY_OPTIONS.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="demo-message">
                    What are you hoping to see on the call?{" "}
                    <span className="text-muted-foreground font-normal">(optional)</span>
                  </Label>
                  <Textarea
                    id="demo-message"
                    placeholder="e.g. how it handles objections, CRM integration…"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    data-testid="input-demo-message"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={mutation.isPending}
                  data-testid="button-demo-submit"
                >
                  {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Continue to booking
                  {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
                </Button>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
