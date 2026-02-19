'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
  Select,
  SelectItem,
  Toggle,
} from '@carbon/react';
import {
  ArrowLeft,
  ZoomIn,
  ZoomOut,
  ChevronLeft,
  ChevronRight,
  Calendar,
  View,
} from '@carbon/icons-react';

// TODO: Integrar @fullcalendar/react ou biblioteca de Gantt

interface TimelineTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  assignee: string;
  status: 'pending' | 'in_progress' | 'completed';
  dependencies?: string[];
}

const tasks: TimelineTask[] = [
  { id: '1', name: 'Briefing e Planejamento', startDate: '2024-01-15', endDate: '2024-01-20', progress: 100, assignee: 'João', status: 'completed' },
  { id: '2', name: 'Pesquisa e Benchmark', startDate: '2024-01-18', endDate: '2024-01-25', progress: 100, assignee: 'Maria', status: 'completed', dependencies: ['1'] },
  { id: '3', name: 'Wireframes', startDate: '2024-01-22', endDate: '2024-02-01', progress: 100, assignee: 'João', status: 'completed', dependencies: ['2'] },
  { id: '4', name: 'Design Visual', startDate: '2024-02-01', endDate: '2024-02-15', progress: 75, assignee: 'João', status: 'in_progress', dependencies: ['3'] },
  { id: '5', name: 'Revisão com Cliente', startDate: '2024-02-12', endDate: '2024-02-18', progress: 50, assignee: 'Maria', status: 'in_progress', dependencies: ['4'] },
  { id: '6', name: 'Desenvolvimento Front-end', startDate: '2024-02-15', endDate: '2024-03-01', progress: 20, assignee: 'Carlos', status: 'in_progress', dependencies: ['4'] },
  { id: '7', name: 'Desenvolvimento Back-end', startDate: '2024-02-18', endDate: '2024-03-05', progress: 0, assignee: 'Carlos', status: 'pending', dependencies: ['4'] },
  { id: '8', name: 'Integração e Testes', startDate: '2024-03-01', endDate: '2024-03-10', progress: 0, assignee: 'Carlos', status: 'pending', dependencies: ['6', '7'] },
  { id: '9', name: 'Deploy e Entrega', startDate: '2024-03-10', endDate: '2024-03-15', progress: 0, assignee: 'Maria', status: 'pending', dependencies: ['8'] },
];

const months = ['Janeiro', 'Fevereiro', 'Março'];
const weeks = [
  { label: 'S1', start: 15, end: 21, month: 0 },
  { label: 'S2', start: 22, end: 28, month: 0 },
  { label: 'S3', start: 29, end: 4, month: 0 },
  { label: 'S4', start: 5, end: 11, month: 1 },
  { label: 'S5', start: 12, end: 18, month: 1 },
  { label: 'S6', start: 19, end: 25, month: 1 },
  { label: 'S7', start: 26, end: 3, month: 1 },
  { label: 'S8', start: 4, end: 10, month: 2 },
  { label: 'S9', start: 11, end: 17, month: 2 },
];

const statusColors = {
  pending: '#8d8d8d',
  in_progress: '#0f62fe',
  completed: '#24a148',
};

