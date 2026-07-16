CREATE TABLE public.bibi_security_events (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  kind TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'low',
  detail TEXT,
  ip TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
GRANT ALL ON public.bibi_security_events TO service_role;
ALTER TABLE public.bibi_security_events ENABLE ROW LEVEL SECURITY;
CREATE INDEX bibi_security_events_created_at_idx ON public.bibi_security_events (created_at DESC);