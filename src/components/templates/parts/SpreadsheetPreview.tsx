import type { PreviewRow } from "../content";

type Props = {
  rows: PreviewRow[];
  title?: string;
  dense?: boolean;
  className?: string;
};

const toneClass = {
  neutral: "text-bone/80",
  positive: "text-green-signal",
  caution: "text-champagne-300",
  data: "text-bone",
} as const;

const toneDot = {
  neutral: "bg-ink/20",
  positive: "bg-green-signal",
  caution: "bg-champagne-300",
  data: "bg-champagne-200/70",
} as const;

export default function SpreadsheetPreview({
  rows,
  title = "Sheet preview",
  dense = false,
  className = "",
}: Props) {
  return (
    <div
      role="img"
      aria-label={`${title} — illustrative preview`}
      className={`relative overflow-hidden rounded-xl border border-ink/[0.07] bg-charcoal-900/60 ${className}`}
    >
      {/* sheet header chrome */}
      <div className="flex items-center justify-between border-b border-ink/[0.05] px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-ink/15" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/10" />
          <span className="h-1.5 w-1.5 rounded-full bg-ink/10" />
        </div>
        <span className="text-[9.5px] uppercase tracking-[0.24em] text-bone/40">{title}</span>
        <span className="h-px w-8 bg-ink/10" />
      </div>
      {/* faint grid */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 top-9 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:32px_28px]"
      />
      <div className={`relative ${dense ? "px-3 py-2.5" : "px-4 py-3.5"}`}>
        {rows.map((row) => {
          const t = row.tone ?? "neutral";
          return (
            <div
              key={row.label}
              className={`flex items-center justify-between gap-3 border-b border-ink/[0.04] last:border-b-0 ${
                dense ? "py-1.5" : "py-2"
              }`}
            >
              <div className="flex min-w-0 items-center gap-2">
                <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${toneDot[t]}`} />
                <span className={`truncate text-[12px] text-bone/65 ${dense ? "" : "tracking-tight"}`}>
                  {row.label}
                </span>
              </div>
              <span className={`shrink-0 text-[12.5px] tabular-nums ${toneClass[t]}`}>{row.value}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
