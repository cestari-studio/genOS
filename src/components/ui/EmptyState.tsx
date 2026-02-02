'use client';

import { Button } from '@carbon/react';
import { Add, Search, Document, Folder, UserMultiple } from '@carbon/icons-react';
import './EmptyState.scss';

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ElementType;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  variant?: 'default' | 'search' | 'error';
}

export default function EmptyState({
  icon: Icon = Document,
  title,
  description,
  action,
  secondaryAction,
  variant = 'default',
}: EmptyStateProps) {
  const getVariantIcon = () => {
    switch (variant) {
      case 'search':
        return Search;
      case 'error':
        return Document;
      default:
        return Icon;
    }
  };

  const VariantIcon = getVariantIcon();

  return (
    <div className={`empty-state empty-state--${variant}`}>
      <div className="empty-state__icon">
        <VariantIcon size={48} />
      </div>
      
      <h3 className="empty-state__title">{title}</h3>
      
      {description && (
        <p className="empty-state__description">{description}</p>
      )}
      
      <div className="empty-state__actions">
        {action && (
          <Button 
            renderIcon={action.icon || Add}
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        )}
        
        {secondaryAction && (
          <Button 
            kind="tertiary"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </div>
  );
}
