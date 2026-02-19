import 'server-only';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

import { generateEmbeddings } from './providers/granite';

export interface RAGDocument {
  id: string;
  content: string;
  source: string;
  similarity: number;
}

export interface RAGContext {
  documents: RAGDocument[];
  contextText: string;
  tokensEstimate: number;
}

/**
 * Index content into the vector store.
 * Generates embeddings via Granite and stores in content_embeddings table.
 */
export async function indexContent(
  adminSupabase: AnySupabaseClient,
  orgId: string,
  items: { id: string; content: string; source: string; metadata?: Record<string, unknown> }[]
): Promise<void> {
  if (items.length === 0) return;

  const texts = items.map(item => item.content);

  // Batch embeddings (max 20 at a time for API limits)
  const allEmbeddings: number[][] = [];
  for (let i = 0; i < texts.length; i += 20) {
    const batch = texts.slice(i, i + 20);
    const embeddings = await generateEmbeddings(batch);
    allEmbeddings.push(...embeddings);
  }

  const rows = items.map((item, idx) => ({
    org_id: orgId,
    source_id: item.id,
    source_type: item.source,
    content_text: item.content.slice(0, 8000),
    embedding: JSON.stringify(allEmbeddings[idx]),
    metadata: item.metadata ?? {},
  }));

  const { error } = await adminSupabase
    .from('content_embeddings')
    .upsert(rows, { onConflict: 'org_id,source_id,source_type' });

  if (error) {
    console.error('RAG indexing error:', error);
    throw new Error('Failed to index content for RAG');
  }
}

/**
 * Retrieve relevant context documents for a query.
 * Uses pgvector similarity search on content_embeddings.
 */
export async function retrieveContext(
  supabase: AnySupabaseClient,
  orgId: string,
  query: string,
  options?: {
    topK?: number;
    similarityThreshold?: number;
    sourceTypes?: string[];
  }
): Promise<RAGContext> {
  const topK = options?.topK ?? 5;
  const threshold = options?.similarityThreshold ?? 0.3;

  // Generate embedding for the query
  const [queryEmbedding] = await generateEmbeddings([query]);

  // Call Supabase RPC for vector similarity search
  const { data, error } = await supabase.rpc('match_content_embeddings', {
    query_embedding: JSON.stringify(queryEmbedding),
    match_org_id: orgId,
    match_threshold: threshold,
    match_count: topK,
    filter_source_types: options?.sourceTypes ?? null,
  });

  if (error) {
    console.error('RAG retrieval error:', error);
    return { documents: [], contextText: '', tokensEstimate: 0 };
  }

  const documents: RAGDocument[] = (data ?? []).map((row: {
    source_id: string;
    content_text: string;
    source_type: string;
    similarity: number;
  }) => ({
    id: row.source_id,
    content: row.content_text,
    source: row.source_type,
    similarity: row.similarity,
  }));

  // Build context text block for prompt augmentation
  const contextParts = documents.map((doc, i) =>
    `[Referência ${i + 1} — ${doc.source} (relevância: ${Math.round(doc.similarity * 100)}%)]\n${doc.content}`
  );

  const contextText = contextParts.length > 0
    ? `--- CONTEXTO RECUPERADO (RAG) ---\n${contextParts.join('\n\n')}\n--- FIM DO CONTEXTO ---`
    : '';

  // Rough token estimate: ~4 chars per token
  const tokensEstimate = Math.ceil(contextText.length / 4);

  return { documents, contextText, tokensEstimate };
}

/**
 * Index a brand's complete identity for RAG retrieval.
 */
export async function indexBrand(
  adminSupabase: AnySupabaseClient,
  orgId: string,
  brand: {
    id: string;
    name: string;
    brand_voice?: string;
    target_audience?: string;
    industry?: string;
    content_pillars?: string[];
    forbidden_words?: string;
    mandatory_elements?: string;
  }
): Promise<void> {
  const parts = [
    `Marca: ${brand.name}`,
    brand.brand_voice ? `Voz: ${brand.brand_voice}` : '',
    brand.target_audience ? `Público-alvo: ${brand.target_audience}` : '',
    brand.industry ? `Indústria: ${brand.industry}` : '',
    brand.content_pillars?.length ? `Pilares: ${brand.content_pillars.join(', ')}` : '',
    brand.forbidden_words ? `Palavras proibidas: ${brand.forbidden_words}` : '',
    brand.mandatory_elements ? `Elementos obrigatórios: ${brand.mandatory_elements}` : '',
  ].filter(Boolean);

  await indexContent(adminSupabase, orgId, [{
    id: brand.id,
    content: parts.join('\n'),
    source: 'brand',
    metadata: { brand_name: brand.name },
  }]);
}

/**
 * Index published content items for RAG (historical content for style reference).
 */
export async function indexContentItems(
  adminSupabase: AnySupabaseClient,
  orgId: string,
  items: { id: string; title: string; content: string; type: string; platform?: string[] }[]
): Promise<void> {
  const ragItems = items.map(item => ({
    id: item.id,
    content: `${item.title}\n\n${item.content}`,
    source: 'content_item',
    metadata: { type: item.type, platform: item.platform },
  }));

  await indexContent(adminSupabase, orgId, ragItems);
}
