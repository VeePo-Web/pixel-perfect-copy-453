import { APPLY } from "../content";
import type { ApplicationState } from "../hooks/useApplicationState";
import ApplicationStepShell from "./ApplicationStepShell";
import SelectableCard from "./SelectableCard";
import TextAreaWithChips from "./TextAreaWithChips";
import FitSignalCard from "./FitSignalCard";

type Props = {
  state: ApplicationState;
  update: <K extends keyof ApplicationState>(k: K, v: ApplicationState[K]) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onContinue: () => void;
};

function RadioGroup({
  label,
  options,
  value,
  onChange,
  error,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="mb-3 font-general text-[11px] uppercase tracking-[0.22em] leading-[1.8] text-ink/45">{label}</div>
      <div role="radiogroup" className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
        {options.map((o) => (
          <SelectableCard key={o} label={o} selected={value === o} onSelect={() => onChange(o)} />
        ))}
      </div>
      {error && <p role="alert" className="mt-2 text-[12.5px] text-red-signal">{error}</p>}
    </div>
  );
}

export default function StepReadiness({ state, update, errors, onBack, onContinue }: Props) {
  const c = APPLY.step4;
  return (
    <ApplicationStepShell step={4} headline={c.headline} sub={c.sub} onBack={onBack} onContinue={onContinue} continueLabel="Review Application">
      <RadioGroup
        label={c.review.label}
        options={c.review.options}
        value={state.monthly_review}
        onChange={(v) => update("monthly_review", v)}
        error={errors.monthly_review && APPLY.errors.required}
      />
      {state.monthly_review === c.review.reassureValue && (
        <FitSignalCard tone="positive">{c.review.reassureText}</FitSignalCard>
      )}

      <RadioGroup
        label={c.budget.label}
        options={c.budget.options}
        value={state.budget_fit}
        onChange={(v) => update("budget_fit", v)}
        error={errors.budget_fit && APPLY.errors.required}
      />
      {state.budget_fit === c.budget.reassureValue && (
        <FitSignalCard tone="soft">{c.budget.reassureText}</FitSignalCard>
      )}

      <TextAreaWithChips
        label={c.worth.label}
        value={state.worth_it}
        onChange={(v) => update("worth_it", v)}
        placeholder={c.worth.placeholder}
      />

      <RadioGroup
        label={c.timeline.label}
        options={c.timeline.options}
        value={state.timeline}
        onChange={(v) => update("timeline", v)}
        error={errors.timeline && APPLY.errors.required}
      />
    </ApplicationStepShell>
  );
}
