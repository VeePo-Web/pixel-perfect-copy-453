import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const pillars = [
  { title: "Transparent Pricing", desc: "No hidden costs. Your custom proposal outlines every detail, so you know exactly what to expect." },
  { title: "Flexible Payment", desc: "Spread your investment across the planning timeline with comfortable milestone-based payments." },
  { title: "Intentional Calendar", desc: "We take on only 15–20 weddings per year. Your day never competes for our attention." },
];

const ServicesInvestmentPhilosophy = () => (
  <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-sage-deep relative overflow-hidden">
    {/* Ambient gold glow */}
    <motion.div
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.06 }}
      viewport={{ once: true }}
      transition={{ duration: 2 }}
      style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.12), transparent 70%)" }}
      aria-hidden="true"
    />
    {/* Parallax watermark */}
    <motion.div
      className="absolute -left-4 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.025 }}
      viewport={{ once: true }}
      transition={{ duration: 1.5 }}
    >
      <span className="font-serif-wedding text-[10rem] md:text-[14rem] text-primary-foreground leading-none tracking-tight italic whitespace-nowrap">
        Value
      </span>
    </motion.div>

    <div className="container mx-auto px-6 lg:px-8 max-w-4xl text-center relative">
      <ScrollReveal>
        {/* Gold diamond ornament */}
        <div className="flex items-center justify-center gap-4 mb-10">
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-10 h-px origin-right"
            style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25))" }}
          />
          <span
            className="w-2 h-2 rotate-45 shrink-0"
            style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))" }}
          />
          <motion.span
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="w-10 h-px origin-left"
            style={{ background: "linear-gradient(270deg, transparent, hsl(var(--gold) / 0.25))" }}
          />
        </div>

        <p className="font-sans-wedding text-label uppercase text-primary-foreground/30 mb-4 tracking-[0.2em]">
          Our Investment Philosophy
        </p>
        <h2 className="font-serif-wedding text-display-lg text-primary-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
          You're not paying for hours — you're investing in peace of mind.
        </h2>
        <p className="font-sans-wedding text-body-sm text-primary-foreground/40 leading-relaxed font-light max-w-xl mx-auto mb-4">
          Our pricing reflects the depth of care, creative vision, and seamless execution we bring to every wedding. We limit our calendar intentionally — because the couples who choose us deserve our undivided attention.
        </p>
        <p className="font-sans-wedding text-[0.7rem] tracking-[0.18em] uppercase text-primary-foreground/30 max-w-xl mx-auto mb-10">
          For 2027 weddings, a two-person planning team is included as standard.
        </p>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 mt-12">
          {pillars.map((pillar, i) => (
            <ScrollReveal key={pillar.title} delay={i * 0.1}>
              <div className="text-center group">
                <motion.div
                  className="w-px h-8 mx-auto mb-4 origin-top"
                  style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }}
                  initial={{ scaleY: 0 }}
                  whileInView={{ scaleY: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                />
                <h3 className="font-serif-wedding text-lg text-primary-foreground/60 group-hover:text-primary-foreground/80 transition-colors duration-500 mb-2">
                  {pillar.title}
                </h3>
                <p className="font-sans-wedding text-[0.75rem] text-primary-foreground/25 leading-relaxed font-light">
                  {pillar.desc}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Attribution */}
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="w-8 h-px mx-auto mt-12 mb-4 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
        />
        <span className="font-script text-xl text-primary-foreground/20">
          Hickory & Rose
        </span>
      </ScrollReveal>
    </div>
  </section>
);

export default ServicesInvestmentPhilosophy;
