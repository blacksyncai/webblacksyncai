import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { SplineScene } from "@/components/ui/splite";
import { Home, Building2, Shield, Wrench, Heart, Car, KeyRound } from "lucide-react";
import { Link } from "wouter";
import { BookCallDialog } from "@/components/book-call-dialog";

// Where the real app's signup flow lives (a separate app from this
// marketing site -- see @/lib/register for the other app the rest of the
// site links into).
const SIGNUP_URL = "https://blacksync.si/sign-up";

const industryChips = [
  { label: "Real Estate", slug: "real-estate", icon: Home, top: "8%", left: "6%", delay: 0.5 },
  { label: "Mortgage & Lending", slug: "mortgage", icon: Building2, top: "20%", right: "4%", delay: 0.65 },
  { label: "Insurance", slug: "insurance", icon: Shield, top: "44%", left: "0%", delay: 0.8 },
  { label: "Home Services", slug: "home-services", icon: Wrench, top: "52%", right: "0%", delay: 0.95 },
  { label: "Healthcare", slug: "healthcare", icon: Heart, bottom: "18%", left: "10%", delay: 1.1 },
  { label: "Auto & P&C", slug: "auto-pc", icon: Car, bottom: "10%", right: "12%", delay: 1.25 },
  { label: "Property Mgmt", slug: "property-management", icon: KeyRound, top: "30%", left: "18%", delay: 1.4 },
];

export function HeroSection() {
  return (
    <section
      data-testid="section-hero"
      className="relative pt-28 pb-10 md:pt-36 md:pb-16 hero-gradient overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-60 dark:opacity-30" />

      {/* Floating 3D orbs — glossy spheres for depth */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          animate={{ y: [0, -22, 0], rotate: [0, 6, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-24 left-[6%] w-36 h-36 md:w-44 md:h-44 rounded-full opacity-90"
          style={{
            background: "radial-gradient(circle at 32% 28%, #ffe2cf 0%, #f08a4f 42%, #c5491f 74%, #8f300f 100%)",
            boxShadow:
              "0 40px 70px -20px rgba(170,65,25,0.45), inset -10px -14px 34px rgba(110,35,10,0.55), inset 8px 10px 26px rgba(255,225,205,0.75)",
          }}
        />
        <motion.div
          animate={{ y: [0, 18, 0], rotate: [0, -8, 0] }}
          transition={{ duration: 13, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[42%] right-[7%] w-24 h-24 md:w-28 md:h-28 rounded-full opacity-80"
          style={{
            background: "radial-gradient(circle at 34% 30%, #fff0d8 0%, #f4b56a 44%, #d98a35 76%, #a8631f 100%)",
            boxShadow:
              "0 34px 60px -18px rgba(180,110,40,0.4), inset -8px -12px 28px rgba(130,80,20,0.5), inset 7px 9px 22px rgba(255,240,215,0.8)",
          }}
        />
        <motion.div
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-16 left-[16%] w-16 h-16 md:w-20 md:h-20 rounded-full opacity-70"
          style={{
            background: "radial-gradient(circle at 32% 28%, #ffe7d6 0%, #ef8a52 46%, #b5421a 100%)",
            boxShadow:
              "0 24px 44px -14px rgba(170,65,25,0.4), inset -6px -9px 22px rgba(110,35,10,0.5), inset 5px 7px 16px rgba(255,225,205,0.7)",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {/* Centered headline + CTAs */}
        <div className="text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center"
          >
            <span className="eyebrow" data-testid="badge-hero-eyebrow">
              <span className="relative flex w-1.5 h-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
                <span className="relative inline-flex w-1.5 h-1.5 rounded-full bg-primary" />
              </span>
              Custom AI Voice Agents · 40+ Languages · GPT-5 · Claude · Gemini
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 font-display text-[2.75rem] leading-[1.02] sm:text-6xl md:text-7xl font-semibold tracking-[-0.03em] mb-5 text-balance"
            data-testid="text-hero-headline"
          >
            AI voice agents built around
            <br className="hidden sm:block" />{" "}
            <span className="text-accent-grad">your business.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-2 md:mb-3 leading-relaxed text-pretty"
            data-testid="text-hero-subheadline"
          >
            BlackSync builds custom AI voice agents around your workflows,
            tools, and data, so they operate like part of your team.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-lg md:text-xl font-semibold text-foreground max-w-2xl mx-auto mb-9 text-pretty"
            data-testid="text-hero-supporting"
          >
            Hundreds of personalized calls{" "}
            <span className="text-accent-grad">in minutes, not days.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center gap-4 mb-5"
          >
            <a href={SIGNUP_URL} className="w-full max-w-md">
              <Button size="lg" className="w-full h-12" data-testid="button-hero-cta">
                Get Started Now
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </a>

            <p className="text-xs text-muted-foreground" data-testid="text-hero-subtext">
              AI agent builder included · Phone number from $3.50/mo · No
              contracts · Cancel anytime
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.32, ease: [0.16, 1, 0.3, 1] }}
            className="mb-14 flex items-center justify-center gap-4 text-sm"
          >
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <span className="text-primary">★★★★★</span> 4.9 average
            </span>
            <span className="hidden sm:inline w-px h-4 bg-border" aria-hidden="true" />
            <BookCallDialog>
              <button
                type="button"
                className="text-muted-foreground hover:text-foreground font-medium transition-colors"
                data-testid="link-hero-demo"
              >
                or Book a free 15-min call <ArrowRight className="w-3 h-3 inline ml-0.5" />
              </button>
            </BookCallDialog>
          </motion.div>

        </div>

        {/* 3D Spline scene */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="relative w-full max-w-4xl mx-auto h-[360px] md:h-[480px] mb-4"
          data-testid="hero-spline"
        >
          <SplineScene
            scene="https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode"
            className="w-full h-full"
          />

          {/* Industry chips floating around the robot */}
          {industryChips.map((chip) => {
            const Icon = chip.icon;
            return (
              <motion.div
                key={chip.label}
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, delay: chip.delay, ease: "easeOut" }}
                style={{
                  top: chip.top,
                  bottom: chip.bottom,
                  left: chip.left,
                  right: chip.right,
                }}
                className="absolute z-20 pointer-events-none"
                data-testid={`chip-industry-${chip.label.toLowerCase().replace(/\s|&/g, "-")}`}
              >
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{
                    duration: 4 + chip.delay,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-auto group"
                >
                  <Link
                    href={`/industry/${chip.slug}`}
                    className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full bg-zinc-900 dark:bg-zinc-100 border border-zinc-900 dark:border-zinc-100 shadow-lg hover:shadow-xl hover:scale-105 hover:pr-4 transition-all duration-200 cursor-pointer"
                    data-testid={`link-industry-${chip.slug}`}
                  >
                    <div className="w-6 h-6 rounded-full bg-white/10 dark:bg-zinc-900/15 text-white dark:text-zinc-900 flex items-center justify-center">
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-semibold whitespace-nowrap text-white dark:text-zinc-900">
                      {chip.label}
                    </span>
                    <span className="text-[10px] text-white/60 dark:text-zinc-900/60 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                  </Link>
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
