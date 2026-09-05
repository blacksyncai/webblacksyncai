import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/** Mono uppercase eyebrow pill used at the top of every section. */
export function Eyebrow({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className={cn("eyebrow", className)} {...props}>
      <span className="eyebrow-dot" />
      {children}
    </span>
  );
}

/** Fade-up reveal on scroll. Keeps motion consistent across the page. */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 16,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/** Centered section heading block: eyebrow + title + optional lead. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  className,
  align = "center",
  as: Title = "h2",
}: {
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  className?: string;
  align?: "center" | "left";
  /** Use "h1" when this heading is the page's primary heading. */
  as?: "h1" | "h2";
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" ? "mx-auto text-center" : "text-left",
        className,
      )}
    >
      {eyebrow && (
        <Reveal>
          <Eyebrow>{eyebrow}</Eyebrow>
        </Reveal>
      )}
      <Reveal delay={0.05}>
        <Title className="mt-5 font-display text-3xl sm:text-4xl md:text-[2.85rem] font-semibold tracking-tight leading-[1.08] text-balance">
          {title}
        </Title>
      </Reveal>
      {lead && (
        <Reveal delay={0.1}>
          <p className="mt-4 text-base md:text-lg text-muted-foreground leading-relaxed text-pretty">
            {lead}
          </p>
        </Reveal>
      )}
    </div>
  );
}
