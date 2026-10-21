/**
 * GET /api/markdown?path=/some-page
 *
 * Serves the Markdown representation of a known page (or a 404 Markdown
 * error body for an unknown one) for agents/crawlers that send
 * `Accept: text/markdown`. Reached via a conditional rewrite in
 * vercel.json keyed on that header -- see shared/route-meta.ts for the
 * single source of truth `toMarkdown`/`notFoundMarkdown` read from, the
 * same table the prerendered static HTML and the runtime meta hook use.
 *
 * Deliberately a plain Vercel Serverless Function, not Routing
 * Middleware: this project's two prior attempts at real 404s via
 * Routing Middleware both caused MIDDLEWARE_INVOCATION_FAILED outages
 * site-wide, while /api/* Serverless Functions (signup, helcim,
 * subscriptions) are already proven working in this exact production
 * deployment.
 */
import { KNOWN_ROUTES, toMarkdown, notFoundMarkdown } from "../shared/route-meta.js";

type Req = {
  query?: Record<string, string | string[] | undefined>;
};
type Res = {
  status(code: number): Res;
  setHeader(name: string, value: string): void;
  end(body: string): void;
};

const KNOWN = new Set(KNOWN_ROUTES);

function normalizePath(pathname: string): string {
  if (pathname.length > 1 && pathname.endsWith("/")) return pathname.slice(0, -1);
  return pathname || "/";
}

export default function handler(req: Req, res: Res) {
  try {
    const rawPath = req.query?.path;
    const pathParam = Array.isArray(rawPath) ? rawPath[0] : rawPath;
    const path = normalizePath(pathParam ?? "/");

    res.setHeader("Vary", "Accept");
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");

    if (KNOWN.has(path)) {
      res.status(200).end(toMarkdown(path));
    } else {
      res.status(404).end(notFoundMarkdown(path));
    }
  } catch (err) {
    console.error("api/markdown: unhandled error", err);
    res.setHeader("Content-Type", "text/markdown; charset=utf-8");
    res.status(500).end("# Something went wrong\n\nPlease try again.\n");
  }
}
