import { useRef } from "react";
import { categories } from "../content";
import { track } from "../analytics";

type Props = {
  active: (typeof categories)[number];
  onChange: (c: (typeof categories)[number]) => void;
};

export default function TemplateCategoryFilters({ active, onChange }: Props) {
  const listRef = useRef<HTMLDivElement | null>(null);

  const handleKey = (e: React.KeyboardEvent, idx: number) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const next = e.key === "ArrowRight" ? idx + 1 : idx - 1;
    const wrapped = (next + categories.length) % categories.length;
    onChange(categories[wrapped]);
    const btn = listRef.current?.querySelectorAll<HTMLButtonElement>("[data-chip]")[wrapped];
    btn?.focus();
  };

  return (
    // Sticks BELOW the fixed GlobalTopBar (~64px tall). Deliberately NOT a
    // full-bleed bordered bar — that read as a second nav. Instead it is a
    // frosted, content-width filter toolbar that floats over the grid: a soft
    // translucent panel + a "Filter" label, no full-width hairline.
    <div className="sticky top-16 z-30 px-4 pt-3 lg:px-8">
      <div className="mx-auto flex max-w-7xl items-center gap-3 rounded-full border border-ink/[0.06] bg-paper/70 px-3 py-2 shadow-[0_10px_30px_-18px_rgba(11,13,18,0.35)] backdrop-blur-md sm:px-4">

        {/* Filter affordance — makes it unmistakably a control, not navigation */}
        <span
          aria-hidden
          className="hidden shrink-0 items-center gap-1.5 pl-1 font-general text-[10px] uppercase tracking-[0.2em] text-ink/35 sm:flex"
        >
          <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round">
            <path d="M2 4h12M4.5 8h7M6.5 12h3" />
          </svg>
          Filter
        </span>

        <span aria-hidden className="hidden h-4 w-px shrink-0 rounded-full bg-ink/[0.10] sm:block" />

        <div
          ref={listRef}
          role="radiogroup"
          aria-label="Filter templates by category"
          className="flex gap-2 no-scrollbar overflow-x-auto overscroll-x-contain pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {categories.map((c, i) => {
            const isActive = c === active;
            return (
              <button
                key={c}
                data-chip
                role="radio"
                aria-checked={isActive}
                tabIndex={isActive ? 0 : -1}
                onKeyDown={(e) => handleKey(e, i)}
                onClick={() => {
                  onChange(c);
                  track("template_filter_clicked", { category: c });
                }}
                className={`min-h-[34px] shrink-0 rounded-full border px-4 py-1.5 text-[12.5px] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-1 focus-visible:ring-offset-paper ${
                  isActive
                    ? "border-champagne-300/70 bg-champagne-50/60 font-medium text-ink"
                    : "border-ink/[0.12] bg-white text-ink/65 hover:border-ink/[0.25] hover:text-ink"
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
