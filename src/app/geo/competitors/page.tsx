'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  OverflowMenu,
  OverflowMenuItem,
  Section,
  Heading,
} from '@carbon/react';
import { ArrowUp, ArrowDown, Subtract } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const competitors = [
  {
    id: '1',
    name: 'ContentVerse',
    domain: 'contentverse.io',
    geoScore: 82,
    contentVolume: 1240,
    topKeywords: 156,
    trend: 'up',
  },
  {
    id: '2',
    name: 'MarketMind AI',
    domain: 'marketmind.ai',
    geoScore: 78,
    contentVolume: 980,
    topKeywords: 132,
    trend: 'up',
  },
  {
    id: '3',
    name: 'SEO Rocket',
    domain: 'seorocket.com',
    geoScore: 74,
    contentVolume: 1560,
    topKeywords: 201,
    trend: 'stable',
  },
  {
    id: '4',
    name: 'BrandPilot',
    domain: 'brandpilot.co',
    geoScore: 71,
    contentVolume: 720,
    topKeywords: 98,
    trend: 'down',
  },
  {
    id: '5',
    name: 'NexGen Content',
    domain: 'nexgencontent.com',
    geoScore: 69,
    contentVolume: 890,
    topKeywords: 114,
    trend: 'up',
  },
  {
    id: '6',
    name: 'DataDriven Mkt',
    domain: 'datadrivenmkt.io',
    geoScore: 67,
    contentVolume: 650,
    topKeywords: 87,
    trend: 'stable',
  },
  {
    id: '7',
    name: 'WriteSmart',
    domain: 'writesmart.ai',
    geoScore: 64,
    contentVolume: 1100,
    topKeywords: 143,
    trend: 'up',
  },
  {
    id: '8',
    name: 'Omni Reach',
    domain: 'omnireach.com',
    geoScore: 61,
    contentVolume: 540,
    topKeywords: 72,
    trend: 'down',
  },
  {
    id: '9',
    name: 'Pulse Analytics',
    domain: 'pulseanalytics.io',
    geoScore: 58,
    contentVolume: 430,
    topKeywords: 63,
    trend: 'stable',
  },
  {
    id: '10',
    name: 'CreatorHub',
    domain: 'creatorhub.co',
    geoScore: 55,
    contentVolume: 780,
    topKeywords: 91,
    trend: 'down',
  },
  {
    id: '11',
    name: 'Signal SEO',
    domain: 'signalseo.com',
    geoScore: 52,
    contentVolume: 920,
    topKeywords: 108,
    trend: 'up',
  },
  {
    id: '12',
    name: 'EngageIQ',
    domain: 'engageiq.ai',
    geoScore: 48,
    contentVolume: 360,
    topKeywords: 45,
    trend: 'stable',
  },
];

const headers = [
  { key: 'name', header: 'Competitor' },
  { key: 'domain', header: 'Domain' },
  { key: 'geoScore', header: 'GEO Score' },
  { key: 'contentVolume', header: 'Content Volume' },
  { key: 'topKeywords', header: 'Top Keywords' },
  { key: 'trend', header: 'Trend' },
  { key: 'actions', header: '' },
];

function TrendTag({ trend }: { trend: string }) {
  if (trend === 'up') {
    return (
      <Tag type="green" size="sm" renderIcon={ArrowUp}>
        Up
      </Tag>
    );
  }
  if (trend === 'down') {
    return (
      <Tag type="red" size="sm" renderIcon={ArrowDown}>
        Down
      </Tag>
    );
  }
  return (
    <Tag type="cool-gray" size="sm" renderIcon={Subtract}>
      Stable
    </Tag>
  );
}

export default function CompetitorsPage() {
  const { t } = useTranslation();

  const rows = competitors.map((c) => ({
    id: c.id,
    name: c.name,
    domain: c.domain,
    geoScore: c.geoScore,
    contentVolume: c.contentVolume.toLocaleString(),
    topKeywords: c.topKeywords,
    trend: c.trend,
    actions: '',
  }));

  return (
    <div>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Competitor Intelligence')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t('Track and analyze competitor performance across GEO metrics, content output, and keyword rankings.')}
        </p>
      </Section>

      {/* KPI Tiles */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Competitors Tracked')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>12</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Avg GEO Gap')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>
              +15
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Market Share')}
            </p>
            <p style={{ fontSize: '2.5rem', fontWeight: 600 }}>23%</p>
          </Tile>
        </Column>
      </Grid>

      {/* Data Table */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
        }: any) => (
          <TableContainer title={t('Competitor Overview')}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {tableRows.map((row: any) => {
                  const competitor = competitors.find((c) => c.id === row.id);
                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell: any) => {
                        if (cell.info.header === 'trend') {
                          return (
                            <TableCell key={cell.id}>
                              <TrendTag trend={cell.value} />
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'geoScore') {
                          return (
                            <TableCell key={cell.id}>
                              <strong>{cell.value}</strong>/100
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'actions') {
                          return (
                            <TableCell key={cell.id}>
                              <OverflowMenu size="sm" flipped>
                                <OverflowMenuItem itemText={t('View detailed report')} />
                                <OverflowMenuItem itemText={t('Compare with us')} />
                                <OverflowMenuItem itemText={t('Export data')} />
                                <OverflowMenuItem itemText={t('Set alert')} hasDivider />
                              </OverflowMenu>
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
