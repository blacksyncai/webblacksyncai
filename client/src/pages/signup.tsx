import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow } from "@/components/ui/section";
import { usePageMeta } from "@/hooks/use-page-meta";

export default function SignupPage() {
  usePageMeta({
    title: "Sign Up",
    description: "Create your BlackSync account and get your AI sales agent calling leads in minutes.",
    path: "/signup",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col" data-testid="page-signup">
      <Navbar />
      <div className="flex-1 flex items-center justify-center pt-16 hero-gradient">
        <div className="text-center max-w-md mx-auto px-4 py-24">
          <Eyebrow>Get started</Eyebrow>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight mb-3">
            Create your account
          </h1>
          <p className="text-muted-foreground mb-6 text-lg">
            Pick a plan and get your AI agent calling in minutes.
          </p>
          <p className="text-sm text-muted-foreground">Sign up page coming soon.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
