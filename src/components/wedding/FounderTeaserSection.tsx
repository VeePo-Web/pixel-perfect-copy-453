import { Link } from "react-router-dom";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import founderImage from "@/assets/founder-portrait.jpg";

// TODO: Update with owner-supplied stats. Current values reflect 2026 booking status — kept conservative until further metrics are confirmed.
const credentials = [
  { value: "2026", label: "Season Fully Booked" },
  { value: "Aug 15", label: "Editorial Styled Shoot" },
  { value: "Growing", label: "Vendor Network" },
];

const philosophyPillars = [
  "Calm Leadership",
  "Elevated Design",
  "Seamless Execution",
];

const FounderTeaserSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [activePillar, setActivePillar] = useState<number | null>(null);
  
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const imageY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"]);
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.05, 1, 0.98]);

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const verticalLineH = useTransform(sectionProgress, [0.1, 0.6], ["0%", "100%"]);
  const watermarkY = useTransform(sectionProgress, [0, 1], [40, -40]);
  const ribbonX = useTransform(sectionProgress, [0.2, 0.8], ["5%", "-5%"]);
  const decorativeRotate = useTransform(sectionProgress, [0, 1], [-3, 3]);
  const floatingQuoteY = useTransform(sectionProgress, [0, 1], [20, -20]);

  return (
    <section
      ref={sectionRef}
      className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card relative overflow-hidden"
      aria-label="About the founder"
    >
      {/* Subtle film grain */}
      <div 
        className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay"
        style={{ 
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundSize: "150px 150px"
        }}
        aria-hidden="true"
      />

      {/* Large decorative section index */}
      <motion.div
        className="absolute left-6 md:left-12 top-12 md:top-16 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2 }}
      >
        <span className="font-serif-wedding text-[10rem] md:text-[16rem] font-light text-foreground leading-none">
          04
        </span>
      </motion.div>

      {/* Parallax "About" watermark */}
      <motion.div
        className="absolute -right-10 top-1/3 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic">
          The Heart
        </span>
      </motion.div>

      {/* Decorative corner ampersand */}
      <motion.div
        className="absolute -bottom-20 -left-20 pointer-events-none select-none hidden xl:block"
        style={{ rotate: decorativeRotate, opacity: 0.015 }}
        aria-hidden="true"
      >
        <span className="font-script text-[20rem] text-foreground leading-none">
          &
        </span>
      </motion.div>

      {/* Floating philosophy pillar — desktop only */}
      <motion.div
        className="absolute top-1/3 right-8 pointer-events-none select-none hidden xl:block"
        style={{ y: floatingQuoteY }}
        aria-hidden="true"
      >
        <AnimatePresence mode="wait">
          {activePillar !== null && (
            <motion.p
              key={activePillar}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 0.15, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.4 }}
              className="font-script text-xl text-primary rotate-12 origin-center"
            >
              {philosophyPillars[activePillar]}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Scroll-linked vertical accent line */}
      <motion.div
        className="absolute left-1/2 top-0 w-px bg-gradient-to-b from-transparent via-primary/10 to-transparent origin-top hidden lg:block"
        style={{ height: verticalLineH }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-8">
        <div
          ref={ref}
          className="grid grid-cols-1 lg:grid-cols-5 gap-10 lg:gap-16 items-center max-w-6xl mx-auto"
        >
          {/* Portrait with subtle parallax */}
          <ScrollReveal className="lg:col-span-3">
            <ImageReveal direction="left" delay={0.1}>
              <div 
                className="aspect-[4/5] max-w-md mx-auto lg:max-w-none overflow-hidden relative group"
                onMouseEnter={() => setIsImageHovered(true)}
                onMouseLeave={() => setIsImageHovered(false)}
              >
                {/* Ambient gold radial glow behind portrait */}
                <motion.div
                  className="absolute -inset-8 pointer-events-none z-0"
                  animate={{ opacity: [0.03, 0.08, 0.03], scale: [0.95, 1.05, 0.95] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                  style={{ background: "radial-gradient(ellipse at 50% 40%, hsl(var(--gold) / 0.15), transparent 60%)" }}
                  aria-hidden="true"
                />

                <motion.img
                  src={founderImage}
                  alt="Meg Wolodko, founder of Hickory & Rose, smiling warmly in a soft natural-light portrait"
                  className="w-full h-[110%] object-cover relative z-[1]"
                  style={{ y: imageY, scale: imageScale }}
                  animate={{ filter: isImageHovered ? "brightness(0.95)" : "brightness(1)" }}
                  transition={{ duration: 0.8 }}
                  loading="lazy"
                  width={1024}
                  height={1024}
                />
                
                {/* Cinematic hover overlay */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent"
                  animate={{ opacity: isImageHovered ? 1 : 0 }}
                  transition={{ duration: 0.5 }}
                />
                
                {/* Gold-gradient corner accents */}
                <div className="absolute top-4 left-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  <div className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
                </div>
                <div className="absolute bottom-4 right-4 w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                  <div className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  <div className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
                </div>
                
                {/* Founder caption — reveals on hover */}
                <AnimatePresence>
                  {isImageHovered && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.4 }}
                      className="absolute bottom-6 left-6 right-6"
                    >
                      {/* Brand line, not attributed to Meg directly — no fabricated founder quotes (5.5). */}
                      <p className="font-serif-wedding text-sm text-white/70 italic">
                        "A wedding day should feel as beautiful to live inside as it looks in the photos."
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="w-4 h-px bg-white/30" />
                        <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/60">
                          Hickory & Rose
                        </span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Frame index */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="absolute top-4 right-4 hidden md:block"
                >
                  <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/0 group-hover:text-white/60 transition-colors duration-500">
                    FR04
                  </span>
                </motion.div>
              </div>
            </ImageReveal>

            {/* Editorial pull-quote ribbon between portrait and credentials */}
            <motion.div
              className="relative my-6 md:my-8 py-5 md:py-6 overflow-hidden"
              style={{ x: ribbonX }}
            >
              <div className="flex items-center gap-4">
                <motion.div
                  className="w-10 h-px bg-primary/20 shrink-0 origin-left"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                />
                <p className="font-serif-wedding text-base md:text-lg italic text-foreground/40 leading-relaxed whitespace-nowrap">
                  "Calm is not the absence of planning — it's the presence of it."
                </p>
                <motion.div
                  className="w-10 h-px bg-primary/20 shrink-0 origin-right"
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                />
              </div>
            </motion.div>

            {/* Credential row below ribbon with hover interactions */}
            <div className="grid grid-cols-3 gap-0 border-t border-border/40">
              {credentials.map((cred, i) => (
                <motion.div
                  key={cred.label}
                  className={`text-center py-6 group cursor-default hover:bg-primary/[0.02] transition-colors duration-500 ${
                    i < 2 ? "border-r border-border/40" : ""
                  }`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
                  onMouseEnter={() => setActivePillar(i)}
                  onMouseLeave={() => setActivePillar(null)}
                >
                  {/* Gold-gradient diamond with breathing glow */}
                  <motion.span
                    className="w-2 h-2 rotate-45 block mb-2 mx-auto relative"
                    style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }}
                    animate={{ rotate: activePillar === i ? 225 : 45 }}
                    transition={{ duration: 0.4 }}
                  >
                    <motion.span
                      className="absolute -inset-2 rounded-full pointer-events-none"
                      style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.15), transparent 70%)" }}
                      animate={{ opacity: activePillar === i ? [0.3, 0.7, 0.3] : 0 }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                  </motion.span>
                  <p className="font-serif-wedding text-xl md:text-2xl font-light text-primary/60 group-hover:text-primary transition-colors duration-500">
                    {cred.value}
                  </p>
                  <motion.div
                    className="w-4 h-px bg-primary/20 mx-auto my-2 origin-center"
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
                  />
                  <p className="font-overline text-caption text-muted-foreground/60 group-hover:text-muted-foreground/80 transition-colors duration-500">
                    {cred.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>

          {/* Story */}
          <ScrollReveal delay={0.15} className="lg:col-span-2">
            <div>
              <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-4">
                04
              </span>

              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="w-10 h-px bg-primary/30 mb-6 origin-left"
              />

              <p className="font-sans-wedding text-label uppercase text-muted-foreground mb-4">
                Meet the Planner
              </p>
              <h2 className="font-serif-wedding text-display-lg text-foreground mb-6">
                Hello, I'm the heart behind Hickory & Rose.
              </h2>
              <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed mb-4 font-light">
                I started Hickory & Rose because I believe your wedding day
                should feel as calm as it is beautiful. After years in event
                coordination, I saw too many couples stressed on the day that
                should have been their most joyful.
              </p>
              <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed mb-8 font-light">
                My mission is simple: handle every detail with quiet confidence
                so you can be fully present with the people you love.
              </p>

              {/* Philosophy pillars row */}
              <div className="flex flex-wrap gap-3 mb-8">
                {philosophyPillars.map((pillar, i) => (
                  <motion.span
                    key={pillar}
                    initial={{ opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.4 }}
                    className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-primary/60 border border-primary/20 px-3 py-1.5"
                  >
                    {pillar}
                  </motion.span>
                ))}
              </div>

              {/* Signature flourish with gold-traced underline */}
              <div className="mb-6">
                <p className="font-script text-2xl text-primary/30 mb-1">Hickory & Rose</p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  className="w-20 h-[2px] origin-left relative overflow-hidden"
                  style={{ background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--primary) / 0.15), transparent)" }}
                >
                  {/* Traveling shimmer on signature line */}
                  <motion.span
                    className="absolute inset-0"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)" }}
                  />
                </motion.div>
                <p className="font-overline text-caption text-muted-foreground/60 mt-3">
                  Edmonton · Alberta
                </p>
              </div>

              <Link
                to="/about"
                className="inline-flex items-center font-sans-wedding text-xs tracking-[0.15em] uppercase text-primary hover:text-sage-deep transition-colors duration-200 group"
              >
                Read My Story
                <span className="ml-2 group-hover:translate-x-1 transition-transform duration-200">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default FounderTeaserSection;
