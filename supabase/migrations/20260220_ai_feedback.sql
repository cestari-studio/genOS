-- AI Feedback table
CREATE TABLE IF NOT EXISTS cestari.ai_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES cestari.organizations(id),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  generation_id uuid NOT NULL,
  rating smallint NOT NULL CHECK (rating IN (-1, 1)),
  comment text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_org ON cestari.ai_feedback(org_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedback_generation ON cestari.ai_feedback(generation_id);

-- RLS policies
ALTER TABLE cestari.ai_feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY ai_feedback_org_isolation ON cestari.ai_feedback
  USING (org_id = (SELECT cestari.get_user_org_id()));
