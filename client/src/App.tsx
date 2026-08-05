import { Switch, Route, Router as WouterRouter } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import PricingPage from "@/pages/pricing";
import SignupPage from "@/pages/signup";
import LoginPage from "@/pages/login";
import DashboardPage from "@/pages/dashboard";
import PrivacyPage from "@/pages/privacy";
import TermsPage from "@/pages/terms";
import SecurityPage from "@/pages/security";
import IndustryPage from "@/pages/industry";
import UseCasePage from "@/pages/use-case";
import CareersPage from "@/pages/careers";
import AffiliatesPage from "@/pages/affiliates";

// On GitHub Pages the app is served from a sub-path (e.g. /webblacksyncai/).
// Vite sets BASE_URL accordingly; locally and on the real domain it's "/".
const ROUTER_BASE = import.meta.env.BASE_URL.replace(/\/$/, "");

function Router() {
  return (
    <WouterRouter base={ROUTER_BASE}>
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/signup" component={SignupPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/security" component={SecurityPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/affiliates" component={AffiliatesPage} />
      <Route path="/industry/:slug" component={IndustryPage} />
      <Route path="/real-estate-ai-caller" component={() => <UseCasePage slug="real-estate-ai-caller" />} />
      <Route path="/expired-listing-ai" component={() => <UseCasePage slug="expired-listing-ai" />} />
      <Route path="/fsbo-ai" component={() => <UseCasePage slug="fsbo-ai" />} />
      <Route path="/mortgage-ai-caller" component={() => <UseCasePage slug="mortgage-ai-caller" />} />
      <Route path="/insurance-ai" component={() => <UseCasePage slug="insurance-ai" />} />
      <Route path="/ai-lead-generation" component={() => <UseCasePage slug="ai-lead-generation" />} />
      <Route path="/ai-appointment-setter" component={() => <UseCasePage slug="ai-appointment-setter" />} />
      <Route path="/ai-lead-qualification-software" component={() => <UseCasePage slug="ai-lead-qualification-software" />} />
      <Route component={NotFound} />
    </Switch>
    </WouterRouter>
  );
}

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
