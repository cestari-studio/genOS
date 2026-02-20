'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
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

export default function QuotesPage() {
  const { t } = useTranslation();

  const statusConfig = {
    draft: { label: t('quotes.statusDraft'), color: 'gray' },
    sent: { label: t('quotes.statusSent'), color: 'blue' },
    accepted: { label: t('quotes.statusAccepted'), color: 'green' },
    rejected: { label: t('quotes.statusRejected'), color: 'red' },
    expired: { label: t('quotes.statusExpired'), color: 'gray' },
  } as const;

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
        <BreadcrumbItem href="/dashboard">{t('sidebar.dashboard')}</BreadcrumbItem>
        <BreadcrumbItem isCurrentPage>{t('quotes.title')}</BreadcrumbItem>
      </Breadcrumb>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ margin: 0 }}>{t('quotes.title')}</h1>
          <p style={{ color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>{t('quotes.subtitle')}</p>
        </div>
        <Button size="sm" renderIcon={Calculator} onClick={() => setIsBuilderModalOpen(true)}>
          {t('quotes.newQuote')}
        </Button>
      </div>

      {/* Métricas */}
      <Grid fullWidth style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('quotes.accepted')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-support-success)' }}>
              R$ {totalAccepted.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('quotes.quoteCount', { count: quotes.filter(q => q.status === 'accepted').length })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('quotes.awaiting')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0, color: 'var(--cds-link-primary)' }}>
              R$ {totalPending.toLocaleString('pt-BR')}
            </p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('quotes.quoteCount', { count: quotes.filter(q => q.status === 'sent').length })}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('quotes.conversionRate')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{conversionRate}%</p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('quotes.quotesAccepted')}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <h4 style={{ color: 'var(--cds-text-secondary)', marginBottom: '0.5rem' }}>{t('quotes.totalCreated')}</h4>
            <p style={{ fontSize: '2rem', fontWeight: 600, margin: 0 }}>{quotes.length}</p>
            <p style={{ color: 'var(--cds-text-secondary)', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>
              {t('quotes.inPeriod')}
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
              placeholder={t('quotes.searchPlaceholder')}
              labelText={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select id="filter-status" size="sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} style={{ minWidth: '150px' }}>
            <SelectItem value="all" text={t('common.allStatus')} />
            <SelectItem value="draft" text={t('quotes.statusDraft')} />
            <SelectItem value="sent" text={t('quotes.statusSent')} />
            <SelectItem value="accepted" text={t('quotes.statusAccepted')} />
            <SelectItem value="rejected" text={t('quotes.statusRejected')} />
            <SelectItem value="expired" text={t('quotes.statusExpired')} />
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
                {quote.client} • {t('quotes.createdOn', { date: new Date(quote.createdAt).toLocaleDateString('pt-BR') })}
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 600, margin: 0 }}>
                R$ {quote.total.toLocaleString('pt-BR')}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--cds-text-secondary)', margin: '0.25rem 0 0' }}>
                {t('quotes.validUntil')} {new Date(quote.validUntil).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>

          <div style={{ marginTop: '1rem' }}>
          <Accordion>
            <AccordionItem title={t('quotes.itemsCount', { count: quote.items.length })}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--cds-border-subtle-01)' }}>
                    <th style={{ padding: '0.5rem', textAlign: 'left' }}>{t('quotes.description')}</th>
                    <th style={{ padding: '0.5rem', textAlign: 'center', width: '80px' }}>{t('quotes.qty')}</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', width: '120px' }}>{t('quotes.unitPrice')}</th>
                    <th style={{ padding: '0.5rem', textAlign: 'right', width: '120px' }}>{t('quotes.total')}</th>
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
                    <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right' }}>{t('quotes.subtotal')}:</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right' }}>R$ {quote.subtotal.toLocaleString('pt-BR')}</td>
                  </tr>
                  {quote.discount > 0 && (
                    <tr>
                      <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--cds-support-success)' }}>{t('quotes.generalDiscount')}:</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right', color: 'var(--cds-support-success)' }}>-R$ {quote.discount.toLocaleString('pt-BR')}</td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan={3} style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>{t('quotes.total')}:</td>
                    <td style={{ padding: '0.5rem', textAlign: 'right', fontWeight: 600 }}>R$ {quote.total.toLocaleString('pt-BR')}</td>
                  </tr>
                </tfoot>
              </table>
            </AccordionItem>
          </Accordion>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
            <Button kind="ghost" size="sm" renderIcon={Copy}>{t('common.duplicate')}</Button>
            <Button kind="ghost" size="sm" renderIcon={Edit}>{t('common.edit')}</Button>
            <Button kind="ghost" size="sm" renderIcon={View}>{t('common.view')}</Button>
            {quote.status === 'draft' && (
              <Button kind="primary" size="sm" renderIcon={Send}>{t('common.send')}</Button>
            )}
          </div>
        </Tile>
      ))}

      {/* Quote Builder Modal */}
      <Modal
        open={isBuilderModalOpen}
        onRequestClose={() => setIsBuilderModalOpen(false)}
        modalHeading={t('quotes.builderTitle')}
        primaryButtonText={t('quotes.createQuote')}
        secondaryButtonText={t('common.cancel')}
        size="lg"
      >
        <Grid fullWidth>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="quote-title"
              labelText={t('quotes.quoteTitle')}
              placeholder={t('quotes.quoteTitlePlaceholder')}
            />
          </Column>
          <Column lg={8} md={4} sm={4}>
            <Select id="quote-client" labelText={t('quotes.client')}>
              <SelectItem value="" text={t('common.select')} />
              <SelectItem value="techcorp" text="TechCorp Brasil" />
              <SelectItem value="startup" text="Startup XYZ" />
              <SelectItem value="empresa" text="Empresa ABC" />
            </Select>
          </Column>
        </Grid>

        <h4 style={{ margin: '1.5rem 0 1rem' }}>{t('quotes.items')}</h4>

        {quoteItems.map((item, index) => (
          <div key={item.id} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'flex-end' }}>
            <div style={{ flex: 3 }}>
              <TextInput
                id={`item-desc-${index}`}
                labelText={index === 0 ? t('quotes.description') : ''}
                placeholder={t('quotes.descriptionPlaceholder')}
                value={item.description}
                onChange={(e) => updateItem(item.id, 'description', e.target.value)}
              />
            </div>
            <div style={{ width: '80px' }}>
              <NumberInput
                id={`item-qty-${index}`}
                label={index === 0 ? t('quotes.qty') : ''}
                min={1}
                value={item.quantity}
                onChange={(e, { value }) => updateItem(item.id, 'quantity', value as number)}
              />
            </div>
            <div style={{ width: '140px' }}>
              <NumberInput
                id={`item-price-${index}`}
                label={index === 0 ? t('quotes.unitPrice') : ''}
                min={0}
                value={item.unitPrice}
                onChange={(e, { value }) => updateItem(item.id, 'unitPrice', value as number)}
              />
            </div>
            <div style={{ width: '100px' }}>
              <NumberInput
                id={`item-discount-${index}`}
                label={index === 0 ? t('quotes.discountPercent') : ''}
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
              iconDescription={t('quotes.remove')}
              renderIcon={Close}
              onClick={() => removeItem(item.id)}
              disabled={quoteItems.length === 1}
            />
          </div>
        ))}

        <Button kind="ghost" size="sm" renderIcon={Add} onClick={addItem} style={{ marginTop: '0.5rem' }}>
          {t('quotes.addItem')}
        </Button>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--cds-background)', borderRadius: '4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span>{t('quotes.subtotal')}:</span>
            <strong>R$ {calculateSubtotal().toLocaleString('pt-BR')}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span>{t('quotes.generalDiscount')}:</span>
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
            <strong>{t('quotes.total')}:</strong>
            <strong style={{ fontSize: '1.25rem', color: 'var(--cds-link-primary)' }}>R$ {calculateTotal().toLocaleString('pt-BR')}</strong>
          </div>
        </div>

        <Grid fullWidth style={{ marginTop: '1rem' }}>
          <Column lg={8} md={4} sm={4}>
            <TextInput
              id="quote-valid"
              labelText={t('quotes.validUntil')}
              type="date"
            />
          </Column>
        </Grid>
      </Modal>
    </div>
  );
}
