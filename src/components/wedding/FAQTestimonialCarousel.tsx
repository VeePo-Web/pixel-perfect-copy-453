import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

interface Testimonial {
  quote: string;
  couple: string;
  venue: string;
}

interface FAQTestimonialCarouselProps {
  testimonials: Testimonial[];
}

const FAQTestimonialCarousel = ({ testimonials }: FAQTestimonialCarouselProps) => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  const advance = useCallback(() => {
    setActiveTestimonial((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    const timer = setInterval(advance, 5000);
    return () => clearInterval(timer);
  }, [advance]);

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
        <ScrollReveal>
          <p className="font-overline text-muted-foreground mb-8">What Couples Say</p>
          <div className="min-h-[120px] relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <blockquote className="font-serif-wedding text-pull-quote italic text-foreground/70 leading-relaxed mb-6">
                  "{testimonials[activeTestimonial].quote}"
                </blockquote>
                <p className="font-sans-wedding text-body-sm font-light text-foreground/60">
                  {testimonials[activeTestimonial].couple}
                </p>
                <p className="font-sans-wedding text-caption tracking-[0.12em] uppercase text-muted-foreground mt-1">
                  {testimonials[activeTestimonial].venue}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Progress dots */}
          <div className="flex justify-center gap-3 mt-8">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveTestimonial(i)}
                className="w-8 h-[2px] transition-all duration-500 relative overflow-hidden"
                style={{
                  background: i === activeTestimonial
                    ? "linear-gradient(90deg, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.3))"
                    : "hsl(var(--border) / 0.4)",
                }}
                aria-label={`View testimonial ${i + 1}`}
              />
            ))}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQTestimonialCarousel;
