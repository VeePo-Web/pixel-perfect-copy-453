import { comparisonRows } from "../content";

const COLS: { key: keyof typeof comparisonRows[number]; label: string }[] = [
  { key: "role", label: "Typical role" },
  { key: "helps", label: "What it helps with" },
  { key: "misses", label: "What it usually misses" },
  { key: "investment", label: "Relative investment" },
  { key: "bestFit", label: "Best fit" },
];

export default function CostComparisonTable() {
  return (
    <section aria-labelledby="compare-title" className="border-b border-ink/[0.06] bg-white">
      <div className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="max-w-[58ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            Compare the alternatives
          </div>
          <h2 id="compare-title" className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[44px]">
            Compare the real alternatives.
          </h2>
          <p className="mt-6 text-[15px] leading-[1.7] text-ink/70">
            Pricing is a category question, not a feature question. Anchor against the right options.
          </p>
        </div>

        {/* Desktop table */}
        <div className="mt-12 hidden overflow-hidden rounded-2xl border border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)] md:block">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-ink/[0.08]">
                <th scope="col" className="w-[20%] px-5 py-4 font-general text-[10.5px] font-normal uppercase tracking-[0.22em] text-ink/45">
                  Alternative
                </th>
                {COLS.map((c) => (
                  <th key={c.key} scope="col" className="px-5 py-4 font-general text-[10.5px] font-normal uppercase tracking-[0.22em] text-ink/45">
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/[0.06]">
              {comparisonRows.map((r) => (
                <tr
                  key={r.alternative}
                  className={`align-top transition-colors ${
                    r.flagship
                      ? "bg-champagne-50/40"
                      : "hover:bg-ink/[0.015]"
                  }`}
                >
                  <th
                    scope="row"
                    className={`relative px-5 py-5 text-[13.5px] ${
                      r.flagship ? "font-medium text-ink" : "font-normal text-ink/85"
                    }`}
                  >
                    {r.flagship && (
                      <span aria-hidden className="absolute inset-y-3 left-0 w-[2px] rounded bg-champagne-200" />
                    )}
                    <span className="block">{r.alternative}</span>
                    {r.flagship && (
                      <span className="mt-1 block font-general text-[10px] font-normal uppercase tracking-[0.22em] text-champagne-300/80">
                        Our offer
                      </span>
                    )}
                  </th>
                  {COLS.map((c) => (
                    <td
                      key={c.key}
                      className={`px-5 py-5 leading-[1.55] ${
                        c.key === "investment"
                          ? `font-general text-[12.5px] tabular-nums ${r.flagship ? "text-ink/90" : "text-ink/60"}`
                          : `text-[13.5px] ${r.flagship ? "text-ink/90" : "text-ink/70"}`
                      }`}
                    >
                      {r[c.key] as string}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile expandable cards */}
        <div className="mt-12 space-y-3 md:hidden">
          {comparisonRows.map((r, i) => (
            <details
              key={r.alternative}
              open={r.flagship || i === 0}
              className={`group rounded-2xl border p-5 transition-colors ${
                r.flagship
                  ? "border-champagne-200/50 bg-champagne-50/40"
                  : "border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
              }`}
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                <div>
                  <div className="text-[14px] text-ink">{r.alternative}</div>
                  {r.flagship && (
                    <div className="mt-1 font-general text-[10px] uppercase tracking-[0.22em] text-champagne-300/80">
                      Our offer
                    </div>
                  )}
                </div>
                <span aria-hidden className="text-ink/40 transition-transform group-open:rotate-45">+</span>
              </summary>
              <dl className="mt-4 space-y-3">
                {COLS.map((c) => (
                  <div key={c.key}>
                    <dt className="font-general text-[10px] uppercase tracking-[0.22em] text-ink/45">{c.label}</dt>
                    <dd className={`mt-1 leading-[1.6] ${c.key === "investment" ? "font-general text-[13px] tabular-nums text-ink/85" : "text-[14px] text-ink/85"}`}>{r[c.key] as string}</dd>
                  </div>
                ))}
              </dl>
            </details>
          ))}
        </div>
        <p className="mt-6 text-[11.5px] text-ink/45">
          GoldFin Desk does not replace tax, legal, accounting, or investment advice.
        </p>
      </div>
    </section>
  );
}
