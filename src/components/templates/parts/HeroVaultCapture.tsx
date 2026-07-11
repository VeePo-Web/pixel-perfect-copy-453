import { useId, useState } from "react";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { z } from "zod";
import { captureLead } from "../../../lib/leads";
import { track } from "../analytics";

const schema = z.object({
  firstName: z.string().trim().min(1, "First name required").max(60),
  email: z.string().trim().email("Enter a valid email").max(120),
});

type Status = "idle" | "sending" | "done";

export default function HeroVaultCapture() {
  const nameId = useId();
  const emailId = useId();
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{ firstName?: string; email?: string }>({});
  const [status, setStatus] = useState<Status>("idle");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const r = schema.safeParse({ firstName, email });
    if (!r.success) {
      const fe: typeof errors = {};
      for (const i of r.error.issues) {
        const k = i.path[0] as keyof typeof errors;
        if (!fe[k]) fe[k] = i.message;
      }
      setErrors(fe);
      return;
    }
    setErrors({});
    setStatus("sending");
    track("template_download_completed", { templateId: "vault", source: "hero" });
    await captureLead({
      firstName,
      email,
      businessType: "",
      goals: [],
      templateId: "vault",
      templateName: "GoldFin Template Vault",
    });
    setStatus("done");
  };

  if (status === "done") {
    return (
      <div
        id="vault-capture"
        className="mx-auto mt-8 max-w-md rounded-2xl border border-champagne-200/40 bg-white p-6 text-left shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)]"
      >
        <div className="font-general text-[10.5px] uppercase tracking-[0.28em] text-champagne-300">On its way</div>
        <p className="mt-2 text-[18px] font-medium text-ink">
          Check your inbox{firstName ? `, ${firstName}` : ""}. The Vault is on its way.
        </p>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
          Over the next few days we will show you how owners use each template to review cash, profitability, expenses, and monthly decisions.
        </p>
        <button
          type="button"
          onClick={startAutoFillCheckout}
          className="mt-5 inline-flex items-center gap-2 rounded-sm text-[13px] text-champagne-300 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
        >
          Prefer it filled for you every month? See GoldFin Reports — $150/mo →
        </button>
        <p className="mt-2 text-[11.5px] text-ink/45">
          Same templates, filled from your numbers. Cancel anytime.
        </p>
      </div>
    );
  }

  return (
    <form id="vault-capture" onSubmit={onSubmit} noValidate className="mx-auto mt-8 max-w-md">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="flex-1">
          <label htmlFor={nameId} className="sr-only">First name</label>
          <input
            id={nameId}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First name"
            autoComplete="given-name"
            aria-invalid={!!errors.firstName}
            className="w-full rounded-xl border border-ink/[0.12] bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink/35 transition-colors focus:outline-none focus:border-champagne-300/50 focus:ring-2 focus:ring-champagne-200/40 sm:text-[15px]"
          />
        </div>
        <div className="flex-1">
          <label htmlFor={emailId} className="sr-only">Work email</label>
          <input
            id={emailId}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Work email"
            autoComplete="email"
            aria-invalid={!!errors.email}
            className="w-full rounded-xl border border-ink/[0.12] bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink/35 transition-colors focus:outline-none focus:border-champagne-300/50 focus:ring-2 focus:ring-champagne-200/40 sm:text-[15px]"
          />
        </div>
      </div>
      {(errors.firstName || errors.email) && (
        <p role="alert" className="mt-2 text-[12px] text-champagne-400">
          {errors.firstName || errors.email}
        </p>
      )}
      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-3 w-full rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "Sending..." : "Send me the Vault"}
      </button>
      <p className="mt-3 font-general text-[10.5px] uppercase tracking-[0.18em] text-ink/45">
        First name and email. No phone. No credit card.
      </p>
    </form>
  );
}
