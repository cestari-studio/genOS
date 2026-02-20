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
  AspectRatio,
} from '@carbon/react';
import { Download, Image, Video, Document, Template } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

type AssetType = 'image' | 'video' | 'document' | 'template';

interface Asset {
  id: string;
  name: string;
  type: AssetType;
  format: string;
  size: string;
  date: string;
  thumbnail?: string;
}

const mockAssets: Asset[] = [
  { id: '1', name: 'Brand Logo Primary', type: 'image', format: 'SVG', size: '24 KB', date: '2026-02-18', thumbnail: '/assets/logo-primary.svg' },
  { id: '2', name: 'Product Launch Video', type: 'video', format: 'MP4', size: '128 MB', date: '2026-02-17', thumbnail: '/assets/product-launch.jpg' },
  { id: '3', name: 'Brand Guidelines 2026', type: 'document', format: 'PDF', size: '4.2 MB', date: '2026-02-16' },
  { id: '4', name: 'Social Media Template Pack', type: 'template', format: 'PSD', size: '56 MB', date: '2026-02-15', thumbnail: '/assets/social-templates.jpg' },
  { id: '5', name: 'Hero Banner Desktop', type: 'image', format: 'PNG', size: '1.8 MB', date: '2026-02-14', thumbnail: '/assets/hero-banner.jpg' },
  { id: '6', name: 'Onboarding Walkthrough', type: 'video', format: 'MOV', size: '340 MB', date: '2026-02-13' },
  { id: '7', name: 'Press Kit', type: 'document', format: 'ZIP', size: '18 MB', date: '2026-02-12' },
  { id: '8', name: 'Email Newsletter Template', type: 'template', format: 'HTML', size: '85 KB', date: '2026-02-11' },
  { id: '9', name: 'Team Photo Group Shot', type: 'image', format: 'JPEG', size: '3.4 MB', date: '2026-02-10', thumbnail: '/assets/team-photo.jpg' },
  { id: '10', name: 'Quarterly Report Template', type: 'template', format: 'DOCX', size: '220 KB', date: '2026-02-09' },
];

const typeTagColor: Record<AssetType, string> = {
  image: 'blue',
  video: 'purple',
  document: 'teal',
  template: 'magenta',
};

const typeIcon: Record<AssetType, React.ComponentType<any>> = {
  image: Image,
  video: Video,
  document: Document,
  template: Template,
};

const typeFilterItems = [
  { id: 'all', text: 'All Types' },
  { id: 'image', text: 'Image' },
  { id: 'video', text: 'Video' },
  { id: 'document', text: 'Document' },
  { id: 'template', text: 'Template' },
];

export default function AssetDownloadCenterPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filtered = mockAssets.filter((asset) => {
    const matchesSearch = asset.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || asset.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const recentAssets = mockAssets
    .filter((a) => a.thumbnail)
    .slice(0, 4);

  const headers = [
    { key: 'name', header: t('Name') },
    { key: 'type', header: t('Type') },
    { key: 'format', header: t('Format') },
    { key: 'size', header: t('Size') },
    { key: 'date', header: t('Date') },
    { key: 'actions', header: t('Actions') },
  ];

  const rows = filtered.map((asset) => ({
    id: asset.id,
    name: asset.name,
    type: (
      <Tag type={typeTagColor[asset.type] as any} size="sm">
        {asset.type}
      </Tag>
    ),
    format: asset.format,
    size: asset.size,
    date: asset.date,
    actions: (
      <Button
        kind="ghost"
        size="sm"
        hasIconOnly
        iconDescription={t('Download')}
        renderIcon={Download}
      />
    ),
  }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Breadcrumb style={{ marginBottom: '1rem' }}>
          <BreadcrumbItem href="/dashboard">{t('Dashboard')}</BreadcrumbItem>
          <BreadcrumbItem href="/content">{t('Content')}</BreadcrumbItem>
          <BreadcrumbItem href="/content/assets" isCurrentPage>
            {t('Assets')}
          </BreadcrumbItem>
        </Breadcrumb>

        <h1 style={{ marginBottom: '0.5rem' }}>{t('Asset Download Center')}</h1>
        <p style={{ marginBottom: '2rem', color: '#525252' }}>
          {t('Browse, search, and download brand assets, templates, and media files.')}
        </p>
      </Column>

      {/* Recent Asset Thumbnails */}
      <Column lg={16} md={8} sm={4} style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>{t('Recent Assets')}</h3>
      </Column>

      {recentAssets.map((asset) => {
        const IconComponent = typeIcon[asset.type];
        return (
          <Column key={asset.id} lg={4} md={2} sm={4} style={{ marginBottom: '1rem' }}>
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
                  }}
                >
                  <IconComponent size={48} style={{ color: '#8d8d8d' }} />
                </div>
              </AspectRatio>
              <div style={{ marginTop: '0.75rem' }}>
                <p style={{ fontWeight: 600, fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                  {asset.name}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Tag type={typeTagColor[asset.type] as any} size="sm">
                    {asset.type}
                  </Tag>
                  <span style={{ fontSize: '0.75rem', color: '#525252' }}>{asset.format} &middot; {asset.size}</span>
                </div>
              </div>
            </Tile>
          </Column>
        );
      })}

      {/* Filter and DataTable */}
      <Column lg={16} md={8} sm={4} style={{ marginTop: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', alignItems: 'flex-end' }}>
          <div style={{ width: '200px' }}>
            <Dropdown
              id="type-filter"
              titleText={t('Filter by Type')}
              label={t('All Types')}
              items={typeFilterItems}
              itemToString={(item: any) => item?.text || ''}
              onChange={({ selectedItem }: any) => setTypeFilter(selectedItem?.id || 'all')}
            />
          </div>
        </div>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers}>
          {({ rows: tableRows, headers: tableHeaders, getTableProps, getHeaderProps, getRowProps }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    placeholder={t('Search assets...')}
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
    </Grid>
  );
}
