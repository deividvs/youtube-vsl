const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
export function validateChat(body) {
  const { lead, sessionId, events, origin } = body || {}
  if (!lead || typeof lead.name !== 'string' || lead.name.length < 2 || lead.name.length > 150 ||
      typeof lead.email !== 'string' || lead.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) ||
      typeof lead.phone !== 'string' || lead.phone.length > 40 || lead.phone.replace(/\D/g, '').length < 8 ||
      !uuid.test(sessionId) || typeof origin !== 'string' || origin.length > 2048 ||
      !Array.isArray(events) || !events.length || events.length > 10) return null
  const rows = []
  for (const e of events) {
    if (!uuid.test(e.id) || !uuid.test(e.messageId) || !['draft', 'sent'].includes(e.kind) ||
        typeof e.text !== 'string' || e.text.length > 4000 || (e.kind === 'sent' && !e.text.trim()) ||
        !Number.isSafeInteger(e.sequence) || e.sequence < 0 || typeof e.at !== 'string' || !Number.isFinite(Date.parse(e.at))) return null
    rows.push({ id: e.id, session_id: sessionId, message_id: e.messageId, sequence: e.sequence,
      kind: e.kind, text: e.text, client_at: e.at, origin,
      lead_id: typeof lead.id === 'string' && /^[a-zA-Z0-9_-]{16,80}$/.test(lead.id) ? lead.id : null,
      lead_name: lead.name, lead_email: lead.email.toLowerCase(), lead_phone: lead.phone })
  }
  return rows
}
