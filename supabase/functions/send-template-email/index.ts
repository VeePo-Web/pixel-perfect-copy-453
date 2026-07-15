import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Delivers the GoldFin Template Vault via Resend and (optionally) adds the
// contact to a Resend Audience for the soap-opera upgrade sequence.
// Secrets (set in Supabase / Lovable, never in the repo):
//   RESEND_API_KEY       — required to actually send
//   RESEND_FROM          — e.g. "Chris Sam — GoldFin Desk <chris@goldfindesk.com>"
//   RESEND_AUDIENCE_ID   — optional; enrolls the lead in the sequence audience
//   SITE_URL             — optional; defaults to https://goldfindesk.com

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

// The Vault is a zip of the four real Plaid-fillable workbooks. The email's
// one job is to open it — the CTA links straight to the zip, never to a page
// the lead has already seen.
const VAULT_ZIP_PATH = '/downloads/goldfin-template-vault.zip';

function deliveryHtml(firstName: string, siteUrl: string) {
  const hi = firstName && firstName !== 'Friend' ? `Hi ${firstName},` : 'Hi,';
  const zipUrl = `${siteUrl}${VAULT_ZIP_PATH}`;
  const body = 'font-size:16px;line-height:1.65;margin:0 0 18px';
  const muted = 'font-size:14px;line-height:1.65;color:#5A6170;margin:0 0 10px';
  const li = 'font-size:15px;line-height:1.7;margin:0 0 6px;color:#0B0D12';
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px">
    <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 20px">GoldFin Desk</p>
    <p style="${body}">${hi}</p>
    <p style="${body}">Your <strong>GoldFin Template Vault</strong> is attached to this link — one zip folder, four Excel workbooks, ready to open:</p>
    <ul style="margin:0 0 20px;padding:0 0 0 20px">
      <li style="${li}"><strong>Owner Command Center</strong> — the first-tab answer: cash, deposits, outflows, runway</li>
      <li style="${li}"><strong>13-Week Cash Map</strong> — will cash feel tight next quarter?</li>
      <li style="${li}"><strong>Cash-Basis P&amp;L Review</strong> — is operating activity actually profitable?</li>
      <li style="${li}"><strong>Expense &amp; Vendor Audit</strong> — where did the money go?</li>
    </ul>
    <p style="margin:0 0 12px"><a href="${zipUrl}" style="display:inline-block;background:#D4A845;color:#0F1B3D;text-decoration:none;font-weight:600;font-size:14px;padding:13px 24px;border-radius:9999px">Download my Vault (.zip)</a></p>
    <p style="font-size:12.5px;line-height:1.5;color:#8A93A3;margin:0 0 28px">Four .xlsx files, ~17&nbsp;KB. Opens in Excel, Google Sheets, or Numbers. Drop in your numbers and you'll see the business more clearly in about ten minutes.</p>
    <p style="${body}">One thing before you go. Most owners check the <strong>bank balance</strong> to feel safe. It's the fastest number to find — and the most misleading. It tells you what's <em>left</em>. It says nothing about what's <em>coming</em>: payroll, taxes, the invoice that hasn't cleared, the client who pays late.</p>
    <p style="${body}">Over the next five days I'll send one short email showing how owners actually use each of these four workbooks to make real decisions — hiring, pricing, cash reserves. No spam. Just the thinking.</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 4px">— Chris Sam</p>
    <p style="font-size:13px;line-height:1.5;color:#8A93A3;margin:0 0 28px">GoldFin Desk</p>
    <hr style="border:none;border-top:1px solid #E6E8EC;margin:0 0 20px" />
    <p style="${muted}"><strong style="color:#0B0D12">P.S.</strong> Prefer not to fill these in yourself every month? That's exactly what GoldFin Reports does for $150/mo — the same four workbooks filled from your numbers, with a plain-English briefing. <a href="${siteUrl}/pricing#auto-fill" style="color:#B8893A">See how it works →</a></p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, firstName = '' } = await req.json();
    if (typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'valid email required' }, 400);
    }

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    // Resend not wired yet — succeed quietly so lead capture is never blocked.
    if (!lovableKey || !resendKey) {
      return json({ ok: true, sent: false, reason: 'no_api_key' });
    }

    const from = Deno.env.get('RESEND_FROM') ?? 'Chris Sam — GoldFin Desk <noreply@goldfindesk.com>';
    const siteUrl = (Deno.env.get('SITE_URL') ?? 'https://goldfindesk.com').replace(/\/$/, '');
    const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${lovableKey}`,
      'X-Connection-Api-Key': resendKey,
    };

    // Enroll the lead in the Resend Audience so the Day 2–7 soap-opera
    // automation picks them up. Fire-and-forget: enrollment must never block
    // the delivery email.
    const audienceId = Deno.env.get('RESEND_AUDIENCE_ID');
    if (audienceId) {
      fetch(`${GATEWAY_URL}/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email,
          first_name: firstName || undefined,
          unsubscribed: false,
        }),
      }).catch((e) => console.error('audience enroll failed', e));
    }

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your GoldFin Template Vault is inside',
        html: deliveryHtml(firstName, siteUrl),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('resend gateway error', res.status, text);
      // Return 200 with fallback flag so lead capture UX is never blocked.
      return json({ ok: true, sent: false, reason: 'send_failed' });
    }

    return json({ ok: true, sent: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'server error' }, 500);
  }
});
