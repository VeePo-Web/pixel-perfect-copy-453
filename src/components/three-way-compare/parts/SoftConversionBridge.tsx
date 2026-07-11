import { trackCtaByHref } from "../analytics";

const cards = [
  {
    eyebrow: "Preview",
    title: "Generate Sample Finance Briefing",
    body: "Preview the kind of plain-English briefing the GoldFin Desk creates.",
    cta: { label: "Generate Sample Briefing", href: "/sample-briefing" },
  },
  {
    eyebrow: "Start light",
    title: "Get Free Templates",
    body: "Start organizing cash flow, expenses, hiring decisions, and monthly review manually.",
    cta: { label: "Get Free Templates", href: "/templates" },
  },
  {
    eyebrow: "Understand",
    title: "See Pricing",
    body: "Understand what is included in the $150/mo GoldFin Desk.",
    cta: { label: "View Pricing", href: "/pricing" },
  },
];

export default function SoftConversionBridge() {
  return (
    <section
      aria-labelledby="soft-bridge-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-14 md:py-24 lg:px-10">
        <div className="max-w-[60ch]">
          <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-300/70">
            Not ready to apply yet?
          </div>
          <h2
            id="soft-bridge-heading"
            className="mt-3 font-light text-ink text-[28px] leading-[1.15] tracking-[-0.01em] sm:text-[36px]"
          >
            Three lighter ways to start.
          </h2>
        </div>

        <ul className="mt-10 grid gap-4 lg:grid-cols-3">
          {cards.map((c) => (
            <li
              key={c.title}
              className="group flex h-full flex-col rounded-2xl border border-ink/[0.07] bg-ink/[0.02] p-6 transition-all duration-300 ease-cinema hover:-translate-y-0.5 hover:border-champagne-200/30"
            >
              <div className="text-[10.5px] uppercase tracking-[0.26em] text-champagne-300/70">
                {c.eyebrow}
              </div>
              <h3 className="mt-2 text-[17px] font-display font-medium leading-snug text-ink">{c.title}</h3>
              <p className="mt-3 text-[13.5px] leading-relaxed text-ink/70">{c.body}</p>
              <a
                href={c.cta.href}
                onClick={() => trackCtaByHref(c.cta.href, "soft-bridge")}
                className="mt-auto inline-flex items-center gap-1.5 pt-5 text-[12.5px] text-ink/85 transition-all duration-300 ease-cinema group-hover:text-champagne-200"
              >
                {c.cta.label} <span aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
