import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { ProjectSchema } from '@/lib/validations/crud';
import { apiSuccess, apiError, apiForbidden, apiValidationError } from '@/lib/validations/response';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    const { data, error } = await supabase.from('projects').select('*').eq('id', id).single();

    if (error) throw error;
    return apiSuccess(data);
  } catch (error) {
    console.error('Get project error:', error);
    return apiError('Erro ao buscar projeto');
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    await validateTenant(supabase, id, 'projects');

    const body = await request.json();
    const parsed = ProjectSchema.partial().safeParse(body);

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
      .from('projects')
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
    console.error('Update project error:', error);
    return apiError('Erro ao atualizar projeto');
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const supabase = await createClient();
    await validateTenant(supabase, id, 'projects');

    const { error } = await supabase.from('projects').delete().eq('id', id);

    if (error) throw error;
    return apiSuccess({ deleted: true });
  } catch (error) {
    if (error instanceof TenantViolationError) {
      return apiForbidden(error.message);
    }
    console.error('Delete project error:', error);
    return apiError('Erro ao excluir projeto');
  }
}
