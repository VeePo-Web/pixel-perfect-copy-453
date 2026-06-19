import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import detailImage from "@/assets/detail-placecard.jpg";
import vendorImage from "@/assets/vendor-detail.jpg";

const EditorialSplitSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const imageY = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const quoteLineH = useTransform(scrollYProgress, [0.2, 0.6], ["0%", "100%"]);
  const floatingTextY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const decorativeRotate = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const centerLineScale = useTransform(scrollYProgress, [0.1, 0.7], [0, 1]);
  const glowOpacity = useTransform(scrollYProgress, [0.3, 0.5, 0.7], [0, 0.08, 0]);

  return (
    <section
      ref={ref}
      className="grid grid-cols-1 lg:grid-cols-2 min-h-[70vh] overflow-hidden relative"
      aria-label="Editorial quote"
      style={{ contain: "layout style" }}
    >
      {/* Scroll-linked gold center divider — desktop only */}
      <motion.div
        className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 origin-top hidden lg:block z-10"
        style={{
          scaleY: centerLineScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.3) 40%, hsl(var(--gold, 38 60% 55%) / 0.3) 60%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Radial gold glow at center intersection */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full pointer-events-none hidden lg:block z-10"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(circle, hsl(var(--gold, 38 60% 55%)), transparent 70%)",
        }}
        aria-hidden="true"
      />
      {/* Quote side */}
      <div className="bg-sage-deep flex items-center justify-center py-section-mobile md:py-section-tablet px-8 lg:px-16 relative overflow-hidden">
        {/* Large decorative ampersand */}
        <motion.span
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 0.04, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.4 }}
          style={{ rotate: decorativeRotate }}
          className="absolute -right-12 -bottom-16 font-script text-[22rem] text-primary-foreground pointer-events-none select-none leading-none"
          aria-hidden="true"
        >
          &
        </motion.span>

        {/* Floating philosophy label - parallax */}
        <motion.div
          className="absolute top-8 right-8 pointer-events-none select-none hidden lg:block"
          style={{ y: floatingTextY }}
          aria-hidden="true"
        >
          <span className="font-sans-wedding text-caption tracking-[0.25em] uppercase text-primary-foreground/60 rotate-90 inline-block origin-top-right">
            Design Philosophy
          </span>
        </motion.div>

        {/* Scroll-linked vertical accent line with gold tip */}
        <motion.div
          className="absolute left-8 top-0 w-px bg-gradient-to-b from-transparent via-primary-foreground/15 to-transparent origin-top"
          style={{ height: quoteLineH }}
        />
        <motion.div
          className="absolute left-[31px] top-0 w-[3px] origin-top"
          style={{
            height: quoteLineH,
            background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.05), transparent)",
            scaleY: centerLineScale,
          }}
        />

        {/* Corner accents with gold gradient borders */}
        <div className="absolute top-6 left-6 w-10 h-10" aria-hidden="true">
          <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), transparent)" }} />
          <div className="absolute top-0 left-0 w-px h-full" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent)" }} />
        </div>
        <div className="absolute bottom-6 right-6 w-10 h-10" aria-hidden="true">
          <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.2), transparent)" }} />
          <div className="absolute bottom-0 right-0 w-px h-full" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.2), transparent)" }} />
        </div>

        <ScrollReveal>
          <div className="max-w-md relative">
            {/* Index marker */}
            <span className="font-serif-wedding text-sm text-primary-foreground/60 block mb-6">
              03
            </span>

            {/* Decorative ornament */}
            <div className="flex items-center gap-3 mb-8">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-8 h-px bg-primary-foreground/20 origin-left"
              />
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))" }} />
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-8 h-px bg-primary-foreground/20 origin-left"
              />
            </div>

            <blockquote className="font-serif-wedding text-display-md text-primary-foreground leading-relaxed mb-8">
              The best weddings don't feel produced — they feel{" "}
              <em className="text-primary-foreground/90">inevitable</em>. As if every detail was always meant to be
              exactly this way.
            </blockquote>

            {/* Secondary quote - subtle */}
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="font-sans-wedding text-body-sm text-primary-foreground/30 leading-relaxed mb-8 font-light max-w-sm"
            >
              We obsess over the details so you don't have to. Every choice, every placement, every moment — curated with intention.
            </motion.p>

            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="w-6 h-px bg-primary-foreground/15 origin-left"
              />
              <span className="font-script text-xl text-primary-foreground/35">
                Hickory & Rose
              </span>
            </div>

            {/* Philosophy note */}
            <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-primary-foreground/60 mt-12">
              Our Design Philosophy · Edmonton, Alberta
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Image side with parallax */}
      <div 
        className="overflow-hidden relative min-h-[50vh] lg:min-h-0 group"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <motion.img
          src={detailImage}
          alt=""
          className="absolute inset-0 w-full h-[120%] object-cover"
          style={{ y: imageY }}
          animate={{ scale: isHovered ? 1.03 : 1 }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          loading="lazy"
        />
        
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Gold-traced border frame — inset 16px, animated on scroll */}
        <motion.div
          className="absolute inset-4 pointer-events-none z-10 hidden lg:block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.4 }}
          aria-hidden="true"
        >
          {/* Top */}
          <motion.span
            className="absolute top-0 left-0 h-px origin-left"
            style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08), transparent)" }}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          {/* Right */}
          <motion.span
            className="absolute top-0 right-0 w-px origin-top"
            style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08), transparent)" }}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.8 }}
          />
          {/* Bottom */}
          <motion.span
            className="absolute bottom-0 right-0 h-px origin-right"
            style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08), transparent)" }}
            initial={{ width: 0 }}
            whileInView={{ width: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.1 }}
          />
          {/* Left */}
          <motion.span
            className="absolute bottom-0 left-0 w-px origin-bottom"
            style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08), transparent)" }}
            initial={{ height: 0 }}
            whileInView={{ height: "100%" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 1.4 }}
          />
        </motion.div>
        
        {/* Corner accent frames on hover — gold gradient */}
        <div className="absolute top-4 left-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
          <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
          <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
        </div>
        <div className="absolute bottom-4 right-4 w-10 h-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
          <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
          <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
        </div>

        {/* Breathing diamond ornament at text/image junction — centered on divider line */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center justify-center"
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <span className="w-3 h-3 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15))" }} />
          <span className="absolute w-8 h-8 rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.12), transparent 70%)" }} />
        </motion.div>
        
        {/* Floating inset detail image - reveals on hover */}
        <AnimatePresence>
          {isHovered && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95, x: 20 }}
                transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                className="absolute bottom-8 left-8 w-32 h-40 overflow-hidden hidden lg:block shadow-2xl"
              >
                {/* Letterbox bars */}
                <div className="absolute top-0 left-0 right-0 h-[6%] bg-black/60 z-10" />
                <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-black/60 z-10" />
                <img
                  src={vendorImage}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 border border-white/20" />
                {/* Gold accent line */}
                <div
                  className="absolute bottom-[6%] left-0 right-0 h-px z-20"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25), transparent)" }}
                />
              </motion.div>
          )}
        </AnimatePresence>
        
        {/* Image caption */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="absolute bottom-6 right-6"
        >
          <p className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-white/60 group-hover:text-white/70 transition-colors duration-500">
            Detail · Calligraphy & Gold
          </p>
        </motion.div>
        
        {/* Frame number */}
        <span className="absolute top-4 right-4 font-sans-wedding text-caption tracking-[0.2em] text-white/0 group-hover:text-white/60 transition-colors duration-500 tabular-nums">
          FR03
        </span>
      </div>
    </section>
  );
};

export default EditorialSplitSection;
