import { useEffect, useRef } from "react";
import { setPageMeta, setBreadcrumbSchema } from "@/lib/seo";
import { motion, useScroll, useTransform } from "framer-motion";
import PreFooterDivider from "@/components/wedding/PreFooterDivider";
import Navigation from "@/components/wedding/Navigation";
import CTASection from "@/components/wedding/CTASection";
import Footer from "@/components/wedding/Footer";
import ScrollReveal from "@/components/wedding/ScrollReveal";
import FullWidthImage from "@/components/wedding/FullWidthImage";
import ImageReveal from "@/components/wedding/ImageReveal";
import MagneticButton from "@/components/wedding/MagneticButton";
import ServiceTierCard from "@/components/wedding/ServiceTierCard";
import ServiceComparison from "@/components/wedding/ServiceComparison";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import servicesHeroImage from "@/assets/services-hero.jpg";
import serviceDayofImage from "@/assets/service-dayof.jpg";
import servicePlanningImage from "@/assets/service-planning.jpg";
import serviceStationeryImage from "@/assets/service-stationery.jpg";
import serviceFullserviceImage from "@/assets/service-fullservice.jpg";
import editorialFloralsImage from "@/assets/editorial-florals.jpg";
import vendorDetailImage from "@/assets/vendor-detail.jpg";
import ServicesVendorPartners from "@/components/wedding/ServicesVendorPartners";
import ServicesInvestmentPhilosophy from "@/components/wedding/ServicesInvestmentPhilosophy";

const serviceTiers = [
  {
    id: "day-of",
    title: "Day-Of Coordination",
    tagline: "You planned it. We perfect it.",
    investment: "Starting at — inquire",
    description:
      "For couples who love planning and have handled the details — we step in 6–8 weeks before, with unlimited communication through to the day, to review everything, confirm vendors, build your timeline, and lead the day with calm authority.",
    includes: [
      "Detailed timeline creation and management",
      "Vendor confirmation and logistics coordination",
      "Full rehearsal direction",
      "Up to 12 hours of day-of leadership",
      "Setup and teardown oversight",
      "Emergency kit and problem-solving",
    ],
    idealFor:
      "Couples who enjoy planning but want a professional to execute flawlessly.",
    image: serviceDayofImage,
    imageAlt: "Wedding planner leading a ceremony rehearsal at golden hour with an ivory floral arch",
  },
  {
    id: "partial",
    title: "Partial Planning",
    tagline: "Collaboration at every turn.",
    investment: "Starting at — inquire",
    description:
      "For couples who've started planning but need a trusted partner to complete the vendor team and carry the rest of the load with you.",
    includes: [
      "Everything in Day-Of Coordination",
      "Remaining vendor sourcing and curation",
      "Vendor recommendations from our trusted network",
      "Planning check-ins to round out your team",
    ],
    idealFor:
      "Couples who want expert support and a complete vendor team while staying creatively involved.",
    image: serviceStationeryImage,
    imageAlt: "Luxury wedding stationery suite with calligraphy and wax seals on marble",
  },
  {
    id: "full",
    title: "Full-Service Planning",
    tagline: "From vision to celebration.",
    investment: "Starting at — inquire",
    description:
      "For couples who want the complete experience — held from the moment of engagement through the final send-off. Design, vision, vendors, and execution, all carried for you.",
    includes: [
      "Everything in Partial Planning",
      "Design direction and vision development",
      "End-to-end vendor sourcing, negotiation, and management",
      "Comprehensive logistics and production",
      "Held from engagement through final send-off",
    ],
    idealFor:
      "Couples who want a truly hands-free, elevated experience from start to finish.",
    image: serviceFullserviceImage,
    imageAlt: "Wedding planner styling an elegant reception table with sage florals and crystal glassware",
  },
];

// listItem variants moved to ServiceTierCard sub-component

