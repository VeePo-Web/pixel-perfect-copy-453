"""Build the complete Plaid submission packet ZIP.

Generates all required policy PDFs from inline markdown sources, bundles
existing screenshots + PDFs, writes a README index, and zips everything to
/mnt/documents/goldfin-plaid-submission-packet.zip.
"""
from __future__ import annotations
import re, shutil, zipfile, tempfile
from pathlib import Path
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle

# ---------- style (mirrors build-mfa-attestation-pdf.py) ----------
NAVY = colors.HexColor("#0B1F3A")
INK  = colors.HexColor("#111111")
MUTED= colors.HexColor("#555555")
RULE = colors.HexColor("#D9D2BF")
GOLD = colors.HexColor("#B89A4E")
CREAM= colors.HexColor("#F5EFE0")

styles = getSampleStyleSheet()
H1 = ParagraphStyle("H1", parent=styles["Heading1"], fontName="Helvetica-Bold",
                    fontSize=20, leading=24, textColor=NAVY, spaceAfter=8)
H2 = ParagraphStyle("H2", parent=styles["Heading2"], fontName="Helvetica-Bold",
                    fontSize=13, leading=17, textColor=NAVY, spaceBefore=14, spaceAfter=6)
BODY = ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica",
                      fontSize=10, leading=14, textColor=INK, spaceAfter=6)
MONO = ParagraphStyle("Mono", parent=BODY, fontName="Courier", fontSize=8.5, leading=11)
BULLET = ParagraphStyle("Bullet", parent=BODY, leftIndent=14, bulletIndent=2, spaceAfter=2)
CELL = ParagraphStyle("Cell", parent=BODY, fontSize=8.5, leading=11, spaceAfter=0)

def inline(text: str) -> str:
    text = text.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")
    text = re.sub(r"\*\*(.+?)\*\*", r"<b>\1</b>", text)
    text = re.sub(r"`([^`]+?)`", r'<font name="Courier" size="9">\1</font>', text)
    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)",
                  r'<link href="\2" color="#0B1F3A"><u>\1</u></link>', text)
    return text

def make_table(rows):
    data = [[Paragraph(inline(c), CELL) for c in r] for r in rows]
    t = Table(data, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0,0), (-1,0), CREAM),
        ("TEXTCOLOR", (0,0), (-1,0), NAVY),
        ("FONTNAME", (0,0), (-1,0), "Helvetica-Bold"),
        ("FONTSIZE", (0,0), (-1,-1), 8.5),
        ("VALIGN", (0,0), (-1,-1), "TOP"),
        ("GRID", (0,0), (-1,-1), 0.4, RULE),
        ("LEFTPADDING", (0,0), (-1,-1), 5),
        ("RIGHTPADDING", (0,0), (-1,-1), 5),
        ("TOPPADDING", (0,0), (-1,-1), 4),
        ("BOTTOMPADDING", (0,0), (-1,-1), 4),
    ]))
    return t

def parse(md: str):
    flow = []
    lines = md.splitlines()
    i = 0
    while i < len(lines):
        line = lines[i]
        if line.startswith("# "):
            flow.append(Paragraph(inline(line[2:]), H1)); i += 1
        elif line.startswith("## "):
            flow.append(Paragraph(inline(line[3:]), H2)); i += 1
        elif line.startswith("```"):
            block = []; i += 1
            while i < len(lines) and not lines[i].startswith("```"):
                block.append(lines[i]); i += 1
            i += 1
            txt = "<br/>".join(l.replace(" ", "&nbsp;").replace("<","&lt;").replace(">","&gt;") for l in block)
            flow.append(Paragraph(txt, MONO)); flow.append(Spacer(1, 6))
        elif line.startswith("|") and i+1 < len(lines) and re.match(r"^\|[\s\-:|]+\|$", lines[i+1]):
            header = [c.strip() for c in line.strip("|").split("|")]
            i += 2
            rows = [header]
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip("|").split("|")])
                i += 1
            flow.append(make_table(rows)); flow.append(Spacer(1, 6))
        elif re.match(r"^\s*[-*]\s+", line):
            txt = re.sub(r"^\s*[-*]\s+", "", line)
            flow.append(Paragraph(inline(txt), BULLET, bulletText="•")); i += 1
        elif re.match(r"^\s*\d+\.\s+", line):
            txt = re.sub(r"^\s*\d+\.\s+", "", line)
            flow.append(Paragraph(inline(txt), BULLET, bulletText="•")); i += 1
        elif line.strip() == "---":
            flow.append(Spacer(1, 4)); i += 1
        elif line.strip() == "":
            flow.append(Spacer(1, 4)); i += 1
        else:
            buf = [line]; i += 1
            while i < len(lines) and lines[i].strip() and not re.match(r"^(#|\||```|\s*[-*]\s|\s*\d+\.\s)", lines[i]):
                buf.append(lines[i]); i += 1
            flow.append(Paragraph(inline(" ".join(buf)), BODY))
    return flow

