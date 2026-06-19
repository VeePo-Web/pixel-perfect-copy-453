CREATE TABLE public.applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  first_name text,
  email text,
  business_name text,
  business_type text,
  revenue_range text,
  current_tools text[],
  clarity_gap text,
  decisions text[],
  clarity_outcome text,
  monthly_review text,
  budget_fit text,
  worth_it text,
  timeline text,
  consent boolean NOT NULL DEFAULT false
);

GRANT INSERT ON public.applications TO anon, authenticated;
GRANT ALL ON public.applications TO service_role;

ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit an application"
  ON public.applications
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);
