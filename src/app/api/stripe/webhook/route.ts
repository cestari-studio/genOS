import { NextRequest, NextResponse } from 'next/server';
import { getStripe } from '@/lib/stripe/client';
import { createAdminClient } from '@/lib/supabase/admin';
import type Stripe from 'stripe';

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const body = await request.text();
  const sig = request.headers.get('stripe-signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !webhookSecret) {
    return NextResponse.json({ error: 'Missing signature or webhook secret' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  const adminSupabase = createAdminClient();

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const orgId = session.metadata?.org_id;
        const packId = session.metadata?.pack_id;

        if (orgId && packId) {
          await adminSupabase.from('client_purchases').insert({
            organization_id: orgId,
            pack_id: packId,
            stripe_session_id: session.id,
            amount: session.amount_total ? session.amount_total / 100 : 0,
            currency: session.currency,
            status: 'completed',
          });
        }
        break;
      }

      case 'invoice.paid': {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        // Find org by stripe customer ID
        const { data: org } = await adminSupabase
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (org) {
          await adminSupabase.from('audit_log').insert({
            organization_id: org.id,
            action: 'invoice_paid',
            details: {
              invoice_id: invoice.id,
              amount: invoice.amount_paid / 100,
            },
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const { data: org } = await adminSupabase
          .from('organizations')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (org) {
          await adminSupabase
            .from('organizations')
            .update({ subscription_tier: 'seed' })
            .eq('id', org.id);

          await adminSupabase.from('audit_log').insert({
            organization_id: org.id,
            action: 'subscription_cancelled',
            details: { subscription_id: subscription.id },
          });
        }
        break;
      }
    }
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
