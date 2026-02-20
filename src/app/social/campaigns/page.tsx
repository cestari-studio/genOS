'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
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
} from '@carbon/react';
import {
  Add,
  Bullhorn,
  Currency,
  Growth,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import { SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const campaignPerformanceData = [
  { group: 'Spring Product Launch', value: 3.8 },
  { group: 'Holiday Sale Push', value: 3.5 },
  { group: 'Customer Stories', value: 3.4 },
  { group: 'Brand Awareness Q1', value: 2.9 },
  { group: 'New Year Drive', value: 2.7 },
  { group: 'Influencer Collab', value: 4.1 },
  { group: 'Thought Leadership', value: 1.8 },
];
const campaignPerformanceOptions = {
  title: 'Campaign Performance (ROI)',
  resizable: true,
  height: '350px',
  theme: 'g10' as const,
  axes: {
    bottom: { mapsTo: 'value', title: 'ROI Multiple (x)' },
    left: { mapsTo: 'group', scaleType: 'labels' as any },
  },
};

const kpiData = [
  { label: 'Active Bullhorns', value: '5', icon: Bullhorn },
  { label: 'Total Budget', value: '$12K', icon: Currency },
  { label: 'Avg ROI', value: '3.2x', icon: Growth },
];

const campaigns = [
  {
    id: '1',
    name: 'Spring Product Launch',
    platforms: ['Instagram', 'TikTok'],
    startDate: '2026-02-01',
    endDate: '2026-03-15',
    budget: '$3,500',
    spent: '$2,100',
    roi: '3.8x',
    status: 'active',
  },
  {
    id: '2',
    name: 'Brand Awareness Q1',
    platforms: ['Twitter', 'LinkedIn'],
    startDate: '2026-01-15',
    endDate: '2026-03-31',
    budget: '$2,000',
    spent: '$1,450',
    roi: '2.9x',
    status: 'active',
  },
  {
    id: '3',
    name: 'Influencer Collab Series',
    platforms: ['Instagram', 'YouTube', 'TikTok'],
    startDate: '2026-02-10',
    endDate: '2026-04-10',
    budget: '$4,000',
    spent: '$800',
    roi: '4.1x',
    status: 'active',
  },
  {
    id: '4',
    name: 'Summer Teaser Bullhorn',
    platforms: ['Instagram', 'Twitter'],
    startDate: '2026-04-01',
    endDate: '2026-05-31',
    budget: '$2,500',
    spent: '$0',
    roi: '-',
    status: 'planned',
  },
  {
    id: '5',
    name: 'Holiday Sale Push',
    platforms: ['Instagram', 'Twitter', 'LinkedIn', 'TikTok'],
    startDate: '2025-11-15',
    endDate: '2025-12-31',
    budget: '$5,000',
    spent: '$4,800',
    roi: '3.5x',
    status: 'completed',
  },
  {
    id: '6',
    name: 'New Year Engagement Drive',
    platforms: ['Twitter', 'TikTok'],
    startDate: '2026-01-01',
    endDate: '2026-01-31',
    budget: '$1,500',
    spent: '$1,500',
    roi: '2.7x',
    status: 'completed',
  },
  {
    id: '7',
    name: 'Thought Leadership LinkedIn',
    platforms: ['LinkedIn'],
    startDate: '2026-02-15',
    endDate: '2026-05-15',
    budget: '$1,200',
    spent: '$200',
    roi: '1.8x',
    status: 'active',
  },
  {
    id: '8',
    name: 'YouTube Tutorial Series',
    platforms: ['YouTube'],
    startDate: '2026-03-01',
    endDate: '2026-06-30',
    budget: '$3,000',
    spent: '$0',
    roi: '-',
    status: 'planned',
  },
  {
    id: '9',
    name: 'Earth Day Sustainability',
    platforms: ['Instagram', 'LinkedIn', 'Twitter'],
    startDate: '2026-04-15',
    endDate: '2026-04-30',
    budget: '$800',
    spent: '$0',
    roi: '-',
    status: 'planned',
  },
  {
    id: '10',
    name: 'Customer Stories Feature',
    platforms: ['LinkedIn', 'YouTube'],
    startDate: '2026-02-01',
    endDate: '2026-03-28',
    budget: '$1,800',
    spent: '$950',
    roi: '3.4x',
    status: 'active',
  },
];

const headers = [
  { key: 'name', header: 'Bullhorn Name' },
  { key: 'platforms', header: 'Platforms' },
  { key: 'startDate', header: 'Start Date' },
  { key: 'endDate', header: 'End Date' },
  { key: 'budget', header: 'Budget' },
  { key: 'spent', header: 'Spent' },
  { key: 'roi', header: 'ROI' },
  { key: 'status', header: 'Status' },
];

const platformTagColor = (platform: string) => {
  switch (platform) {
    case 'Instagram': return 'magenta';
    case 'LinkedIn': return 'blue';
    case 'Twitter': return 'cyan';
    case 'TikTok': return 'purple';
    case 'YouTube': return 'red';
    default: return 'gray';
  }
};

const statusTagColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'planned': return 'blue';
    case 'completed': return 'gray';
    default: return 'gray';
  }
};

export default function BullhornsPage() {
  const { t } = useTranslation();

  const rows = campaigns.map((c) => ({
    ...c,
    platforms: c.platforms.join(', '),
  }));

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Bullhorn Manager')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Plan, manage, and track your social media campaigns.')}
        </p>
      </Column>

      {/* KPI Tiles */}
      {kpiData.map((kpi) => (
        <Column key={kpi.label} lg={4} md={2} sm={4} style={{ marginBottom: '1rem' }}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <kpi.icon size={20} />
              <span style={{ fontSize: '0.875rem', color: '#525252' }}>{t(kpi.label)}</span>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{kpi.value}</p>
          </Tile>
        </Column>
      ))}

      {/* Create Bullhorn Button */}
      <Column lg={4} md={2} sm={4} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button renderIcon={Add}>{t('Create Bullhorn')}</Button>
      </Column>

      {/* Campaign Performance Chart */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1rem' }}>
        <Tile>
          <SimpleBarChart data={campaignPerformanceData} options={campaignPerformanceOptions} />
        </Tile>
      </Column>

      {/* Bullhorns Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={rows} headers={headers}>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
          }: any) => (
            <TableContainer title={t('Bullhorns')}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder={t('Search campaigns...')} />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((header: any) => (
                      <TableHeader {...getHeaderProps({ header })} key={header.key}>
                        {t(String(header.header))}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row: any) => {
                    const original = campaigns.find((c) => c.id === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell: any) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'platforms' && original ? (
                              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                                {original.platforms.map((p) => (
                                  <Tag key={p} type={platformTagColor(p) as any} size="sm">
                                    {p}
                                  </Tag>
                                ))}
                              </div>
                            ) : cell.info.header === 'status' ? (
                              <Tag type={statusTagColor(cell.value) as any} size="sm">
                                {cell.value}
                              </Tag>
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
