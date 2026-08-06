import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { EnterpriseSection } from "@/components/enterprise-section";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function EnterprisePage() {
  usePageMeta({
    title: "Enterprise",
    description:
      "BlackSync for brokerages, agencies, and teams that need unlimited capacity, white-glove onboarding, and enterprise-grade infrastructure.",
    path: "/enterprise",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-enterprise">
      <Navbar />
      <div className="flex-1 pt-16">
        <EnterpriseSection />
      </div>
      <Footer />
    </div>
  );
}
