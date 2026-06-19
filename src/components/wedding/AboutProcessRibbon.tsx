import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import MagneticButton from "./MagneticButton";

const steps = [
  { number: "01", title: "Discovery Call", description: "Share your vision and ask every question on your mind." },
  { number: "02", title: "Custom Proposal", description: "A tailored plan and clear investment — no surprises." },
  { number: "03", title: "We Begin", description: "Exhale. From here, we handle everything." },
];

const AboutProcessRibbon = () => (
  <section className="py-section-mobile md:py-section-tablet bg-sage-deep relative overflow-hidden" role="region" aria-label="Our Process">
    {/* Watermark */}
    <motion.div
      className="absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.02 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
      style={{ willChange: "transform" }}
    >
      <span className="font-serif-wedding text-[10rem] text-primary-foreground leading-none tracking-tight italic whitespace-nowrap">
        Process
      </span>
    </motion.div>

    <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
      <ScrollReveal>
        <div className="text-center mb-12 md:mb-16">
          <p className="font-sans-wedding text-caption tracking-[0.25em] uppercase text-primary-foreground/75 mb-3">
            What Happens Next
          </p>
          <h2 className="font-serif-wedding text-display-md text-primary-foreground">
            Three Simple Steps
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
        {steps.map((step, i) => (
          <ScrollReveal key={step.number} delay={i * 0.12}>
            <div className="text-center group">
              <motion.span
                className="font-serif-wedding text-4xl font-light block mb-4"
                style={{ color: "hsl(var(--gold) / 0.2)" }}
                whileInView={{ color: "hsl(var(--gold) / 0.35)" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 + i * 0.15 }}
              >
                {step.number}
              </motion.span>
              <motion.div
                className="w-8 h-px mx-auto mb-4 origin-center"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
              />
              <h3 className="font-serif-wedding text-lg text-primary-foreground mb-2">{step.title}</h3>
              <p className="font-sans-wedding text-body-sm text-primary-foreground/80 font-light leading-relaxed">
                {step.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Connecting line between steps — desktop only */}
      <div className="hidden md:flex items-center justify-center gap-2 -mt-8 mb-10">
        <motion.div
          className="h-px flex-1 max-w-xs origin-left"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15), transparent)" }}
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.5 }}
        />
      </div>

      <ScrollReveal delay={0.3}>
        <div className="text-center">
          <p className="font-serif-wedding text-sm italic text-primary-foreground/75 mb-6">
            "It should feel like relief from the first call."
            <span className="font-sans-wedding text-caption tracking-[0.12em] uppercase not-italic ml-2 text-primary-foreground/65">— Hickory & Rose</span>
          </p>
          <MagneticButton to="/inquire" variant="outline-light">
            Book a Calm Consult
          </MagneticButton>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default AboutProcessRibbon;
