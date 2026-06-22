import { APPLY } from "../content";

export default function TrustReassuranceBlock() {
  const c = APPLY.step5.trust;
  return (
    <div className="relative rounded-2xl border border-champagne-200/15 bg-charcoal-900/50 p-6">
      <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">{c.title}</div>
      <ol className="mt-4 space-y-3">
        {c.items.map((it, i) => (
          <li key={it} className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-ink/80">
            <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-champagne-200/30 text-[10.5px] text-champagne-300/70">
              {i + 1}
            </span>
            {it}
          </li>
        ))}
      </ol>
    </div>
  );
}
