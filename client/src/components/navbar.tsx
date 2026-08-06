import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";
import {
  Sun,
  Moon,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageSquare,
  Brain,
  BarChart,
  Calendar,
  Home,
  Shield,
  Landmark,
  Building2,
  HeartPulse,
  Car,
  BookOpen,
  Plug,
  HelpCircle,
  Globe,
  Megaphone,
  Bot,
  Zap,
  ArrowRightLeft,
  Tag,
  PhoneIncoming,
  Heart,
  Route,
  Users,
  Wrench,
  Stethoscope,
  ArrowRight,
  FileText,
  Clock,
  Search,
  Flower2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { StartTrialDialog } from "@/components/start-trial-dialog";
import { BookCallDialog } from "@/components/book-call-dialog";
import { APP_LOGIN_URL } from "@/lib/register";

type MegaColumn = {
  heading: string;
  items: { icon: React.ElementType; label: string; href: string }[];
};

const productColumns: MegaColumn[] = [
  {
    heading: "Capture Leads",
    items: [
      { icon: Globe, label: "Web Form Integration", href: "#how-it-works" },
      { icon: Plug, label: "CRM Lead Sync", href: "#how-it-works" },
      { icon: Megaphone, label: "Ad Lead Capture", href: "#how-it-works" },
      { icon: PhoneIncoming, label: "Inbound Call Handling", href: "#how-it-works" },
    ],
  },
  {
    heading: "Qualify & Call",
    items: [
      { icon: Bot, label: "AI Voice Agent", href: "#how-it-works" },
      { icon: Brain, label: "Lead Qualification", href: "#how-it-works" },
      { icon: MessageSquare, label: "Objection Handling", href: "#how-it-works" },
      { icon: Heart, label: "Emotion Detection", href: "#how-it-works" },
    ],
  },
  {
    heading: "Book & Close",
    items: [
      { icon: Calendar, label: "Calendar Booking", href: "#how-it-works" },
      { icon: Phone, label: "Appointment Reminders", href: "#how-it-works" },
      { icon: Zap, label: "Hot Lead Routing", href: "#how-it-works" },
      { icon: ArrowRightLeft, label: "SMS Follow-up", href: "#how-it-works" },
    ],
  },
  {
    heading: "Scale",
    items: [
      { icon: BarChart, label: "Analytics Dashboard", href: "#how-it-works" },
      { icon: Users, label: "Multi-Agent Setup", href: "#how-it-works" },
      { icon: Route, label: "CRM Integrations", href: "#how-it-works" },
      { icon: Tag, label: "White Label", href: "#how-it-works" },
    ],
  },
];

type IndustryDetail = {
  icon: React.ElementType;
  label: string;
  href: string;
  title: string;
  description: string;
  stat: string;
  link: string;
  linkLabel: string;
};

const industries: IndustryDetail[] = [
  {
    icon: Home,
    label: "Real Estate",
    href: "#industries",
    title: "Built for Real Estate Teams",
    description:
      "Connect Zillow, Facebook, and your CRM — Follow Up Boss, Sierra, kvCORE — and let your AI agent call every new lead within seconds. Qualify buyers and sellers, book showings, and never miss a hot lead again.",
    stat: "11 second average response time",
    link: "/industry/real-estate",
    linkLabel: "See Real Estate use case",
  },
  {
    icon: Landmark,
    label: "Mortgage & Lending",
    href: "#industries",
    title: "Built for Mortgage & Lending Teams",
    description:
      "Capture leads from LendingTree, Zillow Home Loans, and your own landing pages. Your AI agent pre-qualifies borrowers, collects income and credit details, and books them directly with your loan officers.",
    stat: "3x more pre-qualified appointments",
    link: "/industry/mortgage",
    linkLabel: "See Mortgage use case",
  },
  {
    icon: Building2,
    label: "Property Management",
    href: "#industries",
    title: "Built for Property Management",
    description:
      "Automate leasing inquiries, schedule property tours, and follow up with prospective tenants. Your AI agent handles high call volumes during peak season without adding headcount.",
    stat: "85% fewer missed leasing calls",
    link: "/industry/property-management",
    linkLabel: "See Property Management use case",
  },
  {
    icon: Shield,
    label: "Insurance",
    href: "#industries",
    title: "Built for Insurance Agencies",
    description:
      "Call internet leads within seconds, qualify coverage needs, and book policy review appointments. Your AI agent handles objections naturally and routes hot prospects to your licensed agents.",
    stat: "47% increase in quote requests",
    link: "/industry/insurance",
    linkLabel: "See Insurance use case",
  },
  {
    icon: Wrench,
    label: "Home Services",
    href: "#industries",
    title: "Built for Home Services",
    description:
      "Never miss a service call again. Your AI agent answers inquiries 24/7, qualifies job scope, provides estimates, and books appointments directly into your dispatch calendar.",
    stat: "62% more booked service calls",
    link: "/industry/home-services",
    linkLabel: "See Home Services use case",
  },
  {
    icon: Stethoscope,
    label: "Healthcare",
    href: "#industries",
    title: "Built for Healthcare Practices",
    description:
      "HIPAA-ready AI agents handle patient appointment scheduling, follow-ups, and recall campaigns. Reduce no-shows with automated reminders and confirmations across 40+ languages.",
    stat: "38% reduction in no-shows",
    link: "/industry/healthcare",
    linkLabel: "See Healthcare use case",
  },
  {
    icon: Car,
    label: "Auto & P&C",
    href: "#industries",
    title: "Built for Auto & P&C",
    description:
      "Respond to auto and property & casualty leads instantly. Your AI agent qualifies coverage needs, gathers vehicle or property details, and books consultations with your agents.",
    stat: "2x faster lead response time",
    link: "/industry/auto-pc",
    linkLabel: "See Auto & P&C use case",
  },
  {
    icon: Flower2,
    label: "Funeral Homes",
    href: "#industries",
    title: "Your Dedicated 24/7 Funeral Home Assistant",
    description:
      "Replace expensive answering services with an AI receptionist trained specifically for your funeral home's procedures, staff, and preferences. Schedules arrangements, performs warm transfers, and documents every call.",
    stat: "11 second average response time",
    link: "/industry/funeral-homes",
    linkLabel: "See Funeral Homes use case",
  },
];

const resourceItems = [
  { icon: BookOpen, label: "Blog", href: "#" },
  { icon: FileText, label: "Documentation / API Docs", href: "#" },
  { icon: Clock, label: "Changelog", href: "#" },
  { icon: BarChart, label: "Case Studies", href: "#" },
  { icon: HelpCircle, label: "Help Center", href: "#" },
];

const simpleLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "Why Us", href: "#why" },
];

