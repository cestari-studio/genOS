'use client';

import { useState } from 'react';
import Link from 'next/link';
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

// TODO: Integrar com Supabase

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

const statusConfig = {
  draft: { label: 'Rascunho', color: 'gray' },
  sent: { label: 'Enviada', color: 'blue' },
  paid: { label: 'Paga', color: 'green' },
  overdue: { label: 'Vencida', color: 'red' },
  cancelled: { label: 'Cancelada', color: 'gray' },
} as const;

export default function BillingPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);

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
    { key: 'number', header: 'Número' },
    { key: 'client', header: 'Cliente' },
    { key: 'project', header: 'Projeto' },
    { key: 'value', header: 'Valor' },
    { key: 'status', header: 'Status' },
    { key: 'dueAt', header: 'Vencimento' },
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
        <BreadcrumbItem isCurrentPage>Faturamento</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Faturamento</h1>
          <p style={{ color: '#525252', margin: '0.25rem 0 0' }}>Gerencie faturas e recebimentos</p>
        </div>
        <Button size="sm" renderIcon={Add} onClick={() => setIsNewInvoiceModalOpen(true)}>
          Nova Fatura
        </Button>
      </div>

      {/* Alert for overdue invoices */}
      {overdueCount > 0 && (
        <InlineNotification
          kind="warning"
          title="Atenção"
          subtitle={`Você tem ${overdueCount} fatura(s) vencida(s) totalizando R$ ${totalOverdue.toLocaleString('pt-BR')}`}
          style={{ marginBottom: '1rem' }}
        />
      )}

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Checkmark size={20} style={{ color: '#24a148' }} />
              <h4 style={{ color: '#525252', margin: 0 }}>Recebido</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#24a148' }}>
              R$ {totalReceived.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {invoices.filter(i => i.status === 'paid').length} faturas pagas
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Time size={20} style={{ color: '#0f62fe' }} />
              <h4 style={{ color: '#525252', margin: 0 }}>A Receber</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#0f62fe' }}>
              R$ {totalPending.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {invoices.filter(i => i.status === 'sent').length} faturas pendentes
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Warning size={20} style={{ color: '#da1e28' }} />
              <h4 style={{ color: '#525252', margin: 0 }}>Vencido</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: '#da1e28' }}>
              R$ {totalOverdue.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {overdueCount} faturas vencidas
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Receipt size={20} style={{ color: '#525252' }} />
              <h4 style={{ color: '#525252', margin: 0 }}>Total Faturado</h4>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>
              R$ {invoices.reduce((acc, i) => acc + i.value, 0).toLocaleString('pt-BR')}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {invoices.length} faturas emitidas
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
              placeholder="Buscar faturas..."
              labelText="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-status" size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todos os status" />
            <SelectItem value="draft" text="Rascunho" />
            <SelectItem value="sent" text="Enviada" />
            <SelectItem value="paid" text="Paga" />
            <SelectItem value="overdue" text="Vencida" />
            <SelectItem value="cancelled" text="Cancelada" />
          </Select>
          <Select id="filter-period" size="sm" style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todo período" />
            <SelectItem value="this-month" text="Este mês" />
            <SelectItem value="last-month" text="Mês passado" />
            <SelectItem value="this-year" text="Este ano" />
          </Select>
          <Button kind="tertiary" size="sm" renderIcon={Download}>
            Exportar
          </Button>
        </div>
      </Tile>

      {/* Tabs */}
      <Tabs>
        <TabList aria-label="Faturas">
          <Tab>Todas ({invoices.length})</Tab>
          <Tab>Pendentes ({invoices.filter(i => i.status === 'sent').length})</Tab>
          <Tab>Vencidas ({overdueCount})</Tab>
          <Tab>Pagas ({invoices.filter(i => i.status === 'paid').length})</Tab>
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
                                <span style={{ color: '#24a148' }}>
                                  Pago em {new Date(invoice.paidAt).toLocaleDateString('pt-BR')}
                                </span>
                              ) : (
                                <span style={{ color: new Date(invoice.dueAt) < new Date() ? '#da1e28' : '#525252' }}>
                                  {new Date(invoice.dueAt).toLocaleDateString('pt-BR')}
                                </span>
                              )}
                            </TableCell>
                            <TableCell>
                              <OverflowMenu size="sm" flipped>
                                <OverflowMenuItem itemText="Visualizar" />
                                <OverflowMenuItem itemText="Editar" />
                                <OverflowMenuItem itemText="Duplicar" />
                                <OverflowMenuItem itemText="Download PDF" />
                                {invoice.status === 'draft' && <OverflowMenuItem itemText="Enviar" />}
                                {invoice.status === 'sent' && <OverflowMenuItem itemText="Marcar como Paga" />}
                                <OverflowMenuItem itemText="Cancelar" hasDivider isDelete />
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
                      <div style={{ fontSize: '0.875rem', color: '#525252' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#525252' }}>
                          Vence em {new Date(invoice.dueAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button kind="primary" size="sm">Marcar como Paga</Button>
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
                <Tile key={invoice.id} style={{ marginBottom: '0.5rem', borderLeft: '4px solid #da1e28' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong>{invoice.number}</strong> - {invoice.client}
                      <div style={{ fontSize: '0.875rem', color: '#525252' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#da1e28' }}>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#da1e28' }}>
                          Vencida em {new Date(invoice.dueAt).toLocaleDateString('pt-BR')}
                        </div>
                      </div>
                      <Button kind="secondary" size="sm">Enviar Lembrete</Button>
                      <Button kind="primary" size="sm">Marcar como Paga</Button>
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
                      <div style={{ fontSize: '0.875rem', color: '#525252' }}>{invoice.project}</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ textAlign: 'right' }}>
                        <strong style={{ color: '#24a148' }}>R$ {invoice.value.toLocaleString('pt-BR')}</strong>
                        <div style={{ fontSize: '0.75rem', color: '#24a148' }}>
                          Pago em {new Date(invoice.paidAt!).toLocaleDateString('pt-BR')}
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
        modalHeading="Nova Fatura"
        primaryButtonText="Criar Fatura"
        secondaryButtonText="Cancelar"
        size="lg"
      >
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <Select id="invoice-client" labelText="Cliente">
              <SelectItem value="" text="Selecione" />
              <SelectItem value="techcorp" text="TechCorp Brasil" />
              <SelectItem value="startup" text="Startup XYZ" />
              <SelectItem value="empresa" text="Empresa ABC" />
            </Select>
          </Column>
          <Column lg={8} md={4} sm={4}>
            <Select id="invoice-project" labelText="Projeto (opcional)">
              <SelectItem value="" text="Nenhum" />
              <SelectItem value="website" text="Website Institucional" />
              <SelectItem value="social" text="Gestão Redes Sociais" />
            </Select>
          </Column>
          <Column lg={16} md={8} sm={4}>
            <TextArea
              id="invoice-description"
              labelText="Descrição"
              placeholder="Descrição dos serviços..."
              rows={3}
              style={{ marginTop: '1rem' }}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <NumberInput
              id="invoice-value"
              label="Valor (R$)"
              min={0}
              step={100}
              style={{ marginTop: '1rem' }}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="invoice-due"
              labelText="Vencimento"
              type="date"
              style={{ marginTop: '1rem' }}
            />
          </Column>
        </Grid>
      </Modal>
    </div>
  );
}
