'use client';

import { useState } from 'react';
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
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  Button,
} from '@carbon/react';
import { Purchase, Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const campaigns = [
  { id: '1', name: 'Summer Collection Launch', platform: 'Instagram', budget: '$2,400', spend: '$1,890', impressions: '245K', clicks: '6.8K', ctr: '2.78%', cpc: '$0.28', status: 'active' },
  { id: '2', name: 'Brand Awareness Q1', platform: 'LinkedIn', budget: '$1,800', spend: '$1,200', impressions: '180K', clicks: '4.2K', ctr: '2.33%', cpc: '$0.29', status: 'active' },
  { id: '3', name: 'Product Retargeting', platform: 'Meta', budget: '$1,500', spend: '$1,500', impressions: '320K', clicks: '12.1K', ctr: '3.78%', cpc: '$0.12', status: 'completed' },
  { id: '4', name: 'Webinar Promotion', platform: 'LinkedIn', budget: '$800', spend: '$450', impressions: '56K', clicks: '1.8K', ctr: '3.21%', cpc: '$0.25', status: 'active' },
  { id: '5', name: 'App Install Campaign', platform: 'TikTok', budget: '$2,000', spend: '$1,100', impressions: '410K', clicks: '9.2K', ctr: '2.24%', cpc: '$0.12', status: 'active' },
  { id: '6', name: 'Holiday Sale', platform: 'Meta', budget: '$3,000', spend: '$3,000', impressions: '520K', clicks: '18.4K', ctr: '3.54%', cpc: '$0.16', status: 'completed' },
];

const platformColors: Record<string, 'purple' | 'blue' | 'red' | 'cyan'> = {
  Instagram: 'purple',
  LinkedIn: 'blue',
  Meta: 'cyan',
  TikTok: 'red',
};

const headers = [
  { key: 'name', header: 'Campaign' },
  { key: 'platform', header: 'Platform' },
  { key: 'budget', header: 'Budget' },
  { key: 'spend', header: 'Spend' },
  { key: 'impressions', header: 'Impressions' },
  { key: 'clicks', header: 'Clicks' },
  { key: 'ctr', header: 'CTR' },
  { key: 'cpc', header: 'CPC' },
  { key: 'status', header: 'Status' },
];

export default function AdsPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');

  const filtered = campaigns.filter(c => !search || c.name.toLowerCase().includes(search.toLowerCase()));
  const rows = filtered.map(c => ({ ...c }));

  const totalSpend = 8140;
  const avgCtr = 2.81;
  const avgCpc = 0.45;
  const roas = 4.1;

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Purchase size={20} />
          <h1 style={{ margin: 0 }}>Ad Manager</h1>
        </div>
        <p>Manage paid advertising campaigns across platforms</p>
      </div>

      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Total Ad Spend</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>${totalSpend.toLocaleString()}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Avg CTR</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>{avgCtr}%</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Avg CPC</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>${avgCpc}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>ROAS</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>{roas}x</p>
          </Tile>
        </Column>
      </Grid>

      <Tile style={{ padding: 0 }}>
        <DataTable rows={rows} headers={headers}>
          {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
            <>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch onChange={(e: any) => setSearch(e.target?.value || '')} />
                  <Button renderIcon={Add} size="sm">Create Campaign</Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {headers.map((h) => <TableHeader {...getHeaderProps({ header: h })} key={h.key}>{h.header}</TableHeader>)}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => {
                    const c = filtered.find(x => x.id === row.id)!;
                    return (
                      <TableRow {...getRowProps({ row })} key={row.id}>
                        <TableCell><strong>{c.name}</strong></TableCell>
                        <TableCell><Tag type={platformColors[c.platform] || 'gray'} size="sm">{c.platform}</Tag></TableCell>
                        <TableCell>{c.budget}</TableCell>
                        <TableCell>{c.spend}</TableCell>
                        <TableCell>{c.impressions}</TableCell>
                        <TableCell>{c.clicks}</TableCell>
                        <TableCell><strong>{c.ctr}</strong></TableCell>
                        <TableCell>{c.cpc}</TableCell>
                        <TableCell><Tag type={c.status === 'active' ? 'green' : 'gray'} size="sm">{c.status}</Tag></TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </>
          )}
        </DataTable>
      </Tile>
    </div>
  );
}
