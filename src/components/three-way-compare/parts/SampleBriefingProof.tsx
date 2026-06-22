import { useEffect, useRef, useState } from "react";
import { briefing } from "../content";
import { trackCtaByHref } from "../analytics";

export default function SampleBriefingProof() {
  const ref = useRef<HTMLUListElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.15 }
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="sample-briefing"
      aria-labelledby="briefing-proof-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              The difference
            </div>
            <h2
              id="briefing-proof-heading"
              className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
            >
              The difference: plain-English financial interpretation.
            </h2>
            <p className="mt-4 max-w-[58ch] text-[15px] leading-[1.7] text-ink/70">
              The GoldFin Desk turns financial activity into briefings that explain cash
              movement, revenue trends, expense pressure, questions to review, and decisions to
              consider.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-3">
              <a
                href="#/sample-briefing"
                onClick={() => trackCtaByHref("#/sample-briefing", "briefing-proof")}
                className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)]"
              >
                Generate My Sample Finance Briefing
              </a>
              <a
                href="#/sample-briefing"
                className="text-[12.5px] text-ink/60 underline-offset-4 hover:text-ink hover:underline"
              >
                See Full Sample Briefing →
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 shadow-[0_30px_100px_-40px_rgba(25,28,34,0.14)]">
            <div className="flex items-center justify-between text-[10.5px] uppercase tracking-[0.26em] text-ink/45">
              <span>{briefing.title}</span>
              <span className="text-champagne-300/70">Plain English</span>
            </div>
            <ul ref={ref} className="mt-5 grid gap-2 sm:grid-cols-2">
              {briefing.modules.map((m, i) => (
                <li
                  key={m.title}
                  className={`rounded-xl border border-ink/[0.06] bg-charcoal-900/40 p-4 transition-all duration-500 ease-cinema ${
                    visible
                      ? "translate-y-0 opacity-100"
                      : "translate-y-2 opacity-0"
                  }`}
                  style={{ transitionDelay: visible ? `${i * 90}ms` : "0ms" }}
                >
                  <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                    Module
                  </div>
                  <div className="mt-1.5 text-[14px] font-light text-ink">{m.title}</div>
                  <p className="mt-1 text-[12px] leading-relaxed text-ink/55">{m.note}</p>
                </li>
              ))}
            </ul>
            <div className="mt-6 rounded-xl border border-champagne-200/30 bg-champagne-200/[0.05] p-4">
              <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                Sample insight
              </div>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink/85">
                {briefing.insight}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
