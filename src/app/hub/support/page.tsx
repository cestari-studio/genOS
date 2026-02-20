'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Button,
  Section,
  Heading,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
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
  Accordion,
  AccordionItem,
} from '@carbon/react';
import { Add } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Ticket {
  id: string;
  ticketId: string;
  subject: string;
  priority: string;
  status: string;
  created: string;
}

const tickets: Ticket[] = [
  {
    id: '1',
    ticketId: 'TK-1042',
    subject: 'Unable to export campaign report as PDF',
    priority: 'high',
    status: 'open',
    created: '2026-02-18',
  },
  {
    id: '2',
    ticketId: 'TK-1038',
    subject: 'Integration sync failing with Shopify',
    priority: 'high',
    status: 'in-progress',
    created: '2026-02-16',
  },
  {
    id: '3',
    ticketId: 'TK-1035',
    subject: 'Request for custom brand template',
    priority: 'medium',
    status: 'in-progress',
    created: '2026-02-14',
  },
  {
    id: '4',
    ticketId: 'TK-1029',
    subject: 'Billing discrepancy on January invoice',
    priority: 'medium',
    status: 'resolved',
    created: '2026-02-10',
  },
  {
    id: '5',
    ticketId: 'TK-1024',
    subject: 'How to add team members with SSO',
    priority: 'low',
    status: 'resolved',
    created: '2026-02-05',
  },
  {
    id: '6',
    ticketId: 'TK-1018',
    subject: 'Feature request: Dark mode for dashboards',
    priority: 'low',
    status: 'open',
    created: '2026-01-28',
  },
];

const headers = [
  { key: 'ticketId', header: 'ID' },
  { key: 'subject', header: 'Subject' },
  { key: 'priority', header: 'Priority' },
  { key: 'status', header: 'Status' },
  { key: 'created', header: 'Created' },
];

const priorityTagType: Record<string, 'red' | 'blue' | 'cool-gray'> = {
  high: 'red',
  medium: 'blue',
  low: 'cool-gray',
};

const statusTagType: Record<string, 'red' | 'blue' | 'green'> = {
  open: 'red',
  'in-progress': 'blue',
  resolved: 'green',
};

const faqItems = [
  {
    title: 'How do I reset my password?',
    content:
      'Navigate to Account Settings > Security and click "Change Password." Enter your current password and then your new password. If you have forgotten your current password, use the "Forgot Password" link on the login page to receive a reset email.',
  },
  {
    title: 'How do I add a new team member?',
    content:
      'Go to Hub > Team Management and click "Invite Member." Enter the team member\'s email address and select their role (Admin, Editor, or Viewer). They will receive an invitation email with instructions to join your workspace.',
  },
  {
    title: 'What is the token usage limit?',
    content:
      'Token limits depend on your plan tier. The Starter plan includes 25K tokens/month, the Growth plan includes 50K tokens/month, and the Scale plan includes 100K tokens/month. You can view your current usage in Hub > Billing.',
  },
  {
    title: 'How do I connect a third-party integration?',
    content:
      'Visit Hub > Integrations and find the service you want to connect. Click "Configure" on the integration tile and follow the authentication flow. Most integrations use OAuth 2.0, so you will be redirected to the service provider to authorize access.',
  },
  {
    title: 'Can I export my brand DNA configuration?',
    content:
      'Yes. Go to Hub > DNA Editor and use the export function available in each tab. You can export your configuration as a JSON file for backup purposes or for importing into another workspace.',
  },
  {
    title: 'How do I upgrade or downgrade my plan?',
    content:
      'Navigate to Hub > Billing and click on "Current Plan." You will see available plan options with feature comparisons. Plan changes take effect at the start of your next billing cycle. Downgrades may result in reduced feature access.',
  },
  {
    title: 'What file formats are supported for document uploads?',
    content:
      'The Document Vault supports PDF, DOCX, XLSX, PPTX, PNG, JPG, SVG, and CSV files. The maximum file size is 50MB per upload. For larger files, contact support for assistance with bulk uploads.',
  },
];

