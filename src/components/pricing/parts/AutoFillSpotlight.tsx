import { autoFillOffer } from "../content";
import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";

export default function AutoFillSpotlight() {
  const o = autoFillOffer;
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      id="auto-fill"
      aria-labelledby="autofill-title"
      className="relative scroll-mt-24 border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_0%,rgba(201,163,90,0.10),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-24 lg:px-10">
        <div className="mb-10 max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            {o.eyebrow}
          </div>
          <h2
            id="autofill-title"
            className="mt-4 font-light text-ink text-[34px] leading-[1.1] tracking-[-0.005em] sm:text-[46px]"
          >
            {o.headline}
          </h2>
          <p className="mt-4 text-[15.5px] leading-[1.7] text-ink/70">{o.sub}</p>
        </div>

        {/* Pattern E — stacked offer card */}
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-3xl border border-champagne-200/35 bg-charcoal-900/70 backdrop-blur-sm shadow-[0_40px_120px_-40px_rgba(217,190,130,0.35)] transition-all duration-700 ease-cinema ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/60 to-transparent" />

          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:p-12">
            {/* Left — the stack */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne-200/40 bg-champagne-300/[0.06] px-3 py-1 text-[10.5px] uppercase tracking-[0.22em] text-champagne-300">
                <span className="h-1.5 w-1.5 rounded-full bg-champagne-200 motion-safe:animate-soft-pulse" />
                {o.name}
              </div>

              <ol className="mt-6 divide-y divide-ink/[0.06]">
                {o.stack.map((row) => (
                  <li
                    key={row.item}
                    className="flex items-baseline justify-between gap-4 py-3"
                  >
                    <span className="flex items-start gap-2.5 text-[14px] leading-[1.5] text-ink/85">
                      <span
                        aria-hidden
                        className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-champagne-200"
                      />
                      {row.item}
                    </span>
                    <span className="shrink-0 text-[12.5px] tabular-nums text-ink/45">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex items-baseline justify-between border-t border-champagne-200/25 pt-4">
                <span className="text-[11px] uppercase tracking-[0.24em] text-ink/50">
                  {o.totalValueLabel}
                </span>
                <span className="text-[18px] font-light tabular-nums text-ink/70 line-through decoration-champagne-300/50">
                  {o.totalValue}
                </span>
              </div>
            </div>

            {/* Right — the price + ask */}
            <div className="flex flex-col justify-center rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-7 sm:p-8">
              <div className="text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/70">
                Your price today
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-[60px] font-light leading-none tabular-nums text-ink">
                  {o.price}
                </span>
                <span className="text-[14px] text-ink/55">{o.priceSuffix}</span>
              </div>

              <button
                type="button"
                onClick={startAutoFillCheckout}
                className="group relative mt-7 flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-[13.5px] font-medium tracking-wide text-navy transition-all duration-400 ease-cinema hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-300/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white active:scale-[0.99]"
              >
                <span className="relative z-10">{o.cta}</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </button>

              <p className="mt-3 text-[12px] leading-[1.5] text-ink/55">{o.guarantee}</p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-ink/[0.06] pt-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-champagne-300/45 text-[10px] font-light tracking-tight text-champagne-300">
                  CS
                </span>
                <span className="text-[11px] uppercase tracking-[0.16em] text-ink/45">
                  Built by Chris Sam · institutional finance background
                </span>
              </div>
              <p className="mt-3 text-[11.5px] leading-[1.6] text-ink/45">{o.trust}</p>

              <a
                href="#/templates"
                className="mt-5 text-[12px] text-ink/50 underline-offset-4 transition-colors hover:text-champagne-300 hover:underline"
              >
                {o.microbridge}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
