import { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { useTheme } from "@/components/theme-provider";
import { BOOK_CALL_URL } from "@/lib/register";

const WIDGET_SRC = "https://assets.calendly.com/assets/external/widget.js";

declare global {
  interface Window {
    Calendly?: {
      initInlineWidget: (opts: {
        url: string;
        parentElement: HTMLElement;
        prefill?: Record<string, unknown>;
      }) => void;
    };
  }
}

/** Loads the Calendly widget script once, shared across every embed on the page. */
let scriptPromise: Promise<void> | null = null;
function loadCalendlyScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.Calendly) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${WIDGET_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Calendly script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = WIDGET_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Calendly script failed"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

/** Calendly reads its styling from query params on the scheduling URL. */
function themedUrl(url: string, dark: boolean): string {
  const u = new URL(url);
  u.searchParams.set("hide_gdpr_banner", "1");
  u.searchParams.set("hide_landing_page_details", "1");
  u.searchParams.set("primary_color", "e2542b");
  if (dark) {
    u.searchParams.set("background_color", "0f0f10");
    u.searchParams.set("text_color", "f5f5f5");
  }
  return u.toString();
}

export type CalendlyPrefill = {
  name?: string;
  email?: string;
  /** Maps to Calendly's first custom question. */
  customAnswers?: Record<string, string>;
};

/**
 * Inline Calendly scheduler, so visitors book without leaving the site.
 *
 * Falls back to a plain link if the widget can't load (blocked script, offline,
 * ad blocker) — a booking CTA should never dead-end.
 */
export function CalendlyEmbed({
  prefill,
  className = "",
  height = 700,
}: {
  prefill?: CalendlyPrefill;
  className?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const { theme } = useTheme();

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    // A hung request (blocked CDN, ad blocker, offline) would otherwise leave
    // the visitor staring at a spinner with no way to book. Time-box it.
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Calendly load timed out")), 12000),
    );

    Promise.race([loadCalendlyScript(), timeout])
      .then(() => {
        if (cancelled || !containerRef.current || !window.Calendly) return;
        containerRef.current.innerHTML = "";
        window.Calendly.initInlineWidget({
          url: themedUrl(BOOK_CALL_URL, theme === "dark"),
          parentElement: containerRef.current,
          prefill,
        });
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
    // Re-initialise on theme change so the scheduler matches the site.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme]);

  if (state === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-8 text-center ${className}`}
        data-testid="calendly-fallback"
      >
        <p className="text-sm text-muted-foreground">
          The scheduler couldn&apos;t load here — you can still book in a new tab.
        </p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          data-testid="link-calendly-fallback"
        >
          Open the booking page <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`} style={{ minHeight: height }}>
      {state === "loading" && (
        <div
          className="absolute inset-0 flex items-center justify-center gap-2 text-sm text-muted-foreground"
          data-testid="calendly-loading"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading available times…
        </div>
      )}
      <div
        ref={containerRef}
        style={{ minWidth: 320, height }}
        data-testid="calendly-inline-widget"
      />
    </div>
  );
}
