// GoldFin Desk logo — gold "fin" with a rising plain-English line.
// Inline SVG so it stays crisp at favicon → header scale and never blocks the
// critical path. The mark reads as: a premium gold sail/fin, a white rising
// arrow (numbers moving up, understood).

export function GoldFinMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      role="img"
      aria-label="GoldFin Desk"
    >
      {/* Fin / sail */}
      <path
        d="M16 53 C 28 39 42 21 52 9 C 55 26 54 42 47 53 Z"
        fill="#C9A24A"
      />
      {/* Rising line (chart going up) */}
      <path
        d="M21 47 L30 39 L35 43 L42 31 L46 34 L52 24"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Arrowhead */}
      <path
        d="M52 24 L45 23 M52 24 L53 31"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function GoldFinLogo({
  className = "",
  markClassName = "h-7 w-7",
  wordmarkClassName = "text-[13px] uppercase tracking-[0.26em] text-ink",
  showWordmark = true,
}: {
  className?: string;
  markClassName?: string;
  wordmarkClassName?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <GoldFinMark className={markClassName} />
      {showWordmark && (
        <span className={wordmarkClassName}>
          GoldFin <span className="text-gold-700">Desk</span>
        </span>
      )}
    </span>
  );
}
