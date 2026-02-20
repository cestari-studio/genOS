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
  Dropdown,
} from '@carbon/react';
import { Analytics, Growth, UserMultiple, Currency } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'Platform ROI', value: '4.2x', icon: Analytics },
  { label: 'Content ROI', value: '6.1x', icon: Growth },
  { label: 'AI Investment ROI', value: '3.8x', icon: Currency },
  { label: 'Client Lifetime Value', value: '$12K', icon: UserMultiple },
];

const roiByClient = [
  { id: 'ROI-001', client: 'Acme Corp', investment: '$18,500', revenue: '$92,400', roiMultiple: '5.0x', status: 'excellent' },
  { id: 'ROI-002', client: 'Globex Inc', investment: '$12,000', revenue: '$48,600', roiMultiple: '4.1x', status: 'good' },
  { id: 'ROI-003', client: 'Initech', investment: '$8,400', revenue: '$31,200', roiMultiple: '3.7x', status: 'good' },
  { id: 'ROI-004', client: 'Hooli', investment: '$22,000', revenue: '$132,000', roiMultiple: '6.0x', status: 'excellent' },
  { id: 'ROI-005', client: 'Stark Industries', investment: '$15,800', revenue: '$55,300', roiMultiple: '3.5x', status: 'good' },
  { id: 'ROI-006', client: 'Wayne Enterprises', investment: '$28,000', revenue: '$196,000', roiMultiple: '7.0x', status: 'excellent' },
  { id: 'ROI-007', client: 'Umbrella Corp', investment: '$9,200', revenue: '$18,400', roiMultiple: '2.0x', status: 'moderate' },
  { id: 'ROI-008', client: 'Oscorp', investment: '$6,500', revenue: '$8,450', roiMultiple: '1.3x', status: 'low' },
  { id: 'ROI-009', client: 'Cyberdyne Systems', investment: '$14,200', revenue: '$56,800', roiMultiple: '4.0x', status: 'good' },
  { id: 'ROI-010', client: 'Soylent Corp', investment: '$4,800', revenue: '$2,400', roiMultiple: '0.5x', status: 'negative' },
];

const headers = [
  { key: 'client', header: 'Client' },
  { key: 'investment', header: 'Investment' },
  { key: 'revenue', header: 'Revenue' },
  { key: 'roiMultiple', header: 'ROI Multiple' },
  { key: 'status', header: 'Status' },
];

const timePeriods = [
  { id: 'all', text: 'All Time' },
  { id: 'q1-2026', text: 'Q1 2026' },
  { id: 'q4-2025', text: 'Q4 2025' },
  { id: 'q3-2025', text: 'Q3 2025' },
  { id: 'last-12m', text: 'Last 12 Months' },
];

function getStatusTag(status: string) {
  switch (status) {
    case 'excellent': return <Tag type="green" size="sm">Excellent</Tag>;
    case 'good': return <Tag type="teal" size="sm">Good</Tag>;
    case 'moderate': return <Tag type="blue" size="sm">Moderate</Tag>;
    case 'low': return <Tag type="warm-gray" size="sm">Low</Tag>;
    case 'negative': return <Tag type="red" size="sm">Negative</Tag>;
    default: return <Tag type="gray" size="sm">{status}</Tag>;
  }
}

export default function ROITrackerPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [timePeriod, setTimePeriod] = useState('all');

  const filteredRows = roiByClient.filter((row) =>
    Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('ROI Tracker')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Measure return on investment across clients, content, and AI initiatives.')}
        </p>
      </Column>

      {/* KPI Tiles */}
      {kpiData.map((kpi) => (
        <Column key={kpi.label} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ minHeight: '130px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <kpi.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{kpi.value}</p>
          </Tile>
        </Column>
      ))}

      {/* Time Period Filter */}
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Dropdown
          id="time-period-filter"
          titleText={t('Filter by Time Period')}
          label={t('All Time')}
          items={timePeriods}
          itemToString={(item: { id: string; text: string } | null) => (item ? item.text : '')}
          onChange={({ selectedItem }: { selectedItem: { id: string; text: string } | null }) =>
            setTimePeriod(selectedItem?.id || 'all')
          }
        />
      </Column>
      <Column lg={12} md={4} sm={0} />

      {/* ROI Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredRows} headers={headers} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('ROI by Client')}>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                    placeholder={t('Search clients...')}
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
                  {rows.map((row) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'status' ? (
                            getStatusTag(cell.value)
                          ) : cell.info.header === 'roiMultiple' ? (
                            <span style={{ fontWeight: 700, fontSize: '1rem' }}>{cell.value}</span>
                          ) : cell.info.header === 'investment' || cell.info.header === 'revenue' ? (
                            <span style={{ fontFamily: 'monospace' }}>{cell.value}</span>
                          ) : (
                            cell.value
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      </Column>
    </Grid>
  );
}
