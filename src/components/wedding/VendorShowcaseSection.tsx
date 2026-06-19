import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

// No fabricated vendor brands. Categories only — to be populated with real,
// confirmed partner names when the vendor network is announced.
const vendors = [
  { name: "Venues", category: "Spaces", note: "Curated Selection" },
  { name: "Florals", category: "Design", note: "Lead Stylists" },
  { name: "Catering", category: "Culinary", note: "Featured Chefs" },
  { name: "Photography", category: "Imagery", note: "Creative Partners" },
  { name: "Stationery", category: "Paper", note: "Hand Calligraphy" },
  { name: "Entertainment", category: "Music", note: "Curated Selection" },
];

const VendorShowcaseSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet bg-card relative overflow-hidden"
      aria-label="Trusted vendor network"
    >
      {/* Parallax watermark */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ x: watermarkX }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[12rem] font-light text-foreground/[0.012] whitespace-nowrap tracking-tight italic">
          Trusted Partners
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14 md:mb-20 items-end">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif-wedding text-sm text-primary/20 font-light">08</span>
                <span className="w-8 h-px bg-primary/15" />
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/40 tracking-[0.2em]">
                  Vendor Network
                </p>
              </div>
              <h2 className="font-serif-wedding text-display-md text-foreground">
                Curated Partners
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-12 h-px bg-primary/20 origin-left mt-4"
              />
            </div>
            <div className="md:col-span-7">
              <p className="font-sans-wedding text-body-sm text-muted-foreground/50 font-light leading-relaxed max-w-sm md:ml-auto">
                Every vendor we work with is hand-selected for excellence, reliability, and shared commitment to creating unforgettable celebrations.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Scroll-linked horizontal rule */}
        <motion.div
          className="h-px mb-0 origin-center"
          style={{
            scaleX: lineScale,
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Editorial vendor grid */}
        <div className="space-y-0">
          {vendors.map((vendor, index) => (
            <motion.div
              key={vendor.name}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
              className="group cursor-default"
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              {/* Top rule with gold shimmer */}
              <div className="h-px bg-border/30 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold)_/_0.15)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>

              <div className="grid grid-cols-12 items-center py-7 md:py-10 hover:bg-primary/[0.015] transition-colors duration-500 -mx-3 px-3 relative">
                {/* Gold left-border reveal on hover */}
                <motion.div
                  className="absolute left-0 top-0 bottom-0 w-[2px] origin-top"
                  style={{ background: "linear-gradient(180deg, hsl(var(--gold)), hsl(var(--primary) / 0.3))" }}
                  initial={{ scaleY: 0 }}
                  animate={{ scaleY: hoveredIndex === index ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                />

                {/* Breathing glow halo on active row */}
                {hoveredIndex === index && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.04, 0] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--gold) / 0.15), transparent 60%)" }}
                    aria-hidden="true"
                  />
                )}

                {/* Index */}
                <div className="col-span-2 md:col-span-1">
                  <span className="font-serif-wedding text-xs text-primary/15 tabular-nums group-hover:text-primary/30 transition-colors duration-500">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                {/* Vendor name */}
                <div className="col-span-5 md:col-span-4">
                  <p className="font-serif-wedding text-xl md:text-2xl font-light text-foreground/40 group-hover:text-foreground/80 transition-colors duration-500 tracking-tight italic">
                    {vendor.name}
                  </p>
                </div>

                {/* Category — gold-traced pill on hover */}
                <div className="col-span-3 md:col-span-3 hidden md:block">
                  <div className="flex items-center gap-3">
                    <motion.span
                      className="w-4 h-px origin-left"
                      style={{ background: hoveredIndex === index ? "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" : "hsl(var(--primary) / 0.2)" }}
                      initial={{ scaleX: 0 }}
                      whileInView={{ scaleX: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.2 + index * 0.05 }}
                    />
                    <span
                      className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-all duration-500 px-2 py-0.5 border border-transparent group-hover:border-primary/15"
                      style={hoveredIndex === index ? { background: "linear-gradient(135deg, hsl(var(--gold) / 0.04), transparent)" } : undefined}
                    >
                      {vendor.category}
                    </span>
                  </div>
                </div>

                {/* Note + arrow */}
                <div className="col-span-5 md:col-span-4 flex items-center justify-end gap-4">
                  <span
                    className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-primary/0 group-hover:text-primary/60 transition-all duration-500 hidden md:inline-flex items-center gap-1.5 backdrop-blur-sm px-2.5 py-1 border border-transparent group-hover:border-primary/15"
                    style={hoveredIndex === index ? { background: "linear-gradient(135deg, hsl(var(--gold) / 0.06), hsl(var(--primary) / 0.04))" } : undefined}
                  >
                    <motion.span
                      className="w-1 h-1 rounded-full shrink-0"
                      style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.15))" }}
                      animate={hoveredIndex === index ? { opacity: [0.4, 1, 0.4] } : { opacity: 0 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    />
                    {vendor.note}
                  </span>
                  <span className="font-sans-wedding text-sm text-muted-foreground/0 group-hover:text-muted-foreground/25 transition-all duration-500 translate-x-0 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          <div className="h-px bg-border/30" />
        </div>

        {/* Bottom ornament */}
        <ScrollReveal delay={0.3}>
          <div className="flex items-center justify-center gap-4 mt-12 md:mt-16" aria-hidden="true">
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="w-10 h-px origin-right"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--border) / 0.3))" }}
            />
            <span
              className="w-2 h-2 rotate-45"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))" }}
            />
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="w-10 h-px origin-left"
              style={{ background: "linear-gradient(90deg, hsl(var(--border) / 0.3), transparent)" }}
            />
          </div>
          <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground/60 text-center mt-4">
            Partnerships built on trust & shared excellence
          </p>

          {/* Editorial credential strip */}
          <div className="flex items-center justify-center gap-6 mt-8">
            {["Vetted & Verified", "Exclusive Rates", "Shared Values"].map((cred, i) => (
              <motion.span
                key={cred}
                initial={{ opacity: 0, y: 6 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.8 + i * 0.1 }}
                className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-muted-foreground/60 px-3 py-1 border border-border/25"
                style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.02), transparent)" }}
              >
                {cred}
              </motion.span>
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default VendorShowcaseSection;
