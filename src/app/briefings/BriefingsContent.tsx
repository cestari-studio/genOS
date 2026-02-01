'use client';

import { useState } from 'react';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch,
  Button, Tag, Modal, TextInput, Select, SelectItem, Form, Stack, TextArea,
} from '@carbon/react';
import { Add, View, Edit } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Briefing } from '@/types/database';

const headers = [
  { key: 'title', header: 'Título' },
  { key: 'client', header: 'Cliente' },
  { key: 'type', header: 'Tipo' },
  { key: 'status', header: 'Status' },
  { key: 'date', header: 'Data' },
  { key: 'actions', header: 'Ações' },
];

const statusColors: Record<string, 'gray' | 'blue' | 'cyan' | 'green'> = {
  draft: 'gray',
  submitted: 'blue',
  reviewed: 'cyan',
  approved: 'green',
};

interface Props {
  briefings: (Briefing & { client?: { name: string } })[];
  clients: { id: string; name: string }[];
}

export default function BriefingsContent({ briefings: initial, clients }: Props) {
  const [briefings, setBriefings] = useState(initial);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Briefing | null>(null);
  const [search, setSearch] = useState('');

  const filtered = briefings.filter(b => 
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    (b.client?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const rows = filtered.map(b => ({
    id: b.id,
    title: b.title,
    client: b.client?.name || '-',
    type: b.briefing_type,
    status: <Tag type={statusColors[b.status]} size="sm">{b.status}</Tag>,
    date: new Date(b.created_at).toLocaleDateString('pt-BR'),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Ver" renderIcon={View} />
        <Button kind="ghost" size="sm" hasIconOnly iconDescription="Editar" renderIcon={Edit}
          onClick={() => { setEditing(b); setIsModalOpen(true); }} />
      </div>
    ),
  }));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    
    const data = {
      title: formData.get('title') as string,
      client_id: formData.get('client_id') as string,
      briefing_type: formData.get('briefing_type') as string,
      status: formData.get('status') as string,
      form_data: { notes: formData.get('notes') },
    };

    if (editing) {
      const { data: updated } = await supabase.from('briefings').update(data).eq('id', editing.id)
        .select('*, client:clients(id, name)').single();
      if (updated) setBriefings(briefings.map(b => b.id === updated.id ? updated : b));
    } else {
      const { data: created } = await supabase.from('briefings').insert(data)
        .select('*, client:clients(id, name)').single();
      if (created) setBriefings([created, ...briefings]);
    }
    setIsModalOpen(false);
    setEditing(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Briefings</h1>
        <p>Gerencie briefings de projetos</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder="Buscar..." onChange={(e: any) => setSearch(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => { setEditing(null); setIsModalOpen(true); }}>Novo Briefing</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead><TableRow>{headers.map(h => <TableHeader {...getHeaderProps({ header: h })}>{h.header}</TableHeader>)}</TableRow></TableHead>
              <TableBody>{rows.map(row => <TableRow {...getRowProps({ row })}>{row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}</TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal open={isModalOpen} onRequestClose={() => { setIsModalOpen(false); setEditing(null); }}
        modalHeading={editing ? 'Editar Briefing' : 'Novo Briefing'} primaryButtonText="Salvar" secondaryButtonText="Cancelar"
        onRequestSubmit={() => (document.getElementById('briefing-form') as HTMLFormElement)?.requestSubmit()}>
        <Form id="briefing-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="title" name="title" labelText="Título" defaultValue={editing?.title} required />
            <Select id="client_id" name="client_id" labelText="Cliente" defaultValue={editing?.client_id || ''} required>
              <SelectItem value="" text="Selecione..." />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="briefing_type" name="briefing_type" labelText="Tipo" defaultValue={editing?.briefing_type || 'general'}>
              <SelectItem value="general" text="Geral" />
              <SelectItem value="branding" text="Branding" />
              <SelectItem value="social_media" text="Social Media" />
              <SelectItem value="website" text="Website" />
              <SelectItem value="photography" text="Fotografia" />
            </Select>
            <Select id="status" name="status" labelText="Status" defaultValue={editing?.status || 'draft'}>
              <SelectItem value="draft" text="Rascunho" />
              <SelectItem value="submitted" text="Enviado" />
              <SelectItem value="reviewed" text="Revisado" />
              <SelectItem value="approved" text="Aprovado" />
            </Select>
            <TextArea id="notes" name="notes" labelText="Notas" defaultValue={editing?.form_data?.notes || ''} />
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
