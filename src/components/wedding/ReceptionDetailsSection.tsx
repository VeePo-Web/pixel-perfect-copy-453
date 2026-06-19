import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { useEffect, useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import tablescapeVideo from "@/assets/reception-tablescape.mov.asset.json";
import flatlayAsset from "@/assets/reception-flatlay.jpg.asset.json";
import longtableAsset from "@/assets/reception-longtable.jpg.asset.json";
import detailTileAsset from "@/assets/reception-detail-tile.jpg.asset.json";

/**
 * ReceptionDetailsSection
 * Editorial three-column reception beat:
 *   Left   — looping ambient tablescape video (warm-cream grade, slow)
 *   Center — overhead flat-lay hero still + headline copy
 *   Right  — long-table perspective still, vignetted + soft-blur top third
 * Below: a quiet "memorabilia" micro-row of small detail tiles.
 * Film-index mark RC · 02.
 */
const ReceptionDetailsSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const prefersReducedMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const leftY = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const rightY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = 0.5;
  }, []);

  const warmFilter = "saturate(0.92) contrast(1.04) brightness(1.02) sepia(0.05)";

  return (
    <section
      ref={sectionRef}
      aria-label="Reception details"
      className="relative bg-background py-section-mobile md:py-section-tablet lg:py-section-desktop overflow-hidden"
      style={{ contain: "layout style" }}
    >
      {/* Large decorative watermark */}
      <motion.div
        className="absolute -left-10 top-1/4 pointer-events-none select-none"
        style={{ y: prefersReducedMotion ? 0 : watermarkY }}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.02 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[14rem] md:text-[20rem] font-light text-foreground leading-none tracking-tight whitespace-nowrap">
          Reception
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-7xl relative">
        {/* Eyebrow */}
        <ScrollReveal>
          <div className="flex items-center gap-4 mb-12 md:mb-16">
            <span
              className="w-1.5 h-1.5 rotate-45 shrink-0"
              style={{
                background:
                  "linear-gradient(135deg, hsl(var(--gold) / 0.45), hsl(var(--gold) / 0.12))",
              }}
              aria-hidden="true"
            />
            <p className="font-overline text-muted-foreground">
              Reception · RC · 02
            </p>
            <motion.span
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.9, delay: 0.2 }}
              className="flex-1 h-px origin-left"
              style={{
                background:
                  "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)",
              }}
              aria-hidden="true"
            />
          </div>
        </ScrollReveal>

        {/* Three-column editorial row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-stretch">
          {/* Left — looping tablescape video, 4:5 portrait */}
          <motion.div
            className="md:col-span-4 relative group"
            style={{ y: prefersReducedMotion ? 0 : leftY }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
              {prefersReducedMotion ? (
                <img
                  src={flatlayAsset.url}
                  alt=""
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: warmFilter }}
                  loading="lazy"
                />
              ) : (
                <video
                  ref={videoRef}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ filter: warmFilter }}
                  src={tablescapeVideo.url}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              )}
              {/* Cream wash on hover */}
              <div
                className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                style={{
                  background:
                    "linear-gradient(180deg, transparent 60%, hsl(var(--background) / 0.25))",
                }}
                aria-hidden="true"
              />
              {/* Gold corner accents */}
              <CornerAccents />
              {/* Tag */}
              <span
                className="absolute bottom-4 left-4 z-10 font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/75"
                aria-hidden="true"
              >
                Tablescape · Motion
              </span>
            </div>
          </motion.div>

          {/* Center — flat-lay hero + copy */}
          <div className="md:col-span-4 flex flex-col">
            <ScrollReveal>
              <div className="relative aspect-square overflow-hidden bg-muted/20 group">
                <img
                  src={flatlayAsset.url}
                  alt="Overhead reception place setting with gold-leaf charger, dove-blue napkin and floral centerpiece"
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.4s]"
                  loading="lazy"
                />
                <CornerAccents />
                <span
                  className="absolute bottom-4 left-4 z-10 font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/75"
                  aria-hidden="true"
                >
                  Place Setting · Overhead
                </span>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.15}>
              <div className="mt-8 md:mt-10 px-1">
                <h2 className="font-serif-wedding text-display-sm md:text-display-md text-foreground leading-[1.15]">
                  Welcomed{" "}
                  <em className="font-script text-primary/75">by name.</em>
                </h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-10 h-px my-5 origin-left"
                  style={{
                    background:
                      "linear-gradient(90deg, hsl(var(--gold) / 0.45), transparent)",
                  }}
                  aria-hidden="true"
                />
                <p className="font-sans-wedding text-body-sm text-muted-foreground font-light leading-relaxed max-w-sm">
                  Every place setting considered. Every charger, every taper,
                  every pressed napkin — placed with the quiet precision your
                  guests will feel before they can name it.
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Right — long-table perspective, 4:5 with vignette + soft-blur top */}
          <motion.div
            className="md:col-span-4 relative group"
            style={{ y: prefersReducedMotion ? 0 : rightY }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-muted/20">
              <img
                src={longtableAsset.url}
                alt="Long farmhouse reception table with floating candles, gauze runner and floral centerpieces"
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-[1.4s]"
                loading="lazy"
              />
              {/* Top-third soft blur veil — mutes venue background */}
              <div
                className="absolute top-0 left-0 right-0 h-[34%] pointer-events-none backdrop-blur-[2px]"
                style={{
                  background:
                    "linear-gradient(180deg, hsl(var(--background) / 0.45), hsl(var(--background) / 0.1))",
                  WebkitMaskImage:
                    "linear-gradient(180deg, black 60%, transparent)",
                  maskImage:
                    "linear-gradient(180deg, black 60%, transparent)",
                }}
                aria-hidden="true"
              />
              {/* Vignette */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at 50% 60%, transparent 40%, hsl(var(--foreground) / 0.35) 100%)",
                }}
                aria-hidden="true"
              />
              <CornerAccents />
              <span
                className="absolute bottom-4 left-4 z-10 font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/80"
                aria-hidden="true"
              >
                Long Table · Candlelight
              </span>
            </div>
          </motion.div>
        </div>

        {/* Memorabilia micro-row */}
        <ScrollReveal delay={0.1}>
          <div className="mt-20 md:mt-28 pt-10 border-t border-border/25 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8 items-center">
            {/* Tiny typographic mark */}
            <div className="md:col-span-4 flex items-center gap-4">
              <span
                className="w-1.5 h-1.5 rotate-45 shrink-0"
                style={{
                  background:
                    "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))",
                }}
                aria-hidden="true"
              />
              <p className="font-serif-wedding italic text-muted-foreground text-body-sm">
                Memorabilia — small marks of an evening.
              </p>
            </div>

            {/* Detail tile — IMG_7123 desaturated crop */}
            <div className="md:col-span-3 relative aspect-[3/4] overflow-hidden bg-muted/20 group max-w-[200px] md:max-w-none">
              <img
                src={detailTileAsset.url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  // Crop tight to the wooden table-number + votives on linen
                  objectPosition: "52% 62%",
                  transform: "scale(2.2)",
                  filter: "saturate(0.35) contrast(1.05) brightness(0.96)",
                }}
                loading="lazy"
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(ellipse at center, transparent 45%, hsl(var(--foreground) / 0.35) 100%)",
                }}
                aria-hidden="true"
              />
              <CornerAccents small />
              <span
                className="absolute bottom-3 left-3 z-10 font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/70"
                aria-hidden="true"
              >
                Detail · 008
              </span>
            </div>

            {/* Long quiet rule + index */}
            <div className="md:col-span-5 flex items-center gap-5">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.15 }}
                className="flex-1 h-px origin-left"
                style={{
                  background:
                    "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)",
                }}
                aria-hidden="true"
              />
              <span className="font-sans-wedding text-caption tracking-[0.3em] uppercase text-muted-foreground tabular-nums">
                RC · 02 / Reception
              </span>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/** Gold corner-accent frame used across reception tiles. */
