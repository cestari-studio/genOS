'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableToolbar,
  TableToolbarSearch,
  TableToolbarContent,
  Tile,
  Tag,
  Button,
  Dropdown,
  Breadcrumb,
  BreadcrumbItem,
  ContentSwitcher,
  Switch,
  AspectRatio,
} from '@carbon/react';
import { List, Grid as GridIcon, View } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

type Platform = 'Instagram' | 'LinkedIn' | 'Twitter' | 'TikTok' | 'YouTube' | 'Facebook';
type ContentType = 'post' | 'story' | 'reel' | 'carousel';
type ContentStatus = 'draft' | 'scheduled' | 'published' | 'archived';

interface SocialContent {
  id: string;
  title: string;
  platform: Platform;
  type: ContentType;
  status: ContentStatus;
  engagement: string;
  date: string;
}

const mockContent: SocialContent[] = [
  { id: '1', title: 'New Collection Reveal', platform: 'Instagram', type: 'carousel', status: 'published', engagement: '12.4K', date: '2026-02-19' },
  { id: '2', title: 'Industry Insights Q1', platform: 'LinkedIn', type: 'post', status: 'published', engagement: '3.2K', date: '2026-02-18' },
  { id: '3', title: 'Behind the Scenes Day', platform: 'Instagram', type: 'story', status: 'published', engagement: '8.7K', date: '2026-02-18' },
  { id: '4', title: 'Quick Tips Series #12', platform: 'TikTok', type: 'reel', status: 'scheduled', engagement: '--', date: '2026-02-20' },
  { id: '5', title: 'Product Demo Walkthrough', platform: 'YouTube', type: 'reel', status: 'draft', engagement: '--', date: '2026-02-17' },
  { id: '6', title: 'Customer Spotlight: Acme Corp', platform: 'LinkedIn', type: 'post', status: 'published', engagement: '1.8K', date: '2026-02-16' },
  { id: '7', title: 'Flash Sale Announcement', platform: 'Facebook', type: 'post', status: 'archived', engagement: '5.6K', date: '2026-02-14' },
  { id: '8', title: 'Team Culture Highlight', platform: 'Instagram', type: 'carousel', status: 'draft', engagement: '--', date: '2026-02-15' },
  { id: '9', title: 'Trending Audio Remix', platform: 'TikTok', type: 'reel', status: 'scheduled', engagement: '--', date: '2026-02-21' },
  { id: '10', title: '24hr Countdown Story', platform: 'Instagram', type: 'story', status: 'published', engagement: '6.1K', date: '2026-02-13' },
];

const platformTagColor: Record<Platform, string> = {
  Instagram: 'magenta',
  LinkedIn: 'blue',
  Twitter: 'cyan',
  TikTok: 'purple',
  YouTube: 'red',
  Facebook: 'blue',
};

const typeTagColor: Record<ContentType, string> = {
  post: 'teal',
  story: 'warm-gray',
  reel: 'purple',
  carousel: 'magenta',
};

const statusTagColor: Record<ContentStatus, string> = {
  draft: 'gray',
  scheduled: 'blue',
  published: 'green',
  archived: 'warm-gray',
};

const platformFilterItems = [
  { id: 'all', text: 'All Platforms' },
  { id: 'Instagram', text: 'Instagram' },
  { id: 'LinkedIn', text: 'LinkedIn' },
  { id: 'Twitter', text: 'Twitter' },
  { id: 'TikTok', text: 'TikTok' },
  { id: 'YouTube', text: 'YouTube' },
  { id: 'Facebook', text: 'Facebook' },
];

const typeFilterItems = [
  { id: 'all', text: 'All Types' },
  { id: 'post', text: 'Post' },
  { id: 'story', text: 'Story' },
  { id: 'reel', text: 'Reel' },
  { id: 'carousel', text: 'Carousel' },
];

