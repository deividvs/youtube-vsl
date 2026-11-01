import { NextResponse } from 'next/server'
import { validateChat } from '../../../lib/chat-validation.mjs'
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
export async function POST(request) {
  const origin = request.headers.get('origin')
  if (origin && origin !== new URL(request.url).origin) return NextResponse.json({ ok: false }, { status: 403 })
  if (!request.headers.get('content-type')?.includes('application/json')) return NextResponse.json({ ok: false }, { status: 415 })
  let body
  try {
    const raw = await request.text()
    if (new TextEncoder().encode(raw).length > 55000) return NextResponse.json({ ok: false }, { status: 413 })
    body = JSON.parse(raw)
  } catch { return NextResponse.json({ ok: false }, { status: 400 }) }
  if (!validateChat(body)) return NextResponse.json({ ok: false }, { status: 400 })
  const url = process.env.CHAT_INGEST_URL, secret = process.env.CHAT_INGEST_SECRET
  if (!url || !secret) return NextResponse.json({ ok: false }, { status: 503 })
  try {
    const response = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', 'x-ingest-key': secret },
      body: JSON.stringify(body), signal: AbortSignal.timeout(10000) })
    if (!response.ok) throw new Error('storage_failed')
    return NextResponse.json({ ok: true })
  } catch { return NextResponse.json({ ok: false }, { status: 502 }) }
}
