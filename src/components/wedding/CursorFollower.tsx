import { useEffect, useState, useRef, useCallback } from "react";
import { motion, useSpring, AnimatePresence } from "framer-motion";
import { memo } from "react";

interface Particle {
  id: number;
  x: number;
  y: number;
}

let particleId = 0;

const CursorFollower = memo(() => {
  const [visible, setVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [cursorLabel, setCursorLabel] = useState("");
  const [particles, setParticles] = useState<Particle[]>([]);
  const isTouchDevice = useRef(false);
  const lastParticlePos = useRef({ x: 0, y: 0 });

  const springConfig = { damping: 25, stiffness: 300, mass: 0.5 };
  const x = useSpring(0, springConfig);
  const y = useSpring(0, springConfig);

  // Outer ring — slightly lagged for organic feel
  const outerSpring = { damping: 20, stiffness: 200, mass: 0.8 };
  const outerX = useSpring(0, outerSpring);
  const outerY = useSpring(0, outerSpring);

  const spawnParticle = useCallback((cx: number, cy: number) => {
    const dx = cx - lastParticlePos.current.x;
    const dy = cy - lastParticlePos.current.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 40) return; // Only spawn when cursor moves enough
    lastParticlePos.current = { x: cx, y: cy };
    const id = ++particleId;
    setParticles((prev) => [...prev.slice(-3), { id, x: cx, y: cy }]);
    // Auto-remove after animation
    setTimeout(() => {
      setParticles((prev) => prev.filter((p) => p.id !== id));
    }, 800);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) {
      isTouchDevice.current = true;
      return;
    }
    // Respect reduced-motion — a trailing custom cursor is unwelcome motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const handleMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      outerX.set(e.clientX);
      outerY.set(e.clientY);
      if (!visible) setVisible(true);
      spawnParticle(e.clientX, e.clientY);
    };

    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const cursorEl = target.closest("[data-cursor-hover]");
      const interactive = target.closest("a, button, [role='button'], input, textarea, select");

      if (cursorEl) {
        setIsHovering(true);
        setCursorLabel(cursorEl.getAttribute("data-cursor-label") || "");
      } else if (interactive) {
        setIsHovering(true);
        setCursorLabel("");
      } else {
        setIsHovering(false);
        setCursorLabel("");
      }
    };

    const handleLeave = () => setVisible(false);
    const handleEnter = () => setVisible(true);

    window.addEventListener("mousemove", handleMove, { passive: true });
    window.addEventListener("mouseover", handleOver, { passive: true });
    document.addEventListener("mouseleave", handleLeave);
    document.addEventListener("mouseenter", handleEnter);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      window.removeEventListener("mouseover", handleOver);
      document.removeEventListener("mouseleave", handleLeave);
      document.removeEventListener("mouseenter", handleEnter);
    };
  }, [x, y, outerX, outerY, visible, spawnParticle]);

  if (isTouchDevice.current || !visible) return null;

  return (
    <>
      {/* Gold dust particles — fade out behind cursor */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed top-0 left-0 z-[997] pointer-events-none will-change-transform"
          initial={{ x: p.x, y: p.y, opacity: 0.35, scale: 1 }}
          animate={{ opacity: 0, scale: 0.3, y: p.y + 12 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          style={{ x: p.x, y: p.y }}
        >
          <div
            className="w-1 h-1 -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{
              background: "hsl(var(--gold))",
              boxShadow: "0 0 4px 1px hsl(var(--gold) / 0.3)",
            }}
          />
        </motion.div>
      ))}

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 z-[999] pointer-events-none mix-blend-difference will-change-transform"
        style={{ x, y }}
      >
        <motion.div
          animate={{
            width: isHovering ? (cursorLabel ? 64 : 48) : 8,
            height: isHovering ? (cursorLabel ? 64 : 48) : 8,
            opacity: isHovering ? 0.25 : 0.5,
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="rounded-full bg-primary -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
        >
          <AnimatePresence>
            {cursorLabel && (
              <motion.span
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="font-sans-wedding text-[0.5rem] tracking-[0.15em] uppercase text-primary-foreground font-medium"
              >
                {cursorLabel}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Outer gold accent ring — slightly lagged */}
      <motion.div
        className="fixed top-0 left-0 z-[998] pointer-events-none will-change-transform"
        style={{ x: outerX, y: outerY }}
      >
        <motion.div
          animate={{
            width: isHovering ? (cursorLabel ? 80 : 60) : 24,
            height: isHovering ? (cursorLabel ? 80 : 60) : 24,
            opacity: isHovering ? 0.15 : 0.08,
            borderColor: isHovering
              ? "hsl(var(--gold) / 0.4)"
              : "hsl(var(--gold) / 0.15)",
          }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-full border -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>
    </>
  );
});

CursorFollower.displayName = "CursorFollower";

export default CursorFollower;
