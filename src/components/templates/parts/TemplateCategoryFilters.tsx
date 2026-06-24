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
    <div className="sticky top-14 z-30 border-b border-ink/[0.06] bg-charcoal-950/85 backdrop-blur-md">
      {/* Sticks BELOW the fixed GlobalTopBar (z-40, ~56px tall), never overlapping
          it — a category sub-filter under the nav, not a second nav bar. */}
      <div className="mx-auto max-w-7xl px-6 py-3 lg:px-10">
        <div
          ref={listRef}
          role="radiogroup"
          aria-label="Template categories"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
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
                className={`min-h-[36px] shrink-0 rounded-full border px-4 py-1.5 text-[12.5px] transition-all duration-300 ease-cinema active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-1 focus-visible:ring-offset-ink ${
                  isActive
                    ? "border-champagne-200/60 bg-champagne-200/[0.08] text-ink shadow-[0_0_24px_-10px_rgba(217,190,130,0.6)]"
                    : "border-ink/[0.08] bg-ink/[0.02] text-ink/65 hover:border-ink/20 hover:text-ink"
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
