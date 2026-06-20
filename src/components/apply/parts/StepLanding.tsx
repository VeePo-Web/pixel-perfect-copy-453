import { APPLY } from "../content";
import { navigate } from "../hooks/useHashRoute";

type Props = {
  onStart: () => void;
  showWelcomeBack: boolean;
  onResume: () => void;
};

export default function StepLanding({ onStart, showWelcomeBack, onResume }: Props) {
  const c = APPLY.landing;
  return (
    <div className="motion-safe:animate-section-in">
      <div className="mb-6 text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">{c.eyebrow}</div>
      <h1 className="font-zentry text-[clamp(2.25rem,5vw,4rem)] leading-[1.02] tracking-tight text-ink">
        {c.headline}
      </h1>
      <p className="mt-6 max-w-xl text-[15px] leading-[1.75] text-ink/65">{c.sub}</p>

      {showWelcomeBack && (
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-champagne-200/25 bg-champagne-200/[0.04] px-4 py-2 text-[12.5px] text-ink/80">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200" />
          {c.welcomeBack}
          <button onClick={onResume} className="ml-2 text-champagne-100 underline-offset-4 hover:underline">
            Resume →
          </button>
        </div>
      )}

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={onStart}
          className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
        >
          <span className="relative z-10">{c.primary}</span>
          <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
        </button>
        <button
          type="button"
          onClick={() => navigate("#top")}
          className="group inline-flex items-center text-[13px] text-ink/70 hover:text-champagne-100 transition-colors"
        >
          <span className="border-b border-bone/20 pb-0.5 group-hover:border-champagne-200/60">{c.secondary}</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </button>
        <a href="#/templates" className="text-[13px] text-ink/55 hover:text-champagne-100 underline-offset-4 hover:underline">
          {c.tertiary}
        </a>
      </div>
      <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-ink/35">{c.micro}</p>
    </div>
  );
}
