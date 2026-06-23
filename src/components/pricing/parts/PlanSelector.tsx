import { selectorQuestions } from "../content";
import { usePlanSelector } from "../hooks/usePlanSelector";

export default function PlanSelector() {
  const s = usePlanSelector();
  const q = !s.done ? selectorQuestions[s.step] : null;

  return (
    <section aria-labelledby="selector-title" className="border-b border-ink/[0.05] bg-charcoal-950">
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Plan selector
            </div>
            <h2 id="selector-title" className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[44px]">
              Not sure where to start?
            </h2>
            <p className="mt-4 max-w-[44ch] text-[15px] leading-[1.7] text-ink/70">
              Three quick questions. Honest recommendation. No bank connection, no email required.
            </p>
            <div className="mt-8 flex items-center gap-2">
              {selectorQuestions.map((_, i) => {
                const reached = i <= s.step;
                return (
                  <span
                    key={i}
                    className={`h-1 flex-1 max-w-[60px] rounded-full transition-colors duration-300 ${
                      reached ? "bg-champagne-200" : "bg-ink/[0.08]"
                    }`}
                  />
                );
              })}
              <span className="ml-3 text-[11px] uppercase tracking-[0.22em] text-ink/45">
                {Math.min(s.step + 1, s.total)} / {s.total}
              </span>
            </div>
          </div>

          <div className="rounded-3xl border border-ink/[0.08] bg-charcoal-900/65 p-6 backdrop-blur-sm sm:p-8">
            {q && (
              <div key={q.key} className="motion-safe:animate-section-in">
                <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/45">
                  Question {s.step + 1}
                </div>
                <h3 className="mt-2 text-[20px] font-light text-ink">{q.label}</h3>
                <div role="radiogroup" aria-label={q.label} className="mt-6 grid gap-2">
                  {q.options.map((opt) => {
                    const selected = s.answers[q.key] === opt.id;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        onClick={() => s.setAnswer(q.key, opt.id)}
                        className={`flex items-center justify-between gap-3 rounded-xl border px-5 py-3.5 text-left text-[14px] transition-all duration-300 ease-cinema ${
                          selected
                            ? "border-champagne-200/50 bg-charcoal-800/80 text-ink"
                            : "border-ink/[0.08] bg-ink/[0.02] text-ink/80 hover:border-ink/20 hover:text-ink"
                        }`}
                      >
                        <span>{opt.label}</span>
                        <span aria-hidden className={`text-[11px] ${selected ? "text-champagne-200" : "text-ink/30"}`}>â†’</span>
                      </button>
                    );
                  })}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={s.back}
                    disabled={s.step === 0}
                    className="text-[12px] text-ink/55 transition-colors hover:text-ink disabled:opacity-40"
                  >
                    â† Back
                  </button>
                  <button
                    type="button"
                    onClick={s.reset}
                    className="text-[12px] text-ink/45 transition-colors hover:text-ink/80"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {s.done && s.recommendation && (
              <div className="motion-safe:animate-panel-rise">
                <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
                  Recommendation
                </div>
                <h3 className="mt-3 font-light text-ink text-[26px] leading-[1.15] sm:text-[30px]">
                  {s.recommendation.headline}
                </h3>
                <p className="mt-4 text-[15px] leading-[1.7] text-ink/80">{s.recommendation.body}</p>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <a
                    href={s.recommendation.cta.href}
                    className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    <span className="relative z-10">{s.recommendation.cta.label}</span>
                    <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
                  </a>
                  <button
                    type="button"
                    onClick={s.reset}
                    className="rounded-full border border-ink/[0.12] px-5 py-3 text-[13px] text-ink/85 transition-all duration-300 hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
                  >
                    Start over
                  </button>
                </div>
                <p className="mt-3 text-[11px] uppercase tracking-[0.22em] text-ink/45">
                  No contracts Â· Cancel anytime
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
