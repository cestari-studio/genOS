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
  OverflowMenu,
  OverflowMenuItem,
  Dropdown,
} from '@carbon/react';
import { Partnership, Portfolio, ChartLineData } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Client {
  id: string;
  name: string;
  industry: string;
  contractStatus: string;
  monthlySpend: string;
  contentCount: number;
  geoScore: number;
}

const clients: Client[] = [
  { id: '1', name: 'Acme Corp', industry: 'Technology', contractStatus: 'Active', monthlySpend: '$8,200', contentCount: 42, geoScore: 87 },
  { id: '2', name: 'Beta Industries', industry: 'Manufacturing', contractStatus: 'Active', monthlySpend: '$5,400', contentCount: 28, geoScore: 72 },
  { id: '3', name: 'Gamma Health', industry: 'Healthcare', contractStatus: 'Expiring', monthlySpend: '$6,800', contentCount: 35, geoScore: 91 },
  { id: '4', name: 'Delta Financial', industry: 'Finance', contractStatus: 'Active', monthlySpend: '$12,000', contentCount: 56, geoScore: 94 },
  { id: '5', name: 'Epsilon Retail', industry: 'Retail', contractStatus: 'Paused', monthlySpend: '$3,200', contentCount: 14, geoScore: 63 },
  { id: '6', name: 'Zeta Media', industry: 'Media', contractStatus: 'Active', monthlySpend: '$9,500', contentCount: 67, geoScore: 88 },
  { id: '7', name: 'Eta Logistics', industry: 'Logistics', contractStatus: 'Active', monthlySpend: '$4,100', contentCount: 19, geoScore: 76 },
  { id: '8', name: 'Theta Education', industry: 'Education', contractStatus: 'Expiring', monthlySpend: '$2,900', contentCount: 22, geoScore: 69 },
  { id: '9', name: 'Iota Foods', industry: 'Food & Beverage', contractStatus: 'Active', monthlySpend: '$7,600', contentCount: 38, geoScore: 82 },
  { id: '10', name: 'Kappa Energy', industry: 'Energy', contractStatus: 'Paused', monthlySpend: '$5,000', contentCount: 11, geoScore: 58 },
];

const industries = ['All', 'Technology', 'Manufacturing', 'Healthcare', 'Finance', 'Retail', 'Media', 'Logistics', 'Education', 'Food & Beverage', 'Energy'];

const statusColor: Record<string, 'green' | 'blue' | 'red' | 'gray'> = {
  Active: 'green',
  Expiring: 'red',
  Paused: 'gray',
};

const industryColor: Record<string, 'blue' | 'cyan' | 'teal' | 'purple' | 'magenta' | 'warm-gray' | 'cool-gray' | 'high-contrast' | 'green' | 'red'> = {
  Technology: 'blue',
  Manufacturing: 'cyan',
  Healthcare: 'teal',
  Finance: 'purple',
  Retail: 'magenta',
  Media: 'warm-gray',
  Logistics: 'cool-gray',
  Education: 'high-contrast',
  'Food & Beverage': 'green',
  Energy: 'red',
};

const headers = [
  { key: 'name', header: 'Client Name' },
  { key: 'industry', header: 'Industry' },
  { key: 'contractStatus', header: 'Contract Status' },
  { key: 'monthlySpend', header: 'Monthly Spend' },
  { key: 'contentCount', header: 'Content Count' },
  { key: 'geoScore', header: 'GEO Score' },
  { key: 'actions', header: '' },
];

export default function PortfolioPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');

  const filteredClients = clients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesIndustry = selectedIndustry === 'All' || client.industry === selectedIndustry;
    return matchesSearch && matchesIndustry;
  });

  const rows = filteredClients.map((client) => ({
    id: client.id,
    name: client.name,
    industry: client.industry,
    contractStatus: client.contractStatus,
    monthlySpend: client.monthlySpend,
    contentCount: client.contentCount,
    geoScore: client.geoScore,
    actions: '',
  }));

  return (
    <div>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Portfolio size={24} />
          {t('Client Portfolio')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Manage and monitor your agency client roster')}
        </p>
      </div>

      {/* Summary Stats */}
      <Grid style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Partnership size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>Total Clients</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{clients.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>Active Contracts</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{clients.filter(c => c.contractStatus === 'Active').length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <ChartLineData size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>Avg GEO Score</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{Math.round(clients.reduce((sum, c) => sum + c.geoScore, 0) / clients.length)}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>Total Content</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{clients.reduce((sum, c) => sum + c.contentCount, 0)}</p>
          </Tile>
        </Column>
      </Grid>

      {/* Filter */}
      <Grid style={{ marginBottom: '1rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Dropdown
            id="industry-filter"
            titleText={t('Filter by Industry')}
            label={selectedIndustry}
            items={industries}
            selectedItem={selectedIndustry}
            onChange={({ selectedItem }: any) => setSelectedIndustry(selectedItem || 'All')}
          />
        </Column>
      </Grid>

      {/* DataTable */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
        }: any) => (
          <TableContainer title={t('Client Portfolio')} description={`${filteredClients.length} clients`}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => setSearchTerm(e?.target?.value ?? '')}
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
                {(tableRows as unknown as { id: string; cells: { id: string; info: { header: string }; value: string | number }[] }[]).map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row } as unknown as { row: (typeof rows)[number] })}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === 'industry') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={industryColor[cell.value as string] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'contractStatus') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={statusColor[cell.value as string] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'geoScore') {
                        return (
                          <TableCell key={cell.id}>
                            <span style={{ fontWeight: 600, color: (cell.value as number) >= 80 ? 'var(--cds-support-success)' : (cell.value as number) >= 65 ? 'var(--cds-support-warning)' : 'var(--cds-support-error)' }}>
                              {cell.value}
                            </span>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === '') {
                        return (
                          <TableCell key={cell.id}>
                            <OverflowMenu size="sm" flipped>
                              <OverflowMenuItem itemText={t('View Details')} />
                              <OverflowMenuItem itemText={t('Edit Client')} />
                              <OverflowMenuItem itemText={t('View Reports')} />
                              <OverflowMenuItem itemText={t('Send Message')} />
                              <OverflowMenuItem hasDivider isDelete itemText={t('Archive Client')} />
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
    </div>
  );
}
