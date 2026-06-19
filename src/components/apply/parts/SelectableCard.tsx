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
      className={`group relative flex items-center justify-between rounded-xl border px-4 py-3.5 text-left text-[14px] transition-all duration-300 ease-cinema focus:outline-none focus-visible:ring-2 focus-visible:ring-champagne-200/50 ${
        selected
          ? "border-champagne-200/40 bg-champagne-200/[0.05] text-bone shadow-[0_8px_30px_-10px_rgba(217,190,130,0.25)]"
          : "border-white/[0.07] bg-charcoal-900/40 text-bone/75 hover:-translate-y-0.5 hover:border-champagne-200/25 hover:text-bone"
      }`}
    >
      <span className="leading-snug">{label}</span>
      <span
        className={`ml-3 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
          selected ? "border-champagne-200 bg-champagne-200" : "border-white/15 bg-transparent"
        }`}
      >
        {selected && <span className="h-1.5 w-1.5 rounded-full bg-charcoal-950" />}
      </span>
    </button>
  );
}
