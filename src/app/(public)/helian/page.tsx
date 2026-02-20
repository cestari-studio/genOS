'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Tag,
} from '@carbon/react';
import {
  Chemistry,
  MachineLearning,
  DataVis_1,
  Lightning,
  ArrowRight,
} from '@carbon/icons-react';

const ASCII_HELIAN = `
██╗  ██╗███████╗██╗     ██╗ █████╗ ███╗   ██╗
██║  ██║██╔════╝██║     ██║██╔══██╗████╗  ██║
███████║█████╗  ██║     ██║███████║██╔██╗ ██║
██╔══██║██╔══╝  ██║     ██║██╔══██║██║╚██╗██║
██║  ██║███████╗███████╗██║██║  ██║██║ ╚████║
╚═╝  ╚═╝╚══════╝╚══════╝╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝
     Quantum Multimodal AI Engine v2.0
`;

const benchmarks = [
  { label: 'VQC Accuracy', value: '96.2%', delta: '+4.1%' },
  { label: 'Inference Speed', value: '12ms', delta: '-38%' },
  { label: 'Model Parameters', value: '340B', delta: 'Multi-modal' },
  { label: 'Languages', value: '12', delta: 'Full support' },
];

const features = [
  { icon: Chemistry, title: 'VQC Optimization', desc: 'Variational Quantum Circuits for content scheduling optimization, reducing computation time by 10x.' },
  { icon: MachineLearning, title: 'Multi-Modal Processing', desc: 'Process text, images, audio, and video in a unified pipeline with cross-modal understanding.' },
  { icon: Lightning, title: 'Real-Time Inference', desc: 'Sub-15ms inference with edge-optimized models and adaptive batching for production workloads.' },
  { icon: DataVis_1, title: 'IBM Qiskit Integration', desc: 'Native integration with IBM Qiskit Runtime for quantum circuit execution and hybrid classical-quantum workflows.' },
];

export default function HelianLanding() {
  const [showAscii, setShowAscii] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowAscii(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ backgroundColor: '#161616', color: '#f4f4f4', minHeight: '100vh' }}>
      {/* Hero */}
      <div style={{ padding: '6rem 2rem 4rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: 'radial-gradient(circle at 30% 50%, #0f62fe22 0%, transparent 60%)',
        }} />
        <Grid style={{ position: 'relative', zIndex: 1 }}>
          <Column lg={16} md={8} sm={4}>
            <pre style={{
              color: '#0f62fe',
              fontSize: '0.625rem',
              lineHeight: '0.75rem',
              fontFamily: '"IBM Plex Mono", monospace',
              margin: '0 0 2rem',
              opacity: showAscii ? 1 : 0,
              transition: 'opacity 1s ease',
              overflow: 'hidden',
            }}>
              {ASCII_HELIAN}
            </pre>
            <Tag type="purple" style={{ marginBottom: '1rem' }}>Quantum AI</Tag>
            <h1 style={{ fontSize: '3.5rem', fontWeight: 300, margin: '0 0 1rem', lineHeight: 1.1 }}>
              Quantum Multimodal<br />AI Engine
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#8d8d8d', maxWidth: '640px', lineHeight: 1.6, marginBottom: '2rem' }}>
              Helian combines IBM Qiskit quantum computing with state-of-the-art multimodal AI to deliver
              unprecedented optimization and inference capabilities for enterprise content operations.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Button size="lg" renderIcon={ArrowRight}>Request Demo</Button>
              <Button kind="tertiary" size="lg">Read Whitepaper</Button>
            </div>
          </Column>
        </Grid>
      </div>

      {/* Benchmarks */}
      <div style={{ padding: '3rem 2rem', borderTop: '1px solid #393939', borderBottom: '1px solid #393939' }}>
        <Grid>
          {benchmarks.map((bm) => (
            <Column key={bm.label} lg={4} md={4} sm={4}>
              <div style={{ textAlign: 'center', padding: '1rem' }}>
                <p style={{ fontSize: '0.75rem', color: '#8d8d8d', letterSpacing: '0.32px', textTransform: 'uppercase' }}>{bm.label}</p>
                <p style={{ fontSize: '2.5rem', fontWeight: 600, color: '#f4f4f4', margin: '0.5rem 0 0.25rem' }}>{bm.value}</p>
                <Tag type="green" size="sm">{bm.delta}</Tag>
              </div>
            </Column>
          ))}
        </Grid>
      </div>

      {/* Features */}
      <div style={{ padding: '4rem 2rem' }}>
        <Grid>
          <Column lg={16} md={8} sm={4}>
            <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '2rem', color: '#f4f4f4' }}>Core Capabilities</h2>
          </Column>
          {features.map((feature) => {
            const IconComp = feature.icon;
            return (
              <Column key={feature.title} lg={8} md={4} sm={4}>
                <Tile style={{
                  marginBottom: '1rem',
                  backgroundColor: '#262626',
                  border: '1px solid #393939',
                  minHeight: '180px',
                }}>
                  <IconComp size={32} style={{ color: '#0f62fe', marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', color: '#f4f4f4' }}>
                    {feature.title}
                  </h3>
                  <p style={{ fontSize: '0.875rem', color: '#8d8d8d', lineHeight: 1.5 }}>{feature.desc}</p>
                </Tile>
              </Column>
            );
          })}
        </Grid>
      </div>

      {/* CTA */}
      <div style={{ padding: '4rem 2rem', textAlign: 'center', borderTop: '1px solid #393939' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '1rem' }}>Experience Quantum AI</h2>
        <p style={{ color: '#8d8d8d', marginBottom: '2rem', maxWidth: '500px', margin: '0 auto 2rem' }}>
          Schedule a personalized demo to see Helian in action with your data.
        </p>
        <Button size="lg" renderIcon={ArrowRight}>Schedule Demo</Button>
      </div>
    </div>
  );
}
