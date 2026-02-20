import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { BrandSchema } from '@/lib/validations/crud';
import { apiSuccess, apiError, apiValidationError } from '@/lib/validations/response';

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: orgId } = await supabase.rpc('get_user_org_id');
    if (!orgId) return apiError('Organização não encontrada', 403);

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('organization_id', orgId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    console.error('List brands error:', error);
    return apiError('Erro ao listar marcas');
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    const body = await request.json();
    const parsed = BrandSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        errors[path] = errors[path] ?? [];
        errors[path].push(issue.message);
      }
      return apiValidationError(errors);
    }

    const { data: orgId } = await supabase.rpc('get_user_org_id');

    const { data, error } = await supabase
      .from('brands')
      .insert({ ...parsed.data, organization_id: orgId })
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(data, 201);
  } catch (error) {
    console.error('Create brand error:', error);
    return apiError('Erro ao criar marca');
  }
}
