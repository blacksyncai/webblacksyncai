import { Shield, Globe, Lock, FileCheck } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "How it Works", href: "#how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Book a Demo", href: "/book-demo" },
    { label: "Integrations", href: "#integrations" },
    { label: "Changelog", href: "#" },
    { label: "API Docs", href: "#" },
  ],
  Solutions: [
    { label: "AI Lead Generation", href: "/ai-lead-generation" },
    { label: "AI Appointment Setter", href: "/ai-appointment-setter" },
    { label: "AI Lead Qualification", href: "/ai-lead-qualification-software" },
    { label: "Real Estate AI Caller", href: "/real-estate-ai-caller" },
    { label: "Expired Listing AI", href: "/expired-listing-ai" },
    { label: "FSBO AI", href: "/fsbo-ai" },
    { label: "Mortgage AI Caller", href: "/mortgage-ai-caller" },
    { label: "Insurance AI", href: "/insurance-ai" },
    { label: "Home Services AI", href: "/industry/home-services" },
    { label: "Funeral Home AI", href: "/industry/funeral-homes" },
  ],
  Company: [
    { label: "About", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "/careers" },
    { label: "Enterprise", href: "/enterprise" },
    { label: "Contact", href: "/contact" },
    { label: "Affiliates", href: "/affiliates" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Request a DPA", href: "/enterprise" },
  ],
};

const trustBadges = [
  { label: "SOC 2", icon: Shield },
  { label: "HIPAA Ready", icon: FileCheck },
  { label: "GDPR", icon: Globe },
  { label: "ISO 27001", icon: Lock },
];

export function Footer() {
  return (
    <footer data-testid="footer" className="border-t border-border/50 bg-card/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="flex items-center gap-2.5 mb-4" data-testid="link-footer-home">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center shadow-sm ring-1 ring-black/5">
                <span className="text-white font-display font-bold text-sm">B</span>
              </div>
              <span className="font-display font-bold text-base tracking-tight">BlackSync</span>
            </a>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3" data-testid="text-footer-tagline">
              AI outbound agents for sales teams.
            </p>
            <p className="text-xs text-muted-foreground" data-testid="text-footer-availability">
              Available in US, Australia, Canada, UAE
            </p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold mb-3">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      data-testid={`link-footer-${link.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground" data-testid="text-footer-copyright">
            &copy; 2026 BlackSync AI. All rights reserved.
          </p>
          <div className="flex items-center gap-4 flex-wrap" data-testid="footer-trust-badges">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-1.5 text-xs text-muted-foreground"
                data-testid={`badge-footer-${badge.label.toLowerCase().replace(/\s+/g, "-")}`}
              >
                <badge.icon className="w-3.5 h-3.5" />
                <span>{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
