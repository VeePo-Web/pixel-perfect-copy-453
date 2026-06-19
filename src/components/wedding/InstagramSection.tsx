import { useRef, useState } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { Instagram } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import heroImage from "@/assets/hero-wedding.jpg";
import ceremonyImage from "@/assets/ceremony-setup.jpg";
import detailImage from "@/assets/detail-placecard.jpg";
import firstDanceImage from "@/assets/first-dance.jpg";
import bouquetImage from "@/assets/portfolio-bouquet.jpg";
import editorialImage from "@/assets/editorial-florals.jpg";

// Aesthetic-direction imagery — neutral category captions only, no fabricated
// venue/event attributions (brand-identity §5.5, §6.11). Swap for real grid when ready.
const photos = [
  { src: heroImage, alt: "Editorial wedding tablescape at golden hour", caption: "Tablescape", category: "Details" },
  { src: ceremonyImage, alt: "Outdoor ceremony setup with floral arch", caption: "Ceremony", category: "Ceremony" },
  { src: detailImage, alt: "Calligraphy place card detail with linen", caption: "Stationery", category: "Stationery" },
  { src: firstDanceImage, alt: "Couple's first dance under string lights", caption: "Reception", category: "Reception" },
  { src: bouquetImage, alt: "Bridal bouquet with eucalyptus and roses", caption: "Florals", category: "Florals" },
  { src: editorialImage, alt: "Sage floral arrangement on linen", caption: "Details", category: "Details" },
];

const InstagramSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const accentLineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const gridY = useTransform(scrollYProgress, [0, 1], [30, -20]);

  return (
    <section
      ref={sectionRef}
      className="bg-card py-section-mobile md:py-section-tablet lg:py-section-desktop relative overflow-hidden"
      aria-label="Instagram gallery"
    >
      {/* Parallax watermark - rotated */}
      <motion.div
        className="absolute -right-12 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-script text-[8rem] md:text-[12rem] text-foreground/[0.012] leading-none rotate-90 inline-block">
          Follow
        </span>
      </motion.div>

      {/* Section index watermark */}
      <motion.div
        className="absolute top-12 left-8 pointer-events-none select-none hidden lg:block"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-8xl font-light text-foreground/[0.015]">09</span>
      </motion.div>

      {/* Left decorative accent line - scroll linked */}
      <motion.div
        className="absolute left-0 top-1/2 -translate-y-1/2 w-px h-48 hidden lg:block origin-center"
        style={{ 
          scaleY: accentLineScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.15), transparent)"
        }}
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
        <ScrollReveal>
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-14 md:mb-20 gap-6">
            <div>
              {/* Section label */}
              <div className="flex items-center gap-4 mb-5">
                <span className="font-serif-wedding text-sm text-primary/15 font-light">09</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-10 h-px bg-primary/10 origin-left"
                />
                <p className="font-sans-wedding text-label uppercase text-muted-foreground tracking-[0.25em]">
                  Follow Along
                </p>
              </div>
              
              {/* Instagram handle */}
              <a
                href="https://www.instagram.com/hickoryandrose"
                target="_blank"
                rel="noopener noreferrer"
                className="font-serif-wedding text-display-md text-foreground hover:text-primary transition-colors duration-500 group inline-flex items-baseline gap-4"
              >
                @hickoryandrose
                <Instagram
                  size={20}
                  strokeWidth={1.5}
                  className="text-muted-foreground/20 group-hover:text-primary transition-colors duration-500"
                />
              </a>
              
              {/* Animated underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.3 }}
                className="w-24 h-px origin-left mt-4"
                style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.25), transparent)" }}
              />
            </div>
            
            {/* Right description */}
            <div className="md:text-right max-w-xs">
              <p className="font-sans-wedding text-body-sm text-muted-foreground/50 font-light leading-relaxed">
                Behind the scenes, real weddings, and the details that make it all come together.
              </p>
              <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground/60 mt-3 inline-flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary/25 animate-pulse" />
                Updated weekly
              </span>
            </div>
          </div>
        </ScrollReveal>

        {/* Gold horizontal rule before grid */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="h-px mb-10 md:mb-14 origin-left"
          style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08), transparent)" }}
        />

        {/* Staggered mosaic grid with film-strip reveal */}
        <div className="relative">
          {/* Ambient gold glow behind mosaic */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
            animate={{ opacity: [0.03, 0.07, 0.03] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.25), transparent 70%)" }}
            aria-hidden="true"
          />

          {/* Breathing diamond center ornament */}
          <motion.div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none hidden md:flex items-center justify-center"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden="true"
          >
            <span className="w-3 h-3 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15))" }} />
            {/* Glow halo */}
            <span
              className="absolute w-8 h-8 rounded-full"
              style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.15), transparent 70%)" }}
            />
          </motion.div>

          <motion.div 
            className="grid grid-cols-2 md:grid-cols-12 gap-2 md:gap-3"
            style={{ y: gridY }}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={{
              hidden: {},
              visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
            }}
          >
            {/* Large feature — spans 7 cols */}
            <MosaicItem photo={photos[0]} index={0} className="col-span-2 md:col-span-7 aspect-[16/10]" featured />

            {/* Right stack — 5 cols, 2 rows */}
            <MosaicItem photo={photos[1]} index={1} className="col-span-1 md:col-span-5 aspect-[4/3]" />
            <MosaicItem photo={photos[2]} index={2} className="col-span-1 md:col-span-5 aspect-[4/3]" />

            {/* Bottom row — 3 equal items */}
            <MosaicItem photo={photos[3]} index={3} className="col-span-1 md:col-span-4 aspect-[3/4] md:aspect-[4/5]" />
            <MosaicItem photo={photos[4]} index={4} className="col-span-1 md:col-span-4 aspect-[3/4] md:aspect-[4/5]" />
            <MosaicItem photo={photos[5]} index={5} className="col-span-2 md:col-span-4 aspect-[16/10] md:aspect-[4/5]" />
          </motion.div>
        </div>

        {/* Bottom attribution */}
        <ScrollReveal delay={0.3}>
          <div className="mt-12 md:mt-16">
            {/* Decorative divider */}
            <div className="flex items-center justify-center gap-6">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="w-14 h-px origin-right"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--border) / 0.3))" }}
              />
              <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.25), hsl(var(--gold) / 0.08))" }} />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="w-14 h-px origin-left"
                style={{ background: "linear-gradient(90deg, hsl(var(--border) / 0.3), transparent)" }}
              />
            </div>
            
            {/* Hashtags */}
            <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60 text-center mt-5">
              #HickoryAndRose · #RefinedRusticElegance
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

