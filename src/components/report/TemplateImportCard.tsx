// Spreadsheet-template intake surface. Download the canonical template, fill
// it, upload it — unlocks contribution margin by line ("what's actually
// profitable") for owners without a clean accounting feed.
import { useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LEDGER_TEMPLATE_CSV, parseLedgerCsv } from "@/lib/report/csv";

// ledger_entries lags the auto-generated Database types (migration 20260623130000).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

function downloadTemplate() {
  const blob = new Blob([LEDGER_TEMPLATE_CSV], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "goldfin-ledger-template.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function TemplateImportCard({ onImported }: { onImported?: () => void }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File) {
    setBusy(true);
    setStatus(null);
    const text = await file.text();
    const { rows, errors } = parseLedgerCsv(text);
    if (!rows.length) {
      setStatus(errors[0] ?? "No valid rows found.");
      setBusy(false);
      return;
    }
    const { data: auth } = await supabase.auth.getUser();
    const uid = auth.user?.id;
    if (!uid) { setStatus("Not signed in."); setBusy(false); return; }

    // Replace prior template data so totals don't double-count on re-upload.
    await db.from("ledger_entries").delete().eq("source", "template");
    const { error } = await db
      .from("ledger_entries")
      .insert(rows.map((r) => ({ ...r, user_id: uid, source: "template" })));

    if (error) setStatus(error.message);
    else {
      const skipped = errors.length ? ` (${errors.length} row${errors.length > 1 ? "s" : ""} skipped)` : "";
      setStatus(`Imported ${rows.length} line${rows.length > 1 ? "s" : ""}${skipped}. Generate your report to see profit by line.`);
      onImported?.();
    }
    setBusy(false);
  }

  return (
    <section className="rounded-xl border border-charcoal-700 bg-paper-raised px-6 py-6">
      <div className="text-[10.5px] uppercase tracking-[0.28em] text-champagne-300/80">Spreadsheet template</div>
      <h3 className="mt-2 text-[18px] font-light text-ink">No clean books? Use the template</h3>
      <p className="mt-1 max-w-[60ch] text-[13px] leading-[1.6] text-ink/55">
        Download the template, fill one row per revenue or cost line, and upload it. We'll show you the
        contribution margin of each product, service, or channel — which work actually makes you money.
      </p>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={downloadTemplate}
          className="rounded-full border border-charcoal-700 px-4 py-2 text-[12.5px] text-ink/75 transition-colors duration-200 ease-cinema hover:bg-charcoal-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40"
        >
          Download template
        </button>
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="rounded-full bg-ink px-4 py-2 text-[12.5px] text-paper transition-transform duration-200 ease-cinema hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500/40 disabled:opacity-50"
        >
          {busy ? "Importing…" : "Upload filled template"}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept=".csv,text/csv"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) void handleFile(f);
            e.target.value = "";
          }}
        />
      </div>
      {status && <p className="mt-3 text-[12.5px] text-ink/55">{status}</p>}
    </section>
  );
}
