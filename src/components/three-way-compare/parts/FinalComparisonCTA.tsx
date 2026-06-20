import { track, trackCtaByHref } from "../analytics";

export default function FinalComparisonCTA() {
  return (
    <section
      id="apply"
      aria-labelledby="final-cta-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-5xl px-6 py-28 text-center lg:px-10">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          Apply
        </div>
        <h2
          id="final-cta-heading"
          className="mx-auto mt-4 max-w-[24ch] font-light text-ink text-[34px] leading-[1.08] tracking-[-0.01em] sm:text-[46px]"
        >
          If you already have numbers but still feel unclear, this is the layer you are missing.
        </h2>
        <p className="mx-auto mt-5 max-w-[64ch] text-[15px] leading-[1.7] text-ink/70">
          Apply for the GoldFin Desk and build a recurring financial rhythm around
          structured spreadsheets, bi-weekly plain-English briefings, and a monthly strategy
          review.
        </p>

        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/apply"
            onClick={() => {
              track("final_cta_clicked", { target: "apply" });
              trackCtaByHref("#/apply", "final-cta");
            }}
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Apply for the GoldFin Desk</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#/sample-briefing"
            onClick={() => {
              track("final_cta_clicked", { target: "sample-briefing" });
              trackCtaByHref("#/sample-briefing", "final-cta");
            }}
            className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#/templates"
            onClick={() => {
              track("final_cta_clicked", { target: "templates" });
              trackCtaByHref("#/templates", "final-cta");
            }}
            className="text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Start With Free Templates
          </a>
        </div>

        <p className="mt-7 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
          Application takes a few minutes. No payment or bank connection required to apply.
        </p>

        <p className="mx-auto mt-10 max-w-[64ch] text-[11.5px] leading-relaxed text-ink/40">
          GoldFin Desk does not replace tax, legal, accounting, bookkeeping cleanup, or
          investment advice.
        </p>
      </div>
    </section>
  );
}
