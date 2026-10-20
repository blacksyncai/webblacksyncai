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
      className="relative mx-auto w-full px-6 md:px-8 pt-32 pb-20 text-center overflow-hidden
      bg-[linear-gradient(to_bottom,#26262a,#26262a_45%,#1c1c1f)]
      rounded-b-xl border-b border-white/5"
    >
      {/* Grid BG */}
      <div
        className="absolute -z-10 inset-0 opacity-60 h-[480px] w-full
        bg-[linear-gradient(to_right,#34343a_1px,transparent_1px),linear-gradient(to_bottom,#34343a_1px,transparent_1px)]
        bg-[size:6rem_5rem]
        [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_60%,transparent_100%)]"
      />

      {/* Soft top glow */}
      <div
        className="absolute -z-10 left-1/2 -translate-x-1/2 top-0
        h-64 w-[900px] rounded-[100%]
        bg-[radial-gradient(closest-side,rgba(255,255,255,0.05),transparent)]"
      />

      {/* Eyebrow */}
      {eyebrow && (
        <div className="flex justify-center mb-6">
          <span
            className="text-xs text-gray-300 uppercase tracking-widest
            px-4 py-1.5
            bg-white/[0.04]
            border border-white/10
            rounded-full w-fit flex items-center justify-center"
          >
            {eyebrow}
            <ChevronRight className="inline w-3.5 h-3.5 ml-1.5 text-gray-500" />
          </span>
        </div>
      )}

      {/* Title */}
      <h1
        className="animate-fade-in text-balance mx-auto max-w-4xl
        bg-gradient-to-br from-white from-40% to-white/55
        bg-clip-text py-4 text-4xl sm:text-5xl md:text-6xl font-semibold leading-[1.08] tracking-tight
        text-transparent opacity-0"
        data-testid="text-hero-headline"
      >
        {title}
      </h1>

      {/* Subtitle */}
      <p
        className="animate-fade-in mt-4 text-balance mx-auto max-w-2xl
        text-base md:text-lg tracking-tight text-gray-400
        opacity-0"
        data-testid="text-hero-subheadline"
      >
        {subtitle}
      </p>

      {note && (
        <p className="animate-fade-in mt-2 text-sm tracking-tight text-gray-500 opacity-0">
          {note}
        </p>
      )}

      {/* CTA */}
      <div className="animate-fade-in mt-8 flex flex-col sm:flex-row justify-center gap-3 opacity-0">
        {ctaLabel && (
          <Button
            asChild
            className="w-fit mx-auto sm:mx-0 sm:w-48 z-20 tracking-tight text-center text-base"
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
            className="w-fit mx-auto sm:mx-0 sm:w-48 z-20 tracking-tight text-center text-base border-white/15 bg-transparent text-gray-300 hover:bg-white/5 hover:text-white"
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
