import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { memo, useState, useEffect } from "react";

const ScrollProgress = memo(() => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Percentage text — updates on scroll
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const unsub = scrollYProgress.on("change", (v) => {
      setPercent(Math.round(v * 100));
    });
    return unsub;
  }, [scrollYProgress]);

  // Show percentage indicator after scrolling past 5%
  const showPercent = percent > 5 && percent < 98;

  return (
    <>
      {/* Primary progress line — gold gradient */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-[2px] z-[60] origin-left"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(var(--sage-deep)), hsl(var(--gold)), hsl(var(--sage-deep)))",
        }}
      />
      {/* Soft glow underneath */}
      <motion.div
        className="fixed top-[1px] left-0 right-0 h-[4px] z-[59] origin-left opacity-20 blur-[2px]"
        style={{
          scaleX,
          background: "linear-gradient(90deg, hsl(var(--sage-deep)), hsl(var(--gold)), hsl(var(--sage-deep)))",
        }}
      />
      {/* Leading edge diamond ornament with gold glow trail */}
      <motion.div
        className="fixed top-0 z-[61] pointer-events-none"
        style={{
          left: useTransform(scaleX, (v) => `calc(${v * 100}% - 4px)`),
          opacity: useTransform(scaleX, [0, 0.02, 0.98, 1], [0, 1, 1, 0]),
        }}
      >
        {/* Trailing glow smear */}
        <div
          className="absolute top-[1px] right-full w-12 h-[3px] opacity-40"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.6))",
          }}
        />
        {/* Diamond ornament */}
        <div
          className="w-2 h-2 rotate-45 -translate-y-[1px]"
          style={{
            background: "hsl(var(--gold))",
            boxShadow: "0 0 10px 3px hsl(var(--gold) / 0.4), 0 0 20px 6px hsl(var(--gold) / 0.15)",
          }}
        />
      </motion.div>
      {/* Floating percentage — right edge */}
      {showPercent && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed top-3 right-6 z-[60] pointer-events-none"
        >
          <span className="font-sans-wedding text-caption tracking-[0.25em] text-muted-foreground/40 tabular-nums">
            {percent}%
          </span>
        </motion.div>
      )}
    </>
  );
});

ScrollProgress.displayName = "ScrollProgress";

export default ScrollProgress;
