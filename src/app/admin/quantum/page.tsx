'use client';

import { useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Tag,
  ProgressBar,
  Button,
  InlineNotification,
  CodeSnippet,
} from '@carbon/react';
import { Chemistry, Meter, Flash } from '@carbon/icons-react';
import { useTranslation } from '@/lib/i18n/context';

const quantumMetrics = {
  circuitDepth: 12,
  qubitCount: 127,
  fidelity: '98.7%',
  jobsToday: 34,
  avgOptimization: '23%',
};

const recentJobs = [
  {
    id: 'qj-001',
    type: 'Content Scheduling',
    qubits: 8,
    status: 'completed',
    improvement: '+18%',
  },
  {
    id: 'qj-002',
    type: 'Audience Segmentation',
    qubits: 16,
    status: 'completed',
    improvement: '+31%',
  },
  {
    id: 'qj-003',
    type: 'Budget Allocation',
    qubits: 12,
    status: 'running',
    improvement: '—',
  },
  {
    id: 'qj-004',
    type: 'A/B Test Optimization',
    qubits: 6,
    status: 'completed',
    improvement: '+12%',
  },
  {
    id: 'qj-005',
    type: 'Creative Routing',
    qubits: 10,
    status: 'queued',
    improvement: '—',
  },
  {
    id: 'qj-006',
    type: 'Campaign Pacing',
    qubits: 8,
    status: 'completed',
    improvement: '+22%',
  },
  {
    id: 'qj-007',
    type: 'Keyword Bidding',
    qubits: 14,
    status: 'failed',
    improvement: '—',
  },
  {
    id: 'qj-008',
    type: 'Funnel Analysis',
    qubits: 20,
    status: 'completed',
    improvement: '+9%',
  },
];

function getStatusTagType(status: string) {
  switch (status) {
    case 'completed':
      return 'green';
    case 'running':
      return 'blue';
    case 'queued':
      return 'gray';
    case 'failed':
      return 'red';
    default:
      return 'gray';
  }
}

export default function QuantumEnginePage() {
  const { t } = useTranslation();
  const [showCircuitDetail, setShowCircuitDetail] = useState(false);

  const fidelityValue = parseFloat(quantumMetrics.fidelity) / 100;

  return (
    <div>
      <div className="page-header" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Chemistry size={20} />
          Quantum Engine Status
        </h1>
        <p style={{ color: '#525252', marginTop: '0.25rem' }}>
          Monitor quantum optimization circuits, fidelity metrics, and recent
          jobs processed by the genOS v4.5.0 quantum engine.
        </p>
      </div>

      <InlineNotification
        kind="info"
        title="Engine Online"
        subtitle="Quantum backend connected — 127 qubits available, circuit depth stable at 12."
        lowContrast
        hideCloseButton
        style={{ marginBottom: '1.5rem' }}
      />

      <Grid fullWidth style={{ marginBottom: '2rem' }}>
        <Column lg={4} md={4} sm={4}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Chemistry size={20} />
              <strong>Qubit Count</strong>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>
              {quantumMetrics.qubitCount}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem' }}>
              Active qubits in cluster
            </p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Meter size={20} />
              <strong>Fidelity Gauge</strong>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {quantumMetrics.fidelity}
            </p>
            <ProgressBar
              label="Gate fidelity"
              value={fidelityValue * 100}
              max={100}
              status={fidelityValue > 0.95 ? 'active' : 'error'}
            />
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Flash size={20} />
              <strong>Jobs Today</strong>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>
              {quantumMetrics.jobsToday}
            </p>
            <p style={{ color: '#525252', fontSize: '0.875rem' }}>
              Avg. optimization: {quantumMetrics.avgOptimization}
            </p>
          </Tile>
        </Column>

        <Column lg={4} md={4} sm={4}>
          <Tile style={{ height: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
              <Meter size={20} />
              <strong>Circuit Depth</strong>
            </div>
            <p style={{ fontSize: '2rem', fontWeight: 600 }}>
              {quantumMetrics.circuitDepth}
            </p>
            <ProgressBar
              label="Depth utilization"
              value={(quantumMetrics.circuitDepth / 20) * 100}
              max={100}
            />
            <Button
              kind="ghost"
              size="sm"
              style={{ marginTop: '0.5rem' }}
              onClick={() => setShowCircuitDetail(!showCircuitDetail)}
            >
              {showCircuitDetail ? 'Hide detail' : 'Show detail'}
            </Button>
            {showCircuitDetail && (
              <div style={{ marginTop: '0.5rem' }}><CodeSnippet type="single">
                {`depth=12 | layers=[H,CNOT,Rz,CNOT,Rz,H,CNOT,Rz,Measure] | T-count=4`}
              </CodeSnippet></div>
            )}
          </Tile>
        </Column>
      </Grid>

      <h2 style={{ marginBottom: '1rem' }}>Recent Optimization Jobs</h2>

      <Grid fullWidth>
        {recentJobs.map((job) => (
          <Column key={job.id} lg={4} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>{job.type}</strong>
                <Tag type={getStatusTagType(job.status)} size="sm">
                  {job.status}
                </Tag>
              </div>
              <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                Job ID: {job.id}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#525252' }}>
                Qubits: {job.qubits}
              </p>
              <p style={{ fontSize: '1.25rem', fontWeight: 600, marginTop: '0.5rem' }}>
                {job.improvement}
              </p>
            </Tile>
          </Column>
        ))}
      </Grid>
    </div>
  );
}
