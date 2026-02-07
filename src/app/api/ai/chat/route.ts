import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

interface ChatRequest {
  message: string;
  history?: { role: string; content: string }[];
}

// Fetch business context from Supabase for AI system prompt
async function getBusinessContext() {
  try {
    const supabase = await createClient();

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data: userData } = await supabase
      .from('users')
      .select('id, full_name, role, organization_id')
      .eq('auth_user_id', user.id)
      .single();

    if (!userData) return null;

    const orgId = userData.organization_id;

    // Fetch all context in parallel
    const [
      { data: org },
      { data: clients },
      { data: projects },
      { data: briefings },
      { data: posts },
      { data: brands },
      { data: invoices },
    ] = await Promise.all([
      supabase.from('organizations').select('name, slug, plan_type').eq('id', orgId).single(),
      supabase.from('clients').select('id, name, company_name, status, email').eq('organization_id', orgId).limit(20),
      supabase.from('projects').select('id, name, status, start_date, end_date, client_id').eq('organization_id', orgId).limit(20),
      supabase.from('briefings').select('id, title, status, priority, created_at, client_id').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(10),
      supabase.from('posts_v2').select('id, title, status, platform, scheduled_date').eq('organization_id', orgId).order('created_at', { ascending: false }).limit(10),
      supabase.from('brands').select('id, name, status').eq('organization_id', orgId).limit(10),
      supabase.from('invoices').select('id, status, total_amount, due_date, client_id').eq('organization_id', orgId).limit(10),
    ]);

    // Build client name map
    const clientMap: Record<string, string> = {};
    clients?.forEach(c => { clientMap[c.id] = c.company_name || c.name; });

    const activeClients = clients?.filter(c => c.status === 'active') || [];
    const activeProjects = projects?.filter(p => p.status === 'active' || p.status === 'in_progress') || [];
    const pendingBriefings = briefings?.filter(b => b.status === 'pending' || b.status === 'draft') || [];
    const pendingInvoices = invoices?.filter(i => i.status === 'pending' || i.status === 'overdue') || [];

    const totalRevenue = invoices?.reduce((sum, i) => sum + (i.total_amount || 0), 0) || 0;

    return {
      user: userData,
      org,
      summary: {
        totalClients: clients?.length || 0,
        activeClients: activeClients.length,
        totalProjects: projects?.length || 0,
        activeProjects: activeProjects.length,
        pendingBriefings: pendingBriefings.length,
        totalPosts: posts?.length || 0,
        totalBrands: brands?.length || 0,
        totalRevenue,
        pendingInvoices: pendingInvoices.length,
      },
      clients: clients?.map(c => ({
        name: c.company_name || c.name,
        status: c.status,
        email: c.email,
      })),
      projects: projects?.map(p => ({
        name: p.name,
        status: p.status,
        client: clientMap[p.client_id] || 'N/A',
        startDate: p.start_date,
        endDate: p.end_date,
      })),
      briefings: briefings?.map(b => ({
        title: b.title,
        status: b.status,
        priority: b.priority,
        client: clientMap[b.client_id] || 'N/A',
        createdAt: b.created_at,
      })),
      posts: posts?.map(p => ({
        title: p.title,
        status: p.status,
        platform: p.platform,
        scheduledDate: p.scheduled_date,
      })),
      brands: brands?.map(b => ({ name: b.name, status: b.status })),
    };
  } catch (error) {
    console.error('Error fetching business context:', error);
    return null;
  }
}

