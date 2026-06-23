import { useInView } from "../../how-it-works/hooks/useInView";
import { track, trackCtaByHref } from "../analytics";

export default function SecurityFinalCTA() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      id="apply"
      aria-labelledby="final-cta-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-champagne-200/[0.07] blur-3xl"
      />
      <div
        ref={ref}
        className={`relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-10 lg:py-28 transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          The first safe step
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 font-light text-ink text-[30px] leading-[1.1] tracking-[-0.015em] sm:text-[48px]"
        >
          Ready to take the first safe step?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-ink/65">
          Now that you know how the connection works, the next step is simple: have your
          reports filled for you every month â€” read-only, cancel anytime. Or preview a
          briefing first.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/pricing#auto-fill"
            onClick={() => {
              track("final_security_cta_clicked", { target: "reports" });
              trackCtaByHref("#/pricing#auto-fill", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Auto-fill my reports â€” $99/mo
          </a>
          <a
            href="#/sample-briefing"
            onClick={() => {
              track("final_security_cta_clicked", { target: "sample-briefing" });
              trackCtaByHref("#/sample-briefing", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-6 text-[13.5px] text-ink transition-all duration-300 ease-cinema hover:border-ink/30 hover:bg-ink/[0.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
          >
            See a sample briefing
          </a>
          <a
            href="#/templates"
            onClick={() => {
              track("final_security_cta_clicked", { target: "templates" });
              trackCtaByHref("#/templates", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center text-[13px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Or get the free Template Vault â†’
          </a>
        </div>
        <p className="mt-6 text-[12px] text-ink/45">
          $99/mo. Read-only connection. No bank connection required to start.
        </p>
      </div>
    </section>
  );
}
