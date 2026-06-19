import { motion } from "framer-motion";
import { memo } from "react";

interface GoldFrameProps {
  /** Inset from container edges */
  inset?: string;
  /** Delay before first line animates */
  delay?: number;
}

/**
 * Cinematic gold-traced frame overlay — 4 animated border lines.
 * Place inside a `position: relative; overflow: hidden` container.
 */
const GoldFrame = memo(({ inset = "16px", delay = 0.8 }: GoldFrameProps) => {
  const gold = "hsl(var(--gold) / 0.25)";
  const dur = 1.2;
  const ease = [0.25, 0.1, 0.25, 1] as const;

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20"
      style={{ padding: inset }}
      aria-hidden="true"
    >
      {/* Top */}
      <motion.span
        className="absolute left-0 right-0 h-px origin-left"
        style={{ top: inset, marginLeft: inset, marginRight: inset, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: dur, delay, ease }}
      />
      {/* Bottom */}
      <motion.span
        className="absolute left-0 right-0 h-px origin-right"
        style={{ bottom: inset, marginLeft: inset, marginRight: inset, background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: dur, delay: delay + 0.2, ease }}
      />
      {/* Left */}
      <motion.span
        className="absolute top-0 bottom-0 w-px origin-top"
        style={{ left: inset, marginTop: inset, marginBottom: inset, background: `linear-gradient(180deg, transparent, ${gold}, transparent)` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: dur, delay: delay + 0.4, ease }}
      />
      {/* Right */}
      <motion.span
        className="absolute top-0 bottom-0 w-px origin-bottom"
        style={{ right: inset, marginTop: inset, marginBottom: inset, background: `linear-gradient(180deg, transparent, ${gold}, transparent)` }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: dur, delay: delay + 0.6, ease }}
      />
    </div>
  );
});

GoldFrame.displayName = "GoldFrame";
export default GoldFrame;
