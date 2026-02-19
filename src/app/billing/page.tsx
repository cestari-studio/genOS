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
  NumberInput,
  Breadcrumb,
  BreadcrumbItem,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Pagination,
  InlineNotification,
} from '@carbon/react';
import {
  Add,
  Download,
  Send,
  View,
  Edit,
  Copy,
  TrashCan,
  Checkmark,
  Warning,
  Time,
  Money,
  Receipt,
  Calendar,
} from '@carbon/icons-react';

// Stripe checkout helper
async function handleCheckout(priceId: string) {
  const res = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ price_id: priceId }),
  });
  const json = await res.json();
  if (json.data?.url) {
    window.location.href = json.data.url;
  }
}

interface Invoice {
  id: string;
  number: string;
  client: string;
  project: string;
  value: number;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  issuedAt: string;
  dueAt: string;
  paidAt?: string;
  items: { description: string; quantity: number; unitPrice: number }[];
}

const invoices: Invoice[] = [
  { id: '1', number: 'FAT-2024-001', client: 'TechCorp Brasil', project: 'Website Institucional', value: 12500, status: 'paid', issuedAt: '2024-01-15', dueAt: '2024-01-30', paidAt: '2024-01-28', items: [] },
  { id: '2', number: 'FAT-2024-002', client: 'TechCorp Brasil', project: 'Website Institucional', value: 12500, status: 'paid', issuedAt: '2024-02-01', dueAt: '2024-02-15', paidAt: '2024-02-14', items: [] },
  { id: '3', number: 'FAT-2024-003', client: 'Startup XYZ', project: 'App Mobile', value: 8000, status: 'sent', issuedAt: '2024-02-10', dueAt: '2024-02-25', items: [] },
  { id: '4', number: 'FAT-2024-004', client: 'TechCorp Brasil', project: 'Gestão Redes Sociais', value: 3500, status: 'overdue', issuedAt: '2024-01-20', dueAt: '2024-02-05', items: [] },
  { id: '5', number: 'FAT-2024-005', client: 'Empresa ABC', project: 'Identidade Visual', value: 7500, status: 'draft', issuedAt: '2024-02-18', dueAt: '2024-03-05', items: [] },
];

