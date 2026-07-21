// Regenerates the shipped lead-magnet spreadsheets from the SINGLE source of
// truth (SAMPLE_METRICS + the deterministic XLSX builder), so the files in
// public/downloads/ can never drift from the code. Run: `npx tsx scripts/generate-sample-xlsx.ts`
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { SAMPLE_METRICS } from "../src/lib/finance/sampleTemplates.ts";
import { buildGoldfinTemplateVaultXlsx, buildGoldfinTemplateXlsx } from "../src/lib/finance/xlsx/buildWorkbook.ts";

const OUT = resolve(process.cwd(), "public/downloads");

const jobs: Array<{ file: string; bytes: Uint8Array }> = [
  { file: "goldfin-owner-command-center-sample.xlsx", bytes: buildGoldfinTemplateXlsx("Owner Command Center", SAMPLE_METRICS) },
  { file: "goldfin-13-week-cash-map-sample.xlsx", bytes: buildGoldfinTemplateXlsx("13-Week Cash Map", SAMPLE_METRICS) },
  { file: "goldfin-cash-basis-p-l-review-sample.xlsx", bytes: buildGoldfinTemplateXlsx("Cash-Basis P&L Review", SAMPLE_METRICS) },
  { file: "goldfin-expense-and-vendor-audit-sample.xlsx", bytes: buildGoldfinTemplateXlsx("Expense And Vendor Audit", SAMPLE_METRICS) },
  { file: "goldfin-template-vault.xlsx", bytes: buildGoldfinTemplateVaultXlsx(SAMPLE_METRICS) },
];

for (const { file, bytes } of jobs) {
  const path = resolve(OUT, file);
  writeFileSync(path, bytes);
  console.log(`wrote ${file}  (${bytes.byteLength} bytes)`);
}
console.log("done. Next: re-zip the vault from the four *-sample.xlsx files.");
