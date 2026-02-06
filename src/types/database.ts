// ============================================================================
// CESTARI STUDIO — genOS Content Factory Pro
// TypeScript Types v2.0 — Gerado do schema PostgreSQL
// ============================================================================

// ============================================================================
// ENUMS
// ============================================================================

export type UserRole =
  | 'super_admin'
  | 'agency_owner'
  | 'agency_manager'
  | 'agency_member'
  | 'client_owner'
  | 'client_member'
  | 'freelancer'
  | 'employee';

export type SubscriptionTier =
  | 'free'
  | 'starter'
  | 'pro'
  | 'premium'
  | 'enterprise';

export type ContentFramework =
  | 'aida'
  | 'pas'
  | 'storytelling'
  | 'benefits'
  | 'educational'
  | 'testimonial'
  | 'problem_solution'
  | 'before_after'
  | 'list'
  | 'question'
  | 'controversy'
  | 'custom';

export type PlatformType =
  | 'instagram'
  | 'facebook'
  | 'linkedin'
  | 'twitter'
  | 'tiktok'
  | 'youtube'
  | 'pinterest'
  | 'threads';

export type PostStatus =
  | 'draft'
  | 'awaiting_assignment'
  | 'assigned'
  | 'in_progress'
  | 'submitted'
  | 'revision_requested'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'failed'
  | 'archived';

export type MediaType =
  | 'image'
  | 'video'
  | 'carousel_images'
  | 'carousel_video'
  | 'story'
  | 'reel'
  | 'document'
  | 'logo'
  | 'background';

export type ProjectStatus =
  | 'planning'
  | 'active'
  | 'paused'
  | 'completed'
  | 'archived'
  | 'cancelled';

export type ContentTypeSlug =
  | 'post_simples'
  | 'post_imagem'
  | 'post_fixo'
  | 'story_texto'
  | 'story_video'
  | 'carrossel_imagens'
  | 'carrossel_video'
  | 'reels'
  | 'tiktok'
  | 'youtube_shorts'
  | 'linkedin_post'
  | 'linkedin_carrossel'
  | 'facebook_post'
  | 'twitter_post';

export type NotificationType =
  | 'credit_expiring_30days'
  | 'credit_expiring_7days'
  | 'credit_expiring_1day'
  | 'credit_expired'
  | 'post_ready_for_review'
  | 'post_approved'
  | 'post_rejected'
  | 'post_published'
  | 'revision_charged'
  | 'storage_warning'
  | 'storage_limit'
  | 'project_deadline'
  | 'payment_received'
  | 'invoice_overdue';

export type AssignmentStatus =
  | 'pending'
  | 'in_progress'
  | 'submitted'
  | 'revision_requested'
  | 'approved'
  | 'rejected';

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded';

export type NotificationPriority =
  | 'low'
  | 'medium'
  | 'high'
  | 'urgent';

export type RecurrencePattern =
  | 'weekly'
  | 'biweekly'
  | 'monthly';

export type CampaignStatus =
  | 'planning'
  | 'active'
  | 'paused'
  | 'completed'
  | 'cancelled';

// ============================================================================
// TABLE INTERFACES
// ============================================================================

/** cestari.organizations — White-label multi-tenant */
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  primary_color: string;
  secondary_color: string;
  custom_domain: string | null;
  company_name: string | null;
  support_email: string | null;
  support_phone: string | null;
  is_active: boolean;
  tier: SubscriptionTier;
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** cestari.users — Multi-role com permissões granulares */
export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  phone: string | null;
  role: UserRole;
  organization_id: string | null;
  can_see_client_data: boolean;
  can_see_analytics: boolean;
  can_manage_team: boolean;
  can_publish_posts: boolean;
  is_freelancer: boolean;
  hourly_rate: number | null;
  bio: string | null;
  portfolio_url: string | null;
  is_active: boolean;
  email_verified: boolean;
  last_login_at: string | null;
  preferences: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Relations
  organization?: Organization;
}

/** cestari.content_types — Tipos de conteúdo com pesos de créditos */
export interface ContentType {
  id: string;
  name: string;
  slug: ContentTypeSlug;
  platform: PlatformType | null;
  credit_weight: number;
  complexity_level: string | null;
  requires_video: boolean;
  requires_images: boolean;
  max_duration_seconds: number | null;
  max_slides: number | null;
  min_slides: number | null;
  creation_time_estimate_minutes: number | null;
  description: string | null;
  example_url: string | null;
  is_active: boolean;
  created_at: string;
}

