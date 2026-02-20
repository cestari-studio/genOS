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
  Dropdown,
  InlineNotification,
  Pagination,
} from '@carbon/react';
import { Security, WarningAlt } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface AuditEntry {
  id: string;
  timestamp: string;
  user: string;
  action: string;
  resource: string;
  ip: string;
  severity: 'info' | 'warning' | 'critical';
}

const auditLog: AuditEntry[] = [
  { id: '1', timestamp: '2026-02-19 14:32:01', user: 'admin@cestari.studio', action: 'LOGIN', resource: '/auth/session', ip: '189.40.12.45', severity: 'info' },
  { id: '2', timestamp: '2026-02-19 14:28:15', user: 'agent@agencia.com', action: 'EXPORT_DATA', resource: '/api/clients', ip: '200.155.32.10', severity: 'warning' },
  { id: '3', timestamp: '2026-02-19 14:15:44', user: 'root@system', action: 'RLS_POLICY_CHANGE', resource: 'cestari.rls_policies', ip: '10.0.0.1', severity: 'critical' },
  { id: '4', timestamp: '2026-02-19 13:55:30', user: 'tenant@acme.com', action: 'PASSWORD_RESET', resource: '/auth/reset', ip: '177.220.15.88', severity: 'info' },
  { id: '5', timestamp: '2026-02-19 13:42:18', user: 'admin@cestari.studio', action: 'USER_ROLE_CHANGE', resource: '/api/settings/users', ip: '189.40.12.45', severity: 'warning' },
  { id: '6', timestamp: '2026-02-19 13:30:00', user: 'system', action: 'BACKUP_COMPLETED', resource: 'pg_dump', ip: '10.0.0.2', severity: 'info' },
  { id: '7', timestamp: '2026-02-19 12:58:33', user: 'root@system', action: 'K8S_POD_RESTART', resource: 'genos-api-7d4f8', ip: '10.0.0.1', severity: 'warning' },
  { id: '8', timestamp: '2026-02-19 12:45:12', user: 'agent@beta.com', action: 'API_KEY_GENERATED', resource: '/api/connectors', ip: '201.12.88.34', severity: 'warning' },
  { id: '9', timestamp: '2026-02-19 12:30:00', user: 'system', action: 'TOKEN_MINT', resource: 'cestari.token_ledger', ip: '10.0.0.1', severity: 'info' },
  { id: '10', timestamp: '2026-02-19 11:55:08', user: 'unknown', action: 'FAILED_LOGIN_ATTEMPT', resource: '/auth/session', ip: '45.33.22.11', severity: 'critical' },
  { id: '11', timestamp: '2026-02-19 11:40:22', user: 'admin@cestari.studio', action: 'TENANT_CREATED', resource: '/api/admin/tenants', ip: '189.40.12.45', severity: 'info' },
  { id: '12', timestamp: '2026-02-19 11:20:15', user: 'system', action: 'SSL_CERT_RENEWAL', resource: 'certbot', ip: '10.0.0.3', severity: 'info' },
];

const severityConfig = {
  info: { color: 'blue' as const, label: 'Info' },
  warning: { color: 'teal' as const, label: 'Warning' },
  critical: { color: 'red' as const, label: 'Critical' },
};

const headers = [
  { key: 'timestamp', header: 'Timestamp' },
  { key: 'user', header: 'User' },
  { key: 'action', header: 'Action' },
  { key: 'resource', header: 'Resource' },
  { key: 'ip', header: 'IP Address' },
  { key: 'severity', header: 'Severity' },
];

export default function AuditPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [page, setPage] = useState(1);
  const pageSize = 8;

  const criticalCount = auditLog.filter(e => e.severity === 'critical').length;

  const filtered = auditLog.filter(entry => {
    const matchesSearch = !search || entry.user.includes(search) || entry.action.includes(search) || entry.resource.includes(search);
    const matchesSeverity = severityFilter === 'all' || entry.severity === severityFilter;
    return matchesSearch && matchesSeverity;
  });

  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);
  const rows = paged.map(e => ({ id: e.id, timestamp: e.timestamp, user: e.user, action: e.action, resource: e.resource, ip: e.ip, severity: e.severity }));

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Security size={20} />
          <h1 style={{ margin: 0 }}>Security Audit Log</h1>
        </div>
        <p>Track all security-relevant events across the genOS platform</p>
      </div>

      {criticalCount > 0 && (
        <InlineNotification
          kind="error"
          title="Critical Events Detected"
          subtitle={`${criticalCount} critical security event(s) require immediate attention.`}
          style={{ marginBottom: '1rem' }}
        />
      )}

      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Total Events</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{auditLog.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Warnings</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-warning)' }}>
              {auditLog.filter(e => e.severity === 'warning').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Critical</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-error)' }}>{criticalCount}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Unique Users</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{new Set(auditLog.map(e => e.user)).size}</p>
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
                  <Dropdown
                    id="severity-filter"
                    titleText=""
                    label="Severity"
                    items={['all', 'info', 'warning', 'critical']}
                    itemToString={(item: string) => item === 'all' ? 'All Severities' : item.charAt(0).toUpperCase() + item.slice(1)}
                    onChange={({ selectedItem }: any) => setSeverityFilter(selectedItem || 'all')}
                    size="sm"
                    style={{ minWidth: '160px' }}
                  />
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
                    const entry = paged.find(e => e.id === row.id)!;
                    const config = severityConfig[entry.severity];
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        <TableCell><span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{entry.timestamp}</span></TableCell>
                        <TableCell>{entry.user}</TableCell>
                        <TableCell><code style={{ fontSize: '0.8125rem' }}>{entry.action}</code></TableCell>
                        <TableCell><span style={{ fontSize: '0.8125rem' }}>{entry.resource}</span></TableCell>
                        <TableCell><span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{entry.ip}</span></TableCell>
                        <TableCell><Tag type={config.color} size="sm">{config.label}</Tag></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
        <Pagination
          totalItems={filtered.length}
          pageSize={pageSize}
          pageSizes={[8, 16, 32]}
          page={page}
          onChange={({ page: p }: any) => setPage(p)}
        />
      </Tile>
    </div>
  );
}
