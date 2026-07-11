import { useInView } from "../../how-it-works/hooks/useInView";
import { track } from "../analytics";

const cards = [
  {
    id: "bridge-reports",
    eyebrow: "Recommended · $150/mo",
    title: "Have it done for you",
    copy:
      "GoldFin Reports fills your templates from your numbers and briefs you in plain English — every month. No spreadsheet work.",
    cta: "Auto-fill my reports",
    href: "/pricing#auto-fill",
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
    href: "/sample-briefing",
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
    href: "/templates",
    event: "templates_clicked_from_compare" as const,
    tone: "muted" as const,
  },
];

export default function SoftConversionBridge() {
  const { ref, inView } = useInView<HTMLDivElement>();
  return (
    <section
      aria-labelledby="bridge-heading"
      className="relative border-b border-ink/[0.06] bg-white"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div
          className={`max-w-[60ch] transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="font-general text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Not ready to apply yet?
          </div>
          <h2
            id="bridge-heading"
            className="mt-3 font-display font-medium text-ink [text-wrap:balance] text-[28px] leading-[1.15] tracking-[-0.02em] sm:text-[36px]"
          >
            Start with the financial clarity test.
          </h2>
        </div>
        <ul
          className={`mt-9 grid gap-4 lg:grid-cols-3 transition-all duration-700 ease-cinema delay-150 ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          {cards.map((c) => (
            <li key={c.id}>
              <a
                href={c.href}
                onClick={() => {
                  if (c.event) track(c.event, { source: "soft-bridge" });
                }}
                className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border p-6 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/40 focus-visible:ring-offset-2 ${
                  c.tone === "flagship"
                    ? "border-champagne-200/50 bg-champagne-50/40 shadow-[0_1px_2px_rgba(11,13,18,0.04)]"
                    : "border-ink/[0.08] bg-white shadow-[0_1px_2px_rgba(11,13,18,0.04)] hover:border-ink/[0.16]"
                }`}
              >
                {c.tone === "flagship" ? (
                  <span
                    aria-hidden
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-champagne-200/70 to-transparent"
                  />
                ) : null}
                <div className={`font-general text-[10.5px] uppercase tracking-[0.28em] ${c.tone === "flagship" ? "text-champagne-300/70" : "text-ink/45"}`}>
                  {c.eyebrow}
                </div>
                <div className="mt-2 text-[18px] font-medium leading-snug text-ink">{c.title}</div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink/65">{c.copy}</p>
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] text-ink/85 transition-colors group-hover:text-champagne-300">
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
