import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const values = [
  {
    title: "Seamless & Calm",
    pullQuote: "Stress-free, by design.",
    description:
      "Thoughtful preparation, clear timelines, and challenges anticipated long before they reach you. The day flows so you can stay present.",
  },
  {
    title: "Friendly & Caring",
    pullQuote: "Organized, warm, easy to work with.",
    description:
      "We show up the way we'd want a planner to show up for us — detailed, experienced, and genuinely invested in your love story.",
  },
  {
    title: "Luxury, Personalized",
    pullQuote: "Your vision, thoughtfully held.",
    description:
      "Refined rustic elegance: the harmony of natural beauty, thoughtful design, and elevated details that feel effortless and timeless.",
  },
];

const AboutValuesGrid = () => (
  <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background" role="region" aria-label="Our Values">
    <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
      <ScrollReveal>
        <div className="text-center mb-16 md:mb-24">
          <span className="font-serif-wedding text-5xl font-light text-primary/10 block mb-3">02</span>
          <p className="font-sans-wedding text-label uppercase text-brand-text-tertiary mb-4">
            <span className="inline-flex items-center gap-3">
              <span className="w-5 h-px bg-border" />
              Our Values
              <span className="w-5 h-px bg-border" />
            </span>
          </p>
          <h2 className="font-serif-wedding text-display-lg text-foreground">
            What Guides Us
          </h2>
        </div>
      </ScrollReveal>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
        {values.map((value, index) => (
          <ScrollReveal key={value.title} delay={index * 0.1}>
            <div className="group hover:-translate-y-1 transition-transform duration-500 ease-out">
              <span className="font-serif-wedding text-5xl font-light text-primary/10 group-hover:text-primary/20 transition-colors duration-700 block mb-4">
                {String(index + 1).padStart(2, "0")}
              </span>

              <motion.div
                className="h-px bg-primary/25 mb-6 origin-left"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 + index * 0.1 }}
              />

              <div className="flex items-center gap-2 mb-2">
                <span className="w-2 h-2 rotate-45 shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))" }} />
                <h3 className="font-serif-wedding text-display-md text-foreground group-hover:text-primary transition-colors duration-500">
                  {value.title}
                </h3>
              </div>

              <p className="font-serif-wedding text-sm italic text-primary mb-4">
                {value.pullQuote}
              </p>

              <p className="font-sans-wedding text-body-sm text-muted-foreground leading-[1.75] font-light">
                {value.description}
              </p>
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  </section>
);

export default AboutValuesGrid;
