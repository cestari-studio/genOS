'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Button,
  Section,
  Heading,
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
  Select,
  SelectItem,
} from '@carbon/react';
import { Upload } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Document {
  id: string;
  name: string;
  type: string;
  uploadedBy: string;
  date: string;
  size: string;
}

const initialDocuments: Document[] = [
  {
    id: '1',
    name: 'Q1-2026-Campaign-Brief.pdf',
    type: 'brief',
    uploadedBy: 'Olivia Martins',
    date: '2026-02-15',
    size: '2.4 MB',
  },
  {
    id: '2',
    name: 'Master-Services-Agreement.pdf',
    type: 'contract',
    uploadedBy: 'Carlos Rivera',
    date: '2026-01-20',
    size: '1.8 MB',
  },
  {
    id: '3',
    name: 'Invoice-2026-01.pdf',
    type: 'invoice',
    uploadedBy: 'System',
    date: '2026-01-01',
    size: '245 KB',
  },
  {
    id: '4',
    name: 'Brand-Audit-Report-2025.pdf',
    type: 'report',
    uploadedBy: 'Amara Singh',
    date: '2025-12-18',
    size: '5.1 MB',
  },
  {
    id: '5',
    name: 'Social-Media-Content-Brief.docx',
    type: 'brief',
    uploadedBy: 'Mei Chen',
    date: '2026-02-10',
    size: '890 KB',
  },
  {
    id: '6',
    name: 'NDA-Acme-Corp.pdf',
    type: 'contract',
    uploadedBy: 'Carlos Rivera',
    date: '2025-11-05',
    size: '340 KB',
  },
  {
    id: '7',
    name: 'Invoice-2026-02.pdf',
    type: 'invoice',
    uploadedBy: 'System',
    date: '2026-02-01',
    size: '252 KB',
  },
  {
    id: '8',
    name: 'Performance-Report-Jan-2026.xlsx',
    type: 'report',
    uploadedBy: 'Olivia Martins',
    date: '2026-02-05',
    size: '1.2 MB',
  },
];

const headers = [
  { key: 'name', header: 'Name' },
  { key: 'type', header: 'Type' },
  { key: 'uploadedBy', header: 'Uploaded By' },
  { key: 'date', header: 'Date' },
  { key: 'size', header: 'Size' },
  { key: 'actions', header: '' },
];

const typeTagColors: Record<string, 'blue' | 'green' | 'purple' | 'teal'> = {
  contract: 'blue',
  invoice: 'green',
  brief: 'purple',
  report: 'teal',
};

export default function DocumentVaultPage() {
  const { t } = useTranslation();
  const [documents] = useState<Document[]>(initialDocuments);
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredDocs = documents.filter((doc) => {
    const matchesType = filterType === 'all' || doc.type === filterType;
    const matchesSearch =
      !searchTerm ||
      doc.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const rows = filteredDocs.map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    uploadedBy: doc.uploadedBy,
    date: doc.date,
    size: doc.size,
    actions: '',
  }));

  return (
    <Grid fullWidth style={{ padding: '2rem 0' }}>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Document Vault')}
          </Heading>
        </Section>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <DataTable rows={rows} headers={headers}>
          {({
            rows: tableRows,
            headers: tableHeaders,
            getTableProps,
            getHeaderProps,
            getRowProps,
          }: {
            rows: any[];
            headers: any[];
            getTableProps: () => any;
            getHeaderProps: (args: { header: any }) => any;
            getRowProps: (args: { row: any }) => any;
          }) => (
            <TableContainer title={t('Documents')}>
              <TableToolbar>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={(e: any) => setSearchTerm(e.target?.value || '')}
                    placeholder={t('Search documents...')}
                    persistent
                  />
                  <div style={{ marginRight: '1rem', minWidth: '160px' }}>
                    <Select
                      id="filter-type"
                      labelText=""
                      hideLabel
                      size="sm"
                      value={filterType}
                      onChange={(e) => setFilterType(e.target.value)}
                    >
                      <SelectItem value="all" text={t('All Types')} />
                      <SelectItem value="contract" text={t('Contract')} />
                      <SelectItem value="invoice" text={t('Invoice')} />
                      <SelectItem value="brief" text={t('Brief')} />
                      <SelectItem value="report" text={t('Report')} />
                    </Select>
                  </div>
                  <Button renderIcon={Upload} size="sm">
                    {t('Upload Document')}
                  </Button>
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()}>
                <TableHead>
                  <TableRow>
                    {tableHeaders.map((header: any) => {
                      const headerProps = getHeaderProps({ header });
                      return (
                        <TableHeader key={header.key} {...headerProps}>
                          {header.header}
                        </TableHeader>
                      );
                    })}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tableRows.map((row: any) => {
                    const rowProps = getRowProps({ row });
                    return (
                      <TableRow key={row.id} {...rowProps}>
                        {row.cells.map((cell: any) => {
                          if (cell.info.header === 'type') {
                            return (
                              <TableCell key={cell.id}>
                                <Tag
                                  type={typeTagColors[cell.value] || 'gray'}
                                  size="sm"
                                >
                                  {cell.value.charAt(0).toUpperCase() +
                                    cell.value.slice(1)}
                                </Tag>
                              </TableCell>
                            );
                          }
                          if (cell.info.header === 'actions') {
                            return (
                              <TableCell key={cell.id}>
                                <OverflowMenu
                                  flipped
                                  size="sm"
                                  aria-label={t('Actions')}
                                >
                                  <OverflowMenuItem
                                    itemText={t('Download')}
                                  />
                                  <OverflowMenuItem
                                    itemText={t('Delete')}
                                    hasDivider
                                    isDelete
                                  />
                                </OverflowMenu>
                              </TableCell>
                            );
                          }
                          return (
                            <TableCell key={cell.id}>{cell.value}</TableCell>
                          );
                        })}
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
