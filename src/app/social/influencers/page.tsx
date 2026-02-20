'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
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
  Add,
  UserMultiple,
  Analytics,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const kpiData = [
  { label: 'Total Partners', value: '24', icon: UserMultiple },
  { label: 'Avg Engagement', value: '5.1%', icon: Analytics },
];

const influencers = [
  {
    id: '1',
    name: 'Emma Rodriguez',
    platform: 'Instagram',
    followers: '245K',
    engagementRate: '6.2%',
    niche: 'Fashion',
    costPerPost: '$1,200',
    status: 'active',
  },
  {
    id: '2',
    name: 'Jake Chen',
    platform: 'YouTube',
    followers: '512K',
    engagementRate: '4.8%',
    niche: 'Tech',
    costPerPost: '$2,500',
    status: 'active',
  },
  {
    id: '3',
    name: 'Aisha Patel',
    platform: 'TikTok',
    followers: '1.2M',
    engagementRate: '8.3%',
    niche: 'Lifestyle',
    costPerPost: '$3,000',
    status: 'active',
  },
  {
    id: '4',
    name: 'Marcus Johnson',
    platform: 'LinkedIn',
    followers: '89K',
    engagementRate: '3.9%',
    niche: 'Business',
    costPerPost: '$800',
    status: 'active',
  },
  {
    id: '5',
    name: 'Sophie Laurent',
    platform: 'Instagram',
    followers: '178K',
    engagementRate: '5.5%',
    niche: 'Beauty',
    costPerPost: '$950',
    status: 'prospect',
  },
  {
    id: '6',
    name: 'Tyler Brooks',
    platform: 'Twitter',
    followers: '320K',
    engagementRate: '4.1%',
    niche: 'Tech',
    costPerPost: '$1,500',
    status: 'active',
  },
  {
    id: '7',
    name: 'Luna Kim',
    platform: 'TikTok',
    followers: '890K',
    engagementRate: '7.6%',
    niche: 'Food',
    costPerPost: '$2,200',
    status: 'prospect',
  },
  {
    id: '8',
    name: 'David Nakamura',
    platform: 'YouTube',
    followers: '345K',
    engagementRate: '5.2%',
    niche: 'Fitness',
    costPerPost: '$1,800',
    status: 'active',
  },
  {
    id: '9',
    name: 'Isabella Torres',
    platform: 'Instagram',
    followers: '156K',
    engagementRate: '6.8%',
    niche: 'Travel',
    costPerPost: '$1,100',
    status: 'prospect',
  },
  {
    id: '10',
    name: 'Chris Anderson',
    platform: 'LinkedIn',
    followers: '67K',
    engagementRate: '4.5%',
    niche: 'Business',
    costPerPost: '$600',
    status: 'active',
  },
];

const headers = [
  { key: 'name', header: 'Name' },
  { key: 'platform', header: 'Platform' },
  { key: 'followers', header: 'Followers' },
  { key: 'engagementRate', header: 'Engagement Rate' },
  { key: 'niche', header: 'Niche' },
  { key: 'costPerPost', header: 'Cost/Post' },
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

const nicheTagColor = (niche: string) => {
  switch (niche) {
    case 'Fashion': return 'magenta';
    case 'Tech': return 'blue';
    case 'Lifestyle': return 'teal';
    case 'Business': return 'gray';
    case 'Beauty': return 'purple';
    case 'Food': return 'orange';
    case 'Fitness': return 'green';
    case 'Travel': return 'cyan';
    default: return 'gray';
  }
};

export default function InfluencersPage() {
  const { t } = useTranslation();
  const [platformFilter, setPlatformFilter] = useState('all');
  const [nicheFilter, setNicheFilter] = useState('all');

  const filteredInfluencers = influencers.filter((inf) => {
    const matchPlatform = platformFilter === 'all' || inf.platform.toLowerCase() === platformFilter;
    const matchNiche = nicheFilter === 'all' || inf.niche.toLowerCase() === nicheFilter;
    return matchPlatform && matchNiche;
  });

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Influencer Network')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Discover, manage, and collaborate with influencers.')}
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

      {/* Add Influencer Button */}
      <Column lg={8} md={4} sm={4} style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <Button renderIcon={Add}>{t('Add Influencer')}</Button>
      </Column>

      {/* Filters */}
      <Column lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
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
      <Column lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
        <Select
          id="niche-filter"
          labelText={t('Niche')}
          value={nicheFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNicheFilter(e.target.value)}
        >
          <SelectItem value="all" text={t('All Niches')} />
          <SelectItem value="fashion" text={t('Fashion')} />
          <SelectItem value="tech" text={t('Tech')} />
          <SelectItem value="lifestyle" text={t('Lifestyle')} />
          <SelectItem value="business" text={t('Business')} />
          <SelectItem value="beauty" text={t('Beauty')} />
          <SelectItem value="food" text={t('Food')} />
          <SelectItem value="fitness" text={t('Fitness')} />
          <SelectItem value="travel" text={t('Travel')} />
        </Select>
      </Column>

      {/* Influencers Table */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredInfluencers} headers={headers}>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
          }: any) => (
            <TableContainer title={t('Influencers')}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder={t('Search influencers...')} />
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
                          ) : cell.info.header === 'niche' ? (
                            <Tag type={nicheTagColor(cell.value) as any} size="sm">
                              {cell.value}
                            </Tag>
                          ) : cell.info.header === 'status' ? (
                            <Tag type={cell.value === 'active' ? 'green' : 'blue'} size="sm">
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
