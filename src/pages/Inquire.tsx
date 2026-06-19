import { useState, useEffect, useCallback, useRef } from "react";
import { setPageMeta, setBreadcrumbSchema } from "@/lib/seo";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { z } from "zod";
import Navigation from "@/components/wedding/Navigation";
import Footer from "@/components/wedding/Footer";
import PreFooterDivider from "@/components/wedding/PreFooterDivider";
import ScrollReveal from "@/components/wedding/ScrollReveal";
import { toast } from "@/hooks/use-toast";
import { Heart, ArrowRight, ArrowLeft } from "lucide-react";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import InquireStepIndicator from "@/components/wedding/InquireStepIndicator";
import InquireCelebration from "@/components/wedding/InquireCelebration";
import { buildSteps, type InquiryForm } from "@/components/wedding/InquireFormSteps";
import inquireHeroImage from "@/assets/inquire-hero.jpg";
import inquireEditorialImage from "@/assets/inquire-editorial.jpg";

/* ─── Schema ─── */
const inquirySchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name.").max(100),
  email: z.string().trim().email("Please enter a valid email address.").max(255),
  partner: z.string().max(100).optional(),
  date: z.string().max(50).optional(),
  venue: z.string().max(100).optional(),
  guests: z.string().optional(),
  service: z.string().optional(),
  referral: z.string().max(200).optional(),
  message: z.string().max(1000).optional(),
});

const TOTAL_STEPS = 4;

const stepVariants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  center: { opacity: 1, x: 0 },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

