import { track } from "../analytics";

const cards = [
  {
    id: "bridge-reports",
    eyebrow: "Recommended · $99/mo",
    title: "Have it done for you",
    copy:
      "GoldFin Reports fills your templates from your numbers and briefs you in plain English — every month. No spreadsheet work.",
    cta: "Auto-fill my reports",
    href: "#/pricing#auto-fill",
    event: "autofill_clicked_from_compare" as const,
    tone: "flagship" as const,
  },
  {
    id: "bridge-sample",
    eyebrow: "Preview",
    title: "Generate a sample briefing",
    copy:
      "Use demo data or rough non-sensitive numbers to see what a plain-English financial briefing feels like.",
    cta: "Generate sample briefing",
    href: "#/sample-briefing",
    event: "sample_briefing_clicked_from_compare" as const,
    tone: "muted" as const,
  },
  {
    id: "bridge-templates",
    eyebrow: "Free",
    title: "Get the free Template Vault",
    copy:
      "Start organizing cash flow, expenses, hiring decisions, and monthly review yourself — free.",
    cta: "Send me the Vault",
    href: "#/templates",
    event: "templates_clicked_from_compare" as const,
    tone: "muted" as const,
  },
];

export default function SoftConversionBridge() {
  return (
    <section
      aria-labelledby="bridge-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
            Not ready to apply yet?
          </div>
          <h2
            id="bridge-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Start with the financial clarity test.
          </h2>
        </div>
        <ul className="mt-9 grid gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <li key={c.id}>
              <a
                href={c.href}
                onClick={() => {
                  if (c.event) track(c.event, { source: "soft-bridge" });
                }}
                className={`group flex h-full flex-col rounded-2xl border p-6 transition-all duration-400 ease-cinema hover:-translate-y-0.5 ${
                  c.tone === "flagship"
                    ? "border-champagne-200/40 bg-charcoal-900/70 shadow-[0_30px_70px_-30px_rgba(217,190,130,0.35)]"
                    : "border-ink/[0.07] bg-ink/[0.02] hover:border-champagne-200/25"
                }`}
              >
                <div className={`text-[10.5px] uppercase tracking-[0.28em] ${c.tone === "flagship" ? "text-champagne-200/85" : "text-ink/45"}`}>
                  {c.eyebrow}
                </div>
                <div className="mt-2 text-[18px] font-light leading-snug text-ink">{c.title}</div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/65">{c.copy}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] text-ink/85 transition-colors group-hover:text-champagne-200">
                  {c.cta} <span aria-hidden>→</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
