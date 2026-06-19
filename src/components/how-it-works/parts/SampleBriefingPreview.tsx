import { useState } from "react";
import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function SampleBriefingPreview() {
  const c = HIW_COPY.sample;
  const [active, setActive] = useState(c.tabs[0].id);
  const tab = c.tabs.find((t) => t.id === active)!;
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <div id="sample-briefing">
      <SectionHeader headline={c.headline} />
      <div
        ref={ref}
        className={`mt-10 overflow-hidden rounded-2xl border border-champagne-200/15 bg-charcoal-900/60 backdrop-blur-sm transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="absolute" />
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
          <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/70">Sample bi-weekly briefing</div>
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-bone/35">Demo data</div>
          </div>

          {/* Tabs */}
          <div role="tablist" aria-label="Briefing sections" className="flex gap-2 overflow-x-auto px-6 py-4">
            {c.tabs.map((t) => {
              const isActive = t.id === active;
              return (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActive(t.id)}
                  className={`whitespace-nowrap rounded-full border px-4 py-2 text-[12px] transition-all duration-300 ease-cinema ${
                    isActive
                      ? "border-champagne-200/40 bg-charcoal-800/80 text-bone"
                      : "border-white/[0.06] bg-transparent text-bone/55 hover:text-bone hover:border-white/15"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div key={tab.id} className="px-6 pb-8 motion-safe:animate-section-in">
            <p className="max-w-2xl text-[15px] leading-[1.7] text-bone/80">{tab.body}</p>
            <div className="mt-6 divide-y divide-white/[0.05] rounded-lg border border-white/[0.05] bg-charcoal-900/40">
              {tab.rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="text-[13.5px] text-bone/75">{r[0] || r[1]}</div>
                  {r[0] && (
                    <div className="text-right text-[13.5px] tabular-nums text-champagne-100/90">{r[1]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11.5px] uppercase tracking-[0.22em] text-bone/35">{c.micro}</p>
              <a
                href="#top"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
              >
                <span className="relative z-10">{c.cta}</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