export default function SocialContentLibraryPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [platformFilter, setPlatformFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<number>(0);

  const filtered = mockContent.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPlatform = platformFilter === 'all' || item.platform === platformFilter;
    const matchesType = typeFilter === 'all' || item.type === typeFilter;
    return matchesSearch && matchesPlatform && matchesType;
  });

  const headers = [
    { key: 'title', header: t('Title') },
    { key: 'platform', header: t('Platform') },
    { key: 'type', header: t('Type') },
    { key: 'status', header: t('Status') },
    { key: 'engagement', header: t('Engagement') },
    { key: 'date', header: t('Date') },
    { key: 'actions', header: t('Actions') },
  ];

  const rows = filtered.map((item) => ({
    id: item.id,
    title: item.title,
    platform: (
      <Tag type={platformTagColor[item.platform] as any} size="sm">
        {item.platform}
      </Tag>
    ),
    type: (
      <Tag type={typeTagColor[item.type] as any} size="sm">
        {item.type}
      </Tag>
    ),
    status: (
      <Tag type={statusTagColor[item.status] as any} size="sm">
        {item.status}
      </Tag>
    ),
    engagement: item.engagement,
    date: item.date,
    actions: (
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        iconDescription={t('View')}
        renderIcon={View}
      />
    ),
  }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem href="/dashboard">{t('Dashboard')}</BreadcrumbItem>
          <BreadcrumbItem href="/social">{t('Social Hub')}</BreadcrumbItem>
          <BreadcrumbItem href="/social/content" isCurrentPage>
            {t('Content Library')}
          </BreadcrumbItem>
        </Breadcrumb>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ marginBottom: '0.5rem' }}>{t('Social Content Library')}</h1>
            <p style={{ color: '#525252' }}>
              {t('Manage and organize all social media content across platforms.')}
            </p>
          </div>
          <ContentSwitcher
            onChange={({ index }: any) => setViewMode(index)}
            selectedIndex={viewMode}
            size="sm"
          >
            <Switch name="table" text={t('Table')} />
            <Switch name="grid" text={t('Grid')} />
          </ContentSwitcher>
        </div>
      </Column>

      {/* Filters */}
      <Column lg={16} md={8} sm={4}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div style={{ width: '200px' }}>
            <Dropdown
              id="platform-filter"
              titleText={t('Platform')}
              label={t('All Platforms')}
              items={platformFilterItems}
              itemToString={(item: any) => item?.text || ''}
              onChange={({ selectedItem }: any) => setPlatformFilter(selectedItem?.id || 'all')}
            />
          </div>
          <div style={{ width: '200px' }}>
            <Dropdown
              id="type-filter"
              titleText={t('Type')}
              label={t('All Types')}
              items={typeFilterItems}
              itemToString={(item: any) => item?.text || ''}
              onChange={({ selectedItem }: any) => setTypeFilter(selectedItem?.id || 'all')}
            />
          </div>
        </div>
      </Column>

      {viewMode === 0 ? (
        /* Table View */
        <Column lg={16} md={8} sm={4}>
          <DataTable rows={rows} headers={headers}>
            {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
              <>
                <TableToolbar>
                  <TableToolbarContent>
                    <TableToolbarSearch
                      placeholder={t('Search content...')}
                      onChange={(e: any) => {
                        const val = typeof e === 'string' ? e : e.target?.value || '';
                        setSearchTerm(val);
                      }}
                    />
                  </TableToolbarContent>
                </TableToolbar>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header) => (
                        <TableHeader {...getHeaderProps({ header })} key={header.key}>
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableRows.map((row) => (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell) => (
                          <TableCell key={cell.id}>{cell.value}</TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            )}
          </DataTable>
        </Column>
      ) : (
        /* Grid View */
        filtered.map((item) => (
          <Column key={item.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile style={{ height: '100%' }}>
              <AspectRatio ratio="16x9">
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%',
                    background: '#f4f4f4',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    color: '#8d8d8d',
                    textTransform: 'uppercase',
                  }}
                >
                  {item.type}
                </div>
              </AspectRatio>
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                  {item.title}
                </p>
                <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                  <Tag type={platformTagColor[item.platform] as any} size="sm">
                    {item.platform}
                  </Tag>
                  <Tag type={typeTagColor[item.type] as any} size="sm">
                    {item.type}
                  </Tag>
                  <Tag type={statusTagColor[item.status] as any} size="sm">
                    {item.status}
                  </Tag>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#525252' }}>
                  <span>{item.engagement !== '--' ? `${item.engagement} engagement` : 'No data'}</span>
                  <span>{item.date}</span>
                </div>
              </div>
            </Tile>
          </Column>
        ))
      )}
    </Grid>
  );
}
