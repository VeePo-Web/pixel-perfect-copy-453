import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ceremonyImage from "@/assets/ceremony-setup.jpg";
import firstDanceImage from "@/assets/first-dance.jpg";
import detailImage from "@/assets/detail-placecard.jpg";
import bouquetImage from "@/assets/portfolio-bouquet.jpg";
import receptionImage from "@/assets/portfolio-reception.jpg";

// Aesthetic direction only. No fabricated couples / venues / dates / narrative captions.
const slides = [
  { src: ceremonyImage, alt: "Ceremony arch", label: "Ceremony" },
  { src: detailImage, alt: "Place setting detail", label: "Details" },
  { src: receptionImage, alt: "Reception table", label: "Reception" },
  { src: bouquetImage, alt: "Bridal bouquet", label: "Florals" },
  { src: firstDanceImage, alt: "Reception under string lights", label: "Celebration" },
];

const FilmstripSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["5%", "-30%"]);
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);
  const sprocketX = useTransform(scrollYProgress, [0, 1], ["0%", "-8%"]);
  const frameCounterOpacity = useTransform(scrollYProgress, [0.1, 0.3, 0.8, 0.95], [0, 1, 1, 0]);

  return (
    <section
      ref={sectionRef}
      className="py-16 md:py-24 bg-card overflow-hidden relative"
      aria-label="Wedding filmstrip gallery"
    >
      {/* Cinematic grain overlay */}
      <div
        className="absolute inset-0 opacity-[0.012] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px",
        }}
        aria-hidden="true"
      />

      {/* Vignette edges */}
      <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: "inset 0 0 120px 40px hsl(var(--card) / 0.6)" }} aria-hidden="true" />

      {/* Parallax watermark */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ x: watermarkX }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">
          Moments
        </span>
      </motion.div>

      {/* Section header */}
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl mb-12 md:mb-16 relative">
        <div className="flex items-center gap-4 mb-4">
          <span className="font-serif-wedding text-sm text-primary/60 font-light">08</span>
          <span className="w-8 h-px bg-primary/30" />
          <p className="font-sans-wedding text-label uppercase text-muted-foreground tracking-[0.2em]">
            Selected Moments
          </p>
          <span className="flex-1 h-px bg-border/30 hidden md:block" />
          <span className="font-sans-wedding text-caption tracking-[0.15em] text-muted-foreground/60 tabular-nums hidden md:block">
            {String(slides.length).padStart(2, "0")} Frames
          </span>
        </div>
      </div>

      {/* Film sprocket holes — top (with parallax) */}
      <motion.div
        className="flex gap-[3.6rem] md:gap-[5.2rem] pl-6 md:pl-16 mb-3 overflow-hidden"
        style={{ x: sprocketX }}
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={`top-${i}`}
            className="w-3 h-2 rounded-sm shrink-0"
            style={{ background: "hsl(var(--foreground) / 0.03)" }}
            whileInView={{ boxShadow: i % 3 === 0 ? "0 0 6px 1px hsl(var(--gold) / 0.08)" : "none" }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          />
        ))}
      </motion.div>

      {/* Horizontal filmstrip */}
      <motion.div
        className="flex gap-5 md:gap-8 pl-6 md:pl-16"
        style={{ x }}
      >
        {slides.map((slide, i) => (
          <div
            key={slide.label}
            className="relative shrink-0 w-[75vw] md:w-[38vw] lg:w-[30vw] group"
          >
            {/* Gold film-gate border overlay */}
            <div className="absolute inset-0 z-10 pointer-events-none">
              <div
                className="absolute top-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.12), hsl(var(--gold) / 0.03))" }}
              />
              <div
                className="absolute bottom-0 left-0 right-0 h-[3px]"
                style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.03), hsl(var(--gold) / 0.12))" }}
              />
              <div
                className="absolute top-0 bottom-0 left-0 w-[2px]"
                style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.1), transparent 30%, transparent 70%, hsl(var(--gold) / 0.1))" }}
              />
              <div
                className="absolute top-0 bottom-0 right-0 w-[2px]"
                style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.1), transparent 30%, transparent 70%, hsl(var(--gold) / 0.1))" }}
              />
            </div>
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={slide.src}
                alt={slide.alt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              {/* Cinematic gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Breathing gold glow on hover — active frame indicator */}
              <motion.div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                aria-hidden="true"
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{ opacity: [0, 0.06, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(ellipse at 50% 70%, hsl(var(--gold) / 0.2), transparent 60%)" }}
                />
              </motion.div>

              {/* Subtle film grain on each frame */}
              <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay grain-overlay" />

              {/* Film frame number overlay */}
              <span
                className="absolute top-3 right-3 font-sans-wedding text-caption tracking-[0.2em] text-white/0 group-hover:text-white/60 transition-colors duration-500 tabular-nums"
                aria-hidden="true"
              >
                FR{String(i + 1).padStart(2, "0")}
              </span>
              {/* Corner frame accents — gold gradient on hover */}
              <div className="absolute top-3 left-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
              </div>
              <div className="absolute bottom-3 right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
              </div>
            </div>

            {/* Editorial caption — aesthetic label only */}
            <div className="mt-4 flex items-start justify-between">
              <p className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-muted-foreground/70">
                {slide.label}
              </p>
              <span className="font-serif-wedding text-xs text-primary/60 mt-0.5 tabular-nums">
                {String(i + 1).padStart(2, "0")}
              </span>
            </div>

            {/* Bottom accent line */}
            <motion.div
              className="h-px bg-primary/15 mt-3 origin-left"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 + i * 0.1 }}
            />
          </div>
        ))}
      </motion.div>

      {/* Film sprocket holes — bottom (with parallax) */}
      <motion.div
        className="flex gap-[3.6rem] md:gap-[5.2rem] pl-6 md:pl-16 mt-3 overflow-hidden"
        style={{ x: sprocketX }}
        aria-hidden="true"
      >
        {Array.from({ length: 24 }).map((_, i) => (
          <motion.div
            key={`bot-${i}`}
            className="w-3 h-2 rounded-sm shrink-0"
            style={{ background: "hsl(var(--foreground) / 0.03)" }}
            whileInView={{ boxShadow: i % 3 === 0 ? "0 0 6px 1px hsl(var(--gold) / 0.08)" : "none" }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.03 }}
          />
        ))}
      </motion.div>

      {/* Floating scroll-linked frame counter — desktop */}
      <motion.div
        className="absolute top-6 right-6 md:right-12 hidden lg:flex items-center gap-3 pointer-events-none"
        style={{ opacity: frameCounterOpacity }}
        aria-hidden="true"
      >
        <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60">
          Scroll to explore
        </span>
        <motion.span
          className="inline-block"
          animate={{ x: [0, 6, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <span className="font-serif-wedding text-xs text-muted-foreground/60">→</span>
        </motion.span>
      </motion.div>

      {/* Bottom editorial attribution — enriched */}
      <div className="container mx-auto px-6 lg:px-8 max-w-5xl mt-10 md:mt-14 relative">
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-px mb-8 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.08), transparent)" }}
        />
        <div className="flex items-center justify-between">
          <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60">
            Hickory & Rose · Selected Works
          </p>
          <div className="flex items-center gap-3">
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15))" }} />
            <span
              className="w-1.5 h-1.5 rotate-45"
              style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))" }}
            />
            <span className="w-8 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.15), transparent)" }} />
          </div>
          <p className="font-sans-wedding text-caption tracking-[0.15em] text-muted-foreground/60 tabular-nums">
            2023 — 2026
          </p>
        </div>
      </div>
    </section>
  );
};

export default FilmstripSection;