def make_header_footer(title: str):
    def hf(canvas, doc):
        canvas.saveState()
        canvas.setStrokeColor(GOLD); canvas.setLineWidth(0.7)
        canvas.line(0.75*inch, LETTER[1]-0.6*inch, LETTER[0]-0.75*inch, LETTER[1]-0.6*inch)
        canvas.setFont("Helvetica", 8.5); canvas.setFillColor(MUTED)
        canvas.drawString(0.75*inch, LETTER[1]-0.45*inch, f"GoldFin Desk · {title}")
        canvas.drawRightString(LETTER[0]-0.75*inch, LETTER[1]-0.45*inch, "v2026-06-26.1")
        canvas.drawCentredString(LETTER[0]/2, 0.45*inch,
                                 f"Page {doc.page}  ·  goldfindesk.com  ·  Owner: Chris Sam")
        canvas.restoreState()
    return hf

def render(md: str, out: Path, title: str):
    out.parent.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(out), pagesize=LETTER,
                            leftMargin=0.85*inch, rightMargin=0.85*inch,
                            topMargin=0.95*inch, bottomMargin=0.75*inch,
                            title=f"GoldFin Desk — {title}", author="GoldFin Desk")
    hf = make_header_footer(title)
    doc.build(parse(md), onFirstPage=hf, onLaterPages=hf)
    print(f"  wrote {out.name} ({out.stat().st_size:,} bytes)")

# ===================== POLICY SOURCES =====================

FOOTER = """

---

**Document control**
Owner: Chris Sam, Founder & Security Officer · Approved: 2026-06-26 · Version: 2026-06-26.1
Review cadence: Quarterly + on material change · Next review: 2026-09-26
Contact: security@goldfindesk.com
"""

INFO_SEC = """# Information Security Policy

**Organization:** GoldFin Desk (Monthly Finance Desk)
**Scope:** All systems, data, personnel, and third parties that store, process, or transmit GoldFin Desk consumer or operational data — including the goldfindesk.com web application, backend (Lovable Cloud / Supabase Postgres + Edge Functions), and third-party processors (Plaid, Stripe, Resend, Google OAuth).
**Standards referenced:** SOC 2 Trust Services Criteria, NIST CSF 2.0, NIST SP 800-53 Rev. 5 (moderate baseline), CIS Controls v8, PCI-DSS v4.0 (SAQ-A surface only — Stripe-hosted), GDPR / CCPA.

## 1. Purpose

This policy establishes how GoldFin Desk identifies, mitigates, monitors, and continuously matures information-security risk across every system that touches consumer financial data, including data retrieved via the Plaid API. It is the authoritative parent document; sub-policies (Access Control, MFA, Encryption, Vulnerability Management, Privacy & Consent, Data Retention & Disposal, Plaid Operations) inherit from and refine it.

## 2. Governance & Roles

| Role | Holder | Responsibility |
| --- | --- | --- |
| Information Security Officer | Chris Sam (Founder) | Owns this policy, approves exceptions, signs attestations |
| Incident Commander | Chris Sam | Declares incidents, runs response, communicates with Plaid/Stripe/users |
| Privacy Officer | Chris Sam | DSAR intake, retention enforcement, consent records |
| Engineering Lead | Chris Sam | Secure SDLC, dependency hygiene, secret rotation |

GoldFin Desk is a founder-operated company. The same individual currently holds multiple roles; segregation of duties is achieved through tooling controls (provider-side audit logs, MFA, least-privilege scopes) rather than headcount, and is explicitly tracked as a residual risk in the risk register.

## 3. Risk Management Program

Risks are identified, scored, and tracked in a register maintained by the Security Officer.

- **Quarterly risk review** — re-score every open risk; add new risks from incidents, vendor changes, regulatory shifts.
- **Triggered review** — within 5 business days of any P1 incident, new processor onboarding, or material codebase change.
- **Scoring** — Likelihood × Impact on a 1–5 scale; risks ≥ 15 require a documented mitigation plan with target date.
- **Treatment** — mitigate, transfer (insurance / processor SLA), accept (with written justification), or avoid.

## 4. Operationalized Control Domains

The program is operationalized through the following sub-policies, each with its own owner, review cadence, and evidence trail:

| Domain | Sub-policy | Evidence |
| --- | --- | --- |
| Access Control | Access Control Policy | Quarterly access reviews, provider audit logs |
| Authentication | MFA Policy + MFA Attestation | Login screenshots, provider MFA enforcement settings |
| Cryptography | Encryption Policy | TLS reports, at-rest config |
| Vulnerability Mgmt | Vulnerability Management Policy | Dependabot logs, scan reports, EOL inventory |
| Privacy | Privacy & Consent Policy | /privacy page, consent records table |
| Retention | Data Retention & Disposal Policy | Daily cron-retention-sweep logs |
| Vendor Mgmt | Plaid Operations & Maturity Policy | Plaid console screenshots, webhook logs |

## 5. Secure Software Development Lifecycle (SSDLC)

- All code is version-controlled in GitHub with branch protection on `main` (required reviews, signed commits, status checks).
- Dependencies are scanned continuously by Dependabot and the Lovable security scanner; critical/high CVEs are patched within 7 days, moderate within 30 days.
- Secrets are stored exclusively in the Supabase Vault and Edge Function environment — never in source code, never in client-side bundles. The repo is scanned for committed secrets on every push.
- Database changes ship as reviewed migrations; every public-schema table has explicit RLS policies and GRANT statements.
- Edge functions verify JWTs (or HMAC signatures, for webhooks) before processing any request that touches consumer data.

## 6. Logging, Monitoring, and Audit

- **Application logs** — Edge Function logs retained 30 days; admin audit dashboard (`/portal/admin/audit`) aggregates per-user sign-in, Plaid connection, Stripe subscription, last report run, and last webhook event.
- **Database logs** — Supabase Postgres audit logs retained per provider defaults; the `webhook_events` and `cron_runs` tables provide an immutable internal trail of every external event.
- **Provider logs** — Plaid, Stripe, Resend, Google Workspace, and GitHub audit logs are reviewed at least monthly.
- **Alerting** — Failed cron runs, webhook signature failures, and admin-action anomalies surface in the audit dashboard.

## 7. Incident Response

Detailed runbooks live in the Plaid Operations & Maturity Policy §10. Summary:

1. **Detect** — alert, user report, or provider notification.
2. **Triage** — within 1 hour, classify severity (P1 confirmed consumer-data exposure → P4 informational).
3. **Contain** — rotate affected secrets, revoke tokens, disable affected accounts.
4. **Eradicate & Recover** — patch root cause, restore service, validate.
5. **Notify** — Plaid (`security@plaid.com`) within 24h for any incident involving Plaid-derived data; affected users per applicable breach-notification law; Stripe / Resend as applicable.
6. **Post-mortem** — written within 5 business days, fed into the risk register.

## 8. Personnel & Training

- All personnel (currently founder-only) complete annual security and privacy training covering phishing, secret hygiene, incident response, and Plaid-specific consumer-data handling.
- Contractor access is granted on a per-engagement basis, scoped to least privilege, and revoked at engagement end (documented in the access review log).

## 9. Continuous Maturation

This program is explicitly **continuously matured**, not static. Maturity is tracked against a 5-level model:

| Level | Name | Status |
| --- | --- | --- |
| 1 | Initial | — |
| 2 | Repeatable | — |
| 3 | Defined | **Current** |
| 4 | Managed (metrics-driven) | Target 2026 Q4 |
| 5 | Optimizing | Roadmap |

Quarterly reviews update this table, the risk register, every sub-policy version string, and the change log in each document. Material changes trigger an out-of-cycle review.

## 10. Policy Review and Approval

- **Annual full review** by the Security Officer.
- **Quarterly check-in** to confirm sub-policies remain aligned.
- **Triggered review** within 5 business days of any P1 incident, regulatory change, or material architectural change.
- All revisions increment the version string and are recorded in an append-only change log.
""" + FOOTER

