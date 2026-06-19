import { motion } from "framer-motion";
import BreathingDiamond from "./BreathingDiamond";
import MagneticButton from "./MagneticButton";
import Navigation from "./Navigation";
import Footer from "./Footer";

/* ── Beat timing (3-act reveal) ── */
const BEAT1 = 0;      // atmosphere
const BEAT2 = 1.0;    // ornaments
const BEAT3 = 2.0;    // content

const DIAMONDS = Array.from({ length: 16 }, (_, i) => {
  const wave = i < 8 ? 0 : 1;
  const idx = i % 8;
  const col = idx % 2;
  return {
    size: 2 + (idx % 3),
    left: 42 + col * 16 + (idx % 3) * 3,
    delay: BEAT2 + wave * 1.5 + idx * 0.12,
    yEnd: -100 - idx * 30,
    opacity: 0.5 - wave * 0.15,
  };
});

const STEPS = [
  { text: "Press send in your mail app — your message is already composed and addressed." },
  { text: "We'll review your details with care and respond personally within 24–48 business hours." },
  { text: "If we feel like the right fit, we'll set a calm discovery call and prepare a tailored proposal." },
];

const BOKEH = [
  { left: "15%", top: "20%", size: 3, delay: 0.5, dur: 6, opacity: 0.05 },
  { left: "78%", top: "30%", size: 2, delay: 1.2, dur: 7, opacity: 0.04 },
  { left: "25%", top: "65%", size: 4, delay: 0.8, dur: 5.5, opacity: 0.03 },
  { left: "65%", top: "75%", size: 2, delay: 1.8, dur: 6.5, opacity: 0.06 },
  { left: "88%", top: "45%", size: 3, delay: 0.3, dur: 7.5, opacity: 0.04 },
  { left: "8%", top: "50%", size: 2, delay: 2.0, dur: 6, opacity: 0.05 },
];

const clipReveal = (i: number) => ({
  hidden: { clipPath: "inset(100% 0 0 0)", opacity: 0 },
  visible: {
    clipPath: "inset(0% 0 0 0)",
    opacity: 1,
    transition: { duration: 0.6, delay: BEAT3 + 0.5 + i * 0.18, ease: [0.25, 0.1, 0.25, 1] as const },
  },
});

