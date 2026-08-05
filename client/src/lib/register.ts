// The BlackSync app registration / free-access page. After we capture a lead
// on the marketing site (which fires the GHL webhook = inbound lead), we send
// the visitor here to finish getting access — prefilled where possible.
export const REGISTER_URL = "https://ai.blacksync.ai/register";

// Free 15-minute discovery call booking (Cal.com).
export const BOOK_CALL_URL = "https://cal.com/hamza-basal-v1hqkl/15min";

// The BlackSync app's login page.
export const APP_LOGIN_URL = "https://ai.blacksync.ai/login?from=%2F";

type LeadLike = {
  email?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
};

export function registerUrl(p: LeadLike = {}): string {
  const q = new URLSearchParams();
  if (p.email) q.set("email", p.email.trim());
  const first = p.firstName || (p.name ? p.name.trim().split(/\s+/)[0] : "");
  const last =
    p.lastName || (p.name ? p.name.trim().split(/\s+/).slice(1).join(" ") : "");
  if (first) q.set("first_name", first);
  if (last) q.set("last_name", last);
  if (p.company) q.set("company", p.company.trim());
  if (p.phone) q.set("phone", p.phone.trim());
  const s = q.toString();
  return s ? `${REGISTER_URL}?${s}` : REGISTER_URL;
}

/** Send the visitor to the register page (give the webhook a beat to flush). */
export function goToRegister(p: LeadLike = {}) {
  const url = registerUrl(p);
  setTimeout(() => {
    window.location.href = url;
  }, 350);
}
