'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
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
  TableToolbarSearch,
  Tag,
  ProgressBar,
  Button,
} from '@carbon/react';
import { UserFollow, SendAlt, Checkmark, InProgress } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface OnboardingClient {
  id: string;
  clientName: string;
  currentStep: string;
  progress: number;
  startedDate: string;
  assignedAgent: string;
}

const onboardingClients: OnboardingClient[] = [
  { id: '1', clientName: 'Nova Biotech', currentStep: 'Brand Discovery', progress: 25, startedDate: '2026-02-12', assignedAgent: 'Sarah Chen' },
  { id: '2', clientName: 'Orion SaaS', currentStep: 'Content Audit', progress: 50, startedDate: '2026-02-08', assignedAgent: 'Marcus Rivera' },
  { id: '3', clientName: 'Pinnacle Realty', currentStep: 'Strategy Setup', progress: 75, startedDate: '2026-01-29', assignedAgent: 'Aisha Patel' },
  { id: '4', clientName: 'Quartz Automotive', currentStep: 'Account Setup', progress: 10, startedDate: '2026-02-17', assignedAgent: 'James O\'Brien' },
  { id: '5', clientName: 'Redwood Hospitality', currentStep: 'First Content Batch', progress: 90, startedDate: '2026-01-20', assignedAgent: 'Sarah Chen' },
  { id: '6', clientName: 'Summit Athletics', currentStep: 'Brand Discovery', progress: 30, startedDate: '2026-02-10', assignedAgent: 'Marcus Rivera' },
  { id: '7', clientName: 'Tidewater Shipping', currentStep: 'Content Audit', progress: 45, startedDate: '2026-02-05', assignedAgent: 'Aisha Patel' },
  { id: '8', clientName: 'Ultraviolet Studios', currentStep: 'Strategy Setup', progress: 65, startedDate: '2026-02-01', assignedAgent: 'James O\'Brien' },
];

const stepColor: Record<string, 'blue' | 'cyan' | 'teal' | 'purple' | 'green'> = {
  'Account Setup': 'blue',
  'Brand Discovery': 'cyan',
  'Content Audit': 'teal',
  'Strategy Setup': 'purple',
  'First Content Batch': 'green',
};

const headers = [
  { key: 'clientName', header: 'Client Name' },
  { key: 'currentStep', header: 'Current Step' },
  { key: 'progress', header: 'Progress' },
  { key: 'startedDate', header: 'Started' },
  { key: 'assignedAgent', header: 'Assigned Agent' },
  { key: 'actions', header: '' },
];

export default function OnboardingPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = onboardingClients.filter((client) =>
    client.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.assignedAgent.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rows = filteredClients.map((client) => ({
    id: client.id,
    clientName: client.clientName,
    currentStep: client.currentStep,
    progress: client.progress,
    startedDate: client.startedDate,
    assignedAgent: client.assignedAgent,
    actions: '',
  }));

  const completedCount = onboardingClients.filter(c => c.progress >= 90).length;
  const avgProgress = Math.round(onboardingClients.reduce((sum, c) => sum + c.progress, 0) / onboardingClients.length);

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <UserFollow size={24} />
          {t('Onboarding Tracker')}
        </h1>
        <p style={{ color: 'var(--cds-text-secondary)', marginTop: '0.25rem' }}>
          {t('Track client onboarding progress and milestones')}
        </p>
      </div>

      {/* Summary Stats */}
      <Grid style={{ marginBottom: '2rem', marginTop: '1.5rem' }}>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <InProgress size={20} style={{ color: 'var(--cds-link-primary)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('In Progress')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{onboardingClients.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <Checkmark size={20} style={{ color: 'var(--cds-support-success)', marginBottom: '0.5rem' }} />
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Near Completion')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{completedCount}</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Avg Progress')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{avgProgress}%</p>
          </Tile>
        </Column>
        <Column lg={4} md={2} sm={4}>
          <Tile style={{ textAlign: 'center', padding: '1.5rem' }}>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', marginBottom: '0.25rem' }}>
              {t('Agents Assigned')}
            </p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>
              {new Set(onboardingClients.map(c => c.assignedAgent)).size}
            </p>
          </Tile>
        </Column>
      </Grid>

      {/* DataTable */}
      <DataTable rows={rows} headers={headers}>
        {({
          rows: tableRows,
          headers: tableHeaders,
          getTableProps,
          getHeaderProps,
          getRowProps,
          getToolbarProps,
        }: any) => (
          <TableContainer title={t('Onboarding Clients')} description={`${filteredClients.length} clients in onboarding`}>
            <TableToolbar {...getToolbarProps()}>
              <TableToolbarContent>
                <TableToolbarSearch
                  onChange={(e: any) => setSearchTerm(e?.target?.value || '')}
                  placeholder={t('Search clients or agents...')}
                  persistent
                />
              </TableToolbarContent>
            </TableToolbar>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {tableHeaders.map((header: (typeof headers)[number]) => (
                    <TableHeader {...getHeaderProps({ header })} key={header.key}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {(tableRows as unknown as { id: string; cells: { id: string; info: { header: string }; value: string | number }[] }[]).map((row) => (
                  <TableRow key={row.id} {...getRowProps({ row } as unknown as { row: (typeof rows)[number] })}>
                    {row.cells.map((cell) => {
                      if (cell.info.header === 'currentStep') {
                        return (
                          <TableCell key={cell.id}>
                            <Tag type={stepColor[cell.value as string] || 'gray'} size="sm">
                              {cell.value}
                            </Tag>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === 'progress') {
                        const val = cell.value as number;
                        return (
                          <TableCell key={cell.id}>
                            <div style={{ minWidth: '120px' }}>
                              <ProgressBar
                                label={`${val}%`}
                                value={val}
                                size="small"
                              />
                            </div>
                          </TableCell>
                        );
                      }
                      if (cell.info.header === '') {
                        return (
                          <TableCell key={cell.id}>
                            <Button
                              kind="ghost"
                              size="sm"
                              renderIcon={SendAlt}
                              iconDescription={t('Send Reminder')}
                              hasIconOnly
                              tooltipPosition="left"
                            />
                          </TableCell>
                        );
                      }
                      return <TableCell key={cell.id}>{cell.value}</TableCell>;
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
}
