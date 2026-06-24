import SpreadsheetPreview from "./SpreadsheetPreview";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { templates } from "../content";
import { track } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

const featured = templates.find((t) => t.id === "cash-flow-forecast")!;

const notes = [
  { tag: "What changed?", body: "Software spend climbed by $640 vs last month â€” driven by two new tools added in the last 30 days." },
  { tag: "What looks risky?", body: "Payroll plus contractor costs now consume 55% of expected revenue. A 10% revenue dip would compress the reserve buffer." },
  { tag: "What decision does this affect?", body: "Hiring conversation likely worth phasing. Subscription audit recommended before next month." },
];

type Props = {
  onGet: () => void;
};

export default function FeaturedTemplatePreview({ onGet }: Props) {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });
  return (
    <section
      aria-labelledby="featured-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300">
            See it filled in
          </div>
          <h2
            id="featured-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Built to help owners make decisions, not just fill cells.
          </h2>
          <p className="mt-4 max-w-[58ch] text-[14.5px] leading-relaxed text-ink/65">
            A look at the {featured.name} â€” including the plain-English side notes that turn
            data into a decision. This is exactly what GoldFin Reports fills in and sends you
            every month.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SpreadsheetPreview rows={featured.previewRows} title="Cash Flow Forecast â€” next 30 days" />
          <div className="space-y-4">
            {notes.map((n, i) => (
              <div
                key={n.tag}
                style={{ transitionDelay: `${i * 90}ms` }}
                className={`group relative overflow-hidden rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-4 transition-all duration-700 ease-cinema hover:border-champagne-200/25 ${
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                />
                <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                  {n.tag}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">{n.body}</p>
              </div>
            ))}

            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onGet}
                className="min-h-[44px] rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Get this template free
              </button>
              <a
                href="#/sample-briefing"
                onClick={() => track("sample_briefing_clicked_from_templates", { source: "featured" })}
                className="inline-flex min-h-[44px] items-center rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/40 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                See a full sample briefing
              </a>
            </div>

            {/* $99 bridge â€” this filled example IS the monthly product */}
            <p className="mt-1 text-[13px] leading-[1.6] text-ink/60">
              Don't want to fill it in yourself every month?{" "}
              <button
                type="button"
                onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_templates", { source: "featured" }); }}
                className="text-champagne-300 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                GoldFin Reports does it for you â€” $99/mo â†’
              </button>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
