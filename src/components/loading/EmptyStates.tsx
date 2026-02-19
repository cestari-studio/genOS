'use client';

import { Button, Tile } from '@carbon/react';
import { Add, WatsonxAi } from '@carbon/icons-react';
import {
  Analytics,
  Monitor,
  Research,
  Construct,
} from '@carbon/pictograms-react';
import { motion } from 'framer-motion';

const EXPRESSIVE_ENTRANCE = [0, 0, 0.3, 1] as const;

interface EmptyStateProps {
  variant: 'content' | 'analytics' | 'cluster' | 'generic';
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const PICTOGRAMS = {
  content: Construct,
  analytics: Analytics,
  cluster: Monitor,
  generic: Research,
};

/**
 * 5. Empty States — Immersive zero-state with Carbon pictograms.
 * Centered container with Blue 60 tinted pictogram and expressive CTA.
 */
export function EmptyState({ variant, title, description, actionLabel, onAction }: EmptyStateProps) {
  const Pictogram = PICTOGRAMS[variant];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [...EXPRESSIVE_ENTRANCE] }}
    >
      <Tile style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        minHeight: '400px',
      }}>
        <div style={{
          marginBottom: '1.5rem',
          color: '#0f62fe',
          opacity: 0.8,
        }}>
          <Pictogram width={80} height={80} />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <WatsonxAi size={16} style={{ color: '#0f62fe' }} />
          <span style={{ fontSize: '0.75rem', color: '#0f62fe', fontWeight: 500, letterSpacing: '0.32px' }}>
            AI-POWERED
          </span>
        </div>

        <h2 style={{
          fontSize: '1.5rem',
          fontWeight: 400,
          lineHeight: '2rem',
          color: 'var(--cds-text-primary)',
          margin: '0 0 0.75rem',
          maxWidth: '480px',
        }}>
          {title}
        </h2>

        <p style={{
          fontSize: '0.875rem',
          lineHeight: '1.25rem',
          color: 'var(--cds-text-secondary)',
          margin: '0 0 2rem',
          maxWidth: '400px',
        }}>
          {description}
        </p>

        {actionLabel && onAction && (
          <Button
            kind="primary"
            size="lg"
            renderIcon={Add}
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Tile>
    </motion.div>
  );
}

/**
 * Pre-configured empty states for common pages.
 */
export function ContentFactoryEmpty({ onAction }: { onAction?: () => void }) {
  return (
    <EmptyState
      variant="content"
      title="Sua fábrica de conteúdo aguarda o primeiro prompt"
      description="Comece gerando posts, stories e reels com IA. O motor de orquestração seleciona automaticamente o melhor modelo para cada tipo de conteúdo."
      actionLabel="Criar primeiro conteúdo"
      onAction={onAction}
    />
  );
}

export function AnalyticsEmpty() {
  return (
    <EmptyState
      variant="analytics"
      title="Nenhum dado de analytics disponível"
      description="Publique conteúdo nas plataformas conectadas para começar a rastrear engajamento, sentimento e visibilidade GEO."
    />
  );
}

export function ClusterHealthEmpty() {
  return (
    <EmptyState
      variant="cluster"
      title="Nenhuma anomalia detectada no cluster K8s"
      description="Todos os nós estão operando dentro dos limites normais. O monitoramento de heartbeat continua ativo em segundo plano."
    />
  );
}

export function GEOVisibilityEmpty() {
  return (
    <EmptyState
      variant="generic"
      title="Dados de visibilidade GEO em processamento"
      description="O radar semântico está mapeando citações da marca nos principais LLMs. Os primeiros resultados estarão disponíveis em breve."
    />
  );
}
