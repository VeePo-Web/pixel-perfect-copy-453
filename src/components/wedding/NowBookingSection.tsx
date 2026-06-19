import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

// Honest booking status — no fabricated percentages or "X dates left" specifics
// until Meg confirms exact counts. Mirrors language used elsewhere on the site.
const seasonDetails = [
  { label: "2026", status: "Summer & Fall Booked", fill: 100, accent: true },
  { label: "2027", status: "Now Booking", fill: 30, accent: true },
];

const NowBookingSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkX = useTransform(scrollYProgress, [0, 1], ["8%", "-8%"]);
  const lineScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);
  const ornamentY = useTransform(scrollYProgress, [0, 1], [10, -10]);
  const glowOpacity = useTransform(scrollYProgress, [0.2, 0.5, 0.8], [0, 0.1, 0]);

  return (
    <section
      ref={sectionRef}
      className="relative py-14 md:py-20 bg-primary overflow-hidden"
      aria-label="Now booking"
    >
      {/* Animated gold border trace — top */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px origin-left"
        style={{ 
          scaleX: lineScale,
          background: "linear-gradient(90deg, transparent, hsl(var(--primary-foreground) / 0.15) 30%, hsl(var(--gold, 38 60% 55%) / 0.35) 50%, hsl(var(--primary-foreground) / 0.15) 70%, transparent)"
        }}
      >
        {/* Traveling gold accent on border */}
        <motion.span
          className="absolute top-0 h-full"
          animate={{ x: ["-10%", "110%"] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)", width: "20%" }}
        />
      </motion.div>
      {/* Gold border trace — left side */}
      <motion.div
        className="absolute top-0 left-0 bottom-0 w-px origin-top hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent 60%)" }}
      />
      {/* Gold border trace — right side */}
      <motion.div
        className="absolute top-0 right-0 bottom-0 w-px origin-top hidden lg:block"
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent 60%)" }}
      />
      
      {/* Bottom hairline */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/8 to-transparent" />

      {/* Radial gold glow — scroll-linked, centered */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full pointer-events-none"
        style={{
          opacity: glowOpacity,
          background: "radial-gradient(ellipse, hsl(var(--gold, 38 60% 55%) / 0.2), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Parallax year watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-end pointer-events-none select-none pr-8 md:pr-20"
        style={{ x: watermarkX }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[10rem] md:text-[16rem] font-light text-primary-foreground/[0.025] leading-none tracking-tight">
          2026
        </span>
      </motion.div>

      {/* Floating decorative ornament */}
      <motion.div
        className="absolute left-8 md:left-16 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        style={{ y: ornamentY }}
        aria-hidden="true"
      >
        <span className="block w-3 h-3 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.15), hsl(var(--gold) / 0.05))" }} />
      </motion.div>

      <Link to="/inquire" className="block group relative" aria-label="Inquire about booking">
        {/* Gold shimmer sweep on hover */}
        <div
          className="absolute inset-0 pointer-events-none overflow-hidden z-[1]"
          aria-hidden="true"
        >
          <div
            className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1.2s] ease-in-out"
            style={{
              background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.06) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.06) 60%, transparent 100%)",
            }}
          />
        </div>
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-10 items-center">
            {/* Left: Status indicator + dates */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-3"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="relative flex h-2.5 w-2.5">
                  <motion.span
                    className="absolute inline-flex h-full w-full rounded-full"
                    animate={{ scale: [1, 2, 1], opacity: [0.3, 0, 0.3] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    style={{ background: "hsl(var(--gold) / 0.4)" }}
                  />
                  <span
                    className="relative inline-flex rounded-full h-2.5 w-2.5"
                    style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.7), hsl(var(--primary-foreground) / 0.4))" }}
                  />
                </span>
                <p className="font-overline text-primary-foreground/60 text-caption">
                  Currently Booking
                </p>
              </div>
              <p className="font-serif-wedding text-2xl md:text-3xl text-primary-foreground/60 font-light tracking-tight">
                2026 <span className="opacity-20 mx-1">·</span> 2027
              </p>
              
              {/* Decorative line — gold gradient */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="w-12 h-px mt-4 origin-left hidden md:block"
                style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.25), transparent)" }}
              />
            </motion.div>

            {/* Center: Main headline + season availability */}
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-6 text-center"
            >
              {/* Top ornamental line — gold */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-10 h-px mx-auto mb-5 origin-center hidden md:block"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.2), transparent)" }}
              />
              
              <h2 className="font-serif-wedding text-2xl md:text-4xl text-primary-foreground tracking-tight group-hover:tracking-wide transition-all duration-700 leading-tight mb-4">
                Now Accepting Inquiries
              </h2>

              {/* Season availability with fill bars — gold accents */}
              <div className="hidden md:flex items-center justify-center gap-6 lg:gap-8 mt-5">
                {seasonDetails.map((season, i) => (
                  <motion.div
                    key={season.label}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                    className="text-center relative min-w-[72px] group/season"
                  >
                    <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-primary-foreground/50 mb-1.5 group-hover/season:text-primary-foreground/70 transition-colors duration-300">
                      {season.label}
                    </p>
                    {/* Availability fill bar — gold gradient for accent items */}
                    <div className="w-full h-[2px] bg-primary-foreground/8 overflow-hidden mb-1.5 relative">
                      <motion.div
                        className="h-full origin-left"
                        style={{
                          background: season.accent
                            ? "linear-gradient(90deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.3))"
                            : "hsl(var(--primary-foreground) / 0.15)",
                        }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: season.fill / 100 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.5 + i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                      />
                      {/* Shimmer effect on accent bars */}
                      {season.accent && (
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                          initial={{ x: "-100%" }}
                          whileInView={{ x: "200%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.2, delay: 1.3 + i * 0.1, ease: "easeInOut" }}
                        />
                      )}
                    </div>
                    <p className={`font-serif-wedding text-caption italic ${season.accent ? 'text-primary-foreground/60' : 'text-primary-foreground/50'}`}>
                      {season.status}
                    </p>
                  </motion.div>
                ))}
              </div>

              {/* Bottom ornamental line */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.15 }}
                className="w-10 h-px mx-auto mt-5 origin-center hidden md:block"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.2), transparent)" }}
              />
            </motion.div>

            {/* Right: CTA hint */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="md:col-span-3 md:text-right"
            >
              <span className="font-sans-wedding text-[0.7rem] tracking-[0.2em] uppercase text-primary-foreground/30 group-hover:text-primary-foreground/60 transition-colors duration-300 inline-flex items-center gap-2.5">
                Begin Your Story
                <motion.span
                  className="inline-block"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  →
                </motion.span>
              </span>
              <p className="font-serif-wedding text-xs italic text-primary-foreground/50 mt-2 hidden md:block">
                Complimentary discovery call
              </p>
              
              {/* Trust element */}
              <div className="hidden md:flex items-center justify-end gap-2 mt-4">
                <span className="w-4 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15))" }} />
                <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-primary-foreground/50">
                  48hr Response
                </span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Full-width hover accent line — gold gradient */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.4), transparent)" }}
        />
      </Link>
    </section>
  );
};

export default NowBookingSection;
