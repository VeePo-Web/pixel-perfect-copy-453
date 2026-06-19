import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

interface PortfolioFeaturedStoryProps {
  image: string;
  alt: string;
  couple: string;
  venue: string;
  season: string;
  description: string;
  quote: string;
}

const PortfolioFeaturedStory = ({ image, alt, couple, venue, season, description, quote }: PortfolioFeaturedStoryProps) => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Deep parallax: image pans inside its window
  const imageY = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  return (
    <section ref={sectionRef} className="bg-card py-section-mobile md:py-section-tablet">
      <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Deep Parallax Window */}
          <ScrollReveal>
            <div className="aspect-[4/5] overflow-hidden relative">
              <motion.img
                src={image}
                alt={alt}
                className="w-full h-[120%] object-cover absolute inset-0"
                style={{ y: imageY, scale: 1.15 }}
                loading="lazy"
              />
            </div>
          </ScrollReveal>

          {/* Slide Projector Optical Focus Reveal */}
          <ScrollReveal delay={0.15}>
            <div>
              <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-3">
                <span className="inline-flex items-center gap-3">
                  <span className="w-5 h-px bg-primary/30" />
                  Featured Wedding
                </span>
              </p>

              {/* Shattered couple name with optical focus */}
              <h2 className="font-serif-wedding text-display-lg text-foreground mb-2 overflow-hidden">
                {couple.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    className="inline-block"
                    initial={{
                      opacity: 0,
                      scale: 1.1,
                      skewX: -5,
                      filter: "blur(10px)",
                    }}
                    whileInView={{
                      opacity: 1,
                      scale: 1,
                      skewX: 0,
                      filter: "blur(0px)",
                    }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{
                      duration: 0.5,
                      delay: 0.3 + i * 0.025,
                      ease: [0.83, 0, 0.17, 1],
                    }}
                  >
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </h2>

              <p className="font-sans-wedding text-[0.6rem] tracking-[0.15em] uppercase text-muted-foreground/40 mb-6">
                {venue} · {season}
              </p>
              <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light mb-6">
                {description}
              </p>
              <div className="border-l-2 border-primary/15 pl-5">
                <p className="font-serif-wedding text-sm italic text-foreground/50 leading-relaxed">
                  "{quote}"
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
};

export default PortfolioFeaturedStory;
