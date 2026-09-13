import { Check } from "lucide-react";
import type { Option } from "@/lib/lead-funnel-engine";

/**
 * Large, tappable selectable cards -- the funnel's answer to "no tiny radio
 * buttons." Native <button> elements throughout: keyboard-focusable and
 * operable with Enter/Space for free, no extra ARIA plumbing needed beyond
 * aria-pressed to announce selected state to screen readers.
 */
export function OptionGrid({
  options,
  value,
  onSelect,
  multi = false,
  columns = "single",
  testIdPrefix = "",
}: {
  options: Option[];
  value: string[];
  onSelect: (next: string[]) => void;
  multi?: boolean;
  columns?: "single" | "two";
  /** Disambiguates data-testid when the same option values appear in more than
   *  one grid on the same screen (e.g. current vs. target transaction bands). */
  testIdPrefix?: string;
}) {
  function toggle(v: string) {
    if (multi) {
      onSelect(value.includes(v) ? value.filter((x) => x !== v) : [...value, v]);
    } else {
      onSelect([v]);
    }
  }

  return (
    <div
      className={`grid gap-2.5 ${columns === "two" ? "sm:grid-cols-2" : ""}`}
      role={multi ? "group" : "radiogroup"}
    >
      {options.map((opt) => {
        const selected = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => toggle(opt.value)}
            className={`group flex w-full items-center justify-between gap-3 rounded-xl border px-5 py-4 text-left text-sm md:text-base font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              selected
                ? "border-primary bg-primary/5 text-foreground"
                : "border-border bg-card text-foreground/90 hover:border-primary/40 hover:bg-muted/40"
            }`}
            data-testid={`option-${testIdPrefix}${opt.value}`}
          >
            <span className="text-pretty">{opt.label}</span>
            <span
              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                multi ? "rounded-md" : ""
              } ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border/70 bg-background"}`}
              aria-hidden="true"
            >
              {selected && <Check className="h-3 w-3" strokeWidth={3} />}
            </span>
          </button>
        );
      })}
    </div>
  );
}
