'use client';

import React from 'react';
import { WatsonHealthAiResults } from '@carbon/icons-react';

interface GenOSAIBadgeProps {
  label?: string;
  size?: number;
  explanation?: string;
}

export default function GenOSAIBadge({
  label = 'AI Generated',
  size = 16,
  explanation,
}: GenOSAIBadgeProps) {
  return (
    <span
      title={explanation}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.125rem 0.5rem',
        borderRadius: '1rem',
        background: 'linear-gradient(135deg, #d0e2ff, #e8daff)',
        fontSize: '0.75rem',
        fontWeight: 500,
        color: '#0043ce',
        cursor: explanation ? 'help' : 'default',
      }}
    >
      <WatsonHealthAiResults size={size} />
      {label}
    </span>
  );
}
