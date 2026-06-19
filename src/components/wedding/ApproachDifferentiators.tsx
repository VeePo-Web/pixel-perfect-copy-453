import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import GoldFrame from "./GoldFrame";
import BreathingDiamond from "./BreathingDiamond";
import founderImage from "@/assets/founder-portrait.jpg";

const differentiators = [
  {
    title: "One Planner, Start to Finish",
    detail: "The planner you meet is the planner on your wedding day. No hand-offs, no surprises — just continuity and trust.",
    expanded: "From the very first call through final clean-up, you'll work with the same dedicated planner who knows every detail of your celebration. This consistency means faster decisions, fewer miscommunications, and a planner who truly understands your style, preferences, and priorities.",
  },
  {
    title: "Curated Vendor Network",
    detail: "We've spent years building relationships with Edmonton's finest vendors. Every recommendation is personally vetted and aligned with your aesthetic.",
    expanded: "Our vendor partners are selected through rigorous vetting — we've seen their work firsthand across dozens of weddings. When we recommend a florist, photographer, or caterer, it's because we trust them implicitly and know they'll deliver excellence on your day.",
  },
  {
    title: "Calm Under Pressure",
    detail: "Rain on ceremony day? Vendor running late? You'll never know. Our team leads with quiet confidence, handling every pivot behind the scenes.",
    expanded: "We rehearse contingency plans for every scenario — weather changes, timeline shifts, last-minute surprises. Our calm demeanor is earned through hundreds of events and the discipline to prepare for the unexpected so you can stay fully present.",
  },
  {
    title: "Design-Led Approach",
    detail: "We don't just coordinate logistics — we design cohesive experiences where every visual element tells your story.",
    expanded: "From the save-the-date palette through ceremony styling to reception flow, we think like designers. Every texture, colour, material, and layout choice is intentional — creating a unified aesthetic that photographs beautifully and feels authentically you.",
  },
];

