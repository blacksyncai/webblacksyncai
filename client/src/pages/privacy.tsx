import { LegalPage } from "@/components/legal-page";

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="How BlackSync AI collects, uses, and protects your information."
      path="/privacy"
      lastUpdated="August 4, 2026"
    >
      <p>
        This Privacy Policy explains how BlackSync AI ("BlackSync," "we," "us," or "our")
        collects, uses, shares, and protects information when you visit blacksync.ai, use our
        AI outbound calling and texting platform, or otherwise interact with us. By using our
        website or services, you agree to the practices described here.
      </p>

      <h2>1. Information We Collect</h2>
      <p><strong>Information you provide to us</strong>, such as when you request a demo, start a
      free trial, book a call, or contact us:</p>
      <ul>
        <li>Name, email address, phone number, and company name</li>
        <li>Industry and details about how you plan to use BlackSync</li>
        <li>Any other information you choose to include in a form or message</li>
      </ul>
      <p><strong>Information collected automatically</strong> when you visit our site, such as
      pages viewed, browser and device type, and general usage patterns from standard server
      logs.</p>
      <p><strong>Information processed through the service</strong>, if you become a customer:
      lead and contact data you upload or connect via CRM/webhook, and the resulting call and
      SMS conversation data our AI agents generate on your behalf. We process this data as a
      service provider on your behalf — you remain responsible for the leads and contacts you
      upload, and for having the right to have them contacted (see our{" "}
      <a href="/terms">Terms of Service</a>).</p>

      <h2>2. How We Use Your Information</h2>
      <ul>
        <li>To operate, provide, and improve the BlackSync platform</li>
        <li>To respond to demo requests, trial signups, and support inquiries</li>
        <li>To send product updates, onboarding information, and — where you've agreed —
        marketing communications</li>
        <li>To detect, prevent, and address fraud, abuse, or security issues</li>
        <li>To comply with legal obligations</li>
      </ul>

      <h2>3. How We Share Information</h2>
      <p>We don't sell your personal information. We share it only with:</p>
      <ul>
        <li><strong>Service providers</strong> who help us run the business and product, such as
        our CRM, form/email delivery, payment processing (Square), and scheduling (Cal.com)
        providers, and the telephony/SMS infrastructure that powers AI calling and texting</li>
        <li><strong>Legal and safety reasons</strong>, if required by law or necessary to protect
        our rights, users, or the public</li>
        <li><strong>Business transfers</strong>, if BlackSync is involved in a merger,
        acquisition, or asset sale — with notice to you where required</li>
      </ul>

      <h2>4. Cookies &amp; Local Storage</h2>
      <p>
        blacksync.ai does not currently use third-party advertising or analytics cookies. We
        use your browser's local storage only to remember your light/dark theme preference —
        this stays on your device and is never sent to us. If that changes (for example, if we
        add analytics in the future), we'll update this section.
      </p>

      <h2>5. Data Retention</h2>
      <p>
        We keep personal information for as long as needed to provide our services and for
        legitimate business or legal purposes, then delete or anonymize it. Customers can
        request deletion of their account data at any time.
      </p>

      <h2>6. Your Privacy Rights</h2>
      <p>
        Depending on where you live, you may have rights to access, correct, delete, or export
        your personal information, and to opt out of marketing communications (every marketing
        email includes an unsubscribe link). California residents have rights under the CCPA;
        residents of the EU/EEA and UK have rights under the GDPR/UK GDPR. To exercise any of
        these rights, contact us at{" "}
        <a href="mailto:sales@blacksync.ai">sales@blacksync.ai</a>.
      </p>

      <h2>7. Data Security</h2>
      <p>
        We use industry-standard safeguards — including encryption in transit, access controls,
        and vetted service providers — to protect your information. See our{" "}
        <a href="/security">Security page</a> for more detail. No method of transmission or
        storage is 100% secure, and we can't guarantee absolute security.
      </p>

      <h2>8. Children's Privacy</h2>
      <p>
        BlackSync is a business-to-business product not directed at children, and we don't
        knowingly collect personal information from anyone under 16.
      </p>

      <h2>9. International Users</h2>
      <p>
        BlackSync is used by teams in the United States, Canada, Australia, and the UAE, among
        other regions. Your information may be processed in a country other than the one you
        live in, subject to appropriate safeguards.
      </p>

      <h2>10. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We'll update the "Last updated"
        date above, and for material changes, we'll provide more prominent notice.
      </p>

      <h2>11. Contact Us</h2>
      <p>
        Questions about this policy or your data? Email us at{" "}
        <a href="mailto:sales@blacksync.ai">sales@blacksync.ai</a>.
      </p>
    </LegalPage>
  );
}
