import { useState } from "react";
import { tableCTAs, tableRows } from "../content";
import { trackCtaByHref } from "../analytics";
import { useInView } from "../../how-it-works/hooks/useInView";

type ColumnId = "bookkeeper" | "mfd" | "cfo";

export default function ThreeWayComparisonTable() {
  const [hovered, setHovered] = useState<ColumnId | null>(null);
  const { ref, inView } = useInView<HTMLDivElement>();

  const colClass = (id: ColumnId, isMfd?: boolean) => {
    const isHover = hovered === id;
    return `transition-all duration-300 ease-cinema ${
      isHover
        ? "bg-champagne-200/[0.06]"
        : isMfd
        ? "bg-champagne-200/[0.04]"
        : ""
    }`;
  };

  return (
    <section
      id="compare"
      aria-labelledby="three-way-table-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="max-w-[62ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Side by side
          </div>
          <h2
            id="three-way-table-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Compare the three options.
          </h2>
        </div>

        {/* Desktop table */}
        <div className="mt-10 hidden overflow-hidden rounded-2xl border border-ink/[0.07] bg-ink/[0.02] lg:block">
          <table className="w-full border-collapse text-left text-[13px]">
            <caption className="sr-only">
              Comparison of Bookkeeper, GoldFin Desk, and Fractional CFO.
            </caption>
            <thead>
              <tr className="border-b border-ink/[0.07] text-[11px] uppercase tracking-[0.24em] text-ink/55">
                <th scope="col" className="w-[18%] px-5 py-5 font-normal" />
                <th
                  scope="col"
                  className={`px-5 py-5 font-normal ${colClass("bookkeeper")}`}
                  onMouseEnter={() => setHovered("bookkeeper")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="text-ink">Bookkeeper</div>
                  <div className="mt-1 text-[10px] tracking-[0.22em] text-ink/45">
                    Clean records
                  </div>
                </th>
                <th
                  scope="col"
                  className={`relative px-5 py-5 font-normal ${colClass("mfd", true)}`}
                  onMouseEnter={() => setHovered("mfd")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
                  />
                  <div className="flex items-center gap-2">
                    <span
                      aria-hidden
                      className="h-1.5 w-1.5 rounded-full bg-champagne-200"
                    />
                    <span className="text-ink">GoldFin Desk</span>
                  </div>
                  <div className="mt-1 text-[10px] tracking-[0.22em] text-champagne-300/70">
                    Recurring clarity
                  </div>
                </th>
                <th
                  scope="col"
                  className={`px-5 py-5 font-normal ${colClass("cfo")}`}
                  onMouseEnter={() => setHovered("cfo")}
                  onMouseLeave={() => setHovered(null)}
                >
                  <div className="text-ink">Fractional CFO</div>
                  <div className="mt-1 text-[10px] tracking-[0.22em] text-ink/45">
                    Strategic leadership
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {tableRows.map((r) => (
                <tr key={r.id} className="border-b border-ink/[0.05] align-top last:border-b-0">
                  <th
                    scope="row"
                    className="px-5 py-5 text-[10.5px] uppercase tracking-[0.24em] text-ink/45"
                  >
                    {r.label}
                  </th>
                  <td className={`px-5 py-5 text-ink/75 ${colClass("bookkeeper")}`}>
                    {r.bookkeeper}
                  </td>
                  <td className={`px-5 py-5 text-ink/85 ${colClass("mfd", true)}`}>{r.mfd}</td>
                  <td className={`px-5 py-5 text-ink/75 ${colClass("cfo")}`}>{r.cfo}</td>
                </tr>
              ))}
              <tr className="align-top">
                <th scope="row" className="px-5 py-6" />
                <td className={`px-5 py-6 ${colClass("bookkeeper")}`}>
                  <a
                    href={tableCTAs.bookkeeper.href}
                    onClick={() => trackCtaByHref(tableCTAs.bookkeeper.href, "table-bookkeeper")}
                    className="inline-flex rounded-full border border-ink/[0.12] px-4 py-2 text-[12px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
                  >
                    {tableCTAs.bookkeeper.label}
                  </a>
                </td>
                <td className={`px-5 py-6 ${colClass("mfd", true)}`}>
                  <a
                    href={tableCTAs.mfd.href}
                    onClick={() => trackCtaByHref(tableCTAs.mfd.href, "table-mfd")}
                    className="inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-4 py-2 text-[12px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-12px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2"
                  >
                    {tableCTAs.mfd.label}
                  </a>
                </td>
                <td className={`px-5 py-6 ${colClass("cfo")}`}>
                  <a
                    href={tableCTAs.cfo.href}
                    onClick={() => trackCtaByHref(tableCTAs.cfo.href, "table-cfo")}
                    className="inline-flex rounded-full border border-ink/[0.12] px-4 py-2 text-[12px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
                  >
                    {tableCTAs.cfo.label}
                  </a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="mt-8 grid gap-3 lg:hidden">
          {(["bookkeeper", "mfd", "cfo"] as const).map((id) => {
            const isMfd = id === "mfd";
            const label =
              id === "bookkeeper"
                ? "Bookkeeper"
                : id === "mfd"
                ? "GoldFin Desk"
                : "Fractional CFO";
            const role =
              id === "bookkeeper"
                ? "Clean records"
                : id === "mfd"
                ? "Recurring clarity"
                : "Strategic leadership";
            const cta = tableCTAs[id];
            return (
              <details
                key={id}
                open={isMfd}
                className={`group rounded-2xl border [&_summary::-webkit-details-marker]:hidden ${
                  isMfd
                    ? "border-champagne-200/45 bg-charcoal-900/70"
                    : "border-ink/[0.07] bg-ink/[0.02]"
                }`}
              >
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4">
                  <div>
                    <div className="text-[14.5px] text-ink">{label}</div>
                    <div
                      className={`mt-0.5 text-[10.5px] uppercase tracking-[0.22em] ${
                        isMfd ? "text-champagne-300/70" : "text-ink/45"
                      }`}
                    >
                      {role}
                    </div>
                  </div>
                  <span
                    aria-hidden
                    className="text-[18px] leading-none text-ink/55 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="grid gap-3 border-t border-ink/[0.06] px-5 py-4 text-[13px]">
                  {tableRows.map((r) => (
                    <div key={r.id}>
                      <div className="text-[10.5px] uppercase tracking-[0.24em] text-ink/40">
                        {r.label}
                      </div>
                      <p className="mt-1 leading-relaxed text-ink/80">
                        {id === "bookkeeper" ? r.bookkeeper : id === "mfd" ? r.mfd : r.cfo}
                      </p>
                    </div>
                  ))}
                  <a
                    href={cta.href}
                    onClick={() => trackCtaByHref(cta.href, `mobile-table-${id}`)}
                    className={`mt-2 inline-flex w-fit rounded-full px-4 py-2 text-[12px] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
                      isMfd
                        ? "bg-gradient-to-b from-champagne-100 to-champagne-300 font-medium text-navy hover:-translate-y-0.5 active:translate-y-0 focus-visible:ring-champagne-300/70"
                        : "border border-ink/[0.12] text-ink/85 hover:border-champagne-200/40 hover:text-ink focus-visible:ring-ink/25"
                    }`}
                  >
                    {cta.label}
                  </a>
                </div>
              </details>
            );
          })}
        </div>
      </div>
    </section>
  );
}
