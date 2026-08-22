import { useEffect } from "react";
import {
  DEFAULT_DESCRIPTION,
  ROUTE_META,
  SITE_URL,
  fullTitle,
} from "@shared/route-meta";

type PageMetaOptions = {
  title?: string;
  description?: string;
  path?: string;
  noindex?: boolean;
};

function setMetaTag(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setCanonical(path: string) {
  let el = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", `${SITE_URL}${path}`);
}

/**
 * Sets document title, meta description, canonical URL, and OG tags per page.
 *
 * Values come from the shared ROUTE_META table keyed by `path`, so the tags the
 * app injects at runtime always match the ones baked into the static HTML at
 * build time. Explicit props still win, for pages that need to override.
 */
export function usePageMeta({ title, description, path, noindex }: PageMetaOptions) {
  useEffect(() => {
    const fromTable = path ? ROUTE_META[path] : undefined;
    const resolvedTitle = title ?? fromTable?.title;
    const resolvedNoindex = noindex ?? fromTable?.noindex ?? false;

    const finalTitle = fullTitle(resolvedTitle);
    const desc = description ?? fromTable?.description ?? DEFAULT_DESCRIPTION;

    document.title = finalTitle;
    setMetaTag("name", "description", desc);
    setMetaTag("property", "og:title", finalTitle);
    setMetaTag("property", "og:description", desc);

    if (path) {
      setCanonical(path);
      setMetaTag("property", "og:url", `${SITE_URL}${path}`);
    }

    setMetaTag("name", "robots", resolvedNoindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, path, noindex]);
}
