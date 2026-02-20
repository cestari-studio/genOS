'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
  Modal,
  TextInput,
  Select,
  SelectItem,
  OverflowMenu,
  OverflowMenuItem,
  Pagination,
} from '@carbon/react';
import { UserMultiple, Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'SysAdmin' | 'Agency' | 'Tenant-Admin' | 'Tenant-User';
  status: 'active' | 'invited' | 'disabled';
  lastLogin: string;
  org: string;
}

const users: User[] = [
  { id: '1', name: 'Octavio Cestari', email: 'octavio@cestari.studio', role: 'SysAdmin', status: 'active', lastLogin: '2026-02-19 14:30', org: 'Cestari Studio' },
  { id: '2', name: 'Ana Silva', email: 'ana@agencia.com', role: 'Agency', status: 'active', lastLogin: '2026-02-19 12:15', org: 'Agência Digital' },
  { id: '3', name: 'Carlos Mendes', email: 'carlos@acme.com', role: 'Tenant-Admin', status: 'active', lastLogin: '2026-02-18 16:45', org: 'Acme Corp' },
  { id: '4', name: 'Maria Santos', email: 'maria@beta.com', role: 'Tenant-User', status: 'active', lastLogin: '2026-02-18 10:20', org: 'Beta Inc' },
  { id: '5', name: 'João Lima', email: 'joao@gamma.com', role: 'Tenant-Admin', status: 'invited', lastLogin: '—', org: 'Gamma LLC' },
  { id: '6', name: 'Laura Costa', email: 'laura@agencia.com', role: 'Agency', status: 'active', lastLogin: '2026-02-17 09:30', org: 'Agência Digital' },
  { id: '7', name: 'Pedro Alves', email: 'pedro@delta.com', role: 'Tenant-User', status: 'disabled', lastLogin: '2026-01-15 14:00', org: 'Delta Co' },
  { id: '8', name: 'Fernanda Reis', email: 'fernanda@cestari.studio', role: 'SysAdmin', status: 'active', lastLogin: '2026-02-19 11:00', org: 'Cestari Studio' },
  { id: '9', name: 'Ricardo Nunes', email: 'ricardo@epsilon.com', role: 'Tenant-User', status: 'invited', lastLogin: '—', org: 'Epsilon Ltd' },
  { id: '10', name: 'Beatriz Oliveira', email: 'beatriz@zeta.com', role: 'Tenant-Admin', status: 'active', lastLogin: '2026-02-16 08:45', org: 'Zeta Corp' },
];

const roleColors: Record<string, 'red' | 'blue' | 'purple' | 'teal'> = {
  SysAdmin: 'red',
  Agency: 'blue',
  'Tenant-Admin': 'purple',
  'Tenant-User': 'teal',
};

const statusColors: Record<string, 'green' | 'cyan' | 'gray'> = {
  active: 'green',
  invited: 'cyan',
  disabled: 'gray',
};

const headers = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'org', header: 'Organization' },
  { key: 'status', header: 'Status' },
  { key: 'lastLogin', header: 'Last Login' },
  { key: 'actions', header: '' },
];

export default function AdminUsersPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [inviteOpen, setInviteOpen] = useState(false);
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const filtered = users.filter(u =>
    !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.includes(search)
  );

  const rows = filtered.map(u => ({
    id: u.id, name: u.name, email: u.email, role: u.role, org: u.org, status: u.status, lastLogin: u.lastLogin, actions: '',
  }));

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <UserMultiple size={20} />
          <h1 style={{ margin: 0 }}>User Management</h1>
        </div>
        <p>Manage platform users across all organizations and roles</p>
      </div>

      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Total Users</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{users.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Active</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>
              {users.filter(u => u.status === 'active').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Pending Invites</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-link-primary)' }}>
              {users.filter(u => u.status === 'invited').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Organizations</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{new Set(users.map(u => u.org)).size}</p>
          </Tile>
        </Column>
      </Grid>

      <Tile style={{ padding: 0 }}>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e: any) => setSearch(e.target?.value || '')} />
                  <Button renderIcon={Add} size="sm" onClick={() => setInviteOpen(true)}>
                    Invite User
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
                  {rows.map((row) => {
                    const user = filtered.find(u => u.id === row.id)!;
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        <TableCell><strong>{user.name}</strong></TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell><Tag type={roleColors[user.role]} size="sm">{user.role}</Tag></TableCell>
                        <TableCell>{user.org}</TableCell>
                        <TableCell><Tag type={statusColors[user.status]} size="sm">{user.status}</Tag></TableCell>
                        <TableCell><span style={{ fontSize: '0.8125rem', fontFamily: 'monospace' }}>{user.lastLogin}</span></TableCell>
                        <TableCell>
                          <OverflowMenu size="sm" flipped>
                            <OverflowMenuItem itemText="Edit Role" />
                            <OverflowMenuItem itemText="Reset Password" />
                            <OverflowMenuItem itemText={user.status === 'disabled' ? 'Enable' : 'Disable'} />
                            <OverflowMenuItem itemText="Remove" hasDivider isDelete />
                          </OverflowMenu>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
        <Pagination totalItems={filtered.length} pageSize={pageSize} pageSizes={[8, 16]} page={page} onChange={({ page: p }: any) => setPage(p)} />
      </Tile>

      <Modal
        open={inviteOpen}
        onRequestClose={() => setInviteOpen(false)}
        modalHeading="Invite User"
        primaryButtonText="Send Invite"
        secondaryButtonText="Cancel"
      >
        <TextInput id="invite-email" labelText="Email Address" placeholder="user@company.com" style={{ marginBottom: '1rem' }} />
        <Select id="invite-role" labelText="Role" defaultValue="Tenant-User">
          <SelectItem value="SysAdmin" text="SysAdmin" />
          <SelectItem value="Agency" text="Agency" />
          <SelectItem value="Tenant-Admin" text="Tenant-Admin" />
          <SelectItem value="Tenant-User" text="Tenant-User" />
        </Select>
        <TextInput id="invite-org" labelText="Organization" placeholder="Organization name" style={{ marginTop: '1rem' }} />
      </Modal>
    </div>
  );
}
