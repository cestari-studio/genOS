'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch,
  Button, Tag, Modal, TextInput, Select, SelectItem, Form, Stack,
} from '@carbon/react';
import { Add, Download, DocumentPdf, DocumentBlank, Image } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Document } from '@/types/database';


const getFileIcon = (type?: string) => {
  if (type?.includes('pdf')) return <DocumentPdf />;
  if (type?.includes('image')) return <Image />;
  return <DocumentBlank />;
};

interface Props {
  documents: (Document & { client?: { name: string } })[];
  clients: { id: string; name: string }[];
}

export default function DocumentsContent({ documents: initial, clients }: Props) {
  const [documents, setDocuments] = useState(initial);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { t } = useTranslation();

  const headers = [
    { key: 'name', header: t('documents.name') },
    { key: 'client', header: t('documents.client') },
    { key: 'category', header: t('documents.category') },
    { key: 'type', header: t('documents.type') },
    { key: 'date', header: t('documents.date') },
    { key: 'actions', header: t('documents.actions') },
  ];

  const filtered = documents.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    (d.client?.name?.toLowerCase() || '').includes(search.toLowerCase())
  );

  const rows = filtered.map(d => ({
    id: d.id,
    name: (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        {getFileIcon(d.mime_type)}
        {d.name}
      </div>
    ),
    client: d.client?.name || '-',
    category: d.category || '-',
    type: d.file_type || '-',
    date: new Date(d.created_at).toLocaleDateString('pt-BR'),
    actions: (
      <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('media.download')} renderIcon={Download}
        onClick={() => window.open(d.file_url, '_blank')} />
    ),
  }));

  const handleSave = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();
    
    const data = {
      name: formData.get('name') as string,
      client_id: formData.get('client_id') as string,
      category: formData.get('category') as string,
      file_url: formData.get('file_url') as string,
      file_type: formData.get('file_type') as string,
    };

    const { data: created } = await supabase.from('documents').insert(data)
      .select('*, client:clients(id, name)').single();
    if (created) setDocuments([created, ...documents]);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('documents.title')}</h1>
        <p>{t('documents.subtitle')}</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder={t('documents.searchPlaceholder')} onChange={(e: any) => setSearch(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => setIsModalOpen(true)}>{t('documents.newDocument')}</Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead><TableRow>{headers.map(h => <TableHeader {...getHeaderProps({ header: h })}>{h.header}</TableHeader>)}</TableRow></TableHead>
              <TableBody>{rows.map(row => <TableRow {...getRowProps({ row })}>{row.cells.map(cell => <TableCell key={cell.id}>{cell.value}</TableCell>)}</TableRow>)}</TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Modal open={isModalOpen} onRequestClose={() => setIsModalOpen(false)}
        modalHeading={t('documents.newDocument')} primaryButtonText={t('common.save')} secondaryButtonText={t('common.cancel')}
        onRequestSubmit={() => (document.getElementById('doc-form') as HTMLFormElement)?.requestSubmit()}>
        <Form id="doc-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="name" name="name" labelText={t('documents.name')} required />
            <Select id="client_id" name="client_id" labelText={t('documents.client')} required>
              <SelectItem value="" text={t('common.select')} />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="category" name="category" labelText={t('documents.category')}>
              <SelectItem value="contract" text={t('documents.categoryContract')} />
              <SelectItem value="invoice" text={t('documents.categoryInvoice')} />
              <SelectItem value="proposal" text={t('documents.categoryProposal')} />
              <SelectItem value="briefing" text={t('documents.categoryBriefing')} />
              <SelectItem value="other" text={t('documents.categoryOther')} />
            </Select>
            <TextInput id="file_url" name="file_url" labelText={t('documents.fileUrl')} required />
            <Select id="file_type" name="file_type" labelText={t('documents.fileType')}>
              <SelectItem value="pdf" text={t('documents.typePdf')} />
              <SelectItem value="doc" text={t('documents.typeDoc')} />
              <SelectItem value="image" text={t('documents.typeImage')} />
              <SelectItem value="other" text={t('documents.typeOther')} />
            </Select>
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
