import 'server-only';

/**
 * APM Observability — Lightweight telemetry for genOS.
 *
 * Tracks: AI generation latency, provider health, error rates,
 * token consumption, and request throughput.
 *
 * In production, these metrics feed into external APM (Datadog, New Relic,
 * or IBM Instana). In dev, they log to console and audit_log.
 */

export interface MetricEvent {
  name: string;
  value: number;
  unit: 'ms' | 'count' | 'tokens' | 'bytes';
  tags: Record<string, string>;
  timestamp: number;
}

// In-memory ring buffer for recent metrics (last 1000 events)
const BUFFER_SIZE = 1000;
const metricsBuffer: MetricEvent[] = [];
let bufferIndex = 0;

function pushMetric(event: MetricEvent) {
  if (metricsBuffer.length < BUFFER_SIZE) {
    metricsBuffer.push(event);
  } else {
    metricsBuffer[bufferIndex % BUFFER_SIZE] = event;
  }
  bufferIndex++;
}

// ── Public API ─────────────────────────────────────────────────

export function trackLatency(
  operation: string,
  durationMs: number,
  tags: Record<string, string> = {}
) {
  pushMetric({
    name: `genos.${operation}.latency`,
    value: durationMs,
    unit: 'ms',
    tags,
    timestamp: Date.now(),
  });
}

export function trackTokenUsage(
  provider: string,
  tokens: number,
  tags: Record<string, string> = {}
) {
  pushMetric({
    name: 'genos.ai.tokens',
    value: tokens,
    unit: 'tokens',
    tags: { provider, ...tags },
    timestamp: Date.now(),
  });
}

export function trackError(
  operation: string,
  tags: Record<string, string> = {}
) {
  pushMetric({
    name: `genos.${operation}.error`,
    value: 1,
    unit: 'count',
    tags,
    timestamp: Date.now(),
  });
}

export function trackRequest(
  route: string,
  method: string,
  statusCode: number,
  durationMs: number,
) {
  pushMetric({
    name: 'genos.http.request',
    value: durationMs,
    unit: 'ms',
    tags: { route, method, status: String(statusCode) },
    timestamp: Date.now(),
  });
}

// ── Aggregation ────────────────────────────────────────────────

interface AggregatedMetrics {
  ai: {
    totalRequests: number;
    avgLatencyMs: number;
    p95LatencyMs: number;
    errorRate: number;
    totalTokens: number;
    byProvider: Record<string, { count: number; avgLatency: number; errors: number }>;
  };
  http: {
    totalRequests: number;
    avgLatencyMs: number;
    errorRate: number;
  };
}

export function getAggregatedMetrics(windowMs: number = 300_000): AggregatedMetrics {
  const cutoff = Date.now() - windowMs;
  const recent = metricsBuffer.filter(m => m.timestamp >= cutoff);

  // AI metrics
  const aiLatencies = recent.filter(m => m.name.includes('ai') && m.unit === 'ms');
  const aiErrors = recent.filter(m => m.name.includes('ai') && m.name.includes('error'));
  const aiTokens = recent.filter(m => m.name === 'genos.ai.tokens');

  const sortedLatencies = aiLatencies.map(m => m.value).sort((a, b) => a - b);
  const p95Index = Math.floor(sortedLatencies.length * 0.95);

  // Per-provider breakdown
  const byProvider: Record<string, { count: number; totalLatency: number; errors: number }> = {};
  for (const m of aiLatencies) {
    const p = m.tags.provider ?? 'unknown';
    if (!byProvider[p]) byProvider[p] = { count: 0, totalLatency: 0, errors: 0 };
    byProvider[p].count++;
    byProvider[p].totalLatency += m.value;
  }
  for (const m of aiErrors) {
    const p = m.tags.provider ?? 'unknown';
    if (!byProvider[p]) byProvider[p] = { count: 0, totalLatency: 0, errors: 0 };
    byProvider[p].errors++;
  }

  const providerStats: Record<string, { count: number; avgLatency: number; errors: number }> = {};
  for (const [p, s] of Object.entries(byProvider)) {
    providerStats[p] = {
      count: s.count,
      avgLatency: s.count > 0 ? Math.round(s.totalLatency / s.count) : 0,
      errors: s.errors,
    };
  }

  // HTTP metrics
  const httpMetrics = recent.filter(m => m.name === 'genos.http.request');
  const httpErrors = httpMetrics.filter(m => parseInt(m.tags.status ?? '200') >= 500);

  return {
    ai: {
      totalRequests: aiLatencies.length,
      avgLatencyMs: aiLatencies.length > 0
        ? Math.round(aiLatencies.reduce((s, m) => s + m.value, 0) / aiLatencies.length)
        : 0,
      p95LatencyMs: sortedLatencies[p95Index] ?? 0,
      errorRate: aiLatencies.length > 0 ? aiErrors.length / aiLatencies.length : 0,
      totalTokens: aiTokens.reduce((s, m) => s + m.value, 0),
      byProvider: providerStats,
    },
    http: {
      totalRequests: httpMetrics.length,
      avgLatencyMs: httpMetrics.length > 0
        ? Math.round(httpMetrics.reduce((s, m) => s + m.value, 0) / httpMetrics.length)
        : 0,
      errorRate: httpMetrics.length > 0 ? httpErrors.length / httpMetrics.length : 0,
    },
  };
}

// ── Health endpoint data ───────────────────────────────────────
export function getHealthSnapshot() {
  const metrics = getAggregatedMetrics(60_000); // last 60s
  return {
    status: metrics.ai.errorRate < 0.5 ? 'healthy' : 'degraded',
    uptime: process.uptime(),
    metrics,
  };
}
