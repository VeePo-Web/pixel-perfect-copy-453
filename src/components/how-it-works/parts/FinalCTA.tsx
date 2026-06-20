import { HIW_COPY } from "../content";
import { useInView } from "../hooks/useInView";

export default function FinalCTA() {
  const c = HIW_COPY.final;
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <div id="apply" ref={ref} className="relative overflow-hidden rounded-3xl border border-champagne-200/15 bg-charcoal-900/60 p-10 md:p-16 backdrop-blur-sm">
      <div className="absolute inset-x-10 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/50 to-transparent" />
      {/* Ghost cards */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -right-10 top-10 h-32 w-64 rotate-[-4deg] rounded-2xl border border-champagne-200/10 bg-charcoal-800/30 opacity-40 blur-[1px] motion-safe:animate-ghost-drift" />
        <div className="absolute -left-8 bottom-8 h-28 w-56 rotate-[3deg] rounded-2xl border border-champagne-200/10 bg-charcoal-800/20 opacity-30 blur-[1px] motion-safe:animate-ghost-drift" style={{ animationDelay: "-6s" }} />
        <div className="absolute right-1/3 bottom-0 h-24 w-48 rotate-[-2deg] rounded-2xl border border-champagne-200/10 bg-charcoal-800/20 opacity-25 blur-[1px] motion-safe:animate-ghost-drift" style={{ animationDelay: "-12s" }} />
      </div>

      <div className={`relative mx-auto max-w-3xl text-center transition-all duration-700 ease-cinema ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
        <h2 className="font-zentry text-[clamp(2rem,4.6vw,3.4rem)] leading-[1.05] tracking-tight text-ink">{c.headline}</h2>
        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/65">{c.sub}</p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-x-5 gap-y-3">
          <a
            href="#/templates"
            className="group relative overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-3.5 text-[13px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_10px_40px_-10px_rgba(217,190,130,0.55)]"
          >
            <span className="relative z-10">{c.primary}</span>
            <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
          </a>
          <a href="#/pricing#auto-fill" className="rounded-full border border-ink/15 px-6 py-3.5 text-[13px] text-ink/80 transition-all duration-300 hover:border-champagne-200/40 hover:text-ink">
            {c.secondary}
          </a>
          <a href="#/apply" className="text-[13px] text-ink/55 underline-offset-4 hover:text-champagne-100 hover:underline">
            {c.tertiary}
          </a>
        </div>
        <p className="mt-6 text-[11.5px] uppercase tracking-[0.22em] text-ink/35">{c.micro}</p>
      </div>
    </div>
  );
}
