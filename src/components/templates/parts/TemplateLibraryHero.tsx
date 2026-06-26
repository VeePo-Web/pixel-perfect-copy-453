import SpreadsheetPreview from "./SpreadsheetPreview";
import HeroVaultCapture from "./HeroVaultCapture";
import { templates } from "../content";

const heroIds = ["cash-flow-forecast", "monthly-review", "hiring-calculator", "expense-audit", "tax-reserve"];

export default function TemplateLibraryHero() {
  return (
    <section
      aria-labelledby="templates-hero-heading"
      className="relative isolate overflow-hidden border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 opacity-[0.04] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>

      {/* Pattern B — Centered squeeze, single column, form is the sole visual focus */}
      <div className="relative mx-auto max-w-3xl px-6 pb-12 pt-28 text-center sm:pt-32 lg:px-10">
        <div className="motion-safe:animate-section-in mx-auto max-w-[56ch]">
          <div className="flex items-center gap-2 text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70"><span aria-hidden className="inline-block h-1.5 w-1.5 rounded-full bg-champagne-300/70" />
            GoldFin Template Vault · Free
          </div>
          <h1
            id="templates-hero-heading"
            className="mt-5 font-light text-ink [text-wrap:balance] text-[38px] leading-[1.06] tracking-[-0.01em] sm:text-[52px] lg:text-[58px]"
          >
            Start organizing your numbers before they surprise you.
          </h1>
          <p className="mt-5 text-[15.5px] leading-[1.7] text-ink/70">
            The full Vault — cash flow, expenses, hiring decisions, monthly reviews, and tax reserves — sent to your inbox. Free.
          </p>
        </div>

        {/* HeroVaultCapture is the sole conversion element */}
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
            Or see a sample briefing first →
          </a>
        </p>
      </div>

      {/* Proof element — spreadsheet stacks below the form (what's inside the vault) */}
      <div aria-hidden className="pointer-events-none relative mx-auto max-w-5xl overflow-hidden px-6 pb-16 lg:px-10">
        <div className="relative h-[240px] sm:h-[300px]">
          {heroIds.map((id, i) => {
            const t = templates.find((x) => x.id === id)!;
            const positions = [
              "left-[2%] top-[12%] -rotate-[6deg] z-10 w-[22%]",
              "left-[20%] top-[4%] -rotate-[2deg] z-20 w-[23%]",
              "left-1/2 -translate-x-1/2 top-[0%] z-40 w-[24%]",
              "right-[17%] top-[6%] rotate-[3deg] z-30 w-[22%]",
              "right-[2%] top-[14%] rotate-[7deg] z-10 w-[21%]",
            ];
            return (
              <div
                key={id}
                style={{ animationDelay: `${i * 90 + 250}ms` }}
                className={`absolute ${positions[i]} motion-safe:animate-panel-rise`}
              >
                <SpreadsheetPreview rows={t.previewRows.slice(0, 5)} title={t.shortName} dense />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
