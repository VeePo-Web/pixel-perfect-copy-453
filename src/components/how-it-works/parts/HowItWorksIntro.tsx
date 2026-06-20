import { useEffect, useState } from "react";
import { HIW_COPY } from "../content";
import { useReducedMotion } from "../hooks/useReducedMotion";
import { useInView } from "../hooks/useInView";

export default function HowItWorksIntro() {
  const c = HIW_COPY.intro;
  const reduced = useReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (reduced) return;
    const id = setInterval(() => setActive((i) => (i + 1) % c.loop.length), 2400);
    return () => clearInterval(id);
  }, [reduced, c.loop.length]);

  return (
    <div ref={ref} className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16 items-center">
      <div className="lg:col-span-7">
        <div
          className={`mb-5 inline-flex items-center text-[11px] uppercase tracking-[0.28em] text-champagne-200/70 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
          }`}
        >
          <span className="mr-3 inline-block h-px w-8 bg-champagne-200/40" />
          {c.eyebrow}
        </div>
        <h1
          className={`font-zentry text-[clamp(2.25rem,5.2vw,4.25rem)] leading-[1.02] tracking-tight text-ink transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "80ms" }}
        >
          {c.headline}
        </h1>
        <p
          className={`mt-6 max-w-xl text-[15px] leading-[1.75] text-ink/65 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "160ms" }}
        >
          {c.sub}
        </p>
        <div
          className={`mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
          }`}
          style={{ transitionDelay: "240ms" }}
        >
          <a
            href="#/apply"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
          >
            <span className="relative z-10">{c.primary}</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#top"
            className="group inline-flex items-center text-[13px] text-ink/70 transition-colors duration-300 hover:text-champagne-100"
          >
            <span className="border-b border-bone/20 pb-0.5 group-hover:border-champagne-200/60">{c.secondary}</span>
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
          </a>
        </div>
        <p className="mt-5 text-[11.5px] uppercase tracking-[0.22em] text-ink/35">{c.trust}</p>
      </div>

      <div className="lg:col-span-5">
        <div className="relative rounded-2xl border border-champagne-200/10 bg-charcoal-900/60 p-6 backdrop-blur-sm">
          <div className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />
          <div className="mb-5 flex items-center justify-between">
            <span className="text-[10.5px] uppercase tracking-[0.28em] text-ink/40">Monthly rhythm</span>
            <span className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">Live loop</span>
          </div>
          <ol className="space-y-3">
            {c.loop.map((label, i) => {
              const isActive = i === active;
              return (
                <li
                  key={label}
                  className={`flex items-center gap-4 rounded-lg border px-4 py-3 transition-all duration-500 ease-cinema ${
                    isActive
                      ? "border-champagne-200/30 bg-charcoal-800/60"
                      : "border-ink/[0.04] bg-transparent"
                  }`}
                >
                  <span
                    className={`relative flex h-2 w-2 items-center justify-center rounded-full transition-colors duration-500 ${
                      isActive ? "bg-champagne-200" : "bg-bone/15"
                    }`}
                  >
                    {isActive && !reduced && (
                      <span className="absolute inset-0 -m-1 rounded-full bg-champagne-200/40 motion-safe:animate-soft-pulse" />
                    )}
                  </span>
                  <span className="text-[10.5px] font-medium uppercase tracking-[0.22em] text-ink/40 w-6">0{i + 1}</span>
                  <span
                    className={`text-[14px] tracking-tight transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-ink/55"
                    }`}
                  >
                    {label}
                  </span>
                </li>
              );
            })}
          </ol>
          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
          <p className="mt-4 text-[11.5px] leading-[1.6] text-ink/40">
            A recurring operating loop — not a one-time report.
          </p>
        </div>
      </div>
    </div>
  );
}
