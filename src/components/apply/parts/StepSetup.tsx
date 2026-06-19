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

export default function StepSetup({ state, update, errors, onBack, onContinue }: Props) {
  const c = APPLY.step2;
  return (
    <ApplicationStepShell step={2} headline={c.headline} sub={c.sub} onBack={onBack} onContinue={onContinue}>
      <MultiSelectCardGroup
        label="Which of these do you currently use?"
        options={c.tools}
        values={state.current_tools}
        onChange={(v) => update("current_tools", v)}
        cols={3}
        error={errors.current_tools && APPLY.errors.required}
      />
      <TextAreaWithChips
        label={c.gapLabel}
        value={state.clarity_gap}
        onChange={(v) => update("clarity_gap", v)}
        placeholder={c.gapPlaceholder}
        chips={c.gapChips}
        micro={c.micro}
      />
    </ApplicationStepShell>
  );
}
