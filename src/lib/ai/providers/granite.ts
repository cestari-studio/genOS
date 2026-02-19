import 'server-only';

import type { AIGenerationRequest, AIGenerationResponse } from '../types';
import { buildSystemPrompt } from '../prompt-builder';

/**
 * IBM Granite model family provider via watsonx.ai
 *
 * Supported models:
 * - ibm/granite-3.1-8b-instruct    — Fast, lightweight generation (captions, hashtags, titles)
 * - ibm/granite-3.1-2b-instruct    — Ultra-fast micro tasks
 * - ibm/granite-3.1-dense-128k     — Long-context generation (blog, email, full articles)
 * - ibm/granite-embedding-125m-english — Embedding model for RAG (used in rag.ts)
 */

export type GraniteModel =
  | 'ibm/granite-3.1-8b-instruct'
  | 'ibm/granite-3.1-2b-instruct'
  | 'ibm/granite-3.1-dense-128k';

interface WatsonxGenerationResponse {
  results: {
    generated_text: string;
    generated_token_count: number;
    input_token_count: number;
    stop_reason: string;
  }[];
}

interface WatsonxEmbeddingResponse {
  results: {
    embedding: number[];
    input_token_count: number;
  }[];
}

let cachedToken: { token: string; expiresAt: number } | null = null;

async function getIAMToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token;
  }

  const apiKey = process.env.WATSONX_API_KEY;
  if (!apiKey) throw new Error('Missing WATSONX_API_KEY');

  const res = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  });

  if (!res.ok) throw new Error('Failed to get watsonx IAM token');

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

function getProjectId(): string {
  const projectId = process.env.WATSONX_PROJECT_ID;
  if (!projectId) throw new Error('Missing WATSONX_PROJECT_ID');
  return projectId;
}

function getBaseUrl(): string {
  return process.env.WATSONX_URL ?? 'https://us-south.ml.cloud.ibm.com';
}

export async function generateWithGranite(
  request: AIGenerationRequest,
  model: GraniteModel = 'ibm/granite-3.1-8b-instruct'
): Promise<AIGenerationResponse> {
  const token = await getIAMToken();
  const projectId = getProjectId();
  const baseUrl = getBaseUrl();
  const threadId = request.threadId ?? crypto.randomUUID();
  const systemPrompt = buildSystemPrompt(request);

  const res = await fetch(
    `${baseUrl}/ml/v1/text/generation?version=2024-05-31`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: model,
        input: `<|system|>\n${systemPrompt}\n<|user|>\n${request.prompt}\n<|assistant|>\n`,
        parameters: {
          max_new_tokens: model === 'ibm/granite-3.1-dense-128k' ? 8192 : 4096,
          temperature: 0.7,
          top_p: 0.9,
          top_k: 50,
          repetition_penalty: 1.1,
          stop_sequences: ['<|endoftext|>', '<|user|>'],
        },
        project_id: projectId,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Granite generation failed: ${res.status} ${errText}`);
  }

  const data: WatsonxGenerationResponse = await res.json();
  const result = data.results?.[0];

  return {
    content: result?.generated_text?.trim() ?? '',
    model,
    threadId,
    tokensUsed: (result?.input_token_count ?? 0) + (result?.generated_token_count ?? 0),
    generatedAt: new Date().toISOString(),
  };
}

/**
 * Generate embeddings via Granite Embedding model on watsonx.ai.
 * Used by the RAG pipeline for content vectorization.
 */
export async function generateEmbeddings(
  texts: string[],
  model = 'ibm/granite-embedding-125m-english'
): Promise<number[][]> {
  const token = await getIAMToken();
  const projectId = getProjectId();
  const baseUrl = getBaseUrl();

  const res = await fetch(
    `${baseUrl}/ml/v1/text/embeddings?version=2024-05-31`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: model,
        inputs: texts,
        project_id: projectId,
      }),
    }
  );

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Granite embeddings failed: ${res.status} ${errText}`);
  }

  const data: WatsonxEmbeddingResponse = await res.json();
  return data.results.map(r => r.embedding);
}
