import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { analyzeContent } from '@/lib/ai/providers/watson-nlu';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    if (!orgId) return apiError('Contexto de organização não encontrado', 403);

    const { content, brand_id } = await request.json();

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return apiError('Content is required', 400);
    }

    // Optionally load brand context for alignment scoring
    let brandContext: {
      brandVoice?: string;
      forbiddenWords?: string[];
      mandatoryElements?: string[];
    } | undefined;

    if (brand_id) {
      const supabase = await createClient();
      const { data: brand } = await supabase
        .from('brands')
        .select('brand_voice, forbidden_words, mandatory_elements')
        .eq('id', brand_id)
        .eq('organization_id', orgId)
        .single();

      if (brand) {
        brandContext = {
          brandVoice: brand.brand_voice ?? undefined,
          forbiddenWords: brand.forbidden_words
            ? brand.forbidden_words.split(',').map((w: string) => w.trim())
            : undefined,
          mandatoryElements: brand.mandatory_elements
            ? brand.mandatory_elements.split(',').map((w: string) => w.trim())
            : undefined,
        };
      }
    }

    const analysis = await analyzeContent(content, brandContext);

    return apiSuccess(analysis);
  } catch (error) {
    console.error('Content analysis error:', error);
    return apiError('Erro ao analisar conteúdo');
  }
}
