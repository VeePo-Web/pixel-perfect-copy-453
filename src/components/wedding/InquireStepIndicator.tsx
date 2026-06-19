import { motion } from "framer-motion";
import BreathingDiamond from "./BreathingDiamond";
import { memo } from "react";

interface InquireStepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

const InquireStepIndicator = memo(({ currentStep, totalSteps, stepLabels }: InquireStepIndicatorProps) => {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <div className="mb-10">
      {/* Step labels row */}
      <div className="flex items-center justify-between mb-4">
        <p className="font-sans-wedding text-xs text-brand-text-tertiary tracking-widest uppercase font-light">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="font-sans-wedding text-xs text-brand-text-tertiary font-light">
          {stepLabels[currentStep]}
        </p>
      </div>

      {/* Diamond nodes */}
      <div className="relative flex items-center justify-between mb-2">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <div key={i} className="relative z-10 flex items-center justify-center">
            {i <= currentStep ? (
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <BreathingDiamond size={i === currentStep ? 10 : 7} />
              </motion.div>
            ) : (
              <span
                className="w-[7px] h-[7px] rotate-45 border"
                style={{ borderColor: "hsl(var(--gold) / 0.15)" }}
              />
            )}
          </div>
        ))}

        {/* Connecting line behind diamonds */}
        <div className="absolute left-3 right-3 top-1/2 -translate-y-1/2 h-px bg-border/30" />
        <motion.div
          className="absolute left-3 top-1/2 -translate-y-1/2 h-px origin-left"
          style={{
            background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--primary) / 0.3))",
          }}
          animate={{ width: `${Math.max(0, (currentStep / (totalSteps - 1)) * 100)}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>

      {/* Gold shimmer progress bar */}
      <div className="h-px bg-border/40 w-full overflow-hidden relative">
        <motion.div
          className="h-full relative"
          style={{
            background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)), hsl(var(--primary)))",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            className="absolute inset-0"
            style={{ background: "linear-gradient(90deg, transparent 0%, hsl(0 0% 100% / 0.3) 50%, transparent 100%)" }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
          />
        </motion.div>
        <motion.div
          className="absolute top-0 left-0 h-[3px] blur-[2px] pointer-events-none"
          style={{
            background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15))",
          }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
});

InquireStepIndicator.displayName = "InquireStepIndicator";
export default InquireStepIndicator;
