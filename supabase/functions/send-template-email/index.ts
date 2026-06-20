import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

// Delivers the requested free template via Resend and (optionally) adds the
// contact to a Resend Audience for the soap-opera upgrade sequence.
// Secrets (set in Supabase / Lovable, never in the repo):
//   RESEND_API_KEY       — required to actually send
//   RESEND_FROM          — e.g. "Monthly Finance Desk <hello@yourdomain.com>"
//   RESEND_AUDIENCE_ID   — optional; enrolls the lead in the sequence audience
//   SITE_URL             — optional; used for the $99 upgrade link

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

function deliveryHtml(firstName: string, templateName: string, siteUrl: string) {
  const hi = firstName ? `Hi ${firstName},` : 'Hi,';
  const tpl = templateName || 'finance template';
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#0B0D12">
  <div style="max-width:560px;margin:0 auto;padding:40px 28px">
    <p style="font-size:11px;letter-spacing:.22em;text-transform:uppercase;color:#B8893A;margin:0 0 18px">Monthly Finance Desk</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 14px">${hi}</p>
    <p style="font-size:16px;line-height:1.6;margin:0 0 20px">Here is your <strong>${tpl}</strong>. Open it, drop in your numbers, and you will have a clearer view of the business in about ten minutes.</p>
    <p style="margin:0 0 28px"><a href="${siteUrl}/#/templates" style="display:inline-block;background:#D4A845;color:#0F1B3D;text-decoration:none;font-weight:600;font-size:14px;padding:12px 22px;border-radius:9999px">Open my template</a></p>
    <hr style="border:none;border-top:1px solid #E6E8EC;margin:28px 0" />
    <p style="font-size:14px;line-height:1.6;color:#5A6170;margin:0 0 8px">Over the next few days I will show you how owners actually use each template to make hiring, pricing, and cash-flow calls.</p>
    <p style="font-size:14px;line-height:1.6;color:#5A6170;margin:0">Prefer it done for you? <a href="${siteUrl}/#/pricing#auto-fill" style="color:#B8893A">Have your templates filled for you every month for $99 →</a></p>
  </div></body></html>`;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const { email, firstName = '', templateName = '' } = await req.json();
    if (typeof email !== 'string' || !email.includes('@')) {
      return json({ error: 'valid email required' }, 400);
    }

    const apiKey = Deno.env.get('RESEND_API_KEY');
    // Resend not wired yet — succeed quietly so lead capture is never blocked.
    if (!apiKey) return json({ ok: true, sent: false, reason: 'no_api_key' });

    const from = Deno.env.get('RESEND_FROM') ?? 'Monthly Finance Desk <onboarding@resend.dev>';
    const siteUrl = (Deno.env.get('SITE_URL') ?? '').replace(/\/$/, '');

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: `Your ${templateName || 'finance template'} is inside`,
        html: deliveryHtml(firstName, templateName, siteUrl),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      console.error('resend send error', res.status, text);
      return json({ ok: false, sent: false }, 502);
    }

    // Optional: enroll in the upgrade-sequence audience.
    const audienceId = Deno.env.get('RESEND_AUDIENCE_ID');
    if (audienceId) {
      await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, first_name: firstName, unsubscribed: false }),
      }).catch((e) => console.error('resend audience error', e));
    }

    return json({ ok: true, sent: true });
  } catch (e) {
    console.error(e);
    return json({ error: 'server error' }, 500);
  }
});
