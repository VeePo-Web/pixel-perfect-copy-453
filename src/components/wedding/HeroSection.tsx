import { ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Navigation from "./Navigation";
import MagneticButton from "./MagneticButton";
import HeroFloatingInset from "./HeroFloatingInset";
import HeroSidebars from "./HeroSidebars";
import heroImage from "@/assets/hero-wedding-premium.jpg";

const charVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.6 + i * 0.025,
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1] as const,
    },
  }),
};

const AnimatedHeadline = ({ text, startIndex = 0 }: { text: string; startIndex?: number }) => (
  <>
    {text.split("").map((char, i) => (
      <motion.span
        key={`${startIndex + i}-${char}`}
        custom={startIndex + i}
        variants={charVariants}
        initial="hidden"
        animate="visible"
        className="inline-block"
        style={{ whiteSpace: char === " " ? "pre" : undefined }}
      >
        {char === " " ? "\u00A0" : char}
      </motion.span>
    ))}
  </>
);

const trustCredentials = [
  "Summer 2026 — Fully Booked",
  "Edmonton & Alberta",
  "Now Booking 2027",
];

const seasonAvailability = [
  { label: "Spring '26", status: "Limited" },
  { label: "Summer '26", status: "2 Left" },
  { label: "Autumn '26", status: "Open" },
];

const HeroSection = () => {
  const ref = useRef<HTMLElement>(null);
  const [activeSeasonIdx, setActiveSeasonIdx] = useState(0);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "10%"]);
  const secondaryImgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const secondaryImgOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const sideTextY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  useEffect(() => {
    document.title = "Hickory & Rose | Edmonton's Luxury Wedding Planner";
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveSeasonIdx((i) => (i + 1) % seasonAvailability.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const scrollToContent = () => {
    window.scrollTo({ top: window.innerHeight, behavior: "smooth" });
  };

  const line1 = "Your wedding day, ";
  const line2 = "effortlessly beautiful.";

  return (
    <section ref={ref} className="relative h-screen w-full overflow-hidden grain-overlay vignette" aria-label="Hero">
      {/* Background Image with Ken Burns zoom + parallax */}
      <div className="absolute inset-0">
        <motion.img
          src={heroImage}
          alt="Wedding tablescape"
          className="w-full h-[120%] object-cover"
          loading="eager"
          decoding="async"
          width={1920}
          height={1080}
          fetchPriority="high"
          initial={{ scale: 1.0 }}
          animate={{ scale: 1.08 }}
          transition={{ duration: 20, ease: "linear", repeat: Infinity, repeatType: "reverse" }}
          style={{ y: imgY }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/15 to-black/55" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/10" />
      </div>

      {/* Cinematic gold-traced frame overlay */}
      <div className="absolute inset-0 pointer-events-none z-[5]" aria-hidden="true">
        <motion.div
          className="absolute top-6 md:top-10 left-6 md:left-10 right-6 md:right-10 h-px origin-left"
          style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.08) 50%, transparent)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 2.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute top-6 md:top-10 left-6 md:left-10 bottom-6 md:bottom-10 w-px origin-top"
          style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent 60%)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.2, delay: 3.2, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute bottom-6 md:bottom-10 left-6 md:left-10 right-6 md:right-10 h-px origin-right"
          style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.15), transparent 50%)" }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 3.5, ease: [0.25, 0.1, 0.25, 1] }}
        />
        <motion.div
          className="absolute top-6 md:top-10 right-6 md:right-10 bottom-6 md:bottom-10 w-px origin-bottom hidden lg:block"
          style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.15), transparent 60%)" }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1, delay: 3.8, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* Radial light glow behind headline */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 1.2 }}
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--gold) / 0.04) 0%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Large decorative ampersand watermark */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.03 }}
        transition={{ duration: 2, delay: 1.5 }}
      >
        <span className="font-script text-[22rem] md:text-[32rem] text-white leading-none">
          &
        </span>
      </motion.div>

      {/* Sidebars */}
      <HeroSidebars
        sideTextY={sideTextY}
        activeSeasonIdx={activeSeasonIdx}
        seasonAvailability={seasonAvailability}
      />

      <Navigation variant="overlay" />

      {/* Content with scroll-linked fade */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
        style={{ opacity: contentOpacity, y: contentY }}
      >
        {/* Overline with flanking lines */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] as const }}
          className="font-sans-wedding text-label uppercase text-white/60 mb-6"
        >
          <span className="inline-flex items-center gap-3">
            <motion.span
              className="w-8 h-px origin-right"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.4))" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
            Edmonton's Luxury Wedding Planner
            <motion.span
              className="w-8 h-px origin-left"
              style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), transparent)" }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            />
          </span>
        </motion.p>

        <h1 className="font-serif-wedding text-display-xl font-light max-w-4xl mb-6 leading-tight overflow-hidden">
          <AnimatedHeadline text={line1} startIndex={0} />
          <em className="font-light">
            <AnimatedHeadline text={line2} startIndex={line1.length} />
          </em>
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.8, ease: [0.25, 0.1, 0.25, 1.0] as const }}
          className="font-sans-wedding text-base md:text-lg text-white/70 max-w-xl mb-12 leading-relaxed font-light"
        >
          Seamless, stress-free execution. Thoughtfully bringing your vision to life.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 2.1 }}
        >
          <MagneticButton to="/inquire" variant="outline-light">
            Begin Your Story
          </MagneticButton>
        </motion.div>

        {/* Trust credential bar with gold separator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          className="absolute bottom-24 left-0 right-0"
        >
          <motion.div
            className="w-48 h-px mx-auto mb-5"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 1, delay: 3.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
          />
          <div className="flex items-center justify-center gap-6 md:gap-10">
            {trustCredentials.map((cred, i) => (
              <motion.span
                key={cred}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 3.0 + i * 0.15, duration: 0.4 }}
                className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/60 font-light inline-flex items-center gap-6 md:gap-10"
              >
                {i > 0 && (
                  <span
                    className="w-1 h-1 rotate-45 -ml-3 md:-ml-5"
                    style={{ background: "hsl(var(--gold) / 0.25)" }}
                  />
                )}
                {cred}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Floating editorial inset image */}
      <HeroFloatingInset
        secondaryImgY={secondaryImgY}
        secondaryImgOpacity={secondaryImgOpacity}
      />

      {/* Scroll Indicator */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.5, y: [0, 6, 0] }}
        transition={{
          opacity: { delay: 2.5, duration: 0.6 },
          y: { duration: 2.5, repeat: Infinity, ease: "easeInOut" },
        }}
        onClick={scrollToContent}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white cursor-pointer z-10 hover:opacity-80 transition-opacity"
        aria-label="Scroll to content"
      >
        <ChevronDown size={24} strokeWidth={1} />
      </motion.button>
    </section>
  );
};

export default HeroSection;
