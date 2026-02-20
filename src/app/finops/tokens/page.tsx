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
  ProgressBar,
} from '@carbon/react';
import { Renew, Currency, Fire, ArrowsHorizontal } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const stats = [
  { label: 'Total Tokens Minted', value: '10,000,000', icon: Renew },
  { label: 'Circulating', value: '7,200,000', icon: ArrowsHorizontal },
  { label: 'Burned', value: '2,800,000', icon: Fire },
  { label: 'Price per Token', value: '$0.003', icon: Currency },
];

const tokenTransactions = [
  { id: 'TK-001', date: '2026-02-19', tenant: 'Acme Corp', operation: 'mint', amount: '500,000', balanceAfter: '2,150,000' },
  { id: 'TK-002', date: '2026-02-18', tenant: 'Globex Inc', operation: 'burn', amount: '120,000', balanceAfter: '980,000' },
  { id: 'TK-003', date: '2026-02-17', tenant: 'Initech', operation: 'transfer', amount: '250,000', balanceAfter: '1,450,000' },
  { id: 'TK-004', date: '2026-02-16', tenant: 'Hooli', operation: 'mint', amount: '1,000,000', balanceAfter: '3,200,000' },
  { id: 'TK-005', date: '2026-02-15', tenant: 'Stark Industries', operation: 'burn', amount: '80,000', balanceAfter: '620,000' },
  { id: 'TK-006', date: '2026-02-14', tenant: 'Wayne Enterprises', operation: 'transfer', amount: '350,000', balanceAfter: '1,800,000' },
  { id: 'TK-007', date: '2026-02-13', tenant: 'Umbrella Corp', operation: 'mint', amount: '750,000', balanceAfter: '2,900,000' },
  { id: 'TK-008', date: '2026-02-12', tenant: 'Acme Corp', operation: 'burn', amount: '200,000', balanceAfter: '1,650,000' },
  { id: 'TK-009', date: '2026-02-11', tenant: 'Globex Inc', operation: 'transfer', amount: '100,000', balanceAfter: '1,100,000' },
  { id: 'TK-010', date: '2026-02-10', tenant: 'Initech', operation: 'mint', amount: '300,000', balanceAfter: '1,700,000' },
];

const allocationBreakdown = [
  { label: 'Content Generation', value: 35 },
  { label: 'AI Model Inference', value: 28 },
  { label: 'Data Processing', value: 18 },
  { label: 'API Access', value: 12 },
  { label: 'Reserve Pool', value: 7 },
];

const headers = [
  { key: 'date', header: 'Date' },
  { key: 'tenant', header: 'Tenant' },
  { key: 'operation', header: 'Operation' },
  { key: 'amount', header: 'Amount' },
  { key: 'balanceAfter', header: 'Balance After' },
];

function getOperationTagType(op: string) {
  switch (op) {
    case 'mint': return 'green';
    case 'burn': return 'red';
    case 'transfer': return 'blue';
    default: return 'gray';
  }
}

export default function TokenEconomyPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = tokenTransactions.filter((row) =>
    Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Token Economy')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Track token minting, circulation, burns, and allocation across tenants.')}
        </p>
      </Column>

      {/* Stats */}
      {stats.map((stat) => (
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

      {/* Token Transactions Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem', marginBottom: '2rem' }}>
        <DataTable rows={filteredRows} headers={headers} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('Token Transactions')}>
              <TableToolbar>
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
                    {tHeaders.map((header) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {t(String(header.header))}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const originalRow = tokenTransactions.find((r) => r.id === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'operation' ? (
                              <Tag type={getOperationTagType(cell.value)} size="sm">
                                {cell.value}
                              </Tag>
                            ) : cell.info.header === 'amount' || cell.info.header === 'balanceAfter' ? (
                              <span style={{ fontFamily: 'monospace' }}>{cell.value}</span>
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

      {/* Allocation Breakdown */}
      <Column lg={16} md={8} sm={4}>
        <Tile>
          <h3 style={{ marginBottom: '1.5rem' }}>{t('Token Allocation Breakdown')}</h3>
          {allocationBreakdown.map((item) => (
            <div key={item.label} style={{ marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.875rem' }}>{t(item.label)}</span>
                <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{item.value}%</span>
              </div>
              <ProgressBar
                value={item.value}
                max={100}
                label={t(item.label)}
                hideLabel
                size="small"
              />
            </div>
          ))}
        </Tile>
      </Column>
    </Grid>
  );
}
