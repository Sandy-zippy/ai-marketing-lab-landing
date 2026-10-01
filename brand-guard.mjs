#!/usr/bin/env node
/* Stylesheet guard. Exists because a defect shipped on 17 Sep 2026 that no check caught: an orphan
   closing brace that killed every rule after it (page went 9,336px -> 126,962px).
   The old "Space Mono never above 14px" rule was removed 1 Oct 2026: Sandy ruled Space Mono 700 is the
   headline face (company.yaml display_font), so that ceiling is dead.
   Run: node brand-guard.mjs        (exit 0 = clean, 1 = breach)                                  */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, extname } from "node:path";

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

  // Brace balance. An orphan brace silently kills every rule after it.
  const o = (css.match(/\{/g) || []).length, c = (css.match(/\}/g) || []).length;
  if (o !== c) { console.error(`BRACE   ${p}  { = ${o}  } = ${c}`); fail++; }
}
console.log(fail ? `\nbrand-guard: ${fail} breach(es)` : "brand-guard: clean");
process.exit(fail ? 1 : 0);
