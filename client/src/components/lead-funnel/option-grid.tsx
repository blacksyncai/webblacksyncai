import { motion, useReducedMotion } from "framer-motion";
import { Check } from "lucide-react";
import type { Option } from "@/lib/lead-funnel-engine";

/**
 * Large, tappable selectable cards -- the funnel's answer to "no tiny radio
 * buttons." Native <button> elements throughout: keyboard-focusable and
 * operable with Enter/Space for free, no extra ARIA plumbing needed beyond
 * aria-pressed to announce selected state to screen readers.
 *
 * Selection gets a visible spring pop rather than a plain color swap -- the
 * whole point of this control is to feel like a live tool responding to you,
 * not a static list of radio inputs.
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
  const reducedMotion = useReducedMotion();

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
          <motion.button
            key={opt.value}
            type="button"
            role={multi ? "checkbox" : "radio"}
            aria-checked={selected}
            onClick={() => toggle(opt.value)}
            whileTap={reducedMotion ? undefined : { scale: 0.98 }}
            animate={reducedMotion ? undefined : selected ? { scale: [1, 1.015, 1] } : { scale: 1 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className={`group flex w-full items-center justify-between gap-3 rounded-2xl border-2 px-5 py-4 text-left text-sm md:text-base font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              selected
                ? "border-primary bg-primary/[0.08] text-foreground shadow-[0_0_0_1px_hsl(var(--primary)/0.15)]"
                : "border-border/70 bg-card text-foreground/85 hover:border-primary/40 hover:bg-muted/40"
            }`}
            data-testid={`option-${testIdPrefix}${opt.value}`}
          >
            <span className="text-pretty">{opt.label}</span>
            <span
              className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                multi ? "rounded-lg" : ""
              } ${selected ? "border-primary bg-primary text-primary-foreground" : "border-border bg-background"}`}
              aria-hidden="true"
            >
              {selected && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center justify-center"
                >
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </motion.span>
              )}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
