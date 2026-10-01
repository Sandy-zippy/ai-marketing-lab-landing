// Runnable check: UTM capture on /call survives to booked.html Purchase + Cal metadata.
// node tests/attribution-check.mjs [baseUrl]   (stubs Meta + Cal, fires nothing real)
import { chromium } from '/Users/sandy/HQ/Personal/job-search/career-ops/node_modules/playwright/index.mjs';
const B = process.argv[2] || 'http://127.0.0.1:4731/';
const b = await chromium.launch({ channel: 'chrome', headless: true });
const p = await b.newPage();
await p.route(/connect\.facebook\.net|app\.cal\.com/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
await p.addInitScript(() => {
  window.__fb = []; window.fbq = function () { window.__fb.push([...arguments]); }; window.fbq.callMethod = null; window.fbq.queue = []; window._fbq = window.fbq;
  document.cookie = '_fbp=fb.1.123.456; path=/';
});
await p.goto(B + 'call/?utm_source=facebook&utm_medium=cpc&utm_campaign=aiml_cbo_202610&utm_content=1201&utm_term=2202&utm_id=3303&fbclid=XYZ');
await p.goto(B + 'call/booked.html?razorpay_payment_id=pay_TEST123');
await p.waitForTimeout(500);
const r = await p.evaluate(() => ({ fb: window.__fb.filter(x => x[0] === 'track' && x[1] === 'Purchase'), calq: JSON.stringify(window.Cal && window.Cal.q || []) }));
const [, , data, opts] = r.fb[0] || [];
const ok = r.fb.length === 1 && opts?.eventID === 'purchase_pay_TEST123' && data?.utm_content === '1201' && data?.value === 999
  && r.calq.includes('metadata[utm_content]') && r.calq.includes('pay_TEST123') && r.calq.includes('fb.1.123.456');
// A direct visit (no payment id) must fire NO Purchase.
const p2 = await b.newPage();
await p2.route(/connect\.facebook\.net|app\.cal\.com/, r => r.fulfill({ status: 200, contentType: 'text/javascript', body: '' }));
await p2.addInitScript(() => { window.__fb = []; window.fbq = function () { window.__fb.push([...arguments]); }; window._fbq = window.fbq; });
await p2.goto(B + 'call/booked.html'); await p2.waitForTimeout(500);
const direct = await p2.evaluate(() => window.__fb.filter(x => x[0] === 'track' && x[1] === 'Purchase').length);
if (direct !== 0) { console.log('FAIL direct visit fired Purchase x' + direct); await b.close(); process.exit(1); }
console.log(ok ? 'PASS' : 'FAIL', JSON.stringify({ purchase: r.fb[0] }), r.calq.slice(0, 400));
await b.close(); process.exit(ok ? 0 : 1);
