import { useState } from "react";
import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function BeforeAfter() {
  const c = HIW_COPY.ba;
  const { ref, inView } = useInView<HTMLDivElement>();
  const [hover, setHover] = useState(false);
  const reveal = hover ? 78 : inView ? 50 : 0;

  return (
    <div>
      <SectionHeader headline="From reactive to proactive financial visibility." sub="Hover the panel to reveal the after-state." align="center" />
      <div
        ref={ref}
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        className="relative mx-auto mt-12 overflow-hidden rounded-2xl border border-charcoal-700 bg-white shadow-[0_1px_3px_0_rgba(11,13,18,0.07),_0_2px_8px_-2px_rgba(11,13,18,0.05)]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Before */}
          <div className="relative bg-paper-raised p-8 md:p-10">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-ink/35">{c.before.label}</div>
            <h3 className="mt-2 font-zentry text-2xl leading-tight tracking-tight text-ink/70">{c.before.title}</h3>
            <ul className="mt-6 space-y-3">
              {c.before.bullets.map((b) => (
                <li key={b} className="flex items-start gap-3 text-[14px] leading-[1.55] text-ink/45">
                  <span className="mt-[10px] inline-block h-px w-3 bg-ink/20" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>
          </div>
          {/* After */}
          <div className="relative bg-white p-8 md:p-10">
            <div className="absolute inset-y-0 left-0 hidden w-px bg-gradient-to-b from-transparent via-champagne-200/40 to-transparent md:block" />
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">{c.after.label}</div>
            <h3 className="mt-2 font-zentry text-2xl leading-tight tracking-tight text-ink">{c.after.title}</h3>
            <ul className="mt-6 space-y-3">
              {c.after.bullets.map((b, i) => (
                <li
                  key={b}
                  className={`flex items-start gap-3 text-[14.5px] leading-[1.55] text-ink/90 transition-all duration-500 ease-cinema ${
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
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 rounded-full border border-champagne-200/30 bg-white px-2 py-1 text-[10px] uppercase tracking-[0.22em] text-champagne-300 shadow-sm">
            Now
          </div>
        </div>
      </div>
      <p className="mx-auto mt-8 max-w-2xl text-center text-[14px] leading-[1.7] text-ink/55">{c.line}</p>
    </div>
  );
}
