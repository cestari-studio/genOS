'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Ai } from '@carbon/icons-react';
import AIPopover from './AIPopover';
import './ai-label.scss';

export interface AILabelProps {
  /** Size variant of the AI label */
  size?: 'mini' | 'sm' | 'md' | 'lg';
  /** Alignment of the label when inline */
  align?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'left' | 'right';
  /** The kind/style of the AI label */
  kind?: 'default' | 'inline' | 'hollow';
  /** Whether to show text alongside icon */
  textLabel?: string;
  /** Whether the AI label should be revert mode */
  revert?: boolean;
  /** Click handler for revert */
  onRevert?: () => void;
  /** Whether the AI label is disabled */
  disabled?: boolean;
  /** Custom class name */
  className?: string;
  /** AI Model name */
  aiModel?: string;
  /** AI Model link */
  aiModelLink?: string;
  /** Title for the explainability popover */
  aiTitle?: string;
  /** Description for the explainability popover */
  aiDescription?: string;
  /** How it works content */
  aiHowItWorks?: {
    title: string;
    description: string;
  }[];
  /** Whether to show the popover on click */
  showPopover?: boolean;
  /** Custom popover content */
  customPopoverContent?: React.ReactNode;
  /** Callback when popover opens */
  onPopoverOpen?: () => void;
  /** Callback when popover closes */
  onPopoverClose?: () => void;
}

const AILabel: React.FC<AILabelProps> = ({
  size = 'md',
  align = 'bottom-left',
  kind = 'default',
  textLabel,
  revert = false,
  onRevert,
  disabled = false,
  className = '',
  aiModel,
  aiModelLink,
  aiTitle = 'AI-generated content',
  aiDescription,
  aiHowItWorks,
  showPopover = true,
  customPopoverContent,
  onPopoverOpen,
  onPopoverClose,
}) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const labelRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (disabled) return;
    
    if (revert && onRevert) {
      onRevert();
      return;
    }
    
    if (showPopover) {
      setIsPopoverOpen(!isPopoverOpen);
      if (!isPopoverOpen) {
        onPopoverOpen?.();
      } else {
        onPopoverClose?.();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleClick();
    }
    if (e.key === 'Escape' && isPopoverOpen) {
      setIsPopoverOpen(false);
      onPopoverClose?.();
    }
  };

  // Close popover on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isPopoverOpen &&
        labelRef.current &&
        popoverRef.current &&
        !labelRef.current.contains(event.target as Node) &&
        !popoverRef.current.contains(event.target as Node)
      ) {
        setIsPopoverOpen(false);
        onPopoverClose?.();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPopoverOpen, onPopoverClose]);

  const iconSizes = {
    mini: 12,
    sm: 14,
    md: 16,
    lg: 20,
  };

  const classNames = [
    'ai-label',
    `ai-label--${size}`,
    `ai-label--${kind}`,
    revert ? 'ai-label--revert' : '',
    disabled ? 'ai-label--disabled' : '',
    isPopoverOpen ? 'ai-label--active' : '',
    className,
  ].filter(Boolean).join(' ');

  return (
    <div className="ai-label-wrapper">
      <button
        ref={labelRef}
        type="button"
        className={classNames}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        aria-label={revert ? 'Revert to AI-generated content' : 'AI-generated content - click for details'}
        aria-expanded={showPopover ? isPopoverOpen : undefined}
        aria-haspopup={showPopover ? 'dialog' : undefined}
      >
        {revert ? (
          <>
            <svg 
              width={iconSizes[size]} 
              height={iconSizes[size]} 
              viewBox="0 0 16 16" 
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 3.5C5.5 3.5 3.5 5.5 3.5 8H1.5L4 11L6.5 8H4.5C4.5 6 6 4.5 8 4.5C10 4.5 11.5 6 11.5 8C11.5 10 10 11.5 8 11.5V12.5C10.5 12.5 12.5 10.5 12.5 8C12.5 5.5 10.5 3.5 8 3.5Z" />
            </svg>
            {textLabel && <span className="ai-label__text">{textLabel}</span>}
          </>
        ) : (
          <>
            <Ai size={iconSizes[size]} aria-hidden="true" />
            {textLabel && <span className="ai-label__text">{textLabel}</span>}
          </>
        )}
      </button>

      {showPopover && isPopoverOpen && !revert && (
        <AIPopover
          ref={popoverRef}
          align={align}
          title={aiTitle}
          description={aiDescription}
          howItWorks={aiHowItWorks}
          modelName={aiModel}
          modelLink={aiModelLink}
          onClose={() => {
            setIsPopoverOpen(false);
            onPopoverClose?.();
          }}
          customContent={customPopoverContent}
        />
      )}
    </div>
  );
};

export default AILabel;
