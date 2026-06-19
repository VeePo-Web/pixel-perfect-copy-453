import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const CountdownSection = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const weddingDate = new Date("2025-02-15T16:00:00").getTime();

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = weddingDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeUnits = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Seconds", value: timeLeft.seconds },
  ];

  return (
    <section className="bg-sage-mist py-section-mobile md:py-section-tablet relative overflow-hidden">
      {/* Decorative background */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 0.03 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-script text-[16rem] md:text-[24rem] text-foreground leading-none">
          &
        </span>
      </motion.div>

      <div className="container mx-auto px-6 relative">
        <ScrollReveal>
          <div className="flex items-center justify-center gap-4 mb-6">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-8 h-px bg-primary/20 origin-right"
            />
            <span className="w-2 h-2 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.15))" }} />
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-8 h-px bg-primary/20 origin-left"
            />
          </div>
          <p className="font-overline text-muted-foreground text-center mb-4">
            We can't wait to see you
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <h2 className="font-serif-wedding text-display-lg text-foreground text-center mb-3">
            February 15, 2025
          </h2>
          <p className="font-serif-wedding text-sm italic text-muted-foreground/40 text-center mb-12">
            Four o'clock in the afternoon
          </p>
        </ScrollReveal>

        <ScrollReveal delay={0.2}>
          <div className="flex justify-center gap-4 md:gap-8">
            {timeUnits.map((unit, i) => (
              <motion.div
                key={unit.label}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
                className="text-center group"
              >
                <div className="bg-card w-16 h-16 md:w-24 md:h-24 flex items-center justify-center mb-3 border border-border/60 shadow-subtle group-hover:border-primary/30 transition-colors duration-500">
                  <span className="font-serif-wedding text-2xl md:text-4xl text-primary font-light">
                    {unit.value.toString().padStart(2, "0")}
                  </span>
                </div>
                <p className="font-overline text-muted-foreground/50 text-[0.55rem] md:text-[0.625rem]">
                  {unit.label}
                </p>
                {i < timeUnits.length - 1 && (
                  <span className="hidden" aria-hidden="true" />
                )}
              </motion.div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.4}>
          <div className="flex items-center justify-center gap-4 mt-12">
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="w-6 h-px bg-primary/15 origin-right"
            />
            <p className="font-serif-wedding text-xs italic text-muted-foreground/30">
              Every moment, worth the wait
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="w-6 h-px bg-primary/15 origin-left"
            />
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default CountdownSection;
