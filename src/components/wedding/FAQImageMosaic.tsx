import ScrollReveal from "./ScrollReveal";

interface FAQImageMosaicProps {
  mainImage: string;
  mainAlt: string;
  secondaryImage: string;
  secondaryAlt: string;
}

const FAQImageMosaic = ({ mainImage, mainAlt, secondaryImage, secondaryAlt }: FAQImageMosaicProps) => (
  <section className="py-10 md:py-14 bg-card">
    <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
      <ScrollReveal>
        <div className="grid grid-cols-12 gap-3 md:gap-4">
          {/* Large left panel */}
          <div className="col-span-12 md:col-span-7 relative group overflow-hidden">
            <div className="aspect-[16/10]">
              <img
                src={mainImage}
                alt={mainAlt}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              {/* Gold corner frames */}
              <div className="absolute top-3 left-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }} />
                <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), transparent)" }} />
              </div>
              <div className="absolute bottom-3 right-3 w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), transparent)" }} />
                <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), transparent)" }} />
              </div>
            </div>
          </div>
          {/* Right stacked panels */}
          <div className="col-span-12 md:col-span-5 grid grid-rows-2 gap-3 md:gap-4">
            <div className="relative group overflow-hidden">
              <div className="aspect-[16/9]">
                <img
                  src={secondaryImage}
                  alt={secondaryAlt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                  <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
                </div>
              </div>
            </div>
            {/* Quote panel */}
            <div className="relative flex items-center justify-center bg-sage-deep p-6">
              <div className="text-center">
                <span className="w-1.5 h-1.5 rotate-45 inline-block mb-3" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))" }} />
                <p className="font-serif-wedding text-sm md:text-base italic text-primary-foreground/50 leading-relaxed">
                  "Every detail answered with warmth."
                </p>
                <p className="font-sans-wedding text-[0.5rem] tracking-[0.15em] uppercase text-primary-foreground/20 mt-2">
                  — Our Promise
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default FAQImageMosaic;
