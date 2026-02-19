'use client';

import { useState, useEffect } from 'react';
import { Loading, InlineLoading, Tag } from '@carbon/react';
import { WatsonxAi } from '@carbon/icons-react';
import { AnimatePresence, motion } from 'framer-motion';

/**
 * Carbon easing curves
 * productive-standard: cubic-bezier(0.2, 0, 0.38, 0.9)
 * expressive-entrance: cubic-bezier(0, 0, 0.3, 1)
 */
const PRODUCTIVE_STANDARD = [0.2, 0, 0.38, 0.9] as const;
const EXPRESSIVE_ENTRANCE = [0, 0, 0.3, 1] as const;

const QUANTUM_MESSAGES = [
  'Estabelecendo handshake com IBM watsonx...',
  'Calibrando VQC via Qiskit Runtime...',
  'Inferindo DNA da marca usando modelo Granite 3.1...',
  'Verificando maturidade de governança (AgentOps)...',
  'Mapeando dependências de microserviços em Kubernetes...',
  'Sincronizando embeddings no banco vetorial (pgvector)...',
  'Otimizando roteamento via QAOA heurístico...',
  'Validando políticas RLS de isolamento multi-tenant...',
  'Conectando pipeline RAG ao contexto da marca...',
  'Finalizando orquestração de agentes autônomos...',
];

interface QuantumOverlayProps {
  active: boolean;
  onComplete?: () => void;
}

/**
 * 1. Quantum Global Overlay — Full-screen loading for heavy transitions.
 * Used during login, PDF report generation, patch deploys.
 */
export function QuantumOverlay({ active, onComplete }: QuantumOverlayProps) {
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (!active) {
      setMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setMessageIndex(prev => {
        const next = prev + 1;
        if (next >= QUANTUM_MESSAGES.length) {
          onComplete?.();
          return 0;
        }
        return next;
      });
    }, 2800);
    return () => clearInterval(interval);
  }, [active, onComplete]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: [...PRODUCTIVE_STANDARD] }}
          className="quantum-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, ease: [...EXPRESSIVE_ENTRANCE] }}
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '3rem',
              background: 'var(--cds-layer-01, #262626)',
              border: '1px solid var(--cds-border-subtle-01, #393939)',
              maxWidth: '480px',
              width: '90%',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <WatsonxAi size={32} style={{ color: '#0f62fe' }} />
              <span style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: 'var(--cds-text-on-color, #ffffff)',
              }}>
                genOS
              </span>
              <Tag type="blue" size="sm">Quantum</Tag>
            </div>

            <Loading withOverlay={false} small />

            <AnimatePresence mode="wait">
              <motion.div
                key={messageIndex}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3, ease: [...PRODUCTIVE_STANDARD] }}
              >
                <InlineLoading
                  status="active"
                  description={QUANTUM_MESSAGES[messageIndex]}
                />
              </motion.div>
            </AnimatePresence>

            {/* Progress bar */}
            <div style={{
              width: '100%',
              height: '2px',
              background: 'var(--cds-border-subtle-01, #393939)',
              borderRadius: '1px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: `${((messageIndex + 1) / QUANTUM_MESSAGES.length) * 100}%` }}
                transition={{ duration: 0.5, ease: [...PRODUCTIVE_STANDARD] }}
                style={{
                  height: '100%',
                  background: '#0f62fe',
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * 3. Quantum AI Processing Popover — Micro-interaction for "Redo with AI" / "Generate Scope".
 * Actionable notification with progress and explainability flag.
 */
interface AIProcessingPopoverProps {
  active: boolean;
  message?: string;
  onClose?: () => void;
}

export function AIProcessingPopover({ active, message, onClose }: AIProcessingPopoverProps) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.3, ease: [...EXPRESSIVE_ENTRANCE] }}
          className="ai-processing-popover"
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 8000,
            padding: '1rem 1.5rem',
            background: 'var(--cds-layer-01, #ffffff)',
            border: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.12)',
            maxWidth: '400px',
            width: '90%',
          }}
        >
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '0.75rem',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <WatsonxAi size={20} style={{ color: '#0f62fe' }} />
              <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>
                Orquestrando Agentes...
              </span>
            </div>
            {onClose && (
              <button
                onClick={onClose}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--cds-text-secondary)',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  padding: '0.25rem',
                }}
              >
                ✕
              </button>
            )}
          </div>

          <InlineLoading status="active" description={message ?? 'Processando com IA...'} />

          {/* Explainability flag */}
          <div style={{
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(15, 98, 254, 0.08)',
            borderLeft: '3px solid #0f62fe',
            fontSize: '0.75rem',
            color: 'var(--cds-text-secondary)',
          }}>
            <strong style={{ color: 'var(--cds-text-primary)' }}>Explainability:</strong>{' '}
            O resultado será gerado respeitando o DNA da marca, restrições regionais e pilares de conteúdo configurados.
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
