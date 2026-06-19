import { motion, useReducedMotion } from "framer-motion";
import { ReactNode, memo, Children } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  /** "fade" (default) uses translate+opacity. "clip" uses a cinematic clip-path mask wipe. "stagger" reveals each direct child sequentially. */
  variant?: "fade" | "clip" | "stagger";
  /** Stagger delay between children (only for variant="stagger"). Default 0.08 */
  staggerDelay?: number;
}

const directionOffset = {
  up: { y: 20, x: 0 },
  down: { y: -20, x: 0 },
  left: { x: 20, y: 0 },
  right: { x: -20, y: 0 },
};

const clipDirectionMap = {
  up: { hidden: "inset(100% 0 0 0)", visible: "inset(0% 0 0 0)" },
  down: { hidden: "inset(0 0 100% 0)", visible: "inset(0 0 0% 0)" },
  left: { hidden: "inset(0 100% 0 0)", visible: "inset(0 0% 0 0)" },
  right: { hidden: "inset(0 0 0 100%)", visible: "inset(0 0 0 0%)" },
};

const staggerContainerVariants = {
  hidden: {},
  visible: (staggerDelay: number) => ({
    transition: { staggerChildren: staggerDelay, delayChildren: 0.05 },
  }),
};

const staggerChildVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1.0] as [number, number, number, number] },
  },
};

const ScrollReveal = memo(({ children, delay = 0, className = "", direction = "up", variant = "fade", staggerDelay = 0.08 }: ScrollRevealProps) => {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  if (variant === "stagger") {
    return (
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-60px" }}
        custom={staggerDelay}
        variants={staggerContainerVariants}
        className={className}
      >
        {Children.map(children, (child) => (
          <motion.div variants={staggerChildVariants}>{child}</motion.div>
        ))}
      </motion.div>
    );
  }

  if (variant === "clip") {
    const clip = clipDirectionMap[direction];
    return (
      <motion.div
        initial={{ clipPath: clip.hidden, opacity: 0.3 }}
        whileInView={{ clipPath: clip.visible, opacity: 1 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{
          duration: 0.8,
          delay,
          ease: [0.76, 0, 0.24, 1],
        }}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, ...directionOffset[direction] }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
});

ScrollReveal.displayName = "ScrollReveal";

export default ScrollReveal;
