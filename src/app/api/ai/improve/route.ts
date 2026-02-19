import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { orchestrateGeneration } from '@/lib/ai/orchestrator';
import { ImproveRequestSchema } from '@/lib/validations/ai';
import { apiSuccess, apiError, apiForbidden, apiValidationError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');

    if (!orgId || !userId) {
      return apiError('Contexto de organização não encontrado', 403);
    }

    const body = await request.json();
    const parsed = ImproveRequestSchema.safeParse(body);

    if (!parsed.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of parsed.error.issues) {
        const path = issue.path.join('.');
        errors[path] = errors[path] ?? [];
        errors[path].push(issue.message);
      }
      return apiValidationError(errors);
    }

    const supabase = await createClient();
    await validateTenant(supabase, parsed.data.brand_id, 'brands');

    const adminSupabase = createAdminClient();

    const prompt = `Melhore o seguinte conteúdo conforme a instrução.

CONTEÚDO ORIGINAL:
${parsed.data.content}

INSTRUÇÃO:
${parsed.data.instruction}

Retorne apenas o conteúdo melhorado, sem explicações adicionais.`;

    const result = await orchestrateGeneration(
      supabase,
      adminSupabase,
      {
        prompt,
        contentType: 'post',
        brandId: parsed.data.brand_id,
      },
      userId,
      orgId
    );

    return apiSuccess(result);
  } catch (error) {
    if (error instanceof TenantViolationError) {
      return apiForbidden(error.message);
    }
    console.error('AI improve error:', error);
    return apiError('Erro ao melhorar conteúdo');
  }
}
