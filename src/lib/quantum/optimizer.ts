import 'server-only';

import { execFile } from 'child_process';
import { promisify } from 'util';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnySupabaseClient = import('@supabase/supabase-js').SupabaseClient<any, any, any>;

const execFileAsync = promisify(execFile);

interface OptimalSlot {
  dayOfWeek: number;
  hour: number;
  platform: string;
  score: number;
}

type OptimizationMethod = 'qaoa' | 'classical_greedy' | 'heuristic';

interface ScheduleOptimizationResult {
  brandId: string;
  optimizedSlots: OptimalSlot[];
  generatedAt: string;
  method: OptimizationMethod;
  energy?: number;
}

interface QiskitInput {
  slots: { day: number; hour: number; platform: string; engagement: number }[];
  max_posts_per_day: number;
  max_posts_per_platform_day: number;
}

interface QiskitOutput {
  selected_slots: { day: number; hour: number; platform: string; score: number }[];
  method: string;
  iterations: number;
  energy: number;
}

/**
 * Try to run the Qiskit QAOA optimizer via Python subprocess.
 * Falls back to heuristic if Python/Qiskit is not available.
 */
async function runQiskitOptimizer(input: QiskitInput): Promise<QiskitOutput | null> {
  const scriptPath = path.join(process.cwd(), 'src/lib/quantum/qiskit/schedule_optimizer.py');

  try {
    const { stdout, stderr } = await execFileAsync(
      'python3',
      [scriptPath],
      {
        timeout: 60_000,
        maxBuffer: 1024 * 1024,
        env: { ...process.env, PYTHONIOENCODING: 'utf-8' },
      },
    );

    if (stderr) {
      console.warn('Qiskit stderr:', stderr);
    }

    return JSON.parse(stdout) as QiskitOutput;
  } catch (error) {
    console.warn('Qiskit optimizer unavailable, using heuristic:', (error as Error).message);
    return null;
  }
}

/**
 * Content schedule optimizer.
 *
 * Strategy:
 * 1. Fetch historical engagement data from analytics_daily
 * 2. Build candidate slots with engagement scores
 * 3. Try Qiskit QAOA for optimal selection (quantum advantage for combinatorial optimization)
 * 4. Fall back to classical heuristic if Qiskit is unavailable
 */
export async function optimizeSchedule(
  supabase: AnySupabaseClient,
  brandId: string,
  orgId: string,
  dateRange?: { from: string; to: string }
): Promise<ScheduleOptimizationResult> {
  // Fetch historical engagement data
  const query = supabase
    .from('analytics_daily')
    .select('date, platform, engagement_rate, impressions, reach')
    .eq('organization_id', orgId);

  if (dateRange?.from) query.gte('date', dateRange.from);
  if (dateRange?.to) query.lte('date', dateRange.to);

  const { data: analytics } = await query.order('date', { ascending: false }).limit(90);

  // Build engagement heatmap per platform/day/hour
  const heatmap = new Map<string, { total: number; count: number }>();
  const peakHours = [9, 10, 12, 14, 17, 19, 21];

  for (const row of analytics ?? []) {
    const date = new Date(row.date);
    const dayOfWeek = date.getDay();

    for (const hour of peakHours) {
      const key = `${row.platform}-${dayOfWeek}-${hour}`;
      const existing = heatmap.get(key) ?? { total: 0, count: 0 };
      existing.total += row.engagement_rate ?? 0;
      existing.count += 1;
      heatmap.set(key, existing);
    }
  }

  // If no analytics data, return default schedule
  if (heatmap.size === 0) {
    const platforms = ['instagram', 'linkedin'];
    const defaultHours = [10, 18];
    const optimizedSlots: OptimalSlot[] = [];
    for (let day = 0; day < 7; day++) {
      for (const platform of platforms) {
        optimizedSlots.push({
          dayOfWeek: day,
          hour: defaultHours[day % 2],
          platform,
          score: 0,
        });
      }
    }
    return {
      brandId,
      optimizedSlots,
      generatedAt: new Date().toISOString(),
      method: 'heuristic',
    };
  }

  // Build candidate slots for optimizer
  const candidateSlots: QiskitInput['slots'] = [];
  for (const [key, value] of Array.from(heatmap.entries())) {
    const [platform, dayStr, hourStr] = key.split('-');
    const avgEngagement = value.count > 0 ? value.total / value.count : 0;
    candidateSlots.push({
      day: parseInt(dayStr),
      hour: parseInt(hourStr),
      platform,
      engagement: avgEngagement,
    });
  }

  // Try Qiskit QAOA first
  const qiskitInput: QiskitInput = {
    slots: candidateSlots,
    max_posts_per_day: 3,
    max_posts_per_platform_day: 1,
  };

  const qiskitResult = await runQiskitOptimizer(qiskitInput);

  if (qiskitResult && qiskitResult.selected_slots.length > 0) {
    return {
      brandId,
      optimizedSlots: qiskitResult.selected_slots.map(s => ({
        dayOfWeek: s.day,
        hour: s.hour,
        platform: s.platform,
        score: s.score,
      })),
      generatedAt: new Date().toISOString(),
      method: qiskitResult.method as OptimizationMethod,
      energy: qiskitResult.energy,
    };
  }

  // Classical fallback: sort by score and pick top slots
  candidateSlots.sort((a, b) => b.engagement - a.engagement);
  const optimizedSlots = candidateSlots.slice(0, 14).map(s => ({
    dayOfWeek: s.day,
    hour: s.hour,
    platform: s.platform,
    score: Math.round(s.engagement * 1000) / 1000,
  }));

  return {
    brandId,
    optimizedSlots,
    generatedAt: new Date().toISOString(),
    method: 'heuristic',
  };
}
