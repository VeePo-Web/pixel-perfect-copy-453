import { APPLY } from "../content";
import type { ApplicationState } from "../hooks/useApplicationState";
import ApplicationStepShell from "./ApplicationStepShell";
import MultiSelectCardGroup from "./MultiSelectCardGroup";
import TextAreaWithChips from "./TextAreaWithChips";

type Props = {
  state: ApplicationState;
  update: <K extends keyof ApplicationState>(k: K, v: ApplicationState[K]) => void;
  errors: Record<string, string>;
  onBack: () => void;
  onContinue: () => void;
};

export default function StepDecisions({ state, update, errors, onBack, onContinue }: Props) {
  const c = APPLY.step3;
  return (
    <ApplicationStepShell step={3} headline={c.headline} sub={c.sub} onBack={onBack} onContinue={onContinue}>
      <MultiSelectCardGroup
        label="What decisions are you trying to make right now?"
        options={c.decisions}
        values={state.decisions}
        onChange={(v) => update("decisions", v)}
        cols={2}
        error={errors.decisions && APPLY.errors.required}
      />
      <TextAreaWithChips
        label={c.outcomeLabel}
        value={state.clarity_outcome}
        onChange={(v) => update("clarity_outcome", v)}
        placeholder={c.outcomePlaceholder}
      />
    </ApplicationStepShell>
  );
}
