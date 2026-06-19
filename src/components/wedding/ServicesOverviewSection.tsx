import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import dayofImage from "@/assets/service-dayof.jpg";
import planningImage from "@/assets/service-planning.jpg";
import fullserviceImage from "@/assets/service-fullservice.jpg";

const services = [
  {
    number: "01",
    title: "Day-Of Coordination",
    tagline: "Fully taken care of.",
    description:
      "We step in 6–8 weeks before your day with unlimited communication, a full timeline build, and vendor coordination — so you arrive present and ready.",
    investment: "Starting at — inquire",
    link: "/services#day-of",
    featured: false,
    image: dayofImage,
    imageAlt: "Wedding planner organizing ceremony setup at golden hour",
  },
  {
    number: "02",
    title: "Partial Planning",
    tagline: "Collaboration at every turn.",
    description:
      "Everything in Day-Of Coordination, plus remaining vendor sourcing and curation to round out your team.",
    investment: "Starting at — inquire",
    link: "/services#partial",
    featured: false,
    image: planningImage,
    imageAlt: "Consultation over floral arrangements with sage eucalyptus",
  },
  {
    number: "03",
    title: "Full-Service Planning",
    tagline: "From vision to celebration.",
    description:
      "From the moment you're engaged — design, vision, vendor sourcing, and execution. Every element, held end-to-end.",
    investment: "Starting at — inquire",
    link: "/services#full",
    featured: true,
    image: fullserviceImage,
    imageAlt: "Wedding planning flatlay with mood board and calligraphy",
  },
];

const ServicesOverviewSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const bgTextY = useTransform(scrollYProgress, [0, 1], ["15%", "-15%"]);
  const accentLineH = useTransform(scrollYProgress, [0.15, 0.7], ["0%", "100%"]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card relative overflow-hidden"
      aria-label="Our services"
    >
      {/* Large decorative "Services" watermark */}
      <motion.div
        className="absolute -left-8 top-1/3 pointer-events-none select-none"
        style={{ y: bgTextY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-serif-wedding text-[10rem] md:text-[16rem] font-light text-foreground leading-none tracking-tight whitespace-nowrap">
          Services
        </span>
      </motion.div>

      {/* Scroll-linked vertical accent line */}
      <motion.div
        className="absolute right-[10%] top-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent origin-top hidden lg:block"
        style={{ height: accentLineH }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 md:mb-24 items-baseline">
            <div className="md:col-span-5">
              <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-4">
                03
              </span>
              <p className="font-overline text-muted-foreground mb-4">
                What We Offer
              </p>
              <h2 className="font-serif-wedding text-display-lg text-foreground">
                Services Tailored to You
              </h2>
            </div>
            <div className="md:col-span-7 md:pt-12">
              <p className="font-sans-wedding text-body-sm text-muted-foreground/50 font-light leading-relaxed">
                Every couple is different. Our services flex to meet you exactly where you are in your planning journey — whether you need a steady hand on the day or a creative partner from the very beginning. Tailored options are also available.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <div className="space-y-0 relative">
          {/* Floating preview image on hover — desktop only */}
          <AnimatePresence>
            {hoveredIndex !== null && (
              <motion.div
                key={hoveredIndex}
                className="absolute -right-4 xl:-right-16 top-1/2 -translate-y-1/2 z-20 hidden lg:block pointer-events-none"
                initial={{ opacity: 0, x: 20, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 20, scale: 0.95 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <div className="w-48 xl:w-56 aspect-[3/4] overflow-hidden shadow-2xl relative">
                  {/* Cinematic letterbox bars */}
                  <div className="absolute top-0 left-0 right-0 h-[6%] bg-black/60 z-10" />
                  <div className="absolute bottom-0 left-0 right-0 h-[6%] bg-black/60 z-10" />
                  <img
                    src={services[hoveredIndex].image}
                    alt={services[hoveredIndex].imageAlt}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  {/* Corner frame accents */}
                  <div className="absolute top-[8%] left-2 w-5 h-5 border-t border-l border-white/20 z-20" />
                  <div className="absolute bottom-[8%] right-2 w-5 h-5 border-b border-r border-white/20 z-20" />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  {/* Gold accent line at bottom */}
                  <div
                    className="absolute bottom-[6%] left-0 right-0 h-px z-20"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
                  />
                </div>
                <div className="flex items-center justify-end gap-2 mt-3">
                  <span className="w-4 h-px bg-muted-foreground/15" />
                  <p className="font-sans-wedding text-[0.5rem] tracking-[0.15em] uppercase text-muted-foreground/25">
                    {services[hoveredIndex].title}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {services.map((service, index) => (
            <ScrollReveal key={service.number} delay={index * 0.1}>
              <Link
                to={service.link}
                className="group block"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <div className={`grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline py-10 md:py-14 border-t border-border/60 relative transition-colors duration-500 ${service.featured ? "bg-primary/[0.02] hover:bg-primary/[0.04]" : "hover:bg-primary/[0.01]"}`}>
                  {/* Gold accent left border on hover */}
                  <motion.div
                    className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                    style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.1), transparent)" }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                  {service.featured && (
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 }}
                      className="absolute top-3 right-4 flex items-center gap-2 overflow-hidden"
                    >
                      <span className="w-1.5 h-1.5 rotate-45 bg-primary/40" />
                      <span className="font-overline text-[0.5rem] text-primary/60 tracking-[0.25em] relative">
                        Most Popular
                        {/* Gold shimmer sweep */}
                        <span
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold)_/_0.15)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                        />
                      </span>
                    </motion.div>
                  )}

                  <div className="md:col-span-1">
                    <motion.span
                      className="font-serif-wedding text-4xl md:text-5xl font-light text-primary/15 group-hover:text-primary/30 transition-colors duration-700"
                      initial={{ opacity: 0, x: -12 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                    >
                      {service.number}
                    </motion.span>
                  </div>

                  <div className="md:col-span-4">
                    <h3 className="font-serif-wedding text-display-md text-foreground group-hover:text-primary transition-colors duration-500">
                      {service.title}
                    </h3>
                    <p className="font-serif-wedding text-sm italic text-muted-foreground/60 mt-1">
                      {service.tagline}
                    </p>
                    <div className="mt-2 h-px bg-primary/40 w-0 group-hover:w-full transition-all duration-700 ease-out origin-left" />
                  </div>

                  <div className="md:col-span-5">
                    <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light max-w-md">
                      {service.description}
                    </p>
                  </div>

                  <div className="md:col-span-2 flex items-center justify-between md:flex-col md:items-end gap-2">
                    <span className="font-overline text-primary text-[0.625rem]">
                      {service.investment}
                    </span>
                    <motion.span
                      className="font-sans-wedding text-sm text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all duration-300"
                    >
                      →
                    </motion.span>
                  </div>
                </div>
              </Link>
            </ScrollReveal>
          ))}
          {/* Terminal gold ornament after last service */}
          <div className="border-t border-border/60 relative">
            <span
              className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rotate-45"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }}
            />
          </div>
        </div>

        {/* Quick comparison row */}
        <ScrollReveal delay={0.2}>
          <div className="mt-12 md:mt-16 border border-border/30 hidden md:block overflow-hidden relative">
            {/* Ambient gold glow behind comparison table */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[200px] pointer-events-none"
              animate={{ opacity: [0.02, 0.06, 0.02] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.2), transparent 70%)" }}
              aria-hidden="true"
            />
            {/* Gold gradient header bar with shimmer sweep */}
            <div className="h-px w-full relative overflow-hidden">
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25), hsl(var(--gold) / 0.1), transparent)" }}
              />
              <motion.div
                className="absolute inset-0"
                style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.4) 45%, hsl(var(--gold) / 0.6) 50%, hsl(var(--gold) / 0.4) 55%, transparent 100%)" }}
                animate={{ x: ["-100%", "200%"] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              />
            </div>
            <div className="p-6 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span
                  className="w-2 h-2 rotate-45"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15))" }}
                />
                <p className="font-sans-wedding text-[0.55rem] tracking-[0.2em] uppercase text-muted-foreground/30 font-light">
                  Quick Comparison
                </p>
                <span className="flex-1 h-px bg-border/20" />
              </div>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div />
              {services.map((s) => (
                <div key={s.number}>
                  <p className="font-serif-wedding text-sm text-foreground/60 mb-1">{s.title}</p>
                  <p className="font-overline text-[0.5rem] text-primary/50">{s.investment}</p>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-4 gap-4 text-center mt-4 pt-4 border-t border-border/20">
              {[
                { label: "Vendor Coordination", vals: ["Day-of only", "Select vendors", "All vendors"] },
                { label: "Design Direction", vals: ["—", "Guidance", "Full creative"] },
                { label: "Timeline Management", vals: ["✓", "✓", "✓"] },
              ].map((row) => (
                <div key={row.label} className="contents">
                  <p className="font-sans-wedding text-[0.55rem] tracking-[0.1em] uppercase text-muted-foreground/40 text-left py-2">
                    {row.label}
                  </p>
                  {row.vals.map((val, i) => (
                    <p key={i} className="font-sans-wedding text-xs text-muted-foreground/50 font-light py-2">
                      {val}
                    </p>
                  ))}
                </div>
              ))}
            </div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.3}>
          <div className="text-center mt-14 md:mt-20">
            <Link
              to="/services"
              className="inline-flex items-center font-overline text-accent hover:text-primary transition-colors duration-200 group"
            >
              View All Services
              <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">
                →
              </span>
            </Link>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default ServicesOverviewSection;
