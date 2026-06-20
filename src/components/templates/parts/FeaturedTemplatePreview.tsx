import SpreadsheetPreview from "./SpreadsheetPreview";
import { templates } from "../content";
import { track } from "../analytics";

const featured = templates.find((t) => t.id === "cash-flow-forecast")!;

const notes = [
  { tag: "What changed?", body: "Software spend climbed by $640 vs last month — driven by two new tools added in the last 30 days." },
  { tag: "What looks risky?", body: "Payroll plus contractor costs now consume 55% of expected revenue. A 10% revenue dip would compress reserve buffer." },
  { tag: "What decision does this affect?", body: "Hiring conversation likely worth phasing. Subscription audit recommended before next month." },
];

type Props = {
  onGet: () => void;
};

export default function FeaturedTemplatePreview({ onGet }: Props) {
  return (
    <section
      aria-labelledby="featured-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Featured template
          </div>
          <h2
            id="featured-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Built to help owners make decisions, not just fill cells.
          </h2>
          <p className="mt-4 text-[14.5px] leading-relaxed text-ink/65">
            A look at the {featured.name} — including the plain-English side notes that turn data into a decision.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-8 lg:grid-cols-[1.1fr_1fr]">
          <SpreadsheetPreview rows={featured.previewRows} title="Cash Flow Forecast — next 30 days" />
          <div className="space-y-4">
            {notes.map((n) => (
              <div
                key={n.tag}
                className="rounded-xl border border-ink/[0.07] bg-ink/[0.02] p-4"
              >
                <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-200/80">
                  {n.tag}
                </div>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink/80">{n.body}</p>
              </div>
            ))}
            <div className="mt-2 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={onGet}
                className="rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-5 py-2.5 text-[12.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)]"
              >
                Get the Cash Flow Forecast Template
              </button>
              <a
                href="#/sample-briefing"
                onClick={() => track("sample_briefing_clicked_from_templates", { source: "featured" })}
                className="rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-ink/85 transition-colors hover:border-champagne-200/40 hover:text-ink"
              >
                See How This Becomes a GoldFin Desk Briefing
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
