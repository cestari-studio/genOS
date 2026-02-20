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
  DatePicker,
  DatePickerInput,
} from '@carbon/react';
import {
  View,
  UserMultiple,
  TouchInteraction,
  CheckmarkOutline,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'Impressions', value: '1.2M', icon: View },
  { label: 'Reach', value: '890K', icon: UserMultiple },
  { label: 'Clicks', value: '45K', icon: TouchInteraction },
  { label: 'Conversions', value: '1.2K', icon: CheckmarkOutline },
];

const topPosts = [
  {
    id: '1',
    title: 'Product launch teaser video',
    platform: 'Instagram',
    likes: 12430,
    comments: 892,
    shares: 3210,
    engagement: '8.7%',
  },
  {
    id: '2',
    title: 'Year in review infographic',
    platform: 'LinkedIn',
    likes: 8760,
    comments: 456,
    shares: 2100,
    engagement: '7.2%',
  },
  {
    id: '3',
    title: 'Viral meme about remote work',
    platform: 'Twitter',
    likes: 23410,
    comments: 1560,
    shares: 8920,
    engagement: '12.1%',
  },
  {
    id: '4',
    title: 'Dance challenge with product',
    platform: 'TikTok',
    likes: 154200,
    comments: 7320,
    shares: 42100,
    engagement: '18.4%',
  },
  {
    id: '5',
    title: 'Full tutorial: Getting started',
    platform: 'YouTube',
    likes: 3210,
    comments: 198,
    shares: 890,
    engagement: '5.3%',
  },
  {
    id: '6',
    title: 'Customer story: How they grew 300%',
    platform: 'LinkedIn',
    likes: 5430,
    comments: 312,
    shares: 1870,
    engagement: '6.8%',
  },
  {
    id: '7',
    title: 'Weekend vibes carousel',
    platform: 'Instagram',
    likes: 9870,
    comments: 643,
    shares: 1540,
    engagement: '7.9%',
  },
  {
    id: '8',
    title: 'Hot take: AI in marketing',
    platform: 'Twitter',
    likes: 15600,
    comments: 2340,
    shares: 5670,
    engagement: '10.5%',
  },
];

const headers = [
  { key: 'title', header: 'Title' },
  { key: 'platform', header: 'Platform' },
  { key: 'likes', header: 'Likes' },
  { key: 'comments', header: 'Comments' },
  { key: 'shares', header: 'Shares' },
  { key: 'engagement', header: 'Engagement %' },
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

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [platformFilter, setPlatformFilter] = useState('all');

  const filteredPosts =
    platformFilter === 'all'
      ? topPosts
      : topPosts.filter((p) => p.platform.toLowerCase() === platformFilter);

  const rows = filteredPosts.map((post) => ({
    ...post,
    likes: post.likes.toLocaleString(),
    comments: post.comments.toLocaleString(),
    shares: post.shares.toLocaleString(),
  }));

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Social Analytics')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Track performance across all your social channels.')}
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

      {/* Filters */}
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <Select
          id="platform-filter"
          labelText={t('Platform')}
          value={platformFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPlatformFilter(e.target.value)}
        >
          <SelectItem value="all" text={t('All Platforms')} />
          <SelectItem value="instagram" text="Instagram" />
          <SelectItem value="linkedin" text="LinkedIn" />
          <SelectItem value="twitter" text="Twitter" />
          <SelectItem value="tiktok" text="TikTok" />
          <SelectItem value="youtube" text="YouTube" />
        </Select>
      </Column>
      <Column lg={4} md={4} sm={4} style={{ marginTop: '1rem', marginBottom: '1rem' }}>
        <DatePicker datePickerType="range">
          <DatePickerInput id="date-start" placeholder="mm/dd/yyyy" labelText={t('Start date')} />
          <DatePickerInput id="date-end" placeholder="mm/dd/yyyy" labelText={t('End date')} />
        </DatePicker>
      </Column>

      {/* Top Performing Posts */}
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
            <TableContainer title={t('Top Performing Posts')}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder={t('Search posts...')} />
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
                          {cell.info.header === 'platform' ? (
                            <Tag type={platformTagColor(cell.value) as any} size="sm">
                              {cell.value}
                            </Tag>
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
