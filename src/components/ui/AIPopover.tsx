'use client';

import React, { forwardRef } from 'react';
import { Close, Launch } from '@carbon/icons-react';
import './ai-popover.scss';

export interface AIPopoverProps {
  /** Alignment of the popover relative to trigger */
  align?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left' | 'right';
  /** Title displayed at the top of the popover */
  title?: string;
  /** Description text */
  description?: string;
  /** How it works section with bullet points */
  howItWorks?: {
    title: string;
    description: string;
  }[];
  /** AI model name */
  modelName?: string;
  /** AI model documentation link */
  modelLink?: string;
  /** Callback when close button is clicked */
  onClose?: () => void;
  /** Custom content to render inside the popover */
  customContent?: React.ReactNode;
  /** Additional CSS class */
  className?: string;
}

const AIPopover = forwardRef<HTMLDivElement, AIPopoverProps>(({
  align = 'bottom-left',
  title = 'AI explained',
  description,
  howItWorks,
  modelName,
  modelLink,
  onClose,
  customContent,
  className = '',
}, ref) => {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose?.();
    }
  };

  return (
    <div
      ref={ref}
      className={`ai-popover ai-popover--${align} ${className}`}
      role="dialog"
      aria-labelledby="ai-popover-title"
      aria-modal="true"
      onKeyDown={handleKeyDown}
      data-placement={align}
    >
      <div className="ai-popover__header">
        <div className="ai-popover__header-content">
          <span className="ai-popover__label">AI explained</span>
          <h3 id="ai-popover-title" className="ai-popover__title">{title}</h3>
        </div>
        {onClose && (
          <button
            type="button"
            className="ai-popover__close"
            onClick={onClose}
            aria-label="Close AI explanation"
          >
            <Close size={16} />
          </button>
        )}
      </div>

      {customContent ? (
        <div className="ai-popover__custom-content">
          {customContent}
        </div>
      ) : (
        <>
          {description && (
            <p className="ai-popover__description">{description}</p>
          )}

          {howItWorks && howItWorks.length > 0 && (
            <div className="ai-popover__section">
              <h4 className="ai-popover__section-title">How it works</h4>
              <ul className="ai-popover__list">
                {howItWorks.map((item, index) => (
                  <li key={index}>
                    <strong>{item.title}:</strong> {item.description}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {(modelName || modelLink) && (
        <div className="ai-popover__footer">
          <div className="ai-popover__model">
            <span className="ai-popover__model-label">AI model</span>
            {modelLink ? (
              <a
                href={modelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="ai-popover__model-link"
              >
                {modelName || 'View documentation'}
                <Launch size={12} aria-hidden="true" />
              </a>
            ) : (
              <span className="ai-popover__model-name">{modelName}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
});

AIPopover.displayName = 'AIPopover';

export default AIPopover;
