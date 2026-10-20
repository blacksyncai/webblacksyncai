"use client";

import * as React from "react";
import {
  Activity,
  ArrowRight,
  BarChart,
  PhoneCall,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, useAnimation, useInView } from "framer-motion";
import { Button } from "@/components/ui/button";

const labels = [
  { icon: Sparkles, label: "AI Prospecting" },
  { icon: PhoneCall, label: "Human-sounding Calls" },
  { icon: Activity, label: "Live Transfers" },
];

export function MynaHero({
  headlineWords,
  subline,
  note,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  onPrimaryClick,
  onSecondaryClick,
}: {
  headlineWords: string[];
  subline: string;
  note?: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}) {
  const controls = useAnimation();
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.1 });

  React.useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);

  return (
    <section className="container mx-auto px-4 bg-background" ref={ref}>
      <div className="flex flex-col items-center text-center pt-20 pb-16 md:pt-28 md:pb-20">
        <motion.h1
          initial={{ filter: "blur(10px)", opacity: 0, y: 50 }}
          animate={{ filter: "blur(0px)", opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative font-mono text-4xl font-bold sm:text-5xl md:text-6xl lg:text-7xl max-w-5xl mx-auto leading-tight text-foreground"
          data-testid="text-hero-headline"
        >
          {headlineWords.map((text, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.15,
                duration: 0.6,
              }}
              className="inline-block mx-2 md:mx-4"
            >
              {text}
            </motion.span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mx-auto mt-8 max-w-2xl text-lg md:text-xl text-muted-foreground font-mono"
        >
          {subline}
        </motion.p>

        {note && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5, duration: 0.6 }}
            className="mt-3 text-sm text-muted-foreground/80 font-mono"
          >
            {note}
          </motion.p>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.6 }}
          className="mt-12 flex flex-wrap justify-center gap-6"
        >
          {labels.map((feature, index) => (
            <motion.div
              key={feature.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 1.8 + index * 0.15,
                duration: 0.6,
                type: "spring",
                stiffness: 100,
                damping: 10,
              }}
              className="flex items-center gap-2 px-6"
            >
              <feature.icon className="h-5 w-5 text-primary" />
              <span className="text-sm font-mono">{feature.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            delay: 2.2,
            duration: 0.6,
            type: "spring",
            stiffness: 100,
            damping: 10,
          }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a href={primaryHref} onClick={onPrimaryClick}>
            <Button
              size="lg"
              className="cursor-pointer rounded-none font-mono"
              data-testid="button-hero-primary"
            >
              {primaryLabel} <ArrowRight className="ml-1 w-4 h-4" />
            </Button>
          </a>
          <a href={secondaryHref} onClick={onSecondaryClick}>
            <Button
              size="lg"
              variant="outline"
              className="cursor-pointer rounded-none font-mono"
              data-testid="button-hero-secondary"
            >
              {secondaryLabel}
            </Button>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
