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
  InlineLoading,
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
  const [posts, setPosts] = useState<Post[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
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

  // Load data from Supabase
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const supabase = createClient();

        // Fetch brands
        const { data: brandsData, error: brandsError } = await supabase
          .from('brands')
          .select('*')
          .eq('is_active', true);

        if (brandsError) {
          console.error('Error fetching brands:', brandsError);
          setBrands([]);
        } else {
          setBrands(brandsData || []);
        }

        // Fetch posts with brand join
        const { data: postsData, error: postsError } = await supabase
          .from('posts_v2')
          .select('*, brands:brand_id (name)');

        if (postsError) {
          console.error('Error fetching posts:', postsError);
          setPosts([]);
        } else {
          setPosts(postsData || []);
        }
      } catch (error) {
        console.error('Error loading data:', error);
        setPosts([]);
        setBrands([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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
      const supabase = createClient();

      // Get current user session for org_id and user_id
      const { data: { user } } = await supabase.auth.getUser();
      const { data: userData } = await supabase
        .from('users')
        .select('id, organization_id')
        .eq('auth_user_id', user?.id)
        .single();

      const orgId = userData?.organization_id;
      const userId = userData?.id;

      const newPost = {
        organization_id: orgId,
        brand_id: formData.brand_id,
        project_id: formData.project_id || null,
        created_by: userId,
        content_type_id: formData.content_type_id || null,
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
      };

      const { error } = await supabase
        .from('posts_v2')
        .insert([newPost]);

      if (error) {
        console.error('Error inserting post:', error);
        return;
      }

      // Reload posts
      const { data: postsData, error: postsError } = await supabase
        .from('posts_v2')
        .select('*, brands:brand_id (name)');

      if (!postsError) {
        setPosts(postsData || []);
      }

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

      {/* Loading State */}
      {loading && (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <InlineLoading description="Carregando posts..." />
        </div>
      )}

      {/* View Switcher */}
      {!loading && (
        <div className="view-switcher-container">
          <ContentSwitcher size="md" onChange={(e: { index?: number }) => setViewMode(e.index ?? 0)} selectedIndex={viewMode}>
            <Switch name="kanban" text="Kanban" />
            <Switch name="table" text="Tabela" />
          </ContentSwitcher>
        </div>
      )}

      {/* Stats Row */}
      {!loading && (
        <>
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
        </>
      )}

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
            items={brands}
            itemToString={(item: Brand) => item?.name || ''}
            selectedItem={brands.find((b) => b.id === formData.brand_id) || null}
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
