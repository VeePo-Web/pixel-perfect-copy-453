type Props = { onAnother: () => void };

export default function SampleBriefingCTA({ onAnother }: Props) {
  return (
    <section className="relative overflow-hidden border-b border-white/[0.05] bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_50%_100%,rgba(201,163,90,0.10),transparent_60%)]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center lg:px-10">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          Apply for the Monthly Finance Desk
        </div>
        <h2 className="mx-auto mt-5 max-w-[22ch] font-light text-bone text-[40px] leading-[1.05] tracking-[-0.01em] sm:text-[56px]">
          Want this kind of briefing for your actual business?
        </h2>
        <p className="mx-auto mt-5 max-w-[60ch] text-[15.5px] leading-[1.7] text-bone/70">
          Apply for the Monthly Finance Desk and build a recurring finance rhythm around structured spreadsheets, bi-weekly plain-English briefings, and a monthly strategy review.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/apply"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Apply for the Monthly Finance Desk</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <button
            type="button"
            onClick={onAnother}
            className="rounded-full border border-white/[0.12] px-6 py-3.5 text-[13.5px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
          >
            Generate Another Sample Briefing
          </button>
          <a
            href="#templates"
            className="text-[12.5px] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            Start With Free Templates
          </a>
        </div>
        <p className="mt-5 text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
          Application takes a few minutes. No bank connection required to apply.
        </p>
      </div>
    </section>
  );
}
