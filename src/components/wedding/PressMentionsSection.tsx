import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";

const mentions = [
  { name: "Wedding Bells", type: "Magazine", year: "2024", detail: "Featured: Top Wedding Planners to Watch", displayFont: "font-serif-wedding tracking-tight" },
  { name: "Style Me Pretty", type: "Editorial", year: "2023", detail: "Editor's Pick — Refined Rustic Weddings", displayFont: "font-script" },
  { name: "Rocky Mountain Bride", type: "Feature", year: "2024", detail: "Cover Feature — Mountain Celebrations", displayFont: "font-serif-wedding italic" },
  { name: "Junebug Weddings", type: "Spotlight", year: "2023", detail: "Spotlight: Alberta's Finest", displayFont: "font-sans-wedding tracking-[0.1em] uppercase text-base" },
  { name: "Edmonton Journal", type: "Profile", year: "2022", detail: "Rising Stars in Wedding Planning", displayFont: "font-serif-wedding" },
];

const PressMentionsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const marqueeX = useTransform(scrollYProgress, [0, 1], ["5%", "-20%"]);
  const accentLineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-14 md:py-20 bg-card border-y border-border/20 overflow-hidden relative"
      aria-label="Press mentions"
    >
      {/* Parallax marquee watermark */}
      <motion.div
        className="absolute inset-0 flex items-center pointer-events-none select-none"
        style={{ x: marqueeX }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[12rem] text-foreground/[0.012] whitespace-nowrap tracking-tight italic">
          As Featured In · As Featured In · As Featured In
        </span>
      </motion.div>

      {/* Animated top accent line */}
      <motion.div
        className="absolute top-0 left-1/2 -translate-x-1/2 h-px w-48 origin-center"
        style={{
          scaleX: accentLineScale,
          background: "linear-gradient(90deg, transparent, hsl(var(--border) / 0.4), transparent)",
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
        <ScrollReveal>
          <div className="flex items-center gap-5 mb-10 md:mb-14 justify-center">
            <motion.span
              className="w-10 h-px origin-right hidden md:block"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--border) / 0.4))" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            />
            <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }} />
            <p className="font-sans-wedding text-caption tracking-[0.3em] uppercase text-muted-foreground/60 font-light">
              As Featured In
            </p>
            <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }} />
            <motion.span
              className="w-10 h-px origin-left hidden md:block"
              style={{ background: "linear-gradient(90deg, hsl(var(--border) / 0.4), transparent)" }}
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
            />
          </div>
        </ScrollReveal>

        {/* Editorial ruled list layout */}
        <div className="max-w-3xl mx-auto">
          {mentions.map((mention, i) => (
            <motion.div
              key={mention.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 + i * 0.08 }}
              className="group cursor-default border-t border-border/15 last:border-b"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div className="grid grid-cols-12 gap-4 items-center py-5 md:py-6 px-2 relative">
                {/* Gold left-border reveal on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                  style={{ background: "linear-gradient(180deg, hsl(var(--gold)), hsl(var(--primary) / 0.3))" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredIndex === i ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />
                {/* Index */}
                <div className="col-span-1 hidden md:block">
                  <span className="font-serif-wedding text-sm text-foreground/8 group-hover:text-foreground/20 transition-colors duration-500 tabular-nums">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                
                {/* Name — each publication rendered in its own typographic voice */}
                <div className="col-span-8 md:col-span-5">
                  <p className={`text-lg md:text-2xl text-foreground/20 group-hover:text-foreground/55 transition-colors duration-500 ${mention.displayFont}`}>
                    {mention.name}
                  </p>
                  {/* Hover-reveal detail line */}
                  <motion.p
                    className="font-serif-wedding text-caption italic text-primary/0 group-hover:text-primary/60 transition-all duration-500 mt-0.5 overflow-hidden"
                    style={{ maxHeight: hoveredIndex === i ? 20 : 0 }}
                  >
                    {mention.detail}
                  </motion.p>
                  {/* Gold shimmer sweep on hover */}
                  <motion.div
                    className="h-px mt-1 origin-left"
                    style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.05), transparent)" }}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: hoveredIndex === i ? 1 : 0 }}
                    transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                  />
                </div>
                
                {/* Type badge */}
                <div className="col-span-4 md:col-span-3 text-right md:text-center">
                  <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors duration-500 px-3 py-1 border border-transparent group-hover:border-border/30">
                    {mention.type}
                  </span>
                </div>
                
                {/* Year */}
                <div className="hidden md:block col-span-2 text-center">
                  <span className="font-serif-wedding text-xs italic text-foreground/8 group-hover:text-foreground/25 transition-colors duration-500">
                    {mention.year}
                  </span>
                </div>
                
                {/* Arrow hint */}
                <div className="hidden md:flex col-span-1 justify-end">
                  <motion.span
                    className="text-foreground/0 group-hover:text-foreground/20 transition-colors duration-500 text-xs"
                    animate={hoveredIndex === i ? { x: [0, 3, 0] } : {}}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom ornament — premium gold treatment */}
        <ScrollReveal delay={0.3}>
          <div className="flex flex-col items-center gap-5 mt-12 md:mt-16">
            <div className="flex items-center gap-4" aria-hidden="true">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-14 h-px origin-right"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25))" }}
              />
              <span
                className="w-2 h-2 rotate-45"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15))",
                  boxShadow: "0 0 10px 3px hsl(var(--gold) / 0.1)",
                }}
              />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="w-14 h-px origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }}
              />
            </div>
            <p className="font-script text-lg text-primary/10">Hickory & Rose</p>
            <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60">
              Recognized across Canada & beyond
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PressMentionsSection;
