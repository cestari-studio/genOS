'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
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
  Tag,
} from '@carbon/react';
import { Finance, Money, Calculator, ArrowUp } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';
import { SimpleBarChart } from '@carbon/charts-react';
import '@carbon/charts-react/styles.css';

const profitMarginChartData = [
  { group: 'Profit Margin %', value: 68.3, key: 'Delta Financial' },
  { group: 'Profit Margin %', value: 69.1, key: 'Gamma Health' },
  { group: 'Profit Margin %', value: 68.3, key: 'Acme Corp' },
  { group: 'Profit Margin %', value: 63.4, key: 'Eta Logistics' },
  { group: 'Profit Margin %', value: 61.8, key: 'Iota Foods' },
  { group: 'Profit Margin %', value: 55.8, key: 'Zeta Media' },
  { group: 'Profit Margin %', value: 55.6, key: 'Beta Industries' },
  { group: 'Profit Margin %', value: 44.8, key: 'Theta Education' },
  { group: 'Profit Margin %', value: 43.8, key: 'Epsilon Retail' },
  { group: 'Profit Margin %', value: 38.0, key: 'Kappa Energy' },
];
const profitMarginChartOptions = {
  title: 'Client Profit Margins',
  resizable: true,
  height: '400px',
  theme: 'g10' as const,
  axes: {
    bottom: { mapsTo: 'value', title: 'Margin %' },
    left: { mapsTo: 'key', scaleType: 'labels' as any },
  },
};

interface ClientRevenue {
  id: string;
  client: string;
  revenue: number;
  costs: number;
  profit: number;
  margin: number;
}

const clientRevenues: ClientRevenue[] = [
  { id: '1', client: 'Delta Financial', revenue: 12000, costs: 3800, profit: 8200, margin: 68.3 },
  { id: '2', client: 'Zeta Media', revenue: 9500, costs: 4200, profit: 5300, margin: 55.8 },
  { id: '3', client: 'Acme Corp', revenue: 8200, costs: 2600, profit: 5600, margin: 68.3 },
  { id: '4', client: 'Iota Foods', revenue: 7600, costs: 2900, profit: 4700, margin: 61.8 },
  { id: '5', client: 'Gamma Health', revenue: 6800, costs: 2100, profit: 4700, margin: 69.1 },
  { id: '6', client: 'Beta Industries', revenue: 5400, costs: 2400, profit: 3000, margin: 55.6 },
  { id: '7', client: 'Kappa Energy', revenue: 5000, costs: 3100, profit: 1900, margin: 38.0 },
  { id: '8', client: 'Eta Logistics', revenue: 4100, costs: 1500, profit: 2600, margin: 63.4 },
  { id: '9', client: 'Epsilon Retail', revenue: 3200, costs: 1800, profit: 1400, margin: 43.8 },
  { id: '10', client: 'Theta Education', revenue: 2900, costs: 1600, profit: 1300, margin: 44.8 },
];

const totalRevenue = clientRevenues.reduce((sum, c) => sum + c.revenue, 0);
const totalCosts = clientRevenues.reduce((sum, c) => sum + c.costs, 0);
const totalProfit = totalRevenue - totalCosts;
const profitMargin = ((totalProfit / totalRevenue) * 100).toFixed(1);

function getMarginTag(margin: number): { type: 'green' | 'blue' | 'red'; label: string } {
  if (margin >= 60) return { type: 'green', label: 'High' };
  if (margin >= 45) return { type: 'blue', label: 'Medium' };
  return { type: 'red', label: 'Low' };
}

function formatCurrency(n: number): string {
  return `$${n.toLocaleString()}`;
}

const headers = [
  { key: 'client', header: 'Client' },
  { key: 'revenue', header: 'Revenue' },
  { key: 'costs', header: 'Costs' },
  { key: 'profit', header: 'Profit' },
  { key: 'margin', header: 'Margin %' },
];

export default function ProfitPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredRevenues = clientRevenues.filter((cr) =>
    cr.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredRevenues.map((cr) => ({
    id: cr.id,
    client: cr.client,
    revenue: cr.revenue,
    costs: cr.costs,
    profit: cr.profit,
    margin: cr.margin,
  }));

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Finance size={24} />
          {t('Profit Analysis')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Financial performance and profitability breakdown')}
        </p>
      </div>

      {/* KPI Tiles */}
      <Grid style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Money size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Gross Revenue')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>$48K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Calculator size={20} style={{ color: 'var(--cds-support-error)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Operating Costs')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>$18K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <ArrowUp size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Net Profit')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>$30K</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Finance size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Profit Margin')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{profitMargin}%</p>
          </Tile>
        </Column>
      </Grid>

      {/* Profit Margin Chart */}
      <Grid style={{ marginBottom: '2rem' }}>
        <Column lg={16} md={8} sm={4}>
          <Tile>
            <SimpleBarChart data={profitMarginChartData} options={profitMarginChartOptions} />
          </Tile>
        </Column>
      </Grid>

      {/* Revenue By Client Table */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
        }: any) => (
          <TableContainer title={t('Revenue by Client')} description={`${filteredRevenues.length} clients`}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                  placeholder={t('Search clients...')}
                  persistent
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: (typeof headers)[number]) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(tableRows as unknown as { id: string; cells: { id: string; info: { header: string }; value: string | number }[] }[]).map((row) => {
                  const clientData = filteredRevenues.find((cr) => cr.id === row.id);
                  return (
                    <TableRow key={row.id} {...getRowProps({ row } as unknown as { row: (typeof rows)[number] })}>
                      {row.cells.map((cell) => {
                        if (cell.info.header === 'revenue' || cell.info.header === 'costs' || cell.info.header === 'profit') {
                          return (
                            <TableCell key={cell.id}>
                              <span style={{ fontWeight: cell.info.header === 'profit' ? 600 : 400 }}>
                                {formatCurrency(cell.value as number)}
                              </span>
                            </TableCell>
                          );
                        }
                        if (cell.info.header === 'margin') {
                          const tag = getMarginTag(cell.value as number);
                          return (
                            <TableCell key={cell.id}>
                              <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{cell.value}%</span>
                              <Tag type={tag.type} size="sm">{tag.label}</Tag>
                            </TableCell>
                          );
                        }
                        return <TableCell key={cell.id}>{cell.value}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
