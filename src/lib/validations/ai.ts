import { z } from 'zod';

export const ContentTypeEnum = z.enum([
  'post', 'caption', 'blog', 'email', 'hashtags', 'title', 'story', 'reel',
]);

export const GenerateRequestSchema = z.object({
  prompt: z.string().min(1).max(5000),
  content_type: ContentTypeEnum,
  platform: z.string().optional(),
  tone: z.string().optional(),
  language: z.string().optional(),
  brand_id: z.string().uuid(),
});

export const ImproveRequestSchema = z.object({
  content: z.string().min(1).max(10000),
  instruction: z.string().min(1).max(2000),
  brand_id: z.string().uuid(),
});

export const SuggestRequestSchema = z.object({
  content: z.string().min(1).max(5000),
  type: z.enum(['hashtags', 'title', 'excerpt', 'cta']),
  brand_id: z.string().uuid(),
});
