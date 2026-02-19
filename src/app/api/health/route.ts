import { NextResponse } from 'next/server';
import { getAllCircuitStates } from '@/lib/ai/circuit-breaker';
import { getHealthSnapshot } from '@/lib/observability';

export const dynamic = 'force-dynamic';

export async function GET() {
  const health = getHealthSnapshot();
  const circuits = getAllCircuitStates();

  return NextResponse.json({
    ...health,
    circuits,
    timestamp: new Date().toISOString(),
    version: '4.5.0',
  });
}
