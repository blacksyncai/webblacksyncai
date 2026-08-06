import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eyebrow, Reveal } from "@/components/ui/section";
import { ArrowRight, Loader2, Mail, PhoneCall, Building2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { BookCallDialog } from "@/components/book-call-dialog";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function ContactPage() {
  usePageMeta({
    title: "Contact",
    description: "Get in touch with the BlackSync team — questions, support, or just want to talk before booking a call.",
    path: "/contact",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: name.trim(),
        email: email.trim(),
        useCase: "General Contact Inquiry",
        message: message.trim(),
      });
    },
    onSuccess: () => {
      toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      setName("");
      setEmail("");
      setMessage("");
    },
    onError: () =>
      toast({ title: "Something went wrong", description: "Please try again.", variant: "destructive" }),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.includes("@") || !message.trim()) {
      toast({ title: "Fill in your name, email, and message", variant: "destructive" });
      return;
    }
    if (isBot()) {
      toast({ title: "Message sent!", description: "We'll get back to you shortly." });
      setName("");
      setEmail("");
      setMessage("");
      return;
    }
    mutation.mutate();
  }

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-contact">
      <Navbar />

      <section className="relative pt-28 pb-16 md:pt-36 md:pb-20 hero-gradient overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-40 dark:opacity-20" />
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Eyebrow>Contact</Eyebrow>
          <h1 className="mt-5 font-display text-4xl sm:text-5xl md:text-6xl font-semibold tracking-tight leading-[1.05] mb-6 text-balance">
            Get in touch.
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed text-pretty">
            Questions about BlackSync, or want to talk to a person before booking a call? Reach out below.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 grid md:grid-cols-2 gap-12">
          <Reveal>
            <div className="space-y-6">
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Email</h3>
                  <a href="mailto:hello@blacksync.ai" className="text-sm text-primary hover:underline">
                    hello@blacksync.ai
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Prefer to talk?</h3>
                  <p className="text-sm text-muted-foreground mb-2">Book a free 15-minute call directly.</p>
                  <BookCallDialog>
                    <Button variant="outline" size="sm" data-testid="button-contact-book-call">
                      Book a Call
                    </Button>
                  </BookCallDialog>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Brokerage or agency?</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    For larger teams, see what BlackSync Enterprise includes.
                  </p>
                  <Link href="/enterprise">
                    <Button variant="outline" size="sm" data-testid="button-contact-enterprise">
                      Visit Enterprise <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.05}>
            <form onSubmit={handleSubmit} className="space-y-4" data-testid="form-contact">
              <HoneypotInput inputRef={hpRef} />
              <div className="space-y-1.5">
                <Label htmlFor="contact-name">Name</Label>
                <Input
                  id="contact-name"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  data-testid="input-contact-name"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-contact-email"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="contact-message">Message</Label>
                <Textarea
                  id="contact-message"
                  rows={5}
                  placeholder="How can we help?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  data-testid="input-contact-message"
                />
              </div>
              <Button
                type="submit"
                size="lg"
                className="w-full"
                disabled={mutation.isPending}
                data-testid="button-contact-submit"
              >
                {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Send Message
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
