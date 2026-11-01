import { test } from 'node:test'
import assert from 'node:assert/strict'
import vm from 'node:vm'
import fs from 'node:fs/promises'

const source = await fs.readFile(new URL('../integrations/google-apps-script/Code.gs', import.meta.url), 'utf8')
const sample = { id: 'test-submission-0001', name: 'Lead Teste', email: 'teste@example.com', phone: '+5511999990000', origem: 'http://localhost/test' }
function fixture() {
  const rows = [['Data', 'Nome', 'Telefone', 'Email', 'Origem', 'ID', 'Clint']]
  let calls = 0, status = 200
  const range = (row, col, height = 1, width = 1) => ({
    setValues(values) { values.forEach((v, i) => { rows[row - 1 + i] ??= []; v.forEach((x, j) => { rows[row - 1 + i][col - 1 + j] = typeof x === 'string' && x.startsWith("'") ? x.slice(1) : x }) }); return this },
    getValues() { return rows.slice(row - 1, row - 1 + height).map(r => r.slice(col - 1, col - 1 + width)) },
    getValue() { return rows[row - 1][col - 1] },
    setValue(v) { rows[row - 1][col - 1] = v; return this },
    setNumberFormat() { return this },
    createTextFinder(id) { return { matchEntireCell() { return this }, useRegularExpression() { return this }, findNext() { const i = rows.findIndex(r => r[5] === id); return i > 0 ? { getRow: () => i + 1 } : null } } },
  })
  const sheet = { getLastRow: () => rows.length, getRange: range }
  const context = vm.createContext({
    ContentService: { MimeType: { JSON: 'json' }, createTextOutput: body => ({ setMimeType: () => JSON.parse(body) }) },
    PropertiesService: { getScriptProperties: () => ({ getProperty: key => key === 'LEADS_SECRET' ? 'secret' : 'sheet' }) },
    SpreadsheetApp: { openById: () => ({ getSheetByName: () => sheet }), flush() {} },
    LockService: { getScriptLock: () => ({ tryLock: () => true, releaseLock() {} }) },
    Utilities: { formatDate: () => '01/11/2026 12:00:00' },
    UrlFetchApp: { fetch: () => { calls++; return { getResponseCode: () => status } } },
  })
  vm.runInContext(source, context)
  return { rows, context, calls: () => calls, status: value => { status = value }, send: (secret = 'secret', lead = sample) => context.doPost({ postData: { contents: JSON.stringify({ secret, lead, clintWebhook: 'https://functions-api.clint.digital/endpoints/integration/webhook/test' }) } }) }
}
test('unauthorized or invalid submissions never write or contact Clint', () => {
  const f = fixture()
  assert.equal(f.send('wrong').error, 'unauthorized')
  assert.equal(f.send('secret', { ...sample, email: 'invalid' }).error, 'invalid_lead')
  assert.equal(f.rows.length, 1)
  assert.equal(f.calls(), 0)
})
test('successful retries do not duplicate the row or contact Clint again', () => {
  const f = fixture()
  assert.equal(f.send().ok, true)
  assert.equal(f.send().duplicate, true)
  assert.equal(f.rows.length, 2)
  assert.equal(f.calls(), 1)
  assert.equal(f.rows[1][2], sample.phone)
  assert.equal(f.rows[1][6], 'Enviado')
})
test('Clint failure preserves the lead and a retry updates the same row', () => {
  const f = fixture()
  f.status(500)
  assert.equal(f.send().error, 'clint_failed')
  assert.equal(f.rows[1][6], 'Pendente')
  f.status(200)
  assert.equal(f.send().ok, true)
  assert.equal(f.rows.length, 2)
  assert.equal(f.rows[1][6], 'Enviado')
})
test('spreadsheet formulas are escaped', () => {
  const f = fixture()
  assert.equal(f.context.text_('=IMPORTXML("url")'), '\'=IMPORTXML("url")')
  assert.equal(f.context.text_('+5511999990000'), "'+5511999990000")
})

const routeSource = (await fs.readFile(new URL('../app/api/lead/route.js', import.meta.url), 'utf8'))
  .replace("import { NextResponse } from 'next/server'", '')
  .replaceAll('export ', '')
test('API preserves Clint when Sheets is unconfigured and rejects Google application errors', async () => {
  const env = {}
  let result = { ok: false }
  const context = vm.createContext({
    NextResponse: { json: (body, options = {}) => ({ body, status: options.status || 200 }) },
    process: { env }, AbortController, AbortSignal, setTimeout, clearTimeout, console: { error() {}, warn() {} },
    fetch: async () => ({ ok: true, status: 200, json: async () => result }),
  })
  vm.runInContext(routeSource, context)
  const request = { json: async () => sample }
  const fallback = await context.POST(request)
  assert.equal(fallback.status, 200)
  assert.equal(fallback.body.delivery.clint, 'sent')
  assert.equal(fallback.body.delivery.sheets, 'not_configured')
  env.GOOGLE_SHEETS_WEBHOOK_URL = 'https://example.com'
  env.GOOGLE_SHEETS_WEBHOOK_SECRET = 'secret'
  assert.equal((await context.POST(request)).status, 502)
  result = { ok: true }
  assert.equal((await context.POST(request)).body.ok, true)
})
