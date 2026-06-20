export default function FitSignalCard({ tone = "positive", children }: { tone?: "positive" | "soft"; children: React.ReactNode }) {
  const positive = tone === "positive";
  return (
    <div
      className={`relative rounded-xl border p-4 text-[13px] leading-[1.6] backdrop-blur-sm motion-safe:animate-section-in ${
        positive
          ? "border-green-signal/40 bg-green-deep/20 text-ink/85"
          : "border-champagne-200/20 bg-champagne-200/[0.04] text-ink/80"
      }`}
    >
      <span
        className={`absolute left-0 top-3 bottom-3 w-[2px] rounded-r ${
          positive ? "bg-green-signal" : "bg-champagne-200/70"
        }`}
      />
      <div className="pl-3">{children}</div>
    </div>
  );
}
