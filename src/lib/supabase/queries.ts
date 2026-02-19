import 'server-only';

/**
 * Pre-composed Supabase queries to prevent N+1 patterns.
 *
 * Every query uses explicit column selection + joined relations
 * so the database returns everything in a single round-trip.
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

// ── Clients with project count ────────────────────────────────
export async function getClientsWithStats(supabase: AnySupabaseClient) {
  return supabase
    .from('clients')
    .select('*, projects:projects(count)')
    .order('created_at', { ascending: false });
}

// ── Client detail with related projects (avoids N+1) ──────────
export async function getClientWithProjects(supabase: AnySupabaseClient, clientId: string) {
  return supabase
    .from('clients')
    .select('*, projects:projects(id, name, status, updated_at)')
    .eq('id', clientId)
    .single();
}

// ── Brands with content count ─────────────────────────────────
export async function getBrandsWithStats(supabase: AnySupabaseClient) {
  return supabase
    .from('brands')
    .select('*, content_items:content_items(count)')
    .order('name');
}

// ── Content list with brand name (avoids N+1 on brand) ────────
export async function getContentItemsWithBrand(supabase: AnySupabaseClient) {
  return supabase
    .from('content_items')
    .select('id, title, type, status, platform, tags, scheduled_at, updated_at, created_by, brand:brands(id, name)')
    .order('updated_at', { ascending: false });
}

// ── Dashboard stats (single query with aggregates via RPC) ────
export async function getDashboardStats(supabase: AnySupabaseClient, orgId: string) {
  const [clients, projects, content, tokenUsage] = await Promise.all([
    supabase.from('clients').select('id', { count: 'exact', head: true }),
    supabase.from('projects').select('id', { count: 'exact', head: true }),
    supabase.from('content_items').select('id', { count: 'exact', head: true }),
    supabase
      .from('audit_log')
      .select('tokens_used')
      .eq('organization_id', orgId)
      .eq('action', 'ai_generate')
      .not('tokens_used', 'is', null),
  ]);

  const totalTokens = (tokenUsage.data ?? []).reduce(
    (sum: number, row: { tokens_used: number | null }) => sum + (row.tokens_used ?? 0),
    0
  );

  return {
    clientCount: clients.count ?? 0,
    projectCount: projects.count ?? 0,
    contentCount: content.count ?? 0,
    totalTokensUsed: totalTokens,
  };
}

// ── Audit log with pagination (avoids loading entire history) ──
export async function getAuditLogPaginated(
  supabase: AnySupabaseClient,
  page: number = 0,
  pageSize: number = 50,
) {
  return supabase
    .from('audit_log')
    .select('id, action, details, ai_model, tokens_used, created_at', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(page * pageSize, (page + 1) * pageSize - 1);
}

// ── AI thread history (conversation replay) ───────────────────
export async function getAIThreadHistory(supabase: AnySupabaseClient, threadId: string) {
  return supabase
    .from('audit_log')
    .select('id, action, details, ai_model, tokens_used, created_at')
    .eq('thread_id', threadId)
    .order('created_at', { ascending: true });
}
