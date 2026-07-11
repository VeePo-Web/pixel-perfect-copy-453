import { APPLY } from "../content";

export default function FunnelProgress({ step }: { step: number }) {
  // step: 0 = landing, 1-5 = steps
  return (
    <nav aria-label="Application progress" className="w-full">
      <ol className="relative flex items-center justify-between gap-2">
        <div className="absolute left-3 right-3 top-[9.5px] h-[3px] rounded-full bg-ink/[0.06]" />
        <div
          className="absolute left-3 top-[9.5px] h-[3px] rounded-full bg-gradient-to-r from-champagne-200 to-champagne-300 transition-[width] duration-500 ease-cinema"
          style={{ width: `calc((100% - 24px) * ${Math.max(0, step - 1) / 4})` }}
        />
        {APPLY.steps.map((label, i) => {
          const n = i + 1;
          const isDone = step > n;
          const isActive = step === n;
          return (
            <li key={label} className="relative z-10 flex flex-1 flex-col items-center gap-2">
              <span
                className={`flex h-[22px] w-[22px] items-center justify-center rounded-full border transition-all duration-500 ease-cinema ${
                  isActive
                    ? "border-champagne-300/80 bg-gradient-to-b from-champagne-100 to-champagne-200 text-ink shadow-[0_0_0_4px_rgba(212,168,69,0.14)]"
                    : isDone
                    ? "border-champagne-300/60 bg-champagne-200 text-ink"
                    : "border-ink/[0.12] bg-white text-ink/40"
                }`}
              >
                <span className="font-general text-[10px] tabular-nums">0{n}</span>
              </span>
              <span
                className={`hidden font-general text-[10px] uppercase tracking-[0.22em] transition-colors duration-500 md:block ${
                  isActive ? "text-ink" : isDone ? "text-ink/55" : "text-ink/35"
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
