'use client';

import { useEffect, useState, useMemo, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
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
  OverflowMenu,
  OverflowMenuItem,
  Modal,
  TextInput,
  TextArea,
  Pagination,
  InlineLoading,
  Dropdown,
  Tile,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  Add,
  Edit,
  TrashCan,
  View,
  Renew,
  Download,
  Store,
  CheckmarkFilled,
  WarningFilled,
  Hashtag,
  ColorPalette,
  LogoInstagram,
  LogoFacebook,
  LogoLinkedin,
  Catalog,
  ChartBubble,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type {
  Brand,
  BrandFormData,
} from '@/types/database';
import './brands.scss';

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
// Helper: cor de fundo baseada no nome
// ============================================
function getAvatarColor(name: string): string {
  const colors = [
    '#0f62fe', '#6929c4', '#1192e8', '#005d5d', '#9f1853',
    '#fa4d56', '#570408', '#198038', '#002d9c', '#ee5396',
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// ============================================
// Stats interface
// ============================================
interface BrandStats {
  total: number;
  active: number;
  inactive: number;
  totalPosts: number;
}

// ============================================
// Main Component
// ============================================
function BrandsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [brands, setBrands] = useState<(Brand & { total_posts?: number })[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [brandToDelete, setBrandToDelete] = useState<Brand | null>(null);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const [formData, setFormData] = useState<BrandFormData>({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    logo_url: '',
    primary_color: '#0f62fe',
    secondary_color: '#6929c4',
    font_family: '',
    brand_voice: '',
    target_audience: '',
    keywords: [],
    language: 'pt-BR',
    instagram_handle: '',
    facebook_page: '',
    linkedin_page: '',
    twitter_handle: '',
    tiktok_handle: '',
    website_url: '',
  });

  const [keywordsInput, setKeywordsInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Auto-open modal from URL
  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      resetForm();
      setEditingBrand(null);
      setModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    loadBrands();
  }, []);

  // ============================================
  // Data Loading
  // ============================================
  const loadBrands = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((brand) => ({
        ...brand,
        keywords: brand.keywords || [],
        total_posts: 0, // will be enriched via separate query
      }));

      setBrands(enriched);
    } catch (error) {
      console.error('Error loading brands:', error);
      // Mock data for development
      setBrands([
        {
          id: '1',
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
          total_posts: 45,
        },
        {
          id: '2',
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
          total_posts: 78,
        },
        {
          id: '3',
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
          total_posts: 32,
        },
        {
          id: '4',
          organization_id: 'org-1',
          client_id: 'user-4',
          name: 'Startup Labs',
          slug: 'startup-labs',
          tagline: 'Acelerando o futuro',
          description: 'Aceleradora de startups',
          logo_url: null,
          primary_color: '#6929c4',
          secondary_color: '#1192e8',
          font_family: null,
          brand_voice: 'Ousado e disruptivo',
          target_audience: 'Empreendedores e investidores',
          keywords: ['startup', 'investimento', 'inovação'],
          language: 'pt-BR',
          instagram_handle: '@startuplabs',
          facebook_page: null,
          linkedin_page: 'startup-labs',
          twitter_handle: '@startuplabs',
          tiktok_handle: null,
          website_url: 'https://startuplabs.vc',
          settings: {},
          is_active: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          total_posts: 12,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // ============================================
  // CRUD Operations
  // ============================================
  const handleSave = async () => {
    try {
      const supabase = createClient();
      const payload = {
        ...formData,
        keywords: keywordsInput
          .split(',')
          .map((k) => k.trim())
          .filter(Boolean),
      };

      if (editingBrand) {
        const { error } = await supabase
          .from('brands')
          .update(payload)
          .eq('id', editingBrand.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brands')
          .insert([payload]);
        if (error) throw error;
      }

      setModalOpen(false);
      setEditingBrand(null);
      resetForm();
      loadBrands();
    } catch (error) {
      console.error('Error saving brand:', error);
    }
  };

  const handleDelete = async () => {
    if (!brandToDelete) return;
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', brandToDelete.id);
      if (error) throw error;
      setDeleteModalOpen(false);
      setBrandToDelete(null);
      loadBrands();
    } catch (error) {
      console.error('Error deleting brand:', error);
    }
  };

  const openEditModal = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.name,
      slug: brand.slug,
      tagline: brand.tagline || '',
      description: brand.description || '',
      logo_url: brand.logo_url || '',
      primary_color: brand.primary_color || '#0f62fe',
      secondary_color: brand.secondary_color || '#6929c4',
      font_family: brand.font_family || '',
      brand_voice: brand.brand_voice || '',
      target_audience: brand.target_audience || '',
      keywords: brand.keywords || [],
      language: brand.language || 'pt-BR',
      instagram_handle: brand.instagram_handle || '',
      facebook_page: brand.facebook_page || '',
      linkedin_page: brand.linkedin_page || '',
      twitter_handle: brand.twitter_handle || '',
      tiktok_handle: brand.tiktok_handle || '',
      website_url: brand.website_url || '',
    });
    setKeywordsInput((brand.keywords || []).join(', '));
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      tagline: '',
      description: '',
      logo_url: '',
      primary_color: '#0f62fe',
      secondary_color: '#6929c4',
      font_family: '',
      brand_voice: '',
      target_audience: '',
      keywords: [],
      language: 'pt-BR',
      instagram_handle: '',
      facebook_page: '',
      linkedin_page: '',
      twitter_handle: '',
      tiktok_handle: '',
      website_url: '',
    });
    setKeywordsInput('');
  };

  const handleSort = (key: string) => {
    setSortConfig((prev) => {
      if (prev?.key === key) {
        return { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key, direction: 'asc' };
    });
  };

  // Auto-generate slug from name
  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      name: value,
      slug: !editingBrand
        ? value
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')
        : prev.slug,
    }));
  };

  // ============================================
  // Computed Values
  // ============================================
  const stats: BrandStats = useMemo(() => ({
    total: brands.length,
    active: brands.filter((b) => b.is_active).length,
    inactive: brands.filter((b) => !b.is_active).length,
    totalPosts: brands.reduce((sum, b) => sum + (b.total_posts || 0), 0),
  }), [brands]);

  const filteredBrands = useMemo(() => {
    let result = brands.filter((brand) => {
      const matchesSearch =
        brand.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (brand.tagline && brand.tagline.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (brand.keywords || []).some((k) => k.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && brand.is_active) ||
        (statusFilter === 'inactive' && !brand.is_active);
      return matchesSearch && matchesStatus;
    });

    if (sortConfig) {
      result.sort((a, b) => {
        const aVal = (a as any)[sortConfig.key] ?? '';
        const bVal = (b as any)[sortConfig.key] ?? '';
        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [brands, searchTerm, statusFilter, sortConfig]);

  const paginatedBrands = filteredBrands.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // ============================================
  // Table Config
  // ============================================
  const headers = [
    { key: 'name', header: 'Marca', isSortable: true },
    { key: 'keywords', header: 'Palavras-chave', isSortable: false },
    { key: 'social', header: 'Redes Sociais', isSortable: false },
    { key: 'total_posts', header: 'Posts', isSortable: true },
    { key: 'is_active', header: 'Status', isSortable: true },
    { key: 'actions', header: '', isSortable: false },
  ];

  const rows = paginatedBrands.map((brand) => ({
    ...brand,
  }));

  // ============================================
  // Render
  // ============================================
  return (
    <div className="brands-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__content">
          <h1>Marcas</h1>
          <p>Gerencie as marcas dos seus clientes</p>
        </div>
        <div className="page-header__actions">
          <Button kind="ghost" size="md" renderIcon={Renew} onClick={loadBrands} hasIconOnly iconDescription="Atualizar" />
          <Button kind="tertiary" renderIcon={Download} size="md">
            Exportar
          </Button>
          <Button
            renderIcon={Add}
            onClick={() => {
              resetForm();
              setEditingBrand(null);
              setModalOpen(true);
            }}
          >
            Nova Marca
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="brands-stats">
        <Tile className="stat-tile">
          <Store size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.total}</span>
            <span className="stat-tile__label">Total de Marcas</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--green">
          <CheckmarkFilled size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.active}</span>
            <span className="stat-tile__label">Marcas Ativas</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--blue">
          <Catalog size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{stats.totalPosts}</span>
            <span className="stat-tile__label">Posts Totais</span>
          </div>
        </Tile>
        <Tile className="stat-tile stat-tile--purple">
          <ChartBubble size={24} />
          <div className="stat-tile__content">
            <span className="stat-tile__value">{brands.reduce((sum, b) => sum + (b.keywords?.length || 0), 0)}</span>
            <span className="stat-tile__label">Palavras-chave</span>
          </div>
        </Tile>
      </div>

      {/* Data Table */}
      <div className="brands-table-container">
        <DataTable rows={rows} headers={headers} isSortable>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getSelectionProps,
            getToolbarProps,
            getBatchActionProps,
            getTableProps,
            getTableContainerProps,
          }) => {
            const batchActionProps = getBatchActionProps();

            return (
              <TableContainer {...getTableContainerProps()}>
                <TableToolbar {...getToolbarProps()}>
                  <TableBatchActions {...batchActionProps}>
                    <TableBatchAction
                      tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                      renderIcon={TrashCan}
                      onClick={() => {}}
                    >
                      Excluir
                    </TableBatchAction>
                    <TableBatchAction
                      tabIndex={batchActionProps.shouldShowBatchActions ? 0 : -1}
                      renderIcon={Download}
                      onClick={() => {}}
                    >
                      Exportar
                    </TableBatchAction>
                  </TableBatchActions>
                  <TableToolbarContent>
                    <TableToolbarSearch
                      placeholder="Buscar marcas..."
                      onChange={(e: any) => setSearchTerm(e.target?.value || '')}
                      persistent
                    />
                    <Dropdown
                      id="status-filter"
                      titleText=""
                      label="Status"
                      size="md"
                      items={[
                        { id: 'all', text: 'Todos' },
                        { id: 'active', text: 'Ativas' },
                        { id: 'inactive', text: 'Inativas' },
                      ]}
                      itemToString={(item: any) => item?.text || ''}
                      onChange={({ selectedItem }: any) =>
                        setStatusFilter(selectedItem?.id || 'all')
                      }
                    />
                  </TableToolbarContent>
                </TableToolbar>

                {loading ? (
                  <div className="table-loading">
                    <InlineLoading description="Carregando marcas..." />
                  </div>
                ) : filteredBrands.length === 0 ? (
                  <div className="table-empty">
                    <Store size={48} />
                    <h3>Nenhuma marca encontrada</h3>
                    <p>
                      {searchTerm
                        ? 'Tente ajustar sua busca'
                        : 'Comece adicionando a primeira marca'}
                    </p>
                    <Button renderIcon={Add} onClick={() => setModalOpen(true)}>
                      Adicionar Marca
                    </Button>
                  </div>
                ) : (
                  <>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          <TableSelectAll {...getSelectionProps()} />
                          {headers.map((header: any, idx: number) => {
                            const headerProps = getHeaderProps({ header });
                            return (
                              <TableHeader
                                {...headerProps}
                                key={headerProps.key || `header-${idx}`}
                                isSortable={header.isSortable}
                                onClick={() => header.isSortable && handleSort(header.key)}
                                sortDirection={
                                  sortConfig && sortConfig.key === header.key
                                    ? sortConfig.direction === 'asc'
                                      ? 'ASC'
                                      : 'DESC'
                                    : 'NONE'
                                }
                              >
                                {header.header}
                              </TableHeader>
                            );
                          })}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => {
                          const brand = paginatedBrands.find((b) => b.id === row.id)!;
                          const rowProps = getRowProps({ row });

                          return (
                            <TableRow {...rowProps} key={rowProps.key || row.id}>
                              <TableSelectRow {...getSelectionProps({ row })} />

                              {/* Brand Name + Avatar */}
                              <TableCell>
                                <div className="brand-cell">
                                  <div
                                    className="brand-cell__avatar"
                                    style={{ background: brand.primary_color || getAvatarColor(brand.name) }}
                                  >
                                    {brand.logo_url ? (
                                      <img src={brand.logo_url} alt={brand.name} />
                                    ) : (
                                      getInitials(brand.name)
                                    )}
                                  </div>
                                  <div className="brand-cell__info">
                                    <Link href={`/brands/${brand.id}`} className="brand-name-link">
                                      <span className="brand-name">{brand.name}</span>
                                    </Link>
                                    {brand.tagline && (
                                      <span className="brand-tagline">{brand.tagline}</span>
                                    )}
                                  </div>
                                </div>
                              </TableCell>

                              {/* Keywords */}
                              <TableCell>
                                <div className="keyword-tags">
                                  {(brand.keywords || []).slice(0, 3).map((kw) => (
                                    <Tag key={kw} type="cool-gray" size="sm">
                                      {kw}
                                    </Tag>
                                  ))}
                                  {(brand.keywords || []).length > 3 && (
                                    <Tag type="outline" size="sm">
                                      +{brand.keywords.length - 3}
                                    </Tag>
                                  )}
                                </div>
                              </TableCell>

                              {/* Social Handles */}
                              <TableCell>
                                <div className="social-handles">
                                  {brand.instagram_handle && (
                                    <LogoInstagram size={16} title={brand.instagram_handle} />
                                  )}
                                  {brand.facebook_page && (
                                    <LogoFacebook size={16} title={brand.facebook_page} />
                                  )}
                                  {brand.linkedin_page && (
                                    <LogoLinkedin size={16} title={brand.linkedin_page} />
                                  )}
                                </div>
                              </TableCell>

                              {/* Posts Count */}
                              <TableCell>
                                <span className="posts-count">{brand.total_posts || 0}</span>
                              </TableCell>

                              {/* Status */}
                              <TableCell>
                                <Tag
                                  type={brand.is_active ? 'green' : 'gray'}
                                  size="sm"
                                >
                                  {brand.is_active ? 'Ativa' : 'Inativa'}
                                </Tag>
                              </TableCell>

                              {/* Actions */}
                              <TableCell>
                                <OverflowMenu flipped size="sm" ariaLabel="Ações">
                                  <OverflowMenuItem
                                    itemText="Ver detalhes"
                                    onClick={() => router.push(`/brands/${brand.id}`)}
                                  />
                                  <OverflowMenuItem
                                    itemText="Editar"
                                    onClick={() => openEditModal(brand)}
                                  />
                                  <OverflowMenuItem
                                    itemText="Novo post"
                                    onClick={() =>
                                      router.push(`/posts?new=true&brand_id=${brand.id}`)
                                    }
                                  />
                                  <OverflowMenuItem
                                    itemText="Excluir"
                                    isDelete
                                    onClick={() => {
                                      setBrandToDelete(brand);
                                      setDeleteModalOpen(true);
                                    }}
                                  />
                                </OverflowMenu>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>

                    <Pagination
                      totalItems={filteredBrands.length}
                      pageSize={pageSize}
                      page={currentPage}
                      pageSizes={[10, 20, 50]}
                      onChange={({
                        page,
                        pageSize,
                      }: {
                        page: number;
                        pageSize: number;
                      }) => {
                        setCurrentPage(page);
                        setPageSize(pageSize);
                      }}
                      itemsPerPageText="Itens por página:"
                      pageRangeText={(_current: number, total: number) =>
                        `de ${total} páginas`
                      }
                      itemRangeText={(min: number, max: number, total: number) =>
                        `${min}–${max} de ${total} itens`
                      }
                    />
                  </>
                )}
              </TableContainer>
            );
          }}
        </DataTable>
      </div>

      {/* ============================================ */}
      {/* Add/Edit Brand Modal */}
      {/* ============================================ */}
      <Modal
        open={modalOpen}
        onRequestClose={() => {
          setModalOpen(false);
          setEditingBrand(null);
          resetForm();
        }}
        onRequestSubmit={handleSave}
        modalHeading={editingBrand ? 'Editar Marca' : 'Nova Marca'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        size="lg"
      >
        <div className="brand-form">
          <Tabs>
            <TabList aria-label="Brand form tabs">
              <Tab>Identidade</Tab>
              <Tab>Voz & Tom</Tab>
              <Tab>Redes Sociais</Tab>
            </TabList>
            <TabPanels>
              {/* Tab: Identity */}
              <TabPanel>
                <div className="brand-form" style={{ paddingTop: '1rem' }}>
                  <div className="brand-form__row">
                    <TextInput
                      id="brand-name"
                      labelText="Nome da Marca *"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      required
                    />
                    <TextInput
                      id="brand-slug"
                      labelText="Slug"
                      value={formData.slug}
                      onChange={(e) =>
                        setFormData({ ...formData, slug: e.target.value })
                      }
                      helperText="Identificador único (URL-friendly)"
                    />
                  </div>

                  <TextInput
                    id="brand-tagline"
                    labelText="Tagline"
                    value={formData.tagline}
                    onChange={(e) =>
                      setFormData({ ...formData, tagline: e.target.value })
                    }
                    placeholder="Ex: Inovação que transforma"
                  />

                  <TextArea
                    id="brand-description"
                    labelText="Descrição"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />

                  <div className="brand-form__section">
                    <h4>Identidade Visual</h4>
                    <div className="brand-form__row">
                      <div className="brand-form__color-row">
                        <TextInput
                          id="brand-primary-color"
                          labelText="Cor Primária"
                          value={formData.primary_color}
                          onChange={(e) =>
                            setFormData({ ...formData, primary_color: e.target.value })
                          }
                          placeholder="#0f62fe"
                        />
                        <div
                          className="color-preview"
                          style={{ background: formData.primary_color }}
                        />
                      </div>
                      <div className="brand-form__color-row">
                        <TextInput
                          id="brand-secondary-color"
                          labelText="Cor Secundária"
                          value={formData.secondary_color}
                          onChange={(e) =>
                            setFormData({ ...formData, secondary_color: e.target.value })
                          }
                          placeholder="#6929c4"
                        />
                        <div
                          className="color-preview"
                          style={{ background: formData.secondary_color }}
                        />
                      </div>
                    </div>
                    <TextInput
                      id="brand-font"
                      labelText="Família Tipográfica"
                      value={formData.font_family}
                      onChange={(e) =>
                        setFormData({ ...formData, font_family: e.target.value })
                      }
                      placeholder="Ex: IBM Plex Sans"
                    />
                  </div>
                </div>
              </TabPanel>

              {/* Tab: Voice & Tone */}
              <TabPanel>
                <div className="brand-form" style={{ paddingTop: '1rem' }}>
                  <TextArea
                    id="brand-voice"
                    labelText="Voz da Marca"
                    value={formData.brand_voice}
                    onChange={(e) =>
                      setFormData({ ...formData, brand_voice: e.target.value })
                    }
                    rows={3}
                    placeholder="Descreva o tom e a personalidade da marca"
                  />

                  <TextArea
                    id="brand-audience"
                    labelText="Público-alvo"
                    value={formData.target_audience}
                    onChange={(e) =>
                      setFormData({ ...formData, target_audience: e.target.value })
                    }
                    rows={3}
                    placeholder="Quem é o público da marca?"
                  />

                  <TextInput
                    id="brand-keywords"
                    labelText="Palavras-chave"
                    value={keywordsInput}
                    onChange={(e) => setKeywordsInput(e.target.value)}
                    helperText="Separe por vírgula: tecnologia, inovação, software"
                    placeholder="palavra1, palavra2, palavra3"
                  />

                  <Dropdown
                    id="brand-language"
                    titleText="Idioma Principal"
                    label="Selecionar idioma"
                    items={[
                      { id: 'pt-BR', text: 'Português (Brasil)' },
                      { id: 'en-US', text: 'English (US)' },
                      { id: 'es', text: 'Español' },
                    ]}
                    itemToString={(item: any) => item?.text || ''}
                    selectedItem={{ id: formData.language, text: formData.language === 'pt-BR' ? 'Português (Brasil)' : formData.language === 'en-US' ? 'English (US)' : 'Español' }}
                    onChange={({ selectedItem }: any) =>
                      setFormData({ ...formData, language: selectedItem?.id || 'pt-BR' })
                    }
                  />
                </div>
              </TabPanel>

              {/* Tab: Social Media */}
              <TabPanel>
                <div className="brand-form" style={{ paddingTop: '1rem' }}>
                  <div className="brand-form__row">
                    <TextInput
                      id="brand-instagram"
                      labelText="Instagram"
                      value={formData.instagram_handle}
                      onChange={(e) =>
                        setFormData({ ...formData, instagram_handle: e.target.value })
                      }
                      placeholder="@marca"
                    />
                    <TextInput
                      id="brand-facebook"
                      labelText="Facebook"
                      value={formData.facebook_page}
                      onChange={(e) =>
                        setFormData({ ...formData, facebook_page: e.target.value })
                      }
                      placeholder="nome-da-pagina"
                    />
                  </div>
                  <div className="brand-form__row">
                    <TextInput
                      id="brand-linkedin"
                      labelText="LinkedIn"
                      value={formData.linkedin_page}
                      onChange={(e) =>
                        setFormData({ ...formData, linkedin_page: e.target.value })
                      }
                      placeholder="nome-da-empresa"
                    />
                    <TextInput
                      id="brand-twitter"
                      labelText="Twitter/X"
                      value={formData.twitter_handle}
                      onChange={(e) =>
                        setFormData({ ...formData, twitter_handle: e.target.value })
                      }
                      placeholder="@marca"
                    />
                  </div>
                  <div className="brand-form__row">
                    <TextInput
                      id="brand-tiktok"
                      labelText="TikTok"
                      value={formData.tiktok_handle}
                      onChange={(e) =>
                        setFormData({ ...formData, tiktok_handle: e.target.value })
                      }
                      placeholder="@marca"
                    />
                    <TextInput
                      id="brand-website"
                      labelText="Website"
                      value={formData.website_url}
                      onChange={(e) =>
                        setFormData({ ...formData, website_url: e.target.value })
                      }
                      placeholder="https://marca.com.br"
                    />
                  </div>
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onRequestClose={() => {
          setDeleteModalOpen(false);
          setBrandToDelete(null);
        }}
        onRequestSubmit={handleDelete}
        modalHeading="Excluir Marca"
        primaryButtonText="Excluir"
        secondaryButtonText="Cancelar"
        danger
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir <strong>{brandToDelete?.name}</strong>?
          Todos os posts e assets associados serão removidos. Esta ação não pode
          ser desfeita.
        </p>
      </Modal>
    </div>
  );
}

export default function BrandsPage() {
  return (
    <Suspense
      fallback={
        <div className="table-loading">
          <InlineLoading description="Carregando marcas..." />
        </div>
      }
    >
      <BrandsContent />
    </Suspense>
  );
}
