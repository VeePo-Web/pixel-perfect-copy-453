import { HIW_COPY } from "../content";
import { useInView } from "../hooks/useInView";

export default function FinalCTA() {
  const c = HIW_COPY.final;
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div
      id="apply"
      ref={ref}
      className="relative overflow-hidden rounded-3xl border border-champagne-200/15 bg-ink p-10 md:p-16"
    >
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
      {/* Ghost cards — decorative depth on the dark peak */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-10 h-32 w-64 rotate-[-4deg] rounded-2xl border border-champagne-200/10 bg-ink-muted/20 opacity-40 blur-[1px] motion-safe:animate-ghost-drift" />
        <div className="absolute -left-8 bottom-8 h-28 w-56 rotate-[3deg] rounded-2xl border border-champagne-200/10 bg-ink-muted/15 opacity-30 blur-[1px] motion-safe:animate-ghost-drift" style={{ animationDelay: "-6s" }} />
        <div className="absolute right-1/3 bottom-0 h-24 w-48 rotate-[-2deg] rounded-2xl border border-champagne-200/10 bg-ink-muted/15 opacity-25 blur-[1px] motion-safe:animate-ghost-drift" style={{ animationDelay: "-12s" }} />
      </div>

      <div
        className={`relative mx-auto max-w-3xl text-center transition-all duration-700 ease-cinema ${
          inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }`}
      >
        <h2 className="font-robert-medium text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] tracking-tight text-bone">
          {c.headline}
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-bone/65">{c.sub}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <a
            href="#/pricing#auto-fill"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_12px_40px_-8px_rgba(212,168,69,0.45)] active:scale-[0.97] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            <span className="relative z-10">{c.primary}</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a
            href="#/templates"
            className="rounded-full border border-bone/20 px-6 py-3.5 text-[13px] text-bone/80 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
          >
            {c.secondary}
          </a>
          <a
            href="#/apply"
            className="text-[13px] text-bone/50 underline-offset-4 transition-colors duration-300 hover:text-champagne-300 hover:underline"
          >
            {c.tertiary}
          </a>
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-bone/35">{c.micro}</p>
      </div>
    </div>
  );
}