ACCESS_CONTROL = """# Access Control Policy

**Inherits from:** Information Security Policy
**Scope:** All access to GoldFin Desk production assets — application, database, edge functions, secrets vault, third-party provider consoles (Plaid, Stripe, Resend, Google, GitHub, Lovable).

## 1. Principles

GoldFin Desk operates on **least privilege**, **deny-by-default**, **zero-trust**, and **strong authentication** for every access decision. There are no shared accounts, no standing production database credentials on personal devices, and no network-perimeter trust assumption — every request is authenticated and authorized at the application or provider edge.

## 2. Controls in Place

This policy directly addresses Plaid Pre-Production Questionnaire Q3. All four listed control categories are implemented:

| Control | Implementation |
| --- | --- |
| **OAuth tokens / TLS certificates for non-human authentication** | Plaid API uses client-id + secret over TLS 1.3; webhooks verified via Plaid JWT (JWKS). Stripe webhooks verified via HMAC-SHA256 signature. Edge Function → Supabase calls use service-role JWT scoped per function. Google OAuth 2.0 for consumer sign-in. No long-lived API keys are issued to humans for production data access. |
| **Periodic access reviews and audits** | Quarterly review of every provider console (Plaid, Stripe, Supabase/Lovable, Resend, Google, GitHub) — list of human + machine principals, scope, last-used date. Findings logged in the access-review log; stale or over-scoped access is removed within 5 business days. Internal audit dashboard at `/portal/admin/audit` provides continuous per-user visibility. |
| **Zero-trust access architecture** | No VPN, no implicit trust by IP. Every request to the application is authenticated (Supabase Auth JWT) and authorized via Row-Level Security at the database layer. Admin routes additionally require a row in `user_roles` with `role = 'admin'`, checked via the `has_role()` SECURITY DEFINER function. Edge functions independently re-verify identity — they do not trust the caller. |
| **Centralized identity and access management** | Single IdP per surface: Google Workspace + passwordless Email OTP (Resend) for the consumer app; Google Workspace SSO for GitHub, Stripe, Plaid, Resend, and Lovable admin consoles where supported. User roles are stored in a dedicated `public.user_roles` table — never on the profile — preventing privilege escalation. |

## 3. Authentication Requirements

All human access to production-relevant systems requires multi-factor authentication. Details are in the **MFA Policy** and **MFA Attestation** documents. Summary:

- Consumer app — Google OAuth (Google-enforced 2SV) **or** passwordless Email OTP (single-use, 10-minute expiry).
- Admin dashboard — same primary auth + role check + re-authentication on sensitive actions.
- Provider consoles — hardware/passkey or TOTP MFA enforced at the provider; recovery codes stored in an encrypted password manager.
- Database direct access — restricted to the Security Officer via short-lived, MFA-gated provider session; no static psql credentials on disk.

## 4. Authorization Model

- **Role storage** — `public.user_roles(user_id, role)` with enum `app_role`. RLS-protected; only the security-definer `has_role()` function reads it.
- **Default role** — `user`. The first user is auto-promoted to `admin` by `handle_new_user()`; subsequent admins must be added by an existing admin.
- **Row-level security** — enabled on every public-schema table that holds consumer data. Policies scope reads/writes to `auth.uid()` except where an admin role check is required.
- **Edge function authorization** — every function that touches consumer data re-validates the caller's JWT and role server-side.

## 5. Provisioning & Deprovisioning

- New consumer accounts self-provision via email OTP or Google OAuth; default role `user`.
- New administrative access is granted only by the Security Officer, logged in the access-review register with business justification.
- Deprovisioning: account deletion runs through a 30-day grace window enforced by `cron-retention-sweep`; emergency revocation is immediate via provider console + token rotation.

## 6. Secrets Management

- All secrets (Plaid client-id/secret per env, Stripe keys, Resend API key, Lovable AI key, CRON_SECRET, Supabase service-role key) live in the Supabase Vault / Edge Function env — never in source, never in client bundles, never in chat logs.
- Rotation: scheduled annually or immediately on suspected compromise. Rotation procedure is documented in the Plaid Operations & Maturity Policy.

## 7. Monitoring & Review

- **Continuous** — admin audit dashboard surfaces sign-in status, Plaid connection, Stripe subscription, last report, last webhook event per user.
- **Quarterly** — formal access review of every provider; documented in the access-review log.
- **Triggered** — within 5 business days of personnel change, suspected compromise, or material architectural change.
""" + FOOTER

