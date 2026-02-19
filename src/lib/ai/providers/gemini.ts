import 'server-only';

import { GoogleGenerativeAI } from '@google/generative-ai';
import type { AIGenerationRequest, AIGenerationResponse } from '../types';
import { buildSystemPrompt } from '../prompt-builder';

export async function generateWithGemini(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Missing GOOGLE_GEMINI_API_KEY');
  }

  const threadId = request.threadId ?? crypto.randomUUID();
  const systemPrompt = buildSystemPrompt(request);

  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  const result = await model.generateContent(request.prompt);
  const response = result.response;
  const content = response.text();

  const usage = response.usageMetadata;
  const tokensUsed = (usage?.promptTokenCount ?? 0) + (usage?.candidatesTokenCount ?? 0);

  return {
    content,
    model: 'gemini-2.0-flash',
    threadId,
    tokensUsed,
    generatedAt: new Date().toISOString(),
  };
}
