import { QueryClient, QueryFunction } from "@tanstack/react-query";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

// Lead destination. Defaults to the BlackSync GoHighLevel Inbound Webhook so the
// forms work on any static host with no backend. Override per-environment with
// VITE_LEADS_WEBHOOK_URL (e.g. to point at Zapier/Make or a different CRM).
const DEFAULT_LEADS_WEBHOOK_URL =
  "https://services.leadconnectorhq.com/hooks/0LKIRgZlaDDW51j4Uzd5/webhook-trigger/p45rHqz5K4mSyoFZh2iY";

const LEADS_WEBHOOK_URL =
  (import.meta.env.VITE_LEADS_WEBHOOK_URL as string | undefined) ||
  DEFAULT_LEADS_WEBHOOK_URL;

const LEAD_ENDPOINTS = ["/api/leads", "/api/enterprise-leads"];

// Web3Forms public access key → emails every submission to admin@blacksync.network.
const WEB3FORMS_ACCESS_KEY = "7bd3edd1-dcf9-4041-9fff-14161cf49bbf";

// Normalize a lead payload so CRMs that expect first/last name + email + phone
// (like GoHighLevel "Create Contact") map cleanly regardless of which form sent it.
function normalizeLead(url: string, data: any) {
  const d = { ...(data ?? {}) };
  if (d.name && !d.firstName) {
    const parts = String(d.name).trim().split(/\s+/);
    d.firstName = parts[0];
    d.lastName = parts.slice(1).join(" ") || undefined;
  }
  d.fullName = d.name ?? [d.firstName, d.lastName].filter(Boolean).join(" ");
  d.source = "blacksync.ai";
  d.formType = url.includes("enterprise") ? "enterprise" : "lead";
  d.submittedAt = new Date().toISOString();
  return d;
}

export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  // Route lead submissions to email (Web3Forms → admin@blacksync.network) and,
  // if configured, the GHL CRM webhook. Static-host friendly (no backend).
  if (method.toUpperCase() === "POST" && LEAD_ENDPOINTS.includes(url)) {
    const lead = normalizeLead(url, data);

    // 1) GoHighLevel inbound webhook — fire-and-forget (opaque/no-cors).
    if (LEADS_WEBHOOK_URL) {
      fetch(LEADS_WEBHOOK_URL, {
        method: "POST",
        body: JSON.stringify(lead),
        mode: "no-cors",
        keepalive: true,
      }).catch(() => {});
    }

    // 2) Web3Forms — emails every submission to admin@blacksync.network.
    // FormData (multipart) is a "simple" request: no CORS preflight, most reliable.
    try {
      const fd = new FormData();
      fd.append("access_key", WEB3FORMS_ACCESS_KEY);
      fd.append("subject", `New ${lead.formType || "website"} lead — ${lead.fullName || lead.email}`);
      fd.append("from_name", "BlackSync Website");
      Object.entries(lead).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== "") fd.append(k, String(v));
      });
      await fetch("https://api.web3forms.com/submit", { method: "POST", body: fd });
    } catch {
      /* email send is best-effort; never block the user */
    }

    return new Response(null, { status: 200 });
  }

  const res = await fetch(url, {
    method,
    headers: data ? { "Content-Type": "application/json" } : {},
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const res = await fetch(queryKey.join("/") as string, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
