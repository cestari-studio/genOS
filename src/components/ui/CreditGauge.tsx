'use client';

import React, { useMemo } from 'react';

/**
 * Props for the CreditGauge component
 */
interface CreditGaugeProps {
  /** Total credits available */
  total: number;
  /** Credits already used */
  used: number;
  /** Size of the gauge: sm=80px, md=120px, lg=160px */
  size?: 'sm' | 'md' | 'lg';
  /** Whether to show the label below (default: true) */
  showLabel?: boolean;
  /** Expiration date in ISO format */
  expiresAt?: string | null;
}

/**
 * CreditGauge Component
 *
 * A circular SVG gauge that visualizes credit usage percentage.
 * Uses color-coded indicators: green (>50% remaining), yellow (25-50%), red (<25%).
 * Displays remaining/total credits in the center with optional expiration label.
 *
 * @example
 * ```tsx
 * <CreditGauge
 *   total={1000}
 *   used={250}
 *   size="md"
 *   showLabel={true}
 *   expiresAt="2026-12-31"
 * />
 * ```
 */
export default function CreditGauge({
  total,
  used,
  size = 'md',
  showLabel = true,
  expiresAt,
}: CreditGaugeProps) {
  const gaugeConfig = useMemo(() => {
    const configs = {
      sm: {
        diameter: 80,
        strokeWidth: 4,
        fontSize: 12,
        labelFontSize: 10,
      },
      md: {
        diameter: 120,
        strokeWidth: 6,
        fontSize: 16,
        labelFontSize: 12,
      },
      lg: {
        diameter: 160,
        strokeWidth: 8,
        fontSize: 20,
        labelFontSize: 14,
      },
    };
    return configs[size];
  }, [size]);

  const remaining = Math.max(0, total - used);
  const percentage = total > 0 ? (remaining / total) * 100 : 0;
  const daysUntilExpiry = useMemo(() => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }, [expiresAt]);

  // Determine color based on remaining percentage
  const getColor = (): string => {
    if (percentage > 50) {
      return 'var(--genos-success, #24A148)'; // Green
    } else if (percentage >= 25) {
      return 'var(--genos-warning, #F1C21B)'; // Yellow
    } else {
      return 'var(--genos-danger, #DA1E28)'; // Red
    }
  };

  const radius = gaugeConfig.diameter / 2 - gaugeConfig.strokeWidth / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage / 100);

  const containerSize = gaugeConfig.diameter + 20;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
      }}
    >
      {/* SVG Gauge */}
      <svg
        width={gaugeConfig.diameter}
        height={gaugeConfig.diameter}
        viewBox={`0 0 ${gaugeConfig.diameter} ${gaugeConfig.diameter}`}
        style={{
          transform: 'rotate(-90deg)',
        }}
      >
        {/* Background circle */}
        <circle
          cx={gaugeConfig.diameter / 2}
          cy={gaugeConfig.diameter / 2}
          r={radius}
          fill="none"
          stroke="var(--genos-border-subtle, #E0E0E0)"
          strokeWidth={gaugeConfig.strokeWidth}
        />

        {/* Progress circle */}
        <circle
          cx={gaugeConfig.diameter / 2}
          cy={gaugeConfig.diameter / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth={gaugeConfig.strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          style={{
            transition: 'stroke-dashoffset 0.3s ease, stroke 0.3s ease',
          }}
        />

        {/* Center text container - remaining/total */}
        <g>
          <text
            x={gaugeConfig.diameter / 2}
            y={gaugeConfig.diameter / 2 - 5}
            textAnchor="middle"
            dy="0.3em"
            fill="var(--genos-text-primary, #161616)"
            fontSize={gaugeConfig.fontSize}
            fontWeight="bold"
            style={{
              pointerEvents: 'none',
            }}
          >
            {remaining}
          </text>
          <text
            x={gaugeConfig.diameter / 2}
            y={gaugeConfig.diameter / 2 + 10}
            textAnchor="middle"
            dy="0.3em"
            fill="var(--genos-text-secondary, #525252)"
            fontSize={gaugeConfig.labelFontSize}
            style={{
              pointerEvents: 'none',
            }}
          >
            /{total}
          </text>
        </g>
      </svg>

      {/* Optional expiration label */}
      {showLabel && (
        <div
          style={{
            fontSize: '12px',
            color: 'var(--genos-text-secondary, #525252)',
            textAlign: 'center',
            marginTop: '4px',
          }}
        >
          {expiresAt && daysUntilExpiry !== null ? (
            <span>
              Expira em{' '}
              <strong>
                {daysUntilExpiry > 0 ? daysUntilExpiry : '0'} dia{daysUntilExpiry !== 1 ? 's' : ''}
              </strong>
            </span>
          ) : expiresAt ? (
            <span>Expira em {new Date(expiresAt).toLocaleDateString('pt-BR')}</span>
          ) : (
            <span>Sem data de expiração</span>
          )}
        </div>
      )}
    </div>
  );
}
