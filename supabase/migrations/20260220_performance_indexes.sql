-- ═══════════════════════════════════════════════════════════════
-- PERFORMANCE INDEXES — Phase 3 Optimization
-- Covers: hot-path queries, composite indexes, partial indexes,
-- GIN for JSONB/array columns, BRIN for time-series
-- ═══════════════════════════════════════════════════════════════

-- ── Brands ─────────────────────────────────────────────────────
-- Hot query: brand list by org (sidebar, selectors)
CREATE INDEX IF NOT EXISTS idx_brands_org_name
  ON cestari.brands (organization_id, name);

-- Hot query: brand DNA lookup by ID + org
CREATE INDEX IF NOT EXISTS idx_brands_id_org
  ON cestari.brands (id, organization_id);

-- ── Clients ────────────────────────────────────────────────────
-- Hot query: client list by org sorted by name
CREATE INDEX IF NOT EXISTS idx_clients_org_name
  ON cestari.clients (organization_id, name);

-- Hot query: client by status for filtering
CREATE INDEX IF NOT EXISTS idx_clients_org_status
  ON cestari.clients (organization_id, status);

-- ── Projects ───────────────────────────────────────────────────
-- Hot query: project list by org
CREATE INDEX IF NOT EXISTS idx_projects_org_updated
  ON cestari.projects (organization_id, updated_at DESC);

-- Hot query: project by client (N+1 prevention for client detail)
CREATE INDEX IF NOT EXISTS idx_projects_client
  ON cestari.projects (client_id) WHERE client_id IS NOT NULL;

-- ── Content Items ──────────────────────────────────────────────
-- Hot query: content list by org sorted by updated_at (default view)
CREATE INDEX IF NOT EXISTS idx_content_items_org_updated
  ON cestari.content_items (org_id, updated_at DESC);

-- Hot query: scheduled content (calendar view)
CREATE INDEX IF NOT EXISTS idx_content_items_scheduled
  ON cestari.content_items (org_id, scheduled_at)
  WHERE scheduled_at IS NOT NULL;

-- Hot query: content by creator (my content filter)
CREATE INDEX IF NOT EXISTS idx_content_items_creator
  ON cestari.content_items (created_by, org_id);

-- GIN index for platform array queries
CREATE INDEX IF NOT EXISTS idx_content_items_platform_gin
  ON cestari.content_items USING GIN (platform);

-- GIN index for tags array queries
CREATE INDEX IF NOT EXISTS idx_content_items_tags_gin
  ON cestari.content_items USING GIN (tags);

-- ── Audit Log ──────────────────────────────────────────────────
-- BRIN for time-series queries (very efficient for append-only)
CREATE INDEX IF NOT EXISTS idx_audit_log_created_brin
  ON cestari.audit_log USING BRIN (created_at);

-- Hot query: token usage by org in date range
CREATE INDEX IF NOT EXISTS idx_audit_log_org_action_date
  ON cestari.audit_log (organization_id, action, created_at DESC);

-- Hot query: thread history lookup
CREATE INDEX IF NOT EXISTS idx_audit_log_thread
  ON cestari.audit_log (thread_id) WHERE thread_id IS NOT NULL;

-- ── AI Feedback ────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_ai_feedback_org_created
  ON cestari.ai_feedback (org_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ai_feedback_generation
  ON cestari.ai_feedback (generation_id);

-- ── Organization Members ───────────────────────────────────────
-- Hot query: org member lookup (used by get_user_org_id)
CREATE INDEX IF NOT EXISTS idx_org_members_user_org
  ON cestari.organization_members (user_id, organization_id);

-- ── Posts V2 (if exists) ───────────────────────────────────────
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'cestari' AND table_name = 'posts_v2') THEN
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_posts_v2_org_published
      ON cestari.posts_v2 (organization_id, published_at DESC NULLS LAST)';
    EXECUTE 'CREATE INDEX IF NOT EXISTS idx_posts_v2_ai_thread
      ON cestari.posts_v2 (ai_thread_id) WHERE ai_thread_id IS NOT NULL';
  END IF;
END $$;

-- ── Content Embeddings (supplement HNSW) ───────────────────────
-- Composite for filtered similarity search (org + type before vector scan)
CREATE INDEX IF NOT EXISTS idx_content_embeddings_org_type
  ON cestari.content_embeddings (org_id, source_type);
