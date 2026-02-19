import 'server-only';

/**
 * IBM Watson Natural Language Understanding (NLU) integration.
 *
 * Provides:
 * - Sentiment analysis (positive/negative/neutral with score)
 * - Emotion detection (joy, anger, disgust, sadness, fear)
 * - Keyword extraction with relevance scoring
 * - Content classification (categories/taxonomy)
 * - Tone analysis for brand voice alignment
 *
 * Uses Watson NLU v1 API via watsonx.ai platform.
 * Falls back to Granite-based analysis when NLU service is unavailable.
 */

export interface SentimentResult {
  label: 'positive' | 'negative' | 'neutral';
  score: number;
}

export interface EmotionResult {
  joy: number;
  anger: number;
  disgust: number;
  sadness: number;
  fear: number;
}

export interface KeywordResult {
  text: string;
  relevance: number;
  sentiment?: SentimentResult;
}

export interface ContentAnalysis {
  sentiment: SentimentResult;
  emotions: EmotionResult;
  keywords: KeywordResult[];
  categories: { label: string; score: number }[];
  brandAlignmentScore: number;
  readabilityScore: number;
  suggestions: string[];
}

interface NLUResponse {
  sentiment: { document: { label: string; score: number } };
  emotion: { document: { emotion: EmotionResult } };
  keywords: { text: string; relevance: number; sentiment: { score: number; label: string } }[];
  categories: { label: string; score: number }[];
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

  if (!res.ok) throw new Error('Failed to get Watson IAM token');

  const data = await res.json();
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  };
  return data.access_token;
}

/**
 * Analyze content using Watson NLU.
 */
