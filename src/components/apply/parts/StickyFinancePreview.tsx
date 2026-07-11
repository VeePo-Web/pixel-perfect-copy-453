import { useState } from "react";
import { APPLY } from "../content";
import type { ApplicationState } from "../hooks/useApplicationState";

function Card({ children, title, label }: { children: React.ReactNode; title?: string; label?: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)]">
      <span className="absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent" />
      {label && <div className="mb-3 font-general text-[10.5px] uppercase tracking-[0.28em] text-ink/45">{label}</div>}
      {title && <div className="mb-4 font-display font-medium text-[20px] leading-tight tracking-[-0.01em] text-ink">{title}</div>}
      {children}
    </div>
  );
}

function StepContent({ step, state }: { step: number; state: ApplicationState }) {
  if (step === 0) {
    const r = APPLY.landing.rhythmCard;
    return (
      <Card label="Premium subscription" title={r.title}>
        <ul className="space-y-2.5">
          {r.items.map((it) => (
            <li key={it} className="flex items-start gap-3 text-[14px] text-ink/80">
              <span className="mt-[9px] inline-block h-[3px] w-3 rounded-full bg-champagne-200" />
              {it}
            </li>
          ))}
        </ul>
        <div className="mt-5 flex items-end justify-between border-t border-ink/[0.06] pt-4">
          <span className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Investment</span>
          <span className="font-general text-[17px] tabular-nums tracking-tight text-champagne-300">{r.price}</span>
        </div>
        <p className="mt-3 text-[12px] text-ink/45">{r.sub}</p>
        <p className="mt-5 text-[11.5px] leading-[1.55] text-ink/40">{APPLY.landing.fitNote}</p>
      </Card>
    );
  }

  if (step === 1) {
    const lowFit = state.revenue_range && ["Under $10K/month", "$10K–$30K/month"].includes(state.revenue_range);
    return (
      <Card label="Likely fit signal" title={lowFit ? "Lighter rhythm may fit better" : "Has the activity to benefit"}>
        <p className="text-[13.5px] leading-[1.6] text-ink/70">
          {lowFit
            ? "Your business may be earlier-stage. The free templates can give you structure first."
            : "Business has enough activity to benefit from recurring financial review."}
        </p>
        <ul className="mt-5 space-y-2 text-[13px] text-ink/55">
          {state.business_type && <li>· {state.business_type}</li>}
          {state.revenue_range && <li>· {state.revenue_range}</li>}
        </ul>
      </Card>
    );
  }

  if (step === 2) {
    return (
      <Card label="Financial Clarity Gap" title="The gap between data and decisions">
        <p className="text-[13.5px] leading-[1.6] text-ink/70">
          You have tools. We are looking for the missing rhythm between data and decisions.
        </p>
        {state.current_tools.length > 0 && (
          <div className="mt-5">
            <div className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">Tools you use</div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {state.current_tools.slice(0, 6).map((t) => (
                <span key={t} className="rounded-full border border-ink/[0.12] bg-white px-2.5 py-1 text-[11.5px] text-ink/60">
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  }

  if (step === 3) {
    return (
      <Card label="First Briefing Focus" title="Your first monthly review may focus on">
        {state.decisions.length === 0 ? (
          <p className="text-[13px] text-ink/45">Select the decisions you want clearer numbers for. Your briefing focus will preview here.</p>
        ) : (
          <ul className="space-y-2.5">
            {state.decisions.slice(0, 5).map((d) => (
              <li key={d} className="flex items-start gap-3 text-[13.5px] text-ink/80">
                <span className="mt-[9px] h-[3px] w-3 shrink-0 rounded-full bg-champagne-200" />
                {d}
              </li>
            ))}
          </ul>
        )}
      </Card>
    );
  }

  if (step === 4) {
    const signals: { l: string; v: string }[] = [
      { l: "Monthly review commitment", v: state.monthly_review || "—" },
      { l: "Budget fit", v: state.budget_fit || "—" },
      { l: "Decision urgency", v: state.timeline || "—" },
      { l: "Clarity goal", v: state.worth_it ? "Captured" : "—" },
    ];
    return (
      <Card label="Readiness Signals" title="What we look for">
        <ul className="space-y-3">
          {signals.map((s) => (
            <li key={s.l} className="flex items-start justify-between gap-3 border-b border-ink/[0.06] pb-3 last:border-0 last:pb-0">
              <span className="text-[12.5px] text-ink/55">{s.l}</span>
              <span className="text-right font-general text-[12px] tabular-nums text-ink/85">{s.v}</span>
            </li>
          ))}
        </ul>
      </Card>
    );
  }

  // step 5: summary mirror
  return (
    <Card label="Review" title="Application summary">
      <ul className="space-y-2.5 text-[13px] text-ink/75">
        {state.business_name && <li>· {state.business_name}</li>}
        {state.business_type && <li>· {state.business_type}</li>}
        {state.revenue_range && <li>· {state.revenue_range}</li>}
        {state.decisions.length > 0 && <li>· {state.decisions.length} decisions to review</li>}
        {state.timeline && <li>· Timeline: {state.timeline}</li>}
      </ul>
    </Card>
  );
}

export default function StickyFinancePreview({ step, state }: { step: number; state: ApplicationState }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {/* Desktop sticky */}
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <StepContent step={step} state={state} />
        </div>
      </aside>

      {/* Mobile collapsible */}
      <div className="lg:hidden">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center justify-between rounded-xl border border-ink/[0.12] bg-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-colors hover:border-ink/[0.25]"
          aria-expanded={open}
        >
          <span className="font-general text-[11px] uppercase tracking-[0.22em] text-ink/45">What happens next?</span>
          <span className={`text-ink/50 transition-transform duration-300 ${open ? "rotate-180" : ""}`}>⌄</span>
        </button>
        {open && (
          <div className="mt-3">
            <StepContent step={step} state={state} />
          </div>
        )}
      </div>
    </>
  );
}
