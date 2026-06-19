import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface EditorialQuoteRibbonProps {
  quote: string;
  attribution?: string;
  direction?: "left" | "right";
}

/**
 * A cinematic horizontal-scrolling quote ribbon — the text slides
 * across the viewport as the user scrolls past. Inspired by editorial
 * magazine layouts and luxury brand sites (Celine, Aesop, etc.).
 */
const EditorialQuoteRibbon = ({
  quote,
  attribution,
  direction = "left",
}: EditorialQuoteRibbonProps) => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const x = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["10%", "-30%"] : ["-30%", "10%"]
  );

  // Ghost layer moves in opposite direction for depth
  const ghostX = useTransform(
    scrollYProgress,
    [0, 1],
    direction === "left" ? ["5%", "-15%"] : ["-15%", "5%"]
  );

  const borderScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const ornamentOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.7], [0, 0.06, 0]);
  const ornamentY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  // Gold glow pulse at center
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.06, 0]);

  return (
    <section
      ref={ref}
      className="py-10 md:py-14 bg-foreground overflow-hidden relative"
      aria-label="Editorial quote"
      style={{ contain: "layout style" }}
    >
      {/* Radial gold glow at center — scroll-linked */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[200px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(ellipse, hsl(var(--gold, 38 60% 55%) / 0.25) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Breathing gold ambient pulse */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[150px] rounded-full pointer-events-none"
        animate={{ opacity: [0, 0.04, 0], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        style={{ background: "radial-gradient(ellipse, hsl(var(--gold, 38 60% 55%) / 0.4), transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Film grain texture */}
      <div
        className="absolute inset-0 opacity-[0.008] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
        }}
        aria-hidden="true"
      />

      {/* Floating ornament with parallax */}
      <motion.div
        className="absolute right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ y: ornamentY, opacity: ornamentOpacity }}
        aria-hidden="true"
      >
        <span className="font-script text-6xl text-background leading-none">&</span>
      </motion.div>

      {/* Left floating diamond — breathing */}
      <motion.div
        className="absolute left-12 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ y: ornamentY }}
        aria-hidden="true"
      >
        <motion.span
          className="w-2 h-2 rotate-45 block"
          style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08))" }}
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.85, 1.15, 0.85] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>

      {/* Top and bottom ruled lines — scroll-linked */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{
          scaleX: borderScale,
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), hsl(var(--gold, 38 60% 55%) / 0.18), hsl(var(--primary) / 0.15), transparent)",
        }}
        aria-hidden="true"
      />
      {/* Top line gold glow trail */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left blur-[1px]"
        style={{
          scaleX: borderScale,
          background:
            "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.12), transparent)",
        }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px origin-right"
        style={{
          scaleX: borderScale,
          background:
            "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.18), hsl(var(--primary) / 0.15), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Ghost parallax layer — opposite direction, lower opacity */}
      <motion.div
        className="absolute inset-0 flex items-center whitespace-nowrap pointer-events-none select-none"
        style={{ x: ghostX }}
        aria-hidden="true"
      >
        <p className="font-serif-wedding text-3xl md:text-5xl lg:text-6xl text-background/[0.02] italic tracking-tight">
          {quote}
          <span className="mx-16 text-background/[0.015]">·</span>
          {quote}
        </p>
      </motion.div>

      {/* Main quote layer */}
      <motion.div className="whitespace-nowrap relative" style={{ x }}>
        <p className="font-serif-wedding text-3xl md:text-5xl lg:text-6xl text-background/10 italic tracking-tight inline-block">
          <span className="inline-block mx-4 w-1 h-1 rotate-45 bg-gold/20" aria-hidden="true" />
          {quote}
          {attribution && (
            <span className="font-script text-2xl md:text-4xl text-background/[0.06] ml-8">
              — {attribution}
            </span>
          )}
          <span className="inline-block mx-8 w-6 h-px bg-gold/10" aria-hidden="true" />
          <span className="inline-block mx-4 w-1 h-1 rotate-45 bg-gold/20" aria-hidden="true" />
          {quote}
          {attribution && (
            <span className="font-script text-2xl md:text-4xl text-background/[0.06] ml-8">
              — {attribution}
            </span>
          )}
        </p>
      </motion.div>
    </section>
  );
};

export default EditorialQuoteRibbon;
