type Props = {
  values: number[];
  height?: number;
  width?: number;
  accent?: string;
  className?: string;
};

export default function MiniLineChart({
  values,
  height = 160,
  width = 560,
  accent = "#C9A35A",
  className,
}: Props) {
  if (values.length < 2) return null;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const pad = (max - min) * 0.15 || 1;
  const yMin = min - pad;
  const yMax = max + pad;
  const stepX = width / (values.length - 1);
  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = height - ((v - yMin) / (yMax - yMin)) * height;
    return [x, y] as const;
  });
  const path = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`).join(" ");
  const area = `${path} L${width} ${height} L0 ${height} Z`;
  const id = `g-${Math.random().toString(36).slice(2, 8)}`;
  const last = points[points.length - 1];
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} preserveAspectRatio="none" role="img" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.28" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* baseline */}
      <line x1="0" y1={height - 0.5} x2={width} y2={height - 0.5} stroke="rgba(255,255,255,0.06)" />
      <path d={area} fill={`url(#${id})`} />
      <path d={path} fill="none" stroke={accent} strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={last[0]} cy={last[1]} r="3.2" fill={accent} />
      <circle cx={last[0]} cy={last[1]} r="6" fill={accent} fillOpacity="0.18" />
    </svg>
  );
}
