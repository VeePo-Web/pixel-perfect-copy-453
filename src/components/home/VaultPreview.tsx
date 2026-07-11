import { useInView } from "../how-it-works/hooks/useInView";

type IconKey = "command" | "cashflow" | "pnl" | "expense";

const ICONS: Record<IconKey, JSX.Element> = {
  command: <><path d="M4 5h16M4 12h16M4 19h16" /><path d="M8 5v14M16 5v14" /></>,
  cashflow: <><path d="M3 17l5-5 4 3 8-9" /><path d="M21 6v5h-5" /></>,
  pnl: <><path d="M5 4h14v16H5z" /><path d="M8 9h8M8 13h8M8 17h5" /></>,
  expense: <><circle cx="11" cy="11" r="6" /><path d="M20.5 20.5L17 17" /></>,
};

interface VaultItem {
  icon: IconKey;
  label: string;
  decision: string;
  rows: { key: string; value: string }[];
}

const VAULT: VaultItem[] = [
  {
    icon: "command",
    label: "Owner Command Center",
    decision: "What should I look at first?",
    rows: [
      { key: "Cash on hand", value: "$84,200" },
      { key: "Net cash", value: "+$44,860" },
      { key: "Runway", value: "0.44 mo" },
    ],
  },
  {
    icon: "cashflow",
    label: "13-Week Cash Map",
    decision: "Will cash feel tight next quarter?",
    rows: [
      { key: "Starting cash", value: "$84,200" },
      { key: "Weekly in", value: "+$66,200" },
      { key: "Week 13 cash", value: "$375,790" },
    ],
  },
  {
    icon: "pnl",
    label: "Cash-Basis P&L Review",
    decision: "Is operating activity actually profitable?",
    rows: [
      { key: "Deposits", value: "$132,400" },
      { key: "Outflow", value: "-$87,540" },
      { key: "Profit proxy", value: "$44,860" },
    ],
  },
  {
    icon: "expense",
    label: "Expense And Vendor Audit",
    decision: "Where did the money go?",
    rows: [
      { key: "Outflow", value: "$87,540" },
      { key: "Duplicate-like", value: "1" },
      { key: "Biggest mover", value: "Software" },
    ],
  },
];

export default function VaultPreview() {
  const { ref, inView } = useInView<HTMLDivElement>({ threshold: 0.15 });

  return (
    <section
      aria-labelledby="vault-preview-title"
      className="border-b border-ink/[0.06] bg-[#FCFBF9]"
    >
      <div ref={ref} className="mx-auto max-w-7xl px-6 py-20 md:py-28 lg:px-10">
        <div className="mb-14 max-w-[44ch]">
          <div
            className={`font-general text-[10px] uppercase tracking-[0.28em] text-champagne-300 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
          >
            The Template Vault
          </div>

          <h2
            id="vault-preview-title"
            className={`mt-4 font-display text-[clamp(1.75rem,3.8vw,2.75rem)] font-medium leading-[1.08] tracking-[-0.02em] text-ink [text-wrap:balance] transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "80ms" }}
          >
            Four templates. Every one Plaid-fillable.
          </h2>

          <p
            className={`mt-4 text-[16px] leading-[1.65] text-ink/60 transition-all duration-700 ease-cinema ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
            }`}
            style={{ transitionDelay: "160ms" }}
          >
            The launch Vault focuses on the sheets that produce the most owner clarity from business bank and card activity.
          </p>
        </div>

        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {VAULT.map((item, i) => (
            <li
              key={item.label}
              className={`group transition-all duration-700 ease-cinema ${
                inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: inView ? `${200 + i * 60}ms` : "0ms" }}
            >
              <div className="h-full rounded-2xl border border-ink/[0.08] bg-white p-6 shadow-[0_1px_2px_rgba(11,13,18,0.04)] transition-all duration-300 ease-cinema group-hover:-translate-y-0.5 group-hover:shadow-[0_16px_40px_-20px_rgba(11,13,18,0.18)]">
                <div
                  className="mb-4 flex h-9 w-9 items-center justify-center rounded-lg border border-ink/[0.08] bg-white text-champagne-300"
                  aria-hidden
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    {ICONS[item.icon]}
                  </svg>
                </div>

                <p className="text-[15px] font-medium leading-snug text-ink">
                  {item.label}
                </p>

                <p className="mt-1.5 text-[13px] leading-relaxed text-ink/55">
                  {item.decision}
                </p>

                <div className="mt-4 rounded-lg border border-ink/[0.06] bg-[#FCFBF9] px-3 py-2">
                  {item.rows.map((row) => (
                    <div
                      key={row.key}
                      className="flex items-baseline justify-between gap-3 border-b border-ink/[0.05] py-1 last:border-b-0"
                    >
                      <span className="font-general text-[10px] text-ink/45">{row.key}</span>
                      <span className="font-general text-[10.5px] tabular-nums text-ink/75">{row.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>

        <div
          className={`mt-14 flex flex-col items-center gap-3 transition-all duration-700 ease-cinema ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
          style={{ transitionDelay: `${200 + VAULT.length * 60 + 120}ms` }}
        >
          <a
            href="/templates"
            className="inline-flex w-full justify-center rounded-full bg-gradient-to-b from-champagne-100 to-champagne-200 px-7 py-4 text-[13px] font-medium text-ink shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_1px_2px_rgba(11,13,18,0.10)] transition-all duration-300 ease-cinema sm:w-auto sm:py-3.5 hover:-translate-y-px hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_10px_28px_-10px_rgba(184,137,58,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200 focus-visible:ring-offset-2"
          >
            Get the free XLSX vault
          </a>

          <p className="font-general text-[11px] uppercase tracking-[0.22em] text-ink/40">
            Free - No account required - Instant access
          </p>
        </div>
      </div>
    </section>
  );
}
