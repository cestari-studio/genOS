'use client';

import React from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  Section,
  Heading,
  AILabel,
  AILabelContent,
} from '@carbon/react';
import { Upload, DocumentBlank, Folder, Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const documents = [
  { id: '1', name: 'Brand Guidelines v3.2', type: 'PDF', size: '4.2 MB', indexedDate: '2026-02-18', chunks: 142 },
  { id: '2', name: 'Q4 2025 Content Report', type: 'DOCX', size: '2.8 MB', indexedDate: '2026-02-17', chunks: 96 },
  { id: '3', name: 'Product Feature Matrix', type: 'XLSX', size: '1.1 MB', indexedDate: '2026-02-16', chunks: 54 },
  { id: '4', name: 'Competitor Analysis Deck', type: 'PPTX', size: '12.4 MB', indexedDate: '2026-02-15', chunks: 218 },
  { id: '5', name: 'SEO Keyword Master List', type: 'CSV', size: '0.8 MB', indexedDate: '2026-02-14', chunks: 33 },
  { id: '6', name: 'Editorial Style Guide', type: 'PDF', size: '3.6 MB', indexedDate: '2026-02-13', chunks: 127 },
  { id: '7', name: 'Customer Persona Documents', type: 'PDF', size: '5.1 MB', indexedDate: '2026-02-12', chunks: 184 },
  { id: '8', name: 'API Documentation v2', type: 'MD', size: '0.9 MB', indexedDate: '2026-02-11', chunks: 72 },
  { id: '9', name: 'Social Media Playbook', type: 'PDF', size: '2.3 MB', indexedDate: '2026-02-10', chunks: 88 },
  { id: '10', name: 'Annual Marketing Plan 2026', type: 'DOCX', size: '6.7 MB', indexedDate: '2026-02-09', chunks: 231 },
];

const collections = [
  { id: 1, name: 'Brand Assets', documentCount: 14, totalChunks: 486, lastUpdated: '2026-02-18', description: 'Brand guidelines, logos, voice docs, and style references.' },
  { id: 2, name: 'Competitive Intelligence', documentCount: 8, totalChunks: 312, lastUpdated: '2026-02-17', description: 'Competitor profiles, market reports, and SWOT analyses.' },
  { id: 3, name: 'Content Library', documentCount: 42, totalChunks: 1580, lastUpdated: '2026-02-18', description: 'Published articles, blog posts, whitepapers, and case studies.' },
  { id: 4, name: 'Product Documentation', documentCount: 19, totalChunks: 724, lastUpdated: '2026-02-16', description: 'Technical docs, feature specs, and API references.' },
  { id: 5, name: 'Customer Research', documentCount: 11, totalChunks: 398, lastUpdated: '2026-02-14', description: 'Persona documents, survey results, and interview transcripts.' },
  { id: 6, name: 'SEO Resources', documentCount: 7, totalChunks: 203, lastUpdated: '2026-02-15', description: 'Keyword lists, ranking reports, and optimization guides.' },
];

const docHeaders = [
  { key: 'name', header: 'Document Name' },
  { key: 'type', header: 'Type' },
  { key: 'size', header: 'Size' },
  { key: 'indexedDate', header: 'Indexed Date' },
  { key: 'chunks', header: 'Chunks' },
];

const typeColors: Record<string, string> = {
  PDF: 'red',
  DOCX: 'blue',
  XLSX: 'green',
  PPTX: 'purple',
  CSV: 'teal',
  MD: 'cool-gray',
};

const supportedFormats = [
  { format: 'PDF', description: 'Documents, reports, whitepapers' },
  { format: 'DOCX', description: 'Word documents' },
  { format: 'XLSX / CSV', description: 'Spreadsheets and data files' },
  { format: 'PPTX', description: 'Presentations and slide decks' },
  { format: 'MD / TXT', description: 'Markdown and plain text' },
  { format: 'HTML', description: 'Web pages and saved articles' },
  { format: 'JSON', description: 'Structured data and API exports' },
];

export default function KnowledgePage() {
  const { t } = useTranslation();

  const docRows = documents.map((doc) => ({
    id: doc.id,
    name: doc.name,
    type: doc.type,
    size: doc.size,
    indexedDate: doc.indexedDate,
    chunks: doc.chunks,
  }));

  return (
    <div style={{ padding: '2rem' }}>
      <Section level={1}>
        <Heading style={{ marginBottom: '0.5rem' }}>
          {t('Knowledge Base')}
        </Heading>
        <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
          {t('Manage your AI knowledge base. Upload documents, organize collections, and monitor indexing.')}
        </p>
      </Section>

      <Tabs>
        <TabList aria-label="Knowledge base tabs">
          <Tab renderIcon={DocumentBlank}>{t('Documents')}</Tab>
          <Tab renderIcon={Folder}>{t('Collections')}</Tab>
          <Tab renderIcon={Upload}>{t('Upload')}</Tab>
        </TabList>

        <TabPanels>
          {/* Documents Tab */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              <DataTable rows={docRows} headers={docHeaders}>
                {({
                  rows: tableRows,
                  headers: tableHeaders,
                  getTableProps,
                  getHeaderProps,
                  getRowProps,
                }: any) => (
                  <TableContainer title={<span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>{t('Indexed Documents')} <AILabel size="mini"><AILabelContent><p style={{ fontSize: '0.75rem' }}>{t('Documents are automatically chunked and indexed by AI for semantic retrieval (RAG).')}</p></AILabelContent></AILabel></span>} description={t('10 of 101 documents shown')}>
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {tableHeaders.map((header: any) => (
                            <TableHeader {...getHeaderProps({ header })} key={header.key}>
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {tableRows.map((row: any) => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map((cell: any) => {
                              if (cell.info.header === 'type') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag type={typeColors[cell.value] as any} size="sm">
                                      {cell.value}
                                    </Tag>
                                  </TableCell>
                                );
                              }
                              if (cell.info.header === 'name') {
                                return (
                                  <TableCell key={cell.id}>
                                    <strong>{cell.value}</strong>
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
          </TabPanel>

          {/* Collections Tab */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              <Grid narrow>
                {collections.map((collection) => (
                  <Column key={collection.id} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
                    <Tile style={{ height: '100%' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                        <Folder size={20} />
                        <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>
                          {collection.name}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', marginBottom: '1rem', lineHeight: '1.4' }}>
                        {collection.description}
                      </p>
                      <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        <Tag type="blue" size="sm">
                          {collection.documentCount} {t('documents')}
                        </Tag>
                        <Tag type="cool-gray" size="sm">
                          {collection.totalChunks} {t('chunks')}
                        </Tag>
                      </div>
                      <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', marginTop: '0.75rem' }}>
                        {t('Last updated')}: {collection.lastUpdated}
                      </p>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </div>
          </TabPanel>

          {/* Upload Tab */}
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              <Grid>
                <Column lg={8} md={6} sm={4}>
                  <Tile>
                    <div
                      style={{
                        border: '2px dashed var(--cds-border-strong)',
                        borderRadius: '0.5rem',
                        padding: '3rem 2rem',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                      }}
                    >
                      <Upload size={48} style={{ marginBottom: '1rem', color: 'var(--cds-text-secondary)' }} />
                      <h4 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                        {t('Drag and drop files here')}
                      </h4>
                      <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '1.5rem' }}>
                        {t('or click the button below to browse your file system')}
                      </p>
                      <Button renderIcon={Add} kind="primary">
                        {t('Upload Files')}
                      </Button>
                    </div>

                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {t('Supported Formats')}
                    </h4>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                      {supportedFormats.map((fmt) => (
                        <li
                          key={fmt.format}
                          style={{
                            padding: '0.5rem 0',
                            borderBottom: '1px solid var(--cds-border-subtle)',
                            display: 'flex',
                            justifyContent: 'space-between',
                          }}
                        >
                          <strong style={{ fontSize: '0.875rem' }}>{fmt.format}</strong>
                          <span style={{ fontSize: '0.8125rem', color: 'var(--cds-text-secondary)' }}>
                            {fmt.description}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile>
                    <h4 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '0.75rem' }}>
                      {t('Upload Guidelines')}
                    </h4>
                    <ul style={{ paddingLeft: '1.25rem', fontSize: '0.8125rem', color: 'var(--cds-text-secondary)', lineHeight: '1.75' }}>
                      <li>{t('Max file size: 50 MB per file')}</li>
                      <li>{t('Batch upload: Up to 20 files at once')}</li>
                      <li>{t('Files are auto-indexed after upload')}</li>
                      <li>{t('Duplicate detection is enabled')}</li>
                      <li>{t('Sensitive data is encrypted at rest')}</li>
                    </ul>
                  </Tile>
                </Column>
              </Grid>
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
