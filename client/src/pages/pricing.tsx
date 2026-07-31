import { Navbar } from "@/components/navbar";
import { PricingSection } from "@/components/pricing-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function PricingPage() {
  usePageMeta({
    title: "Pricing",
    description:
      "Simple, transparent pricing for BlackSync's AI outbound sales agent. Plans for solo agents up to full brokerages and agencies.",
    path: "/pricing",
  });

  return (
    <div className="min-h-screen bg-background" data-testid="page-pricing">
      <Navbar />
      <div className="pt-16" />
      <PricingSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
