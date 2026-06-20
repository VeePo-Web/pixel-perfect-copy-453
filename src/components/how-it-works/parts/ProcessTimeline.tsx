import { useEffect, useRef, useState } from "react";
import { HIW_COPY } from "../content";
import ProcessStepVisual from "./ProcessStepVisual";

export default function ProcessTimeline() {
  const steps = HIW_COPY.steps;
  const refs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number((e.target as HTMLElement).dataset.idx);
            setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );
    refs.current.forEach((el) => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-12">
      {/* Sticky left rail (desktop) */}
      <aside className="hidden lg:col-span-5 lg:block">
        <div className="sticky top-24">
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">The 5-step rhythm</div>
          <h3 className="mt-4 font-zentry text-[clamp(1.8rem,3.4vw,2.6rem)] leading-[1.05] tracking-tight text-ink">
            A repeatable monthly operating rhythm.
          </h3>
          <ol className="mt-10 relative">
            <div className="absolute left-[10px] top-2 bottom-2 w-px bg-ink/[0.06]" />
            <div
              className="absolute left-[10px] top-2 w-px bg-gradient-to-b from-champagne-200/80 to-champagne-200/0 transition-all duration-700 ease-cinema"
              style={{ height: `${(active / Math.max(steps.length - 1, 1)) * 100}%` }}
            />
            {steps.map((s, i) => {
              const isActive = i === active;
              return (
                <li key={s.n} className="relative pl-9 py-3">
                  <span
                    className={`absolute left-[5px] top-[18px] h-3 w-3 rounded-full border transition-all duration-500 ${
                      isActive
                        ? "border-champagne-200 bg-champagne-200 shadow-[0_0_0_4px_rgba(217,190,130,0.12)]"
                        : "border-ink/15 bg-charcoal-900"
                    }`}
                  />
                  <div
                    className={`text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-500 ${
                      isActive ? "text-champagne-200/80" : "text-ink/30"
                    }`}
                  >
                    {s.n}
                  </div>
                  <div
                    className={`mt-1 text-[18px] tracking-tight transition-colors duration-500 ${
                      isActive ? "text-ink" : "text-ink/45"
                    }`}
                  >
                    {s.title}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </aside>

      {/* Right column: visuals */}
      <div className="lg:col-span-7 space-y-16 lg:space-y-28">
        {steps.map((s, i) => (
          <div
            key={s.n}
            ref={(el) => (refs.current[i] = el)}
            data-idx={i}
            className="relative"
          >
            {/* Mobile rail */}
            <div className="lg:hidden mb-5 flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-champagne-200" />
              <span className="text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/70">{s.n}</span>
              <span className="text-[15px] tracking-tight text-ink">{s.title}</span>
            </div>
            <div className="grid gap-5">
              <div className="min-h-[320px] sm:min-h-[360px]">
                <ProcessStepVisual index={i} />
              </div>
              <div>
                <p className="max-w-xl text-[14.5px] leading-[1.7] text-ink/70">{s.body}</p>
                <p className="mt-2 text-[11.5px] uppercase tracking-[0.22em] text-ink/35">{s.proof}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
