/**
 * Verification for the "Is Agentic" readiness fixes (no test runner exists
 * in this repo — see the commit this shipped in for why). Two modes:
 *
 *   tsx scripts/verify-agentic.ts
 *     Static checks against the pure content-generation functions in
 *     shared/route-meta.ts. No network, safe to run in CI or locally.
 *
 *   tsx scripts/verify-agentic.ts --url https://www.blacksync.ai
 *     Live checks against a real deployment, using the exact request shapes
 *     the audit itself verifies with (Accept: text/markdown on a real path,
 *     Accept: text/markdown on a nonexistent path, Accept: text/html on the
 *     homepage). Only meaningful against a real Vercel deployment -- the
 *     Routing Middleware this exercises does not run under the local
 *     `serve-dist.cjs` static preview.
 */
import {
  KNOWN_ROUTES,
  INDEXABLE_ROUTES,
  ROUTE_META,
  pageH1,
  pageContent,
  toMarkdown,
  notFoundMarkdown,
} from "../shared/route-meta";

let failures = 0;

function check(label: string, pass: boolean, detail?: string) {
  const mark = pass ? "✓" : "✗";
  console.log(`${mark} ${label}${detail ? ` — ${detail}` : ""}`);
  if (!pass) failures++;
}

function runStaticChecks() {
  console.log("=== Static checks (shared/route-meta.ts) ===");

  const homeH1 = pageH1("/");
  const homeParagraphs = pageContent("/");
  const homeChars = (homeH1 + " " + homeParagraphs.join(" ")).length;
  check("homepage has a non-empty H1", homeH1.trim().length > 0, `"${homeH1}"`);
  check(
    "homepage content is at least 500 characters",
    homeChars >= 500,
    `${homeChars} chars`,
  );

  const homeMd = toMarkdown("/");
  check("homepage Markdown starts with a single H1", /^# [^\n]+\n/.test(homeMd));
  check(
    "homepage Markdown is non-empty and substantial",
    homeMd.trim().length >= 500,
    `${homeMd.trim().length} chars`,
  );

  const nfMd = notFoundMarkdown("/this-path-does-not-exist");
  check(
    "404 Markdown body is at least 20 characters",
    nfMd.trim().length >= 20,
    `${nfMd.trim().length} chars`,
  );
  check("404 Markdown points to the sitemap", nfMd.includes("sitemap.xml"));
  check("404 Markdown points to llms.txt", nfMd.includes("llms.txt"));

  // Every known route must produce valid H1 + Markdown + a 404 body is never
  // accidentally served for something that actually exists.
  let allRoutesOk = true;
  for (const path of KNOWN_ROUTES) {
    const h1 = pageH1(path);
    const content = pageContent(path);
    const md = toMarkdown(path);
    if (!h1.trim() || !content.length || !content.every((p) => p.trim()) || !md.includes(h1)) {
      allRoutesOk = false;
      console.log(`  ! problem with route ${path}`);
    }
  }
  check(`all ${KNOWN_ROUTES.length} known routes produce valid H1 + content + Markdown`, allRoutesOk);

  check(
    "INDEXABLE_ROUTES is a subset of KNOWN_ROUTES",
    INDEXABLE_ROUTES.every((p) => KNOWN_ROUTES.includes(p)),
  );
  check(
    "noindex routes (login/signup/dashboard/unsubscribe) are known but not indexable",
    ["/login", "/signup", "/dashboard", "/unsubscribe"].every(
      (p) => KNOWN_ROUTES.includes(p) && !INDEXABLE_ROUTES.includes(p),
    ),
  );
  check("ROUTE_META and KNOWN_ROUTES agree on size", Object.keys(ROUTE_META).length === KNOWN_ROUTES.length);
}

async function runLiveChecks(base: string) {
  console.log(`\n=== Live checks against ${base} ===`);
  const origin = base.replace(/\/$/, "");

  // --- Fix #1: homepage has real content without JS ---
  {
    const res = await fetch(`${origin}/`);
    const html = await res.text();
    const hasH1 = /<h1>/i.test(html);
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyHtml = (bodyMatch?.[1] ?? "").replace(/<script[\s\S]*?<\/script>/gi, "");
    const text = bodyHtml
      .replace(/<[^>]+>/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&nbsp;/g, " ")
      .replace(/\s+/g, " ")
      .trim();
    check("GET / returns 200", res.status === 200, `status ${res.status}`);
    check("GET / raw HTML contains an <h1>", hasH1);
    check("GET / raw HTML has 500+ chars of text content", text.length >= 500, `${text.length} chars`);
  }

  // --- Fix #2: unknown path is a real 404, with a Markdown body on request ---
  {
    const path = `/agentic-audit-nonexistent-${Date.now()}`;
    const res = await fetch(`${origin}${path}`, { headers: { Accept: "text/markdown" } });
    const body = await res.text();
    check("unknown path + Accept: text/markdown returns HTTP 404", res.status === 404, `status ${res.status}`);
    check(
      "unknown path Markdown response has Content-Type: text/markdown",
      (res.headers.get("content-type") || "").includes("text/markdown"),
      res.headers.get("content-type") || "(missing)",
    );
    check("unknown path Markdown body is at least 20 characters", body.trim().length >= 20, `${body.trim().length} chars`);

    const resHtml = await fetch(`${origin}${path}`);
    check("unknown path without a markdown Accept still returns HTTP 404", resHtml.status === 404, `status ${resHtml.status}`);
  }

  // --- Fix #4: Markdown content negotiation on the homepage ---
  {
    const mdRes = await fetch(`${origin}/`, { headers: { Accept: "text/markdown" } });
    const mdBody = await mdRes.text();
    check(
      "GET / with Accept: text/markdown returns Content-Type: text/markdown",
      (mdRes.headers.get("content-type") || "").includes("text/markdown"),
      mdRes.headers.get("content-type") || "(missing)",
    );
    check(
      "GET / with Accept: text/markdown sets Vary: Accept",
      (mdRes.headers.get("vary") || "").toLowerCase().includes("accept"),
      mdRes.headers.get("vary") || "(missing)",
    );
    check("GET / with Accept: text/markdown returns a non-empty body", mdBody.trim().length > 0);

    const htmlRes = await fetch(`${origin}/`, { headers: { Accept: "text/html" } });
    check(
      "GET / with Accept: text/html still returns Content-Type: text/html",
      (htmlRes.headers.get("content-type") || "").includes("text/html"),
      htmlRes.headers.get("content-type") || "(missing)",
    );
  }

  // --- Fix #5: llms.txt exists and has when-to-use guidance ---
  {
    const res = await fetch(`${origin}/llms.txt`);
    const body = await res.text();
    check("GET /llms.txt returns 200", res.status === 200, `status ${res.status}`);
    check("llms.txt has a 'When to use' section", /when to use/i.test(body));
  }
}

async function main() {
  runStaticChecks();

  const urlFlagIndex = process.argv.indexOf("--url");
  const base = urlFlagIndex !== -1 ? process.argv[urlFlagIndex + 1] : undefined;
  if (base) {
    await runLiveChecks(base);
  } else {
    console.log(
      "\n(skipping live checks — pass --url https://www.blacksync.ai to also verify a real deployment)",
    );
  }

  console.log(`\n${failures === 0 ? "All checks passed." : `${failures} check(s) FAILED.`}`);
  if (failures > 0) process.exit(1);
}

main();
