'use client';

import React, { useState } from 'react';
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
  Dropdown,
  DatePicker,
  DatePickerInput,
  Section,
  Heading,
} from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';
import { DonutChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const sentimentDistributionData = [
  { group: 'Positive', value: 67 },
  { group: 'Neutral', value: 25 },
  { group: 'Negative', value: 8 },
];
const sentimentDistributionOptions = {
  title: 'Sentiment Distribution',
  resizable: true,
  height: '320px',
  theme: 'g10' as const,
  donut: { center: { label: 'Mentions', number: 10 } },
  color: {
    scale: {
      Positive: '#24a148',
      Neutral: '#a8a8a8',
      Negative: '#da1e28',
    },
  },
};

const mentions = [
  {
    id: '1',
    source: 'Twitter',
    text: 'Just tried @genOS for our content pipeline — the AI suggestions are impressively accurate!',
    sentiment: 'positive',
    date: '2026-02-19',
  },
  {
    id: '2',
    source: 'LinkedIn',
    text: 'Comprehensive review of genOS vs competitors. GEO optimization features stand out significantly.',
    sentiment: 'positive',
    date: '2026-02-18',
  },
  {
    id: '3',
    source: 'Reddit',
    text: 'The dashboard is clean but the onboarding could use more guided tutorials for new users.',
    sentiment: 'neutral',
    date: '2026-02-18',
  },
  {
    id: '4',
    source: 'News',
    text: 'genOS raises Series B to expand AI-powered content optimization tools for enterprise teams.',
    sentiment: 'positive',
    date: '2026-02-17',
  },
  {
    id: '5',
    source: 'Twitter',
    text: 'API rate limits on the free tier are frustrating. Wish there were more generous quotas.',
    sentiment: 'negative',
    date: '2026-02-17',
  },
  {
    id: '6',
    source: 'LinkedIn',
    text: 'Our team has been using genOS for 3 months. Decent tool, results are mixed depending on niche.',
    sentiment: 'neutral',
    date: '2026-02-16',
  },
  {
    id: '7',
    source: 'Reddit',
    text: 'The competitor analysis feature just saved us hours of manual research. Highly recommend.',
    sentiment: 'positive',
    date: '2026-02-16',
  },
  {
    id: '8',
    source: 'Twitter',
    text: 'genOS keyword tracking is broken for non-English queries. Needs urgent fixing.',
    sentiment: 'negative',
    date: '2026-02-15',
  },
  {
    id: '9',
    source: 'News',
    text: 'Industry report mentions genOS as a notable player in the AI content optimization space.',
    sentiment: 'positive',
    date: '2026-02-15',
  },
  {
    id: '10',
    source: 'LinkedIn',
    text: 'Interesting approach to semantic mapping. The topic cluster visualization needs more interactivity.',
    sentiment: 'neutral',
    date: '2026-02-14',
  },
];

const platformOptions = [
  { id: 'all', text: 'All Platforms' },
  { id: 'twitter', text: 'Twitter' },
  { id: 'linkedin', text: 'LinkedIn' },
  { id: 'reddit', text: 'Reddit' },
  { id: 'news', text: 'News' },
];

const headers = [
  { key: 'source', header: 'Source' },
  { key: 'text', header: 'Mention' },
  { key: 'sentiment', header: 'Sentiment' },
  { key: 'date', header: 'Date' },
];

function SentimentTag({ sentiment }: { sentiment: string }) {
  if (sentiment === 'positive') return <Tag type="green" size="sm">Positive</Tag>;
  if (sentiment === 'negative') return <Tag type="red" size="sm">Negative</Tag>;
  return <Tag type="cool-gray" size="sm">Neutral</Tag>;
}

export default function SentimentPage() {
  const { t } = useTranslation();
  const [selectedPlatform, setSelectedPlatform] = useState<string>('all');

  const filteredMentions =
    selectedPlatform === 'all'
      ? mentions
      : mentions.filter(
          (m) => m.source.toLowerCase() === selectedPlatform
        );

  const rows = filteredMentions.map((m) => ({
    id: m.id,
    source: m.source,
    text: m.text,
    sentiment: m.sentiment,
    date: m.date,
  }));

  return (
    <div>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Sentiment Hub')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t('Monitor brand sentiment across platforms and track how perception evolves over time.')}
        </p>
      </Section>

      {/* KPI Tiles */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
              {t('Overall Sentiment')}
            </p>
            <p style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '0.5rem' }}>
              <span style={{ color: 'var(--cds-support-success)' }}>Positive</span>
            </p>
          </Tile>
        </Column>
        <Column lg={2} md={2} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <Tag type="green" size="sm">Positive</Tag>
            <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.25rem' }}>67%</p>
          </Tile>
        </Column>
        <Column lg={2} md={2} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <Tag type="cool-gray" size="sm">Neutral</Tag>
            <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.25rem' }}>25%</p>
          </Tile>
        </Column>
        <Column lg={2} md={2} sm={4}>
          <Tile style={{ textAlign: 'center' }}>
            <Tag type="red" size="sm">Negative</Tag>
            <p style={{ fontSize: '2rem', fontWeight: 600, marginTop: '0.25rem' }}>8%</p>
          </Tile>
        </Column>
      </Grid>

      {/* Sentiment Donut Chart */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={8} md={8} sm={4}>
          <Tile>
            <DonutChart data={sentimentDistributionData} options={sentimentDistributionOptions} />
          </Tile>
        </Column>
      </Grid>

      {/* Filters */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Dropdown
            id="platform-filter"
            titleText={t('Filter by Platform')}
            label={t('Select platform')}
            items={platformOptions}
            itemToString={(item: any) => (item ? item.text : '')}
            onChange={({ selectedItem }: any) =>
              setSelectedPlatform(selectedItem?.id || 'all')
            }
          />
        </Column>
        <Column lg={6} md={4} sm={4}>
          <DatePicker datePickerType="range">
            <DatePickerInput
              id="date-start"
              placeholder="mm/dd/yyyy"
              labelText={t('Start date')}
              size="md"
            />
            <DatePickerInput
              id="date-end"
              placeholder="mm/dd/yyyy"
              labelText={t('End date')}
              size="md"
            />
          </DatePicker>
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
          <TableContainer title={t('Recent Mentions')}>
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
                {tableRows.map((row: any) => (
                  <TableRow {...getRowProps({ row })} key={row.id}>
                    {row.cells.map((cell: any) => {
                      if (cell.info.header === 'sentiment') {
                        return (
                          <TableCell key={cell.id}>
                            <SentimentTag sentiment={cell.value} />
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'source') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type="blue" size="sm">{cell.value}</Tag>
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
