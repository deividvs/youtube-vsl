import { NextResponse } from 'next/server'

// Server-side delivery to Google Sheets and Clint. Secrets never reach the browser.

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
  const id = String(payload?.id ?? '')

  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(id)) {
    return NextResponse.json({ ok: false, error: 'invalid_id' }, { status: 400 })
  }

  if (name.length < 2 || name.length > 150) {
    return NextResponse.json({ ok: false, error: 'invalid_name' }, { status: 400 })
  }
  if (phoneDigits.length < 8 || phoneRaw.length > 40) {
    return NextResponse.json({ ok: false, error: 'invalid_phone' }, { status: 400 })
  }
  if (!EMAIL_RE.test(email) || email.length > 254) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 })
  }

  const origem = String(payload?.origem ?? '').trim()
  if (origem.length > 2048) {
    return NextResponse.json({ ok: false, error: 'invalid_origin' }, { status: 400 })
  }

  const webhook = process.env.GOOGLE_SHEETS_WEBHOOK_URL
  const secret = process.env.GOOGLE_SHEETS_WEBHOOK_SECRET
  // Preserve the existing CRM capture until the Google integration is activated.
  // Return explicit delivery status so this is not mistaken for a Sheets success.
  if (!webhook || !secret) {
    try {
      const res = await fetch(process.env.CLINT_WEBHOOK_URL || DEFAULT_WEBHOOK, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name, nome: name, email, phone: phoneRaw, telefone: phoneRaw, origem,
          data: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
          submission_id: id,
        }),
        signal: AbortSignal.timeout(10000),
      })
      if (!res.ok) {
        console.error('[api/lead] Clint delivery failed', res.status)
        return NextResponse.json({ ok: false, error: 'clint_failed' }, { status: 502 })
      }
      console.warn('[api/lead] Clint received lead; Google Sheets is not configured')
      return NextResponse.json({ ok: true, delivery: { clint: 'sent', sheets: 'not_configured' } })
    } catch {
      return NextResponse.json({ ok: false, error: 'clint_unavailable' }, { status: 502 })
    }
  }
  const body = {
    secret,
    clintWebhook: process.env.CLINT_WEBHOOK_URL || DEFAULT_WEBHOOK,
    lead: { id, name, email, phone: phoneRaw, origem },
  }

  // Apps Script can incur a cold start before writing to Sheets and forwarding.
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 25000)

  try {
    const res = await fetch(webhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      signal: controller.signal,
    })

    const result = await res.json().catch(() => null)
    // Apps Script can return HTTP 200 for an application-level error or login page.
    if (!res.ok || result?.ok !== true) {
      console.error('[api/lead] delivery failed', res.status)
      return NextResponse.json({ ok: false, error: 'delivery_failed' }, { status: 502 })
    }

    return NextResponse.json({ ok: true })
  } catch (err) {
    const reason = err?.name === 'AbortError' ? 'webhook_timeout' : 'webhook_error'
    console.error('[api/lead]', reason)
    return NextResponse.json({ ok: false, error: reason }, { status: 502 })
  } finally {
    clearTimeout(timeout)
  }
}
