import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

interface NavigationMobileMenuProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  navLinks: { name: string; path: string }[];
  locationPathname: string;
}

const NavigationMobileMenu = ({ isOpen, setIsOpen, navLinks, locationPathname }: NavigationMobileMenuProps) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        className="fixed inset-0 bg-warm-white z-40 lg:hidden flex flex-col"
      >
        {/* Film grain texture */}
        <div
          className="absolute inset-0 opacity-[0.01] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%' height='100%' filter='url(%23noise)'/%3E%3C/svg%3E\")",
            backgroundSize: "150px 150px",
          }}
          aria-hidden="true"
        />

        {/* Gold-gradient corner accents */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="absolute top-20 left-6 w-10 h-10 pointer-events-none"
          aria-hidden="true"
        >
          <span className="absolute top-0 left-0 w-full h-px" style={{ background: "linear-gradient(90deg, hsl(var(--gold) / 0.3), transparent)" }} />
          <span className="absolute top-0 left-0 h-full w-px" style={{ background: "linear-gradient(180deg, hsl(var(--gold) / 0.3), transparent)" }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="absolute bottom-24 right-6 w-10 h-10 pointer-events-none"
          aria-hidden="true"
        >
          <span className="absolute bottom-0 right-0 w-full h-px" style={{ background: "linear-gradient(270deg, hsl(var(--gold) / 0.3), transparent)" }} />
          <span className="absolute bottom-0 right-0 h-full w-px" style={{ background: "linear-gradient(0deg, hsl(var(--gold) / 0.3), transparent)" }} />
        </motion.div>

        {/* Center breathing diamond */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.05, 0.12, 0.05], scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
          aria-hidden="true"
        >
          <div className="w-40 h-40 rounded-full" style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.08), transparent 70%)" }} />
        </motion.div>

        {/* Top decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0.25, 1.0] }}
          className="h-px origin-left mx-6 mt-20"
          style={{ background: "linear-gradient(90deg, hsl(var(--primary) / 0.2), transparent)" }}
        />

        <div className="flex-1 flex flex-col items-center justify-center pb-24">
          {/* Mobile brand mark */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="mb-12"
          >
            <p className="font-serif-wedding text-3xl font-light text-foreground tracking-tight text-center relative overflow-hidden">
              Hickory <span className="font-normal">&</span>{" "}
              <span className="font-script text-4xl">Rose</span>
              <motion.span
                className="absolute inset-0 pointer-events-none"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1.2, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                style={{
                  background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.2) 45%, hsl(var(--gold) / 0.35) 50%, hsl(var(--gold) / 0.2) 55%, transparent 80%)",
                }}
              />
            </p>
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="h-px w-12 mx-auto mt-4 origin-center"
              style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.3), transparent)" }}
            />
          </motion.div>

          {/* Links with staggered entrance */}
          <ul className="flex flex-col items-center gap-1">
            {navLinks.map((link, index) => (
              <motion.li
                key={link.path}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.25 + index * 0.06,
                  duration: 0.5,
                  ease: [0.25, 0.1, 0.25, 1.0],
                }}
              >
                <Link
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block py-3 px-6 font-serif-wedding text-2xl tracking-wide transition-all duration-200 ${
                    locationPathname === link.path
                      ? "text-primary"
                      : "text-foreground/70 hover:text-foreground"
                  }`}
                >
                  <span className="inline-flex items-center gap-3">
                    <span className="font-sans-wedding text-caption tracking-[0.15em] text-muted-foreground/60 tabular-nums">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    {link.name}
                  </span>
                  {locationPathname === link.path && (
                    <span className="inline-block w-1 h-1 rounded-full bg-primary ml-2 -translate-y-1" />
                  )}
                </Link>
              </motion.li>
            ))}
          </ul>

          {/* Mobile CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + navLinks.length * 0.06 + 0.1, duration: 0.5 }}
            className="mt-10"
          >
            <Link
              to="/inquire"
              onClick={() => setIsOpen(false)}
              className="relative inline-flex items-center px-10 py-3.5 text-[0.6875rem] tracking-[0.2em] uppercase font-sans-wedding font-light bg-primary text-primary-foreground hover:bg-sage-deep transition-colors duration-200 overflow-hidden group"
            >
              {/* Mobile gold shimmer sweep */}
              <span
                className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"
                style={{
                  background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.2) 40%, hsl(var(--gold) / 0.35) 50%, hsl(var(--gold) / 0.2) 60%, transparent 80%)",
                }}
              />
              <span className="relative z-10">Inquire</span>
            </Link>
          </motion.div>

          {/* Trust signal */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-serif-wedding text-caption italic text-muted-foreground/60 mt-6"
          >
            Complimentary discovery call · 48hr response
          </motion.p>
        </div>

        {/* Bottom location + season */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.4 }}
          className="pb-8 text-center"
        >
          <p className="font-sans-wedding text-caption tracking-[0.15em] uppercase text-muted-foreground font-light">
            Edmonton · Alberta · The Rockies
          </p>
          <p className="font-sans-wedding text-caption tracking-[0.1em] text-muted-foreground/60 mt-1.5">
            Now booking 2025 · 2026
          </p>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default NavigationMobileMenu;
