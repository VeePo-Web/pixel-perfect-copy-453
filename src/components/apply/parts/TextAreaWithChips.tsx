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
      <label htmlFor={id} className="mb-2 block font-general text-[11px] uppercase tracking-[0.22em] leading-[1.8] text-ink/45">
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={4}
        maxLength={maxLength}
        className={`w-full resize-none rounded-xl border bg-white px-4 py-3 text-[14.5px] leading-[1.6] text-ink placeholder:text-ink/35 transition-colors focus:outline-none focus:ring-2 ${
          error
            ? "border-red-signal/60 focus:border-red-signal/60 focus:ring-red-signal/20"
            : "border-ink/[0.12] focus:border-champagne-300/50 focus:ring-champagne-200/40"
        }`}
      />
      {chips && (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => appendChip(c)}
              className="rounded-full border border-ink/[0.12] bg-white px-3 py-1.5 text-[11.5px] text-ink/60 transition-colors duration-200 hover:border-ink/[0.3] hover:text-ink"
            >
              + {c}
            </button>
          ))}
        </div>
      )}
      {micro && <p className="mt-3 text-[12px] leading-[1.6] text-ink/45">{micro}</p>}
      {error && (
        <p role="alert" className="mt-2 text-[12.5px] text-red-signal">
          {error}
        </p>
      )}
    </div>
  );
}
