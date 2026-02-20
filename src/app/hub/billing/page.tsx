'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Section,
  Heading,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Tag,
  ProgressBar,
} from '@carbon/react';
import { Download } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Invoice {
  id: string;
  date: string;
  amount: string;
  status: string;
}

const invoices: Invoice[] = [
  { id: 'INV-2026-02', date: 'Feb 1, 2026', amount: '$299.00', status: 'pending' },
  { id: 'INV-2026-01', date: 'Jan 1, 2026', amount: '$299.00', status: 'paid' },
  { id: 'INV-2025-12', date: 'Dec 1, 2025', amount: '$299.00', status: 'paid' },
  { id: 'INV-2025-11', date: 'Nov 1, 2025', amount: '$249.00', status: 'paid' },
  { id: 'INV-2025-10', date: 'Oct 1, 2025', amount: '$249.00', status: 'paid' },
  { id: 'INV-2025-09', date: 'Sep 1, 2025', amount: '$249.00', status: 'overdue' },
];

const headers = [
  { key: 'date', header: 'Date' },
  { key: 'amount', header: 'Amount' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '' },
];

const statusTagType: Record<string, 'green' | 'blue' | 'red'> = {
  paid: 'green',
  pending: 'blue',
  overdue: 'red',
};

export default function ClientBillingPage() {
  const { t } = useTranslation();

  const kpis = [
    { label: t('Current Plan'), value: 'Scale', sublabel: t('Professional tier') },
    { label: t('Monthly Cost'), value: '$299', sublabel: t('Billed monthly') },
    { label: t('Tokens Used'), value: '45K / 100K', sublabel: t('45% utilized') },
    { label: t('Next Invoice'), value: 'Mar 1', sublabel: t('$299.00 due') },
  ];

  const rows = invoices.map((inv) => ({
    id: inv.id,
    date: inv.date,
    amount: inv.amount,
    status: inv.status,
    actions: '',
  }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Client Billing')}
          </Heading>
        </Section>
      </Column>

      {/* KPI Tiles */}
      {kpis.map((kpi) => (
        <Column key={kpi.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ padding: '1.5rem' }}>
            <p style={{ fontSize: '0.75rem', color: '#6f6f6f', marginBottom: '0.5rem' }}>
              {kpi.label}
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 600, marginBottom: '0.25rem' }}>
              {kpi.value}
            </p>
            <p style={{ fontSize: '0.75rem', color: '#8d8d8d' }}>{kpi.sublabel}</p>
          </Tile>
        </Column>
      ))}

      {/* Token Usage Progress */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <Tile style={{ padding: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>{t('Token Usage')}</h4>
          <ProgressBar
            label={t('45,000 of 100,000 tokens used')}
            value={45}
            helperText={t('55,000 tokens remaining this billing cycle')}
          />
        </Tile>
      </Column>

      {/* Invoices Table */}
      <Column lg={16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers}>
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
            <TableContainer title={t('Invoice History')}>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => {
                      const headerProps = getHeaderProps({ header });
                      return (
                        <TableHeader key={header.key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row: any) => {
                    const rowProps = getRowProps({ row });
                    return (
                      <TableRow key={row.id} {...rowProps}>
                        {row.cells.map((cell: any) => {
                          if (cell.info.header === 'status') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag
                                  type={statusTagType[cell.value] || 'gray'}
                                  size="sm"
                                >
                                  {cell.value.charAt(0).toUpperCase() +
                                    cell.value.slice(1)}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <Button
                                  kind="ghost"
                                  size="sm"
                                  renderIcon={Download}
                                  hasIconOnly
                                  iconDescription={t('Download Invoice')}
                                />
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
            </TableContainer>
          )}
        </DataTable>
      </Column>
    </Grid>
  );
}
