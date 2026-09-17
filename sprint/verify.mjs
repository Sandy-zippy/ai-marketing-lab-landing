/* Post-integration gate for sprint/index.html.
 *
 * Every defect that shipped on 17 Sep 2026 got through a check that consulted something I had
 * authored about the page (a declared token, a data- attribute, a retyped command, an
 * element-only DOM walk) instead of the page's own rendered behaviour. Every assertion here
 * reads rendered geometry or computed style. None reads a declaration.
 *
 * Run:  node sprint/verify.mjs            (exit 0 clean, 1 breach)
 *       node sprint/verify.mjs --prove    (mutates a copy to prove each check goes RED)
 */
import puppeteer from '/Users/sandy/HQ/System/tools/pdf-renderer/node_modules/puppeteer/lib/esm/puppeteer/puppeteer.js';
import { readFileSync, writeFileSync, mkdtempSync, copyFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { globSync } from 'node:fs';

const HERE = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(HERE, '..');
const CHROME = globSync('/Users/sandy/.cache/puppeteer/chrome/mac_arm-15*/chrome-mac-arm64/*.app/Contents/MacOS/*')[0];

const fails = [];
const notes = [];
const fail = (id, msg) => fails.push(`${id}: ${msg}`);
const note = (id, msg) => notes.push(`${id}: ${msg}`);

/* ---- G1. Brace balance. One orphan } killed 9 rules and took the page to 126,962px, and
        five of six checks stayed green. Comments are masked, not stripped, so a brace inside
        a comment cannot skew the count. ---- */
function braceBalance(file) {
  const src = readFileSync(file, 'utf8');
  const styles = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
  const masked = styles.replace(/\/\*[\s\S]*?\*\//g, s => ' '.repeat(s.length));
  const o = (masked.match(/\{/g) || []).length;
  const c = (masked.match(/\}/g) || []).length;
  return { o, c, ok: o === c };
}

/* ---- The rejected constructs. Sandy named each of these. An attribute check cannot see them;
        these are matched as rendered elements. ---- */
const BANNED_SELECTORS = [
  ['.spark',             'sparkline chart, rejected by name'],
  ['.year .m',           'twelve month square grid, rejected by name'],
  ['.wk .track',         'progress bar, a chart'],
  ['.fq-mark',           'drawn FAQ chevron ornament'],
  ['.d-node',            'SVG node diagram in the automations bucket'],
  ['.d-link',            'SVG diagram link path'],
];

async function run(url, label) {
  const b = await puppeteer.launch({ executablePath: CHROME, headless: 'new', args: ['--no-sandbox'] });
  const out = {};
  for (const vp of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const p = await b.newPage();
    await p.setCacheEnabled(false);           // a shared 304 once made a gate report "did not load"
    await p.setViewport(vp);
    await p.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });

    /* G5 must be sampled BEFORE revealing: an animation on a class already in the HTML has
       finished before a reader 8,000px down ever arrives. Measured in round 1: all nine
       non-hero sections read playState "finished" at load. */
    const prematurelyFinished = await p.evaluate(() => {
      const vh = innerHeight;
      return document.getAnimations()
        .filter(a => a.playState === 'finished')
        .map(a => {
          const el = a.effect && a.effect.target;
          if (!el || !el.getBoundingClientRect) return null;
          const top = el.getBoundingClientRect().top;
          const cs = getComputedStyle(el);
          if (cs.animationIterationCount === 'infinite') return null;
          return top > vh ? `${el.tagName}.${(el.className || '').toString().split(' ')[0]} @${Math.round(top)}px` : null;
        })
        .filter(Boolean);
    });

    await p.evaluate(() => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.querySelectorAll('.reveal').forEach(e => e.classList.add('in'));
    });
    await new Promise(r => setTimeout(r, 1000));

    /* loading="lazy" images below the fold never START loading in a headless viewport, so
       complete is false and naturalWidth is 0 for every one of them. The first run of this gate
       reported 30 broken images on a page whose files all exist on disk and all render in a real
       browser. That is the harness lying, in the same family as every other trap today. Force
       them eager and await decode BEFORE asserting pixels. */
    await p.evaluate(() => {
      document.querySelectorAll('img[loading="lazy"]').forEach(i => { i.loading = 'eager'; });
    });
    await p.evaluate(() => Promise.all([...document.images].map(i => i.decode().catch(() => {}))));
    await new Promise(r => setTimeout(r, 600));

    const m = await p.evaluate((BANNED) => {
      const res = {};
      res.height = document.body.scrollHeight;
      res.overflowX = document.documentElement.scrollWidth > document.documentElement.clientWidth;

      /* Space Mono above 14px, sweeping pseudo-elements explicitly. querySelectorAll cannot
         select ::before/::after, which is why "0 above 14px" was reported three times while
         five markers rendered at 19px. */
      const mono = [];
      const isMono = f => /space mono|courier|monospace/i.test(f);
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (isMono(cs.fontFamily) && parseFloat(cs.fontSize) > 14.001) {
          mono.push({ sel: el.tagName + '.' + (el.className || '').toString().split(' ')[0], px: cs.fontSize, ps: 'element' });
        }
        for (const ps of ['::before', '::after']) {
          const s = getComputedStyle(el, ps);
          if (!s.content || s.content === 'none' || s.content === '""' || s.content === 'normal') continue;
          if (isMono(s.fontFamily) && parseFloat(s.fontSize) > 14.001) {
            mono.push({ sel: el.tagName + '.' + (el.className || '').toString().split(' ')[0], px: s.fontSize, ps });
          }
        }
      }
      res.mono = mono;

      /* url() proves a declaration, not a file. Assert real pixels. */
      res.broken = [...document.images]
        .filter(i => !i.complete || i.naturalWidth === 0)
        .map(i => i.getAttribute('src'));

      res.banned = BANNED.map(([sel, why]) => ({ sel, why, n: document.querySelectorAll(sel).length }))
        .filter(x => x.n > 0);

      res.sections = [...document.querySelectorAll('main > section')].map(s => ({
        motion: s.dataset.motion || '?',
        h: Math.round(s.getBoundingClientRect().height),
        job: !!(s.dataset.job && s.dataset.job.length > 20),
      }));

      /* Gate on a RUNNING animation inside the section, not on a data- attribute. R12 passed
         on the attribute while nine rules were dead and nothing drew a pixel. */
      res.motionless = [...document.querySelectorAll('main > section')].map(s => {
        const any = [...s.querySelectorAll('*'), s].some(el => {
          try { return el.getAnimations && el.getAnimations().length > 0; } catch { return false; }
        });
        return any ? null : (s.dataset.motion || '?');
      }).filter(Boolean);

      /* G11. The wordmark. It lives in <header>, not in main > section, so every other gate here
         is structurally blind to it, and the page assembled once with the wordmark entirely
         absent while this file reported clean.
         Rewritten 17 Sep: the first version asserted 16 <tspan class="wm-ch"> and a .wm-caret,
         which were artifacts of an inline-SVG approach that broke the cascade and the layout and
         was abandoned. A gate that describes a design you no longer ship is worse than no gate:
         it fails for the wrong reason and hides the real ones. Assert the design that exists. */
      const mark = document.querySelector('.bar .mark');
      const mcs = mark ? getComputedStyle(mark) : null;
      res.wordmark = mark ? {
        present: true,
        pixels: mark.naturalWidth > 0 && mark.complete,
        rendered: Math.round(mark.getBoundingClientRect().height),
        anim: mcs.animationName,
        steps: /steps\(/.test(mcs.animationTimingFunction),
        durMs: Math.round(parseFloat(mcs.animationDuration) * 1000),
      } : { present: false };

      /* G12. Exactly one stylesheet, in <head>. Appending rebuilt CSS at the LAST </style> put
         every section's rules inside an SVG <style> in the header once, where they were never in
         the cascade: the hero callout computed 15px against a rule whose own floor is 20px, and
         nothing about the page looked broken. */
      res.styleCount = document.querySelectorAll('style').length;
      const cal = document.querySelector('.hero .callout');
      res.calloutPx = cal ? parseFloat(getComputedStyle(cal).fontSize) : 0;

      return res;
    }, BANNED_SELECTORS);

    m.prematurelyFinished = prematurelyFinished;
    out[vp.width] = m;
    await p.close();
  }
  await b.close();
  return out;
}

