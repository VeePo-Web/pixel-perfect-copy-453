import type { ExpenseSlice } from "../content";

type Props = {
  slices: ExpenseSlice[];
  size?: number;
};

const PALETTE = ["#C9A35A", "#E9D9B0", "#3F7A5E", "#4FB7DD", "#A8853F"];

export default function Donut({ slices, size = 200 }: Props) {
  const total = slices.reduce((s, x) => s + x.pct, 0) || 100;
  const r = size / 2 - 12;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size} role="img" aria-label="Expense breakdown">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="14" />
      {slices.map((s, i) => {
        const len = (s.pct / total) * circ;
        const el = (
          <circle
            key={s.label}
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={PALETTE[i % PALETTE.length]}
            strokeWidth="14"
            strokeDasharray={`${len - 2} ${circ - len + 2}`}
            strokeDashoffset={-offset}
            transform={`rotate(-90 ${cx} ${cy})`}
            strokeLinecap="butt"
          />
        );
        offset += len;
        return el;
      })}
      <text
        x={cx}
        y={cy - 4}
        textAnchor="middle"
        className="fill-bone/70"
        style={{ font: "500 10px/1 ui-sans-serif", letterSpacing: "0.18em", textTransform: "uppercase" }}
      >
        Expense mix
      </text>
      <text
        x={cx}
        y={cy + 14}
        textAnchor="middle"
        className="fill-bone"
        style={{ font: "500 16px/1 ui-sans-serif" }}
      >
        100%
      </text>
    </svg>
  );
}

export const DONUT_PALETTE = PALETTE;
