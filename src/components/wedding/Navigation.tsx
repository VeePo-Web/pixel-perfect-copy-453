import { useState, useEffect, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import NavigationMobileMenu from "./NavigationMobileMenu";

interface NavigationProps {
  variant?: "overlay" | "solid";
}

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Portfolio", path: "/portfolio" },
  { name: "About", path: "/about" },
  { name: "Approach", path: "/approach" },
  { name: "Journal", path: "/journal" },
  { name: "FAQ", path: "/faq" },
];

const Navigation = ({ variant = "solid" }: NavigationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();

  const { scrollYProgress } = useScroll();
  const progressWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const isOverlay = variant === "overlay";

  const handleScroll = useCallback(() => {
    const currentY = window.scrollY;
    setScrolled(currentY > 80);
    if (currentY > 300 && currentY > lastScrollY + 5) {
      setHidden(true);
    } else if (currentY < lastScrollY - 5 || currentY < 100) {
      setHidden(false);
    }
    setLastScrollY(currentY);
  }, [lastScrollY]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const showSolidBg = !isOverlay || scrolled;
  const showMonogram = isOverlay && scrolled;

  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to content
      </a>

      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: hidden && !isOpen ? -100 : 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1.0] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          showSolidBg
            ? "bg-warm-white/95 backdrop-blur-md shadow-subtle"
            : "bg-transparent"
        }`}
        role="navigation"
        aria-label="Main navigation"
      >
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with condensed monogram transition */}
            <Link
              to="/"
              className={`relative transition-colors duration-300 ${
                showSolidBg ? "text-foreground" : "text-white"
              }`}
            >
              <AnimatePresence mode="wait">
                {showMonogram ? (
                  <motion.span
                    key="monogram"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex items-center gap-1.5 relative overflow-hidden"
                  >
                    <motion.span
                      className="absolute inset-0 pointer-events-none z-10"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.0, delay: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.25) 45%, hsl(var(--gold) / 0.4) 50%, hsl(var(--gold) / 0.25) 55%, transparent 80%)",
                      }}
                    />
                    <motion.span
                      className="absolute -inset-3 rounded-full pointer-events-none"
                      animate={{ opacity: [0.03, 0.08, 0.03] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      style={{ background: "radial-gradient(circle, hsl(var(--gold) / 0.4), transparent 70%)" }}
                    />
                    <span className="font-serif-wedding text-lg font-light tracking-tight relative">H</span>
                    <motion.span
                      className="font-script text-xl text-primary/60 relative"
                      animate={{ opacity: [0.6, 0.9, 0.6] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    >&</motion.span>
                    <span className="font-script text-2xl relative">R</span>
                    {/* Page context label */}
                    {(() => {
                      const pageLabels: Record<string, string> = {
                        "/journal": "Journal",
                        "/services": "Services",
                        "/portfolio": "Portfolio",
                        "/about": "About",
                        "/approach": "Approach",
                        "/faq": "FAQ",
                      };
                      const label = pageLabels[location.pathname];
                      if (!label) return null;
                      return (
                        <motion.span
                          className="flex items-center gap-2 ml-2"
                          initial={{ opacity: 0, x: -6 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.15 }}
                        >
                          <span
                            className="w-1 h-1 rounded-full shrink-0"
                            style={{ background: "hsl(var(--gold) / 0.5)" }}
                          />
                          <span className="font-sans-wedding text-caption tracking-[0.18em] uppercase text-muted-foreground font-light">
                            {label}
                          </span>
                        </motion.span>
                      );
                    })()}
                  </motion.span>
                ) : (
                  <motion.span
                    key="full"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                    className="font-serif-wedding text-xl md:text-2xl font-light tracking-tight relative overflow-hidden"
                  >
                    Hickory <span className="font-normal">&</span>{" "}
                    <span className="font-script text-2xl md:text-3xl">Rose</span>
                    <motion.span
                      className="absolute inset-0 pointer-events-none"
                      initial={{ x: "-100%" }}
                      animate={{ x: "200%" }}
                      transition={{ duration: 1.2, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                      style={{
                        background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.25) 45%, hsl(var(--gold) / 0.4) 50%, hsl(var(--gold) / 0.25) 55%, transparent 80%)",
                      }}
                    />
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            {/* Desktop links with editorial hover */}
            <ul className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.path;
                return (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className={`relative px-4 py-2 font-sans-wedding text-[0.6875rem] tracking-[0.18em] uppercase font-light transition-all duration-200 hover:opacity-80 group ${
                        showSolidBg ? "text-foreground" : "text-white"
                      }`}
                    >
                      {link.name}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-underline"
                          className="absolute -bottom-1 left-0 right-0 h-px"
                          style={{
                            background: "linear-gradient(90deg, transparent, hsl(var(--gold) / 0.7), hsl(var(--gold) / 0.4), transparent)",
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-dot"
                          className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 rotate-45"
                          style={{
                            background: "hsl(var(--gold) / 0.6)",
                            boxShadow: "0 0 6px hsl(var(--gold) / 0.3)",
                          }}
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                      {!isActive && (
                        <span
                          className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-px w-0 group-hover:w-full transition-all duration-500 ease-out"
                          style={{
                            background: "linear-gradient(90deg, transparent, hsl(var(--gold, 38 60% 55%) / 0.5), transparent)",
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* CTA button with diagonal gold shimmer */}
            <div className="hidden lg:block">
              <Link
                to="/inquire"
                className={`relative inline-flex items-center px-6 py-2.5 text-[0.6875rem] tracking-[0.18em] uppercase font-sans-wedding font-light border transition-all duration-300 overflow-hidden group ${
                  showSolidBg
                    ? "border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                    : "border-white/60 text-white hover:bg-white/10 hover:border-white"
                }`}
              >
                <span className={`absolute inset-0 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500 ease-out ${
                  showSolidBg ? "bg-primary" : "bg-white/10"
                }`} />
                <span
                  className="absolute inset-0 -translate-x-full group-hover:translate-x-[200%] transition-transform duration-1000 ease-out pointer-events-none"
                  style={{
                    background: "linear-gradient(110deg, transparent 20%, hsl(var(--gold) / 0.15) 40%, hsl(var(--gold) / 0.25) 50%, hsl(var(--gold) / 0.15) 60%, transparent 80%)",
                  }}
                />
                <span className="relative z-10">Inquire</span>
              </Link>
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`lg:hidden relative z-[60] p-2 transition-colors duration-200 ${
                isOpen ? "text-foreground" : showSolidBg ? "text-foreground" : "text-white"
              }`}
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ opacity: 0, rotate: -90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ opacity: 0, rotate: 90 }}
                    animate={{ opacity: 1, rotate: 0 }}
                    exit={{ opacity: 0, rotate: -90 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* Scroll progress — gold gradient */}
        <motion.div
          className="absolute bottom-0 left-0 h-px"
          style={{
            width: progressWidth,
            background: "linear-gradient(90deg, hsl(var(--primary) / 0.6), hsl(var(--gold, 38 60% 55%) / 0.5), hsl(var(--primary) / 0.2))",
          }}
        />

        {/* Mobile fullscreen overlay */}
        <NavigationMobileMenu
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          navLinks={navLinks}
          locationPathname={location.pathname}
        />
      </motion.nav>
    </>
  );
};

export default Navigation;