const InquireCelebration = () => (
  <main id="main-content">
    <Navigation variant="solid" />
    <section className="min-h-[80vh] flex items-center justify-center bg-background px-6 py-32 relative overflow-hidden">

      {/* ── BEAT 1: Atmosphere ── */}

      {/* Cinematic letterbox bars */}
      <motion.div
        className="absolute top-0 left-0 right-0 z-20 bg-foreground origin-top"
        style={{ height: "3vh" }}
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: BEAT1 + 0.6, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-20 bg-foreground origin-bottom"
        style={{ height: "3vh" }}
        initial={{ scaleY: 1, opacity: 1 }}
        animate={{ scaleY: 0, opacity: 0 }}
        transition={{ duration: 0.8, delay: BEAT1 + 0.6, ease: [0.76, 0, 0.24, 1] }}
        aria-hidden="true"
      />

      {/* Radial gold pulse */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: [0, 0.12, 0] }}
        transition={{ duration: 3, delay: BEAT1, ease: "easeOut" }}
        style={{ background: "radial-gradient(ellipse at center, hsl(var(--gold) / 0.25), transparent 65%)" }}
        aria-hidden="true"
      />

      {/* Horizontal gold sweep */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{ duration: 2, delay: BEAT1 + 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.08) 40%, hsl(var(--gold) / 0.15) 50%, hsl(var(--gold) / 0.08) 60%, transparent 100%)",
          height: "120%",
          top: "-10%",
        }}
        aria-hidden="true"
      />

      {/* Vignette */}
      <div className="vignette absolute inset-0 pointer-events-none" aria-hidden="true" />

      {/* ── Ambient bokeh particles (CSS-only) ── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {BOKEH.map((p, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              background: `hsl(var(--gold))`,
              animation: `float-particle ${p.dur}s ease-in-out ${p.delay}s infinite`,
              "--particle-opacity": p.opacity,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* ── BEAT 2: Ornaments ── */}

      {/* Diamond cascade waterfall */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {DIAMONDS.map((d, i) => (
          <motion.span
            key={i}
            className="absolute block rotate-45"
            initial={{ opacity: 0, scale: 0.5, y: 0 }}
            animate={{ opacity: [0, d.opacity, 0], scale: [0.5, 1.2, 0.5], y: [0, d.yEnd] }}
            transition={{ duration: 2.5, delay: d.delay, ease: "easeOut" }}
            style={{
              left: `${d.left}%`,
              top: "55%",
              width: d.size,
              height: d.size,
              background: `linear-gradient(135deg, hsl(var(--gold) / ${d.opacity}), hsl(var(--gold) / 0.08))`,
            }}
          />
        ))}
      </div>

      {/* ── BEAT 3: Content ── */}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: BEAT3 }}
        className="text-center max-w-lg relative z-10"
      >
        {/* Central ornament with triple expanding rings */}
        <div className="relative inline-block mb-8">
          {[0, 1, 2].map((ring) => (
            <motion.div
              key={ring}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0, 0.3 - ring * 0.08, 0], scale: [0.5, 2 + ring * 0.8, 3 + ring] }}
              transition={{ duration: 2.5 - ring * 0.3, delay: BEAT2 + ring * 0.25, ease: "easeOut" }}
              className="absolute inset-0 m-auto w-16 h-16 rounded-full"
              style={{ border: `1px solid hsl(var(--gold) / ${0.3 - ring * 0.08})` }}
              aria-hidden="true"
            />
          ))}
          <BreathingDiamond size={24} className="relative z-10" />
        </div>

        <BreathingDiamond size={8} className="mx-auto mb-6" />

        {/* Editorial headline with shimmer-gold */}
        <p className="font-script text-2xl text-primary/70 mb-2">Almost there</p>
        <h1 className="font-serif-wedding text-display-xl shimmer-gold mb-4">
          Your message is ready.
        </h1>

        {/* Gold editorial rule */}
        <div className="editorial-rule mx-auto mb-6" />

        {/* Body copy with drop cap */}
        <p className="drop-cap font-sans-wedding text-body-sm text-muted-foreground leading-relaxed font-light mb-12 max-w-md mx-auto">
          Your inquiry is composed and waiting in your email app — addressed to us and ready to send. Take a breath, press send, and the next steps are already in motion.
        </p>

        {/* Steps timeline with vertical gold connector */}
        <div className="relative max-w-sm mx-auto mb-12 pl-8">
          {/* Vertical gold line */}
          <motion.div
            className="absolute left-3 top-2 bottom-2 w-px origin-top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 1.2, delay: BEAT3 + 0.4, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.4), hsl(var(--gold) / 0.08))" }}
          />

          <div className="space-y-7 text-left">
            {STEPS.map((item, i) => (
              <motion.div
                key={i}
                variants={clipReveal(i)}
                initial="hidden"
                animate="visible"
                className="flex gap-4 items-start relative"
              >
                <div className="absolute -left-5 top-1">
                  <BreathingDiamond size={6} />
                </div>
                <p className="font-sans-wedding text-body-sm text-muted-foreground font-light leading-relaxed">
                  {item.text}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Gold separator */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: BEAT3 + 1.2 }}
          className="w-12 h-px mx-auto mb-10 origin-center"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.3), transparent)" }}
        />

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: BEAT3 + 1.4, duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-col items-center gap-4"
        >
          <MagneticButton to="/portfolio" variant="primary">
            Explore Our Portfolio
          </MagneticButton>
          <a
            href="/approach"
            className="font-sans-wedding text-xs text-muted-foreground/50 underline underline-offset-4 hover:text-primary transition-colors"
          >
            Learn about our approach
          </a>
        </motion.div>
      </motion.div>
    </section>
    <Footer />
  </main>
);

export default InquireCelebration;
