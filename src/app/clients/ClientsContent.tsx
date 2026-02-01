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

const headers = [
  { key: 'name', header: 'Nome' },
  { key: 'email', header: 'Email' },
  { key: 'phone', header: 'Telefone' },
  { key: 'client_type', header: 'Tipo' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Ações' },
];

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  prospect: 'blue',
  archived: 'red',
};

const typeLabels: Record<string, string> = {
  individual: 'Pessoa Física',
  company: 'Empresa',
  agency: 'Agência',
};

export default function ClientsContent({ clients: initialClients }: { clients: Client[] }) {
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
          iconDescription="Editar"
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
          iconDescription="Excluir"
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
        <h1>Clientes</h1>
        <p>Gerencie seus clientes e prospects ({clients.length} total)</p>
      </div>

      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  placeholder="Buscar clientes..."
                  onChange={(e: any) => setSearchTerm(e.target?.value || '')}
                />
                <Button
                  renderIcon={Add}
                  onClick={() => {
                    setEditingClient(null);
                    setIsModalOpen(true);
                  }}
                >
                  Novo Cliente
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
        modalHeading={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
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
              labelText="Nome"
              defaultValue={editingClient?.name}
              required
            />
            <TextInput
              id="email"
              name="email"
              labelText="Email"
              type="email"
              defaultValue={editingClient?.email}
              required
            />
            <TextInput
              id="phone"
              name="phone"
              labelText="Telefone"
              defaultValue={editingClient?.phone || ''}
            />
            <Select
              id="client_type"
              name="client_type"
              labelText="Tipo"
              defaultValue={editingClient?.client_type || 'individual'}
            >
              <SelectItem value="individual" text="Pessoa Física" />
              <SelectItem value="company" text="Empresa" />
              <SelectItem value="agency" text="Agência" />
            </Select>
            <Select
              id="status"
              name="status"
              labelText="Status"
              defaultValue={editingClient?.status || 'active'}
            >
              <SelectItem value="active" text="Ativo" />
              <SelectItem value="inactive" text="Inativo" />
              <SelectItem value="prospect" text="Prospect" />
              <SelectItem value="archived" text="Arquivado" />
            </Select>
            <TextArea
              id="notes"
              name="notes"
              labelText="Observações"
              defaultValue={editingClient?.notes || ''}
            />
          </Stack>
        </Form>
      </Modal>

      {/* Modal de Confirmação de Exclusão */}
      <Modal
        open={deleteModal !== null}
        onRequestClose={() => setDeleteModal(null)}
        modalHeading="Confirmar Exclusão"
        primaryButtonText="Excluir"
        secondaryButtonText="Cancelar"
        danger
        onRequestSubmit={() => deleteModal && handleDelete(deleteModal)}
      >
        <p>Tem certeza que deseja excluir este cliente? Esta ação não pode ser desfeita.</p>
      </Modal>
    </div>
  );
}
