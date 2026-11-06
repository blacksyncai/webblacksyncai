// Pricing-page analytics, sent the same way as the site's other funnel events (window.dataLayer).
import type { PlanKey } from "@shared/pricing";

export type PricingEvent =
  | "pricing_page_view"
  | "pricing_plan_cta_click"
  | "pricing_signup_start"
  | "pricing_checkout_start"
  | "pricing_enterprise_contact_click"
  | "pricing_buy_credits_click";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function trackPricing(event: PricingEvent, props: { plan?: PlanKey; location?: string } = {}): void {
  try {
    if (typeof window === "undefined") return;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event, ...props });
  } catch {
    // analytics must never break the page
  }
}

/** One plan CTA click: the click itself plus what it starts (signup, checkout or a sales contact). */
export function trackPlanCta(plan: PlanKey, location: string): void {
  trackPricing("pricing_plan_cta_click", { plan, location });
  if (plan === "enterprise") trackPricing("pricing_enterprise_contact_click", { plan, location });
  else trackPricing("pricing_signup_start", { plan, location });
  // Paid plans go to checkout right after sign-up.
  if (plan === "solo" || plan === "growth") trackPricing("pricing_checkout_start", { plan, location });
}