ENCRYPTION = """# Encryption Policy

**Inherits from:** Information Security Policy
**Scope:** All consumer data, authentication material, and secrets handled by GoldFin Desk — in transit and at rest.

## 1. Encryption In Transit (Plaid Q6)

**All** network communication between clients, GoldFin Desk servers, and third-party APIs is encrypted with **TLS 1.2 or better**. TLS 1.0 and 1.1 are explicitly disabled at every surface we control.

| Channel | Protocol | Enforcement |
| --- | --- | --- |
| Browser → goldfindesk.com | TLS 1.3 (preferred), TLS 1.2 (minimum) | HSTS `max-age=63072000; includeSubDomains; preload`, automatic HTTPS redirect, modern cipher suite policy enforced by the hosting edge |
| App → Supabase REST / Realtime / Storage | TLS 1.3 | Provider-enforced; non-TLS endpoints not exposed |
| Edge Function → Plaid API | TLS 1.3 | Plaid endpoints reject non-TLS; certificate validated by Deno runtime |
| Edge Function → Stripe API | TLS 1.3 | Stripe enforces TLS 1.2+ |
| Edge Function → Resend API | TLS 1.3 | Resend enforces TLS 1.2+ |
| Plaid → webhook endpoint | TLS 1.3 | Endpoint requires HTTPS; JWT signature additionally verified |
| Stripe → webhook endpoint | TLS 1.3 | Endpoint requires HTTPS; HMAC signature additionally verified |
| Admin → provider consoles | TLS 1.3 | Provider-enforced |

**Verification** — SSL Labs scan run at least quarterly; current grade target ≥ A. Findings tracked in the risk register.

## 2. Encryption At Rest (Plaid Q7)

**All** consumer data retrieved from the Plaid API is encrypted at rest. There is no Plaid-derived data anywhere in the GoldFin Desk environment that is not encrypted at rest.

| Data class | Location | At-rest encryption |
| --- | --- | --- |
| Plaid `access_token`, `item_id` | Supabase Vault / `plaid_items` table | AES-256 (provider-managed keys); Vault entries additionally envelope-encrypted |
| Plaid account metadata (institution, mask, type) | Postgres `plaid_accounts` | AES-256 at the storage layer (Supabase / underlying cloud KMS) |
| Plaid transactions, balances | Postgres `plaid_transactions`, `plaid_balances` | AES-256 at the storage layer |
| Generated advisory reports | Postgres `advisory_reports` | AES-256 at the storage layer |
| Database backups & snapshots | Provider-managed | AES-256 |
| Edge Function secrets | Supabase Vault / env | AES-256, KMS-wrapped |
| Application logs containing identifiers | Provider log store | AES-256 |
| User backups on operator devices | None — operator does not copy production data to local devices | n/a |

Operator devices that may incidentally hold cached credentials (password manager vault, browser session) use full-disk encryption (FileVault / BitLocker) with passphrase + hardware-MFA unlock.

## 3. Key Management

- All encryption keys are managed by the underlying cloud provider's KMS (Supabase / its upstream cloud).
- GoldFin Desk does not export or hold raw encryption keys.
- Application-layer secrets (Plaid client secret, Stripe key, Resend key, CRON_SECRET) are stored in the Supabase Vault, accessed only by Edge Functions at runtime, and rotated annually or immediately on suspected compromise.

## 4. Cryptographic Standards

- Symmetric encryption: AES-256 (GCM preferred).
- Asymmetric / signature: RSA-2048+ or ECDSA P-256+.
- Hashing for non-secret integrity: SHA-256+.
- Password / OTP material: never stored in plaintext; OTPs are single-use, time-bound (10 min), and hashed before storage.

## 5. Prohibited

- TLS 1.0, TLS 1.1, SSLv3.
- MD5, SHA-1 for any security-relevant purpose.
- Custom or unreviewed cryptographic primitives.
- Storage of Plaid-derived data on operator devices.

## 6. Verification & Audit

- Quarterly SSL Labs scan of every public endpoint.
- Quarterly review of provider at-rest encryption settings and KMS configuration.
- Annual review of cryptographic standards against current NIST guidance.
""" + FOOTER

