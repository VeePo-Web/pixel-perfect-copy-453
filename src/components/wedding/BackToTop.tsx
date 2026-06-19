import { useState, useEffect, forwardRef } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform } from "framer-motion";

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

const BackToTop = forwardRef<HTMLDivElement>((_, ref) => {
  const [visible, setVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const scrollPercent = useMotionValue(0);
  const dashOffset = useTransform(scrollPercent, (v) => CIRCUMFERENCE * (1 - v));
  const ringOpacity = useTransform(scrollPercent, [0, 0.05, 1], [0, 0.6, 1]);

  useEffect(() => {
    const handleScroll = () => {
      const winHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = winHeight > 0 ? Math.min(window.scrollY / winHeight, 1) : 0;
      scrollPercent.set(pct);
      setVisible(window.scrollY > window.innerHeight);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [scrollPercent]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div ref={ref}>
      <AnimatePresence>
        {visible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={scrollToTop}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className="fixed bottom-6 right-6 z-50 w-12 h-12 flex items-center justify-center bg-foreground/90 backdrop-blur-sm hover:bg-sage-deep group transition-colors duration-500 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 relative"
            aria-label="Back to top"
          >
            {/* Radial glow on hover */}
            <motion.div
              className="absolute inset-0 pointer-events-none"
              animate={{
                boxShadow: isHovered
                  ? "0 0 24px 8px hsl(var(--gold) / 0.15)"
                  : "0 0 0px 0px hsl(var(--gold) / 0)",
              }}
              transition={{ duration: 0.4 }}
            />

            {/* SVG progress ring */}
            <svg
              className="absolute inset-0 w-full h-full -rotate-90"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <circle
                cx="24"
                cy="24"
                r={RADIUS}
                fill="none"
                stroke="hsl(var(--background) / 0.06)"
                strokeWidth="1"
              />
              <motion.circle
                cx="24"
                cy="24"
                r={RADIUS}
                fill="none"
                stroke="hsl(var(--gold))"
                strokeWidth="1.5"
                strokeDasharray={CIRCUMFERENCE}
                style={{ strokeDashoffset: dashOffset, opacity: ringOpacity }}
                strokeLinecap="round"
              />
            </svg>

            {/* Diamond ornament */}
            <motion.span
              className="relative z-10 w-2.5 h-2.5 rotate-45 border border-background/40 group-hover:border-gold transition-colors duration-300"
              animate={{ y: isHovered ? -1 : 0 }}
              transition={{ duration: 0.2 }}
              style={{ display: "block" }}
            />

            {/* Hover tooltip */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={{ opacity: 0, x: 8, scale: 0.9 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 8, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-full mr-3 whitespace-nowrap font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground bg-background/90 backdrop-blur-sm px-3 py-1.5 border border-border/30 pointer-events-none"
                >
                  Back to Top
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
});

BackToTop.displayName = "BackToTop";
export default BackToTop;