const CornerAccents = ({ small = false }: { small?: boolean }) => {
  const size = small ? "w-6 h-6" : "w-10 h-10";
  return (
    <>
      <div
        className={`absolute top-3 left-3 ${size} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}
        aria-hidden="true"
      >
        <span
          className="absolute top-0 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
        <span
          className="absolute top-0 left-0 h-full w-px"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
      </div>
      <div
        className={`absolute top-3 right-3 ${size} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}
        aria-hidden="true"
      >
        <span
          className="absolute top-0 right-0 w-full h-px"
          style={{
            background:
              "linear-gradient(270deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
        <span
          className="absolute top-0 right-0 h-full w-px"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
      </div>
      <div
        className={`absolute bottom-3 left-3 ${size} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}
        aria-hidden="true"
      >
        <span
          className="absolute bottom-0 left-0 w-full h-px"
          style={{
            background:
              "linear-gradient(90deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
        <span
          className="absolute bottom-0 left-0 h-full w-px"
          style={{
            background:
              "linear-gradient(0deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
      </div>
      <div
        className={`absolute bottom-3 right-3 ${size} opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10`}
        aria-hidden="true"
      >
        <span
          className="absolute bottom-0 right-0 w-full h-px"
          style={{
            background:
              "linear-gradient(270deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
        <span
          className="absolute bottom-0 right-0 h-full w-px"
          style={{
            background:
              "linear-gradient(0deg, hsl(var(--gold) / 0.45), transparent)",
          }}
        />
      </div>
    </>
  );
};

export default ReceptionDetailsSection;
