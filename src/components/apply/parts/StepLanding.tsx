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
      <div className="mb-3 font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">{c.eyebrow}</div>
      <p className="mb-5 font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">{c.selectiveNote}</p>
      <h1 className="font-display font-medium text-[clamp(2.25rem,5vw,4rem)] leading-[1.05] tracking-[-0.02em] text-ink [text-wrap:balance]">
        {c.headline}
      </h1>
      <p className="mt-6 max-w-xl text-[15px] leading-[1.7] text-ink/65">{c.sub}</p>

      {showWelcomeBack && (
        <div className="mt-6 inline-flex items-center gap-3 rounded-full border border-champagne-300/30 bg-champagne-50/50 px-4 py-2 text-[12.5px] text-ink/80">
          <span className="h-1.5 w-1.5 rounded-full bg-champagne-200" />
          {c.welcomeBack}
          <button onClick={onResume} className="ml-2 text-champagne-300 underline-offset-4 hover:underline">
            Resume →
          </button>
        </div>
      )}

      <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
        <button
          type="button"
          onClick={onStart}
          className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          {c.primary}
        </button>
        <button
          type="button"
          onClick={() => navigate("/sample-briefing")}
          className="group inline-flex items-center text-[13px] text-ink/70 hover:text-ink transition-colors duration-300 ease-cinema"
        >
          <span className="border-b border-ink/[0.15] pb-0.5 transition-colors duration-300 group-hover:border-ink/40">{c.secondary}</span>
          <span className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5">→</span>
        </button>
        <a href="/templates" className="text-[13px] text-ink/55 hover:text-ink underline-offset-4 hover:underline transition-colors">
          {c.tertiary}
        </a>
      </div>
      <p className="mt-6 font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">{c.micro}</p>
    </div>
  );
}
