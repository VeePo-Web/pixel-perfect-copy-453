import { fillAllTemplates, type ProductMetrics } from "../productTemplates.ts";
import {
  buildGoldfinTemplateVaultXlsx,
  buildGoldfinTemplateXlsx,
  goldfinTemplateXlsxFileName,
} from "./buildWorkbook.ts";

function triggerXlsxDownload(filename: string, bytes: Uint8Array) {
  const blob = new Blob([bytes], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function downloadGoldfinTemplateVaultXlsx(metrics: ProductMetrics, periodEnd = "current") {
  triggerXlsxDownload(`goldfin-template-vault-${periodEnd}.xlsx`, buildGoldfinTemplateVaultXlsx(metrics));
}

export function downloadGoldfinTemplateXlsx(title: string, metrics: ProductMetrics, periodEnd = "current") {
  triggerXlsxDownload(goldfinTemplateXlsxFileName(title, periodEnd), buildGoldfinTemplateXlsx(title, metrics));
}

export function firstGoldfinTemplateTitle(metrics: ProductMetrics): string {
  return fillAllTemplates(metrics)[0]?.title ?? "Owner Command Center";
}
