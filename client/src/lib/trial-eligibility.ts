export const INDUSTRY_OPTIONS = [
  "Real Estate",
  "Insurance",
  "Mortgage & Lending",
  "Property Management",
  "Healthcare",
  "Home Services",
  "Auto & P&C",
  "Capture Missed Calls",
  "Other",
];

// Only these industries can self-serve setup. Everyone else gets routed to
// a call to discuss a pilot instead.
const TRIAL_ELIGIBLE_INDUSTRIES = new Set([
  "Home Services",
  "Auto & P&C",
  "Capture Missed Calls",
]);

export function isTrialEligible(industry: string): boolean {
  return TRIAL_ELIGIBLE_INDUSTRIES.has(industry);
}

export const TRIAL_INELIGIBLE_MESSAGE =
  "Sorry, we don't offer self-serve setup for your industry — book a call to discuss pilot opportunities.";
