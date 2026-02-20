'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Section,
  Heading,
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
  Tag,
  Modal,
  TextInput,
  Select,
  SelectItem,
  OverflowMenu,
  OverflowMenuItem,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  lastActive: string;
}

const initialMembers: TeamMember[] = [
  {
    id: '1',
    name: 'Olivia Martins',
    email: 'olivia.martins@acme.com',
    role: 'Admin',
    status: 'active',
    lastActive: '2026-02-19',
  },
  {
    id: '2',
    name: 'Carlos Rivera',
    email: 'carlos.rivera@acme.com',
    role: 'Editor',
    status: 'active',
    lastActive: '2026-02-18',
  },
  {
    id: '3',
    name: 'Amara Singh',
    email: 'amara.singh@acme.com',
    role: 'Editor',
    status: 'active',
    lastActive: '2026-02-17',
  },
  {
    id: '4',
    name: 'James Thompson',
    email: 'j.thompson@acme.com',
    role: 'Viewer',
    status: 'invited',
    lastActive: '—',
  },
  {
    id: '5',
    name: 'Mei Chen',
    email: 'mei.chen@acme.com',
    role: 'Editor',
    status: 'active',
    lastActive: '2026-02-16',
  },
  {
    id: '6',
    name: 'David Okafor',
    email: 'd.okafor@acme.com',
    role: 'Viewer',
    status: 'disabled',
    lastActive: '2026-01-05',
  },
];

const headers = [
  { key: 'name', header: 'Name' },
  { key: 'email', header: 'Email' },
  { key: 'role', header: 'Role' },
  { key: 'status', header: 'Status' },
  { key: 'lastActive', header: 'Last Active' },
  { key: 'actions', header: '' },
];

const statusTagType: Record<string, 'green' | 'blue' | 'gray'> = {
  active: 'green',
  invited: 'blue',
  disabled: 'gray',
};

const roleTagType: Record<string, 'red' | 'teal' | 'cool-gray'> = {
  Admin: 'red',
  Editor: 'teal',
  Viewer: 'cool-gray',
};

export default function TeamManagementPage() {
  const { t } = useTranslation();
  const [members] = useState<TeamMember[]>(initialMembers);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Viewer');

  const rows = members.map((m) => ({
    id: m.id,
    name: m.name,
    email: m.email,
    role: m.role,
    status: m.status,
    lastActive: m.lastActive,
    actions: '',
  }));

  const renderCell = (cell: any, row: any) => {
    if (cell.info.header === 'role') {
      return (
        <TableCell key={cell.id}>
          <Tag type={roleTagType[cell.value] || 'cool-gray'} size="sm">
            {cell.value}
          </Tag>
        </TableCell>
      );
    }
    if (cell.info.header === 'status') {
      return (
        <TableCell key={cell.id}>
          <Tag type={statusTagType[cell.value] || 'gray'} size="sm">
            {cell.value.charAt(0).toUpperCase() + cell.value.slice(1)}
          </Tag>
        </TableCell>
      );
    }
    if (cell.info.header === 'actions') {
      return (
        <TableCell key={cell.id}>
          <OverflowMenu flipped size="sm" aria-label={t('Actions')}>
            <OverflowMenuItem itemText={t('Edit Member')} />
            <OverflowMenuItem itemText={t('Remove Member')} hasDivider isDelete />
          </OverflowMenu>
        </TableCell>
      );
    }
    return <TableCell key={cell.id}>{cell.value}</TableCell>;
  };

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Team Management')}
          </Heading>
        </Section>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers}>
          {({
            rows: tableRows,
            headers: tableHeaders,
            getTableProps,
            getHeaderProps,
            getRowProps,
          }: {
            rows: any[];
            headers: any[];
            getTableProps: () => any;
            getHeaderProps: (args: { header: any }) => any;
            getRowProps: (args: { row: any }) => any;
          }) => (
            <TableContainer title={t('Team Members')}>
              <TableToolbar>
                <TableToolbarContent>
                  <Button
                    renderIcon={Add}
                    size="sm"
                    onClick={() => setIsModalOpen(true)}
                  >
                    {t('Invite Member')}
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => {
                      const headerProps = getHeaderProps({ header });
                      return (
                        <TableHeader key={header.key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row: any) => {
                    const rowProps = getRowProps({ row });
                    return (
                      <TableRow key={row.id} {...rowProps}>
                        {row.cells.map((cell: any) => renderCell(cell, row))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Column>

      {/* Invite Modal */}
      <Modal
        open={isModalOpen}
        modalHeading={t('Invite Team Member')}
        primaryButtonText={t('Send Invitation')}
        secondaryButtonText={t('Cancel')}
        onRequestClose={() => setIsModalOpen(false)}
        onRequestSubmit={() => {
          setIsModalOpen(false);
          setInviteEmail('');
          setInviteRole('Viewer');
        }}
      >
        <div style={{ marginBottom: '1rem' }}>
          <TextInput
            id="invite-email"
            labelText={t('Email Address')}
            placeholder="name@company.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />
        </div>
        <div>
          <Select
            id="invite-role"
            labelText={t('Role')}
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <SelectItem value="Admin" text={t('Admin')} />
            <SelectItem value="Editor" text={t('Editor')} />
            <SelectItem value="Viewer" text={t('Viewer')} />
          </Select>
        </div>
      </Modal>
    </Grid>
  );
}
