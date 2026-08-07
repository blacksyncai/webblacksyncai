import { LegalPage } from "@/components/legal-page";

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      description="The terms that govern your use of BlackSync AI."
      path="/terms"
      lastUpdated="August 4, 2026"
    >
      <p>
        These Terms of Service ("Terms") govern your access to and use of blacksync.ai and the
        BlackSync AI outbound calling and texting platform (the "Service"), provided by
        BlackSync AI ("BlackSync," "we," "us," or "our"). By using the Service, you agree to
        these Terms. If you're using the Service on behalf of a company, you're agreeing on
        that company's behalf and confirming you have the authority to do so.
      </p>

      <h2>1. The Service</h2>
      <p>
        BlackSync provides an AI agent that calls, texts, and qualifies leads you upload or
        connect from your CRM or other lead sources, and books qualified appointments to your
        calendar. Features, plans, and availability may change as we improve the product.
      </p>

      <h2>2. Accounts</h2>
      <p>
        You're responsible for maintaining the security of your account credentials and for all
        activity under your account. Notify us right away if you suspect unauthorized use.
      </p>

      <h2>3. Your Responsibilities &amp; Acceptable Use</h2>
      <p>
        You're solely responsible for the leads, contacts, and phone numbers you upload or
        connect to BlackSync, and you represent and warrant that:
      </p>
      <ul>
        <li>You have all necessary rights, consents, and legal basis to have those contacts
        called and texted, and that doing so complies with the Telephone Consumer Protection
        Act (TCPA), CAN-SPAM, applicable Do-Not-Call rules, and all other laws that apply to
        your outreach</li>
        <li>You will not use the Service for illegal robocalling, harassment, spam, or any
        deceptive or fraudulent purpose</li>
        <li>You will honor opt-out and do-not-contact requests from your leads</li>
        <li>The information you provide about your business and use case is accurate</li>
      </ul>
      <p>
        We may suspend or terminate accounts that we reasonably believe violate this section or
        put BlackSync, our carriers, or other users at risk.
      </p>

      <h2>4. Fees, Billing &amp; Cancellation</h2>
      <p>
        Paid plans are billed on the cycle shown at signup. You can cancel at any time; there
        are no long-term contracts. Fees are non-refundable except where required by law or
        stated otherwise at the time of purchase. Free trials convert to a paid plan only if you
        choose to continue.
      </p>

      <h2>5. Intellectual Property</h2>
      <p>
        BlackSync and its licensors own the Service, including its software, design, and
        content. We grant you a limited, non-exclusive, non-transferable right to use the
        Service during your subscription. You retain ownership of the lead and contact data you
        upload.
      </p>

      <h2>6. Third-Party Services</h2>
      <p>
        The Service integrates with third-party tools you choose to connect (CRMs, calendars,
        payment processors, and similar platforms). Your use of those tools is governed by their
        own terms, and we aren't responsible for their availability or conduct.
      </p>

      <h2>7. AI-Generated Interactions</h2>
      <p>
        BlackSync's agents use AI to hold conversations, and while we build them to be accurate
        and natural, AI-generated calls and messages can occasionally make mistakes or
        misunderstand context. BlackSync is not a substitute for licensed professional advice
        (for example, legal, financial, insurance, or lending advice), and you're responsible
        for reviewing outputs relevant to regulated interactions in your industry.
      </p>

      <h2>8. Disclaimers</h2>
      <p>
        The Service is provided "as is" and "as available," without warranties of any kind,
        express or implied, including merchantability, fitness for a particular purpose, and
        non-infringement, to the fullest extent permitted by law.
      </p>

      <h2>9. Limitation of Liability</h2>
      <p>
        To the fullest extent permitted by law, BlackSync won't be liable for any indirect,
        incidental, special, consequential, or punitive damages, or for lost profits or
        revenue, arising from your use of the Service. Our total liability for any claim
        relating to the Service is limited to the amount you paid us in the 12 months before
        the claim arose.
      </p>

      <h2>10. Termination</h2>
      <p>
        You may stop using the Service and cancel your account at any time. We may suspend or
        terminate your access if you violate these Terms or if we reasonably believe continued
        access poses a risk to BlackSync or others.
      </p>

      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of the United States, without regard to conflict
        of law principles, unless a mandatory law in your jurisdiction requires otherwise.
      </p>

      <h2>12. Changes to These Terms</h2>
      <p>
        We may update these Terms from time to time. We'll update the "Last updated" date above,
        and for material changes, we'll provide more prominent notice. Continued use of the
        Service after changes take effect means you accept the updated Terms.
      </p>

      <h2>13. Contact Us</h2>
      <p>
        Questions about these Terms? Email us at{" "}
        <a href="mailto:sales@blacksync.ai">sales@blacksync.ai</a>.
      </p>
    </LegalPage>
  );
}
