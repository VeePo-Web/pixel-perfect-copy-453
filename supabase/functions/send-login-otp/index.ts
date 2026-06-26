// Passwordless login: generate a 6-digit code, store SHA-256 hash, email it.
// Creates the auth user on first use (auto-confirmed) so OTP verify can mint
// a session for brand-new accounts.
import { z } from "npm:zod@3.23.8";
import { adminClient, corsHeaders, json } from "../_shared/auth-context.ts";

const Body = z.object({ email: z.string().email() });

const RESEND_GATEWAY = "https://connector-gateway.lovable.dev/resend";
const FROM = "Goldfin Desk <noreply@goldfindesk.com>";
const OTP_TTL_MIN = 10;

async function sha256Hex(s: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function generateCode(): string {
  const arr = new Uint32Array(1);
  crypto.getRandomValues(arr);
  return (arr[0] % 1_000_000).toString().padStart(6, "0");
}

function emailHtml(code: string) {
  return `<!doctype html><html><body style="font-family:-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,sans-serif;background:#faf8f3;padding:32px;color:#1a1815">
  <div style="max-width:480px;margin:0 auto;background:#ffffff;border:1px solid #e8e3d8;border-radius:16px;padding:32px">
    <div style="font-size:13px;letter-spacing:.18em;text-transform:uppercase;color:#8a857a">Goldfin Desk</div>
    <h1 style="font-size:20px;margin:16px 0 8px;color:#1a1815">Your sign-in code</h1>
    <p style="font-size:14px;color:#55534c;margin:0 0 24px;line-height:1.6">Enter this code in the portal to finish signing in. It expires in ${OTP_TTL_MIN} minutes.</p>
    <div style="font-size:32px;letter-spacing:.4em;font-weight:600;text-align:center;padding:20px;background:#f7f3e8;border-radius:12px;color:#1a1815;font-family:Menlo,Consolas,monospace">${code}</div>
    <p style="font-size:12px;color:#8a857a;margin:24px 0 0;line-height:1.6">If you didn't try to sign in, ignore this email. Goldfin Desk will never ask you for this code.</p>
  </div>
  <p style="font-size:11px;color:#a8a499;text-align:center;margin-top:16px">Goldfin Desk · read-only financial clarity</p>
</body></html>`;
}

async function findOrCreateUser(admin: ReturnType<typeof adminClient>, email: string): Promise<string | null> {
  // listUsers w/ filter; fall back to create if not found.
  const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
  const found = list?.users?.find((u) => u.email?.toLowerCase() === email.toLowerCase());
  if (found) return found.id;
  const { data: created, error } = await admin.auth.admin.createUser({
    email,
    email_confirm: true,
  });
  if (error) {
    console.error("createUser failed", error);
    return null;
  }
  return created.user?.id ?? null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = Body.safeParse(await req.json());
    if (!parsed.success) return json({ error: "Invalid request" }, 400);
    const email = parsed.data.email.toLowerCase();

    const admin = adminClient();
    const userId = await findOrCreateUser(admin, email);
    if (!userId) return json({ error: "Could not start sign-in" }, 500);

    const code = generateCode();
    const codeHash = await sha256Hex(code);
    const expiresAt = new Date(Date.now() + OTP_TTL_MIN * 60 * 1000).toISOString();
    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? null;
    const userAgent = req.headers.get("user-agent");

    await admin
      .from("login_otps")
      .update({ consumed_at: new Date().toISOString() })
      .eq("user_id", userId)
      .is("consumed_at", null);

    const { error: insErr } = await admin.from("login_otps").insert({
      user_id: userId,
      email,
      code_hash: codeHash,
      expires_at: expiresAt,
      ip,
      user_agent: userAgent,
    });
    if (insErr) return json({ error: "Failed to issue code" }, 500);

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (LOVABLE_API_KEY && RESEND_API_KEY) {
      try {
        const r = await fetch(`${RESEND_GATEWAY}/emails`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${LOVABLE_API_KEY}`,
            "X-Connection-Api-Key": RESEND_API_KEY,
          },
          body: JSON.stringify({
            from: FROM,
            to: [email],
            subject: `Your Goldfin Desk sign-in code: ${code}`,
            html: emailHtml(code),
            text: `Your Goldfin Desk sign-in code is ${code}. It expires in ${OTP_TTL_MIN} minutes.`,
          }),
        });
        if (!r.ok) console.error("Resend send failed", r.status, await r.text());
      } catch (e) {
        console.error("Resend exception", e);
      }
    } else {
      console.warn("send-login-otp: email env not configured; OTP not sent");
    }

    return json({ ok: true, expiresAt });
  } catch (e) {
    console.error("send-login-otp exception", e);
    return json({ error: "Unexpected error" }, 500);
  }
});