export default function SupportCenterPage() {
  const { t } = useTranslation();

  const rows = tickets.map((ticket) => ({
    id: ticket.id,
    ticketId: ticket.ticketId,
    subject: ticket.subject,
    priority: ticket.priority,
    status: ticket.status,
    created: ticket.created,
  }));

  return (
    <Grid fullWidth>
      <Column lg={16} md={8} sm={4}>
        <Section level={1}>
          <Heading style={{ marginBottom: '1.5rem' }}>
            {t('Support Center')}
          </Heading>
        </Section>
      </Column>

      <Column lg={16} md={8} sm={4}>
        <Tabs>
          <TabList aria-label="Support tabs">
            <Tab>{t('Tickets')}</Tab>
            <Tab>{t('Knowledge Base')}</Tab>
          </TabList>
          <TabPanels>
            {/* Tickets Tab */}
            <TabPanel>
              <div style={{ marginTop: '1.5rem' }}>
                <DataTable rows={rows} headers={headers}>
                  {({
                    rows: tableRows,
                    headers: tableHeaders,
                    getTableProps,
                    getHeaderProps,
                    getRowProps,
                  }: {
                    rows: any[];
                    headers: any[];
                    getTableProps: () => any;
                    getHeaderProps: (args: { header: any }) => any;
                    getRowProps: (args: { row: any }) => any;
                  }) => (
                    <TableContainer title={t('Support Tickets')}>
                      <TableToolbar>
                        <TableToolbarContent>
                          <Button renderIcon={Add} size="sm">
                            {t('Create Ticket')}
                          </Button>
                        </TableToolbarContent>
                      </TableToolbar>
                      <Table {...getTableProps()}>
                        <TableHead>
                          <TableRow>
                            {tableHeaders.map((header: any) => {
                              const headerProps = getHeaderProps({ header });
                              return (
                                <TableHeader key={header.key} {...headerProps}>
                                  {header.header}
                                </TableHeader>
                              );
                            })}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {tableRows.map((row: any) => {
                            const rowProps = getRowProps({ row });
                            return (
                              <TableRow key={row.id} {...rowProps}>
                                {row.cells.map((cell: any) => {
                                  if (cell.info.header === 'priority') {
                                    return (
                                      <TableCell key={cell.id}>
                                        <Tag
                                          type={
                                            priorityTagType[cell.value] ||
                                            'gray'
                                          }
                                          size="sm"
                                        >
                                          {cell.value.charAt(0).toUpperCase() +
                                            cell.value.slice(1)}
                                        </Tag>
                                      </TableCell>
                                    );
                                  }
                                  if (cell.info.header === 'status') {
                                    const label = cell.value
                                      .split('-')
                                      .map(
                                        (w: string) =>
                                          w.charAt(0).toUpperCase() + w.slice(1)
                                      )
                                      .join(' ');
                                    return (
                                      <TableCell key={cell.id}>
                                        <Tag
                                          type={
                                            statusTagType[cell.value] || 'gray'
                                          }
                                          size="sm"
                                        >
                                          {label}
                                        </Tag>
                                      </TableCell>
                                    );
                                  }
                                  return (
                                    <TableCell key={cell.id}>
                                      {cell.value}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  )}
                </DataTable>
              </div>
            </TabPanel>

            {/* Knowledge Base Tab */}
            <TabPanel>
              <div style={{ marginTop: '1.5rem' }}>
                <h4 style={{ marginBottom: '1rem' }}>
                  {t('Frequently Asked Questions')}
                </h4>
                <Accordion>
                  {faqItems.map((faq, index) => (
                    <AccordionItem key={index} title={t(faq.title)}>
                      <p>{t(faq.content)}</p>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Column>
    </Grid>
  );
}
