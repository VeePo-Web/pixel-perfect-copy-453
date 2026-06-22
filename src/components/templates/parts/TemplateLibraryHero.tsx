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
        <div className="absolute inset-0 bg-[radial-gradient(70%_50%_at_70%_0%,rgba(201,163,90,0.10),transparent_60%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(250,248,243,0))]" />
        <div className="absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />
      </div>
      <div className="relative mx-auto max-w-7xl px-6 pb-24 pt-32 sm:pt-36 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1.05fr_1.05fr] lg:gap-16">
          <div className="motion-safe:animate-section-in">
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
              GoldFin Template Vault · Free
            </div>
            <h1
              id="templates-hero-heading"
              className="mt-5 max-w-[22ch] font-light text-ink text-[42px] leading-[1.04] tracking-[-0.01em] sm:text-[56px] lg:text-[64px]"
            >
              Start organizing your numbers before they surprise you.
            </h1>
            <p className="mt-5 max-w-[54ch] text-[15.5px] leading-[1.7] text-ink/70">
              The full Vault — cash flow, expenses, hiring decisions, monthly reviews, and tax reserves — sent to your inbox. Built for owners who want a clearer financial view, free.
            </p>

            <HeroVaultCapture />

            <p className="mt-6">
              <a
                href="#/sample-briefing"
                className="text-[13px] text-ink/55 underline-offset-4 transition-colors hover:text-ink hover:underline"
              >
                Or see a sample briefing first →
              </a>
            </p>
          </div>

          {/* layered preview stack */}
          <div aria-hidden className="relative mx-auto h-[520px] w-full max-w-[560px] sm:h-[560px]">
            {heroIds.map((id, i) => {
              const t = templates.find((x) => x.id === id)!;
              const positions = [
                "left-[2%] top-[6%] -rotate-[6deg] z-10 w-[58%]",
                "left-[18%] top-[2%] -rotate-[2deg] z-20 w-[60%]",
                "left-1/2 -translate-x-1/2 top-[0%] z-40 w-[62%]",
                "right-[14%] top-[4%] rotate-[3deg] z-30 w-[58%]",
                "right-[2%] top-[8%] rotate-[7deg] z-10 w-[56%]",
              ];
              return (
                <div
                  key={id}
                  style={{ animationDelay: `${i * 90}ms` }}
                  className={`absolute ${positions[i]} motion-safe:animate-panel-rise`}
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
