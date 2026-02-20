'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Button,
  OverflowMenu,
  OverflowMenuItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
} from '@carbon/react';
import { Compare, DocumentView } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface VersionRow {
  id: string;
  version: string;
  author: string;
  date: string;
  changes: string;
  status: string;
}

const versionData: VersionRow[] = [
  {
    id: 'v6',
    version: 'v6 (Current)',
    author: 'Maria Chen',
    date: '2026-02-19 09:15',
    changes: 'Updated CTA copy and final proofread',
    status: 'published',
  },
  {
    id: 'v5',
    version: 'v5',
    author: 'David Kim',
    date: '2026-02-18 16:42',
    changes: 'Revised hero image and adjusted color palette',
    status: 'approved',
  },
  {
    id: 'v4',
    version: 'v4',
    author: 'Maria Chen',
    date: '2026-02-17 11:30',
    changes: 'Incorporated legal review feedback on disclaimers',
    status: 'approved',
  },
  {
    id: 'v3',
    version: 'v3',
    author: 'Sarah Johnson',
    date: '2026-02-16 14:05',
    changes: 'Rewrote introduction paragraph for brand voice alignment',
    status: 'review',
  },
  {
    id: 'v2',
    version: 'v2',
    author: 'David Kim',
    date: '2026-02-15 10:22',
    changes: 'Added product specifications and pricing section',
    status: 'review',
  },
  {
    id: 'v1',
    version: 'v1',
    author: 'Sarah Johnson',
    date: '2026-02-14 08:00',
    changes: 'Initial draft created from brief',
    status: 'draft',
  },
];

const headers = [
  { key: 'version', header: 'Version' },
  { key: 'author', header: 'Author' },
  { key: 'date', header: 'Date' },
  { key: 'changes', header: 'Changes Summary' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: '' },
];

const statusTagType: Record<string, 'gray' | 'blue' | 'green' | 'cyan'> = {
  draft: 'gray',
  review: 'blue',
  approved: 'green',
  published: 'cyan',
};

export default function VersionHistoryPage() {
  const { t } = useTranslation();

  const currentVersion = versionData[0];

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ marginBottom: '0.25rem' }}>{t('Version History')}</h1>
          <p style={{ color: '#525252' }}>
            {t('Track changes and manage content versions.')}
          </p>
        </div>
        <Button kind="tertiary" renderIcon={Compare} size="md">
          {t('Compare Versions')}
        </Button>
      </div>

      <Grid narrow>
        <Column sm={4} md={8} lg={5}>
          <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <DocumentView size={20} />
              <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {t('Current Version')}
              </h3>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
                {t('Version')}
              </p>
              <p style={{ fontWeight: 600 }}>{currentVersion.version}</p>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
                {t('Author')}
              </p>
              <p>{currentVersion.author}</p>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
                {t('Date')}
              </p>
              <p>{currentVersion.date}</p>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
                {t('Changes')}
              </p>
              <p>{currentVersion.changes}</p>
            </div>
            <div>
              <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.25rem' }}>
                {t('Status')}
              </p>
              <Tag type={statusTagType[currentVersion.status]} size="sm">
                {currentVersion.status}
              </Tag>
            </div>
          </Tile>
        </Column>

        <Column sm={4} md={8} lg={11}>
          <DataTable rows={versionData} headers={headers} isSortable>
            {({
              rows,
              headers: tableHeaders,
              getTableProps,
              getHeaderProps,
              getRowProps,
            }: any) => (
              <TableContainer title={t('All Versions')}>
                <Table {...getTableProps()}>
                  <TableHead>
                    <TableRow>
                      {tableHeaders.map((header: any) => (
                        <TableHeader
                          key={header.key}
                          {...getHeaderProps({ header })}
                        >
                          {header.header}
                        </TableHeader>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {rows.map((row: any) => (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        {row.cells.map((cell: any) => {
                          if (cell.info.header === 'status') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag type={statusTagType[cell.value]} size="sm">
                                  {cell.value}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <OverflowMenu size="sm" flipped ariaLabel={t('Actions')}>
                                  <OverflowMenuItem itemText={t('View this version')} />
                                  <OverflowMenuItem itemText={t('Restore this version')} />
                                  <OverflowMenuItem itemText={t('Download')} />
                                </OverflowMenu>
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
        </Column>
      </Grid>
    </div>
  );
}
