import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { AuthShell, Field, PrimaryButton, useAsync, supabase } from "../../components/portal/AuthShell";

type Enrollment = { otpauthUrl: string; secret: string; backupCodes: string[] };

export default function MfaSetup() {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [qr, setQr] = useState<string>("");
  const [code, setCode] = useState("");
  const [savedCodes, setSavedCodes] = useState(false);

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.functions.invoke("mfa-enroll", { body: {} });
      if (error || (data as { error?: string })?.error) return;
      const e = data as Enrollment;
      setEnrollment(e);
      setQr(await QRCode.toDataURL(e.otpauthUrl, { margin: 1, width: 200 }));
    })();
  }, []);

  const { run, loading, error } = useAsync(async () => {
    const { data, error } = await supabase.functions.invoke("mfa-verify", { body: { code } });
    if (error || (data as { error?: string })?.error) {
      throw new Error((data as { error?: string })?.error || error?.message || "Invalid code");
    }
    window.location.assign("/portal/accept-terms");
  });

  if (!enrollment) {
    return (
      <AuthShell title="Set up two-factor authentication">
        <p className="text-[13px] text-ink/55">Generating your secret…</p>
      </AuthShell>
    );
  }

  return (
    <AuthShell title="Set up two-factor authentication">
      <ol className="space-y-6 text-[13.5px] text-ink/75">
        <li>
          <p className="font-medium text-ink">1. Scan with an authenticator app.</p>
          <p className="text-ink/60">Authy, 1Password, Google Authenticator, etc.</p>
          {qr && <img src={qr} alt="MFA QR" className="mt-3 rounded border border-ink/10" />}
          <details className="mt-2 text-[12px]">
            <summary className="cursor-pointer text-ink/55">Can't scan? Enter manually</summary>
            <code className="mt-2 block break-all rounded bg-ink/5 p-2 text-ink">
              {enrollment.secret}
            </code>
          </details>
        </li>
        <li>
          <p className="font-medium text-ink">2. Save your backup codes.</p>
          <p className="text-ink/60">
            Each code works once. If you lose your phone, these are the only way back in.
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2 rounded border border-ink/10 bg-ink/5 p-3 font-mono text-[12.5px]">
            {enrollment.backupCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <label className="mt-2 flex items-center gap-2 text-[12.5px]">
            <input
              type="checkbox"
              checked={savedCodes}
              onChange={(e) => setSavedCodes(e.target.checked)}
            />
            <span>I've saved my backup codes somewhere safe.</span>
          </label>
        </li>
        <li>
          <p className="font-medium text-ink">3. Enter a code from your app to confirm.</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              run();
            }}
            className="mt-3 space-y-3"
          >
            <Field
              label="6-digit code"
              required
              value={code}
              onChange={(e) => setCode(e.target.value)}
              inputMode="numeric"
              maxLength={6}
              autoFocus
            />
            {error && <p className="text-[12.5px] text-red-700">{error}</p>}
            <PrimaryButton disabled={loading || !savedCodes}>
              {loading ? "Verifying…" : "Enable two-factor"}
            </PrimaryButton>
          </form>
        </li>
      </ol>
    </AuthShell>
  );
}
