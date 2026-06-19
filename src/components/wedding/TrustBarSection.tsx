import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

// Editorial "studio notes" — honest signals about where the studio is right now.
// Intentionally NOT framed as press features (5.6 — no real press yet). When real
// press lands, swap this list and rename headings back to "As Featured In".
const publications = [
  { name: "2026 Season", category: "Booking Status", year: "", note: "Summer & Fall Fully Booked", badge: "Booked" },
  { name: "Aug 2026", category: "Editorial", year: "", note: "Styled Shoot in Production", badge: "Upcoming" },
  { name: "2027 Season", category: "Now Booking", year: "", note: "Limited Calendar by Design", badge: "Open" },
  { name: "Edmonton", category: "Studio", year: "", note: "Based in Alberta", badge: "Local" },
  { name: "Two-Person Team", category: "Standard from 2027", year: "", note: "Quiet leadership, paired support", badge: "New" },
];

const TrustBarSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const verticalRuleScale = useTransform(scrollYProgress, [0.1, 0.6], [0, 1]);
  const decorativeRotate = useTransform(scrollYProgress, [0, 1], [-2, 2]);
  const counterScale = useTransform(scrollYProgress, [0.2, 0.5], [0.95, 1]);
  const counterOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-20 md:py-32 bg-background relative overflow-hidden"
      aria-label="Studio notes"
    >
      {/* Subtle grain texture */}
      <div 
        className="absolute inset-0 opacity-[0.012] pointer-events-none"
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px"
        }}
        aria-hidden="true"
      />

      {/* Parallax watermark */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ x: watermarkX }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">
          The Studio
        </span>
      </motion.div>

      {/* Radial gold glow — scroll-linked */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{
          opacity: useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0, 0.06, 0]),
          background: "radial-gradient(ellipse, hsl(var(--gold) / 0.3), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Decorative corner ampersand */}
      <motion.div
        className="absolute -bottom-16 -right-16 pointer-events-none select-none hidden lg:block"
        style={{ rotate: decorativeRotate, opacity: 0.02 }}
        aria-hidden="true"
      >
        <span className="font-script text-[18rem] text-foreground leading-none">
          &
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-16 md:mb-24">
            <span className="font-serif-wedding text-sm text-primary/60 font-light">03</span>
            <span className="w-8 h-px bg-primary/15" />
            <p className="font-sans-wedding text-label uppercase text-muted-foreground tracking-[0.2em]">
              Studio Notes
            </p>
            <span className="flex-1 h-px bg-border/30 hidden md:block" />
            {/* Counter intentionally removed — no real press to count (5.6).
                Reinstate once owner-confirmed press features exist. */}
          </div>
        </ScrollReveal>

        {/* Editorial ruled list with animated vertical accent */}
        <div className="max-w-4xl mx-auto relative">
          {/* Animated left accent line */}
          <motion.div
            className="absolute -left-6 md:-left-10 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/15 to-transparent hidden lg:block"
            style={{ scaleY: verticalRuleScale, transformOrigin: "top" }}
            aria-hidden="true"
          />

          {publications.map((pub, index) => (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.6,
                delay: index * 0.08,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="border-t border-border/40 group-first:border-t-0 relative overflow-hidden">
                {/* Gold shimmer sweep on hover */}
                <span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold)_/_0.04)] to-transparent -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1.2s] ease-out pointer-events-none"
                />
              </div>
              <div className="flex items-center justify-between py-7 md:py-10 cursor-default relative">
                {/* Gold gradient left-border reveal on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                  style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15), transparent)" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Hover background fill */}
                <motion.div
                  className="absolute inset-0 bg-muted/30 -mx-4 md:-mx-6 px-4 md:px-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                <div className="flex items-baseline gap-4 md:gap-6 relative">
                  {/* Index */}
                  <span className="font-serif-wedding text-xs text-primary/40 font-light w-5 tabular-nums group-hover:text-primary/60 transition-colors duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {/* Publication name */}
                  <span className="font-serif-wedding text-2xl md:text-3xl lg:text-4xl font-light text-foreground/40 group-hover:text-foreground/70 transition-colors duration-500 tracking-tight italic">
                    {pub.name}
                  </span>
                  {/* Badge - reveals on hover */}
                  <AnimatePresence>
                    {hoveredIndex === index && (
                      <motion.span
                        initial={{ opacity: 0, scale: 0.9, x: -8 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: -8 }}
                        transition={{ duration: 0.3 }}
                        className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-primary/60 bg-primary/5 px-2.5 py-1 hidden md:inline-flex"
                      >
                        {pub.badge}
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-3 md:gap-6 relative">
                  {/* Award note — visible on hover */}
                  <span
                    className="font-serif-wedding text-xs italic text-primary/30 hidden md:inline opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-2 group-hover:translate-x-0"
                  >
                    {pub.note}
                  </span>
                  <motion.div
                    className="h-px bg-primary/15 origin-right hidden md:block"
                    initial={{ width: 0 }}
                    whileInView={{ width: 32 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.2 + index * 0.08 }}
                  />
                  <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground hidden md:inline group-hover:text-muted-foreground transition-colors duration-500">
                    {pub.category}
                  </span>
                  <span className="font-serif-wedding text-xs text-muted-foreground font-light tabular-nums group-hover:text-muted-foreground transition-colors duration-500">
                    {pub.year}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="border-t border-border/40" />
        </div>

        {/* Bottom editorial tagline with decorative ornaments */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-col items-center gap-6 mt-14 md:mt-20">
            {/* Ornamental divider */}
            <div className="flex items-center gap-4" aria-hidden="true">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-12 h-px origin-right"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--border) / 0.4))" }}
              />
              <span className="w-2 h-2 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }} />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-12 h-px origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--border) / 0.4), transparent)" }}
              />
            </div>
            <p className="font-serif-wedding text-xs italic text-muted-foreground">
              Honoring every couple with calm, intentional planning
            </p>
            {/* Trust credentials row — owner-confirmed signals only */}
            <div className="flex items-center gap-8 mt-2">
              <div className="text-center">
                <span className="font-serif-wedding text-lg text-primary/60 block">2026</span>
                <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground">Fully Booked</span>
              </div>
              <span className="w-px h-6 bg-border/20" />
              <div className="text-center">
                <span className="font-serif-wedding text-lg text-primary/60 block">Aug 15</span>
                <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground">Editorial Shoot</span>
              </div>
              <span className="w-px h-6 bg-border/20" />
              <div className="text-center">
                <span className="font-serif-wedding text-lg text-primary/60 block">2027</span>
                <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground">Now Booking</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default TrustBarSection;
