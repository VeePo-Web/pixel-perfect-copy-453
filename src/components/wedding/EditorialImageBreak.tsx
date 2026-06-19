import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import BreathingDiamond from "./BreathingDiamond";
import editorialImage from "@/assets/editorial-candlelight.jpg";

const EditorialImageBreak = () => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const textY = useTransform(scrollYProgress, [0.2, 0.5], [30, 0]);
  const textOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35, 0.65, 0.85],
    [0, 1, 1, 0]
  );
  const lineWidth = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const metadataOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const goldGlowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.12, 0]);
  const edgeGradientOpacity = useTransform(scrollYProgress, [0.1, 0.4, 0.7, 0.9], [0.3, 0.6, 0.6, 0.3]);

  return (
    <section
      ref={ref}
      className="w-full overflow-hidden relative"
      aria-label="Editorial wedding detail"
      style={{ contain: "layout style" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Top blending gradient */}
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />

      <div className="aspect-[21/9] md:aspect-[21/9] w-full overflow-hidden grain-overlay">
        <motion.img
          src={editorialImage}
          alt=""
          className="w-full h-[120%] object-cover transition-[filter] duration-700"
          style={{ y }}
          animate={{ 
            scale: isHovered ? 1.04 : 1,
            filter: isHovered ? "brightness(0.85) saturate(1.1)" : "brightness(1) saturate(1)"
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          loading="lazy"
          width={1920}
          height={823}
        />
        {/* Vignette overlay */}
        <div className="absolute inset-0 vignette pointer-events-none" />
        
        {/* Gold radial glow — scroll-linked, centered */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full pointer-events-none z-[3]"
          style={{
            opacity: goldGlowOpacity,
            background: "radial-gradient(ellipse, hsl(var(--gold) / 0.3), transparent 65%)",
          }}
          aria-hidden="true"
        />

        {/* Cinematic edge gradients — left & right gold-tinted bleed */}
        <motion.div
          className="absolute inset-y-0 left-0 w-1/4 pointer-events-none z-[4]"
          style={{
            opacity: edgeGradientOpacity,
            background: "linear-gradient(90deg, hsl(var(--foreground) / 0.4), transparent)",
          }}
          aria-hidden="true"
        />
        <motion.div
          className="absolute inset-y-0 right-0 w-1/4 pointer-events-none z-[4]"
          style={{
            opacity: edgeGradientOpacity,
            background: "linear-gradient(270deg, hsl(var(--foreground) / 0.4), transparent)",
          }}
          aria-hidden="true"
        />
        
        {/* Hover-activated cinematic letterbox bars */}
        <motion.div
          className="absolute top-0 left-0 right-0 bg-foreground/60 pointer-events-none z-[5]"
          animate={{ height: isHovered ? "8%" : "0%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute bottom-0 left-0 right-0 bg-foreground/60 pointer-events-none z-[5]"
          animate={{ height: isHovered ? "8%" : "0%" }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        />

        {/* Gold hairlines at letterbox edges */}
        <motion.div
          className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
          animate={{ top: isHovered ? "8%" : "0%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
        />
        <motion.div
          className="absolute left-0 right-0 h-px z-[6] pointer-events-none"
          animate={{ bottom: isHovered ? "8%" : "0%", opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
        />
      </div>

      {/* Bottom blending gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />

      {/* Breathing diamond at center bottom */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
        <BreathingDiamond size={8} />
      </div>

      {/* Corner frame accents — gold gradient */}
      <div className="absolute top-10 left-8 w-10 h-10 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.15), transparent)" }} />
        <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.15), transparent)" }} />
      </div>
      <div className="absolute top-10 right-8 w-10 h-10 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="absolute top-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.15), transparent)" }} />
        <span className="absolute top-0 right-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.15), transparent)" }} />
      </div>
      <div className="absolute bottom-10 left-8 w-10 h-10 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="absolute bottom-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.15), transparent)" }} />
        <span className="absolute bottom-0 left-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.15), transparent)" }} />
      </div>
      <div className="absolute bottom-10 right-8 w-10 h-10 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.15), transparent)" }} />
        <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.15), transparent)" }} />
      </div>

      {/* Floating editorial typography */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
        style={{ opacity: textOpacity }}
      >
        <motion.div className="text-center" style={{ y: textY }}>
          {/* Flanking lines with animated width */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              className="h-px origin-right"
              style={{
                scaleX: lineWidth,
                width: 40,
                background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5))",
              }}
            />
            <span className="font-script text-white/50 text-lg">&</span>
            <motion.div
              className="h-px origin-left"
              style={{
                scaleX: lineWidth,
                width: 40,
                background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), transparent)",
              }}
            />
          </div>
          <p className="font-serif-wedding text-xl md:text-3xl lg:text-4xl text-white italic leading-relaxed tracking-wide drop-shadow-[0_2px_12px_rgba(0,0,0,0.4)]">
            Every detail, placed with intention.
          </p>
          <motion.div
            className="w-16 h-px mx-auto mt-6 origin-center"
            style={{
              scaleX: lineWidth,
              background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.6), transparent)",
            }}
          />
          
          {/* Scroll-revealed metadata row */}
          <motion.div
            className="flex items-center justify-center gap-6 mt-5"
            style={{ opacity: metadataOpacity }}
          >
            <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60">
              Candlelight
            </span>
            <span
              className="w-1 h-1 rotate-45"
              style={{ background: "hsl(var(--gold) / 0.3)" }}
            />
            <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60">
              Brass & Linen
            </span>
            <span
              className="w-1 h-1 rotate-45"
              style={{ background: "hsl(var(--gold) / 0.3)" }}
            />
            <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60">
              Calligraphy
            </span>
          </motion.div>
          
          <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60 mt-4">
            Hickory & Rose · Refined Rustic Elegance
          </p>
        </motion.div>
      </motion.div>

      {/* Corner index marks */}
      <div className="absolute bottom-6 left-6 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="font-serif-wedding text-xs text-white/30 font-light">04</span>
      </div>
      <div className="absolute bottom-6 right-6 z-20 pointer-events-none hidden md:block" aria-hidden="true">
        <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/30">Editorial</span>
      </div>
    </section>
  );
};

export default EditorialImageBreak;
