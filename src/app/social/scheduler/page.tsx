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
import { Add, Calendar, Time } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const scheduledPosts = [
  {
    id: '1',
    title: 'Spring collection reveal',
    platform: 'Instagram',
    date: '2026-02-20',
    time: '09:00 AM',
    status: 'scheduled',
  },
  {
    id: '2',
    title: 'Industry insights report',
    platform: 'LinkedIn',
    date: '2026-02-20',
    time: '11:30 AM',
    status: 'scheduled',
  },
  {
    id: '3',
    title: 'Weekly poll: Best tools for remote work',
    platform: 'Twitter',
    date: '2026-02-19',
    time: '02:00 PM',
    status: 'published',
  },
  {
    id: '4',
    title: 'Product demo short',
    platform: 'TikTok',
    date: '2026-02-19',
    time: '06:00 PM',
    status: 'scheduled',
  },
  {
    id: '5',
    title: 'Customer testimonial video',
    platform: 'YouTube',
    date: '2026-02-18',
    time: '10:00 AM',
    status: 'published',
  },
  {
    id: '6',
    title: 'Flash sale announcement',
    platform: 'Instagram',
    date: '2026-02-17',
    time: '08:00 AM',
    status: 'published',
  },
  {
    id: '7',
    title: 'Hiring: Senior designer',
    platform: 'LinkedIn',
    date: '2026-02-17',
    time: '09:30 AM',
    status: 'published',
  },
  {
    id: '8',
    title: 'Behind the scenes reel',
    platform: 'TikTok',
    date: '2026-02-16',
    time: '03:00 PM',
    status: 'failed',
  },
  {
    id: '9',
    title: 'Feature update thread',
    platform: 'Twitter',
    date: '2026-02-21',
    time: '01:00 PM',
    status: 'scheduled',
  },
  {
    id: '10',
    title: 'Weekly wrap-up newsletter promo',
    platform: 'LinkedIn',
    date: '2026-02-22',
    time: '10:00 AM',
    status: 'scheduled',
  },
];

const headers = [
  { key: 'title', header: 'Title' },
  { key: 'platform', header: 'Platform' },
  { key: 'date', header: 'Date' },
  { key: 'time', header: 'Time' },
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
    case 'scheduled': return 'blue';
    case 'published': return 'green';
    case 'failed': return 'red';
    default: return 'gray';
  }
};

const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const calendarWeek = [
  { day: 'Mon', date: '16', posts: 2 },
  { day: 'Tue', date: '17', posts: 2 },
  { day: 'Wed', date: '18', posts: 1 },
  { day: 'Thu', date: '19', posts: 2 },
  { day: 'Fri', date: '20', posts: 2 },
  { day: 'Sat', date: '21', posts: 1 },
  { day: 'Sun', date: '22', posts: 1 },
];

export default function SchedulerPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState('week');

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Content Scheduler')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Plan, schedule, and manage your social media content.')}
        </p>
      </Column>

      {/* View Toggle & Schedule Button */}
      <Column lg={12} md={6} sm={4} style={{ marginBottom: '1rem' }}>
        <Select
          id="view-mode"
          labelText={t('View')}
          value={viewMode}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setViewMode(e.target.value)}
          inline
        >
          <SelectItem value="week" text={t('Week')} />
          <SelectItem value="month" text={t('Month')} />
        </Select>
      </Column>
      <Column lg={4} md={2} sm={4} style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
        <Button renderIcon={Add}>{t('Schedule Post')}</Button>
      </Column>

      {/* Calendar Grid */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.5rem' }}>
          {calendarWeek.map((day) => (
            <Tile key={day.day} style={{ textAlign: 'center', padding: '1rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>{day.day}</p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                {t('Feb')} {day.date}
              </p>
              <Tag type={day.posts > 0 ? 'blue' : 'gray'} size="sm">
                {day.posts} {t('posts')}
              </Tag>
            </Tile>
          ))}
        </div>
      </Column>

      {/* Scheduled Posts Table */}
      <Column lg={16} md={8} sm={4}>
        <DataTable rows={scheduledPosts} headers={headers}>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
          }: any) => (
            <TableContainer title={t('Scheduled Posts')}>
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
                  {rows.map((row: any) => {
                    const original = scheduledPosts.find((p) => p.id === row.id);
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell: any) => (
                          <TableCell key={cell.id}>
                            {cell.info.header === 'platform' ? (
                              <Tag type={platformTagColor(cell.value) as any} size="sm">
                                {cell.value}
                              </Tag>
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
