'use client';

import { useEffect, useState, useMemo, Suspense, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Button,
  Tag,
  Search,
  Dropdown,
  Modal,
  TextInput,
  Select,
  SelectItem,
  TextArea,
  ProgressBar,
  IconButton,
  OverflowMenu,
  OverflowMenuItem,
  ContentSwitcher,
  Switch,
  Tile,
  ClickableTile,
  InlineLoading,
  Tooltip,
  NumberInput,
} from '@carbon/react';
import {
  Add,
  Download,
  List,
  Grid as GridIcon,
  Calendar,
  User,
  Edit,
  Warning,
  Renew,
  ChartLineData,
  View,
  TrashCan,
  Time,
  Money,
  CheckmarkFilled,
  ArrowRight,
  Draggable,
  Chat,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { AILabel } from '@/components/ui';
import './projects.scss';

interface Project {
  id: string;
  name: string;
  description: string | null;
  client_id: string | null;
  client_name?: string;
  status: string;
  priority: string;
  progress: number;
  deadline: string | null;
  budget: number | null;
  created_at: string;
}

interface Client {
  id: string;
  name: string;
}

interface AIInsight {
  id: string;
  type: 'warning' | 'suggestion' | 'opportunity';
  projectId: string;
  message: string;
}

const statusColumns = [
  { id: 'planning', label: 'Planejamento', color: 'cyan' },
  { id: 'in_progress', label: 'Em Andamento', color: 'blue' },
  { id: 'review', label: 'Em Revisão', color: 'purple' },
  { id: 'completed', label: 'Concluído', color: 'green' },
];

const priorityConfig: Record<string, { type: 'red' | 'magenta' | 'blue' | 'gray'; text: string; order: number }> = {
  urgent: { type: 'red', text: 'Urgente', order: 1 },
  high: { type: 'magenta', text: 'Alta', order: 2 },
  medium: { type: 'blue', text: 'Média', order: 3 },
  low: { type: 'gray', text: 'Baixa', order: 4 },
};

function ProjectsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'timeline'>('kanban');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [showAiPanel, setShowAiPanel] = useState(true);
  const [draggedProject, setDraggedProject] = useState<Project | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    client_id: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    deadline: '',
    budget: '',
  });

  useEffect(() => {
    loadData();
    if (searchParams.get('new') === 'true') {
      const clientId = searchParams.get('client_id');
      if (clientId) setFormData(prev => ({ ...prev, client_id: clientId }));
      setModalOpen(true);
    }
  }, [searchParams]);

  const loadData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data: projectsData } = await supabase
        .from('projects')
        .select(`*, clients:client_id (name)`)
        .order('created_at', { ascending: false });
      
      const formattedProjects = (projectsData || []).map(p => ({
        ...p,
        client_name: p.clients?.name || null,
      }));
      setProjects(formattedProjects);
      generateAIInsights(formattedProjects);

      const { data: clientsData } = await supabase
        .from('clients')
        .select('id, name')
        .order('name');
      setClients(clientsData || []);
    } catch (error) {
      console.error('Error loading data:', error);
      setProjects([]);
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  const generateAIInsights = (projectList: Project[]) => {
    const insights: AIInsight[] = [];
    const today = new Date();
    
    projectList.forEach(project => {
      if (project.deadline) {
        const deadline = new Date(project.deadline);
        const daysLeft = Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        
        // Overdue projects
        if (daysLeft < 0 && project.status !== 'completed') {
          insights.push({
            id: `insight-${project.id}-overdue`,
            type: 'warning',
            projectId: project.id,
            message: `"${project.name}" está ${Math.abs(daysLeft)} dias atrasado. Considere renegociar prazo ou aumentar prioridade.`,
          });
        }
        // Projects at risk
        else if (daysLeft <= 3 && daysLeft >= 0 && project.progress < 80 && project.status !== 'completed') {
          insights.push({
            id: `insight-${project.id}-atrisk`,
            type: 'warning',
            projectId: project.id,
            message: `"${project.name}" vence em ${daysLeft} dias mas está em ${project.progress}%. Risco de atraso.`,
          });
        }
      }
      
      // Stalled projects
      if (project.progress < 30 && project.status === 'in_progress') {
        insights.push({
          id: `insight-${project.id}-stalled`,
          type: 'suggestion',
          projectId: project.id,
          message: `"${project.name}" está em andamento mas com progresso baixo (${project.progress}%). Verifique se há bloqueios.`,
        });
      }
    });
    
    setAiInsights(insights.slice(0, 4));
  };

  const handleSave = async () => {
    try {
      const supabase = createClient();
      const projectData = {
        name: formData.name,
        description: formData.description || null,
        client_id: formData.client_id || null,
        status: formData.status,
        priority: formData.priority,
        progress: Number(formData.progress) || 0,
        deadline: formData.deadline || null,
        budget: formData.budget ? Number(formData.budget) : null,
      };

      if (editingProject) {
        await supabase.from('projects').update(projectData).eq('id', editingProject.id);
      } else {
        await supabase.from('projects').insert([projectData]);
      }

      setModalOpen(false);
      setEditingProject(null);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving project:', error);
    }
  };

  const handleStatusChange = async (projectId: string, newStatus: string) => {
    try {
      const supabase = createClient();
      const updates: Record<string, string | number> = { status: newStatus };
      if (newStatus === 'completed') updates.progress = 100;
      await supabase.from('projects').update(updates).eq('id', projectId);
      
      // Optimistic update
      setProjects(prev => prev.map(p => 
        p.id === projectId ? { ...p, ...updates } : p
      ));
    } catch (error) {
      console.error('Error updating status:', error);
      loadData();
    }
  };

  const handleDelete = async () => {
    if (!projectToDelete) return;
    try {
      const supabase = createClient();
      await supabase.from('projects').delete().eq('id', projectToDelete.id);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      loadData();
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const openEditModal = (project: Project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
      client_id: project.client_id || '',
      status: project.status,
      priority: project.priority,
      progress: project.progress,
      deadline: project.deadline || '',
      budget: project.budget?.toString() || '',
    });
    setModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      client_id: '',
      status: 'planning',
      priority: 'medium',
      progress: 0,
      deadline: '',
      budget: '',
    });
  };

  // Drag and Drop handlers
  const handleDragStart = (e: React.DragEvent, project: Project) => {
    setDraggedProject(project);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, newStatus: string) => {
    e.preventDefault();
    if (draggedProject && draggedProject.status !== newStatus) {
      handleStatusChange(draggedProject.id, newStatus);
    }
    setDraggedProject(null);
  };

  const handleDragEnd = () => {
    setDraggedProject(null);
  };

  // Calculations
  const stats = useMemo(() => {
    const today = new Date();
    return {
      total: projects.length,
      planning: projects.filter(p => p.status === 'planning').length,
      inProgress: projects.filter(p => p.status === 'in_progress').length,
      review: projects.filter(p => p.status === 'review').length,
      completed: projects.filter(p => p.status === 'completed').length,
      overdue: projects.filter(p => {
        if (!p.deadline || p.status === 'completed') return false;
        return new Date(p.deadline) < today;
      }).length,
      totalBudget: projects.reduce((sum, p) => sum + (p.budget || 0), 0),
    };
  }, [projects]);

  const filteredProjects = useMemo(() => {
    return projects.filter(project => {
      const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (project.client_name && project.client_name.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || project.priority === priorityFilter;
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [projects, searchTerm, statusFilter, priorityFilter]);

  const getDaysUntil = (dateStr: string | null) => {
    if (!dateStr) return null;
    const target = new Date(dateStr);
    const today = new Date();
    return Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  };

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Sem prazo';
    return new Date(dateStr).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  // Kanban View
  const renderKanbanView = () => (
    <div className="kanban-board">
      {statusColumns.map((column) => {
        const columnProjects = filteredProjects
          .filter(p => p.status === column.id)
          .sort((a, b) => (priorityConfig[a.priority]?.order || 99) - (priorityConfig[b.priority]?.order || 99));
        
        return (
          <div 
            key={column.id} 
            className={`kanban-column ${draggedProject ? 'kanban-column--droppable' : ''}`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, column.id)}
          >
            <div className={`kanban-column__header kanban-column__header--${column.color}`}>
              <span className="kanban-column__title">{column.label}</span>
              <Tag size="sm" type={column.color as any}>{columnProjects.length}</Tag>
            </div>
            <div className="kanban-column__body">
              {columnProjects.map((project) => {
                const daysLeft = getDaysUntil(project.deadline);
                const isOverdue = daysLeft !== null && daysLeft < 0;
                const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
                
                return (
                  <div 
                    key={project.id} 
                    className={`kanban-card ${isOverdue ? 'kanban-card--overdue' : ''} ${isUrgent ? 'kanban-card--urgent' : ''} ${draggedProject?.id === project.id ? 'kanban-card--dragging' : ''}`}
                    draggable
                    onDragStart={(e) => handleDragStart(e, project)}
                    onDragEnd={handleDragEnd}
                  >
                    <div className="kanban-card__header">
                      <Tag type={priorityConfig[project.priority]?.type || 'gray'} size="sm">
                        {priorityConfig[project.priority]?.text || project.priority}
                      </Tag>
                      <OverflowMenu flipped size="sm" ariaLabel="Ações">
                        <OverflowMenuItem itemText="Ver detalhes" onClick={() => router.push(`/projects/${project.id}`)} />
                        <OverflowMenuItem itemText="Editar" onClick={() => openEditModal(project)} />
                        {column.id !== 'completed' && (
                          <OverflowMenuItem itemText="Marcar como concluído" 
                            onClick={() => handleStatusChange(project.id, 'completed')} />
                        )}
                        <OverflowMenuItem itemText="Excluir" isDelete onClick={() => {
                          setProjectToDelete(project);
                          setDeleteModalOpen(true);
                        }} />
                      </OverflowMenu>
                    </div>
                    <h4 className="kanban-card__title">{project.name}</h4>
                    {project.client_name && (
                      <p className="kanban-card__client"><User size={12} />{project.client_name}</p>
                    )}
                    <div className="kanban-card__progress">
                      <ProgressBar 
                        value={project.progress} 
                        label={`${project.progress}%`}
                        hideLabel 
                        size="small" 
                        status={project.status === 'completed' ? 'finished' : isOverdue ? 'error' : 'active'} 
                      />
                      <span>{project.progress}%</span>
                    </div>
                    <div className="kanban-card__footer">
                      <span className={isOverdue ? 'overdue' : isUrgent ? 'urgent' : ''}>
                        <Calendar size={12} />
                        {formatDate(project.deadline)}
                        {isOverdue && <Warning size={12} />}
                      </span>
                      {project.budget && (
                        <span className="kanban-card__budget">
                          <Money size={12} />
                          {formatCurrency(project.budget)}
                        </span>
                      )}
                    </div>
                    {column.id !== 'completed' && (
                      <div className="kanban-card__actions">
                        {column.id === 'planning' && (
                          <Button kind="ghost" size="sm" onClick={() => handleStatusChange(project.id, 'in_progress')}>
                            Iniciar
                          </Button>
                        )}
                        {column.id === 'in_progress' && (
                          <Button kind="ghost" size="sm" onClick={() => handleStatusChange(project.id, 'review')}>
                            Enviar p/ Revisão
                          </Button>
                        )}
                        {column.id === 'review' && (
                          <Button kind="ghost" size="sm" onClick={() => handleStatusChange(project.id, 'completed')}>
                            Aprovar
                          </Button>
                        )}
                      </div>
                    )}
                    <div className="kanban-card__drag-handle">
                      <Draggable size={14} />
                    </div>
                  </div>
                );
              })}
              {columnProjects.length === 0 && (
                <div className="kanban-column__empty">
                  <p>Nenhum projeto</p>
                  {column.id === 'planning' && (
                    <Button kind="ghost" size="sm" renderIcon={Add} onClick={() => {
                      resetForm();
                      setFormData(prev => ({ ...prev, status: column.id }));
                      setModalOpen(true);
                    }}>
                      Adicionar
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  // List View
  const renderListView = () => (
    <div className="projects-list">
      {filteredProjects.map((project) => {
        const daysLeft = getDaysUntil(project.deadline);
        const isOverdue = daysLeft !== null && daysLeft < 0;
        const statusCol = statusColumns.find(s => s.id === project.status);
        
        return (
          <div key={project.id} className="project-list-item">
            <div className="project-list-item__main">
              <div className="project-list-item__info">
                <h4 onClick={() => router.push(`/projects/${project.id}`)}>{project.name}</h4>
                {project.client_name && (
                  <span className="project-list-item__client"><User size={12} />{project.client_name}</span>
                )}
              </div>
              <div className="project-list-item__tags">
                <Tag type={priorityConfig[project.priority]?.type || 'gray'} size="sm">
                  {priorityConfig[project.priority]?.text || project.priority}
                </Tag>
                <Tag type={statusCol?.color as any || 'gray'} size="sm">
                  {statusCol?.label || project.status}
                </Tag>
              </div>
            </div>
            <div className="project-list-item__progress">
              <ProgressBar value={project.progress} label={`${project.progress}%`} hideLabel size="small" />
              <span>{project.progress}%</span>
            </div>
            <div className={`project-list-item__deadline ${isOverdue ? 'overdue' : ''}`}>
              <Calendar size={14} />
              <span>{formatDate(project.deadline)}</span>
              {isOverdue && <Warning size={14} />}
            </div>
            <div className="project-list-item__budget">
              {project.budget ? formatCurrency(project.budget) : '-'}
            </div>
            <div className="project-list-item__actions">
              <IconButton kind="ghost" size="sm" label="Editar" onClick={() => openEditModal(project)}>
                <Edit size={16} />
              </IconButton>
              <IconButton kind="ghost" size="sm" label="Excluir" onClick={() => {
                setProjectToDelete(project);
                setDeleteModalOpen(true);
              }}>
                <TrashCan size={16} />
              </IconButton>
            </div>
          </div>
        );
      })}
      {filteredProjects.length === 0 && (
        <div className="empty-state">
          <h4>Nenhum projeto encontrado</h4>
          <p>Ajuste os filtros ou crie um novo projeto</p>
          <Button renderIcon={Add} onClick={() => setModalOpen(true)}>Novo Projeto</Button>
        </div>
      )}
    </div>
  );

  // Timeline View
  const renderTimelineView = () => {
    const today = new Date();
    const startDate = new Date(today);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(today);
    endDate.setDate(endDate.getDate() + 30);
    
    const totalDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    
    const sortedProjects = [...filteredProjects].sort((a, b) => {
      if (!a.deadline) return 1;
      if (!b.deadline) return -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
    
    const getPositionForDate = (dateStr: string | null) => {
      if (!dateStr) return { left: 0, visible: false };
      const date = new Date(dateStr);
      const daysSinceStart = Math.ceil((date.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
      const position = (daysSinceStart / totalDays) * 100;
      return { left: Math.max(0, Math.min(100, position)), visible: daysSinceStart >= 0 && daysSinceStart <= totalDays };
    };
    
    const todayPosition = getPositionForDate(today.toISOString());
    
    // Generate week markers
    const weeks: { date: Date; position: number }[] = [];
    const tempDate = new Date(startDate);
    while (tempDate <= endDate) {
      weeks.push({
        date: new Date(tempDate),
        position: getPositionForDate(tempDate.toISOString()).left,
      });
      tempDate.setDate(tempDate.getDate() + 7);
    }
    
    return (
      <div className="timeline-view">
        <div className="timeline-header">
          <div className="timeline-header__labels">
            {weeks.map((week, idx) => (
              <div 
                key={idx} 
                className="timeline-header__week"
                style={{ left: `${week.position}%` }}
              >
                {week.date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
              </div>
            ))}
          </div>
          <div className="timeline-header__today" style={{ left: `${todayPosition.left}%` }}>
            <span>Hoje</span>
          </div>
        </div>
        
        <div className="timeline-body">
          {sortedProjects.map((project) => {
            const position = getPositionForDate(project.deadline);
            const daysLeft = getDaysUntil(project.deadline);
            const isOverdue = daysLeft !== null && daysLeft < 0;
            const statusCol = statusColumns.find(s => s.id === project.status);
            
            return (
              <div key={project.id} className="timeline-row">
                <div className="timeline-row__info">
                  <h4 onClick={() => router.push(`/projects/${project.id}`)}>{project.name}</h4>
                  <div className="timeline-row__meta">
                    <Tag type={statusCol?.color as any || 'gray'} size="sm">{statusCol?.label}</Tag>
                    <span className="timeline-row__client">{project.client_name || 'Sem cliente'}</span>
                  </div>
                </div>
                <div className="timeline-row__track">
                  <div className="timeline-row__track-bg"></div>
                  <div 
                    className="timeline-row__today-line"
                    style={{ left: `${todayPosition.left}%` }}
                  ></div>
                  <div 
                    className={`timeline-row__progress ${isOverdue ? 'overdue' : ''}`}
                    style={{ width: `${Math.min(position.left, todayPosition.left) * (project.progress / 100)}%` }}
                  ></div>
                  {position.visible && (
                    <div 
                      className={`timeline-row__marker ${isOverdue ? 'overdue' : ''} ${project.status === 'completed' ? 'completed' : ''}`}
                      style={{ left: `${position.left}%` }}
                    >
                      <Tooltip align="top" label={`${project.name} - ${formatDate(project.deadline)}`}>
                        <div className="timeline-row__marker-dot">
                          {project.status === 'completed' ? <CheckmarkFilled size={12} /> : isOverdue ? <Warning size={12} /> : null}
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </div>
                <div className="timeline-row__deadline">
                  {daysLeft !== null ? (
                    <span className={isOverdue ? 'overdue' : daysLeft <= 3 ? 'urgent' : ''}>
                      {isOverdue ? `${Math.abs(daysLeft)}d atrasado` : `${daysLeft}d restantes`}
                    </span>
                  ) : (
                    <span className="no-deadline">Sem prazo</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="projects-page">
      {/* Page Header */}
      <div className="page-header">
        <div className="page-header__content">
          <h1>Projetos</h1>
          <p>Gerencie todos os projetos do estúdio</p>
        </div>
        <div className="page-header__actions">
          <Button kind="ghost" size="md" renderIcon={Renew} onClick={loadData} hasIconOnly iconDescription="Atualizar" />
          <Button kind="tertiary" renderIcon={Download} size="md">Exportar</Button>
          <Button renderIcon={Add} onClick={() => { resetForm(); setEditingProject(null); setModalOpen(true); }}>
            Novo Projeto
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="projects-stats">
        <Tile className="stat-tile">
          <span className="stat-tile__value">{stats.total}</span>
          <span className="stat-tile__label">Total</span>
        </Tile>
        <Tile className="stat-tile stat-tile--blue">
          <span className="stat-tile__value">{stats.inProgress}</span>
          <span className="stat-tile__label">Em Andamento</span>
        </Tile>
        <Tile className="stat-tile stat-tile--purple">
          <span className="stat-tile__value">{stats.review}</span>
          <span className="stat-tile__label">Em Revisão</span>
        </Tile>
        <Tile className="stat-tile stat-tile--green">
          <span className="stat-tile__value">{stats.completed}</span>
          <span className="stat-tile__label">Concluídos</span>
        </Tile>
        <Tile className="stat-tile stat-tile--red">
          <span className="stat-tile__value">{stats.overdue}</span>
          <span className="stat-tile__label">Atrasados</span>
        </Tile>
      </div>

      {/* AI Insights */}
      {showAiPanel && aiInsights.length > 0 && (
        <div className="ai-insights-panel">
          <div className="ai-insights-panel__header">
            <div className="ai-insights-panel__title">
              <Chat size={18} />
              <span>Alertas da IA</span>
              <AILabel size="mini" />
            </div>
            <IconButton kind="ghost" size="sm" label="Fechar" onClick={() => setShowAiPanel(false)}>
              <span>×</span>
            </IconButton>
          </div>
          <div className="ai-insights-panel__content">
            {aiInsights.map(insight => (
              <div key={insight.id} className={`ai-insight ai-insight--${insight.type}`}>
                <Warning size={16} />
                <p>{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="projects-toolbar">
        <div className="projects-toolbar__filters">
          <Search 
            placeholder="Buscar projetos..." 
            labelText="" 
            value={searchTerm} 
            onChange={(e) => setSearchTerm(e.target.value)} 
            size="md" 
          />
          <Dropdown 
            id="status-filter" 
            titleText="" 
            label="Status"
            items={[{ id: 'all', text: 'Todos os status' }, ...statusColumns.map(s => ({ id: s.id, text: s.label }))]}
            itemToString={(item: any) => item?.text || ''}
            onChange={({ selectedItem }: any) => setStatusFilter(selectedItem?.id || 'all')} 
          />
          <Dropdown 
            id="priority-filter" 
            titleText="" 
            label="Prioridade"
            items={[{ id: 'all', text: 'Todas' }, { id: 'urgent', text: 'Urgente' }, { id: 'high', text: 'Alta' }, { id: 'medium', text: 'Média' }, { id: 'low', text: 'Baixa' }]}
            itemToString={(item: any) => item?.text || ''}
            onChange={({ selectedItem }: any) => setPriorityFilter(selectedItem?.id || 'all')} 
          />
        </div>
        <ContentSwitcher 
          size="md" 
          onChange={(e: any) => setViewMode(['kanban', 'list', 'timeline'][e.index || 0] as any)} 
          selectedIndex={['kanban', 'list', 'timeline'].indexOf(viewMode)}
        >
          <Switch name="kanban"><GridIcon size={16} /></Switch>
          <Switch name="list"><List size={16} /></Switch>
          <Switch name="timeline"><ChartLineData size={16} /></Switch>
        </ContentSwitcher>
      </div>

      {/* Content */}
      {loading ? (
        <div className="loading-state"><InlineLoading description="Carregando projetos..." /></div>
      ) : (
        <>
          {viewMode === 'kanban' && renderKanbanView()}
          {viewMode === 'list' && renderListView()}
          {viewMode === 'timeline' && renderTimelineView()}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal 
        open={modalOpen} 
        onRequestClose={() => { setModalOpen(false); setEditingProject(null); resetForm(); }}
        onRequestSubmit={handleSave} 
        modalHeading={editingProject ? 'Editar Projeto' : 'Novo Projeto'}
        primaryButtonText="Salvar" 
        secondaryButtonText="Cancelar" 
        size="lg"
      >
        <div className="project-form">
          <TextInput 
            id="name" 
            labelText="Nome do Projeto *" 
            value={formData.name} 
            onChange={(e) => setFormData({ ...formData, name: e.target.value })} 
            required 
          />
          <TextArea 
            id="description" 
            labelText="Descrição" 
            value={formData.description} 
            onChange={(e) => setFormData({ ...formData, description: e.target.value })} 
            rows={3} 
          />
          <div className="project-form__row">
            <Select 
              id="client" 
              labelText="Cliente" 
              value={formData.client_id} 
              onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
            >
              <SelectItem value="" text="Selecione um cliente" />
              {clients.map((client) => <SelectItem key={client.id} value={client.id} text={client.name} />)}
            </Select>
            <Select 
              id="status" 
              labelText="Status" 
              value={formData.status} 
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              {statusColumns.map((status) => <SelectItem key={status.id} value={status.id} text={status.label} />)}
            </Select>
          </div>
          <div className="project-form__row">
            <Select 
              id="priority" 
              labelText="Prioridade" 
              value={formData.priority} 
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
            >
              <SelectItem value="low" text="Baixa" />
              <SelectItem value="medium" text="Média" />
              <SelectItem value="high" text="Alta" />
              <SelectItem value="urgent" text="Urgente" />
            </Select>
            <TextInput 
              id="progress" 
              labelText="Progresso (%)" 
              type="number" 
              min={0} 
              max={100} 
              value={formData.progress.toString()} 
              onChange={(e) => setFormData({ ...formData, progress: Number(e.target.value) })} 
            />
          </div>
          <div className="project-form__row">
            <TextInput 
              id="deadline" 
              labelText="Data de Entrega" 
              type="date" 
              value={formData.deadline} 
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} 
            />
            <TextInput 
              id="budget" 
              labelText="Orçamento (R$)" 
              type="number" 
              min={0} 
              value={formData.budget} 
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })} 
            />
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        open={deleteModalOpen}
        onRequestClose={() => { setDeleteModalOpen(false); setProjectToDelete(null); }}
        onRequestSubmit={handleDelete}
        modalHeading="Excluir Projeto"
        primaryButtonText="Excluir"
        secondaryButtonText="Cancelar"
        danger
        size="sm"
      >
        <p>
          Tem certeza que deseja excluir o projeto <strong>{projectToDelete?.name}</strong>?
          Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="loading-state"><InlineLoading description="Carregando projetos..." /></div>}>
      <ProjectsContent />
    </Suspense>
  );
}
