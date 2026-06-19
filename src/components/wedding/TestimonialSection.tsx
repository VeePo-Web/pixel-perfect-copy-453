import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import ceremonyImage from "@/assets/ceremony-setup.jpg";
import detailImage from "@/assets/detail-placecard.jpg";
import firstDanceImage from "@/assets/first-dance.jpg";

// TODO (5.7): Replace with real, owner-supplied testimonials once received.
// Current entries are illustrative placeholders aligned with brand voice.
const testimonials = [
  {
    quote:
      "We actually got to enjoy our wedding day. Every single moment felt taken care of — we never once worried about what was happening behind the scenes.",
    couple: "Hickory & Rose",
    venue: "Design Philosophy",
    season: "",
    service: "Full-Service Planning",
  },
  {
    quote:
      "Hiring a planner can be the best decision of your entire process — the calm energy, the attention to detail, the room to actually be present.",
    couple: "Hickory & Rose",
    venue: "Calm Leadership",
    season: "",
    service: "Partial Planning",
  },
  {
    quote:
      "From the first call, you should feel like you're in the right hands — your wedding feeling exactly like you, intimate and elegant and unhurried.",
    couple: "Hickory & Rose",
    venue: "Client Communication",
    season: "",
    service: "Day-of Coordination",
  },
];

// Aesthetic-direction images from styled set — no fabricated venue attributions
// (brand-identity §6.11 — featured weddings TBC). Swap when real weddings publish.
const galleryImages = [
  { src: ceremonyImage, alt: "Outdoor ceremony with mountain backdrop and floral arch", label: "Ceremony" },
  { src: detailImage, alt: "Elegant calligraphy place card with gold cutlery on linen", label: "Details" },
  { src: firstDanceImage, alt: "Couple's first dance under string lights at outdoor reception", label: "Reception" },
];

const TestimonialSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const galleryLineH = useTransform(scrollYProgress, [0.2, 0.7], ["0%", "100%"]);

  const advance = useCallback(() => {
    setActiveIndex((i) => (i + 1) % testimonials.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advance, 6000);
    return () => clearInterval(timer);
  }, [advance]);

  const active = testimonials[activeIndex];

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-sage-mist relative overflow-hidden"
      aria-label="Testimonials"
    >
      {/* Large parallax watermark */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[6rem] md:text-[10rem] lg:text-[14rem] font-light text-primary/[0.025] whitespace-nowrap tracking-tight italic">
          Kind Words
        </span>
      </motion.div>

      {/* Top editorial rule with ornament */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 flex items-center gap-3 pointer-events-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      >
        <span className="w-12 md:w-20 h-px bg-gradient-to-r from-transparent to-primary/15" />
        <span
          className="w-2 h-2 rotate-45"
          style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))" }}
        />
        <span className="w-12 md:w-20 h-px bg-gradient-to-l from-transparent to-primary/15" />
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
          {/* Testimonial with crossfade */}
          <ScrollReveal>
            <div>
              <div className="flex items-center gap-4 mb-8">
                <span className="font-serif-wedding text-sm text-primary/20 font-light">05</span>
                <span className="w-8 h-px bg-primary/20" />
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 tracking-[0.2em]">
                  From the Studio
                </p>
              </div>

              <div className="min-h-[280px] md:min-h-[260px] relative">
                {/* Ambient gold glow behind quote */}
                <motion.div
                  className="absolute -top-8 -left-8 w-40 h-40 pointer-events-none"
                  style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.06), transparent 70%)" }}
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                  aria-hidden="true"
                />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1.0] }}
                  >
                    {/* Gold shimmer sweep on slide transition */}
                    <motion.div
                      className="absolute inset-0 pointer-events-none overflow-hidden"
                      aria-hidden="true"
                    >
                      <motion.div
                        className="absolute inset-0"
                        initial={{ x: "-100%" }}
                        animate={{ x: "200%" }}
                        transition={{ duration: 1.2, ease: "easeInOut" }}
                        style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.06) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.06) 60%, transparent 100%)" }}
                      />
                    </motion.div>

                    {/* Large gold gradient quotation mark */}
                    <motion.span
                      className="font-serif-wedding text-7xl leading-none block -mb-6 relative"
                      aria-hidden="true"
                      animate={{ opacity: [0.1, 0.2, 0.1] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >
                      <span style={{
                        background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.08))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                      }}>"</span>
                    </motion.span>
                    
                    <blockquote className="font-serif-wedding text-pull-quote italic text-foreground leading-relaxed mb-6">
                      {active.quote}
                    </blockquote>

                    {/* Diamond ornament separator */}
                    <div className="flex items-center gap-3 mb-6">
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-8 h-px origin-left"
                        style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }}
                      />
                      <motion.span
                        initial={{ scale: 0, rotate: 0 }}
                        animate={{ scale: 1, rotate: 45 }}
                        transition={{ duration: 0.3, delay: 0.3 }}
                        className="w-1.5 h-1.5 shrink-0"
                        style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.45), hsl(var(--gold) / 0.1))" }}
                      />
                      <motion.span
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                        className="w-8 h-px origin-right"
                        style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.25), transparent)" }}
                      />
                    </div>

                    <div className="flex items-start gap-4">
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="w-px h-12 origin-top mt-1"
                        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), hsl(var(--primary) / 0.1))" }}
                      />
                      <div className="font-sans-wedding">
                        <p className="text-body-sm font-medium text-foreground tracking-wide">
                          {active.couple}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <p className="text-caption text-muted-foreground/60">
                            {active.venue}
                          </p>
                          <span className="text-muted-foreground/20">·</span>
                          <p className="text-caption text-muted-foreground/40 italic">
                            {active.season}
                          </p>
                        </div>
                        <span className="inline-block mt-2 font-sans-wedding text-caption tracking-[0.15em] uppercase text-primary/60 border border-primary/25 px-2 py-0.5">
                          {active.service}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Progress indicators */}
              <div className="flex items-center gap-4 mt-12">
                <div className="flex gap-2 flex-1">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveIndex(index)}
                      className="h-[2px] flex-1 relative overflow-hidden bg-primary/10 hover:bg-primary/20 transition-colors"
                      aria-label={`View testimonial ${index + 1}`}
                    >
                      {index === activeIndex && (
                        <motion.div
                          className="absolute inset-0 origin-left"
                          style={{ background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--primary)))" }}
                          initial={{ scaleX: 0 }}
                          animate={{ scaleX: 1 }}
                          transition={{ duration: 6, ease: "linear" }}
                          key={`progress-${activeIndex}`}
                        />
                      )}
                      {index < activeIndex && (
                        <div className="absolute inset-0 bg-primary/50" />
                      )}
                    </button>
                  ))}
                </div>
                <span className="font-sans-wedding text-caption text-muted-foreground tabular-nums tracking-[0.15em]">
                  {String(activeIndex + 1).padStart(2, "0")} / {String(testimonials.length).padStart(2, "0")}
                </span>
              </div>
            </div>
          </ScrollReveal>

          {/* Editorial Gallery with scroll-linked accent */}
          <ScrollReveal delay={0.15}>
            <div className="relative">
              {/* Scroll-linked vertical gallery accent */}
              <motion.div
                className="absolute -left-4 top-0 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent origin-top hidden lg:block"
                style={{ height: galleryLineH }}
                aria-hidden="true"
              />

               <div className="grid grid-cols-2 gap-3">
                <ImageReveal direction="up" delay={0.1}>
                  <div className="aspect-[3/4] overflow-hidden relative group/img">
                    <img
                      src={galleryImages[0].src}
                      alt={galleryImages[0].alt}
                      className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-700"
                      loading="lazy"
                      width={512}
                      height={683}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/5 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-500" />
                    {/* Gold corner frame accents on hover */}
                    <div className="absolute top-3 left-3 w-8 h-8 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                      <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), transparent)" }} />
                      <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), transparent)" }} />
                    </div>
                    <div className="absolute bottom-3 right-3 w-8 h-8 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                      <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.4), transparent)" }} />
                      <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.4), transparent)" }} />
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover/img:opacity-100 transition-opacity duration-500 translate-y-2 group-hover/img:translate-y-0">
                      <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/70 block">
                        {galleryImages[0].label}
                      </span>
                      <p className="font-serif-wedding text-xs text-white/80 italic mt-0.5">
                        Aesthetic direction
                      </p>
                    </div>
                  </div>
                </ImageReveal>
                <div className="space-y-3">
                  {galleryImages.slice(1).map((img, i) => (
                    <ImageReveal key={i} direction="left" delay={0.2 + i * 0.1}>
                      <div className="aspect-square overflow-hidden relative group">
                        <img
                          src={img.src}
                          alt={img.alt}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          loading="lazy"
                          width={512}
                          height={512}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        <div className="absolute bottom-2 left-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                          <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/70 block">
                            {img.label}
                          </span>
                          <p className="font-serif-wedding text-caption text-white/80 italic mt-0.5">
                            Aesthetic direction
                          </p>
                        </div>
                      </div>
                    </ImageReveal>
                  ))}
                </div>
              </div>
              {/* Gallery caption with ornament */}
              <div className="mt-4 flex items-center justify-between">
                <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/60">
                  Aesthetic Direction — Hickory & Rose
                </span>
                <div className="flex items-center gap-2">
                  <span
                    className="w-1.5 h-1.5 rotate-45"
                    style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }}
                  />
                  <span className="w-8 h-px bg-border/40" />
                </div>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;
