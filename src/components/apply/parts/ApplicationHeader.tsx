import { APPLY } from "../content";
import { navigate } from "../hooks/useHashRoute";

export default function ApplicationHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/[0.06] bg-charcoal-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 md:px-8">
        <button
          onClick={() => navigate("")}
          className="text-[13px] font-medium tracking-tight text-ink hover:text-champagne-300 transition-colors"
        >
          {APPLY.header.brand}
        </button>
        <span className="hidden text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60 md:block">
          {APPLY.header.label}
        </span>
        <a
          href="#top"
          onClick={() => setTimeout(() => navigate("#top"), 0)}
          className="text-[12px] text-ink/55 hover:text-champagne-300 transition-colors"
        >
          <span className="hidden sm:inline">{APPLY.header.secondary}</span>
          <span className="sm:hidden">Sample briefing →</span>
        </a>
      </div>
    </header>
  );
}
