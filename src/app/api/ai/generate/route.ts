import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { orchestrateGeneration } from '@/lib/ai/orchestrator';
import { GenerateRequestSchema } from '@/lib/validations/ai';
import { apiSuccess, apiError, apiForbidden, apiValidationError } from '@/lib/validations/response';
import type { ContentType } from '@/lib/ai/types';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');

    if (!orgId || !userId) {
      return apiError('Contexto de organização não encontrado', 403);
    }

    const body = await request.json();
    const parsed = GenerateRequestSchema.safeParse(body);

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

    const result = await orchestrateGeneration(
      supabase,
      adminSupabase,
      {
        prompt: parsed.data.prompt,
        contentType: parsed.data.content_type as ContentType,
        platform: parsed.data.platform,
        tone: parsed.data.tone,
        language: parsed.data.language,
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
    console.error('AI generate error:', error);
    return apiError('Erro ao gerar conteúdo');
  }
}
