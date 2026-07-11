import React from "react";

type Props = {
  step: number;
  total?: number;
  eyebrow?: string;
  note?: string;
  headline: string;
  sub?: string;
  children: React.ReactNode;
  onBack?: () => void;
  onContinue?: () => void;
  continueLabel?: string;
  continueDisabled?: boolean;
  footerSecondary?: React.ReactNode;
};

export default function ApplicationStepShell({
  step,
  total = 5,
  eyebrow,
  note,
  headline,
  sub,
  children,
  onBack,
  onContinue,
  continueLabel = "Continue",
  continueDisabled = false,
  footerSecondary,
}: Props) {
  return (
    <div className="motion-safe:animate-section-in">
      <div className="mb-3 font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">
        {eyebrow ?? `Application · 0${step} / 0${total}`}
      </div>
      {note && (
        <p className="mb-5 font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">{note}</p>
      )}
      <h1 className="font-display font-medium text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.1] tracking-[-0.02em] text-ink [text-wrap:balance]">
        {headline}
      </h1>
      {sub && <p className="mt-4 max-w-xl text-[14.5px] leading-[1.7] text-ink/65">{sub}</p>}
      <div className="mt-10 space-y-8">{children}</div>

      {/* Footer nav (desktop) */}
      <div className="mt-12 hidden items-center justify-between md:flex">
        <div>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="rounded-full border border-ink/[0.12] bg-white px-5 py-2.5 text-[13px] text-ink/70 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              â† Back
            </button>
          )}
        </div>
        <div className="flex items-center gap-4">
          {footerSecondary}
          {onContinue && (
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {continueLabel}
            </button>
          )}
        </div>
      </div>

      {/* Mobile sticky continue */}
      {onContinue && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/[0.06] bg-white/90 px-4 pb-4 pt-3 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-full border border-ink/[0.12] bg-white px-4 py-3 text-[13px] text-ink/70 transition-all duration-300 ease-cinema hover:border-ink/[0.25] hover:text-ink active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className="flex-1 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 py-3 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema active:scale-[0.98] disabled:opacity-50 disabled:hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
            >
              {continueLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
