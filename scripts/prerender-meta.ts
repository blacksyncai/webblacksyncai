/**
 * Build-time prerender of per-route SEO metadata.
 *
 * The app is a client-rendered SPA: the server hands every URL the same
 * index.html shell, so a crawler that doesn't execute JavaScript sees the
 * homepage title and description on every single page. Google renders JS and
 * eventually gets the right values, but only on a deferred second pass -- and
 * most other crawlers (ChatGPT/OAI-SearchBot, Perplexity, social preview bots)
 * never run JS at all.
 *
 * This step writes one static HTML file per route with the correct <title>,
 * meta description, canonical, and OG tags already baked in. Values come from
 * the same shared ROUTE_META table the runtime hook reads, so the static HTML
 * and the rendered app can never disagree.
 *
 * The page body is still rendered client-side; this fixes the metadata layer
 * only. Vercel serves these files directly (its `rewrites` are evaluated after
 * the filesystem), with the SPA rewrite still catching unknown routes.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import {
  ROUTE_META,
  INDEXABLE_ROUTES,
  SITE_URL,
  DEFAULT_DESCRIPTION,
  fullTitle,
} from "../shared/route-meta";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const outDir = join(root, "dist", "public");
const shellPath = join(outDir, "index.html");

function escapeAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function escapeText(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Replace an existing tag if present, otherwise insert before </head>. */
function upsert(html: string, matcher: RegExp, tag: string): string {
  if (matcher.test(html)) return html.replace(matcher, tag);
  return html.replace(/<\/head>/i, `    ${tag}\n  </head>`);
}

function renderRoute(shell: string, path: string): string {
  const meta = ROUTE_META[path] ?? {};
  const title = fullTitle(meta.title);
  const description = meta.description ?? DEFAULT_DESCRIPTION;
  const url = `${SITE_URL}${path}`;
  const robots = meta.noindex ? "noindex, nofollow" : "index, follow";

  let html = shell;
  html = upsert(html, /<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`);
  html = upsert(
    html,
    /<meta\s+name="description"[^>]*>/i,
    `<meta name="description" content="${escapeAttr(description)}" />`,
  );
  html = upsert(
    html,
    /<meta\s+name="robots"[^>]*>/i,
    `<meta name="robots" content="${robots}" />`,
  );
  html = upsert(
    html,
    /<link\s+rel="canonical"[^>]*>/i,
    `<link rel="canonical" href="${escapeAttr(url)}" />`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:title"[^>]*>/i,
    `<meta property="og:title" content="${escapeAttr(title)}" />`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:description"[^>]*>/i,
    `<meta property="og:description" content="${escapeAttr(description)}" />`,
  );
  html = upsert(
    html,
    /<meta\s+property="og:url"[^>]*>/i,
    `<meta property="og:url" content="${escapeAttr(url)}" />`,
  );
  return html;
}

function main() {
  if (!existsSync(shellPath)) {
    throw new Error(`prerender: ${shellPath} not found — run the client build first.`);
  }
  const shell = readFileSync(shellPath, "utf8");

  // Guard: the prerendered set and the sitemap must describe the same site.
  const sitemapPath = join(outDir, "sitemap.xml");
  if (existsSync(sitemapPath)) {
    const sitemap = readFileSync(sitemapPath, "utf8");
    const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)]
      .map((m) => m[1].replace(SITE_URL, ""))
      .map((p) => (p === "" ? "/" : p));
    const indexable = new Set(INDEXABLE_ROUTES);
    const missingFromMeta = urls.filter((u) => !indexable.has(u));
    const missingFromSitemap = INDEXABLE_ROUTES.filter((r) => !urls.includes(r));
    if (missingFromMeta.length || missingFromSitemap.length) {
      throw new Error(
        "prerender: sitemap.xml and ROUTE_META disagree.\n" +
          (missingFromMeta.length ? `  in sitemap, missing from ROUTE_META: ${missingFromMeta.join(", ")}\n` : "") +
          (missingFromSitemap.length ? `  indexable in ROUTE_META, missing from sitemap: ${missingFromSitemap.join(", ")}\n` : "") +
          "  Add the page to both, or mark it noindex in shared/route-meta.ts.",
      );
    }
  }

  let written = 0;
  for (const path of Object.keys(ROUTE_META)) {
    const html = renderRoute(shell, path);
    const target =
      path === "/" ? shellPath : join(outDir, path.replace(/^\//, ""), "index.html");
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, html, "utf8");
    written++;
  }

  console.log(`prerendered metadata for ${written} routes`);
}

main();
