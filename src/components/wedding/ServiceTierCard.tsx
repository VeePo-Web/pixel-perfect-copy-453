import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import MagneticButton from "./MagneticButton";

interface ServiceTier {
  id: string;
  title: string;
  tagline: string;
  investment: string;
  description: string;
  includes: string[];
  idealFor: string;
  image: string;
  imageAlt: string;
}

const listItem = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.35, delay: i * 0.06, ease: [0.25, 0.1, 0.25, 1] as const },
  }),
};

const GoldCornerFrame = ({ position }: { position: "top-left" | "bottom-right" }) => {
  const isTop = position === "top-left";
  return (
    <div
      className={`absolute ${isTop ? "top-3 left-3" : "bottom-3 right-3"} w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
      aria-hidden="true"
    >
      <span
        className={`absolute ${isTop ? "top-0 left-0" : "bottom-0 right-0"} w-full h-px`}
        style={{ background: `linear-gradient(${isTop ? "90deg" : "270deg"}, hsl(var(--gold) / 0.35), transparent)` }}
      />
      <span
        className={`absolute ${isTop ? "top-0 left-0" : "bottom-0 right-0"} h-full w-px`}
        style={{ background: `linear-gradient(${isTop ? "180deg" : "0deg"}, hsl(var(--gold) / 0.35), transparent)` }}
      />
    </div>
  );
};

const ServiceImage = ({ service, direction }: { service: ServiceTier; direction: "left" | "right" }) => (
  <ScrollReveal>
    <ImageReveal direction={direction}>
      <div
        className="aspect-[4/5] overflow-hidden sticky top-28 relative group transition-shadow duration-700"
        style={{ boxShadow: "0 0 0px transparent" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 24px hsl(var(--gold) / 0.1), 0 0 48px hsl(var(--gold) / 0.05)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "0 0 0px transparent"; }}
      >
        <img
          src={service.image}
          alt={service.imageAlt}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <GoldCornerFrame position="top-left" />
        <GoldCornerFrame position="bottom-right" />
      </div>
    </ImageReveal>
  </ScrollReveal>
);

interface ServiceTierCardProps {
  service: ServiceTier;
  index: number;
}

const ServiceTierCard = ({ service, index }: ServiceTierCardProps) => {
  const isEven = index % 2 === 0;

  return (
    <section
      id={service.id}
      className={`py-section-mobile md:py-section-tablet lg:py-section-desktop relative overflow-hidden group/tier ${
        isEven ? "bg-background" : "bg-card"
      }`}
      style={{ contain: "layout style" }}
    >
      {/* Diagonal gold shimmer sweep on hover */}
      <span
        className="absolute inset-0 pointer-events-none z-10 -translate-x-full -translate-y-full group-hover/tier:translate-x-[200%] group-hover/tier:translate-y-[-200%] transition-transform duration-700 ease-out"
        style={{
          background: "linear-gradient(135deg, transparent 40%, hsl(var(--gold) / 0.08) 50%, transparent 60%)",
        }}
        aria-hidden="true"
      />
      {/* Per-tier parallax watermark */}
      <motion.div
        className="absolute -right-4 top-1/3 pointer-events-none select-none"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.5 }}
      >
        <span className="font-serif-wedding text-[8rem] md:text-[12rem] font-light text-foreground/[0.015] whitespace-nowrap tracking-tight italic leading-none">
          {service.title.split(" ")[0]}
        </span>
      </motion.div>

      <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
        <div className={`grid grid-cols-1 ${service.image ? "lg:grid-cols-2 gap-12 lg:gap-16 items-start" : "max-w-4xl mx-auto"}`}>
          {/* Image on left for even indexes */}
          {service.image && isEven && <ServiceImage service={service} direction="left" />}

          {/* Content column */}
          <div
            className="transition-all duration-700 group-hover/tier:scale-[1.01]"
            style={{ willChange: "transform, box-shadow" }}
          >
            <ScrollReveal delay={service.image ? 0.1 : 0}>
              <div className={`${service.image ? "" : "text-center"} mb-10`}>
                <p className="font-sans-wedding text-label uppercase text-primary/60 mb-3">
                  <span className="inline-flex items-center gap-3">
                    <span className="w-4 h-px bg-primary/30" />
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </p>
                <h2 className="font-serif-wedding text-display-lg text-foreground mb-2">
                  {service.title}
                </h2>
                <p className="font-serif-wedding text-lg italic text-muted-foreground mb-3">
                  {service.tagline}
                </p>
                <p
                  className="font-sans-wedding text-label uppercase font-light"
                  style={{
                    background: "linear-gradient(90deg, hsl(var(--primary)), hsl(var(--gold)))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                  }}
                >
                  {service.investment}
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={service.image ? 0.15 : 0.1}>
              <p className={`font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light ${service.image ? "" : "text-center max-w-2xl mx-auto"} mb-10`}>
                {service.description}
              </p>

              <div className="pt-8 mb-8 relative">
                <motion.span
                  className="absolute top-0 left-0 right-0 h-px origin-left"
                  style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--border)))" }}
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                />
                <p className="font-sans-wedding text-label uppercase text-muted-foreground mb-5">
                  What's Included
                </p>
                <motion.ul
                  className="space-y-3"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-50px" }}
                >
                  {service.includes.map((item, i) => (
                    <motion.li key={item} custom={i} variants={listItem} className="flex items-start gap-3">
                      <motion.span
                        className="w-5 h-px bg-primary/40 mt-2.5 shrink-0"
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: i * 0.06 }}
                        style={{ originX: 0 }}
                      />
                      <span className="font-sans-wedding text-body-sm text-foreground font-light">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              {/* Ideal-for pull quote */}
              <div className="pl-5 mt-8 relative">
                <div
                  className="absolute left-0 top-0 bottom-0 w-[2px]"
                  style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--primary) / 0.15))" }}
                />
                <p className="font-serif-wedding text-sm italic text-foreground/60 leading-relaxed">
                  Ideal for: {service.idealFor}
                </p>
              </div>
            </ScrollReveal>
          </div>

          {/* Image on right for odd indexes */}
          {service.image && !isEven && <ServiceImage service={service} direction="right" />}
        </div>
      </div>
    </section>
  );
};

export default ServiceTierCard;
