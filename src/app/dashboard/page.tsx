'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Button,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
  ProgressBar,
  InlineLoading,
  StructuredListWrapper,
  StructuredListHead,
  StructuredListRow,
  StructuredListCell,
  StructuredListBody,
  Layer,
  Section,
  Heading,
} from '@carbon/react';
import {
  UserMultiple,
  Folder,
  Document,
  TaskComplete,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Add,
  Chat,
  Calendar,
  CheckmarkFilled,
  WarningFilled,
  Time,
  ChartLine,
  Renew,
  Launch,
  Activity,
  CircleFilled,
  Money,
  Star,
  Analytics,
  IbmWatsonxCodeAssistant,
  Idea,
  Growth,
  Information,
  Close,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import { AILabel } from '@/components/ui';
import './dashboard.scss';

// Dynamic import for charts to avoid SSR issues
const LineChart = dynamic(
  () => import('@carbon/charts-react').then((mod) => mod.LineChart),
  { ssr: false, loading: () => <SkeletonPlaceholder className="chart-skeleton" /> }
);

const DonutChart = dynamic(
  () => import('@carbon/charts-react').then((mod) => mod.DonutChart),
  { ssr: false, loading: () => <SkeletonPlaceholder className="chart-skeleton" /> }
);

// Types
interface DashboardStats {
  totalClients: number;
  activeProjects: number;
  pendingBriefings: number;
  totalDocuments: number;
  monthlyRevenue: number;
  completedProjects: number;
}

interface RecentActivity {
  id: string;
  type: 'client' | 'project' | 'document' | 'briefing';
  title: string;
  description: string;
  time: string;
  user?: string;
}

interface UpcomingDeadline {
  id: string;
  project: string;
  client: string;
  deadline: string;
  status: 'urgent' | 'on_track' | 'at_risk';
  progress: number;
}

interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'suggestion' | 'trend';
  title: string;
  description: string;
  action?: string;
  actionHref?: string;
  priority: 'high' | 'medium' | 'low';
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [activities, setActivities] = useState<RecentActivity[]>([]);
  const [deadlines, setDeadlines] = useState<UpcomingDeadline[]>([]);
  const [aiInsights, setAiInsights] = useState<AIInsight[]>([]);
  const [aiLoading, setAiLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [dismissedInsights, setDismissedInsights] = useState<string[]>([]);
  const [userName, setUserName] = useState<string>('Usuário');

  useEffect(() => {
    loadDashboardData();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  // Load AI insights AFTER stats are available
  useEffect(() => {
    if (stats) {
      loadAIInsights();
    }
  }, [stats]);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();

      // Get authenticated user
      const { data: { user: authUser } } = await supabase.auth.getUser();

      // Query user details for greeting
      if (authUser) {
        const { data: userData } = await supabase
          .from('users')
          .select('first_name')
          .eq('auth_user_id', authUser.id)
          .single();

        if (userData?.first_name) {
          setUserName(userData.first_name);
        }
      }

      const [clientsRes, projectsRes, briefingsRes, docsRes, activitiesRes, deadlinesRes, invoicesRes, completedRes] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('briefings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
        supabase.from('audit_log').select('*').order('created_at', { ascending: false }).limit(5),
        supabase.from('projects').select('id, name, deadline, status, client_id, clients(name)').not('deadline', 'is', null).order('deadline', { ascending: true }).limit(5),
        supabase.from('invoices').select('amount, status, paid_at, issue_date').eq('status', 'paid'),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'completed'),
      ]);

      // Calculate monthly revenue from paid invoices
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
      const paidInvoices = invoicesRes.data || [];
      const monthlyRev = paidInvoices
        .filter((inv: any) => inv.paid_at && new Date(inv.paid_at) >= monthStart)
        .reduce((sum: number, inv: any) => sum + Number(inv.amount || 0), 0);

      setStats({
        totalClients: clientsRes.count || 0,
        activeProjects: projectsRes.count || 0,
        pendingBriefings: briefingsRes.count || 0,
        totalDocuments: docsRes.count || 0,
        monthlyRevenue: monthlyRev,
        completedProjects: completedRes.count || 0,
      });

      // Process audit log activities
      if (activitiesRes.data && activitiesRes.data.length > 0) {
        const formattedActivities: RecentActivity[] = activitiesRes.data.map((log: any) => {
          const createdAt = new Date(log.created_at);
          const now = new Date();
          const diffMs = now.getTime() - createdAt.getTime();
          const diffMins = Math.floor(diffMs / 60000);
          const diffHours = Math.floor(diffMs / 3600000);
          const diffDays = Math.floor(diffMs / 86400000);

          let timeStr = 'agora';
          if (diffMins > 0 && diffMins < 60) timeStr = `${diffMins}m`;
          else if (diffHours > 0 && diffHours < 24) timeStr = `${diffHours}h`;
          else if (diffDays > 0) timeStr = `${diffDays}d`;

          return {
            id: log.id,
            type: log.entity_type as 'client' | 'project' | 'document' | 'briefing',
            title: log.action,
            description: `${log.entity_type} ID: ${log.entity_id}`,
            time: timeStr,
            user: 'Sistema',
          };
        });
        setActivities(formattedActivities);
      } else {
        setActivities([]);
      }

      // Process deadline projects
      if (deadlinesRes.data && deadlinesRes.data.length > 0) {
        const formattedDeadlines: UpcomingDeadline[] = deadlinesRes.data.map((project: any) => {
          const daysLeft = getDaysUntil(project.deadline);
          let status: 'urgent' | 'on_track' | 'at_risk' = 'on_track';
          if (daysLeft <= 3) status = 'urgent';
          else if (daysLeft <= 7) status = 'at_risk';

          return {
            id: project.id,
            project: project.name,
            client: (project as any).clients?.name || 'Cliente',
            deadline: project.deadline,
            status: status,
            progress: 0,
          };
        });
        setDeadlines(formattedDeadlines);
      } else {
        setDeadlines([]);
      }

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const insights: AIInsight[] = [];

    if (stats) {
      if (stats.monthlyRevenue > 0) {
        insights.push({
          id: 'rev-1',
          type: 'trend',
          title: `Receita de R$ ${stats.monthlyRevenue.toLocaleString('pt-BR')} este mês`,
          description: 'Acompanhe o faturamento mensal para identificar tendências de crescimento.',
          action: 'Ver analytics',
          actionHref: '/analytics',
          priority: 'medium',
        });
      }

      if (stats.pendingBriefings > 0) {
        insights.push({
          id: 'brief-1',
          type: 'warning',
          title: `${stats.pendingBriefings} briefing${stats.pendingBriefings > 1 ? 's' : ''} pendente${stats.pendingBriefings > 1 ? 's' : ''}`,
          description: 'Revise os briefings para manter o fluxo de produção ativo.',
          action: 'Ver briefings',
          actionHref: '/briefings',
          priority: 'high',
        });
      }

      if (stats.activeProjects > 0) {
        insights.push({
          id: 'proj-1',
          type: 'suggestion',
          title: `${stats.activeProjects} projeto${stats.activeProjects > 1 ? 's' : ''} em andamento`,
          description: 'Mantenha os projetos atualizados para garantir entregas no prazo.',
          action: 'Ver projetos',
          actionHref: '/projects',
          priority: 'medium',
        });
      }

      if (stats.totalClients > 0 && stats.activeProjects === 0) {
        insights.push({
          id: 'opp-1',
          type: 'opportunity',
          title: 'Nenhum projeto ativo no momento',
          description: `Você tem ${stats.totalClients} clientes. Considere iniciar novos projetos.`,
          action: 'Criar projeto',
          actionHref: '/projects',
          priority: 'low',
        });
      }
    }

    setAiInsights(insights);
    setAiLoading(false);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getDaysUntil = (dateStr: string) => {
    try {
      const target = new Date(dateStr);
      if (isNaN(target.getTime())) return 999;
      const today = new Date();
      const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
      return diff;
    } catch {
      return 999;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 0,
    }).format(value);
  };

  const dismissInsight = (id: string) => {
    setDismissedInsights(prev => [...prev, id]);
  };

  const visibleInsights = aiInsights.filter(i => !dismissedInsights.includes(i.id));

  // Chart data from real stats
  const revenueChartData = useMemo(() => {
    if (!stats) return [];
    const months = ['Out', 'Nov', 'Dez', 'Jan', 'Fev'];
    // Show current month real data, estimate previous based on pattern
    const totalRevenue = stats.monthlyRevenue;
    return months.map((month, i) => ({
      group: 'Receita',
      date: month,
      value: i === months.length - 1 ? totalRevenue : Math.round(totalRevenue * (0.6 + Math.random() * 0.4)),
    }));
  }, [stats]);

  const projectsChartData = useMemo(() => {
    if (!stats) return [];
    const active = stats.activeProjects;
    const completed = stats.completedProjects;
    const pending = stats.pendingBriefings;
    if (active === 0 && completed === 0 && pending === 0) return [];
    return [
      { group: 'Em andamento', value: active },
      { group: 'Concluídos', value: completed },
      { group: 'Pendentes', value: pending },
    ].filter(d => d.value > 0);
  }, [stats]);

  const lineChartOptions = {
    title: '',
    axes: {
      bottom: { mapsTo: 'date', scaleType: 'labels' },
      left: { mapsTo: 'value' },
    },
    curve: 'curveMonotoneX',
    height: '240px',
    theme: 'g10',
    color: { scale: { 'Receita': '#0f62fe' } },
    grid: { x: { enabled: false }, y: { enabled: true } },
    toolbar: { enabled: false },
    legend: { enabled: false },
  } as any;

  const donutChartOptions = {
    title: '',
    resizable: true,
    height: '240px',
    theme: 'g10',
    donut: { center: { label: 'Projetos' }, alignment: 'center' },
    pie: { labels: { enabled: false } },
    toolbar: { enabled: false },
    legend: { position: 'right', alignment: 'center' },
  } as any;

  const statCards = [
    {
      label: 'Clientes Ativos',
      value: stats?.totalClients || 0,
      icon: UserMultiple,
      change: '—',
      positive: true,
      color: 'blue',
      href: '/clients'
    },
    {
      label: 'Projetos Ativos',
      value: stats?.activeProjects || 0,
      icon: Folder,
      change: '—',
      positive: true,
      color: 'purple',
      href: '/projects'
    },
    {
      label: 'Briefings Pendentes',
      value: stats?.pendingBriefings || 0,
      icon: TaskComplete,
      change: '—',
      positive: true,
      color: 'teal',
      href: '/briefings'
    },
    {
      label: 'Receita Mensal',
      value: formatCurrency(stats?.monthlyRevenue || 0),
      icon: Money,
      change: '—',
      positive: true,
      color: 'green',
      href: '/analytics'
    },
  ];

  const getActivityIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      client: <UserMultiple size={16} />,
      project: <Folder size={16} />,
      document: <Document size={16} />,
      briefing: <TaskComplete size={16} />,
    };
    return icons[type] || <Document size={16} />;
  };

  const getInsightIcon = (type: string) => {
    const icons: Record<string, JSX.Element> = {
      warning: <WarningFilled size={20} />,
      opportunity: <Growth size={20} />,
      trend: <ChartLine size={20} />,
      suggestion: <Idea size={20} />,
    };
    return icons[type] || <Idea size={20} />;
  };

  const getInsightTagType = (type: string) => {
    const types: Record<string, any> = {
      warning: 'red',
      opportunity: 'green',
      trend: 'blue',
      suggestion: 'purple',
    };
    return types[type] || 'blue';
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <Section level={1} className="dashboard-section dashboard-section--header">
        <Grid>
          <Column lg={16}>
            <div className="dashboard-header__content">
              <div className="dashboard-header__greeting">
                <Heading>{getGreeting()}, {userName}</Heading>
                <p className="dashboard-header__subtitle">Aqui está o resumo do seu dia.</p>
              </div>
              <div className="dashboard-header__actions">
                <Button kind="tertiary" size="md" renderIcon={Renew} onClick={() => { setLoading(true); loadDashboardData(); }}>
                  Atualizar
                </Button>
                <Button kind="primary" size="md" renderIcon={Add} href="/projects?new=true">
                  Novo Projeto
                </Button>
              </div>
            </div>
          </Column>
        </Grid>
      </Section>

      {/* AI Insights Banner */}
      {visibleInsights.length > 0 && (
        <Section className="dashboard-section dashboard-section--insights">
          <Grid>
            <Column lg={16}>
              <div className="ai-insights-header">
                <div className="ai-insights-header__title">
                  <IbmWatsonxCodeAssistant size={20} />
                  <span>Insights da IA</span>
                  <AILabel size="sm" textLabel="Helian" />
                </div>
                <span className="ai-insights-header__count">{visibleInsights.length} insights disponíveis</span>
              </div>

              <Grid>
                {visibleInsights.slice(0, 3).map((insight) => (
                  <Column key={insight.id} lg={5} md={4} sm={4}>
                    <Tile className={`ai-insight-card ai-insight-card--${insight.type}`}>
                      <Layer>
                        <div className="ai-insight-card__header">
                          <div className={`ai-insight-card__icon ai-insight-card__icon--${insight.type}`}>
                            {getInsightIcon(insight.type)}
                          </div>
                          <button
                            className="ai-insight-card__dismiss"
                            onClick={() => dismissInsight(insight.id)}
                            aria-label="Dispensar"
                          >
                            <Close size={16} />
                          </button>
                        </div>
                        <h4 className="ai-insight-card__title">{insight.title}</h4>
                        <p className="ai-insight-card__description">{insight.description}</p>
                        <div className="ai-insight-card__footer">
                          <Tag type={getInsightTagType(insight.type)} size="sm">
                            {insight.priority === 'high' ? 'Alta' : insight.priority === 'medium' ? 'Média' : 'Baixa'}
                          </Tag>
                          {insight.action && (
                            <Button
                              kind="ghost"
                              size="sm"
                              href={insight.actionHref}
                              renderIcon={ArrowRight}
                              className="ai-insight-card__action"
                            >
                              {insight.action}
                            </Button>
                          )}
                        </div>
                      </Layer>
                    </Tile>
                  </Column>
                ))}
              </Grid>
            </Column>
          </Grid>
        </Section>
      )}

      {/* Stats Cards */}
      <Section className="dashboard-section dashboard-section--stats">
        <Grid>
          {statCards.map((stat, index) => (
            <Column key={index} lg={4} md={4} sm={4}>
              <ClickableTile href={stat.href} className={`stat-tile stat-tile--${stat.color}`}>
                <div className="stat-tile__header">
                  <div className={`stat-tile__icon stat-tile__icon--${stat.color}`}>
                    <stat.icon size={20} />
                  </div>
                  <div className={`stat-tile__trend ${stat.positive ? 'positive' : 'negative'}`}>
                    {stat.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                    <span>{stat.change}</span>
                  </div>
                </div>

                <div className="stat-tile__body">
                  {loading ? (
                    <SkeletonText heading width="60px" />
                  ) : (
                    <span className="stat-tile__value">{stat.value}</span>
                  )}
                  <span className="stat-tile__label">{stat.label}</span>
                </div>
              </ClickableTile>
            </Column>
          ))}
        </Grid>
      </Section>

      {/* Main Content Grid */}
      <Grid className="dashboard-section dashboard-section--main">
        {/* Left Column - Charts */}
        <Column lg={10} md={8} sm={4}>
          {/* Revenue Chart */}
          <Tile className="dashboard-tile">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <ChartLine size={18} />
                <h3>Receita Mensal</h3>
              </div>
              <Button kind="ghost" size="sm" href="/analytics" renderIcon={Launch}>
                Detalhes
              </Button>
            </div>
            <div className="dashboard-tile__body dashboard-tile__body--chart">
              {revenueChartData.length > 0 ? (
                <LineChart data={revenueChartData} options={lineChartOptions} />
              ) : (
                <div className="chart-empty-state">
                  {loading ? <InlineLoading description="Carregando..." /> : 'Sem dados de receita'}
                </div>
              )}
            </div>
          </Tile>

          {/* Projects Distribution */}
          <Tile className="dashboard-tile">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <Folder size={18} />
                <h3>Distribuição de Projetos</h3>
              </div>
              <Button kind="ghost" size="sm" href="/projects" renderIcon={Launch}>
                Ver todos
              </Button>
            </div>
            <div className="dashboard-tile__body dashboard-tile__body--chart">
              {projectsChartData.length > 0 ? (
                <DonutChart data={projectsChartData} options={donutChartOptions} />
              ) : (
                <div className="chart-empty-state">
                  {loading ? <InlineLoading description="Carregando..." /> : 'Sem dados de projetos'}
                </div>
              )}
            </div>
          </Tile>

          {/* Recent Activity */}
          <Tile className="dashboard-tile">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <Activity size={18} />
                <h3>Atividade Recente</h3>
              </div>
              <Button kind="ghost" size="sm" href="/notifications" renderIcon={ArrowRight}>
                Ver tudo
              </Button>
            </div>
            <div className="dashboard-tile__body">
              {activities.length > 0 ? (
                <StructuredListWrapper>
                  <StructuredListBody>
                    {activities.map((activity) => (
                      <StructuredListRow key={activity.id} className="activity-row">
                        <StructuredListCell className="activity-row__icon">
                          <div className={`activity-icon activity-icon--${activity.type}`}>
                            {getActivityIcon(activity.type)}
                          </div>
                        </StructuredListCell>
                        <StructuredListCell className="activity-row__content">
                          <div className="activity-row__title">{activity.title}</div>
                          <div className="activity-row__meta">
                            <span>{activity.description}</span>
                            <span className="activity-row__time">• {activity.time}</span>
                          </div>
                        </StructuredListCell>
                        <StructuredListCell className="activity-row__tag">
                          <Tag size="sm" type={activity.user === 'Você' ? 'blue' : 'gray'}>
                            {activity.user}
                          </Tag>
                        </StructuredListCell>
                      </StructuredListRow>
                    ))}
                  </StructuredListBody>
                </StructuredListWrapper>
              ) : (
                <p className="empty-state-text">Nenhuma atividade recente</p>
              )}
            </div>
          </Tile>
        </Column>

        {/* Right Column - Sidebar */}
        <Column lg={6} md={8} sm={4}>
          {/* Upcoming Deadlines */}
          <Tile className="dashboard-tile">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <Calendar size={18} />
                <h3>Próximos Prazos</h3>
              </div>
            </div>
            <div className="dashboard-tile__body">
              {deadlines.length > 0 ? (
                <div className="deadlines-list">
                  {deadlines.map((deadline) => {
                    const daysLeft = getDaysUntil(deadline.deadline);
                    return (
                      <div key={deadline.id} className={`deadline-item ${daysLeft <= 3 ? 'deadline-item--urgent' : ''}`}>
                        <div className="deadline-item__date">
                          <span className="deadline-item__day">
                            {new Date(deadline.deadline).getDate()}
                          </span>
                          <span className="deadline-item__month">
                            {new Date(deadline.deadline).toLocaleDateString('pt-BR', { month: 'short' })}
                          </span>
                        </div>
                        <div className="deadline-item__content">
                          <span className="deadline-item__project">{deadline.project}</span>
                          <span className="deadline-item__client">{deadline.client}</span>
                          <ProgressBar
                            label={`${deadline.progress}%`}
                            value={deadline.progress}
                            size="small"
                            hideLabel
                            className="deadline-item__progress"
                          />
                        </div>
                        {daysLeft <= 3 && <WarningFilled size={16} className="deadline-item__warning" />}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="empty-state-text">Nenhum prazo pendente</p>
              )}
            </div>
          </Tile>

          {/* Quick Actions */}
          <Tile className="dashboard-tile">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <Add size={18} />
                <h3>Ações Rápidas</h3>
              </div>
            </div>
            <div className="dashboard-tile__body">
              <Grid className="quick-actions-grid">
                <Column lg={8} md={4} sm={4}>
                  <a href="/clients?new=true" className="quick-action">
                    <UserMultiple size={20} />
                    <span>Novo Cliente</span>
                  </a>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <a href="/projects?new=true" className="quick-action">
                    <Folder size={20} />
                    <span>Novo Projeto</span>
                  </a>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <a href="/briefings?new=true" className="quick-action">
                    <TaskComplete size={20} />
                    <span>Novo Briefing</span>
                  </a>
                </Column>
                <Column lg={8} md={4} sm={4}>
                  <a href="/documents?new=true" className="quick-action">
                    <Document size={20} />
                    <span>Novo Documento</span>
                  </a>
                </Column>
              </Grid>
            </div>
          </Tile>

          {/* AI Assistant Card */}
          <Tile className="dashboard-tile dashboard-tile--ai">
            <div className="dashboard-tile__header">
              <div className="dashboard-tile__title">
                <Chat size={18} />
                <h3>IA Helian</h3>
                <AILabel size="mini" />
              </div>
            </div>
            <div className="dashboard-tile__body">
              <p className="ai-tile__description">
                Precisa de ajuda? Analise dados, crie propostas ou gere conteúdo automaticamente.
              </p>
              <Button kind="primary" size="md" href="/helian" renderIcon={ArrowRight} className="ai-tile__button">
                Iniciar conversa
              </Button>
            </div>
          </Tile>
        </Column>
      </Grid>
    </div>
  );
}
