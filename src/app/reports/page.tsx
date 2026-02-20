'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n/context';
import {
  Grid,
  Column,
  Tile,
  Button,
  DatePicker,
  DatePickerInput,
  Select,
  SelectItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  Tag,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import {
  Download,
  DocumentPdf,
  ChartLine,
  ChartBar,
  Filter,
  Calendar,
} from '@carbon/icons-react';
import { SimpleBarChart, LineChart } from '@carbon/charts-react';
import { ScaleTypes } from '@carbon/charts';


const mockReportData = [
  { id: '1', period: 'Janeiro 2025', clients: 12, projects: 8, revenue: 'R$ 45.000', status: 'completed' },
  { id: '2', period: 'Fevereiro 2025', clients: 15, projects: 10, revenue: 'R$ 52.000', status: 'completed' },
  { id: '3', period: 'Março 2025', clients: 18, projects: 12, revenue: 'R$ 68.000', status: 'pending' },
];

const barChartData = [
  { group: 'Janeiro', value: 45000 },
  { group: 'Fevereiro', value: 52000 },
  { group: 'Março', value: 68000 },
  { group: 'Abril', value: 61000 },
  { group: 'Maio', value: 73000 },
  { group: 'Junho', value: 82000 },
];


export default function ReportsPage() {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('monthly');

  const headers = [
    { key: 'period', header: t('reports.period') },
    { key: 'clients', header: t('reports.clients') },
    { key: 'projects', header: t('reports.projects') },
    { key: 'revenue', header: t('reports.revenueCol') },
    { key: 'status', header: t('reports.status') },
    { key: 'actions', header: t('reports.actions') },
  ];

  const barChartOptions = {
    title: t('reports.monthlyRevenue'),
    axes: {
      bottom: {
        mapsTo: 'group',
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        mapsTo: 'value',
      },
    },
    height: '300px',
  };

  const lineChartData = [
    { group: t('reports.revenue'), date: 'Jan', value: 45000 },
    { group: t('reports.revenue'), date: 'Fev', value: 52000 },
    { group: t('reports.revenue'), date: 'Mar', value: 68000 },
    { group: t('reports.revenue'), date: 'Abr', value: 61000 },
    { group: t('reports.revenue'), date: 'Mai', value: 73000 },
    { group: t('reports.revenue'), date: 'Jun', value: 82000 },
    { group: t('reports.expenses'), date: 'Jan', value: 32000 },
    { group: t('reports.expenses'), date: 'Fev', value: 35000 },
    { group: t('reports.expenses'), date: 'Mar', value: 41000 },
    { group: t('reports.expenses'), date: 'Abr', value: 38000 },
    { group: t('reports.expenses'), date: 'Mai', value: 44000 },
    { group: t('reports.expenses'), date: 'Jun', value: 47000 },
  ];

  const lineChartOptions = {
    title: t('reports.financialTrend'),
    axes: {
      bottom: {
        mapsTo: 'date',
        scaleType: ScaleTypes.LABELS,
      },
      left: {
        mapsTo: 'value',
      },
    },
    curve: 'curveMonotoneX' as const,
    height: '300px',
  };

  const rows = mockReportData.map(item => ({
    ...item,
    status: (
      <Tag type={item.status === 'completed' ? 'green' : 'blue'} size="sm">
        {item.status === 'completed' ? t('reports.completed') : t('reports.inProgress')}
      </Tag>
    ),
    actions: (
      <Button kind="ghost" size="sm" hasIconOnly iconDescription={t('common.downloadPdf')} renderIcon={DocumentPdf} />
    ),
  }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <div className="page-header">
          <h1>{t('reports.title')}</h1>
          <p>{t('reports.subtitle')}</p>
        </div>
      </Column>

      {/* Filtros */}
      <Column lg={16} md={8} sm={4}>
        <Tile className="cds--mb-05">
          <Grid narrow>
            <Column lg={4} md={2} sm={4}>
              <Select
                id="report-type"
                labelText={t('reports.reportType')}
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <SelectItem value="monthly" text={t('reports.monthly')} />
                <SelectItem value="quarterly" text={t('reports.quarterly')} />
                <SelectItem value="yearly" text={t('reports.yearly')} />
                <SelectItem value="custom" text={t('reports.custom')} />
              </Select>
            </Column>
            <Column lg={4} md={2} sm={4}>
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="start-date"
                  labelText={t('reports.startDate')}
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </Column>
            <Column lg={4} md={2} sm={4}>
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="end-date"
                  labelText={t('reports.endDate')}
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </Column>
            <Column lg={4} md={2} sm={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button renderIcon={Filter}>{t('common.filter')}</Button>
            </Column>
          </Grid>
        </Tile>
      </Column>

      {/* Tabs de Relatórios */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label={t('reports.reportType')}>
            <Tab renderIcon={ChartBar}>{t('reports.overview')}</Tab>
            <Tab renderIcon={ChartLine}>{t('reports.financial')}</Tab>
            <Tab renderIcon={Calendar}>{t('reports.projectsTab')}</Tab>
          </TabList>
          <TabPanels>
            {/* Visão Geral */}
            <TabPanel>
              <Grid className="cds--mt-05">
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">{t('reports.totalClients')}</span>
                    <div className="stat-value">45</div>
                    <span className="stat-change positive">+12% {t('reports.vsPreviousMonth')}</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">{t('reports.activeProjects')}</span>
                    <div className="stat-value">28</div>
                    <span className="stat-change positive">+8% {t('reports.vsPreviousMonth')}</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">{t('reports.totalRevenue')}</span>
                    <div className="stat-value">R$ 165k</div>
                    <span className="stat-change positive">+15% {t('reports.vsPreviousMonth')}</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">{t('reports.conversionRate')}</span>
                    <div className="stat-value">68%</div>
                    <span className="stat-change negative">-3% {t('reports.vsPreviousMonth')}</span>
                  </Tile>
                </Column>
              </Grid>

              <Tile className="cds--mt-05">
                <SimpleBarChart
                  data={barChartData}
                  options={barChartOptions}
                />
              </Tile>
            </TabPanel>

            {/* Financeiro */}
            <TabPanel>
              <Tile className="cds--mt-05">
                <LineChart
                  data={lineChartData}
                  options={lineChartOptions}
                />
              </Tile>
            </TabPanel>

            {/* Projetos */}
            <TabPanel>
              <DataTable rows={rows} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <TableContainer className="cds--mt-05">
                    <TableToolbar>
                      <TableToolbarContent>
                        <Button renderIcon={Download} kind="primary">
                          {t('reports.exportReport')}
                        </Button>
                      </TableToolbarContent>
                    </TableToolbar>
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
                        {rows.map((row) => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map((cell) => (
                              <TableCell key={cell.id}>{cell.value}</TableCell>
                            ))}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                )}
              </DataTable>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
