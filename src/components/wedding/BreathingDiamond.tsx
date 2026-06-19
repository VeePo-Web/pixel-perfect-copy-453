import { memo } from "react";

interface BreathingDiamondProps {
  /** Size of the diamond in px */
  size?: number;
  /** Extra Tailwind classes on the wrapper */
  className?: string;
}

/**
 * Breathing diamond ornament with ambient gold glow halo.
 * Uses pure CSS animations for zero JS thread cost.
 */
const BreathingDiamond = memo(({ size = 10, className = "" }: BreathingDiamondProps) => (
  <div className={`relative inline-flex items-center justify-center ${className}`} aria-hidden="true">
    {/* Glow halo — CSS animated */}
    <div
      className="absolute pointer-events-none will-change-transform animate-breathing-glow"
      style={{
        width: size * 5,
        height: size * 5,
        background: "radial-gradient(circle, hsl(var(--gold) / 0.1), transparent 70%)",
      }}
    />
    {/* Diamond — CSS animated */}
    <span
      className="block rotate-45 will-change-transform animate-breathing-scale"
      style={{
        width: size,
        height: size,
        background: "linear-gradient(135deg, hsl(var(--gold) / 0.45), hsl(var(--gold) / 0.15))",
      }}
    />
  </div>
));

BreathingDiamond.displayName = "BreathingDiamond";
export default BreathingDiamond;
