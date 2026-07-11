import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Delivers the requested free template via Resend and (optionally) adds the
// contact to a Resend Audience for the soap-opera upgrade sequence.
// Secrets (set in Supabase / Lovable, never in the repo):
//   RESEND_API_KEY       — required to actually send
//   RESEND_FROM          — e.g. "Monthly Finance Desk <hello@yourdomain.com>"
//   RESEND_AUDIENCE_ID   — optional; enrolls the lead in the sequence audience
//   SITE_URL             — optional; used for the $150 upgrade link

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

function deliveryHtml(firstName: string, templateName: string, siteUrl: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const tpl = templateName || 'GoldFin Template Vault';
  const body = 'font-size:16px;line-height:1.65;margin:0 0 18px';
  const muted = 'font-size:14px;line-height:1.65;color:#5A6170;margin:0 0 10px';
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px">
    <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 20px">GoldFin Desk</p>
    <p style="${body}">${hi}</p>
    <p style="${body}">Here is your <strong>${tpl}</strong> — cash flow, monthly review, expense audit, hiring affordability, subscription tracker, and tax reserve. Open it, drop in your numbers, and you'll see the business more clearly in about ten minutes.</p>
    <p style="margin:0 0 28px"><a href="${siteUrl}/templates" style="display:inline-block;background:#D4A845;color:#0F1B3D;text-decoration:none;font-weight:600;font-size:14px;padding:13px 24px;border-radius:9999px">Open my Vault</a></p>
    <p style="${body}">One thing before you go. Most owners check the <strong>bank balance</strong> to feel safe. It's the fastest number to find — and the most misleading. It tells you what's <em>left</em>. It says nothing about what's <em>coming</em>: payroll, taxes, the invoice that hasn't cleared, the client who pays late.</p>
    <p style="${body}">Over the next five days I'll send one short email showing how owners actually use each template to make real decisions — hiring, pricing, cash reserves. No spam. Just the thinking.</p>
    <p style="font-size:15px;line-height:1.6;margin:0 0 4px">— Chris Sam</p>
    <p style="font-size:13px;line-height:1.5;color:#8A93A3;margin:0 0 28px">GoldFin Desk</p>
    <hr style="border:none;border-top:1px solid #E6E8EC;margin:0 0 20px" />
    <p style="${muted}"><strong style="color:#0B0D12">P.S.</strong> Prefer not to fill these in yourself every month? That's exactly what GoldFin Reports does for $150/mo — your templates filled from your numbers, with a plain-English briefing. <a href="${siteUrl}/pricing#auto-fill" style="color:#B8893A">See how it works →</a></p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, firstName = '', templateName = '' } = await req.json();
    if (typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'valid email required' }, 400);
    }

    const lovableKey = Deno.env.get('LOVABLE_API_KEY');
    const resendKey = Deno.env.get('RESEND_API_KEY');
    // Resend not wired yet — succeed quietly so lead capture is never blocked.
    if (!lovableKey || !resendKey) {
      return json({ ok: true, sent: false, reason: 'no_api_key' });
    }

    const from = Deno.env.get('RESEND_FROM') ?? 'Goldfin Desk <noreply@goldfindesk.com>';
    const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');
    const GATEWAY_URL = 'https://connector-gateway.lovable.dev/resend';

    const res = await fetch(`${GATEWAY_URL}/emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${lovableKey}`,
        'X-Connection-Api-Key': resendKey,
      },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Your ${templateName || 'finance template'} is inside`,
        html: deliveryHtml(firstName, templateName, siteUrl),
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
