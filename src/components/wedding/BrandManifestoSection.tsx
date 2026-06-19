import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import manifestoImage from "@/assets/manifesto-hero.jpg";

const manifestoLines = [
  { text: "We believe your wedding day", weight: "light" as const },
  { text: "should be felt —", weight: "script" as const },
  { text: "not merely managed.", weight: "light" as const },
];

const BrandManifestoSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);
  const contentOpacity = useTransform(scrollYProgress, [0.15, 0.35, 0.7, 0.9], [0, 1, 1, 0]);
  const contentY = useTransform(scrollYProgress, [0.15, 0.4], ["8%", "0%"]);
  const ornamentScale = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);
  const goldGlowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.08, 0]);

  return (
    <section
      ref={ref}
      className="relative h-[80vh] md:h-[90vh] overflow-hidden grain-overlay"
      aria-label="Brand manifesto"
    >
      {/* Parallax cinematic background */}
      <motion.div className="absolute inset-0" style={{ y: imgY }}>
        <img
          src={manifestoImage}
          alt=""
          className="w-full h-[130%] object-cover"
          loading="lazy"
          aria-hidden="true"
        />
        {/* Deep cinematic overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/70 via-foreground/55 to-foreground/80" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/25 via-transparent to-foreground/20" />
        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 20%, hsl(var(--foreground) / 0.4) 100%)",
          }}
        />
      </motion.div>

      {/* Central gold radial glow — scroll-linked */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] pointer-events-none"
        style={{
          opacity: goldGlowOpacity,
          background: "radial-gradient(ellipse at center, hsl(var(--gold) / 0.5), transparent 60%)",
        }}
        aria-hidden="true"
      />

      {/* Top decorative hairline — scroll-linked */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 md:h-36 origin-top"
        style={{
          scaleY: ornamentScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.35), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Large script ampersand watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.025 }}
        viewport={{ once: true }}
        transition={{ duration: 3 }}
        aria-hidden="true"
      >
        <span className="font-script text-[20rem] md:text-[30rem] text-white leading-none">
          &
        </span>
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Diamond ornament */}
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-10"
          aria-hidden="true"
        >
          <div
            className="w-3 h-3 rotate-45 mx-auto"
            style={{
              background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.2))",
              boxShadow: "0 0 20px 6px hsl(var(--gold) / 0.15)",
            }}
          />
        </motion.div>

        {/* Flanking lines + overline */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex items-center gap-4 mb-10"
        >
          <motion.span
            className="w-12 h-px origin-right"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3))" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
          <span className="font-sans-wedding text-caption tracking-[0.3em] uppercase text-white/60 font-light">
            Our Manifesto
          </span>
          <motion.span
            className="w-12 h-px origin-left"
            style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }}
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          />
        </motion.div>

        {/* Manifesto lines — staggered reveal */}
        <div className="max-w-3xl">
          {manifestoLines.map((line, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.7,
                delay: 0.5 + i * 0.2,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className={`leading-[1.3] mb-1 ${
                line.weight === "script"
                  ? "font-script text-4xl md:text-6xl lg:text-7xl text-white/70"
                  : "font-serif-wedding text-3xl md:text-5xl lg:text-6xl font-light text-white/80"
              }`}
            >
              {line.text}
            </motion.p>
          ))}
        </div>

        {/* Sub-manifesto */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="font-sans-wedding text-sm md:text-base text-white/60 font-light leading-relaxed max-w-md mt-10"
        >
          <span className="block font-serif-wedding italic text-white/75 text-base md:text-lg mb-3">
            We design for how it feels — not just how it looks.
          </span>
          Every detail, placed with intention. We handle the planning, logistics,
          and coordination behind the scenes — so you can focus on the moments
          that matter most.
        </motion.p>

        {/* Bottom gold rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 1.4 }}
          className="w-20 h-px mt-12 origin-center"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.4), transparent)",
          }}
        />

        {/* Script signature */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 1.6 }}
          className="font-script text-xl text-white/30 mt-6"
        >
          Hickory & Rose
        </motion.p>
      </motion.div>

      {/* Bottom decorative hairline */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-20 md:h-28 origin-bottom"
        style={{
          scaleY: ornamentScale,
          background: "linear-gradient(0deg, transparent, hsl(var(--gold) / 0.25), transparent)",
        }}
        aria-hidden="true"
      />

      {/* Corner index */}
      <motion.span
        className="absolute bottom-8 right-8 font-serif-wedding text-xs text-white/30 tracking-widest"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8 }}
      >
        H&R
      </motion.span>
    </section>
  );
};

export default BrandManifestoSection;