async function callWatsonNLU(text: string): Promise<NLUResponse> {
  const nluUrl = process.env.WATSON_NLU_URL;
  if (!nluUrl) throw new Error('WATSON_NLU_URL not configured');

  const token = await getIAMToken();

  const res = await fetch(`${nluUrl}/v1/analyze?version=2022-04-07`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text,
      features: {
        sentiment: { document: true },
        emotion: { document: true },
        keywords: { sentiment: true, limit: 15 },
        categories: { limit: 5 },
      },
      language: 'pt',
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Watson NLU failed: ${res.status} ${errText}`);
  }

  return res.json();
}

/**
 * Granite-based fallback for content analysis when Watson NLU is unavailable.
 * Uses Granite model to extract sentiment, keywords, and quality signals.
 */
async function analyzeWithGranite(text: string): Promise<ContentAnalysis> {
  const { generateWithGranite } = await import('./granite');

  const analysisPrompt = `Analyze the following content and return a JSON object with:
- "sentiment": {"label": "positive"|"negative"|"neutral", "score": -1.0 to 1.0}
- "emotions": {"joy": 0-1, "anger": 0-1, "disgust": 0-1, "sadness": 0-1, "fear": 0-1}
- "keywords": [{"text": "keyword", "relevance": 0-1}] (top 10)
- "categories": [{"label": "category", "score": 0-1}] (top 3)
- "readabilityScore": 0-100
- "suggestions": ["suggestion1", "suggestion2"] (max 3 improvement suggestions)

Content to analyze:
${text.slice(0, 4000)}

Return ONLY valid JSON, no markdown fences.`;

  const response = await generateWithGranite(
    {
      prompt: analysisPrompt,
      contentType: 'post',
      brandPackage: {
        orgId: '', brandId: '', brandName: '', brandVoice: '', targetAudience: '',
        industry: '', contentPillars: [], forbiddenWords: [], mandatoryElements: [],
        regionalExpertise: {}, targetLanguage: 'pt-BR',
      },
      userId: 'system',
      orgId: 'system',
    },
    'ibm/granite-3.1-8b-instruct'
  );

  try {
    const parsed = JSON.parse(response.content);
    return {
      sentiment: parsed.sentiment ?? { label: 'neutral', score: 0 },
      emotions: parsed.emotions ?? { joy: 0, anger: 0, disgust: 0, sadness: 0, fear: 0 },
      keywords: (parsed.keywords ?? []).map((k: { text: string; relevance: number }) => ({
        text: k.text,
        relevance: k.relevance,
      })),
      categories: parsed.categories ?? [],
      brandAlignmentScore: 0,
      readabilityScore: parsed.readabilityScore ?? 50,
      suggestions: parsed.suggestions ?? [],
    };
  } catch {
    return {
      sentiment: { label: 'neutral', score: 0 },
      emotions: { joy: 0, anger: 0, disgust: 0, sadness: 0, fear: 0 },
      keywords: [],
      categories: [],
      brandAlignmentScore: 0,
      readabilityScore: 50,
      suggestions: [],
    };
  }
}

/**
 * Calculate brand alignment score by checking content against brand guidelines.
 */
function calculateBrandAlignment(
  text: string,
  keywords: KeywordResult[],
  brandVoice?: string,
  forbiddenWords?: string[],
  mandatoryElements?: string[]
): number {
  let score = 70; // Base score
  const lowerText = text.toLowerCase();

  // Penalize forbidden words
  if (forbiddenWords) {
    for (const word of forbiddenWords) {
      if (lowerText.includes(word.toLowerCase())) {
        score -= 15;
      }
    }
  }

  // Reward mandatory elements
  if (mandatoryElements) {
    const found = mandatoryElements.filter(e => lowerText.includes(e.toLowerCase()));
    score += (found.length / Math.max(mandatoryElements.length, 1)) * 20;
  }

  // Bonus for keyword relevance (high-relevance keywords = focused content)
  const avgRelevance = keywords.length > 0
    ? keywords.reduce((sum, k) => sum + k.relevance, 0) / keywords.length
    : 0;
  score += avgRelevance * 10;

  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Calculate readability score (Flesch-like approximation for Portuguese).
 */
function calculateReadability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(Boolean).length || 1;
  const words = text.split(/\s+/).filter(Boolean).length || 1;
  const syllables = text.replace(/[^aeiouáéíóúâêîôûãõ]/gi, '').length || 1;

  const avgSentenceLength = words / sentences;
  const avgSyllablesPerWord = syllables / words;

  // Simplified Flesch for Portuguese
  const score = 248.835 - (1.015 * avgSentenceLength) - (84.6 * avgSyllablesPerWord);
  return Math.max(0, Math.min(100, Math.round(score)));
}

/**
 * Main analysis function: tries Watson NLU, falls back to Granite.
 */
export async function analyzeContent(
  text: string,
  brandContext?: {
    brandVoice?: string;
    forbiddenWords?: string[];
    mandatoryElements?: string[];
  }
): Promise<ContentAnalysis> {
  let analysis: ContentAnalysis;

  const hasNLU = !!process.env.WATSON_NLU_URL;

  if (hasNLU) {
    try {
      const nluResult = await callWatsonNLU(text);

      const keywords: KeywordResult[] = (nluResult.keywords ?? []).map(k => ({
        text: k.text,
        relevance: k.relevance,
        sentiment: k.sentiment ? { label: k.sentiment.label as SentimentResult['label'], score: k.sentiment.score } : undefined,
      }));

      analysis = {
        sentiment: {
          label: nluResult.sentiment.document.label as SentimentResult['label'],
          score: nluResult.sentiment.document.score,
        },
        emotions: nluResult.emotion.document.emotion,
        keywords,
        categories: nluResult.categories ?? [],
        brandAlignmentScore: 0,
        readabilityScore: calculateReadability(text),
        suggestions: [],
      };
    } catch (e) {
      console.warn('Watson NLU unavailable, falling back to Granite:', (e as Error).message);
      analysis = await analyzeWithGranite(text);
    }
  } else {
    analysis = await analyzeWithGranite(text);
  }

  // Calculate brand alignment
  analysis.brandAlignmentScore = calculateBrandAlignment(
    text,
    analysis.keywords,
    brandContext?.brandVoice,
    brandContext?.forbiddenWords,
    brandContext?.mandatoryElements
  );

  // Readability override with deterministic calculation
  analysis.readabilityScore = calculateReadability(text);

  // Generate suggestions based on analysis
  analysis.suggestions = generateSuggestions(analysis);

  return analysis;
}

function generateSuggestions(analysis: ContentAnalysis): string[] {
  const suggestions: string[] = [];

  if (analysis.readabilityScore < 40) {
    suggestions.push('Simplify sentence structure for better readability');
  }

  if (analysis.brandAlignmentScore < 60) {
    suggestions.push('Review content against brand guidelines — alignment is low');
  }

  if (analysis.sentiment.label === 'negative' && analysis.sentiment.score < -0.5) {
    suggestions.push('Consider adjusting tone — content reads overly negative');
  }

  if (analysis.emotions.anger > 0.5 || analysis.emotions.fear > 0.5) {
    suggestions.push('High emotional intensity detected — verify this is intentional');
  }

  if (analysis.keywords.length < 3) {
    suggestions.push('Content may lack focus — consider adding more relevant keywords');
  }

  return suggestions.slice(0, 3);
}
