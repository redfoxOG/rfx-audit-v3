import { serve } from 'https://deno.land/std@0.192.0/http/server.ts';

console.log('create-portal-link function started');

serve(() => {
  const portalUrl = Deno.env.get('BILLING_PORTAL_URL');
  if (!portalUrl) {
    return new Response('Missing BILLING_PORTAL_URL', { status: 500 });
  }

  return new Response(JSON.stringify({ url: portalUrl }), {
    headers: { 'Content-Type': 'application/json' }
  });
});
