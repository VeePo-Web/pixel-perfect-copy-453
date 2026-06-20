import { useEffect, useState } from "react";
import { supabase } from "../../integrations/supabase/client";
import { APPLY } from "./content";
import { useApplicationState } from "./hooks/useApplicationState";
import { useHashRoute, navigate } from "./hooks/useHashRoute";
import { validateStep, fullSchema, type StepKey } from "./schema";
import ApplicationHeader from "./parts/ApplicationHeader";
import FunnelProgress from "./parts/FunnelProgress";
import StickyFinancePreview from "./parts/StickyFinancePreview";
import StepLanding from "./parts/StepLanding";
import StepFit from "./parts/StepFit";
import StepSetup from "./parts/StepSetup";
import StepDecisions from "./parts/StepDecisions";
import StepReadiness from "./parts/StepReadiness";
import StepReview from "./parts/StepReview";
import SuccessPage from "./parts/SuccessPage";

export default function ApplicationFunnel() {
  const route = useHashRoute();
  const { state, update, step, setStep, reset, hasDraft } = useApplicationState();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Scroll to top whenever step changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step]);

  if (route === "thank-you") {
    return <SuccessPage onClear={reset} />;
  }

  const goTo = (n: number) => {
    setErrors({});
    setStep(n);
  };

  const next = (current: StepKey) => {
    const fields: Record<StepKey, (keyof typeof state)[]> = {
      1: ["first_name", "email", "business_name", "business_type", "revenue_range"],
      2: ["current_tools", "clarity_gap"],
      3: ["decisions", "clarity_outcome"],
      4: ["monthly_review", "budget_fit", "worth_it", "timeline"],
    };
    const slice = Object.fromEntries(fields[current].map((k) => [k, state[k]]));
    const r = validateStep(current, slice);
    if (!r.ok) {
      setErrors(r.errors);
      return;
    }
    goTo(current + 1);
  };

  const submit = async () => {
    setSubmitError(null);
    const r = fullSchema.safeParse(state);
    if (!r.success) {
      setSubmitError(APPLY.errors.consent);
      return;
    }
    setSubmitting(true);
    try {
      const { error } = await supabase.from("applications").insert({
        first_name: state.first_name,
        email: state.email,
        business_name: state.business_name,
        business_type: state.business_type,
        revenue_range: state.revenue_range,
        current_tools: state.current_tools,
        clarity_gap: state.clarity_gap,
        decisions: state.decisions,
        clarity_outcome: state.clarity_outcome,
        monthly_review: state.monthly_review,
        budget_fit: state.budget_fit,
        worth_it: state.worth_it,
        timeline: state.timeline,
        consent: state.consent,
      });
      if (error) throw error;
      navigate("#/apply/thank-you");
    } catch {
      setSubmitError(APPLY.errors.submit);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-ink">
      <ApplicationHeader />


      <main className="mx-auto max-w-6xl px-5 pb-32 pt-10 md:px-8">
        {step > 0 && (
          <div className="mb-12">
            <FunnelProgress step={step} />
          </div>
        )}

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7">
            {step === 0 && (
              <StepLanding
                onStart={() => goTo(1)}
                showWelcomeBack={hasDraft()}
                onResume={() => goTo(Math.max(1, step || 1))}
              />
            )}
            {step === 1 && <StepFit state={state} update={update} errors={errors} onBack={() => goTo(0)} onContinue={() => next(1)} />}
            {step === 2 && <StepSetup state={state} update={update} errors={errors} onBack={() => goTo(1)} onContinue={() => next(2)} />}
            {step === 3 && <StepDecisions state={state} update={update} errors={errors} onBack={() => goTo(2)} onContinue={() => next(3)} />}
            {step === 4 && <StepReadiness state={state} update={update} errors={errors} onBack={() => goTo(3)} onContinue={() => next(4)} />}
            {step === 5 && (
              <StepReview
                state={state}
                update={update}
                onBack={() => goTo(4)}
                onEdit={(s) => goTo(s)}
                onSubmit={submit}
                submitting={submitting}
                submitError={submitError}
              />
            )}
          </div>
          <div className="lg:col-span-5">
            <StickyFinancePreview step={step} state={state} />
          </div>
        </div>
      </main>
    </div>
  );
}
