export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  phone?: string;
  role: 'admin' | 'manager' | 'user';
  is_active: boolean;
  last_login_at?: string;
  created_at: string;
  updated_at: string;
}

export type ClientStatus = 'active' | 'inactive' | 'prospect' | 'churned';
export type ProjectStatus = 'briefing' | 'in_progress' | 'review' | 'approved' | 'delivered' | 'cancelled';
export type BriefingStatus = 'draft' | 'submitted' | 'reviewed' | 'approved';
export type ContentStatus = 'draft' | 'in_review' | 'approved' | 'scheduled' | 'published' | 'rejected';
export type BillingCycle = 'one_time' | 'monthly' | 'quarterly' | 'yearly';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  settings: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface Client {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  status: ClientStatus;
  tags: string[];
  metadata: Record<string, any>;
  wix_contact_id?: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceTier {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: BillingCycle;
  features: string[];
  posts_per_month?: number;
  revisions_allowed?: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  client_id: string;
  service_tier_id?: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  start_date?: string;
  due_date?: string;
  completed_at?: string;
  metadata: Record<string, any>;
  wix_order_id?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  service_tier?: ServiceTier;
}

export interface Briefing {
  id: string;
  client_id: string;
  project_id?: string;
  briefing_type: string;
  title: string;
  form_data: Record<string, any>;
  status: BriefingStatus;
  submitted_at?: string;
  reviewed_at?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  project?: Project;
}

export interface Content {
  id: string;
  project_id: string;
  content_type: string;
  title: string;
  body?: string;
  media_urls: string[];
  status: ContentStatus;
  scheduled_for?: string;
  published_at?: string;
  platform?: string;
  engagement_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  project?: Project;
}

export interface Document {
  id: string;
  client_id: string;
  project_id?: string;
  name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  mime_type?: string;
  category?: string;
  wix_doc_id?: string;
  created_at: string;
  updated_at: string;
  client?: Client;
  project?: Project;
}
