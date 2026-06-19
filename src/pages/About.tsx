import { useEffect, useRef } from "react";
import { setPageMeta, setBreadcrumbSchema } from "@/lib/seo";
import { motion, useScroll, useTransform } from "framer-motion";
import PreFooterDivider from "@/components/wedding/PreFooterDivider";
import Navigation from "@/components/wedding/Navigation";
import CTASection from "@/components/wedding/CTASection";
import Footer from "@/components/wedding/Footer";
import ScrollReveal from "@/components/wedding/ScrollReveal";
import FullWidthImage from "@/components/wedding/FullWidthImage";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import AboutPromises from "@/components/wedding/AboutPromises";
import AboutTestimonials from "@/components/wedding/AboutTestimonials";
import AboutFounderSection from "@/components/wedding/AboutFounderSection";
import AboutValuesGrid from "@/components/wedding/AboutValuesGrid";
import AboutProcessRibbon from "@/components/wedding/AboutProcessRibbon";
import bouquetImage from "@/assets/portfolio-bouquet.jpg";
import aboutHeroImage from "@/assets/about-hero.jpg";
import editorialFloralsImage from "@/assets/editorial-florals.jpg";

const About = () => {
  const heroRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setPageMeta({
      title: "About | Hickory & Rose Edmonton Wedding Planner",
      description: "Meet Meg Wolodko, founder of Hickory & Rose — calm leadership, intentional design, and refined rustic elegance for Edmonton & Alberta couples.",
      path: "/about",
    });
    setBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "About", path: "/about" },
    ]);
  }, []);

  return (
    <main id="main-content">
      <Navigation variant="overlay" />

      {/* Cinematic Parallax Hero */}
      <section ref={heroRef} className="relative h-[60vh] md:h-[70vh] overflow-hidden grain-overlay vignette" style={{ contain: "layout style" }}>
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={aboutHeroImage}
            alt="Wedding planner in sunlit garden conservatory surrounded by white florals"
            className="w-full h-[120%] object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />
        </motion.div>

        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <span className="font-serif-wedding text-[14rem] md:text-[22rem] text-white leading-none tracking-tight whitespace-nowrap">
            About
          </span>
        </motion.div>

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
          style={{ opacity: heroOpacity }}
        >
          <ScrollReveal>
            <p className="font-sans-wedding text-label uppercase text-white/75 mb-4">
              <span className="inline-flex items-center gap-3">
                <motion.span
                  className="w-8 h-px bg-white/50 origin-right"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                About Us
                <motion.span
                  className="w-8 h-px bg-white/50 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </p>
            <h1 className="font-serif-wedding text-display-xl text-white mb-6 max-w-3xl">
              Meet Hickory & Rose
            </h1>
            <p className="font-sans-wedding text-[0.6rem] tracking-[0.2em] uppercase text-white/75 mb-4">
              For brides who want to be present — not stressed
            </p>
            <p className="font-sans-wedding text-lg md:text-xl text-white/85 leading-relaxed max-w-xl mx-auto font-light tracking-wide">
              Story-driven weddings designed around your calm.
            </p>
          </ScrollReveal>
        </motion.div>

        <GoldFrame inset="20px" delay={1} />

        {/* Credential strip */}
        <motion.div
          className="absolute bottom-12 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {["2026 Season Fully Booked", "Editorial Shoot — Aug 2026", "Now Booking 2027"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-[0.5rem] tracking-[0.18em] uppercase text-white/55 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          <span className="font-sans-wedding text-[0.45rem] tracking-[0.25em] uppercase text-white/50">
            Meet the Founder
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-1.5 rotate-45"
            style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.2))" }}
          />
        </motion.div>

        <motion.span
          className="absolute bottom-8 right-8 font-serif-wedding text-sm text-white/30 tracking-widest z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          &
        </motion.span>
      </section>

      <AboutFounderSection />

      {/* Signature Quote — editorial with gold ornaments */}
      <section className="py-20 md:py-28 bg-sage-deep relative overflow-hidden" style={{ contain: "layout style" }}>
        {/* Radial gold ambient glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
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
            Promise
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center relative">
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

            <span className="font-serif-wedding text-6xl text-primary-foreground/[0.06] leading-none block -mb-4" aria-hidden="true">"</span>
            <blockquote className="font-serif-wedding text-display-md text-primary-foreground leading-relaxed mb-8">
              "We don't just plan weddings — we protect the feeling of your day."
            </blockquote>

            {/* Attribution with gold separator */}
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-8 h-px mx-auto mb-4 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
            />
            <span className="font-script text-xl text-primary-foreground/65">
              Hickory & Rose
            </span>
          </ScrollReveal>
        </div>
      </section>

      <FullWidthImage
        src={bouquetImage}
        alt="Bridal bouquet with white roses and sage eucalyptus"
        height="h-[35vh] md:h-[45vh]"
      />

      <AboutValuesGrid />

      <AboutProcessRibbon />

      {/* Editorial Image Mosaic — asymmetric 3-image grid */}
      <section className="py-16 md:py-24 bg-card overflow-hidden relative" role="region" aria-label="Behind the Scenes" style={{ contain: "layout style" }}>
        {/* Parallax watermark */}
        <motion.div
          className="absolute -right-8 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
          style={{ willChange: "transform" }}
        >
          <span className="font-serif-wedding text-[10rem] text-foreground leading-none tracking-tight italic whitespace-nowrap">
            Moments
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 max-w-6xl relative">
          {/* Editorial header */}
          <ScrollReveal>
            <div className="flex items-start gap-6 mb-10 md:mb-14">
              <span className="font-serif-wedding text-5xl font-light text-primary/10">05</span>
              <div>
                <p className="font-overline text-brand-text-secondary mb-2">Behind the Scenes</p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-10 h-px bg-primary/25 origin-left"
                />
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 md:grid-cols-12 gap-3 md:gap-4">
            {/* Large left image */}
            <ScrollReveal delay={0} className="col-span-2 md:col-span-7">
              <div className="aspect-[4/3] overflow-hidden relative group">
                <img
                  src={bouquetImage}
                  alt="Hand-tied bridal bouquet with ivory garden roses, ranunculus, and sage eucalyptus held by wedding planner during final styling"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                />
                <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                  <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }} />
                  <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), transparent)" }} />
                </div>
                <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                  <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), transparent)" }} />
                  <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), transparent)" }} />
                </div>
              </div>
            </ScrollReveal>

            {/* Right stacked pair */}
            <div className="col-span-2 md:col-span-5 flex flex-col gap-3 md:gap-4">
              <ScrollReveal delay={0.1}>
                <div className="aspect-[3/2] overflow-hidden relative group">
                  <img
                    src={editorialFloralsImage}
                    alt="Ceremony table centerpiece featuring cascading eucalyptus and white florals being arranged by wedding planner"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                    <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }} />
                    <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), transparent)" }} />
                  </div>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={0.2}>
                <div className="aspect-[3/2] overflow-hidden relative group">
                  <img
                    src={aboutHeroImage}
                    alt="Sunlit garden conservatory ceremony setup with vendor timeline in progress"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                    <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), transparent)" }} />
                    <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), transparent)" }} />
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <AboutTestimonials />

      <AboutPromises />

      {/* Press & Recognition — Editorial "As Seen In" Ribbon */}
      <section className="py-20 md:py-28 bg-card relative overflow-hidden" style={{ contain: "layout style" }}>
        {/* Ambient gold glow */}
        <motion.div
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] pointer-events-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.06 }}
          viewport={{ once: true }}
          transition={{ duration: 2 }}
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.12), transparent 70%)" }}
          aria-hidden="true"
        />

        <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
          <ScrollReveal>
            {/* Header with full-width ruled lines */}
            <div className="flex items-start gap-6 mb-4">
              <span className="font-serif-wedding text-5xl font-light text-primary/10">06</span>
              <div>
                <p className="font-overline text-brand-text-secondary mb-2">Recognition</p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="w-10 h-px bg-primary/25 origin-left"
                />
              </div>
            </div>
            <div className="flex items-center gap-6 mb-16 md:mb-16">
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 h-px origin-left"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2))" }}
              />
              <div className="text-center shrink-0">
                <p className="font-sans-wedding text-[0.5rem] tracking-[0.3em] uppercase text-brand-text-tertiary mb-2">
                  As Seen In
                </p>
                <span
                  className="w-1.5 h-1.5 rotate-45 inline-block"
                  style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15))" }}
                />
              </div>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1 }}
                className="flex-1 h-px origin-right"
                style={{ background: "linear-gradient(270deg, transparent, hsl(var(--gold) / 0.2))" }}
              />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {[
                { publication: "2026 Season", note: "Summer & Fall Fully Booked" },
                { publication: "Aug 2026", note: "Editorial Styled Shoot" },
                { publication: "2027 Season", note: "Now Booking — Limited Calendar" },
                { publication: "Edmonton · Alberta", note: "Studio Location" },
              ].map((press, i) => (
                <motion.div
                  key={press.publication}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group relative p-6 md:p-8 text-center overflow-hidden"
                  style={{ border: "1px solid hsl(var(--gold) / 0.08)" }}
                >
                  {/* Gold shimmer sweep on hover */}
                  <div
                    className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1.2s] ease-in-out pointer-events-none"
                    style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.05) 35%, hsl(var(--gold) / 0.1) 50%, hsl(var(--gold) / 0.05) 65%, transparent 100%)" }}
                  />
                  {/* Gold corner accents */}
                  <div className="absolute top-2 left-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                    <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                    <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  </div>
                  <div className="absolute bottom-2 right-2 w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                    <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
                    <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  </div>
                  {/* Content */}
                  <p className="font-serif-wedding text-xl md:text-2xl italic font-light text-brand-text-decorative group-hover:text-brand-text-secondary transition-colors duration-500 mb-2">
                    {press.publication}
                  </p>
                  <motion.div
                    className="w-5 h-px mx-auto mb-2"
                    style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25), transparent)" }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: 0.3 + i * 0.1 }}
                  />
                  <p className="font-sans-wedding text-[0.55rem] tracking-[0.15em] uppercase text-brand-text-tertiary group-hover:text-brand-text-secondary transition-colors duration-500">
                    {press.note}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Certifications row */}
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-6 mt-12 mb-10">
              {["Editorial Styled Shoot — Aug 2026", "Summer & Fall 2026 — Fully Booked", "Welcoming 2027 Couples"].map((cert, i) => (
                <span key={cert} className="font-sans-wedding text-[0.45rem] md:text-[0.5rem] tracking-[0.15em] uppercase text-brand-text-tertiary flex items-center gap-3 md:gap-6">
                  {i > 0 && <span className="w-1 h-1 rotate-45 hidden md:block" style={{ background: "hsl(var(--gold) / 0.25)" }} />}
                  {cert}
                </span>
              ))}
            </div>

            {/* Bottom ornament */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-8 h-px origin-right"
                style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.15))" }}
              />
              <span
                className="w-1.5 h-1.5 rotate-45 shrink-0"
                style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }}
              />
              <motion.span
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="w-8 h-px origin-left"
                style={{ background: "linear-gradient(270deg, transparent, hsl(var(--gold) / 0.15))" }}
              />
            </div>
          </ScrollReveal>
        </div>
      </section>

      <CTASection />
      <PreFooterDivider />
      <Footer />
    </main>
  );
};

export default About;
