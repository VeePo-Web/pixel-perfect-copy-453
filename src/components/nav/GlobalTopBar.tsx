import { useEffect, useState } from "react";
import GoldFinLogo from "../brand/GoldFinLogo";

export type NavKey =
  | "home"
  | "how-it-works"
  | "templates"
  | "pricing"
  | "compare"
  | "sample-briefing"
  | "security-faq"
  | "apply";

type Props = { currentPath?: NavKey };

const LINKS: { key: NavKey; label: string; href: string }[] = [
  { key: "how-it-works", label: "How It Works", href: "#/#how-it-works" },
  { key: "templates", label: "Templates", href: "#/templates" },
  { key: "compare", label: "Compare", href: "#/compare" },
  { key: "sample-briefing", label: "Sample Briefing", href: "#/sample-briefing" },
  { key: "pricing", label: "Pricing", href: "#/pricing" },
  { key: "security-faq", label: "Security & FAQ", href: "#/security-faq" },
];

/** Staggered mobile sheet — items animate in one by one after mount */
function MobileSheet({
  currentPath,
  onClose,
}: {
  currentPath: NavKey;
  onClose: () => void;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => setShow(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      id="global-nav-sheet"
      role="dialog"
      aria-modal="true"
      aria-label="Site navigation"
      className="fixed inset-0 z-30 flex flex-col bg-charcoal-950/97 px-6 pt-20 backdrop-blur-xl lg:hidden"
    >
      <nav aria-label="Primary mobile" className="flex flex-col gap-1">
        {LINKS.map((l, i) => {
          const active = currentPath === l.key;
          return (
            <a
              key={l.key}
              href={l.href}
              aria-current={active ? "page" : undefined}
              onClick={onClose}
              className={`flex items-center justify-between border-b border-ink/[0.06] py-4 text-[15px] transition-[opacity,transform] duration-500 ease-cinema focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm ${
                show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
              } ${active ? "text-champagne-300" : "text-ink/65 hover:text-ink"}`}
              style={{ transitionDelay: show ? `${i * 60}ms` : "0ms" }}
            >
              <span>{l.label}</span>
              <span
                aria-hidden="true"
                className={`text-sm transition-colors duration-300 ${
                  active ? "text-champagne-300/50" : "text-ink/25"
                }`}
              >
                →
              </span>
            </a>
          );
        })}
        <a
          href="#/apply"
          onClick={onClose}
          className={`mt-8 inline-flex items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-3 text-[13px] font-medium text-navy shadow-[0_4px_24px_-6px_rgba(201,162,74,0.45)] transition-[opacity,transform] duration-500 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 ${
            show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: show ? `${LINKS.length * 60 + 40}ms` : "0ms" }}
        >
          Apply
        </a>
      </nav>
    </div>
  );
}

export default function GlobalTopBar({ currentPath = "home" }: Props) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  /** Scroll-triggered compact state: transparent glass → stronger glass at >20px */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /** Mobile menu: Esc key + body scroll lock */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ease-cinema ${
          scrolled
            ? "border-b border-ink/[0.08] bg-charcoal-950/95 shadow-[0_1px_24px_-4px_rgba(11,13,18,0.20)] backdrop-blur-md"
            : "border-b border-ink/[0.05] bg-charcoal-950/80 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 lg:px-10">
          {/* Logo */}
          <a
            href="#/"
            className="group flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950 rounded-sm"
            aria-label="GoldFin Desk — Home"
          >
            <GoldFinLogo
              markClassName="h-7 w-7 transition-transform duration-300 group-hover:scale-105"
              wordmarkClassName="text-[12.5px] uppercase tracking-[0.26em] text-ink/85"
            />
          </a>

          {/* Desktop nav */}
          <nav aria-label="Primary" className="hidden items-center gap-5 lg:flex">
            {LINKS.map((l) => {
              const active = currentPath === l.key;
              return (
                <a
                  key={l.key}
                  href={l.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-1 text-[12px] transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950 rounded-sm ${
                    active
                      ? "text-champagne-300"
                      : "text-ink/55 hover:text-ink/90"
                  }`}
                >
                  {l.label}
                  {active && (
                    <span
                      aria-hidden="true"
                      className="absolute inset-x-0 -bottom-px h-px rounded-full bg-champagne-300/55"
                    />
                  )}
                </a>
              );
            })}

            {/* Apply CTA — premium physical lift on hover */}
            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="rounded-full bg-navy px-4 py-1.5 text-[12px] font-medium text-white ring-1 ring-gold-500/60 transition-all duration-200 ease-cinema hover:-translate-y-px hover:ring-gold-500 hover:shadow-[0_4px_20px_-4px_rgba(201,162,74,0.28)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Apply
            </a>
          </nav>

          {/* Mobile controls */}
          <div className="flex items-center gap-3 lg:hidden">
            <a
              href="#/apply"
              aria-current={currentPath === "apply" ? "page" : undefined}
              className="rounded-full bg-navy px-3.5 py-1.5 text-[11.5px] font-medium text-white ring-1 ring-gold-500/60 transition-all duration-200 hover:ring-gold-500 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-charcoal-950"
            >
              Apply
            </a>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="global-nav-sheet"
              onClick={() => setOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-ink/10 text-ink/80 transition-all duration-200 hover:border-ink/20 hover:text-ink active:scale-[0.95] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-1 focus-visible:ring-offset-charcoal-950"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                aria-hidden="true"
              >
                {open ? (
                  <path
                    d="M3 3l10 10M13 3L3 13"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                  />
                ) : (
                  <>
                    <path
                      d="M2 4h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 8h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M2 12h12"
                      stroke="currentColor"
                      strokeWidth="1.4"
                      strokeLinecap="round"
                    />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>
      </header>

      {open && (
        <MobileSheet currentPath={currentPath} onClose={() => setOpen(false)} />
      )}
    </>
  );
}
