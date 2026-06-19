import { useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ImageReveal from "./ImageReveal";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";

// Aesthetic direction only — no fabricated couples/venues/dates.
interface Story {
  src: string;
  alt: string;
  category: string;
  aspect: string;
}

interface PortfolioMasonryGridProps {
  stories: Story[];
}

const PortfolioMasonryGrid = ({ stories }: PortfolioMasonryGridProps) => {
  const gridRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const items = gridRef.current?.querySelectorAll<HTMLElement>("[data-grid-item]");
    if (!items) return;
    items.forEach((item) => {
      const rect = item.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      item.style.setProperty("--mouse-x", `${x}%`);
      item.style.setProperty("--mouse-y", `${y}%`);
    });
  }, []);

  return (
    <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background relative overflow-hidden">
      <motion.div
        className="absolute -left-4 top-1/4 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic leading-none">
          Direction
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
        <div
          ref={gridRef}
          onMouseMove={handleMouseMove}
          className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5"
        >
          <AnimatePresence mode="popLayout">
            {stories.map((story, index) => (
              <motion.div
                key={`${story.src}-${index}`}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", stiffness: 100, damping: 15, delay: index * 0.06 }}
                className="break-inside-avoid"
              >
                <ImageReveal delay={index * 0.04} direction={index % 3 === 0 ? "up" : index % 3 === 1 ? "left" : "right"}>
                  <div
                    data-grid-item
                    className={`${story.aspect} overflow-hidden relative group cursor-pointer`}
                    style={{ "--mouse-x": "50%", "--mouse-y": "50%" } as React.CSSProperties}
                  >
                    <div className="absolute top-0 left-0 right-0 z-20 h-[6%] bg-foreground/90 -translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none" />
                    <div className="absolute bottom-0 left-0 right-0 z-20 h-[6%] bg-foreground/90 translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] pointer-events-none" />

                    <div
                      className="absolute inset-0 z-10 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.08) 40%, hsl(var(--gold) / 0.12) 50%, hsl(var(--gold) / 0.08) 60%, transparent 100%)" }}
                    />

                    <div
                      className="absolute inset-0 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: "radial-gradient(circle 200px at var(--mouse-x) var(--mouse-y), hsl(var(--gold) / 0.12), transparent 70%)",
                      }}
                    />

                    <img
                      src={story.src}
                      alt={story.alt}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 left-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), transparent)" }} />
                      <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), transparent)" }} />
                    </div>
                    <div className="absolute bottom-3 right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                      <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.4), transparent)" }} />
                      <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.4), transparent)" }} />
                    </div>

                    <span className="absolute top-3 left-3 font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/0 group-hover:text-white/80 transition-colors duration-500 bg-white/0 group-hover:bg-white/15 backdrop-blur-sm px-2 py-0.5 z-20">
                      {story.category}
                    </span>

                    <span className="absolute top-3 right-3 font-serif-wedding text-caption text-white/0 group-hover:text-white/60 transition-colors duration-500 tabular-nums z-20">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                  </div>
                </ImageReveal>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <ScrollReveal delay={0.2}>
          <div className="text-center mt-16 md:mt-24">
            <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed mb-8 font-light max-w-md mx-auto">
              Every wedding begins with a conversation. Let's talk about yours.
            </p>
            <MagneticButton to="/inquire" variant="primary">
              Begin Your Story
            </MagneticButton>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default PortfolioMasonryGrid;
