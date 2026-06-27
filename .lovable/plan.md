# Plaid Submission Packet — One Downloadable ZIP

Bundle every document Plaid is asking for into a single zip at `/mnt/documents/goldfin-plaid-submission-packet.zip`, mapped 1:1 to the questionnaire items so you can upload each one in the right slot.

## ZIP contents (final layout)

```
goldfin-plaid-submission-packet.zip
├── README.md                                  ← index mapping each file to Q#
├── Q2-information-security-policy.pdf         ← NEW
├── Q3-access-control-policy.pdf               ← NEW (covers OAuth/TLS non-human auth,
│                                                  periodic access reviews, zero-trust,
│                                                  centralized IAM)
├── Q4-mfa-consumer-screenshots/               ← existing screenshots
│   ├── mfa-login.png
│   ├── mfa-otp-step.png
│   ├── accept-terms.png
│   └── Q4-mfa-consumer-cover.pdf              ← NEW 1-page cover explaining the flow
├── Q5-mfa-critical-systems/
│   ├── goldfin-mfa-attestation.pdf            ← existing
│   ├── goldfin-mfa-policy.pdf                 ← existing
│   └── mfa-admin-login.png                    ← captured fresh via Playwright
├── Q6-Q7-encryption-policy.pdf                ← NEW (TLS 1.2+ in-transit, AES-256
│                                                  at-rest for all Plaid-derived data)
├── Q8-vulnerability-management-policy.pdf     ← NEW (scans on laptops + prod,
│                                                  EOL software monitoring)
├── Q9-Q10-privacy-and-consent-policy.pdf      ← NEW (links to /privacy and
│                                                  /plaid-consent, in-app display
│                                                  evidence, consent capture flow)
├── Q11-data-retention-and-disposal-policy.pdf ← NEW (mirrors /data-retention)
└── Q-supplemental-plaid-operations-policy.pdf ← existing Plaid Operations & Maturity
```

## What gets built

1. **Six new markdown sources** under `docs/plaid/submission/`:
   - `information-security-policy.md`
   - `access-control-policy.md`
   - `mfa-consumer-cover.md`
   - `encryption-policy.md`
   - `vulnerability-management-policy.md`
   - `privacy-and-consent-policy.md`
   - `data-retention-and-disposal-policy.md`

   Each one is written to plug directly into the specific Plaid question, signed by Chris Sam, versioned `2026-06-26.1`, quarterly review cadence, cites the same standards stack (SOC 2, NIST, PCI-DSS) used in the existing policies.

2. **One generic PDF builder** — `scripts/build-submission-pdf.py`
   - Takes a markdown source + output path as args.
   - Reuses the exact reportlab style from `scripts/build-mfa-attestation-pdf.py` (navy headings, gold rule, header/footer) so every PDF in the packet matches.
   - Used to render all six new PDFs in one loop.

3. **Web mirrors** for the policies that should also be linkable from the site (so Plaid reviewers can verify they're live):
   - `/info-sec-policy`, `/access-control-policy`, `/encryption-policy`, `/vulnerability-policy` — minimal pages reusing `MfaPolicy.tsx` layout primitives, each with a "Download PDF" button.
   - Register routes in `src/portal/PortalRouter.tsx` and add footer links in `src/components/footer/GoldFinFooter.tsx`.
   - (Privacy, Plaid Consent, Data Retention, MFA Policy, MFA Attestation, Plaid Operations already have pages — leave them as-is.)

4. **Capture missing screenshot** — `mfa-admin-login.png` via Playwright against the running preview (admin login route, post-OTP state) to round out the Q5 evidence.

5. **Packet assembler** — `scripts/build-submission-packet.py`
   - Generates a `README.md` index that lists every file with its mapped Plaid question number and a one-line description.
   - Copies the screenshots from `/mnt/documents/screenshots/*` into the staging dir.
   - Zips the whole staging tree to `/mnt/documents/goldfin-plaid-submission-packet.zip`.
   - Prints final size + file count.

6. **QA**
   - Render every new PDF to JPG, inspect each page for clipping/overflow/missing glyphs, fix and re-render until clean.
   - `unzip -l` the final archive to confirm structure matches the layout above.

7. **Deliver** — surface the zip in chat:
   ```
   <presentation-artifact path="goldfin-plaid-submission-packet.zip" mime_type="application/zip"></presentation-artifact>
   ```

## What is NOT in scope

- No changes to auth, database schema, edge functions, or Plaid integration code — this is pure documentation + packaging.
- No new design tokens; web mirror pages reuse the existing trust-page layout.
- Documents describe controls that already exist; nothing is fabricated. Anything I'm uncertain about (e.g. whether you personally run a laptop MDM/EDR product) will be phrased as the actual current state — sole-operator with full-disk encryption, auto-updates, password-manager-backed credentials, no shared accounts — not as a fictional enterprise MDM rollout.

Approve and I'll generate the packet and drop the zip in chat.