'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Tag,
  Tile,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SkeletonText,
  InlineLoading,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TextInput,
  TextArea,
  Modal,
  OverflowMenu,
  OverflowMenuItem,
  Grid,
  Column,
} from '@carbon/react';
import {
  ArrowLeft,
  Edit,
  TrashCan,
  Download,
  Add,
  ColorPalette,
  LogoInstagram,
  LogoFacebook,
  LogoLinkedin,
  LogoTwitter,
  Launch,
  DocumentExport,
  Catalog,
  Image as ImageIcon,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Brand, Post, ClientProject, BrandAsset } from '@/types/database';
import './brand-detail.scss';

// ============================================
// Helper: gerar iniciais da marca
// ============================================
function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

// ============================================
// Status Config Helper
// ============================================
const getStatusConfig = (status: string) => {
  const configs: Record<string, { type: 'green' | 'blue' | 'gray' | 'cyan' | 'red'; text: string }> = {
    published: { type: 'green', text: 'Publicado' },
    scheduled: { type: 'blue', text: 'Agendado' },
    approved: { type: 'green', text: 'Aprovado' },
    draft: { type: 'gray', text: 'Rascunho' },
    in_progress: { type: 'cyan', text: 'Em Andamento' },
    revision_requested: { type: 'blue', text: 'Revisão Solicitada' },
    completed: { type: 'green', text: 'Concluído' },
    active: { type: 'green', text: 'Ativo' },
    paused: { type: 'gray', text: 'Pausado' },
    archived: { type: 'gray', text: 'Arquivado' },
  };
  return configs[status] || { type: 'gray', text: status };
};

// ============================================
// Format helpers
// ============================================
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const formatEngagement = (engagement: number) => {
  if (engagement >= 1000) return `${(engagement / 1000).toFixed(1)}k`;
  return engagement.toString();
};

