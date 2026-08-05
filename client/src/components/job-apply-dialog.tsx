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

export type JobField = {
  id: string;
  label: string;
  type: "text" | "tel" | "email" | "textarea" | "select";
  placeholder?: string;
  options?: string[];
  optional?: boolean;
  helper?: string;
};

export function JobApplyDialog({
  roleTitle,
  fields,
  children,
}: {
  roleTitle: string;
  fields: JobField[];
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const { toast } = useToast();
  const { ref: hpRef, isBot } = useHoneypot();

  function setValue(id: string, v: string) {
    setValues((prev) => ({ ...prev, [id]: v }));
  }

  const mutation = useMutation({
    mutationFn: async () => {
      const extra = fields
        .filter((f) => !["name", "email", "phone"].includes(f.id))
        .map((f) => `${f.label}: ${values[f.id]?.trim() || "—"}`)
        .join("\n");
      await apiRequest("POST", "/api/leads", {
        name: values.name?.trim(),
        email: values.email?.trim(),
        phone: values.phone?.trim(),
        company: `Job Application — ${roleTitle}`,
        useCase: `Careers: ${roleTitle}`,
        message: extra,
      });
    },
    onSuccess: () => {
      toast({
        title: "Application received!",
        description: "We'll review it and reach out if it's a fit.",
      });
      setOpen(false);
      setValues({});
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
    const missing = fields.filter((f) => !f.optional && !values[f.id]?.trim());
    if (missing.length) {
      toast({
        title: "A few required fields are missing",
        description: missing.map((f) => f.label).join(", "),
        variant: "destructive",
      });
      return;
    }
    if (!values.email?.includes("@")) {
      toast({ title: "Enter a valid email", variant: "destructive" });
      return;
    }
    if (isBot()) {
      toast({ title: "Application received!", description: "We'll be in touch if it's a fit." });
      setOpen(false);
      setValues({});
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
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-lg max-h-[85vh] overflow-y-auto" data-testid="dialog-job-apply">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-semibold tracking-tight">
            Apply — {roleTitle}
          </DialogTitle>
          <DialogDescription>Tell us about yourself. No generic cover letters needed.</DialogDescription>
        </DialogHeader>

        <form onSubmit={submit} className="space-y-4">
          <HoneypotInput inputRef={hpRef} />

          {fields.map((f) => (
            <div className="space-y-1.5" key={f.id}>
              <Label htmlFor={`job-${f.id}`}>
                {f.label} {f.optional && <span className="text-muted-foreground font-normal">(optional)</span>}
              </Label>
              {f.helper && <p className="text-xs text-muted-foreground">{f.helper}</p>}
              {f.type === "textarea" ? (
                <Textarea
                  id={`job-${f.id}`}
                  placeholder={f.placeholder}
                  value={values[f.id] || ""}
                  onChange={(e) => setValue(f.id, e.target.value)}
                  data-testid={`input-job-${f.id}`}
                />
              ) : f.type === "select" ? (
                <Select value={values[f.id] || ""} onValueChange={(v) => setValue(f.id, v)}>
                  <SelectTrigger id={`job-${f.id}`} data-testid={`select-job-${f.id}`}>
                    <SelectValue placeholder="Select" />
                  </SelectTrigger>
                  <SelectContent>
                    {(f.options || []).map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  id={`job-${f.id}`}
                  type={f.type}
                  placeholder={f.placeholder}
                  value={values[f.id] || ""}
                  onChange={(e) => setValue(f.id, e.target.value)}
                  data-testid={`input-job-${f.id}`}
                />
              )}
            </div>
          ))}

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={mutation.isPending}
            data-testid="button-job-apply-submit"
          >
            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            Submit Application
            {!mutation.isPending && <ArrowRight className="w-4 h-4 ml-1" />}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
