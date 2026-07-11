type Props = {
  label: string;
  selected: boolean;
  onSelect: () => void;
  role?: "radio" | "checkbox";
};

export default function SelectableCard({ label, selected, onSelect, role = "radio" }: Props) {
  return (
    <button
      type="button"
      role={role}
      aria-checked={selected}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={`flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[14px] transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white ${
        selected
          ? "border-champagne-300/80 bg-champagne-50/50 font-medium text-ink shadow-[0_1px_2px_rgba(11,13,18,0.06)]"
          : "border-ink/[0.12] bg-white text-ink/70 hover:border-ink/[0.3] hover:text-ink"
      }`}
    >
      <span className="leading-snug">{label}</span>
      <span
        className={`ml-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-200 ${
          selected ? "border-champagne-300 bg-champagne-300" : "border-ink/20 bg-white"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-white" />}
      </span>
    </button>
  );
}
