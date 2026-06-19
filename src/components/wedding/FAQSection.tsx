import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import ScrollReveal from "./ScrollReveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What's the difference between your planning tiers?",
    answer: "Day-Of Coordination is for couples who've handled planning and need a professional to execute. Partial Planning offers design guidance and vendor support while you stay involved. Full-Service Planning means we handle everything — from first concept to final send-off.",
  },
  {
    question: "How far in advance should we reach out?",
    answer: "We recommend 10–14 months for Full-Service Planning and 3–4 months for Day-Of Coordination. That said, we're always happy to chat — even on tighter timelines, we may be able to help.",
  },
  {
    question: "What areas do you serve?",
    answer: "We're based in Edmonton, Alberta and serve couples throughout the greater Edmonton area, the Alberta Rockies (Jasper, Banff, Lake Louise), and surrounding communities. Travel fees may apply for destinations beyond our home region.",
  },
  {
    question: "Can I customize my service package?",
    answer: "Absolutely. Every couple is unique — after our discovery call, we craft a custom proposal tailored to your specific needs, priorities, and investment level. Our tiers are starting points, not limitations.",
  },
  {
    question: "Will the same planner be with us throughout?",
    answer: "Yes. The planner you meet on your discovery call is the same person leading your wedding day. We believe in personal continuity — no hand-offs, no unfamiliar faces.",
  },
  {
    question: "What does the discovery call look like?",
    answer: "It's a relaxed, 30-minute video or phone call where we learn about your vision, your priorities, and how you want to feel on your wedding day. No pressure, no sales pitch — just genuine connection.",
  },
];

const FAQSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });
  const watermarkY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const accentScale = useTransform(scrollYProgress, [0.1, 0.5], [0, 1]);

  return (
    <section
      ref={sectionRef}
      className="bg-background py-section-mobile md:py-section-tablet lg:py-section-desktop relative overflow-hidden"
      aria-label="Frequently asked questions"
    >
      {/* Parallax watermark */}
      <motion.div
        className="absolute -right-10 top-1/3 pointer-events-none select-none"
        style={{ y: watermarkY }}
        aria-hidden="true"
      >
        <span className="font-serif-wedding text-[10rem] md:text-[16rem] font-light text-foreground/[0.015] leading-none whitespace-nowrap italic">
          Answers
        </span>
      </motion.div>

      {/* Scroll-linked accent line */}
      <motion.div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-px h-40 hidden lg:block origin-center"
        style={{
          scaleY: accentScale,
          background: "linear-gradient(180deg, transparent, hsl(var(--primary) / 0.15), transparent)",
        }}
        aria-hidden="true"
      />

      <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative">
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-14 md:mb-20 items-baseline">
            <div className="md:col-span-4">
              <div className="flex items-center gap-4 mb-4">
                <span className="font-serif-wedding text-sm text-primary/20 font-light">07</span>
                <motion.span
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-8 h-px bg-primary/15 origin-left"
                />
              </div>
              <p className="font-sans-wedding text-label uppercase text-muted-foreground/40 tracking-[0.2em] mb-4">
                Questions & Answers
              </p>
              <h2 className="font-serif-wedding text-display-lg text-foreground">
                Common Questions
              </h2>
            </div>
            <div className="md:col-span-8 md:pt-8">
              <p className="font-sans-wedding text-body-sm text-muted-foreground font-light leading-relaxed">
                Choosing a wedding planner is a meaningful decision. Here are answers
                to the questions we hear most — and we're always happy to answer more
                on a discovery call.
              </p>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border-border/30 group relative"
                >
                  {/* Gold left accent bar — visible on open via group-data state */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-px opacity-0 group-data-[state=open]:opacity-100 transition-opacity duration-500"
                    style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08), transparent)" }}
                  />
                  {/* Gold shimmer sweep on hover */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.02) 40%, hsl(var(--gold) / 0.04) 50%, hsl(var(--gold) / 0.02) 60%, transparent 100%)" }}
                  />
                  <AccordionTrigger className="font-sans-wedding text-body text-foreground text-left hover:text-primary hover:no-underline py-6 font-light gap-4 pl-3">
                    <span className="flex items-baseline gap-4">
                      <span className="font-serif-wedding text-xs text-muted-foreground/25 shrink-0 tabular-nums group-data-[state=open]:text-primary/40 transition-colors duration-300">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <span>{faq.question}</span>
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed pb-6 pl-[3.25rem] font-light">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollReveal>

        {/* Bottom editorial ornament */}
        <ScrollReveal delay={0.2}>
          <div className="flex items-center justify-center gap-4 mt-14">
            <span className="w-6 h-px bg-border/25" />
            <span className="w-1.5 h-1.5 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.1))" }} />
            <span className="w-6 h-px bg-border/25" />
          </div>
          <p className="font-sans-wedding text-caption tracking-[0.2em] uppercase text-muted-foreground/60 text-center mt-4">
            More answers on our <a href="/faq" className="underline underline-offset-4 hover:text-primary transition-colors">FAQ page</a>
          </p>
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FAQSection;
