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
import { useTranslation } from '@/lib/i18n/context';

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

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'cyan' | 'purple' | 'red' | 'teal'> = {
  planning: 'gray',
  briefing: 'blue',
  in_progress: 'cyan',
  review: 'purple',
  completed: 'green',
  on_hold: 'teal',
  cancelled: 'red',
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
  const { t } = useTranslation();

  const headers = [
    { key: 'name', header: t('projects.name') },
    { key: 'client', header: t('projects.client') },
    { key: 'project_type', header: t('projects.type') },
    { key: 'status', header: t('projects.status') },
    { key: 'deadline', header: t('projects.deadline') },
    { key: 'actions', header: t('projects.actions') },
  ];

  const statusLabels: Record<string, string> = {
    planning: t('projects.statusPlanning'),
    briefing: t('projects.statusBriefing'),
    in_progress: t('projects.statusInProgress'),
    review: t('projects.statusReview'),
    completed: t('projects.statusCompleted'),
    on_hold: t('projects.statusOnHold'),
    cancelled: t('projects.statusCancelled'),
  };

  const typeLabels: Record<string, string> = {
    social_media: t('projects.typeSocialMedia'),
    website: t('projects.typeWebsite'),
    branding: t('projects.typeBranding'),
    photography: t('projects.typePhotography'),
    video: t('projects.typeVideo'),
    consulting: t('projects.typeConsulting'),
    other: t('projects.typeOther'),
  };

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
        <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.edit')} renderIcon={Edit}
          onClick={() => { setEditingProject(project); setIsModalOpen(true); }} />
        <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.delete')} renderIcon={TrashCan}
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
        <h1>{t('projects.title')}</h1>
        <p>{t('projects.subtitleWithCount', { count: projects.length })}</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder={t('projects.searchPlaceholder')} onChange={(e: any) => setSearchTerm(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => { setEditingProject(null); setIsModalOpen(true); }}>
                  {t('projects.newProject')}
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
        modalHeading={editingProject ? t('projects.editProject') : t('projects.newProject')}
        primaryButtonText={t('common.save')}
        secondaryButtonText={t('common.cancel')}
        onRequestSubmit={() => {
          const form = document.getElementById('project-form') as HTMLFormElement;
          form?.requestSubmit();
        }}
      >
        <Form id="project-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="name" name="name" labelText={t('projects.projectName')} defaultValue={editingProject?.name} required />
            <Select id="client_id" name="client_id" labelText={t('projects.client')} defaultValue={editingProject?.client_id || ''}>
              <SelectItem value="" text={t('common.select')} />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="project_type" name="project_type" labelText={t('projects.type')} defaultValue={editingProject?.project_type || 'other'}>
              <SelectItem value="social_media" text={t('projects.typeSocialMedia')} />
              <SelectItem value="website" text={t('projects.typeWebsite')} />
              <SelectItem value="branding" text={t('projects.typeBranding')} />
              <SelectItem value="photography" text={t('projects.typePhotography')} />
              <SelectItem value="video" text={t('projects.typeVideo')} />
              <SelectItem value="consulting" text={t('projects.typeConsulting')} />
              <SelectItem value="other" text={t('projects.typeOther')} />
            </Select>
            <Select id="status" name="status" labelText={t('projects.status')} defaultValue={editingProject?.status || 'planning'}>
              <SelectItem value="planning" text={t('projects.statusPlanning')} />
              <SelectItem value="briefing" text={t('projects.statusBriefing')} />
              <SelectItem value="in_progress" text={t('projects.statusInProgress')} />
              <SelectItem value="review" text={t('projects.statusReview')} />
              <SelectItem value="completed" text={t('projects.statusCompleted')} />
              <SelectItem value="on_hold" text={t('projects.statusOnHold')} />
              <SelectItem value="cancelled" text={t('projects.statusCancelled')} />
            </Select>
            <TextArea id="description" name="description" labelText={t('projects.description')} defaultValue={editingProject?.description || ''} />
          </Stack>
        </Form>
      </Modal>

      <Modal
        open={deleteModal !== null}
        onRequestClose={() => setDeleteModal(null)}
        modalHeading={t('projects.confirmDelete')}
        primaryButtonText={t('common.delete')}
        secondaryButtonText={t('common.cancel')}
        danger
        onRequestSubmit={() => deleteModal && handleDelete(deleteModal)}
      >
        <p>{t('projects.deleteConfirmation')}</p>
      </Modal>
    </div>
  );
}
