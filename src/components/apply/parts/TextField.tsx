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
      <label htmlFor={id} className="mb-2 block text-[11.5px] uppercase tracking-[0.22em] text-bone/45">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoComplete={autoComplete}
        maxLength={maxLength}
        className={`w-full rounded-xl border bg-charcoal-900/50 px-4 py-3 text-[14.5px] text-bone placeholder:text-bone/30 transition-all duration-300 ease-cinema focus:outline-none focus:border-champagne-200/50 focus:bg-charcoal-900/70 ${
          error ? "border-champagne-300/50" : "border-ink/[0.08]"
        }`}
      />
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-champagne-200/90">
          {error}
        </p>
      )}
    </div>
  );
}
