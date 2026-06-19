import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import heroImage from "@/assets/hero-wedding.jpg";
import ceremonyImage from "@/assets/ceremony-setup.jpg";
import detailImage from "@/assets/detail-placecard.jpg";
import firstDanceImage from "@/assets/first-dance.jpg";
import editorialImage from "@/assets/editorial-florals.jpg";
import venueImage from "@/assets/portfolio-venue.jpg";

// Aesthetic direction only — no fabricated venues, couples, dates, or narrative captions.
// Category is drawn from what the image visually depicts, nothing more.
const photos = [
  { src: heroImage, alt: "Reception tablescape", category: "Reception" },
  { src: detailImage, alt: "Place setting detail", category: "Details" },
  { src: editorialImage, alt: "Floral arrangement", category: "Florals" },
  { src: ceremonyImage, alt: "Ceremony arch", category: "Ceremony" },
  { src: firstDanceImage, alt: "Reception under string lights", category: "Reception" },
  { src: venueImage, alt: "Venue at twilight", category: "Venue" },
];

/* Editorial masonry spans — asymmetric for visual interest */
const masonrySpans = [
  "col-span-2 row-span-2",  // Hero — large
  "col-span-1 row-span-1",  // Detail
  "col-span-1 row-span-2",  // Florals — tall
  "col-span-1 row-span-1",  // Ceremony
  "col-span-1 row-span-1",  // First Dance
  "col-span-2 row-span-1",  // Venue — wide
];

