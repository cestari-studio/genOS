import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  const supabase = await createClient();

  // Try to fetch real data from posts_v2 if it exists
  const { data: posts } = await supabase
    .from('posts_v2')
    .select('created_at, platform, engagement_rate, impressions, reach')
    .order('created_at', { ascending: true })
    .limit(100);

  if (posts && posts.length > 0) {
    // Aggregate by month for charts
    const monthlyData: Record<string, { count: number; engagement: number; impressions: number }> = {};
    for (const post of posts) {
      const month = new Date(post.created_at).toISOString().slice(0, 7);
      if (!monthlyData[month]) monthlyData[month] = { count: 0, engagement: 0, impressions: 0 };
      monthlyData[month].count++;
      monthlyData[month].engagement += post.engagement_rate || 0;
      monthlyData[month].impressions += post.impressions || 0;
    }

    return NextResponse.json({
      contentVolume: Object.entries(monthlyData).map(([month, d]) => ({
        group: 'Content',
        date: month,
        value: d.count,
      })),
      engagement: Object.entries(monthlyData).map(([month, d]) => ({
        group: 'Engagement',
        date: month,
        value: d.count > 0 ? Math.round((d.engagement / d.count) * 100) / 100 : 0,
      })),
    });
  }

  // Fallback: mock data for demo
  const months = ['2025-07', '2025-08', '2025-09', '2025-10', '2025-11', '2025-12', '2026-01', '2026-02'];
  return NextResponse.json({
    contentVolume: months.map((m, i) => ({
      group: 'Content',
      date: m,
      value: 12 + Math.floor(Math.random() * 20) + i * 3,
    })),
    engagement: months.map((m) => ({
      group: 'Engagement',
      date: m,
      value: +(2.5 + Math.random() * 4).toFixed(1),
    })),
    revenue: months.map((m, i) => ({
      group: 'Revenue',
      date: m,
      value: 15000 + Math.floor(Math.random() * 10000) + i * 2000,
    })),
  });
}
