import { useEffect, useRef } from "react";
import { TrustFlowStep } from "../content";
import { track } from "../analytics";

export default function TrustFlowDiagram({ steps }: { steps: TrustFlowStep[] }) {
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            track("trust_flow_viewed");
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.4 }
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {steps.map((s, i) => (
        <div
          key={s.id}
          className="group relative rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-4 backdrop-blur-sm transition-all duration-300 motion-safe:hover:-translate-y-0.5 hover:border-ink/[0.18] hover:bg-ink/[0.035]"
        >
          <div className="text-[10px] uppercase tracking-[0.24em] text-champagne-200/60">
            Step {i + 1}
          </div>
          <div className="mt-2 text-[14px] font-medium text-ink">{s.label}</div>
          <div className="mt-1 text-[11.5px] text-ink/55">{s.trust}</div>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="pointer-events-none absolute right-[-7px] top-1/2 hidden h-px w-3 -translate-y-1/2 bg-champagne-200/30 lg:block"
            />
          )}
        </div>
      ))}
    </div>
  );
}
