import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef } from "react";
import { setPageMeta, setRobotsMeta } from "@/lib/seo";
import { motion, useScroll, useTransform } from "framer-motion";
import Navigation from "@/components/wedding/Navigation";
import Footer from "@/components/wedding/Footer";
import MagneticButton from "@/components/wedding/MagneticButton";
import GoldFrame from "@/components/wedding/GoldFrame";
import BreathingDiamond from "@/components/wedding/BreathingDiamond";
import notfoundImage from "@/assets/notfound-editorial.jpg";

const suggestedPages = [
  { label: "Our Services", path: "/services", desc: "Day-of, partial, and full-service planning" },
  { label: "Portfolio", path: "/portfolio", desc: "See our work in refined rustic elegance" },
  { label: "Our Approach", path: "/approach", desc: "How we plan your perfect day" },
];

const NotFound = () => {
  const location = useLocation();
  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const contentY = useTransform(scrollYProgress, [0, 0.5], ["0%", "8%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    setPageMeta({
      title: "Page Not Found | Hickory & Rose — Edmonton Wedding Planner",
      description: "The page you're looking for doesn't exist. Explore our wedding planning services, portfolio, and approach.",
      path: location.pathname,
    });
    setRobotsMeta("noindex,follow");
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    return () => {
      setRobotsMeta("index,follow");
    };
  }, [location.pathname]);

  return (
    <main id="main-content">
      <Navigation variant="overlay" />

      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden grain-overlay vignette"
      >
        {/* Parallax editorial background */}
        <motion.div className="absolute inset-0" style={{ y: heroY }}>
          <img
            src={notfoundImage}
            alt=""
            className="w-full h-[130%] object-cover"
            loading="eager"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/45 to-black/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/15 via-transparent to-black/10" />
        </motion.div>

        {/* Large decorative 404 with scroll parallax + breathing glow */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
          style={{ y: contentY }}
        >
          <motion.p
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: [0.03, 0.05, 0.03] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="font-serif-wedding text-[16rem] md:text-[24rem] font-light text-white tracking-tight"
            style={{ textShadow: "0 0 120px hsl(var(--gold) / 0.08)" }}
            aria-hidden="true"
          >
            404
          </motion.p>
        </motion.div>

        {/* Gold radial glow */}
        <motion.div
          className="absolute left-1/2 top-1/3 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[400px] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.08 }}
          transition={{ duration: 2, delay: 0.5 }}
          style={{ background: "radial-gradient(ellipse, hsl(var(--gold) / 0.3), transparent 70%)" }}
          aria-hidden="true"
        />

        {/* Floating script ornament */}
        <motion.div
          className="absolute bottom-1/4 right-12 pointer-events-none select-none hidden lg:block"
          animate={{ y: [0, -10, 0], rotate: [0, 3, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <span className="font-script text-6xl text-white/[0.03]">&</span>
        </motion.div>

        {/* Content with scroll-linked fade */}
        <motion.div
          className="relative z-10 text-center max-w-xl px-6"
          style={{ opacity: contentOpacity, y: contentY }}
        >
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1.0] }}
          >
            {/* Ornamental header */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-10 h-px bg-white/25 origin-right"
              />
              <span className="w-2 h-2 rotate-45" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }} />
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                className="w-10 h-px bg-white/25 origin-left"
              />
            </div>

            <p className="font-sans-wedding text-label uppercase text-white/45 mb-6 tracking-[0.2em]">
              Page Not Found
            </p>

            <h1 className="font-serif-wedding text-display-xl text-white mb-6 leading-tight">
              This page seems to have wandered off.
            </h1>

            <p className="font-sans-wedding text-body-sm text-white/55 leading-relaxed mb-12 font-light max-w-md mx-auto">
              The page you're looking for doesn't exist — but your perfect
              wedding planning journey is just a click away.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="flex flex-col sm:flex-row gap-4 justify-center mb-16"
          >
            <MagneticButton to="/" variant="outline-light">
              Return Home
            </MagneticButton>
            <MagneticButton to="/inquire" variant="outline-light">
              Start a Conversation
            </MagneticButton>
          </motion.div>

          {/* Suggested pages — editorial ruled cards */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.6 }}
          >
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 1.1 }}
              className="w-16 h-px mx-auto mb-4 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.2), transparent)" }}
            />
            {/* Connecting diamond */}
            <div className="flex justify-center mb-4">
              <motion.span
                initial={{ scale: 0, rotate: 0 }}
                animate={{ scale: 1, rotate: 45 }}
                transition={{ duration: 0.4, delay: 1.3 }}
                className="w-1.5 h-1.5"
                style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.5), hsl(var(--gold) / 0.15))" }}
              />
            </div>
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.5, delay: 1.4 }}
              className="w-px h-6 mx-auto mb-4 origin-top"
              style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.2), transparent)" }}
            />
            <p className="font-overline text-white/25 mb-8">Or explore</p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {suggestedPages.map((page, i) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.12 }}
                >
                  <Link
                    to={page.path}
                    className="block p-5 border border-white/8 hover:border-white/20 transition-all duration-500 group hover:bg-white/[0.03] relative overflow-hidden"
                  >
                    {/* Gold shimmer on hover */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
                      style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.06) 40%, hsl(var(--gold) / 0.1) 50%, hsl(var(--gold) / 0.06) 60%, transparent 100%)" }}
                    />
                    <span className="w-3 h-3 rotate-45 block mb-2 group-hover:scale-110 transition-transform duration-500" style={{ background: "linear-gradient(135deg, hsl(var(--gold) / 0.3), hsl(var(--gold) / 0.08))" }} />
                    <p className="font-sans-wedding text-sm text-white/75 group-hover:text-white transition-colors duration-300 font-light mb-1">
                      {page.label}
                    </p>
                    <p className="font-sans-wedding text-caption text-white/60 font-light leading-relaxed">
                      {page.desc}
                    </p>
                    <div className="mt-3 h-px w-0 group-hover:w-full transition-all duration-700 ease-out origin-left" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>

        <GoldFrame inset="20px" delay={1} />

        {/* Credential strip */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 z-20 flex items-center justify-center gap-4 py-3 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.6, duration: 0.8 }}
        >
          {["Lost?", "We'll Guide You", "Hickory & Rose"].map((t, i) => (
            <span key={t} className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-white/60 flex items-center gap-4">
              {i > 0 && <BreathingDiamond size={4} />}
              {t}
            </span>
          ))}
        </motion.div>

        {/* Corner index mark */}
        <motion.span
          className="absolute bottom-8 right-8 font-serif-wedding text-sm text-white/15 tracking-widest z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
        >
          404
        </motion.span>
      </section>

      <Footer />
    </main>
  );
};

export default NotFound;
