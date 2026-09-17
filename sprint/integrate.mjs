/* Assemble the rebuilt sections into a candidate page.
 *
 * Writes to a TARGET COPY by default, never to index.html, so a bad assembly costs nothing.
 * Pass --apply to write index.html for real.
 *
 * Section replacement is done by matching <section ...> / </section> with a tag DEPTH WALK,
 * never by index arithmetic on brace or tag positions. Index arithmetic on a closing brace is
 * what cut a rule in half this morning, killed nine rules and took the page to 126,962px while
 * five of six checks stayed green.
 *
 * Every step asserts. A replacement that matches zero or more than one section aborts the whole
 * run rather than writing a partly-assembled page.
 */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = dirname(fileURLToPath(import.meta.url));
const SRC = join(HERE, 'index.html');
const OUT = process.argv.includes('--apply') ? SRC : join(HERE, 'index.candidate.html');

/* section data-motion -> the rebuild file that replaces it. wordmark-hero is NOT here: it
   replaces the <header> and a single <p>, so it is handled separately and explicitly. */
const SECTIONS = [
  ['icp-in',   'quiet-month'],
  ['cost-in',  null],            // merged INTO icp-in, so this one is deleted outright
  ['step-in',  'agenda'],
  ['shot-in',  'payments'],
  ['work-in',  'work-buckets'],
  ['wk-in',    'six-weeks'],
  ['who-in',   'founder'],
  ['fit-in',   'filter'],
  ['faq-in',   'faq'],
  ['close-in', 'closing'],
];

/* Find one <section> by its data-motion, walking tag depth so a nested <section> cannot
   truncate the match early. Returns [startIdx, endIdxExclusive]. */
function findSection(src, motion) {
  const open = new RegExp(`<section[^>]*data-motion="${motion}"`, 'g');
  const hits = [...src.matchAll(open)];
  if (hits.length !== 1) throw new Error(`data-motion="${motion}": expected 1 section, found ${hits.length}`);
  const start = hits[0].index;
  let depth = 0, i = start;
  const tag = /<\/?section\b/g;
  tag.lastIndex = start;
  let m;
  while ((m = tag.exec(src))) {
    depth += m[0] === '</section' ? -1 : 1;
    if (depth === 0) return [start, m.index + '</section>'.length];
  }
  throw new Error(`data-motion="${motion}": unbalanced <section>`);
}

let src = readFileSync(SRC, 'utf8');
const before = { bytes: src.length, sections: (src.match(/<section\b/g) || []).length };
const log = [];

/* ---- 1. swap each section, longest-offset-first so earlier edits cannot shift later indices ---- */
const plan = SECTIONS.map(([motion, file]) => {
  const [a, b] = findSection(src, motion);
  let markup = '';
  if (file) {
    const p = join(HERE, 'rebuild', `${file}.html`);
    if (!existsSync(p)) throw new Error(`missing deliverable: ${p}`);
    markup = readFileSync(p, 'utf8').trimEnd();
    const n = (markup.match(/<section\b/g) || []).length;
    if (n !== 1) throw new Error(`${file}.html: expected exactly 1 <section>, found ${n}`);
    if (!markup.includes(`data-motion="${motion}"`))
      throw new Error(`${file}.html: does not carry data-motion="${motion}", it would break the reveal gate and the spacing tier`);
  }
  return { motion, file, a, b, markup };
}).sort((x, y) => y.a - x.a);

for (const s of plan) {
  src = src.slice(0, s.a) + s.markup + src.slice(s.b);
  log.push(s.file ? `  ${s.motion} <- rebuild/${s.file}.html` : `  ${s.motion} DELETED (merged into icp-in)`);
}

/* ---- 1b. the two wordmark-hero blocks. NOT sections, so the loop above cannot reach them.
        The first version of this script carried a comment saying these were "handled separately
        and explicitly" and then did not handle them at all: the page assembled clean, the gate
        went green, and the wordmark was simply absent (0 of 16 characters painted). Asserted
        both ways now, so a silent no-op is impossible. ---- */
{
  /* Strip HTML comments FIRST. Without this the regex below matched the phrase
     <header class="bar"> inside the file's own explanatory comment, captured from there to the
     real </header>, and injected comment prose into the page as live markup: a bare <img> with
     no src appeared in <header>, the stray --> broke the tree, and main > section collapsed
     from 10 to 1. Same family as every other failure today: I matched text I had written
     ABOUT the markup instead of the markup. */
  const wh = readFileSync(join(HERE, 'rebuild', 'wordmark-hero.html'), 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '');
  const header = wh.match(/<header class="bar">[\s\S]*?<\/header>/);
  const callout = wh.match(/<p class="callout"[\s\S]*?<\/p>/);
  if (!header)  throw new Error('wordmark-hero.html: no <header class="bar"> block found');
  if (!/<img[^>]+class="mark"/.test(header[0])) throw new Error('extracted header block has no <img class="mark">, it is prose not markup');
  if (/<svg/.test(header[0])) throw new Error('extracted header block inlines an <svg>: that approach broke the cascade and the layout, see wordmark-hero.css');
  if (!callout) throw new Error('wordmark-hero.html: no <p class="callout"> block found');

  const hOld = src.match(/<header class="bar">[\s\S]*?<\/header>/g);
  if (!hOld || hOld.length !== 1) throw new Error(`page has ${hOld ? hOld.length : 0} <header class="bar">, expected 1`);
  src = src.replace(hOld[0], header[0]);

  const cOld = src.match(/<p class="callout"[\s\S]*?<\/p>/g);
  if (!cOld || cOld.length !== 1) throw new Error(`page has ${cOld ? cOld.length : 0} <p class="callout">, expected 1`);
  src = src.replace(cOld[0], callout[0]);

  if ((src.match(/<style/g) || []).length !== 1)
    throw new Error(`page now has ${(src.match(/<style/g)||[]).length} <style> elements, expected exactly 1 in <head>`);
  log.push('  header.bar + .callout <- rebuild/wordmark-hero.html (img mark, single head stylesheet)');
}

