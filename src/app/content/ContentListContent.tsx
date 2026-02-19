'use client';

import { useState } from 'react';
import {
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
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  Breadcrumb,
  BreadcrumbItem,
} from '@carbon/react';
import { Add, Edit, TrashCan, View } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import Link from 'next/link';

type ContentType = 'post' | 'page' | 'story' | 'reel';
type ContentStatus = 'draft' | 'review' | 'approved' | 'published';

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  platform: string[];
  status: ContentStatus;
  updatedAt: string;
}

const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: 'Summer Campaign - Instagram Post',
    type: 'post',
    platform: ['Instagram', 'Facebook'],
    status: 'published',
    updatedAt: '2026-02-18',
  },
  {
    id: '2',
    title: 'Brand Story - Q1 2026',
    type: 'story',
    platform: ['Instagram'],
    status: 'approved',
    updatedAt: '2026-02-17',
  },
  {
    id: '3',
    title: 'Product Launch Reel',
    type: 'reel',
    platform: ['Instagram', 'TikTok'],
    status: 'review',
    updatedAt: '2026-02-16',
  },
  {
    id: '4',
    title: 'About Us - Website Page',
    type: 'page',
    platform: ['Website'],
    status: 'draft',
    updatedAt: '2026-02-15',
  },
  {
    id: '5',
    title: 'Valentine\'s Day Campaign Post',
    type: 'post',
    platform: ['Instagram', 'LinkedIn'],
    status: 'published',
    updatedAt: '2026-02-14',
  },
  {
    id: '6',
    title: 'Behind the Scenes Story',
    type: 'story',
    platform: ['Instagram'],
    status: 'draft',
    updatedAt: '2026-02-13',
  },
  {
    id: '7',
    title: 'CEO Interview Reel',
    type: 'reel',
    platform: ['LinkedIn', 'YouTube'],
    status: 'review',
    updatedAt: '2026-02-12',
  },
  {
    id: '8',
    title: 'Services Landing Page',
    type: 'page',
    platform: ['Website'],
    status: 'approved',
    updatedAt: '2026-02-11',
  },
];

const statusTagColors: Record<ContentStatus, 'gray' | 'blue' | 'green' | 'purple'> = {
  draft: 'gray',
  review: 'blue',
  approved: 'green',
  published: 'purple',
};

function ContentTable({ items }: { items: ContentItem[] }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const headers = [
    { key: 'title', header: t('content.colTitle') },
    { key: 'type', header: t('content.colType') },
    { key: 'platform', header: t('content.colPlatform') },
    { key: 'status', header: t('content.colStatus') },
    { key: 'updatedAt', header: t('content.colUpdatedAt') },
    { key: 'actions', header: t('content.colActions') },
  ];

  const filtered = items.filter((item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filtered.map((item) => ({
    id: item.id,
    title: item.title,
    type: item.type,
    platform: item.platform.join(', '),
    status: (
      <Tag type={statusTagColors[item.status]} size="sm">
        {t(`content.status.${item.status}`)}
      </Tag>
    ),
    updatedAt: item.updatedAt,
    actions: (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Link href={`/content/${item.id}/edit`}>
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            iconDescription={t('common.edit')}
            renderIcon={Edit}
          />
        </Link>
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription={t('common.view')}
          renderIcon={View}
        />
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription={t('common.delete')}
          renderIcon={TrashCan}
        />
      </div>
    ),
  }));

  return (
    <DataTable rows={rows} headers={headers}>
      {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
        <>
          <TableToolbar>
            <TableToolbarContent>
              <TableToolbarSearch
                placeholder={t('content.searchPlaceholder')}
                onChange={(e) => {
                  const val = typeof e === 'string' ? e : e.target?.value || '';
                  setSearchTerm(val);
                }}
              />
              <Link href="/content/new/edit">
                <Button renderIcon={Add}>{t('content.newContent')}</Button>
              </Link>
            </TableToolbarContent>
          </TableToolbar>
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
        </>
      )}
    </DataTable>
  );
}

export default function ContentListContent() {
  const { t } = useTranslation();

  const draftItems = mockContentItems.filter((i) => i.status === 'draft');
  const reviewItems = mockContentItems.filter((i) => i.status === 'review');
  const approvedItems = mockContentItems.filter((i) => i.status === 'approved');
  const publishedItems = mockContentItems.filter((i) => i.status === 'published');

  return (
    <div>
      <Breadcrumb style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbItem>
        <BreadcrumbItem href="/content" isCurrentPage>
          {t('content.title')}
        </BreadcrumbItem>
      </Breadcrumb>

      <div className="page-header" style={{ marginBottom: '1.5rem' }}>
        <h1>{t('content.title')}</h1>
        <p>{t('content.subtitle')}</p>
      </div>

      <Tabs>
        <TabList aria-label={t('content.title')}>
          <Tab>{t('content.tabAll')}</Tab>
          <Tab>{t('content.tabDrafts')}</Tab>
          <Tab>{t('content.tabReview')}</Tab>
          <Tab>{t('content.tabApproved')}</Tab>
          <Tab>{t('content.tabPublished')}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <ContentTable items={mockContentItems} />
          </TabPanel>
          <TabPanel>
            <ContentTable items={draftItems} />
          </TabPanel>
          <TabPanel>
            <ContentTable items={reviewItems} />
          </TabPanel>
          <TabPanel>
            <ContentTable items={approvedItems} />
          </TabPanel>
          <TabPanel>
            <ContentTable items={publishedItems} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
