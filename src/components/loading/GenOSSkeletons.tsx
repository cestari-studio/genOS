'use client';

import {
  Grid,
  Column,
  SkeletonText,
  SkeletonPlaceholder,
  Tile,
} from '@carbon/react';

/**
 * 2a. ContentMatrixSkeleton — Grid skeleton for Content Factory pages.
 * Simulates image cards (1:1 and 9:16 ratios) with caption placeholders.
 */
interface ContentMatrixSkeletonProps {
  columns?: number;
  rows?: number;
  ratio?: '1:1' | '9:16';
}

export function ContentMatrixSkeleton({
  columns = 4,
  rows = 3,
  ratio = '1:1',
}: ContentMatrixSkeletonProps) {
  const aspectRatio = ratio === '9:16' ? '177.78%' : '100%';
  const count = columns * rows;

  return (
    <Grid>
      {Array.from({ length: count }).map((_, i) => (
        <Column key={i} lg={16 / columns} md={8 / Math.min(columns, 4)} sm={4}>
          <Tile style={{ marginBottom: '1rem', padding: 0, overflow: 'hidden' }}>
            <div style={{ position: 'relative', width: '100%', paddingTop: aspectRatio }}>
              <div style={{ position: 'absolute', inset: 0 }}>
                <SkeletonPlaceholder
                  style={{ width: '100%', height: '100%' }}
                />
              </div>
            </div>
            <div style={{ padding: '0.75rem 1rem' }}>
              <SkeletonText heading width="70%" />
              <div style={{ marginTop: '0.5rem' }}>
                <SkeletonText width="90%" />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
                <SkeletonText width="60px" />
                <SkeletonText width="80px" />
              </div>
            </div>
          </Tile>
        </Column>
      ))}
    </Grid>
  );
}

/**
 * 2b. DashboardChartSkeleton — Pre-loads chart spaces without CLS.
 * Matches Carbon Charts container dimensions.
 */
interface DashboardChartSkeletonProps {
  height?: number;
  columns?: 1 | 2 | 3;
}

export function DashboardChartSkeleton({
  height = 300,
  columns = 2,
}: DashboardChartSkeletonProps) {
  const colSpan = Math.floor(16 / columns);

  return (
    <Grid>
      {Array.from({ length: columns }).map((_, i) => (
        <Column key={i} lg={colSpan} md={8} sm={4}>
          <Tile style={{ marginBottom: '1rem' }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem',
            }}>
              <SkeletonText heading width="40%" />
              <SkeletonText width="80px" />
            </div>
            <SkeletonPlaceholder style={{ width: '100%', height: `${height}px` }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
              <SkeletonText width="100px" />
              <SkeletonText width="100px" />
              <SkeletonText width="100px" />
            </div>
          </Tile>
        </Column>
      ))}
    </Grid>
  );
}

/**
 * 2c. DataTableSkeleton — Skeleton for table-heavy pages (Tenant List, Content List).
 */
interface DataTableSkeletonProps {
  rowCount?: number;
  columnCount?: number;
}

export function DataTableSkeleton({
  rowCount = 8,
  columnCount = 5,
}: DataTableSkeletonProps) {
  return (
    <Tile style={{ padding: '1rem' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '1rem',
      }}>
        <SkeletonText heading width="200px" />
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <SkeletonText width="120px" />
          <SkeletonText width="80px" />
        </div>
      </div>

      {/* Table header */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
        gap: '1rem',
        padding: '0.75rem 1rem',
        borderBottom: '2px solid var(--cds-border-strong-01, #8d8d8d)',
        marginBottom: '0.25rem',
      }}>
        {Array.from({ length: columnCount }).map((_, i) => (
          <SkeletonText key={i} width={i === 0 ? '80%' : '60%'} />
        ))}
      </div>

      {/* Table rows */}
      {Array.from({ length: rowCount }).map((_, row) => (
        <div
          key={row}
          style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
            gap: '1rem',
            padding: '0.75rem 1rem',
            borderBottom: '1px solid var(--cds-border-subtle-01, #e0e0e0)',
          }}
        >
          {Array.from({ length: columnCount }).map((_, col) => (
            <SkeletonText key={col} width={`${50 + Math.random() * 40}%`} />
          ))}
        </div>
      ))}
    </Tile>
  );
}

/**
 * 2d. StatsCardsSkeleton — Skeleton for the dashboard stat cards grid.
 */
export function StatsCardsSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div className="stats-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="stat-card">
          <div style={{ marginBottom: '0.5rem' }}>
            <SkeletonText width="40%" />
          </div>
          <SkeletonText heading width="60%" />
          <div style={{ marginTop: '0.25rem' }}>
            <SkeletonText width="50px" />
          </div>
        </div>
      ))}
    </div>
  );
}
