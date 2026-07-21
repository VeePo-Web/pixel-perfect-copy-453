import { defineConfig } from "vitest/config";

// Isolated config for the grounded-report engine unit tests. Node environment,
// no React/app plugins — these test the pure, server-authoritative logic
// (metrics math + the anti-hallucination verification layer).
export default defineConfig({
  test: {
    // `**` so the XLSX builder tests under src/lib/finance/xlsx/ actually run —
    // the single-level glob silently excluded the customer-facing workbook suite.
    include: ["supabase/functions/_shared/**/*.test.ts", "src/lib/finance/**/*.test.ts"],
    environment: "node",
  },
});
