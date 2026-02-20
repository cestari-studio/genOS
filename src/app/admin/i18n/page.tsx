'use client';

import { useState } from 'react';
import {
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
  TextArea,
  TextInput,
} from '@carbon/react';
import { Translate, Add, Edit } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface TranslationEntry {
  id: string;
  key: string;
  en: string;
  ptBR: string;
  status: 'complete' | 'missing' | 'outdated';
  lastUpdated: string;
}

const translations: TranslationEntry[] = [
  { id: '1', key: 'dashboard.title', en: 'Dashboard', ptBR: 'Painel', status: 'complete', lastUpdated: '2026-02-18' },
  { id: '2', key: 'sidebar.clients', en: 'Clients', ptBR: 'Clientes', status: 'complete', lastUpdated: '2026-02-18' },
  { id: '3', key: 'content.publish', en: 'Publish Content', ptBR: 'Publicar Conteúdo', status: 'complete', lastUpdated: '2026-02-17' },
  { id: '4', key: 'ai.copilot.title', en: 'AI Co-pilot', ptBR: '', status: 'missing', lastUpdated: '2026-02-19' },
  { id: '5', key: 'finops.tokenEconomy', en: 'Token Economy', ptBR: 'Economia de Tokens', status: 'complete', lastUpdated: '2026-02-16' },
  { id: '6', key: 'social.campaigns', en: 'Campaign Manager', ptBR: 'Gerenciador de Campanhas', status: 'complete', lastUpdated: '2026-02-15' },
  { id: '7', key: 'geo.semanticMap', en: 'Semantic Map', ptBR: 'Mapa Semântico', status: 'outdated', lastUpdated: '2026-01-20' },
  { id: '8', key: 'hub.dnaEditor', en: 'Brand DNA Editor', ptBR: '', status: 'missing', lastUpdated: '2026-02-19' },
  { id: '9', key: 'admin.audit.title', en: 'Security Audit Log', ptBR: 'Log de Auditoria', status: 'complete', lastUpdated: '2026-02-18' },
  { id: '10', key: 'onboarding.welcome', en: 'Welcome to genOS', ptBR: 'Bem-vindo ao genOS', status: 'complete', lastUpdated: '2026-02-10' },
  { id: '11', key: 'agency.forecast', en: 'Revenue Forecast', ptBR: '', status: 'missing', lastUpdated: '2026-02-19' },
  { id: '12', key: 'common.exportPdf', en: 'Export as PDF', ptBR: 'Exportar como PDF', status: 'outdated', lastUpdated: '2026-01-15' },
  { id: '13', key: 'helian.quantumEngine', en: 'Quantum Engine', ptBR: 'Motor Quântico', status: 'complete', lastUpdated: '2026-02-12' },
  { id: '14', key: 'content.reels.editor', en: 'Reels Editor', ptBR: 'Editor de Reels', status: 'complete', lastUpdated: '2026-02-14' },
  { id: '15', key: 'social.inbox.title', en: 'Unified Inbox', ptBR: 'Caixa Unificada', status: 'complete', lastUpdated: '2026-02-16' },
];

const statusConfig = {
  complete: { color: 'green' as const, label: 'Complete' },
  missing: { color: 'red' as const, label: 'Missing' },
  outdated: { color: 'teal' as const, label: 'Outdated' },
};

const headers = [
  { key: 'key', header: 'Key' },
  { key: 'en', header: 'English' },
  { key: 'ptBR', header: 'Português (BR)' },
  { key: 'status', header: 'Status' },
  { key: 'lastUpdated', header: 'Last Updated' },
  { key: 'actions', header: '' },
];

export default function I18nPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editEntry, setEditEntry] = useState<TranslationEntry | null>(null);
  const [enValue, setEnValue] = useState('');
  const [ptValue, setPtValue] = useState('');

  const filtered = translations.filter(entry =>
    !search || entry.key.includes(search) || entry.en.toLowerCase().includes(search.toLowerCase()) || entry.ptBR.toLowerCase().includes(search.toLowerCase())
  );

  const rows = filtered.map(e => ({ id: e.id, key: e.key, en: e.en, ptBR: e.ptBR, status: e.status, lastUpdated: e.lastUpdated, actions: '' }));

  const openEdit = (entry: TranslationEntry) => {
    setEditEntry(entry);
    setEnValue(entry.en);
    setPtValue(entry.ptBR);
    setModalOpen(true);
  };

  const missingCount = translations.filter(e => e.status === 'missing').length;
  const outdatedCount = translations.filter(e => e.status === 'outdated').length;

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Translate size={20} />
          <h1 style={{ margin: 0 }}>i18n Dictionary Manager</h1>
        </div>
        <p>Manage translation keys for English and Portuguese (BR)</p>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <Tile style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Total Keys</p>
          <p style={{ fontSize: '2rem', fontWeight: 600 }}>{translations.length}</p>
        </Tile>
        <Tile style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Complete</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>
            {translations.filter(e => e.status === 'complete').length}
          </p>
        </Tile>
        <Tile style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Missing</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-error)' }}>{missingCount}</p>
        </Tile>
        <Tile style={{ flex: 1 }}>
          <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Outdated</p>
          <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-warning)' }}>{outdatedCount}</p>
        </Tile>
      </div>

      <Tile style={{ padding: 0 }}>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e: any) => setSearch(e.target?.value || '')} />
                  <Button renderIcon={Add} size="sm" onClick={() => { setEditEntry(null); setEnValue(''); setPtValue(''); setModalOpen(true); }}>
                    Add Key
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
                    const entry = filtered.find(e => e.id === row.id)!;
                    const config = statusConfig[entry.status];
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        <TableCell><code style={{ fontSize: '0.8125rem' }}>{entry.key}</code></TableCell>
                        <TableCell>{entry.en || '—'}</TableCell>
                        <TableCell>{entry.ptBR || <span style={{ color: 'var(--cds-support-error)' }}>— missing —</span>}</TableCell>
                        <TableCell><Tag type={config.color} size="sm">{config.label}</Tag></TableCell>
                        <TableCell>{entry.lastUpdated}</TableCell>
                        <TableCell>
                          <Button kind="ghost" size="sm" hasIconOnly renderIcon={Edit} iconDescription="Edit" onClick={() => openEdit(entry)} />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </Tile>

      <Modal
        open={modalOpen}
        onRequestClose={() => setModalOpen(false)}
        modalHeading={editEntry ? `Edit: ${editEntry.key}` : 'Add Translation Key'}
        primaryButtonText="Save"
        secondaryButtonText="Cancel"
      >
        {!editEntry && (
          <TextInput id="new-key" labelText="Translation Key" placeholder="e.g. dashboard.newFeature" style={{ marginBottom: '1rem' }} />
        )}
        <TextArea id="en-value" labelText="English" value={enValue} onChange={(e) => setEnValue(e.target.value)} rows={3} style={{ marginBottom: '1rem' }} />
        <TextArea id="pt-value" labelText="Português (BR)" value={ptValue} onChange={(e) => setPtValue(e.target.value)} rows={3} />
      </Modal>
    </div>
  );
}
