import { NextResponse } from 'next/server';

// Hardcoded plans - in production would fetch from Stripe products/prices
const plans = [
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
    features: ['20 users', 'Unlimited content', '50k AI tokens/month', 'Advanced reports', 'DNA Configurator', 'Priority support'],
    recommended: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99700,
    currency: 'brl',
    interval: 'month',
    features: ['Unlimited users', 'Unlimited content', '200k AI tokens/month', 'All features', 'Custom integrations', '24/7 support'],
  },
];

export async function GET() {
  return NextResponse.json({ plans });
}
