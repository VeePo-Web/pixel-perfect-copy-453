import type { DemoBusiness } from "../content";
import ModuleShell from "./ModuleShell";

export default function DecisionsToConsiderModule({ business }: { business: DemoBusiness }) {
  return (
    <ModuleShell
      id="decisions"
      eyebrow="Decisions to Consider"
      title="Where the briefing becomes action."
      cta={
        <a
          href="/pricing"
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-6 py-3 text-[13px] font-medium tracking-wide text-ink transition-all duration-300 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
        >
          Apply for the GoldFin Desk
          <span aria-hidden>→</span>
        </a>
      }
    >
      <div className="grid gap-3 md:grid-cols-2">
        {business.decisions.map((d, i) => (
          <div
            key={d}
            className="flex items-start gap-3 rounded-xl border border-ink/[0.07] bg-ink/[0.02] px-5 py-4 transition-all duration-300 ease-cinema hover:border-champagne-200/25 hover:bg-ink/[0.04]"
          >
            <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-200" aria-hidden />
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.22em] text-ink/45">Decision {i + 1}</div>
              <div className="mt-1 text-[14.5px] leading-[1.55] text-ink/90">{d}</div>
            </div>
          </div>
        ))}
      </div>
    </ModuleShell>
  );
}
