import { useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Eyebrow } from "@/components/ui/section";
import { usePageMeta } from "@/hooks/use-page-meta";
import { APP_LOGIN_URL } from "@/lib/register";

export default function LoginPage() {
  usePageMeta({
    title: "Log In",
    description: "Log in to your BlackSync account to manage your AI sales agent.",
    path: "/login",
  });

  useEffect(() => {
    window.location.href = APP_LOGIN_URL;
  }, []);

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
            Taking you to your login page…
          </p>
          <a
            href={APP_LOGIN_URL}
            className="text-sm text-primary underline underline-offset-4"
            data-testid="link-login-redirect"
          >
            Click here if you're not redirected
          </a>
        </div>
      </div>
      <Footer />
    </div>
  );
}
