import { LegalPage } from "@/components/legal-page";

export default function SecurityPage() {
  return (
    <LegalPage
      title="Security"
      description="How BlackSync AI protects your data and your customers' data."
      path="/security"
      lastUpdated="August 4, 2026"
    >
      <p>
        Security is core to how we build BlackSync — your leads, calls, and customer data need
        to be handled carefully. Here's an overview of how we approach it.
      </p>

      <h2>Encryption</h2>
      <p>
        Data is encrypted in transit using TLS. Our infrastructure and service providers use
        encryption at rest for stored data.
      </p>

      <h2>Access Controls</h2>
      <p>
        Access to customer data is restricted to team members and systems that need it to
        operate the Service, following the principle of least privilege. Internal access is
        logged.
      </p>

      <h2>Data Isolation</h2>
      <p>
        Customer lead and conversation data is logically separated by account, so one customer's
        data isn't accessible from another's.
      </p>

      <h2>Vetted Subprocessors</h2>
      <p>
        We work with a small set of established infrastructure, CRM, telephony, and payment
        providers to run the Service, and we choose providers with strong security practices of
        their own.
      </p>

      <h2>Monitoring &amp; Incident Response</h2>
      <p>
        We monitor our systems for unusual activity and have a process for investigating and
        responding to security incidents, including notifying affected customers where required
        by law.
      </p>

      <h2>Compliance Posture</h2>
      <p>
        We build BlackSync with SOC 2, HIPAA, GDPR, and ISO 27001 principles in mind for
        customers who need to meet those standards. If you need specific compliance
        documentation for a security review, reach out and we'll work with you directly.
      </p>

      <h2>Report a Concern</h2>
      <p>
        If you believe you've found a security issue, please email{" "}
        <a href="mailto:hello@blacksync.ai">hello@blacksync.ai</a> — we take reports seriously
        and will respond promptly.
      </p>
    </LegalPage>
  );
}
