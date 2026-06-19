import { useRef, useState, useEffect, useCallback, memo } from "react";
import { motion, useInView } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import BreathingDiamond from "./BreathingDiamond";

// Honest, owner-confirmed status (brand-identity §5.5 / §3.25). No fabricated
// wedding counts, vendor metrics, or year founded until verified.
const stats = [
  { value: 2026, suffix: "", label: "Season Fully Booked", detail: "Summer & fall" },
  { value: 2027, suffix: "", label: "Now Booking", detail: "Two-person team standard" },
  { value: 1, suffix: "", label: "Editorial Styled Shoot", detail: "August 15, 2026" },
  { value: 48, suffix: "hr", label: "Inquiry Response", detail: "Within 24–48 business hours" },
];

const easeOutQuart = (t: number) => 1 - Math.pow(1 - t, 4);

const AnimatedCounter = memo(({ target, suffix }: { target: number; suffix: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [display, setDisplay] = useState("0");

  const animate = useCallback(() => {
    const duration = 2200;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      setDisplay(String(Math.round(eased * target)));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [target]);

  useEffect(() => {
    if (isInView) animate();
  }, [isInView, animate]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
      {suffix}
    </span>
  );
});
AnimatedCounter.displayName = "AnimatedCounter";

const ApproachStatsRibbon = () => (
  <section className="py-14 md:py-20 bg-card relative overflow-hidden grain-overlay" aria-label="By the Numbers">
    {/* Ambient glow */}
    <div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
      style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.06), transparent 70%)" }}
      aria-hidden="true"
    />

    <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
      <ScrollReveal>
        <p className="font-overline text-muted-foreground/50 text-center mb-10">By the Numbers</p>
      </ScrollReveal>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
        {stats.map((stat, i) => (
          <ScrollReveal key={stat.label} delay={i * 0.1}>
            <div className="text-center group">
              <span
                className="font-serif-wedding text-display-lg block mb-1"
                style={{
                  background: "linear-gradient(180deg, hsl(var(--gold) / 0.55), hsl(var(--gold) / 0.2))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </span>
              <p className="font-sans-wedding text-body-sm text-foreground/70 font-light">{stat.label}</p>
              <p className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/60 mt-1">
                {stat.detail}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Terminal breathing diamond */}
      <div className="flex justify-center mt-12">
        <BreathingDiamond size={8} />
      </div>

      {/* Bottom rule */}
      <motion.div
        className="h-px mt-10 origin-center"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15), transparent)" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
      />
    </div>
  </section>
);

export default ApproachStatsRibbon;
