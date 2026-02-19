'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Grid,
  Column,
  Tile,
  Breadcrumb,
  BreadcrumbItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
} from '@carbon/react';
import { TreemapChart } from '@carbon/charts-react';
import { useTranslation } from '@/lib/i18n/context';

import '@carbon/charts-react/styles.css';

// Mock GEO data — will be replaced with real API when available
const geoMockData = [
  { region: 'São Paulo', impressions: 45200, engagement: 4.2, reach: 38000, revenue: 52000 },
  { region: 'Rio de Janeiro', impressions: 28300, engagement: 3.8, reach: 22000, revenue: 31000 },
  { region: 'Minas Gerais', impressions: 18700, engagement: 3.5, reach: 15000, revenue: 19000 },
  { region: 'Paraná', impressions: 12400, engagement: 4.0, reach: 10500, revenue: 14000 },
  { region: 'Rio Grande do Sul', impressions: 11800, engagement: 3.9, reach: 9800, revenue: 12500 },
  { region: 'Bahia', impressions: 9200, engagement: 3.3, reach: 7500, revenue: 8500 },
  { region: 'Santa Catarina', impressions: 8600, engagement: 4.1, reach: 7200, revenue: 9800 },
  { region: 'Distrito Federal', impressions: 7800, engagement: 4.5, reach: 6800, revenue: 11000 },
  { region: 'Pernambuco', impressions: 6500, engagement: 3.2, reach: 5200, revenue: 5800 },
  { region: 'Ceará', impressions: 5100, engagement: 3.0, reach: 4100, revenue: 4200 },
];

export default function GeoContent() {
  const { t } = useTranslation();
  const [data] = useState(geoMockData);

  const treemapData = data.map((d) => ({
    name: d.region,
    value: d.impressions,
  }));

  const topRegions = [...data].sort((a, b) => b.impressions - a.impressions).slice(0, 5);

  const headers = [
    { key: 'region', header: t('geo.region') },
    { key: 'impressions', header: t('geo.impressions') },
    { key: 'engagement', header: t('geo.engagement') },
    { key: 'reach', header: t('geo.reach') },
    { key: 'revenue', header: t('geo.revenue') },
  ];

  const rows = data.map((d, i) => ({
    id: String(i),
    region: d.region,
    impressions: d.impressions.toLocaleString('pt-BR'),
    engagement: `${d.engagement}%`,
    reach: d.reach.toLocaleString('pt-BR'),
    revenue: `R$ ${d.revenue.toLocaleString('pt-BR')}`,
  }));

  return (
    <div>
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem>
          <Link href="/dashboard">{t('sidebar.dashboard')}</Link>
        </BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('geo.title')}</BreadcrumbItem>
      </Breadcrumb>

      <div className="page-header">
        <h1>{t('geo.title')}</h1>
        <p>{t('geo.subtitle')}</p>
      </div>

      {/* Top 5 region stat cards */}
      <div className="stats-grid">
        {topRegions.map((region, i) => (
          <Tile key={region.region} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: 'var(--cds-text-secondary)' }}>
              <Tag type={i === 0 ? 'blue' : 'gray'} size="sm">#{i + 1}</Tag>
              <span>{region.region}</span>
            </div>
            <div className="stat-value">{region.impressions.toLocaleString('pt-BR')}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-helper)' }}>
              {t('geo.impressions')} • {region.engagement}% {t('geo.engagementLabel')}
            </div>
          </Tile>
        ))}
      </div>

      <Grid style={{ marginTop: '1.5rem' }}>
        <Column lg={16} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <TreemapChart
              data={treemapData}
              options={{
                title: t('geo.performanceByRegion'),
                height: '400px',
                theme: 'g100' as any,
              }}
            />
          </Tile>
        </Column>

        <Column lg={16} md={8} sm={4}>
          <Tile>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem', fontWeight: 600 }}>
              {t('geo.detailedBreakdown')}
            </h3>
            <DataTable rows={rows} headers={headers}>
              {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableHeader {...getHeaderProps({ header })}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows.map((row) => (
                      <TableRow {...getRowProps({ row })}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </DataTable>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
