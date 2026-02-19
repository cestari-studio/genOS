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
  Accordion,
  AccordionItem,
} from '@carbon/react';
import {
  Add,
  Calculator,
  Send,
  View,
  Edit,
  Copy,
  TrashCan,
  Save,
  Close,
} from '@carbon/icons-react';

// TODO: Integrar com Supabase

interface QuoteItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  discount: number;
}

interface Quote {
  id: string;
  number: string;
  client: string;
  title: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired';
  createdAt: string;
  validUntil: string;
  items: QuoteItem[];
  subtotal: number;
  discount: number;
  total: number;
}

const quotes: Quote[] = [
  {
    id: '1',
    number: 'ORC-2024-001',
    client: 'TechCorp Brasil',
    title: 'Website Institucional Completo',
    status: 'accepted',
    createdAt: '2024-01-10',
    validUntil: '2024-01-25',
    items: [
      { id: '1', description: 'Design UI/UX', quantity: 1, unitPrice: 8000, discount: 0 },
      { id: '2', description: 'Desenvolvimento Front-end', quantity: 1, unitPrice: 12000, discount: 0 },
      { id: '3', description: 'Integração CMS', quantity: 1, unitPrice: 5000, discount: 0 },
    ],
    subtotal: 25000,
    discount: 0,
    total: 25000,
  },
  {
    id: '2',
    number: 'ORC-2024-002',
    client: 'Startup XYZ',
    title: 'Aplicativo Mobile iOS/Android',
    status: 'sent',
    createdAt: '2024-02-15',
    validUntil: '2024-03-01',
    items: [
      { id: '1', description: 'Design de Interface', quantity: 1, unitPrice: 15000, discount: 0 },
      { id: '2', description: 'Desenvolvimento React Native', quantity: 1, unitPrice: 35000, discount: 0 },
      { id: '3', description: 'Backend e API', quantity: 1, unitPrice: 20000, discount: 0 },
    ],
    subtotal: 70000,
    discount: 5000,
    total: 65000,
  },
  {
    id: '3',
    number: 'ORC-2024-003',
    client: 'Empresa ABC',
    title: 'Identidade Visual',
    status: 'draft',
    createdAt: '2024-02-18',
    validUntil: '2024-03-05',
    items: [
      { id: '1', description: 'Logo e Manual de Marca', quantity: 1, unitPrice: 8000, discount: 0 },
      { id: '2', description: 'Papelaria Básica', quantity: 1, unitPrice: 3000, discount: 0 },
      { id: '3', description: 'Templates Redes Sociais', quantity: 1, unitPrice: 4000, discount: 0 },
    ],
    subtotal: 15000,
    discount: 0,
    total: 15000,
  },
];

const statusConfig = {
  draft: { label: 'Rascunho', color: 'gray' },
  sent: { label: 'Enviado', color: 'blue' },
  accepted: { label: 'Aceito', color: 'green' },
  rejected: { label: 'Rejeitado', color: 'red' },
  expired: { label: 'Expirado', color: 'gray' },
} as const;

