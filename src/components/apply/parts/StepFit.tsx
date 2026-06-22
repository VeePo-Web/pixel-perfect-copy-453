import { APPLY, LLOW_FIT_RANGES } from "../content";
import type { ApplicationState } from "../hooks/useApplicationState";
import ApplicationStepShell from "./ApplicationStepShell";
import TextField from "./TextField";
import SelectableCard from "./SelectableCard";
import FitSignalCard from "./FitSignalCard";

type Props = {
  state: ApplicationState;
  update: <K extends keyof ApplicationState>(k: K, v: ApplicationState[K]) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onContinue: () => void;
};

export default function StepFit({ state, update, errors, onBack, onContinue }: Props) {
  const c = APPLY.step1;
  const lowFit = LLOW_FIT_RANGES.has(state.revenue_range);
  const goodFit = state.revenue_range && !lowFit;

  return (
    <ApplicationStepShell
      step={1}
      headline={c.headline}
      sub={c.sub}
      onBack={onBack}
      onContinue={onContinue}
    >
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="First name" value={state.first_name} onChange={(v) => update("first_name", v)} placeholder="Claire" autoComplete="given-name" error={errors.first_name && APPLY.errors.required} />
        <TextField label="Work email" value={state.email} onChange={(v) => update("email", v)} placeholder="claire@business.com" type="email" autoComplete="email" error={errors.email && APPLY.errors.email} />
      </div>
      <TextField label="Business name" value={state.business_name} onChange={(v) => update("business_name", v)} placeholder="Acme Marketing Agency" autoComplete="organization" error={errors.business_name && APPLY.errors.required} />

      <div>
        <div className="mb-3 text-[11.5px] uppercase tracking-[0.22em] text-ink/45">What kind of business do you run?</div>
        <div role="radiogroup" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {c.businessTypes.map((t) => (
            <SelectableCard
              key={t}
              label={t}
              selected={state.business_type === t}
              onSelect={() => update("business_type", t)}
            />
          ))}
        </div>
        {errors.business_type && <p role="alert" className="mt-2 text-[12.5px] text-champagne-200/90">{APPLY.errors.required}</p>}
      </div>

      <div>
        <div className="mb-3 text-[11.5px] uppercase tracking-[0.22em] text-ink/45">Approximate monthly revenue</div>
        <div role="radiogroup" className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
          {c.revenueRanges.map((r) => (
            <SelectableCard
              key={r}
              label={r}
              selected={state.revenue_range === r}
              onSelect={() => update("revenue_range", r)}
            />
          ))}
        </div>
        {errors.revenue_range && <p role="alert" className="mt-2 text-[12.5px] text-champagne-200/90">{APPLY.errors.revenue}</p>}
        {lowFit && (
          <div className="mt-4">
            <FitSignalCard tone="soft">
              {c.lowFit}
              <div className="mt-3 flex flex-wrap gap-3">
                <button onClick={onContinue} className="text-[12.5px] text-champagne-300 underline-offset-4 hover:underline">Continue Application →</button>
                <a href="#/templates" className="text-[12.5px] text-ink/65 underline-offset-4 hover:underline hover:text-ink">Start with Free Templates</a>
              </div>
            </FitSignalCard>
          </div>
        )}
        {goodFit && (
          <div className="mt-4">
            <FitSignalCard tone="positive">{c.goodFit}</FitSignalCard>
          </div>
        )}
      </div>
    </ApplicationStepShell>
  );
}
