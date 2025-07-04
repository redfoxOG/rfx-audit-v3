import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';
import Stripe from 'https://esm.sh/stripe@12.16.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const siteUrl = Deno.env.get('SITE_URL');

if (!stripeSecret || !supabaseUrl || !serviceKey || !siteUrl) {
  throw new Error('Missing environment configuration');
}

const supabase = createClient(supabaseUrl, serviceKey);
const stripe = new Stripe(stripeSecret, { apiVersion: '2023-10-16' });

serve(async (req) => {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data: { user }, error: userError } = await supabase.auth.getUser(authHeader.replace('Bearer ', ''));
  if (userError || !user) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('stripe_customer_id')
    .eq('id', user.id)
    .single();

  if (error || !data?.stripe_customer_id) {
    return new Response('Customer not found', { status: 400 });
  }

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${siteUrl}/settings`,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { status: 500 });
  }
});
