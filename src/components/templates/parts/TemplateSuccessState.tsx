import type { TemplateItem } from "../content";
import { startAutoFillCheckout } from "../../../lib/checkout";
import { track } from "../analytics";

type Props = {
  template: TemplateItem;
  onClose: () => void;
  headingId: string;
};

const TEMPLATE_DOWNLOADS: Record<string, string> = {
  "owner-command-center": "/downloads/goldfin-owner-command-center-sample.xlsx",
  "13-week-cash-map": "/downloads/goldfin-13-week-cash-map-sample.xlsx",
  "cash-basis-pnl": "/downloads/goldfin-cash-basis-p-l-review-sample.xlsx",
  "expense-vendor-audit": "/downloads/goldfin-expense-and-vendor-audit-sample.xlsx",
};

// Full Vault = one zip, all four workbooks — matches what the delivery email sends.
const VAULT_ZIP = "/downloads/goldfin-template-vault.zip";

export default function TemplateSuccessState({ template, onClose, headingId }: Props) {
  const single = TEMPLATE_DOWNLOADS[template.id];
  const downloadHref = single ?? VAULT_ZIP;
  const isZip = !single;

  return (
    <div className="p-6 sm:p-7">
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/70">
            Sent
          </div>
          <h2 id={headingId} className="mt-2 text-[22px] font-display font-medium leading-snug text-ink">
            Your template is on its way.
          </h2>
          <p className="mt-2 text-[13.5px] text-ink/65">
            Check your inbox for the {template.shortName} download link, or download the Excel workbook now.
          </p>
        </div>
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="rounded-full border border-ink/[0.08] px-2.5 py-1 text-[11px] text-ink/60 hover:text-ink"
        >
          ✕
        </button>
      </div>

      <div className="mt-6 space-y-3">
        <a
          href={downloadHref}
          download
          className="block rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-4 transition-all duration-300 ease-cinema hover:border-champagne-200/40"
        >
          <div className="text-[15px] font-medium text-ink">
            {isZip ? "Download the full Vault (.zip)" : `Download ${template.shortName} (.xlsx)`}
          </div>
          <div className="mt-1 text-[12.5px] text-ink/55">
            {isZip
              ? "All four Excel workbooks — Command Center, 13-Week Cash Map, P&L Review, Expense & Vendor Audit."
              : "GoldFin-branded Excel workbook with hidden methodology tabs."}
          </div>
        </a>
        <button
          type="button"
          onClick={() => { startAutoFillCheckout(); track("autofill_clicked_from_templates", { source: "success", templateId: template.id }); }}
          className="group block rounded-2xl border border-champagne-200/45 bg-champagne-50/60 p-4 text-left shadow-[0_18px_45px_-30px_rgba(184,137,58,0.42)] transition-all duration-300 ease-cinema hover:-translate-y-px hover:border-champagne-200/70"
        >
          <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">Recommended next · $150/mo</div>
          <div className="mt-1.5 text-[15px] font-medium text-ink">Have it filled for you every month</div>
          <div className="mt-1 text-[12.5px] text-ink/60">Same template, auto-filled from your numbers, with a plain-English briefing. Cancel anytime.</div>
          <div className="mt-4 inline-flex rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-4 py-2 text-[12.5px] font-medium text-ink transition-transform duration-300 ease-cinema group-hover:translate-x-0.5">
            Auto-fill my reports →
          </div>
        </button>
        <a
          href="/sample-briefing"
          onClick={() => track("sample_briefing_clicked_from_templates", { source: "success", templateId: template.id })}
          className="block rounded-2xl border border-ink/[0.08] bg-ink/[0.02] p-4 transition-all duration-300 ease-cinema hover:border-ink/20"
        >
          <div className="text-[15px] text-ink">See a sample briefing first</div>
          <div className="mt-1 text-[12.5px] text-ink/55">Watch what "filled for you" actually looks like — no bank connection.</div>
        </a>
        <button
          type="button"
          onClick={onClose}
          className="block w-full rounded-2xl border border-ink/[0.06] bg-transparent p-4 text-left transition-colors hover:border-ink/15"
        >
          <div className="text-[15px] text-ink/85">Browse more templates</div>
          <div className="mt-1 text-[12.5px] text-ink/50">Keep exploring the library.</div>
        </button>
      </div>
    </div>
  );
}
