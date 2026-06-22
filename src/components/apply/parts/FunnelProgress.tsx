import { APPLY } from "../content";

export default function FunnelProgress({ step }: { step: number }) {
  // step: 0 = landing, 1-5 = steps
  return (
    <nav aria-label="Application progress" className="w-full">
      <ol className="relative flex items-center justify-between gap-2">
        <div className="absolute left-3 right-3 top-[11px] h-px bg-ink/[0.06]" />
        <div
          className="absolute left-3 top-[11px] h-px bg-gradient-to-r from-champagne-200/80 to-champagne-200/30 transition-all duration-700 ease-cinema"
          style={{ width: `calc((100% - 24px) * ${Math.max(0, step - 1) / 4})` }}
        />
        {APPLY.steps.map((label, i) => {
          const n = i + 1;
          const isDone = step > n;
          const isActive = step === n;
          return (
            <li key={label} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border transition-all duration-500 ${
                  isActive
                    ? "border-champagne-200 bg-champagne-200 text-navy shadow-[0_0_0_4px_rgba(217,190,130,0.12)]"
                    : isDone
                    ? "border-champagne-200/60 bg-champagne-200/80 text-navy"
                    : "border-ink/15 bg-charcoal-900 text-ink/40"
                }`}
              >
                <span className="text-[10px] font-medium tabular-nums">0{n}</span>
              </span>
              <span
                className={`hidden text-[10.5px] uppercase tracking-[0.22em] transition-colors duration-500 md:block ${
                  isActive ? "text-champagne-300/70" : isDone ? "text-ink/55" : "text-ink/30"
                }`}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
