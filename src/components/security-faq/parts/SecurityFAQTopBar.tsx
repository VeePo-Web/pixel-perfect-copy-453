import { useEffect, useState } from "react";
import { topNavSections } from "../content";

export default function SecurityFAQTopBar() {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const sections = topNavSections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);
    if (!sections.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.2, 0.6, 1] }
    );
    sections.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-ink/[0.05] bg-charcoal-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-3.5 lg:px-10">
        <a href="#/" className="group flex shrink-0 items-center gap-3">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 transition-transform duration-400 group-hover:scale-125" />
          <span className="text-[12.5px] uppercase tracking-[0.28em] text-ink/85">
            GoldFin Desk
          </span>
        </a>
        <nav className="hidden items-center gap-6 lg:flex" aria-label="Section navigation">
          {topNavSections.map((s) =>
            s.id === "apply" ? (
              <a
                key={s.id}
                href="#/apply"
                className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[12px] font-medium text-navy transition-all duration-300 hover:shadow-[0_8px_28px_-10px_rgba(217,190,130,0.55)]"
              >
                Apply
              </a>
            ) : (
              <a
                key={s.id}
                href={`#${s.id}`}
                className={`relative text-[12px] transition-colors ${
                  active === s.id ? "text-ink" : "text-ink/55 hover:text-ink"
                }`}
              >
                {s.label}
                <span
                  aria-hidden
                  className={`absolute -bottom-1.5 left-0 h-px w-full origin-left bg-champagne-200/70 transition-transform duration-400 ease-cinema ${
                    active === s.id ? "scale-x-100" : "scale-x-0"
                  }`}
                />
              </a>
            )
          )}
        </nav>
        <nav className="flex items-center gap-5 lg:hidden">
          <a href="#faq" className="text-[12px] text-ink/55 hover:text-ink">
            FAQ
          </a>
          <a
            href="#/apply"
            className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-1.5 text-[12px] font-medium text-navy"
          >
            Apply
          </a>
        </nav>
      </div>
    </header>
  );
}
