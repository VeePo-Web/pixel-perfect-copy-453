import React, { useEffect, useRef } from "react";
import { setPageMeta, setBreadcrumbSchema } from "@/lib/seo";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import PreFooterDivider from "@/components/wedding/PreFooterDivider";
import Footer from "@/components/wedding/Footer";
import CTASection from "@/components/wedding/CTASection";
import ScrollReveal from "@/components/wedding/ScrollReveal";
import FullWidthImage from "@/components/wedding/FullWidthImage";
import MagneticButton from "@/components/wedding/MagneticButton";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import FAQImageMosaic from "@/components/wedding/FAQImageMosaic";
import FAQTestimonialCarousel from "@/components/wedding/FAQTestimonialCarousel";
import faqEditorialImage from "@/assets/faq-editorial.jpg";
import faqHeroImage from "@/assets/faq-hero.jpg";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqCategories = [
  {
    category: "Services & Planning", index: "01",
    questions: [
      { q: "My venue has a coordinator — do I still need a wedding planner?", a: "A venue coordinator manages the venue. A wedding day coordinator works for you — managing all of your vendors, every in-between moment, and the rhythm of your day from start to finish. They're different roles, and most weddings benefit from both." },
      { q: "What's the difference between Day-Of Coordination and Full-Service Planning?", a: "Day-Of Coordination is designed for couples who have done the planning themselves and need a professional to step in 6–8 weeks before to execute the day flawlessly. Full-Service Planning means we're with you from the moment you're engaged — design, vision, vendor sourcing, and execution, every element held end-to-end." },
      { q: "How far in advance should I book?", a: "We recommend reaching out 10–14 months before your wedding for Full-Service Planning, and at least 3–4 months for Day-Of Coordination. That said, we're always happy to chat — even if your timeline is tighter, we may be able to help." },
      { q: "Do you plan non-wedding events?", a: "Yes. While weddings are our specialty, we also coordinate milestone celebrations, corporate events, and intimate gatherings. If it involves intentional design and calm logistics, we'd love to be part of it." },
      { q: "Can I customize my package?", a: "Absolutely. Every couple is unique, and our services are designed to be flexible. After our discovery call, we'll craft a tailored proposal that matches your specific needs, priorities, and vision." },
    ],
  },
  {
    category: "Process & Communication", index: "02",
    questions: [
      { q: "What does the discovery call look like?", a: "It's a relaxed, 30-minute video or phone call where we learn about your vision, your priorities, and how you want to feel on your wedding day. There's absolutely no pressure — it's simply a conversation to see if we're the right fit." },
      { q: "How do you communicate throughout the planning process?", a: "We use a combination of email, a shared planning portal, and scheduled check-in calls. You'll always know what's happening, what's coming next, and what needs your attention — without ever feeling overwhelmed." },
      { q: "Will you be the one on-site on our wedding day?", a: "Yes. The planner you work with throughout the process will be the one leading your wedding day. We believe in personal connection and continuity — no hand-offs to unfamiliar faces." },
    ],
  },
  {
    category: "Investment & Logistics", index: "03",
    questions: [
      { q: "What is the investment for your services?", a: "Each proposal is tailored to your guest count, complexity, and the level of support you need. Reach out and we'll share starting points and a custom proposal built around your day." },
      { q: "Do you offer payment plans?", a: "Yes — we offer flexible payment plans spread across the planning timeline. A retainer is required upon booking, with remaining payments due at agreed-upon milestones." },
      { q: "What areas do you serve?", a: "We're Edmonton-based and serve couples throughout Greater Edmonton and surrounding areas within Alberta. Travel fees apply outside of Greater Edmonton." },
      { q: "How many weddings do you take on per year?", a: "We intentionally limit our calendar so every couple gets our full attention and care — never stretched thin on your day." },
    ],
  },
];

// TODO: swap with real testimonials when owner provides (5.7). Editorial brand lines in meantime.
const testimonials = [
  { quote: "We had so many questions, and every single one was answered with patience and warmth — nothing ever felt rushed.", couple: "Hickory & Rose", venue: "Client Communication" },
  { quote: "The transparency around pricing makes the whole conversation feel respectful from day one. No hidden fees, no surprises.", couple: "Hickory & Rose", venue: "Pricing Philosophy" },
  { quote: "From the very first call, you should feel like you're in the right hands. That's what we plan for.", couple: "Hickory & Rose", venue: "Discovery Calls" },
];

