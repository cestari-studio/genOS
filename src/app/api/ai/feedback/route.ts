import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) return apiError('Organização não encontrada', 403);

    const { searchParams } = new URL(request.url);
    const page = Math.max(0, parseInt(searchParams.get('page') ?? '0', 10));
    const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') ?? '20', 10)));

    const { data, error, count } = await supabase
      .from('ai_feedback')
      .select('*', { count: 'exact' })
      .eq('org_id', orgId)
      .order('created_at', { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (error) throw error;

    return apiSuccess({
      items: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
    });
  } catch (error) {
    console.error('GET /api/ai/feedback error:', error);
    return apiError('Erro ao listar feedback');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) return apiError('Organização não encontrada', 403);

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) return apiError('Não autenticado', 401);

    const body = await request.json();
    const { generation_id, rating, comment } = body;

    if (!generation_id || !rating || !['positive', 'negative'].includes(rating)) {
      return apiError('Dados de feedback inválidos', 400);
    }

    const { data, error } = await supabase
      .from('ai_feedback')
      .insert({
        org_id: orgId,
        user_id: user.id,
        generation_id,
        rating,
        comment: comment || null,
      })
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(data, 201);
  } catch (error) {
    console.error('POST /api/ai/feedback error:', error);
    return apiError('Erro ao registrar feedback');
  }
}