// ============================================
// Main Component
// ============================================
export default function BrandDetailPage() {
  const params = useParams();
  const router = useRouter();
  const brandId = params.id as string;

  const [brand, setBrand] = useState<Brand | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [assets, setAssets] = useState<BrandAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    tagline: '',
    primary_color: '#0f62fe',
    secondary_color: '#6929c4',
    brand_voice: '',
    target_audience: '',
    instagram_handle: '',
    facebook_page: '',
    linkedin_page: '',
    twitter_handle: '',
    website_url: '',
  });

  useEffect(() => {
    loadBrandData();
  }, [brandId]);

  const loadBrandData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Load brand
      const { data: brandData, error: brandError } = await supabase
        .from('brands')
        .select('*')
        .eq('id', brandId)
        .single();

      if (brandError) throw brandError;
      setBrand(brandData);
      setFormData({
        name: brandData.name,
        tagline: brandData.tagline || '',
        primary_color: brandData.primary_color || '#0f62fe',
        secondary_color: brandData.secondary_color || '#6929c4',
        brand_voice: brandData.brand_voice || '',
        target_audience: brandData.target_audience || '',
        instagram_handle: brandData.instagram_handle || '',
        facebook_page: brandData.facebook_page || '',
        linkedin_page: brandData.linkedin_page || '',
        twitter_handle: brandData.twitter_handle || '',
        website_url: brandData.website_url || '',
      });

      // Load posts
      const { data: postsData } = await supabase
        .from('posts_v2')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      setPosts(postsData || []);

      // Load projects
      const { data: projectsData } = await supabase
        .from('client_projects')
        .select('*')
        .eq('brand_id', brandId)
        .order('created_at', { ascending: false });

      setProjects(projectsData || []);

      // Load brand assets
      const { data: assetsData } = await supabase
        .from('brand_assets')
        .select('*')
        .eq('brand_id', brandId)
        .order('uploaded_at', { ascending: false });

      setAssets(assetsData || []);
    } catch (error) {
      console.error('Error loading brand:', error);
      // Mock data for development
      setBrand({
        id: brandId,
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
      });

      setPosts([
        {
          id: 'post-1',
          brand_id: brandId,
          client_id: 'user-1',
          project_id: null,
          created_by: null,
          assigned_to: null,
          content_type_id: null,
          content_type_slug: null,
          platform: 'instagram',
          credits_consumed: 1,
          title: 'Novo Lançamento',
          body: 'Confira nosso novo produto!',
          hashtags: ['#tecnologia', '#inovação'],
          cta_text: 'Saiba Mais',
          cta_url: 'https://techvision.com.br',
          framework: null,
          selected_assets: [],
          scheduled_for: null,
          published_at: new Date().toISOString(),
          external_post_id: null,
          external_url: null,
          status: 'published',
          revision_count: 0,
          last_revision_at: null,
          impressions: 1250,
          reach: 980,
          engagement_rate: 8.5,
          likes: 95,
          comments: 12,
          shares: 8,
          saves: 23,
          clicks: 45,
          ai_generated: false,
          ai_model: null,
          generation_prompt: null,
          character_count: 45,
          notes: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      setProjects([
        {
          id: 'project-1',
          client_id: 'user-1',
          brand_id: brandId,
          name: 'Campanha Q1 2025',
          description: 'Campanha de primavera',
          credits_allocated: 50,
          credits_used: 25,
          credits_remaining: 25,
          purchase_id: null,
          is_recurrent: false,
          recurrence_pattern: null,
          start_date: new Date().toISOString(),
          deadline: null,
          completed_at: null,
          status: 'active',
          tags: ['campanha', 'q1'],
          settings: {},
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ]);

      setAssets([
        {
          id: 'asset-1',
          brand_id: brandId,
          client_id: 'user-1',
          file_name: 'logo.png',
          file_path: null,
          file_url: 'https://via.placeholder.com/300',
          file_type: 'logo',
          file_size: 25600,
          mime_type: 'image/png',
          width: 300,
          height: 300,
          duration_seconds: null,
          title: 'Logo Principal',
          description: 'Logo da marca em alta resolução',
          alt_text: 'TechVision Logo',
          tags: ['logo', 'marca'],
          category: 'identidade',
          source: null,
          source_pack_id: null,
          is_public: true,
          can_be_used_in_posts: true,
          uploaded_at: new Date().toISOString(),
          uploaded_by: 'user-1',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('brands')
        .update(formData)
        .eq('id', brandId);

      if (error) throw error;

      setEditModalOpen(false);
      loadBrandData();
    } catch (error) {
      console.error('Error updating brand:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta marca? Esta ação não pode ser desfeita.')) return;

    try {
      const supabase = createClient();
      const { error } = await supabase.from('brands').delete().eq('id', brandId);

      if (error) throw error;
      router.push('/brands');
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  if (loading) {
    return (
      <div className="brand-detail">
        <div className="brand-detail__loading">
          <SkeletonText heading width="60%" />
          <SkeletonText paragraph lineCount={3} />
        </div>
      </div>
    );
  }

  if (!brand) {
    return (
      <div className="brand-detail">
        <Breadcrumb noTrailingSlash className="brand-detail__breadcrumb">
          <BreadcrumbItem href="/brands">Marcas</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>Marca não encontrada</BreadcrumbItem>
        </Breadcrumb>
        <div className="empty-state">
          <h3>Marca não encontrada</h3>
          <p>A marca solicitada não existe ou foi removida.</p>
          <Button kind="tertiary" onClick={() => router.push('/brands')}>
            Voltar para Marcas
          </Button>
        </div>
      </div>
    );
  }

  // Stats
  const brandStats = {
    totalPosts: posts.length,
    publishedPosts: posts.filter((p) => p.status === 'published').length,
    totalEngagement: posts.reduce((sum, p) => sum + (p.likes + p.comments + p.shares), 0),
    activeProjects: projects.filter((p) => p.status === 'active').length,
    creditsUsed: projects.reduce((sum, p) => sum + p.credits_used, 0),
    totalAssets: assets.length,
  };

  // DataTable headers
  const postHeaders = [
    { key: 'title', header: 'Título' },
    { key: 'platform', header: 'Plataforma' },
    { key: 'status', header: 'Status' },
    { key: 'engagement', header: 'Engajamento' },
    { key: 'created_at', header: 'Data' },
    { key: 'actions', header: '' },
  ];

  const projectHeaders = [
    { key: 'name', header: 'Projeto' },
    { key: 'status', header: 'Status' },
    { key: 'credits_allocated', header: 'Créditos' },
    { key: 'created_at', header: 'Data' },
    { key: 'actions', header: '' },
  ];

  return (
    <div className="brand-detail">
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash className="brand-detail__breadcrumb">
        <BreadcrumbItem href="/brands">Marcas</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{brand.name}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header Section */}
      <div className="brand-detail__header">
        <div className="brand-detail__header-main">
          <div className="brand-detail__avatar" style={{ background: brand.primary_color || '#0f62fe' }}>
            {brand.logo_url ? <img src={brand.logo_url} alt={brand.name} /> : getInitials(brand.name)}
          </div>

          <div className="brand-detail__info">
            <h1>{brand.name}</h1>
            {brand.tagline && <p className="brand-detail__tagline">{brand.tagline}</p>}

            <div className="brand-detail__meta">
              <Tag type={brand.is_active ? 'green' : 'gray'}>{brand.is_active ? 'Ativa' : 'Inativa'}</Tag>
              {brand.website_url && (
                <a href={brand.website_url} target="_blank" rel="noopener noreferrer" className="brand-detail__link">
                  <Launch size={14} />
                  Website
                </a>
              )}
            </div>
          </div>
        </div>

        <div className="brand-detail__actions">
          <Button kind="tertiary" renderIcon={Edit} size="md" onClick={() => setEditModalOpen(true)}>
            Editar
          </Button>
          <OverflowMenu flipped size="md" ariaLabel="Mais ações">
            <OverflowMenuItem itemText="Exportar dados" />
            <OverflowMenuItem itemText="Excluir marca" isDelete onClick={handleDelete} />
          </OverflowMenu>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="brand-detail__stats">
        <Tile className="stat-tile">
          <span className="stat-tile__label">Total de Posts</span>
          <span className="stat-tile__value">{brandStats.totalPosts}</span>
        </Tile>
        <Tile className="stat-tile">
          <span className="stat-tile__label">Posts Publicados</span>
          <span className="stat-tile__value stat-tile__value--green">{brandStats.publishedPosts}</span>
        </Tile>
        <Tile className="stat-tile">
          <span className="stat-tile__label">Projetos Ativos</span>
          <span className="stat-tile__value stat-tile__value--blue">{brandStats.activeProjects}</span>
        </Tile>
        <Tile className="stat-tile">
          <span className="stat-tile__label">Engajamento Total</span>
          <span className="stat-tile__value">{formatEngagement(brandStats.totalEngagement)}</span>
        </Tile>
      </div>

      {/* Tabs */}
      <Tabs>
        <TabList aria-label="Abas da marca">
          <Tab>Visão Geral</Tab>
          <Tab>Posts ({posts.length})</Tab>
          <Tab>Projetos ({projects.length})</Tab>
          <Tab>Assets ({assets.length})</Tab>
          <Tab>Configurações</Tab>
        </TabList>

        <TabPanels>
          {/* Tab: Visão Geral */}
          <TabPanel>
            <div className="tab-panel">
              <Grid>
                <Column lg={8} md={8} sm={4}>
                  <div className="section">
                    <h3>Voz da Marca</h3>
                    {brand.brand_voice ? (
                      <p>{brand.brand_voice}</p>
                    ) : (
                      <p className="text-placeholder">Nenhuma voz de marca definida</p>
                    )}
                  </div>

                  <div className="section">
                    <h3>Público-Alvo</h3>
                    {brand.target_audience ? (
                      <p>{brand.target_audience}</p>
                    ) : (
                      <p className="text-placeholder">Nenhum público-alvo definido</p>
                    )}
                  </div>

                  <div className="section">
                    <h3>Descrição</h3>
                    {brand.description ? (
                      <p>{brand.description}</p>
                    ) : (
                      <p className="text-placeholder">Nenhuma descrição</p>
                    )}
                  </div>
                </Column>

                <Column lg={8} md={8} sm={4}>
                  <div className="section">
                    <h3>Identidade Visual</h3>
                    <div className="color-row">
                      <div className="color-preview">
                        <div className="color-swatch" style={{ background: brand.primary_color || '#0f62fe' }} />
                        <span>Cor Primária</span>
                        <code>{brand.primary_color}</code>
                      </div>
                      <div className="color-preview">
                        <div className="color-swatch" style={{ background: brand.secondary_color || '#6929c4' }} />
                        <span>Cor Secundária</span>
                        <code>{brand.secondary_color}</code>
                      </div>
                    </div>
                    {brand.font_family && (
                      <div className="font-info">
                        <span>Tipografia: {brand.font_family}</span>
                      </div>
                    )}
                  </div>

                  <div className="section">
                    <h3>Palavras-chave</h3>
                    <div className="keyword-tags">
                      {brand.keywords && brand.keywords.length > 0 ? (
                        brand.keywords.map((kw) => (
                          <Tag key={kw} type="cool-gray" size="sm">
                            {kw}
                          </Tag>
                        ))
                      ) : (
                        <p className="text-placeholder">Nenhuma palavra-chave</p>
                      )}
                    </div>
                  </div>

                  <div className="section">
                    <h3>Redes Sociais</h3>
                    <div className="social-links">
                      {brand.instagram_handle && (
                        <a href={`https://instagram.com/${brand.instagram_handle}`} target="_blank" rel="noopener noreferrer">
                          <LogoInstagram size={20} />
                          {brand.instagram_handle}
                        </a>
                      )}
                      {brand.facebook_page && (
                        <a href={`https://facebook.com/${brand.facebook_page}`} target="_blank" rel="noopener noreferrer">
                          <LogoFacebook size={20} />
                          {brand.facebook_page}
                        </a>
                      )}
                      {brand.linkedin_page && (
                        <a href={`https://linkedin.com/company/${brand.linkedin_page}`} target="_blank" rel="noopener noreferrer">
                          <LogoLinkedin size={20} />
                          {brand.linkedin_page}
                        </a>
                      )}
                      {brand.twitter_handle && (
                        <a href={`https://twitter.com/${brand.twitter_handle}`} target="_blank" rel="noopener noreferrer">
                          <LogoTwitter size={20} />
                          {brand.twitter_handle}
                        </a>
                      )}
                    </div>
                  </div>
                </Column>
              </Grid>
            </div>
          </TabPanel>

          {/* Tab: Posts */}
          <TabPanel>
            <div className="tab-panel">
              <div className="tab-panel-header">
                <h3>Posts Publicados</h3>
                <Button size="sm" renderIcon={Add} href={`/posts?new=true&brand_id=${brandId}`}>
                  Novo Post
                </Button>
              </div>

              {posts.length === 0 ? (
                <div className="empty-state">
                  <Catalog size={48} />
                  <h4>Nenhum post ainda</h4>
                  <p>Comece criando o primeiro post para esta marca</p>
                  <Button renderIcon={Add} href={`/posts?new=true&brand_id=${brandId}`}>
                    Criar Post
                  </Button>
                </div>
              ) : (
                <DataTable rows={posts} headers={postHeaders}>
                  {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
                    <div {...getTableContainerProps()}>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header: any, idx: number) => (
                              <TableHeader {...getHeaderProps({ header })} key={`header-${idx}`}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row: any) => {
                            const post = posts.find((p) => p.id === row.id)!;
                            const statusConfig = getStatusConfig(post.status);
                            return (
                              <TableRow {...getRowProps({ row })} key={row.id}>
                                <TableCell>{post.title || 'Sem título'}</TableCell>
                                <TableCell>
                                  <Tag type="cool-gray" size="sm">
                                    {post.platform}
                                  </Tag>
                                </TableCell>
                                <TableCell>
                                  <Tag type={statusConfig.type} size="sm">
                                    {statusConfig.text}
                                  </Tag>
                                </TableCell>
                                <TableCell>{post.likes + post.comments + post.shares}</TableCell>
                                <TableCell>{formatDate(post.created_at)}</TableCell>
                                <TableCell>
                                  <OverflowMenu flipped size="sm" ariaLabel="Ações">
                                    <OverflowMenuItem itemText="Visualizar" onClick={() => router.push(`/posts/${post.id}`)} />
                                    <OverflowMenuItem itemText="Editar" onClick={() => router.push(`/posts/${post.id}?edit=true`)} />
                                  </OverflowMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </DataTable>
              )}
            </div>
          </TabPanel>

          {/* Tab: Projetos */}
          <TabPanel>
            <div className="tab-panel">
              <div className="tab-panel-header">
                <h3>Projetos</h3>
                <Button size="sm" renderIcon={Add}>
                  Novo Projeto
                </Button>
              </div>

              {projects.length === 0 ? (
                <div className="empty-state">
                  <DocumentExport size={48} />
                  <h4>Nenhum projeto ainda</h4>
                  <p>Crie o primeiro projeto para esta marca</p>
                  <Button renderIcon={Add}>Criar Projeto</Button>
                </div>
              ) : (
                <DataTable rows={projects} headers={projectHeaders}>
                  {({ rows, headers, getHeaderProps, getRowProps, getTableProps, getTableContainerProps }) => (
                    <div {...getTableContainerProps()}>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {headers.map((header: any, idx: number) => (
                              <TableHeader {...getHeaderProps({ header })} key={`header-${idx}`}>
                                {header.header}
                              </TableHeader>
                            ))}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {rows.map((row: any) => {
                            const project = projects.find((p) => p.id === row.id)!;
                            const statusConfig = getStatusConfig(project.status);
                            return (
                              <TableRow {...getRowProps({ row })} key={row.id}>
                                <TableCell>{project.name}</TableCell>
                                <TableCell>
                                  <Tag type={statusConfig.type} size="sm">
                                    {statusConfig.text}
                                  </Tag>
                                </TableCell>
                                <TableCell>
                                  {project.credits_used} / {project.credits_allocated}
                                </TableCell>
                                <TableCell>{formatDate(project.created_at)}</TableCell>
                                <TableCell>
                                  <OverflowMenu flipped size="sm" ariaLabel="Ações">
                                    <OverflowMenuItem itemText="Visualizar" />
                                    <OverflowMenuItem itemText="Editar" />
                                  </OverflowMenu>
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </DataTable>
              )}
            </div>
          </TabPanel>

          {/* Tab: Assets */}
          <TabPanel>
            <div className="tab-panel">
              <div className="tab-panel-header">
                <h3>Biblioteca de Assets</h3>
                <Button size="sm" renderIcon={Add}>
                  Upload Asset
                </Button>
              </div>

              {assets.length === 0 ? (
                <div className="empty-state">
                  <ImageIcon size={48} />
                  <h4>Nenhum asset ainda</h4>
                  <p>Faça upload de imagens, vídeos e outros arquivos</p>
                  <Button renderIcon={Add}>Upload Asset</Button>
                </div>
              ) : (
                <div className="assets-grid">
                  {assets.map((asset) => (
                    <div key={asset.id} className="asset-card">
                      {asset.file_type === 'image' || asset.file_type === 'logo' ? (
                        <img src={asset.file_url} alt={asset.title || asset.file_name} className="asset-card__thumbnail" />
                      ) : asset.file_type === 'video' ? (
                        <video src={asset.file_url} className="asset-card__thumbnail" />
                      ) : (
                        <div className="asset-card__placeholder">
                          <ImageIcon size={32} />
                        </div>
                      )}
                      <div className="asset-card__info">
                        <h4>{asset.title || asset.file_name}</h4>
                        {asset.description && <p>{asset.description}</p>}
                        <div className="asset-card__tags">
                          {asset.tags && asset.tags.slice(0, 2).map((tag) => (
                            <Tag key={tag} type="cool-gray" size="sm">
                              {tag}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </TabPanel>

          {/* Tab: Configurações */}
          <TabPanel>
            <div className="tab-panel">
              <div className="settings-form">
                <h3>Configurações da Marca</h3>

                <div className="form-section">
                  <h4>Identidade</h4>
                  <div className="form-row">
                    <TextInput
                      id="brand-name"
                      labelText="Nome da Marca"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                    <TextInput
                      id="brand-tagline"
                      labelText="Tagline"
                      value={formData.tagline}
                      onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-color">
                      <TextInput
                        id="brand-primary-color"
                        labelText="Cor Primária"
                        value={formData.primary_color}
                        onChange={(e) => setFormData({ ...formData, primary_color: e.target.value })}
                      />
                      <div className="color-preview-inline" style={{ background: formData.primary_color }} />
                    </div>
                    <div className="form-color">
                      <TextInput
                        id="brand-secondary-color"
                        labelText="Cor Secundária"
                        value={formData.secondary_color}
                        onChange={(e) => setFormData({ ...formData, secondary_color: e.target.value })}
                      />
                      <div className="color-preview-inline" style={{ background: formData.secondary_color }} />
                    </div>
                  </div>
                </div>

                <div className="form-section">
                  <h4>Voz & Posicionamento</h4>
                  <TextArea
                    id="brand-voice"
                    labelText="Voz da Marca"
                    value={formData.brand_voice}
                    onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
                    rows={3}
                  />
                  <TextArea
                    id="brand-audience"
                    labelText="Público-Alvo"
                    value={formData.target_audience}
                    onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="form-section">
                  <h4>Redes Sociais</h4>
                  <div className="form-row">
                    <TextInput
                      id="brand-instagram"
                      labelText="Instagram"
                      value={formData.instagram_handle}
                      onChange={(e) => setFormData({ ...formData, instagram_handle: e.target.value })}
                      placeholder="@marca"
                    />
                    <TextInput
                      id="brand-facebook"
                      labelText="Facebook"
                      value={formData.facebook_page}
                      onChange={(e) => setFormData({ ...formData, facebook_page: e.target.value })}
                    />
                  </div>
                  <div className="form-row">
                    <TextInput
                      id="brand-linkedin"
                      labelText="LinkedIn"
                      value={formData.linkedin_page}
                      onChange={(e) => setFormData({ ...formData, linkedin_page: e.target.value })}
                    />
                    <TextInput
                      id="brand-twitter"
                      labelText="Twitter"
                      value={formData.twitter_handle}
                      onChange={(e) => setFormData({ ...formData, twitter_handle: e.target.value })}
                      placeholder="@marca"
                    />
                  </div>
                  <TextInput
                    id="brand-website"
                    labelText="Website"
                    value={formData.website_url}
                    onChange={(e) => setFormData({ ...formData, website_url: e.target.value })}
                    placeholder="https://marca.com.br"
                  />
                </div>

                <div className="form-actions">
                  <Button kind="primary" onClick={handleSave}>
                    Salvar Alterações
                  </Button>
                  <Button kind="secondary" onClick={() => loadBrandData()}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        onRequestSubmit={handleSave}
        modalHeading="Editar Marca"
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        size="md"
      >
        <div className="edit-form">
          <TextInput
            id="modal-name"
            labelText="Nome da Marca"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextInput
            id="modal-tagline"
            labelText="Tagline"
            value={formData.tagline}
            onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
          />
          <TextArea
            id="modal-voice"
            labelText="Voz da Marca"
            value={formData.brand_voice}
            onChange={(e) => setFormData({ ...formData, brand_voice: e.target.value })}
            rows={3}
          />
          <TextArea
            id="modal-audience"
            labelText="Público-Alvo"
            value={formData.target_audience}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
            rows={3}
          />
        </div>
      </Modal>
    </div>
  );
}