type DropdownKey = "Product" | "Industries" | "Resources";
const dropdownKeys: DropdownKey[] = ["Product", "Industries", "Resources"];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (openMenu === "Industries") {
      setActiveIndustry(0);
    }
  }, [openMenu]);

  function handleMenuEnter(label: string) {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpenMenu(label);
  }

  function handleMenuLeave() {
    closeTimer.current = setTimeout(() => setOpenMenu(null), 200);
  }

  function handleDropdownEnter() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }

  function close() {
    setOpenMenu(null);
  }

  const currentIndustry = industries[activeIndustry];

  return (
    <nav
      ref={navRef}
      data-testid="navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || openMenu
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-[0_1px_0_0_hsl(var(--border))]"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-6 h-16">
          <a href="#" className="flex items-center gap-2.5 shrink-0 group" data-testid="link-home">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary via-orange-500 to-amber-500 flex items-center justify-center shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-display font-bold text-base">B</span>
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              Black<span className="text-accent-grad">Sync</span>
            </span>
          </a>

          <div className="hidden lg:flex items-center gap-0.5">
            {dropdownKeys.map((label) => (
              <div
                key={label}
                onMouseEnter={() => handleMenuEnter(label)}
                onMouseLeave={handleMenuLeave}
              >
                <button
                  className={`flex items-center gap-1 px-3 py-2 text-sm rounded-md transition-colors ${
                    openMenu === label ? "text-foreground" : "text-muted-foreground"
                  }`}
                  data-testid={`link-nav-${label.toLowerCase()}`}
                  onClick={() =>
                    setOpenMenu(openMenu === label ? null : label)
                  }
                >
                  {label}
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${
                      openMenu === label ? "rotate-180" : ""
                    }`}
                  />
                </button>
              </div>
            ))}

            {simpleLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                data-testid={`link-nav-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                className="px-3 py-2 text-sm text-muted-foreground rounded-md hover-elevate"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              data-testid="button-theme-toggle"
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>

            <a
              href={APP_LOGIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex"
            >
              <Button variant="ghost" size="sm" data-testid="button-login">
                Log in
              </Button>
            </a>

            <BookCallDialog>
              <Button variant="ghost" size="sm" className="hidden sm:inline-flex" data-testid="button-talk-sales">
                Book a Call
              </Button>
            </BookCallDialog>

            <StartTrialDialog>
              <Button size="sm" data-testid="button-get-started">
                Start Free
              </Button>
            </StartTrialDialog>

            <Button
              size="icon"
              variant="ghost"
              className="lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              data-testid="button-mobile-menu"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {openMenu && (
          <motion.div
            key={openMenu}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="hidden lg:block absolute top-full left-0 right-0 bg-card border-b border-border/60"
            onMouseEnter={handleDropdownEnter}
            onMouseLeave={handleMenuLeave}
            data-testid={`dropdown-${openMenu.toLowerCase()}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
              {openMenu === "Product" && (
                <div className="grid grid-cols-4 gap-8">
                  {productColumns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-xs font-semibold text-muted-foreground mb-3">
                        {col.heading}
                      </p>
                      <div className="space-y-0.5">
                        {col.items.map((item) => (
                          <a
                            key={item.label}
                            href={item.href}
                            onClick={close}
                            className="flex items-center gap-2.5 px-2 py-2 rounded-md text-sm hover-elevate transition-colors"
                            data-testid={`link-dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                          >
                            <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                            <span>{item.label}</span>
                          </a>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {openMenu === "Industries" && (
                <div className="flex gap-0 min-h-[280px]" data-testid="industries-sidebar-panel">
                  <div className="w-[220px] shrink-0 border-r border-border/50 pr-2">
                    <p className="text-xs font-semibold text-muted-foreground mb-3 px-2">
                      Industries
                    </p>
                    <div className="space-y-0.5">
                      {industries.map((industry, idx) => (
                        <button
                          key={industry.label}
                          onMouseEnter={() => setActiveIndustry(idx)}
                          onClick={() => {
                            setActiveIndustry(idx);
                          }}
                          className={`flex items-center gap-2.5 px-2 py-2 rounded-md text-sm w-full text-left transition-colors ${
                            activeIndustry === idx
                              ? "bg-accent text-accent-foreground"
                              : "text-muted-foreground hover-elevate"
                          }`}
                          data-testid={`link-industry-${industry.label.toLowerCase().replace(/\s+/g, "-")}`}
                        >
                          <industry.icon className="w-4 h-4 shrink-0" />
                          <span>{industry.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 pl-8">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeIndustry}
                        initial={{ opacity: 0, x: 8 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -8 }}
                        transition={{ duration: 0.15 }}
                        className="flex flex-col justify-center h-full"
                      >
                        <h3 className="text-lg font-semibold mb-2" data-testid="text-industry-title">
                          {currentIndustry.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 max-w-md" data-testid="text-industry-description">
                          {currentIndustry.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
                          <span className="text-sm font-medium" data-testid="text-industry-stat">
                            {currentIndustry.stat}
                          </span>
                        </div>
                        <a
                          href={currentIndustry.link}
                          onClick={close}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-primary transition-colors"
                          data-testid="link-industry-usecase"
                        >
                          {currentIndustry.linkLabel}
                          <ArrowRight className="w-3.5 h-3.5" />
                        </a>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              )}

              {openMenu === "Resources" && (
                <div className="max-w-xs">
                  <p className="text-xs font-semibold text-muted-foreground mb-3">
                    Resources
                  </p>
                  <div className="space-y-0.5">
                    {resourceItems.map((item) => (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={close}
                        className="flex items-center gap-2.5 px-2 py-2 rounded-md text-sm hover-elevate transition-colors"
                        data-testid={`link-dropdown-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                      >
                        <item.icon className="w-4 h-4 text-muted-foreground shrink-0" />
                        <span>{item.label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-card border-b border-border"
          >
            <div className="px-4 py-4 max-h-[80vh] overflow-y-auto">
              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Product
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {productColumns.map((col) => (
                    <div key={col.heading}>
                      <p className="text-[11px] text-muted-foreground px-2 mb-1.5">{col.heading}</p>
                      {col.items.map((item) => (
                        <a
                          key={item.label}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                          className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground rounded-md hover-elevate"
                        >
                          <item.icon className="w-3.5 h-3.5 shrink-0" />
                          <span>{item.label}</span>
                        </a>
                      ))}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-5">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Industries
                </p>
                <div className="space-y-0.5">
                  {industries.map((industry) => (
                    <a
                      key={industry.label}
                      href={industry.href}
                      onClick={() => setMobileOpen(false)}
                      data-testid={`link-mobile-${industry.label.toLowerCase().replace(/\s+/g, "-")}`}
                      className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground rounded-md hover-elevate"
                    >
                      <industry.icon className="w-3.5 h-3.5 shrink-0" />
                      <span>{industry.label}</span>
                    </a>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Resources
                </p>
                {resourceItems.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    data-testid={`link-mobile-${item.label.toLowerCase().replace(/\s+/g, "-")}`}
                    className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground rounded-md hover-elevate"
                  >
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </a>
                ))}
              </div>

              {simpleLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  data-testid={`link-mobile-${link.label.toLowerCase().replace(/\s/g, "-")}`}
                  className="block px-2 py-2 text-sm text-muted-foreground rounded-md hover-elevate"
                >
                  {link.label}
                </a>
              ))}

              <a
                href={APP_LOGIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileOpen(false)}
                className="block mt-4 px-2"
                data-testid="link-mobile-login"
              >
                <Button variant="ghost" className="w-full justify-start" size="sm">
                  Log in
                </Button>
              </a>
              <div className="flex gap-2 mt-2 px-2">
                <div className="flex-1">
                  <BookCallDialog onOpen={() => setMobileOpen(false)}>
                    <Button variant="outline" className="w-full" size="sm">
                      Book a Call
                    </Button>
                  </BookCallDialog>
                </div>
                <div className="flex-1">
                  <StartTrialDialog onOpen={() => setMobileOpen(false)}>
                    <Button className="w-full" size="sm">
                      Start Free
                    </Button>
                  </StartTrialDialog>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
