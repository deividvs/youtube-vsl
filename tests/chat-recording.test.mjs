import { test } from 'node:test'
import assert from 'node:assert/strict'
import { randomUUID } from 'node:crypto'
import { ChatRecorder } from '../lib/chat-recorder.mjs'
import { validateChat } from '../lib/chat-validation.mjs'
const lead = { name: 'Teste Chat', email: 'chat@example.com', phone: '00000000000' }
function setup(send) {
  const data = new Map()
  const storage = { getItem: k => data.get(k), setItem: (k,v) => data.set(k,v) }
  const recorder = new ChatRecorder({ storage, uuid: randomUUID, send, onStatus() {} })
  return { recorder, storage }
}
const settle = () => new Promise(resolve => setTimeout(resolve, 20))
test('draft snapshots retain unsent and erased text; sent event keeps message identity', async () => {
  const requests = []
  const { recorder: r } = setup(async b => { requests.push(b) })
  r.edit('rascunho', lead, 'https://example.com'); await r.snapshot()
  r.edit('', lead, 'https://example.com'); await r.snapshot()
  r.edit('mensagem final', lead, 'https://example.com'); r.submitted('mensagem final', lead, 'https://example.com')
  await settle(); r.dispose()
  const events = requests.flatMap(b => b.events)
  assert.deepEqual(events.map(e => e.kind), ['draft','draft','draft','sent'])
  assert.equal(events[0].text, 'rascunho'); assert.equal(events[1].text, '')
  assert.equal(new Set(events.map(e => e.messageId)).size, 1)
  assert.ok(events.every((e,i) => e.sequence === i+1))
  assert.ok(requests.every(b => validateChat(b)))
})
test('network failure survives reload and retries same event id', async () => {
  const { recorder: r, storage } = setup(async () => { throw Error('offline') })
  r.edit('não enviado', lead, 'https://example.com'); await r.snapshot(); r.dispose()
  const id = r.pending[0].event.id
  const requests=[]
  const restored=new ChatRecorder({storage,uuid:randomUUID,send:async b=>requests.push(b),onStatus(){}})
  await restored.flush()
  assert.equal(requests[0].events[0].id,id);assert.equal(restored.pending.length,0)
})
test('invalid events and oversized messages are rejected', () => {
  const body={lead,sessionId:randomUUID(),origin:'https://example.com',events:[{id:randomUUID(),messageId:randomUUID(),sequence:1,kind:'draft',text:'a',at:new Date().toISOString()}]}
  assert.ok(validateChat(body))
  for (const patch of [{kind:'read'},{text:'a'.repeat(4001)},{id:'bad'},{sequence:-1},{at:'invalid'}]) {
    assert.equal(validateChat({...body,events:[{...body.events[0],...patch}]}),null)
  }
  assert.equal(validateChat({...body,events:Array(11).fill(body.events[0])}),null)
})
