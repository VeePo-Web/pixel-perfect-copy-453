// Regenerates the shipped lead-magnet spreadsheets from the SINGLE source of
// truth (the fillable XLSX builder + its pre-filled sample inputs), so the files
// in public/downloads/ can never drift from the code. These are the FILLABLE
// free templates: shaded input cells + formulas that recalculate on edit.
// Run: `npx tsx scripts/generate-sample-xlsx.ts`
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  buildGoldfinFillableVaultXlsx,
  buildGoldfinFillableTemplateXlsx,
} from "../src/lib/finance/xlsx/buildWorkbook.ts";

const OUT = resolve(process.cwd(), "public/downloads");

const jobs: Array<{ file: string; bytes: Uint8Array }> = [
  { file: "goldfin-owner-command-center-sample.xlsx", bytes: buildGoldfinFillableTemplateXlsx("Owner Command Center") },
  { file: "goldfin-13-week-cash-map-sample.xlsx", bytes: buildGoldfinFillableTemplateXlsx("13-Week Cash Map") },
  { file: "goldfin-cash-basis-p-l-review-sample.xlsx", bytes: buildGoldfinFillableTemplateXlsx("Cash-Basis P&L Review") },
  { file: "goldfin-expense-and-vendor-audit-sample.xlsx", bytes: buildGoldfinFillableTemplateXlsx("Expense & Vendor Audit") },
  { file: "goldfin-template-vault.xlsx", bytes: buildGoldfinFillableVaultXlsx() },
];

for (const { file, bytes } of jobs) {
  const path = resolve(OUT, file);
  writeFileSync(path, bytes);
  console.log(`wrote ${file}  (${bytes.byteLength} bytes)`);
}
console.log("done. Next: re-zip the vault from the four *-sample.xlsx files.");
