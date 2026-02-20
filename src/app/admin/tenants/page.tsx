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
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  Button,
  Tag,
  Pagination,
  OverflowMenu,
  OverflowMenuItem,
} from '@carbon/react';
import {
  Enterprise,
  Add,
  Settings,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Tenant {
  id: string;
  name: string;
  plan: 'Starter' | 'Pro' | 'Enterprise';
  users: number;
  tokensUsed: string;
  status: 'active' | 'suspended' | 'trial';
  created: string;
}

const tenants: Tenant[] = [
  { id: 't-001', name: 'Acme Corp', plan: 'Enterprise', users: 24, tokensUsed: '1.2M', status: 'active', created: '2025-03-15' },
  { id: 't-002', name: 'Globex Inc', plan: 'Pro', users: 12, tokensUsed: '540K', status: 'active', created: '2025-04-02' },
  { id: 't-003', name: 'Initech', plan: 'Starter', users: 3, tokensUsed: '89K', status: 'trial', created: '2025-06-20' },
  { id: 't-004', name: 'Umbrella LLC', plan: 'Enterprise', users: 45, tokensUsed: '3.8M', status: 'active', created: '2025-01-10' },
  { id: 't-005', name: 'Wayne Industries', plan: 'Pro', users: 18, tokensUsed: '920K', status: 'active', created: '2025-02-28' },
  { id: 't-006', name: 'Stark Media', plan: 'Enterprise', users: 32, tokensUsed: '2.1M', status: 'active', created: '2025-03-01' },
  { id: 't-007', name: 'Pied Piper', plan: 'Starter', users: 5, tokensUsed: '120K', status: 'suspended', created: '2025-05-12' },
  { id: 't-008', name: 'Hooli', plan: 'Pro', users: 15, tokensUsed: '780K', status: 'active', created: '2025-04-18' },
  { id: 't-009', name: 'Soylent Corp', plan: 'Starter', users: 2, tokensUsed: '45K', status: 'trial', created: '2025-07-01' },
  { id: 't-010', name: 'Massive Dynamic', plan: 'Enterprise', users: 67, tokensUsed: '5.4M', status: 'active', created: '2024-12-15' },
  { id: 't-011', name: 'Cyberdyne Systems', plan: 'Pro', users: 9, tokensUsed: '310K', status: 'active', created: '2025-05-22' },
  { id: 't-012', name: 'Oscorp', plan: 'Starter', users: 4, tokensUsed: '67K', status: 'trial', created: '2025-07-10' },
];

const planConfig = {
  Starter: { color: 'gray' as const },
  Pro: { color: 'blue' as const },
  Enterprise: { color: 'purple' as const },
};

const statusConfig = {
  active: { label: 'Active', color: 'green' as const },
  suspended: { label: 'Suspended', color: 'red' as const },
  trial: { label: 'Trial', color: 'teal' as const },
};

export default function TenantsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const filteredTenants = tenants.filter(tenant =>
    tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.plan.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tenant.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const paginatedTenants = filteredTenants.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const headers = [
    { key: 'name', header: 'Tenant Name' },
    { key: 'plan', header: 'Plan' },
    { key: 'users', header: 'Users' },
    { key: 'tokensUsed', header: 'Tokens Used' },
    { key: 'status', header: 'Status' },
    { key: 'created', header: 'Created' },
    { key: 'actions', header: '' },
  ];

  const rows = paginatedTenants.map(t => ({
    id: t.id,
    name: t.name,
    plan: t.plan,
    users: String(t.users),
    tokensUsed: t.tokensUsed,
    status: t.status,
    created: t.created,
  }));

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Enterprise size={20} />
            <h1 style={{ margin: 0 }}>Tenant Master List</h1>
          </div>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
            genOS v4.5.0 — Manage all tenant organizations, plans, and access controls
          </p>
        </div>
        <Button size="sm" renderIcon={Add}>
          New Tenant
        </Button>
      </div>

      {/* Summary Tags */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        <Tag type="gray" size="sm">{tenants.length} Total</Tag>
        <Tag type="green" size="sm">{tenants.filter(t => t.status === 'active').length} Active</Tag>
        <Tag type="teal" size="sm">{tenants.filter(t => t.status === 'trial').length} Trial</Tag>
        <Tag type="red" size="sm">{tenants.filter(t => t.status === 'suspended').length} Suspended</Tag>
      </div>

      {/* DataTable */}
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps, onInputChange }) => (
          <>
            <TableToolbar>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => {
                    if (e?.target?.value !== undefined) setSearchQuery(e.target.value);
                    setCurrentPage(1);
                    onInputChange(e);
                  }}
                  placeholder="Search tenants by name, plan, or status..."
                  persistent
                />
                <Button kind="ghost" size="sm" renderIcon={Settings} hasIconOnly iconDescription="Table Settings" />
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
                {rows.map((row) => {
                  const tenant = tenants.find(t => t.id === row.id)!;
                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>
                        <strong>{tenant.name}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                          ID: {tenant.id}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Tag type={planConfig[tenant.plan].color} size="sm">
                          {tenant.plan}
                        </Tag>
                      </TableCell>
                      <TableCell>{tenant.users}</TableCell>
                      <TableCell>
                        <span style={{ fontFamily: 'monospace' }}>{tenant.tokensUsed}</span>
                      </TableCell>
                      <TableCell>
                        <Tag type={statusConfig[tenant.status].color} size="sm">
                          {statusConfig[tenant.status].label}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                          {tenant.created}
                        </span>
                      </TableCell>
                      <TableCell>
                        <OverflowMenu size="sm" flipped>
                          <OverflowMenuItem itemText="Edit Tenant" />
                          <OverflowMenuItem itemText="Manage Users" />
                          <OverflowMenuItem itemText="View Usage" />
                          <OverflowMenuItem
                            itemText={tenant.status === 'suspended' ? 'Reactivate' : 'Suspend'}
                            hasDivider
                          />
                          <OverflowMenuItem itemText="Delete" isDelete />
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

      <Pagination
        totalItems={filteredTenants.length}
        pageSize={pageSize}
        pageSizes={[5, 10, 20]}
        page={currentPage}
        onChange={({ page, pageSize: newPageSize }: { page: number; pageSize: number }) => {
          setCurrentPage(page);
          setPageSize(newPageSize);
        }}
        style={{ marginTop: '1rem' }}
      />
    </div>
  );
}
