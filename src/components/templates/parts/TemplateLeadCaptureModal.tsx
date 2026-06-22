import { useId, useState } from "react";
import { z } from "zod";
import ModalShell from "./ModalShell";
import { businessTypes, goalChips, type TemplateItem } from "../content";
import { track } from "../analytics";
import TemplateSuccessState from "./TemplateSuccessState";
import type { LeadFlowState } from "../hooks/useLeadCaptureFlow";
import type { LeadSubmitPayload } from "../../../lib/leads";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60, "Too long"),
  email: z.string().trim().email("Enter a valid email").max(120),
  businessType: z.string().trim().min(1, "Select your business type").max(80),
});

type Props = {
  state: LeadFlowState;
  onClose: () => void;
  onSubmit: (payload: LeadSubmitPayload) => Promise<void> | void;
};

export default function TemplateLeadCaptureModal({ state, onClose, onSubmit }: Props) {
  const open = state.kind !== "closed";
  const template: TemplateItem | null =
    state.kind === "form" || state.kind === "sending" || state.kind === "success"
      ? state.template
      : null;

  const headingId = useId();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [businessType, setBusinessType] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [errors, setErrors] = useState<{ firstName?: string; email?: string; businessType?: string }>({});

  if (!open || !template) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = schema.safeParse({ firstName, email, businessType });
    if (!result.success) {
      const fieldErrors: typeof errors = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof typeof errors;
        if (!fieldErrors[k]) fieldErrors[k] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    track("template_download_completed", {
      templateId: template.id,
      businessType,
      goals,
    });
    await onSubmit({ firstName, email, businessType, goals });
  };

  const toggleGoal = (id: string) =>
    setGoals((g) => (g.includes(id) ? g.filter((x) => x !== id) : [...g, id]));

  return (
    <ModalShell open={open} onClose={onClose} labelledBy={headingId} size="modal">
      {state.kind === "success" ? (
        <TemplateSuccessState template={template} onClose={onClose} headingId={headingId} />
      ) : (
        <form onSubmit={handleSubmit} className="p-6 sm:p-7" noValidate>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
                Get the free template
              </div>
              <h2 id={headingId} className="mt-2 text-[22px] font-light leading-snug text-ink">
                {template.name}
              </h2>
              <p className="mt-2 text-[13px] text-ink/65">
                Enter your email and we’ll send the {template.shortName} so you can start organizing your numbers today.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[11px] text-ink/60 hover:text-ink"
            >
              ✕
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <Field
              label="First name"
              value={firstName}
              onChange={setFirstName}
              error={errors.firstName}
              autoComplete="given-name"
            />
            <Field
              label="Work email"
              type="email"
              value={email}
              onChange={setEmail}
              error={errors.email}
              autoComplete="email"
            />
            <SelectField
              label="Business type"
              value={businessType}
              onChange={setBusinessType}
              options={businessTypes}
              error={errors.businessType}
            />
            <div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
                What are you trying to understand? <span className="lowercase text-ink/35">(optional)</span>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {goalChips.map((g) => {
                  const on = goals.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      aria-pressed={on}
                      onClick={() => toggleGoal(g.id)}
                      className={`min-h-[34px] rounded-full border px-3 py-1.5 text-[12px] transition-all duration-300 ease-cinema ${
                        on
                          ? "border-champagne-200/60 bg-champagne-200/[0.08] text-ink"
                          : "border-ink/[0.08] bg-ink/[0.02] text-ink/65 hover:border-ink/20"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={state.kind === "sending"}
            className="mt-6 w-full rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 py-3 text-[13px] font-medium text-navy transition-all duration-300 ease-cinema hover:shadow-[0_14px_40px_-12px_rgba(217,190,130,0.6)] disabled:opacity-70"
          >
            {state.kind === "sending" ? "Sending…" : "Send My Template"}
          </button>
          <p className="mt-3 text-center text-[11px] text-ink/45">
            No bank connection required. No spam. Start free.
          </p>
        </form>
      )}
    </ModalShell>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  error,
  autoComplete,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  error?: string;
  autoComplete?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="mt-1.5 w-full rounded-xl border border-ink/[0.1] bg-ink/[0.02] px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-champagne-200/50"
      />
      {error ? (
        <p id={`${id}-err`} role="alert" aria-live="polite" className="mt-1.5 text-[11.5px] text-champagne-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  error?: string;
}) {
  const id = useId();
  return (
    <div>
      <label htmlFor={id} className="text-[11px] uppercase tracking-[0.22em] text-ink/45">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-err` : undefined}
        className="mt-1.5 w-full appearance-none rounded-xl border border-ink/[0.1] bg-ink/[0.02] px-3.5 py-3 text-[14px] text-ink outline-none transition-colors focus:border-champagne-200/50"
      >
        <option value="" disabled>
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-charcoal-950">
            {o}
          </option>
        ))}
      </select>
      {error ? (
        <p id={`${id}-err`} role="alert" aria-live="polite" className="mt-1.5 text-[11.5px] text-champagne-300">
          {error}
        </p>
      ) : null}
    </div>
  );
}
