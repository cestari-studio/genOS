'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/lib/i18n/context';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Search,
  Select,
  SelectItem,
  DataTable,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  OverflowMenu,
  OverflowMenuItem,
  Modal,
  TextInput,
  TextArea,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Pagination,
} from '@carbon/react';
import {
  Add,
  Document,
  Download,
  Send,
  View,
  Edit,
  Copy,
  TrashCan,
  Checkmark,
  Warning,
  Time,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase

interface Contract {
  id: string;
  title: string;
  type: 'contract' | 'proposal' | 'nda' | 'amendment';
  client: string;
  project: string;
  value: number;
  status: 'draft' | 'sent' | 'viewed' | 'signed' | 'expired';
  createdAt: string;
  expiresAt: string;
  signedAt?: string;
}

const contracts: Contract[] = [
  { id: '1', title: 'Contrato de Prestação de Serviços', type: 'contract', client: 'TechCorp Brasil', project: 'Website Institucional', value: 25000, status: 'signed', createdAt: '2024-01-15', expiresAt: '2024-02-15', signedAt: '2024-01-20' },
  { id: '2', title: 'Proposta Comercial - Social Media', type: 'proposal', client: 'TechCorp Brasil', project: 'Gestão Redes Sociais', value: 3500, status: 'sent', createdAt: '2024-02-10', expiresAt: '2024-02-25' },
  { id: '3', title: 'NDA - Projeto Confidencial', type: 'nda', client: 'Startup XYZ', project: 'App Mobile', value: 0, status: 'viewed', createdAt: '2024-02-12', expiresAt: '2024-02-27' },
  { id: '4', title: 'Aditivo Contratual #1', type: 'amendment', client: 'TechCorp Brasil', project: 'Website Institucional', value: 5000, status: 'draft', createdAt: '2024-02-18', expiresAt: '2024-03-05' },
  { id: '5', title: 'Proposta - Rebranding', type: 'proposal', client: 'Empresa ABC', project: 'Identidade Visual', value: 15000, status: 'expired', createdAt: '2024-01-05', expiresAt: '2024-01-20' },
];

const typeColors = {
  contract: 'blue',
  proposal: 'purple',
  nda: 'gray',
  amendment: 'teal',
} as const;

export default function ContractsPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const typeLabels = {
    contract: t('contracts.typeContract'),
    proposal: t('contracts.typeProposal'),
    nda: t('contracts.typeNda'),
    amendment: t('contracts.typeAmendment'),
  };

  const statusConfig = {
    draft: { label: t('contracts.statusDraft'), color: 'gray', icon: Document },
    sent: { label: t('contracts.statusSent'), color: 'blue', icon: Send },
    viewed: { label: t('contracts.statusViewed'), color: 'purple', icon: View },
    signed: { label: t('contracts.statusSigned'), color: 'green', icon: Checkmark },
    expired: { label: t('contracts.statusExpired'), color: 'red', icon: Warning },
  };

  const filteredContracts = contracts.filter(contract => {
    const matchesSearch = contract.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         contract.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || contract.type === filterType;
    const matchesStatus = filterStatus === 'all' || contract.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const headers = [
    { key: 'title', header: t('contracts.document') },
    { key: 'client', header: t('contracts.client') },
    { key: 'type', header: t('contracts.type') },
    { key: 'value', header: t('contracts.value') },
    { key: 'status', header: t('contracts.status') },
    { key: 'expiresAt', header: t('contracts.validity') },
    { key: 'actions', header: '' },
  ];

  const rows = filteredContracts.map(contract => ({
    id: contract.id,
    title: contract.title,
    client: contract.client,
    type: contract.type,
    value: contract.value,
    status: contract.status,
    expiresAt: contract.expiresAt,
  }));

  // Métricas
  const totalValue = contracts.filter(c => c.status === 'signed').reduce((acc, c) => acc + c.value, 0);
  const pendingValue = contracts.filter(c => c.status === 'sent' || c.status === 'viewed').reduce((acc, c) => acc + c.value, 0);
  const signedCount = contracts.filter(c => c.status === 'signed').length;
  const pendingCount = contracts.filter(c => c.status === 'sent' || c.status === 'viewed').length;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('contracts.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('contracts.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{t('contracts.subtitle')}</p>
        </div>
        <Button size="sm" renderIcon={Add} onClick={() => setIsNewModalOpen(true)}>
          {t('contracts.newDocument')}
        </Button>
      </div>

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('contracts.signedValue')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>
              R$ {totalValue.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('contracts.contracts', { count: signedCount })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('contracts.awaitingSignature')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-link-primary)' }}>
              R$ {pendingValue.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('contracts.documents', { count: pendingCount })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('contracts.conversionRate')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
              {contracts.length > 0 ? Math.round((signedCount / contracts.length) * 100) : 0}%
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('contracts.convertedProposals')}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('contracts.totalDocuments')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{contracts.length}</p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('contracts.inThisPeriod')}
            </p>
          </Tile>
        </Column>
      </Grid>

      {/* Filters */}
      <Tile style={{ marginBottom: '1rem', padding: '1rem' }}>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '200px' }}>
            <Search
              size="sm"
              placeholder={t('contracts.searchPlaceholder')}
              labelText={t('contracts.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-type" size="sm" value={filterType} onChange={(e) => setFilterType(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('common.allTypes')} />
            <SelectItem value="contract" text={t('contracts.typeContract')} />
            <SelectItem value="proposal" text={t('contracts.typeProposal')} />
            <SelectItem value="nda" text={t('contracts.typeNda')} />
            <SelectItem value="amendment" text={t('contracts.typeAmendment')} />
          </Select>
          <Select id="filter-status" size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('common.allStatus')} />
            <SelectItem value="draft" text={t('contracts.statusDraft')} />
            <SelectItem value="sent" text={t('contracts.statusSent')} />
            <SelectItem value="viewed" text={t('contracts.statusViewed')} />
            <SelectItem value="signed" text={t('contracts.statusSigned')} />
            <SelectItem value="expired" text={t('contracts.statusExpired')} />
          </Select>
        </div>
      </Tile>

      {/* Table */}
      <DataTable rows={rows} headers={headers}>
        {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
          <TableContainer>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const contract = contracts.find(c => c.id === row.id)!;
                  const StatusIcon = statusConfig[contract.status].icon;

                  return (
                    <TableRow {...getRowProps({ row })} key={row.id}>
                      <TableCell>
                        <div>
                          <strong>{contract.title}</strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>{contract.project}</div>
                        </div>
                      </TableCell>
                      <TableCell>{contract.client}</TableCell>
                      <TableCell>
                        <Tag type={typeColors[contract.type]} size="sm">{typeLabels[contract.type]}</Tag>
                      </TableCell>
                      <TableCell>
                        {contract.value > 0 ? `R$ ${contract.value.toLocaleString('pt-BR')}` : '-'}
                      </TableCell>
                      <TableCell>
                        <Tag type={statusConfig[contract.status].color as any} size="sm">
                          <StatusIcon size={12} style={{ marginRight: '0.25rem' }} />
                          {statusConfig[contract.status].label}
                        </Tag>
                      </TableCell>
                      <TableCell>
                        {contract.signedAt ? (
                          <span style={{ color: 'var(--cds-support-success)' }}>
                            {t('contracts.signedOn', { date: new Date(contract.signedAt).toLocaleDateString('pt-BR') })}
                          </span>
                        ) : (
                          <span style={{ color: new Date(contract.expiresAt) < new Date() ? 'var(--cds-support-error)' : 'var(--cds-text-secondary)' }}>
                            {new Date(contract.expiresAt).toLocaleDateString('pt-BR')}
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <OverflowMenu size="sm" flipped>
                          <OverflowMenuItem itemText={t('common.view')} />
                          <OverflowMenuItem itemText={t('common.edit')} />
                          <OverflowMenuItem itemText={t('common.duplicate')} />
                          <OverflowMenuItem itemText={t('common.downloadPdf')} />
                          {contract.status === 'draft' && <OverflowMenuItem itemText={t('common.send')} />}
                          <OverflowMenuItem itemText={t('common.delete')} hasDivider isDelete />
                        </OverflowMenu>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>

      <Pagination
        totalItems={filteredContracts.length}
        pageSize={10}
        pageSizes={[10, 20, 50]}
        style={{ marginTop: '1rem' }}
      />

      {/* New Document Modal */}
      <Modal
        open={isNewModalOpen}
        onRequestClose={() => setIsNewModalOpen(false)}
        modalHeading={t('contracts.newModal')}
        primaryButtonText={t('common.create')}
        secondaryButtonText={t('common.cancel')}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <Select id="doc-type" labelText={t('contracts.docType')}>
            <SelectItem value="contract" text={t('contracts.typeContract')} />
            <SelectItem value="proposal" text={t('contracts.proposalCommercial')} />
            <SelectItem value="nda" text={t('contracts.typeNda')} />
            <SelectItem value="amendment" text={t('contracts.typeAmendment')} />
          </Select>
          <TextInput
            id="doc-title"
            labelText={t('contracts.docTitle')}
            placeholder={t('contracts.docTitlePlaceholder')}
          />
          <Select id="doc-client" labelText={t('contracts.docClient')}>
            <SelectItem value="" text={t('common.select')} />
            <SelectItem value="techcorp" text="TechCorp Brasil" />
            <SelectItem value="startup" text="Startup XYZ" />
            <SelectItem value="empresa" text="Empresa ABC" />
          </Select>
          <Select id="doc-project" labelText={t('contracts.docProject')}>
            <SelectItem value="" text={t('common.none')} />
            <SelectItem value="website" text="Website Institucional" />
            <SelectItem value="social" text="Gestão Redes Sociais" />
          </Select>
          <TextInput
            id="doc-value"
            labelText={t('contracts.docValue')}
            type="number"
            placeholder="0"
          />
          <TextInput
            id="doc-expires"
            labelText={t('contracts.docExpires')}
            type="date"
          />
        </div>
      </Modal>
    </div>
  );
}
