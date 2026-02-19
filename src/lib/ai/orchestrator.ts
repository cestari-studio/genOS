import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  AIProvider,
  BrandIdentityPackage,
  ContentType,
} from './types';
import { generateWithClaude } from './providers/claude';
import { generateWithGemini } from './providers/gemini';
import { generateWithGranite, type GraniteModel } from './providers/granite';
import { retrieveContext } from './rag';

/**
 * Provider routing strategy:
 *
 * - Gemini: hashtags, title, caption (fast, cheap micro-content)
 * - Granite 8B: story, reel (IBM-optimized for structured short content)
 * - Granite 128K: blog, email (long-form, large context window)
 * - Claude: post (default, highest quality for general content)
 *
 * Provider can be overridden via `preferred_provider` parameter.
 */

const GEMINI_CONTENT_TYPES: ContentType[] = ['hashtags', 'title', 'caption'];
const GRANITE_CONTENT_TYPES: ContentType[] = ['story', 'reel'];
const GRANITE_LONG_CONTENT_TYPES: ContentType[] = ['blog', 'email'];

function selectProvider(contentType: ContentType, preferred?: AIProvider): { provider: AIProvider; graniteModel?: GraniteModel } {
  if (preferred) {
    if (preferred === 'granite') {
      const model = GRANITE_LONG_CONTENT_TYPES.includes(contentType)
        ? 'ibm/granite-3.1-dense-128k' as GraniteModel
        : 'ibm/granite-3.1-8b-instruct' as GraniteModel;
      return { provider: 'granite', graniteModel: model };
    }
    return { provider: preferred };
  }

  if (GEMINI_CONTENT_TYPES.includes(contentType)) {
    return { provider: 'gemini' };
  }

  if (GRANITE_LONG_CONTENT_TYPES.includes(contentType)) {
    return { provider: 'granite', graniteModel: 'ibm/granite-3.1-dense-128k' };
  }

  if (GRANITE_CONTENT_TYPES.includes(contentType)) {
    return { provider: 'granite', graniteModel: 'ibm/granite-3.1-8b-instruct' };
  }

  return { provider: 'claude' };
}

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
    preferredProvider?: AIProvider;
    useRAG?: boolean;
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

  // RAG: retrieve relevant context if enabled and watsonx embeddings are available
  let ragContext = '';
  const shouldUseRAG = input.useRAG !== false && !!process.env.WATSONX_API_KEY;

  if (shouldUseRAG) {
    try {
      const rag = await retrieveContext(supabase, orgId, input.prompt, {
        topK: 5,
        similarityThreshold: 0.3,
        sourceTypes: ['brand', 'content_item'],
      });
      ragContext = rag.contextText;
    } catch (e) {
      console.warn('RAG retrieval failed, continuing without context:', (e as Error).message);
    }
  }

  // Augment prompt with RAG context
  const augmentedPrompt = ragContext
    ? `${ragContext}\n\n--- SOLICITAÇÃO DO USUÁRIO ---\n${input.prompt}`
    : input.prompt;

  const request: AIGenerationRequest = {
    prompt: augmentedPrompt,
    contentType: input.contentType,
    platform: input.platform,
    tone: input.tone,
    language: input.language,
    brandPackage,
    threadId,
    userId,
    orgId,
  };

  // Select provider based on content type and preference
  const { provider, graniteModel } = selectProvider(input.contentType, input.preferredProvider);

  let response: AIGenerationResponse;

  // Route to provider with fallback chain
  try {
    switch (provider) {
      case 'granite':
      case 'watsonx':
        response = await generateWithGranite(request, graniteModel);
        break;
      case 'gemini':
        response = await generateWithGemini(request);
        break;
      case 'claude':
      default:
        response = await generateWithClaude(request);
        break;
    }
  } catch (providerError) {
    // Fallback: if preferred provider fails, try Claude
    if (provider !== 'claude') {
      console.warn(`Provider ${provider} failed, falling back to Claude:`, (providerError as Error).message);
      response = await generateWithClaude(request);
    } else {
      throw providerError;
    }
  }

  // Audit log via admin client (bypasses RLS for write)
  await adminSupabase.from('audit_log').insert({
    organization_id: orgId,
    action: 'ai_generate',
    details: {
      content_type: input.contentType,
      platform: input.platform,
      brand_id: input.brandId,
      prompt_length: input.prompt.length,
      provider,
      rag_enabled: shouldUseRAG,
      rag_context_length: ragContext.length,
    },
    ai_model: response.model,
    tokens_used: response.tokensUsed,
    thread_id: threadId,
  });

  // Token debit is handled by fn_debit_tokens trigger on audit_log insert

  return response;
}
