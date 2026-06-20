import { HIW_COPY } from "../content";
import SectionHeader from "./SectionHeader";
import { useInView } from "../hooks/useInView";

export default function MonthlyCycle() {
  const c = HIW_COPY.cycle;
  const { ref, inView } = useInView<HTMLDivElement>();
  const R = 130;
  const C = 2 * Math.PI * R;
  // Positions for 4 nodes at top, right, bottom, left
  const positions = [
    { x: 0, y: -R, anchor: "bottom" },
    { x: R, y: 0, anchor: "left" },
    { x: 0, y: R, anchor: "top" },
    { x: -R, y: 0, anchor: "right" },
  ];

  return (
    <div>
      <SectionHeader headline={c.headline} align="center" />
      <div ref={ref} className="mt-14 grid grid-cols-1 items-center gap-12 lg:grid-cols-[1fr_auto_1fr]">
        {/* Left intro list */}
        <ul className="space-y-4 lg:text-right">
          {c.weeks.slice(0, 2).map((w) => (
            <li key={w.w}>
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">{w.w}</div>
              <div className="mt-1 text-[15px] text-ink/85">{w.t}</div>
            </li>
          ))}
        </ul>

        {/* Ring */}
        <div className="relative mx-auto h-[320px] w-[320px]">
          <svg viewBox="-160 -160 320 320" className="absolute inset-0 h-full w-full">
            <circle cx="0" cy="0" r={R} fill="none" stroke="rgba(237,231,218,0.08)" strokeWidth="1" />
            <circle
              cx="0"
              cy="0"
              r={R}
              fill="none"
              stroke="rgba(217,190,130,0.65)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray={C}
              strokeDashoffset={inView ? 0 : C}
              transform="rotate(-90)"
              style={{ transition: "stroke-dashoffset 2200ms cubic-bezier(0.22,1,0.36,1)" }}
            />
            {positions.map((p, i) => (
              <g key={i}>
                <circle cx={p.x} cy={p.y} r="5" fill="#D9BE82" />
                <circle cx={p.x} cy={p.y} r="11" fill="none" stroke="rgba(217,190,130,0.2)" />
              </g>
            ))}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center px-10 text-center">
            <div>
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">End state</div>
              <div className="mt-2 font-zentry text-[18px] leading-[1.25] tracking-tight text-ink">{c.end}</div>
            </div>
          </div>
        </div>

        {/* Right list */}
        <ul className="space-y-4">
          {c.weeks.slice(2).map((w) => (
            <li key={w.w}>
              <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-200/60">{w.w}</div>
              <div className="mt-1 text-[15px] text-ink/85">{w.t}</div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mx-auto mt-12 max-w-2xl text-center text-[14px] leading-[1.7] text-ink/55">{c.line}</p>
    </div>
  );
}