const Inquire = () => {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const watermarkY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  useEffect(() => {
    setPageMeta({
      title: "Inquire | Hickory & Rose Edmonton Wedding Planner",
      description: "Start your planning conversation with Hickory & Rose. A warm, no-pressure inquiry — replies within 24–48 business hours.",
      path: "/inquire",
    });
    setBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Inquire", path: "/inquire" },
    ]);
  }, []);

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [formData, setFormData] = useState<InquiryForm>({
    name: "", email: "", partner: "", date: "", venue: "",
    guests: "", service: "", referral: "", message: "",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof InquiryForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const set = useCallback(
    (field: keyof InquiryForm, value: string) => {
      setFormData((prev) => ({ ...prev, [field]: value }));
      if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
    },
    [errors]
  );

  const validateStep = (): boolean => {
    const newErrors: Partial<Record<keyof InquiryForm, string>> = {};
    if (step === 0) {
      if (!formData.name.trim() || formData.name.trim().length < 2) newErrors.name = "Please enter your full name.";
      if (!formData.email.trim() || !z.string().email().safeParse(formData.email.trim()).success) newErrors.email = "Please enter a valid email address.";
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      const firstKey = Object.keys(newErrors)[0];
      document.getElementById(firstKey)?.focus();
      return false;
    }
    return true;
  };

  const next = () => { if (!validateStep()) return; setDirection(1); setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1)); };
  const prev = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const handleSubmit = () => {
    const result = inquirySchema.safeParse(formData);
    if (!result.success) {
      toast({ title: "Please check your details", description: "Name and email are required." });
      setStep(0);
      return;
    }

    // Deliver inquiry via the visitor's mail client — opens a pre-composed
    // message to sales@hickoryandrose.com so the studio actually receives it.
    const f = result.data;
    const subject = `New Wedding Inquiry — ${f.name}${f.partner ? ` & ${f.partner}` : ""}`;
    const lines = [
      `Name: ${f.name}`,
      f.partner ? `Partner: ${f.partner}` : null,
      `Email: ${f.email}`,
      f.date ? `Wedding date: ${f.date}` : null,
      f.venue ? `Venue / location: ${f.venue}` : null,
      f.guests ? `Guest count: ${f.guests}` : null,
      f.service ? `Service of interest: ${f.service}` : null,
      f.referral ? `How they heard about us: ${f.referral}` : null,
      "",
      "Their vision:",
      f.message?.trim() ? f.message.trim() : "(none shared yet)",
      "",
      "— Sent from hickoryandrose.com/inquire",
    ].filter(Boolean).join("\n");

    const mailto = `mailto:sales@hickoryandrose.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines)}`;
    window.location.href = mailto;

    setSubmitted(true);
    toast({
      title: "Your mail client should now be open",
      description: "Press send to deliver your inquiry. We reply within 24–48 business hours.",
    });
  };

  const inputCls = (field: keyof InquiryForm) =>
    `w-full px-0 py-3 bg-transparent border-0 border-b font-sans-wedding text-base md:text-lg text-foreground font-light placeholder:text-brand-text-tertiary focus:outline-none focus:ring-0 transition-colors duration-300 ${errors[field] ? "border-destructive" : "border-border/60 focus:border-transparent"}`;

  const stepLabels = ["About You", "Wedding Details", "Your Needs", "Your Vision"];

  const steps = buildSteps({ formData, set, errors, inputCls });

  return (
    <AnimatePresence mode="wait">
      {submitted ? (
        <motion.div
          key="celebration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <InquireCelebration />
        </motion.div>
      ) : (
        <motion.main
          key="form"
          id="main-content"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Navigation variant="overlay" />

      {/* Cinematic Parallax Hero */}
      <section ref={heroRef} className="relative h-[50vh] md:h-[60vh] overflow-hidden grain-overlay vignette">
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img src={inquireHeroImage} alt="Calligraphy envelope with sage wax seal, gold pen, eucalyptus, and vintage ring box on cream linen" className="w-full h-[120%] object-cover" loading="eager" fetchPriority="high" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/15 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />
        </motion.div>
        <motion.div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none" style={{ y: watermarkY }} initial={{ opacity: 0 }} animate={{ opacity: 0.03 }} transition={{ duration: 2, delay: 0.5 }}>
          <span className="font-serif-wedding text-[14rem] md:text-[22rem] text-white leading-none tracking-tight whitespace-nowrap">Inquire</span>
        </motion.div>
        <motion.div className="relative z-10 flex flex-col items-center justify-center h-full text-center text-white px-6" style={{ opacity: heroOpacity }}>
          <ScrollReveal>
            <p className="font-sans-wedding text-label uppercase text-white/50 mb-4">
              <span className="inline-flex items-center gap-3">
                <motion.span className="w-8 h-px bg-white/30 origin-right" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
                Begin Your Story
                <motion.span className="w-8 h-px bg-white/30 origin-left" initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.8, delay: 0.5 }} />
              </span>
            </p>
            <h1 className="font-serif-wedding text-display-xl text-white mb-6">Let's Plan Something Beautiful</h1>
            <p className="font-sans-wedding text-body-sm text-white/70 leading-relaxed max-w-xl mx-auto font-light">Understanding. Excitement. Confidence — by the time we meet.</p>
          </ScrollReveal>
        </motion.div>
        <GoldFrame inset="20px" delay={1} />
        <motion.div className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.8 }}>
          {["Complimentary Call", "No Commitment", "24–48hr Reply"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-[0.5rem] tracking-[0.18em] uppercase text-white/30 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>
        <motion.span className="absolute bottom-8 right-8 font-serif-wedding text-sm text-white/15 tracking-widest z-20" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.6 }}>06</motion.span>
      </section>

      {/* What to Expect */}
      <section className="py-10 md:py-14 bg-card border-b border-border/30">
        <div className="container mx-auto px-6 lg:px-8 max-w-5xl">
          <ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {[
                { num: "01", title: "Share your story", desc: "Fill out the form below — it takes about 3 minutes." },
                { num: "02", title: "We'll be in touch", desc: "Expect a warm, personal response within 48 hours." },
                { num: "03", title: "Discovery call", desc: "A relaxed 30-minute conversation about your vision — no obligation." },
              ].map((item, i) => (
                <motion.div key={item.num} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }} className="flex items-start gap-4">
                  <span className="font-serif-wedding text-2xl font-light shrink-0 mt-0.5" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--primary) / 0.3))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>{item.num}</span>
                  <div>
                    <p className="font-sans-wedding text-sm font-medium text-foreground mb-1">{item.title}</p>
                    <p className="font-sans-wedding text-xs text-brand-text-secondary font-light leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-background py-16 md:py-24">
        <div className="container mx-auto px-6 lg:px-8 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-16 items-start">
            {/* Left editorial image */}
            <div className="hidden lg:block lg:col-span-2 sticky top-28">
              <div className="relative">
                <motion.div className="absolute -inset-6 pointer-events-none" initial={{ opacity: 0 }} whileInView={{ opacity: 0.06 }} viewport={{ once: true }} transition={{ duration: 2, delay: 0.5 }} style={{ background: "radial-gradient(ellipse at center, hsl(var(--gold) / 0.15), transparent 70%)" }} aria-hidden="true" />
                <motion.div initial={{ opacity: 0, clipPath: "inset(100% 0 0 0)" }} whileInView={{ opacity: 1, clipPath: "inset(0% 0 0 0)" }} viewport={{ once: true }} transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1.0] }} className="relative group">
                  <div className="aspect-[4/5] overflow-hidden relative">
                    <img src={inquireEditorialImage} alt="Wedding planner working with mood boards, sage fabric swatches, and floral samples" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" loading="lazy" decoding="async" width={800} height={1000} />
                    <div className="absolute top-3 left-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                      <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.35), transparent)" }} />
                      <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.35), transparent)" }} />
                    </div>
                    <div className="absolute bottom-3 right-3 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden="true">
                      <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.35), transparent)" }} />
                      <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.35), transparent)" }} />
                    </div>
                  </div>
                </motion.div>
                <motion.div className="absolute -bottom-8 -right-4 pointer-events-none select-none" initial={{ opacity: 0 }} whileInView={{ opacity: 0.025 }} viewport={{ once: true }} transition={{ duration: 1.5, delay: 0.8 }}>
                  <span className="font-serif-wedding text-[6rem] text-foreground leading-none tracking-tight italic whitespace-nowrap">Begin</span>
                </motion.div>
              </div>
              <div className="mt-8 relative">
                <motion.div initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.3 }} className="w-10 h-px mb-4 origin-left" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), hsl(var(--primary) / 0.1))" }} />
                <p className="font-serif-wedding text-lg italic text-brand-text-secondary leading-relaxed">"Every great wedding starts with a simple conversation."</p>
                <p className="font-sans-wedding text-[0.55rem] tracking-[0.12em] uppercase text-brand-text-decorative mt-3">— Hickory & Rose</p>
              </div>
            </div>

            {/* Right form wizard */}
            <div className="lg:col-span-3">
              <InquireStepIndicator currentStep={step} totalSteps={TOTAL_STEPS} stepLabels={stepLabels} />
              <form onSubmit={(e) => { e.preventDefault(); if (step === TOTAL_STEPS - 1) handleSubmit(); else next(); }} noValidate>
                <div className="min-h-[340px] relative">
                  <AnimatePresence mode="wait" custom={direction}>
                    <motion.div key={step} custom={direction} variants={stepVariants} initial="enter" animate="center" exit="exit" transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}>
                      {steps[step]}
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex items-center justify-between mt-10 pt-6 border-t border-border/30">
                  {step > 0 ? (
                    <button type="button" onClick={prev} className="inline-flex items-center gap-2 font-sans-wedding text-xs tracking-[0.15em] uppercase text-muted-foreground hover:text-foreground transition-colors font-light focus:outline-none focus:ring-2 focus:ring-primary/30 px-2 py-2">
                      <ArrowLeft size={14} strokeWidth={1.5} /> Back
                    </button>
                  ) : <div />}
                  {step < TOTAL_STEPS - 1 ? (
                    <button type="submit" className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary text-primary-foreground font-sans-wedding text-xs tracking-[0.18em] uppercase font-light hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 relative overflow-hidden group">
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.15), transparent 60%)" }} />
                      <span className="relative z-10">Continue</span>
                      <ArrowRight size={14} strokeWidth={1.5} className="relative z-10" />
                    </button>
                  ) : (
                    <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="inline-flex items-center gap-2 px-10 py-4 text-primary-foreground font-sans-wedding text-xs tracking-[0.18em] uppercase font-light transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 relative overflow-hidden group" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--gold) / 0.6), hsl(var(--primary)))" }}>
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.2), transparent 50%)" }} />
                      <span className="relative z-10">Send Inquiry</span>
                      <Heart size={14} strokeWidth={1.5} className="relative z-10" />
                    </motion.button>
                  )}
                </div>
                <p className="font-sans-wedding text-xs text-brand-text-tertiary mt-4 text-center font-light">We respond to every inquiry within 24–48 business hours.</p>
                <a
                  href="https://veepo.ca/case-studies"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center justify-center gap-1 mt-3 w-full"
                >
                  <span className="text-caption tracking-[0.1em] uppercase text-muted-foreground/40 group-hover:text-muted-foreground/60 transition-colors duration-300">
                    This website is powered locally by
                  </span>
                  <span
                    className="text-caption tracking-[0.1em] uppercase font-medium transition-colors duration-300"
                    style={{
                      background: "linear-gradient(90deg, #2e7d32, #f57c00)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      backgroundClip: "text",
                    }}
                  >
                    veepo.ca
                  </span>
                </a>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Trust signals */}
      <section className="py-8 md:py-10 bg-card border-t border-border/20 relative overflow-hidden">
        <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[150px] pointer-events-none" initial={{ opacity: 0 }} whileInView={{ opacity: 0.04 }} viewport={{ once: true }} transition={{ duration: 2 }} style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.2), transparent 70%)" }} aria-hidden="true" />
        <div className="container mx-auto px-6 lg:px-8 max-w-3xl relative">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { value: "24–48hr", label: "Reply Window" },
              { value: "By Hand", label: "Personal Reply" },
              { value: "Free", label: "Discovery Call" },
            ].map((stat, i) => (
              <div key={stat.label} className="relative">
                {i > 0 && <span className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1 h-1 rotate-45 hidden md:block" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }} />}
                <p className="font-serif-wedding text-lg md:text-xl text-foreground/50 font-light">{stat.value}</p>
                <motion.div className="w-4 h-px mx-auto my-1.5 origin-center" initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }} style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.25), transparent)" }} />
                <p className="font-sans-wedding text-[0.5rem] tracking-[0.15em] uppercase text-brand-text-decorative mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <PreFooterDivider />
      <Footer />
    </motion.main>
      )}
    </AnimatePresence>
  );
};

export default Inquire;
