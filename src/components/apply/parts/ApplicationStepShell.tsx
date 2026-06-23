import React from "react";

type Props = {
  step: number;
  total?: number;
  eyebrow?: string;
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
      <div className="mb-6 text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
        {eyebrow ?? `Application Â· 0${step} / 0${total}`}
      </div>
      <h1 className="font-robert-medium text-[clamp(1.8rem,3.6vw,2.8rem)] leading-[1.05] tracking-tight text-ink">
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
              className="text-[13px] text-ink/55 transition-colors hover:text-ink"
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
              className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema enabled:hover:-translate-y-0.5 enabled:hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              <span className="relative z-10">{continueLabel}</span>
              <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile sticky continue */}
      {onContinue && (
        <div
          className="fixed inset-x-0 bottom-0 z-30 border-t border-ink/[0.06] bg-charcoal-950/90 px-4 pb-4 pt-3 backdrop-blur-md md:hidden"
          style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
        >
          <div className="flex items-center gap-3">
            {onBack && (
              <button
                type="button"
                onClick={onBack}
                className="rounded-full border border-ink/15 px-4 py-3 text-[13px] text-ink/75 transition-all duration-300 ease-cinema hover:border-ink/30 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
              >
                Back
              </button>
            )}
            <button
              type="button"
              onClick={onContinue}
              disabled={continueDisabled}
              className="flex-1 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema active:scale-[0.97] disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
            >
              {continueLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
