import { useEffect } from "react";

/**
 * SPA route changes don't trigger the browser's native scroll-to-fragment
 * behavior. Call this on a page that owns hash targets (e.g. Home, for
 * "/#enterprise" links from other pages) to scroll to them on arrival.
 */
export function useScrollToHash() {
  useEffect(() => {
    if (!window.location.hash) return;
    const id = window.location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
    return () => clearTimeout(timer);
  }, []);
}
