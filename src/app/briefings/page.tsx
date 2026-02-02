'use client';

import { useEffect, useState } from 'react';
import {
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbarSearch,
  Button,
  Tag,
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Pagination,
  InlineLoading,
  Dropdown,
  OverflowMenu,
  OverflowMenuItem,
  ClickableTile,
  ContentSwitcher,
  Switch,
} from '@carbon/react';
import {
  Add,
  Edit,
  TrashCan,
  View,
  Download,
  DocumentTasks,
  Send,
  CheckmarkFilled,
  WarningFilled,
  Time,
  Calendar,
  UserMultiple,
  Folder,
  Document,
  Copy,
  Template,
  Grid as GridIcon,
  List,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';
import './briefings.scss';

interface Briefing {
  id: string;
  title: string;
  description: string | null;
  client_id: string;
  client_name?: string;
  project_id: string | null;
  project_title?: string | null;
  status: 'pending' | 'in_review' | 'approved' | 'rejected' | 'needs_revision';
  type: 'branding' | 'website' | 'social' | 'print' | 'video' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  due_date: string | null;
  created_at: string;
  responses: Record<string, string> | null;
}

interface Client {
  id: string;
  name: string;
}

interface Project {
  id: string;
  title: string;
  client_id: string;
}

const statusConfig = {
  pending: { label: 'Aguardando', type: 'blue' as const, icon: Time },
  in_review: { label: 'Em Análise', type: 'teal' as const, icon: View },
  approved: { label: 'Aprovado', type: 'green' as const, icon: CheckmarkFilled },
  rejected: { label: 'Rejeitado', type: 'red' as const, icon: WarningFilled },
  needs_revision: { label: 'Precisa Revisão', type: 'purple' as const, icon: Edit },
};

const typeConfig: Record<string, { label: string; color: string }> = {
  branding: { label: 'Branding', color: 'purple' },
  website: { label: 'Website', color: 'blue' },
  social: { label: 'Social Media', color: 'teal' },
  print: { label: 'Material Impresso', color: 'green' },
  video: { label: 'Vídeo', color: 'red' },
  other: { label: 'Outro', color: 'gray' },
};

const priorityConfig = {
  low: { label: 'Baixa', type: 'gray' as const },
  medium: { label: 'Média', type: 'blue' as const },
  high: { label: 'Alta', type: 'magenta' as const },
  urgent: { label: 'Urgente', type: 'red' as const },
};

const briefingTemplates = [
  {
    id: 'branding',
    title: 'Briefing de Branding',
    description: 'Identidade visual, logotipo e manual de marca',
    icon: Template,
    questions: ['Qual o nome da empresa?', 'Qual o segmento?', 'Quais os valores da marca?', 'Quem é o público-alvo?', 'Cores preferidas?', 'Referências visuais?'],
  },
  {
    id: 'website',
    title: 'Briefing de Website',
    description: 'Site institucional, e-commerce ou landing page',
    icon: Document,
    questions: ['Objetivo do site?', 'Quantas páginas?', 'Conteúdo pronto?', 'Precisa de CMS?', 'Funcionalidades desejadas?', 'Prazo desejado?'],
  },
  {
    id: 'social',
    title: 'Briefing Social Media',
    description: 'Gestão de redes sociais e conteúdo',
    icon: UserMultiple,
    questions: ['Quais redes sociais?', 'Frequência de posts?', 'Tom de comunicação?', 'Conteúdo existente?', 'Principais concorrentes?', 'Métricas a acompanhar?'],
  },
];

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'cards'>('cards');
  const [modalOpen, setModalOpen] = useState(false);
  const [templateModalOpen, setTemplateModalOpen] = useState(false);
  const [viewBriefingModal, setViewBriefingModal] = useState<Briefing | null>(null);
  const [editingBriefing, setEditingBriefing] = useState<Briefing | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(12);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    client_id: '',
    project_id: '',
    status: 'pending',
    type: 'branding',
    priority: 'medium',
    due_date: '',
    responses: {} as Record<string, string>,
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const supabase = createClient();
      
      const [briefingsRes, clientsRes, projectsRes] = await Promise.all([
        supabase.from('briefings').select(`*, clients (name), projects (title)`).order('created_at', { ascending: false }),
        supabase.from('clients').select('id, name').eq('status', 'active'),
        supabase.from('projects').select('id, title, client_id'),
      ]);

      if (briefingsRes.data) {
        const briefingsWithRelations = briefingsRes.data.map((b: { clients?: { name: string } | null; projects?: { title: string } | null } & Omit<Briefing, 'client_name' | 'project_title'>) => ({
          ...b,
          client_name: b.clients?.name || 'N/A',
          project_title: b.projects?.title || null,
        }));
        setBriefings(briefingsWithRelations);
      }
      
      if (clientsRes.data) setClients(clientsRes.data);
      if (projectsRes.data) setProjects(projectsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const data = {
        ...formData,
        project_id: formData.project_id || null,
        due_date: formData.due_date || null,
      };

      if (editingBriefing) {
        await supabase.from('briefings').update(data).eq('id', editingBriefing.id);
      } else {
        await supabase.from('briefings').insert([data]);
      }

      setModalOpen(false);
      setEditingBriefing(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving briefing:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este briefing?')) return;
    try {
      const supabase = createClient();
      await supabase.from('briefings').delete().eq('id', id);
      loadData();
    } catch (error) {
      console.error('Error deleting briefing:', error);
    }
  };

  const openEditModal = (briefing: Briefing) => {
    setEditingBriefing(briefing);
    setFormData({
      title: briefing.title,
      description: briefing.description || '',
      client_id: briefing.client_id,
      project_id: briefing.project_id || '',
      status: briefing.status,
      type: briefing.type,
      priority: briefing.priority,
      due_date: briefing.due_date || '',
      responses: briefing.responses || {},
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      client_id: '',
      project_id: '',
      status: 'pending',
      type: 'branding',
      priority: 'medium',
      due_date: '',
      responses: {},
    });
    setSelectedTemplate(null);
  };

  const handleTemplateSelect = (templateId: string) => {
    const template = briefingTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData(prev => ({ ...prev, type: templateId as Briefing['type'], title: template.title }));
      setSelectedTemplate(templateId);
      setTemplateModalOpen(false);
      setModalOpen(true);
    }
  };

  const filteredBriefings = briefings.filter(briefing => {
    const matchesSearch = briefing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (briefing.client_name && briefing.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || briefing.status === statusFilter;
    const matchesType = typeFilter === 'all' || briefing.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const paginatedBriefings = filteredBriefings.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const getDaysUntil = (date: string | null) => {
    if (!date) return null;
    const diff = new Date(date).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const getStats = () => {
    const total = briefings.length;
    const pending = briefings.filter(b => b.status === 'pending').length;
    const approved = briefings.filter(b => b.status === 'approved').length;
    const inReview = briefings.filter(b => b.status === 'in_review').length;
    return { total, pending, approved, inReview };
  };

  const stats = getStats();
  const filteredProjects = projects.filter(p => !formData.client_id || p.client_id === formData.client_id);

  return (
    <>
      <Header />
      
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title-group">
            <h1>Briefings</h1>
            <p>Gerencie briefings e questionários de projetos</p>
          </div>
          <div className="page-header__actions">
            <Button kind="tertiary" renderIcon={Download} size="md">Exportar</Button>
            <Button renderIcon={Add} onClick={() => setTemplateModalOpen(true)}>Novo Briefing</Button>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-mini-card"><span className="stat-mini-card__value">{stats.total}</span><span className="stat-mini-card__label">Total</span></div>
        <div className="stat-mini-card stat-mini-card--blue"><span className="stat-mini-card__value">{stats.pending}</span><span className="stat-mini-card__label">Aguardando</span></div>
        <div className="stat-mini-card stat-mini-card--teal"><span className="stat-mini-card__value">{stats.inReview}</span><span className="stat-mini-card__label">Em Análise</span></div>
        <div className="stat-mini-card stat-mini-card--green"><span className="stat-mini-card__value">{stats.approved}</span><span className="stat-mini-card__label">Aprovados</span></div>
      </div>

      <div className="filters-bar">
        <div className="filters-bar__search">
          <TableToolbarSearch placeholder="Buscar briefings..." onChange={(e) => setSearchTerm(typeof e === 'string' ? '' : e.target.value)} persistent />
        </div>
        <div className="filters-bar__filters">
          <Dropdown<{ id: string; text: string }> id="status-filter" titleText="" label="Status" items={[{ id: 'all', text: 'Todos' }, { id: 'pending', text: 'Aguardando' }, { id: 'in_review', text: 'Em Análise' }, { id: 'approved', text: 'Aprovados' }]} itemToString={(item) => item?.text || ''} onChange={({ selectedItem }) => setStatusFilter(selectedItem?.id || 'all')} size="md" />
          <Dropdown<{ id: string; text: string }> id="type-filter" titleText="" label="Tipo" items={[{ id: 'all', text: 'Todos' }, { id: 'branding', text: 'Branding' }, { id: 'website', text: 'Website' }, { id: 'social', text: 'Social Media' }]} itemToString={(item) => item?.text || ''} onChange={({ selectedItem }) => setTypeFilter(selectedItem?.id || 'all')} size="md" />
          <ContentSwitcher size="md" selectedIndex={viewMode === 'cards' ? 0 : 1} onChange={(e) => setViewMode((e.index || 0) === 0 ? 'cards' : 'list')}><Switch name="cards"><GridIcon size={16} /></Switch><Switch name="list"><List size={16} /></Switch></ContentSwitcher>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><InlineLoading description="Carregando briefings..." /></div>
      ) : filteredBriefings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state__icon"><DocumentTasks size={64} /></div>
          <h3 className="empty-state__title">Nenhum briefing encontrado</h3>
          <p className="empty-state__description">{searchTerm ? 'Tente ajustar sua busca' : 'Comece criando seu primeiro briefing'}</p>
          <Button renderIcon={Add} onClick={() => setTemplateModalOpen(true)}>Criar Briefing</Button>
        </div>
      ) : viewMode === 'cards' ? (
        <div className="briefings-grid">
          {paginatedBriefings.map((briefing) => {
            const StatusIcon = statusConfig[briefing.status].icon;
            const daysUntil = getDaysUntil(briefing.due_date);
            return (
              <div key={briefing.id} className="briefing-card">
                <div className="briefing-card__header">
                  <div className={`briefing-card__type briefing-card__type--${briefing.type}`}>{typeConfig[briefing.type]?.label || briefing.type}</div>
                  <OverflowMenu flipped size="sm" ariaLabel="Ações">
                    <OverflowMenuItem itemText="Ver detalhes" onClick={() => setViewBriefingModal(briefing)} />
                    <OverflowMenuItem itemText="Editar" onClick={() => openEditModal(briefing)} />
                    <OverflowMenuItem itemText="Duplicar" />
                    <OverflowMenuItem itemText="Excluir" isDelete onClick={() => handleDelete(briefing.id)} />
                  </OverflowMenu>
                </div>
                <div className="briefing-card__body">
                  <h3 className="briefing-card__title">{briefing.title}</h3>
                  <p className="briefing-card__client"><UserMultiple size={14} />{briefing.client_name}</p>
                  {briefing.project_title && <p className="briefing-card__project"><Folder size={14} />{briefing.project_title}</p>}
                  {briefing.description && <p className="briefing-card__description">{briefing.description}</p>}
                </div>
                <div className="briefing-card__footer">
                  <div className="briefing-card__tags">
                    <Tag type={statusConfig[briefing.status].type} size="sm"><StatusIcon size={12} />{statusConfig[briefing.status].label}</Tag>
                    <Tag type={priorityConfig[briefing.priority].type} size="sm">{priorityConfig[briefing.priority].label}</Tag>
                  </div>
                  {briefing.due_date && <div className={`briefing-card__due ${daysUntil && daysUntil <= 3 ? 'urgent' : ''}`}><Calendar size={12} />{daysUntil !== null && daysUntil <= 0 ? 'Atrasado' : `${daysUntil} dias`}</div>}
                </div>
                <div className="briefing-card__actions">
                  <Button kind="ghost" size="sm" onClick={() => setViewBriefingModal(briefing)}>Ver briefing</Button>
                  <Button kind="tertiary" size="sm" renderIcon={Send}>Enviar</Button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="content-card">
          <Table>
            <TableHead><TableRow><TableHeader>Título</TableHeader><TableHeader>Cliente</TableHeader><TableHeader>Tipo</TableHeader><TableHeader>Status</TableHeader><TableHeader>Prioridade</TableHeader><TableHeader>Data Limite</TableHeader><TableHeader></TableHeader></TableRow></TableHead>
            <TableBody>
              {paginatedBriefings.map((briefing) => (
                <TableRow key={briefing.id}>
                  <TableCell><strong>{briefing.title}</strong></TableCell>
                  <TableCell>{briefing.client_name}</TableCell>
                  <TableCell><Tag type="gray" size="sm">{typeConfig[briefing.type]?.label}</Tag></TableCell>
                  <TableCell><Tag type={statusConfig[briefing.status].type} size="sm">{statusConfig[briefing.status].label}</Tag></TableCell>
                  <TableCell><Tag type={priorityConfig[briefing.priority].type} size="sm">{priorityConfig[briefing.priority].label}</Tag></TableCell>
                  <TableCell>{briefing.due_date ? new Date(briefing.due_date).toLocaleDateString('pt-BR') : '-'}</TableCell>
                  <TableCell><OverflowMenu flipped size="sm" ariaLabel="Ações"><OverflowMenuItem itemText="Ver" onClick={() => setViewBriefingModal(briefing)} /><OverflowMenuItem itemText="Editar" onClick={() => openEditModal(briefing)} /><OverflowMenuItem itemText="Excluir" isDelete onClick={() => handleDelete(briefing.id)} /></OverflowMenu></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {filteredBriefings.length > pageSize && (
        <Pagination totalItems={filteredBriefings.length} pageSize={pageSize} page={currentPage} pageSizes={[12, 24, 48]} onChange={({ page, pageSize }) => { setCurrentPage(page); setPageSize(pageSize); }} itemsPerPageText="Itens:" pageRangeText={(c, t) => `de ${t}`} itemRangeText={(min, max, t) => `${min}–${max} de ${t}`} />
      )}

      <Modal open={templateModalOpen} onRequestClose={() => setTemplateModalOpen(false)} modalHeading="Escolha um template" passiveModal size="lg">
        <p style={{ marginBottom: '1.5rem', color: 'var(--cds-text-secondary)' }}>Selecione um template para criar seu briefing.</p>
        <div className="template-grid">
          {briefingTemplates.map((template) => (
            <ClickableTile key={template.id} className="template-tile" onClick={() => handleTemplateSelect(template.id)}>
              <div className="template-tile__icon"><template.icon size={32} /></div>
              <h4>{template.title}</h4>
              <p>{template.description}</p>
              <span className="template-tile__questions">{template.questions.length} perguntas</span>
            </ClickableTile>
          ))}
          <ClickableTile className="template-tile template-tile--blank" onClick={() => { resetForm(); setTemplateModalOpen(false); setModalOpen(true); }}>
            <div className="template-tile__icon"><Add size={32} /></div>
            <h4>Briefing em Branco</h4>
            <p>Crie do zero</p>
          </ClickableTile>
        </div>
      </Modal>

      <Modal open={modalOpen} onRequestClose={() => { setModalOpen(false); setEditingBriefing(null); resetForm(); }} onRequestSubmit={handleSave} modalHeading={editingBriefing ? 'Editar Briefing' : 'Novo Briefing'} primaryButtonText="Salvar" secondaryButtonText="Cancelar" size="lg">
        <div className="modal-form">
          <div className="form-row"><TextInput id="title" labelText="Título *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required /></div>
          <div className="form-row form-row--split">
            <Select id="client" labelText="Cliente *" value={formData.client_id} onChange={(e) => setFormData({ ...formData, client_id: e.target.value, project_id: '' })}><SelectItem value="" text="Selecione" />{clients.map((c) => (<SelectItem key={c.id} value={c.id} text={c.name} />))}</Select>
            <Select id="project" labelText="Projeto" value={formData.project_id} onChange={(e) => setFormData({ ...formData, project_id: e.target.value })} disabled={!formData.client_id}><SelectItem value="" text="Selecione" />{filteredProjects.map((p) => (<SelectItem key={p.id} value={p.id} text={p.title} />))}</Select>
          </div>
          <div className="form-row"><TextArea id="description" labelText="Descrição" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={3} /></div>
          <div className="form-row form-row--split">
            <Select id="type" labelText="Tipo" value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as Briefing['type'] })}><SelectItem value="branding" text="Branding" /><SelectItem value="website" text="Website" /><SelectItem value="social" text="Social Media" /><SelectItem value="print" text="Impresso" /><SelectItem value="video" text="Vídeo" /><SelectItem value="other" text="Outro" /></Select>
            <Select id="priority" labelText="Prioridade" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as Briefing['priority'] })}><SelectItem value="low" text="Baixa" /><SelectItem value="medium" text="Média" /><SelectItem value="high" text="Alta" /><SelectItem value="urgent" text="Urgente" /></Select>
          </div>
          <div className="form-row form-row--split">
            <Select id="status" labelText="Status" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as Briefing['status'] })}><SelectItem value="pending" text="Aguardando" /><SelectItem value="in_review" text="Em Análise" /><SelectItem value="approved" text="Aprovado" /><SelectItem value="rejected" text="Rejeitado" /></Select>
            <TextInput id="due_date" labelText="Data Limite" type="date" value={formData.due_date} onChange={(e) => setFormData({ ...formData, due_date: e.target.value })} />
          </div>
          {selectedTemplate && (
            <div className="form-section">
              <h4>Perguntas do Briefing</h4>
              {briefingTemplates.find(t => t.id === selectedTemplate)?.questions.map((q, i) => (
                <TextArea key={i} id={`q-${i}`} labelText={q} value={formData.responses[`q${i}`] || ''} onChange={(e) => setFormData({ ...formData, responses: { ...formData.responses, [`q${i}`]: e.target.value } })} rows={2} />
              ))}
            </div>
          )}
        </div>
      </Modal>

      <Modal open={!!viewBriefingModal} onRequestClose={() => setViewBriefingModal(null)} modalHeading={viewBriefingModal?.title || ''} passiveModal size="lg">
        {viewBriefingModal && (
          <div className="briefing-view">
            <div className="briefing-view__meta">
              <Tag type={statusConfig[viewBriefingModal.status].type}>{statusConfig[viewBriefingModal.status].label}</Tag>
              <Tag type="gray">{typeConfig[viewBriefingModal.type]?.label}</Tag>
              <Tag type={priorityConfig[viewBriefingModal.priority].type}>{priorityConfig[viewBriefingModal.priority].label}</Tag>
            </div>
            <div className="briefing-view__info">
              <div><strong>Cliente:</strong> {viewBriefingModal.client_name}</div>
              {viewBriefingModal.project_title && <div><strong>Projeto:</strong> {viewBriefingModal.project_title}</div>}
              {viewBriefingModal.due_date && <div><strong>Prazo:</strong> {new Date(viewBriefingModal.due_date).toLocaleDateString('pt-BR')}</div>}
            </div>
            {viewBriefingModal.description && <div className="briefing-view__description"><h4>Descrição</h4><p>{viewBriefingModal.description}</p></div>}
            <div className="briefing-view__actions">
              <Button kind="tertiary" renderIcon={Copy}>Duplicar</Button>
              <Button kind="tertiary" renderIcon={Download}>Exportar</Button>
              <Button kind="primary" renderIcon={Send}>Enviar</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
