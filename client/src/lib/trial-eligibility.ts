export const INDUSTRY_OPTIONS = [
  "Real Estate",
  "Insurance",
  "Mortgage & Lending",
  "Property Management",
  "Healthcare",
  "Home Services",
  "Auto & P&C",
  "Looking for something to just pick up my missed calls",
  "Other",
];

// Only these industries can self-serve a free trial. Everyone else gets
// routed to a call to discuss a Free Pilot instead.
const TRIAL_ELIGIBLE_INDUSTRIES = new Set([
  "Home Services",
  "Auto & P&C",
  "Looking for something to just pick up my missed calls",
]);

export function isTrialEligible(industry: string): boolean {
  return TRIAL_ELIGIBLE_INDUSTRIES.has(industry);
}

export const TRIAL_INELIGIBLE_MESSAGE =
  "Sorry, we don't offer free trials for your industry — book a call to discuss Free Pilot Opportunities.";
