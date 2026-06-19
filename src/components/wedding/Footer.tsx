import { useRef } from "react";
import { Link } from "react-router-dom";
import { Mail, MapPin, ArrowUp } from "lucide-react";
import { motion } from "framer-motion";
import FooterNewsletter from "./FooterNewsletter";
import FooterServiceAreas from "./FooterServiceAreas";


const footerLinks = [
  { label: "Services", path: "/services" },
  { label: "Portfolio", path: "/portfolio" },
  { label: "About", path: "/about" },
  { label: "Approach", path: "/approach" },
  { label: "FAQ", path: "/faq" },
  { label: "Inquire", path: "/inquire" },
];

const Footer = () => {
  const footerRef = useRef<HTMLElement>(null);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer ref={footerRef} className="bg-foreground text-background relative" role="contentinfo">
      {/* Gradient accent line */}
      <div
        className="h-px w-full"
        style={{
          background:
            "linear-gradient(90deg, transparent, hsl(var(--primary)) 30%, hsl(var(--gold, 38 60% 55%)) 50%, hsl(var(--primary)) 70%, transparent)",
        }}
      />

      {/* Floating H&R monogram watermark with gold glow */}
      <motion.div
        className="absolute right-8 md:right-16 top-1/2 -translate-y-1/2 pointer-events-none select-none hidden lg:block"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2, ease: [0.25, 0.1, 0.25, 1] }}
        aria-hidden="true"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 xl:w-96 xl:h-96 rounded-full"
          style={{
            background: "radial-gradient(circle, hsl(var(--gold, 38 60% 55%) / 0.04), transparent 70%)",
          }}
        />
        <span className="relative overflow-hidden inline-block">
          <span className="font-serif-wedding text-[12rem] xl:text-[16rem] font-light text-background/[0.02] leading-none tracking-tight relative">
            H
          </span>
          <span className="font-script text-[10rem] xl:text-[14rem] text-background/[0.015] leading-none -ml-8 relative">
            R
          </span>
          <motion.span
            className="absolute inset-0 pointer-events-none"
            initial={{ x: "-100%" }}
            whileInView={{ x: "200%" }}
            viewport={{ once: true }}
            transition={{ duration: 1.4, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            style={{
              background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.15) 45%, hsl(var(--gold) / 0.3) 50%, hsl(var(--gold) / 0.15) 55%, transparent 80%)",
            }}
          />
        </span>
      </motion.div>

      {/* Pre-footer email capture */}
      <FooterNewsletter />

      <div className="container mx-auto px-6 lg:px-8 max-w-6xl pt-24 md:pt-32 pb-10 md:pb-14">
        {/* Top: Large editorial monogram + tagline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 mb-20 md:mb-28">
          {/* Monogram column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-5"
          >
            <Link to="/" className="inline-block group">
              <span className="font-serif-wedding text-4xl md:text-5xl lg:text-6xl font-light tracking-[-0.03em] text-background leading-tight">
                Hickory
                <br />
                <span className="font-normal opacity-30">&</span>{" "}
                <span className="font-script text-5xl md:text-6xl lg:text-7xl group-hover:text-primary transition-colors duration-500">
                  Rose
                </span>
              </span>
            </Link>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-16 h-px bg-background/15 origin-left mt-8 mb-6"
            />
            <p className="font-sans-wedding text-sm text-background/60 font-light leading-relaxed max-w-xs">
              Seamless, stress-free execution. Luxury, personalized planning.
              Thoughtfully bringing your vision to life.
            </p>

            {/* Credential badge */}
            <div className="mt-8 flex items-center gap-3">
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{
                  background: "radial-gradient(circle, hsl(var(--gold) / 0.7), hsl(var(--gold) / 0.2))",
                }}
              />
              <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-background/50 font-light">
                Edmonton, Alberta
              </p>
            </div>
          </motion.div>

          {/* Navigation + Contact columns */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:col-span-7"
          >
            <div className="grid grid-cols-2 md:grid-cols-3 gap-10 md:gap-12 relative">
              {/* Editorial column separators (desktop) */}
              <div className="absolute top-0 bottom-0 left-1/3 w-px hidden md:block" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--background) / 0.06), transparent)" }} />
              <div className="absolute top-0 bottom-0 left-2/3 w-px hidden md:block" style={{ background: "linear-gradient(180deg, transparent, hsl(var(--background) / 0.06), transparent)" }} />
              {/* Navigation */}
              <div>
                <p className="font-overline text-background/50 mb-5">
                  Explore
                </p>
                <nav aria-label="Footer navigation">
                  <ul className="space-y-3">
                    {footerLinks.map((link, i) => (
                      <li key={link.path}>
                        <Link
                          to={link.path}
                          className="font-sans-wedding text-sm text-background/60 hover:text-background transition-colors duration-200 font-light inline-flex items-center gap-2 group"
                        >
                          <span className="text-background/30 font-serif-wedding text-caption group-hover:text-background/50 transition-colors">
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Contact */}
              <div>
                <p className="font-overline text-background/50 mb-5">
                  Contact
                </p>
                <div className="space-y-4">
                  <a
                    href="mailto:sales@hickoryandrose.com"
                    className="flex items-start gap-2.5 font-sans-wedding text-sm text-background/60 hover:text-background transition-colors duration-200 font-light"
                  >
                    <Mail size={14} strokeWidth={1.5} className="shrink-0 text-background/40 mt-0.5" />
                    <span>sales@hickoryandrose.com</span>
                  </a>
                  <div className="flex items-start gap-2.5 font-sans-wedding text-sm text-background/60 font-light">
                    <MapPin size={14} strokeWidth={1.5} className="shrink-0 text-background/40 mt-0.5" />
                    <span>Edmonton, Alberta</span>
                  </div>
                </div>

                <div className="mt-6 border-t border-background/[0.06] pt-4">
                  <p className="font-sans-wedding text-caption tracking-[0.1em] uppercase text-background/50 font-light">
                    Typically responds within 48 hours
                  </p>
                </div>
              </div>

              {/* Social + Service area */}
              <FooterServiceAreas />
            </div>
          </motion.div>
        </div>

        {/* Centered monogram above legal bar */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex flex-col items-center mb-10"
        >
          {/* Breathing diamond ornament */}
          <motion.div
            className="relative mb-6"
            animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <div
              className="w-2.5 h-2.5 rotate-45"
              style={{
                background: "linear-gradient(135deg, hsl(var(--gold, 38 60% 55%) / 0.5), hsl(var(--gold, 38 60% 55%) / 0.15))",
              }}
            />
            <div
              className="absolute inset-0 w-6 h-6 -top-[7px] -left-[7px] rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.15), transparent 70%)" }}
            />
          </motion.div>
          <p className="font-script text-2xl text-background/[0.08]">
            Hickory & Rose
          </p>
          {/* Gold-traced horizontal rule */}
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.4 }}
            className="w-20 h-px mt-4 origin-center relative overflow-hidden"
            style={{
              background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.2), transparent)",
            }}
          >
            <motion.span
              className="absolute inset-0"
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.4), transparent)", width: "40%" }}
            />
          </motion.div>
        </motion.div>

        {/* Bottom legal bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <div className="border-t border-background/[0.08]" />
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8">
            <p className="font-sans-wedding text-caption text-background/50 font-light">
              © {new Date().getFullYear()} Hickory & Rose Wedding and Event Planning. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                to="/privacy"
                className="font-sans-wedding text-caption text-background/50 hover:text-background/70 transition-colors font-light"
              >
                Privacy
              </Link>
              <Link
                to="/terms"
                className="font-sans-wedding text-caption text-background/50 hover:text-background/70 transition-colors font-light"
              >
                Terms
              </Link>
              <motion.button
                onClick={scrollToTop}
                className="flex items-center gap-1.5 font-sans-wedding text-caption text-background/50 hover:text-background/70 transition-colors font-light group relative"
                aria-label="Back to top"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                <span className="relative z-10">Top</span>
                <span className="relative z-10">
                  <ArrowUp size={10} strokeWidth={1.5} className="group-hover:-translate-y-0.5 transition-transform duration-200" />
                </span>
                <span
                  className="absolute -inset-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.08), transparent 70%)" }}
                />
              </motion.button>
            </div>
          </div>

        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
