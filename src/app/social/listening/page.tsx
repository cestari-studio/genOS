'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Select,
  SelectItem,
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
  Hearing,
  FaceSatisfied,
  FaceDissatisfied,
  FaceNeutral,
  Analytics,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'Total Mentions', value: '3.4K', icon: Hearing },
  { label: 'Positive', value: '68%', icon: FaceSatisfied },
  { label: 'Negative', value: '12%', icon: FaceDissatisfied },
  { label: 'Neutral', value: '20%', icon: FaceNeutral },
];

const mentions = [
  {
    id: '1',
    source: '@techreviewer',
    text: 'Just tried the new update from genOS — absolutely love the new dashboard UX!',
    sentiment: 'Positive',
    platform: 'Twitter',
    date: '2026-02-19',
  },
  {
    id: '2',
    source: 'TechCrunch Article',
    text: 'genOS continues to disrupt the marketing automation space with innovative features...',
    sentiment: 'Positive',
    platform: 'Web',
    date: '2026-02-19',
  },
  {
    id: '3',
    source: '@frustrated_user',
    text: 'The mobile app keeps crashing after the latest update. Please fix this @genOS',
    sentiment: 'Negative',
    platform: 'Twitter',
    date: '2026-02-18',
  },
  {
    id: '4',
    source: 'Marketing Weekly',
    text: 'genOS announced new partnerships with three major enterprise clients this quarter.',
    sentiment: 'Neutral',
    platform: 'Web',
    date: '2026-02-18',
  },
  {
    id: '5',
    source: '@digital_sarah',
    text: 'Switched from competitor to genOS last month. Best decision for our social strategy.',
    sentiment: 'Positive',
    platform: 'Instagram',
    date: '2026-02-17',
  },
  {
    id: '6',
    source: '@mktg_pro',
    text: 'The analytics in genOS are decent but still missing some advanced segmentation options.',
    sentiment: 'Neutral',
    platform: 'LinkedIn',
    date: '2026-02-17',
  },
  {
    id: '7',
    source: 'Reddit r/marketing',
    text: 'Has anyone had billing issues with genOS? Been charged twice this month.',
    sentiment: 'Negative',
    platform: 'Reddit',
    date: '2026-02-16',
  },
  {
    id: '8',
    source: '@brand_builder',
    text: 'Our engagement went up 40% after implementing genOS scheduling tools. Highly recommend!',
    sentiment: 'Positive',
    platform: 'Twitter',
    date: '2026-02-16',
  },
  {
    id: '9',
    source: '@agency_lead',
    text: 'genOS just released their API docs. Looking forward to building integrations.',
    sentiment: 'Positive',
    platform: 'LinkedIn',
    date: '2026-02-15',
  },
  {
    id: '10',
    source: '@social_newbie',
    text: 'Not sure how genOS compares to other tools. Anyone have experience?',
    sentiment: 'Neutral',
    platform: 'Twitter',
    date: '2026-02-15',
  },
];

const headers = [
  { key: 'source', header: 'Source' },
  { key: 'text', header: 'Mention' },
  { key: 'sentiment', header: 'Sentiment' },
  { key: 'platform', header: 'Platform' },
  { key: 'date', header: 'Date' },
];

const sentimentTagColor = (sentiment: string) => {
  switch (sentiment) {
    case 'Positive': return 'green';
    case 'Negative': return 'red';
    case 'Neutral': return 'gray';
    default: return 'gray';
  }
};

const platformTagColor = (platform: string) => {
  switch (platform) {
    case 'Instagram': return 'magenta';
    case 'LinkedIn': return 'blue';
    case 'Twitter': return 'cyan';
    case 'Reddit': return 'orange';
    case 'Web': return 'teal';
    default: return 'gray';
  }
};

export default function ListeningPage() {
  const { t } = useTranslation();
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [platformFilter, setPlatformFilter] = useState('all');

  const filteredMentions = mentions.filter((m) => {
    const matchSentiment = sentimentFilter === 'all' || m.sentiment.toLowerCase() === sentimentFilter;
    const matchPlatform = platformFilter === 'all' || m.platform.toLowerCase() === platformFilter;
    return matchSentiment && matchPlatform;
  });

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Social Listening')}</h1>
        <h3 style={{ marginBottom: '2rem', color: '#525252', fontWeight: 400 }}>
          {t('Brand Mentions & Sentiment')}
        </h3>
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

      {/* Filters */}
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Select
          id="sentiment-filter"
          labelText={t('Sentiment')}
          value={sentimentFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSentimentFilter(e.target.value)}
        >
          <SelectItem value="all" text={t('All Sentiments')} />
          <SelectItem value="positive" text={t('Positive')} />
          <SelectItem value="negative" text={t('Negative')} />
          <SelectItem value="neutral" text={t('Neutral')} />
        </Select>
      </Column>
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Select
          id="platform-filter"
          labelText={t('Platform')}
          value={platformFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformFilter(e.target.value)}
        >
          <SelectItem value="all" text={t('All Platforms')} />
          <SelectItem value="twitter" text="Twitter" />
          <SelectItem value="instagram" text="Instagram" />
          <SelectItem value="linkedin" text="LinkedIn" />
          <SelectItem value="reddit" text="Reddit" />
          <SelectItem value="web" text="Web" />
        </Select>
      </Column>

      {/* Mentions Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredMentions} headers={headers}>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
          }: any) => (
            <TableContainer title={t('Brand Mentions')}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder={t('Search mentions...')} />
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
                  {rows.map((row: any) => (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>
                          {cell.info.header === 'sentiment' ? (
                            <Tag type={sentimentTagColor(cell.value) as any} size="sm">
                              {cell.value}
                            </Tag>
                          ) : cell.info.header === 'platform' ? (
                            <Tag type={platformTagColor(cell.value) as any} size="sm">
                              {cell.value}
                            </Tag>
                          ) : cell.info.header === 'text' ? (
                            <span style={{ maxWidth: '400px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {cell.value}
                            </span>
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
