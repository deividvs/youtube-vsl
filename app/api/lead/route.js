import { NextResponse } from 'next/server'

/* Server-side proxy to the Clint CRM webhook.
 *
 * The browser POSTs the lead here (same-origin JSON). This route validates,
 * normalizes and forwards it to Clint from the server, so:
 *   - the real webhook URL never reaches the client (kept in CLINT_WEBHOOK_URL);
 *   - there is no CORS / no-cors silent loss — we can read Clint's response;
 *   - the phone is normalized and failures are logged.
 */

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const DEFAULT_WEBHOOK =
  'https://functions-api.clint.digital/endpoints/integration/webhook/bf9aa1eb-e684-4c0a-803d-2cd8314fc0b2'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(request) {
  let payload
  try {
    payload = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 })
  }

  const name = String(payload?.name ?? '').trim()
  const email = String(payload?.email ?? '').trim()
  const phoneRaw = String(payload?.phone ?? '').trim()
  const phoneDigits = phoneRaw.replace(/\D/g, '')

  if (name.length < 2) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }
  if (phoneDigits.length < 8) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const data =
    String(payload?.data ?? '').trim() || new Date().toLocaleString('pt-BR')
  const origem = String(payload?.origem ?? '').trim()

  // Sent in both English and Portuguese to guarantee the Clint field mapping.
  const body = {
    name,
    email,
    phone: phoneRaw,
    nome: name,
    telefone: phoneRaw,
    data,
    origem,
  }

  const webhook = process.env.CLINT_WEBHOOK_URL || DEFAULT_WEBHOOK

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!res.ok) {
      const text = await res.text().catch(() => '')
      console.error('[api/lead] Clint webhook failed', res.status, text.slice(0, 500))
      return NextResponse.json({ ok: false, error: 'webhook_failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/lead] Clint webhook error', err)
    return NextResponse.json({ ok: false, error: 'webhook_error' }, { status: 502 })
  }
}
