export default function PricingFinalCTA() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_65%_at_50%_100%,rgba(201,163,90,0.14),transparent_65%)]" />
        <div className="absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-28 text-center lg:px-10">
        {/* layered cards behind headline */}
        <div aria-hidden className="mx-auto mb-10 flex h-[120px] w-full max-w-md items-end justify-center">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className={`mx-[-12px] h-[110px] w-[120px] rounded-xl border bg-charcoal-900/70 backdrop-blur-sm motion-safe:animate-panel-rise ${
                i === 1
                  ? "z-20 border-champagne-200/40 shadow-[0_30px_80px_-30px_rgba(217,190,130,0.45)]"
                  : "z-10 border-white/[0.08] opacity-80"
              }`}
              style={{
                animationDelay: `${i * 90}ms`,
                transform: i === 0 ? "rotate(-6deg)" : i === 2 ? "rotate(6deg)" : "",
              }}
            >
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />
              <div className="p-3">
                <div className="h-1.5 w-2/3 rounded bg-white/15" />
                <div className="mt-2 h-1 w-1/2 rounded bg-white/[0.08]" />
                <div className="mt-4 h-3 w-1/3 rounded bg-white/15" />
                <div className="mt-3 space-y-1.5">
                  <div className="h-1 w-full rounded bg-white/[0.06]" />
                  <div className="h-1 w-3/4 rounded bg-white/[0.06]" />
                  <div className="h-1 w-2/3 rounded bg-white/[0.06]" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          Apply for the Monthly Finance Desk
        </div>
        <h2 id="final-title" className="mx-auto mt-5 max-w-[24ch] font-light text-bone text-[42px] leading-[1.05] tracking-[-0.01em] sm:text-[60px]">
          Ready to stop guessing from your bank balance?
        </h2>
        <p className="mx-auto mt-5 max-w-[62ch] text-[15.5px] leading-[1.7] text-bone/70">
          Apply for the Monthly Finance Desk and build a recurring financial rhythm around your business: structured spreadsheets, bi-weekly plain-English briefings, and a monthly strategy review.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/apply"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Apply for the Monthly Finance Desk</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#/sample-briefing"
            className="rounded-full border border-white/[0.12] px-6 py-3.5 text-[13.5px] text-bone/85 transition-all duration-300 hover:border-champagne-200/40 hover:text-bone"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#templates"
            className="text-[12.5px] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            Start With Free Templates
          </a>
        </div>
        <p className="mt-5 text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
          Application takes a few minutes. No payment or bank connection required to apply.
        </p>
      </div>
    </section>
  );
}
