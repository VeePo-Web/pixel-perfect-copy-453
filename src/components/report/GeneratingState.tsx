import { useEffect, useState } from "react";

// The highest-value wait in the product: the owner clicked "Generate" and is
// waiting on the grounded briefing. Replace a bare "Generating…" with a calm,
// anticipatory sequence so the wait feels like work happening, not a hang.
// Steps advance on a timer and hold on the last one (real generation time
// varies); reduced-motion users get a static, honest message.
const STEPS = [
  "Reading your connected transactions",
  "Categorizing and checking every number",
  "Writing your grounded briefing",
];

export default function GeneratingState() {
  const [i, setI] = useState(0);
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (reduceMotion) return;
    const t = setInterval(() => setI((n) => Math.min(n + 1, STEPS.length - 1)), 2600);
    return () => clearInterval(t);
  }, [reduceMotion]);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto mt-7 max-w-[26rem] rounded-2xl border border-charcoal-700 bg-paper-raised px-6 py-7 text-left"
    >
      <div className="text-[10.5px] uppercase tracking-[0.3em] text-champagne-300/80">
        Building your report
      </div>
      <ul className="mt-4 space-y-3">
        {STEPS.map((label, n) => {
          const done = n < i;
          const active = n === i;
          return (
            <li key={label} className="flex items-center gap-3">
              <span
                aria-hidden
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] ${
                  done
                    ? "bg-gold-500/20 text-gold-700"
                    : active
                      ? "border border-gold-500/60 text-gold-700"
                      : "border border-charcoal-700 text-ink/30"
                }`}
              >
                {done ? "✓" : n + 1}
              </span>
              <span
                className={`text-[13.5px] ${
                  active ? "text-ink" : done ? "text-ink/55" : "text-ink/35"
                }`}
              >
                {label}
                {active && !reduceMotion && <span className="ml-1 animate-pulse text-gold-700">…</span>}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="mt-5 text-[11.5px] leading-[1.5] text-ink/45">
        Every figure is verified against your real data before it's shown — this takes a few seconds.
      </p>
    </div>
  );
}