const MosaicItem = ({
  photo,
  index,
  className = "",
  featured = false,
}: {
  photo: { src: string; alt: string; caption: string; category: string };
  index: number;
  className?: string;
  featured?: boolean;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" },
        visible: { opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)", transition: { duration: 0.8, ease: [0.25, 0.1, 0.25, 1] } },
      }}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href="https://www.instagram.com/hickoryandrose"
        target="_blank"
        rel="noopener noreferrer"
        className="block w-full h-full overflow-hidden relative group"
      >
        {/* Image with Ken Burns effect on hover */}
        <motion.img
          src={photo.src}
          alt={photo.alt}
          className="w-full h-full object-cover"
          loading="lazy"
          animate={{ 
            scale: isHovered ? 1.08 : 1,
            filter: isHovered ? "brightness(0.8)" : "brightness(1)"
          }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        
        {/* Cinematic hover overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 bg-gradient-to-t from-foreground/75 via-foreground/10 to-transparent flex flex-col justify-between p-4"
            >
              {/* Top: category badge */}
              <div className="flex justify-between items-start">
                <motion.span
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60 px-2 py-1 border border-white/20"
                >
                  {photo.category}
                </motion.span>
                <span className="font-serif-wedding text-caption text-white/60 tabular-nums">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>
              
              {/* Bottom: caption + CTA */}
              <div>
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 }}
                  className="font-serif-wedding text-sm md:text-base text-white/85 italic leading-snug mb-3"
                >
                  {photo.caption}
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="flex items-center gap-2"
                >
                  <Instagram size={12} strokeWidth={1.5} className="text-white/60" />
                  <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/60">
                    View on Instagram
                  </span>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Corner accent frames */}
        <div className="absolute top-2 left-2 w-5 h-5 border-t border-l border-white/0 group-hover:border-[hsl(var(--gold)_/_0.2)] transition-all duration-500 pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-5 h-5 border-b border-r border-white/0 group-hover:border-[hsl(var(--gold)_/_0.2)] transition-all duration-500 pointer-events-none" />
        
        {/* Gold frame number badge with pulse on hover */}
        <div className="absolute top-2 right-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <motion.span
            className="font-sans-wedding text-caption tracking-[0.15em] tabular-nums text-white/60 px-2 py-1 inline-flex items-center gap-1.5 backdrop-blur-sm"
            style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.15), hsl(var(--gold) / 0.05))", border: "1px solid hsl(var(--gold) / 0.15)" }}
            whileHover={{ scale: 1.05 }}
          >
            <motion.span
              className="w-1 h-1 rounded-full"
              style={{ background: "hsl(var(--gold) / 0.6)" }}
              animate={{ opacity: [0.4, 1, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            FR{String(index + 1).padStart(2, "0")}
          </motion.span>
        </div>
        
        {/* Featured badge */}
        {featured && (
          <div className="absolute top-3 right-3 hidden md:block">
            <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60 bg-white/10 backdrop-blur-sm px-2 py-1">
              Featured
            </span>
          </div>
        )}
      </a>
    </motion.div>
  );
};

export default InstagramSection;
