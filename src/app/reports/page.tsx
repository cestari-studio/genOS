'use client';

import { useState } from 'react';
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

// TODO: Integrar com @carbon/charts-react para gráficos reais

const mockReportData = [
  { id: '1', period: 'Janeiro 2025', clients: 12, projects: 8, revenue: 'R$ 45.000', status: 'completed' },
  { id: '2', period: 'Fevereiro 2025', clients: 15, projects: 10, revenue: 'R$ 52.000', status: 'completed' },
  { id: '3', period: 'Março 2025', clients: 18, projects: 12, revenue: 'R$ 68.000', status: 'pending' },
];

const headers = [
  { key: 'period', header: 'Período' },
  { key: 'clients', header: 'Clientes' },
  { key: 'projects', header: 'Projetos' },
  { key: 'revenue', header: 'Receita' },
  { key: 'status', header: 'Status' },
  { key: 'actions', header: 'Ações' },
];

export default function ReportsPage() {
  const [reportType, setReportType] = useState('monthly');

  const rows = mockReportData.map(item => ({
    ...item,
    status: (
      <Tag type={item.status === 'completed' ? 'green' : 'blue'} size="sm">
        {item.status === 'completed' ? 'Concluído' : 'Em andamento'}
      </Tag>
    ),
    actions: (
      <Button kind="ghost" size="sm" hasIconOnly iconDescription="Download PDF" renderIcon={DocumentPdf} />
    ),
  }));

  return (
    <Grid>
      <Column lg={16} md={8} sm={4}>
        <div className="page-header">
          <h1>Relatórios</h1>
          <p>Exporte e visualize relatórios do sistema</p>
        </div>
      </Column>

      {/* Filtros */}
      <Column lg={16} md={8} sm={4}>
        <Tile style={{ marginBottom: '1rem' }}>
          <Grid narrow>
            <Column lg={4} md={2} sm={4}>
              <Select
                id="report-type"
                labelText="Tipo de Relatório"
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
              >
                <SelectItem value="monthly" text="Mensal" />
                <SelectItem value="quarterly" text="Trimestral" />
                <SelectItem value="yearly" text="Anual" />
                <SelectItem value="custom" text="Personalizado" />
              </Select>
            </Column>
            <Column lg={4} md={2} sm={4}>
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="start-date"
                  labelText="Data Início"
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </Column>
            <Column lg={4} md={2} sm={4}>
              <DatePicker datePickerType="single">
                <DatePickerInput
                  id="end-date"
                  labelText="Data Fim"
                  placeholder="dd/mm/yyyy"
                />
              </DatePicker>
            </Column>
            <Column lg={4} md={2} sm={4} style={{ display: 'flex', alignItems: 'flex-end' }}>
              <Button renderIcon={Filter}>Filtrar</Button>
            </Column>
          </Grid>
        </Tile>
      </Column>

      {/* Tabs de Relatórios */}
      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Tipos de relatório">
            <Tab renderIcon={ChartBar}>Visão Geral</Tab>
            <Tab renderIcon={ChartLine}>Financeiro</Tab>
            <Tab renderIcon={Calendar}>Projetos</Tab>
          </TabList>
          <TabPanels>
            {/* Visão Geral */}
            <TabPanel>
              <Grid style={{ marginTop: '1rem' }}>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">Total Clientes</span>
                    <div className="stat-value">45</div>
                    <span className="stat-change positive">+12% vs mês anterior</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">Projetos Ativos</span>
                    <div className="stat-value">28</div>
                    <span className="stat-change positive">+8% vs mês anterior</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">Receita Total</span>
                    <div className="stat-value">R$ 165k</div>
                    <span className="stat-change positive">+15% vs mês anterior</span>
                  </Tile>
                </Column>
                <Column lg={4} md={2} sm={4}>
                  <Tile className="stat-card">
                    <span className="stat-label">Taxa de Conversão</span>
                    <div className="stat-value">68%</div>
                    <span className="stat-change negative">-3% vs mês anterior</span>
                  </Tile>
                </Column>
              </Grid>

              {/* Placeholder para gráfico */}
              <Tile style={{ marginTop: '1rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#8d8d8d' }}>
                  <ChartBar size={48} style={{ marginBottom: '1rem' }} />
                  <p>Gráfico de Visão Geral</p>
                  <p style={{ fontSize: '0.75rem' }}>Integrar @carbon/charts-react</p>
                </div>
              </Tile>
            </TabPanel>

            {/* Financeiro */}
            <TabPanel>
              <Tile style={{ marginTop: '1rem', height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#8d8d8d' }}>
                  <ChartLine size={48} style={{ marginBottom: '1rem' }} />
                  <p>Gráfico Financeiro</p>
                  <p style={{ fontSize: '0.75rem' }}>Receitas vs Despesas</p>
                </div>
              </Tile>
            </TabPanel>

            {/* Projetos */}
            <TabPanel>
              <DataTable rows={rows} headers={headers}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <TableContainer style={{ marginTop: '1rem' }}>
                    <TableToolbar>
                      <TableToolbarContent>
                        <Button renderIcon={Download} kind="primary">
                          Exportar Relatório
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
