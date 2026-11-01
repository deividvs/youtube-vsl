// Deploy as a web app, executing as the owner. Never expose the secret to clients.
// Script properties: LEADS_SECRET and SPREADSHEET_ID.
function configureIntegration() {
  const props = PropertiesService.getScriptProperties();
  props.setProperty('SPREADSHEET_ID', '149J9lU9CiEHATONwYJT6pd-04f8T3KEcFUgX5jQ652I');
  if (!props.getProperty('LEADS_SECRET')) {
    props.setProperty('LEADS_SECRET', Utilities.getUuid() + Utilities.getUuid());
  }
  SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName('Leads');
}

function json_(body) {
  return ContentService.createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}

function text_(value) {
  // Preserve phone numbers and prevent user input from becoming a formula.
  const text = String(value || '');
  return /^[=+@\-\t\r\n]/.test(text) ? "'" + text : text;
}

function doPost(e) {
  let input;
  try { input = JSON.parse(e.postData.contents); }
  catch (_) { return json_({ ok: false, error: 'invalid_json' }); }
  const props = PropertiesService.getScriptProperties();
  const secret = props.getProperty('LEADS_SECRET');
  if (!secret || input.secret !== secret) return json_({ ok: false, error: 'unauthorized' });
  const lead = input.lead || {};
  if (!/^[a-zA-Z0-9_-]{16,80}$/.test(lead.id || '') ||
      typeof lead.name !== 'string' || lead.name.length < 2 || lead.name.length > 150 ||
      typeof lead.email !== 'string' || lead.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email) ||
      typeof lead.phone !== 'string' || lead.phone.length > 40 || lead.phone.replace(/\D/g, '').length < 8 ||
      typeof lead.origem !== 'string' || lead.origem.length > 2048) {
    return json_({ ok: false, error: 'invalid_lead' });
  }
  // The authenticated server supplies the existing Clint integration endpoint.
  if (!/^https:\/\/functions-api\.clint\.digital\/endpoints\/integration\/webhook\/[a-zA-Z0-9-]+$/.test(input.clintWebhook || '')) {
    return json_({ ok: false, error: 'invalid_clint_webhook' });
  }
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(5000)) return json_({ ok: false, error: 'busy' });
  try {
    const sheet = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName('Leads');
    if (!sheet) return json_({ ok: false, error: 'missing_sheet' });
    const lastRow = sheet.getLastRow();
    const found = lastRow > 1 ? sheet.getRange(2, 6, lastRow - 1, 1)
      .createTextFinder(lead.id).matchEntireCell(true).useRegularExpression(false).findNext() : null;
    let row;
    if (found) {
      row = found.getRow();
      if (sheet.getRange(row, 7).getValue() === 'Enviado') return json_({ ok: true, duplicate: true });
    } else {
      row = lastRow + 1;
      sheet.getRange(row, 1, 1, 7).setValues([[
        new Date(), text_(lead.name), text_(lead.phone), text_(lead.email), text_(lead.origem), lead.id, 'Pendente'
      ]]);
      sheet.getRange(row, 1).setNumberFormat('dd/MM/yyyy HH:mm:ss');
      SpreadsheetApp.flush();
    }
    // Use the stored values on retries, preserving the original submission.
    const saved = sheet.getRange(row, 1, 1, 7).getValues()[0];
    const response = UrlFetchApp.fetch(input.clintWebhook, {
      method: 'post', contentType: 'application/json', muteHttpExceptions: true,
      payload: JSON.stringify({
        name: saved[1], nome: saved[1], phone: saved[2], telefone: saved[2], email: saved[3],
        origem: saved[4], data: Utilities.formatDate(new Date(saved[0]), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm:ss'),
        submission_id: lead.id
      })
    });
    const status = response.getResponseCode();
    if (status < 200 || status >= 300) {
      sheet.getRange(row, 7).setValue('Pendente');
      return json_({ ok: false, error: 'clint_failed', sheets: true });
    }
    sheet.getRange(row, 7).setValue('Enviado');
    SpreadsheetApp.flush();
    return json_({ ok: true });
  } catch (_) {
    // Do not put contact details or webhook secrets in logs/responses.
    return json_({ ok: false, error: 'delivery_failed' });
  } finally { lock.releaseLock(); }
}
