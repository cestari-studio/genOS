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
  InlineNotification,
} from '@carbon/react';
import {
  Activity,
  CheckmarkFilled,
  WarningFilled,
  ErrorFilled,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Service {
  id: string;
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency?: string;
  uptime?: string;
  lastCheck?: string;
}

const services: Service[] = [
  { id: '1', name: 'Supabase DB', status: 'healthy', latency: '12ms', uptime: '99.99%', lastCheck: '2 sec ago' },
  { id: '2', name: 'Claude API', status: 'healthy', latency: '340ms', uptime: '99.95%', lastCheck: '5 sec ago' },
  { id: '3', name: 'Gemini API', status: 'degraded', latency: '890ms', uptime: '98.70%', lastCheck: '3 sec ago' },
  { id: '4', name: 'Stripe Billing', status: 'healthy', latency: '45ms', uptime: '99.98%', lastCheck: '10 sec ago' },
  { id: '5', name: 'K8s Cluster', status: 'healthy', latency: '8ms', uptime: '99.99%', lastCheck: '1 sec ago' },
  { id: '6', name: 'Redis Cache', status: 'healthy', latency: '2ms', uptime: '99.99%', lastCheck: '1 sec ago' },
];

const statusConfig = {
  healthy: { label: 'Healthy', color: 'green' as const, icon: CheckmarkFilled },
  degraded: { label: 'Degraded', color: 'teal' as const, icon: WarningFilled },
  down: { label: 'Down', color: 'red' as const, icon: ErrorFilled },
};

export default function HealthPage() {
  const { t } = useTranslation();
  const [lastRefresh] = useState(new Date().toLocaleTimeString());

  const healthyCount = services.filter(s => s.status === 'healthy').length;
  const degradedCount = services.filter(s => s.status === 'degraded').length;
  const downCount = services.filter(s => s.status === 'down').length;
  const healthScore = Math.round(((healthyCount + degradedCount * 0.5) / services.length) * 100);

  const headers = [
    { key: 'name', header: 'Service' },
    { key: 'status', header: 'Status' },
    { key: 'latency', header: 'Latency' },
    { key: 'uptime', header: 'Uptime' },
    { key: 'lastCheck', header: 'Last Check' },
  ];

  const rows = services.map(s => ({
    id: s.id,
    name: s.name,
    status: s.status,
    latency: s.latency || '—',
    uptime: s.uptime || '—',
    lastCheck: s.lastCheck || '—',
  }));

  return (
    <div style={{ padding: '2rem' }}>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Activity size={20} />
          <h1 style={{ margin: 0 }}>Global Health Monitor</h1>
        </div>
        <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
          genOS v4.5.0 — Real-time infrastructure and service health overview. Last refresh: {lastRefresh}
        </p>
      </div>

      {/* Degraded Warning */}
      {degradedCount > 0 && (
        <InlineNotification
          kind="warning"
          title="Degraded Services"
          subtitle={`${degradedCount} service(s) experiencing elevated latency or reduced performance.`}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {downCount > 0 && (
        <InlineNotification
          kind="error"
          title="Services Down"
          subtitle={`${downCount} service(s) are currently unreachable. Immediate attention required.`}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* Overall Health Score + Status Summary */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', margin: '0 0 0.5rem' }}>Health Score</h4>
            <p style={{
              fontSize: '3rem',
              fontWeight: 700,
              margin: 0,
              color: healthScore >= 90 ? 'var(--cds-support-success)' : healthScore >= 70 ? 'var(--cds-support-warning)' : 'var(--cds-support-error)',
            }}>
              {healthScore}%
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {services.length} services monitored
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <CheckmarkFilled size={20} style={{ color: 'var(--cds-support-success)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>Healthy</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>
              {healthyCount}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              All systems operational
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <WarningFilled size={20} style={{ color: 'var(--cds-support-warning)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>Degraded</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-warning)' }}>
              {degradedCount}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Elevated latency detected
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <ErrorFilled size={20} style={{ color: 'var(--cds-support-error)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>Down</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-error)' }}>
              {downCount}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              Unreachable services
            </p>
          </Tile>
        </Column>
      </Grid>

      {/* Services Table */}
      <Tile style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1rem 0' }}>
          <h3 style={{ margin: 0 }}>Service Status</h3>
          <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
            Detailed status for all monitored infrastructure services
          </p>
        </div>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
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
                  const service = services.find(s => s.id === row.id)!;
                  const config = statusConfig[service.status];
                  const StatusIcon = config.icon;
                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>
                        <strong>{service.name}</strong>
                      </TableCell>
                      <TableCell>
                        <Tag type={config.color} size="sm" renderIcon={() => <StatusIcon size={16} />}>
                          {config.label}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        <span style={{
                          color: service.latency && parseInt(service.latency) > 500 ? 'var(--cds-support-warning)' : 'var(--cds-text-primary)',
                          fontFamily: 'monospace',
                        }}>
                          {service.latency || '—'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span style={{ fontFamily: 'monospace' }}>{service.uptime || '—'}</span>
                      </TableCell>
                      <TableCell>
                        <span style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem' }}>
                          {service.lastCheck || '—'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </Tile>
    </div>
  );
}
