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
  TextInput,
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
import { Send, Email } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const messages = [
  {
    id: '1',
    platform: 'Instagram',
    from: '@fashionlover92',
    message: 'Love the new collection! When will the blue dress be back in stock?',
    date: '2026-02-19 14:32',
    status: 'unread',
  },
  {
    id: '2',
    platform: 'Twitter',
    from: '@techstartup_jay',
    message: 'Your latest feature update is exactly what we needed. Great work team!',
    date: '2026-02-19 13:15',
    status: 'unread',
  },
  {
    id: '3',
    platform: 'LinkedIn',
    from: 'Sarah Mitchell',
    message: 'Hi, I would love to discuss a potential partnership opportunity with your company.',
    date: '2026-02-19 11:45',
    status: 'read',
  },
  {
    id: '4',
    platform: 'Instagram',
    from: '@creative_minds',
    message: 'Can we collaborate on an upcoming campaign? DM us the details.',
    date: '2026-02-19 10:20',
    status: 'replied',
  },
  {
    id: '5',
    platform: 'Twitter',
    from: '@unhappy_customer',
    message: 'My order #4521 has been delayed for 2 weeks. Can someone please help?',
    date: '2026-02-18 22:10',
    status: 'unread',
  },
  {
    id: '6',
    platform: 'TikTok',
    from: '@dance_queen',
    message: 'Loved the challenge! Would be amazing to collab on a duet video.',
    date: '2026-02-18 18:30',
    status: 'read',
  },
  {
    id: '7',
    platform: 'YouTube',
    from: 'VideoProMax',
    message: 'Great tutorial! Could you make one about advanced analytics features?',
    date: '2026-02-18 15:45',
    status: 'replied',
  },
  {
    id: '8',
    platform: 'LinkedIn',
    from: 'James Rodriguez',
    message: 'Interested in your enterprise plan. Can we schedule a demo call this week?',
    date: '2026-02-18 09:00',
    status: 'replied',
  },
  {
    id: '9',
    platform: 'Instagram',
    from: '@plant_parent',
    message: 'Is the eco-friendly packaging available for all products now?',
    date: '2026-02-17 20:15',
    status: 'read',
  },
  {
    id: '10',
    platform: 'Twitter',
    from: '@dev_community',
    message: 'Are you planning to open-source any of your tools? The community would love it.',
    date: '2026-02-17 16:30',
    status: 'unread',
  },
];

const headers = [
  { key: 'platform', header: 'Platform' },
  { key: 'from', header: 'From' },
  { key: 'message', header: 'Message' },
  { key: 'date', header: 'Date' },
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
    case 'unread': return 'red';
    case 'read': return 'gray';
    case 'replied': return 'green';
    default: return 'gray';
  }
};

export default function InboxPage() {
  const { t } = useTranslation();
  const [platformFilter, setPlatformFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(messages[0]);
  const [replyText, setReplyText] = useState('');

  const filteredMessages = messages.filter((m) => {
    const matchPlatform = platformFilter === 'all' || m.platform.toLowerCase() === platformFilter;
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchPlatform && matchStatus;
  });

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <h1 style={{ marginBottom: '0.5rem' }}>{t('Unified Inbox')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Manage all your social messages and comments in one place.')}
        </p>
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
          id="status-filter"
          labelText={t('Status')}
          value={statusFilter}
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatusFilter(e.target.value)}
        >
          <SelectItem value="all" text={t('All Status')} />
          <SelectItem value="unread" text={t('Unread')} />
          <SelectItem value="read" text={t('Read')} />
          <SelectItem value="replied" text={t('Replied')} />
        </Select>
      </Column>

      {/* Messages Table */}
      <Column lg={10} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <DataTable rows={filteredMessages} headers={headers}>
          {({
            rows,
            headers,
            getTableProps,
            getHeaderProps,
            getRowProps,
            getToolbarProps,
            onInputChange,
          }: any) => (
            <TableContainer title={t('Messages')}>
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={onInputChange} placeholder={t('Search messages...')} />
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
                    const original = filteredMessages.find((m) => m.id === row.id);
                    return (
                      <TableRow
                        key={row.id}
                        {...getRowProps({ row })}
                        onClick={() => original && setSelectedMessage(original)}
                        style={{ cursor: 'pointer' }}
                      >
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
                            ) : cell.info.header === 'message' ? (
                              <span style={{ maxWidth: '250px', display: 'inline-block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {cell.value}
                              </span>
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

      {/* Message Detail */}
      <Column lg={6} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <Tile style={{ height: '100%' }}>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Email size={20} />
              <h4>{t('Message Detail')}</h4>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Tag type={platformTagColor(selectedMessage.platform) as any} size="sm">
                {selectedMessage.platform}
              </Tag>
              <Tag type={statusTagColor(selectedMessage.status) as any} size="sm">
                {selectedMessage.status}
              </Tag>
            </div>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{selectedMessage.from}</p>
            <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '1rem' }}>
              {selectedMessage.date}
            </p>
            <p style={{ lineHeight: 1.6, marginBottom: '1.5rem' }}>{selectedMessage.message}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
            <TextInput
              id="reply-input"
              labelText={t('Reply')}
              placeholder={t('Type your reply...')}
              value={replyText}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setReplyText(e.target.value)}
              style={{ flex: 1 }}
            />
            <Button renderIcon={Send} size="md" hasIconOnly iconDescription={t('Send reply')} />
          </div>
        </Tile>
      </Column>
    </Grid>
  );
}
