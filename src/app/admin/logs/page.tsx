'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Grid,
  Column,
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
  Tile,
  Tag,
  Button,
  Dropdown,
  Toggle,
  Breadcrumb,
  BreadcrumbItem,
  CodeSnippet,
} from '@carbon/react';
import { Renew, Close } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  details?: string;
}

const mockLogs: LogEntry[] = [
  {
    id: '1',
    timestamp: '2026-02-19T14:32:01Z',
    level: 'info',
    service: 'auth-service',
    message: 'User login successful',
    details: '{"userId":"usr_9x8k2","ip":"192.168.1.42","method":"oauth2","provider":"google","sessionId":"sess_abc123","userAgent":"Mozilla/5.0"}',
  },
  {
    id: '2',
    timestamp: '2026-02-19T14:31:45Z',
    level: 'error',
    service: 'content-api',
    message: 'Failed to process content generation request',
    details: '{"error":"TimeoutError","requestId":"req_7j3m1","duration":"30012ms","contentType":"post","stack":"TimeoutError: Request timed out\\n  at ContentGenerator.process (/app/services/generator.ts:142)\\n  at async ContentAPI.handleRequest (/app/api/content.ts:87)"}',
  },
  {
    id: '3',
    timestamp: '2026-02-19T14:31:22Z',
    level: 'warn',
    service: 'billing-service',
    message: 'API rate limit approaching threshold (85%)',
    details: '{"tenantId":"ten_abc","currentUsage":8500,"limit":10000,"window":"1h","resetAt":"2026-02-19T15:00:00Z"}',
  },
  {
    id: '4',
    timestamp: '2026-02-19T14:30:58Z',
    level: 'debug',
    service: 'ai-engine',
    message: 'Model inference completed',
    details: '{"model":"genos-v3","tokens":{"input":1240,"output":856},"latency":"2.3s","cacheHit":false}',
  },
  {
    id: '5',
    timestamp: '2026-02-19T14:30:15Z',
    level: 'info',
    service: 'scheduler',
    message: 'Scheduled post published successfully',
    details: '{"postId":"pst_k9d2","platform":"instagram","scheduledAt":"2026-02-19T14:30:00Z","publishedAt":"2026-02-19T14:30:15Z"}',
  },
  {
    id: '6',
    timestamp: '2026-02-19T14:29:44Z',
    level: 'error',
    service: 'connector-service',
    message: 'OAuth token refresh failed for Instagram connector',
    details: '{"connectorId":"con_ig_01","error":"invalid_grant","tenantId":"ten_xyz","lastSuccess":"2026-02-18T22:15:00Z"}',
  },
  {
    id: '7',
    timestamp: '2026-02-19T14:29:02Z',
    level: 'warn',
    service: 'storage-service',
    message: 'Storage quota at 92% capacity',
    details: '{"tenantId":"ten_abc","used":"18.4 GB","total":"20 GB","largestBucket":"media-assets"}',
  },
  {
    id: '8',
    timestamp: '2026-02-19T14:28:30Z',
    level: 'info',
    service: 'analytics-service',
    message: 'Daily metrics aggregation completed',
    details: '{"date":"2026-02-18","tenantsProcessed":142,"duration":"45.2s","metricsCount":28400}',
  },
  {
    id: '9',
    timestamp: '2026-02-19T14:27:55Z',
    level: 'debug',
    service: 'ai-engine',
    message: 'Brand voice analysis cache refreshed',
    details: '{"brandId":"brd_001","modelVersion":"voice-v2.1","vectorDimensions":768,"processingTime":"1.1s"}',
  },
  {
    id: '10',
    timestamp: '2026-02-19T14:27:10Z',
    level: 'info',
    service: 'auth-service',
    message: 'New API key generated',
    details: '{"tenantId":"ten_def","keyPrefix":"gos_live_","permissions":["content:read","content:write","analytics:read"],"expiresAt":"2027-02-19T00:00:00Z"}',
  },
];

const levelTagColor: Record<LogLevel, string> = {
  info: 'blue',
  warn: 'teal',
  error: 'red',
  debug: 'gray',
};

const levelFilterItems = [
  { id: 'all', text: 'All Levels' },
  { id: 'info', text: 'Info' },
  { id: 'warn', text: 'Warning' },
  { id: 'error', text: 'Error' },
  { id: 'debug', text: 'Debug' },
];

const serviceFilterItems = [
  { id: 'all', text: 'All Services' },
  { id: 'auth-service', text: 'Auth Service' },
  { id: 'content-api', text: 'Content API' },
  { id: 'billing-service', text: 'Billing Service' },
  { id: 'ai-engine', text: 'AI Engine' },
  { id: 'scheduler', text: 'Scheduler' },
  { id: 'connector-service', text: 'Connector Service' },
  { id: 'storage-service', text: 'Storage Service' },
  { id: 'analytics-service', text: 'Analytics Service' },
];

