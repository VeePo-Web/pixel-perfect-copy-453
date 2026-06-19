import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const cubicEase = [0.76, 0, 0.24, 1] as const;
const smoothEase = [0.25, 0.1, 0.25, 1.0] as const;

const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <>
      {/* Layer 1: Deep sage base curtain — slides up */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.32, ease: cubicEase, delay: 0.1 }}
        className="fixed inset-0 z-[90] bg-sage-deep origin-top pointer-events-none"
      />

      {/* Layer 2: Dark foreground curtain — slides down (overlap creates depth) */}
      <motion.div
        initial={{ scaleY: 1 }}
        animate={{ scaleY: 0 }}
        transition={{ duration: 0.3, ease: cubicEase, delay: 0.08 }}
        className="fixed inset-0 z-[91] bg-foreground origin-bottom pointer-events-none"
      />

      {/* Layer 3: Gold shimmer line that sweeps horizontally during reveal */}
      <motion.div
        initial={{ scaleX: 0, opacity: 1 }}
        animate={{ scaleX: 1, opacity: 0 }}
        transition={{ duration: 0.38, delay: 0.18, ease: smoothEase }}
        className="fixed top-1/2 left-0 right-0 h-px z-[93] origin-left pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.6) 30%, hsl(var(--gold) / 0.8) 50%, hsl(var(--gold) / 0.6) 70%, transparent 100%)",
        }}
      />

      {/* Brand monogram centered during curtain — with staggered char reveal */}
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ duration: 0.14, delay: 0.05 }}
        className="fixed inset-0 z-[92] flex items-center justify-center pointer-events-none"
      >
        <div className="text-center flex items-baseline gap-2">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: 0 }}
            className="font-serif-wedding text-lg text-primary-foreground/50 tracking-[0.15em]"
          >
            H
          </motion.span>
          <motion.span
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.16, delay: 0.02 }}
            className="font-script text-2xl text-primary-foreground/25 mx-0.5"
          >
            &
          </motion.span>
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.14, delay: 0.04 }}
            className="font-script text-2xl text-primary-foreground/50"
          >
            R
          </motion.span>
        </div>
      </motion.div>

      {/* Gold accent line that reveals with the content — top edge */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.28, delay: 0.32, ease: smoothEase }}
        className="fixed top-0 left-0 right-0 h-px z-[89] origin-center pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.5), transparent)" }}
      />

      {/* Soft gold glow pulse at center during transition */}
      <motion.div
        initial={{ opacity: 0.4, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.5 }}
        transition={{ duration: 0.45, delay: 0.16, ease: smoothEase }}
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 z-[88] pointer-events-none rounded-full"
        style={{
          background: "radial-gradient(circle, hsl(var(--gold) / 0.08), transparent 70%)",
        }}
      />

      {/* Content fade-in */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32, delay: 0.16, ease: smoothEase }}
      >
        {children}
      </motion.div>
    </>
  );
};

export default PageTransition;
