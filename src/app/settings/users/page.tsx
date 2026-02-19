'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Search,
  Select,
  SelectItem,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
  Modal,
  TextInput,
  Breadcrumb,
  BreadcrumbItem,
  InlineNotification,
  Toggle,
} from '@carbon/react';
import {
  Add,
  UserAvatar,
  Edit,
  TrashCan,
  Send,
  Checkmark,
  Close,
  Warning,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase Auth

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  avatar?: string;
  lastActive: string;
  createdAt: string;
}

const users: User[] = [
  { id: '1', name: 'Octavio Cestari', email: 'mail@cestari.studio', role: 'admin', status: 'active', lastActive: '2024-02-19 10:30', createdAt: '2024-01-01' },
  { id: '2', name: 'João Silva', email: 'joao@cestari.studio', role: 'manager', status: 'active', lastActive: '2024-02-19 09:45', createdAt: '2024-01-15' },
  { id: '3', name: 'Maria Santos', email: 'maria@cestari.studio', role: 'member', status: 'active', lastActive: '2024-02-18 18:00', createdAt: '2024-01-20' },
  { id: '4', name: 'Carlos Oliveira', email: 'carlos@cestari.studio', role: 'member', status: 'active', lastActive: '2024-02-19 08:30', createdAt: '2024-02-01' },
  { id: '5', name: 'Ana Costa', email: 'ana@cestari.studio', role: 'viewer', status: 'pending', lastActive: '-', createdAt: '2024-02-15' },
];

const roleConfig = {
  admin: { label: 'Administrador', color: 'red', permissions: 'Acesso total ao sistema' },
  manager: { label: 'Gerente', color: 'purple', permissions: 'Gerencia projetos e equipe' },
  member: { label: 'Membro', color: 'blue', permissions: 'Acesso a projetos atribuídos' },
  viewer: { label: 'Visualizador', color: 'gray', permissions: 'Apenas visualização' },
} as const;

const statusConfig = {
  active: { label: 'Ativo', color: 'green' },
  pending: { label: 'Pendente', color: 'orange' },
  inactive: { label: 'Inativo', color: 'gray' },
} as const;

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    return matchesSearch && matchesRole;
  });

  const handleInvite = () => {
    setInviteSent(true);
    setIsInviteModalOpen(false);
    setTimeout(() => setInviteSent(false), 3000);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };

  // Métricas
  const activeUsers = users.filter(u => u.status === 'active').length;
  const pendingUsers = users.filter(u => u.status === 'pending').length;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/settings">Configurações</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Usuários</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Gerenciar Usuários</h1>
          <p style={{ color: '#525252', margin: '0.25rem 0 0' }}>Gerencie sua equipe e permissões</p>
        </div>
        <Button size="sm" renderIcon={Add} onClick={() => setIsInviteModalOpen(true)}>
          Convidar Usuário
        </Button>
      </div>

      {inviteSent && (
        <InlineNotification
          kind="success"
          title="Convite enviado!"
          subtitle="O usuário receberá um email com instruções de acesso."
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Total de Usuários</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{users.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Ativos</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#24a148' }}>{activeUsers}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Convites Pendentes</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#ff832b' }}>{pendingUsers}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: '#525252', marginBottom: '0.5rem' }}>Administradores</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
              {users.filter(u => u.role === 'admin').length}
            </p>
          </Tile>
        </Column>
      </Grid>

      {/* Filters */}
      <Tile style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Search
              size="sm"
              placeholder="Buscar usuários..."
              labelText="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-role" size="sm" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todas as funções" />
            <SelectItem value="admin" text="Administrador" />
            <SelectItem value="manager" text="Gerente" />
            <SelectItem value="member" text="Membro" />
            <SelectItem value="viewer" text="Visualizador" />
          </Select>
        </div>
      </Tile>

      {/* Users List */}
      <Tile style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #e0e0e0', background: '#f4f4f4' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Usuário</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Função</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>Última Atividade</th>
              <th style={{ padding: '1rem', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid #e0e0e0' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: '#e0e0e0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <UserAvatar size={24} />
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: '#525252' }}>{user.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Tag type={roleConfig[user.role].color as any} size="sm">
                    {roleConfig[user.role].label}
                  </Tag>
                </td>
                <td style={{ padding: '1rem' }}>
                  <Tag type={statusConfig[user.status].color as any} size="sm">
                    {statusConfig[user.status].label}
                  </Tag>
                </td>
                <td style={{ padding: '1rem', color: '#525252' }}>
                  {user.lastActive === '-' ? 'Nunca' : user.lastActive}
                </td>
                <td style={{ padding: '1rem' }}>
                  <OverflowMenu size="sm" flipped>
                    <OverflowMenuItem itemText="Editar" onClick={() => handleEditUser(user)} />
                    <OverflowMenuItem itemText="Redefinir Senha" />
                    {user.status === 'pending' && <OverflowMenuItem itemText="Reenviar Convite" />}
                    {user.status === 'active' && <OverflowMenuItem itemText="Desativar" />}
                    {user.status === 'inactive' && <OverflowMenuItem itemText="Reativar" />}
                    <OverflowMenuItem itemText="Remover" hasDivider isDelete />
                  </OverflowMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Tile>

      {/* Invite Modal */}
      <Modal
        open={isInviteModalOpen}
        onRequestClose={() => setIsInviteModalOpen(false)}
        modalHeading="Convidar Usuário"
        primaryButtonText="Enviar Convite"
        secondaryButtonText="Cancelar"
        onRequestSubmit={handleInvite}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            id="invite-email"
            labelText="Email"
            type="email"
            placeholder="usuario@empresa.com"
          />
          <TextInput
            id="invite-name"
            labelText="Nome (opcional)"
            placeholder="Nome do usuário"
          />
          <Select id="invite-role" labelText="Função">
            <SelectItem value="member" text="Membro" />
            <SelectItem value="manager" text="Gerente" />
            <SelectItem value="viewer" text="Visualizador" />
            <SelectItem value="admin" text="Administrador" />
          </Select>
          <div style={{ background: '#f4f4f4', padding: '1rem', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 0.5rem' }}>Permissões:</h5>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: '#525252', fontSize: '0.875rem' }}>
              <li>Administrador: Acesso total ao sistema</li>
              <li>Gerente: Gerencia projetos e equipe</li>
              <li>Membro: Acesso a projetos atribuídos</li>
              <li>Visualizador: Apenas visualização</li>
            </ul>
          </div>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        open={isEditModalOpen}
        onRequestClose={() => {
          setIsEditModalOpen(false);
          setSelectedUser(null);
        }}
        modalHeading="Editar Usuário"
        primaryButtonText="Salvar"
        secondaryButtonText="Cancelar"
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextInput
              id="edit-name"
              labelText="Nome"
              defaultValue={selectedUser.name}
            />
            <TextInput
              id="edit-email"
              labelText="Email"
              type="email"
              defaultValue={selectedUser.email}
            />
            <Select id="edit-role" labelText="Função" defaultValue={selectedUser.role}>
              <SelectItem value="member" text="Membro" />
              <SelectItem value="manager" text="Gerente" />
              <SelectItem value="viewer" text="Visualizador" />
              <SelectItem value="admin" text="Administrador" />
            </Select>
            <Toggle
              id="edit-status"
              labelText="Status"
              labelA="Inativo"
              labelB="Ativo"
              defaultToggled={selectedUser.status === 'active'}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