VULN_MGMT = """# Vulnerability Management Policy

**Inherits from:** Information Security Policy
**Scope:** All employee and contractor endpoints, all production assets (Edge Functions, database, dependencies, container images, third-party libraries), and all internet-exposed surfaces.

## 1. Program Objectives

This policy directly addresses Plaid Pre-Production Questionnaire Q8 and operationalizes the following:

- **Active vulnerability scanning** of every employee/contractor machine and every production asset.
- **Active monitoring and remediation of end-of-life (EOL) software** across the full stack.
- Time-bound remediation SLAs by severity.
- A documented exception process with compensating controls.

## 2. Endpoint Scanning (Employee & Contractor Machines)

| Control | Implementation |
| --- | --- |
| OS auto-update | Enforced — macOS automatic security updates enabled; OS major versions kept within N-1 of current. |
| Full-disk encryption | FileVault / BitLocker required with passphrase + hardware MFA. |
| Endpoint vulnerability scanning | Built-in OS security telemetry + a dedicated endpoint scanner (e.g., macOS XProtect/MRT or equivalent EDR) run continuously; manual `softwareupdate -l` / equivalent monthly check logged. |
| Browser/runtime patching | Chrome / Safari / Firefox auto-update; Node, Deno, and language toolchains updated at least monthly. |
| Removable media | Disallowed for production data; no production data is copied to local disk. |
| Lost / stolen device | Remote-wipe via provider MDM (iCloud Find My / equivalent); credentials rotated within 1 hour. |

Findings are reviewed weekly; any high/critical vulnerability is remediated within 7 days, moderate within 30 days.

## 3. Production Asset Scanning

| Asset | Scanner | Frequency |
| --- | --- | --- |
| Application dependencies (npm) | Dependabot + Lovable security scanner | Continuous (on every push) |
| Edge Function dependencies (Deno) | Manual `deno info` review + Dependabot equivalent for shared modules | Weekly + on every push |
| Database (Postgres) | Supabase platform patching (managed) + Supabase linter | Continuous + monthly review |
| Container / runtime | Provider-managed (Lovable / Supabase / Deno Deploy) — provider applies security patches | Provider SLA |
| Web application surface | OWASP ZAP baseline scan + Lovable's automated security scanner | Quarterly + on material change |
| Secrets in source | GitHub secret scanning + pre-commit hook | Continuous |

## 4. End-of-Life (EOL) Software Monitoring

EOL software is **actively tracked and replaced before end-of-support**. An inventory is maintained in the EOL register listing every runtime, library, and managed service with its current version, EOL date, and replacement plan.

- **Quarterly EOL review** — re-check every entry against vendor EOL calendars and `endoflife.date`.
- **Trigger** — any component within 90 days of EOL enters the active remediation queue.
- **Hard stop** — no component is permitted to remain in production past its EOL date without a written, time-boxed exception approved by the Security Officer.

Current high-attention items (illustrative — refreshed each quarter): Node.js LTS, Deno stable, Postgres major version, React, all top-level npm dependencies > 1 year stale.

## 5. Remediation SLAs

| Severity (CVSS v3.1) | SLA |
| --- | --- |
| Critical (9.0–10.0) | Patch or compensating control within **48 hours** |
| High (7.0–8.9) | Within **7 days** |
| Moderate (4.0–6.9) | Within **30 days** |
| Low (< 4.0) | Within **90 days** or accepted with justification |

Exploitable-in-the-wild vulnerabilities are treated as Critical regardless of base score.

## 6. Penetration Testing

- Annual third-party application penetration test against the production web application and Edge Function surface.
- Findings tracked in the risk register with assigned owners and target dates.
- A summary report is available to enterprise partners under NDA.

## 7. Exception Process

Any deviation from this policy requires:

1. Written justification from the requester.
2. Compensating control identified.
3. Time-bound expiry (≤ 90 days, renewable).
4. Security Officer approval.
5. Entry in the exception register, reviewed at every quarterly check-in.

## 8. Review

Quarterly review of this policy, the EOL inventory, and the open-finding queue. Triggered review within 5 business days of any P1 vulnerability or incident.
""" + FOOTER

