export interface BrandIdentityPackage {
  orgId: string;
  brandId: string;
  brandName: string;
  brandVoice: string;
  targetAudience: string;
  industry: string;
  contentPillars: string[];
  forbiddenWords: string[];
  mandatoryElements: string[];
  regionalExpertise: Record<string, unknown>;
  targetLanguage: string;
}

export type ContentType =
  | 'post'
  | 'caption'
  | 'blog'
  | 'email'
  | 'hashtags'
  | 'title'
  | 'story'
  | 'reel';

export interface AIGenerationRequest {
  prompt: string;
  contentType: ContentType;
  platform?: string;
  tone?: string;
  language?: string;
  brandPackage: BrandIdentityPackage;
  threadId?: string;
  userId: string;
  orgId: string;
}

export interface AIGenerationResponse {
  content: string;
  model: string;
  threadId: string;
  tokensUsed: number;
  generatedAt: string;
}

export type AIProvider = 'claude' | 'gemini' | 'granite' | 'watsonx';

export interface RAGAugmentedRequest extends AIGenerationRequest {
  ragContext?: string;
  ragDocumentIds?: string[];
}

