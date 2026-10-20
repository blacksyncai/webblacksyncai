"use client";

import { ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroProps {
  eyebrow?: string;
  title: string;
  subtitle: string;
  note?: string;
  ctaLabel?: string;
  ctaHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
  onCtaClick?: () => void;
  onSecondaryClick?: () => void;
}

export function Hero({
  eyebrow,
  title,
  subtitle,
  note,
  ctaLabel,
  ctaHref,
  secondaryLabel,
  secondaryHref,
  onCtaClick,
  onSecondaryClick,
}: HeroProps) {
  return (
    <section
      id="hero"
      data-testid="section-hero"
      className="relative mx-auto w-full pt-40 px-6 text-center md:px-8 pb-24 overflow-hidden
      bg-[linear-gradient(to_bottom,#2a2a2c,#2a2a2c_50%,#1f1f21_88%)]
      rounded-b-xl"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-80 h-[600px] w-full
        bg-[linear-gradient(to_right,#3a3a3d_1px,transparent_1px),linear-gradient(to_bottom,#3a3a3d_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]"
      />

      {/* Radial Accent */}
      <div
        className="absolute left-1/2 top-[calc(100%-90px)] lg:top-[calc(100%-150px)]
        h-[500px] w-[700px] md:h-[500px] md:w-[1100px] lg:h-[750px] lg:w-[140%]
        -translate-x-1/2 rounded-[100%] border-white/10 bg-[#26262a]
        bg-[radial-gradient(closest-side,#26262a_82%,#141416)]
        animate-hero-fade-up"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <a href="#" className="group">
          <span
            className="text-sm text-gray-300 mx-auto px-5 py-2
            bg-gradient-to-tr from-white/5 via-white/5 to-transparent
            border-[2px] border-white/10
            rounded-3xl w-fit tracking-tight uppercase flex items-center justify-center"
          >
            {eyebrow}
            <ChevronRight className="inline w-4 h-4 ml-2 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </a>
      )}

      {/* Title */}
      <h1
        className="animate-fade-in -translate-y-4 text-balance
        bg-gradient-to-br from-white from-30% to-white/40
        bg-clip-text py-6 text-5xl font-semibold leading-none tracking-tighter
        text-transparent opacity-0 sm:text-6xl md:text-7xl lg:text-8xl"
        data-testid="text-hero-headline"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mb-6 -translate-y-4 text-balance
        text-lg tracking-tight text-gray-400
        opacity-0 md:text-xl max-w-2xl mx-auto"
        data-testid="text-hero-subheadline"
      >
        {subtitle}
      </p>

      {note && (
        <p className="animate-fade-in mb-12 -translate-y-4 text-balance text-sm tracking-tight text-gray-500 opacity-0">
          {note}
        </p>
      )}

      {/* CTA */}
      <div className="flex flex-col sm:flex-row justify-center gap-3">
        {ctaLabel && (
          <Button
            asChild
            className="animate-fade-in w-fit md:w-52 z-20 tracking-tighter text-center text-lg opacity-0"
          >
            <a href={ctaHref} onClick={onCtaClick} data-testid="button-hero-primary">
              {ctaLabel}
            </a>
          </Button>
        )}
        {secondaryLabel && (
          <Button
            asChild
            variant="outline"
            className="animate-fade-in w-fit md:w-52 z-20 tracking-tighter text-center text-lg opacity-0 border-white/20 bg-transparent text-gray-200 hover:bg-white/10 hover:text-white"
          >
            <a href={secondaryHref} onClick={onSecondaryClick} data-testid="button-hero-secondary">
              {secondaryLabel}
            </a>
          </Button>
        )}
      </div>
    </section>
  );
}
