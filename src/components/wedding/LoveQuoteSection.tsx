import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";

const LoveQuoteSection = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const decorScale = useTransform(scrollYProgress, [0, 0.5], [0.85, 1]);
  const decorOpacity = useTransform(scrollYProgress, [0, 0.4], [0, 0.04]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const secondaryQuoteOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 0.2]);
  const cornerRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const floatingOrnamentY = useTransform(scrollYProgress, [0, 1], [15, -15]);
  // Radial glow intensity based on scroll position
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.08, 0]);

  return (
    <section
      ref={ref}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-sage-deep relative overflow-hidden"
      aria-label="Brand manifesto"
    >
      {/* Subtle film grain texture overlay */}
      <div
        className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
        }}
        aria-hidden="true"
      />

      {/* Radial glow behind quote — scroll-linked */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[900px] md:h-[900px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(circle, hsl(var(--gold, 38 60% 55%) / 0.3) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Background ampersand with scroll-linked motion */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ scale: decorScale, opacity: decorOpacity, rotate: cornerRotate }}
      >
        <span className="font-script text-[22rem] md:text-[32rem] text-primary-foreground select-none leading-none" aria-hidden="true">
          &
        </span>
      </motion.div>

      {/* Floating corner ornaments — gold gradient */}
      <motion.div
        className="absolute top-12 left-12 hidden lg:block pointer-events-none"
        style={{ y: floatingOrnamentY }}
        aria-hidden="true"
      >
        <div className="w-12 h-12 relative">
          <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.15), transparent)" }} />
          <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.15), transparent)" }} />
        </div>
      </motion.div>
      <motion.div
        className="absolute bottom-12 right-12 hidden lg:block pointer-events-none"
        style={{ y: floatingOrnamentY }}
        aria-hidden="true"
      >
        <div className="w-12 h-12 relative">
          <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.15), transparent)" }} />
          <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.15), transparent)" }} />
        </div>
      </motion.div>

      {/* Scroll-linked secondary quote layer */}
      <motion.div
        className="absolute bottom-16 right-12 md:right-20 pointer-events-none select-none hidden lg:block"
        style={{ y: watermarkY, opacity: secondaryQuoteOpacity }}
        aria-hidden="true"
      >
        <p className="font-serif-wedding text-lg italic text-primary-foreground/50 max-w-[200px] text-right leading-relaxed">
          Every detail in service of the moment.
        </p>
        <motion.div
          className="w-8 h-px bg-primary-foreground/15 mt-3 ml-auto"
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
        />
      </motion.div>

      {/* Floating seasonal indicator — left side */}
      <motion.div
        className="absolute top-1/2 left-8 -translate-y-1/2 pointer-events-none select-none hidden xl:block"
        style={{ y: floatingOrnamentY }}
        aria-hidden="true"
      >
        <div className="flex flex-col items-center gap-3 -rotate-90 origin-center">
          <span className="w-8 h-px bg-primary-foreground/8" />
          <span className="font-sans-wedding text-[0.45rem] tracking-[0.25em] uppercase text-primary-foreground/10">
            Edmonton · Alberta
          </span>
          <span className="w-8 h-px bg-primary-foreground/8" />
        </div>
      </motion.div>

      {/* Section index watermark */}
      <motion.div
        className="absolute top-8 left-8 md:left-16 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-7xl md:text-9xl font-light text-primary-foreground/[0.03]">
          05
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center relative">
        <ScrollReveal>
          {/* Refined overline with flanking lines */}
          <div className="flex items-center justify-center gap-5 mb-12">
            <motion.span
              className="w-12 h-px hidden md:block origin-right"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary-foreground) / 0.2))" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            />
            <p className="font-overline text-primary-foreground/45 tracking-[0.25em]">
              Our Promise
            </p>
            <motion.span
              className="w-12 h-px hidden md:block origin-left"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary-foreground) / 0.2), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            />
          </div>

          {/* Pull-quote ornament */}
          <div className="flex items-center justify-center gap-4 mb-10">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-10 h-px bg-primary-foreground/20 origin-right"
            />
            <span className="w-2 h-2 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15))" }} />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-10 h-px bg-primary-foreground/20 origin-left"
            />
          </div>

          {/* Main quote with gold-gradient editorial quotation marks */}
          <blockquote className="font-serif-wedding text-display-md md:text-display-lg text-primary-foreground leading-relaxed mb-12 relative">
            <motion.span
              className="absolute -top-8 -left-4 md:-left-8 text-[6rem] md:text-[8rem] font-light leading-none select-none pointer-events-none"
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              aria-hidden="true"
            >
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--primary-foreground) / 0.08))" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                "
              </motion.span>
            </motion.span>
            We believe your wedding day should be <em className="text-primary-foreground/95">felt</em>, not managed. That the
            details should serve the moment — never compete with it. That calm
            is not the absence of planning, but the <em className="text-primary-foreground/95">presence</em> of it.
            <motion.span
              className="absolute -bottom-10 -right-4 md:-right-8 text-[6rem] md:text-[8rem] font-light leading-none select-none pointer-events-none"
              initial={{ opacity: 0, y: -12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              aria-hidden="true"
            >
              <motion.span
                className="inline-block bg-clip-text text-transparent"
                style={{ backgroundImage: "linear-gradient(135deg, hsl(var(--primary-foreground) / 0.08), hsl(var(--gold) / 0.25))" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                "
              </motion.span>
            </motion.span>
          </blockquote>

          {/* Gold ornamental serif rule with breathing diamond */}
          <div className="flex items-center justify-center gap-4 mb-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-16 h-px origin-right"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.35))" }}
            />
            <motion.span
              className="w-2 h-2 rotate-45 shrink-0"
              style={{
                background: "hsl(var(--gold) / 0.25)",
                boxShadow: "0 0 12px 4px hsl(var(--gold) / 0.12)",
              }}
              animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              className="w-16 h-px origin-left"
              style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }}
            />
          </div>

          {/* Attribution with vertical accent */}
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="w-px h-10 origin-top"
              style={{ background: "linear-gradient(180deg, hsl(var(--primary-foreground) / 0.25), transparent)" }}
            />
            <span className="font-script text-2xl text-primary-foreground/40">
              Hickory & Rose
            </span>
            <div className="flex items-center gap-3">
              <span className="w-4 h-px bg-primary-foreground/15" />
              <span className="font-sans-wedding text-[0.55rem] tracking-[0.2em] uppercase text-primary-foreground/25">
                Edmonton · Alberta · Canadian Rockies
              </span>
              <span className="w-4 h-px bg-primary-foreground/15" />
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default LoveQuoteSection;
