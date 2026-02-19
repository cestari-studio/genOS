-- ═══════════════════════════════════════════════════════════════
-- RLS HARDENING — Complete multi-tenant isolation audit
-- Ensures org_id / organization_id isolation on ALL tables
-- ═══════════════════════════════════════════════════════════════

-- Helper: ensure get_user_org_id exists
CREATE OR REPLACE FUNCTION cestari.get_user_org_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT organization_id FROM cestari.organization_members
  WHERE user_id = auth.uid()
  LIMIT 1;
$$;

-- ── Clients ──────────────────────────────────────────────────
ALTER TABLE cestari.clients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS clients_org_select ON cestari.clients;
CREATE POLICY clients_org_select ON cestari.clients
  FOR SELECT USING (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS clients_org_insert ON cestari.clients;
CREATE POLICY clients_org_insert ON cestari.clients
  FOR INSERT WITH CHECK (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS clients_org_update ON cestari.clients;
CREATE POLICY clients_org_update ON cestari.clients
  FOR UPDATE USING (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS clients_org_delete ON cestari.clients;
CREATE POLICY clients_org_delete ON cestari.clients
  FOR DELETE USING (organization_id = cestari.get_user_org_id());

-- ── Brands ───────────────────────────────────────────────────
ALTER TABLE cestari.brands ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS brands_org_select ON cestari.brands;
CREATE POLICY brands_org_select ON cestari.brands
  FOR SELECT USING (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS brands_org_insert ON cestari.brands;
CREATE POLICY brands_org_insert ON cestari.brands
  FOR INSERT WITH CHECK (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS brands_org_update ON cestari.brands;
CREATE POLICY brands_org_update ON cestari.brands
  FOR UPDATE USING (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS brands_org_delete ON cestari.brands;
CREATE POLICY brands_org_delete ON cestari.brands
  FOR DELETE USING (organization_id = cestari.get_user_org_id());

-- ── Projects ─────────────────────────────────────────────────
ALTER TABLE cestari.projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS projects_org_select ON cestari.projects;
CREATE POLICY projects_org_select ON cestari.projects
  FOR SELECT USING (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS projects_org_insert ON cestari.projects;
CREATE POLICY projects_org_insert ON cestari.projects
  FOR INSERT WITH CHECK (organization_id = cestari.get_user_org_id());

DROP POLICY IF EXISTS projects_org_update ON cestari.projects;
CREATE POLICY projects_org_update ON cestari.projects
  FOR UPDATE USING (organization_id = cestari.get_user_org_id());

-- ── Audit Log (read-only for tenants, write via admin) ──────
ALTER TABLE cestari.audit_log ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS audit_log_org_select ON cestari.audit_log;
CREATE POLICY audit_log_org_select ON cestari.audit_log
  FOR SELECT USING (organization_id = cestari.get_user_org_id());

-- ── Organization Members ────────────────────────────────────
ALTER TABLE cestari.organization_members ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS org_members_select ON cestari.organization_members;
CREATE POLICY org_members_select ON cestari.organization_members
  FOR SELECT USING (organization_id = cestari.get_user_org_id());

-- ── Posts V2 ─────────────────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'cestari' AND table_name = 'posts_v2') THEN
    ALTER TABLE cestari.posts_v2 ENABLE ROW LEVEL SECURITY;
    DROP POLICY IF EXISTS posts_v2_org_select ON cestari.posts_v2;
    EXECUTE 'CREATE POLICY posts_v2_org_select ON cestari.posts_v2
      FOR SELECT USING (organization_id = cestari.get_user_org_id())';
    DROP POLICY IF EXISTS posts_v2_org_insert ON cestari.posts_v2;
    EXECUTE 'CREATE POLICY posts_v2_org_insert ON cestari.posts_v2
      FOR INSERT WITH CHECK (organization_id = cestari.get_user_org_id())';
    DROP POLICY IF EXISTS posts_v2_org_update ON cestari.posts_v2;
    EXECUTE 'CREATE POLICY posts_v2_org_update ON cestari.posts_v2
      FOR UPDATE USING (organization_id = cestari.get_user_org_id())';
  END IF;
END $$;
