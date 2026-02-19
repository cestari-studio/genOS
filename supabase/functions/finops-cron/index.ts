/**
 * FinOps CRON — Supabase Edge Function
 *
 * Runs daily (via pg_cron or Supabase CRON trigger) to:
 * 1. Calculate token consumption per organization
 * 2. Check balance thresholds and flag alerts
 * 3. Reset monthly balances on cycle_end_date
 * 4. Generate FinOps summary report in audit_log
 *
 * Deploy: supabase functions deploy finops-cron
 * Schedule: SELECT cron.schedule('finops-daily', '0 3 * * *', ...);
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ALERT_THRESHOLD = 0.15; // Alert when 15% balance remaining
const CRITICAL_THRESHOLD = 0.05; // Critical when 5% remaining

Deno.serve(async (req: Request) => {
  try {
    // Verify authorization
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { db: { schema: 'cestari' } }
    );

    // 1. Fetch all organizations
    const { data: orgs, error: orgsError } = await supabase
      .from('organizations')
      .select('id, name, token_balance, token_multiplier, cycle_end_date, monthly_retainer');

    if (orgsError) throw orgsError;

    const now = new Date();
    const results = {
      processed: 0,
      alerts: [] as { org_id: string; org_name: string; level: string; balance: number }[],
      resets: 0,
    };

    for (const org of orgs ?? []) {
      results.processed++;

      // 2. Calculate daily token usage (last 24h)
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
      const { data: usage } = await supabase
        .from('audit_log')
        .select('tokens_used')
        .eq('organization_id', org.id)
        .eq('action', 'ai_generate')
        .gte('created_at', yesterday)
        .not('tokens_used', 'is', null);

      const dailyTokens = (usage ?? []).reduce(
        (sum: number, row: { tokens_used: number | null }) => sum + (row.tokens_used ?? 0), 0
      );
      const dailyCost = Math.ceil(dailyTokens * (org.token_multiplier ?? 2.5));

      // 3. Check balance thresholds
      const initialBalance = 500_000; // default
      const balanceRatio = (org.token_balance ?? 0) / initialBalance;

      if (balanceRatio <= CRITICAL_THRESHOLD) {
        results.alerts.push({
          org_id: org.id,
          org_name: org.name,
          level: 'critical',
          balance: org.token_balance ?? 0,
        });
      } else if (balanceRatio <= ALERT_THRESHOLD) {
        results.alerts.push({
          org_id: org.id,
          org_name: org.name,
          level: 'warning',
          balance: org.token_balance ?? 0,
        });
      }

      // 4. Reset balance if cycle ended
      if (org.cycle_end_date) {
        const cycleEnd = new Date(org.cycle_end_date);
        if (now >= cycleEnd) {
          // Reset to default balance, advance cycle by 30 days
          const nextCycle = new Date(cycleEnd.getTime() + 30 * 24 * 60 * 60 * 1000);
          await supabase
            .from('organizations')
            .update({
              token_balance: initialBalance,
              cycle_end_date: nextCycle.toISOString(),
            })
            .eq('id', org.id);
          results.resets++;
        }
      }

      // 5. Log daily FinOps summary per org
      await supabase.from('audit_log').insert({
        organization_id: org.id,
        action: 'finops_daily_report',
        details: {
          daily_tokens: dailyTokens,
          daily_cost: dailyCost,
          remaining_balance: org.token_balance,
          balance_ratio: balanceRatio,
          multiplier: org.token_multiplier,
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: now.toISOString(),
        ...results,
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('FinOps CRON error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
});
