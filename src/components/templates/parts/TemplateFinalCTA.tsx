import { track } from "../analytics";

export default function TemplateFinalCTA() {
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
          Start free
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 mx-auto max-w-[20ch] font-light text-bone text-[36px] leading-[1.08] tracking-[-0.01em] sm:text-[52px]"
        >
          Start free. Upgrade when you want the rhythm.
        </h2>
        <p className="mx-auto mt-5 max-w-[60ch] text-[15px] leading-relaxed text-bone/65">
          Download the templates to begin organizing your financial view, or apply for the Monthly Finance Desk when you are ready for structure, automation, bi-weekly briefings, and a monthly strategy review.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#template-grid"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium text-charcoal-950 transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)]"
          >
            <span className="relative z-10">Get Free Templates</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#/apply"
            onClick={() => track("apply_clicked_from_templates", { source: "final" })}
            className="rounded-full border border-white/[0.12] px-6 py-3.5 text-[13px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
          >
            Apply for Monthly Finance Desk
          </a>
          <a
            href="#/sample-briefing"
            onClick={() => track("sample_briefing_clicked_from_templates", { source: "final" })}
            className="text-[12.5px] text-bone/55 underline-offset-4 hover:text-bone hover:underline"
          >
            Generate Sample Finance Briefing
          </a>
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-bone/40">
          No bank connection required to start.
        </p>
      </div>
    </section>
  );
}
