import 'server-only';

import type { AIGenerationRequest, AIGenerationResponse } from '../ai/types';
import { buildSystemPrompt } from '../ai/prompt-builder';

interface WatsonxResponse {
  results: {
    generated_text: string;
    generated_token_count: number;
    input_token_count: number;
  }[];
}

export async function generateWithWatsonx(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const apiKey = process.env.WATSONX_API_KEY;
  const projectId = process.env.WATSONX_PROJECT_ID;
  const url = process.env.WATSONX_URL ?? 'https://us-south.ml.cloud.ibm.com';

  if (!apiKey || !projectId) {
    throw new Error('Missing WATSONX_API_KEY or WATSONX_PROJECT_ID');
  }

  const threadId = request.threadId ?? crypto.randomUUID();
  const systemPrompt = buildSystemPrompt(request);

  // Get IAM token
  const tokenRes = await fetch('https://iam.cloud.ibm.com/identity/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `grant_type=urn:ibm:params:oauth:grant-type:apikey&apikey=${apiKey}`,
  });

  if (!tokenRes.ok) {
    throw new Error('Failed to get watsonx IAM token');
  }

  const { access_token } = await tokenRes.json();

  // Generate text
  const genRes = await fetch(
    `${url}/ml/v1/text/generation?version=2024-05-31`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model_id: 'ibm/granite-13b-chat-v2',
        input: `${systemPrompt}\n\nUser: ${request.prompt}\nAssistant:`,
        parameters: {
          max_new_tokens: 4096,
          temperature: 0.7,
          top_p: 0.9,
        },
        project_id: projectId,
      }),
    }
  );

  if (!genRes.ok) {
    const errText = await genRes.text();
    throw new Error(`watsonx generation failed: ${genRes.status} ${errText}`);
  }

  const data: WatsonxResponse = await genRes.json();
  const result = data.results?.[0];

  return {
    content: result?.generated_text ?? '',
    model: 'ibm/granite-13b-chat-v2',
    threadId,
    tokensUsed: (result?.input_token_count ?? 0) + (result?.generated_token_count ?? 0),
    generatedAt: new Date().toISOString(),
  };
}
