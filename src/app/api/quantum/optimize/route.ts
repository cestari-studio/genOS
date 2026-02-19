import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { optimizeSchedule } from '@/lib/quantum/optimizer';
import { apiSuccess, apiError, apiForbidden } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');
    if (!orgId || !userId) return apiError('Contexto de organização não encontrado', 403);

    const { brand_id, date_from, date_to } = await request.json();

    if (!brand_id) return apiError('brand_id é obrigatório', 400);

    const supabase = await createClient();
    await validateTenant(supabase, brand_id, 'brands');

    const result = await optimizeSchedule(
      supabase,
      brand_id,
      orgId,
      date_from && date_to ? { from: date_from, to: date_to } : undefined
    );

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof TenantViolationError) {
      return apiForbidden(error.message);
    }
    console.error('Quantum optimize error:', error);
    return apiError('Erro ao otimizar schedule');
  }
}