export default function TimelinePage() {
  const params = useParams();
  const projectId = params.id as string;

  const [zoom, setZoom] = useState<'day' | 'week' | 'month'>('week');
  const [showDependencies, setShowDependencies] = useState(true);

  // Cálculo simplificado de posição/largura das barras
  const getTaskPosition = (task: TimelineTask) => {
    const projectStart = new Date('2024-01-15');
    const projectEnd = new Date('2024-03-17');
    const taskStart = new Date(task.startDate);
    const taskEnd = new Date(task.endDate);

    const totalDays = (projectEnd.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);
    const startOffset = (taskStart.getTime() - projectStart.getTime()) / (1000 * 60 * 60 * 24);
    const duration = (taskEnd.getTime() - taskStart.getTime()) / (1000 * 60 * 60 * 24);

    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`,
    };
  };

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/projects">Projetos</BreadcrumbItem>
        <BreadcrumbItem href={`/projects/${projectId}`}>Projeto</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Timeline</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Timeline do Projeto</h1>
          <p style={{ color: '#525252', margin: '0.25rem 0 0' }}>Visualização de Gantt das tarefas</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <Link href={`/projects/${projectId}`}>
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Controles */}
      <Tile style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Anterior" renderIcon={ChevronLeft} />
              <Button kind="ghost" size="sm">Hoje</Button>
              <Button kind="ghost" size="sm" hasIconOnly iconDescription="Próximo" renderIcon={ChevronRight} />
            </div>
            <Select id="zoom" size="sm" value={zoom} onChange={(e) => setZoom(e.target.value as typeof zoom)} style={{ minWidth: '120px' }}>
              <SelectItem value="day" text="Por Dia" />
              <SelectItem value="week" text="Por Semana" />
              <SelectItem value="month" text="Por Mês" />
            </Select>
          </div>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <Toggle
              id="dependencies"
              size="sm"
              labelText=""
              labelA="Dependências"
              labelB="Dependências"
              toggled={showDependencies}
              onToggle={setShowDependencies}
            />
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Tag type="gray" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: statusColors.pending, marginRight: 4 }} />
                Pendente
              </Tag>
              <Tag type="blue" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: statusColors.in_progress, marginRight: 4 }} />
                Em Progresso
              </Tag>
              <Tag type="green" size="sm">
                <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: statusColors.completed, marginRight: 4 }} />
                Concluído
              </Tag>
            </div>
          </div>
        </div>
      </Tile>

      {/* Timeline/Gantt */}
      <Tile style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ display: 'flex' }}>
          {/* Lista de Tarefas */}
          <div style={{ width: '280px', borderRight: '1px solid #e0e0e0', flexShrink: 0 }}>
            {/* Header */}
            <div style={{
              padding: '0.75rem 1rem',
              borderBottom: '1px solid #e0e0e0',
              background: '#f4f4f4',
              fontWeight: 600,
            }}>
              Tarefa
            </div>
            {/* Tarefas */}
            {tasks.map((task) => (
              <div
                key={task.id}
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #e0e0e0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{
                  display: 'inline-block',
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  background: statusColors[task.status],
                  flexShrink: 0,
                }} />
                <div style={{ flex: 1, overflow: 'hidden' }}>
                  <div style={{ fontSize: '0.875rem', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {task.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#525252' }}>
                    {task.assignee}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Área do Gantt */}
          <div style={{ flex: 1, overflow: 'auto' }}>
            {/* Header com meses/semanas */}
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', background: '#f4f4f4' }}>
              {months.map((month) => (
                <div
                  key={month}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    textAlign: 'center',
                    fontWeight: 600,
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  {month} 2024
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', borderBottom: '1px solid #e0e0e0', background: '#f4f4f4' }}>
              {weeks.map((week, i) => (
                <div
                  key={i}
                  style={{
                    flex: 1,
                    padding: '0.25rem',
                    textAlign: 'center',
                    fontSize: '0.75rem',
                    color: '#525252',
                    borderRight: '1px solid #e0e0e0',
                  }}
                >
                  {week.label}
                </div>
              ))}
            </div>

            {/* Barras do Gantt */}
            <div style={{ position: 'relative' }}>
              {tasks.map((task) => {
                const position = getTaskPosition(task);
                return (
                  <div
                    key={task.id}
                    style={{
                      height: '52px',
                      borderBottom: '1px solid #e0e0e0',
                      position: 'relative',
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 0.5rem',
                    }}
                  >
                    {/* Grid lines */}
                    <div style={{
                      position: 'absolute',
                      left: 0,
                      right: 0,
                      top: 0,
                      bottom: 0,
                      display: 'flex',
                    }}>
                      {weeks.map((_, i) => (
                        <div
                          key={i}
                          style={{
                            flex: 1,
                            borderRight: '1px dashed #e0e0e0',
                          }}
                        />
                      ))}
                    </div>

                    {/* Barra da tarefa */}
                    <div
                      style={{
                        position: 'absolute',
                        left: position.left,
                        width: position.width,
                        height: '24px',
                        background: statusColors[task.status],
                        borderRadius: '4px',
                        opacity: 0.9,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0 0.5rem',
                        overflow: 'hidden',
                      }}
                      title={`${task.name} (${task.progress}%)`}
                    >
                      {/* Progresso */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: `${task.progress}%`,
                          background: 'rgba(255,255,255,0.3)',
                          borderRadius: '4px 0 0 4px',
                        }}
                      />
                      <span style={{
                        position: 'relative',
                        fontSize: '0.75rem',
                        color: 'white',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}>
                        {task.progress}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Tile>

      {/* Resumo */}
      <Grid style={{ marginTop: '1rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Total de Tarefas</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{tasks.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Concluídas</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#24a148' }}>
              {tasks.filter(t => t.status === 'completed').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Em Progresso</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#0f62fe' }}>
              {tasks.filter(t => t.status === 'in_progress').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Pendentes</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#8d8d8d' }}>
              {tasks.filter(t => t.status === 'pending').length}
            </p>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