export default function QuotesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isBuilderModalOpen, setIsBuilderModalOpen] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState<Quote | null>(null);

  // Estado do construtor de orçamento
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    { id: '1', description: '', quantity: 1, unitPrice: 0, discount: 0 },
  ]);
  const [quoteDiscount, setQuoteDiscount] = useState(0);

  const filteredQuotes = quotes.filter(quote => {
    const matchesSearch = quote.number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         quote.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || quote.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const calculateSubtotal = () => {
    return quoteItems.reduce((acc, item) => {
      const itemTotal = item.quantity * item.unitPrice;
      const itemDiscount = itemTotal * (item.discount / 100);
      return acc + (itemTotal - itemDiscount);
    }, 0);
  };

  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    return subtotal - quoteDiscount;
  };

  const addItem = () => {
    setQuoteItems([
      ...quoteItems,
      { id: Date.now().toString(), description: '', quantity: 1, unitPrice: 0, discount: 0 },
    ]);
  };

  const removeItem = (id: string) => {
    setQuoteItems(quoteItems.filter(item => item.id !== id));
  };

  const updateItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setQuoteItems(quoteItems.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  // Métricas
  const totalAccepted = quotes.filter(q => q.status === 'accepted').reduce((acc, q) => acc + q.total, 0);
  const totalPending = quotes.filter(q => q.status === 'sent').reduce((acc, q) => acc + q.total, 0);
  const conversionRate = quotes.length > 0
    ? Math.round((quotes.filter(q => q.status === 'accepted').length / quotes.filter(q => q.status !== 'draft').length) * 100)
    : 0;

  return (
    <div>
      {/* Breadcrumb */}
      <Breadcrumb noTrailingSlash style={{ marginBottom: '1rem' }}>
        <BreadcrumbItem href="/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>Orçamentos</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>Orçamentos</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>Crie e gerencie propostas comerciais</p>
        </div>
        <Button size="sm" renderIcon={Calculator} onClick={() => setIsBuilderModalOpen(true)}>
          Novo Orçamento
        </Button>
      </div>

      {/* Métricas */}
      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Aceitos</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>
              R$ {totalAccepted.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {quotes.filter(q => q.status === 'accepted').length} orçamentos
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Aguardando</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-link-primary)' }}>
              R$ {totalPending.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {quotes.filter(q => q.status === 'sent').length} orçamentos
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Taxa de Conversão</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{conversionRate}%</p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              orçamentos aceitos
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>Total Criados</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{quotes.length}</p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              neste período
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
              placeholder="Buscar orçamentos..."
              labelText="Buscar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-status" size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text="Todos os status" />
            <SelectItem value="draft" text="Rascunho" />
            <SelectItem value="sent" text="Enviado" />
            <SelectItem value="accepted" text="Aceito" />
            <SelectItem value="rejected" text="Rejeitado" />
            <SelectItem value="expired" text="Expirado" />
          </Select>
        </div>
      </Tile>

      {/* Lista de Orçamentos */}
      {filteredQuotes.map(quote => (
        <Tile key={quote.id} style={{ marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                <h3 style={{ margin: 0 }}>{quote.number}</h3>
                <Tag type={statusConfig[quote.status].color as any} size="sm">
                  {statusConfig[quote.status].label}
                </Tag>
              </div>
              <p style={{ margin: 0, fontWeight: 500 }}>{quote.title}</p>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>
                {quote.client} • Criado em {new Date(quote.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                R$ {quote.total.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
                Válido até {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
          <Accordion>
            <AccordionItem title={`${quote.items.length} itens`}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>Descrição</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }}>Qtd.</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', width: '120px' }}>Valor Unit.</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', width: '120px' }}>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {quote.items.map(item => (
                    <tr key={item.id} style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                      <td style={{ padding: '0.5rem' }}>{item.description}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {item.unitPrice.toLocaleString('pt-BR')}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {(item.quantity * item.unitPrice).toLocaleString('pt-BR')}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right' }}>Subtotal:</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {quote.subtotal.toLocaleString('pt-BR')}</td>
                  </tr>
                  {quote.discount > 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--cds-support-success)' }}>Desconto:</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--cds-support-success)' }}>-R$ {quote.discount.toLocaleString('pt-BR')}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>Total:</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>R$ {quote.total.toLocaleString('pt-BR')}</td>
                  </tr>
                </tfoot>
              </table>
            </AccordionItem>
          </Accordion>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button kind="ghost" size="sm" renderIcon={Copy}>Duplicar</Button>
            <Button kind="ghost" size="sm" renderIcon={Edit}>Editar</Button>
            <Button kind="ghost" size="sm" renderIcon={View}>Visualizar</Button>
            {quote.status === 'draft' && (
              <Button kind="primary" size="sm" renderIcon={Send}>Enviar</Button>
            )}
          </div>
        </Tile>
      ))}

      {/* Quote Builder Modal */}
      <Modal
        open={isBuilderModalOpen}
        onRequestClose={() => setIsBuilderModalOpen(false)}
        modalHeading="Construtor de Orçamento"
        primaryButtonText="Criar Orçamento"
        secondaryButtonText="Cancelar"
        size="lg"
      >
        <Grid>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="quote-title"
              labelText="Título do Orçamento"
              placeholder="Ex: Website Institucional Completo"
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <Select id="quote-client" labelText="Cliente">
              <SelectItem value="" text="Selecione" />
              <SelectItem value="techcorp" text="TechCorp Brasil" />
              <SelectItem value="startup" text="Startup XYZ" />
              <SelectItem value="empresa" text="Empresa ABC" />
            </Select>
          </Column>
        </Grid>

        <h4 style={{ margin: '1.5rem 0 1rem' }}>Itens do Orçamento</h4>

        {quoteItems.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 3 }}>
              <TextInput
                id={`item-desc-${index}`}
                labelText={index === 0 ? 'Descrição' : ''}
                placeholder="Descrição do item"
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              />
            </div>
            <div style={{ width: '80px' }}>
              <NumberInput
                id={`item-qty-${index}`}
                label={index === 0 ? 'Qtd.' : ''}
                min={1}
                value={item.quantity}
                onChange={(e, { value }) => updateItem(item.id, 'quantity', value as number)}
              />
            </div>
            <div style={{ width: '140px' }}>
              <NumberInput
                id={`item-price-${index}`}
                label={index === 0 ? 'Valor Unit.' : ''}
                min={0}
                value={item.unitPrice}
                onChange={(e, { value }) => updateItem(item.id, 'unitPrice', value as number)}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInput
                id={`item-discount-${index}`}
                label={index === 0 ? 'Desc. %' : ''}
                min={0}
                max={100}
                value={item.discount}
                onChange={(e, { value }) => updateItem(item.id, 'discount', value as number)}
              />
            </div>
            <Button
              kind="ghost"
              size="sm"
              hasIconOnly
              iconDescription="Remover"
              renderIcon={Close}
              onClick={() => removeItem(item.id)}
              disabled={quoteItems.length === 1}
            />
          </div>
        ))}

        <Button kind="ghost" size="sm" renderIcon={Add} onClick={addItem} style={{ marginTop: '0.5rem' }}>
          Adicionar Item
        </Button>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--cds-background)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>Subtotal:</span>
            <strong>R$ {calculateSubtotal().toLocaleString('pt-BR')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span>Desconto Geral:</span>
            <div style={{ width: '150px' }}>
              <NumberInput
                id="quote-discount"
                hideLabel
                min={0}
                value={quoteDiscount}
                onChange={(e, { value }) => setQuoteDiscount(value as number)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem', borderTop: '1px solid var(--cds-border-subtle-01)' }}>
            <strong>Total:</strong>
            <strong style={{ fontSize: '1.25rem', color: 'var(--cds-link-primary)' }}>R$ {calculateTotal().toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        <Grid style={{ marginTop: '1rem' }}>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="quote-valid"
              labelText="Válido até"
              type="date"
            />
          </Column>
        </Grid>
      </Modal>
    </div>
  );
}
