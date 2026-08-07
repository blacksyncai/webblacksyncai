import { useEffect } from "react";

const SITE_NAME = "BlackSync.ai";
const SITE_URL = "https://www.blacksync.ai";
const DEFAULT_TITLE = `${SITE_NAME} - Your AI Outbound Sales Colleague | Real Estate, Insurance, Mortgage`;
const DEFAULT_DESCRIPTION =
  "BlackSync is the AI ISA and SDR that calls your leads, books appointments, and fills your calendar. Built for real estate agents, insurance brokers, and mortgage lenders.";

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

/** Sets document title, meta description, canonical URL, and OG tags per page. */
export function usePageMeta({ title, description, path, noindex }: PageMetaOptions) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
    const desc = description ?? DEFAULT_DESCRIPTION;

    document.title = fullTitle;
    setMetaTag("name", "description", desc);
    setMetaTag("property", "og:title", fullTitle);
    setMetaTag("property", "og:description", desc);

    if (path) {
      setCanonical(path);
      setMetaTag("property", "og:url", `${SITE_URL}${path}`);
    }

    setMetaTag("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
  }, [title, description, path, noindex]);
}
