'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  ClickableTile,
  Tag,
  Toggle,
  Button,
  InlineNotification,
} from '@carbon/react';
import {
  Chemistry,
  MachineLearning,
  WatsonHealthAiStatus,
  Rocket,
  Translate,
  VoiceActivate,
} from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

interface Experiment {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'beta' | 'coming-soon';
  enabled: boolean;
  icon: any;
  metrics?: string;
}

const initialExperiments: Experiment[] = [
  {
    id: 'quantum-opt',
    title: 'Quantum Content Optimization',
    description: 'Use IBM Qiskit VQC circuits to optimize content scheduling and resource allocation across platforms.',
    status: 'active',
    enabled: true,
    icon: Chemistry,
    metrics: 'Avg 23% improvement in engagement',
  },
  {
    id: 'multi-agent',
    title: 'Multi-Agent Orchestration',
    description: 'Coordinate multiple AI models (Claude, Gemini, Granite) via circuit-breaker pattern for resilient content generation.',
    status: 'active',
    enabled: true,
    icon: MachineLearning,
    metrics: '99.7% uptime with fallback chain',
  },
  {
    id: 'predictive-v2',
    title: 'Predictive Analytics v2',
    description: 'Next-generation trend prediction using transformer-based models trained on cross-platform engagement data.',
    status: 'beta',
    enabled: false,
    icon: WatsonHealthAiStatus,
    metrics: 'Testing phase — 78% accuracy',
  },
  {
    id: 'voice-synth',
    title: 'Voice Synthesis',
    description: 'Generate brand-aligned voice content for podcasts, reels narration, and audio ads using neural TTS models.',
    status: 'beta',
    enabled: false,
    icon: VoiceActivate,
  },
  {
    id: 'auto-translate',
    title: 'Auto-Translation Engine',
    description: 'Context-aware translation that preserves brand voice, tone, and cultural nuances across 12 languages.',
    status: 'coming-soon',
    enabled: false,
    icon: Translate,
  },
  {
    id: 'content-rocket',
    title: 'Content Rocket (A/B Multivariate)',
    description: 'Automatically generate and test multiple variations of content with statistical significance tracking.',
    status: 'coming-soon',
    enabled: false,
    icon: Rocket,
  },
];

const statusConfig = {
  active: { color: 'green' as const, label: 'Active' },
  beta: { color: 'purple' as const, label: 'Beta' },
  'coming-soon': { color: 'gray' as const, label: 'Coming Soon' },
};

export default function AILabPage() {
  const { t } = useTranslation();
  const [experiments, setExperiments] = useState(initialExperiments);

  const handleToggle = (id: string) => {
    setExperiments(prev =>
      prev.map(exp => exp.id === id && exp.status !== 'coming-soon' ? { ...exp, enabled: !exp.enabled } : exp)
    );
  };

  const activeCount = experiments.filter(e => e.enabled).length;

  return (
    <div style={{ padding: '2rem' }}>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Chemistry size={20} />
          <h1 style={{ margin: 0 }}>AI Lab</h1>
          <Tag type="purple" size="sm">Experimental</Tag>
        </div>
        <p>Explore and enable cutting-edge AI capabilities for genOS v4.5.0</p>
      </div>

      <InlineNotification
        kind="info"
        title="Experimental Features"
        subtitle="Features in this lab may change or be removed. Enable them at your own discretion. Beta features may impact token usage."
        style={{ marginBottom: '1.5rem' }}
      />

      <Grid style={{ marginBottom: '1.5rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Total Experiments</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>{experiments.length}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Active</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: 'var(--cds-support-success)' }}>{activeCount}</p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Beta</p>
            <p style={{ fontSize: '2rem', fontWeight: 600, color: '#6929c4' }}>
              {experiments.filter(e => e.status === 'beta').length}
            </p>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile>
            <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)' }}>Coming Soon</p>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>
              {experiments.filter(e => e.status === 'coming-soon').length}
            </p>
          </Tile>
        </Column>
      </Grid>

      <Grid>
        {experiments.map((exp) => {
          const IconComponent = exp.icon;
          const config = statusConfig[exp.status];
          return (
            <Column key={exp.id} lg={8} md={4} sm={4}>
              <Tile style={{
                marginBottom: '1rem',
                border: exp.enabled ? '2px solid var(--cds-link-primary)' : '2px solid transparent',
                opacity: exp.status === 'coming-soon' ? 0.6 : 1,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <IconComponent size={24} style={{ color: exp.enabled ? 'var(--cds-link-primary)' : 'var(--cds-text-secondary)' }} />
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{exp.title}</h3>
                      <Tag type={config.color} size="sm" style={{ marginTop: '0.25rem' }}>{config.label}</Tag>
                    </div>
                  </div>
                  <Toggle
                    id={`toggle-${exp.id}`}
                    size="sm"
                    toggled={exp.enabled}
                    disabled={exp.status === 'coming-soon'}
                    onToggle={() => handleToggle(exp.id)}
                    labelA="Off"
                    labelB="On"
                    hideLabel
                  />
                </div>
                <p style={{ fontSize: '0.875rem', color: 'var(--cds-text-secondary)', margin: '0 0 0.75rem' }}>
                  {exp.description}
                </p>
                {exp.metrics && (
                  <p style={{ fontSize: '0.75rem', color: 'var(--cds-link-primary)', fontWeight: 500, margin: 0 }}>
                    {exp.metrics}
                  </p>
                )}
              </Tile>
            </Column>
          );
        })}
      </Grid>
    </div>
  );
}
