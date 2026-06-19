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
    <div className="sticky top-0 z-30 border-b border-white/[0.06] bg-charcoal-950/85 backdrop-blur-md">
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
                className={`min-h-[36px] shrink-0 rounded-full border px-4 py-1.5 text-[12.5px] transition-all duration-300 ease-cinema ${
                  isActive
                    ? "border-champagne-200/60 bg-champagne-200/[0.08] text-bone shadow-[0_0_24px_-10px_rgba(217,190,130,0.6)]"
                    : "border-white/[0.08] bg-white/[0.02] text-bone/65 hover:border-white/20 hover:text-bone"
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
