import { Link } from "wouter";
import { LegalPage } from "@/components/legal-page";

export default function AboutPage() {
  return (
    <LegalPage
      title="About BlackSync"
      description="BlackSync AI builds custom AI voice agents for outbound sales, inbound calls, lead follow-up, and appointment booking. Here's who we are and how we work."
      path="/about"
    >
      <p>
        BlackSync AI is a company that builds custom AI voice agents — phone-based AI that
        prospects leads, answers inbound calls, follows up on old leads sitting in a CRM, and
        books appointments straight onto a calendar. Every agent is built around a specific
        business's workflows, scripts, and systems instead of being a generic bot dropped onto a
        phone line.
      </p>

      <h2>What We Build</h2>
      <p>
        Our product is AI voice agents that handle real phone conversations, both outbound and
        inbound, in 40+ languages, built on large language models including GPT-5, Claude, and
        Gemini. Agents prospect and qualify new leads, reactivate dormant leads, warm-transfer
        qualified calls to a live team member, answer inbound calls as a 24/7 front desk, and pull
        context from a business's CRM and systems mid-call. Every call is logged, every lead is
        qualified, and bookings sync to the customer's calendar and CRM. See{" "}
        <Link href="/why-blacksync">Why BlackSync</Link> for the full breakdown of how the
        platform works.
      </p>

      <h2>Who We Serve</h2>
      <p>
        BlackSync works with real estate teams and brokerages, mortgage and lending teams,
        insurance agencies, home services businesses, healthcare practices, property management
        companies, funeral homes, law firms, and education providers (charter, private, and trade
        schools, plus daycares and preschools) — any business with enough call volume that a
        dedicated, always-on AI agent earns its keep.
      </p>

      <h2>Where We Operate</h2>
      <p>
        BlackSync AI is available to customers in the United States, Australia, Canada, and the
        UAE.
      </p>

      <h2>Our Approach</h2>
      <p>
        We don't sell one generic agent for everyone. Every deployment starts with a customer's
        actual business — their offer, their objections, their CRM, and their process — and the
        agent is built around that. We build with security and compliance in mind from the start;
        see our <Link href="/security">Security</Link> and <Link href="/privacy">Privacy
        Policy</Link> pages for details.
      </p>

      <h2>Get in Touch</h2>
      <p>
        Want to talk to a person, explore a partnership, or see if BlackSync is a fit for your
        team? <Link href="/contact">Contact us</Link>, or see{" "}
        <Link href="/careers">open roles</Link> if you'd like to join.
      </p>
    </LegalPage>
  );
}
