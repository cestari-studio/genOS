import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { validateTenant, TenantViolationError } from '@/lib/auth/validateTenant';
import { orchestrateGeneration } from '@/lib/ai/orchestrator';
import { SuggestRequestSchema } from '@/lib/validations/ai';
import { apiSuccess, apiError, apiForbidden, apiValidationError } from '@/lib/validations/response';
import type { ContentType } from '@/lib/ai/types';

const SUGGEST_TYPE_MAP: Record<string, ContentType> = {
  hashtags: 'hashtags',
  title: 'title',
  excerpt: 'caption',
  cta: 'caption',
};

const SUGGEST_PROMPTS: Record<string, (content: string) => string> = {
  hashtags: (content) => `Gere 10-15 hashtags relevantes para o seguinte conteúdo:\n\n${content}\n\nRetorne apenas as hashtags, uma por linha, começando com #.`,
  title: (content) => `Sugira 5 títulos alternativos para o seguinte conteúdo:\n\n${content}\n\nRetorne apenas os títulos, um por linha, numerados.`,
  excerpt: (content) => `Crie um resumo/excerpt de 1-2 frases para o seguinte conteúdo:\n\n${content}\n\nRetorne apenas o excerpt.`,
  cta: (content) => `Sugira 5 CTAs (call-to-action) para o seguinte conteúdo:\n\n${content}\n\nRetorne apenas os CTAs, um por linha, numerados.`,
};

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');

    if (!orgId || !userId) {
      return apiError('Contexto de organização não encontrado', 403);
    }

    const body = await request.json();
    const parsed = SuggestRequestSchema.safeParse(body);

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

    const promptBuilder = SUGGEST_PROMPTS[parsed.data.type];
    const contentType = SUGGEST_TYPE_MAP[parsed.data.type] ?? 'caption';

    const result = await orchestrateGeneration(
      supabase,
      adminSupabase,
      {
        prompt: promptBuilder(parsed.data.content),
        contentType,
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
    console.error('AI suggest error:', error);
    return apiError('Erro ao gerar sugestões');
  }
}
