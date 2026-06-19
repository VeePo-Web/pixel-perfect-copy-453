import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";

const comparisonTiers = [
  { tier: "Day-Of", desc: "You've planned it all — we perfect and lead the day.", price: "Starting at — inquire", popular: false },
  { tier: "Partial", desc: "Collaborate on design and vendors with expert guidance.", price: "Starting at — inquire", popular: true },
  { tier: "Full-Service", desc: "We handle everything from vision to final send-off.", price: "Starting at — inquire", popular: false },
];

const ServiceComparison = () => (
  <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background" style={{ contain: "layout style" }}>
    <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
      <ScrollReveal>
        <div className="text-center mb-16">
          <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-4">
            <span className="inline-flex items-center gap-3">
              <span className="w-5 h-px bg-border" />
              Find Your Fit
              <span className="w-5 h-px bg-border" />
            </span>
          </p>
          <h2 className="font-serif-wedding text-display-lg text-foreground">
            Not sure which service is right?
          </h2>
        </div>
      </ScrollReveal>

      <div className="space-y-0">
        {comparisonTiers.map((item, i) => (
          <ScrollReveal key={item.tier} delay={i * 0.08}>
            <div className="relative group">
              <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                <div
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-[1s] ease-in-out"
                  style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.04) 40%, hsl(var(--gold) / 0.08) 50%, hsl(var(--gold) / 0.04) 60%, transparent 100%)" }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-center py-8 md:py-10 border-t border-border/60 relative">
                <div className="md:col-span-3 flex items-center gap-3">
                  <h3 className="font-serif-wedding text-display-md text-foreground group-hover:text-primary transition-colors duration-500">
                    {item.tier}
                  </h3>
                  {item.popular && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3, duration: 0.4 }}
                      className="font-sans-wedding text-caption tracking-[0.15em] uppercase px-2.5 py-1 border shimmer-gold"
                      style={{
                        borderColor: "hsl(var(--gold) / 0.3)",
                        color: "hsl(var(--gold))",
                        background: "linear-gradient(135deg, hsl(var(--gold) / 0.06), transparent)",
                      }}
                    >
                      Popular
                    </motion.span>
                  )}
                </div>
                <div className="md:col-span-6">
                  <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light group-hover:text-foreground/70 transition-colors duration-500">
                    {item.desc}
                  </p>
                </div>
                <div className="md:col-span-3 md:text-right flex items-center justify-start md:justify-end gap-3">
                  <p className="font-sans-wedding text-label uppercase text-primary">{item.price}</p>
                  <span className="font-serif-wedding text-sm text-primary/0 group-hover:text-primary/40 transition-all duration-500 translate-x-0 group-hover:translate-x-1">→</span>
                </div>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-px origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-700"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
              />
            </div>
          </ScrollReveal>
        ))}
        <div className="border-t border-border/60" />
      </div>

      <ScrollReveal delay={0.3}>
        <div className="text-center mt-16">
          <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed mb-8 font-light max-w-lg mx-auto">
            Every wedding is unique. We'd love to learn about your vision and recommend the perfect fit.
          </p>
          <MagneticButton to="/inquire" variant="primary">
            Schedule a Discovery Call
          </MagneticButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default ServiceComparison;