const Services = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    setPageMeta({
      title: "Services | Hickory & Rose Edmonton Wedding Planner",
      description: "Day-of coordination, partial planning, and full-service wedding planning in Edmonton & the Canadian Rockies. Tailored proposals, calm execution.",
      path: "/services",
    });
    setBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Services", path: "/services" },
    ]);
  }, []);

  return (
    <main id="main-content">
      <Navigation variant="overlay" />

      {/* Cinematic Parallax Hero */}
      <section ref={heroRef} className="relative h-[60vh] md:h-[70vh] overflow-hidden grain-overlay vignette">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={servicesHeroImage}
            alt="Luxury wedding planning flatlay with calligraphy timeline, sage eucalyptus, and gold wax seal on marble"
            className="w-full h-[120%] object-cover"
            loading="eager"
            fetchPriority="high"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/15 to-black/55" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />
        </motion.div>

        {/* Large parallax watermark */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "15%"]) }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.03 }}
          transition={{ duration: 2, delay: 0.5 }}
        >
          <span className="font-serif-wedding text-[14rem] md:text-[22rem] text-white leading-none tracking-tight whitespace-nowrap">
            Services
          </span>
        </motion.div>

        <motion.div
          className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6"
          style={{ opacity: heroOpacity }}
        >
          <ScrollReveal>
            <p className="font-sans-wedding text-label uppercase text-white/50 mb-4">
              <span className="inline-flex items-center gap-3">
                <motion.span
                  className="w-8 h-px bg-white/30 origin-right"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
                Our Services
                <motion.span
                  className="w-8 h-px bg-white/30 origin-left"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </span>
            </p>
            <h1 className="font-serif-wedding text-display-xl text-white mb-6 max-w-3xl">
              Services Tailored to You
            </h1>
            <p className="font-sans-wedding text-base md:text-lg text-white/70 leading-relaxed max-w-xl mx-auto font-light">
              Every couple is different. Our services meet you where you are —
              whether you need a steady hand on the day or a trusted partner from
              the very beginning.
            </p>
          </ScrollReveal>
        </motion.div>

        <GoldFrame inset="20px" delay={1} />

        {/* Credential strip */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {["Three Curated Tiers", "Custom Proposals", "Tailored to You"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-[0.5rem] tracking-[0.18em] uppercase text-white/30 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>

        {/* Section corner index */}
        <motion.span
          className="absolute bottom-8 right-8 font-serif-wedding text-sm text-white/15 tracking-widest z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          01
        </motion.span>
      </section>

      {/* Editorial Intro — asymmetric layout */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-baseline">
              <div className="md:col-span-5">
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-3">
                  <span className="inline-flex items-center gap-3">
                    <span className="w-5 h-px bg-primary/30" />
                    Our Philosophy
                  </span>
                </p>
                <h2 className="font-serif-wedding text-display-md text-foreground leading-tight">
                  No two love stories are the same.
                </h2>
              </div>
              <div className="md:col-span-7">
                <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">
                  We don't believe in one-size-fits-all packages. Whether you've already mapped every detail or are starting from a blank page, our role adapts to yours. Each tier below represents a starting point — your custom proposal will reflect what you truly need.
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Service Tiers */}
      {serviceTiers.map((service, index) => (
        <div key={service.id}>
          <ServiceTierCard service={service} index={index} />

          {/* Editorial image breaks between tiers */}
          {index < serviceTiers.length - 1 && index === 0 && (
            <FullWidthImage
              src={editorialFloralsImage}
              alt="Sage eucalyptus and ivory garden rose arrangement detail"
              height="h-[25vh] md:h-[35vh]"
              caption="Every petal, placed with purpose"
            />
          )}
          {index < serviceTiers.length - 1 && index === 1 && (
            <FullWidthImage
              src={vendorDetailImage}
              alt="Luxury wedding stationery with calligraphy and gold wax seal"
              height="h-[25vh] md:h-[35vh]"
              overlay
              caption="Design-led planning for couples who value intention"
            />
          )}
        </div>
      ))}

      {/* Testimonial — editorial with gold ornaments and parallax watermark */}
      <section className="py-20 md:py-28 bg-sage-deep relative overflow-hidden">
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
          className="absolute -right-4 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.025 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <span className="font-serif-wedding text-[10rem] md:text-[14rem] text-primary-foreground leading-none tracking-tight italic whitespace-nowrap">
            Trust
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 max-w-3xl text-center relative">
          <ScrollReveal>
            {/* Decorative diamond ornament */}
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
              "They handled every detail with such grace — we were completely
              free to enjoy our day. It was everything we dreamed of and more."
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
            <p className="font-sans-wedding text-body-sm font-light text-primary-foreground/70">
              Hickory & Rose
            </p>
            <p className="font-sans-wedding text-[0.6rem] tracking-[0.12em] uppercase text-primary-foreground/25 mt-2">
              Design Philosophy
            </p>
          </ScrollReveal>
        </div>
      </section>

      <ServiceComparison />

      {/* Why Hickory & Rose — editorial differentiator */}
      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-card relative overflow-hidden">
        {/* Decorative background monogram */}
        <motion.div
          className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.02 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <span className="font-script text-[18rem] md:text-[24rem] text-foreground leading-none">
            R
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 max-w-5xl relative">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16 items-start mb-16 md:mb-24">
              <div className="md:col-span-5">
                <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-4">
                  <span className="inline-flex items-center gap-3">
                    <span className="w-5 h-px bg-primary/30" />
                    The Difference
                  </span>
                </p>
                <h2 className="font-serif-wedding text-display-lg text-foreground leading-tight">
                  Why couples choose us.
                </h2>
              </div>
              <div className="md:col-span-7 md:pt-8">
                <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">
                  It's not about what we do — it's about how we make you feel. Our couples consistently describe the same thing: a deep exhale. The relief of knowing every detail is handled with care, taste, and quiet confidence.
                </p>
              </div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 md:gap-0">
            {[
              {
                title: "Calm Under Pressure",
                desc: "When the unexpected happens — and it always does — we handle it before you even notice. That's the promise.",
                icon: "01",
              },
              {
                title: "Design-Forward Thinking",
                desc: "We don't just execute a vision — we elevate it. Every texture, every colour, every transition point is considered.",
                icon: "02",
              },
              {
                title: "Vendor Relationships",
                desc: "Years of trusted partnerships mean preferred access, better pricing, and a team that works together seamlessly.",
                icon: "03",
              },
            ].map((item, i) => (
              <ScrollReveal key={item.title} delay={i * 0.1}>
                <div
                  className="relative py-10 md:py-12 md:px-8 first:border-t-0 md:first:border-l-0 group overflow-hidden transition-all duration-700 hover:scale-[1.02]"
                  style={{ willChange: "transform, box-shadow" }}
                  onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 0 20px hsl(var(--gold) / 0.08), 0 0 40px hsl(var(--gold) / 0.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
                >
                  {/* Gold gradient left border (desktop) / top border (mobile) */}
                  <span
                    className="absolute top-0 left-0 right-0 h-px md:h-full md:w-px md:right-auto block"
                    style={{ background: "linear-gradient(to right, hsl(var(--gold) / 0.3), hsl(var(--border) / 0.2)) " }}
                    aria-hidden="true"
                  />
                  {/* Diagonal shimmer sweep on hover */}
                  <span
                    className="absolute inset-0 pointer-events-none -translate-x-full group-hover:translate-x-[200%] transition-transform duration-[1s] ease-in-out"
                    style={{ background: "linear-gradient(135deg, transparent 40%, hsl(var(--gold) / 0.06) 50%, transparent 60%)" }}
                    aria-hidden="true"
                  />
                  <span className="font-serif-wedding text-4xl font-light text-primary/10 group-hover:text-primary/20 transition-colors duration-700 block mb-4">
                    {item.icon}
                  </span>
                  <h3 className="font-serif-wedding text-xl text-foreground mb-3 group-hover:text-primary transition-colors duration-500">
                    {item.title}
                  </h3>
                  <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <ServicesVendorPartners />
      <ServicesInvestmentPhilosophy />

      {/* Your Journey — editorial process timeline */}
      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop bg-background relative overflow-hidden">
        {/* Background watermark */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 pointer-events-none select-none"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 0.015 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5 }}
        >
          <span className="font-script text-[16rem] md:text-[22rem] text-foreground leading-none">
            Journey
          </span>
        </motion.div>

        <div className="container mx-auto px-6 lg:px-8 max-w-4xl relative">
          <ScrollReveal>
            <div className="text-center mb-16 md:mb-20">
              <p className="font-sans-wedding text-label uppercase text-muted-foreground/50 mb-4">
                <span className="inline-flex items-center gap-3">
                  <span className="w-5 h-px bg-border" />
                  From Inquiry to "I Do"
                  <span className="w-5 h-px bg-border" />
                </span>
              </p>
              <h2 className="font-serif-wedding text-display-lg text-foreground">
                Your Journey With Us
              </h2>
            </div>
          </ScrollReveal>

          <div className="relative">
            {/* Central vertical gold line (desktop) */}
            <motion.div
              className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2"
              style={{ background: "linear-gradient(180deg, transparent, hsl(var(--gold) / 0.2), hsl(var(--gold) / 0.2), transparent)" }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            />

            {[
              { step: "01", title: "Discovery Call", desc: "A relaxed, 30-minute conversation to learn about your vision, your priorities, and how you want to feel on your day." },
              { step: "02", title: "Custom Proposal", desc: "Within one week, you'll receive a tailored proposal with transparent pricing, a detailed scope, and a clear next step." },
              { step: "03", title: "Planning Begins", desc: "We dive into design direction, vendor selection, timeline building, and all the details that make your wedding uniquely yours." },
              { step: "04", title: "Rehearsal & Final Details", desc: "Every vendor is confirmed, every timeline reviewed, every moment choreographed. You exhale — we've got this." },
              { step: "05", title: "Your Wedding Day", desc: "We lead with calm confidence so you can be fully present. Every detail is handled. Every moment is yours." },
            ].map((item, i) => (
              <ScrollReveal key={item.step} delay={i * 0.08}>
                <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-16 mb-12 md:mb-16 last:mb-0 items-start ${i % 2 !== 0 ? "md:direction-rtl" : ""}`}>
                  <div className={`${i % 2 !== 0 ? "md:text-right md:order-2" : "md:order-1"}`}>
                    <div className={`flex items-start gap-4 ${i % 2 !== 0 ? "md:flex-row-reverse" : ""}`}>
                      {/* Gold node dot */}
                      <motion.span
                        className="w-2.5 h-2.5 rounded-full shrink-0 mt-2"
                        style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.6), hsl(var(--gold) / 0.2))" }}
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 + i * 0.1, duration: 0.4, type: "spring" }}
                      />
                      <div>
                        <span className="font-serif-wedding text-3xl font-light text-primary/15 block mb-1">{item.step}</span>
                        <h3 className="font-serif-wedding text-xl text-foreground mb-2">{item.title}</h3>
                        <p className="font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light">{item.desc}</p>
                      </div>
                    </div>
                  </div>
                  <div className={`hidden md:block ${i % 2 !== 0 ? "md:order-1" : "md:order-2"}`} />
                </div>
              </ScrollReveal>
            ))}
          </div>

          <ScrollReveal delay={0.4}>
            <div className="text-center mt-16">
              <MagneticButton to="/inquire" variant="primary">
                Begin Your Journey
              </MagneticButton>
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

export default Services;
