import 'server-only';

/**
 * ISR & data caching utilities for genOS.
 *
 * Next.js App Router revalidation constants and helpers.
 * Use `revalidate` export in page/layout files for ISR,
 * or use `unstable_cache` wrappers for per-query caching.
 */

// ── Revalidation intervals (seconds) ──────────────────────────
export const REVALIDATE = {
  /** Dashboard stats: refresh every 60s */
  DASHBOARD: 60,
  /** Analytics / GEO data: refresh every 5 min */
  ANALYTICS: 300,
  /** Brand list: refresh every 2 min */
  BRANDS: 120,
  /** Content list: refresh every 30s (frequent updates) */
  CONTENT: 30,
  /** Pricing / billing: refresh every 10 min */
  BILLING: 600,
  /** Public pages (login, forgot-password): 1 hour */
  STATIC: 3600,
} as const;

// ── Stale-While-Revalidate headers for API routes ─────────────
export function swrHeaders(maxAge: number, staleWhileRevalidate: number = maxAge) {
  return {
    'Cache-Control': `public, s-maxage=${maxAge}, stale-while-revalidate=${staleWhileRevalidate}`,
  };
}

// ── Deduplicated fetch with tags (for on-demand revalidation) ──
export function taggedFetch(tags: string[]) {
  return { next: { tags, revalidate: REVALIDATE.DASHBOARD } };
}