export default function BillingPage() {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

  const statusConfig = {
    draft: { label: t('billing.statusDraft'), color: 'gray' },
    sent: { label: t('billing.statusSent'), color: 'blue' },
    paid: { label: t('billing.statusPaid'), color: 'green' },
    overdue: { label: t('billing.statusOverdue'), color: 'red' },
    cancelled: { label: t('billing.statusCancelled'), color: 'gray' },
  } as const;

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.client.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || invoice.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  // Métricas
  const totalReceived = invoices.filter(i => i.status === 'paid').reduce((acc, i) => acc + i.value, 0);
  const totalPending = invoices.filter(i => i.status === 'sent').reduce((acc, i) => acc + i.value, 0);
  const totalOverdue = invoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.value, 0);
  const overdueCount = invoices.filter(i => i.status === 'overdue').length;

  const headers = [
    { key: 'number', header: t('billing.number') },
    { key: 'client', header: t('billing.client') },
    { key: 'project', header: t('billing.project') },
    { key: 'value', header: t('billing.value') },
    { key: 'status', header: t('billing.status') },
    { key: 'dueAt', header: t('billing.dueDate') },
    { key: 'actions', header: '' },
  ];

  const rows = filteredInvoices.map(invoice => ({
    id: invoice.id,
    number: invoice.number,
    client: invoice.client,
    project: invoice.project,
    value: invoice.value,
    status: invoice.status,
    dueAt: invoice.dueAt,
  }));

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('billing.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('billing.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{t('billing.subtitle')}</p>
        </div>
        <Button size="sm" renderIcon={Add} onClick={() => setIsNewInvoiceModalOpen(true)}>
          {t('billing.newInvoice')}
        </Button>
      </div>

      {/* Alert for overdue invoices */}
      {overdueCount > 0 && (
        <InlineNotification
          kind="warning"
          title={t('billing.attention')}
          subtitle={t('billing.overdueAlert', { count: overdueCount, total: totalOverdue.toLocaleString('pt-BR') })}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Checkmark size={20} style={{ color: 'var(--cds-support-success)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>{t('billing.received')}</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>
              R$ {totalReceived.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('billing.paidInvoices', { count: invoices.filter(i => i.status === 'paid').length })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Time size={20} style={{ color: 'var(--cds-link-primary)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>{t('billing.pending')}</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-link-primary)' }}>
              R$ {totalPending.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('billing.pendingInvoices', { count: invoices.filter(i => i.status === 'sent').length })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Warning size={20} style={{ color: 'var(--cds-support-error)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>{t('billing.overdue')}</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-error)' }}>
              R$ {totalOverdue.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('billing.overdueInvoices', { count: overdueCount })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Receipt size={20} style={{ color: 'var(--cds-text-secondary)' }} />
              <h4 style={{ color: 'var(--cds-text-secondary)', margin: 0 }}>{t('billing.totalBilled')}</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
              R$ {invoices.reduce((acc, i) => acc + i.value, 0).toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('billing.invoicesIssued', { count: invoices.length })}
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
              placeholder={t('billing.searchPlaceholder')}
              labelText={t('billing.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-status" size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('common.allStatus')} />
            <SelectItem value="draft" text={t('billing.statusDraft')} />
            <SelectItem value="sent" text={t('billing.statusSent')} />
            <SelectItem value="paid" text={t('billing.statusPaid')} />
            <SelectItem value="overdue" text={t('billing.statusOverdue')} />
            <SelectItem value="cancelled" text={t('billing.statusCancelled')} />
          </Select>
          <Select id="filter-period" size="sm" style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('common.allPeriod')} />
            <SelectItem value="this-month" text={t('common.thisMonth')} />
            <SelectItem value="last-month" text={t('common.lastMonth')} />
            <SelectItem value="this-year" text={t('common.thisYear')} />
          </Select>
          <Button kind="tertiary" size="sm" renderIcon={Download}>
            {t('common.export')}
          </Button>
        </div>
      </Tile>

      {/* Tabs */}
      <Tabs>
        <TabList aria-label="Faturas">
          <Tab>{t('billing.all', { count: invoices.length })}</Tab>
          <Tab>{t('billing.pendingTab', { count: invoices.filter(i => i.status === 'sent').length })}</Tab>
          <Tab>{t('billing.overdueTab', { count: overdueCount })}</Tab>
          <Tab>{t('billing.paidTab', { count: invoices.filter(i => i.status === 'paid').length })}</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <DataTable rows={rows} headers={headers}>
              {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                <TableContainer style={{ marginTop: '1rem' }}>
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
                        const invoice = invoices.find(i => i.id === row.id)!;
                        return (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            <TableCell>
                              <strong>{invoice.number}</strong>
                            </TableCell>
                            <TableCell>{invoice.client}</TableCell>
                            <TableCell>{invoice.project}</TableCell>
                            <TableCell>
                              <strong>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                            </TableCell>
                            <TableCell>
                              <Tag type={statusConfig[invoice.status].color as any} size="sm">
                                {statusConfig[invoice.status].label}
                              </Tag>
                            </TableCell>
                            <TableCell>
                              {invoice.paidAt ? (
                                <span style={{ color: 'var(--cds-support-success)' }}>
                                  {t('billing.paidOn', { date: new Date(invoice.paidAt).toLocaleDateString('pt-BR') })}
                                </span>
                              ) : (
                                <span style={{ color: new Date(invoice.dueAt) < new Date() ? 'var(--cds-support-error)' : 'var(--cds-text-secondary)' }}>
                                  {new Date(invoice.dueAt).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <OverflowMenu size="sm" flipped>
                                <OverflowMenuItem itemText={t('common.view')} />
                                <OverflowMenuItem itemText={t('common.edit')} />
                                <OverflowMenuItem itemText={t('common.duplicate')} />
                                <OverflowMenuItem itemText={t('common.downloadPdf')} />
                                {invoice.status === 'draft' && <OverflowMenuItem itemText={t('common.send')} />}
                                {invoice.status === 'sent' && <OverflowMenuItem itemText={t('billing.markAsPaid')} />}
                                <OverflowMenuItem itemText={t('common.cancel')} hasDivider isDelete />
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
              totalItems={filteredInvoices.length}
              pageSize={10}
              pageSizes={[10, 20, 50]}
              style={{ marginTop: '1rem' }}
            />
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {/* Faturas pendentes */}
              {invoices.filter(i => i.status === 'sent').map(invoice => (
                <Tile key={invoice.id} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{invoice.number}</strong> - {invoice.client}
                      <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)' }}>
                          {t('billing.paidOn', { date: new Date(invoice.dueAt).toLocaleDateString('pt-BR') })}
                        </div>
                      </div>
                      <Button kind="primary" size="sm">{t('billing.markAsPaid')}</Button>
                    </div>
                  </div>
                </Tile>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {/* Faturas vencidas */}
              {invoices.filter(i => i.status === 'overdue').map(invoice => (
                <Tile key={invoice.id} style={{ marginBottom: '0.5rem', borderLeft: '4px solid var(--cds-support-error)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{invoice.number}</strong> - {invoice.client}
                      <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--cds-support-error)' }}>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cds-support-error)' }}>
                          {t('billing.paidOn', { date: new Date(invoice.dueAt).toLocaleDateString('pt-BR') })}
                        </div>
                      </div>
                      <Button kind="secondary" size="sm">{t('billing.sendReminder')}</Button>
                      <Button kind="primary" size="sm">{t('billing.markAsPaid')}</Button>
                    </div>
                  </div>
                </Tile>
              ))}
            </div>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {/* Faturas pagas */}
              {invoices.filter(i => i.status === 'paid').map(invoice => (
                <Tile key={invoice.id} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{invoice.number}</strong> - {invoice.client}
                      <div style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: 'var(--cds-support-success)' }}>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: 'var(--cds-support-success)' }}>
                          {t('billing.paidOn', { date: new Date(invoice.paidAt!).toLocaleDateString('pt-BR') })}
                        </div>
                      </div>
                      <Button kind="ghost" size="sm" renderIcon={Download}>PDF</Button>
                    </div>
                  </div>
                </Tile>
              ))}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* New Invoice Modal */}
      <Modal
        open={isNewInvoiceModalOpen}
        onRequestClose={() => setIsNewInvoiceModalOpen(false)}
        modalHeading={t('billing.newInvoice')}
        primaryButtonText={t('billing.newInvoice')}
        secondaryButtonText={t('common.cancel')}
        size="lg"
      >
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <Select id="invoice-client" labelText={t('billing.invoiceClient')}>
              <SelectItem value="" text={t('common.select')} />
              <SelectItem value="techcorp" text="TechCorp Brasil" />
              <SelectItem value="startup" text="Startup XYZ" />
              <SelectItem value="empresa" text="Empresa ABC" />
            </Select>
          </Column>
          <Column lg={8} md={4} sm={4}>
            <Select id="invoice-project" labelText={t('billing.invoiceProject')}>
              <SelectItem value="" text={t('common.none')} />
              <SelectItem value="website" text="Website Institucional" />
              <SelectItem value="social" text="Gestão Redes Sociais" />
            </Select>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <TextArea
              id="invoice-description"
              labelText={t('billing.description')}
              placeholder={t('billing.descriptionPlaceholder')}
              rows={3}
              style={{ marginTop: '1rem' }}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <NumberInput
              id="invoice-value"
              label={t('billing.invoiceValue')}
              min={0}
              step={100}
              style={{ marginTop: '1rem' }}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="invoice-due"
              labelText={t('billing.invoiceDue')}
              type="date"
              style={{ marginTop: '1rem' }}
            />
          </Column>
        </Grid>
      </Modal>
    </div>
  );
}
