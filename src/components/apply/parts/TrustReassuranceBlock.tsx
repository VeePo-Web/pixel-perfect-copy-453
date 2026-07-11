import { APPLY } from "../content";

export default function TrustReassuranceBlock() {
  const c = APPLY.step5.trust;
  return (
    <div className="rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">{c.title}</div>
      <ol className="mt-4 space-y-3">
        {c.items.map((it, i) => (
          <li key={it} className="flex items-start gap-3 text-[13.5px] leading-[1.6] text-ink/75">
            <span className="mt-[2px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-champagne-300/40 font-general text-[10px] tabular-nums text-champagne-300">
              {i + 1}
            </span>
            {it}
          </li>
        ))}
      </ol>
    </div>
  );
}
