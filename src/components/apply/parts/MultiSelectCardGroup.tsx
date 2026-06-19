import SelectableCard from "./SelectableCard";

type Props = {
  label?: string;
  options: string[];
  values: string[];
  onChange: (next: string[]) => void;
  cols?: 2 | 3;
  error?: string;
};

export default function MultiSelectCardGroup({ label, options, values, onChange, cols = 2, error }: Props) {
  const toggle = (opt: string) => {
    if (values.includes(opt)) onChange(values.filter((v) => v !== opt));
    else onChange([...values, opt]);
  };
  const gridCols = cols === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2";
  return (
    <div role="group" aria-label={label}>
      {label && <div className="mb-3 text-[12.5px] text-bone/65">{label}</div>}
      <div className={`grid grid-cols-1 gap-2.5 ${gridCols}`}>
        {options.map((opt) => (
          <SelectableCard
            key={opt}
            label={opt}
            selected={values.includes(opt)}
            onSelect={() => toggle(opt)}
            role="checkbox"
          />
        ))}
      </div>
      {error && (
        <p role="alert" className="mt-3 text-[12.5px] text-champagne-200/90">
          {error}
        </p>
      )}
    </div>
  );
}
