import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import BreathingDiamond from "./BreathingDiamond";

const processSteps = [
  { number: "01", title: "Discovery Call", time: "Week 1", description: "We start with a relaxed conversation. Tell us about your vision, your story, and how you want to feel on your wedding day. No pressure, no sales pitch — just genuine connection.", pullQuote: "Every great wedding begins with listening." },
  { number: "02", title: "Proposal & Booking", time: "Week 1–2", description: "Based on our call, we craft a customized proposal that fits your needs and investment level. Once you say yes, the real magic begins.", pullQuote: null },
  { number: "03", title: "Design & Planning", time: "Months 2–10", description: "We dive deep into your vision — curating vendors, refining design concepts, building timelines, and handling every logistical detail so you don't have to.", pullQuote: "This is where your vision becomes tangible." },
  { number: "04", title: "Final Details", time: "Month 11", description: "Everything comes together. Final walkthroughs, vendor confirmations, timeline refinements, and a comprehensive rehearsal to ensure every person knows their role.", pullQuote: null },
  { number: "05", title: "Your Wedding Day", time: "The Day", description: "We arrive early, coordinate everything behind the scenes, and lead with calm authority. You simply show up and feel every beautiful moment.", pullQuote: "You feel it. We handle it." },
];

const ApproachProcessTimeline = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const progressWidth = useTransform(scrollYProgress, [0.1, 0.85], ["0%", "100%"]);
  const progressOpacity = useTransform(scrollYProgress, [0.05, 0.15, 0.8, 0.9], [0, 1, 1, 0]);
  const currentStepIndex = useTransform(scrollYProgress, [0.1, 0.3, 0.45, 0.6, 0.75], [0, 1, 2, 3, 4]);

  return (
    <section ref={sectionRef} className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card relative" aria-label="Our Process">
      {/* Sticky scroll progress bar */}
      <motion.div
        className="sticky top-0 z-30 hidden md:block"
        style={{ opacity: progressOpacity }}
      >
        <div className="w-full h-[3px] bg-muted/20 relative overflow-hidden">
          <motion.div
            className="absolute inset-y-0 left-0"
            style={{
              width: progressWidth,
              background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.3))",
            }}
          />
          {/* Glow */}
          <motion.div
            className="absolute inset-y-0 left-0 blur-[3px]"
            style={{
              width: progressWidth,
              background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25))",
            }}
          />
        </div>
        {/* Current step label */}
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <motion.div className="flex justify-between py-2">
            {processSteps.map((step, i) => (
              <StepLabel key={step.number} index={i} title={step.title} currentIndex={currentStepIndex} />
            ))}
          </motion.div>
        </div>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-24">
            <p className="font-overline text-muted-foreground/50 mb-4">Five Steps</p>
            <h2 className="font-serif-wedding text-display-lg text-foreground">
              From First Call to Final Dance
            </h2>
          </div>
        </ScrollReveal>

        <div className="relative">
          {/* The "Golden Thread" Interactive Timeline */}
          <div className="absolute left-[1.75rem] md:left-[3.25rem] top-0 bottom-0 w-12 hidden md:block -translate-x-1/2 pointer-events-none z-0">
            <svg viewBox="0 0 48 1000" preserveAspectRatio="none" className="w-full h-full overflow-visible">
              <motion.path
                d="M 24 0 C 24 100, 48 150, 48 250 C 48 350, 0 400, 0 500 C 0 600, 48 650, 48 750 C 48 850, 24 900, 24 1000"
                fill="none"
                stroke="url(#golden-thread-grad)"
                strokeWidth="1.5"
                style={{
                  pathLength: useTransform(scrollYProgress, [0.1, 0.9], [0, 1]),
                  opacity: useTransform(scrollYProgress, [0.1, 0.15, 0.8, 0.9], [0, 1, 1, 0]),
                }}
              />
              <motion.path
                d="M 24 0 C 24 100, 48 150, 48 250 C 48 350, 0 400, 0 500 C 0 600, 48 650, 48 750 C 48 850, 24 900, 24 1000"
                fill="none"
                stroke="url(#golden-thread-grad)"
                strokeWidth="4"
                className="blur-[4px]"
                style={{
                  pathLength: useTransform(scrollYProgress, [0.1, 0.9], [0, 1]),
                  opacity: useTransform(scrollYProgress, [0.1, 0.15, 0.8, 0.9], [0, 0.5, 0.5, 0]),
                }}
              />
              <defs>
                <linearGradient id="golden-thread-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--gold) / 0.1)" />
                  <stop offset="20%" stopColor="hsl(var(--gold) / 0.8)" />
                  <stop offset="80%" stopColor="hsl(var(--gold) / 0.8)" />
                  <stop offset="100%" stopColor="hsl(var(--gold) / 0.1)" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {processSteps.map((step, index) => (
            <ScrollReveal key={step.number} delay={index * 0.08}>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 py-10 md:py-14 group relative">
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden"
                  aria-hidden="true"
                >
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.03), hsl(var(--gold) / 0.05), hsl(var(--gold) / 0.03), transparent)" }}
                  />
                </div>

                <div className="md:col-span-2 relative flex items-baseline gap-3">
                  <motion.div
                    className="hidden md:block absolute left-[3.25rem] top-3 w-2.5 h-2.5 rounded-full -translate-x-1/2 transition-all duration-500 group-hover:shadow-[0_0_8px_hsl(var(--gold)/0.5)]"
                    style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.2))" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + index * 0.1 }}
                  />
                  <div
                    className="absolute -left-4 -top-4 w-24 h-24 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                    style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.06), transparent 70%)" }}
                    aria-hidden="true"
                  />
                  <motion.span
                    className="font-serif-wedding text-5xl md:text-6xl font-light text-primary/15 group-hover:text-primary/30 transition-colors duration-700 relative"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.1 + index * 0.1 }}
                  >
                    {step.number}
                  </motion.span>
                  <span className="w-2 h-2 rotate-45 shrink-0 md:hidden" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))" }} />
                </div>

                <div className="md:col-span-3">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-1.5 h-1.5 rotate-45 shrink-0 hidden md:inline-block" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }} />
                    <h3 className="font-serif-wedding text-display-md text-foreground group-hover:text-primary transition-colors duration-500">
                      {step.title}
                    </h3>
                  </div>
                  <p className="font-overline text-muted-foreground/40 mt-1">
                    {step.time}
                  </p>
                </div>

                <div className="md:col-span-7">
                  <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">
                    {step.description}
                  </p>
                  {step.pullQuote && (
                    <motion.p
                      className="font-serif-wedding text-lg italic text-primary/40 mt-4 pl-4 relative"
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      <span
                        className="absolute left-0 top-0 bottom-0 w-[2px]"
                        style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.08))" }}
                        aria-hidden="true"
                      />
                      {step.pullQuote}
                    </motion.p>
                  )}
                </div>

                <div className="md:col-span-12">
                  <motion.div
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                    className="h-px mt-6 origin-left"
                    style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.15), hsl(var(--gold) / 0.06), transparent)" }}
                  />
                </div>
              </div>
            </ScrollReveal>
          ))}

          <div className="flex justify-center pt-8">
            <BreathingDiamond size={8} />
          </div>
        </div>
      </div>
    </section>
  );
};

/** Small step label that highlights when active */
const StepLabel = ({ index, title, currentIndex }: { index: number; title: string; currentIndex: ReturnType<typeof useTransform> }) => {
  const isActive = useTransform(currentIndex, (v: number) => Math.round(v) === index);
  const opacity = useTransform(isActive, (v: boolean) => (v ? 1 : 0.3));
  return (
    <motion.span
      className="font-sans-wedding text-[0.5rem] tracking-[0.12em] uppercase text-foreground/60 transition-colors"
      style={{ opacity }}
    >
      {title}
    </motion.span>
  );
};

export default ApproachProcessTimeline;
