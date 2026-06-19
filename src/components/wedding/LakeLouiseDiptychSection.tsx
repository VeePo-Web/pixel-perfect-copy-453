import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import winterAsset from "@/assets/lake-louise-winter.jpg.asset.json";
import summerAsset from "@/assets/lake-louise-summer.jpg.asset.json";

const LakeLouiseDiptychSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Opposite-direction parallax: winter drifts up, summer drifts down.
  const winterY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const summerY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);

  return (
    <section
      ref={ref}
      className="relative overflow-hidden bg-card"
      role="region"
      aria-label="Lake Louise — Two seasons, one valley"
      style={{ contain: "layout style" }}
    >
      {/* Cool-to-warm gradient band */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden="true"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 50%, hsl(var(--background)) 100%)",
        }}
      />

      {/* Watermark */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none z-0"
        style={{ y: watermarkY, willChange: "transform" }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[7rem] md:text-[14rem] font-light leading-none tracking-tight italic whitespace-nowrap"
          style={{ color: "hsl(var(--foreground) / 0.04)" }}
        >
          Louise
        </span>
      </motion.div>

      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-section-mobile md:py-section-tablet lg:py-section-desktop max-w-6xl">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-12 md:mb-16">
            <p className="font-sans-wedding text-label uppercase text-brand-text-tertiary mb-5">
              <span className="inline-flex items-center gap-3">
                <span className="w-5 h-px bg-primary/30" />
                Lake Louise · 51.4° N
                <span className="w-5 h-px bg-primary/30" />
              </span>
            </p>
            <h2 className="font-serif-wedding text-display-lg text-foreground leading-[1.05]">
              Two seasons.
              <br />
              <span className="italic text-brand-text-secondary">One quiet valley.</span>
            </h2>
            <div
              className="w-12 h-px mx-auto mt-7"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)",
              }}
            />
          </div>
        </ScrollReveal>

        {/* Diptych */}
        <div className="relative grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-0">
          {/* Vertical seam (desktop only) */}
          <div
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 pointer-events-none z-10"
            aria-hidden="true"
            style={{
              background:
                "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.45) 20%, hsl(var(--gold) / 0.45) 80%, transparent)",
            }}
          />

          <DiptychPanel
            src={winterAsset.url}
            alt="Lake Louise in winter"
            y={winterY}
            frameLabel="FR W·01"
            season="Winter"
            align="right"
          />
          <DiptychPanel
            src={summerAsset.url}
            alt="Lake Louise in summer"
            y={summerY}
            frameLabel="FR S·01"
            season="Summer"
            align="left"
          />
        </div>

        {/* Closing line */}
        <ScrollReveal delay={0.2}>
          <div className="text-center mt-12 md:mt-16">
            <div
              className="w-8 h-px mx-auto mb-5"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.45), transparent)",
              }}
            />
            <p className="font-serif-wedding text-lg md:text-xl text-muted-foreground italic font-light max-w-md mx-auto leading-relaxed">
              We plan in both. The valley does the rest.
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

type PanelProps = {
  src: string;
  alt: string;
  y: ReturnType<typeof useTransform<number, string>>;
  frameLabel: string;
  season: string;
  align: "left" | "right";
};

const DiptychPanel = ({ src, alt, y, frameLabel, season }: PanelProps) => (
  <div className="aspect-[3/4] md:aspect-[4/5] overflow-hidden relative group">
    {/* Cinematic letterbox bars */}
    <div className="absolute top-0 left-0 right-0 z-20 h-[5%] bg-foreground/90 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none" />
    <div className="absolute bottom-0 left-0 right-0 z-20 h-[5%] bg-foreground/90 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none" />

    {/* Gold shimmer sweep */}
    <div
      className="absolute inset-0 z-10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.08) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.08) 60%, transparent 100%)",
      }}
    />

    <motion.img
      src={src}
      alt={alt}
      className="w-full h-[110%] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
      style={{ y, willChange: "transform" }}
      loading="lazy"
      decoding="async"
    />

    {/* Hover overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* Gold corner reveals — all 4 corners */}
    {([
      ["top-3 left-3", "top-0 left-0", "90deg", "180deg"],
      ["top-3 right-3", "top-0 right-0", "270deg", "180deg"],
      ["bottom-3 left-3", "bottom-0 left-0", "90deg", "0deg"],
      ["bottom-3 right-3", "bottom-0 right-0", "270deg", "0deg"],
    ] as const).map(([pos, anchor, hDir, vDir], i) => (
      <div
        key={i}
        className={`absolute ${pos} w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
        aria-hidden="true"
      >
        <span
          className={`absolute ${anchor} w-full h-px`}
          style={{ background: `linear-gradient(${hDir}, hsl(var(--gold) / 0.45), transparent)` }}
        />
        <span
          className={`absolute ${anchor} h-full w-px`}
          style={{ background: `linear-gradient(${vDir}, hsl(var(--gold) / 0.45), transparent)` }}
        />
      </div>
    ))}

    {/* Frame index mark — top right */}
    <div className="absolute top-4 right-4 z-20 pointer-events-none">
      <span className="font-sans-wedding text-[0.5rem] tracking-[0.2em] uppercase text-white/55">
        {frameLabel}
      </span>
    </div>

    {/* Season badge — top left, always visible */}
    <div className="absolute top-4 left-4 z-20 pointer-events-none flex items-center gap-2">
      <span className="w-4 h-px bg-white/40" />
      <span className="font-sans-wedding text-[0.55rem] tracking-[0.3em] uppercase text-white/75">
        {season}
      </span>
    </div>

  </div>
);

export default LakeLouiseDiptychSection;
