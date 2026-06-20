type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  chips?: string[];
  micro?: string;
  error?: string;
  maxLength?: number;
};

export default function TextAreaWithChips({ label, value, onChange, placeholder, chips, micro, error, maxLength = 2000 }: Props) {
  const id = `ta-${label.replace(/\s+/g, "-").toLowerCase()}`;
  const appendChip = (c: string) => {
    if (value.toLowerCase().includes(c.toLowerCase())) return;
    const sep = value.trim().length === 0 ? "" : value.trim().endsWith(".") ? " " : ". ";
    onChange((value + sep + c).slice(0, maxLength));
  };
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11.5px] uppercase tracking-[0.22em] text-ink/45">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        className={`w-full resize-none rounded-xl border bg-charcoal-900/50 px-4 py-3 text-[14.5px] leading-[1.6] text-ink placeholder:text-ink/30 transition-all duration-300 ease-cinema focus:outline-none focus:border-champagne-200/50 focus:bg-charcoal-900/70 ${
          error ? "border-champagne-300/50" : "border-ink/[0.08]"
        }`}
      />
      {chips && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => appendChip(c)}
              className="rounded-full border border-ink/[0.07] bg-charcoal-900/40 px-3 py-1.5 text-[11.5px] text-ink/65 transition-all duration-300 hover:border-champagne-200/30 hover:text-ink"
            >
              + {c}
            </button>
          ))}
        </div>
      )}
      {micro && <p className="mt-3 text-[11.5px] text-ink/40">{micro}</p>}
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-champagne-200/90">
          {error}
        </p>
      )}
    </div>
  );
}
