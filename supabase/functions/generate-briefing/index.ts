import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

const SECTION_LABELS = [
  "Cash Movement",
  "Revenue Trend",
  "Expense Pattern",
  "Unusual Spend",
  "Questions to Review",
  "Decisions to Consider",
] as const;

const SYSTEM_PROMPT = `You are a calm, senior finance operator preparing a sample bi-weekly finance briefing for a small business owner who described their business. Your voice is plain-English, serious, and premium. You do not use hype, exclamation marks, emojis, the word "AI", "magic", "supercharge", or "leverage". You sound like a trusted CFO, not a SaaS landing page.

Read the owner's description. Invent reasonable demo numbers consistent with whatever scale they describe (team size, monthly revenue, industry). If the description is vague, choose modest realistic figures and stay qualitative where you can't be specific.

Return EXACTLY six sections, in this order, with these exact labels: "Cash Movement", "Revenue Trend", "Expense Pattern", "Unusual Spend", "Questions to Review", "Decisions to Consider". Each section body is 2-4 short sentences. No bullet lists inside a section. No headers inside a section. Dollar figures allowed when scale is implied.

Reflect the specifics the owner mentioned (industry, team size, revenue, the tension they named) so the briefing reads as if written about their actual business.`;

// In-memory IP rate limit — Task 4 of the pipeline audit. `generate-briefing`
// is intentionally public (marketing demo) so an anonymous flood could still
// burn credits. Instance-local map with a rolling hourly window is enough to
// stop scripted spikes without adding a DB round-trip to every request.
const IP_BUCKET_LIMIT = 20;             // requests per hour per IP
const IP_BUCKET_WINDOW_MS = 60 * 60 * 1000;
const ipBuckets = new Map<string, { hits: number[] }>();
function pruneAndCount(ip: string): number {
  const now = Date.now();
  const bucket = ipBuckets.get(ip) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((t) => now - t < IP_BUCKET_WINDOW_MS);
  bucket.hits.push(now);
  ipBuckets.set(ip, bucket);
  return bucket.hits.length;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    // Rate-limit by first hop in x-forwarded-for (Supabase edge sets this).
    const fwd = req.headers.get('x-forwarded-for') ?? '';
    const ip = fwd.split(',')[0].trim() || 'unknown';
    const count = pruneAndCount(ip);
    if (count > IP_BUCKET_LIMIT) {
      return new Response(
        JSON.stringify({ error: 'rate_limited', limit: IP_BUCKET_LIMIT, window_hours: 1 }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '3600' } },
      );
    }

    const { prompt } = await req.json();
    if (typeof prompt !== 'string' || prompt.trim().length === 0) {
      return new Response(JSON.stringify({ error: 'prompt required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }


    const apiKey = Deno.env.get('LOVABLE_API_KEY');
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'missing api key' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: prompt.slice(0, 2000) },
        ],
        tools: [
          {
            type: 'function',
            function: {
              name: 'return_briefing',
              description: 'Return the six-section bi-weekly finance briefing.',
              parameters: {
                type: 'object',
                properties: {
                  sections: {
                    type: 'array',
                    minItems: 6,
                    maxItems: 6,
                    items: {
                      type: 'object',
                      properties: {
                        label: { type: 'string', enum: [...SECTION_LABELS] },
                        body: { type: 'string' },
                      },
                      required: ['label', 'body'],
                      additionalProperties: false,
                    },
                  },
                },
                required: ['sections'],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: 'function', function: { name: 'return_briefing' } },
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('gateway error', response.status, text);
      return new Response(JSON.stringify({ error: 'gateway error', status: response.status }), {
        status: response.status === 429 || response.status === 402 ? response.status : 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const data = await response.json();
    const toolCall = data?.choices?.[0]?.message?.tool_calls?.[0];
    const args = toolCall?.function?.arguments;
    let parsed: { sections: { label: string; body: string }[] } | null = null;
    try {
      parsed = typeof args === 'string' ? JSON.parse(args) : args;
    } catch (_e) {
      parsed = null;
    }

    if (!parsed?.sections || !Array.isArray(parsed.sections)) {
      return new Response(JSON.stringify({ error: 'malformed' }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Reorder/dedupe to the canonical six labels.
    const byLabel = new Map(parsed.sections.map((s) => [s.label, s.body]));
    const sections = SECTION_LABELS.map((label) => ({
      label,
      body: byLabel.get(label) ?? '',
    }));

    return new Response(JSON.stringify({ sections }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: 'server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
