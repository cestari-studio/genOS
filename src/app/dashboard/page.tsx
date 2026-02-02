'use client';

import { useEffect, useState, useMemo } from 'react';
import dynamic from 'next/dynamic';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  SkeletonText,
  SkeletonPlaceholder,
  ProgressBar,
  InlineLoading,
  IconButton,
  Tooltip,
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

  useEffect(() => {
    loadDashboardData();
    loadAIInsights();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const loadDashboardData = async () => {
    try {
      const supabase = createClient();
      
      const [clientsRes, projectsRes, briefingsRes, docsRes] = await Promise.all([
        supabase.from('clients').select('id', { count: 'exact', head: true }),
        supabase.from('projects').select('id', { count: 'exact', head: true }).eq('status', 'in_progress'),
        supabase.from('briefings').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('documents').select('id', { count: 'exact', head: true }),
      ]);

      setStats({
        totalClients: clientsRes.count || 12,
        activeProjects: projectsRes.count || 8,
        pendingBriefings: briefingsRes.count || 5,
        totalDocuments: docsRes.count || 47,
        monthlyRevenue: 45000,
        completedProjects: 12,
      });

      setActivities([
        { id: '1', type: 'client', title: 'Novo cliente cadastrado', description: 'Acme Corporation adicionada ao sistema', time: '5 min', user: 'Você' },
        { id: '2', type: 'project', title: 'Projeto finalizado', description: 'Rebranding Tech Corp entregue', time: '15 min', user: 'Você' },
        { id: '3', type: 'briefing', title: 'Briefing recebido', description: 'Campanha Q1 - Startup Inc', time: '1h', user: 'Cliente' },
        { id: '4', type: 'document', title: 'Contrato assinado', description: 'Fashion Co - Proposta aprovada', time: '2h', user: 'Cliente' },
        { id: '5', type: 'project', title: 'Novo projeto iniciado', description: 'Social Media Kit - Nova Corp', time: '3h', user: 'Você' },
      ]);

      setDeadlines([
        { id: '1', project: 'Website Redesign', client: 'Tech Corp', deadline: '2025-02-05', status: 'urgent', progress: 75 },
        { id: '2', project: 'Brand Guidelines', client: 'Startup Inc', deadline: '2025-02-10', status: 'on_track', progress: 45 },
        { id: '3', project: 'Social Media Kit', client: 'Fashion Co', deadline: '2025-02-15', status: 'on_track', progress: 20 },
        { id: '4', project: 'App UI Design', client: 'Nova Corp', deadline: '2025-02-20', status: 'at_risk', progress: 10 },
      ]);

    } catch (error) {
      console.error('Error loading dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAIInsights = async () => {
    // Simulate AI analysis delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setAiInsights([
      {
        id: 'ai-1',
        type: 'warning',
        title: 'Prazo crítico detectado',
        description: 'O projeto "Website Redesign" está 3 dias atrasado. Considere realocar recursos ou renegociar prazo com o cliente.',
        action: 'Ver projeto',
        actionHref: '/projects',
        priority: 'high',
      },
      {
        id: 'ai-2',
        type: 'opportunity',
        title: 'Oportunidade de upsell',
        description: 'Tech Corp completou 5 projetos. Histórico indica 73% de chance de aceitar proposta de manutenção mensal.',
        action: 'Criar proposta',
        actionHref: '/clients',
        priority: 'medium',
      },
      {
        id: 'ai-3',
        type: 'trend',
        title: 'Tendência positiva',
        description: 'Receita aumentou 23% em relação ao mês anterior. Projetos de branding representam 60% do faturamento.',
        priority: 'low',
      },
      {
        id: 'ai-4',
        type: 'suggestion',
        title: 'Otimização de processo',
        description: 'Briefings de "Social Media" levam 40% mais tempo que a média. Considere criar template específico.',
        action: 'Criar template',
        actionHref: '/briefings?new=template',
        priority: 'medium',
      },
    ]);
    
    setAiLoading(false);
  };

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  const getDaysUntil = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date();
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
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

  // Chart data
  const revenueChartData = useMemo(() => [
    { group: 'Receita', date: 'Set', value: 32000 },
    { group: 'Receita', date: 'Out', value: 38000 },
    { group: 'Receita', date: 'Nov', value: 35000 },
    { group: 'Receita', date: 'Dez', value: 42000 },
    { group: 'Receita', date: 'Jan', value: 45000 },
    { group: 'Receita', date: 'Fev', value: 48000 },
  ], []);

  const projectsChartData = useMemo(() => [
    { group: 'Branding', value: 35 },
    { group: 'Web Design', value: 25 },
    { group: 'Social Media', value: 20 },
    { group: 'UI/UX', value: 15 },
    { group: 'Outros', value: 5 },
  ], []);

  const lineChartOptions = {
    title: '',
    axes: {
      bottom: { mapsTo: 'date', scaleType: 'labels' },
      left: { mapsTo: 'value' },
    },
    curve: 'curveMonotoneX',
    height: '240px',
    theme: 'g100',
    color: { scale: { 'Receita': '#0f62fe' } },
    grid: { x: { enabled: false }, y: { enabled: true } },
    toolbar: { enabled: false },
    legend: { enabled: false },
  } as any;

  const donutChartOptions = {
    title: '',
    resizable: true,
    height: '240px',
    theme: 'g100',
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
      change: '+12%',
      positive: true,
      color: 'blue',
      href: '/clients'
    },
    { 
      label: 'Projetos Ativos', 
      value: stats?.activeProjects || 0, 
      icon: Folder,
      change: '+5%',
      positive: true,
      color: 'purple',
      href: '/projects'
    },
    { 
      label: 'Briefings Pendentes', 
      value: stats?.pendingBriefings || 0, 
      icon: TaskComplete,
      change: '-2',
      positive: true,
      color: 'teal',
      href: '/briefings'
    },
    { 
      label: 'Receita Mensal', 
      value: formatCurrency(stats?.monthlyRevenue || 0), 
      icon: Money,
      change: '+23%',
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

  const getInsightColor = (type: string) => {
    const colors: Record<string, string> = {
      warning: 'danger',
      opportunity: 'success',
      trend: 'info',
      suggestion: 'purple',
    };
    return colors[type] || 'info';
  };

  return (
    <div className="dashboard-page">
      {/* Page Header */}
      <div className="dashboard-header">
        <div className="dashboard-header__content">
          <div className="dashboard-header__greeting">
            <h1>{getGreeting()}, Octavio</h1>
            <p>Aqui está o resumo do seu dia.</p>
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
      </div>

      {/* AI Insights Banner */}
      {visibleInsights.length > 0 && (
        <div className="ai-insights-section">
          <div className="ai-insights-header">
            <div className="ai-insights-header__title">
              <IbmWatsonxCodeAssistant size={20} />
              <span>Insights da IA</span>
              <AILabel size="sm" textLabel="Helian" />
            </div>
            <span className="ai-insights-header__count">{visibleInsights.length} insights disponíveis</span>
          </div>
          
          <div className="ai-insights-grid">
            {visibleInsights.slice(0, 3).map((insight) => (
              <div key={insight.id} className={`ai-insight-card ai-insight-card--${getInsightColor(insight.type)}`}>
                <div className="ai-insight-card__header">
                  <div className={`ai-insight-card__icon ai-insight-card__icon--${getInsightColor(insight.type)}`}>
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
            ))}
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <a key={index} href={stat.href} className={`stat-card stat-card--${stat.color}`}>
            <div className="stat-card__header">
              <div className="stat-card__icon">
                <stat.icon size={20} />
              </div>
              <div className={`stat-card__trend ${stat.positive ? 'positive' : 'negative'}`}>
                {stat.positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
                <span>{stat.change}</span>
              </div>
            </div>
            
            <div className="stat-card__body">
              {loading ? (
                <SkeletonText heading width="60px" />
              ) : (
                <span className="stat-card__value">{stat.value}</span>
              )}
              <span className="stat-card__label">{stat.label}</span>
            </div>
            
            <div className="stat-card__footer">
              <span>vs. mês anterior</span>
              <ArrowRight size={14} />
            </div>
          </a>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="dashboard-grid">
        {/* Left Column - Charts */}
        <div className="dashboard-grid__main">
          {/* Revenue Chart */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <ChartLine size={18} />
                <h3>Receita Mensal</h3>
              </div>
              <Button kind="ghost" size="sm" href="/analytics" renderIcon={Launch}>
                Detalhes
              </Button>
            </div>
            <div className="dashboard-card__body dashboard-card__body--chart">
              <LineChart data={revenueChartData} options={lineChartOptions} />
            </div>
          </div>

          {/* Projects Distribution */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <Folder size={18} />
                <h3>Distribuição de Projetos</h3>
              </div>
              <Button kind="ghost" size="sm" href="/projects" renderIcon={Launch}>
                Ver todos
              </Button>
            </div>
            <div className="dashboard-card__body dashboard-card__body--chart">
              <DonutChart data={projectsChartData} options={donutChartOptions} />
            </div>
          </div>

          {/* Recent Activity */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <Activity size={18} />
                <h3>Atividade Recente</h3>
              </div>
              <Button kind="ghost" size="sm" href="/notifications" renderIcon={ArrowRight}>
                Ver tudo
              </Button>
            </div>
            <div className="dashboard-card__body">
              <div className="activity-timeline">
                {activities.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className={`activity-item__icon activity-item__icon--${activity.type}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="activity-item__content">
                      <div className="activity-item__title">{activity.title}</div>
                      <div className="activity-item__meta">
                        <span>{activity.description}</span>
                        <span className="activity-item__time">• {activity.time}</span>
                      </div>
                    </div>
                    <Tag size="sm" type={activity.user === 'Você' ? 'blue' : 'gray'}>
                      {activity.user}
                    </Tag>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="dashboard-grid__sidebar">
          {/* Upcoming Deadlines */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <Calendar size={18} />
                <h3>Próximos Prazos</h3>
              </div>
            </div>
            <div className="dashboard-card__body">
              <div className="deadlines-list">
                {deadlines.map((deadline) => {
                  const daysLeft = getDaysUntil(deadline.deadline);
                  return (
                    <div key={deadline.id} className="deadline-item">
                      <div className={`deadline-item__date ${daysLeft <= 3 ? 'urgent' : ''}`}>
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
            </div>
          </div>

          {/* Quick Actions */}
          <div className="dashboard-card">
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <Add size={18} />
                <h3>Ações Rápidas</h3>
              </div>
            </div>
            <div className="dashboard-card__body">
              <div className="quick-actions">
                <a href="/clients?new=true" className="quick-action">
                  <UserMultiple size={20} />
                  <span>Novo Cliente</span>
                </a>
                <a href="/projects?new=true" className="quick-action">
                  <Folder size={20} />
                  <span>Novo Projeto</span>
                </a>
                <a href="/briefings?new=true" className="quick-action">
                  <TaskComplete size={20} />
                  <span>Novo Briefing</span>
                </a>
                <a href="/documents?new=true" className="quick-action">
                  <Document size={20} />
                  <span>Novo Documento</span>
                </a>
              </div>
            </div>
          </div>

          {/* AI Assistant Card */}
          <div className="dashboard-card dashboard-card--ai">
            <div className="dashboard-card__ai-glow"></div>
            <div className="dashboard-card__header">
              <div className="dashboard-card__title">
                <Chat size={18} />
                <h3>IA Helian</h3>
                <AILabel size="mini" />
              </div>
            </div>
            <div className="dashboard-card__body">
              <p className="ai-card__description">
                Precisa de ajuda? Analise dados, crie propostas ou gere conteúdo automaticamente.
              </p>
              <Button kind="primary" size="md" href="/helian" renderIcon={ArrowRight} className="ai-card__button">
                Iniciar conversa
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
