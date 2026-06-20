import { useEffect, useRef, useState } from "react";
import { rawDataItems, clarityItems } from "../content";

export default function RawDataVsClarity() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.85;
      const end = vh * 0.15;
      const p = (start - r.top) / (start - end);
      setProgress(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <section className="border-b border-ink/[0.05] bg-charcoal-950">
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Data vs Clarity
          </div>
          <h2 className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
            Financial data is not the same as financial clarity.
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/70">
            Most owners already have numbers. The missing layer is interpretation, rhythm, and a clear view of what deserves attention next.
          </p>
        </div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-4 text-[10.5px] uppercase tracking-[0.22em] text-ink/45">
              What owners usually have
            </div>
            <ul className="space-y-2.5">
              {rawDataItems.map((item, i) => {
                const localP = Math.max(0, Math.min(1, progress * 1.4 - i * 0.04));
                return (
                  <li
                    key={item}
                    className="rounded-lg border border-ink/[0.06] bg-ink/[0.02] px-4 py-3 text-[14px] text-ink/80 transition-all duration-500 ease-cinema"
                    style={{
                      transform: `translateX(${(-12 * localP).toFixed(1)}px)`,
                      opacity: 1 - localP * 0.55,
                      filter: `grayscale(${(localP * 100).toFixed(0)}%)`,
                    }}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>

          <div>
            <div className="mb-4 text-[10.5px] uppercase tracking-[0.22em] text-champagne-200/80">
              What the Monthly Finance Desk creates
            </div>
            <ul className="space-y-2.5">
              {clarityItems.map((item, i) => {
                const localP = Math.max(0, Math.min(1, progress * 1.4 - i * 0.05));
                return (
                  <li
                    key={item}
                    className="rounded-lg border bg-charcoal-900/55 px-4 py-3 text-[14.5px] text-ink transition-all duration-500 ease-cinema"
                    style={{
                      transform: `translateY(${(8 - 8 * localP).toFixed(1)}px)`,
                      opacity: 0.35 + 0.65 * localP,
                      borderColor: `rgba(217,190,130,${(0.08 + 0.22 * localP).toFixed(3)})`,
                      boxShadow: `0 ${10 * localP}px ${40 * localP}px -${20 * localP}px rgba(217,190,130,${(
                        0.25 * localP
                      ).toFixed(3)})`,
                    }}
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