const faqSchemaItems = faqCategories.flatMap((cat) =>
  cat.questions.map((faq) => ({ "@type": "Question" as const, name: faq.q, acceptedAnswer: { "@type": "Answer" as const, text: faq.a } }))
);
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqSchemaItems };

const FAQ = () => {
  const heroRef = useRef<HTMLElement>(null);
  const categoriesRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { scrollYProgress: catScrollProgress } = useScroll({ target: categoriesRef, offset: ["start end", "end start"] });
  const watermarkY = useTransform(catScrollProgress, [0, 1], ["15%", "-15%"]);

  useEffect(() => {
    setPageMeta({ title: "FAQ | Hickory & Rose Edmonton Wedding Planner", description: "Answers on pricing, services, planning timelines, and coverage across Edmonton, the Canadian Rockies, and Alberta — from Hickory & Rose.", path: "/faq" });
    setBreadcrumbSchema([{ name: "Home", path: "/" }, { name: "FAQ", path: "/faq" }]);
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(faqSchema);
    script.id = "faq-schema";
    document.head.appendChild(script);
    return () => { const el = document.getElementById("faq-schema"); if (el) el.remove(); };
  }, []);

  return (
    <main id="main-content">
      <Navigation variant="overlay" />

      {/* Cinematic Parallax Hero */}
      <section ref={heroRef} className="relative h-[55vh] md:h-[65vh] overflow-hidden grain-overlay vignette">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={faqHeroImage} alt="Luxury wedding stationery with sage envelope, gold wax seal, and calligraphy on linen" className="w-full h-[120%] object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }} initial={{ opacity: 0 }} animate={{ opacity: 0.03 }} transition={{ duration: 2, delay: 0.5 }}>
          <span className="font-serif-wedding text-[14rem] md:text-[22rem] text-white leading-none tracking-tight whitespace-nowrap">FAQ</span>
        </motion.div>
        <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6" style={{ opacity: heroOpacity }}>
          <ScrollReveal>
            <p className="font-sans-wedding text-label uppercase text-white/50 mb-4">
              <span className="inline-flex items-center gap-3">
                <motion.span className="w-8 h-px bg-white/30 origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
                Common Questions
                <motion.span className="w-8 h-px bg-white/30 origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
              </span>
            </p>
            <h1 className="font-serif-wedding text-display-xl text-white mb-6 max-w-3xl">Frequently Asked Questions</h1>
            <p className="font-sans-wedding text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">We know choosing a wedding planner is a big decision. Here are answers to the questions we hear most often.</p>
          </ScrollReveal>
        </motion.div>
        <GoldFrame inset="20px" delay={1} />
        <motion.div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
          {["Transparent Pricing", "Custom Packages", "Now Booking 2027"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/60 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>
        <motion.span className="absolute bottom-8 right-8 font-serif-wedding text-sm text-white/15 tracking-widest z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>05</motion.span>
      </section>

      {/* Editorial image mosaic */}
      <FAQImageMosaic mainImage={faqEditorialImage} mainAlt="Gold wedding rings on handwritten calligraphy vows with eucalyptus" secondaryImage={faqHeroImage} secondaryAlt="Luxury wedding stationery with sage envelope and gold wax seal" />

      {/* Quick stats bar */}
      <section className="py-6 md:py-8 bg-sage-deep border-b border-primary-foreground/[0.06]">
        <div className="container mx-auto px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[{ value: "48hr", label: "Response Time" }, { value: "Limited", label: "Calendar by Design" }, { value: "2027", label: "Now Booking" }].map((stat) => (
              <div key={stat.label}>
                <p className="font-serif-wedding text-lg md:text-xl text-primary-foreground/60 font-light">{stat.value}</p>
                <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-primary-foreground/60 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Categories */}
      <section ref={categoriesRef} className="relative py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card overflow-hidden">
        {/* Parallax watermark */}
        <motion.span
          className="absolute left-1/2 -translate-x-1/2 font-serif-wedding text-[10rem] md:text-[16rem] lg:text-[20rem] text-foreground/[0.018] pointer-events-none select-none whitespace-nowrap leading-none"
          style={{ y: watermarkY, top: "20%" }}
          aria-hidden="true"
        >
          Answers
        </motion.span>

        <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative z-10">
          {faqCategories.map((category, catIndex) => (
            <ScrollReveal key={category.category} delay={catIndex * 0.08}>
              <div className={catIndex > 0 ? "mt-16 md:mt-24" : ""}>
                {catIndex > 0 && (
                  <div className="flex items-center justify-center gap-4 mb-12 md:mb-16" aria-hidden="true">
                    <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8 }} className="w-16 h-px origin-right" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2))" }} />
                    <BreathingDiamond size={8} />
                    <motion.span initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.1 }} className="w-16 h-px origin-left" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.2), transparent)" }} />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-8 items-baseline mb-8 md:mb-10">
                  <div className="md:col-span-2">
                    <motion.span className="font-serif-wedding text-5xl md:text-6xl font-light text-primary/10" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>{category.index}</motion.span>
                  </div>
                  <div className="md:col-span-10">
                    <h2 className="font-serif-wedding text-display-md text-foreground">{category.category}</h2>
                    <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }} className="h-px mt-4 origin-left" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08), transparent)" }} />
                  </div>
                </div>
                <div className="md:grid md:grid-cols-12 md:gap-8">
                  <div className="md:col-span-2" />
                  <div className="md:col-span-10">
                    <Accordion type="single" collapsible className="w-full">
                      {category.questions.map((faq, index) => (
                        <React.Fragment key={index}>
                          {/* Inter-question breathing diamond separator */}
                          {index > 0 && (
                            <div className="flex items-center justify-center gap-3 py-1" aria-hidden="true">
                              <span className="w-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.12))" }} />
                              <motion.span
                                className="w-1.5 h-1.5 rotate-45 shrink-0"
                                animate={{ opacity: [0.2, 0.5, 0.2], scale: [0.85, 1.1, 0.85] }}
                                transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: index * 0.4 }}
                                style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.35), hsl(var(--gold) / 0.1))" }}
                              />
                              <span className="w-6 h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.12), transparent)" }} />
                            </div>
                          )}
                          <AccordionItem value={`${catIndex}-${index}`} className="border-border/30 group relative overflow-hidden transition-all duration-500 data-[state=open]:bg-foreground/[0.015] data-[state=open]:shadow-[0_0_20px_hsl(var(--gold)/0.06),0_0_40px_hsl(var(--gold)/0.03)]">
                            {/* Gold left border on open */}
                            <div className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-data-[state=open]:opacity-100 transition-all duration-500 origin-top group-data-[state=open]:scale-y-100 scale-y-0" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15), transparent)" }} />
                            {/* Hover shimmer */}
                            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.03) 40%, hsl(var(--gold) / 0.06) 50%, hsl(var(--gold) / 0.03) 60%, transparent 100%)" }} />
                            {/* Open-state shimmer sweep (CSS animation via data-state) */}
                            <div
                              className="absolute inset-0 pointer-events-none opacity-0 group-data-[state=open]:opacity-100 group-data-[state=open]:animate-[shimmer-sweep_1.2s_ease-out_forwards]"
                              style={{ background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.05) 45%, hsl(var(--gold) / 0.1) 50%, hsl(var(--gold) / 0.05) 55%, transparent 80%)" }}
                            />
                            <AccordionTrigger className="font-sans-wedding text-body text-foreground text-left hover:text-primary hover:no-underline py-6 font-light gap-4 group/trigger pl-3">
                              <span className="flex items-baseline gap-4">
                                <span className="font-serif-wedding text-xs shrink-0 tabular-nums transition-colors duration-300 group-data-[state=open]:text-primary/40" style={{ color: "hsl(var(--gold) / 0.25)" }}>{category.index}.{String(index + 1).padStart(2, "0")}</span>
                                <span>{faq.q}</span>
                              </span>
                            </AccordionTrigger>
                            <AccordionContent className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed pb-6 pl-[3.25rem] font-light animate-[fade-in_0.4s_ease-out]">{faq.a}</AccordionContent>
                          </AccordionItem>
                        </React.Fragment>
                      ))}
                    </Accordion>
                  </div>
                </div>
              </div>

              {/* Editorial image break after category 0 */}
              {catIndex === 0 && (
                <ScrollReveal delay={0.15}>
                  <div className="mt-16 md:mt-24 relative overflow-hidden rounded-sm">
                    <div className="aspect-[21/9] relative group">
                      <img src={faqEditorialImage} alt="Gold wedding rings on handwritten calligraphy vows with eucalyptus" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-black/20" />
                      {/* Gold corner frames */}
                      <span className="absolute top-4 left-4 w-8 h-8 border-t border-l pointer-events-none" style={{ borderColor: "hsl(var(--gold) / 0.3)" }} />
                      <span className="absolute top-4 right-4 w-8 h-8 border-t border-r pointer-events-none" style={{ borderColor: "hsl(var(--gold) / 0.3)" }} />
                      <span className="absolute bottom-4 left-4 w-8 h-8 border-b border-l pointer-events-none" style={{ borderColor: "hsl(var(--gold) / 0.3)" }} />
                      <span className="absolute bottom-4 right-4 w-8 h-8 border-b border-r pointer-events-none" style={{ borderColor: "hsl(var(--gold) / 0.3)" }} />
                      {/* Pull-quote overlay */}
                      <div className="absolute inset-0 flex items-center justify-center px-8">
                        <p className="font-serif-wedding text-lg md:text-2xl text-white/80 text-center max-w-lg leading-relaxed font-light italic">"Every detail is intentional — because your day deserves nothing less."</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}

              {/* Editorial image break after category 1 */}
              {catIndex === 1 && (
                <ScrollReveal delay={0.15}>
                  <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">
                    <div className="md:col-span-7 relative overflow-hidden rounded-sm group">
                      <div className="aspect-[16/10]">
                        <img src={faqHeroImage} alt="Luxury wedding stationery with sage envelope, gold wax seal, and calligraphy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]" loading="lazy" />
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/10" />
                      </div>
                    </div>
                    <div className="md:col-span-5 flex items-center">
                      <div className="py-6 md:py-0 md:pl-4">
                        <span className="font-overline text-muted-foreground/40 mb-3 block">Our Approach</span>
                        <p className="font-serif-wedding text-display-sm text-foreground leading-relaxed mb-4">Clarity at every step.</p>
                        <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">We believe transparency builds trust. That's why we answer every question before you even think to ask it.</p>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              )}
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Inline testimonial carousel */}
      <FAQTestimonialCarousel testimonials={testimonials} />

      {/* Editorial image break */}
      <FullWidthImage src={faqEditorialImage} alt="Gold wedding rings on handwritten calligraphy vows with eucalyptus and candlelight" height="h-[35vh] md:h-[45vh]" />

      {/* Quote */}
      <section className="py-20 md:py-28 bg-sage-deep">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <ScrollReveal>
            <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1 }} className="w-12 h-px bg-primary-foreground/20 mx-auto mb-10 origin-center" />
            <blockquote className="font-serif-wedding text-display-md text-primary-foreground leading-relaxed mb-8">"No question is too small. We're here to make every part of the process feel clear, calm, and cared for."</blockquote>
            <span className="font-script text-xl text-primary-foreground/35">Hickory & Rose</span>
          </ScrollReveal>
        </div>
      </section>

      {/* Still have questions */}
      <section className="py-section-mobile md:py-section-tablet bg-background">
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center">
          <ScrollReveal>
            <p className="font-overline text-muted-foreground/50 mb-4">Still Curious?</p>
            <h3 className="font-serif-wedding text-display-lg text-foreground mb-4">We'd love to hear from you.</h3>
            <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed mb-10 max-w-md mx-auto font-light">No question is too small. Reach out and we'll get back to you within 48 hours — or schedule a discovery call to chat in person.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <MagneticButton to="/inquire" variant="primary">Start a Conversation</MagneticButton>
              <MagneticButton to="/services" variant="outline">Explore Services</MagneticButton>
            </div>
          </ScrollReveal>
        </div>
      </section>
      <PreFooterDivider />
      <Footer />
    </main>
  );
};

export default FAQ;