/* ---- 2. append the new CSS inside the existing <style>, before its closing tag ---- */
const cssFiles = ['quiet-month', 'agenda', 'payments', 'work-buckets', 'six-weeks',
                  'founder', 'filter', 'faq', 'closing', 'wordmark-hero'];
let css = '\n\n/* ==== rebuilt sections, 17 Sep 2026. One file per section, see sprint/rebuild/ ==== */\n';
for (const f of cssFiles) {
  const p = join(HERE, 'rebuild', `${f}.css`);
  if (!existsSync(p)) throw new Error(`missing stylesheet: ${p}`);
  const body = readFileSync(p, 'utf8');
  /* The HTML tokenizer ends a <style> element at the first "</style" followed by whitespace, "/"
     or ">", and it does NOT understand CSS comments. On 17 Sep a comment in wordmark-hero.css
     that DESCRIBED this bug contained the literal string, terminated the stylesheet 3,651 chars
     before </head>, and everything after it parsed as HTML: a bare <img> landed in <body>, the
     hero qualifier stayed 15px against a rule whose floor is 20px, and the wordmark kept the old
     0.9s animation. The page looked assembled and was not. Refuse it at the door. */
  if (/<\/style/i.test(body)) throw new Error(`${f}.css contains "</style", which would terminate the page stylesheet. Rewrite it in prose.`);
  if (/<!--|-->/.test(body))   throw new Error(`${f}.css contains an HTML comment delimiter, which can break the style element.`);
  css += `\n/* ---- ${f} ---- */\n` + body.trimEnd() + '\n';
}
/* Append into the HEAD stylesheet, explicitly. lastIndexOf('</style>') is wrong the moment the
   page contains a second <style> later in the document: inlining the wordmark SVG introduced one
   inside <header>, and every rebuilt section's CSS was appended INTO THAT SVG. The page assembled,
   braces balanced, and the rules were simply not in the cascade: the hero callout still computed
   15px against a rule whose own floor is 20px. Anchor to </head> and assert the target is before it. */
const headEnd = src.indexOf('</head>');
if (headEnd === -1) throw new Error('no </head> found');
const styleEnd = src.lastIndexOf('</style>', headEnd);
if (styleEnd === -1) throw new Error('no <style> inside <head> to append to');
if (styleEnd > headEnd) throw new Error('resolved a </style> outside <head>, refusing to append');
src = src.slice(0, styleEnd) + css + src.slice(styleEnd);

/* ---- 3. assert brace balance on the assembled stylesheet, comments MASKED not stripped ---- */
const styles = [...src.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map(m => m[1]).join('\n');
const masked = styles.replace(/\/\*[\s\S]*?\*\//g, s => ' '.repeat(s.length));
const o = (masked.match(/\{/g) || []).length, c = (masked.match(/\}/g) || []).length;
if (o !== c) throw new Error(`brace imbalance after assembly: ${o} open vs ${c} close. Nothing written.`);

/* ---- 4. assert the form ids the JS binds to all survived ---- */
for (const id of ['regTop', 'regBottom', 'n1', 'w1', 'e1', 'n2', 'w2', 'e2', 'nextInline', 'nextDate', 'nextTime']) {
  const n = (src.match(new RegExp(`id="${id}"`, 'g')) || []).length;
  if (n !== 1) throw new Error(`id="${id}" appears ${n} times after assembly, expected exactly 1. The registration JS would break.`);
}

writeFileSync(OUT, src);
const after = { bytes: src.length, sections: (src.match(/<section\b/g) || []).length };
console.log(log.reverse().join('\n'));
console.log(`\nsections ${before.sections} -> ${after.sections}`);
console.log(`bytes    ${before.bytes} -> ${after.bytes}`);
console.log(`braces   balanced (${o})`);
console.log(`form ids intact`);
console.log(`\nwrote ${OUT}`);
