import { track } from "../analytics";

export default function ComparisonFinalCTA() {
  return (
    <section
      aria-labelledby="final-cta-heading"
      className="relative bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_100%,rgba(201,163,90,0.12),transparent_60%)]" />
      </div>
      <div className="relative mx-auto max-w-5xl px-6 py-24 text-center lg:px-10 lg:py-32">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          Still comparing?
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 mx-auto max-w-[22ch] font-light text-bone text-[36px] leading-[1.08] tracking-[-0.01em] sm:text-[52px]"
        >
          Start with the missing layer.
        </h2>
        <p className="mx-auto mt-5 max-w-[64ch] text-[15px] leading-relaxed text-bone/65">
          If your books exist, your tools are active, and your business still feels financially unclear, the Monthly Finance Desk may be the monthly rhythm your business has been missing.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/apply"
            onClick={() => track("apply_clicked_from_compare", { source: "final" })}
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Apply for the Monthly Finance Desk</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_compare", { source: "final" })}
            className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#/templates"
            onClick={() => track("templates_clicked_from_compare", { source: "final" })}
            className="text-[12.5px] text-bone/55 underline-offset-4 hover:text-bone hover:underline"
          >
            Start With Free Templates
          </a>
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
          No payment or bank connection required to apply.
        </p>
      </div>
    </section>
  );
}
