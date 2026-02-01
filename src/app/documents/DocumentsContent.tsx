'use client';

import { useState } from 'react';
import {
  DataTable, Table, TableHead, TableRow, TableHeader, TableBody, TableCell,
  TableContainer, TableToolbar, TableToolbarContent, TableToolbarSearch,
  Button, Tag, Modal, TextInput, Select, SelectItem, Form, Stack,
} from '@carbon/react';
import { Add, Download, DocumentPdf, DocumentBlank, Image } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Document } from '@/types/database';

const headers = [
  { key: 'name', header: 'Nome' },
  { key: 'client', header: 'Cliente' },
  { key: 'category', header: 'Categoria' },
  { key: 'type', header: 'Tipo' },
  { key: 'date', header: 'Data' },
  { key: 'actions', header: 'Ações' },
];

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
      <Button kind="ghost" size="sm" hasIconOnly iconDescription="Download" renderIcon={Download}
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
        <h1>Documentos</h1>
        <p>Gerencie documentos e arquivos</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch placeholder="Buscar..." onChange={(e: any) => setSearch(e.target?.value || '')} />
                <Button renderIcon={Add} onClick={() => setIsModalOpen(true)}>Novo Documento</Button>
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
        modalHeading="Novo Documento" primaryButtonText="Salvar" secondaryButtonText="Cancelar"
        onRequestSubmit={() => (document.getElementById('doc-form') as HTMLFormElement)?.requestSubmit()}>
        <Form id="doc-form" onSubmit={handleSave}>
          <Stack gap={6}>
            <TextInput id="name" name="name" labelText="Nome" required />
            <Select id="client_id" name="client_id" labelText="Cliente" required>
              <SelectItem value="" text="Selecione..." />
              {clients.map(c => <SelectItem key={c.id} value={c.id} text={c.name} />)}
            </Select>
            <Select id="category" name="category" labelText="Categoria">
              <SelectItem value="contract" text="Contrato" />
              <SelectItem value="invoice" text="Nota Fiscal" />
              <SelectItem value="proposal" text="Proposta" />
              <SelectItem value="briefing" text="Briefing" />
              <SelectItem value="other" text="Outro" />
            </Select>
            <TextInput id="file_url" name="file_url" labelText="URL do Arquivo" required />
            <Select id="file_type" name="file_type" labelText="Tipo">
              <SelectItem value="pdf" text="PDF" />
              <SelectItem value="doc" text="Word" />
              <SelectItem value="image" text="Imagem" />
              <SelectItem value="other" text="Outro" />
            </Select>
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
