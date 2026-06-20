import { track, trackCtaByHref } from "../analytics";

export default function SecurityFinalCTA() {
  return (
    <section
      id="apply"
      aria-labelledby="final-cta-heading"
      className="relative scroll-mt-24 overflow-hidden border-b border-white/[0.05] bg-charcoal-950"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[360px] w-[720px] -translate-x-1/2 rounded-full bg-champagne-200/[0.07] blur-3xl"
      />
      <div className="relative mx-auto max-w-4xl px-6 py-24 text-center lg:px-10 lg:py-28">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
          The first safe step
        </div>
        <h2
          id="final-cta-heading"
          className="mt-4 font-light text-bone text-[30px] leading-[1.1] tracking-[-0.015em] sm:text-[48px]"
        >
          Ready to take the first safe step?
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-[15px] leading-relaxed text-bone/65">
          Preview the experience, apply without bank connection, or start with free
          templates. The first step should feel clear before it asks for trust.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#/apply"
            onClick={() => {
              track("final_security_cta_clicked", { target: "apply" });
              trackCtaByHref("#/apply", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-charcoal-950 transition-all hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)]"
          >
            Apply for the Monthly Finance Desk
          </a>
          <a
            href="#/sample-briefing"
            onClick={() => {
              track("final_security_cta_clicked", { target: "sample-briefing" });
              trackCtaByHref("#/sample-briefing", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/15 px-6 text-[13.5px] text-bone transition-colors hover:border-white/30 hover:bg-white/[0.03]"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#/templates"
            onClick={() => {
              track("final_security_cta_clicked", { target: "templates" });
              trackCtaByHref("#/templates", "security_faq_final");
            }}
            className="inline-flex min-h-11 items-center text-[13px] text-bone/55 underline-offset-4 transition-colors hover:text-bone hover:underline"
          >
            Start with free templates →
          </a>
        </div>
        <p className="mt-6 text-[12px] text-bone/45">
          No payment or bank connection required to apply.
        </p>
      </div>
    </section>
  );
}
