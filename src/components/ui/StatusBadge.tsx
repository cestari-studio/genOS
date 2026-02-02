'use client';

import { Tag } from '@carbon/react';
import { 
  CheckmarkFilled, 
  Time, 
  WarningFilled, 
  CloseOutline,
  InProgress,
  Pending,
} from '@carbon/icons-react';
import './StatusBadge.scss';

type StatusType = 
  | 'active' | 'inactive' | 'pending' | 'approved' | 'rejected' 
  | 'in_progress' | 'completed' | 'cancelled' | 'draft' | 'review'
  | 'planning' | 'urgent' | 'high' | 'medium' | 'low';

interface StatusBadgeProps {
  status: StatusType | string;
  size?: 'sm' | 'md';
  showIcon?: boolean;
  customLabel?: string;
}

const statusConfig: Record<string, { 
  type: 'green' | 'blue' | 'gray' | 'red' | 'purple' | 'cyan' | 'magenta' | 'teal'; 
  label: string; 
  icon?: React.ElementType 
}> = {
  // Client/General Status
  active: { type: 'green', label: 'Ativo', icon: CheckmarkFilled },
  inactive: { type: 'gray', label: 'Inativo', icon: CloseOutline },
  pending: { type: 'blue', label: 'Pendente', icon: Time },
  approved: { type: 'green', label: 'Aprovado', icon: CheckmarkFilled },
  rejected: { type: 'red', label: 'Rejeitado', icon: CloseOutline },
  cancelled: { type: 'red', label: 'Cancelado', icon: CloseOutline },
  
  // Project Status
  planning: { type: 'cyan', label: 'Planejamento', icon: Pending },
  in_progress: { type: 'blue', label: 'Em Andamento', icon: InProgress },
  review: { type: 'purple', label: 'Em Revisão', icon: Time },
  completed: { type: 'green', label: 'Concluído', icon: CheckmarkFilled },
  
  // Document Status
  draft: { type: 'gray', label: 'Rascunho', icon: Time },
  
  // Priority
  urgent: { type: 'red', label: 'Urgente', icon: WarningFilled },
  high: { type: 'magenta', label: 'Alta' },
  medium: { type: 'blue', label: 'Média' },
  low: { type: 'gray', label: 'Baixa' },
  
  // Briefing Status
  needs_revision: { type: 'magenta', label: 'Revisão Necessária', icon: WarningFilled },
  in_review: { type: 'purple', label: 'Em Análise', icon: Time },
};

export default function StatusBadge({ 
  status, 
  size = 'sm', 
  showIcon = false,
  customLabel 
}: StatusBadgeProps) {
  const config = statusConfig[status] || { type: 'gray', label: status };
  const Icon = config.icon;
  
  return (
    <Tag 
      type={config.type} 
      size={size}
      className="status-badge"
    >
      {showIcon && Icon && <Icon size={12} className="status-badge__icon" />}
      {customLabel || config.label}
    </Tag>
  );
}
