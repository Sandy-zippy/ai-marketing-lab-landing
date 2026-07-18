# Lead capture + alerts

Two improvements are wired but **dormant until you set one URL**:

- **Instant email alert** when any waitlist signup or 1-on-1 inquiry lands (right now they only sit in the Google Form sheet, no alert).
- **Full data capture** — the recommended agent from the scorecard, and the "what you want built" message from the 1-on-1 form, which the plain Google Form can't store.

## Turn it on (~5 min)

1. Open (or create) a Google Sheet for leads.
2. **Extensions → Apps Script**, paste [`lead-notify.gs`](lead-notify.gs), Save.
3. **Deploy → New deployment → Web app**, `Execute as: Me`, `Who has access: Anyone`. Authorize (Sheets + Gmail).
4. Copy the `/exec` URL.
5. Paste it into `LEAD_WEBHOOK = ''` in **both** files:
   - `index.html` — scorecard submit handler
   - `thank-you.html` — 1-on-1 inquiry handler
6. Commit + push.

That's it. Every lead now appends to the Sheet **and** emails you (1-on-1 inquiries are flagged 🔥). The existing Google Form keeps running in parallel as a safety net, so nothing breaks if you skip this.

## Alternative

Prefer n8n/Zapier? Point `LEAD_WEBHOOK` at a webhook URL instead — the browser POSTs form-urlencoded fields: `type, name, email, whatsapp, agent/recommended, message, source`.
