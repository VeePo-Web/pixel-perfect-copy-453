import { pageIndex } from "../content";
import { track } from "../analytics";

export default function ComparisonPageIndex() {
  return (
    <section
      aria-labelledby="index-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Detailed comparisons
          </div>
          <h2
            id="index-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Explore detailed comparisons.
          </h2>
        </div>
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {pageIndex.map((p) => (
            <li key={p.id}>
              <a
                href={p.href}
                onClick={() => track("comparison_page_link_clicked", { id: p.id })}
                className="group flex h-full flex-col rounded-xl border border-ink/[0.06] bg-ink/[0.015] p-4 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:border-champagne-300/40 hover:bg-ink/[0.04] hover:shadow-[0_14px_34px_-20px_rgba(11,13,18,0.3)]"
              >
                <div className="text-[10.5px] uppercase tracking-[0.24em] text-ink/40">
                  Compare
                </div>
                <div className="mt-1.5 text-[14px] font-light leading-snug text-ink">
                  {p.title}
                </div>
                <p className="mt-2 text-[12px] leading-relaxed text-ink/55">{p.who}</p>
                <p className="mt-2 text-[12px] leading-relaxed text-ink/45">
                  <span className="text-ink/35">Difference · </span>
                  {p.diff}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[11.5px] text-ink/65 transition-colors group-hover:text-champagne-200">
                  Open <span aria-hidden>→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
