CREATE TABLE public.bibi_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question text NOT NULL,
  normalized text NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);
GRANT ALL ON public.bibi_questions TO service_role;
ALTER TABLE public.bibi_questions ENABLE ROW LEVEL SECURITY;
CREATE INDEX bibi_questions_normalized_idx ON public.bibi_questions (normalized);
CREATE INDEX bibi_questions_created_at_idx ON public.bibi_questions (created_at DESC);