'use client';

import { useEffect, useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
  Dropdown,
  DatePicker,
  DatePickerInput,
  InlineLoading,
  ProgressBar,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  ChartLine,
  ChartBar,
  ChartPie,
  ArrowUp,
  ArrowDown,
  ArrowRight,
  Calendar,
  Money,
  UserMultiple,
  Folder,
  Document,
  CheckmarkFilled,
  Time,
  Download,
  Filter,
  Renew,
  Analytics as AnalyticsIcon,
  Growth,
  Report,
  Dashboard,
} from '@carbon/icons-react';
import { createClient } from '@/lib/supabase/client';
import Header from '@/components/layout/Header';
import './analytics.scss';

interface AnalyticsData {
  revenue: { current: number; previous: number; change: number };
  clients: { total: number; new: number; active: number };
  projects: { total: number; completed: number; inProgress: number };
  conversion: { rate: number; leads: number; converted: number };
}

interface ChartData {
  month: string;
  revenue: number;
  projects: number;
}

interface ProjectTypeData {
  type: string;
  count: number;
  revenue: number;
  percentage: number;
}

interface TopClient {
  id: string;
  name: string;
  company: string;
  revenue: number;
  projects: number;
}

const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [projectTypes, setProjectTypes] = useState<ProjectTypeData[]>([]);
  const [topClients, setTopClients] = useState<TopClient[]>([]);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    setLoading(true);
    try {
      const supabase = createClient();
      
      const [clientsRes, projectsRes] = await Promise.all([
        supabase.from('clients').select('*'),
        supabase.from('projects').select('*'),
      ]);

      const clients = clientsRes.data || [];
      const projects = projectsRes.data || [];

      // Calculate analytics
      const activeClients = clients.filter(c => c.status === 'active').length;
      const completedProjects = projects.filter(p => p.status === 'completed').length;
      const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;

      setAnalytics({
        revenue: { current: 45000, previous: 38000, change: 18.4 },
        clients: { total: clients.length, new: 3, active: activeClients },
        projects: { total: projects.length, completed: completedProjects, inProgress: inProgressProjects },
        conversion: { rate: 68, leads: 25, converted: 17 },
      });

      // Mock chart data
      setChartData([
        { month: 'Jul', revenue: 28000, projects: 4 },
        { month: 'Ago', revenue: 32000, projects: 5 },
        { month: 'Set', revenue: 35000, projects: 4 },
        { month: 'Out', revenue: 38000, projects: 6 },
        { month: 'Nov', revenue: 42000, projects: 5 },
        { month: 'Dez', revenue: 45000, projects: 7 },
      ]);

      // Mock project types
      setProjectTypes([
        { type: 'Branding', count: 12, revenue: 156000, percentage: 35 },
        { type: 'Website', count: 8, revenue: 120000, percentage: 27 },
        { type: 'Social Media', count: 15, revenue: 89000, percentage: 20 },
        { type: 'Design Gráfico', count: 10, revenue: 45000, percentage: 10 },
        { type: 'Outros', count: 5, revenue: 35000, percentage: 8 },
      ]);

      // Mock top clients
      setTopClients([
        { id: '1', name: 'Carlos Silva', company: 'Tech Corp', revenue: 45000, projects: 5 },
        { id: '2', name: 'Maria Santos', company: 'Startup Inc', revenue: 38000, projects: 4 },
        { id: '3', name: 'João Lima', company: 'Fashion Co', revenue: 32000, projects: 6 },
        { id: '4', name: 'Ana Costa', company: 'Nova Corp', revenue: 28000, projects: 3 },
        { id: '5', name: 'Pedro Oliveira', company: 'Digital Co', revenue: 22000, projects: 4 },
      ]);

    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getChangeIndicator = (change: number) => {
    const isPositive = change >= 0;
    return (
      <span className={`change-indicator ${isPositive ? 'positive' : 'negative'}`}>
        {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
        {Math.abs(change).toFixed(1)}%
      </span>
    );
  };

  const maxRevenue = Math.max(...chartData.map(d => d.revenue));

  return (
    <>
      <Header />
      
      <div className="page-header">
        <div className="page-header__content">
          <div className="page-header__title-group">
            <h1>Analytics</h1>
            <p>Acompanhe o desempenho do seu negócio</p>
          </div>
          <div className="page-header__actions">
            <Dropdown<{ id: string; text: string }>
              id="period-select"
              titleText=""
              label="Período"
              items={[
                { id: 'week', text: 'Esta semana' },
                { id: 'month', text: 'Este mês' },
                { id: 'quarter', text: 'Este trimestre' },
                { id: 'year', text: 'Este ano' },
              ]}
              itemToString={(item) => item?.text || ''}
              onChange={({ selectedItem }) => setPeriod(selectedItem?.id || 'month')}
              initialSelectedItem={{ id: 'month', text: 'Este mês' }}
              size="md"
            />
            <Button kind="tertiary" renderIcon={Download}>Exportar Relatório</Button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading-state"><InlineLoading description="Carregando analytics..." /></div>
      ) : analytics && (
        <>
          {/* KPI Cards */}
          <div className="kpi-grid">
            <div className="kpi-card kpi-card--primary">
              <div className="kpi-card__icon"><Money size={24} /></div>
              <div className="kpi-card__content">
                <span className="kpi-card__label">Receita do Período</span>
                <span className="kpi-card__value">{formatCurrency(analytics.revenue.current)}</span>
                <div className="kpi-card__footer">
                  {getChangeIndicator(analytics.revenue.change)}
                  <span>vs. período anterior</span>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-card__icon"><UserMultiple size={24} /></div>
              <div className="kpi-card__content">
                <span className="kpi-card__label">Clientes Ativos</span>
                <span className="kpi-card__value">{analytics.clients.active}</span>
                <div className="kpi-card__footer">
                  <Tag type="green" size="sm">+{analytics.clients.new} novos</Tag>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-card__icon"><Folder size={24} /></div>
              <div className="kpi-card__content">
                <span className="kpi-card__label">Projetos</span>
                <span className="kpi-card__value">{analytics.projects.total}</span>
                <div className="kpi-card__footer">
                  <span>{analytics.projects.completed} concluídos</span>
                  <span className="kpi-card__separator">•</span>
                  <span>{analytics.projects.inProgress} em andamento</span>
                </div>
              </div>
            </div>
            
            <div className="kpi-card">
              <div className="kpi-card__icon"><Growth size={24} /></div>
              <div className="kpi-card__content">
                <span className="kpi-card__label">Taxa de Conversão</span>
                <span className="kpi-card__value">{analytics.conversion.rate}%</span>
                <div className="kpi-card__footer">
                  <span>{analytics.conversion.converted} de {analytics.conversion.leads} leads</span>
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          <div className="analytics-grid">
            {/* Revenue Chart */}
            <div className="analytics-card analytics-card--wide">
              <div className="analytics-card__header">
                <h3><ChartLine size={18} /> Receita Mensal</h3>
                <Button kind="ghost" size="sm" renderIcon={Renew}>Atualizar</Button>
              </div>
              <div className="analytics-card__body">
                <div className="simple-chart">
                  <div className="chart-bars">
                    {chartData.map((data, index) => (
                      <div key={index} className="chart-bar-container">
                        <div 
                          className="chart-bar" 
                          style={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                          title={formatCurrency(data.revenue)}
                        >
                          <span className="chart-bar__value">{formatCurrency(data.revenue)}</span>
                        </div>
                        <span className="chart-bar__label">{data.month}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Project Types */}
            <div className="analytics-card">
              <div className="analytics-card__header">
                <h3><ChartPie size={18} /> Tipos de Projeto</h3>
              </div>
              <div className="analytics-card__body">
                <div className="project-types-list">
                  {projectTypes.map((type, index) => (
                    <div key={index} className="project-type-item">
                      <div className="project-type-item__header">
                        <span className="project-type-item__name">{type.type}</span>
                        <span className="project-type-item__count">{type.count} projetos</span>
                      </div>
                      <div className="project-type-item__bar">
                        <ProgressBar value={type.percentage} label={type.type} hideLabel size="small" />
                        <span className="project-type-item__percentage">{type.percentage}%</span>
                      </div>
                      <span className="project-type-item__revenue">{formatCurrency(type.revenue)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Clients */}
            <div className="analytics-card">
              <div className="analytics-card__header">
                <h3><UserMultiple size={18} /> Top Clientes por Receita</h3>
                <Button kind="ghost" size="sm" href="/clients" renderIcon={ArrowRight}>Ver todos</Button>
              </div>
              <div className="analytics-card__body">
                <div className="top-clients-list">
                  {topClients.map((client, index) => (
                    <div key={client.id} className="top-client-row">
                      <div className="top-client-row__rank">#{index + 1}</div>
                      <div className="top-client-row__avatar">{client.name.charAt(0)}</div>
                      <div className="top-client-row__info">
                        <span className="top-client-row__company">{client.company}</span>
                        <span className="top-client-row__projects">{client.projects} projetos</span>
                      </div>
                      <div className="top-client-row__revenue">{formatCurrency(client.revenue)}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent Activity / Performance */}
            <div className="analytics-card">
              <div className="analytics-card__header">
                <h3><Dashboard size={18} /> Performance</h3>
              </div>
              <div className="analytics-card__body">
                <div className="performance-metrics">
                  <div className="performance-metric">
                    <div className="performance-metric__header">
                      <span>Ticket Médio</span>
                      <span className="performance-metric__value">{formatCurrency(5625)}</span>
                    </div>
                    <ProgressBar value={75} label="Ticket Médio" hideLabel size="small" />
                    <span className="performance-metric__target">Meta: {formatCurrency(7500)}</span>
                  </div>
                  
                  <div className="performance-metric">
                    <div className="performance-metric__header">
                      <span>Tempo Médio de Entrega</span>
                      <span className="performance-metric__value">12 dias</span>
                    </div>
                    <ProgressBar value={80} label="Tempo Médio" hideLabel size="small" status="finished" />
                    <span className="performance-metric__target">Meta: 15 dias</span>
                  </div>
                  
                  <div className="performance-metric">
                    <div className="performance-metric__header">
                      <span>Satisfação do Cliente</span>
                      <span className="performance-metric__value">94%</span>
                    </div>
                    <ProgressBar value={94} label="Satisfação" hideLabel size="small" status="finished" />
                    <span className="performance-metric__target">Meta: 90%</span>
                  </div>
                  
                  <div className="performance-metric">
                    <div className="performance-metric__header">
                      <span>Taxa de Retrabalho</span>
                      <span className="performance-metric__value">8%</span>
                    </div>
                    <ProgressBar value={8} label="Retrabalho" hideLabel size="small" status="error" />
                    <span className="performance-metric__target">Meta: &lt;10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="summary-section">
            <h2>Resumo do Período</h2>
            <div className="summary-grid">
              <div className="summary-card">
                <div className="summary-card__icon"><CheckmarkFilled size={32} /></div>
                <div className="summary-card__content">
                  <span className="summary-card__value">7</span>
                  <span className="summary-card__label">Projetos Entregues</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card__icon"><Document size={32} /></div>
                <div className="summary-card__content">
                  <span className="summary-card__value">23</span>
                  <span className="summary-card__label">Propostas Enviadas</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card__icon"><UserMultiple size={32} /></div>
                <div className="summary-card__content">
                  <span className="summary-card__value">3</span>
                  <span className="summary-card__label">Novos Clientes</span>
                </div>
              </div>
              <div className="summary-card">
                <div className="summary-card__icon"><Time size={32} /></div>
                <div className="summary-card__content">
                  <span className="summary-card__value">156h</span>
                  <span className="summary-card__label">Horas Trabalhadas</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
