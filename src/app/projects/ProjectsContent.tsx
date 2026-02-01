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
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import { Add, View, Edit } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Project, Client, ServiceTier } from '@/types/database';

const headers = [
  { key: 'name', header: 'Projeto' },
  { key: 'client', header: 'Cliente' },
  { key: 'service', header: 'Serviço' },
  { key: 'status', header: 'Status' },
  { key: 'due_date', header: 'Prazo' },
  { key: 'actions', header: 'Ações' },
];

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'cyan' | 'purple' | 'red'> = {
  briefing: 'blue',
  in_progress: 'cyan',
  review: 'purple',
  approved: 'green',
  delivered: 'green',
  cancelled: 'red',
};

const statusLabels: Record<string, string> = {
  briefing: 'Briefing',
  in_progress: 'Em Progresso',
  review: 'Revisão',
  approved: 'Aprovado',
  delivered: 'Entregue',
  cancelled: 'Cancelado',
};

interface ProjectsContentProps {
  projects: (Project & { client?: { name: string }; service_tier?: { name: string } })[];
  clients: { id: string; name: string }[];
  serviceTiers: { id: string; name: string; price: number }[];
}

export default function ProjectsContent({ projects: initialProjects, clients, serviceTiers }: ProjectsContentProps) {
  const [projects, setProjects] = useState(initialProjects);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProjects = projects.filter(project => 
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (project.client?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const rows = filteredProjects.map(project => ({
    id: project.id,
    name: project.name,
    client: project.client?.name || '-',
    service: project.service_tier?.name || '-',
    status: (
      <Tag type={statusColors[project.status]} size="sm">
        {statusLabels[project.status] || project.status}
      </Tag>
    ),
    due_date: project.due_date ? new Date(project.due_date).toLocaleDateString('pt-BR') : '-',
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Ver" renderIcon={View}
          onClick={() => window.location.href = `/projects/${project.id}`} />
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Editar" renderIcon={Edit}
          onClick={() => { setEditingProject(project); setIsModalOpen(true); }} />
      </div>
    ),
  }));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    
    const projectData = {
      name: formData.get('name') as string,
      client_id: formData.get('client_id') as string,
      service_tier_id: formData.get('service_tier_id') as string || null,
      status: formData.get('status') as string,
      description: formData.get('description') as string,
    };

    if (editingProject) {
      const { data, error } = await supabase
        .from('projects')
        .update(projectData)
        .eq('id', editingProject.id)
        .select('*, client:clients(id, name), service_tier:service_tiers(id, name)')
        .single();
      
      if (!error && data) {
        setProjects(projects.map(p => p.id === data.id ? data : p));
      }
    } else {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select('*, client:clients(id, name), service_tier:service_tiers(id, name)')
        .single();
      
      if (!error && data) {
        setProjects([data, ...projects]);
      }
    }

    setIsModalOpen(false);
    setEditingProject(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Projetos</h1>
        <p>Gerencie seus projetos e entregas</p>
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
                    <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow {...getRowProps({ row })}>
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
            <Select id="client_id" name="client_id" labelText="Cliente" defaultValue={editingProject?.client_id || ''} required>
              <SelectItem value="" text="Selecione..." />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="service_tier_id" name="service_tier_id" labelText="Serviço" defaultValue={editingProject?.service_tier_id || ''}>
              <SelectItem value="" text="Nenhum" />
              {serviceTiers.map(s => <SelectItem key={s.id} value={s.id} text={`${s.name} - R$${s.price}`} />)}
            </Select>
            <Select id="status" name="status" labelText="Status" defaultValue={editingProject?.status || 'briefing'}>
              <SelectItem value="briefing" text="Briefing" />
              <SelectItem value="in_progress" text="Em Progresso" />
              <SelectItem value="review" text="Revisão" />
              <SelectItem value="approved" text="Aprovado" />
              <SelectItem value="delivered" text="Entregue" />
            </Select>
            <TextInput id="description" name="description" labelText="Descrição" defaultValue={editingProject?.description || ''} />
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
