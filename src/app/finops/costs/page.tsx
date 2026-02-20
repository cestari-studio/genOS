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
import { Chip, CloudServiceManagement, Network_2, DataBase } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'AI API Costs', value: '$24K', icon: Chip },
  { label: 'Infrastructure', value: '$12K', icon: CloudServiceManagement },
  { label: 'Bandwidth', value: '$3K', icon: Network_2 },
  { label: 'Storage', value: '$2K', icon: DataBase },
];

const costLineItems = [
  { id: 'COST-001', category: 'AI API', service: 'OpenAI GPT-4o', monthlyCost: '$12,400', trend: 'up', percentOfTotal: '22.9%' },
  { id: 'COST-002', category: 'AI API', service: 'Anthropic Claude', monthlyCost: '$8,200', trend: 'up', percentOfTotal: '15.2%' },
  { id: 'COST-003', category: 'AI API', service: 'Stability AI (Images)', monthlyCost: '$3,400', trend: 'stable', percentOfTotal: '6.3%' },
  { id: 'COST-004', category: 'Infrastructure', service: 'AWS EC2 Compute', monthlyCost: '$5,800', trend: 'down', percentOfTotal: '10.7%' },
  { id: 'COST-005', category: 'Infrastructure', service: 'AWS Lambda Functions', monthlyCost: '$2,100', trend: 'stable', percentOfTotal: '3.9%' },
  { id: 'COST-006', category: 'Infrastructure', service: 'Vercel Hosting', monthlyCost: '$1,950', trend: 'up', percentOfTotal: '3.6%' },
  { id: 'COST-007', category: 'Infrastructure', service: 'Redis Cloud', monthlyCost: '$1,250', trend: 'stable', percentOfTotal: '2.3%' },
  { id: 'COST-008', category: 'Infrastructure', service: 'PostgreSQL (Neon)', monthlyCost: '$900', trend: 'down', percentOfTotal: '1.7%' },
  { id: 'COST-009', category: 'Bandwidth', service: 'CloudFront CDN', monthlyCost: '$1,800', trend: 'up', percentOfTotal: '3.3%' },
  { id: 'COST-010', category: 'Bandwidth', service: 'Data Transfer (egress)', monthlyCost: '$1,200', trend: 'stable', percentOfTotal: '2.2%' },
  { id: 'COST-011', category: 'Storage', service: 'S3 Object Storage', monthlyCost: '$1,400', trend: 'up', percentOfTotal: '2.6%' },
  { id: 'COST-012', category: 'Storage', service: 'EBS Volumes', monthlyCost: '$600', trend: 'down', percentOfTotal: '1.1%' },
];

const headers = [
  { key: 'category', header: 'Category' },
  { key: 'service', header: 'Service' },
  { key: 'monthlyCost', header: 'Monthly Cost' },
  { key: 'trend', header: 'Trend' },
  { key: 'percentOfTotal', header: '% of Total' },
];

const categoryOptions = [
  { id: 'all', text: 'All Categories' },
  { id: 'AI API', text: 'AI API' },
  { id: 'Infrastructure', text: 'Infrastructure' },
  { id: 'Bandwidth', text: 'Bandwidth' },
  { id: 'Storage', text: 'Storage' },
];

function getTrendTag(trend: string) {
  switch (trend) {
    case 'up': return <Tag type="red" size="sm">↑ Up</Tag>;
    case 'down': return <Tag type="green" size="sm">↓ Down</Tag>;
    case 'stable': return <Tag type="blue" size="sm">→ Stable</Tag>;
    default: return <Tag type="gray" size="sm">{trend}</Tag>;
  }
}

export default function CostBreakdownPage() {
  const { t } = useTranslation();
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRows = costLineItems.filter((row) => {
    const matchesCategory = categoryFilter === 'all' || row.category === categoryFilter;
    const matchesSearch = Object.values(row).some((val) =>
      val.toLowerCase().includes(searchTerm.toLowerCase())
    );
    return matchesCategory && matchesSearch;
  });

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Cost Breakdown')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Detailed view of all operational costs by category and service.')}
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

      {/* Filter */}
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Dropdown
          id="category-filter"
          titleText={t('Filter by Category')}
          label={t('All Categories')}
          items={categoryOptions}
          itemToString={(item: { id: string; text: string } | null) => (item ? item.text : '')}
          onChange={({ selectedItem }: { selectedItem: { id: string; text: string } | null }) =>
            setCategoryFilter(selectedItem?.id || 'all')
          }
        />
      </Column>
      <Column lg={12} md={4} sm={0} />

      {/* Cost Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredRows} headers={headers} isSortable>
          {({ rows, headers: tHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <TableContainer title={t('Cost Line Items')}>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                    placeholder={t('Search costs...')}
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
                          {cell.info.header === 'trend' ? (
                            getTrendTag(cell.value)
                          ) : cell.info.header === 'category' ? (
                            <Tag type="high-contrast" size="sm">{cell.value}</Tag>
                          ) : cell.info.header === 'monthlyCost' ? (
                            <span style={{ fontWeight: 600, fontFamily: 'monospace' }}>{cell.value}</span>
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
