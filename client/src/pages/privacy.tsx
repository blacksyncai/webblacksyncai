import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function PrivacyPage() {
  usePageMeta({
    title: "Privacy Policy",
    description: "BlackSync.ai privacy policy.",
    path: "/privacy",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-privacy">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold tracking-tight mb-3">Privacy Policy</h1>
          <p className="text-muted-foreground">Coming soon.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
