// Captures the two onboarding answers that unlock the highest-value report
// features: industry (-> KPI pack + benchmark) and entity_type (-> tax flag).
// Upserts to business_profiles via the server (RLS owner-scoped).
import { useState } from "react";
import { useBusinessProfile } from "@/lib/report/useBusinessProfile";
import type { Industry, EntityType } from "@/lib/report/types";

const INDUSTRIES: { value: Industry; label: string }[] = [
  { value: "restaurant", label: "Restaurant / food" },
  { value: "contractor", label: "Contractor / construction" },
  { value: "retail", label: "Retail / product" },
  { value: "agency", label: "Agency / services" },
  { value: "ecommerce", label: "Ecommerce / DTC" },
  { value: "saas", label: "SaaS / software" },
  { value: "professional_services", label: "Professional services" },
  { value: "other", label: "Other" },
];

const ENTITIES: { value: EntityType; label: string }[] = [
  { value: "sole_proprietor", label: "Sole proprietor" },
  { value: "llc_sole_prop", label: "LLC (taxed as sole prop)" },
  { value: "llc_partnership", label: "LLC (partnership)" },
  { value: "s_corp", label: "S-corp" },
  { value: "c_corp", label: "C-corp" },
  { value: "unknown", label: "Not sure" },
];

const selectCls =
  "mt-1.5 w-full rounded-lg border border-charcoal-700 bg-paper px-3 py-2 text-[14px] text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40";

export default function BusinessProfileCard({ onSaved }: { onSaved?: () => void }) {
  const { profile, loading, saving, error, save } = useBusinessProfile();
  const [name, setName] = useState<string | null>(null);
  const [industry, setIndustry] = useState<Industry | null>(null);
  const [entity, setEntity] = useState<EntityType | null>(null);

  if (loading) {
    return <div className="h-40 animate-pulse rounded-xl border border-charcoal-700 bg-paper-raised" />;
  }

  const v = {
    name: name ?? profile?.business_name ?? "",
    industry: industry ?? profile?.industry ?? "other",
    entity: entity ?? profile?.entity_type ?? "unknown",
  };

  async function handleSave() {
    await save({
      business_name: v.name || null,
      industry: v.industry as Industry,
      entity_type: v.entity as EntityType,
    });
    onSaved?.();
  }

  return (
    <section className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">Your business</div>
      <h3 className="mt-2 text-[18px] font-light text-ink">Two answers unlock your full report</h3>
      <p className="mt-1 text-[13px] leading-[1.6] text-ink/55">
        Industry sets the make-or-break metric we lead with. Entity type lets us flag tax-structure savings to
        raise with your CPA.
      </p>

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <label className="block text-[12.5px] text-ink/70 sm:col-span-2">
          Business name (optional)
          <input
            type="text"
            value={v.name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Northlight Creative"
            className={selectCls}
          />
        </label>
        <label className="block text-[12.5px] text-ink/70">
          Industry
          <select value={v.industry} onChange={(e) => setIndustry(e.target.value as Industry)} className={selectCls}>
            {INDUSTRIES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
        <label className="block text-[12.5px] text-ink/70">
          Tax entity
          <select value={v.entity} onChange={(e) => setEntity(e.target.value as EntityType)} className={selectCls}>
            {ENTITIES.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-5 flex items-center gap-4">
        <button
          type="button"
          onClick={() => void handleSave()}
          disabled={saving}
          className="rounded-full bg-ink px-5 py-2 text-[13px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save profile"}
        </button>
        {error && <span className="text-[12px] text-ink/45">{error}</span>}
      </div>
    </section>
  );
}