/** cestari.packages — Pacotes de créditos (Starter/Pro/Premium/Enterprise) */
export interface Package {
  id: string;
  name: string;
  slug: string;
  tier: SubscriptionTier;
  total_credits: number;
  price_brl: number;
  price_per_credit: number | null;
  validity_months: number;
  max_projects: number;
  allows_recurrent_projects: boolean;
  max_storage_mb: number;
  max_file_size_mb: number;
  max_files: number;
  features: unknown[];
  available_addons: unknown[];
  is_active: boolean;
  is_featured: boolean;
  description: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

/** cestari.package_addons — Add-ons disponíveis por tier */
export interface PackageAddon {
  id: string;
  name: string;
  slug: string;
  price_brl: number;
  billing_cycle: string;
  benefits: Record<string, unknown>;
  compatible_tiers: SubscriptionTier[];
  description: string | null;
  is_active: boolean;
  created_at: string;
}

/** cestari.brands — Marcas dos clientes */
export interface Brand {
  id: string;
  organization_id: string;
  client_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  font_family: string | null;
  brand_voice: string | null;
  target_audience: string | null;
  keywords: string[];
  language: string;
  instagram_handle: string | null;
  facebook_page: string | null;
  linkedin_page: string | null;
  twitter_handle: string | null;
  tiktok_handle: string | null;
  website_url: string | null;
  settings: Record<string, unknown>;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  // Relations
  organization?: Organization;
  client?: User;
}

/** cestari.client_purchases — Compras de pacotes com créditos */
export interface ClientPurchase {
  id: string;
  client_id: string;
  organization_id: string | null;
  package_id: string;
  total_credits: number;
  credits_remaining: number;
  credits_used: number;
  purchased_at: string;
  expires_at: string;
  is_expired: boolean;
  addons_purchased: string[];
  total_paid: number;
  payment_status: PaymentStatus;
  payment_method: string | null;
  stripe_payment_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  client?: User;
  package?: Package;
}

/** cestari.client_addons — Add-ons comprados pelo cliente */
export interface ClientAddon {
  id: string;
  client_id: string;
  purchase_id: string | null;
  addon_id: string;
  purchased_at: string;
  expires_at: string | null;
  is_active: boolean;
  price_paid: number;
  created_at: string;
  // Relations
  addon?: PackageAddon;
}

/** cestari.client_projects — Projetos com alocação de créditos */
export interface ClientProject {
  id: string;
  client_id: string;
  brand_id: string;
  name: string;
  description: string | null;
  credits_allocated: number;
  credits_used: number;
  credits_remaining: number; // GENERATED ALWAYS AS
  purchase_id: string | null;
  is_recurrent: boolean;
  recurrence_pattern: RecurrencePattern | null;
  start_date: string | null;
  deadline: string | null;
  completed_at: string | null;
  status: ProjectStatus;
  tags: string[];
  settings: Record<string, unknown>;
  created_at: string;
  updated_at: string;
  // Relations
  brand?: Brand;
  client?: User;
  purchase?: ClientPurchase;
}

/** cestari.posts_v2 — Posts com workflow de 11 status (nova tabela v2) */
export interface Post {
  id: string;
  brand_id: string;
  client_id: string;
  project_id: string | null;
  created_by: string | null;
  assigned_to: string | null;
  content_type_id: string | null;
  content_type_slug: ContentTypeSlug | null;
  platform: PlatformType;
  credits_consumed: number;
  title: string | null;
  body: string;
  hashtags: string[];
  cta_text: string | null;
  cta_url: string | null;
  framework: ContentFramework | null;
  selected_assets: string[];
  scheduled_for: string | null;
  published_at: string | null;
  external_post_id: string | null;
  external_url: string | null;
  status: PostStatus;
  revision_count: number;
  last_revision_at: string | null;
  // Analytics (preenchido após publicação)
  impressions: number;
  reach: number;
  engagement_rate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  // AI
  ai_generated: boolean;
  ai_model: string | null;
  generation_prompt: string | null;
  character_count: number | null;
  notes: string | null;
  // Search (tsvector — não exposto no TS)
  created_at: string;
  updated_at: string;
  // Relations
  brand?: Brand;
  client?: User;
  project?: ClientProject;
  content_type?: ContentType;
  creator?: User;
  assignee?: User;
  campaign?: Campaign;
}

/** cestari.campaigns — Campanhas agrupando posts */
export interface Campaign {
  id: string;
  brand_id: string;
  name: string;
  description: string | null;
  objective: string | null;
  start_date: string;
  end_date: string | null;
  status: CampaignStatus;
  is_active: boolean;
  budget_brl: number | null;
  tags: string[];
  created_at: string;
  updated_at: string;
  // Relations
  brand?: Brand;
  posts?: Post[];
}

/** cestari.post_assignments — Tarefas sanitizadas para freelancers */
export interface PostAssignment {
  id: string;
  post_id: string;
  assigned_to: string;
  assigned_by: string;
  task_title: string;
  task_description: string | null;
  task_context: Record<string, unknown> | null;
  submitted_content: Record<string, unknown> | null;
  submitted_at: string | null;
  revision_notes: string | null;
  revision_requested_at: string | null;
  status: AssignmentStatus;
  assigned_at: string;
  due_date: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
  // Relations
  post?: Post;
  assignee?: User;
  assigner?: User;
}

/** cestari.post_revisions — Histórico de revisões (1ª/2ª free, 3ª+ cobrada) */
export interface PostRevision {
  id: string;
  post_id: string;
  revision_number: number;
  is_free: boolean;
  charged_amount: number | null;
  previous_version: Record<string, unknown>;
  changes_requested: string;
  new_version: Record<string, unknown> | null;
  requested_by: string;
  completed_by: string | null;
  requested_at: string;
  completed_at: string | null;
  created_at: string;
  // Relations
  post?: Post;
  requester?: User;
  completer?: User;
}

/** cestari.curatorial_packs — Packs de imagens curadas para venda */
export interface CuratorialPack {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category: string | null;
  total_assets: number;
  preview_images: string[];
  price_brl: number;
  access_type: string;
  tags: string[];
  featured_image_url: string | null;
  is_available: boolean;
  is_featured: boolean;
  published_at: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
  // Relations
  assets?: CuratorialPackAsset[];
}

/** cestari.curatorial_pack_assets — Assets individuais dos packs */
export interface CuratorialPackAsset {
  id: string;
  pack_id: string;
  file_url: string;
  thumbnail_url: string | null;
  title: string | null;
  file_type: MediaType;
  file_size: number | null;
  mime_type: string | null;
  resolution: string | null;
  width: number | null;
  height: number | null;
  orientation: string | null;
  tags: string[];
  color_palette: Record<string, unknown> | null;
  display_order: number;
  created_at: string;
}

/** cestari.client_pack_purchases — Compras de packs curatoriais */
export interface ClientPackPurchase {
  id: string;
  client_id: string;
  pack_id: string;
  purchased_at: string;
  price_paid: number;
  has_lifetime_access: boolean;
  assets_copied: boolean;
  assets_copied_at: string | null;
  payment_status: string;
  stripe_payment_id: string | null;
  created_at: string;
  // Relations
  pack?: CuratorialPack;
  client?: User;
}

/** cestari.brand_assets — Biblioteca de assets da marca */
export interface BrandAsset {
  id: string;
  brand_id: string;
  client_id: string;
  file_name: string;
  file_path: string | null;
  file_url: string;
  file_type: MediaType;
  file_size: number | null;
  mime_type: string | null;
  width: number | null;
  height: number | null;
  duration_seconds: number | null;
  title: string | null;
  description: string | null;
  alt_text: string | null;
  tags: string[];
  category: string | null;
  source: string | null;
  source_pack_id: string | null;
  is_public: boolean;
  can_be_used_in_posts: boolean;
  uploaded_at: string;
  uploaded_by: string | null;
  created_at: string;
  // Relations
  brand?: Brand;
}

/** cestari.storage_usage — Tracking de uso de storage */
export interface StorageUsage {
  id: string;
  client_id: string;
  brand_id: string | null;
  total_bytes: number;
  total_files: number;
  limit_bytes: number;
  limit_files: number;
  images_bytes: number;
  videos_bytes: number;
  documents_bytes: number;
  is_over_limit: boolean;
  warning_sent: boolean;
  warning_sent_at: string | null;
  last_calculated_at: string;
  created_at: string;
  updated_at: string;
}

/** cestari.notifications — Sistema de notificações multi-canal */
export interface Notification {
  id: string;
  user_id: string;
  client_id: string | null;
  type: NotificationType;
  title: string;
  message: string;
  action_url: string | null;
  action_text: string | null;
  priority: NotificationPriority;
  is_read: boolean;
  read_at: string | null;
  sent_via: string[];
  sent_at: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

/** cestari.analytics_daily — Métricas agregadas por dia */
export interface AnalyticsDaily {
  id: string;
  brand_id: string;
  post_id: string | null;
  date: string;
  impressions: number;
  reach: number;
  engagement_rate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  platform: PlatformType | null;
  created_at: string;
}

/** cestari.audit_log — Log imutável de ações */
export interface AuditLog {
  id: string;
  user_id: string | null;
  organization_id: string | null;
  action: string;
  entity_type: string;
  entity_id: string | null;
  details: Record<string, unknown> | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

// ============================================================================
// VIEWS
// ============================================================================

/** v_client_credits_summary — Resumo de créditos por cliente */
export interface ClientCreditsSummary {
  client_id: string;
  client_name: string;
  total_credits: number;
  credits_used: number;
  credits_remaining: number;
  expires_at: string | null;
  days_until_expiry: number | null;
  is_expiring_soon: boolean;
  package_name: string;
  package_tier: SubscriptionTier;
}

/** v_post_performance — Performance de posts com joins */
export interface PostPerformance {
  post_id: string;
  title: string | null;
  body: string;
  status: PostStatus;
  platform: PlatformType;
  brand_name: string;
  content_type_name: string | null;
  impressions: number;
  reach: number;
  engagement_rate: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  clicks: number;
  total_engagement: number;
  published_at: string | null;
  created_at: string;
}

// ============================================================================
// UTILITY TYPES
// ============================================================================

/** Helper: campos comuns de timestamps */
export interface Timestamped {
  created_at: string;
  updated_at: string;
}

/** Helper: paginação Supabase */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/** Helper: filtros genéricos para DataTable */
export interface TableFilter {
  key: string;
  value: string | string[];
  operator?: 'eq' | 'neq' | 'in' | 'like' | 'gt' | 'lt' | 'gte' | 'lte';
}

/** Helper: ordenação */
export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

/** Helper: resultado de busca full-text */
export interface SearchResult<T> {
  data: T[];
  query: string;
  total: number;
}

// ============================================================================
// FORM TYPES (para modais Carbon)
// ============================================================================

export interface BrandFormData {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  font_family: string;
  brand_voice: string;
  target_audience: string;
  keywords: string[];
  language: string;
  instagram_handle: string;
  facebook_page: string;
  linkedin_page: string;
  twitter_handle: string;
  tiktok_handle: string;
  website_url: string;
}

export interface PostFormData {
  brand_id: string;
  project_id: string;
  content_type_id: string;
  platform: PlatformType;
  title: string;
  body: string;
  hashtags: string[];
  cta_text: string;
  cta_url: string;
  framework: ContentFramework | '';
  scheduled_for: string;
  campaign_id: string;
}

export interface ProjectFormData {
  brand_id: string;
  name: string;
  description: string;
  credits_allocated: number;
  purchase_id: string;
  is_recurrent: boolean;
  recurrence_pattern: RecurrencePattern | '';
  start_date: string;
  deadline: string;
}

export interface TeamMemberFormData {
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  can_see_client_data: boolean;
  can_see_analytics: boolean;
  can_manage_team: boolean;
  can_publish_posts: boolean;
  is_freelancer: boolean;
  hourly_rate: number | null;
}

// ============================================================================
// DASHBOARD AGGREGATES
// ============================================================================

export interface DashboardStats {
  totalBrands: number;
  activeBrands: number;
  totalPosts: number;
  postsThisMonth: number;
  creditsUsed: number;
  creditsRemaining: number;
  totalEngagement: number;
  engagementGrowth: number;
}

export interface CreditGaugeData {
  total: number;
  used: number;
  remaining: number;
  expiresAt: string | null;
  daysUntilExpiry: number | null;
  percentUsed: number;
}

export interface PostsByStatusCount {
  status: PostStatus;
  count: number;
  label: string;
}

export interface PlatformDistribution {
  platform: PlatformType;
  count: number;
  percentage: number;
}

// ============================================================================
// POST STATUS CONFIG (para UI)
// ============================================================================

export const POST_STATUS_CONFIG: Record<PostStatus, {
  label: string;
  tagType: 'red' | 'magenta' | 'purple' | 'blue' | 'cyan' | 'teal' | 'green' | 'gray' | 'cool-gray' | 'warm-gray' | 'high-contrast' | 'outline';
  icon: string;
  order: number;
}> = {
  draft: { label: 'Rascunho', tagType: 'cool-gray', icon: 'Edit', order: 0 },
  awaiting_assignment: { label: 'Aguardando Atribuição', tagType: 'purple', icon: 'UserFollow', order: 1 },
  assigned: { label: 'Atribuído', tagType: 'blue', icon: 'User', order: 2 },
  in_progress: { label: 'Em Produção', tagType: 'cyan', icon: 'InProgress', order: 3 },
  submitted: { label: 'Submetido', tagType: 'teal', icon: 'Send', order: 4 },
  revision_requested: { label: 'Revisão Solicitada', tagType: 'magenta', icon: 'Undo', order: 5 },
  approved: { label: 'Aprovado', tagType: 'green', icon: 'Checkmark', order: 6 },
  scheduled: { label: 'Agendado', tagType: 'blue', icon: 'Calendar', order: 7 },
  published: { label: 'Publicado', tagType: 'green', icon: 'CheckmarkFilled', order: 8 },
  failed: { label: 'Falhou', tagType: 'red', icon: 'ErrorFilled', order: 9 },
  archived: { label: 'Arquivado', tagType: 'gray', icon: 'Archive', order: 10 },
};

export const PLATFORM_CONFIG: Record<PlatformType, {
  label: string;
  color: string;
  icon: string;
}> = {
  instagram: { label: 'Instagram', color: '#E4405F', icon: 'LogoInstagram' },
  facebook: { label: 'Facebook', color: '#1877F2', icon: 'LogoFacebook' },
  linkedin: { label: 'LinkedIn', color: '#0A66C2', icon: 'LogoLinkedin' },
  twitter: { label: 'Twitter/X', color: '#000000', icon: 'LogoX' },
  tiktok: { label: 'TikTok', color: '#000000', icon: 'LogoTiktok' },
  youtube: { label: 'YouTube', color: '#FF0000', icon: 'LogoYoutube' },
  pinterest: { label: 'Pinterest', color: '#E60023', icon: 'LogoPinterest' },
  threads: { label: 'Threads', color: '#000000', icon: 'LogoThreads' },
};

export const USER_ROLE_CONFIG: Record<UserRole, {
  label: string;
  description: string;
  level: number;
}> = {
  super_admin: { label: 'Super Admin', description: 'Acesso total ao sistema', level: 100 },
  agency_owner: { label: 'Dono da Agência', description: 'Proprietário da organização', level: 90 },
  agency_manager: { label: 'Gerente', description: 'Gerencia equipe e projetos', level: 70 },
  agency_member: { label: 'Membro', description: 'Acesso padrão da equipe', level: 50 },
  client_owner: { label: 'Cliente (Dono)', description: 'Proprietário da marca', level: 40 },
  client_member: { label: 'Cliente (Membro)', description: 'Membro da equipe do cliente', level: 30 },
  freelancer: { label: 'Freelancer', description: 'Acesso sanitizado a tarefas', level: 20 },
  employee: { label: 'Funcionário', description: 'Funcionário da agência', level: 50 },
};

// ============================================================================
// LEGACY TYPES (v1 — manter para backward compatibility)
// ============================================================================

/** @deprecated Use Brand instead */
export interface LegacyClient {
  id: string;
  organization_id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  avatar_url?: string;
  status: 'active' | 'inactive' | 'prospect' | 'churned';
  tags: string[];
  metadata: Record<string, unknown>;
  wix_contact_id?: string;
  created_at: string;
  updated_at: string;
}

/** @deprecated Use Package instead */
export interface LegacyServiceTier {
  id: string;
  name: string;
  slug: string;
  description?: string;
  price: number;
  currency: string;
  billing_cycle: 'one_time' | 'monthly' | 'quarterly' | 'yearly';
  features: string[];
  posts_per_month?: number;
  revisions_allowed?: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}
