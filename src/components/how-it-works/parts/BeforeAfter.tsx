import { useState } from "react";
import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function BeforeAfter() {
  const c = HIW_COPY.ba;
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hover, setHover] = useState(false);
  // when in view, reveal; hover sweeps further
  const reveal = hover ? 78 : inView ? 50 : 0;

  return (
    <div>
      <SectionHeader headline="From reactive to proactive financial visibility." sub="Hover the panel to reveal the after-state." align="center" />
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mx-auto mt-12 overflow-hidden rounded-2xl border border-white/[0.06] bg-charcoal-900/40 backdrop-blur-sm"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Before */}
          <div className="relative p-8 md:p-10 bg-charcoal-900/60">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-bone/35">{c.before.label}</div>
            <h3 className="mt-2 font-zentry text-2xl leading-tight tracking-tight text-bone/70">{c.before.title}</h3>
            <ul className="mt-6 space-y-3">
              {c.before.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-[1.55] text-bone/45">
                  <span className="mt-[10px] inline-block h-px w-3 bg-bone/25" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* After */}
          <div className="relative p-8 md:p-10 bg-charcoal-900/30">
            <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-champagne-200/40 to-transparent md:block" />
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/70">{c.after.label}</div>
            <h3 className="mt-2 font-zentry text-2xl leading-tight tracking-tight text-bone">{c.after.title}</h3>
            <ul className="mt-6 space-y-3">
              {c.after.bullets.map((b, i) => (
                <li
                  key={b}
                  className={`flex items-start gap-3 text-[14.5px] leading-[1.55] text-bone/90 transition-all duration-500 ease-cinema ${
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
                  }`}
                  style={{ transitionDelay: `${160 + i * 70}ms` }}
                >
                  <span className="mt-[7px] inline-block h-1.5 w-3 bg-champagne-200/80" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Divider sweep (desktop only) */}
        <div
          className="pointer-events-none absolute inset-y-0 hidden w-px bg-champagne-200/50 transition-all duration-700 ease-cinema md:block"
          style={{ left: `${reveal}%` }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-champagne-200/40 bg-charcoal-900 px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-champagne-200/80">
            Now
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-[1.7] text-bone/55">{c.line}</p>
    </div>
  );
}
