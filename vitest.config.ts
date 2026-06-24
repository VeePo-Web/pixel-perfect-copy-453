import { defineConfig } from "vitest/config";

// Isolated config for the grounded-report engine unit tests. Node environment,
// no React/app plugins — these test the pure, server-authoritative logic
// (metrics math + the anti-hallucination verification layer).
export default defineConfig({
  test: {
    include: ["supabase/functions/_shared/*.test.ts"],
    environment: "node",
  },
});
