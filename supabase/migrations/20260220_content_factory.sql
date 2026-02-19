-- Content Items table
CREATE TABLE IF NOT EXISTS cestari.content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id uuid NOT NULL REFERENCES cestari.organizations(id),
  title text NOT NULL,
  type varchar(20) NOT NULL CHECK (type IN ('post', 'page', 'story', 'reel')),
  status varchar(20) NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'approved', 'published')),
  platform text[] DEFAULT '{}',
  content text DEFAULT '',
  excerpt text DEFAULT '',
  scheduled_at timestamptz,
  tags text[] DEFAULT '{}',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_items_org ON cestari.content_items(org_id);
CREATE INDEX IF NOT EXISTS idx_content_items_status ON cestari.content_items(org_id, status);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON cestari.content_items(org_id, type);

-- Content Versions table (for version history)
CREATE TABLE IF NOT EXISTS cestari.content_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_item_id uuid NOT NULL REFERENCES cestari.content_items(id) ON DELETE CASCADE,
  version_number integer NOT NULL DEFAULT 1,
  snapshot jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_content_versions_item ON cestari.content_versions(content_item_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION cestari.fn_update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_content_items_updated ON cestari.content_items;
CREATE TRIGGER trg_content_items_updated
  BEFORE UPDATE ON cestari.content_items
  FOR EACH ROW EXECUTE FUNCTION cestari.fn_update_timestamp();

-- RLS policies
ALTER TABLE cestari.content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE cestari.content_versions ENABLE ROW LEVEL SECURITY;

CREATE POLICY content_items_org_isolation ON cestari.content_items
  USING (org_id = (SELECT cestari.get_user_org_id()));

CREATE POLICY content_versions_org_isolation ON cestari.content_versions
  USING (content_item_id IN (
    SELECT id FROM cestari.content_items WHERE org_id = (SELECT cestari.get_user_org_id())
  ));
