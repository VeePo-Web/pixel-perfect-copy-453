import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

interface BranchDecorationProps {
  className?: string;
  flip?: boolean;
}

const BranchDecoration = ({ className = "", flip = false }: BranchDecorationProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 0.15, 0.15, 0.05]);

  return (
    <motion.div
      ref={ref}
      style={{ opacity }}
      className={`pointer-events-none select-none ${flip ? "scale-x-[-1]" : ""} ${className}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 240 80"
        className="w-48 md:w-64 lg:w-72 h-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Main stem — animated path draw */}
        <motion.path
          d="M120 40 Q80 35, 25 45"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="text-primary"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
        <motion.path
          d="M120 40 Q160 35, 215 45"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          className="text-primary"
          initial={{ pathLength: 0 }}
          whileInView={{ pathLength: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
        />

        {/* Left branches — staggered draw */}
        {[
          { d: "M45 42 Q40 28, 30 18", delay: 0.4 },
          { d: "M60 40 Q55 25, 47 16", delay: 0.5 },
          { d: "M78 38 Q74 24, 65 14", delay: 0.6 },
          { d: "M95 37 Q92 26, 85 18", delay: 0.7 },
        ].map((branch) => (
          <motion.path
            key={branch.d}
            d={branch.d}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: branch.delay }}
          />
        ))}

        {/* Left leaves — fade in */}
        {[
          { cx: 28, cy: 16, rx: 3.5, ry: 7, rotate: -35, op: 0.5, delay: 0.8 },
          { cx: 45, cy: 13, rx: 3.5, ry: 7, rotate: -25, op: 0.5, delay: 0.9 },
          { cx: 63, cy: 11, rx: 3.5, ry: 7, rotate: -18, op: 0.5, delay: 1.0 },
          { cx: 83, cy: 15, rx: 3, ry: 6, rotate: -12, op: 0.45, delay: 1.1 },
        ].map((leaf) => (
          <motion.ellipse
            key={`${leaf.cx}-${leaf.cy}`}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="currentColor"
            transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
            className="text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: leaf.op, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: leaf.delay }}
          />
        ))}

        {/* Left lower sub-leaves */}
        <ellipse cx="38" cy="48" rx="2.5" ry="5" fill="currentColor" transform="rotate(40 38 48)" opacity="0.3" className="text-primary" />
        <ellipse cx="65" cy="46" rx="2.5" ry="5" fill="currentColor" transform="rotate(30 65 46)" opacity="0.3" className="text-primary" />

        {/* Right branches — staggered draw */}
        {[
          { d: "M195 42 Q200 28, 210 18", delay: 0.5 },
          { d: "M180 40 Q185 25, 193 16", delay: 0.6 },
          { d: "M162 38 Q166 24, 175 14", delay: 0.7 },
          { d: "M145 37 Q148 26, 155 18", delay: 0.8 },
        ].map((branch) => (
          <motion.path
            key={branch.d}
            d={branch.d}
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            className="text-primary"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut", delay: branch.delay }}
          />
        ))}

        {/* Right leaves — fade in */}
        {[
          { cx: 212, cy: 16, rx: 3.5, ry: 7, rotate: 35, op: 0.5, delay: 0.9 },
          { cx: 195, cy: 13, rx: 3.5, ry: 7, rotate: 25, op: 0.5, delay: 1.0 },
          { cx: 177, cy: 11, rx: 3.5, ry: 7, rotate: 18, op: 0.5, delay: 1.1 },
          { cx: 157, cy: 15, rx: 3, ry: 6, rotate: 12, op: 0.45, delay: 1.2 },
        ].map((leaf) => (
          <motion.ellipse
            key={`${leaf.cx}-${leaf.cy}`}
            cx={leaf.cx}
            cy={leaf.cy}
            rx={leaf.rx}
            ry={leaf.ry}
            fill="currentColor"
            transform={`rotate(${leaf.rotate} ${leaf.cx} ${leaf.cy})`}
            className="text-primary"
            initial={{ opacity: 0, scale: 0.5 }}
            whileInView={{ opacity: leaf.op, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: leaf.delay }}
          />
        ))}

        {/* Right lower sub-leaves */}
        <ellipse cx="202" cy="48" rx="2.5" ry="5" fill="currentColor" transform="rotate(-40 202 48)" opacity="0.3" className="text-primary" />
        <ellipse cx="175" cy="46" rx="2.5" ry="5" fill="currentColor" transform="rotate(-30 175 46)" opacity="0.3" className="text-primary" />

        {/* Center berry cluster — pulsing */}
        <motion.circle
          cx="120"
          cy="38"
          r="2"
          fill="currentColor"
          className="text-primary"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.25 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 1.3 }}
        />
        <circle cx="115" cy="35" r="1.5" fill="currentColor" opacity="0.2" className="text-primary" />
        <circle cx="125" cy="35" r="1.5" fill="currentColor" opacity="0.2" className="text-primary" />
      </svg>
    </motion.div>
  );
};

export default BranchDecoration;
