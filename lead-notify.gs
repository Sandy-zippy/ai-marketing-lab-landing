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

// --- Optional auto-responder: email the LEAD their build plan on scorecard submit ---
// OFF by default. Flip to true ONLY when you want automated emails going out to leads.
var SEND_RESULT_EMAIL = false;
var FROM_NAME = 'Sandy, AI Marketing Labs';
var SITE_URL = 'https://aimarketinglabs.in';
var RESULTS = {
  lead:     { name: 'The Lead Agent',      why: 'Your leak is at the front door: leads arrive and wait on you. The Lead Agent captures and qualifies every inbound the moment it lands, so nothing sits in a queue.' },
  followup: { name: 'The Follow-up Agent', why: 'You are losing deals in the gap between interested and closed. The Follow-up Agent chases every lead in your voice and never forgets. You just approve the sends. Usually the fastest money in the building.' },
  content:  { name: 'The Content Agent',   why: 'Creative is your bottleneck. The Content Agent turns a one-line brief into on-brand ads, posts and pages on demand, so campaigns stop waiting on assets.' },
  campaign: { name: 'The Campaign Agent',  why: 'You need more qualified, measurable traffic. The Campaign Agent runs Google and Meta day to day, watches spend, and wires attribution so every lead carries its source.' },
  orch:     { name: 'The Orchestrator',    why: 'You have moving pieces but nothing tells you the truth. The Orchestrator ties your agents together, keeps run logs, and sends one weekly brief.' }
};

function maybeEmailLead(p) {
  if (!SEND_RESULT_EMAIL || !p.email) return;
  var key = p.agent || p.recommended;
  var r = RESULTS[key];
  if (!r) return;
  var first = p.name ? String(p.name).split(' ')[0] : 'there';
  var subject = 'Your build plan: start with ' + r.name;
  var body = 'Hi ' + first + ',\n\n' +
    'Based on your scorecard, the AI marketing agent to build first is:\n\n' +
    r.name.toUpperCase() + '\n' + r.why + '\n\n' +
    'In the 6-week founding cohort you build all six agents and keep every one. See the full build:\n' +
    SITE_URL + '/#roadmap\n\n' +
    'You are on the waitlist. I will send the cohort dates and the founding price before anyone else.\n\n' +
    '- Sandy\nAI Marketing Labs';
  MailApp.sendEmail({ to: p.email, subject: subject, body: body, name: FROM_NAME });
}

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

    maybeEmailLead(p); // auto-responder to the lead (OFF unless SEND_RESULT_EMAIL = true)
  } catch (err) {
    // Never block the lead on an error.
  }
  return ContentService.createTextOutput('ok');
}

// Optional: GET health check — open the /exec URL in a browser, should say "ok".
function doGet() {
  return ContentService.createTextOutput('ok');
}
