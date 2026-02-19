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
import { useTranslation } from '@/lib/i18n/context';

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

export default function UsersPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [inviteSent, setInviteSent] = useState(false);

  const roleConfig = {
    admin: { label: t('users.roleAdmin'), color: 'red', permissions: t('users.permAdmin') },
    manager: { label: t('users.roleManager'), color: 'purple', permissions: t('users.permManager') },
    member: { label: t('users.roleMember'), color: 'blue', permissions: t('users.permMember') },
    viewer: { label: t('users.roleViewer'), color: 'gray', permissions: t('users.permViewer') },
  };

  const statusConfig = {
    active: { label: t('users.statusActive'), color: 'green' },
    pending: { label: t('users.statusPending'), color: 'orange' },
    inactive: { label: t('users.statusInactive'), color: 'gray' },
  };

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
        <BreadcrumbItem href="/settings">{t('settings.title')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('users.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('users.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{t('users.subtitle')}</p>
        </div>
        <Button size="sm" renderIcon={Add} onClick={() => setIsInviteModalOpen(true)}>
          {t('users.inviteUser')}
        </Button>
      </div>

      {inviteSent && (
        <InlineNotification
          kind="success"
          title={t('users.inviteSent')}
          subtitle={t('users.inviteSentSubtitle')}
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('users.totalUsers')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{users.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('users.active')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>{activeUsers}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('users.pendingInvites')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-warning)' }}>{pendingUsers}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('users.admins')}</h4>
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
              placeholder={t('users.searchPlaceholder')}
              labelText="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-role" size="sm" value={filterRole} onChange={(e) => setFilterRole(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('users.allRoles')} />
            <SelectItem value="admin" text={t('users.roleAdmin')} />
            <SelectItem value="manager" text={t('users.roleManager')} />
            <SelectItem value="member" text={t('users.roleMember')} />
            <SelectItem value="viewer" text={t('users.roleViewer')} />
          </Select>
        </div>
      </Tile>

      {/* Users List */}
      <Tile style={{ padding: 0 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)', background: 'var(--cds-background)' }}>
              <th style={{ padding: '1rem', textAlign: 'left' }}>{t('users.user')}</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>{t('users.role')}</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>{t('users.status')}</th>
              <th style={{ padding: '1rem', textAlign: 'left' }}>{t('users.lastActivity')}</th>
              <th style={{ padding: '1rem', width: '50px' }}></th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map(user => (
              <tr key={user.id} style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '50%',
                      background: 'var(--cds-layer-accent-01)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <UserAvatar size={24} />
                    </div>
                    <div>
                      <strong>{user.name}</strong>
                      <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{user.email}</div>
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
                <td style={{ padding: '1rem', color: 'var(--cds-text-secondary)' }}>
                  {user.lastActive === '-' ? t('users.never') : user.lastActive}
                </td>
                <td style={{ padding: '1rem' }}>
                  <OverflowMenu size="sm" flipped>
                    <OverflowMenuItem itemText={t('common.edit')} onClick={() => handleEditUser(user)} />
                    <OverflowMenuItem itemText={t('users.resetPassword')} />
                    {user.status === 'pending' && <OverflowMenuItem itemText={t('users.resendInvite')} />}
                    {user.status === 'active' && <OverflowMenuItem itemText={t('users.deactivate')} />}
                    {user.status === 'inactive' && <OverflowMenuItem itemText={t('users.reactivate')} />}
                    <OverflowMenuItem itemText={t('common.delete')} hasDivider isDelete />
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
        modalHeading={t('users.inviteUser')}
        primaryButtonText={t('users.sendInvite')}
        secondaryButtonText={t('common.cancel')}
        onRequestSubmit={handleInvite}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <TextInput
            id="invite-email"
            labelText={t('users.email')}
            type="email"
            placeholder="usuario@empresa.com"
          />
          <TextInput
            id="invite-name"
            labelText={t('users.nameOptional')}
            placeholder={t('users.namePlaceholder')}
          />
          <Select id="invite-role" labelText={t('users.role')}>
            <SelectItem value="member" text={t('users.roleMember')} />
            <SelectItem value="manager" text={t('users.roleManager')} />
            <SelectItem value="viewer" text={t('users.roleViewer')} />
            <SelectItem value="admin" text={t('users.roleAdmin')} />
          </Select>
          <div style={{ background: 'var(--cds-background)', padding: '1rem', borderRadius: '4px' }}>
            <h5 style={{ margin: '0 0 0.5rem' }}>{t('users.permissions')}:</h5>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
              <li>{t('users.roleAdmin')}: {t('users.permAdmin')}</li>
              <li>{t('users.roleManager')}: {t('users.permManager')}</li>
              <li>{t('users.roleMember')}: {t('users.permMember')}</li>
              <li>{t('users.roleViewer')}: {t('users.permViewer')}</li>
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
        modalHeading={t('users.editUser')}
        primaryButtonText={t('common.save')}
        secondaryButtonText={t('common.cancel')}
      >
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <TextInput
              id="edit-name"
              labelText={t('users.name')}
              defaultValue={selectedUser.name}
            />
            <TextInput
              id="edit-email"
              labelText={t('users.email')}
              type="email"
              defaultValue={selectedUser.email}
            />
            <Select id="edit-role" labelText={t('users.role')} defaultValue={selectedUser.role}>
              <SelectItem value="member" text={t('users.roleMember')} />
              <SelectItem value="manager" text={t('users.roleManager')} />
              <SelectItem value="viewer" text={t('users.roleViewer')} />
              <SelectItem value="admin" text={t('users.roleAdmin')} />
            </Select>
            <Toggle
              id="edit-status"
              labelText={t('users.status')}
              labelA={t('users.statusInactive')}
              labelB={t('users.statusActive')}
              defaultToggled={selectedUser.status === 'active'}
            />
          </div>
        )}
      </Modal>
    </div>
  );
}
