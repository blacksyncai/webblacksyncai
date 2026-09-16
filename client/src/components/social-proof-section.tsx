import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { SectionHeading, Reveal } from "@/components/ui/section";
import followUpBossLogo from "@assets/logos/followupboss.png";
import sierraInteractiveLogo from "@assets/logos/sierra-interactive.png";
import kvcoreLogo from "@assets/logos/kvcore.png";
import boomtownLogo from "@assets/logos/boomtown.png";
import loftyLogo from "@assets/logos/lofty.png";
import realGeeksLogo from "@assets/logos/realgeeks.svg";
import cincLogo from "@assets/logos/cinc.svg";
import zillowLogo from "@assets/logos/zillow.svg";
import realtorLogo from "@assets/logos/realtorcom.svg";
import calendlyLogo from "@assets/logos/calendly.svg";
import hubspotLogo from "@assets/logos/hubspot.svg";
import salesforceLogo from "@assets/logos/salesforce.svg";
import zapierLogo from "@assets/logos/zapier.svg";

const stats = [
  { value: 3.2, suffix: "x", decimals: 1, label: "More appointments booked vs. human ISAs" },
  { value: 11, suffix: "s", decimals: 0, label: "Average response time to a new lead" },
  { value: 60, suffix: "s", decimals: 0, label: "From lead capture to first live call" },
];

const trustedBy = [
  { name: "Follow Up Boss", src: followUpBossLogo, height: "h-7 md:h-8" },
  { name: "Sierra Interactive", src: sierraInteractiveLogo, height: "h-10 md:h-12" },
  { name: "kvCORE", src: kvcoreLogo, height: "h-6 md:h-7" },
  { name: "BoomTown", src: boomtownLogo, height: "h-9 md:h-10" },
  { name: "Lofty", src: loftyLogo, height: "h-7 md:h-8" },
  { name: "Real Geeks", src: realGeeksLogo, height: "h-5 md:h-6" },
  { name: "CINC", src: cincLogo, height: "h-5 md:h-6" },
  { name: "Zillow", src: zillowLogo, height: "h-5 md:h-6" },
  { name: "realtor.com", src: realtorLogo, height: "h-5 md:h-6" },
  { name: "HubSpot", src: hubspotLogo, height: "h-5 md:h-6" },
  { name: "Salesforce", src: salesforceLogo, height: "h-5 md:h-6" },
  { name: "Calendly", src: calendlyLogo, height: "h-5 md:h-6" },
  { name: "Zapier", src: zapierLogo, height: "h-5 md:h-6" },
];

function AnimatedCounter({ value, suffix, decimals }: { value: number; suffix: string; decimals: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1600;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref}>
      {display.toFixed(decimals)}
      {suffix}
    </span>
  );
}

export function SocialProofSection() {
  return (
    <section
      id="social-proof"
      data-testid="section-social-proof"
      className="py-20 md:py-28 relative bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          className="mb-12 md:mb-16"
          eyebrow={<span data-testid="pill-results">Results</span>}
          title={
            <>
              Real teams. Real{" "}
              <span className="font-serif italic text-accent-grad">
                booked calendars.
              </span>
            </>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-14">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="rounded-2xl border bg-card p-7 text-center shadow-sm hover:shadow-md transition-shadow"
              data-testid={`stat-${i}`}
            >
              <div
                className="font-display text-5xl md:text-6xl font-semibold tracking-tight mb-3 text-accent-grad"
                data-testid={`stat-value-${i}`}
              >
                <AnimatedCounter value={s.value} suffix={s.suffix} decimals={s.decimals} />
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed text-pretty">{s.label}</p>
            </motion.div>
          ))}
        </div>

        <Reveal>
          <p className="text-center font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground mb-6">
            Plugs into the tools your team already runs on
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-8 md:gap-x-10 gap-y-6 opacity-70">
            {trustedBy.map((logo, i) => (
              <img
                key={logo.name}
                src={logo.src}
                alt={logo.name}
                loading="lazy"
                className={`${logo.height} w-auto object-contain grayscale dark:invert dark:brightness-0 dark:contrast-200`}
                data-testid={`logo-trusted-${i}`}
              />
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
