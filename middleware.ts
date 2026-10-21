/**
 * Vercel Routing Middleware (runs on every request before the static file
 * server / vercel.json rewrites resolve it). Two jobs, both about being
 * legible to agents/crawlers that don't execute JS:
 *
 * 1. Real HTTP 404s. The vercel.json SPA rewrite sends every unknown path to
 *    index.html with a 200 -- correct for a human (the client router shows a
 *    proper "page not found" UI), wrong for a crawler, which reads 200 as
 *    "this resource exists." This intercepts unknown paths and returns a
 *    real 404 status with a small, self-contained HTML (or Markdown) error
 *    page.
 *
 * 2. Markdown content negotiation. A request with `Accept: text/markdown`
 *    gets a Markdown rendering of the page's real content instead of the
 *    HTML shell. HTML requests are unaffected.
 *
 * Safety notes (this replaces an earlier version of this file that caused a
 * production outage -- MIDDLEWARE_INVOCATION_FAILED on every request):
 *
 * - No network calls. The earlier version did `await fetch(new URL("/index.html",
 *   request.url))` to fetch its own origin's shell HTML for the 404 body --
 *   a self-referential fetch from inside routing middleware, which is the
 *   suspected cause of the outage. This version never calls fetch(); the
 *   HTML 404 body is a small hardcoded string compiled into the function, and
 *   the Markdown bodies come from pure, synchronous functions in
 *   shared/route-meta.ts.
 * - No filesystem access, for the same reason -- everything this function
 *   needs is either imported statically or a literal string in this file.
 * - The whole function is wrapped in try/catch and fails open: if anything
 *   here throws for an unforeseen reason, the request falls through to
 *   next() (normal routing) instead of taking the site down.
 * - Tested against a real Vercel preview deployment before merging to main.
 *
 * KNOWN_ROUTES/toMarkdown/notFoundMarkdown come from shared/route-meta.ts --
 * the same single source of truth the prerender step and the runtime
 * <title>/meta hook already read from, so this can't drift out of sync with
 * what the app actually serves.
 */
import { next } from "@vercel/functions";
import { KNOWN_ROUTES, toMarkdown, notFoundMarkdown } from "./shared/route-meta";

export const config = {
  matcher: "/:path*",
};

const KNOWN = new Set(KNOWN_ROUTES);

const NOT_FOUND_HTML = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>404 - Page not found | BlackSync</title>
<style>
  body { font-family: -apple-system, "Segoe UI", Roboto, Arial, sans-serif; background: #0b0b0c; color: #fff; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; text-align: center; }
  .wrap { max-width: 440px; padding: 24px; }
  h1 { font-size: 15px; letter-spacing: 0.08em; text-transform: uppercase; color: #f97316; margin: 0 0 12px; }
  p { font-size: 17px; line-height: 1.5; color: rgba(255, 255, 255, 0.75); margin: 0 0 24px; }
  a { color: #f97316; text-decoration: none; font-weight: 600; margin: 0 10px; }
  a:hover { text-decoration: underline; }
</style>
</head>
<body>
  <div class="wrap">
    <h1>404</h1>
    <p>This page doesn't exist on BlackSync.ai.</p>
    <a href="/">Home</a>
    <a href="/sitemap.xml">Sitemap</a>
    <a href="/llms.txt">Agent guide</a>
  </div>
</body>
</html>
`;

/** Paths that aren't app routes at all -- static assets, API functions, any
 * file with an extension (sitemap.xml, robots.txt, llms.txt, images,
 * favicon, the built JS/CSS bundle). These always fall straight through. */
function isAssetOrApiPath(pathname: string): boolean {
  return (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/assets/") ||
    /\.[a-zA-Z0-9]+$/.test(pathname)
  );
}

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname || "/";
}

export default function middleware(request: Request): Response {
  try {
    const url = new URL(request.url);
    const pathname = normalizePath(url.pathname);

    if (isAssetOrApiPath(pathname)) {
      return next();
    }

    const accept = (request.headers.get("accept") || "").toLowerCase();
    const wantsMarkdown = accept.includes("text/markdown");
    const known = KNOWN.has(pathname);

    if (known) {
      if (wantsMarkdown) {
        return new Response(toMarkdown(pathname), {
          status: 200,
          headers: {
            "content-type": "text/markdown; charset=utf-8",
            vary: "Accept",
          },
        });
      }
      // Continue to normal static resolution, just mark the response as
      // Accept-dependent for correct CDN caching.
      return next({ headers: { vary: "Accept" } });
    }

    // Unknown path: real 404.
    if (wantsMarkdown) {
      return new Response(notFoundMarkdown(pathname), {
        status: 404,
        headers: {
          "content-type": "text/markdown; charset=utf-8",
          vary: "Accept",
        },
      });
    }
    return new Response(NOT_FOUND_HTML, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        vary: "Accept",
      },
    });
  } catch {
    // Fail open: never let a bug in this middleware take the site down.
    return next();
  }
}
