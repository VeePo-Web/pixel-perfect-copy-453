import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect, useCallback } from "react";
import ScrollReveal from "./ScrollReveal";
import BreathingDiamond from "./BreathingDiamond";
import inquireImage from "@/assets/inquire-editorial.jpg";

const seasonSlots = [
  { season: "Spring 2026", status: "Limited", accent: true },
  { season: "Summer 2026", status: "2 Spots Left", accent: true },
  { season: "Autumn 2026", status: "Now Booking", accent: false },
];

const PreFooterDivider = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeSeason, setActiveSeason] = useState(0);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["5%", "-5%"]);

  const advanceSeason = useCallback(() => {
    setActiveSeason((i) => (i + 1) % seasonSlots.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(advanceSeason, 3500);
    return () => clearInterval(timer);
  }, [advanceSeason]);

  return (
    <section
      ref={sectionRef}
      className="py-24 md:py-32 bg-background relative overflow-hidden"
      aria-label="Booking prompt"
    >
      {/* Parallax watermark */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: watermarkY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.025 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-serif-wedding text-[14rem] md:text-[22rem] text-foreground leading-none tracking-tight whitespace-nowrap">
          Inquire
        </span>
      </motion.div>

      {/* Decorative script ampersand */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-script text-[16rem] md:text-[22rem] text-foreground leading-none">
          &
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
          {/* Left — editorial image inset (desktop only) */}
          <motion.div
            className="lg:col-span-4 hidden lg:block"
            initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="aspect-[3/4] overflow-hidden relative group">
              <motion.img
                src={inquireImage}
                alt="Elegant wedding stationery detail with florals"
                className="w-full h-[120%] object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                style={{ y: imageY }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
              {/* Gold gradient corner accents */}
              <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
              </div>
              <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
              </div>
            </div>
          </motion.div>

          {/* Right — content */}
          <div className="lg:col-span-8 text-center lg:text-left">
            <ScrollReveal>
              {/* Top ornamental line — scroll-linked */}
              <motion.div
                className="w-24 h-px mx-auto lg:mx-0 mb-6 origin-center lg:origin-left"
                style={{
                  scaleX: lineScale,
                  background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.35), transparent)",
                }}
              />

              {/* Breathing diamond ornament */}
              <div className="flex justify-center lg:justify-start mb-6">
                <BreathingDiamond size={10} />
              </div>

              <p className="font-overline text-muted-foreground/35 mb-6">
                Limited Availability
              </p>

              <p className="font-serif-wedding text-display-md text-foreground/70 italic leading-relaxed mb-4">
                Currently accepting a limited number of weddings for 2025 & 2026.
              </p>

              <p className="font-sans-wedding text-body-sm text-muted-foreground/40 font-light mb-4 max-w-md mx-auto lg:mx-0">
                We take on a curated number of couples each season to ensure every
                wedding receives our full attention and care.
              </p>

              {/* Rotating seasonal availability ticker */}
              <div className="mb-6 flex items-center justify-center lg:justify-start gap-4">
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.7), hsl(var(--gold) / 0.2))" }} />
                <div className="h-5 overflow-hidden relative">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={activeSeason}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.35 }}
                      className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-foreground/60 font-light inline-block"
                    >
                      {seasonSlots[activeSeason].season} — <span className={seasonSlots[activeSeason].accent ? "text-primary/60" : "text-muted-foreground/40"}>{seasonSlots[activeSeason].status}</span>
                    </motion.span>
                  </AnimatePresence>
                </div>
                <div className="flex gap-1.5">
                  {seasonSlots.map((_, i) => (
                    <span
                      key={i}
                      className={`w-4 h-[1.5px] transition-all duration-400 ${i === activeSeason ? "" : "bg-border/30"}`}
                      style={i === activeSeason ? { background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.2))" } : undefined}
                    />
                  ))}
                </div>
              </div>

              {/* Trust signals */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mb-8">
                {["Complimentary Discovery Call", "No Commitment Required"].map((signal, i) => (
                  <span
                    key={signal}
                    className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground/60"
                  >
                    {i > 0 && <span className="mr-3">·</span>}
                    {signal}
                  </span>
                ))}
              </div>

              <Link
                to="/inquire"
                className="inline-flex items-center font-overline transition-colors duration-300 group relative"
                style={{
                  background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Check Availability
                <span className="ml-2 group-hover:translate-x-1.5 transition-transform duration-300" style={{ WebkitTextFillColor: "hsl(var(--gold))" }}>
                  →
                </span>
              </Link>

              {/* Bottom ornamental line — scroll-linked */}
              <motion.div
                className="w-24 h-px mx-auto lg:mx-0 mt-10 origin-center lg:origin-left"
                style={{
                  scaleX: lineScale,
                  background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.35), transparent)",
                }}
              />

              {/* Bottom attribution */}
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="font-script text-lg text-primary/10 mt-8"
              >
                Hickory & Rose
              </motion.p>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PreFooterDivider;
