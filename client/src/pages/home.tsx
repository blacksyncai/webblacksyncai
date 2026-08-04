import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/hero-section";
import { DashboardMockupSection } from "@/components/dashboard-mockup-section";
import { TrustStrip } from "@/components/trust-strip";
import { ProductsSection } from "@/components/products-section";
import { PlatformBentoSection } from "@/components/platform-bento-section";
import { AIModelsSection } from "@/components/ai-models-section";
import { HowItWorksSection } from "@/components/how-it-works-section";
import ClippedVideoTab from "@/components/ui/clipped-video-tab";
import { SocialProofSection } from "@/components/social-proof-section";
import { WhySection } from "@/components/why-section";
import { PricingSection } from "@/components/pricing-section";
import { EnterpriseSection } from "@/components/enterprise-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/hooks/use-page-meta";
import { useScrollToHash } from "@/hooks/use-scroll-to-hash";

export default function Home() {
  usePageMeta({ path: "/" });
  useScrollToHash();

  return (
    <div className="min-h-screen bg-background" data-testid="page-home">
      <Navbar />
      <HeroSection />
      <DashboardMockupSection />
      <ClippedVideoTab />
      <TrustStrip />
      <ProductsSection />
      <PlatformBentoSection />
      <AIModelsSection />
      <HowItWorksSection />
      <SocialProofSection />
      <WhySection />
      <PricingSection />
      <EnterpriseSection />
      <FinalCtaSection />
      <Footer />
    </div>
  );
}
