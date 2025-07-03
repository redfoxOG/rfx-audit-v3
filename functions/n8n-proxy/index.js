import { serve } from 'https://deno.land/std@0.192.0/http/server.ts'

console.log('n8n-proxy function started')

serve(async (req) => {
  const n8nUrl = Deno.env.get('N8N_WEBHOOK_URL')
  if (!n8nUrl) {
    return new Response('Missing N8N_WEBHOOK_URL', { status: 500 })
  }

  const res = await fetch(n8nUrl, {
    method: req.method,
    headers: { 'Content-Type': 'application/json' },
    body: req.method === 'GET' ? undefined : await req.text()
  })

  return new Response(await res.text(), {
    status: res.status,
    headers: { 'Content-Type': 'application/json' }
  })
})
