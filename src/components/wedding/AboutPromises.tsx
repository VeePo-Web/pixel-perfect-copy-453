import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import ScrollReveal from "./ScrollReveal";
import ceremonyImage from "@/assets/ceremony-setup.jpg";

const promises = [
  {
    promise: "Open communication in the weeks leading up to your day",
    subtext: "From our first call to the final send-off",
  },
  {
    promise: "A clear, considered timeline",
    subtext: "Built with you, shared with every vendor",
  },
  {
    promise: "Vendors coordinated as a team",
    subtext: "We work together, always",
  },
  {
    promise: "On-site emergency kit, always",
    subtext: "Anticipating challenges, before they reach you",
  },
  {
    promise: "Present from setup to send-off",
    subtext: "So you can focus on the moments that matter most",
  },
];

const AboutPromises = () => {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["10%", "-10%"]);

  return (
    <section
      ref={ref}
      className="relative min-h-[80vh] overflow-hidden"
      role="region"
      aria-label="The Hickory & Rose Standard"
      style={{ contain: "layout style" }}
    >
      {/* Parallax background image */}
      <motion.img
        src={ceremonyImage}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-[120%] object-cover -top-[10%]"
        style={{ y: imgY, willChange: "transform" }}
        loading="lazy"
        decoding="async"
      />

      {/* Dark overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(30 10% 8% / 0.75) 0%, hsl(30 10% 6% / 0.82) 50%, hsl(30 10% 8% / 0.78) 100%)",
        }}
      />

      {/* Grain + vignette */}
      <div className="absolute inset-0 grain-overlay" aria-hidden="true" />
      <div className="absolute inset-0 vignette" aria-hidden="true" />

      {/* Parallax watermark */}
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
        style={{ y: watermarkY, willChange: "transform" }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[8rem] md:text-[14rem] font-light text-white/[0.03] leading-none tracking-tight italic whitespace-nowrap">
          Standard
        </span>
      </motion.div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-8 py-24 md:py-32 lg:py-40">
        {/* Header */}
        <ScrollReveal>
          <div className="text-center mb-16 md:mb-20">
            <span className="font-serif-wedding text-5xl font-light text-white/10 block mb-3">
              04
            </span>
            <p className="font-sans-wedding text-label uppercase text-white/40 mb-4">
              <span className="inline-flex items-center gap-3">
                <span className="w-5 h-px bg-white/20" />
                What You Can Count On
                <span className="w-5 h-px bg-white/20" />
              </span>
            </p>
            <h2 className="font-serif-wedding text-display-lg text-white/95">
              The Hickory & Rose Standard
            </h2>
          </div>
        </ScrollReveal>

        {/* Glass card grid */}
        <div className="max-w-5xl mx-auto">
          {/* Top row: 3 cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-5 mb-4 md:mb-5">
            {promises.slice(0, 3).map((item, index) => (
              <PromiseCard key={item.promise} item={item} index={index} />
            ))}
          </div>
          {/* Bottom row: 2 cards centered */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5 max-w-3xl mx-auto">
            {promises.slice(3).map((item, index) => (
              <PromiseCard key={item.promise} item={item} index={index + 3} />
            ))}
          </div>
        </div>

        {/* Pull-quote */}
        <ScrollReveal delay={0.3}>
          <div className="text-center mt-16 md:mt-24">
            <div
              className="w-10 h-px mx-auto mb-6"
              style={{
                background:
                  "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.4), transparent)",
              }}
            />
            <p className="font-serif-wedding text-xl md:text-2xl text-white/70 italic font-light max-w-md mx-auto leading-relaxed">
              "We don't make promises lightly — we make them because you deserve certainty."
            </p>
            <p className="font-script text-lg text-white/30 mt-4">
              Hickory & Rose
            </p>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

/* Glass-morphism commitment card */
const PromiseCard = ({
  item,
  index,
}: {
  item: { promise: string; subtext: string };
  index: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-40px" }}
    transition={{ duration: 0.5, delay: index * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
    className="group relative p-6 md:p-8 rounded-sm overflow-hidden backdrop-blur-sm transition-colors duration-500"
    style={{
      background: "hsla(0, 0%, 100%, 0.04)",
      border: "1px solid hsl(var(--gold) / 0.08)",
    }}
  >
    {/* Hover shimmer sweep */}
    <div
      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
      style={{
        background:
          "linear-gradient(135deg, transparent 30%, hsl(var(--gold) / 0.06) 50%, transparent 70%)",
      }}
    />

    {/* Corner accents on hover */}
    <span
      className="absolute top-0 left-0 w-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "hsl(var(--gold) / 0.3)" }}
    />
    <span
      className="absolute top-0 left-0 w-px h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "hsl(var(--gold) / 0.3)" }}
    />
    <span
      className="absolute bottom-0 right-0 w-4 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "hsl(var(--gold) / 0.3)" }}
    />
    <span
      className="absolute bottom-0 right-0 w-px h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
      style={{ background: "hsl(var(--gold) / 0.3)" }}
    />

    {/* Gold number */}
    <span className="font-serif-wedding text-sm font-light block mb-3 transition-colors duration-500"
      style={{ color: "hsl(var(--gold) / 0.35)" }}
    >
      {String(index + 1).padStart(2, "0")}
    </span>

    {/* Gold underline accent */}
    <motion.div
      className="w-6 h-px mb-4"
      style={{
        background:
          "linear-gradient(90deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))",
      }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.3 + index * 0.08 }}
    />

    {/* Promise title */}
    <p className="font-serif-wedding text-lg md:text-xl text-white/90 font-light leading-snug mb-2 group-hover:text-white transition-colors duration-500">
      {item.promise}
    </p>

    {/* Subtext */}
    <p className="font-sans-wedding text-sm text-white/40 italic leading-relaxed group-hover:text-white/60 transition-colors duration-500">
      {item.subtext}
    </p>
  </motion.div>
);

export default AboutPromises;
