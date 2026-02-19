import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { indexBrand, indexContentItems } from '@/lib/ai/rag';
import { apiSuccess, apiError } from '@/lib/validations/response';

/**
 * POST /api/ai/index — Trigger RAG indexing for brands and/or content items.
 *
 * Body: { type: "brand" | "content" | "all", brand_id?: string }
 */
export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    const { type, brand_id } = await request.json();

    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    let indexed = 0;

    if (type === 'brand' || type === 'all') {
      const brandQuery = supabase
        .from('brands')
        .select('id, name, brand_voice, target_audience, industry, content_pillars, forbidden_words, mandatory_elements');

      if (brand_id) brandQuery.eq('id', brand_id);

      const { data: brands } = await brandQuery;

      for (const brand of brands ?? []) {
        await indexBrand(adminSupabase, orgId, brand);
        indexed++;
      }
    }

    if (type === 'content' || type === 'all') {
      const { data: items } = await supabase
        .from('content_items')
        .select('id, title, content, type, platform')
        .in('status', ['published', 'approved'])
        .limit(200);

      if (items && items.length > 0) {
        await indexContentItems(adminSupabase, orgId, items);
        indexed += items.length;
      }
    }

    return apiSuccess({ indexed, type });
  } catch (error) {
    console.error('RAG indexing error:', error);
    return apiError('Erro ao indexar conteúdo para RAG');
  }
}
