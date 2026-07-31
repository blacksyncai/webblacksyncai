import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow } from "@/components/ui/section";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function LoginPage() {
  usePageMeta({
    title: "Log In",
    description: "Log in to your BlackSync account to manage your AI sales agent.",
    path: "/login",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-login">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 hero-gradient">
        <div className="text-center max-w-md mx-auto px-4 py-24">
          <Eyebrow>Welcome back</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight mb-3">
            Log in to BlackSync
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Pick up where your AI agent left off.
          </p>
          <p className="text-sm text-muted-foreground">Login page coming soon.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
