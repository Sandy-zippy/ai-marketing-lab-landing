/* Rendered heading-font sweep on the funnel pages, both viewports.
 *
 * RULE CHANGED 1 Oct 2026. The old gate failed any Space Mono above 14px. Sandy reversed that:
 * headlines and the ICP callout ARE Space Mono 700 (company.yaml brand.display_font, his 12 Sep
 * lock), and the live page shipped Inter 800 headings, which he called "not in the right font".
 * So the gate now asserts the opposite direction: every h1, h2, h3 and .callout on the funnel
 * pages renders in Space Mono at weight 700.
 *
 * Only computed style can answer this (a static scan was blind to split rules, 17 Sep 2026).
 * It also asserts the POPULATION: a page with zero headings found fails, so the gate can't pass
 * by measuring nothing.
 *
 * Run: node mono-sweep.mjs   (exit 0 clean, 1 breach; ROOT=<dir> to sweep another checkout)
 */
import puppeteer from '/Users/sandy/HQ/System/tools/pdf-renderer/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { globSync } from 'node:fs';
// Default = the checkout this script lives in. A hardcoded main-checkout path made the pre-push hook
// sweep a stale tree instead of the commit being pushed.
const ROOT = process.env.ROOT || decodeURIComponent(new URL('.', import.meta.url).pathname).replace(/\/$/, '');
const PAGES = ['index.html', 'call/index.html', 'sprint/index.html'];   // index.html = the funnel served as the homepage (2 Oct 2026)
const MIN = { 'index.html': 4, 'call/index.html': 8, 'sprint/index.html': 6 };   // h1+h2+h3+callout expected at least. index.html is the opt-in screen only since 2 Oct: callout, h1, popup h2, not-a-fit h2 = 4 (6 Oct)
const CHROME = process.env.CHROME_BIN
  || globSync('/Users/sandy/.cache/puppeteer/chrome/mac_arm-*/chrome-mac-arm64/*.app/Contents/MacOS/*').sort().pop();
if (!CHROME) { console.error('no chrome build found under ~/.cache/puppeteer/chrome'); process.exit(1); }
// Pages load over http, as a visitor gets them: the homepage copy uses <base href="/call/">, which
// file:// resolves to the disk root, so its fonts 404 and every heading falsely fails (2 Oct 2026).
const { createServer } = await import('node:http');
const { readFile } = await import('node:fs/promises');
const TYPES = { html: 'text/html', css: 'text/css', js: 'text/javascript', woff2: 'font/woff2', svg: 'image/svg+xml', jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
const srv = createServer(async (q, s) => {
  let path = decodeURIComponent(q.url.split('?')[0]); if (path.endsWith('/')) path += 'index.html';
  let body; try { body = await readFile(ROOT + path); } catch { s.writeHead(404); return s.end(); }
  s.writeHead(200, { 'content-type': TYPES[path.split('.').pop()] || 'application/octet-stream' }); s.end(body);
}).listen(0, '127.0.0.1');
await new Promise(r => srv.once('listening', r));
const BASE = `http://127.0.0.1:${srv.address().port}`;
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let bad = 0;
for (const f of PAGES) {
  for (const vw of [1440, 390]) {
    const p = await b.newPage(); await p.setCacheEnabled(false);
    await p.setViewport({ width: vw, height: 900 });
    // 6 Oct 2026: /call sends anyone without an opt-in back to /, so the sweep measured the homepage. Load it as an opted-in visitor.
    if (f === 'call/index.html') await p.evaluateOnNewDocument(() => { localStorage.setItem('aiml_lead', JSON.stringify({ ok: true, fn: 'T' })); localStorage.setItem('aiml_vsl_seen', '1'); });
    await p.goto(`${BASE}/${f}`, { waitUntil: "load", timeout: 30000 });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const els = [...document.querySelectorAll('h1,h2,h3,.callout')];
      // RULE CHANGED AGAIN 5-6 Oct 2026 (Sandy): "headline and subheadline need different fonts" for the premium /call page.
      // Screen 1 (h1 + ICP callout) stays Space Mono 700. Section h2 = Bricolage 800, h3 = Bricolage 700, and the video page
      // heading #w-h1 = Bricolage 800 ("fix the video page heading", 6 Oct). Everything else on every page = Space Mono 700.
      const want = e => (e.id === 'w-h1' || (e.tagName === 'H2' && e.closest('.sec'))) ? ['bricolage grotesque', '800']
        : (e.tagName === 'H3' && e.closest('.sec')) ? ['bricolage grotesque', '700'] : ['space mono', '700'];
      const miss = els.filter(e => {
        const cs = getComputedStyle(e), [fam, w] = want(e);
        return !new RegExp('^"?' + fam, 'i').test(cs.fontFamily) || cs.fontWeight !== w ||
          !document.fonts.check(`${w} 16px "${fam.replace(/\b\w/g, c => c.toUpperCase())}"`);
      }).map(e => `${e.tagName}.${e.className} "${e.textContent.trim().slice(0, 30)}" ${getComputedStyle(e).fontFamily.split(',')[0]} ${getComputedStyle(e).fontWeight}`);
      return { n: els.length, miss };
    });
    const pop = r.n >= MIN[f];
    if (!pop || r.miss.length) { bad++; console.log(`  BREACH ${f} @${vw}: found ${r.n} (min ${MIN[f]}) ${r.miss.join(' | ')}`); }
    else console.log(`  ok ${f} @${vw}: ${r.n} of ${r.n} headings in their ruled font`);
    await p.close();
  }
}
await b.close(); srv.close();
process.exit(bad ? 1 : 0);
