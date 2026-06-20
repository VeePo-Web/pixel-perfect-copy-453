export default function PainToValueReframe() {
  const before = [
    "Bank balance",
    "Scattered expenses",
    "Unclear payroll pressure",
    "Tax anxiety",
    "Manual spreadsheets",
  ];
  const after = [
    "Cash flow forecast",
    "Expense audit",
    "Hiring affordability check",
    "Monthly review",
    "Tax reserve tracker",
  ];
  return (
    <section
      aria-labelledby="reframe-heading"
      className="relative border-b border-ink/[0.05] bg-charcoal-950"
    >
      <div className="mx-auto max-w-7xl px-6 py-24 lg:px-10">
        <div className="grid items-start gap-14 lg:grid-cols-[1fr_1.1fr]">
          <div>
            <div className="text-[10.5px] uppercase tracking-[0.32em] text-champagne-200/80">
              Why this matters
            </div>
            <h2
              id="reframe-heading"
              className="mt-4 max-w-[22ch] font-light text-bone text-[32px] leading-[1.1] tracking-[-0.01em] sm:text-[44px]"
            >
              Most owners do not need more numbers. They need a clearer way to review them.
            </h2>
            <p className="mt-5 max-w-[58ch] text-[15px] leading-[1.7] text-bone/70">
              Your bank balance tells you what is left. Your bookkeeping tells you what happened. Your spreadsheets only help when someone has time to update them. These templates give you a better starting structure — so you can review cash flow, expenses, hiring, and monthly decisions with more clarity.
            </p>
            <a
              href="#template-grid"
              className="mt-7 inline-flex items-center gap-2 rounded-full border border-ink/[0.12] px-5 py-2.5 text-[12.5px] text-bone/85 transition-all duration-300 ease-cinema hover:border-champagne-200/40 hover:text-bone"
            >
              Browse the Template Library <span aria-hidden>→</span>
            </a>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Column title="Before" tone="muted" items={before} />
            <Column title="After" tone="lit" items={after} />
          </div>
        </div>
      </div>
    </section>
  );
}

function Column({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone: "muted" | "lit";
}) {
  const isLit = tone === "lit";
  return (
    <div
      className={`rounded-2xl border p-6 ${
        isLit
          ? "border-champagne-200/30 bg-charcoal-900/70 shadow-[0_30px_80px_-40px_rgba(217,190,130,0.35)]"
          : "border-ink/[0.07] bg-ink/[0.02]"
      }`}
    >
      <div
        className={`text-[10.5px] uppercase tracking-[0.28em] ${
          isLit ? "text-champagne-200/85" : "text-bone/45"
        }`}
      >
        {title}
      </div>
      <ul className="mt-4 space-y-2.5">
        {items.map((x) => (
          <li key={x} className="flex items-center gap-3">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                isLit ? "bg-champagne-200" : "bg-ink/15"
              }`}
            />
            <span className={`text-[14px] ${isLit ? "text-bone" : "text-bone/55"}`}>{x}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
