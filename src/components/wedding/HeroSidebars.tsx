import { motion, AnimatePresence, MotionValue } from "framer-motion";

interface HeroSidebarsProps {
  sideTextY: MotionValue<string>;
  activeSeasonIdx: number;
  seasonAvailability: { label: string; status: string }[];
}

const HeroSidebars = ({ sideTextY, activeSeasonIdx, seasonAvailability }: HeroSidebarsProps) => (
  <>
    {/* Left sidebar — "Scroll to Explore" vertical text */}
    <motion.div
      className="absolute left-6 md:left-10 top-1/2 z-20 hidden lg:flex flex-col items-center gap-4 pointer-events-none"
      style={{ y: sideTextY }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.2, duration: 0.8 }}
      aria-hidden="true"
    >
      <motion.div
        className="w-px h-12 origin-top"
        style={{ background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.3))" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 3.4, duration: 0.8 }}
      />
      <span
        className="font-sans-wedding text-caption tracking-[0.3em] uppercase text-white/60 font-light"
        style={{ writingMode: "vertical-rl" }}
      >
        Scroll to Explore
      </span>
      <motion.div
        className="w-px h-8 origin-top"
        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent)" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 3.6, duration: 0.6 }}
      />
    </motion.div>

    {/* Right sidebar — Animated season availability ticker */}
    <motion.div
      className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 hidden lg:flex flex-col items-center gap-4 pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 3.5, duration: 0.8 }}
      aria-hidden="true"
    >
      <span className="font-sans-wedding text-caption tracking-[0.25em] uppercase text-white/60" style={{ writingMode: "vertical-rl" }}>
        Now Booking
      </span>
      <motion.div
        className="w-px h-6 origin-top"
        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.25), transparent)" }}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ delay: 3.7, duration: 0.5 }}
      />
      <div className="h-10 overflow-hidden relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSeasonIdx}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.4 }}
            className="text-center"
          >
            <span className="font-serif-wedding text-caption text-white/60 block" style={{ writingMode: "vertical-rl" }}>
              {seasonAvailability[activeSeasonIdx].label}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-col items-center gap-1">
        {seasonAvailability.map((_, i) => (
          <span
            key={i}
            className={`w-1 h-1 rounded-full transition-all duration-300 ${
              i === activeSeasonIdx ? "bg-gold/50 scale-125" : "bg-white/10"
            }`}
          />
        ))}
      </div>
    </motion.div>
  </>
);

export default HeroSidebars;
