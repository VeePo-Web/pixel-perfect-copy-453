import { useId, useState } from "react";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { z } from "zod";
import { captureLead } from "../../../lib/leads";
import { track } from "../analytics";

// Squeeze-page hero capture (Brunson): grab the email IN the hero, email-only
// friction, deliver the whole Vault. Wires to Supabase leads + Resend.
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
    // Never lose the lead: capture is attempted; UX proceeds regardless.
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
        className="mt-8 max-w-md rounded-2xl border border-champagne-200/40 bg-white p-6 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.18)]"
      >
        <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300">On its way</div>
        <p className="mt-2 text-[18px] font-light text-ink">
          Check your inbox{firstName ? `, ${firstName}` : ""} — the Vault is on its way.
        </p>
        <p className="mt-2 text-[13.5px] leading-[1.6] text-ink/60">
          Over the next few days we'll show you how owners actually use each template to make hiring, pricing, and cash-flow calls.
        </p>
        <button
          type="button" onClick={startAutoFillCheckout}
          className="mt-5 inline-flex items-center gap-2 text-[13px] text-champagne-300 underline-offset-4 transition-colors hover:text-ink hover:underline"
        >
          Prefer it filled for you every month? See GoldFin Reports — $150/mo →
        </button>
      </div>
    );
  }

  return (
    <form id="vault-capture" onSubmit={onSubmit} noValidate className="mt-8 max-w-md">
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
            className="w-full rounded-xl border border-ink/[0.12] bg-white px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-champagne-300/70 sm:text-[15px]"
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
            className="w-full rounded-xl border border-ink/[0.12] bg-white px-4 py-3 text-[16px] text-ink outline-none transition-colors placeholder:text-ink/40 focus:border-champagne-300/70 sm:text-[15px]"
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
        className="group relative mt-3 w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13.5px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white disabled:opacity-70 sm:w-auto"
      >
        <span className="relative z-10">{status === "sending" ? "Sending…" : "Send me the Vault"}</span>
        <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
      </button>
      <p className="mt-3 text-[12px] text-ink/50">
        First name and email. No phone. No credit card.
      </p>
    </form>
  );
}
