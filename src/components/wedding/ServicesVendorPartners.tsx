import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import ImageReveal from "./ImageReveal";
import vendorDetailImage from "@/assets/vendor-detail.jpg";

// No fabricated vendor brands — categories only until real partners are confirmed.
const partners = [
  { category: "Florals & Styling", names: "Curated local florists" },
  { category: "Photography", names: "Selected creative partners" },
  { category: "Catering", names: "Featured culinary teams" },
  { category: "Venues", names: "Hand-picked Edmonton & Alberta spaces" },
  { category: "Stationery", names: "Calligraphy & fine paper" },
];

const ServicesVendorPartners = () => (
  <section className="py-section-mobile md:py-section-tablet bg-background relative overflow-hidden">
    <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <ScrollReveal>
          <ImageReveal direction="left">
            <div className="aspect-square overflow-hidden">
              <img
                src={vendorDetailImage}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </ImageReveal>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          <div>
            <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-4">
              <span className="inline-flex items-center gap-3">
                <span className="w-5 h-px bg-primary/30" />
                Our Network
              </span>
            </p>
            <h2 className="font-serif-wedding text-display-lg text-foreground mb-4">
              Trusted Partners
            </h2>
            <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light mb-4">
              We've built deep relationships with Edmonton and Alberta's finest vendors. These partnerships mean preferred availability, seamless collaboration, and an elevated experience for every couple.
            </p>
            <p className="font-serif-wedding text-sm italic text-primary/70 mb-10">
              "We work as a team, always."
            </p>

            <div className="space-y-0 border-t border-border/40">
              {partners.map((partner, i) => (
                <motion.div
                  key={partner.category}
                  className="grid grid-cols-12 gap-4 py-5 border-b border-border/30 group cursor-default relative overflow-hidden"
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.06 }}
                >
                  {/* Gold shimmer sweep on hover */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1.2s] ease-in-out pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.04) 35%, hsl(var(--gold) / 0.08) 50%, hsl(var(--gold) / 0.04) 65%, transparent 100%)" }}
                    aria-hidden="true"
                  />
                  {/* Gold left accent on hover */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-[2px] origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500"
                    style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.1))" }}
                    aria-hidden="true"
                  />
                  <div className="col-span-4 relative">
                    <p className="font-sans-wedding text-[0.6rem] tracking-[0.15em] uppercase text-primary/50 group-hover:text-primary transition-colors duration-500">
                      {partner.category}
                    </p>
                  </div>
                  <div className="col-span-8 relative">
                    <p className="font-sans-wedding text-body-sm text-muted-foreground/60 font-light group-hover:text-foreground transition-colors duration-500">
                      {partner.names}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </div>
  </section>
);

export default ServicesVendorPartners;