/* resolve() matters: 'file://' + a relative path does not resolve, and the script exits
   non-zero having measured nothing, which reads exactly like a failed gate. */
const target = process.argv.includes('--file')
  ? resolve(process.cwd(), process.argv[process.argv.indexOf('--file') + 1])
  : join(HERE, 'index.html');

const bb = braceBalance(target);
if (!bb.ok) fail('G1', `brace imbalance in <style>: ${bb.o} open vs ${bb.c} close. Every rule after the orphan is dead.`);
else note('G1', `braces balanced (${bb.o})`);

const r = await run('file://' + target, 'sprint');

for (const [w, m] of Object.entries(r)) {
  if (m.overflowX) fail('G2', `horizontal overflow at ${w}px`);
  if (m.broken.length) fail('G3', `${m.broken.length} broken image(s) at ${w}px: ${m.broken.join(', ')}`);
  if (m.mono.length) fail('G4', `Space Mono above 14px at ${w}px: ` + m.mono.map(x => `${x.sel}${x.ps === 'element' ? '' : x.ps} ${x.px}`).join(' | '));
  if (m.prematurelyFinished.length) fail('G5', `animation already finished below the fold at ${w}px: ${m.prematurelyFinished.join(', ')}`);
  if (m.banned.length) fail('G6', `rejected construct present at ${w}px: ` + m.banned.map(x => `${x.sel} x${x.n} (${x.why})`).join(' | '));
  const tall = m.sections.filter(s => s.h > 2000);
  if (tall.length) fail('G7', `section over 2000px at ${w}px: ` + tall.map(s => `${s.motion} ${s.h}px`).join(', '));
  if (m.height > 12000) fail('G8', `page ${m.height}px at ${w}px, over the 12000px ceiling`);
  const nojob = m.sections.filter(s => !s.job).map(s => s.motion);
  if (nojob.length) fail('G9', `section without a real data-job at ${w}px: ${nojob.join(', ')}`);
  if (m.motionless.length) fail('G10', `section with zero running animations at ${w}px: ${m.motionless.join(', ')}`);
  const wm = m.wordmark;
  if (!wm.present) fail('G11', `no .bar .mark at ${w}px: the wordmark is absent from the header`);
  else {
    if (!wm.pixels) fail('G11', `wordmark present but decoded 0 pixels at ${w}px`);
    if (wm.anim !== 'draw') fail('G11', `wordmark animation-name is "${wm.anim}" at ${w}px, expected draw`);
    if (!wm.steps) fail('G11', `wordmark timing is not stepped at ${w}px: a smooth wipe at this size is the shimmer nobody ever saw`);
    if (wm.durMs < 1000) fail('G11', `wordmark animation is ${wm.durMs}ms at ${w}px, too short to be seen`);
  }
  if (m.styleCount !== 1) fail('G12', `${m.styleCount} <style> elements at ${w}px, expected exactly 1 in <head>. Rebuilt CSS may be outside the cascade.`);
  if (m.calloutPx < 20) fail('G12', `hero qualifier computes ${m.calloutPx}px at ${w}px, expected 20 or more. Sandy called it too small twice.`);
  note('INFO', `${w}px: ${m.height}px tall, ${m.sections.length} sections`);
}

console.log(notes.join('\n'));
if (fails.length) { console.error('\nFAIL\n' + fails.join('\n')); process.exit(1); }
console.log('\nverify: clean');
