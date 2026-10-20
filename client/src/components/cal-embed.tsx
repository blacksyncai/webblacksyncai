import { useEffect, useRef, useState } from "react";
import { Loader2, ExternalLink } from "lucide-react";
import { BOOK_CAL_LINK, BOOK_CALL_URL } from "@/lib/register";

const EMBED_SRC = "https://app.cal.com/embed/embed.js";

declare global {
  interface Window {
    Cal?: ((...args: unknown[]) => void) & {
      ns?: Record<string, (...args: unknown[]) => void>;
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

/**
 * Inline Cal.com scheduler — mirrors the official inline embed snippet:
 * init the "15min" namespace, then ns("inline") with calLink + config,
 * then ns("ui") for layout options.
 *
 * Verifies the booking iframe actually rendered; falls back to a direct
 * booking link if it hasn't within 12s (blocked script, CSP, ad blocker).
 */
export function CalEmbed({
  className = "",
  height = 700,
}: {
  className?: string;
  height?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    let cancelled = false;
    const el = containerRef.current;
    if (!el) return;

    loadCalScript()
      .then(() => {
        if (cancelled || !window.Cal) return;
        const Cal = window.Cal;
        Cal("init", "15min", { origin: "https://app.cal.com" });
        Cal.config = Cal.config || {};
        Cal.config.forwardQueryParams = true;
        Cal.ns?.["15min"]("inline", {
          elementOrSelector: el,
          config: {
            layout: "month_view",
            useSlotsViewOnSmallScreen: "true",
          },
          calLink: BOOK_CAL_LINK,
        });
        Cal.ns?.["15min"]("ui", {
          hideEventTypeDetails: false,
          layout: "month_view",
        });
        const deadline = Date.now() + 12000;
        const poll = window.setInterval(() => {
          if (cancelled) return window.clearInterval(poll);
          if (el.querySelector("iframe")) {
            window.clearInterval(poll);
            setState("ready");
          } else if (Date.now() > deadline) {
            window.clearInterval(poll);
            setState("error");
          }
        }, 500);
      })
      .catch(() => {
        if (!cancelled) setState("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (state === "error") {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-3 rounded-xl border bg-card p-8 text-center ${className}`}
        data-testid="cal-fallback"
      >
        <p className="text-sm font-medium">Book your 15-min call directly:</p>
        <a
          href={BOOK_CALL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
          data-testid="link-cal-fallback"
        >
          Open the booking calendar <ExternalLink className="w-3.5 h-3.5" />
        </a>
        <p className="text-xs text-muted-foreground">
          Opens in a new tab — takes about 30 seconds.
        </p>
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
        data-testid="cal-inline-widget"
      />
    </div>
  );
}
