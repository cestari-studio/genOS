import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  BrandIdentityPackage,
  ContentType,
} from './types';
import { generateWithClaude } from './providers/claude';
import { generateWithGemini } from './providers/gemini';

const GEMINI_CONTENT_TYPES: ContentType[] = ['hashtags', 'title', 'caption'];

async function fetchBrandPackage(
  supabase: AnySupabaseClient,
  brandId: string,
  orgId: string
): Promise<BrandIdentityPackage | null> {
  const { data, error } = await supabase
    .from('brands')
    .select(
      'id, name, brand_voice, target_audience, industry, content_pillars, forbidden_words, mandatory_elements, regional_expertise, target_language, organization_id'
    )
    .eq('id', brandId)
    .eq('organization_id', orgId)
    .single();

  if (error || !data) return null;

  return {
    orgId: data.organization_id,
    brandId: data.id,
    brandName: data.name,
    brandVoice: data.brand_voice ?? '',
    targetAudience: data.target_audience ?? '',
    industry: data.industry ?? '',
    contentPillars: data.content_pillars ?? [],
    forbiddenWords: data.forbidden_words ? data.forbidden_words.split(',').map((w: string) => w.trim()) : [],
    mandatoryElements: data.mandatory_elements ? data.mandatory_elements.split(',').map((w: string) => w.trim()) : [],
    regionalExpertise: data.regional_expertise ?? {},
    targetLanguage: data.target_language ?? 'pt-BR',
  };
}

export async function orchestrateGeneration(
  supabase: AnySupabaseClient,
  adminSupabase: AnySupabaseClient,
  input: {
    prompt: string;
    contentType: ContentType;
    platform?: string;
    tone?: string;
    language?: string;
    brandId: string;
  },
  userId: string,
  orgId: string
): Promise<AIGenerationResponse> {
  const threadId = crypto.randomUUID();

  // Fetch brand with RLS + explicit org filter
  const brandPackage = await fetchBrandPackage(supabase, input.brandId, orgId);
  if (!brandPackage) {
    throw new Error('Brand não encontrada ou não pertence à sua organização');
  }

  const request: AIGenerationRequest = {
    prompt: input.prompt,
    contentType: input.contentType,
    platform: input.platform,
    tone: input.tone,
    language: input.language,
    brandPackage,
    threadId,
    userId,
    orgId,
  };

  // Route to provider
  const useGemini = GEMINI_CONTENT_TYPES.includes(input.contentType);
  const response = useGemini
    ? await generateWithGemini(request)
    : await generateWithClaude(request);

  // Audit log via admin client (bypasses RLS for write)
  await adminSupabase.from('audit_log').insert({
    organization_id: orgId,
    action: 'ai_generate',
    details: {
      content_type: input.contentType,
      platform: input.platform,
      brand_id: input.brandId,
      prompt_length: input.prompt.length,
    },
    ai_model: response.model,
    tokens_used: response.tokensUsed,
    thread_id: threadId,
  });

  // Token debit is handled by fn_debit_tokens trigger on audit_log insert

  return response;
}
