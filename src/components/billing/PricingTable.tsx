'use client';

import { useState, useEffect } from 'react';
import { Grid, Column, Tile, Button, Tag, Loading } from '@carbon/react';
import { useTranslation } from '@/lib/i18n/context';

interface Plan {
  id: string;
  name: string;
  price: number;
  currency: string;
  interval: string;
  features: string[];
  recommended?: boolean;
}

const fallbackPlans: Plan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 9700,
    currency: 'brl',
    interval: 'month',
    features: ['5 users', '50 content items', '10k AI tokens/month', 'Basic reports'],
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 29700,
    currency: 'brl',
    interval: 'month',
    features: [
      '20 users',
      'Unlimited content',
      '50k AI tokens/month',
      'Advanced reports',
      'DNA Configurator',
      'Priority support',
    ],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99700,
    currency: 'brl',
    interval: 'month',
    features: [
      'Unlimited users',
      'Unlimited content',
      '200k AI tokens/month',
      'All features',
      'Custom integrations',
      '24/7 support',
    ],
  },
];

function formatPrice(priceInCents: number): string {
  return `R$ ${(priceInCents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

interface PricingTableProps {
  selectedPlanId?: string;
  onSelectPlan?: (planId: string) => void;
}

export default function PricingTable({ selectedPlanId, onSelectPlan }: PricingTableProps) {
  const { t } = useTranslation();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePlan, setActivePlan] = useState<string | null>(selectedPlanId ?? null);

  useEffect(() => {
    fetch('/api/stripe/plans')
      .then((res) => res.json())
      .then((data) => {
        if (data?.plans && Array.isArray(data.plans)) {
          setPlans(data.plans);
        } else {
          setPlans(fallbackPlans);
        }
      })
      .catch(() => {
        setPlans(fallbackPlans);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSelect = (planId: string) => {
    setActivePlan(planId);
    onSelectPlan?.(planId);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
        <Loading description={t('common.loading')} withOverlay={false} />
      </div>
    );
  }

  const displayPlans = plans.length > 0 ? plans : fallbackPlans;

  return (
    <Grid>
      {displayPlans.map((plan) => {
        const isRecommended = plan.recommended === true;
        const isSelected = activePlan === plan.id;
        const planNameKey = `pricing.${plan.id}` as const;
        const displayName = t(planNameKey) !== planNameKey ? t(planNameKey) : plan.name;

        return (
          <Column key={plan.id} lg={5} md={4} sm={4} style={{ marginBottom: '1rem' }}>
            <Tile
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                border: isRecommended
                  ? '2px solid var(--cds-interactive)'
                  : isSelected
                  ? '2px solid var(--cds-focus)'
                  : '1px solid var(--cds-border-subtle)',
                position: 'relative',
                padding: '1.5rem',
              }}
            >
              {/* Recommended badge */}
              {isRecommended && (
                <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)' }}>
                  <Tag type="blue" size="md">
                    {t('pricing.recommended')}
                  </Tag>
                </div>
              )}

              {/* Plan name */}
              <h3
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 600,
                  marginBottom: '0.5rem',
                  marginTop: isRecommended ? '0.5rem' : '0',
                  color: isRecommended ? 'var(--cds-interactive)' : 'var(--cds-text-primary)',
                }}
              >
                {displayName}
              </h3>

              {/* Price */}
              <div style={{ marginBottom: '1.5rem' }}>
                <span
                  style={{
                    fontSize: '2rem',
                    fontWeight: 700,
                    color: 'var(--cds-text-primary)',
                  }}
                >
                  {formatPrice(plan.price)}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--cds-text-secondary)',
                    marginLeft: '0.25rem',
                  }}
                >
                  {t('pricing.perMonth')}
                </span>
              </div>

              {/* Features list */}
              <ul
                style={{
                  listStyle: 'none',
                  padding: 0,
                  margin: 0,
                  flexGrow: 1,
                  marginBottom: '1.5rem',
                }}
              >
                {plan.features.map((feature, idx) => (
                  <li
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.375rem 0',
                      fontSize: '0.875rem',
                      color: 'var(--cds-text-secondary)',
                      borderBottom:
                        idx < plan.features.length - 1
                          ? '1px solid var(--cds-border-subtle-01)'
                          : 'none',
                    }}
                  >
                    <span
                      style={{
                        width: '6px',
                        height: '6px',
                        borderRadius: '50%',
                        background: isRecommended
                          ? 'var(--cds-interactive)'
                          : 'var(--cds-text-secondary)',
                        flexShrink: 0,
                      }}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {/* CTA Button */}
              <Button
                kind={isSelected ? 'tertiary' : isRecommended ? 'primary' : 'secondary'}
                style={{ width: '100%', maxWidth: '100%', justifyContent: 'center' }}
                onClick={() => handleSelect(plan.id)}
              >
                {isSelected ? t('pricing.currentPlan') : t('pricing.selectPlan')}
              </Button>
            </Tile>
          </Column>
        );
      })}
    </Grid>
  );
}