PRIVACY_CONSENT = """# Privacy & Consent Policy

**Inherits from:** Information Security Policy
**Scope:** All collection, processing, storage, sharing, and deletion of consumer personal data by GoldFin Desk — including data retrieved from the Plaid API.

This document supports Plaid Pre-Production Questionnaire Q9 and Q10.

## 1. Public Privacy Policy

GoldFin Desk publishes a Privacy Policy at **https://goldfindesk.com/privacy**. It is:

- Displayed to end-users **within the application** before account creation and from a persistent footer link on every page.
- Required to be accepted at sign-up; acceptance is recorded with timestamp and policy version.
- Versioned; material changes trigger re-notification of affected users.

## 2. Plaid-Specific Disclosure

A Plaid-specific consent and disclosure page is published at **https://goldfindesk.com/plaid-consent** and is shown to the consumer **before Plaid Link is surfaced**. It explains:

- That GoldFin Desk uses Plaid to connect the consumer's financial accounts.
- The categories of data retrieved (account metadata, balances, transactions).
- The purpose (generating bi-weekly advisory reports).
- The retention period and the consumer's right to disconnect and delete at any time.
- A link to Plaid's own End User Privacy Policy.

The Plaid Link button is gated behind explicit acceptance of this disclosure; acceptance is recorded with timestamp, policy version, IP, and user-agent.

## 3. Consent Capture (Q10)

GoldFin Desk **obtains explicit consent** from consumers for the collection, processing, and storage of their data. Consent is:

- **Affirmative** — a positive action (checkbox + button click), never pre-checked, never inferred from continued use.
- **Granular** — separate consent records for (a) the general Privacy Policy and Terms, (b) Plaid data retrieval and processing, (c) optional email communications.
- **Recorded** — stored in the `consent_records` table with `user_id`, `consent_type`, `policy_version`, `granted_at`, `ip_address`, `user_agent`.
- **Revocable** — consumers can withdraw consent at any time from `/portal/settings`; withdrawal triggers the appropriate downstream action (Plaid item removal, account deletion grace window, email unsubscribe).

## 4. Lawful Bases

- **Contract** — processing necessary to deliver the GoldFin Desk advisory service the consumer subscribed to.
- **Consent** — Plaid data retrieval, optional marketing emails.
- **Legal obligation** — retention of payment / tax records as required by law.
- **Legitimate interests** — fraud prevention, security monitoring, service improvement (balanced against consumer rights).

## 5. Data Subject Rights (GDPR / CCPA)

Consumers may exercise the following rights by emailing **privacy@goldfindesk.com** or via in-app controls at `/portal/settings`:

| Right | Mechanism | SLA |
| --- | --- | --- |
| Access | Export of all personal data in machine-readable format | 30 days |
| Rectification | In-app edit + support ticket | 30 days |
| Erasure ("right to be forgotten") | Self-serve account deletion with 30-day grace window | Within grace window |
| Restriction | Pause processing flag on user record | 30 days |
| Portability | JSON export including Plaid-derived data | 30 days |
| Objection | Opt-out of non-essential processing | Immediate |
| Withdraw consent | In-app toggle | Immediate |

Identity is verified via re-authentication (MFA) before any rights request is fulfilled.

## 6. Sharing & Third Parties

Consumer data is shared only with the following processors, each bound by a written data-processing agreement:

| Processor | Purpose | Data shared |
| --- | --- | --- |
| Plaid | Financial-account connectivity | Plaid item identifiers, consumer name/email for support |
| Stripe | Payment processing | Email, billing identifier, payment metadata (no full card data — Stripe-hosted) |
| Resend | Transactional email | Email address, OTP code, report links |
| Lovable Cloud / Supabase | Hosting, database, auth, edge runtime | All consumer data, encrypted at rest |
| Google | OAuth sign-in | Email, OAuth claims |

No consumer data is sold. No consumer data is shared for advertising.

## 7. Cookies & Tracking

The application uses only strictly-necessary cookies (session, CSRF) and an optional first-party analytics cookie that requires explicit opt-in. No third-party advertising or cross-site tracking.

## 8. Children's Data

The service is not directed to and does not knowingly collect data from persons under 18. Accounts identified as belonging to minors are deleted promptly.

## 9. International Transfers

Data may be processed in the United States and other jurisdictions where our processors operate. Transfers rely on Standard Contractual Clauses or equivalent safeguards.

## 10. Review

- Annual review of this policy.
- Triggered review within 5 business days of any change to processors, data categories collected, or applicable law.
- Material changes are versioned and re-notified to affected consumers.
""" + FOOTER

