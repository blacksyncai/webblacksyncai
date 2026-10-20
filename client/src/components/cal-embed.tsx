import { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { BOOK_CAL_LINK, BOOK_CALL_URL } from "@/lib/register";

const EMBED_SRC = "https://app.cal.com/embed/embed.js";

declare global {
  interface Window {
    Cal?: {
      (...args: unknown[]): void;
      ns?: Record<string, unknown>;
      config?: Record<string, unknown>;
      loaded?: boolean;
      q?: unknown[];
    };
  }
}

/** Loads the Cal.com embed script once, shared across every embed on the page. */
let scriptPromise: Promise<void> | null = null;

function loadCalScript(): Promise<void> {
  if (scriptPromise) return scriptPromise;
  scriptPromise = new Promise<void>((resolve, reject) => {
    if (window.Cal?.loaded) return resolve();
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${EMBED_SRC}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Cal.com script failed")));
      return;
    }
    const script = document.createElement("script");
    script.src = EMBED_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Cal.com script failed"));
    document.head.appendChild(script);
  });
  return scriptPromise;
}

export type CalPrefill = {
  name?: string;
  email?: string;
};

/**
 * Inline Cal.com scheduler, so visitors book without leaving the site.
 *
 * Falls back to a plain link if the widget can't load (blocked script, offline,
 * ad blocker) — a booking CTA should never dead-end.
 */
export function CalEmbed({
  prefill,
  className = "",
  height = 700,
}: {
  prefill?: CalPrefill;
  className?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error("Cal.com load timed out")), 12000),
    );

    Promise.race([loadCalScript(), timeout])
      .then(() => {
        if (cancelled || !window.Cal) return;
        window.Cal("init", "15min", { origin: "https://app.cal.com" });
        window.Cal?.ns?.["15min"];
        window.Cal("inline", {
          elementOrSelector: el,
          config: {
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
            ...(prefill?.name ? { name: prefill.name } : {}),
            ...(prefill?.email ? { email: prefill.email } : {}),
          },
        });
        setState("ready");
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (state === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-8 text-center ${className}`}
        data-testid="cal-fallback"
      >
        <p className="text-sm text-muted-foreground">
          The scheduler couldn&apos;t load here — you can still book in a new tab.
        </p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          data-testid="link-cal-fallback"
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
          data-testid="cal-loading"
        >
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading available times…
        </div>
      )}
      <div
        ref={containerRef}
        style={{ minWidth: 320, height }}
        data-cal-namespace="15min"
        data-cal-link={BOOK_CAL_LINK}
        data-testid="cal-inline-widget"
      />
    </div>
  );
}
