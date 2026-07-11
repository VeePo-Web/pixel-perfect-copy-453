import SpreadsheetPreview from "./SpreadsheetPreview";
import HeroVaultCapture from "./HeroVaultCapture";
import { templates } from "../content";

const heroIds = [
  "owner-command-center",
  "13-week-cash-map",
  "cash-basis-pnl",
  "expense-vendor-audit",
];

export default function TemplateLibraryHero() {
  return (
    <section
      aria-labelledby="templates-hero-heading"
      className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,#0B0D12_1px,transparent_1px),linear-gradient(to_bottom,#0B0D12_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      <div className="relative mx-auto max-w-4xl px-6 pb-12 pt-28 text-center sm:pt-32 lg:px-10">
        <div className="motion-safe:animate-section-in mx-auto">
          <div className="flex items-center justify-center gap-2 font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            <span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70" />
            GoldFin Template Vault - Free
          </div>
          <h1
            id="templates-hero-heading"
            className="mx-auto mt-5 max-w-[20ch] font-display font-medium text-ink [text-wrap:balance] text-[38px] leading-[1.06] tracking-[-0.02em] sm:text-[52px] lg:text-[58px]"
          >
            Start organizing your numbers before they surprise you.
          </h1>
          <p className="mx-auto mt-5 max-w-[56ch] text-[15.5px] leading-[1.7] [text-wrap:pretty] text-ink/70">
            The launch XLSX Vault - command center, cash map, cash-basis P&L, and expense audit - sent to your inbox. Free.
          </p>
        </div>

        <div
          className="mt-8 motion-safe:animate-section-in"
          style={{ animationDelay: "80ms" }}
        >
          <HeroVaultCapture />
        </div>

        <p
          className="mt-5 motion-safe:animate-section-in"
          style={{ animationDelay: "160ms" }}
        >
          <a
            href="/sample-briefing"
            className="text-[13px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
          >
            Or see a sample briefing first
          </a>
        </p>
      </div>

      <div aria-hidden className="pointer-events-none relative mx-auto max-w-6xl px-6 pb-10 lg:px-10">
        <div className="h-[180px] overflow-hidden sm:h-[220px] [mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)] [-webkit-mask-image:linear-gradient(to_bottom,black_45%,transparent_98%)]">
          <div className="grid grid-cols-2 items-start gap-4 sm:grid-cols-4">
            {heroIds.map((id, i) => {
              const t = templates.find((x) => x.id === id);
              if (!t) return null;
              const offsets = ["mt-10", "mt-5", "mt-0", "mt-5"];
              const visibility = ["", "", "hidden sm:block", "hidden sm:block"];
              return (
                <div
                  key={id}
                  style={{ animationDelay: `${i * 90 + 250}ms` }}
                  className={`${offsets[i]} ${visibility[i]} motion-safe:animate-panel-rise`}
                >
                  <SpreadsheetPreview rows={t.previewRows.slice(0, 5)} title={t.shortName} dense />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