const GallerySection = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const verticalRuleScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  const navigate = useCallback(
    (dir: 1 | -1) => {
      if (selectedIndex === null) return;
      setSelectedIndex((selectedIndex + dir + photos.length) % photos.length);
    },
    [selectedIndex]
  );

  useEffect(() => {
    if (selectedIndex === null) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedIndex(null);
      if (e.key === "ArrowRight") navigate(1);
      if (e.key === "ArrowLeft") navigate(-1);
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handler);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handler);
    };
  }, [selectedIndex, navigate]);

  return (
    <>
      <section ref={sectionRef} className="bg-background py-20 md:py-32 relative overflow-hidden">
        {/* Parallax watermark */}
        <motion.div
          className="absolute -right-4 top-1/3 pointer-events-none select-none"
          style={{ y: watermarkY }}
          aria-hidden="true"
        >
          <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] leading-none whitespace-nowrap tracking-tight italic">
            Gallery
          </span>
        </motion.div>

        {/* Scroll-linked vertical accent */}
        <motion.div
          className="absolute left-6 md:left-12 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent hidden lg:block"
          style={{ scaleY: verticalRuleScale, transformOrigin: "top" }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 relative">
          <ScrollReveal>
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-12 md:mb-16 gap-6 max-w-5xl mx-auto">
              <div>
                <div className="flex items-center gap-4 mb-4">
                  <span className="font-serif-wedding text-sm text-primary/60 font-light">02</span>
                  <span className="w-8 h-px bg-primary/15" />
                  <p className="font-sans-wedding text-label uppercase text-muted-foreground tracking-[0.2em]">
                    Some Favorites
                  </p>
                </div>
                <h2 className="font-serif-wedding text-display-lg text-foreground">
                  Moments Together
                </h2>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="w-16 h-px bg-primary/20 origin-left mt-4"
                />
              </div>
              <p className="font-sans-wedding text-body-sm text-muted-foreground font-light max-w-xs md:text-right leading-relaxed">
                A curated collection of details, emotions, and the quiet beauty we help bring to life.
              </p>
            </div>
          </ScrollReveal>

          {/* Editorial masonry grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[180px] md:auto-rows-[220px] gap-3 md:gap-4 max-w-5xl mx-auto">
            {photos.map((photo, index) => (
              <ImageReveal
                key={index}
                delay={index * 0.08}
                direction={index % 2 === 0 ? "up" : "left"}
                className={masonrySpans[index]}
              >
                <button
                  onClick={() => setSelectedIndex(index)}
                  className="w-full h-full overflow-hidden cursor-pointer group block relative"
                  data-cursor-hover
                  data-cursor-label="View"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                    decoding="async"
                    width={800}
                    height={600}
                  />

                  {/* Cinematic gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-foreground/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Corner frame accents — gold gradient */}
                  <div className="absolute top-3 left-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                    <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                    <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  </div>
                  <div className="absolute bottom-3 right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
                    <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                    <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  </div>

                  {/* Hover overlay — aesthetic category only */}
                  <div className="absolute inset-0 flex flex-col justify-end p-4 md:p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <span className="absolute top-4 left-4 font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/60 bg-white/10 backdrop-blur-sm px-2.5 py-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                      {photo.category}
                    </span>
                  </div>

                  {/* Frame index */}
                  <span className="absolute top-3 right-3 font-serif-wedding text-caption text-white/0 group-hover:text-white/60 transition-colors duration-500 tabular-nums">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </button>
              </ImageReveal>
            ))}
          </div>

          {/* Bottom ornament with breathing diamond */}
          <ScrollReveal delay={0.3}>
            <div className="flex items-center justify-center gap-4 mt-12 md:mt-16" aria-hidden="true">
              <motion.span
                className="w-12 h-px"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25))" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              />
              <motion.span
                className="w-2 h-2 rotate-45"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.12))",
                  boxShadow: "0 0 10px 3px hsl(var(--gold) / 0.1)",
                }}
                animate={{ opacity: [0.4, 0.8, 0.4], scale: [0.9, 1.15, 0.9] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              />
              <motion.span
                className="w-12 h-px"
                style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.1 }}
              />
            </div>
            {/* Editorial credential strip */}
            <div className="flex items-center justify-center gap-6 mt-6">
              {["Aesthetic Direction", "Refined Rustic Elegance"].map((label, i) => (
                <motion.span
                  key={label}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground flex items-center gap-2"
                >
                  {i > 0 && <span className="w-1 h-1 rotate-45" style={{ background: "hsl(var(--gold) / 0.15)" }} />}
                  {label}
                </motion.span>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Enhanced Lightbox with editorial metadata */}
      <AnimatePresence>
        {selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="fixed inset-0 z-[80] bg-foreground/97 backdrop-blur-md flex items-center justify-center"
            onClick={() => setSelectedIndex(null)}
            role="dialog"
            aria-label="Image lightbox"
          >
            {/* Cinematic letterbox bars */}
            <motion.div
              className="absolute top-0 left-0 right-0 bg-black z-20"
              initial={{ height: "50%" }}
              animate={{ height: "8%" }}
              exit={{ height: "50%" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />
            <motion.div
              className="absolute bottom-0 left-0 right-0 bg-black z-20"
              initial={{ height: "50%" }}
              animate={{ height: "8%" }}
              exit={{ height: "50%" }}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {/* Gold accent line at top letterbox edge */}
            <motion.div
              className="absolute top-[8%] left-0 right-0 h-px z-30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.25), transparent)" }}
            />
            <motion.div
              className="absolute bottom-[8%] left-0 right-0 h-px z-30"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.25), transparent)" }}
            />

            <button
              onClick={() => setSelectedIndex(null)}
              className="absolute top-10 right-6 text-background/40 hover:text-background/80 transition-colors z-30"
              aria-label="Close lightbox"
            >
              <X size={20} strokeWidth={1} />
            </button>

            <button
              onClick={(e) => { e.stopPropagation(); navigate(-1); }}
              className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 text-background/20 hover:text-background/60 transition-colors z-30"
              aria-label="Previous image"
            >
              <ChevronLeft size={28} strokeWidth={1} />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); navigate(1); }}
              className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 text-background/20 hover:text-background/60 transition-colors z-30"
              aria-label="Next image"
            >
              <ChevronRight size={28} strokeWidth={1} />
            </button>

            <AnimatePresence mode="wait">
              <motion.div
                key={selectedIndex}
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
                className="flex flex-col items-center max-w-4xl relative z-10"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Gold-traced border frame */}
                <div className="relative">
                  <div
                    className="absolute -inset-[1px] pointer-events-none z-10"
                    style={{
                      border: "1px solid transparent",
                      borderImage: "linear-gradient(135deg, hsl(var(--gold) / 0.2), transparent 30%, transparent 70%, hsl(var(--gold) / 0.15)) 1",
                    }}
                  />
                  <img
                    src={photos[selectedIndex].src}
                    alt={photos[selectedIndex].alt}
                    className="max-w-full max-h-[70vh] object-contain"
                  />
                </div>

                {/* Lightbox — aesthetic category only */}
                <motion.div
                  className="mt-8 text-center"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.5 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="w-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.2))" }} />
                    <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-background/50">
                      {photos[selectedIndex].category}
                    </span>
                    <span className="w-6 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold, 38 60% 55%) / 0.2), transparent)" }} />
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom counter with progress dots */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-5 z-30">
              <div className="flex items-center gap-2">
                {photos.map((_, i) => (
                  <button
                    key={i}
                    onClick={(e) => { e.stopPropagation(); setSelectedIndex(i); }}
                    className={`w-1.5 h-1.5 rounded-full transition-all duration-300 ${
                      i === selectedIndex ? "bg-background/50 scale-125" : "bg-background/15 hover:bg-background/30"
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
              <span className="w-px h-3 bg-background/10" />
              <span className="font-script text-xs text-background/10">H&R</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default GallerySection;
