'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Accordion,
  AccordionItem,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@carbon/react';
import { Book, ArrowRight, Api, Catalog } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const apiEndpoints = [
  { id: '1', method: 'GET', path: '/api/clients', description: 'List all clients for current organization' },
  { id: '2', method: 'POST', path: '/api/clients', description: 'Create a new client' },
  { id: '3', method: 'GET', path: '/api/content', description: 'List content items with filtering' },
  { id: '4', method: 'POST', path: '/api/content', description: 'Create new content item' },
  { id: '5', method: 'PUT', path: '/api/content/:id', description: 'Update existing content item' },
  { id: '6', method: 'GET', path: '/api/brands', description: 'List brand profiles' },
  { id: '7', method: 'POST', path: '/api/ai/generate', description: 'Generate AI content (uses token economy)' },
  { id: '8', method: 'GET', path: '/api/geo/metrics', description: 'Fetch GEO intelligence metrics' },
  { id: '9', method: 'GET', path: '/api/billing/usage', description: 'Get token usage and billing info' },
  { id: '10', method: 'POST', path: '/api/ai/feedback', description: 'Submit AI generation feedback' },
];

const apiHeaders = [
  { key: 'method', header: 'Method' },
  { key: 'path', header: 'Endpoint' },
  { key: 'description', header: 'Description' },
];

const guides = [
  { title: 'Getting Started with genOS', desc: 'Set up your first brand, create content, and publish.', tag: 'Beginner' },
  { title: 'Brand DNA Configuration', desc: 'Configure voice, visuals, and strategy for AI alignment.', tag: 'Setup' },
  { title: 'Multi-Agent AI Orchestration', desc: 'How genOS coordinates Claude, Gemini, and Granite.', tag: 'Advanced' },
  { title: 'GEO Intelligence Guide', desc: 'Optimize content for AI-powered search engines.', tag: 'Strategy' },
  { title: 'Token Economy Explained', desc: 'Understand token allocation, usage, and cost management.', tag: 'FinOps' },
  { title: 'Social Hub Integration', desc: 'Connect platforms and manage social media at scale.', tag: 'Integration' },
];

const changelog = [
  { version: 'v4.5.0', date: '2026-02-15', changes: 'Quantum Content Optimization, Multi-Agent Orchestration, AI Lab, FinOps Dashboard, 100+ pages.' },
  { version: 'v4.4.0', date: '2026-01-10', changes: 'GEO Intelligence Hub, Social Media Manager, Influencer Network.' },
  { version: 'v4.3.0', date: '2025-12-01', changes: 'Content Factory Matrix View, Brand DNA Editor, Version Control.' },
  { version: 'v4.2.0', date: '2025-10-15', changes: 'Agency Dashboard, Token Economy, Billing & Invoices.' },
];

const methodColors: Record<string, 'green' | 'blue' | 'purple' | 'red'> = {
  GET: 'green',
  POST: 'blue',
  PUT: 'purple',
  DELETE: 'red',
};

export default function DocsPage() {
  const { t } = useTranslation();

  const rows = apiEndpoints.map(e => ({ ...e }));

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Book size={20} />
          <h1 style={{ margin: 0 }}>Documentation</h1>
        </div>
        <p>genOS v4.5.0 — Guides, API Reference, and Changelog</p>
      </div>

      <Tabs>
        <TabList aria-label="Documentation sections">
          <Tab>Getting Started</Tab>
          <Tab>API Reference</Tab>
          <Tab>Guides</Tab>
          <Tab>Changelog</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <div style={{ marginTop: '1rem' }}><Accordion>
              <AccordionItem title="1. Create Your Account">
                <p>Sign up at <code>/login</code> with your email. You&apos;ll receive a verification email to activate your account.</p>
              </AccordionItem>
              <AccordionItem title="2. Set Up Your Organization">
                <p>During onboarding, configure your organization name, industry, and preferred language (EN/PT-BR).</p>
              </AccordionItem>
              <AccordionItem title="3. Configure Brand DNA">
                <p>Navigate to <code>/hub/dna-editor</code> to set your brand voice, visual identity, and content strategy pillars.</p>
              </AccordionItem>
              <AccordionItem title="4. Create Your First Content">
                <p>Go to <code>/content/new/edit</code> to create content. Use AI generation to write, optimize, and schedule posts.</p>
              </AccordionItem>
              <AccordionItem title="5. Connect Social Platforms">
                <p>Visit <code>/hub/integrations</code> to connect Instagram, LinkedIn, Twitter, and other platforms for publishing.</p>
              </AccordionItem>
              <AccordionItem title="6. Monitor Performance">
                <p>Use <code>/analytics</code> and <code>/geo</code> to track content performance and GEO visibility scores.</p>
              </AccordionItem>
            </Accordion></div>
          </TabPanel>
          <TabPanel>
            <Tile style={{ padding: 0, marginTop: '1rem' }}>
              <div style={{ padding: '1rem' }}>
                <h3>REST API Endpoints</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Base URL: <code>https://api.genos.cestari.studio/v1</code></p>
              </div>
              <DataTable rows={rows} headers={apiHeaders}>
                {({ rows, headers, getTableProps, getHeaderProps, getRowProps }) => (
                  <Table {...getTableProps()}>
                    <TableHead>
                      <TableRow>
                        {headers.map((h) => <TableHeader {...getHeaderProps({ header: h })} key={h.key}>{h.header}</TableHeader>)}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {rows.map((row) => {
                        const ep = apiEndpoints.find(e => e.id === row.id)!;
                        return (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            <TableCell><Tag type={methodColors[ep.method]} size="sm">{ep.method}</Tag></TableCell>
                            <TableCell><code style={{ fontSize: '0.8125rem' }}>{ep.path}</code></TableCell>
                            <TableCell>{ep.description}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
              </DataTable>
            </Tile>
          </TabPanel>
          <TabPanel>
            <Grid style={{ marginTop: '1rem' }}>
              {guides.map((guide) => (
                <Column key={guide.title} lg={5} md={4} sm={4}>
                  <ClickableTile href="#" style={{ marginBottom: '1rem', minHeight: '140px' }}>
                    <Tag type="blue" size="sm" style={{ marginBottom: '0.75rem' }}>{guide.tag}</Tag>
                    <h4 style={{ margin: '0 0 0.5rem', fontWeight: 600 }}>{guide.title}</h4>
                    <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{guide.desc}</p>
                  </ClickableTile>
                </Column>
              ))}
            </Grid>
          </TabPanel>
          <TabPanel>
            <div style={{ marginTop: '1rem' }}>
              {changelog.map((entry) => (
                <Tile key={entry.version} style={{ marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                    <Tag type="blue" size="sm">{entry.version}</Tag>
                    <span style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{entry.date}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', margin: 0 }}>{entry.changes}</p>
                </Tile>
              ))}
            </div>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
