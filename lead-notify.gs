/**
 * AI Marketing Labs — lead capture + instant email alert
 * Logs every scorecard waitlist signup and 1-on-1 build inquiry to a Sheet
 * (name, email, WhatsApp, recommended agent, message, type) AND emails Sandy
 * the moment one lands. Solves: no-alert-on-new-lead + dropped agent/message data.
 *
 * DEPLOY (one time, ~5 min):
 *  1. Create/open a Google Sheet (this is where leads land).
 *  2. Extensions > Apps Script. Delete the stub, paste this file, Save.
 *  3. Deploy > New deployment > type: Web app.
 *       Execute as: Me   |   Who has access: Anyone
 *  4. Authorize when prompted (allow Sheets + Gmail send).
 *  5. Copy the Web app URL that ends in /exec.
 *  6. Paste it into LEAD_WEBHOOK in BOTH:
 *       - index.html      (the scorecard submit handler)
 *       - thank-you.html  (the 1-on-1 inquiry handler)
 *     Commit + push. Done — leads now log to the Sheet and email you.
 *
 * NOTE: a POST from the browser is no-cors (opaque response) but doPost still
 * runs. To verify, check the Sheet + your inbox, not the network response.
 */

var ALERT_EMAIL = 'sandy@zippyscale.com'; // where new-lead alerts are sent

function doPost(e) {
  try {
    var p = (e && e.parameter) || {};
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Leads') || ss.insertSheet('Leads');
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Type', 'Name', 'Email', 'WhatsApp', 'Recommended agent', 'Message', 'Source']);
    }
    sheet.appendRow([
      new Date(),
      p.type || '',
      p.name || '',
      p.email || '',
      p.whatsapp || '',
      p.agent || p.recommended || '',
      p.message || '',
      p.source || ''
    ]);

    var hot = (p.type === '1on1');
    var subject = (hot ? '🔥 1-on-1 build inquiry' : 'New waitlist lead') + ' — ' + (p.name || 'someone');
    var body = 'Type: ' + (p.type || '') +
      '\nName: ' + (p.name || '') +
      '\nEmail: ' + (p.email || '') +
      '\nWhatsApp: ' + (p.whatsapp || '') +
      '\nRecommended agent: ' + (p.agent || p.recommended || '');
    if (p.message) body += '\nWants built: ' + p.message;
    body += '\nSource: ' + (p.source || '');
    MailApp.sendEmail(ALERT_EMAIL, subject, body, { replyTo: p.email || ALERT_EMAIL });
  } catch (err) {
    // Never block the lead on an error.
  }
  return ContentService.createTextOutput('ok');
}

// Optional: GET health check — open the /exec URL in a browser, should say "ok".
function doGet() {
  return ContentService.createTextOutput('ok');
}