const ApproachDifferentiators = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background relative overflow-hidden" aria-label="What Sets Us Apart">
      <motion.div
        className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.015 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-script text-[20rem] text-foreground leading-none">
          &
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          {/* Left: Sticky founder image */}
          <div className="hidden lg:block">
            <div className="sticky top-28">
              <ImageReveal direction="left" delay={0.1}>
                <div
                  className="aspect-[3/4] overflow-hidden max-w-md relative group"
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <GoldFrame inset="12px" delay={0.6} />

                  <div className={`absolute top-0 left-0 right-0 h-[6%] bg-foreground/90 z-10 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isHovered ? "translate-y-0" : "-translate-y-full"}`} />
                  <div className={`absolute bottom-0 left-0 right-0 h-[6%] bg-foreground/90 z-10 transition-transform duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)] ${isHovered ? "translate-y-0" : "translate-y-full"}`} />

                  <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                    <div
                      className={`absolute inset-0 transition-transform duration-1000 ease-out ${isHovered ? "translate-x-full" : "-translate-x-full"}`}
                      style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.06), hsl(var(--gold) / 0.1), hsl(var(--gold) / 0.06), transparent)" }}
                    />
                  </div>

                  {["top-3 left-3", "top-3 right-3 rotate-90", "bottom-3 right-3 rotate-180", "bottom-3 left-3 -rotate-90"].map((pos, i) => (
                    <div
                      key={i}
                      className={`absolute ${pos} w-8 h-8 z-20 pointer-events-none transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}
                      aria-hidden="true"
                    >
                      <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), transparent)" }} />
                      <span className="absolute top-0 left-0 w-px h-full" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), transparent)" }} />
                    </div>
                  ))}

                  <img
                    src={founderImage}
                    alt="Meg Wolodko, founder of Hickory & Rose"
                    className={`w-full h-full object-cover transition-transform duration-700 ${isHovered ? "scale-105" : "scale-100"}`}
                    loading="lazy"
                  />

                  <div className={`absolute bottom-[6%] left-0 right-0 z-20 flex items-center gap-3 px-5 py-3 transition-all duration-700 ${isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"}`}>
                    <span className="w-6 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), transparent)" }} />
                    <span className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-white/60">Founder, Hickory & Rose</span>
                  </div>

                  <span className={`absolute top-4 right-4 z-20 font-sans-wedding text-caption tracking-[0.2em] text-white/60 transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}>FR01</span>
                </div>
              </ImageReveal>
              <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground/60 mt-4">
                Your planner, from first call to last dance
              </p>
            </div>
          </div>

          {/* Right: Differentiators with accordion */}
          <div>
            <ScrollReveal>
              <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-3">02</span>
              <p className="font-overline text-muted-foreground/50 mb-3">The Difference</p>
              <h2 className="font-serif-wedding text-display-lg text-foreground mb-4">
                What Sets Us Apart
              </h2>
              <p className="font-sans-wedding text-body-sm text-muted-foreground/60 leading-relaxed font-light mb-12 max-w-md">
                Beyond logistics and timelines, here's what you'll experience working with Hickory & Rose.
              </p>
            </ScrollReveal>

            <div className="border-t" style={{ borderImage: "linear-gradient(90deg, hsl(var(--gold) / 0.15), hsl(var(--gold) / 0.06), transparent) 1" }}>
              {differentiators.map((diff, index) => {
                const isOpen = expandedIndex === index;
                return (
                  <ScrollReveal key={diff.title} delay={index * 0.08}>
                    <div
                      className="py-8 md:py-10 group cursor-pointer relative"
                      onClick={() => setExpandedIndex(isOpen ? null : index)}
                      role="button"
                      aria-expanded={isOpen}
                      tabIndex={0}
                      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setExpandedIndex(isOpen ? null : index); } }}
                    >
                      {/* Row shimmer */}
                      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden" aria-hidden="true">
                        <div
                          className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.02), hsl(var(--gold) / 0.04), hsl(var(--gold) / 0.02), transparent)" }}
                        />
                      </div>

                      <div className="flex items-baseline gap-4 mb-3 relative">
                        <span className="font-serif-wedding text-2xl font-light text-primary/15 group-hover:text-primary/30 transition-colors duration-500">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="font-serif-wedding text-display-sm text-foreground group-hover:text-primary transition-colors duration-500 relative flex-1">
                          {diff.title}
                          <span
                            className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-700 ease-out"
                            style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1), transparent)" }}
                          />
                        </h3>
                        {/* Expand indicator */}
                        <span className="relative w-5 h-5 shrink-0 flex items-center justify-center">
                          <span
                            className="absolute w-3 h-[1.5px] transition-all duration-500"
                            style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.25))" }}
                          />
                          <span
                            className={`absolute w-[1.5px] h-3 transition-all duration-500 ${isOpen ? "scale-y-0 opacity-0" : "scale-y-100 opacity-100"}`}
                            style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.25))" }}
                          />
                        </span>
                      </div>

                      <p className="font-sans-wedding text-body-sm text-muted-foreground/60 leading-relaxed font-light pl-12 group-hover:text-muted-foreground transition-colors duration-500">
                        {diff.detail}
                      </p>

                      {/* Expandable detail */}
                      <AnimatePresence>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                            className="overflow-hidden"
                          >
                            <div className="pl-12 pt-4 relative">
                              <motion.span
                                className="origin-top absolute left-12 top-4 w-[2px] bottom-0"
                                style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.05))" }}
                                initial={{ scaleY: 0 }}
                                animate={{ scaleY: 1 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                              />
                              <p className="font-sans-wedding text-body-sm text-muted-foreground/50 leading-relaxed font-light pl-4">
                                {diff.expanded}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Gold gradient divider */}
                      <motion.div
                        className="h-px mt-8 origin-left"
                        style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.12), hsl(var(--gold) / 0.04), transparent)" }}
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                      />
                    </div>
                  </ScrollReveal>
                );
              })}
            </div>

            <div className="flex justify-center mt-10">
              <BreathingDiamond size={8} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ApproachDifferentiators;
