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
      q?: unknown[][];
    };
  }
}

/**
 * Installs Cal.com's official embed loader (the exact IIFE from their
 * snippet). Safe to call repeatedly: the loader itself guards against
 * double-loading, and queues "inline" calls until the real script is ready.
 */
function ensureCalLoader() {
  if (typeof window === "undefined") return;
  window.Cal =
    window.Cal ||
    function (...args: unknown[]) {
      const cal = window.Cal as unknown as {
        loaded?: boolean;
        ns: Record<string, (...a: unknown[]) => void>;
        q: unknown[][] | undefined;
      };
      if (!cal.loaded) {
        cal.ns = {};
        cal.q = cal.q || [];
        const script = document.createElement("script");
        script.src = EMBED_SRC;
        document.head.appendChild(script);
        cal.loaded = true;
      }
      if (args[0] === "init") {
        const api = (...a: unknown[]) => {
          (api as unknown as { q: unknown[] }).q.push(a);
        };
        (api as unknown as { q: unknown[] }).q = [];
        const namespace = args[1];
        if (typeof namespace === "string") {
          cal.ns[namespace] = cal.ns[namespace] || (api as never);
          cal.ns[namespace](args);
          cal.q?.push(["initNamespace", namespace]);
          return;
        }
      }
      cal.q?.push(args);
    } as never;
}

/**
 * Inline Cal.com scheduler — mirrors the official inline embed snippet:
 * loader -> init namespace -> ns("inline", {calLink}) -> ns("ui", ...).
 *
 * Falls back to a direct booking link if the iframe hasn't rendered in 12s.
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

    ensureCalLoader();
    const Cal = window.Cal!;
    Cal("init", "15min", { origin: "https://app.cal.com" });
    window.Cal!.config = window.Cal!.config || {};
    window.Cal!.config.forwardQueryParams = true;
    window.Cal!.ns?.["15min"]?.("inline", {
      elementOrSelector: el,
      config: {
        layout: "month_view",
        useSlotsViewOnSmallScreen: "true",
      },
      calLink: BOOK_CAL_LINK,
    });
    window.Cal!.ns?.["15min"]?.("ui", {
      cssVarsPerTheme: { light: { "cal-brand": "#e96e14" } },
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

    return () => {
      cancelled = true;
      window.clearInterval(poll);
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
