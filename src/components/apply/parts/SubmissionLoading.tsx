import { useEffect, useState } from "react";
import { APPLY } from "../content";

export default function SubmissionLoading() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % APPLY.step5.loading.length), 900);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="rounded-2xl border border-champagne-200/15 bg-charcoal-900/60 p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="relative flex h-2 w-2">
          <span className="absolute inset-0 rounded-full bg-champagne-200 motion-safe:animate-soft-pulse" />
        </span>
        <span className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">Submitting</span>
      </div>
      <div key={i} className="text-[14.5px] text-ink/85 motion-safe:animate-section-in">
        {APPLY.step5.loading[i]}
      </div>
      <div className="mt-5 h-px w-full overflow-hidden bg-ink/[0.06]">
        <div className="h-full w-1/3 bg-gradient-to-r from-champagne-200/0 via-champagne-200 to-champagne-200/0 motion-safe:animate-shimmer" />
      </div>
    </div>
  );
}
