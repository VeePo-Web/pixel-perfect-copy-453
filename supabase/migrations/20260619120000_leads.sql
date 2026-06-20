-- Free-template lead magnet capture (top of funnel → email list → $99/mo upgrade).
-- Owned source of truth; Resend handles delivery + sequence separately.
CREATE TABLE public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text,
  email text,
  business_type text,
  goals text[],
  template_id text,
  template_name text,
  source text,
  consent boolean NOT NULL DEFAULT true
);

GRANT INSERT ON public.leads TO anon, authenticated;
GRANT ALL ON public.leads TO service_role;

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit a lead"
  ON public.leads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
