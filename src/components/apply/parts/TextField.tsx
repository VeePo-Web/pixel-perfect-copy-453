type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: "text" | "email";
  error?: string;
  autoComplete?: string;
  maxLength?: number;
};

export default function TextField({ label, value, onChange, placeholder, type = "text", error, autoComplete, maxLength = 255 }: Props) {
  const id = `f-${label.replace(/\s+/g, "-").toLowerCase()}`;
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-general text-[11px] uppercase tracking-[0.22em] text-ink/45">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={type === "email" ? "email" : undefined}
        autoCapitalize={type === "email" ? "none" : undefined}
        autoCorrect={type === "email" ? "off" : undefined}
        maxLength={maxLength}
        className={`w-full rounded-xl border bg-white px-4 py-3 text-[16px] text-ink placeholder:text-ink/35 transition-colors focus:outline-none focus:ring-2 sm:text-[14.5px] ${
          error
            ? "border-red-signal/60 focus:border-red-signal/60 focus:ring-red-signal/20"
            : "border-ink/[0.12] focus:border-champagne-300/50 focus:ring-champagne-200/40"
        }`}
      />
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-red-signal">
          {error}
        </p>
      )}
    </div>
  );
}
