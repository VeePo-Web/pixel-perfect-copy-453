import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import bouquetImage from "@/assets/portfolio-bouquet.jpg";

const steps = [
  {
    number: "01",
    title: "Vision",
    subtitle: "Listen & Discover",
    description:
      "We listen deeply to understand your story, your aesthetic, and how you want to feel on your wedding day. No questionnaires — just a genuine conversation.",
    pullQuote: "Tell us everything.",
  },
  {
    number: "02",
    title: "Planning",
    subtitle: "Design & Curate",
    description:
      "Every detail is curated with intention — vendors, timelines, design elements — so nothing is left to chance. You stay involved; we handle the weight.",
    pullQuote: "Intentional, never accidental.",
  },
  {
    number: "03",
    title: "Celebration",
    subtitle: "Lead & Protect",
    description:
      "On your day, we lead calmly behind the scenes. You simply show up and feel every beautiful moment — exactly as it should be.",
    pullQuote: "Feel every moment.",
  },
];

const ProcessTeaserSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const timelineProgress = useTransform(scrollYProgress, [0.15, 0.75], [0, 1]);
  const floatingQuoteY = useTransform(scrollYProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background relative overflow-hidden"
      aria-label="Our approach"
      style={{ contain: "layout style" }}
    >
      {/* Parallax watermark */}
      <motion.div
        className="absolute right-0 top-1/3 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[12rem] lg:text-[16rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">
          Process
        </span>
      </motion.div>

      {/* Floating pull-quote layer — desktop only */}
      <motion.div
        className="absolute left-8 bottom-1/4 pointer-events-none select-none hidden xl:block"
        style={{ y: floatingQuoteY }}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          {activeStep !== null && (
            <motion.p
              key={activeStep}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.4 }}
              className="font-script text-2xl text-primary/10 -rotate-12"
            >
              {steps[activeStep].pullQuote}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left: Editorial image column */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="sticky top-32">
              <ImageReveal direction="up" delay={0.15}>
                <div className="aspect-[3/4] overflow-hidden relative group">
                  <img
                    src={bouquetImage}
                    alt="Elegant bridal bouquet with sage eucalyptus and ivory garden roses"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-[1.2s] ease-out"
                    loading="lazy"
                    width={512}
                    height={683}
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                  
                  {/* Gold-gradient corner accents */}
                  <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }} />
                    <div className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.25), transparent)" }} />
                  </div>
                  <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                    <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.25), transparent)" }} />
                    <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.25), transparent)" }} />
                  </div>
                </div>
              </ImageReveal>
              
              {/* Animated rule + caption */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="w-full h-px mt-6 origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--border) / 0.5), transparent)" }}
              />
              <div className="flex items-center justify-between mt-4">
                <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60 font-light">
                  Every detail, curated with care
                </p>
                <span
                  className="w-1.5 h-1.5 rotate-45"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }}
                />
              </div>
            </div>
          </div>

          {/* Right: Content column */}
          <div className="lg:col-span-8">
            <ScrollReveal>
              <div className="mb-16 md:mb-24">
                {/* Section index + label */}
                <div className="flex items-center gap-4 mb-6">
                  <span className="font-serif-wedding text-sm text-primary/60 font-light">06</span>
                  <motion.span
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="w-10 h-px bg-primary/10 origin-left"
                  />
                  <p className="font-sans-wedding text-label uppercase text-muted-foreground/60 tracking-[0.25em]">
                    How We Work
                  </p>
                </div>
                <h2 className="font-serif-wedding text-display-lg text-foreground">
                  A Process Built on{" "}
                  <span className="font-script text-[1.1em] text-primary/70">Trust</span>
                </h2>
                <p className="font-sans-wedding text-body-sm text-muted-foreground/45 font-light mt-5 max-w-lg leading-relaxed">
                  From the first conversation to the last dance, our process is
                  designed to make you feel supported, understood, and completely
                  at ease.
                </p>
              </div>
            </ScrollReveal>

            {/* Steps with animated timeline */}
            <div className="relative">
              {/* Connecting vertical line — scroll-linked gold gradient */}
              <motion.div
                className="absolute left-[1.25rem] md:left-[2rem] top-14 bottom-14 w-px origin-top hidden md:block"
                style={{
                  scaleY: timelineProgress,
                  background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15), hsl(var(--primary) / 0.05), transparent)",
                }}
              />
              {/* Gold glow trail alongside timeline */}
              <motion.div
                className="absolute left-[1.15rem] md:left-[1.9rem] top-14 bottom-14 w-[3px] origin-top hidden md:block blur-[2px]"
                style={{
                  scaleY: timelineProgress,
                  opacity: 0.3,
                  background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)",
                }}
              />

              {steps.map((step, index) => (
                <ScrollReveal key={step.number} delay={index * 0.12}>
                  <div
                    className="relative py-10 md:py-14 border-t border-border/30 group cursor-default hover:bg-muted/15 transition-all duration-500 -mx-4 px-4 md:-mx-6 md:px-6 overflow-hidden"
                    onMouseEnter={() => setActiveStep(index)}
                    onMouseLeave={() => setActiveStep(null)}
                  >
                    {/* Gold shimmer sweep on hover */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1.2s] ease-out pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.04) 40%, hsl(var(--gold) / 0.08) 50%, hsl(var(--gold) / 0.04) 60%, transparent 100%)" }}
                    />
                    {/* Gold left-border reveal on hover */}
                    <motion.div
                      className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                      style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15), transparent)" }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: activeStep === index ? 1 : 0 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-start">
                      {/* Number */}
                      <div className="md:col-span-2 relative">
                        <motion.div
                          className="absolute left-[1.25rem] md:left-[2rem] top-1/2 -translate-x-1/2 -translate-y-1/2 hidden md:block"
                          initial={{ scale: 0, rotate: 0 }}
                          whileInView={{ scale: 1, rotate: 45 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.4 + index * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          <span
                            className="w-2.5 h-2.5 block transition-all duration-500 group-hover:shadow-[0_0_12px_hsl(var(--gold)_/_0.4)]"
                            style={{
                              background: `linear-gradient(135deg, hsl(var(--gold) / ${activeStep === index ? '0.7' : '0.25'}), hsl(var(--primary) / ${activeStep === index ? '0.5' : '0.15'}))`,
                            }}
                          />
                          {/* Breathing glow halo on active */}
                          {activeStep === index && (
                            <motion.span
                              className="absolute -inset-3 rounded-full pointer-events-none"
                              animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.8, 1.2, 0.8] }}
                              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                              style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.25), transparent 70%)" }}
                            />
                          )}
                        </motion.div>
                        <motion.span
                          className="font-serif-wedding text-5xl md:text-6xl font-light text-primary/8 group-hover:text-primary/25 transition-colors duration-700 inline-block"
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.1 + index * 0.12 }}
                        >
                          {step.number}
                        </motion.span>
                      </div>

                      {/* Title + subtitle */}
                      <div className="md:col-span-3">
                        <h3 className="font-serif-wedding text-display-md text-foreground group-hover:text-primary transition-colors duration-500">
                          {step.title}
                        </h3>
                        <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-primary/60 mt-2">
                          {step.subtitle}
                        </p>
                        <motion.div
                          className="mt-3 h-px origin-left"
                          style={{
                            background: "linear-gradient(90deg, hsl(var(--primary) / 0.2), transparent)",
                          }}
                          initial={{ scaleX: 0 }}
                          whileInView={{ scaleX: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.3 + index * 0.12 }}
                        />
                      </div>

                      {/* Description + pull quote */}
                      <div className="md:col-span-7">
                        <p className="font-sans-wedding text-body-sm text-muted-foreground/55 leading-relaxed font-light max-w-lg group-hover:text-muted-foreground/80 transition-colors duration-500">
                          {step.description}
                        </p>
                        
                        {/* Hover-reveal pull quote */}
                        <motion.p
                          className="font-serif-wedding text-sm italic text-primary/0 group-hover:text-primary/35 transition-all duration-500 mt-3"
                        >
                          "{step.pullQuote}"
                        </motion.p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
              <div className="border-t border-border/30" />
            </div>

            {/* Bottom pull quote */}
            <ScrollReveal delay={0.3}>
              <div className="mt-14 md:mt-20 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <motion.span
                    className="w-px h-10 bg-primary/20 mt-1 shrink-0"
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    style={{ originY: 0 }}
                  />
                  <div>
                    <p className="font-serif-wedding text-sm italic text-foreground/35 max-w-sm leading-relaxed">
                      "We don't just coordinate — we protect the feeling of your day."
                    </p>
                    <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground/60 mt-2">
                      — Hickory & Rose Philosophy
                    </p>
                  </div>
                </div>
                <Link
                  to="/approach"
                  className="inline-flex items-center font-overline text-accent hover:text-primary transition-colors duration-300 group shrink-0"
                >
                  Explore Our Full Approach
                  <motion.span
                    className="ml-2 inline-block"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessTeaserSection;
