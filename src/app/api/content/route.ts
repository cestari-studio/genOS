import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: orgId } = await supabase.rpc('get_user_org_id');

    if (!orgId) {
      return apiError('Organização não encontrada', 403);
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)));
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const search = searchParams.get('search');

    let query = supabase
      .from('content_items')
      .select('*', { count: 'exact' })
      .eq('organization_id', orgId)
      .order('updated_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (status) query = query.eq('status', status);
    if (type) query = query.eq('type', type);
    if (search) query = query.ilike('title', `%${search}%`);

    const { data, error, count } = await query;

    if (error) throw error;

    return apiSuccess({
      items: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/content error:', error);
    return apiError('Erro ao listar conteúdos');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const { title, type } = body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return apiError('Title is required', 422);
    }

    const validTypes = ['post', 'page', 'story', 'reel'];
    if (!type || !validTypes.includes(type)) {
      return apiError(`Type must be one of: ${validTypes.join(', ')}`, 422);
    }

    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) return apiError('Organização não encontrada', 403);

    const payload = {
      title: title.trim(),
      type,
      platform: body.platform ?? [],
      status: body.status ?? 'draft',
      body: body.body ?? null,
      metadata: body.metadata ?? null,
      organization_id: orgId,
    };

    const { data, error } = await supabase
      .from('content_items')
      .insert(payload)
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(data, 201);
  } catch (error) {
    console.error('POST /api/content error:', error);
    return apiError('Erro ao criar conteúdo');
  }
}
