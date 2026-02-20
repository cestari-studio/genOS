'use client';

import React, { useState } from 'react';
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
  Button,
  OverflowMenu,
  OverflowMenuItem,
} from '@carbon/react';
import { Add, Currency, WarningAlt } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const statsData = [
  { label: 'Total Outstanding', value: '$34K', icon: Currency },
  { label: 'Overdue', value: '$5.2K', icon: WarningAlt },
];

const invoices = [
  { id: 'INV-1042', invoiceNum: 'INV-1042', client: 'Acme Corp', amount: '$8,500.00', issueDate: '2026-02-01', dueDate: '2026-03-01', status: 'paid' },
  { id: 'INV-1041', invoiceNum: 'INV-1041', client: 'Globex Inc', amount: '$12,750.00', issueDate: '2026-01-28', dueDate: '2026-02-28', status: 'pending' },
  { id: 'INV-1040', invoiceNum: 'INV-1040', client: 'Initech', amount: '$3,200.00', issueDate: '2026-01-15', dueDate: '2026-02-15', status: 'overdue' },
  { id: 'INV-1039', invoiceNum: 'INV-1039', client: 'Hooli', amount: '$22,400.00', issueDate: '2026-01-20', dueDate: '2026-02-20', status: 'paid' },
  { id: 'INV-1038', invoiceNum: 'INV-1038', client: 'Stark Industries', amount: '$6,800.00', issueDate: '2026-02-05', dueDate: '2026-03-05', status: 'pending' },
  { id: 'INV-1037', invoiceNum: 'INV-1037', client: 'Wayne Enterprises', amount: '$18,900.00', issueDate: '2026-02-10', dueDate: '2026-03-10', status: 'draft' },
  { id: 'INV-1036', invoiceNum: 'INV-1036', client: 'Umbrella Corp', amount: '$2,000.00', issueDate: '2026-01-05', dueDate: '2026-02-05', status: 'overdue' },
  { id: 'INV-1035', invoiceNum: 'INV-1035', client: 'Cyberdyne Systems', amount: '$14,200.00', issueDate: '2026-01-25', dueDate: '2026-02-25', status: 'pending' },
  { id: 'INV-1034', invoiceNum: 'INV-1034', client: 'Oscorp', amount: '$4,600.00', issueDate: '2026-02-12', dueDate: '2026-03-12', status: 'draft' },
  { id: 'INV-1033', invoiceNum: 'INV-1033', client: 'Soylent Corp', amount: '$9,300.00', issueDate: '2026-01-18', dueDate: '2026-02-18', status: 'paid' },
];

const headers = [
  { key: 'invoiceNum', header: 'Invoice #' },
  { key: 'client', header: 'Client' },
  { key: 'amount', header: 'Amount' },
  { key: 'issueDate', header: 'Issue Date' },
  { key: 'dueDate', header: 'Due Date' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Actions' },
];

function getStatusTag(status: string) {
  switch (status) {
    case 'paid': return <Tag type="green" size="sm">Paid</Tag>;
    case 'pending': return <Tag type="blue" size="sm">Pending</Tag>;
    case 'overdue': return <Tag type="red" size="sm">Overdue</Tag>;
    case 'draft': return <Tag type="cool-gray" size="sm">Draft</Tag>;
    default: return <Tag type="gray" size="sm">{status}</Tag>;
  }
}

export default function InvoicesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = invoices
    .filter((row) =>
      Object.values(row).some((val) =>
        val.toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .map((row) => ({
      ...row,
      actions: '',
    }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Invoice Manager')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Create, track, and manage client invoices and payment status.')}
        </p>
      </Column>

      {/* Stats */}
      {statsData.map((stat) => (
        <Column key={stat.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ minHeight: '130px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <stat.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(stat.label)}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{stat.value}</p>
          </Tile>
        </Column>
      ))}
      <Column lg={8} md={0} sm={0} />

      {/* Invoice Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredRows} headers={headers} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('Invoices')}>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                    placeholder={t('Search invoices...')}
                    persistent
                  />
                  <Button renderIcon={Add} kind="primary" size="sm">
                    {t('Create Invoice')}
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tHeaders.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {t(String(header.header))}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const originalRow = invoices.find((inv) => inv.id === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'status' ? (
                              getStatusTag(originalRow?.status || '')
                            ) : cell.info.header === 'invoiceNum' ? (
                              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cell.value}</span>
                            ) : cell.info.header === 'amount' ? (
                              <span style={{ fontFamily: 'monospace' }}>{cell.value}</span>
                            ) : cell.info.header === 'actions' ? (
                              <OverflowMenu size="sm" flipped>
                                <OverflowMenuItem itemText={t('Download PDF')} />
                                <OverflowMenuItem itemText={t('Send to Client')} />
                                <OverflowMenuItem itemText={t('Void Invoice')} isDelete />
                              </OverflowMenu>
                            ) : (
                              cell.value
                            )}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Column>
    </Grid>
  );
}
