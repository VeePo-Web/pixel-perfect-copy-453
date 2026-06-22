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
        className={`mt-10 overflow-hidden rounded-2xl border border-charcoal-700 bg-white shadow-[0_1px_3px_0_rgba(11,13,18,0.07),_0_2px_8px_-2px_rgba(11,13,18,0.05)] transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <div className="relative">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />
          <div className="flex items-center justify-between border-b border-charcoal-700/60 px-6 py-4">
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
              Sample bi-weekly briefing
            </div>
            <div className="text-[10.5px] uppercase tracking-[0.28em] text-ink/35">Demo data</div>
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
                      ? "border-champagne-200/40 bg-paper-raised text-ink shadow-sm"
                      : "border-charcoal-700 bg-transparent text-ink/55 hover:border-ink/20 hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Panel */}
          <div key={tab.id} className="px-6 pb-8 motion-safe:animate-section-in">
            <p className="max-w-2xl text-[15px] leading-[1.7] text-ink/80">{tab.body}</p>
            <div className="mt-6 divide-y divide-charcoal-700/70 rounded-lg border border-charcoal-700 bg-paper-raised">
              {tab.rows.map((r, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[1fr_auto] items-center gap-4 px-4 py-3"
                  style={{ animationDelay: `${i * 80}ms` }}
                >
                  <div className="text-[13.5px] text-ink/75">{r[0] || r[1]}</div>
                  {r[0] && (
                    <div className="text-right text-[13.5px] tabular-nums text-champagne-300">{r[1]}</div>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <p className="text-[11.5px] uppercase tracking-[0.22em] text-ink/35">{c.micro}</p>
              <a
                href="#/pricing#auto-fill"
                className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(212,168,69,0.45)] active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
              >
                <span className="relative z-10">{c.cta}</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
