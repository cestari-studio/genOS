'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  ProgressBar,
  Breadcrumb,
  BreadcrumbItem,
  StructuredListWrapper,
  StructuredListBody,
  StructuredListRow,
  StructuredListCell,
  SkeletonText,
} from '@carbon/react';
import {
  Edit,
  Calendar,
  User,
  Folder,
  Document,
  Task,
  ChartBar,
  ArrowRight,
  Add,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  name: string;
  description?: string;
  status: string;
  project_type?: string;
  start_date?: string;
  deadline?: string;
  client?: { id: string; name: string };
}

interface Task {
  id: string;
  title: string;
  status: string;
}

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'cyan' | 'purple' | 'red' | 'teal'> = {
  planning: 'gray',
  briefing: 'blue',
  in_progress: 'cyan',
  review: 'purple',
  completed: 'green',
  on_hold: 'teal',
  cancelled: 'red',
};

const statusLabels: Record<string, string> = {
  planning: 'Planejamento',
  briefing: 'Briefing',
  in_progress: 'Em Progresso',
  review: 'Revisão',
  completed: 'Concluído',
  on_hold: 'Pausado',
  cancelled: 'Cancelado',
};

// Mock tasks
const mockTasks: Task[] = [
  { id: '1', title: 'Definir escopo do projeto', status: 'completed' },
  { id: '2', title: 'Criar wireframes', status: 'completed' },
  { id: '3', title: 'Desenvolver design', status: 'in_progress' },
  { id: '4', title: 'Implementar frontend', status: 'pending' },
  { id: '5', title: 'Revisão final', status: 'pending' },
];

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const supabase = createClient();
      const { data } = await supabase
        .from('projects')
        .select('*, client:clients(id, name)')
        .eq('id', projectId)
        .single();

      if (data) setProject(data);
      setLoading(false);
    }
    fetchData();
  }, [projectId]);

  if (loading) {
    return (
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <SkeletonText heading width="30%" />
        </Column>
      </Grid>
    );
  }

  if (!project) {
    return (
      <Grid>
        <Column lg={16} md={8} sm={4}>
          <Tile>
            <p>Projeto não encontrado</p>
            <Link href="/projects">Voltar para lista</Link>
          </Tile>
        </Column>
      </Grid>
    );
  }

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = Math.round((completedTasks / tasks.length) * 100);

  return (
    <Grid>
      {/* Breadcrumb */}
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb noTrailingSlash>
          <BreadcrumbItem href="/projects">Projetos</BreadcrumbItem>
          <BreadcrumbItem isCurrentPage>{project.name}</BreadcrumbItem>
        </Breadcrumb>
      </Column>

      {/* Header */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', margin: '1rem 0 1.5rem' }}>
          <div>
            <h1 style={{ margin: 0 }}>{project.name}</h1>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <Tag type={statusColors[project.status]} size="sm">
                {statusLabels[project.status] || project.status}
              </Tag>
              {project.project_type && <Tag type="outline" size="sm">{project.project_type}</Tag>}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link href={`/projects/${project.id}/kanban`}>
              <Button kind="secondary" size="sm">Kanban</Button>
            </Link>
            <Link href={`/projects/${project.id}/timeline`}>
              <Button kind="secondary" size="sm">Timeline</Button>
            </Link>
            <Link href={`/projects/${project.id}/edit`}>
              <Button kind="primary" size="sm" renderIcon={Edit}>Editar</Button>
            </Link>
          </div>
        </div>
      </Column>

      {/* Progress */}
      <Column lg={16} md={8} sm={4}>
        <Tile style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Progresso do Projeto</span>
            <strong>{progress}%</strong>
          </div>
          <ProgressBar label="Progresso do Projeto" value={progress} max={100} />
          <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)', marginTop: '0.5rem' }}>
            {completedTasks} de {tasks.length} tarefas concluídas
          </p>
        </Tile>
      </Column>

      {/* Tabs */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Detalhes do projeto">
            <Tab>Visão Geral</Tab>
            <Tab>Tarefas ({tasks.length})</Tab>
            <Tab>Arquivos</Tab>
            <Tab>Equipe</Tab>
          </TabList>
          <TabPanels>
            {/* Visão Geral */}
            <TabPanel>
              <Grid style={{ marginTop: '1rem' }}>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <h4 style={{ marginBottom: '1rem' }}>Detalhes</h4>
                    <StructuredListWrapper>
                      <StructuredListBody>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <User size={16} /> Cliente
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>
                            {project.client ? (
                              <Link href={`/clients/${project.client.id}`} style={{ color: 'var(--cds-link-primary)' }}>
                                {project.client.name}
                              </Link>
                            ) : '-'}
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Calendar size={16} /> Data Início
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>
                            {project.start_date ? new Date(project.start_date).toLocaleDateString('pt-BR') : '-'}
                          </StructuredListCell>
                        </StructuredListRow>
                        <StructuredListRow>
                          <StructuredListCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <Calendar size={16} /> Prazo
                            </div>
                          </StructuredListCell>
                          <StructuredListCell>
                            {project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : '-'}
                          </StructuredListCell>
                        </StructuredListRow>
                      </StructuredListBody>
                    </StructuredListWrapper>
                  </Tile>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <Tile>
                    <h4 style={{ marginBottom: '1rem' }}>Descrição</h4>
                    <p style={{ color: 'var(--cds-text-secondary)' }}>{project.description || 'Sem descrição.'}</p>
                  </Tile>
                </Column>
              </Grid>
            </TabPanel>

            {/* Tarefas */}
            <TabPanel>
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1rem' }}>
                  <Button kind="primary" renderIcon={Add} size="sm">Nova Tarefa</Button>
                </div>
                {tasks.map((task) => (
                  <Tile key={task.id} style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Task size={16} />
                        <span style={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}>
                          {task.title}
                        </span>
                      </div>
                      <Tag
                        type={task.status === 'completed' ? 'green' : task.status === 'in_progress' ? 'cyan' : 'gray'}
                        size="sm"
                      >
                        {task.status === 'completed' ? 'Concluído' : task.status === 'in_progress' ? 'Em progresso' : 'Pendente'}
                      </Tag>
                    </div>
                  </Tile>
                ))}
              </div>
            </TabPanel>

            {/* Arquivos */}
            <TabPanel>
              <Tile style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <Document size={48} style={{ color: 'var(--cds-text-helper)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--cds-text-helper)' }}>Nenhum arquivo anexado</p>
                <Button kind="primary" style={{ marginTop: '1rem' }} renderIcon={Add}>Upload Arquivo</Button>
              </Tile>
            </TabPanel>

            {/* Equipe */}
            <TabPanel>
              <Tile style={{ marginTop: '1rem', textAlign: 'center', padding: '2rem' }}>
                <User size={48} style={{ color: 'var(--cds-text-helper)', marginBottom: '1rem' }} />
                <p style={{ color: 'var(--cds-text-helper)' }}>Nenhum membro atribuído</p>
                <Button kind="primary" style={{ marginTop: '1rem' }} renderIcon={Add}>Adicionar Membro</Button>
              </Tile>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
