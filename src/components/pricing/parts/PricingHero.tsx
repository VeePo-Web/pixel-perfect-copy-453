import { startAutoFillCheckout } from "../../../lib/checkout";
export default function PricingHero() {
  const tiers = [
    { name: "GoldFin Template Vault", price: "Free", muted: true },
    { name: "GoldFin Reports", price: "$99/mo", flagship: true },
    { name: "GoldFin Advisory", price: "$1,500/mo", muted: true },
  ];
  return (
    <section className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950">
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,248,243,0))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.1fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              Pricing
            </div>
            <h1 className="mt-5 max-w-[24ch] font-light text-ink text-[38px] leading-[1.08] tracking-[-0.01em] sm:text-[50px] lg:text-[58px]">
              Free templates. <span className="text-champagne-300">$99 to have them filled for you.</span> $1,500 to have them read with you.
            </h1>
            <p className="mt-6 max-w-[56ch] text-[15.5px] leading-[1.7] text-ink/70">
              Most owners don’t need a full finance team — they need their numbers organized and explained every month. That’s the $99 Auto-Fill plan. Start there.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <button
                type="button" onClick={startAutoFillCheckout}
                className="group relative w-full overflow-hidden rounded-full bg-gradient-to-b from-champagne-100 to-champagne-300 px-7 py-4 text-center text-[13px] font-medium tracking-wide text-navy transition-all duration-300 ease-cinema sm:w-auto sm:py-3.5 hover:-translate-y-0.5 hover:shadow-[0_14px_50px_-12px_rgba(217,190,130,0.6)] active:translate-y-0 active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                <span className="relative z-10">Auto-fill my reports — $99/mo</span>
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-ink/40 to-transparent motion-safe:animate-shimmer-slow" />
              </button>
              <a
                href="/sample-briefing"
                className="rounded-full border border-ink/[0.12] px-6 py-3.5 text-[13px] text-ink/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-ink active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                See a sample briefing
              </a>
              <a
                href="/templates"
                className="rounded text-[12.5px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-ink"
              >
                Or start with free templates
              </a>
            </div>
            <p className="mt-4 text-[11.5px] uppercase tracking-[0.2em] text-ink/50">
              No contracts · Cancel anytime · No bank connection required to start
            </p>
          </div>

          {/* Layered preview cards */}
          <div aria-hidden className="relative h-[460px] lg:h-[520px]">
            {tiers.map((t, i) => {
              const positions = [
                "left-0 top-2 rotate-[-3deg] z-10",
                "left-1/2 -translate-x-1/2 top-0 z-30",
                "right-0 top-6 rotate-[3deg] z-20",
              ];
              return (
                <div
                  key={t.name}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className={`absolute ${positions[i]} w-[68%] sm:w-[58%] lg:w-[300px] motion-safe:animate-panel-rise`}
                >
                  <div
                    className={`overflow-hidden rounded-2xl border backdrop-blur-sm ${
                      t.flagship
                        ? "border-champagne-200/40 bg-charcoal-900/80 shadow-[0_30px_80px_-30px_rgba(217,190,130,0.45)]"
                        : "border-ink/[0.07] bg-charcoal-900/60"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/40 to-transparent" />
                    <div className="px-5 pb-6 pt-5">
                      <div className="text-[10px] uppercase tracking-[0.28em] text-champagne-300/70">
                        {t.flagship ? "Recommended" : "Tier"}
                      </div>
                      <div className="mt-2 text-[15px] text-ink">{t.name}</div>
                      <div className={`mt-4 font-light tabular-nums ${t.flagship ? "text-[36px] text-ink" : "text-[26px] text-ink/80"}`}>
                        {t.price}
                      </div>
                      <div className="mt-5 space-y-2">
                        {[0, 1, 2, 3].map((k) => (
                          <div key={k} className="flex items-center gap-2">
                            <span className={`h-1.5 w-1.5 rounded-full ${t.flagship ? "bg-champagne-200" : "bg-ink/15"}`} />
                            <span className={`h-1.5 rounded ${t.flagship ? "bg-ink/15" : "bg-ink/[0.06]"}`} style={{ width: `${50 + ((k * 13) % 35)}%` }} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
