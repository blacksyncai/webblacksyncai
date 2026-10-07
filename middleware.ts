/**
 * Vercel Routing Middleware (runs on every non-static request before the
 * static file server / vercel.json rewrites resolve it). Two jobs, both
 * about being legible to agents/crawlers that don't execute JS:
 *
 * 1. Real HTTP 404s. The vercel.json SPA rewrite sends every unknown path to
 *    index.html with a 200 — correct for a human (the client router shows a
 *    proper "page not found" UI), wrong for a crawler, which reads 200 as
 *    "this resource exists." This intercepts unknown paths and returns a
 *    real 404 status while still serving the same app shell, so the visible
 *    behavior for a real visitor is unchanged (NotFound still renders once
 *    the client boots).
 *
 * 2. Markdown content negotiation. A request with `Accept: text/markdown`
 *    gets a Markdown rendering of the page's real content instead of the
 *    HTML shell — useful to an agent that wants the content without
 *    executing JS or parsing markup. HTML requests are unaffected.
 *
 * KNOWN_ROUTES/toMarkdown/notFoundMarkdown come from shared/route-meta.ts —
 * the same single source of truth the prerender step and the runtime
 * <title>/meta hook already read from, so this can't drift out of sync with
 * what the app actually serves.
 */
import { next } from "@vercel/functions";
import { KNOWN_ROUTES, toMarkdown, notFoundMarkdown } from "./shared/route-meta";

export const config = {
  // Same universe of paths as the vercel.json SPA rewrite: skip API routes,
  // built JS/CSS assets, and anything with a file extension (sitemap.xml,
  // robots.txt, llms.txt, images, favicon — all served as plain static files).
  matcher: ["/((?!api/|assets/|.*\\..*).*)"],
};

const KNOWN = new Set(KNOWN_ROUTES);

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) {
    return pathname.slice(0, -1);
  }
  return pathname;
}

export default async function middleware(request: Request) {
  const url = new URL(request.url);
  const path = normalizePath(url.pathname) || "/";
  const accept = request.headers.get("accept") || "";
  const wantsMarkdown = accept.toLowerCase().includes("text/markdown");
  const known = KNOWN.has(path);

  if (wantsMarkdown) {
    const body = known ? toMarkdown(path) : notFoundMarkdown(path);
    return new Response(body, {
      status: known ? 200 : 404,
      headers: {
        "content-type": "text/markdown; charset=utf-8",
        vary: "Accept",
      },
    });
  }

  if (!known) {
    // Serve the real app shell (so the client-side NotFound page still
    // renders exactly as before) but with the correct HTTP status.
    const shellRes = await fetch(new URL("/index.html", request.url));
    const body = await shellRes.text();
    return new Response(body, {
      status: 404,
      headers: {
        "content-type": "text/html; charset=utf-8",
        vary: "Accept",
      },
    });
  }

  // Known route, HTML requested: continue to normal static resolution, just
  // mark the response as Accept-dependent for correct CDN caching.
  return next({ headers: { vary: "Accept" } });
}
