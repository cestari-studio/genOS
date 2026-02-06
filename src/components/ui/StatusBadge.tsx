'use client';

import React, { useMemo } from 'react';
import { Tag } from '@carbon/react';
import {
  Edit,
  UserFollow,
  User,
  InProgress,
  Send,
  Undo,
  CheckmarkFilled,
  Calendar,
  ErrorFilled,
  Archive,
} from '@carbon/icons-react';
import type { PostStatus } from '@/types/database';
import { POST_STATUS_CONFIG } from '@/types/database';

/**
 * Props for the StatusBadge component
 */
interface StatusBadgeProps {
  /** Post status from database */
  status: PostStatus;
  /** Size of the badge: sm or md (default: sm) */
  size?: 'sm' | 'md';
  /** Whether to show the icon (default: false) */
  showIcon?: boolean;
}

/**
 * Icon mapping for post statuses
 */
const STATUS_ICON_MAP: Record<PostStatus, React.ElementType> = {
  draft: Edit,
  awaiting_assignment: UserFollow,
  assigned: User,
  in_progress: InProgress,
  submitted: Send,
  revision_requested: Undo,
  approved: CheckmarkFilled,
  scheduled: Calendar,
  published: CheckmarkFilled,
  failed: ErrorFilled,
  archived: Archive,
};

/**
 * StatusBadge Component
 *
 * An enhanced status badge component for displaying v2 post statuses.
 * Uses Carbon Tag component with color-coded status indicators and optional icons.
 * Supports multiple sizes and dynamic status labeling from POST_STATUS_CONFIG.
 *
 * @example
 * ```tsx
 * <StatusBadge status="approved" size="md" showIcon={true} />
 * <StatusBadge status="in_progress" size="sm" />
 * ```
 */
export default function StatusBadge({ status, size = 'sm', showIcon = false }: StatusBadgeProps) {
  const config = useMemo(() => {
    return POST_STATUS_CONFIG[status];
  }, [status]);

  const Icon = useMemo(() => {
    return showIcon ? STATUS_ICON_MAP[status] : null;
  }, [status, showIcon]);

  const iconSize = useMemo(() => {
    return size === 'sm' ? 12 : 14;
  }, [size]);

  return (
    <Tag
      type={config.tagType}
      size={size}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
      }}
    >
      {Icon && <Icon size={iconSize} style={{ flexShrink: 0 }} />}
      <span>{config.label}</span>
    </Tag>
  );
}
