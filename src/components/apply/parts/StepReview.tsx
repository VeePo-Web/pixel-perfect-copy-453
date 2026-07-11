import { useState } from "react";
import { APPLY } from "../content";
import type { ApplicationState } from "../hooks/useApplicationState";
import ApplicationStepShell from "./ApplicationStepShell";
import ApplicationSummary from "./ApplicationSummary";
import TrustReassuranceBlock from "./TrustReassuranceBlock";
import SubmissionLoading from "./SubmissionLoading";

type Props = {
  state: ApplicationState;
  update: <K extends keyof ApplicationState>(k: K, v: ApplicationState[K]) => void;
  onBack: () => void;
  onEdit: (step: number) => void;
  onSubmit: () => Promise<void>;
  submitting: boolean;
  submitError: string | null;
};

export default function StepReview({ state, update, onBack, onEdit, onSubmit, submitting, submitError }: Props) {
  const c = APPLY.step5;
  const [toast, setToast] = useState<string | null>(null);

  const handleSave = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + window.location.pathname + "/apply");
      setToast("Resume link copied. Your progress is saved on this device.");
    } catch {
      setToast("Your progress is saved on this device.");
    }
    setTimeout(() => setToast(null), 4000);
  };

  if (submitting) {
    return (
      <ApplicationStepShell step={5} headline="Submitting your application" sub="This should only take a moment.">
        <SubmissionLoading />
      </ApplicationStepShell>
    );
  }

  return (
    <ApplicationStepShell
      step={5}
      headline={c.headline}
      sub={c.sub}
      onBack={onBack}
      onContinue={state.consent ? onSubmit : undefined}
      continueLabel={c.submit}
      continueDisabled={!state.consent}
      footerSecondary={
        <button onClick={handleSave} className="text-[13px] text-ink/55 hover:text-ink transition-colors">
          {c.save}
        </button>
      }
    >
      <ApplicationSummary state={state} onEdit={onEdit} />
      <TrustReassuranceBlock />
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-ink/[0.12] bg-white p-4 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-colors hover:border-ink/[0.25]">
        <input
          type="checkbox"
          checked={state.consent}
          onChange={(e) => update("consent", e.target.checked)}
          className="mt-[3px] h-4 w-4 accent-champagne-300"
        />
        <span className="text-[13.5px] leading-[1.55] text-ink/80">{c.consent}</span>
      </label>
      <p className="font-general text-[10.5px] uppercase tracking-[0.22em] text-ink/40">{c.micro}</p>
      {submitError && (
        <p role="alert" className="rounded-xl border border-red-signal/30 bg-red-signal/[0.04] px-4 py-3 text-[13px] text-red-signal">
          {submitError}
        </p>
      )}
      {toast && (
        <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 rounded-full border border-ink/[0.1] bg-white px-5 py-2.5 text-[12.5px] text-ink shadow-[0_16px_40px_-20px_rgba(11,13,18,0.25)] motion-safe:animate-section-in">
          {toast}
        </div>
      )}
    </ApplicationStepShell>
  );
}
