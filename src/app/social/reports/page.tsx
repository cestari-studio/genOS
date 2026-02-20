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
  Button,
  Select,
  SelectItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import { Report, Download } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const metrics = [
  { id: '1', metric: 'Total Followers', current: '245,320', previous: '232,100', change: '+5.7%' },
  { id: '2', metric: 'Engagement Rate', current: '4.21%', previous: '3.85%', change: '+9.4%' },
  { id: '3', metric: 'Post Impressions', current: '1,234,500', previous: '1,102,000', change: '+12.0%' },
  { id: '4', metric: 'Link Clicks', current: '45,230', previous: '38,900', change: '+16.3%' },
  { id: '5', metric: 'Shares', current: '8,920', previous: '7,450', change: '+19.7%' },
  { id: '6', metric: 'Comments', current: '12,340', previous: '11,200', change: '+10.2%' },
  { id: '7', metric: 'Story Views', current: '89,400', previous: '72,300', change: '+23.7%' },
  { id: '8', metric: 'Profile Visits', current: '34,500', previous: '31,200', change: '+10.6%' },
];

const headers = [
  { key: 'metric', header: 'Metric' },
  { key: 'current', header: 'Current Period' },
  { key: 'previous', header: 'Previous Period' },
  { key: 'change', header: 'Change' },
];

export default function SocialReportsPage() {
  const { t } = useTranslation();
  const [client, setClient] = useState('all');

  const rows = metrics.map(m => ({ ...m }));

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Report size={20} />
          <h1 style={{ margin: 0 }}>Social Reports</h1>
        </div>
        <p>Generate and review social media performance reports</p>
      </div>

      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Reports Generated</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>34</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Clients Covered</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>12</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Avg Growth</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>+13.5%</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Top Platform</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>Instagram</p>
          </Tile>
        </Column>
      </Grid>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', marginBottom: '1rem' }}>
        <Select id="client-select" labelText="Client" value={client} onChange={(e) => setClient(e.target.value)} size="sm" style={{ maxWidth: '200px' }}>
          <SelectItem value="all" text="All Clients" />
          <SelectItem value="acme" text="Acme Corp" />
          <SelectItem value="beta" text="Beta Inc" />
          <SelectItem value="gamma" text="Gamma LLC" />
        </Select>
        <Button renderIcon={Download} size="sm" kind="tertiary">Export Report</Button>
      </div>

      <Tabs>
        <TabList aria-label="Report periods">
          <Tab>Weekly</Tab>
          <Tab>Monthly</Tab>
          <Tab>Custom</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Tile style={{ padding: 0, marginTop: '1rem' }}>
              <DataTable rows={rows} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((h) => <TableHeader {...getHeaderProps({ header: h })} key={h.key}>{h.header}</TableHeader>)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        const m = metrics.find(x => x.id === row.id)!;
                        const isPositive = m.change.startsWith('+');
                        return (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            <TableCell><strong>{m.metric}</strong></TableCell>
                            <TableCell style={{ fontFamily: 'monospace' }}>{m.current}</TableCell>
                            <TableCell style={{ fontFamily: 'monospace', color: 'var(--cds-text-secondary)' }}>{m.previous}</TableCell>
                            <TableCell>
                              <Tag type={isPositive ? 'green' : 'red'} size="sm">{m.change}</Tag>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            </Tile>
          </TabPanel>
          <TabPanel>
            <Tile style={{ marginTop: '1rem', padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--cds-text-secondary)' }}>Monthly report data — same structure as weekly with aggregated metrics.</p>
            </Tile>
          </TabPanel>
          <TabPanel>
            <Tile style={{ marginTop: '1rem', padding: '2rem', textAlign: 'center' }}>
              <p style={{ color: 'var(--cds-text-secondary)' }}>Select a custom date range to generate a report.</p>
            </Tile>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
