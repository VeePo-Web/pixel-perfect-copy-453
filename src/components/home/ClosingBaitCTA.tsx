import { useState } from "react";
import { useEffect, useRef } from "react";
import { supabase } from "../../integrations/supabase/client";
import { analytics } from "../../lib/analytics";

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

    const { error } = await supabase.from("leads").insert({
      first_name: "Friend",
      email,
      business_type: "unknown",
      goals: ["templates"],
      template_id: "vault",
      template_name: "Template Vault",
      source: "homepage",
      consent: true,
    });

    if (!error) {
      setStatus("done");
      if (analytics && typeof analytics.leadCaptured === "function") {
        analytics.leadCaptured("vault");
      }
    } else {
      setStatus("error");
    }

    window.location.hash = "/templates";
  }

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[#FAF8F3] py-24"
      aria-label="Get the free Template Vault"
    >
      <div
        className={[
          "mx-auto max-w-lg px-6 text-center transition-all duration-700 ease-cinema",
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6",
        ].join(" ")}
      >
        {/* Eyebrow */}
        <p className="mb-3 text-[11px] font-medium uppercase tracking-[0.2em] text-ink/40">
          Get organized for free
        </p>

        {/* Heading */}
        <h2 className="text-[28px] font-light leading-snug text-ink lg:text-[32px]">
          Get the free Template Vault
        </h2>

        {/* Sub */}
        <p className="mx-auto mt-4 max-w-[42ch] text-[15px] leading-relaxed text-ink/65">
          Seven templates that answer the seven questions you can&apos;t answer right now.
          Free forever.
        </p>

        {/* Success state */}
        {status === "done" ? (
          <div className="mt-10 space-y-3">
            <p className="text-[15px] text-ink">
              ✓ Check your inbox — the templates are on their way.
            </p>
            <a
              href="#/templates"
              className="text-[13px] text-champagne-300 transition-colors duration-300 hover:text-champagne-200"
            >
              Browse all templates →
            </a>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-3" noValidate>
            {/* Email input */}
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full rounded-full border border-ink/[0.12] bg-white/80 px-5 py-3.5 text-[14px] text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 focus:ring-champagne-200/60"
              disabled={status === "sending"}
            />

            {/* Submit button */}
            <button
              type="submit"
              disabled={status === "sending"}
              className="relative w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium text-navy transition-opacity duration-300 hover:opacity-90 disabled:opacity-60"
            >
              {status === "sending" ? "Sending…" : "Send me the Vault"}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow"
              />
            </button>

            {/* Error state */}
            {status === "error" && (
              <p className="text-[13px] text-red-500">
                Something went wrong. Try again or{" "}
                <a href="#/templates" className="underline">
                  visit the templates page
                </a>
                .
              </p>
            )}

            {/* Microcopy */}
            <p className="mt-3 text-[11px] uppercase tracking-[0.2em] text-ink/40">
              We send the templates once. No drip. No pitch. Unsubscribe anytime.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}