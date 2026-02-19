import 'server-only';

/**
 * Circuit Breaker for AI provider resilience.
 *
 * States: CLOSED → OPEN → HALF_OPEN → CLOSED
 *
 * - CLOSED: requests pass through normally
 * - OPEN: requests fail immediately (provider is down)
 * - HALF_OPEN: one probe request allowed to test recovery
 *
 * Each provider has its own breaker instance.
 */

type CircuitState = 'CLOSED' | 'OPEN' | 'HALF_OPEN';

interface CircuitBreakerConfig {
  failureThreshold: number;     // failures before opening
  resetTimeoutMs: number;       // ms before attempting half-open
  halfOpenMaxAttempts: number;  // successful probes to close
}

interface BreakerState {
  state: CircuitState;
  failures: number;
  lastFailureTime: number;
  halfOpenSuccesses: number;
}

const DEFAULT_CONFIG: CircuitBreakerConfig = {
  failureThreshold: 3,
  resetTimeoutMs: 30_000,       // 30s before retry
  halfOpenMaxAttempts: 2,       // 2 successes to close
};

// In-memory state per provider (resets on deploy — acceptable for edge/serverless)
const breakers = new Map<string, BreakerState>();

function getBreaker(provider: string): BreakerState {
  if (!breakers.has(provider)) {
    breakers.set(provider, {
      state: 'CLOSED',
      failures: 0,
      lastFailureTime: 0,
      halfOpenSuccesses: 0,
    });
  }
  return breakers.get(provider)!;
}

export function getCircuitState(provider: string): CircuitState {
  const breaker = getBreaker(provider);

  if (breaker.state === 'OPEN') {
    const elapsed = Date.now() - breaker.lastFailureTime;
    if (elapsed >= DEFAULT_CONFIG.resetTimeoutMs) {
      breaker.state = 'HALF_OPEN';
      breaker.halfOpenSuccesses = 0;
    }
  }

  return breaker.state;
}

export function recordSuccess(provider: string): void {
  const breaker = getBreaker(provider);

  if (breaker.state === 'HALF_OPEN') {
    breaker.halfOpenSuccesses++;
    if (breaker.halfOpenSuccesses >= DEFAULT_CONFIG.halfOpenMaxAttempts) {
      breaker.state = 'CLOSED';
      breaker.failures = 0;
      breaker.halfOpenSuccesses = 0;
    }
  } else if (breaker.state === 'CLOSED') {
    breaker.failures = 0;
  }
}

export function recordFailure(provider: string): void {
  const breaker = getBreaker(provider);

  if (breaker.state === 'HALF_OPEN') {
    breaker.state = 'OPEN';
    breaker.lastFailureTime = Date.now();
    return;
  }

  breaker.failures++;
  breaker.lastFailureTime = Date.now();

  if (breaker.failures >= DEFAULT_CONFIG.failureThreshold) {
    breaker.state = 'OPEN';
  }
}

export function isProviderAvailable(provider: string): boolean {
  const state = getCircuitState(provider);
  return state !== 'OPEN';
}

/**
 * Get health status for all tracked providers.
 */
export function getAllCircuitStates(): Record<string, { state: CircuitState; failures: number }> {
  const result: Record<string, { state: CircuitState; failures: number }> = {};
  breakers.forEach((breaker, provider) => {
    result[provider] = {
      state: getCircuitState(provider),
      failures: breaker.failures,
    };
  });
  return result;
}
