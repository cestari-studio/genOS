'use client';

import { AILabel, AILabelContent, AILabelActions } from '@carbon/react';
import { Button } from '@carbon/react';
import { Renew, ThumbsUp, ThumbsDown, Copy } from '@carbon/icons-react';

interface AIContentLabelProps {
  model?: string;
  confidence?: number;
  onRegenerate?: () => void;
  onCopy?: () => void;
  size?: 'mini' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default function AIContentLabel({
  model = 'Claude Opus',
  confidence,
  onRegenerate,
  onCopy,
  size = 'xs',
}: AIContentLabelProps) {
  return (
    <AILabel size={size} align="bottom-right">
      <AILabelContent>
        <div>
          <p style={{
            fontSize: '0.75rem',
            color: 'var(--cds-text-secondary)',
            marginBottom: '0.5rem',
          }}>
            Gerado por IA
          </p>
          <p style={{
            fontSize: '0.875rem',
            fontWeight: 600,
            margin: '0 0 0.25rem',
          }}>
            {model}
          </p>
          {confidence !== undefined && (
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--cds-text-secondary)',
              margin: 0,
            }}>
              Confiança: {confidence}%
            </p>
          )}
        </div>
      </AILabelContent>
      <AILabelActions>
        {onRegenerate && (
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            iconDescription="Regenerar"
            renderIcon={Renew}
            onClick={onRegenerate}
          />
        )}
        {onCopy && (
          <Button
            kind="ghost"
            size="sm"
            hasIconOnly
            iconDescription="Copiar"
            renderIcon={Copy}
            onClick={onCopy}
          />
        )}
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription="Útil"
          renderIcon={ThumbsUp}
        />
        <Button
          kind="ghost"
          size="sm"
          hasIconOnly
          iconDescription="Não útil"
          renderIcon={ThumbsDown}
        />
      </AILabelActions>
    </AILabel>
  );
}
