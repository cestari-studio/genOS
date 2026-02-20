'use client';
import React, { useState } from 'react';
import { Popover, PopoverContent } from '@carbon/react';
import { WatsonHealthAiResults } from '@carbon/icons-react';

interface ExplainabilityPopoverProps {
  model: string;
  confidence: number;
  reasoning?: string;
  source?: string;
}

export default function ExplainabilityPopover({ model, confidence, reasoning, source }: ExplainabilityPopoverProps) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} align="bottom-left">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        style={{
          border: 'none',
          cursor: 'pointer',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.25rem',
          padding: '0.125rem 0.5rem',
          borderRadius: '1rem',
          background: 'linear-gradient(135deg, #d0e2ff, #e8daff)',
          fontSize: '0.75rem',
          color: '#0043ce',
        }}
      >
        <WatsonHealthAiResults size={16} /> AI &middot; {confidence}%
      </button>
      <PopoverContent>
        <div style={{ padding: '1rem', maxWidth: '300px' }}>
          <h6 style={{ marginBottom: '0.5rem', fontSize: '0.875rem' }}>AI Explainability</h6>
          <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>
            <strong>Model:</strong> {model}
          </p>
          <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>
            <strong>Confidence:</strong> {confidence}%
          </p>
          {reasoning && (
            <p style={{ fontSize: '0.75rem', color: '#525252', marginBottom: '0.5rem' }}>
              <strong>Reasoning:</strong> {reasoning}
            </p>
          )}
          {source && (
            <p style={{ fontSize: '0.75rem', color: '#525252' }}>
              <strong>Source:</strong> {source}
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
