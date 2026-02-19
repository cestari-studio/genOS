import 'server-only';

import Anthropic from '@anthropic-ai/sdk';
import type { AIGenerationRequest, AIGenerationResponse } from '../types';
import { buildSystemPrompt } from '../prompt-builder';

const client = new Anthropic();

export async function generateWithClaude(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const threadId = request.threadId ?? crypto.randomUUID();
  const systemPrompt = buildSystemPrompt(request);

  const response = await client.messages.create({
    model: 'claude-sonnet-4-6',
    max_tokens: 4096,
    system: systemPrompt,
    messages: [{ role: 'user', content: request.prompt }],
  });

  const textBlock = response.content.find(block => block.type === 'text');
  const content = textBlock?.type === 'text' ? textBlock.text : '';

  return {
    content,
    model: 'claude-sonnet-4-6',
    threadId,
    tokensUsed: response.usage.input_tokens + response.usage.output_tokens,
    generatedAt: new Date().toISOString(),
  };
}
