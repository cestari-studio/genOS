import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getStripe } from '@/lib/stripe/client';
import { apiSuccess, apiError } from '@/lib/validations/response';

export async function POST(request: NextRequest) {
  try {
    const orgId = request.headers.get('x-org-id');
    const userId = request.headers.get('x-user-id');
    if (!orgId || !userId) return apiError('Contexto de organização não encontrado', 403);

    const { price_id, pack_id, success_url, cancel_url } = await request.json();

    if (!price_id) return apiError('price_id é obrigatório', 400);

    const supabase = await createClient();
    const stripe = getStripe();

    // Get or create Stripe customer
    const { data: org } = await supabase
      .from('organizations')
      .select('stripe_customer_id, name')
      .eq('id', orgId)
      .single();

    let customerId = org?.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: { org_id: orgId },
        name: org?.name ?? undefined,
      });
      customerId = customer.id;

      await supabase
        .from('organizations')
        .update({ stripe_customer_id: customerId })
        .eq('id', orgId);
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: price_id, quantity: 1 }],
      mode: 'payment',
      success_url: success_url || `${request.headers.get('origin')}/billing?success=true`,
      cancel_url: cancel_url || `${request.headers.get('origin')}/billing?cancelled=true`,
      metadata: {
        org_id: orgId,
        pack_id: pack_id ?? '',
      },
    });

    return apiSuccess({ url: session.url });
  } catch (error) {
    console.error('Create checkout error:', error);
    return apiError('Erro ao criar sessão de checkout');
  }
}
