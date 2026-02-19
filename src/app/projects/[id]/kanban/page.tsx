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
  Modal,
  TextInput,
  TextArea,
  Select,
  SelectItem,
  Form,
  Stack,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import {
  Add,
  ArrowLeft,
  Draggable,
  OverflowMenuVertical,
  Edit,
  TrashCan,
} from '@carbon/icons-react';

// TODO: Integrar @hello-pangea/dnd para drag and drop real

interface Task {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  assignee?: string;
}

interface Column {
  id: string;
  title: string;
  color: string;
  tasks: Task[];
}

const initialColumns: Column[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    color: 'var(--cds-text-helper)',
    tasks: [
      { id: '1', title: 'Pesquisa de mercado', priority: 'low' },
      { id: '2', title: 'Análise de concorrência', priority: 'medium' },
    ],
  },
  {
    id: 'todo',
    title: 'A Fazer',
    color: 'var(--cds-link-primary)',
    tasks: [
      { id: '3', title: 'Criar wireframes', priority: 'high' },
      { id: '4', title: 'Definir paleta de cores', priority: 'medium' },
    ],
  },
  {
    id: 'in_progress',
    title: 'Em Progresso',
    color: 'var(--cds-support-info)',
    tasks: [
      { id: '5', title: 'Desenvolver layout principal', priority: 'high', description: 'Implementar o layout responsivo da página inicial' },
    ],
  },
  {
    id: 'review',
    title: 'Revisão',
    color: 'var(--cds-support-success)',
    tasks: [
      { id: '6', title: 'Revisar textos', priority: 'medium' },
    ],
  },
  {
    id: 'done',
    title: 'Concluído',
    color: 'var(--cds-support-success)',
    tasks: [
      { id: '7', title: 'Briefing inicial', priority: 'high' },
      { id: '8', title: 'Contrato assinado', priority: 'high' },
    ],
  },
];

const priorityColors = {
  low: 'gray',
  medium: 'blue',
  high: 'red',
} as const;

const priorityLabels = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
};

export default function KanbanPage() {
  const params = useParams();
  const projectId = params.id as string;

  const [columns, setColumns] = useState<Column[]>(initialColumns);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<string | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleAddTask = (columnId: string) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (columnId: string, task: Task) => {
    setSelectedColumn(columnId);
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    const taskData: Task = {
      id: editingTask?.id || Date.now().toString(),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      priority: formData.get('priority') as 'low' | 'medium' | 'high',
    };

    setColumns(columns.map(col => {
      if (col.id === selectedColumn) {
        if (editingTask) {
          return { ...col, tasks: col.tasks.map(t => t.id === editingTask.id ? taskData : t) };
        } else {
          return { ...col, tasks: [...col.tasks, taskData] };
        }
      }
      return col;
    }));

    setIsModalOpen(false);
    setEditingTask(null);
    setSelectedColumn(null);
  };

  const handleDeleteTask = (columnId: string, taskId: string) => {
    setColumns(columns.map(col => {
      if (col.id === columnId) {
        return { ...col, tasks: col.tasks.filter(t => t.id !== taskId) };
      }
      return col;
    }));
  };

  const totalTasks = columns.reduce((acc, col) => acc + col.tasks.length, 0);

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/projects">Projetos</BreadcrumbItem>
        <BreadcrumbItem href={`/projects/${projectId}`}>Projeto</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Kanban</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Kanban Board</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{totalTasks} tarefas no total</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link href={`/projects/${projectId}`}>
            <Button kind="secondary" size="sm" renderIcon={ArrowLeft}>Voltar</Button>
          </Link>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        overflowX: 'auto',
        paddingBottom: '1rem',
      }}>
        {columns.map((column) => (
          <div
            key={column.id}
            style={{
              minWidth: '280px',
              maxWidth: '280px',
              background: 'var(--cds-background)',
              borderRadius: '8px',
              padding: '1rem',
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
              paddingBottom: '0.5rem',
              borderBottom: `3px solid ${column.color}`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <strong>{column.title}</strong>
                <Tag type="gray" size="sm">{column.tasks.length}</Tag>
              </div>
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                iconDescription="Adicionar tarefa"
                renderIcon={Add}
                onClick={() => handleAddTask(column.id)}
              />
            </div>

            {/* Tasks */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {column.tasks.map((task) => (
                <Tile
                  key={task.id}
                  style={{
                    cursor: 'grab',
                    padding: '0.75rem',
                    background: 'var(--cds-layer-01)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <Draggable size={16} style={{ color: 'var(--cds-text-helper)' }} />
                        <strong style={{ fontSize: '0.875rem' }}>{task.title}</strong>
                      </div>
                      {task.description && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem 1.5rem' }}>
                          {task.description}
                        </p>
                      )}
                      <div style={{ marginLeft: '1.5rem' }}>
                        <Tag type={priorityColors[task.priority]} size="sm">
                          {priorityLabels[task.priority]}
                        </Tag>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.25rem' }}>
                      <Button
                        kind="ghost"
                        size="sm"
                        hasIconOnly
                        iconDescription="Editar"
                        renderIcon={Edit}
                        onClick={() => handleEditTask(column.id, task)}
                      />
                      <Button
                        kind="ghost"
                        size="sm"
                        hasIconOnly
                        iconDescription="Excluir"
                        renderIcon={TrashCan}
                        onClick={() => handleDeleteTask(column.id, task.id)}
                      />
                    </div>
                  </div>
                </Tile>
              ))}

              {column.tasks.length === 0 && (
                <div style={{
                  padding: '2rem 1rem',
                  textAlign: 'center',
                  color: 'var(--cds-text-helper)',
                  border: '2px dashed var(--cds-border-subtle-01)',
                  borderRadius: '4px',
                }}>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>Nenhuma tarefa</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Task Modal */}
      <Modal
        open={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setEditingTask(null);
        }}
        modalHeading={editingTask ? 'Editar Tarefa' : 'Nova Tarefa'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        onRequestSubmit={() => {
          const form = document.getElementById('task-form') as HTMLFormElement;
          form?.requestSubmit();
        }}
      >
        <Form id="task-form" onSubmit={handleSaveTask}>
          <Stack gap={6}>
            <TextInput
              id="title"
              name="title"
              labelText="Título"
              defaultValue={editingTask?.title || ''}
              required
            />
            <TextArea
              id="description"
              name="description"
              labelText="Descrição"
              defaultValue={editingTask?.description || ''}
              rows={3}
            />
            <Select
              id="priority"
              name="priority"
              labelText="Prioridade"
              defaultValue={editingTask?.priority || 'medium'}
            >
              <SelectItem value="low" text="Baixa" />
              <SelectItem value="medium" text="Média" />
              <SelectItem value="high" text="Alta" />
            </Select>
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
