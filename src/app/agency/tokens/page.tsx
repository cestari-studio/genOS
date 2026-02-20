'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
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
  TableToolbarSearch,
  Tag,
  ProgressBar,
} from '@carbon/react';
import { Currency, DataVis_1, Meter, Fire } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const tokenStats = {
  totalAllocated: 500000,
  used: 320000,
  remaining: 180000,
  burnRate: 12000,
};

interface TokenTransaction {
  id: string;
  date: string;
  client: string;
  operation: string;
  tokensUsed: number;
  type: 'debit' | 'credit';
}

const transactions: TokenTransaction[] = [
  { id: '1', date: '2026-02-19', client: 'Acme Corp', operation: 'Blog Post Generation', tokensUsed: 4500, type: 'debit' },
  { id: '2', date: '2026-02-19', client: 'Delta Financial', operation: 'SEO Audit Report', tokensUsed: 8200, type: 'debit' },
  { id: '3', date: '2026-02-18', client: 'Zeta Media', operation: 'Social Campaign Bundle', tokensUsed: 12000, type: 'debit' },
  { id: '4', date: '2026-02-18', client: 'System', operation: 'Monthly Allocation Top-Up', tokensUsed: 50000, type: 'credit' },
  { id: '5', date: '2026-02-18', client: 'Gamma Health', operation: 'Whitepaper Draft', tokensUsed: 9800, type: 'debit' },
  { id: '6', date: '2026-02-17', client: 'Beta Industries', operation: 'Product Descriptions (x24)', tokensUsed: 6300, type: 'debit' },
  { id: '7', date: '2026-02-17', client: 'Iota Foods', operation: 'Email Sequence (5 emails)', tokensUsed: 3800, type: 'debit' },
  { id: '8', date: '2026-02-16', client: 'Eta Logistics', operation: 'Case Study', tokensUsed: 5100, type: 'debit' },
  { id: '9', date: '2026-02-16', client: 'Acme Corp', operation: 'Landing Page Copy', tokensUsed: 2900, type: 'debit' },
  { id: '10', date: '2026-02-15', client: 'Delta Financial', operation: 'Quarterly Report Summary', tokensUsed: 7400, type: 'debit' },
  { id: '11', date: '2026-02-15', client: 'System', operation: 'Overage Credit Refund', tokensUsed: 15000, type: 'credit' },
  { id: '12', date: '2026-02-14', client: 'Zeta Media', operation: 'Video Script (3 scripts)', tokensUsed: 8600, type: 'debit' },
];

const headers = [
  { key: 'date', header: 'Date' },
  { key: 'client', header: 'Client' },
  { key: 'operation', header: 'Operation' },
  { key: 'tokensUsed', header: 'Tokens' },
  { key: 'type', header: 'Type' },
];

function formatNumber(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K`;
  return n.toString();
}

export default function TokensPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const usagePercent = Math.round((tokenStats.used / tokenStats.totalAllocated) * 100);
  const daysRemaining = Math.round(tokenStats.remaining / tokenStats.burnRate);

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.operation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredTransactions.map((tx) => ({
    id: tx.id,
    date: tx.date,
    client: tx.client,
    operation: tx.operation,
    tokensUsed: tx.tokensUsed,
    type: tx.type,
  }));

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Currency size={24} />
          {t('Token Control Panel')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Monitor and manage AI token allocation and usage')}
        </p>
      </div>

      {/* KPI Tiles */}
      <Grid style={{ marginBottom: '1.5rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <DataVis_1 size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Total Allocated')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>500K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Meter size={20} style={{ color: 'var(--cds-support-warning)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Used')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>320K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Currency size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Remaining')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>180K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Fire size={20} style={{ color: 'var(--cds-support-error)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Burn Rate')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>12K/day</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>~{daysRemaining} days remaining</p>
          </Tile>
        </Column>
      </Grid>

      {/* Progress Bar */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={16} md={8} sm={4}>
          <Tile style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem' }}>{t('Token Usage')}</p>
            <ProgressBar
              label={`${usagePercent}% used - ${formatNumber(tokenStats.used)} of ${formatNumber(tokenStats.totalAllocated)} tokens`}
              value={usagePercent}
              status={usagePercent > 80 ? 'error' : usagePercent > 60 ? 'active' : 'active'}
            />
          </Tile>
        </Column>
      </Grid>

      {/* Transactions Table */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
        }: any) => (
          <TableContainer title={t('Token Transactions')} description={`${filteredTransactions.length} transactions`}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                  placeholder={t('Search transactions...')}
                  persistent
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: (typeof headers)[number]) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(tableRows as unknown as { id: string; cells: { id: string; info: { header: string }; value: string | number }[] }[]).map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row } as unknown as { row: (typeof rows)[number] })}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === 'tokensUsed') {
                        const txn = filteredTransactions.find((tx) => tx.id === row.id);
                        const isCredit = txn?.type === 'credit';
                        return (
                          <TableCell key={cell.id}>
                            <span style={{ fontWeight: 600, color: isCredit ? 'var(--cds-support-success)' : 'var(--cds-text-primary)' }}>
                              {isCredit ? '+' : '-'}{formatNumber(cell.value as number)}
                            </span>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'type') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={cell.value === 'credit' ? 'green' : 'cool-gray'} size="sm">
                              {cell.value === 'credit' ? 'Credit' : 'Debit'}
                            </Tag>
                          </TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
