'use client';

import { useState } from 'react';
import {
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  Tag,
  Modal,
  TextInput,
  Select,
  SelectItem,
  Form,
  Stack,
  TextArea,
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import { Add, View, Edit, TrashCan } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';

interface Project {
  id: string;
  name: string;
  description?: string;
  client_id?: string;
  status: string;
  project_type?: string;
  start_date?: string;
  deadline?: string;
  client?: { name: string };
}

const headers = [
  { key: 'name', header: 'Projeto' },
  { key: 'client', header: 'Cliente' },
  { key: 'project_type', header: 'Tipo' },
  { key: 'status', header: 'Status' },
  { key: 'deadline', header: 'Prazo' },
  { key: 'actions', header: 'Ações' },
];

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

const typeLabels: Record<string, string> = {
  social_media: 'Social Media',
  website: 'Website',
  branding: 'Branding',
  photography: 'Fotografia',
  video: 'Vídeo',
  consulting: 'Consultoria',
  other: 'Outro',
};

interface Props {
  projects: Project[];
  clients: { id: string; name: string }[];
}

export default function ProjectsContent({ projects: initialProjects, clients }: Props) {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const rows = filteredProjects.map(project => ({
    id: project.id,
    name: project.name,
    client: project.client?.name || '-',
    project_type: typeLabels[project.project_type || ''] || project.project_type || '-',
    status: (
      <Tag type={statusColors[project.status] || 'gray'} size="sm">
        {statusLabels[project.status] || project.status}
      </Tag>
    ),
    deadline: project.deadline ? new Date(project.deadline).toLocaleDateString('pt-BR') : '-',
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Editar" renderIcon={Edit}
          onClick={() => { setEditingProject(project); setIsModalOpen(true); }} />
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Excluir" renderIcon={TrashCan}
          onClick={() => setDeleteModal(project.id)} />
      </div>
    ),
  }));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const projectData = {
      name: formData.get('name') as string,
      client_id: formData.get('client_id') as string || null,
      status: formData.get('status') as string,
      project_type: formData.get('project_type') as string,
      description: formData.get('description') as string || null,
    };

    if (editingProject) {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id)
        .select('*, client:clients(id, name)')
        .single();

      if (!error && data) {
        setProjects(projects.map(p => p.id === data.id ? data : p));
      }
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('*, client:clients(id, name)')
        .single();

      if (!error && data) {
        setProjects([data, ...projects]);
      }
    }

    setIsModalOpen(false);
    setEditingProject(null);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      setProjects(projects.filter(p => p.id !== id));
    }
    setDeleteModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Projetos</h1>
        <p>Gerencie seus projetos e entregas ({projects.length} total)</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder="Buscar projetos..." onChange={(e: any) => setSearchTerm(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
                  Novo Projeto
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => (
                      <TableCell key={cell.id}>{cell.value}</TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal
        open={isModalOpen}
        onRequestClose={() => { setIsModalOpen(false); setEditingProject(null); }}
        modalHeading={editingProject ? 'Editar Projeto' : 'Novo Projeto'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        onRequestSubmit={() => {
          const form = document.getElementById('project-form') as HTMLFormElement;
          form?.requestSubmit();
        }}
      >
        <Form id="project-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="name" name="name" labelText="Nome do Projeto" defaultValue={editingProject?.name} required />
            <Select id="client_id" name="client_id" labelText="Cliente" defaultValue={editingProject?.client_id || ''}>
              <SelectItem value="" text="Selecione..." />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="project_type" name="project_type" labelText="Tipo" defaultValue={editingProject?.project_type || 'other'}>
              <SelectItem value="social_media" text="Social Media" />
              <SelectItem value="website" text="Website" />
              <SelectItem value="branding" text="Branding" />
              <SelectItem value="photography" text="Fotografia" />
              <SelectItem value="video" text="Vídeo" />
              <SelectItem value="consulting" text="Consultoria" />
              <SelectItem value="other" text="Outro" />
            </Select>
            <Select id="status" name="status" labelText="Status" defaultValue={editingProject?.status || 'planning'}>
              <SelectItem value="planning" text="Planejamento" />
              <SelectItem value="briefing" text="Briefing" />
              <SelectItem value="in_progress" text="Em Progresso" />
              <SelectItem value="review" text="Revisão" />
              <SelectItem value="completed" text="Concluído" />
              <SelectItem value="on_hold" text="Pausado" />
              <SelectItem value="cancelled" text="Cancelado" />
            </Select>
            <TextArea id="description" name="description" labelText="Descrição" defaultValue={editingProject?.description || ''} />
          </Stack>
        </Form>
      </Modal>

      <Modal
        open={deleteModal !== null}
        onRequestClose={() => setDeleteModal(null)}
        modalHeading="Confirmar Exclusão"
        primaryButtonText="Excluir"
        secondaryButtonText="Cancelar"
        danger
        onRequestSubmit={() => deleteModal && handleDelete(deleteModal)}
      >
        <p>Tem certeza que deseja excluir este projeto?</p>
      </Modal>
    </div>
  );
}
