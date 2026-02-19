import { z } from 'zod';

export const ClientSchema = z.object({
  name: z.string().min(1).max(255),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  company: z.string().optional(),
  notes: z.string().optional(),
});

export const ProjectSchema = z.object({
  name: z.string().min(1).max(255),
  client_id: z.string().uuid().optional(),
  description: z.string().optional(),
  status: z.enum(['planning', 'active', 'paused', 'completed', 'cancelled']).optional(),
  start_date: z.string().optional(),
  end_date: z.string().optional(),
});

export const BrandSchema = z.object({
  name: z.string().min(1).max(255),
  client_id: z.string().uuid().optional(),
  brand_voice: z.string().optional(),
  target_audience: z.string().optional(),
  industry: z.string().optional(),
  content_pillars: z.array(z.string()).optional(),
  target_language: z.string().optional(),
  forbidden_words: z.string().optional(),
  mandatory_elements: z.string().optional(),
  regional_expertise: z.record(z.string(), z.unknown()).optional(),
});

export const MediaUploadSchema = z.object({
  folder: z.string().optional().default('uploads'),
});
