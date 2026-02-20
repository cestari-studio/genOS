'use client';

import React, { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Select,
  SelectItem,
  TextArea,
  Button,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Tag,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  AILabel,
  AILabelContent,
} from '@carbon/react';
import { WatsonHealthAiResults, Copy, Reset } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Template {
  id: string;
  title: string;
  description: string;
  type: string;
  color: string;
}

const templates: Template[] = [
  {
    id: '1',
    title: 'Product Launch Announcement',
    description: 'A compelling announcement template for new product launches with features highlight and CTA.',
    type: 'Blog Post',
    color: '#0f62fe',
  },
  {
    id: '2',
    title: 'Social Proof Carousel',
    description: 'Multi-slide social post featuring customer testimonials and star ratings.',
    type: 'Social Media',
    color: '#8a3ffc',
  },
  {
    id: '3',
    title: 'Welcome Email Series',
    description: 'Three-part onboarding email sequence for new subscribers with personalization tokens.',
    type: 'Email',
    color: '#24a148',
  },
  {
    id: '4',
    title: 'Retargeting Ad Set',
    description: 'High-converting ad copy variants for retargeting campaigns with urgency triggers.',
    type: 'Ad Copy',
    color: '#da1e28',
  },
  {
    id: '5',
    title: 'Thought Leadership Article',
    description: 'Long-form article template with SEO structure, expert quotes, and data citations.',
    type: 'Blog Post',
    color: '#007d79',
  },
  {
    id: '6',
    title: 'Flash Sale Stories',
    description: 'Time-limited offer content for Instagram/Facebook stories with countdown urgency.',
    type: 'Social Media',
    color: '#ff832b',
  },
];

interface HistoryRow {
  id: string;
  title: string;
  type: string;
  tone: string;
  date: string;
  words: string;
  status: string;
}

const historyData: HistoryRow[] = [
  {
    id: 'h1',
    title: 'Spring Campaign Email Blast',
    type: 'Email',
    tone: 'Friendly',
    date: '2026-02-19 08:45',
    words: '320',
    status: 'used',
  },
  {
    id: 'h2',
    title: 'LinkedIn Thought Leadership Post',
    type: 'Social Media',
    tone: 'Professional',
    date: '2026-02-18 14:20',
    words: '185',
    status: 'used',
  },
  {
    id: 'h3',
    title: 'Product Feature Blog Post',
    type: 'Blog Post',
    tone: 'Informative',
    date: '2026-02-17 11:00',
    words: '850',
    status: 'draft',
  },
  {
    id: 'h4',
    title: 'Google Ads Headline Variants',
    type: 'Ad Copy',
    tone: 'Persuasive',
    date: '2026-02-16 16:30',
    words: '60',
    status: 'used',
  },
  {
    id: 'h5',
    title: 'Customer Win-back Email',
    type: 'Email',
    tone: 'Empathetic',
    date: '2026-02-15 09:10',
    words: '275',
    status: 'discarded',
  },
  {
    id: 'h6',
    title: 'Instagram Reels Caption Set',
    type: 'Social Media',
    tone: 'Casual',
    date: '2026-02-14 13:55',
    words: '120',
    status: 'used',
  },
  {
    id: 'h7',
    title: 'Year in Review Blog Post',
    type: 'Blog Post',
    tone: 'Inspirational',
    date: '2026-02-13 10:30',
    words: '1200',
    status: 'draft',
  },
];

const historyHeaders = [
  { key: 'title', header: 'Title' },
  { key: 'type', header: 'Type' },
  { key: 'tone', header: 'Tone' },
  { key: 'date', header: 'Date' },
  { key: 'words', header: 'Words' },
  { key: 'status', header: 'Status' },
];

const statusTagType: Record<string, 'green' | 'gray' | 'red'> = {
  used: 'green',
  draft: 'gray',
  discarded: 'red',
};

