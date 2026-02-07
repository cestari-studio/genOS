'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  DataTable,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tag,
  ProgressBar,
  InlineLoading,
  Pagination,
} from '@carbon/react';
import {
  Download,
  Money,
  ArrowUp,
  ArrowDown,
  Checkmark,
  Close,
  Time,
  ArrowRight,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { ClientPurchase, ClientCreditsSummary, CreditGaugeData, Package, ContentType, ContentTypeSlug } from '@/types/database';
import './credits.scss';

interface ContentTypeWeight {
  slug: ContentTypeSlug;
  name: string;
  weight: number;
  icon: string;
  complexity: 'Baixa' | 'Média' | 'Alta';
  platform?: string;
}

interface MonthlyCreditData {
  month: string;
  credits: number;
}

const CONTENT_TYPE_WEIGHTS: ContentTypeWeight[] = [
  { slug: 'post_simples', name: 'Post Simples', weight: 1.0, icon: 'Message', complexity: 'Baixa', platform: 'instagram' },
  { slug: 'post_imagem', name: 'Post com Imagem', weight: 1.5, icon: 'Image', complexity: 'Média', platform: 'instagram' },
  { slug: 'post_fixo', name: 'Post Fixo', weight: 2.0, icon: 'Pin', complexity: 'Média', platform: 'instagram' },
  { slug: 'story_texto', name: 'Story Texto', weight: 0.5, icon: 'Text', complexity: 'Baixa', platform: 'instagram' },
  { slug: 'story_video', name: 'Story Vídeo', weight: 1.5, icon: 'Video', complexity: 'Média', platform: 'instagram' },
  { slug: 'carrossel_imagens', name: 'Carrossel Imagens', weight: 2.0, icon: 'Images', complexity: 'Média', platform: 'instagram' },
  { slug: 'carrossel_video', name: 'Carrossel Vídeo', weight: 3.0, icon: 'Video', complexity: 'Alta', platform: 'instagram' },
  { slug: 'reels', name: 'Reels', weight: 2.5, icon: 'PlayFilled', complexity: 'Alta', platform: 'instagram' },
  { slug: 'tiktok', name: 'TikTok', weight: 2.5, icon: 'PlayFilled', complexity: 'Alta', platform: 'tiktok' },
  { slug: 'youtube_shorts', name: 'YouTube Shorts', weight: 3.0, icon: 'PlayFilled', complexity: 'Alta', platform: 'youtube' },
  { slug: 'linkedin_post', name: 'LinkedIn Post', weight: 1.5, icon: 'Message', complexity: 'Média', platform: 'linkedin' },
  { slug: 'linkedin_carrossel', name: 'LinkedIn Carrossel', weight: 2.5, icon: 'Images', complexity: 'Média', platform: 'linkedin' },
  { slug: 'facebook_post', name: 'Facebook Post', weight: 1.0, icon: 'Message', complexity: 'Baixa', platform: 'facebook' },
  { slug: 'twitter_post', name: 'Twitter Post', weight: 0.5, icon: 'Message', complexity: 'Baixa', platform: 'twitter' },
];

interface TableRow {
  id: string;
  package_name: string;
  total_credits: number;
  credits_used: number;
  credits_remaining: number;
  status: 'paid' | 'pending';
  expires_at: string;
}

export default function CreditsPage() {
  const [loading, setLoading] = useState(true);
  const [creditSummary, setCreditSummary] = useState<CreditGaugeData | null>(null);
  const [purchases, setPurchases] = useState<TableRow[]>([]);
  const [monthlyCreditData, setMonthlyCreditData] = useState<MonthlyCreditData[]>([]);
  const [usageByContentType, setUsageByContentType] = useState<Array<{ name: string; weight: number; percentage: number }>>([]);
  const [pageSize, setPageSize] = useState(10);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    loadCreditsData();
  }, []);

  const loadCreditsData = async () => {
    setLoading(true);
    try {
      const supabase = createClient();

      // Fetch active purchases for credit gauge
      const { data: activePurchases, error: purchasesError } = await supabase
        .from('client_purchases')
        .select('credits_total, credits_used, expires_at, is_active')
        .eq('is_active', true);

      if (purchasesError) throw purchasesError;

      // Calculate aggregated credit summary
      let creditGaugeData: CreditGaugeData;
      if (activePurchases && activePurchases.length > 0) {
        const totalCredits = activePurchases.reduce((sum, purchase) => sum + purchase.credits_total, 0);
        const usedCredits = activePurchases.reduce((sum, purchase) => sum + purchase.credits_used, 0);
        const remainingCredits = totalCredits - usedCredits;

        // Find nearest expiration date
        const expirations = activePurchases
          .map(p => new Date(p.expires_at).getTime())
          .filter(time => time > Date.now())
          .sort((a, b) => a - b);

        const nearestExpiration = expirations.length > 0 ? new Date(expirations[0]) : null;
        const daysUntilExpiry = nearestExpiration
          ? Math.ceil((nearestExpiration.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
          : 0;

        creditGaugeData = {
          total: totalCredits,
          used: usedCredits,
          remaining: remainingCredits,
          expiresAt: nearestExpiration?.toISOString() || null,
          daysUntilExpiry,
          percentUsed: totalCredits > 0 ? Math.round((usedCredits / totalCredits) * 100) : 0,
        };
      } else {
        creditGaugeData = {
          total: 0,
          used: 0,
          remaining: 0,
          expiresAt: null,
          daysUntilExpiry: 0,
          percentUsed: 0,
        };
      }

      setCreditSummary(creditGaugeData);

      // Fetch purchase history with package details
      const { data: purchasesWithPackages, error: historyError } = await supabase
        .from('client_purchases')
        .select('id, credits_total, credits_used, payment_status, expires_at, created_at, packages(name)')
        .order('created_at', { ascending: false });

      if (historyError) throw historyError;

      const formattedPurchases: TableRow[] = (purchasesWithPackages || []).map((purchase: any) => ({
        id: purchase.id,
        package_name: purchase.packages?.name || 'Pacote Desconhecido',
        total_credits: purchase.credits_total,
        credits_used: purchase.credits_used,
        credits_remaining: purchase.credits_total - purchase.credits_used,
        status: purchase.payment_status === 'paid' ? 'paid' : 'pending',
        expires_at: purchase.expires_at,
      }));

      setPurchases(formattedPurchases);

      // Fetch content types from database
      const { data: contentTypes, error: contentError } = await supabase
        .from('content_types')
        .select('name, slug, credit_weight, platform, complexity_level');

      if (contentError) throw contentError;

      // Use fetched content types or fallback to CONTENT_TYPE_WEIGHTS for display
      if (contentTypes && contentTypes.length > 0) {
        const contentTypeUsage = contentTypes.slice(0, 6).map((type: any, idx: number) => ({
          name: type.name,
          weight: type.credit_weight,
          percentage: Math.round(((idx + 1) / contentTypes.length) * 100),
        }));
        setUsageByContentType(contentTypeUsage);
      } else {
        // Fallback to default usage if no data from DB
        const contentTypeUsage = [
          { name: 'Reels', weight: 2.5, percentage: 28 },
          { name: 'Carrossel Vídeo', weight: 3.0, percentage: 22 },
          { name: 'YouTube Shorts', weight: 3.0, percentage: 18 },
          { name: 'Post com Imagem', weight: 1.5, percentage: 15 },
          { name: 'LinkedIn Carrossel', weight: 2.5, percentage: 12 },
          { name: 'Outros', weight: 1.0, percentage: 5 },
        ];
        setUsageByContentType(contentTypeUsage);
      }

      // Generate monthly data (last 6 months) - this could be enhanced with real usage data
      const months = ['Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      setMonthlyCreditData(
        months.map((month, idx) => ({
          month,
          credits: Math.floor(Math.random() * 1500) + 300,
        }))
      );
    } catch (error) {
      console.error('Error loading credits data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getExpirationColor = (expiresAt: string): 'red' | 'magenta' | 'green' => {
    const daysUntilExpiry = Math.ceil((new Date(expiresAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
    if (daysUntilExpiry < 7) return 'red';
    if (daysUntilExpiry < 30) return 'magenta';
    return 'green';
  };

  const getStatusTagType = (status: string) => {
    return status === 'paid' ? 'green' : 'gray';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getPercentageUsed = (used: number, total: number) => {
    return Math.round((used / total) * 100);
  };

  const handleExport = () => {
    console.log('Export credits report...');
  };

  const CircularGauge = ({ used, total }: { used: number; total: number }) => {
    const percentage = (used / total) * 100;
    const circumference = 2 * Math.PI * 45;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="circular-gauge">
        <svg width="120" height="120" viewBox="0 0 120 120">
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--genos-border-subtle)"
            strokeWidth="8"
          />
          <circle
            cx="60"
            cy="60"
            r="45"
            fill="none"
            stroke="var(--genos-primary)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.3s ease' }}
          />
        </svg>
        <div className="circular-gauge__content">
          <span className="circular-gauge__percentage">{Math.round(percentage)}%</span>
          <span className="circular-gauge__label">Utilizado</span>
        </div>
      </div>
    );
  };

  const tableRows = purchases.slice((pageNumber - 1) * pageSize, pageNumber * pageSize).map((purchase) => ({
    id: purchase.id,
    cells: [
      { value: purchase.package_name, key: 'package' },
      { value: purchase.total_credits.toLocaleString('pt-BR'), key: 'total' },
      {
        value: (
          <div className="table-progress-cell">
            <div className="progress-bar-wrapper">
              <ProgressBar value={getPercentageUsed(purchase.credits_used, purchase.total_credits)} label="" hideLabel />
            </div>
            <span className="progress-value">{purchase.credits_used.toLocaleString('pt-BR')}</span>
          </div>
        ),
        key: 'used',
      },
      { value: purchase.credits_remaining.toLocaleString('pt-BR'), key: 'remaining' },
      {
        value: <Tag type={getStatusTagType(purchase.status)}>{purchase.status === 'paid' ? 'Pago' : 'Pendente'}</Tag>,
        key: 'status',
      },
      {
        value: <Tag type={getExpirationColor(purchase.expires_at)}>{formatDate(purchase.expires_at)}</Tag>,
        key: 'expires',
      },
      {
        value: (
          <Button kind="ghost" size="sm" renderIcon={ArrowRight} hasIconOnly iconDescription="Detalhes" />
        ),
        key: 'actions',
      },
    ],
  }));

  return (
    <>
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title-group">
            <h1>Créditos</h1>
            <p>Gerencie o consumo de créditos dos seus clientes</p>
          </div>
          <div className="page-header__actions">
            <Button kind="primary" renderIcon={Download} onClick={handleExport}>
              Exportar
            </Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state">
          <InlineLoading description="Carregando dados de créditos..." />
        </div>
      ) : creditSummary && creditSummary.total > 0 ? (
        <>
          {/* Hero Stats Section */}
          <div className="hero-stats">
            <div className="hero-stat">
              <div className="hero-stat__header">
                <Money size={24} />
                <span className="hero-stat__label">Créditos Totais</span>
              </div>
              <div className="hero-stat__body">
                <CircularGauge used={creditSummary.used} total={creditSummary.total} />
                <div className="hero-stat__info">
                  <span className="hero-stat__value">{creditSummary.total.toLocaleString('pt-BR')}</span>
                  <span className="hero-stat__sublabel">Pacotes ativos</span>
                </div>
              </div>
            </div>

            <div className="hero-stat">
              <div className="hero-stat__header">
                <ArrowUp size={24} />
                <span className="hero-stat__label">Créditos Consumidos</span>
              </div>
              <div className="hero-stat__body">
                <div className="progress-bar-large">
                  <ProgressBar value={creditSummary.percentUsed} label="" hideLabel />
                </div>
                <div className="hero-stat__info">
                  <span className="hero-stat__value">{creditSummary.used.toLocaleString('pt-BR')}</span>
                  <span className="hero-stat__sublabel">{creditSummary.percentUsed}% de utilização</span>
                </div>
              </div>
            </div>

            <div className="hero-stat">
              <div className="hero-stat__header">
                <ArrowDown size={24} />
                <span className="hero-stat__label">Créditos Restantes</span>
              </div>
              <div className="hero-stat__body">
                <div className={`credit-indicator credit-indicator--${creditSummary.remaining / creditSummary.total > 0.5 ? 'high' : creditSummary.remaining / creditSummary.total > 0.25 ? 'medium' : 'low'}`}>
                  <span className="credit-indicator__icon">
                    {creditSummary.remaining / creditSummary.total > 0.5 ? (
                      <Checkmark size={32} />
                    ) : creditSummary.remaining / creditSummary.total > 0.25 ? (
                      <Time size={32} />
                    ) : (
                      <Close size={32} />
                    )}
                  </span>
                </div>
                <div className="hero-stat__info">
                  <span className="hero-stat__value">{creditSummary.remaining.toLocaleString('pt-BR')}</span>
                  <span className="hero-stat__sublabel">
                    {creditSummary.remaining / creditSummary.total > 0.5
                      ? 'Excelente'
                      : creditSummary.remaining / creditSummary.total > 0.25
                        ? 'Atenção'
                        : 'Crítico'}
                  </span>
                </div>
              </div>
            </div>

            <div className="hero-stat">
              <div className="hero-stat__header">
                <Time size={24} />
                <span className="hero-stat__label">Dias para Expirar</span>
              </div>
              <div className="hero-stat__body">
                <div className="days-countdown">
                  <span className="days-countdown__number">{creditSummary.daysUntilExpiry || 0}</span>
                  <span className="days-countdown__label">dias</span>
                </div>
                <div className="hero-stat__info">
                  <span className="hero-stat__sublabel">
                    {creditSummary.expiresAt ? `Até ${formatDate(creditSummary.expiresAt)}` : 'Sem data de expiração'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="charts-section">
            <div className="chart-card chart-card--donut">
              <div className="chart-card__header">
                <h3>Uso de Créditos por Tipo</h3>
              </div>
              <div className="chart-card__body">
                <div className="donut-chart">
                  <svg width="200" height="200" viewBox="0 0 200 200">
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#0f62fe" strokeWidth="20" strokeDasharray="275 360" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#0043ce" strokeWidth="20" strokeDasharray="110 360" strokeDashoffset="-275" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#006fbe" strokeWidth="20" strokeDasharray="55 360" strokeDashoffset="-385" />
                    <circle cx="100" cy="100" r="70" fill="none" stroke="#00b8e6" strokeWidth="20" strokeDasharray="30 360" strokeDashoffset="-440" />
                  </svg>
                  <div className="donut-chart__legend">
                    {usageByContentType.map((item, idx) => (
                      <div key={idx} className="legend-item">
                        <span className={`legend-item__dot legend-item__dot--${idx}`}></span>
                        <span className="legend-item__text">{item.name}</span>
                        <span className="legend-item__percentage">{item.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="chart-card chart-card--bar">
              <div className="chart-card__header">
                <h3>Consumo Mensal</h3>
              </div>
              <div className="chart-card__body">
                <div className="bar-chart">
                  {monthlyCreditData.map((data, idx) => {
                    const maxCredits = Math.max(...monthlyCreditData.map((d) => d.credits));
                    const height = (data.credits / maxCredits) * 100;
                    return (
                      <div key={idx} className="bar-chart__item">
                        <div className="bar-chart__bar" style={{ height: `${height}%` }} title={`${data.credits} créditos`}>
                          <span className="bar-chart__value">{data.credits}</span>
                        </div>
                        <span className="bar-chart__label">{data.month}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Purchases Table */}
          <div className="table-section">
            <div className="table-section__header">
              <h2>Histórico de Compras</h2>
            </div>
            {purchases.length > 0 ? (
              <>
                <DataTable
                  rows={tableRows}
                  headers={[
                    { key: 'package', header: 'Pacote' },
                    { key: 'total', header: 'Créditos Total' },
                    { key: 'used', header: 'Usados' },
                    { key: 'remaining', header: 'Restantes' },
                    { key: 'status', header: 'Status' },
                    { key: 'expires', header: 'Expira Em' },
                    { key: 'actions', header: 'Ações' },
                  ]}
                >
                  {({ rows, headers, getHeaderProps, getRowProps, getTableProps }) => (
                    <table {...getTableProps()}>
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
                        {rows.map((row) => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </table>
                  )}
                </DataTable>
                <Pagination
                  backwardText="Anterior"
                  forwardText="Próxima"
                  itemsPerPageText="Itens por página:"
                  pageNumberText="Página"
                  pageSize={pageSize}
                  pageSizes={[5, 10, 20]}
                  totalItems={purchases.length}
                  onChange={({ page, pageSize }: { page: number; pageSize: number }) => {
                    setPageNumber(page);
                    setPageSize(pageSize);
                  }}
                />
              </>
            ) : (
              <Tile className="empty-state__tile">
                <p>Nenhuma compra encontrada</p>
              </Tile>
            )}
          </div>

          {/* Content Type Credit Weights */}
          <div className="content-types-section">
            <div className="content-types-section__header">
              <h2>Pesos de Crédito por Tipo de Conteúdo</h2>
              <p>Cada tipo de conteúdo consome uma quantidade diferente de créditos</p>
            </div>
            <div className="content-types-grid">
              {CONTENT_TYPE_WEIGHTS.map((type) => (
                <div key={type.slug} className="content-type-card">
                  <div className="content-type-card__header">
                    <span className="content-type-card__name">{type.name}</span>
                  </div>
                  <div className="content-type-card__body">
                    <div className="content-type-card__weight">{type.weight}</div>
                    <span className="content-type-card__label">créditos</span>
                  </div>
                  <div className="content-type-card__footer">
                    <span className={`complexity-badge complexity-badge--${type.complexity.toLowerCase()}`}>
                      {type.complexity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <Tile className="empty-state__tile">
            <h2>Nenhum pacote ativo</h2>
            <p>Você não possui pacotes de créditos ativos no momento. Adquira um pacote para começar a usar os serviços.</p>
            <Button kind="primary" onClick={handleExport}>
              Ver Histórico de Compras
            </Button>
          </Tile>
        </div>
      )}
    </>
  );
}
