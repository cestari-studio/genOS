'use client';

import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Button,
  Tag,
} from '@carbon/react';
import {
  Document,
  Image,
  TextCreation,
  DataVis_1,
  Version,
  ChartMultitype,
  ArrowRight,
} from '@carbon/icons-react';

const features = [
  { icon: DataVis_1, title: 'Matrix View', desc: 'Visualize all content across platforms in grid or list format with real-time status tracking.' },
  { icon: TextCreation, title: 'AI Copywriter', desc: 'Generate on-brand copy with multi-model AI using Claude, Gemini, and Granite orchestration.' },
  { icon: Image, title: 'Visual Prompts', desc: 'Create stunning visuals with AI-powered prompt studio supporting multiple generation models.' },
  { icon: Document, title: 'Multi-Platform Publishing', desc: 'Publish to Instagram, LinkedIn, Twitter, TikTok, and blog simultaneously.' },
  { icon: Version, title: 'Version Control', desc: 'Track every content revision with full version history and diff comparison.' },
  { icon: ChartMultitype, title: 'Brand DNA Alignment', desc: 'AI ensures every piece of content matches your brand voice, visuals, and strategy.' },
];

const useCases = [
  { title: 'Marketing Agencies', desc: 'Manage content for 50+ clients with team workflows and approval chains.', tag: 'Agency' },
  { title: 'Enterprise Brands', desc: 'Scale content production while maintaining brand consistency across regions.', tag: 'Enterprise' },
  { title: 'Startups', desc: 'Launch content strategies fast with AI templates and automated workflows.', tag: 'Startup' },
];

export default function ContentFactoryLanding() {
  return (
    <div>
      {/* Hero */}
      <div style={{
        background: 'linear-gradient(135deg, #161616 0%, #0043ce 100%)',
        color: '#f4f4f4',
        padding: '6rem 2rem 4rem',
      }}>
        <Grid>
          <Column lg={10} md={6} sm={4}>
            <Tag type="cyan" style={{ marginBottom: '1rem' }}>Content Factory</Tag>
            <h1 style={{ fontSize: '3rem', fontWeight: 300, margin: '0 0 1rem', lineHeight: 1.2 }}>
              AI-Powered Content at Scale
            </h1>
            <p style={{ fontSize: '1.25rem', maxWidth: '600px', color: '#c6c6c6', lineHeight: 1.6, marginBottom: '2rem' }}>
              From ideation to publication, automate your entire content pipeline with multi-model AI,
              brand DNA alignment, and cross-platform distribution.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button size="lg" renderIcon={ArrowRight}>Start Free Trial</Button>
              <Button kind="tertiary" size="lg">Watch Demo</Button>
            </div>
          </Column>
          <Column lg={6} md={2} sm={0}>
            <div style={{
              width: '100%', height: '300px', borderRadius: '8px',
              background: 'linear-gradient(135deg, rgba(15,98,254,0.3), rgba(105,41,196,0.3))',
              border: '1px solid rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Document size={64} style={{ color: '#78a9ff' }} />
            </div>
          </Column>
        </Grid>
      </div>

      {/* Features */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--cds-background)' }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.5rem' }}>Everything You Need</h2>
            <p style={{ color: 'var(--cds-text-secondary)', marginBottom: '2rem' }}>
              A complete content production system from creation to analytics.
            </p>
          </Column>
          {features.map((feature) => {
            const IconComp = feature.icon;
            return (
              <Column key={feature.title} lg={5} md={4} sm={4}>
                <Tile style={{ marginBottom: '1rem', minHeight: '200px' }}>
                  <IconComp size={32} style={{ color: 'var(--cds-link-primary)', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{feature.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', lineHeight: 1.5 }}>{feature.desc}</p>
                </Tile>
              </Column>
            );
          })}
        </Grid>
      </div>

      {/* Use Cases */}
      <div style={{ padding: '4rem 2rem', backgroundColor: 'var(--cds-layer-01)' }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '2rem' }}>Built For Your Team</h2>
          </Column>
          {useCases.map((uc) => (
            <Column key={uc.title} lg={5} md={4} sm={4}>
              <ClickableTile href="/pricing" style={{ marginBottom: '1rem', minHeight: '160px' }}>
                <Tag type="blue" size="sm" style={{ marginBottom: '0.75rem' }}>{uc.tag}</Tag>
                <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem' }}>{uc.title}</h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>{uc.desc}</p>
              </ClickableTile>
            </Column>
          ))}
        </Grid>
      </div>

      {/* CTA */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#0f62fe', color: '#fff' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>Ready to Transform Your Content?</h2>
        <p style={{ marginBottom: '2rem', color: '#d0e2ff' }}>Join 500+ brands creating content at scale with AI.</p>
        <Button kind="secondary" size="lg" renderIcon={ArrowRight}>Get Started Free</Button>
      </div>
    </div>
  );
}
