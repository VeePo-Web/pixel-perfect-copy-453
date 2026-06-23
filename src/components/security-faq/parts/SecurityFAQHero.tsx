import { trustFlowSteps } from "../content";
import { trackCtaByHref } from "../analytics";
import TrustFlowDiagram from "./TrustFlowDiagram";

export default function SecurityFAQHero() {
  return (
    <section
      id="trust-flow"
      className="relative scroll-mt-24 overflow-hidden border-b border-ink/[0.05] bg-charcoal-950 pt-28 lg:pt-32"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(237,231,218,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(237,231,218,0.06) 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at 50% 0%, black 30%, transparent 75%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-champagne-200/[0.08] blur-3xl"
      />
      <div className="relative mx-auto max-w-6xl px-6 py-20 lg:px-10 lg:py-24 motion-safe:animate-section-in">
        <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
          Security & FAQ
        </div>
        <h1 className="mt-5 max-w-4xl font-light text-ink text-[34px] leading-[1.08] tracking-[-0.015em] sm:text-[48px] lg:text-[62px]">
          Preview safely. Apply without connecting your bank.
        </h1>
        <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-ink/65 sm:text-[16.5px]">
          You can preview the GoldFin Desk experience with demo data or
          rough non-sensitive numbers, then apply without payment, documents, or
          bank access. Bank connection only becomes relevant after onboarding.
        </p>
        <div className="mt-9 flex flex-wrap items-center gap-3">
          <a
            href="#/sample-briefing"
            onClick={() =>
              trackCtaByHref("#/sample-briefing", "security_faq_hero")
            }
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-6 text-[13.5px] font-medium text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_10px_36px_-10px_rgba(217,190,130,0.55)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            Generate Sample Finance Briefing
          </a>
          <a
            href="#/pricing#auto-fill"
            onClick={() => trackCtaByHref("#/pricing#auto-fill", "security_faq_hero")}
            className="inline-flex min-h-11 items-center gap-2 rounded-full border border-ink/15 px-6 text-[13.5px] text-ink transition-all duration-300 ease-cinema hover:border-ink/30 hover:bg-ink/[0.03] active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink/25 focus-visible:ring-offset-2"
          >
            Auto-fill my reports â€” $99/mo
          </a>
          <a
            href="#/templates"
            onClick={() => trackCtaByHref("#/templates", "security_faq_hero")}
            className="inline-flex min-h-11 items-center text-[13px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Start with free templates â†’
          </a>
        </div>
        <p className="mt-5 inline-flex items-center gap-2 text-[12px] text-ink/45">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400/70"
          />
          No bank connection required to preview or apply.
        </p>
        <div className="mt-14">
          <TrustFlowDiagram steps={trustFlowSteps} />
        </div>
      </div>
    </section>
  );
}
