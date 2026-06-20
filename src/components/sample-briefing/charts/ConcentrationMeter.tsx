type Props = { value: number; label?: string };

export default function ConcentrationMeter({ value, label = "Top-3 client share" }: Props) {
  const pct = Math.max(0, Math.min(1, value)) * 100;
  const tone =
    pct >= 60 ? "bg-champagne-300" : pct >= 40 ? "bg-champagne-100" : "bg-green-signal";
  return (
    <div className="w-full">
      <div className="flex items-baseline justify-between">
        <span className="text-[10.5px] uppercase tracking-[0.22em] text-ink/55">{label}</span>
        <span className="text-[13px] tabular-nums text-ink/85">{pct.toFixed(0)}%</span>
      </div>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/[0.06]">
        <div
          className={`h-full ${tone} transition-[width] duration-700 ease-cinema`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
