import { useInView } from "../../how-it-works/hooks/useInView";
import { faqCategories } from "../content";
import { useFAQState } from "../hooks/useFAQState";

export default function FAQHub() {
  const { query, setQuery, category, selectCategory, openId, toggle, filtered } =
    useFAQState();
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      id="faq"
      aria-labelledby="faq-hub-heading"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div ref={ref} className="mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24">
        <div
          className={`max-w-3xl transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            FAQ
          </div>
          <h2
            id="faq-hub-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[40px]"
          >
            Every question, organized.
          </h2>
        </div>

        {/* Search */}
        <div className="mt-10">
          <label htmlFor="faq-search" className="sr-only">
            Search the FAQ
          </label>
          <div className="relative">
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search security, pricing, application, or process questions…"
              className="h-12 w-full rounded-full border border-ink/[0.08] bg-ink/[0.02] pl-12 pr-5 text-[13.5px] text-ink placeholder:text-ink/35 focus:border-champagne-200/40 focus:outline-none focus:ring-2 focus:ring-champagne-200/20"
            />
            <svg
              aria-hidden
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink/45"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
          </div>
        </div>

        <div
          className={`mt-8 grid gap-8 lg:grid-cols-[220px_1fr] transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {/* Category nav */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="hidden text-[10.5px] uppercase tracking-[0.28em] text-ink/40 lg:block">
              Categories
            </div>
            <nav
              aria-label="FAQ categories"
              className="-mx-6 mt-3 flex gap-2 overflow-x-auto px-6 pb-2 lg:mx-0 lg:flex-col lg:gap-1 lg:overflow-visible lg:px-0 lg:pb-0"
            >
              <CategoryChip
                active={category === "all"}
                onClick={() => selectCategory("all")}
                label="All"
              />
              {faqCategories.map((c) => (
                <CategoryChip
                  key={c.id}
                  active={category === c.id}
                  onClick={() => selectCategory(c.id)}
                  label={c.label}
                />
              ))}
            </nav>
          </aside>

          {/* Accordions */}
          <div>
            {filtered.length === 0 ? (
              <p className="rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 text-[13.5px] text-ink/55">
                No questions match that search. Try a different word, or pick a category.
              </p>
            ) : (
              <div className="divide-y divide-ink/[0.06] rounded-2xl border border-ink/[0.07] bg-ink/[0.02]">
                {filtered.map((f) => {
                  const open = openId === f.id;
                  return (
                    <div key={f.id} id={f.id} className="px-5 py-4">
                      <button
                        type="button"
                        onClick={() => toggle(f.id, f.q)}
                        aria-expanded={open}
                        aria-controls={`${f.id}-panel`}
                        className="flex w-full cursor-pointer items-start justify-between gap-4 text-left text-[14.5px] text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/40"
                      >
                        <span>{f.q}</span>
                        <span
                          aria-hidden
                          className={`mt-1 inline-block h-4 w-4 shrink-0 text-ink/55 transition-transform duration-300 ${
                            open ? "rotate-45" : ""
                          }`}
                        >
                          +
                        </span>
                      </button>
                      {open && (
                        <div
                          id={`${f.id}-panel`}
                          role="region"
                          aria-labelledby={f.id}
                          className="mt-3 max-w-[68ch] text-[13.5px] leading-relaxed text-ink/70"
                        >
                          {f.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            <p className="mt-6 text-[11.5px] leading-relaxed text-ink/40">
              GoldFin Desk does not replace tax, legal, accounting, bookkeeping
              cleanup, CFO services, or investment advice.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`shrink-0 rounded-full border px-3 py-1.5 text-[12.5px] transition-colors lg:w-full lg:rounded-lg lg:text-left lg:px-3 ${
        active
          ? "border-champagne-200/40 bg-champagne-200/[0.08] text-ink"
          : "border-ink/[0.08] bg-transparent text-ink/55 hover:border-ink/[0.18] hover:text-ink"
      }`}
    >
      {label}
    </button>
  );
}
