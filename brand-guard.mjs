#!/usr/bin/env node
/* Brand + stylesheet guard. Exists because two defects shipped on 17 Sep 2026 that no check caught:
   an orphan closing brace that killed every rule after it (page went 9,336px -> 126,962px), and
   Space Mono rendering above 14px, which the locked brand forbids.
   Run: node brand-guard.mjs        (exit 0 = clean, 1 = breach)                                  */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const CEILING = 14;                       // Space Mono never exceeds this. Measured on aiwithremy.com.
const EXCEPTION = /data-fallback/;        // wordmark shown only if the logo SVG fails. Declared, with reason, in each file.

function walk(dir, out = []) {
  for (const f of readdirSync(dir)) {
    if (/^(node_modules|\.git|_site|screenshots)$/.test(f)) continue;
    const p = join(dir, f);
    if (statSync(p).isDirectory()) walk(p, out);
    else if ([".html", ".css"].includes(extname(p))) out.push(p);
  }
  return out;
}
const mask = (s) => s.replace(/\/\*[\s\S]*?\*\//g, (c) => " ".repeat(c.length));
const cssOf = (p, s) =>
  extname(p) === ".css" ? s : [...s.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join("\n");

let fail = 0;
for (const p of walk(".")) {
  const src = readFileSync(p, "utf8");
  const css = mask(cssOf(p, src));
  if (!css.trim()) continue;

  // 1. brace balance. An orphan brace silently kills every rule after it.
  const o = (css.match(/\{/g) || []).length, c = (css.match(/\}/g) || []).length;
  if (o !== c) { console.error(`BRACE   ${p}  { = ${o}  } = ${c}`); fail++; }

  // 2. Space Mono above the ceiling. Catches element rules AND pseudo-element rules,
  //    because querySelectorAll cannot see ::before/::after and a DOM sweep misses them.
  for (const m of css.matchAll(/([^{}\n]*)\{([^}]*var\(--mono\)[^}]*)\}/g)) {
    const sel = m[1].trim();
    if (EXCEPTION.test(sel)) continue;
    const sizes = [...m[2].matchAll(/font-size:\s*(?:clamp\(\s*[0-9.]+px\s*,[^,]+,\s*)?([0-9.]+)px/g)].map((x) => +x[1]);
    const over = sizes.filter((s) => s > CEILING);
    if (over.length) { console.error(`MONO    ${p}  ${Math.max(...over)}px  ${sel.slice(0, 44)}`); fail++; }
  }
}
console.log(fail ? `\nbrand-guard: ${fail} breach(es)` : "brand-guard: clean");
process.exit(fail ? 1 : 0);
