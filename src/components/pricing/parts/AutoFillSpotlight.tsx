import { autoFillOffer } from "../content";
import { useInView } from "../../how-it-works/hooks/useInView";
import { startAutoFillCheckout } from "../../../lib/checkout";
import {
  buildSampleTemplatesCsv,
  SAMPLE_TEMPLATES_FILENAME,
} from "../../../lib/finance/sampleTemplates";

export default function AutoFillSpotlight() {
  const o = autoFillOffer;
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  function downloadCsvFallback() {
    const blob = new Blob([buildSampleTemplatesCsv()], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = SAMPLE_TEMPLATES_FILENAME;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <section
      id="auto-fill"
      aria-labelledby="autofill-title"
      className="relative scroll-mt-24 border-b border-ink/[0.06] bg-white"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_42%_at_50%_0%,rgba(201,163,90,0.08),transparent_65%)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-20 md:py-28 lg:px-10">
        <div className="mb-10 max-w-[60ch]">
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/80">
            {o.eyebrow}
          </div>
          <h2
            id="autofill-title"
            className="mt-5 font-display font-medium text-ink [text-wrap:balance] text-[34px] leading-[1.08] tracking-[-0.02em] sm:text-[46px]"
          >
            {o.headline}
          </h2>
          <p className="mt-6 text-[15.5px] leading-[1.7] text-ink/70">{o.sub}</p>
        </div>

        {/* Pattern E: stacked offer card. */}
        <div
          ref={ref}
          className={`relative overflow-hidden rounded-3xl border border-ink/[0.08] bg-white shadow-[0_24px_70px_-28px_rgba(11,13,18,0.16),0_14px_44px_-24px_rgba(184,137,58,0.22)] transition-all duration-700 ease-cinema ${
            inView ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
          }`}
        >
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-300 to-transparent" />

          <div className="grid gap-10 p-8 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-14 lg:p-12">
            {/* Left: the stack */}
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-champagne-200/50 bg-champagne-50/50 px-3 py-1 font-general text-[10.5px] uppercase tracking-[0.22em] text-champagne-300">
                <span className="h-1.5 w-1.5 rounded-full bg-champagne-200" />
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
                    <span className="shrink-0 font-general text-[12px] tabular-nums text-ink/45">
                      {row.value}
                    </span>
                  </li>
                ))}
              </ol>

              <div className="mt-5 flex items-baseline justify-between border-t border-champagne-200/40 pt-4">
                <span className="font-general text-[10.5px] uppercase tracking-[0.24em] text-ink/45">
                  {o.totalValueLabel}
                </span>
                <span className="font-general text-[16px] tabular-nums text-ink/60 line-through decoration-champagne-300/50">
                  {o.totalValue}
                </span>
              </div>
            </div>

            {/* Right: the price and ask */}
            <div className="flex flex-col justify-center rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-7 sm:p-8">
              <div className="font-general text-[10.5px] uppercase tracking-[0.24em] text-champagne-300/80">
                Your price today
              </div>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="font-display text-[60px] font-medium leading-none tracking-[-0.01em] tabular-nums text-ink">
                  {o.price}
                </span>
                <span className="text-[14px] text-ink/55">{o.priceSuffix}</span>
              </div>

              <button
                type="button"
                onClick={startAutoFillCheckout}
                className="mt-7 flex w-full items-center justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-4 text-[13.5px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2 focus-visible:ring-offset-white"
              >
                {o.cta}
              </button>

              <p className="mt-3 text-[12px] leading-[1.5] text-ink/55">{o.guarantee}</p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-ink/[0.06] pt-4">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-champagne-300/45 font-general text-[10px] text-champagne-300">
                  CS
                </span>
                <span className="font-general text-[10.5px] uppercase tracking-[0.16em] text-ink/45">
                  Built by Chris Sam - institutional finance background
                </span>
              </div>
              <p className="mt-3 text-[11.5px] leading-[1.6] text-ink/45">{o.trust}</p>

              <a
                href="/downloads/goldfin-template-vault.xlsx"
                download
                className="mt-5 self-start rounded-full border border-champagne-300/40 px-4 py-1.5 text-[12px] text-champagne-300 transition-colors duration-200 ease-cinema hover:border-champagne-300/60 hover:bg-champagne-50/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50"
              >
                See a filled sample (.xlsx)
              </a>

              <button
                type="button"
                onClick={downloadCsvFallback}
                className="mt-2 self-start text-[11.5px] text-ink/45 underline-offset-4 transition-colors hover:text-champagne-300 hover:underline"
              >
                CSV fallback
              </button>

              <a
                href="/templates"
                className="mt-4 text-[12px] text-ink/50 underline-offset-4 transition-colors hover:text-champagne-300 hover:underline"
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
