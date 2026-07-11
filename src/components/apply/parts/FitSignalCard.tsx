export default function FitSignalCard({ tone = "positive", children }: { tone?: "positive" | "soft"; children: React.ReactNode }) {
  const positive = tone === "positive";
  return (
    <div
      className={`relative rounded-xl border p-4 text-[13px] leading-[1.6] shadow-[0_1px_2px_rgba(11,13,18,0.04)] motion-safe:animate-section-in ${
        positive
          ? "border-green-signal/25 bg-green-signal/[0.05] text-ink/80"
          : "border-champagne-300/25 bg-champagne-50/50 text-ink/80"
      }`}
    >
      <span
        className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r ${
          positive ? "bg-green-signal" : "bg-champagne-200"
        }`}
      />
      <div className="pl-3">{children}</div>
    </div>
  );
}
