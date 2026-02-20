'use client';

import React, { useState } from 'react';
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
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Tag,
  Dropdown,
  DatePicker,
  DatePickerInput,
  InlineNotification,
} from '@carbon/react';
import { DocumentTasks } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const auditEvents = [
  { id: 'AUD-001', timestamp: '2026-02-19 14:32:08', type: 'payment', amount: '$8,500.00', user: 'Maria Chen', description: 'Invoice INV-1042 payment processed via Stripe', reference: 'REF-88412' },
  { id: 'AUD-002', timestamp: '2026-02-19 11:05:22', type: 'adjustment', amount: '$-320.00', user: 'James Park', description: 'Credit adjustment for Acme Corp — billing error correction', reference: 'REF-88411' },
  { id: 'AUD-003', timestamp: '2026-02-18 16:48:55', type: 'refund', amount: '$-1,200.00', user: 'Sarah Lopez', description: 'Partial refund issued to Globex Corp — service downtime', reference: 'REF-88410', flagged: true },
  { id: 'AUD-004', timestamp: '2026-02-18 09:12:33', type: 'payment', amount: '$12,750.00', user: 'Maria Chen', description: 'Invoice INV-1039 payment received via wire transfer', reference: 'REF-88409' },
  { id: 'AUD-005', timestamp: '2026-02-17 15:30:00', type: 'credit', amount: '$500.00', user: 'James Park', description: 'Promotional credit applied to Initech account', reference: 'REF-88408' },
  { id: 'AUD-006', timestamp: '2026-02-17 10:22:14', type: 'payment', amount: '$22,400.00', user: 'Maria Chen', description: 'Invoice INV-1038 payment received — Hooli Q1 prepayment', reference: 'REF-88407' },
  { id: 'AUD-007', timestamp: '2026-02-16 17:55:41', type: 'adjustment', amount: '$-890.00', user: 'Sarah Lopez', description: 'Bandwidth overage write-off — CDN pricing error', reference: 'REF-88406', flagged: true },
  { id: 'AUD-008', timestamp: '2026-02-16 08:40:19', type: 'payment', amount: '$6,800.00', user: 'Maria Chen', description: 'Invoice INV-1037 partial payment — Stark Industries', reference: 'REF-88405' },
  { id: 'AUD-009', timestamp: '2026-02-15 14:10:05', type: 'refund', amount: '$-2,400.00', user: 'James Park', description: 'Full refund — Soylent Corp contract termination', reference: 'REF-88404' },
  { id: 'AUD-010', timestamp: '2026-02-15 09:30:50', type: 'credit', amount: '$1,000.00', user: 'Sarah Lopez', description: 'Loyalty credit applied — Wayne Enterprises annual renewal', reference: 'REF-88403' },
  { id: 'AUD-011', timestamp: '2026-02-14 16:20:33', type: 'payment', amount: '$14,200.00', user: 'Maria Chen', description: 'Invoice INV-1036 payment — Cyberdyne Systems', reference: 'REF-88402' },
  { id: 'AUD-012', timestamp: '2026-02-14 11:45:12', type: 'adjustment', amount: '$3,200.00', user: 'James Park', description: 'Revenue reconciliation adjustment — Q4 2025 true-up', reference: 'REF-88401', flagged: true },
];

const headers = [
  { key: 'timestamp', header: 'Timestamp' },
  { key: 'type', header: 'Type' },
  { key: 'amount', header: 'Amount' },
  { key: 'user', header: 'User' },
  { key: 'description', header: 'Description' },
  { key: 'reference', header: 'Reference #' },
];

const typeOptions = [
  { id: 'all', text: 'All Types' },
  { id: 'payment', text: 'Payment' },
  { id: 'refund', text: 'Refund' },
  { id: 'adjustment', text: 'Adjustment' },
  { id: 'credit', text: 'Credit' },
];

function getTypeTag(type: string) {
  switch (type) {
    case 'payment': return <Tag type="green" size="sm">Payment</Tag>;
    case 'refund': return <Tag type="magenta" size="sm">Refund</Tag>;
    case 'adjustment': return <Tag type="purple" size="sm">Adjustment</Tag>;
    case 'credit': return <Tag type="teal" size="sm">Credit</Tag>;
    default: return <Tag type="gray" size="sm">{type}</Tag>;
  }
}

export default function AuditTrailPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  const flaggedEvents = auditEvents.filter((e) => e.flagged);

  const filteredRows = auditEvents.filter((row) => {
    const matchesType = typeFilter === 'all' || row.type === typeFilter;
    const matchesSearch = Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesType && matchesSearch;
  });

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('FinOps Audit Trail')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Complete log of all financial events, transactions, and flagged items.')}
        </p>
      </Column>

      {/* Flagged Transaction Notifications */}
      {flaggedEvents.map((event) => (
        <Column key={event.id} lg={16} md={8} sm={4} style={{ marginBottom: '0.5rem' }}>
          <InlineNotification
            kind="warning"
            title={t('Flagged Transaction')}
            subtitle={`${event.reference} — ${event.description} (${event.amount})`}
            lowContrast
            hideCloseButton
          />
        </Column>
      ))}

      {/* Filters */}
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Dropdown
          id="type-filter"
          titleText={t('Filter by Type')}
          label={t('All Types')}
          items={typeOptions}
          itemToString={(item: { id: string; text: string } | null) => (item ? item.text : '')}
          onChange={({ selectedItem }: { selectedItem: { id: string; text: string } | null }) =>
            setTypeFilter(selectedItem?.id || 'all')
          }
        />
      </Column>
      <Column lg={6} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <DatePicker datePickerType="range" dateFormat="Y-m-d">
          <DatePickerInput
            id="date-picker-start"
            placeholder="yyyy-mm-dd"
            labelText={t('Start date')}
            size="md"
          />
          <DatePickerInput
            id="date-picker-end"
            placeholder="yyyy-mm-dd"
            labelText={t('End date')}
            size="md"
          />
        </DatePicker>
      </Column>
      <Column lg={6} md={0} sm={0} />

      {/* Audit Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredRows} headers={headers} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('Financial Events')}>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                    placeholder={t('Search by reference, description, or user...')}
                    persistent
                  />
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
                    const originalRow = auditEvents.find((e) => e.id === row.id);
                    const isFlagged = originalRow?.flagged;
                    return (
                      <TableRow
                        {...getRowProps({ row })}
                        key={row.id}
                        style={isFlagged ? { backgroundColor: 'rgba(255, 209, 122, 0.15)' } : undefined}
                      >
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'type' ? (
                              getTypeTag(cell.value)
                            ) : cell.info.header === 'reference' ? (
                              <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>{cell.value}</span>
                            ) : cell.info.header === 'amount' ? (
                              <span
                                style={{
                                  fontFamily: 'monospace',
                                  fontWeight: 600,
                                  color: cell.value.startsWith('-') ? '#da1e28' : '#198038',
                                }}
                              >
                                {cell.value}
                              </span>
                            ) : cell.info.header === 'timestamp' ? (
                              <span style={{ fontFamily: 'monospace', fontSize: '0.8125rem' }}>{cell.value}</span>
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
