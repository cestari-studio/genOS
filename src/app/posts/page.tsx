'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableSelectAll,
  TableSelectRow,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  TableBatchActions,
  TableBatchAction,
  TableContainer,
  Button,
  Tag,
  Modal,
  TextInput,
  TextArea,
  Pagination,
  Dropdown,
  Tile,
  ContentSwitcher,
  Switch,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import {
  Add,
  Download,
  Renew,
  TrashCan,
  Edit,
  CheckmarkFilled,
  LogoInstagram,
  LogoFacebook,
  LogoLinkedin,
  LogoX,
  LogoYoutube,
  LogoPinterest,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type {
  Post,
  PostStatus,
  PlatformType,
  ContentFramework,
  PostFormData,
  Brand,
} from '@/types/database';
import { POST_STATUS_CONFIG, PLATFORM_CONFIG } from '@/types/database';
import './posts.scss';

// ============================================
// Mock data for development
// ============================================
const MOCK_BRANDS: Brand[] = [
  {
    id: 'brand-1',
    organization_id: 'org-1',
    client_id: 'user-1',
    name: 'TechVision',
    slug: 'techvision',
    tagline: 'Inovação que transforma',
    description: 'Empresa de tecnologia focada em inovação',
    logo_url: null,
    primary_color: '#0f62fe',
    secondary_color: '#6929c4',
    font_family: 'IBM Plex Sans',
    brand_voice: 'Profissional e inovador',
    target_audience: 'CTOs e desenvolvedores',
    keywords: ['tecnologia', 'inovação', 'software'],
    language: 'pt-BR',
    instagram_handle: '@techvision',
    facebook_page: 'techvision',
    linkedin_page: 'techvision-co',
    twitter_handle: '@techvision',
    tiktok_handle: null,
    website_url: 'https://techvision.com.br',
    settings: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-2',
    organization_id: 'org-1',
    client_id: 'user-2',
    name: 'Bella Moda',
    slug: 'bella-moda',
    tagline: 'Estilo que inspira',
    description: 'Marca de moda feminina premium',
    logo_url: null,
    primary_color: '#9f1853',
    secondary_color: '#ee5396',
    font_family: 'Playfair Display',
    brand_voice: 'Elegante e sofisticado',
    target_audience: 'Mulheres 25-45 anos',
    keywords: ['moda', 'elegância', 'feminino'],
    language: 'pt-BR',
    instagram_handle: '@bellamoda',
    facebook_page: 'bellamoda',
    linkedin_page: null,
    twitter_handle: null,
    tiktok_handle: '@bellamoda',
    website_url: 'https://bellamoda.com.br',
    settings: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'brand-3',
    organization_id: 'org-1',
    client_id: 'user-3',
    name: 'Organic Foods',
    slug: 'organic-foods',
    tagline: 'Do campo à sua mesa',
    description: 'Alimentos orgânicos e sustentáveis',
    logo_url: null,
    primary_color: '#198038',
    secondary_color: '#005d5d',
    font_family: 'Inter',
    brand_voice: 'Natural e acolhedor',
    target_audience: 'Consumidores conscientes',
    keywords: ['orgânico', 'sustentável', 'saúde'],
    language: 'pt-BR',
    instagram_handle: '@organicfoods',
    facebook_page: 'organicfoods',
    linkedin_page: 'organic-foods',
    twitter_handle: null,
    tiktok_handle: null,
    website_url: null,
    settings: {},
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

const MOCK_POSTS: Post[] = [
  {
    id: 'post-1',
    brand_id: 'brand-1',
    client_id: 'user-1',
    project_id: 'proj-1',
    created_by: 'user-1',
    assigned_to: 'user-5',
    content_type_id: 'ct-1',
    content_type_slug: 'post_simples',
    platform: 'instagram',
    credits_consumed: 10,
    title: 'Lançamento da nova versão beta',
    body: 'Estamos animados em anunciar o lançamento da versão beta de nossa plataforma revolucionária!',
    hashtags: ['#TechVision', '#Inovação', '#Beta'],
    cta_text: 'Saiba mais',
    cta_url: 'https://techvision.com.br/beta',
    framework: 'aida',
    selected_assets: [],
    scheduled_for: new Date(Date.now() + 86400000).toISOString(),
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'draft',
    revision_count: 0,
    last_revision_at: null,
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 125,
    notes: 'Aguardando aprovação da marca',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-2',
    brand_id: 'brand-2',
    client_id: 'user-2',
    project_id: 'proj-2',
    created_by: 'user-1',
    assigned_to: 'user-5',
    content_type_id: 'ct-2',
    content_type_slug: 'post_imagem',
    platform: 'instagram',
    credits_consumed: 15,
    title: 'Coleção Primavera 2025',
    body: 'Descubra nossa nova coleção de primavera com designs exclusivos e cores vibrantes.',
    hashtags: ['#BellaModa', '#Primavera', '#ModaFeminina'],
    cta_text: 'Ver Coleção',
    cta_url: 'https://bellamoda.com.br/primavera',
    framework: 'storytelling',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'awaiting_assignment',
    revision_count: 0,
    last_revision_at: null,
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 98,
    notes: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-3',
    brand_id: 'brand-1',
    client_id: 'user-1',
    project_id: 'proj-1',
    created_by: 'user-5',
    assigned_to: 'user-5',
    content_type_id: 'ct-1',
    content_type_slug: 'post_simples',
    platform: 'linkedin',
    credits_consumed: 12,
    title: 'Tendências de IA em 2025',
    body: 'Neste artigo exploramos as principais tendências de inteligência artificial que dominarão 2025.',
    hashtags: ['#IA', '#Tecnologia', '#Futuro'],
    cta_text: 'Ler Artigo',
    cta_url: 'https://blog.techvision.com.br/ia-2025',
    framework: 'educational',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'in_progress',
    revision_count: 0,
    last_revision_at: null,
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: true,
    ai_model: 'claude-opus-4-6',
    generation_prompt: 'Escreva sobre as principais tendências de IA em 2025',
    character_count: 156,
    notes: 'Primeira versão gerada por IA',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-4',
    brand_id: 'brand-2',
    client_id: 'user-2',
    project_id: 'proj-2',
    created_by: 'user-1',
    assigned_to: 'user-5',
    content_type_id: 'ct-3',
    content_type_slug: 'post_fixo',
    platform: 'facebook',
    credits_consumed: 10,
    title: 'Promoção Flash: 40% de desconto',
    body: 'Por 48 horas apenas! Aproveite nossa promoção especial com 40% de desconto em itens selecionados.',
    hashtags: ['#BellaModa', '#Promoção', '#Desconto'],
    cta_text: 'Comprar Agora',
    cta_url: 'https://bellamoda.com.br/promocao',
    framework: 'problem_solution',
    selected_assets: [],
    scheduled_for: new Date(Date.now() + 172800000).toISOString(),
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'submitted',
    revision_count: 1,
    last_revision_at: new Date(Date.now() - 86400000).toISOString(),
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 124,
    notes: 'Enviado para revisão',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-5',
    brand_id: 'brand-3',
    client_id: 'user-3',
    project_id: 'proj-3',
    created_by: 'user-1',
    assigned_to: null,
    content_type_id: 'ct-4',
    content_type_slug: 'reels',
    platform: 'instagram',
    credits_consumed: 25,
    title: 'Como escolher alimentos orgânicos',
    body: 'Veja um guia prático de como identificar alimentos orgânicos verdadeiros no supermercado.',
    hashtags: ['#Orgânico', '#Saúde', '#Sustentável'],
    cta_text: 'Mais Dicas',
    cta_url: 'https://organicfoods.com.br/dicas',
    framework: 'educational',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'revision_requested',
    revision_count: 1,
    last_revision_at: new Date(Date.now() - 43200000).toISOString(),
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 109,
    notes: 'Revisar duração do vídeo',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-6',
    brand_id: 'brand-1',
    client_id: 'user-1',
    project_id: 'proj-1',
    created_by: 'user-1',
    assigned_to: null,
    content_type_id: 'ct-5',
    content_type_slug: 'linkedin_post',
    platform: 'linkedin',
    credits_consumed: 12,
    title: 'Case de sucesso: Transformação digital',
    body: 'Conheça a história de como uma empresa tradicional alcançou a transformação digital.',
    hashtags: ['#TransformaçãoDigital', '#CaseDeSuccesso', '#Inovação'],
    cta_text: 'Ler História Completa',
    cta_url: 'https://blog.techvision.com.br/case-sucesso',
    framework: 'testimonial',
    selected_assets: [],
    scheduled_for: null,
    published_at: new Date(Date.now() - 604800000).toISOString(),
    external_post_id: 'ext-post-6',
    external_url: 'https://linkedin.com/feed/update/1234567890',
    status: 'published',
    revision_count: 2,
    last_revision_at: new Date(Date.now() - 1209600000).toISOString(),
    impressions: 2450,
    reach: 1850,
    engagement_rate: 8.5,
    likes: 156,
    comments: 34,
    shares: 12,
    saves: 45,
    clicks: 98,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 198,
    notes: 'Alto engajamento',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-7',
    brand_id: 'brand-2',
    client_id: 'user-2',
    project_id: 'proj-2',
    created_by: 'user-1',
    assigned_to: null,
    content_type_id: 'ct-6',
    content_type_slug: 'story_video',
    platform: 'instagram',
    credits_consumed: 20,
    title: 'Behind the scenes: Ensaio de primavera',
    body: 'Confira os bastidores do nosso novo ensaio de primavera com modelos incríveis.',
    hashtags: ['#BTS', '#Primavera', '#Ensaio'],
    cta_text: 'Ver Mais',
    cta_url: 'https://instagram.com/bellamoda',
    framework: 'storytelling',
    selected_assets: [],
    scheduled_for: null,
    published_at: new Date(Date.now() - 259200000).toISOString(),
    external_post_id: 'ext-post-7',
    external_url: 'https://instagram.com/stories/bellamoda/123456',
    status: 'published',
    revision_count: 0,
    last_revision_at: null,
    impressions: 5200,
    reach: 4100,
    engagement_rate: 12.3,
    likes: 320,
    comments: 68,
    shares: 25,
    saves: 120,
    clicks: 450,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 115,
    notes: 'Melhor desempenho do mês',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-8',
    brand_id: 'brand-3',
    client_id: 'user-3',
    project_id: 'proj-3',
    created_by: 'user-1',
    assigned_to: null,
    content_type_id: 'ct-7',
    content_type_slug: 'post_simples',
    platform: 'facebook',
    credits_consumed: 10,
    title: 'Novo ponto de venda em São Paulo',
    body: 'Inauguramos nossa nova loja em São Paulo para melhor servir você!',
    hashtags: ['#OrganicFoods', '#NovaLoja', '#SãoPaulo'],
    cta_text: 'Visitar Loja',
    cta_url: 'https://organicfoods.com.br/lojas/sp',
    framework: 'benefits',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'approved',
    revision_count: 1,
    last_revision_at: new Date(Date.now() - 172800000).toISOString(),
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 89,
    notes: 'Pronto para publicar',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-9',
    brand_id: 'brand-1',
    client_id: 'user-1',
    project_id: 'proj-1',
    created_by: 'user-5',
    assigned_to: null,
    content_type_id: 'ct-8',
    content_type_slug: 'post_simples',
    platform: 'tiktok',
    credits_consumed: 18,
    title: 'Dica rápida: Produtividade com IA',
    body: 'Descubra 3 formas de aumentar sua produtividade usando ferramentas de IA.',
    hashtags: ['#IA', '#Produtividade', '#Dica'],
    cta_text: 'Assista Completo',
    cta_url: 'https://tiktok.com/@techvision',
    framework: 'list',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'scheduled',
    revision_count: 0,
    last_revision_at: null,
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: true,
    ai_model: 'claude-opus-4-6',
    generation_prompt: '3 dicas rápidas sobre produtividade com IA',
    character_count: 112,
    notes: 'Agendado para próxima terça',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 'post-10',
    brand_id: 'brand-2',
    client_id: 'user-2',
    project_id: 'proj-2',
    created_by: 'user-1',
    assigned_to: null,
    content_type_id: 'ct-9',
    content_type_slug: 'carrossel_imagens',
    platform: 'instagram',
    credits_consumed: 20,
    title: 'Carrossel: Estilos para o verão',
    body: '5 estilos incríveis para você se inspirar neste verão.',
    hashtags: ['#Estilo', '#Verão', '#Inspiração'],
    cta_text: 'Ver Mais Estilos',
    cta_url: 'https://bellamoda.com.br/colecoes',
    framework: 'question',
    selected_assets: [],
    scheduled_for: null,
    published_at: null,
    external_post_id: null,
    external_url: null,
    status: 'failed',
    revision_count: 0,
    last_revision_at: null,
    impressions: 0,
    reach: 0,
    engagement_rate: 0,
    likes: 0,
    comments: 0,
    shares: 0,
    saves: 0,
    clicks: 0,
    ai_generated: false,
    ai_model: null,
    generation_prompt: null,
    character_count: 89,
    notes: 'Erro ao publicar - retentar depois',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// ============================================
// Helper: Render platform icon
// ============================================
function getPlatformIcon(platform: PlatformType) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const icons: Record<PlatformType, React.ComponentType<any>> = {
    instagram: LogoInstagram,
    facebook: LogoFacebook,
    linkedin: LogoLinkedin,
    twitter: LogoX,
    tiktok: LogoX,
    youtube: LogoYoutube,
    pinterest: LogoPinterest,
    threads: LogoX,
  };
  const Icon = icons[platform];
  return Icon ? <Icon size={16} /> : null;
}

// ============================================
// Helper: Truncate text
// ============================================
function truncate(text: string, length: number): string {
  return text.length > length ? text.substring(0, length) + '...' : text;
}

// ============================================
// Kanban View Component
// ============================================
function KanbanView({ posts }: { posts: Post[] }) {
  const postsByStatus = useMemo(() => {
    const statuses: PostStatus[] = [
      'draft',
      'awaiting_assignment',
      'assigned',
      'in_progress',
      'submitted',
      'revision_requested',
      'approved',
      'scheduled',
      'published',
      'failed',
      'archived',
    ];

    return statuses.map((status) => ({
      status,
      config: POST_STATUS_CONFIG[status],
      posts: posts.filter((p) => p.status === status),
    }));
  }, [posts]);

  return (
    <div className="kanban-container">
      <div className="kanban-columns">
        {postsByStatus.map(({ status, config, posts: statusPosts }) => (
          <div key={status} className="kanban-column">
            <div className="kanban-column__header">
              <div className="kanban-column__header-title">
                <h3>{config.label}</h3>
                <span className="kanban-column__badge">{statusPosts.length}</span>
              </div>
            </div>
            <div className="kanban-column__cards">
              {statusPosts.length === 0 ? (
                <div className="kanban-empty">Vazio</div>
              ) : (
                statusPosts.map((post) => (
                  <Tile
                    key={post.id}
                    className="kanban-card"
                    onClick={() => console.log('Open post:', post.id)}
                  >
                    <div className="kanban-card__header">
                      <h4 title={post.title || 'Sem título'}>
                        {truncate(post.title || 'Sem título', 35)}
                      </h4>
                    </div>
                    <div className="kanban-card__body">
                      <div className="kanban-card__platform">
                        {getPlatformIcon(post.platform)}
                        <span>{PLATFORM_CONFIG[post.platform].label}</span>
                      </div>
                      <div className="kanban-card__brand">
                        {post.brand_id}
                      </div>
                    </div>
                    <div className="kanban-card__footer">
                      <span className="kanban-card__date">
                        {new Date(post.created_at).toLocaleDateString('pt-BR', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      {post.ai_generated && (
                        <Tag type="blue" size="sm">
                          IA
                        </Tag>
                      )}
                    </div>
                  </Tile>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================
// Table View Component
// ============================================
function TableView({ posts }: { posts: Post[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesSearch = (post.title || '').toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || post.status === statusFilter;
      const matchesPlatform = platformFilter === 'all' || post.platform === platformFilter;
      return matchesSearch && matchesStatus && matchesPlatform;
    });
  }, [posts, searchTerm, statusFilter, platformFilter]);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredPosts.slice(start, start + pageSize);
  }, [filteredPosts, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredPosts.length / pageSize);

  return (
    <div className="table-view">
      <div className="table-toolbar">
        <TableToolbarContent>
          <TableToolbarSearch
            persistent
            onChange={(e: React.ChangeEvent<HTMLInputElement> | '', value?: string) =>
              setSearchTerm(value ?? (typeof e === 'string' ? '' : e.target.value))
            }
            placeholder="Buscar por título..."
          />
          <Dropdown
            id="status-filter"
            label="Filtrar Status"
            titleText=""
            hideLabel
            items={[
              { id: 'all', label: 'Todos os Status' },
              ...Object.entries(POST_STATUS_CONFIG).map(([key, value]) => ({
                id: key,
                label: value.label,
              })),
            ]}
            itemToString={(item: { id: string; label: string }) => item?.label || ''}
            selectedItem={{ id: statusFilter, label: 'Filtrar Status' }}
            onChange={(e: { selectedItem: { id: string; label: string } }) => {
              if (e.selectedItem) {
                setStatusFilter(e.selectedItem.id);
                setCurrentPage(1);
              }
            }}
          />
          <Dropdown
            id="platform-filter"
            label="Filtrar Plataforma"
            titleText=""
            hideLabel
            items={[
              { id: 'all', label: 'Todas as Plataformas' },
              ...Object.entries(PLATFORM_CONFIG).map(([key, value]) => ({
                id: key,
                label: value.label,
              })),
            ]}
            itemToString={(item: { id: string; label: string }) => item?.label || ''}
            selectedItem={{ id: platformFilter, label: 'Filtrar Plataforma' }}
            onChange={(e: { selectedItem: { id: string; label: string } }) => {
              if (e.selectedItem) {
                setPlatformFilter(e.selectedItem.id);
                setCurrentPage(1);
              }
            }}
          />
        </TableToolbarContent>
      </div>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableHeader>Título</TableHeader>
              <TableHeader>Marca</TableHeader>
              <TableHeader>Plataforma</TableHeader>
              <TableHeader>Status</TableHeader>
              <TableHeader>Engajamento</TableHeader>
              <TableHeader>Data</TableHeader>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedPosts.map((post) => {
              const statusConfig = POST_STATUS_CONFIG[post.status];
              return (
                <TableRow key={post.id}>
                  <TableCell>{truncate(post.title || 'Sem título', 40)}</TableCell>
                  <TableCell>{post.brand_id}</TableCell>
                  <TableCell>
                    <div className="table-cell-platform">
                      {getPlatformIcon(post.platform)}
                      {PLATFORM_CONFIG[post.platform].label}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Tag type={statusConfig.tagType} size="sm">
                      {statusConfig.label}
                    </Tag>
                  </TableCell>
                  <TableCell>
                    {post.engagement_rate > 0
                      ? `${post.engagement_rate.toFixed(1)}%`
                      : '—'}
                  </TableCell>
                  <TableCell>
                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="table-pagination">
        <Pagination
          backwardText="Anterior"
          forwardText="Próximo"
          pageSize={pageSize}
          pageSizes={[5, 10, 20, 50]}
          totalItems={filteredPosts.length}
          onChange={(e: { pageSize: number; page: number }) => {
            setPageSize(e.pageSize);
            setCurrentPage(e.page);
          }}
        />
      </div>
    </div>
  );
}

// ============================================
// Main Posts Page Component
// ============================================
function PostsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState(0); // 0 = Kanban, 1 = Table

  const [formData, setFormData] = useState<PostFormData>({
    brand_id: '',
    project_id: '',
    content_type_id: '',
    platform: 'instagram',
    title: '',
    body: '',
    hashtags: [],
    cta_text: '',
    cta_url: '',
    framework: '',
    scheduled_for: '',
    campaign_id: '',
  });

  const [hashtagsInput, setHashtagsInput] = useState('');

  // Auto-open modal from URL
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      resetForm();
      setModalOpen(true);
    }
  }, [searchParams]);

  // Stats calculations
  const stats = useMemo(() => {
    return {
      total: posts.length,
      inProduction: posts.filter((p) => p.status === 'in_progress').length,
      scheduled: posts.filter((p) => p.status === 'scheduled').length,
      published: posts.filter((p) => p.status === 'published').length,
    };
  }, [posts]);

  const resetForm = () => {
    setFormData({
      brand_id: '',
      project_id: '',
      content_type_id: '',
      platform: 'instagram',
      title: '',
      body: '',
      hashtags: [],
      cta_text: '',
      cta_url: '',
      framework: '',
      scheduled_for: '',
      campaign_id: '',
    });
    setHashtagsInput('');
  };

  const handleSave = async () => {
    try {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        brand_id: formData.brand_id,
        client_id: 'user-1',
        project_id: formData.project_id || null,
        created_by: 'user-1',
        assigned_to: null,
        content_type_id: formData.content_type_id || null,
        content_type_slug: null,
        platform: formData.platform,
        credits_consumed: 10,
        title: formData.title,
        body: formData.body,
        hashtags: hashtagsInput
          .split(',')
          .map((h) => h.trim())
          .filter(Boolean),
        cta_text: formData.cta_text,
        cta_url: formData.cta_url,
        framework: (formData.framework || null) as ContentFramework | null,
        selected_assets: [],
        scheduled_for: formData.scheduled_for || null,
        published_at: null,
        external_post_id: null,
        external_url: null,
        status: 'draft',
        revision_count: 0,
        last_revision_at: null,
        impressions: 0,
        reach: 0,
        engagement_rate: 0,
        likes: 0,
        comments: 0,
        shares: 0,
        saves: 0,
        clicks: 0,
        ai_generated: false,
        ai_model: null,
        generation_prompt: null,
        character_count: formData.body.length,
        notes: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      setPosts([newPost, ...posts]);
      setModalOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="posts-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__content">
          <h1>Posts</h1>
          <p>Gerencie e publique conteúdo em todas as plataformas</p>
        </div>
        <div className="page-header__actions">
          <Button
            kind="primary"
            size="lg"
            onClick={() => {
              resetForm();
              setModalOpen(true);
            }}
          >
            <Add size={20} style={{ marginRight: '0.5rem' }} />
            Novo Post
          </Button>
          <Button kind="secondary" size="lg">
            <Download size={20} style={{ marginRight: '0.5rem' }} />
            Exportar
          </Button>
          <Button kind="ghost" size="lg">
            <Renew size={20} />
          </Button>
        </div>
      </div>

      {/* View Switcher */}
      <div className="view-switcher-container">
        <ContentSwitcher size="md" onChange={(e: { index?: number }) => setViewMode(e.index ?? 0)} selectedIndex={viewMode}>
          <Switch name="kanban" text="Kanban" />
          <Switch name="table" text="Tabela" />
        </ContentSwitcher>
      </div>

      {/* Stats Row */}
      <div className="posts-stats">
        <Tile className="stat-tile stat-tile--blue">
          <div className="stat-tile__content">
            <div className="stat-tile__value">{stats.total}</div>
            <div className="stat-tile__label">Total de Posts</div>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--cyan">
          <div className="stat-tile__content">
            <div className="stat-tile__value">{stats.inProduction}</div>
            <div className="stat-tile__label">Em Produção</div>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--teal">
          <div className="stat-tile__content">
            <div className="stat-tile__value">{stats.scheduled}</div>
            <div className="stat-tile__label">Agendados</div>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--green">
          <div className="stat-tile__content">
            <div className="stat-tile__value">{stats.published}</div>
            <div className="stat-tile__label">Publicados</div>
          </div>
        </Tile>
      </div>

      {/* View Content */}
      <div className="view-content">
        {viewMode === 0 && <KanbanView posts={posts} />}
        {viewMode === 1 && <TableView posts={posts} />}
      </div>

      {/* New Post Modal */}
      <Modal
        modalHeading="Novo Post"
        primaryButtonText="Criar Post"
        secondaryButtonText="Cancelar"
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        onRequestSubmit={handleSave}
        size="lg"
      >
        <div className="modal-form">
          <Dropdown
            id="brand-selector"
            titleText="Marca"
            label="Selecionar marca"
            items={MOCK_BRANDS}
            itemToString={(item: Brand) => item?.name || ''}
            selectedItem={MOCK_BRANDS.find((b) => b.id === formData.brand_id) || null}
            onChange={(e: { selectedItem?: Brand | null }) => {
              if (e.selectedItem) {
                setFormData({ ...formData, brand_id: e.selectedItem.id });
              }
            }}
          />

          <Dropdown
            id="platform-selector"
            titleText="Plataforma"
            label="Selecionar plataforma"
            items={Object.entries(PLATFORM_CONFIG).map(([key, value]) => ({
              id: key,
              label: value.label,
            }))}
            itemToString={(item: { id: string; label: string }) => item?.label || ''}
            selectedItem={{
              id: formData.platform,
              label: PLATFORM_CONFIG[formData.platform].label,
            }}
            onChange={(e: { selectedItem?: { id: string; label: string } | null }) => {
              if (e.selectedItem) {
                setFormData({ ...formData, platform: e.selectedItem.id as PlatformType });
              }
            }}
          />

          <Dropdown
            id="framework-selector"
            titleText="Framework de Conteúdo"
            label="Selecionar framework"
            items={[
              { id: 'aida', label: 'AIDA' },
              { id: 'pas', label: 'PAS' },
              { id: 'storytelling', label: 'Storytelling' },
              { id: 'benefits', label: 'Benefícios' },
              { id: 'educational', label: 'Educacional' },
              { id: 'testimonial', label: 'Testemunho' },
              { id: 'problem_solution', label: 'Problema & Solução' },
              { id: 'before_after', label: 'Antes & Depois' },
              { id: 'list', label: 'Lista' },
              { id: 'question', label: 'Pergunta' },
              { id: 'controversy', label: 'Controvérsia' },
              { id: 'custom', label: 'Personalizado' },
            ]}
            itemToString={(item: { id: string; label: string }) => item?.label || ''}
            selectedItem={
              formData.framework
                ? {
                    id: formData.framework,
                    label: formData.framework.charAt(0).toUpperCase() + formData.framework.slice(1),
                  }
                : null
            }
            onChange={(e: { selectedItem?: { id: string; label: string } | null }) => {
              if (e.selectedItem) {
                setFormData({ ...formData, framework: e.selectedItem.id as ContentFramework });
              }
            }}
          />

          <TextInput
            id="title"
            labelText="Título"
            placeholder="Título do post"
            value={formData.title}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, title: e.target.value })
            }
          />

          <TextArea
            id="body"
            labelText="Corpo do Post"
            placeholder="Escreva o conteúdo do post aqui..."
            rows={4}
            value={formData.body}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
              setFormData({ ...formData, body: e.target.value })
            }
          />

          <TextInput
            id="hashtags"
            labelText="Hashtags (separadas por vírgula)"
            placeholder="#tag1, #tag2, #tag3"
            value={hashtagsInput}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setHashtagsInput(e.target.value)
            }
          />

          <TextInput
            id="cta-text"
            labelText="Texto CTA"
            placeholder="Ex: Saiba Mais"
            value={formData.cta_text}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, cta_text: e.target.value })
            }
          />

          <TextInput
            id="cta-url"
            labelText="URL CTA"
            placeholder="https://..."
            value={formData.cta_url}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, cta_url: e.target.value })
            }
          />

          <DatePickerInput
            id="schedule-date"
            placeholder="mm/dd/yyyy"
            labelText="Data de Agendamento (opcional)"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setFormData({ ...formData, scheduled_for: e.target.value })
            }
          />
        </div>
      </Modal>
    </div>
  );
}

// ============================================
// Wrap with Suspense
// ============================================
export default function PostsPage() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <PostsContent />
    </Suspense>
  );
}
