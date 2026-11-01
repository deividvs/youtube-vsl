import { validateChat } from './chat-validation.mjs'
import auth from './auth-hash.json' with { type: 'json' }
Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') return new Response(null, { status: 405 })
  const key = req.headers.get('x-ingest-key') || ''
  const hash = Array.from(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(key)))).map(b => b.toString(16).padStart(2, '0')).join('')
  if (hash !== auth.sha256) return new Response(null, { status: 401 })
  try {
    const raw = await req.text()
    if (new TextEncoder().encode(raw).length > 55000) return new Response(null, { status: 413 })
    const rows = validateChat(JSON.parse(raw))
    if (!rows) return new Response(null, { status: 400 })
    const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const response = await fetch(Deno.env.get('SUPABASE_URL') + '/rest/v1/youtube_vsl_chat_events?on_conflict=id', {
      method: 'POST', headers: { apikey: key, Authorization: 'Bearer ' + key,
        'Content-Type': 'application/json', Prefer: 'resolution=ignore-duplicates,return=minimal' }, body: JSON.stringify(rows) })
    return new Response(JSON.stringify({ ok: response.ok }), { status: response.ok ? 200 : 502, headers: { 'Content-Type': 'application/json' } })
  } catch { return new Response(null, { status: 500 }) }
})
