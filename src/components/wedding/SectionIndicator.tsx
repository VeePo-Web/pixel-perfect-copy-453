import { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const SectionIndicator = forwardRef<HTMLDivElement>((_, ref) => {
  const [currentSection, setCurrentSection] = useState("");
  const [sectionIndex, setSectionIndex] = useState(0);
  const [totalSections, setTotalSections] = useState(0);
  const [visible, setVisible] = useState(false);
  const sectionsRef = useRef<HTMLElement[]>([]);

  const { scrollYProgress } = useScroll();
  const progressHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const updateSection = useCallback(() => {
    const sections = sectionsRef.current;
    if (!sections.length) return;

    const viewportMid = window.innerHeight * 0.45;
    let activeIdx = 0;

    for (let i = sections.length - 1; i >= 0; i--) {
      const rect = sections[i].getBoundingClientRect();
      if (rect.top <= viewportMid) {
        activeIdx = i;
        break;
      }
    }

    const label = sections[activeIdx]?.getAttribute("aria-label") || "";
    setCurrentSection(label);
    setSectionIndex(activeIdx);
    setVisible(window.scrollY > window.innerHeight * 0.3);
  }, []);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.innerWidth < 1024) return;

    const main = document.getElementById("main-content");
    if (!main) return;

    const gather = () => {
      const els = Array.from(main.querySelectorAll("section[aria-label]")) as HTMLElement[];
      sectionsRef.current = els;
      setTotalSections(els.length);
      updateSection();
    };

    const timer = setTimeout(gather, 500);
    window.addEventListener("scroll", updateSection, { passive: true });

    const observer = new MutationObserver(gather);
    observer.observe(main, { childList: true, subtree: true });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", updateSection);
      observer.disconnect();
    };
  }, [updateSection]);

  if (!currentSection && !visible) return null;

  return (
    <div ref={ref}>
      {/* CSS-driven visibility instead of AnimatePresence to avoid ref warnings */}
      <div
        className={`fixed left-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 pointer-events-none transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${
          visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-5"
        }`}
      >
        {/* Vertical progress track */}
        <div className="relative w-px h-24">
          <div className="absolute inset-0 bg-foreground/[0.04]" />
          <motion.div
            className="absolute bottom-0 left-0 w-full origin-bottom"
            style={{
              height: progressHeight,
              background: "linear-gradient(0deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.1))",
            }}
          />
          <motion.div
            className="absolute left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full"
            style={{
              top: progressHeight,
              background: "hsl(var(--gold))",
              boxShadow: "0 0 8px 2px hsl(var(--gold) / 0.3)",
            }}
          />
        </div>

        {/* Section label — rotated */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSection}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="writing-mode-vertical"
            style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
          >
            <span className="font-sans-wedding text-caption tracking-[0.25em] uppercase text-muted-foreground/60 rotate-180 inline-block">
              {currentSection}
            </span>
          </motion.div>
        </AnimatePresence>

        {/* Section counter */}
        {totalSections > 0 && (
          <div className="flex flex-col items-center gap-1">
            <span className="font-sans-wedding text-caption tracking-[0.2em] text-muted-foreground/60 tabular-nums">
              {String(sectionIndex + 1).padStart(2, "0")}
            </span>
            <span className="w-2 h-px bg-muted-foreground/30" />
            <span className="font-sans-wedding text-caption tracking-[0.2em] text-muted-foreground/60 tabular-nums">
              {String(totalSections).padStart(2, "0")}
            </span>
          </div>
        )}
      </div>
    </div>
  );
});

SectionIndicator.displayName = "SectionIndicator";
export default SectionIndicator;