export default function SystemLogsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState<string>('all');
  const [serviceFilter, setServiceFilter] = useState<string>('all');
  const [autoRefresh, setAutoRefresh] = useState(false);
  const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);
  const [lastRefresh, setLastRefresh] = useState<string>(new Date().toLocaleTimeString());

  const handleRefresh = useCallback(() => {
    setLastRefresh(new Date().toLocaleTimeString());
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(handleRefresh, 5000);
    return () => clearInterval(interval);
  }, [autoRefresh, handleRefresh]);

  const filtered = mockLogs.filter((log) => {
    const matchesSearch =
      log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.service.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = levelFilter === 'all' || log.level === levelFilter;
    const matchesService = serviceFilter === 'all' || log.service === serviceFilter;
    return matchesSearch && matchesLevel && matchesService;
  });

  const headers = [
    { key: 'timestamp', header: t('Timestamp') },
    { key: 'level', header: t('Level') },
    { key: 'service', header: t('Service') },
    { key: 'message', header: t('Message') },
  ];

  const rows = filtered.map((log) => ({
    id: log.id,
    timestamp: new Date(log.timestamp).toLocaleString(),
    level: (
      <Tag type={levelTagColor[log.level] as any} size="sm">
        {log.level.toUpperCase()}
      </Tag>
    ),
    service: log.service,
    message: (
      <span
        style={{ cursor: 'pointer', textDecoration: 'underline', textDecorationStyle: 'dotted' as const }}
        onClick={() => setSelectedLog(log)}
      >
        {log.message}
      </span>
    ),
  }));

  const formatDetails = (details: string): string => {
    try {
      return JSON.stringify(JSON.parse(details), null, 2);
    } catch {
      return details;
    }
  };

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem href="/dashboard">{t('Dashboard')}</BreadcrumbItem>
          <BreadcrumbItem href="/admin">{t('Admin')}</BreadcrumbItem>
          <BreadcrumbItem href="/admin/logs" isCurrentPage>
            {t('System Logs')}
          </BreadcrumbItem>
        </Breadcrumb>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{t('System Logs')}</h1>
            <p style={{ color: '#525252' }}>
              {t('Monitor system activity, errors, and service health in real time.')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontSize: '0.75rem', color: '#525252' }}>
              {t('Last refresh')}: {lastRefresh}
            </span>
            <Button
              kind="ghost"
              size="sm"
              hasIconOnly
              iconDescription={t('Refresh')}
              renderIcon={Renew}
              onClick={handleRefresh}
            />
            <Toggle
              id="auto-refresh-toggle"
              size="sm"
              labelText={t('Auto-refresh')}
              labelA={t('Off')}
              labelB={t('On')}
              toggled={autoRefresh}
              onToggle={(checked: boolean) => setAutoRefresh(checked)}
            />
          </div>
        </div>
      </Column>

      {/* Filters */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: '200px' }}>
            <Dropdown
              id="level-filter"
              titleText={t('Level')}
              label={t('All Levels')}
              items={levelFilterItems}
              itemToString={(item: any) => item?.text || ''}
              onChange={({ selectedItem }: any) => setLevelFilter(selectedItem?.id || 'all')}
            />
          </div>
          <div style={{ width: '200px' }}>
            <Dropdown
              id="service-filter"
              titleText={t('Service')}
              label={t('All Services')}
              items={serviceFilterItems}
              itemToString={(item: any) => item?.text || ''}
              onChange={({ selectedItem }: any) => setServiceFilter(selectedItem?.id || 'all')}
            />
          </div>
        </div>
      </Column>

      {/* DataTable */}
      <Column lg={selectedLog ? 10 : 16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers}>
          {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    placeholder={t('Search logs...')}
                    onChange={(e: any) => {
                      const val = typeof e === 'string' ? e : e.target?.value || '';
                      setSearchTerm(val);
                    }}
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </Column>

      {/* Detail Panel */}
      {selectedLog && (
        <Column lg={6} md={8} sm={4}>
          <Tile style={{ position: 'sticky', top: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h4>{t('Log Details')}</h4>
              <Button
                kind="ghost"
                size="sm"
                hasIconOnly
                iconDescription={t('Close')}
                renderIcon={Close}
                onClick={() => setSelectedLog(null)}
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>{t('Timestamp')}</p>
              <p style={{ fontSize: '0.875rem' }}>{new Date(selectedLog.timestamp).toLocaleString()}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>{t('Level')}</p>
              <Tag type={levelTagColor[selectedLog.level] as any} size="sm">
                {selectedLog.level.toUpperCase()}
              </Tag>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>{t('Service')}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedLog.service}</p>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>{t('Message')}</p>
              <p style={{ fontSize: '0.875rem' }}>{selectedLog.message}</p>
            </div>

            {selectedLog.details && (
              <div>
                <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>{t('Details')}</p>
                <CodeSnippet type="multi" feedback={t('Copied')}>
                  {formatDetails(selectedLog.details)}
                </CodeSnippet>
              </div>
            )}
          </Tile>
        </Column>
      )}
    </Grid>
  );
}