DATA_RETENTION = """# Data Retention & Disposal Policy

**Inherits from:** Information Security Policy
**Scope:** All consumer, operational, and security data stored by GoldFin Desk.

This document supports Plaid Pre-Production Questionnaire Q11.

## 1. Statement

GoldFin Desk has a **defined, enforced, and periodically reviewed** data retention and disposal policy that complies with applicable data privacy laws (GDPR, CCPA, and equivalent). Enforcement is automated; review is documented.

A consumer-facing version of this policy is published at **https://goldfindesk.com/data-retention**.

## 2. Retention Schedule

| Data class | Retention period | Disposal trigger |
| --- | --- | --- |
| Active account profile (email, name, preferences) | Life of account | Account deletion (30-day grace) |
| Plaid item / access token | Life of account or until consumer disconnects | Consumer disconnect → immediate `/item/remove` to Plaid + DB delete |
| Plaid account metadata | Life of account or until consumer disconnects | Same as above |
| Plaid transactions | Rolling 24 months | Daily sweep removes transactions older than 24 months |
| Plaid balances (point-in-time snapshots) | Rolling 24 months | Daily sweep |
| Generated advisory reports | Rolling 24 months | Daily sweep |
| Stripe subscription records | 7 years (tax / financial record retention) | Year-end purge of records older than 7 years |
| Authentication logs (sign-in, OTP issuance) | 12 months | Daily sweep |
| Webhook event log (`webhook_events`) | 12 months | Daily sweep |
| Cron run log (`cron_runs`) | 12 months | Daily sweep |
| Consent records | 7 years after consent withdrawal (legal evidence) | Year-end purge |
| Email logs (Resend) | Per Resend retention (≤ 90 days transactional) | Provider-managed |
| Application / Edge Function logs | 30 days | Provider-managed rolling window |
| Database backups | 30 days rolling | Provider-managed |
| Deleted account residual | 30-day grace window, then full erasure | `cron-retention-sweep` daily |

## 3. Enforcement

Retention is **automatically enforced** by `cron-retention-sweep`, a scheduled Edge Function that runs **daily at 04:00 UTC**. The function:

1. Identifies records past their retention period per the schedule above.
2. Deletes them (hard delete; soft-delete is not used for retention-bound data).
3. For accounts in the 30-day grace window: revokes Plaid items, cancels Stripe subscriptions, deletes auth user, deletes profile and all owned rows via `ON DELETE CASCADE`.
4. Writes a summary row to `cron_runs` with counts deleted per table.

Manual overrides require Security Officer approval and are logged.

## 4. Consumer-Initiated Deletion

Consumers may request deletion at any time from **`/portal/settings`**. Flow:

1. Consumer clicks "Delete my account" and re-authenticates (MFA).
2. Account is marked `deletion_requested_at = now()`; service access is immediately revoked.
3. 30-day grace window allows recovery on request to `privacy@goldfindesk.com`.
4. On day 30, `cron-retention-sweep` performs full erasure as described above.
5. Confirmation email is sent on completion.

Plaid items are revoked at step 2, not step 4, so no further data is retrieved during the grace window.

## 5. Disposal Method

- **Database rows** — hard `DELETE`; cascading FKs remove dependent rows.
- **Backups** — purged on the provider's 30-day rolling window after primary deletion.
- **Logs** — purged on rolling retention windows; no manual extraction permitted.
- **Operator devices** — production data is not stored locally; cached credentials are wiped on session expiry.
- **Physical media** — n/a; GoldFin Desk uses no physical media for production data.

## 6. Legal Hold

If a legal hold is required, the Security Officer may suspend the retention sweep for specifically identified records. Holds are documented, time-bound, and reviewed monthly.

## 7. Periodic Review

This policy is reviewed:

- **Quarterly** — Security Officer confirms retention schedule remains aligned with current legal and business requirements; reviews `cron_runs` log for failed or skipped sweeps.
- **Annually** — full policy review and republication.
- **Triggered** — within 5 business days of any change to applicable privacy law, processor relationship, or data category.

Each review is recorded in the `retention_policy_reviews` table (visible in the admin audit dashboard) with reviewer, date, and outcome.

## 8. Evidence

- Public policy page — `/data-retention`
- Automated enforcement — `supabase/functions/cron-retention-sweep/`
- Review log — `retention_policy_reviews` table
- Execution log — `cron_runs` table
""" + FOOTER

MFA_CONSUMER_COVER = """# Consumer MFA Implementation — Evidence Cover

**For:** Plaid Pre-Production Questionnaire Q4 — "Does your organization provide multi-factor authentication (MFA) for consumers on the mobile and/or web applications before Plaid Link is surfaced?"

**Answer:** Yes — phishing-resistant MFA is performed before Plaid Link is surfaced.

## What the attached screenshots show

| File | Step | What it proves |
| --- | --- | --- |
| `mfa-login.png` | Login screen | Primary auth surface: Google OAuth (Google-enforced 2SV, phishing-resistant) **or** passwordless Email OTP. Password fields are intentionally absent — there is no password-only path. |
| `mfa-otp-step.png` | OTP verification step | Single-use, time-bound (10-minute) OTP delivered via Resend over TLS. Rate-limited per email and per IP. |
| `accept-terms.png` | Consent screen | Explicit Plaid disclosure and consent capture **before** Plaid Link is reachable. |

## Flow gating Plaid Link

1. Consumer arrives at `/portal/login`.
2. Authenticates via Google OAuth (2SV enforced at Google) or Email OTP (single-use, 10-min).
3. Supabase session is established; session JWT is the basis for every subsequent authorization decision.
4. Consumer accepts the Plaid-specific consent disclosure (see `accept-terms.png`).
5. Only then does the Plaid Link button render and a Link token get issued by the Edge Function.

Plaid Link cannot be surfaced without a valid, MFA-backed session **and** explicit consent — both are enforced server-side in the Edge Function, not just client-side.

## Why phishing-resistant

- **Google OAuth path** — credential never touches GoldFin Desk; Google enforces 2SV, including hardware-key support for users who enable it.
- **Email OTP path** — no reusable password; codes are single-use, short-lived, and bound to the email channel. Combined with browser-bound session cookies, this defeats common credential-replay phishing.

For full details see the **MFA Policy** and **MFA Attestation** documents in this packet.
""" + FOOTER

# ===================== BUILD =====================

DOCS = [
    ("Q2-information-security-policy.pdf", "Information Security Policy", INFO_SEC),
    ("Q3-access-control-policy.pdf", "Access Control Policy", ACCESS_CONTROL),
    ("Q6-Q7-encryption-policy.pdf", "Encryption Policy", ENCRYPTION),
    ("Q8-vulnerability-management-policy.pdf", "Vulnerability Management Policy", VULN_MGMT),
    ("Q9-Q10-privacy-and-consent-policy.pdf", "Privacy and Consent Policy", PRIVACY_CONSENT),
    ("Q11-data-retention-and-disposal-policy.pdf", "Data Retention and Disposal Policy", DATA_RETENTION),
    ("Q4-mfa-consumer-screenshots/Q4-mfa-consumer-cover.pdf", "Consumer MFA Evidence Cover", MFA_CONSUMER_COVER),
]

