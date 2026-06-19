import { useState } from "react";
import { motion, MotionValue } from "framer-motion";
import ceremonyImage from "@/assets/ceremony-setup.jpg";

interface HeroFloatingInsetProps {
  secondaryImgY: MotionValue<string>;
  secondaryImgOpacity: MotionValue<number>;
}

const HeroFloatingInset = ({ secondaryImgY, secondaryImgOpacity }: HeroFloatingInsetProps) => {
  const [isInsetHovered, setIsInsetHovered] = useState(false);

  return (
    <motion.div
      className="absolute bottom-16 right-6 md:right-12 z-20 hidden lg:block"
      style={{ y: secondaryImgY, opacity: secondaryImgOpacity }}
      initial={{ opacity: 0, y: 30, clipPath: "inset(100% 0 0 0)" }}
      animate={{ opacity: 1, y: 0, clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.2, delay: 2.5, ease: [0.25, 0.1, 0.25, 1] }}
    >
      <div
        className="relative group"
        onMouseEnter={() => setIsInsetHovered(true)}
        onMouseLeave={() => setIsInsetHovered(false)}
      >
        <div className="w-40 xl:w-48 aspect-[3/4] overflow-hidden shadow-2xl relative">
          {/* Cinematic sprocket holes — film strip effect */}
          <div className="absolute top-0 bottom-0 left-0 w-3 z-10 flex flex-col justify-between py-3 items-center pointer-events-none">
            {Array.from({ length: 6 }).map((_, i) => (
              <span
                key={i}
                className="w-1.5 h-1.5 rounded-[1px] border border-white/10"
                style={{ background: "hsl(var(--gold) / 0.06)" }}
              />
            ))}
          </div>
          <img
            src={ceremonyImage}
            alt=""
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            loading="eager"
          />
          {/* Cinematic gradient on hover */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"
            animate={{ opacity: isInsetHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          {/* Corner frame accents — gold gradient */}
          <div className="absolute top-2 left-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
            <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
            <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
          </div>
          <div className="absolute bottom-2 right-2 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" aria-hidden="true">
            <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
            <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
          </div>
          {/* Hover caption */}
          <motion.div
            className="absolute bottom-3 left-3 right-3"
            initial={false}
            animate={{ opacity: isInsetHovered ? 1 : 0, y: isInsetHovered ? 0 : 6 }}
            transition={{ duration: 0.3 }}
          >
            <p className="font-serif-wedding text-caption text-white/70 italic">
              "A ceremony as calm as the mountains"
            </p>
          </motion.div>
        </div>
        {/* Elegant caption below inset */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.2, duration: 0.6 }}
          className="flex items-center justify-end gap-2 mt-3"
        >
          <span className="w-4 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2))" }} />
          <span className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-white/60">
            Jasper · Alberta
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default HeroFloatingInset;
