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
} from '@carbon/react';
import { Add, View, Edit, TrashCan } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { useTranslation } from '@/lib/i18n/context';

interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  client_type?: string;
  notes?: string;
  created_at: string;
}

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  prospect: 'blue',
  archived: 'red',
};

export default function ClientsContent({ clients: initialClients }: { clients: Client[] }) {
  const { t } = useTranslation();

  const headers = [
    { key: 'name', header: t('clients.name') },
    { key: 'email', header: t('clients.email') },
    { key: 'phone', header: t('clients.phone') },
    { key: 'client_type', header: t('clients.type') },
    { key: 'status', header: t('clients.status') },
    { key: 'actions', header: t('clients.actions') },
  ];

  const typeLabels: Record<string, string> = {
    individual: t('clients.typeIndividual'),
    company: t('clients.typeCompany'),
    agency: t('clients.typeAgency'),
  };

  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteModal, setDeleteModal] = useState<string | null>(null);

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredClients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone || '-',
    client_type: typeLabels[client.client_type || 'individual'] || client.client_type,
    status: (
      <Tag type={statusColors[client.status] || 'gray'} size="sm">
        {client.status}
      </Tag>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription={t('common.edit')}
          renderIcon={Edit}
          onClick={() => {
            setEditingClient(client);
            setIsModalOpen(true);
          }}
        />
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription={t('common.delete')}
          renderIcon={TrashCan}
          onClick={() => setDeleteModal(client.id)}
        />
      </div>
    ),
  }));

  const handleSaveClient = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const supabase = createClient();

    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string || null,
      status: formData.get('status') as string,
      client_type: formData.get('client_type') as string,
      notes: formData.get('notes') as string || null,
    };

    if (editingClient) {
      const { data, error } = await supabase
        .from('clients')
        .update(clientData)
        .eq('id', editingClient.id)
        .select()
        .single();

      if (!error && data) {
        setClients(clients.map(c => c.id === data.id ? data : c));
      }
    } else {
      const { data, error } = await supabase
        .from('clients')
        .insert(clientData)
        .select()
        .single();

      if (!error && data) {
        setClients([data, ...clients]);
      }
    }

    setIsModalOpen(false);
    setEditingClient(null);
  };

  const handleDelete = async (id: string) => {
    const supabase = createClient();
    const { error } = await supabase.from('clients').delete().eq('id', id);

    if (!error) {
      setClients(clients.filter(c => c.id !== id));
    }
    setDeleteModal(null);
  };

  return (
    <div>
      <div className="page-header">
        <h1>{t('clients.title')}</h1>
        <p>{t('clients.subtitleWithCount', { count: clients.length })}</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder={t('clients.searchPlaceholder')}
                  onChange={(e: any) => setSearchTerm(e.target?.value || '')}
                />
                <Button
                  renderIcon={Add}
                  onClick={() => {
                    setEditingClient(null);
                    setIsModalOpen(true);
                  }}
                >
                  {t('clients.newClient')}
                </Button>
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
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

      {/* Modal de Criação/Edição */}
      <Modal
        open={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        modalHeading={editingClient ? t('clients.editClient') : t('clients.newClient')}
        primaryButtonText={t('common.save')}
        secondaryButtonText={t('common.cancel')}
        onRequestSubmit={() => {
          const form = document.getElementById('client-form') as HTMLFormElement;
          form?.requestSubmit();
        }}
      >
        <Form id="client-form" onSubmit={handleSaveClient}>
          <Stack gap={6}>
            <TextInput
              id="name"
              name="name"
              labelText={t('clients.name')}
              defaultValue={editingClient?.name}
              required
            />
            <TextInput
              id="email"
              name="email"
              labelText={t('clients.email')}
              type="email"
              defaultValue={editingClient?.email}
              required
            />
            <TextInput
              id="phone"
              name="phone"
              labelText={t('clients.phone')}
              defaultValue={editingClient?.phone || ''}
            />
            <Select
              id="client_type"
              name="client_type"
              labelText={t('clients.type')}
              defaultValue={editingClient?.client_type || 'individual'}
            >
              <SelectItem value="individual" text={t('clients.typeIndividual')} />
              <SelectItem value="company" text={t('clients.typeCompany')} />
              <SelectItem value="agency" text={t('clients.typeAgency')} />
            </Select>
            <Select
              id="status"
              name="status"
              labelText={t('clients.status')}
              defaultValue={editingClient?.status || 'active'}
            >
              <SelectItem value="active" text={t('clients.statusActive')} />
              <SelectItem value="inactive" text={t('clients.statusInactive')} />
              <SelectItem value="prospect" text={t('clients.statusProspect')} />
              <SelectItem value="archived" text={t('clients.statusArchived')} />
            </Select>
            <TextArea
              id="notes"
              name="notes"
              labelText={t('clients.notes')}
              defaultValue={editingClient?.notes || ''}
            />
          </Stack>
        </Form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        open={deleteModal !== null}
        onRequestClose={() => setDeleteModal(null)}
        modalHeading={t('clients.confirmDelete')}
        primaryButtonText={t('common.delete')}
        secondaryButtonText={t('common.cancel')}
        danger
        onRequestSubmit={() => deleteModal && handleDelete(deleteModal)}
      >
        <p>{t('clients.deleteConfirmation')}</p>
      </Modal>
    </div>
  );
}
