import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { BrandSchema } from '@/lib/validations/crud';
import { apiSuccess, apiError, apiForbidden, apiValidationError } from '@/lib/validations/response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.from('brands').select('*').eq('id', id).single();

    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    console.error('Get brand error:', error);
    return apiError('Erro ao buscar marca');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    await validateTenant(supabase, id, 'brands');

    const body = await request.json();
    const parsed = BrandSchema.partial().safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        errors[path] = errors[path] ?? [];
        errors[path].push(issue.message);
      }
      return apiValidationError(errors);
    }

    const { data, error } = await supabase
      .from('brands')
      .update(parsed.data)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    if (error instanceof TenantViolationError) {
      return apiForbidden(error.message);
    }
    console.error('Update brand error:', error);
    return apiError('Erro ao atualizar marca');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    await validateTenant(supabase, id, 'brands');

    const { error } = await supabase.from('brands').delete().eq('id', id);

    if (error) throw error;
    return apiSuccess({ deleted: true });
  } catch (error) {
    if (error instanceof TenantViolationError) {
      return apiForbidden(error.message);
    }
    console.error('Delete brand error:', error);
    return apiError('Erro ao excluir marca');
  }
}
