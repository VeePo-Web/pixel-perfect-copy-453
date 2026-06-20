import { trustCards } from "../content";

export default function TemplateTrustSection() {
  return (
    <section
      aria-labelledby="trust-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Built around real owner questions
          </div>
          <h2
            id="trust-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Built for owners who want decisions, not just data.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {trustCards.map((c) => (
            <div
              key={c.title}
              className="rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-5 transition-colors hover:border-champagne-200/25"
            >
              <div className="h-px w-8 bg-champagne-200/60" />
              <div className="mt-4 text-[15px] font-light leading-snug text-ink">{c.title}</div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-ink/60">{c.copy}</p>
            </div>
          ))}
        </div>
        <ul className="mt-10 grid gap-2 text-[12.5px] text-ink/55 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Built for serious owner-led businesses",
            "Designed around real owner questions",
            "No bank connection required to start",
            "Plain-English financial review logic",
            "Entry point into the Monthly Finance Desk",
          ].map((x) => (
            <li key={x} className="flex items-center gap-2">
              <span className="h-1 w-1 rounded-full bg-champagne-200/70" />
              {x}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
