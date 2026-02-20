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
  Button,
  Modal,
  ProgressBar,
  Tag,
  InlineNotification,
} from '@carbon/react';
import {
  Upgrade,
  Upload,
  CheckmarkFilled,
  Time,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const patches = [
  {
    id: 'patch-1',
    version: 'v4.5.1',
    status: 'ready',
    changes: 14,
    critical: 2,
    date: '2026-02-20',
    changelog: [
      'Fix: RLS policy leak on multi-tenant queries',
      'Fix: Quantum circuit timeout after 30s on large jobs',
      'Feat: Add bulk export for audit logs',
      'Feat: i18n fallback chain for missing keys',
      'Chore: Upgrade @carbon/react to 1.72.0',
      'Feat: Brand asset version diffing',
      'Fix: Connector OAuth refresh race condition',
      'Feat: Admin dashboard real-time WebSocket metrics',
      'Chore: Remove deprecated Supabase auth helpers',
      'Fix: Date picker locale mismatch in pt-BR',
      'Feat: User invite email template customization',
      'Chore: Migrate to Next.js 15.2 stable',
      'Fix: Memory leak in content generation stream',
      'Feat: Quantum job priority queue',
    ],
  },
  {
    id: 'patch-2',
    version: 'v4.5.0',
    status: 'deployed',
    changes: 22,
    critical: 0,
    date: '2026-02-18',
    changelog: [
      'Major: genOS v4.5.0 Master Admin module',
      'Feat: Quantum engine integration',
      'Feat: Security audit log',
      'Feat: i18n dictionary manager',
      'Feat: Global patch management',
    ],
  },
  {
    id: 'patch-3',
    version: 'v4.4.9',
    status: 'deployed',
    changes: 9,
    critical: 1,
    date: '2026-02-14',
    changelog: [
      'Fix: Critical auth bypass on tenant switch',
      'Feat: Connector health check endpoint',
      'Chore: Database index optimization',
    ],
  },
  {
    id: 'patch-4',
    version: 'v4.4.8',
    status: 'rollback',
    changes: 6,
    critical: 0,
    date: '2026-02-10',
    changelog: [
      'Feat: Experimental dark mode toggle',
      'Fix: CSS grid overflow on mobile',
      'Rolled back due to layout regression on Safari',
    ],
  },
];

const headers = [
  { key: 'version', header: 'Version' },
  { key: 'status', header: 'Status' },
  { key: 'changes', header: 'Changes' },
  { key: 'critical', header: 'Critical' },
  { key: 'date', header: 'Date' },
  { key: 'actions', header: 'Actions' },
];

function getStatusTag(status: string) {
  switch (status) {
    case 'ready':
      return <Tag type="blue">Ready</Tag>;
    case 'deployed':
      return <Tag type="green">Deployed</Tag>;
    case 'rollback':
      return <Tag type="red">Rolled Back</Tag>;
    case 'deploying':
      return <Tag type="teal">Deploying</Tag>;
    default:
      return <Tag type="gray">{status}</Tag>;
  }
}

export default function PatchManagerPage() {
  const { t } = useTranslation();
  const [changelogModal, setChangelogModal] = useState<string | null>(null);
  const [deployingVersion, setDeployingVersion] = useState<string | null>(null);
  const [deployProgress, setDeployProgress] = useState(0);

  const selectedPatch = patches.find((p) => p.id === changelogModal);

  const handleDeploy = (version: string) => {
    setDeployingVersion(version);
    setDeployProgress(0);
    const interval = setInterval(() => {
      setDeployProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setDeployingVersion(null), 1500);
          return 100;
        }
        return prev + 10;
      });
    }, 400);
  };

  const rows = patches.map((patch) => ({
    id: patch.id,
    version: patch.version,
    status: patch.status,
    changes: String(patch.changes),
    critical: String(patch.critical ?? 0),
    date: patch.date,
    actions: patch.status,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Upgrade size={20} />
          Global Patch Manager
        </h1>
        <p style={{ color: '#525252', marginTop: '0.25rem' }}>
          Deploy, rollback, and inspect patches across all genOS v4.5.0
          environments.
        </p>
      </div>

      {deployingVersion && (
        <InlineNotification
          kind="info"
          title={`Deploying ${deployingVersion}`}
          subtitle={
            deployProgress >= 100
              ? 'Upload complete!'
              : 'Upload in progress...'
          }
          lowContrast
          hideCloseButton
          style={{ marginBottom: '1rem' }}
        />
      )}

      {deployingVersion && (
        <div style={{ marginBottom: '1.5rem' }}>
          <ProgressBar
            label={`Deploying ${deployingVersion}`}
            value={deployProgress}
            max={100}
            status={deployProgress >= 100 ? 'finished' : 'active'}
          />
        </div>
      )}

      <DataTable rows={rows} headers={headers}>
        {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
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
              {tableRows.map((row) => {
                const patchData = patches.find((p) => p.id === row.id);
                return (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === 'status') {
                        return (
                          <TableCell key={cell.id}>
                            {getStatusTag(cell.value)}
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'critical') {
                        return (
                          <TableCell key={cell.id}>
                            {Number(cell.value) > 0 ? (
                              <Tag type="red" size="sm">
                                {cell.value}
                              </Tag>
                            ) : (
                              <span>{cell.value}</span>
                            )}
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'actions') {
                        return (
                          <TableCell key={cell.id}>
                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                              <Button
                                kind="ghost"
                                size="sm"
                                onClick={() => setChangelogModal(row.id)}
                              >
                                Changelog
                              </Button>
                              {patchData?.status === 'ready' && (
                                <Button
                                  kind="primary"
                                  size="sm"
                                  renderIcon={Upload}
                                  disabled={!!deployingVersion}
                                  onClick={() =>
                                    handleDeploy(patchData.version)
                                  }
                                >
                                  Deploy
                                </Button>
                              )}
                              {patchData?.status === 'deployed' && (
                                <Button kind="danger--ghost" size="sm">
                                  Rollback
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        );
                      }
                      return (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </DataTable>

      <Modal
        open={!!changelogModal}
        onRequestClose={() => setChangelogModal(null)}
        modalHeading={`Changelog — ${selectedPatch?.version ?? ''}`}
        passiveModal
        size="md"
      >
        {selectedPatch && (
          <div style={{ padding: '1rem 0' }}>
            <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <Tag type={selectedPatch.status === 'deployed' ? 'green' : 'blue'}>
                {selectedPatch.status}
              </Tag>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#525252' }}>
                <Time size={20} /> {selectedPatch.date}
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.875rem', color: '#525252' }}>
                <CheckmarkFilled size={20} /> {selectedPatch.changes} changes
              </span>
            </div>
            <ul style={{ paddingLeft: '1.25rem' }}>
              {selectedPatch.changelog.map((entry, idx) => (
                <li key={idx} style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>
                  {entry}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </div>
  );
}
