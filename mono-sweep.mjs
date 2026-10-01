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
 * Run: ROOT=$PWD node mono-sweep.mjs   (exit 0 clean, 1 breach)
 */
import puppeteer from '/Users/sandy/HQ/System/tools/pdf-renderer/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { globSync } from 'node:fs';
const ROOT = process.env.ROOT || '/Users/sandy/HQ/Sandy/website/aimarketinglabs.in';
const PAGES = ['call/index.html', 'sprint/index.html'];
const MIN = { 'call/index.html': 8, 'sprint/index.html': 6 };   // h1+h2+h3+callout expected at least
const CHROME = process.env.CHROME_BIN
  || globSync('/Users/sandy/.cache/puppeteer/chrome/mac_arm-*/chrome-mac-arm64/*.app/Contents/MacOS/*').sort().pop();
if (!CHROME) { console.error('no chrome build found under ~/.cache/puppeteer/chrome'); process.exit(1); }
const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
let bad = 0;
for (const f of PAGES) {
  for (const vw of [1440, 390]) {
    const p = await b.newPage(); await p.setCacheEnabled(false);
    await p.setViewport({ width: vw, height: 900 });
    await p.goto(`file://${ROOT}/${f}`, { waitUntil: 'load', timeout: 30000 });
    await p.evaluate(() => document.fonts.ready);
    const r = await p.evaluate(() => {
      const els = [...document.querySelectorAll('h1,h2,h3,.callout')];
      const miss = els.filter(e => {
        const cs = getComputedStyle(e);
        return !/^"?space mono/i.test(cs.fontFamily) || cs.fontWeight !== '700' ||
          !document.fonts.check(`700 16px "Space Mono"`);
      }).map(e => `${e.tagName}.${e.className} "${e.textContent.trim().slice(0, 30)}" ${getComputedStyle(e).fontFamily.split(',')[0]} ${getComputedStyle(e).fontWeight}`);
      return { n: els.length, miss };
    });
    const pop = r.n >= MIN[f];
    if (!pop || r.miss.length) { bad++; console.log(`  BREACH ${f} @${vw}: found ${r.n} (min ${MIN[f]}) ${r.miss.join(' | ')}`); }
    else console.log(`  ok ${f} @${vw}: ${r.n} of ${r.n} headings in Space Mono 700`);
    await p.close();
  }
}
await b.close();
process.exit(bad ? 1 : 0);
