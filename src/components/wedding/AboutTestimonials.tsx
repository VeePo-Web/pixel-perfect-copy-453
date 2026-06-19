import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

// Studio philosophy lines — NOT client testimonials. Owner has zero published reviews
// to date (brand-identity §5.7, founder.heroTestimonials: []). Swap in real, named,
// dated couple testimonials when received.
const testimonials = [
  {
    quote: "From the first call, you should feel like you're in the right hands — your wedding feeling exactly like you, intimate and elegant and unhurried.",
    couple: "Hickory & Rose",
    venue: "Client Communication",
  },
  {
    quote: "The calm energy a planner brings to the day can be transformative — couples actually present for every moment, instead of running it.",
    couple: "Hickory & Rose",
    venue: "Calm Leadership",
  },
  {
    quote: "Every detail intentional, every moment quietly protected — a wedding designed for how it feels, not just how it looks.",
    couple: "Hickory & Rose",
    venue: "Design Philosophy",
  },
];

const AboutTestimonials = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const advanceTestimonial = useCallback(() => {
    setActiveTestimonial((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(advanceTestimonial, 6000);
    return () => clearInterval(timer);
  }, [advanceTestimonial, isPaused]);

  return (
    <section className="py-section-mobile md:py-section-tablet bg-card relative overflow-hidden" style={{ contain: "layout style" }} role="region" aria-label="From the Studio">
      {/* Parallax watermark */}
      <motion.div
        className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] text-foreground leading-none tracking-tight italic whitespace-nowrap">
          Voices
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
            {/* Left: Label */}
            <div className="lg:col-span-3">
              <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-3">03</span>
              <p className="font-overline text-brand-text-secondary mb-3">From the Studio</p>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-10 h-px bg-primary/25 origin-left mb-4"
              />
              <p className="font-sans-wedding text-body-sm text-brand-text-secondary font-light leading-relaxed">
                The principles that guide every wedding we plan. Named client testimonials will live here as our 2026 couples celebrate.
              </p>
            </div>

            {/* Right: Testimonial crossfade */}
            <div className="lg:col-span-9" aria-live="polite" aria-atomic="true" onMouseEnter={() => setIsPaused(true)} onMouseLeave={() => setIsPaused(false)}>
              <div className="min-h-[220px] md:min-h-[200px] relative">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTestimonial}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {/* Gold-gradient quotation mark */}
                    <motion.span
                      className="font-serif-wedding text-6xl leading-none block -mb-4"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--gold) / 0.2), hsl(var(--primary) / 0.06))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                      }}
                      animate={{ opacity: [0.4, 0.8, 0.4] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      aria-hidden="true"
                    >
                      "
                    </motion.span>
                    <blockquote className="font-serif-wedding text-pull-quote italic text-foreground leading-relaxed mb-6">
                      {testimonials[activeTestimonial].quote}
                    </blockquote>
                    <div className="flex items-center gap-4">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-px h-10 origin-top"
                        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--primary) / 0.1))" }}
                      />
                      <div>
                        <p className="font-sans-wedding text-body-sm font-medium text-foreground">
                          {testimonials[activeTestimonial].couple}
                        </p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <p className="font-sans-wedding text-[0.55rem] tracking-[0.12em] uppercase text-brand-text-tertiary">
                            {testimonials[activeTestimonial].venue}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress bars with gold */}
              <div className="flex items-center gap-4 mt-10" role="tablist" aria-label="Testimonial navigation">
                <div className="flex gap-2 flex-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveTestimonial(index)}
                      className="h-[2px] flex-1 relative overflow-hidden transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2"
                      style={{ background: index < activeTestimonial ? "hsl(var(--gold) / 0.2)" : "hsl(var(--primary) / 0.1)" }}
                      aria-label={`View studio note ${index + 1}`}
                      role="tab"
                      aria-selected={index === activeTestimonial}
                    >
                      {index === activeTestimonial && (
                        <motion.div
                          className="absolute inset-0 origin-left"
                          style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.35))" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 6, ease: "linear" }}
                          key={`progress-${activeTestimonial}`}
                        />
                      )}
                      {index < activeTestimonial && (
                        <div className="absolute inset-0" style={{ background: "hsl(var(--gold) / 0.35)" }} />
                      )}
                    </button>
                  ))}
                </div>
                <span className="font-sans-wedding text-[0.6rem] text-brand-text-tertiary tabular-nums tracking-[0.15em]">
                  {String(activeTestimonial + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default AboutTestimonials;
