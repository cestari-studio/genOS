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
  OverflowMenu,
  OverflowMenuItem,
  InlineNotification,
} from '@carbon/react';
import { Document, WarningAlt, Renew, License } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Contract {
  id: string;
  client: string;
  type: string;
  startDate: string;
  endDate: string;
  value: string;
  status: string;
}

const contracts: Contract[] = [
  { id: '1', client: 'Delta Financial', type: 'Retainer', startDate: '2025-06-01', endDate: '2026-05-31', value: '$144,000', status: 'Active' },
  { id: '2', client: 'Acme Corp', type: 'Retainer', startDate: '2025-09-01', endDate: '2026-08-31', value: '$98,400', status: 'Active' },
  { id: '3', client: 'Zeta Media', type: 'Project', startDate: '2025-11-15', endDate: '2026-03-15', value: '$38,000', status: 'Expiring' },
  { id: '4', client: 'Gamma Health', type: 'Retainer', startDate: '2025-04-01', endDate: '2026-03-31', value: '$81,600', status: 'Expiring' },
  { id: '5', client: 'Beta Industries', type: 'Project', startDate: '2025-08-01', endDate: '2026-01-31', value: '$32,400', status: 'Expired' },
  { id: '6', client: 'Iota Foods', type: 'Retainer', startDate: '2025-10-01', endDate: '2026-09-30', value: '$91,200', status: 'Active' },
  { id: '7', client: 'Eta Logistics', type: 'Project', startDate: '2026-01-01', endDate: '2026-06-30', value: '$24,600', status: 'Active' },
  { id: '8', client: 'Epsilon Retail', type: 'Retainer', startDate: '2025-07-01', endDate: '2026-06-30', value: '$38,400', status: 'Active' },
  { id: '9', client: 'Theta Education', type: 'Project', startDate: '2025-12-01', endDate: '2026-02-28', value: '$8,700', status: 'Expiring' },
  { id: '10', client: 'Kappa Energy', type: 'Retainer', startDate: '2025-05-01', endDate: '2025-12-31', value: '$40,000', status: 'Expired' },
];

const statusColor: Record<string, 'green' | 'red' | 'gray'> = {
  Active: 'green',
  Expiring: 'red',
  Expired: 'gray',
};

const typeColor: Record<string, 'blue' | 'purple'> = {
  Retainer: 'blue',
  Project: 'purple',
};

const headers = [
  { key: 'client', header: 'Client' },
  { key: 'type', header: 'Type' },
  { key: 'startDate', header: 'Start Date' },
  { key: 'endDate', header: 'End Date' },
  { key: 'value', header: 'Value' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '' },
];

export default function ContractsPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const expiringContracts = contracts.filter((c) => c.status === 'Expiring');
  const activeContracts = contracts.filter((c) => c.status === 'Active');
  const expiredContracts = contracts.filter((c) => c.status === 'Expired');

  const filteredContracts = contracts.filter((c) =>
    c.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredContracts.map((c) => ({
    id: c.id,
    client: c.client,
    type: c.type,
    startDate: c.startDate,
    endDate: c.endDate,
    value: c.value,
    status: c.status,
    actions: '',
  }));

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <License size={24} />
          {t('Contract Vault')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Manage client contracts, renewals, and agreements')}
        </p>
      </div>

      {/* Expiring Contracts Notification */}
      {expiringContracts.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <InlineNotification
            kind="warning"
            title={t('Contracts Expiring Soon')}
            subtitle={`${expiringContracts.length} contract(s) expiring within 60 days: ${expiringContracts.map(c => c.client).join(', ')}`}
            lowContrast
            hideCloseButton
          />
        </div>
      )}

      {/* Summary Stats */}
      <Grid style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Document size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Total Contracts')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{contracts.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Active')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>{activeContracts.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <WarningAlt size={20} style={{ color: 'var(--cds-support-warning)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Expiring')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-warning)' }}>{expiringContracts.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Expired')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-text-secondary)' }}>{expiredContracts.length}</p>
          </Tile>
        </Column>
      </Grid>

      {/* DataTable */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
        }: any) => (
          <TableContainer title={t('All Contracts')} description={`${filteredContracts.length} contracts`}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                  placeholder={t('Search contracts...')}
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
                      if (cell.info.header === 'type') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={typeColor[cell.value as string] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'status') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={statusColor[cell.value as string] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'value') {
                        return (
                          <TableCell key={cell.id}>
                            <span style={{ fontWeight: 600 }}>{cell.value}</span>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === '') {
                        return (
                          <TableCell key={cell.id}>
                            <OverflowMenu size="sm" flipped>
                              <OverflowMenuItem itemText={t('View Contract')} />
                              <OverflowMenuItem itemText={t('Download PDF')} />
                              <OverflowMenuItem itemText={t('Renew Contract')} />
                              <OverflowMenuItem itemText={t('Edit Terms')} />
                              <OverflowMenuItem hasDivider isDelete itemText={t('Terminate')} />
                            </OverflowMenu>
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
