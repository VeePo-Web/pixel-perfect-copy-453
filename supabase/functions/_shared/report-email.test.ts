import { describe, it, expect } from "vitest";
import { computeMetrics } from "./report-metrics.ts";
import { renderReportEmail, type RenderInput } from "./report-email.ts";

const metrics = computeMetrics({
  accounts: [{ current_balance: 30000, type: "depository" }],
  transactions: [
    { posted_date: "2026-06-12", name: "Adobe", merchant_name_norm: "Adobe", amount: 149, category: "Software", confidence: 0.9 },
    { posted_date: "2026-06-13", name: "Adobe", merchant_name_norm: "Adobe", amount: 149, category: "Software", confidence: 0.9 },
  ],
  priorTransactions: [],
  recurringStreams: [
    { direction: "outflow", description: "Old tool", merchant_name: "OldTool", category: "Software", frequency: "MONTHLY", last_amount: 50, first_amount: 50, last_date: "2026-02-01", is_active: true },
  ],
  profile: { business_name: "Northlight", industry: "agency", entity_type: "llc_sole_prop", reserve_floor_months: 3 },
  periodStart: "2026-06-09", periodEnd: "2026-06-23", today: "2026-06-23",
});

const base: RenderInput = {
  subjectLine: "Northlight: 5.1 months of cash, down from 6.0",
  sections: [
    { key: "verdict", heading: "Am I OK? Watch this closely.", body: "Revenue up, profit down." },
    { key: "leaking", heading: "Where it's leaking", body: "Dormant tools and a duplicate charge." },
  ],
  metrics,
  recommendations: [
    { text: "Cancel the dormant subscription", bucket: "find_cash", dollar: 600, deadline: "2026-07-01" },
  ],
  coveragePct: 97.8,
  periodEnd: "2026-06-23",
  model: "claude-opus-4-8",
  businessName: "Northlight",
};

describe("renderReportEmail", () => {
  it("uses the subject line when present", () => {
    expect(renderReportEmail(base).subject).toBe("Northlight: 5.1 months of cash, down from 6.0");
  });

  it("falls back to the business name when no subject line", () => {
    expect(renderReportEmail({ ...base, subjectLine: null }).subject).toBe("Northlight: your advisory report");
  });

  it("renders section headings and bodies", () => {
    const { html } = renderReportEmail(base);
    expect(html).toContain("Am I OK? Watch this closely.");
    expect(html).toContain("Revenue up, profit down.");
  });

  it("renders the money-recovery block from metrics under leaking", () => {
    const { html } = renderReportEmail(base);
    expect(html).toContain("Money to recover");
    expect(html).toContain("OldTool");
    expect(html).toContain("$600/yr");      // dormant stream annualized
    expect(html).toContain("Adobe");        // duplicate charge
    expect(html).toContain("$149 back");
  });

  it("renders the decision memo with bucket label and dollar", () => {
    const { html } = renderReportEmail(base);
    expect(html).toContain("What to do now");
    expect(html).toContain("Find cash");
    expect(html).toContain("$600");
  });

  it("escapes HTML in body text (no injection)", () => {
    const { html } = renderReportEmail({
      ...base,
      sections: [{ key: "verdict", heading: "H", body: "<script>alert(1)</script>" }],
    });
    expect(html).not.toContain("<script>alert(1)</script>");
    expect(html).toContain("&lt;script&gt;");
  });

  it("includes the trust stamp with coverage and the no-invented-figures promise", () => {
    const { html } = renderReportEmail(base);
    expect(html).toContain("97.8% of transactions categorized");
    expect(html).toContain("No figures were invented");
    expect(html).toContain("claude-opus-4-8");
  });
});
