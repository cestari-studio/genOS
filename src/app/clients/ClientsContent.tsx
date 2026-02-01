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
} from '@carbon/react';
import { Add, View, Edit } from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import type { Client } from '@/types/database';

const headers = [
  { key: 'name', header: 'Nome' },
  { key: 'email', header: 'Email' },
  { key: 'company', header: 'Empresa' },
  { key: 'phone', header: 'Telefone' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Ações' },
];

const statusColors: Record<string, 'green' | 'gray' | 'blue' | 'red'> = {
  active: 'green',
  inactive: 'gray',
  prospect: 'blue',
  churned: 'red',
};

export default function ClientsContent({ clients: initialClients }: { clients: Client[] }) {
  const [clients, setClients] = useState(initialClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.company?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  const rows = filteredClients.map(client => ({
    id: client.id,
    name: client.name,
    email: client.email,
    company: client.company || '-',
    phone: client.phone || '-',
    status: (
      <Tag type={statusColors[client.status]} size="sm">
        {client.status}
      </Tag>
    ),
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription="Ver"
          renderIcon={View}
          onClick={() => window.location.href = `/clients/${client.id}`}
        />
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
      phone: formData.get('phone') as string,
      company: formData.get('company') as string,
      status: formData.get('status') as string,
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

  return (
    <div>
      <div className="page-header">
        <h1>Clientes</h1>
        <p>Gerencie seus clientes e prospects</p>
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
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
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
        onRequestClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        modalHeading={editingClient ? 'Editar Cliente' : 'Novo Cliente'}
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
        onRequestSubmit={(e) => {
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
            <TextInput
              id="company"
              name="company"
              labelText="Empresa"
              defaultValue={editingClient?.company || ''}
            />
            <Select
              id="status"
              name="status"
              labelText="Status"
              defaultValue={editingClient?.status || 'prospect'}
            >
              <SelectItem value="prospect" text="Prospect" />
              <SelectItem value="active" text="Ativo" />
              <SelectItem value="inactive" text="Inativo" />
              <SelectItem value="churned" text="Churned" />
            </Select>
          </Stack>
        </Form>
      </Modal>
    </div>
  );
}
