// Display formatters for the advisory report surface. Pure, presentational
// only — the numbers themselves come pre-computed from the server (the surface
// never recomputes financials).

export function fmtUSD(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  const abs = Math.abs(n);
  const digits = abs < 100 && abs % 1 !== 0 ? 2 : 0;
  return (n < 0 ? "-$" : "$") + abs.toLocaleString("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

export function fmtPct(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  const sign = n > 0 ? "+" : "";
  return `${sign}${n.toLocaleString("en-US", { maximumFractionDigits: 1 })}%`;
}

export function fmtMonths(n: number | null | undefined): string {
  if (n == null || Number.isNaN(n)) return "—";
  return `${n.toLocaleString("en-US", { maximumFractionDigits: 1 })} months`;
}

/** "Jun 22, 2026" from an ISO date string. */
export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso + (iso.length === 10 ? "T00:00:00" : ""));
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