export default function AICopywriterPage() {
  const { t } = useTranslation();
  const [contentType, setContentType] = useState('blog');
  const [tone, setTone] = useState('professional');
  const [brief, setBrief] = useState(
    'Write about our new sustainable packaging initiative. Highlight how we reduced plastic usage by 60% and switched to recycled materials. Target audience: environmentally conscious millennials. Include a call to action to learn more on our sustainability page.'
  );
  const [output, setOutput] = useState(
    `Going Green: Our Commitment to Sustainable Packaging\n\nAt [Brand], we believe that great products shouldn\'t come at the planet\'s expense. That\'s why we\'re thrilled to announce a major milestone in our sustainability journey — we\'ve reduced plastic usage across our packaging by 60%.\n\nStarting this month, every order ships in packaging made from 100% post-consumer recycled materials. From the box to the filler, every component has been reimagined with the environment in mind.\n\nWhat This Means for You:\n- Your orders arrive in fully recyclable packaging\n- Zero single-use plastics in any shipment\n- Carbon-neutral shipping on all domestic orders\n\nThis is just the beginning. We\'re committed to reaching zero-waste packaging by 2027, and we want you to be part of the journey.\n\nReady to learn more about our sustainability initiatives? Visit our Sustainability page to see the full roadmap and discover how you can make a difference with every purchase.\n\n[Learn More About Our Green Commitment →]`
  );

  const handleGenerate = () => {
    setOutput(t('Generating copy... (AI generation would occur here)'));
  };

  return (
    <div>
      <h1 style={{ marginBottom: '0.5rem' }}>
        {t('AI Copywriter Hub')}
      </h1>
      <p style={{ marginBottom: '2rem', color: '#525252' }}>
        {t('Generate, manage, and refine AI-powered copy for all your content needs.')}
      </p>

      <Tabs>
        <TabList aria-label={t('Copywriter tabs')}>
          <Tab>{t('Generate')}</Tab>
          <Tab>{t('Templates')}</Tab>
          <Tab>{t('History')}</Tab>
        </TabList>
        <TabPanels>
          {/* Generate Tab */}
          <TabPanel>
            <div style={{ paddingTop: '1rem' }}>
              <Grid narrow>
                <Column sm={4} md={4} lg={6}>
                  <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem' }}>
                      {t('Content Settings')}
                    </h3>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <Select
                        id="content-type"
                        labelText={t('Content Type')}
                        value={contentType}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setContentType(e.target.value)
                        }
                      >
                        <SelectItem value="blog" text={t('Blog Post')} />
                        <SelectItem value="social" text={t('Social Media')} />
                        <SelectItem value="email" text={t('Email')} />
                        <SelectItem value="ad" text={t('Ad Copy')} />
                      </Select>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <Select
                        id="tone"
                        labelText={t('Tone')}
                        value={tone}
                        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                          setTone(e.target.value)
                        }
                      >
                        <SelectItem value="professional" text={t('Professional')} />
                        <SelectItem value="casual" text={t('Casual')} />
                        <SelectItem value="friendly" text={t('Friendly')} />
                        <SelectItem value="persuasive" text={t('Persuasive')} />
                        <SelectItem value="informative" text={t('Informative')} />
                        <SelectItem value="inspirational" text={t('Inspirational')} />
                        <SelectItem value="empathetic" text={t('Empathetic')} />
                      </Select>
                    </div>

                    <div style={{ marginBottom: '1.25rem' }}>
                      <TextArea
                        id="brief"
                        labelText={t('Brief')}
                        value={brief}
                        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                          setBrief(e.target.value)
                        }
                        rows={6}
                        placeholder={t('Describe what you want the AI to write...')}
                      />
                    </div>

                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <Button
                        kind="primary"
                        renderIcon={WatsonHealthAiResults}
                        onClick={handleGenerate}
                      >
                        {t('Generate Copy')}
                      </Button>
                      <Button kind="ghost" renderIcon={Reset}>
                        {t('Reset')}
                      </Button>
                    </div>
                  </Tile>
                </Column>

                <Column sm={4} md={4} lg={10}>
                  <Tile style={{ padding: '1.5rem', marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <h3 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                          {t('Generated Output')}
                        </h3>
                        <AILabel size="mini">
                          <AILabelContent>
                            <p style={{ fontSize: '0.75rem' }}>{t('This content was generated by AI based on your brief and content settings. Model confidence varies by output quality.')}</p>
                          </AILabelContent>
                        </AILabel>
                      </div>
                      <Button kind="ghost" size="sm" renderIcon={Copy}>
                        {t('Copy to Clipboard')}
                      </Button>
                    </div>
                    <TextArea
                      id="output"
                      labelText={t('Output')}
                      hideLabel
                      value={output}
                      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                        setOutput(e.target.value)
                      }
                      rows={18}
                    />
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                      <Tag type="blue" size="sm">
                        {contentType === 'blog'
                          ? t('Blog Post')
                          : contentType === 'social'
                            ? t('Social Media')
                            : contentType === 'email'
                              ? t('Email')
                              : t('Ad Copy')}
                      </Tag>
                      <Tag type="purple" size="sm">{tone}</Tag>
                      <Tag type="gray" size="sm">
                        ~{output.split(/\s+/).length} {t('words')}
                      </Tag>
                    </div>
                  </Tile>
                </Column>
              </Grid>
            </div>
          </TabPanel>

          {/* Templates Tab */}
          <TabPanel>
            <div style={{ paddingTop: '1rem' }}>
              <p style={{ fontSize: '0.875rem', color: '#525252', marginBottom: '1.5rem' }}>
                {t('Start with a pre-built template to speed up your content creation.')}
              </p>
              <Grid narrow>
                {templates.map((template) => (
                  <Column key={template.id} sm={4} md={4} lg={5} style={{ marginBottom: '1rem' }}>
                    <ClickableTile style={{ height: '100%', padding: 0 }}>
                      <div
                        style={{
                          backgroundColor: template.color,
                          height: '8px',
                          borderRadius: '4px 4px 0 0',
                        }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                          <h4 style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                            {template.title}
                          </h4>
                          <Tag type="blue" size="sm">{template.type}</Tag>
                        </div>
                        <p style={{ fontSize: '0.75rem', color: '#525252' }}>
                          {template.description}
                        </p>
                      </div>
                    </ClickableTile>
                  </Column>
                ))}
              </Grid>
            </div>
          </TabPanel>

          {/* History Tab */}
          <TabPanel>
            <div style={{ paddingTop: '1rem' }}>
              <DataTable rows={historyData} headers={historyHeaders} isSortable>
                {({
                  rows,
                  headers: tableHeaders,
                  getTableProps,
                  getHeaderProps,
                  getRowProps,
                }: any) => (
                  <TableContainer
                    title={t('Generation History')}
                    description={t('All AI-generated copy from this workspace.')}
                  >
                    <Table {...getTableProps()}>
                      <TableHead>
                        <TableRow>
                          {tableHeaders.map((header: any) => (
                            <TableHeader
                              key={header.key}
                              {...getHeaderProps({ header })}
                            >
                              {header.header}
                            </TableHeader>
                          ))}
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {rows.map((row: any) => (
                          <TableRow {...getRowProps({ row })} key={row.id}>
                            {row.cells.map((cell: any) => {
                              if (cell.info.header === 'status') {
                                return (
                                  <TableCell key={cell.id}>
                                    <Tag type={statusTagType[cell.value]} size="sm">
                                      {cell.value}
                                    </Tag>
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
          </TabPanel>
        </TabPanels>
      </Tabs>
    </div>
  );
}
