import { Link } from "wouter";
import { LegalPage } from "@/components/legal-page";

export default function DevelopersPage() {
  return (
    <LegalPage
      title="BlackSync Developer Resources"
      description="How to build with BlackSync AI: the BlackSync AI for ChatGPT integration, what's available to manage conversationally, and how to request API or webhook access for a custom integration."
      path="/developers"
    >
      <p>
        BlackSync AI exposes its agent platform — AI voice agents, campaigns, calls, contacts, and
        analytics — as resources an integration can read and act on. Today that happens two ways:
        through a conversational interface inside ChatGPT, and through custom API and webhook
        integrations we build directly with a customer's team.
      </p>

      <h2>BlackSync AI for ChatGPT</h2>
      <p>
        <Link href="/updates/chatgpt-integration">BlackSync AI for ChatGPT</Link> is our live
        integration for managing a BlackSync account conversationally: creating and editing voice
        agents, launching and monitoring campaigns, searching calls and reading transcripts,
        adding and segmenting contacts, and pulling analytics — all from a chat interface instead
        of a dashboard. It's the fastest way to see how BlackSync's underlying data model (agents,
        campaigns, calls, contacts, analytics) is organized, and it's free to try with
        complimentary signup credits.
      </p>

      <h2>Custom API &amp; Webhook Integrations</h2>
      <p>
        For teams that want to sync BlackSync data into their own CRM, data warehouse, or internal
        tools — call events, booked appointments, transcripts, lead status changes — we build
        direct API and webhook integrations as part of onboarding. We don't currently publish a
        self-serve public API reference; reach out through <Link href="/contact">Contact</Link> or{" "}
        <Link href="/enterprise">Enterprise</Link> and we'll scope what you need with you directly.
      </p>

      <h2>Machine-Readable Resources</h2>
      <p>
        This site publishes a <a href="/sitemap.xml">sitemap</a> and an{" "}
        <a href="/llms.txt">llms.txt</a> agent guide describing what BlackSync is, how to reach
        the team, and which pages are safe to cite.
      </p>

      <h2>Questions</h2>
      <p>
        If you're building something that needs deeper access than the ChatGPT integration
        provides, <Link href="/contact">get in touch</Link> — we're happy to talk through what's
        possible.
      </p>
    </LegalPage>
  );
}
