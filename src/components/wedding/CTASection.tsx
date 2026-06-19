import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";
import receptionImage from "@/assets/portfolio-reception.jpg";
import ceremonyImage from "@/assets/ceremony-setup.jpg";

const CTASection = () => {
  const ref = useRef<HTMLElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);
  const insetY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const ornamentScale = useTransform(scrollYProgress, [0.2, 0.6], [0, 1]);
  const watermarkOpacity = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const ribbonX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={ref}
      className="relative py-section-mobile md:py-section-tablet lg:py-section-desktop overflow-hidden grain-overlay vignette"
      aria-label="Get in touch"
      style={{ contain: "layout style" }}
    >
      {/* Cinematic parallax background */}
      <div className="absolute inset-0">
        <motion.img
          src={receptionImage}
          alt=""
          className="w-full h-[130%] object-cover"
          style={{ y }}
          loading="lazy"
          aria-hidden="true"
        />
        {/* Multi-layer gradient for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-foreground/40 via-foreground/60 to-foreground/85" />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/20 via-transparent to-foreground/15" />
        {/* Vignette overlay */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at center, transparent 30%, hsl(var(--foreground) / 0.3) 100%)"
          }}
        />
      </div>

      {/* Floating "Begin" watermark */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ opacity: watermarkOpacity }}
        aria-hidden="true"
      >
        <motion.span
          className="font-serif-wedding text-[10rem] text-white/[0.02] leading-none tracking-tight -rotate-90 inline-block origin-center"
          style={{ x: ribbonX }}
        >
          Begin
        </motion.span>
      </motion.div>

      {/* Decorative ampersand monogram */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden="true"
      >
        <span className="font-script text-[14rem] md:text-[20rem] text-white/[0.02] select-none leading-none">
          &
        </span>
      </motion.div>

      {/* Top decorative hairline */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-20 md:h-32 origin-top"
        style={{ 
          scaleY: ornamentScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.3), transparent)"
        }}
      />

      <div className="relative container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
          {/* Left: editorial inset image with hover effects */}
          <motion.div
            className="lg:col-span-4 hidden lg:block"
            style={{ y: insetY }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <ScrollReveal>
              <div className="aspect-[3/4] overflow-hidden relative group">
                <motion.img
                  src={ceremonyImage}
                  alt="Candlelit ceremony with mountain backdrop"
                  className="w-full h-full object-cover"
                  loading="lazy"
                  animate={{ scale: isHovered ? 1.05 : 1 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

                {/* Gold-traced border frame — animated on scroll */}
                <motion.div
                  className="absolute inset-3 pointer-events-none z-10"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, delay: 0.6 }}
                  aria-hidden="true"
                >
                  <motion.span className="absolute top-0 left-0 h-px origin-left" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }} initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.7 }} />
                  <motion.span className="absolute top-0 right-0 w-px origin-top" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), transparent)" }} initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1 }} />
                  <motion.span className="absolute bottom-0 right-0 h-px origin-right" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), transparent)" }} initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.3 }} />
                  <motion.span className="absolute bottom-0 left-0 w-px origin-bottom" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), transparent)" }} initial={{ height: 0 }} whileInView={{ height: "100%" }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 1.6 }} />
                </motion.div>
                
                {/* Hover reveal caption */}
                <AnimatePresence>
                  {isHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.3 }}
                      className="absolute bottom-4 left-4 right-4"
                    >
                      <p className="font-serif-wedding text-xs text-white/60 italic">
                        "A ceremony that felt like a dream"
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
                
                {/* Gold-gradient corner accents */}
                <div className="absolute top-3 right-3 w-8 h-8">
                  <div className="absolute top-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  <div className="absolute top-0 right-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
                </div>
                <div className="absolute bottom-3 left-3 w-8 h-8">
                  <div className="absolute bottom-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  <div className="absolute bottom-0 left-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
                </div>
              </div>
              
              {/* Image attribution removed — no fabricated venue / date claims */}
            </ScrollReveal>
          </motion.div>

          {/* Right: CTA content */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <ScrollReveal>
              {/* Section label with decorative elements */}
              <div className="flex items-center gap-4 justify-center lg:justify-start mb-8">
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-8 h-px bg-white/15 origin-right hidden lg:block"
                />
                <p className="font-sans-wedding text-label uppercase text-white/60 tracking-[0.25em]">
                  Let's Begin
                </p>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.1 }}
                  className="w-8 h-px bg-white/15 origin-left"
                />
              </div>

              {/* Main headline with staggered reveal */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="font-serif-wedding text-display-lg text-white mb-6 leading-[1.1]"
              >
                Ready to feel{" "}
                <span className="font-script text-[1.15em] text-white/80">calm</span>
                <br className="hidden md:block" />
                {" "}about your wedding day?
              </motion.h2>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="font-sans-wedding text-sm text-white/45 leading-relaxed mb-6 max-w-md font-light lg:mx-0 mx-auto"
              >
                Let's talk about your vision, your day, and how Hickory & Rose can
                make it effortlessly beautiful.
              </motion.p>

              {/* Trust signals with staggered entrance */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 mb-6"
              >
                {["Complimentary discovery call", "No obligation", "Responds within 48 hours"].map((signal, i) => (
                  <span
                    key={signal}
                    className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-white/60 flex items-center gap-2"
                  >
                    {i > 0 && <span className="w-1 h-1 rounded-full bg-white/10" />}
                    {signal}
                  </span>
                ))}
              </motion.div>

              {/* Pulsing availability indicator */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="flex items-center gap-2.5 justify-center lg:justify-start mb-10"
              >
                <motion.span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.8), hsl(var(--gold) / 0.2))" }}
                  animate={{ opacity: [0.5, 1, 0.5], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/60">
                  Currently accepting Spring & Summer 2026
                </span>
              </motion.div>

              {/* CTA Button with entrance shimmer */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="relative group/cta"
              >
                {/* Ambient gold glow behind CTA */}
                <motion.div
                  className="absolute -inset-6 pointer-events-none"
                  animate={{ opacity: [0.03, 0.08, 0.03], scale: [0.9, 1.1, 0.9] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.2), transparent 60%)" }}
                  aria-hidden="true"
                />
                <MagneticButton to="/inquire" variant="outline-light">
                  Begin Your Story
                </MagneticButton>
              </motion.div>

              {/* Bottom script attribution */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className="mt-16 flex items-center gap-4 justify-center lg:justify-start"
              >
                <span className="w-12 h-px bg-white/10" />
                <span className="font-script text-lg text-white/10">
                  Hickory & Rose
                </span>
              </motion.div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* Bottom decorative hairline */}
      <motion.div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-16 md:h-24 origin-bottom"
        style={{ 
          scaleY: ornamentScale,
          background: "linear-gradient(0deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.2), transparent)"
        }}
      />
    </section>
  );
};

export default CTASection;