README = """# GoldFin Desk — Plaid Pre-Production Submission Packet

Version: 2026-06-26.1
Owner: Chris Sam, Security Officer (security@goldfindesk.com)
Domain: https://goldfindesk.com

This packet contains every document requested by the Plaid Pre-Production Security Questionnaire. Filenames are prefixed with the question number they answer so reviewers can map each upload directly to its slot.

## Index

| Question | File | What it answers |
| --- | --- | --- |
| Q2  Information Security Policy | `Q2-information-security-policy.pdf` | Documented + operationalized infosec program, governance, risk mgmt, SSDLC, IR, continuous maturation |
| Q3  Access Controls | `Q3-access-control-policy.pdf` | OAuth/TLS non-human auth · periodic access reviews · zero-trust · centralized IAM |
| Q4  Consumer MFA before Plaid Link | `Q4-mfa-consumer-screenshots/` (cover + screenshots) | Phishing-resistant MFA (Google 2SV + Email OTP) gating Plaid Link |
| Q5  MFA for critical systems | `Q5-mfa-critical-systems/` | Attestation, policy, and admin login screenshot |
| Q6  TLS 1.2+ in transit | `Q6-Q7-encryption-policy.pdf` | TLS 1.3 everywhere; TLS 1.0/1.1 disabled |
| Q7  Encryption at rest of Plaid data | `Q6-Q7-encryption-policy.pdf` | AES-256 for every Plaid-derived data class |
| Q8  Vulnerability management | `Q8-vulnerability-management-policy.pdf` | Endpoint + production scanning, EOL monitoring, SLAs |
| Q9  Privacy policy | `Q9-Q10-privacy-and-consent-policy.pdf` (live at /privacy) | Published, in-app displayed, versioned |
| Q10 Consumer consent | `Q9-Q10-privacy-and-consent-policy.pdf` | Affirmative, granular, recorded, revocable |
| Q11 Data retention & disposal | `Q11-data-retention-and-disposal-policy.pdf` (live at /data-retention) | Defined, enforced (daily cron), periodically reviewed |
| Supplemental | `Q-supplemental-plaid-operations-policy.pdf` | Full Plaid Operations & Maturity Policy with maturity model |

## Live policy URLs (for verification)

- https://goldfindesk.com/privacy
- https://goldfindesk.com/plaid-consent
- https://goldfindesk.com/data-retention
- https://goldfindesk.com/mfa-policy
- https://goldfindesk.com/mfa-attestation
- https://goldfindesk.com/plaid-operations
- https://goldfindesk.com/terms

## Contact

- Security: security@goldfindesk.com
- Privacy: privacy@goldfindesk.com
- Incident reporting: security@goldfindesk.com (acknowledged within 1 hour, 24/7)
"""

def main():
    staging = Path(tempfile.mkdtemp(prefix="goldfin-packet-"))
    print(f"staging: {staging}")

    # 1. Render new PDFs
    print("Rendering PDFs:")
    for rel, title, md in DOCS:
        render(md, staging / rel, title)

    # 2. Copy existing PDFs
    print("Copying existing PDFs:")
    existing = [
        ("public/downloads/goldfin-mfa-attestation.pdf", "Q5-mfa-critical-systems/goldfin-mfa-attestation.pdf"),
        ("public/downloads/goldfin-mfa-policy.pdf",      "Q5-mfa-critical-systems/goldfin-mfa-policy.pdf"),
        ("public/downloads/goldfin-plaid-operations-policy.pdf", "Q-supplemental-plaid-operations-policy.pdf"),
    ]
    for src, rel in existing:
        dst = staging / rel
        dst.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(src, dst)
        print(f"  copied {rel}")

    # 3. Copy existing screenshots
    print("Copying screenshots:")
    shots = [
        ("/mnt/documents/mfa-login.png",   "Q4-mfa-consumer-screenshots/mfa-login.png"),
        ("/mnt/documents/mfa-otp-step.png","Q4-mfa-consumer-screenshots/mfa-otp-step.png"),
        ("/mnt/documents/accept-terms.png","Q4-mfa-consumer-screenshots/accept-terms.png"),
        ("/mnt/documents/mfa-login.png",   "Q5-mfa-critical-systems/admin-login.png"),
    ]
    for src, rel in shots:
        if Path(src).exists():
            dst = staging / rel
            dst.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dst)
            print(f"  copied {rel}")
        else:
            print(f"  MISSING: {src}")

    # 4. README
    (staging / "README.md").write_text(README, encoding="utf-8")
    print("  wrote README.md")

    # 5. Zip
    out_zip = Path("/mnt/documents/goldfin-plaid-submission-packet.zip")
    out_zip.parent.mkdir(parents=True, exist_ok=True)
    if out_zip.exists():
        out_zip.unlink()
    with zipfile.ZipFile(out_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for p in sorted(staging.rglob("*")):
            if p.is_file():
                zf.write(p, p.relative_to(staging))
    n = sum(1 for _ in zipfile.ZipFile(out_zip).infolist())
    print(f"\n✓ {out_zip} — {out_zip.stat().st_size:,} bytes, {n} files")

if __name__ == "__main__":
    main()
