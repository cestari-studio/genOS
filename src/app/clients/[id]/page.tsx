'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Grid,
  Column,
  Breadcrumb,
  BreadcrumbItem,
  Tile,
  ClickableTile,
  Button,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  SkeletonText,
  SkeletonPlaceholder,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Modal,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  IconButton,
  ProgressBar,
  OverflowMenu,
  OverflowMenuItem,
  InlineNotification,
} from '@carbon/react';
import {
  ArrowLeft,
  Edit,
  TrashCan,
  Email,
  Phone,
  Building,
  Calendar,
  Document,
  Folder,
  Add,
  Launch,
  Star,
  StarFilled,
  Chat,
  Money,
  CheckmarkFilled,
  WarningFilled,
  Time,
  Activity,
  ChartLine,
  UserAvatar,
  Copy,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import './client-detail.scss';

interface Client {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  status: string;
  created_at: string;
  notes: string | null;
}

interface Project {
  id: string;
  name: string;
  status: string;
  progress: number;
  deadline: string | null;
  created_at: string;
}

interface ActivityLog {
  id: string;
  type: string;
  description: string;
  timestamp: string;
}

export default function ClientDetailPage() {
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  
  const [client, setClient] = useState<Client | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [starred, setStarred] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    status: '',
    notes: '',
  });

  useEffect(() => {
    loadClientData();
  }, [clientId]);

  const loadClientData = async () => {
    try {
      const supabase = createClient();
      
      // Load client
      const { data: clientData, error: clientError } = await supabase
        .from('clients')
        .select('*')
        .eq('id', clientId)
        .single();

      if (clientError) throw clientError;
      setClient(clientData);
      setFormData({
        name: clientData.name,
        email: clientData.email || '',
        phone: clientData.phone || '',
        company: clientData.company || '',
        status: clientData.status,
        notes: clientData.notes || '',
      });

      // Load projects
      const { data: projectsData } = await supabase
        .from('projects')
        .select('*')
        .eq('client_id', clientId)
        .order('created_at', { ascending: false });
      
      setProjects(projectsData || []);

      // Load activities from audit_log
      const { data: activityData } = await supabase
        .from('audit_log')
        .select('*')
        .eq('entity_id', clientId)
        .order('created_at', { ascending: false })
        .limit(20);

      if (activityData && activityData.length > 0) {
        setActivities(activityData.map((a: { id: string; entity_type: string; action: string; created_at: string }) => ({
          id: a.id,
          type: a.entity_type || 'client',
          description: a.action || 'Ação registrada',
          timestamp: a.created_at,
        })));
      } else {
        setActivities([]);
      }

    } catch (error) {
      console.error('Error loading client:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('clients')
        .update(formData)
        .eq('id', clientId);

      if (error) throw error;
      
      setEditModalOpen(false);
      loadClientData();
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.')) return;
    
    try {
      const supabase = createClient();
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', clientId);

      if (error) throw error;
      router.push('/clients');
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const getStatusConfig = (status: string) => {
    const configs: Record<string, { type: 'green' | 'blue' | 'gray' | 'red'; text: string; icon: JSX.Element }> = {
      active: { type: 'green', text: 'Ativo', icon: <CheckmarkFilled size={12} /> },
      prospect: { type: 'blue', text: 'Prospect', icon: <Star size={12} /> },
      inactive: { type: 'gray', text: 'Inativo', icon: <Time size={12} /> },
      cancelled: { type: 'red', text: 'Cancelado', icon: <WarningFilled size={12} /> },
    };
    return configs[status] || { type: 'gray', text: status, icon: null };
  };

  const getProjectStatusConfig = (status: string) => {
    const configs: Record<string, { type: 'green' | 'blue' | 'purple' | 'gray' | 'cyan'; text: string }> = {
      completed: { type: 'green', text: 'Concluído' },
      in_progress: { type: 'blue', text: 'Em Andamento' },
      review: { type: 'purple', text: 'Em Revisão' },
      on_hold: { type: 'gray', text: 'Pausado' },
      planning: { type: 'cyan', text: 'Planejamento' },
    };
    return configs[status] || { type: 'gray', text: status };
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const clientStats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'in_progress').length,
    completedProjects: projects.filter(p => p.status === 'completed').length,
    totalRevenue: 0,
    avgProjectValue: 0,
  };

  if (loading) {
    return (
      <>
        <div className="client-detail">
          <div className="client-detail__loading">
            <SkeletonPlaceholder style={{ width: '100%', height: '200px' }} />
            <SkeletonText heading width="60%" />
            <SkeletonText paragraph lineCount={3} />
          </div>
        </div>
      </>
    );
  }

  if (!client) {
    return (
      <>
        <div className="client-detail">
          <InlineNotification
            kind="error"
            title="Cliente não encontrado"
            subtitle="O cliente solicitado não existe ou foi removido."
          />
          <Button kind="tertiary" onClick={() => router.push('/clients')}>
            Voltar para Clientes
          </Button>
        </div>
      </>
    );
  }

  const statusConfig = getStatusConfig(client.status);

  return (
    <>
      <div className="client-detail">
        {/* Breadcrumb */}
        <Breadcrumb noTrailingSlash className="client-detail__breadcrumb">
          <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
          <BreadcrumbItem href="/clients">Clientes</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{client.name}</BreadcrumbItem>
        </Breadcrumb>

        {/* Header Section */}
        <div className="client-detail__header">
          <div className="client-detail__header-main">
            <div className="client-detail__avatar">
              {client.name.charAt(0).toUpperCase()}
            </div>
            
            <div className="client-detail__info">
              <div className="client-detail__title-row">
                <h1>{client.name}</h1>
                <IconButton
                  kind="ghost"
                  label={starred ? 'Remover favorito' : 'Adicionar favorito'}
                  onClick={() => setStarred(!starred)}
                >
                  {starred ? <StarFilled size={20} /> : <Star size={20} />}
                </IconButton>
              </div>
              
              {client.company && (
                <p className="client-detail__company">
                  <Building size={16} />
                  {client.company}
                </p>
              )}
              
              <div className="client-detail__meta">
                <Tag type={statusConfig.type} renderIcon={() => statusConfig.icon}>
                  {statusConfig.text}
                </Tag>
                <span className="client-detail__date">
                  <Calendar size={14} />
                  Cliente desde {formatDate(client.created_at)}
                </span>
              </div>
            </div>
          </div>

          <div className="client-detail__actions">
            <Button kind="ghost" renderIcon={Chat} size="md">
              Enviar Mensagem
            </Button>
            <Button kind="tertiary" renderIcon={Edit} size="md" onClick={() => setEditModalOpen(true)}>
              Editar
            </Button>
            <OverflowMenu flipped size="md" ariaLabel="Mais ações">
              <OverflowMenuItem itemText="Ver histórico" />
              <OverflowMenuItem itemText="Exportar dados" />
              <OverflowMenuItem itemText="Arquivar cliente" />
              <OverflowMenuItem 
                itemText="Excluir cliente" 
                isDelete 
                onClick={handleDelete}
              />
            </OverflowMenu>
          </div>
        </div>

        {/* Contact Bar */}
        <div className="client-detail__contact-bar">
          {client.email && (
            <a href={`mailto:${client.email}`} className="contact-item">
              <Email size={16} />
              <span>{client.email}</span>
              <IconButton kind="ghost" size="sm" label="Copiar" onClick={() => navigator.clipboard.writeText(client.email!)}>
                <Copy size={14} />
              </IconButton>
            </a>
          )}
          {client.phone && (
            <a href={`tel:${client.phone}`} className="contact-item">
              <Phone size={16} />
              <span>{client.phone}</span>
              <IconButton kind="ghost" size="sm" label="Copiar" onClick={() => navigator.clipboard.writeText(client.phone!)}>
                <Copy size={14} />
              </IconButton>
            </a>
          )}
        </div>

        {/* Stats Grid */}
        <div className="client-detail__stats">
          <Tile className="stat-tile">
            <span className="stat-tile__label">Total de Projetos</span>
            <span className="stat-tile__value">{clientStats.totalProjects}</span>
          </Tile>
          <Tile className="stat-tile">
            <span className="stat-tile__label">Em Andamento</span>
            <span className="stat-tile__value stat-tile__value--blue">{clientStats.activeProjects}</span>
          </Tile>
          <Tile className="stat-tile">
            <span className="stat-tile__label">Concluídos</span>
            <span className="stat-tile__value stat-tile__value--green">{clientStats.completedProjects}</span>
          </Tile>
          <Tile className="stat-tile">
            <span className="stat-tile__label">Faturamento Total</span>
            <span className="stat-tile__value">
              {clientStats.totalRevenue.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
            </span>
          </Tile>
        </div>

        {/* Tabs Content */}
        <Tabs>
          <TabList aria-label="Informações do cliente">
            <Tab>Projetos ({projects.length})</Tab>
            <Tab>Documentos</Tab>
            <Tab>Atividade</Tab>
            <Tab>Notas</Tab>
          </TabList>
          
          <TabPanels>
            {/* Projects Tab */}
            <TabPanel>
              <div className="tab-panel-header">
                <h3>Projetos</h3>
                <Button size="sm" renderIcon={Add} href={`/projects?new=true&client_id=${clientId}`}>
                  Novo Projeto
                </Button>
              </div>
              
              {projects.length === 0 ? (
                <div className="empty-state">
                  <Folder size={48} />
                  <h4>Nenhum projeto ainda</h4>
                  <p>Crie o primeiro projeto para este cliente</p>
                  <Button renderIcon={Add} href={`/projects?new=true&client_id=${clientId}`}>
                    Criar Projeto
                  </Button>
                </div>
              ) : (
                <div className="projects-list">
                  {projects.map((project) => {
                    const statusConfig = getProjectStatusConfig(project.status);
                    return (
                      <ClickableTile 
                        key={project.id} 
                        href={`/projects/${project.id}`}
                        className="project-tile"
                      >
                        <div className="project-tile__header">
                          <span className="project-tile__name">{project.name}</span>
                          <Tag type={statusConfig.type} size="sm">{statusConfig.text}</Tag>
                        </div>
                        
                        <div className="project-tile__progress">
                          <ProgressBar 
                            value={project.progress || 0} 
                            label={`${project.progress || 0}% concluído`}
                            hideLabel
                            size="small"
                          />
                          <span>{project.progress || 0}%</span>
                        </div>
                        
                        <div className="project-tile__footer">
                          <span>
                            <Calendar size={12} />
                            {project.deadline ? formatDate(project.deadline) : 'Sem prazo'}
                          </span>
                          <Launch size={14} />
                        </div>
                      </ClickableTile>
                    );
                  })}
                </div>
              )}
            </TabPanel>

            {/* Documents Tab */}
            <TabPanel>
              <div className="tab-panel-header">
                <h3>Documentos</h3>
                <Button size="sm" renderIcon={Add}>
                  Upload
                </Button>
              </div>
              
              <div className="empty-state">
                <Document size={48} />
                <h4>Nenhum documento</h4>
                <p>Faça upload de contratos, propostas e outros documentos</p>
                <Button renderIcon={Add}>Upload de Documento</Button>
              </div>
            </TabPanel>

            {/* Activity Tab */}
            <TabPanel>
              <div className="tab-panel-header">
                <h3>Histórico de Atividades</h3>
              </div>
              
              <div className="activity-timeline">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-timeline__item">
                    <div className={`activity-timeline__dot activity-timeline__dot--${activity.type}`} />
                    <div className="activity-timeline__content">
                      <p>{activity.description}</p>
                      <span>{formatDateTime(activity.timestamp)}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabPanel>

            {/* Notes Tab */}
            <TabPanel>
              <div className="tab-panel-header">
                <h3>Notas e Observações</h3>
                <Button size="sm" kind="ghost" renderIcon={Edit}>
                  Editar
                </Button>
              </div>
              
              <div className="notes-content">
                {client.notes ? (
                  <p>{client.notes}</p>
                ) : (
                  <p className="notes-empty">Nenhuma nota adicionada ainda.</p>
                )}
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </div>

      {/* Edit Modal */}
      <Modal
        open={editModalOpen}
        onRequestClose={() => setEditModalOpen(false)}
        onRequestSubmit={handleSave}
        modalHeading="Editar Cliente"
        primaryButtonText="Salvar Alterações"
        secondaryButtonText="Cancelar"
        size="md"
      >
        <div className="edit-form">
          <TextInput
            id="name"
            labelText="Nome *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <TextInput
            id="company"
            labelText="Empresa"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
          />
          <div className="edit-form__row">
            <TextInput
              id="email"
              labelText="Email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextInput
              id="phone"
              labelText="Telefone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
          <Select
            id="status"
            labelText="Status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
          >
            <SelectItem value="prospect" text="Prospect" />
            <SelectItem value="active" text="Ativo" />
            <SelectItem value="inactive" text="Inativo" />
            <SelectItem value="cancelled" text="Cancelado" />
          </Select>
          <TextArea
            id="notes"
            labelText="Observações"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            rows={4}
          />
        </div>
      </Modal>
    </>
  );
}
