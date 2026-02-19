-- Extend brands table with DNA Identity fields
ALTER TABLE cestari.brands
  ADD COLUMN IF NOT EXISTS target_language varchar(10) DEFAULT 'pt-BR',
  ADD COLUMN IF NOT EXISTS forbidden_words text,
  ADD COLUMN IF NOT EXISTS mandatory_elements text,
  ADD COLUMN IF NOT EXISTS regional_expertise jsonb DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS required_slogan boolean DEFAULT true,
  ADD COLUMN IF NOT EXISTS required_hashtags boolean DEFAULT true;

-- Extend organizations with FinOps fields
ALTER TABLE cestari.organizations
  ADD COLUMN IF NOT EXISTS token_balance integer DEFAULT 500000,
  ADD COLUMN IF NOT EXISTS token_multiplier numeric(10,2) DEFAULT 2.5,
  ADD COLUMN IF NOT EXISTS cycle_end_date timestamptz,
  ADD COLUMN IF NOT EXISTS industry_driver varchar(100) DEFAULT 'General',
  ADD COLUMN IF NOT EXISTS monthly_retainer numeric(15,2) DEFAULT 0;

-- Extend audit_log for AI operations
ALTER TABLE cestari.audit_log
  ADD COLUMN IF NOT EXISTS ai_model varchar(100),
  ADD COLUMN IF NOT EXISTS tokens_used integer,
  ADD COLUMN IF NOT EXISTS thread_id uuid;

CREATE INDEX IF NOT EXISTS idx_audit_log_ai ON cestari.audit_log (organization_id, action)
  WHERE action LIKE 'ai_%';

-- Extend posts_v2 for AI thread tracking
ALTER TABLE cestari.posts_v2
  ADD COLUMN IF NOT EXISTS ai_thread_id uuid,
  ADD COLUMN IF NOT EXISTS ai_tokens_used integer;
