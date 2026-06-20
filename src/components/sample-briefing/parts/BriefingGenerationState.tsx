import { loaderLines } from "../content";

type Props = { activeIndex: number };

export default function BriefingGenerationState({ activeIndex }: Props) {
  return (
    <div className="space-y-3" aria-live="polite">
      {loaderLines.map((line, i) => {
        const state = i < activeIndex ? "done" : i === activeIndex ? "active" : "pending";
        return (
          <div
            key={line}
            className={`flex items-center gap-3 text-[13px] transition-all duration-500 ease-cinema ${
              state === "pending" ? "opacity-30" : "opacity-100"
            }`}
          >
            <span
              className={`relative inline-block h-1.5 w-1.5 rounded-full ${
                state === "done"
                  ? "bg-green-signal"
                  : state === "active"
                  ? "bg-champagne-200 motion-safe:animate-soft-pulse"
                  : "bg-bone/20"
              }`}
            />
            <span className={state === "done" ? "text-ink/60" : "text-ink/90"}>{line}</span>
          </div>
        );
      })}
    </div>
  );
}
