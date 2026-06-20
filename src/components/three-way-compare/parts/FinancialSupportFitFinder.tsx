import { useEffect, useRef } from "react";
import { fitProblem, fitSetup, fitStage, type FitChoice } from "../content";
import type { useFitFinder } from "../hooks/useFitFinder";
import { track, trackCtaByHref } from "../analytics";

type Props = { finder: ReturnType<typeof useFitFinder> };

export default function FinancialSupportFitFinder({ finder }: Props) {
  const recRef = useRef<HTMLDivElement | null>(null);
  const shown = useRef<string | null>(null);

  useEffect(() => {
    if (finder.recommendation && shown.current !== finder.recommendation.key) {
      shown.current = finder.recommendation.key;
      track("fit_finder_completed", { recommendation: finder.recommendation.key });
      track("fit_finder_recommendation_shown", { recommendation: finder.recommendation.key });
      recRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }, [finder.recommendation]);

  return (
    <section
      id="fit-finder"
      aria-labelledby="fit-finder-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Fit Finder · 60 seconds
          </div>
          <h2
            id="fit-finder-heading"
            className="mt-3 font-light text-bone text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Find the right financial support in under 60 seconds.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.7] text-bone/70">
            Choose the situation closest to your business.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-5 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 sm:p-7">
            <Step
              index={1}
              total={3}
              question="What feels most true right now?"
              options={fitSetup}
              value={finder.state.setup}
              onChange={(v) => finder.set("setup", v as never)}
              name="three-way-fit-setup"
            />
            <Step
              index={2}
              total={3}
              question="What do you need most?"
              options={fitProblem}
              value={finder.state.problem}
              onChange={(v) => finder.set("problem", v as never)}
              name="three-way-fit-problem"
            />
            <Step
              index={3}
              total={3}
              question="What stage is your business?"
              options={fitStage}
              value={finder.state.stage}
              onChange={(v) => finder.set("stage", v as never)}
              name="three-way-fit-stage"
              last
            />
            <div className="mt-6 flex items-center justify-between gap-3 border-t border-ink/[0.06] pt-5">
              <p className="text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
                {finder.completed ? "Recommendation ready" : "Three quick questions"}
              </p>
              <button
                type="button"
                onClick={finder.reset}
                className="text-[12px] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
              >
                Reset
              </button>
            </div>
          </div>

          <div ref={recRef} aria-live="polite">
            {finder.recommendation ? (
              <RecommendationPanel rec={finder.recommendation} />
            ) : (
              <EmptyPanel
                filled={
                  [finder.state.setup, finder.state.problem, finder.state.stage].filter(Boolean)
                    .length
                }
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Step({
  index,
  total,
  question,
  options,
  value,
  onChange,
  name,
  last,
}: {
  index: number;
  total: number;
  question: string;
  options: FitChoice[];
  value: string | null;
  onChange: (v: string) => void;
  name: string;
  last?: boolean;
}) {
  return (
    <div className={last ? "" : "mb-7 border-b border-ink/[0.05] pb-7"}>
      <div className="flex items-baseline justify-between gap-3">
        <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/75">
          Step {index} / {total}
        </div>
        <div className="text-[10.5px] uppercase tracking-[0.22em] text-bone/35">
          {value ? "Answered" : "Pick one"}
        </div>
      </div>
      <fieldset className="mt-3">
        <legend className="text-[15px] font-light text-bone">{question}</legend>
        <div role="radiogroup" aria-label={question} className="mt-4 flex flex-wrap gap-2">
          {options.map((opt) => {
            const checked = value === opt.value;
            return (
              <label
                key={opt.value}
                className={`group inline-flex min-h-[44px] cursor-pointer items-center gap-2 rounded-full border px-4 py-2 text-[12.5px] transition-all duration-300 ease-cinema ${
                  checked
                    ? "border-champagne-200/55 bg-champagne-200/[0.08] text-bone shadow-[0_8px_30px_-12px_rgba(217,190,130,0.45)]"
                    : "border-ink/[0.10] bg-ink/[0.02] text-bone/70 hover:border-champagne-200/30 hover:text-bone"
                }`}
              >
                <input
                  type="radio"
                  className="sr-only"
                  name={name}
                  value={opt.value}
                  checked={checked}
                  onChange={() => onChange(opt.value)}
                />
                <span
                  aria-hidden
                  className={`inline-block h-3.5 w-3.5 shrink-0 rounded-full border ${
                    checked ? "border-champagne-200 bg-champagne-200" : "border-ink/25"
                  }`}
                />
                <span>{opt.label}</span>
              </label>
            );
          })}
        </div>
      </fieldset>
    </div>
  );
}

function EmptyPanel({ filled }: { filled: number }) {
  return (
    <div className="rounded-2xl border border-dashed border-ink/[0.10] bg-ink/[0.01] p-7">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-bone/45">
        Your recommendation
      </div>
      <p className="mt-3 text-[16px] font-light leading-snug text-bone/75">
        Answer the three questions to see whether you most likely need a bookkeeper first, the
        Monthly Finance Desk, a fractional CFO, or the free templates.
      </p>
      <div className="mt-6 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-champagne-100 to-champagne-300 transition-all duration-500 ease-cinema"
          style={{ width: `${(filled / 3) * 100}%` }}
        />
      </div>
      <p className="mt-3 text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
        {filled} of 3 answered
      </p>
    </div>
  );
}

function RecommendationPanel({
  rec,
}: {
  rec: import("../content").Recommendation;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-champagne-200/40 bg-charcoal-900/70 p-7 shadow-[0_40px_100px_-40px_rgba(217,190,130,0.4)] motion-safe:animate-section-in">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent"
      />
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/85">
        {rec.eyebrow}
      </div>
      <h3 className="mt-2 max-w-[26ch] font-light text-bone text-[24px] leading-[1.15] tracking-[-0.01em]">
        {rec.title}
      </h3>
      <p className="mt-4 max-w-[60ch] text-[14px] leading-relaxed text-bone/75">{rec.body}</p>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <a
          href={rec.primaryCTA.href}
          onClick={() => trackCtaByHref(rec.primaryCTA.href, "fit-finder")}
          className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-charcoal-950 transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)]"
        >
          {rec.primaryCTA.label}
        </a>
        <a
          href={rec.secondaryCTA.href}
          onClick={() => trackCtaByHref(rec.secondaryCTA.href, "fit-finder-secondary")}
          className="text-[12.5px] text-bone/70 underline-offset-4 hover:text-bone hover:underline"
        >
          {rec.secondaryCTA.label}
        </a>
      </div>
    </div>
  );
}
