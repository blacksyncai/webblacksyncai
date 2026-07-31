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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useHoneypot, HoneypotInput } from "@/components/ui/honeypot";
import { BOOK_CALL_URL } from "@/lib/register";

const INDUSTRY_OPTIONS = [
  "Real Estate",
  "Insurance",
  "Mortgage & Lending",
  "Property Management",
  "Healthcare",
  "Home Services",
  "Auto & P&C",
  "Other",
];

export function BookCallDialog({
  children,
  onOpen,
}: {
  children: React.ReactNode;
  onOpen?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [phone, setPhone] = useState("");
  const [industry, setIndustry] = useState("");
  const [message, setMessage] = useState("");
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  function goToBooking() {
    setOpen(false);
    window.open(BOOK_CALL_URL, "_blank", "noopener");
  }

  const mutation = useMutation({
    mutationFn: async () => {
      await apiRequest("POST", "/api/leads", {
        name: phone.trim(),
        phone: phone.trim(),
        industry: industry || undefined,
        message: message.trim() || undefined,
        useCase: "Book a call",
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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (mutation.isPending) return;
        setOpen(v);
        if (v) onOpen?.();
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md" data-testid="dialog-book-call">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
            Book a free 15-min call
          </DialogTitle>
          <DialogDescription>
            Just a couple details so we can tailor the call to you.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <HoneypotInput inputRef={hpRef} />

          <div className="space-y-1.5">
            <Label htmlFor="call-phone">Phone number</Label>
            <Input
              id="call-phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              data-testid="input-call-phone"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="call-industry">
              Industry <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Select value={industry} onValueChange={setIndustry}>
              <SelectTrigger id="call-industry" data-testid="select-call-industry">
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
            <Label htmlFor="call-message">
              What are you hoping to see on the call?{" "}
              <span className="text-muted-foreground font-normal">(optional)</span>
            </Label>
            <Textarea
              id="call-message"
              placeholder="e.g. how it handles objections, CRM integration…"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              data-testid="input-call-message"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mutation.isPending}
            data-testid="button-call-submit"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Continue to booking
            {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
