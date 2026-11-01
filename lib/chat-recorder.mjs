const STORAGE = 'youtubeVsl_chat_queue_v1'
export class ChatRecorder {
  constructor({ storage, send, uuid, onStatus }) {
    this.storage = storage; this.send = send; this.uuid = uuid; this.onStatus = onStatus
    this.sessionId = uuid(); this.messageId = uuid(); this.sequence = 0; this.pending = []; this.dirty = false
    try {
      const saved = JSON.parse(storage.getItem(STORAGE))
      if (saved?.sessionId && Array.isArray(saved.pending)) {
        this.sessionId = saved.sessionId; this.messageId = saved.messageId || uuid()
        this.sequence = saved.sequence || 0; this.pending = saved.pending; this.draft = saved.draft || ''
      }
    } catch {}
  }
  persist() {
    try { this.storage.setItem(STORAGE, JSON.stringify({ sessionId: this.sessionId, messageId: this.messageId,
      sequence: this.sequence, pending: this.pending, draft: this.draft || '' })) } catch { this.onStatus('Não foi possível manter a cópia local. Mantenha esta página aberta até salvar.') }
  }
  record(kind, text, lead, origin) {
    this.pending.push({ lead: { id: lead.id, name: lead.name, email: lead.email, phone: lead.phone }, origin,
      event: { id: this.uuid(), messageId: this.messageId, sequence: ++this.sequence, kind, text, at: new Date().toISOString() } })
    this.persist()
  }
  edit(text, lead, origin) {
    this.draft = text; this.lead = lead; this.origin = origin; this.dirty = true; this.persist()
    clearTimeout(this.debounce)
    this.debounce = setTimeout(() => this.snapshot(), 1000)
    if (!this.maxWait) this.maxWait = setTimeout(() => this.snapshot(), 5000)
  }
  snapshot() {
    clearTimeout(this.debounce); clearTimeout(this.maxWait); this.maxWait = null
    if (this.dirty && this.lead) {
      this.record('draft', this.draft, this.lead, this.origin); this.dirty = false
    }
    return this.flush()
  }
  submitted(text, lead, origin) {
    this.snapshot()
    this.record('sent', text, lead, origin)
    this.messageId = this.uuid(); this.draft = ''; this.persist(); this.flush()
  }
  async flush() {
    if (this.busy || !this.pending.length) return
    this.busy = true
    this.onStatus('Salvando no chat…')
    try {
      while (this.pending.length) {
        const first = this.pending[0]
        // Small batches stay within the browser's keepalive payload limit.
        const batch = this.pending.slice(0, 2).filter(x => JSON.stringify(x.lead) === JSON.stringify(first.lead) && x.origin === first.origin)
        await this.send({ sessionId: this.sessionId, lead: first.lead, origin: first.origin, events: batch.map(x => x.event) })
        const ids = new Set(batch.map(x => x.event.id))
        this.pending = this.pending.filter(x => !ids.has(x.event.id)); this.persist()
      }
      this.onStatus('Salvo')
    } catch { this.onStatus('Salvamento pendente. Tentaremos novamente automaticamente.') }
    finally { this.busy = false }
  }
  dispose() { clearTimeout(this.debounce); clearTimeout(this.maxWait) }
}
