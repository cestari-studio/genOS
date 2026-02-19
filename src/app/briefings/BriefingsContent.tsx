'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch,
  Button, Tag, Modal, TextInput, Select, SelectItem, Form, Stack, TextArea,
} from '@carbon/react';
import { Add, View, Edit } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Briefing } from '@/types/database';

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
  const { t } = useTranslation();

  const headers = [
    { key: 'title', header: t('briefings.headerTitle') },
    { key: 'client', header: t('briefings.client') },
    { key: 'type', header: t('briefings.type') },
    { key: 'status', header: t('briefings.status') },
    { key: 'date', header: t('briefings.date') },
    { key: 'actions', header: t('briefings.actions') },
  ];

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
        <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.view')} renderIcon={View} />
        <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.edit')} renderIcon={Edit}
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
        <h1>{t('briefings.title')}</h1>
        <p>{t('briefings.subtitle')}</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder={t('briefings.searchPlaceholder')} onChange={(e: any) => setSearch(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => { setEditing(null); setIsModalOpen(true); }}>{t('briefings.newBriefing')}</Button>
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
        modalHeading={editing ? t('briefings.editBriefing') : t('briefings.newBriefing')} primaryButtonText={t('common.save')} secondaryButtonText={t('common.cancel')}
        onRequestSubmit={() => (document.getElementById('briefing-form') as HTMLFormElement)?.requestSubmit()}>
        <Form id="briefing-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="title" name="title" labelText={t('briefings.headerTitle')} defaultValue={editing?.title} required />
            <Select id="client_id" name="client_id" labelText={t('briefings.client')} defaultValue={editing?.client_id || ''} required>
              <SelectItem value="" text={t('common.select')} />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="briefing_type" name="briefing_type" labelText={t('briefings.type')} defaultValue={editing?.briefing_type || 'general'}>
              <SelectItem value="general" text={t('briefings.typeGeneral')} />
              <SelectItem value="branding" text={t('briefings.typeBranding')} />
              <SelectItem value="social_media" text={t('briefings.typeSocialMedia')} />
              <SelectItem value="website" text={t('briefings.typeWebsite')} />
              <SelectItem value="photography" text={t('briefings.typePhotography')} />
            </Select>
            <Select id="status" name="status" labelText={t('briefings.status')} defaultValue={editing?.status || 'draft'}>
              <SelectItem value="draft" text={t('briefings.statusDraft')} />
              <SelectItem value="submitted" text={t('briefings.statusSubmitted')} />
              <SelectItem value="reviewed" text={t('briefings.statusReviewed')} />
              <SelectItem value="approved" text={t('briefings.statusApproved')} />
            </Select>
            <TextArea id="notes" name="notes" labelText={t('briefings.notes')} defaultValue={editing?.form_data?.notes || ''} />
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
