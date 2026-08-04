import { useEffect } from "react";

/** Injects a JSON-LD <script> tag into <head> for the current page, removed on unmount/change. */
export function useJsonLd(id: string, data: object | null | undefined) {
  useEffect(() => {
    if (!data) return;
    const el = document.createElement("script");
    el.type = "application/ld+json";
    el.id = id;
    el.textContent = JSON.stringify(data);
    document.head.appendChild(el);
    return () => {
      el.remove();
    };
  }, [id, data]);
}
