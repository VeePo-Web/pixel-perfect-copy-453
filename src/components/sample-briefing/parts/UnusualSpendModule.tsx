import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";

const TAG_TONE: Record<string, string> = {
  Review: "border-champagne-200/30 text-champagne-100",
  Recurring: "border-white/15 text-bone/75",
  Timing: "border-blue-300/30 text-blue-300",
  "Ask on call": "border-green-signal/40 text-green-signal",
};

export default function UnusualSpendModule({ business }: { business: DemoBusiness }) {
  return (
    <ModuleShell id="unusual-spend" eyebrow="Unusual Spend" title="Movement worth a second look.">
      <ul className="grid gap-3 sm:grid-cols-2">
        {business.unusualSpend.map((u) => (
          <li
            key={u.title}
            className="group/card flex items-start justify-between gap-4 rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all duration-300 ease-cinema hover:border-champagne-200/30 hover:bg-white/[0.04]"
          >
            <span className="text-[14px] leading-[1.5] text-bone/85">{u.title}</span>
            <span
              className={`shrink-0 rounded-full border bg-charcoal-900/60 px-2.5 py-1 text-[10.5px] uppercase tracking-[0.18em] ${TAG_TONE[u.tag] ?? "border-white/15 text-bone/70"}`}
            >
              {u.tag}
            </span>
          </li>
        ))}
      </ul>
      <p className="mt-5 text-[13.5px] leading-[1.7] text-bone/65">
        None of these items are automatically wrong, but they deserve review because recurring cost increases can quietly reduce flexibility.
      </p>
    </ModuleShell>
  );
}
