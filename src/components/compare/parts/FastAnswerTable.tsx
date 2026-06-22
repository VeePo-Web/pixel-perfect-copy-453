import { useInView } from "../../how-it-works/hooks/useInView";
import { options } from "../content";

export default function FastAnswerTable() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="fast-answer"
      aria-labelledby="fast-answer-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div
          className={`max-w-[62ch] transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Fast answer
          </div>
          <h2
            id="fast-answer-heading"
            className="mt-3 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.01em] sm:text-[40px]"
          >
            Choose based on the job you need done.
          </h2>
        </div>

        {/* Desktop table */}
        <div
          className={`mt-10 hidden overflow-hidden rounded-2xl border border-ink/[0.07] bg-ink/[0.02] lg:block transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <table className="w-full border-collapse text-left text-[13px]">
            <caption className="sr-only">Comparison of financial support options.</caption>
            <thead>
              <tr className="border-b border-ink/[0.07] text-[10.5px] uppercase tracking-[0.24em] text-ink/45">
                <th scope="col" className="px-5 py-4 font-normal">Option</th>
                <th scope="col" className="px-5 py-4 font-normal">Best when you need</th>
                <th scope="col" className="px-5 py-4 font-normal">Usually misses</th>
                <th scope="col" className="px-5 py-4 font-normal">Choose this if</th>
              </tr>
            </thead>
            <tbody>
              {options.map((o) => (
                <tr
                  key={o.id}
                  id={o.anchorId}
                  className={`scroll-mt-24 border-b border-ink/[0.05] align-top last:border-b-0 ${
                    o.isMfd ? "bg-champagne-200/[0.04]" : ""
                  }`}
                >
                  <th scope="row" className="px-5 py-5 font-normal text-ink">
                    <div className="flex items-center gap-2">
                      {o.isMfd ? (
                        <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-champagne-200" />
                      ) : null}
                      <span className={o.isMfd ? "text-ink" : "text-ink/85"}>{o.label}</span>
                    </div>
                  </th>
                  <td className="px-5 py-5 text-ink/70">{o.bestWhen}</td>
                  <td className="px-5 py-5 text-ink/55">{o.usuallyMisses}</td>
                  <td className="px-5 py-5 text-ink/70">{o.chooseIf}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <ol
          className={`mt-8 grid gap-3 lg:hidden transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {options.map((o) => (
            <li
              key={o.id}
              id={`m-${o.anchorId}`}
              className={`rounded-2xl border ${
                o.isMfd
                  ? "border-champagne-200/45 bg-charcoal-900/70"
                  : "border-ink/[0.07] bg-ink/[0.02]"
              }`}
            >
              <details className="group [&_summary::-webkit-details-marker]:hidden" open={o.isMfd}>
                <summary className="flex cursor-pointer items-center justify-between gap-3 px-5 py-4">
                  <span className="text-[14.5px] text-ink">{o.label}</span>
                  <span
                    aria-hidden
                    className="text-[18px] leading-none text-ink/50 transition-transform duration-300 group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="grid gap-3 border-t border-ink/[0.06] px-5 py-4 text-[13px]">
                  <Row label="Best when" value={o.bestWhen} />
                  <Row label="Usually misses" value={o.usuallyMisses} tone="muted" />
                  <Row label="Choose this if" value={o.chooseIf} />
                </div>
              </details>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function Row({ label, value, tone }: { label: string; value: string; tone?: "muted" }) {
  return (
    <div>
      <div className="text-[10.5px] uppercase tracking-[0.24em] text-ink/40">{label}</div>
      <p className={`mt-1 leading-relaxed ${tone === "muted" ? "text-ink/55" : "text-ink/75"}`}>
        {value}
      </p>
    </div>
  );
}
