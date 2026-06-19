import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import pewsAsset from "@/assets/ceremony-pews.mov.asset.json";
import altarAsset from "@/assets/ceremony-altar.mov.asset.json";

/**
 * CeremonyInterludeSection
 * Full-bleed two-video diptych: stained-glass light + altar.
 * No caption text by design — visuals carry the beat.
 * Treatment: slow playback, warm grade, vignette, letterbox bars,
 * gold hairline divider, film-index mark CR · 01.
 */
const CeremonyInterludeSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const leftVideoRef = useRef<HTMLVideoElement>(null);
  const rightVideoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const dividerScale = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const leftY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"]);

  // Slow each video to 0.6× for cinematic register
  useEffect(() => {
    [leftVideoRef.current, rightVideoRef.current].forEach((v) => {
      if (v) v.playbackRate = 0.6;
    });
  }, []);

  const videoClass =
    "absolute inset-0 w-full h-full object-cover";
  // Warm, slightly desaturated cinematic grade
  const cinemaFilter =
    "saturate(0.78) contrast(1.05) brightness(0.92) sepia(0.08)";

  return (
    <section
      ref={sectionRef}
      aria-label="Ceremony"
      className="relative w-full bg-background overflow-hidden"
      style={{ contain: "layout style" }}
    >
      {/* Letterbox top */}
      <div className="absolute top-0 left-0 right-0 h-[4%] bg-foreground/95 z-30 pointer-events-none" />
      {/* Letterbox bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-[4%] bg-foreground/95 z-30 pointer-events-none" />

      {/* Film index mark */}
      <span
        className="absolute top-[5%] left-6 md:left-10 z-40 font-sans-wedding text-caption tracking-[0.25em] uppercase text-white/55 tabular-nums"
        aria-hidden="true"
      >
        CR · 01
      </span>
      <span
        className="absolute bottom-[5%] right-6 md:right-10 z-40 font-sans-wedding text-caption tracking-[0.25em] uppercase text-white/45"
        aria-hidden="true"
      >
        Ceremony
      </span>

      <div className="grid grid-cols-1 md:grid-cols-2 h-[68vh] md:h-[80vh] min-h-[480px]">
        {/* Left — pews / stained-glass light */}
        <motion.div
          className="relative overflow-hidden"
          style={{ y: prefersReducedMotion ? 0 : leftY }}
        >
          {prefersReducedMotion ? (
            <div
              className={videoClass}
              style={{
                backgroundImage: `url(${pewsAsset.url}#t=0.5)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: cinemaFilter,
              }}
            />
          ) : (
            <video
              ref={leftVideoRef}
              className={videoClass}
              style={{ filter: cinemaFilter }}
              src={pewsAsset.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}
          {/* Vignette */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, hsl(var(--foreground) / 0.45) 100%)",
            }}
            aria-hidden="true"
          />
          {/* Warm wash */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(135deg, hsl(var(--gold) / 0.18), transparent 60%)",
            }}
            aria-hidden="true"
          />
        </motion.div>

        {/* Right — altar */}
        <motion.div
          className="relative overflow-hidden"
          style={{ y: prefersReducedMotion ? 0 : rightY }}
        >
          {prefersReducedMotion ? (
            <div
              className={videoClass}
              style={{
                backgroundImage: `url(${altarAsset.url}#t=0.5)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: cinemaFilter,
              }}
            />
          ) : (
            <video
              ref={rightVideoRef}
              className={videoClass}
              style={{ filter: cinemaFilter }}
              src={altarAsset.url}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-hidden="true"
            />
          )}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(ellipse at center, transparent 35%, hsl(var(--foreground) / 0.45) 100%)",
            }}
            aria-hidden="true"
          />
          <div
            className="absolute inset-0 pointer-events-none mix-blend-soft-light"
            style={{
              background:
                "linear-gradient(225deg, hsl(var(--gold) / 0.18), transparent 60%)",
            }}
            aria-hidden="true"
          />
        </motion.div>
      </div>

      {/* Gold hairline center divider — desktop only */}
      <motion.div
        className="absolute left-1/2 top-[4%] bottom-[4%] w-px -translate-x-1/2 origin-top z-20 hidden md:block"
        style={{
          scaleY: dividerScale,
          background:
            "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.55) 30%, hsl(var(--gold) / 0.55) 70%, transparent)",
        }}
        aria-hidden="true"
      />
      {/* Breathing diamond at intersection */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex items-center justify-center"
        animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.1, 0.95] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        aria-hidden="true"
      >
        <span
          className="w-2.5 h-2.5 rotate-45 block"
          style={{
            background:
              "linear-gradient(135deg, hsl(var(--gold) / 0.85), hsl(var(--gold) / 0.35))",
          }}
        />
        <span
          className="absolute w-10 h-10 rounded-full"
          style={{
            background:
              "radial-gradient(circle, hsl(var(--gold) / 0.18), transparent 70%)",
          }}
        />
      </motion.div>
    </section>
  );
};

export default CeremonyInterludeSection;