function buildSystemPrompt(context: Awaited<ReturnType<typeof getBusinessContext>>) {
  const now = new Date().toLocaleDateString('pt-BR', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  let contextBlock = '';

  if (context) {
    contextBlock = `
CONTEXTO DO NEGÓCIO (dados reais do genOS):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Organização: ${context.org?.name || 'N/A'} (${context.org?.plan_type || 'N/A'})
Usuário: ${context.user.full_name} (${context.user.role})
Data: ${now}

RESUMO:
● ${context.summary.totalClients} clientes (${context.summary.activeClients} ativos)
● ${context.summary.totalProjects} projetos (${context.summary.activeProjects} em andamento)
● ${context.summary.pendingBriefings} briefings pendentes
● ${context.summary.totalPosts} posts
● ${context.summary.totalBrands} marcas
● R$ ${context.summary.totalRevenue.toLocaleString('pt-BR')} receita total
● ${context.summary.pendingInvoices} faturas pendentes

CLIENTES:
${context.clients?.map(c => `  ● ${c.name} — ${c.status}`).join('\n') || '  Nenhum'}

PROJETOS:
${context.projects?.map(p => `  ● ${p.name} (${p.client}) — ${p.status}`).join('\n') || '  Nenhum'}

BRIEFINGS RECENTES:
${context.briefings?.map(b => `  ● ${b.title} (${b.client}) — ${b.status} [${b.priority}]`).join('\n') || '  Nenhum'}

POSTS RECENTES:
${context.posts?.map(p => `  ● ${p.title} — ${p.status} (${p.platform || 'N/A'})`).join('\n') || '  Nenhum'}

MARCAS:
${context.brands?.map(b => `  ● ${b.name} — ${b.status}`).join('\n') || '  Nenhum'}
`;
  }

  return `Você é o assistente IA da Cestari Studio, integrado ao genOS — plataforma de gestão de produção de conteúdo.

${contextBlock}

REGRAS DE FORMATAÇÃO (IMPORTANTE):
1. Responda como um terminal CLI — texto puro, sem markdown
2. NÃO use **bold**, # headers, ou formatação markdown
3. Use caracteres box-drawing para tabelas: ─ │ ┌ ┐ └ ┘ ├ ┤ ┬ ┴ ┼
4. Use ● para itens, ✓ para sucesso, ⚠ para avisos, ✗ para erros
5. Indente com 2 espaços
6. Seja conciso e acionável
7. Responda em português brasileiro
8. Quando listar dados, use formato tabular alinhado
9. Sempre baseie respostas nos dados reais acima quando disponíveis
10. Para ações, sugira o próximo passo concreto

PERSONALIDADE:
- Profissional mas acessível
- Direto ao ponto
- Proativo com sugestões
- Conhece design e produção de conteúdo`;
}

// Call Anthropic Claude API
async function callClaude(systemPrompt: string, message: string, history: { role: string; content: string }[] = []) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  const messages = [
    ...history.map(h => ({ role: h.role as 'user' | 'assistant', content: h.content })),
    { role: 'user' as const, content: message },
  ];

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: process.env.ANTHROPIC_MODEL || 'claude-sonnet-4-5-20250929',
      max_tokens: 1500,
      system: systemPrompt,
      messages,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(`Claude API error: ${response.status} — ${error.error?.message || 'Unknown'}`);
  }

  const data = await response.json();
  return data.content?.[0]?.text || 'Sem resposta.';
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();
    const { message, history = [] } = body;

    if (!message?.trim()) {
      return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 });
    }

    // Get business context
    const context = await getBusinessContext();
    const systemPrompt = buildSystemPrompt(context);

    // Call Claude
    let response: string | null = null;

    try {
      response = await callClaude(systemPrompt, message, history);
    } catch (e) {
      console.error('Claude error:', e);
    }

    // No API key configured — return helpful fallback
    if (!response) {
      if (!process.env.ANTHROPIC_API_KEY) {
        response = [
          '',
          '  ⚠ API Claude não configurada.',
          '',
          '  Para ativar o assistente, adicione a variável',
          '  de ambiente no Vercel:',
          '',
          '  ● ANTHROPIC_API_KEY → sua chave da Anthropic',
          '',
          '  Enquanto isso, use os comandos locais:',
          '  /clients  /projects  /briefings  /status',
          '',
        ].join('\n');
      } else {
        response = '  ⚠ Erro ao conectar com Claude. Tente novamente.';
      }
    }

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
