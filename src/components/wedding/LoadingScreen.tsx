import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LoadingScreen = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [phase, setPhase] = useState<"enter" | "hold" | "exit">("enter");
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      progressRef.current += Math.random() * 15 + 5;
      if (progressRef.current >= 100) {
        progressRef.current = 100;
        clearInterval(interval);
      }
      setProgress(Math.min(progressRef.current, 100));
    }, 120);

    const holdTimer = setTimeout(() => setPhase("hold"), 400);
    const exitTimer = setTimeout(() => setPhase("exit"), 1600);
    const doneTimer = setTimeout(() => setIsLoading(false), 2400);
    return () => {
      clearInterval(interval);
      clearTimeout(holdTimer);
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, []);

  const ease = [0.25, 0.1, 0.25, 1.0] as const;
  const active = phase !== "enter";

  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <>
            {/* Left curtain */}
            <motion.div
              key="curtain-left"
              initial={{ x: "0%" }}
              exit={{ x: "-100%" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 left-0 w-1/2 z-[101] bg-foreground"
            />
            {/* Right curtain */}
            <motion.div
              key="curtain-right"
              initial={{ x: "0%" }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
              className="fixed inset-y-0 right-0 w-1/2 z-[101] bg-foreground"
            />

            {/* Gold shimmer line — horizontal wipe during exit */}
            <motion.div
              key="gold-wipe"
              className="fixed top-1/2 left-0 right-0 h-px z-[103] pointer-events-none"
              initial={{ scaleX: 0, opacity: 0 }}
              exit={{ scaleX: [0, 1, 1, 0], opacity: [0, 1, 1, 0] }}
              transition={{
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
                times: [0, 0.4, 0.6, 1],
              }}
              style={{
                background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold, 38 60% 55%) / 0.6) 30%, hsl(var(--gold, 38 60% 55%) / 0.9) 50%, hsl(var(--gold, 38 60% 55%) / 0.6) 70%, transparent 100%)",
                transformOrigin: "center",
                boxShadow: "0 0 20px 4px hsl(var(--gold, 38 60% 55%) / 0.3)",
              }}
            />

            {/* Content layer (above curtains) */}
            <motion.div
              key="loader-content"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease }}
              className="fixed inset-0 z-[102] flex flex-col items-center justify-center pointer-events-none"
            >
              {/* Film grain */}
              <div
                className="absolute inset-0 pointer-events-none opacity-[0.04]"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                  backgroundSize: "128px 128px",
                }}
              />

              {/* Corner ornaments — cinematic framing */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="absolute inset-0 pointer-events-none"
                aria-hidden="true"
              >
                {/* Top-left */}
                <div className="absolute top-8 left-8 md:top-12 md:left-12">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={active ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                    className="w-8 md:w-12 h-px origin-left"
                    style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={active ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease }}
                    className="w-px h-8 md:h-12 origin-top"
                    style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                </div>
                {/* Top-right */}
                <div className="absolute top-8 right-8 md:top-12 md:right-12">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={active ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                    className="w-8 md:w-12 h-px origin-right ml-auto"
                    style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={active ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease }}
                    className="w-px h-8 md:h-12 origin-top ml-auto"
                    style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                </div>
                {/* Bottom-left */}
                <div className="absolute bottom-8 left-8 md:bottom-12 md:left-12 flex flex-col items-start justify-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={active ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease }}
                    className="w-px h-8 md:h-12 origin-bottom"
                    style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={active ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                    className="w-8 md:w-12 h-px origin-left"
                    style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                </div>
                {/* Bottom-right */}
                <div className="absolute bottom-8 right-8 md:bottom-12 md:right-12 flex flex-col items-end justify-end">
                  <motion.div
                    initial={{ scaleY: 0 }}
                    animate={active ? { scaleY: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease }}
                    className="w-px h-8 md:h-12 origin-bottom"
                    style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                  <motion.div
                    initial={{ scaleX: 0 }}
                    animate={active ? { scaleX: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.4, ease }}
                    className="w-8 md:w-12 h-px origin-right"
                    style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.2), transparent)" }}
                  />
                </div>
              </motion.div>

              {/* Breathing background glow */}
              <motion.div
                className="absolute w-64 h-64 rounded-full pointer-events-none"
                style={{
                  background: "radial-gradient(circle, hsl(var(--gold) / 0.04), transparent 70%)",
                }}
                animate={active ? {
                  scale: [1, 1.3, 1],
                  opacity: [0.3, 0.6, 0.3],
                } : {}}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Orbiting diamond particles */}
              {active && [0, 1, 2].map((i) => (
                <motion.span
                  key={`orbit-${i}`}
                  className="absolute w-1 h-1 rotate-45 pointer-events-none"
                  style={{
                    background: `linear-gradient(135deg, hsl(var(--gold) / ${0.4 - i * 0.1}), hsl(var(--gold) / 0.05))`,
                  }}
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.8, 0],
                    rotate: [45 + i * 120, 45 + i * 120 + 360],
                    x: [0, Math.cos((i * 2 * Math.PI) / 3) * 80],
                    y: [0, Math.sin((i * 2 * Math.PI) / 3) * 80],
                  }}
                  transition={{
                    duration: 3,
                    delay: 0.3 + i * 0.4,
                    ease: "easeInOut",
                    repeat: Infinity,
                    repeatType: "reverse",
                  }}
                  aria-hidden="true"
                />
              ))}

              <div className="text-center relative">
                {/* Top ornamental line */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={active ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.6, delay: 0.05, ease }}
                  className="w-12 h-px mx-auto mb-10 origin-center"
                  style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.35), transparent)" }}
                />

                {/* Monogram with staggered reveals + breathing pulse */}
                <div className="overflow-hidden">
                  <motion.div
                    initial={{ y: "130%" }}
                    animate={active ? { y: "0%" } : {}}
                    transition={{ duration: 0.7, ease }}
                    className="flex items-baseline justify-center gap-3"
                  >
                    <motion.span
                      className="font-serif-wedding text-5xl md:text-6xl font-light tracking-[0.1em]"
                      style={{ color: "hsl(var(--gold) / 0.7)" }}
                      initial={{ opacity: 0 }}
                      animate={active ? { opacity: 1 } : {}}
                      transition={{ delay: 0.15, duration: 0.4 }}
                    >
                      H
                    </motion.span>
                    <motion.span
                      className="font-script text-4xl md:text-5xl text-background/20"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={active ? {
                        opacity: [0, 1, 1],
                        scale: [0.8, 1, 1],
                      } : {}}
                      transition={{ delay: 0.25, duration: 0.5 }}
                    >
                      &
                    </motion.span>
                    <motion.span
                      className="font-script text-5xl md:text-6xl"
                      style={{ color: "hsl(var(--gold) / 0.7)" }}
                      initial={{ opacity: 0 }}
                      animate={active ? { opacity: 1 } : {}}
                      transition={{ delay: 0.35, duration: 0.4 }}
                    >
                      R
                    </motion.span>
                  </motion.div>
                </div>

                {/* Gold shimmer progress bar */}
                <motion.div
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={active ? { scaleX: 1, opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.2, ease }}
                  className="w-24 h-px mx-auto mt-8 origin-center overflow-hidden relative"
                >
                  <div className="absolute inset-0 bg-background/8" />
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-gold/40 via-gold/70 to-gold/40"
                    style={{ width: `${progress}%` }}
                    transition={{ duration: 0.15 }}
                  />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut", repeat: 1 }}
                  />
                </motion.div>

                {/* Percentage counter */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="font-sans-wedding text-caption tracking-[0.3em] text-background/50 mt-3 tabular-nums"
                >
                  {Math.round(progress)}%
                </motion.p>

                {/* Brand name */}
                <div className="overflow-hidden mt-4">
                  <motion.p
                    initial={{ y: "100%", opacity: 0 }}
                    animate={active ? { y: "0%", opacity: 1 } : {}}
                    transition={{ duration: 0.5, delay: 0.45, ease }}
                    className="font-sans-wedding text-caption tracking-[0.4em] uppercase text-background/50 font-light"
                  >
                    Hickory & Rose
                  </motion.p>
                </div>

                {/* Tagline */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={active ? { opacity: 1 } : {}}
                  transition={{ duration: 0.4, delay: 0.65 }}
                  className="font-serif-wedding text-caption italic text-background/50 mt-3 tracking-wide"
                >
                  Luxury Wedding Planning
                </motion.p>
              </div>

              {/* Bottom location with year */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={active ? { opacity: 1 } : {}}
                transition={{ duration: 0.3, delay: 0.75 }}
                className="absolute bottom-10 flex items-center gap-3"
              >
                <span className="w-5 h-px bg-background/15" />
                <span className="font-sans-wedding text-caption tracking-[0.35em] uppercase text-background/50 font-light">
                  Edmonton · Alberta · Canadian Rockies
                </span>
                <span className="w-5 h-px bg-background/15" />
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      {children}
    </>
  );
};

export default LoadingScreen;
