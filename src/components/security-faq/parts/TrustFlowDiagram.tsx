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
          className="group relative rounded-2xl border border-ink/[0.08] bg-white p-4 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema motion-safe:hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]"
        >
          <div className="font-general text-[10px] uppercase tracking-[0.24em] text-champagne-300">
            Step {i + 1}
          </div>
          <div className="mt-2 text-[14px] font-medium text-ink">{s.label}</div>
          <div className="mt-1 text-[11.5px] text-ink/55">{s.trust}</div>
          {i < steps.length - 1 && (
            <span
              aria-hidden
              className="pointer-events-none absolute right-[-13px] top-1/2 hidden h-px w-3 -translate-y-1/2 bg-ink/[0.08] lg:block"
            />
          )}
        </div>
      ))}
    </div>
  );
}
