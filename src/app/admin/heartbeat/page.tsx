'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ProgressBar,
  Button,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
} from '@carbon/react';
import {
  Activity,
  Chip,
  DataBase,
  Network_3,
  VirtualMachine,
  Renew,
  CheckmarkFilled,
  WarningAltFilled,
  ErrorFilled,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface MetricCard {
  id: string;
  label: string;
  value: string;
  percent: number;
  icon: React.ElementType;
  status: 'normal' | 'warning' | 'critical';
  detail: string;
}

interface HeartbeatEvent {
  id: string;
  timestamp: string;
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  responseTime: string;
  message: string;
}

const initialMetrics: MetricCard[] = [
  {
    id: 'cpu',
    label: 'CPU Usage',
    value: '78%',
    percent: 78,
    icon: Chip,
    status: 'warning',
    detail: '12 cores @ 3.2 GHz',
  },
  {
    id: 'memory',
    label: 'Memory',
    value: '4.2 / 8 GB',
    percent: 52.5,
    icon: VirtualMachine,
    status: 'normal',
    detail: 'DDR5 ECC Registered',
  },
  {
    id: 'disk',
    label: 'Disk Usage',
    value: '45%',
    percent: 45,
    icon: DataBase,
    status: 'normal',
    detail: '450 GB / 1 TB NVMe SSD',
  },
  {
    id: 'network',
    label: 'Network',
    value: '120 Mbps',
    percent: 60,
    icon: Network_3,
    status: 'normal',
    detail: 'Avg throughput (200 Mbps cap)',
  },
];

const initialEvents: HeartbeatEvent[] = [
  {
    id: '1',
    timestamp: '2026-02-19 09:14:32 UTC',
    service: 'API Gateway',
    status: 'healthy',
    responseTime: '23ms',
    message: 'All endpoints responding normally.',
  },
  {
    id: '2',
    timestamp: '2026-02-19 09:14:30 UTC',
    service: 'Auth Service',
    status: 'healthy',
    responseTime: '45ms',
    message: 'OAuth2 / SAML endpoints operational.',
  },
  {
    id: '3',
    timestamp: '2026-02-19 09:14:28 UTC',
    service: 'Claude API Proxy',
    status: 'healthy',
    responseTime: '189ms',
    message: 'Token throughput within expected range.',
  },
  {
    id: '4',
    timestamp: '2026-02-19 09:14:25 UTC',
    service: 'PostgreSQL Primary',
    status: 'healthy',
    responseTime: '12ms',
    message: 'Replication lag: 0.3s. Connection pool: 42/100.',
  },
  {
    id: '5',
    timestamp: '2026-02-19 09:14:22 UTC',
    service: 'Redis Cache',
    status: 'degraded',
    responseTime: '78ms',
    message: 'Memory usage at 82%. Consider scaling cache nodes.',
  },
  {
    id: '6',
    timestamp: '2026-02-19 09:14:18 UTC',
    service: 'Worker Queue',
    status: 'healthy',
    responseTime: '34ms',
    message: 'Queue depth: 127 jobs. Processing rate: 45 jobs/min.',
  },
  {
    id: '7',
    timestamp: '2026-02-19 09:13:55 UTC',
    service: 'Gemini API Proxy',
    status: 'healthy',
    responseTime: '210ms',
    message: 'Rate limit usage: 340/1000 rpm.',
  },
  {
    id: '8',
    timestamp: '2026-02-19 09:13:40 UTC',
    service: 'Object Storage (S3)',
    status: 'healthy',
    responseTime: '56ms',
    message: 'Bucket operations nominal. 2.4 TB stored.',
  },
  {
    id: '9',
    timestamp: '2026-02-19 09:12:10 UTC',
    service: 'Qiskit Runtime',
    status: 'down',
    responseTime: 'Timeout',
    message: 'Connection refused. IBM Quantum service unreachable.',
  },
  {
    id: '10',
    timestamp: '2026-02-19 09:11:45 UTC',
    service: 'Email Service (SendGrid)',
    status: 'healthy',
    responseTime: '132ms',
    message: 'Delivery rate: 99.2%. 1,240 emails sent today.',
  },
];

const eventHeaders = [
  { key: 'timestamp', header: 'Timestamp' },
  { key: 'service', header: 'Service' },
  { key: 'status', header: 'Status' },
  { key: 'responseTime', header: 'Response Time' },
  { key: 'message', header: 'Message' },
];

export default function HeartbeatPage() {
  const { t } = useTranslation();
  const [metrics, setMetrics] = useState(initialMetrics);
  const [events] = useState(initialEvents);
  const [lastRefresh, setLastRefresh] = useState('2026-02-19 09:14:32 UTC');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setMetrics((prev) =>
        prev.map((m) => {
          const jitter = (Math.random() - 0.5) * 10;
          const newPercent = Math.min(100, Math.max(5, m.percent + jitter));
          let status: 'normal' | 'warning' | 'critical' = 'normal';
          if (newPercent > 85) status = 'critical';
          else if (newPercent > 70) status = 'warning';
          return {
            ...m,
            percent: Math.round(newPercent),
            value:
              m.id === 'memory'
                ? `${(newPercent * 0.08).toFixed(1)} / 8 GB`
                : m.id === 'network'
                ? `${Math.round(newPercent * 2)} Mbps`
                : `${Math.round(newPercent)}%`,
            status,
          };
        })
      );
      setLastRefresh(new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC');
      setIsRefreshing(false);
    }, 800);
  };

  const statusColor = (status: string) => {
    switch (status) {
      case 'normal':
      case 'healthy':
        return 'green';
      case 'warning':
      case 'degraded':
        return 'teal';
      case 'critical':
      case 'down':
        return 'red';
      default:
        return 'gray';
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'healthy':
        return <CheckmarkFilled size={16} style={{ color: '#198038' }} />;
      case 'degraded':
        return <WarningAltFilled size={16} style={{ color: '#f1c21b' }} />;
      case 'down':
        return <ErrorFilled size={16} style={{ color: '#da1e28' }} />;
      default:
        return null;
    }
  };

  const progressBarStatus = (status: string): 'active' | 'error' | 'finished' => {
    switch (status) {
      case 'critical':
        return 'error';
      case 'warning':
        return 'active';
      default:
        return 'active';
    }
  };

  const rows = events.map((e) => ({
    id: e.id,
    timestamp: e.timestamp,
    service: e.service,
    status: e.status,
    responseTime: e.responseTime,
    message: e.message,
  }));

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={12} md={6} sm={4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <Activity size={24} />
          <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Heartbeat Monitor</h1>
        </div>
        <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '2rem' }}>
          Real-time infrastructure health monitoring and service status.
        </p>
      </Column>

      <Column lg={4} md={2} sm={4} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
          <Button
            kind="tertiary"
            size="sm"
            renderIcon={Renew}
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            {isRefreshing ? 'Refreshing...' : 'Refresh'}
          </Button>
          <span style={{ fontSize: '0.75rem', color: '#525252' }}>
            Last updated: {lastRefresh}
          </span>
        </div>
      </Column>

      {metrics.map((metric) => {
        const IconComponent = metric.icon;
        return (
          <Column key={metric.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile
              style={{
                borderLeft: `4px solid ${
                  metric.status === 'critical' ? '#da1e28' : metric.status === 'warning' ? '#f1c21b' : '#198038'
                }`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <IconComponent size={20} />
                  <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>{metric.label}</span>
                </div>
                <Tag type={statusColor(metric.status)} size="sm">
                  {metric.status}
                </Tag>
              </div>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                {metric.value}
              </p>
              <ProgressBar
                label={metric.detail}
                value={metric.percent}
                max={100}
                size="small"
                status={progressBarStatus(metric.status)}
              />
            </Tile>
          </Column>
        );
      })}

      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <Tile style={{ marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
            System Uptime
          </h2>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252' }}>Current Uptime</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, color: '#198038' }}>47d 12h 34m</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252' }}>30-Day Availability</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>99.97%</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252' }}>Healthy Services</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                {events.filter((e) => e.status === 'healthy').length}/{events.length}
              </p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252' }}>Incidents (30d)</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600 }}>3</p>
            </div>
          </div>
        </Tile>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1rem' }}>
          Recent Heartbeat Events
        </h2>
        <DataTable rows={rows} headers={eventHeaders}>
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
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row: any) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell: any) => {
                      if (cell.info.header === 'status') {
                        return (
                          <TableCell key={cell.id}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <StatusIcon status={cell.value} />
                              <Tag type={statusColor(cell.value)} size="sm">
                                {cell.value}
                              </Tag>
                            </div>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'timestamp') {
                        return (
                          <TableCell key={cell.id}>
                            <code style={{ fontSize: '0.75rem' }}>{cell.value}</code>
                          </TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </DataTable>
      </Column>
    </Grid>
  );
}
