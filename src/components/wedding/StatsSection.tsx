import { useRef, useEffect, useState } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import BreathingDiamond from "./BreathingDiamond";

// Stats reflect owner-confirmed 2026 booking status (5.5). Mirrors ApproachStatsRibbon
// so the home and approach pages tell the same story. Update only when Meg confirms new metrics.
const stats = [
  { value: 2026, suffix: "", label: "Season Fully Booked", detail: "Summer & fall" },
  { value: 2027, suffix: "", label: "Now Booking", detail: "Two-person team standard" },
  { value: 1, suffix: "", label: "Editorial Styled Shoot", detail: "August 15, 2026" },
  { value: 48, suffix: "hr", label: "Inquiry Response", detail: "Within 24–48 business hours" },
];

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const AnimatedCounter = ({
  target,
  suffix,
  duration = 2.4,
}: {
  target: number;
  suffix: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const startTime = performance.now();
    const durationMs = duration * 1000;

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = easeOutQuart(progress);
      setCount(Math.round(eased * target));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setFinished(true);
      }
    };

    requestAnimationFrame(animate);
  }, [isInView, target, duration]);

  return (
    <span ref={ref} className="tabular-nums relative inline-block">
      {count}
      {suffix}
      {/* Gold flash on completion */}
      {finished && (
        <motion.span
          className="absolute inset-0 pointer-events-none"
          initial={{ opacity: 0.4 }}
          animate={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), transparent)",
          }}
        />
      )}
    </span>
  );
};

const StatsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const monogramY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const horizontalRuleScale = useTransform(scrollYProgress, [0.1, 0.4], [0, 1]);
  const bgOpacity = useTransform(scrollYProgress, [0.1, 0.5, 0.9], [0.97, 1, 0.97]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet bg-foreground relative overflow-hidden"
      aria-label="Our impact"
    >
      {/* Subtle grain texture */}
      <div
        className="absolute inset-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
        }}
        aria-hidden="true"
      />

      {/* Scroll-linked vertical accent line (desktop) */}
      <motion.div
        className="absolute left-6 md:left-12 top-0 bottom-0 w-px hidden md:block origin-top pointer-events-none"
        style={{
          scaleY: horizontalRuleScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.2) 30%, hsl(var(--gold) / 0.08) 70%, transparent)",
        }}
        aria-hidden="true"
      />

      {/* Parallax monogram with breathing gold glow */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ y: monogramY, opacity: bgOpacity }}
      >
        <motion.span
          className="font-script text-[14rem] md:text-[22rem] text-background/[0.02] select-none leading-none relative"
          aria-hidden="true"
          animate={{ textShadow: ["0 0 60px hsl(var(--gold) / 0.02)", "0 0 120px hsl(var(--gold) / 0.05)", "0 0 60px hsl(var(--gold) / 0.02)"] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          &
        </motion.span>
      </motion.div>

      {/* Section index watermark */}
      <motion.div
        className="absolute top-8 left-8 md:left-16 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-7xl md:text-8xl font-light text-background/[0.03]">
          07
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-end mb-16 md:mb-24">
            <div className="md:col-span-5">
              <div className="flex items-center gap-4 mb-4">
                <span className="w-5 h-px bg-background/15" />
                <p className="font-sans-wedding text-label uppercase text-background/25 tracking-[0.2em]">
                  By the Numbers
                </p>
              </div>
              <h2 className="font-serif-wedding text-display-md text-background/60 font-light">
                The Story So Far
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
              <p className="font-sans-wedding text-body-sm text-background/25 font-light leading-relaxed max-w-sm md:ml-auto">
                Every number here represents a couple who trusted us with their most important day — and walked away grateful they did.
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Scroll-linked horizontal divider */}
        <motion.div
          className="h-px mb-12 md:mb-16 origin-center"
          style={{
            scaleX: horizontalRuleScale,
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25), hsl(var(--primary) / 0.15), transparent)",
          }}
          aria-hidden="true"
        />

        {/* Editorial ruled stat rows */}
        <div className="space-y-0">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.6,
                delay: index * 0.1,
                ease: [0.25, 0.1, 0.25, 1],
              }}
              className="group cursor-default"
            >
              {/* Top rule with gold accent on hover */}
              <div className="h-px bg-background/[0.06] group-hover:bg-background/[0.1] transition-colors duration-500 relative overflow-hidden">
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-[hsl(var(--gold)_/_0.15)] to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>

              <div className="grid grid-cols-12 items-center py-10 md:py-14 hover:bg-background/[0.015] transition-colors duration-700">
                {/* Icon + Index */}
                <div className="col-span-2 md:col-span-1 flex flex-col items-center gap-2">
                  <span className="font-serif-wedding text-xs text-background/10 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className="w-2 h-2 rotate-45 group-hover:scale-125 transition-transform duration-500"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))",
                    }}
                  />
                </div>

                {/* Big number */}
                <div className="col-span-5 md:col-span-4">
                  <p className="font-serif-wedding text-6xl md:text-7xl lg:text-8xl font-light text-background/90 leading-none tracking-tight group-hover:text-background transition-colors duration-500">
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                </div>

                {/* Label + Detail */}
                <div className="col-span-5 md:col-span-7 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <motion.span
                        className="w-6 h-px bg-primary/40 origin-left group-hover:w-10 transition-all duration-500"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
                      />
                      <p className="font-sans-wedding text-label uppercase text-background/40 group-hover:text-background/60 transition-colors duration-500">
                        {stat.label}
                      </p>
                    </div>
                    <p className="font-sans-wedding text-xs text-background/20 font-light italic pl-9 group-hover:text-background/30 transition-colors duration-500">
                      {stat.detail}
                    </p>
                  </div>

                  {/* Hover-reveal arrow */}
                  <span className="hidden md:block font-serif-wedding text-sm text-background/0 group-hover:text-background/20 transition-all duration-500 translate-x-0 group-hover:translate-x-1">
                    →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
          {/* Final rule */}
          <div className="h-px bg-background/[0.06]" />
        </div>

        {/* Editorial footnote row */}
        <ScrollReveal delay={0.4}>
          <div className="mt-14 md:mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 relative">
            {/* Connecting diamond ornaments between columns (desktop) */}
            {[0, 1].map((i) => (
              <motion.div
                key={`connector-${i}`}
                className="absolute top-1/2 -translate-y-1/2 hidden md:flex items-center justify-center"
                style={{ left: `${((i + 1) * 100) / 3}%`, transform: "translate(-50%, -50%)" }}
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.7 + i * 0.15 }}
              >
                <span
                  className="w-1.5 h-1.5 rotate-45"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }}
                />
              </motion.div>
            ))}
            {[
              { label: "Edmonton & Area", note: "Primary Service Region" },
              { label: "Surrounding Alberta", note: "Travel Fees Apply Outside Greater Edmonton" },
              { label: "Growing Vendor Network", note: "Trusted Partnerships Across Alberta" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                className="text-center pt-6 group/foot cursor-default relative overflow-hidden"
              >
                {/* Gold-gradient top rule */}
                <motion.div
                  className="h-px absolute top-0 left-0 right-0 origin-center"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15), transparent)" }}
                />
                {/* Hover shimmer */}
                <div
                  className="absolute inset-0 -translate-x-full group-hover/foot:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"
                  style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.03) 40%, hsl(var(--gold) / 0.06) 50%, hsl(var(--gold) / 0.03) 60%, transparent 100%)" }}
                />
                <p className="font-serif-wedding text-sm text-background/60 italic group-hover/foot:text-background/70 transition-colors duration-500">{item.label}</p>
                <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-background/50 mt-1 group-hover/foot:text-background/60 transition-colors duration-500">{item.note}</p>
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        {/* Premium editorial credential bar */}
        <ScrollReveal delay={0.5}>
          <div className="mt-12 md:mt-16 border-t border-background/[0.06] pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="w-10 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), transparent)" }} />
                <p className="font-serif-wedding text-xs italic text-background/15">
                  Quality over quantity — always.
                </p>
              </div>
              <div className="flex items-center gap-6">
                {["2026 Season Booked", "Editorial Shoot Aug 2026", "Intentionally Limited"].map((cred, i) => (
                  <motion.span
                    key={cred}
                    initial={{ opacity: 0, y: 4 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 + i * 0.1, duration: 0.4 }}
                    className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-background/50 flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }} />
                    {cred}
                  </motion.span>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Breathing diamond section closer */}
        <ScrollReveal delay={0.6}>
          <div className="mt-12 md:mt-16 flex justify-center">
            <BreathingDiamond size={10} />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default StatsSection;
