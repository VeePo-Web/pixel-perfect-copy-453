import { useState } from "react";
import { useEffect, useRef } from "react";
import { captureHomepageLead } from "../../lib/leads";

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.unobserve(el);
        }
      },
      { threshold, rootMargin: "0px 0px -60px 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

type Status = "idle" | "sending" | "done" | "error";

export default function ClosingBaitCTA() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const { ref, inView } = useInView();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");

    // Single integration point: stores the lead AND fires the Vault delivery
    // email (the zip). Reimplementing the insert here previously skipped the
    // email entirely — homepage leads never received the Vault.
    const { ok } = await captureHomepageLead(email);
    setStatus(ok ? "done" : "error");

    window.history.pushState({}, "", "/templates"); window.dispatchEvent(new PopStateEvent("popstate")); window.scrollTo({ top: 0 });
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="border-t border-ink/[0.06] bg-white py-24"
      aria-label="Get the free Template Vault"
    >
      <div
        className={[
          "mx-auto max-w-lg px-6 text-center transition-all duration-700 ease-cinema",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        ].join(" ")}
      >
        {/* Eyebrow */}
        <p className="mb-3 font-general text-[11px] uppercase tracking-[0.2em] text-ink/40">
          Get organized for free
        </p>

        {/* Heading */}
        <h2 className="font-display text-[28px] font-medium leading-[1.1] tracking-[-0.02em] text-ink [text-wrap:balance] lg:text-[32px]">
          Get the free Template Vault
        </h2>

        {/* Sub */}
        <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink/65">
          Four branded XLSX templates for cash, cash-basis P&L, expense audit,
          and owner-level review. Free forever.
        </p>

        {/* Success state */}
        {status === "done" ? (
          <div className="mt-10 space-y-3">
            <p className="text-[15px] text-ink">
              Check your inbox. The templates are on their way.
            </p>
            <a
              href="/templates"
              className="text-[13px] text-champagne-300 transition-colors duration-300 hover:text-champagne-400"
            >
              Browse all templates
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate>
            {/* Email input */}
            <input
              type="email"
              required
              inputMode="email"
              autoComplete="email"
              autoCapitalize="none"
              autoCorrect="off"
              spellCheck={false}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-full border border-ink/[0.12] bg-white px-5 py-3.5 text-[16px] text-ink placeholder:text-ink/35 transition-colors focus:border-champagne-300/50 focus:outline-none focus:ring-2 focus:ring-champagne-200/40 sm:text-[14px]"
              disabled={status === "sending"}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="w-full rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-3.5 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
            >
              {status === "sending" ? "Sending…" : "Send me the Vault"}
            </button>

            {/* Error state */}
            {status === "error" && (
              <p className="text-[13px] text-red-signal">
                Something went wrong. Try again or{" "}
                <a href="/templates" className="underline underline-offset-4">
                  visit the templates page
                </a>
                .
              </p>
            )}

            {/* Microcopy */}
            <p className="mt-3 font-general text-[10.5px] uppercase leading-relaxed tracking-[0.18em] text-ink/40">
              Free. We&apos;ll also send a short email series on how other owners use these to make better calls. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
