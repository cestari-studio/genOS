import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const platform = searchParams.get('platform') || 'all';

  const supabase = await createClient();

  // Try to fetch real data
  const query = supabase
    .from('posts_v2')
    .select('platform, engagement_rate, impressions, reach, saves, shares')
    .order('created_at', { ascending: false })
    .limit(200);

  if (platform !== 'all') {
    query.eq('platform', platform);
  }

  const { data: posts } = await query;

  if (posts && posts.length > 0) {
    const byPlatform: Record<string, { engagement: number; impressions: number; reach: number; saves: number; shares: number; count: number }> = {};
    for (const post of posts) {
      const p = post.platform || 'other';
      if (!byPlatform[p]) byPlatform[p] = { engagement: 0, impressions: 0, reach: 0, saves: 0, shares: 0, count: 0 };
      byPlatform[p].engagement += post.engagement_rate || 0;
      byPlatform[p].impressions += post.impressions || 0;
      byPlatform[p].reach += post.reach || 0;
      byPlatform[p].saves += post.saves || 0;
      byPlatform[p].shares += post.shares || 0;
      byPlatform[p].count++;
    }

    const radarData = Object.entries(byPlatform).flatMap(([p, d]) => [
      { group: p, key: 'Engagement', value: d.count > 0 ? Math.round(d.engagement / d.count * 10) : 0 },
      { group: p, key: 'Impressions', value: Math.min(100, Math.round(d.impressions / d.count / 1000)) },
      { group: p, key: 'Reach', value: Math.min(100, Math.round(d.reach / d.count / 500)) },
      { group: p, key: 'Saves', value: Math.min(100, Math.round(d.saves / d.count)) },
      { group: p, key: 'Shares', value: Math.min(100, Math.round(d.shares / d.count)) },
    ]);

    return NextResponse.json({ radarData, platforms: Object.keys(byPlatform) });
  }

  // Fallback: mock data
  const platforms = ['Instagram', 'LinkedIn', 'TikTok', 'YouTube'];
  const metrics = ['Engagement', 'Impressions', 'Reach', 'Saves', 'Shares'];
  const radarData = platforms.flatMap((p) =>
    metrics.map((m) => ({
      group: p,
      key: m,
      value: 20 + Math.floor(Math.random() * 80),
    }))
  );

  return NextResponse.json({ radarData, platforms });
}
