// Gate oracles for the Sprint registration page rebuild.
// Each subcommand prints a success-only token, and only after every assertion passes.
// Run from the repo root: node sprint/verify.mjs <sources|jargon|assets|sections|clean|layout>
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const PAGE = process.env.PAGE || join(here, "index.html");
const RAW = "/Users/sandy/HQ/Sandy/offers/sprint/research/india-voices-2026-08/RAW.md";
const fails = [];
const need = (cond, msg) => { if (!cond) fails.push(msg); };
const read = (p) => (existsSync(p) ? readFileSync(p, "utf8") : "");

const html = read(PAGE);
if (!html) { console.error(`page missing: ${PAGE}`); process.exit(1); }

// visible text only: drop script and style blocks, then tags
const visible = html
  .replace(/<script[\s\S]*?<\/script>/gi, " ")
  .replace(/<style[\s\S]*?<\/style>/gi, " ")
  .replace(/<!--[\s\S]*?-->/g, " ")
  .replace(/<[^>]+>/g, " ")
  .replace(/&amp;/g, "&").replace(/&nbsp;/g, " ").replace(/&#39;|&rsquo;/g, "'")
  .replace(/\s+/g, " ");

const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").replace(/\s+/g, " ").trim();

const which = process.argv[2];

if (which === "sources") {
  // Every buyer-pain line carries data-q="Q50". The quoted words must actually exist
  // in that quote's block in RAW.md. A fabricated or drifted quote fails here.
  const raw = read(RAW);
  need(raw.length > 10000, "RAW.md missing or truncated");
  const blocks = {};
  for (const part of raw.split(/\n### /).slice(1)) {
    const id = part.split("\n")[0].trim();
    blocks[id] = norm(part);
  }
  const cites = [...html.matchAll(/data-q="(Q\d+)"[^>]*>([\s\S]*?)<\/(?:p|blockquote|span|div|li)>/g)];
  need(cites.length >= 4, `only ${cites.length} sourced buyer quotes on the page, need >= 4`);
  const seen = new Set();
  for (const [, id, inner] of cites) {
    seen.add(id);
    need(blocks[id], `cited ${id} does not exist in RAW.md`);
    if (!blocks[id]) continue;
    const quoted = norm(inner.replace(/<[^>]+>/g, " "));
    const words = quoted.split(" ").filter(Boolean);
    need(words.length >= 6, `${id} quote too short to verify (${words.length} words)`);
    // the quote must appear verbatim as a contiguous run in that block
    need(blocks[id].includes(quoted), `${id} quote on the page is not verbatim in RAW.md: "${quoted.slice(0, 70)}"`);
  }
  need(seen.size >= 4, `only ${seen.size} distinct quotes cited, need >= 4`);
  if (!fails.length) console.log("SOURCES VERIFIED");
}

if (which === "jargon") {
  // Sandy, 16 Sep: "what is half? do people understand what type of half you're talking about".
  // These words mean something to us and nothing to a cold reader, so they are banned from visible text.
  const banned = ["both halves", "upstream", "downstream", "operator", "orchestration", "the stack"];
  const v = visible.toLowerCase();
  for (const b of banned) {
    const hit = v.includes(b);
    need(!hit, `banned internal vocabulary on the page: "${b}"`);
  }
  if (!fails.length) console.log("JARGON VERIFIED");
}

if (which === "assets") {
  // A face, and payment proof that is cropped to the amount rather than to Gmail chrome.
  const photos = [...html.matchAll(/src="([^"]*assets\/photos\/[^"]+)"/g)].map((m) => m[1]);
  need(photos.length >= 1, "no photo of Sandy on the page");
  for (const p of photos) {
    const abs = join(here, p.replace(/^\.\.\//, "../"));
    need(existsSync(abs), `photo referenced but missing on disk: ${p}`);
  }
  const proofs = [...html.matchAll(/src="([^"]*assets\/proof\/[^"]+)"/g)].map((m) => m[1]);
  need(proofs.length >= 3, `only ${proofs.length} payment proofs shown, need >= 3`);
  for (const p of proofs) {
    need(/crop-\d+\.png$/.test(p), `proof uses the uncropped screenshot, amount is not legible: ${p}`);
    const abs = join(here, p.replace(/^\.\.\//, "../"));
    need(existsSync(abs), `proof referenced but missing on disk: ${p}`);
    if (existsSync(abs)) need(statSync(abs).size > 5000, `proof file suspiciously small: ${p}`);
  }
  if (!fails.length) console.log("ASSETS VERIFIED");
}

if (which === "sections") {
  // Depth, measured. Every section must declare the job it does for the buyer.
  const sections = [...html.matchAll(/<section[^>]*>/g)].map((m) => m[0]);
  need(sections.length >= 9, `only ${sections.length} sections, need >= 9`);
  const jobless = sections.filter((s) => !/data-job="[^"]{8,}"/.test(s));
  need(jobless.length === 0, `${jobless.length} section(s) with no stated data-job`);
  if (!fails.length) console.log("SECTIONS VERIFIED");
}

if (which === "clean") {
  const markers = visible.match(/\b(TBD|TODO|LOREM|PLACEHOLDER|XXX|FIXME|COMING SOON)\b/gi) || [];
  need(markers.length === 0, `placeholder text on the page: ${[...new Set(markers)].join(", ")}`);
  need(!/[—]/.test(html), "em dash present");
  need(!/\bSPOKEN_|_PENDING\b/.test(html), "unresolved template marker");
  if (!fails.length) console.log("CLEAN VERIFIED");
}

if (which === "layout") {
  // Real browser, real viewports. Measures overflow and how far down the form sits on a phone.
  const PUP = "/Users/sandy/HQ/System/tools/pdf-renderer/node_modules/puppeteer";
  // main is CJS, so a bare dynamic import of the directory fails. Resolve it as a require.
  const { createRequire } = await import("node:module");
  const require = createRequire(import.meta.url);
  let puppeteer;
  try { puppeteer = require(PUP); }
  catch (e) { console.error(`puppeteer not loadable from ${PUP}: ${e.message}`); process.exit(1); }
  const url = process.env.URL || "http://127.0.0.1:4173/sprint/";
  // The version puppeteer wants is not installed. Use the newest Chrome build in its cache
  // instead of a hardcoded version, and fail loudly rather than silently skipping the gate.
  const { readdirSync, existsSync } = await import("node:fs");
  const CACHE = `${process.env.HOME}/.cache/puppeteer/chrome`;
  let exe = process.env.CHROME_PATH || "";
  if (!exe) {
    const builds = existsSync(CACHE) ? readdirSync(CACHE).filter((d) => /^mac/.test(d)).sort() : [];
    const newest = builds[builds.length - 1];
    if (!newest) { console.error(`no chrome build under ${CACHE}`); process.exit(1); }
    exe = `${CACHE}/${newest}/chrome-mac-arm64/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing`;
  }
  if (!existsSync(exe)) { console.error(`chrome executable not found: ${exe}`); process.exit(1); }
  const browser = await puppeteer.launch({ headless: "new", executablePath: exe });
  try {
    for (const [w, h] of [[375, 812], [768, 1024], [1440, 900]]) {
      const page = await browser.newPage();
      await page.setViewport({ width: w, height: h });
      // The three viewports share one browser's HTTP cache, so the second and third loads
      // revalidated against the server's Last-Modified and came back 304, which resp.ok()
      // rejects: the gate reported "page did not load" for a page that had loaded fine.
      // A gate that fails for the wrong reason hides whatever it was built to catch.
      await page.setCacheEnabled(false);
      const resp = await page.goto(url, { waitUntil: "networkidle0", timeout: 20000 });
      need(resp && resp.ok(), `page did not load at ${w}px (status ${resp ? resp.status() : "none"})`);
      const m = await page.evaluate(() => {
        const d = document.documentElement;
        const form = document.querySelector("form");
        const r = form ? form.getBoundingClientRect() : null;
        return {
          scrollW: d.scrollWidth, clientW: d.clientWidth,
          formTop: r ? r.top + window.scrollY : -1,
          vh: window.innerHeight,
          imgs: [...document.querySelectorAll('img[src*="assets/proof/"]')].map((i) => i.getBoundingClientRect().width),
        };
      });
      need(m.scrollW <= m.clientW + 1, `horizontal overflow at ${w}px: scrollWidth ${m.scrollW} vs client ${m.clientW}`);

      // Content must be VISIBLE without scrolling once the reveal backstop has fired.
      // A build shipped nine sections at opacity 0 and no other gate noticed.
      await new Promise((r) => setTimeout(r, 1900));
      const hidden = await page.evaluate(() =>
        [...document.querySelectorAll(".reveal")]
          .map((el, i) => ({ i, op: parseFloat(getComputedStyle(el).opacity) }))
          .filter((x) => x.op < 0.9).length);
      need(hidden === 0, `${hidden} revealed block(s) still invisible at ${w}px after the backstop`);
      need(m.formTop > 0, `no form found at ${w}px`);
      if (w === 375) need(m.formTop < m.vh * 1.2, `form sits ${Math.round(m.formTop)}px down at 375px, past 1.2 screens (${Math.round(m.vh * 1.2)}px)`);
      // The reveal check runs at EVERY viewport. It used to sit inside the 1440 block, so it had
      // never run at phone width, and a capture caught 2 sections at 375 that never received their
      // arrival class while this gate reported green. Most of the traffic is the width the gate
      // was not looking at.
      {
        // A reader who flicks down the page must not outrun the reveal. IntersectionObserver
        // coalesces during fast scrolling and silently skips elements it passed over: measured
        // 16 Sep, a 400px-step walk left 8 of 9 sections without their arrival class, so their
        // entrance motion never played and they sat 14px low for the rest of the visit.
        const walk = await page.evaluate(async () => {
          // aiml-funnel.css sets html{scroll-behavior:smooth} globally, so each scrollTo starts
          // an animation that the next one interrupts 55ms later. Measured 16 Sep: this walk
          // asked for 8,000px and the page actually reached 738 of a possible 8,188 before
          // returning to top, so the check was grading its own stalled walk and reporting the
          // page as broken. Force instant jumps for the measurement, then restore.
          const root = document.documentElement;
          const prev = root.style.scrollBehavior;
          root.style.scrollBehavior = "auto";
          // Re-read the page height EVERY step. Bounding the loop by a height captured up front
          // stops the walk short the moment lazy images expand the page: measured at 375, the loop
          // ran to a stale 10,676 while the page grew past 12,700, so the last two sections were
          // never visited and were then reported as "never revealed". The walk graded itself.
          let y = 0, deepest = 0, guard = 0;
          while (guard++ < 500) {
            window.scrollTo(0, y);
            await new Promise((r) => setTimeout(r, 55));
            deepest = Math.max(deepest, window.scrollY);
            let max = document.body.scrollHeight - window.innerHeight;
            if (y >= max) {
              // At the bottom, but lazy images may still be growing the page behind the walk.
              // Breaking here stops at the FIRST bottom, not the final one, which left 6 sections
              // unvisited and then blamed the page for never revealing them. Settle, re-measure,
              // and only stop once the page has actually stopped getting taller.
              await new Promise((r) => setTimeout(r, 300));
              max = document.body.scrollHeight - window.innerHeight;
              if (y >= max) break;
            }
            y = Math.min(y + 400, max);
          }
          const finalMax = Math.round(document.body.scrollHeight - window.innerHeight);
          window.scrollTo(0, 0);
          await new Promise((r) => setTimeout(r, 700));
          root.style.scrollBehavior = prev;
          return {
            deepest: Math.round(deepest),
            maxY: finalMax,
            missed: [...document.querySelectorAll(".reveal")].filter((e) => !e.classList.contains("in")).length,
          };
        });
        // A walk that never moved could never fail the next assertion, which is how this check
        // spent three runs reporting a defect that was not there. Prove the exercise happened.
        need(walk.deepest >= walk.maxY - 60,
          `the fast-scroll check only reached ${walk.deepest}px of ${walk.maxY}px, so its result proves nothing`);
        need(walk.missed === 0,
          `${walk.missed} section(s) never received their arrival class during a fast scroll, so their entrance motion never played`);

        // Line masked headlines sit inside overflow:hidden and are translated fully out of their
        // own box until revealed. That is motion owning visibility, so it needs the same proof the
        // reveal got: after a reader has been down the page, nothing may still be masked. Measured
        // before scrolling, a below-the-fold headline reads matrix(1,0,0,1,0,57), so the metric
        // does discriminate rather than always reading zero.
        // Settle past the longest headline reveal before measuring. The hero splits to 7 lines, so
        // the last one starts at 6 x 0.08s and runs 0.7s: 1.18s total. Measured at 1.2s this read
        // 5 lines still masked and at 1.4s it read zero, which was a mid-transition sample being
        // reported as a stuck page. Same shape as sampling an IntersectionObserver at 140ms.
        await new Promise((r) => setTimeout(r, 1800));
        const masked = await page.evaluate(() =>
          [...document.querySelectorAll(".ln-i")].filter((i) => {
            const t = getComputedStyle(i).transform;
            return t !== "none" && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(t);
          }).length);
        const lines = await page.evaluate(() => document.querySelectorAll(".ln-i").length);
        need(lines > 0, "no line masked headlines found, the headline reveal silently stopped running");
        need(masked === 0, `${masked} of ${lines} headline line(s) stay masked after a full scroll, so that text is invisible`);

        // Width alone certified a collapsed image once. Force the lazy images to load,
        // then assert real decoded pixels AND a rendered box with height.
        const proof = await page.evaluate(async () => {
          const imgs = [...document.querySelectorAll('img[src*="proof/"]')];
          imgs.forEach((i) => i.setAttribute("loading", "eager"));
          await Promise.all(imgs.map((i) => (i.complete ? null : i.decode().catch(() => null))));
          await new Promise((r) => setTimeout(r, 400));
          return imgs.map((i) => {
            const r = i.getBoundingClientRect();
            return { w: Math.round(r.width), h: Math.round(r.height), nW: i.naturalWidth, nH: i.naturalHeight };
          });
        });
        need(proof.length >= 3, `only ${proof.length} proof images on the page at 1440px`);
        const broken = proof.filter((p) => p.nW === 0 || p.nH === 0);
        need(broken.length === 0, `${broken.length} proof image(s) failed to load`);
        // The width floor has to scale with the viewport. A fixed 400px was fine while this only
        // ran at 1440, where the cards are 515 or 1050 wide, but the content column at 375 is
        // 333px, so 400 is unsatisfiable by construction and would fail a perfectly legible phone
        // layout forever. Height stays absolute: 60px is 60px on any screen.
        const minW = Math.round(Math.min(400, w * 0.8));
        const thin = proof.filter((p) => p.w < minW || p.h < 60);
        need(thin.length === 0,
          `${thin.length} proof image(s) render too small to read at ${w}px (need >= ${minW}w, 60h): ${JSON.stringify(proof)}`);
      }
      await page.close();
    }
  } finally { await browser.close(); }
  if (!fails.length) console.log("LAYOUT VERIFIED");
}

// Each ICP gets its own voice. A blended callout is addressed to nobody.
const ICP_NOUNS = {
  agency:  ["retainer", "pipeline", "referral", "scope", "churn", "client work", "word of mouth"],
  coach:   ["booked call", "no show", "cohort", "enrol", "enroll", "dm", "webinar", "batch"],
  service: ["footfall", "enquir", "rebook", "season", "capacity", "walk-in", "retention"],
};
const ICP_CATEGORY = { agency: /agency|freelanc/i, coach: /coach|consult/i, service: /service|salon|manufactur|clinic|restaurant|gym|store|resort/i };

if (which === "icp") {
  const raw = read(RAW);
  const catOf = {};
  for (const part of raw.split(/\n### /).slice(1)) {
    const id = part.split("\n")[0].trim();
    const m = part.match(/- Category: (.+)/);
    catOf[id] = m ? m[1].trim() : "";
  }
  const blocks = [...html.matchAll(/data-icp="(agency|coach|service)"([\s\S]*?)<!--\s*\/icp\s*-->/g)];
  const found = new Set(blocks.map(([, icp]) => icp));
  for (const icp of ["agency", "coach", "service"]) need(found.has(icp), `no block addressed to the ${icp} ICP`);
  for (const [, icp, body] of blocks) {
    const text = body.replace(/<[^>]+>/g, " ").toLowerCase();
    const nouns = ICP_NOUNS[icp].filter((n) => text.includes(n));
    need(nouns.length >= 2, `${icp} block uses only ${nouns.length} of its own nouns, needs 2 or more`);
    const cites = [...body.matchAll(/data-q="(Q\d+)"/g)].map((m) => m[1]);
    need(cites.length >= 1, `${icp} block carries no verbatim quote`);
    for (const id of cites) {
      need(catOf[id] !== undefined, `${icp} block cites ${id}, which is not in the research file`);
      if (catOf[id] !== undefined)
        need(ICP_CATEGORY[icp].test(catOf[id]), `${icp} block cites ${id}, whose category is "${catOf[id]}", a different ICP`);
    }
  }
  if (!fails.length) console.log("ICP VERIFIED");
}

if (which === "structure") {
  const hero = html.match(/<section[^>]*data-role="hero"[\s\S]*?<\/section>/);
  need(hero, "no section marked data-role=\"hero\"");
  if (hero) {
    const slots = [...hero[0].matchAll(/data-slot="([a-z]+)"/g)].map((m) => m[1]);
    for (const s of ["qualifier", "headline", "subhead", "proof", "action", "risk"])
      need(slots.includes(s), `hero is missing the ${s} slot`);
    const actions = slots.filter((s) => s === "action").length;
    need(actions === 1, `hero has ${actions} actions, it must have exactly one`);
  }
  const sections = [...html.matchAll(/<section[^>]*>/g)].map((m) => m[0]);
  need(sections.length >= 9, `only ${sections.length} sections, need >= 9`);
  const jobless = sections.filter((s) => !/data-job="[^"]{8,}"/.test(s));
  need(jobless.length === 0, `${jobless.length} section(s) with no stated data-job`);
  if (!fails.length) console.log("STRUCTURE VERIFIED");
}

if (which === "motion") {
  // Comments are stripped first: they are not rules. The budget comment on the page documents
  // the old ".reveal{opacity:0}" defect by name, and an oracle that reads comments flagged that
  // prose as the defect itself. Stripping also keeps commented-out code out of the selector walk.
  const css = (html.match(/<style[\s\S]*?<\/style>/g) || []).join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, " ");
  const sections = [...html.matchAll(/<section[^>]*>/g)].map((m) => m[0]);
  const noMotion = sections.filter((s) => !/data-motion="[a-z0-9 _-]{2,}"/i.test(s));
  need(noMotion.length === 0, `${noMotion.length} section(s) declare no motion`);
  for (const s of sections) {
    const m = s.match(/data-motion="([a-z0-9 _-]+)"/i);
    if (!m) continue;
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      const re = new RegExp(`\\.${cls}[^{]*\\{[^}]*(animation|transition)\\s*:`, "i");
      need(re.test(css), `declared motion class "${cls}" has no animation or transition in the stylesheet`);
    }
  }
  // Motion must never own opacity: that shipped nine blank sections once.
  const revealZero = /\.[a-z0-9_-]*reveal[a-z0-9_-]*[^{]*\{[^}]*opacity\s*:\s*0\b/i.test(css);
  need(!revealZero, "a reveal rule sets opacity to 0, which renders blank sections before script runs");

  // An animation with no scroll gate starts at page load. Below the fold that means it has
  // FINISHED before the reader ever arrives, so the section has no motion they can see.
  // Measured 16 Sep 2026 on this page: all nine non-hero sections read playState "finished"
  // at t=duration while sitting 1,205 to 8,300px down. The class existed, the keyframes
  // existed, and the old version of this gate passed. Only the hero may animate on load.
  const heroTag = html.match(/<section[^>]*data-role="hero"[^>]*>/);
  const heroCls = heroTag ? (heroTag[0].match(/data-motion="([^"]+)"/) || [, ""])[1].split(/\s+/) : [];
  // For each animation declaration, recover its selector by walking back to the rule's brace.
  // Done positionally rather than with a rule regex so @media and @supports nesting cannot fool it.
  const starters = [];
  for (const d of css.matchAll(/animation\s*:\s*([^;}]+)/g)) {
    if (/^\s*none\b/.test(d[1])) continue;              // reduced-motion kill switches are correct ungated
    const open = css.lastIndexOf("{", d.index);
    const prev = Math.max(css.lastIndexOf("}", open), css.lastIndexOf("{", open - 1));
    starters.push(css.slice(prev + 1, open).trim());
  }
  // The CSS gate above is defeatable from script: handing out the .in class on a timer starts
  // every animation on a clock regardless of scroll position, which is the same defect wearing
  // a different hat. Visibility no longer depends on .in (opacity is never touched), so a
  // blanket timer has nothing left to protect.
  const script = (html.match(/<script[\s\S]*?<\/script>/g) || []).join("\n");
  need(!/setTimeout\s*\(\s*(function\s*\(\s*\)\s*\{\s*)?revealAll/.test(script),
    "a timer calls revealAll(), which gives every section its .in class on a clock and fires " +
    "below-the-fold animations before the reader ever scrolls to them");

  for (const s of sections) {
    const m = s.match(/data-motion="([a-z0-9 _-]+)"/i);
    if (!m) continue;
    for (const cls of m[1].split(/\s+/).filter(Boolean)) {
      if (heroCls.includes(cls)) continue;              // above the fold, so load-time is correct
      const own = starters.filter((sel) => new RegExp(`\\.${cls}(?![a-z0-9_-])`).test(sel));
      need(own.length > 0, `motion class "${cls}" never starts an animation`);
      // ".in" / ".in-view" is the class the observer adds when the section reaches the viewport.
      const ungated = own.filter((sel) => !/\.in\b/.test(sel));
      need(ungated.length === 0,
        `motion class "${cls}" animates with no scroll gate, so it plays at load far below the fold ` +
        `and is over before the reader scrolls to it: ${ungated.map((x) => `"${x}"`).join(", ")}`);
    }
  }
  if (!fails.length) console.log("MOTION VERIFIED");
}

if (which === "tracking") {
  // The live form declares six questions. Three are required and the page fills them. Two optional
  // ones carry the only signal that tells a Sprint registrant from an Accelerator one, and which
  // Instagram post produced them, and the page was discarding both.
  // Comments stripped first. A comment is not code, and the first version of this check flagged
  // the very comment explaining that the consent field must never be sent. That is the second
  // time tonight an oracle read its own documentation as the defect: the motion gate did it to a
  // CSS comment describing the old opacity bug. Knowing the lesson in CSS did not stop me
  // repeating it in JavaScript, so it is now written down in both places.
  const script = (html.match(/<script[\s\S]*?<\/script>/g) || []).join("\n")
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
  need(/entry\.710508377/.test(script), "the page never sends the registration source, so every row in the sheet is indistinguishable");
  need(/entry\.1360010079/.test(script), "the page never sends attribution, so a registration cannot be traced to the post that caused it");
  need(/append\(\s*F_SOURCE\s*,\s*['"][^'"]{4,}['"]/.test(script), "the registration source field is declared but posted empty");
  // A consent flag written by script is a fabricated consent record. Assert on what is POSTED,
  // not on the id appearing somewhere, so documenting the rule can never trip the rule.
  need(!/append\s*\([^)]*2045735371/.test(script) && !/F_CONSENT/.test(script),
    "the page posts the consent field from script, which fabricates a consent record for a person who never gave one");
  // Silent data loss is the worst defect a registration page can have: the visitor is told they
  // are booked and the row never arrives. The navigation must be chained to the request settling,
  // not fired on a short timer that races it.
  need(/sent\s*\.\s*then\s*\(\s*go\s*\)/.test(script),
    "the page navigates to the thank you page without waiting for the registration POST to settle, so a slow connection loses the registrant silently");
  need(!/setTimeout\s*\(\s*function\s*\(\)\s*\{\s*location\.href\s*=\s*['"]thanks/.test(script),
    "the redirect is on a bare short timer racing the submission rather than chained to it");
  if (!fails.length) console.log("TRACKING VERIFIED");
}

if (which === "spine") {
  // Sandy, 16 Sep 2026, in offers/sprint/memory/sprint-live-16sep2026.md, verbatim:
  // "The old six-system spine (outreach, design, automation, paid, content, orchestration, one per
  //  week) is DEAD as the Sprint's shape... written from our point of view, not the buyer's...
  //  The exact six weeks are still being brainstormed. Do not ship the old spine."
  // The page shipped it anyway, through nine green gates, because no gate read his decisions.
  const weeks = html.match(/<section[^>]*data-motion="wk-in"[\s\S]*?<\/section>/);
  need(weeks, "no six weeks section found to check against the killed spine");
  if (weeks) {
    const headings = [...weeks[0].matchAll(/<h3>([\s\S]*?)<\/h3>/g)].map((m) => m[1].replace(/<[^>]+>/g, " "));
    const DEAD = /outreach|content|\bads?\b|orchestrat|front door|dashboard|automation/i;
    const hits = headings.filter((h) => DEAD.test(h));
    need(hits.length < 3,
      `the six weeks still read as the killed one-system-per-week spine: ${hits.length} of ` +
      `${headings.length} week headings name a system from it (${hits.map((h) => `"${h.trim()}"`).join(", ")})`);
    // He gave a shape and only a shape: upstream first, automation last. Anything more is invented.
    const text = weeks[0].replace(/<[^>]+>/g, " ").toLowerCase();
    need(/first (three|3|four|4)|last (two|2)|upstream|first few weeks/.test(text),
      "the six weeks section does not state the two phase shape Sandy actually gave: clients coming in first, automation last");
  }
  if (!fails.length) console.log("SPINE VERIFIED");
}


/* ---------------------------------------------------------------------------
   ROUND 2 ORACLES. Every one of these is Sandy's instruction from 17 Sep 2026,
   turned into something that fails. Written BEFORE the page is touched, so each
   is red against the current build and has to be earned.
   --------------------------------------------------------------------------- */
const css2 = (html.match(/<style[\s\S]*?<\/style>/g) || []).join("\n").replace(/\/\*[\s\S]*?\*\//g, " ");
const js2  = (html.match(/<script[\s\S]*?<\/script>/g) || []).join("\n")
  .replace(/\/\*[\s\S]*?\*\//g, " ").replace(/(^|[^:])\/\/[^\n]*/g, "$1 ");
const sections2 = [...html.matchAll(/<section[\s\S]*?<\/section>/g)].map((m) => m[0]);

if (which === "r1-qualifier") {
  // "that thing is too fucking small, I'm not able to fucking see it"
  const rule = css2.match(/\.callout\s*\{([^}]*)\}/);
  need(rule, "no .callout rule found for the hero qualifier");
  if (rule) {
    const fs = rule[1].match(/font-size\s*:\s*clamp\(\s*([\d.]+)px[^,]*,[^,]*,\s*([\d.]+)px/);
    need(fs, "the qualifier font-size is not a clamp, so its floor cannot be checked");
    if (fs) {
      const floor = parseFloat(fs[1]), ceil = parseFloat(fs[2]);
      need(floor >= 14, `the hero qualifier floor is ${floor}px on a phone, which is the size he said he cannot see. Needs >= 14px`);
      need(ceil >= 17, `the hero qualifier tops out at ${ceil}px on desktop. Needs >= 17px`);
    }
    need(!/letter-spacing\s*:\s*\.1[3-9]em|letter-spacing\s*:\s*0?\.[2-9]/.test(rule[1]),
      "the qualifier is track-spaced like a micro label, which is what makes it unreadable at small size");
  }
  if (!fails.length) console.log("R1 VERIFIED");
}

if (which === "r2-headline") {
  // "the Y and G part which is there, it's absolute fucking shit, what is this cut?"
  need(!/\.lines-split/.test(js2) || /descender|overflow\s*:\s*visible|padding-bottom/.test(css2),
    "headline lines are clipped by overflow:hidden with no descender room, so letters with tails (y, g) get cut");
  const ln = css2.match(/\.lines-split\s+\.ln\s*\{([^}]*)\}/);
  if (ln) need(/padding-bottom|overflow\s*:\s*clip\s+visible|line-height/.test(ln[1]),
    "the line mask box has no descender allowance, which is exactly the y and g cut he is pointing at");
  if (!fails.length) console.log("R2 VERIFIED");
}

if (which === "r3-wordmark") {
  // "an AI marketing lab thing which is there, that also needs to be animated"
  const mark = html.match(/<img[^>]*class="mark"[^>]*>/);
  need(mark, "no wordmark found in the header");
  // This gate was VACUOUS and a negative control caught it: it certified R3 on a copy where the
  // wordmark animation had just been deleted, because the reduced-motion override
  // `.bar .mark{animation:none}` still matched `\.mark\{[^}]*animation\s*:`. An oracle that passes
  // on "animation: none" is measuring the presence of a word, not the presence of motion. It also
  // had an escape hatch, /wordmark-in|mark-in/, that passed if the NAME appeared anywhere in the
  // stylesheet, whether or not the wordmark used it. Both are gone.
  const markRules = [...css2.matchAll(/([^{}]*\.mark[^{}]*)\{([^{}]*)\}/g)];
  need(markRules.length, "no CSS rule targets the wordmark at all");
  const defined = new Set([...css2.matchAll(/@keyframes\s+([A-Za-z0-9_-]+)/g)].map((m) => m[1]));
  const animated = markRules.filter(([, , body]) => {
    const decl = body.match(/animation(?:-name)?\s*:\s*([^;]+)/);
    if (!decl) return false;
    const v = decl[1].trim();
    if (/^none\b/.test(v)) return false;            // the reduced-motion override is not motion
    return [...defined].some((k) => new RegExp(`\\b${k}\\b`).test(v));
  });
  need(animated.length,
    `the AI Marketing Lab wordmark has no animation naming a keyframe this stylesheet defines (found ${markRules.length} .mark rule(s), ${defined.size} keyframe(s) defined)`);
  if (!fails.length) console.log("R3 VERIFIED");
}

if (which === "r4-icp-repeat") {
  // "again, three business, the same quiet month, again you're calling the ICP out"
  const visible2 = html.replace(/<script[\s\S]*?<\/script>/g," ").replace(/<style[\s\S]*?<\/style>/g," ")
    .replace(/<!--[\s\S]*?-->/g," ").replace(/<[^>]+>/g," ").replace(/\s+/g," ");
  // THIS GATE WAS VACUOUS and passed on exactly the page he complained about. The old regex
  // required all three buyer names inside ~100 characters, which ONLY the hero qualifier does,
  // so it measured the hero and reported a pass while the page still carried an eyebrow asking
  // "which one are you", a headline counting "three businesses", and a label on every card naming
  // that card's buyer type. The labelling is what he was pointing at, so measure the labelling.
  const canon = (s) => (/agency/i.test(s) ? "agency" : /coach/i.test(s) ? "coach" : /service/i.test(s) ? "service" : "");
  const TYPE = /(?:marketing )?agency owners?|high[- ]ticket coach(?:es)?|coach(?:es)?|service business (?:owners?|providers?)/gi;
  // Text runs, split at element boundaries, so "one run" means "one element's own words".
  const runs = html.replace(/<script[\s\S]*?<\/script>/g, " ").replace(/<style[\s\S]*?<\/style>/g, " ")
    .replace(/<!--[\s\S]*?-->/g, " ").replace(/<[^>]+>/g, " ").split(" ")
    .map((t) => t.replace(/\s+/g, " ").trim()).filter(Boolean);
  // (a) A recitation: one run naming two or more of the three types. The hero is allowed one.
  const recitations = runs.filter((t) => new Set((t.match(TYPE) || []).map(canon).filter(Boolean)).size >= 2);
  need(recitations.length <= 1,
    `the page recites the buyer list ${recitations.length} times: ${recitations.map((r) => `"${r.slice(0, 46)}"`).join(", ")}. Once, in the hero, is the brief`);
  // (b) A label: a run that is NOTHING BUT a buyer type. The quote and its source already say
  //     who is speaking, so a tag above them is the ICP called out a second time.
  const labels = runs.filter((t) => t.length <= 40 && new RegExp(`^(?:${TYPE.source})$`, "i").test(t));
  need(labels.length === 0,
    `${labels.length} element(s) are nothing but an ICP label: ${labels.map((l) => `"${l}"`).join(", ")}. The quote and its source already say who is speaking`);
  if (!fails.length) console.log("R4 VERIFIED");
}

if (which === "r5-not-just-copy") {
  // "copy after copy, who will fucking see these copies"
  const bare = [];
  for (const s of sections2) {
    const job = (s.match(/data-job="([^"]{6,40})/) || [,"?"])[1];
    // `mg-` is the motion-graphic primitive marker (mg-draw, mg-grow, mg-tick, mg-land...). A
    // twelve-cell strip built from spans is not a paragraph, but the original vocabulary could
    // only see media tags, so it reported a section carrying real built elements as pure copy.
    // Widened deliberately and narrowly: `data-figure` is NOT borrowed for this, because R10 owns
    // that attribute for figures that trace to a file or an ad account, and overloading it there
    // would quietly weaken the gate that stops invented numbers.
    const hasThing = /<img|<video|<svg|<canvas|data-figure|class="[^"]*(track|bar|chart|frame|shot|work|mg-)/.test(s);
    if (!hasThing) bare.push(job);
  }
  need(bare.length === 0,
    `${bare.length} section(s) are nothing but paragraphs: ${bare.map((b)=>`"${b}"`).join(", ")}`);
  if (!fails.length) console.log("R5 VERIFIED");
}

if (which === "r6-proof-composed") {
  // "you have just sticked these payments... arrange these things as to they fucking look real"
  const proof = sections2.find((s) => /assets\/proof\//.test(s)) || "";
  need(proof, "no proof section found");
  need(/data-composed/.test(proof),
    "the payments are still a plain stack. They need composing as one arranged object, marked data-composed");
  need(/data-motion-graphic/.test(proof),
    "the proof section carries no motion graphic, only an entrance reveal");
  if (!fails.length) console.log("R6 VERIFIED");
}

if (which === "r7-buckets") {
  // his four buckets, by type of content produced, not by client
  const want = ["design", "content", "automations", "performance"];
  const found = [...html.matchAll(/data-bucket="([a-z]+)"/g)].map((m) => m[1]);
  for (const w of want) need(found.includes(w), `the work section has no "${w}" bucket`);
  need(found.length >= 4, `only ${found.length} buckets present, his division is four`);
  if (!fails.length) console.log("R7 VERIFIED");
}

if (which === "r8-no-robot") {
  // "you're showing PawMe's robot... that is what the work is fucking showing"
  need(!/pawme|openpaw|openbot|robie|orbie/i.test(html),
    "PawMe product imagery or naming is still on the page, which makes the work read as a robotics company");
  if (!fails.length) console.log("R8 VERIFIED");
}

if (which === "r9-no-dead-creatives") {
  // "I never fucking used these creatives because they were absolute fucking shit"
  const dead = ["work-1", "work-2", "work-3", "work-4", "work-5", "work-6"];
  const hits = dead.filter((d) => new RegExp(`assets/work/${d}\\.`).test(html));
  need(hits.length === 0, `${hits.length} rejected Riarh creative(s) still on the page: ${hits.join(", ")}`);
  if (!fails.length) console.log("R9 VERIFIED");
}

if (which === "r10-figures") {
  // "you can kind of animate those figures" and every figure must trace to a source
  const figs = [...html.matchAll(/data-figure="([^"]*)"[^>]*data-source="([^"]*)"/g)];
  need(figs.length >= 3, `only ${figs.length} sourced figures on the page, need at least 3`);
  for (const [, val, src] of figs) {
    need(src.trim().length > 6, `figure "${val}" has no traceable source`);
  }
  need(/count-?up|countUp|data-count/.test(js2 + css2),
    "the figures do not animate, and he asked for the figures to be animated rather than screenshotted");
  if (!fails.length) console.log("R10 VERIFIED");
}

if (which === "r11-portrait") {
  // "and then I am coming here in black and white"
  need(!/\.portrait\s*\{[^}]*grayscale\(1\)/.test(css2) && !/filter\s*:\s*grayscale\(\s*1\s*\)/.test(css2),
    "the founder portrait is still forced to greyscale");
  if (!fails.length) console.log("R11 VERIFIED");
}

if (which === "r12-motion-graphics") {
  // "where the fuck is motion graphic bro". An entrance fade is not a motion graphic.
  const without = sections2.filter((s) => !/data-motion-graphic="[a-z0-9 _-]{2,}"/i.test(s));
  need(without.length === 0,
    `${without.length} of ${sections2.length} sections have no motion graphic, only an entrance reveal`);
  if (!fails.length) console.log("R12 VERIFIED");
}

if (which === "r13-remotion") {
  const manifest = "sprint/motion/MANIFEST.json";
  need(existsSync(join(here, "motion/MANIFEST.json")),
    `no ${manifest}: nothing records which motion asset was produced with Remotion, or from what`);
  if (existsSync(join(here, "motion/MANIFEST.json"))) {
    const m = JSON.parse(read(join(here, "motion/MANIFEST.json")) || "{}");
    need(Array.isArray(m.assets) && m.assets.length >= 1, "the motion manifest lists no assets");
    for (const a of (m.assets || [])) {
      need(a.tool, "a motion asset does not say which tool produced it");
      need(a.file && existsSync(join(here, "motion", a.file)), `motion asset ${a.file} is listed but not on disk`);
      need(a.source, `motion asset ${a.file} does not say what data or footage it was built from`);
    }
  }
  if (!fails.length) console.log("R13 VERIFIED");
}

if (which === "r14-comparison") {
  const f = join(here, "REMY-COMPARISON.md");
  need(existsSync(f), "no REMY-COMPARISON.md: the section by section comparison he asked for twice does not exist");
  if (existsSync(f)) {
    const t = read(f);
    need(t.length > 1200, "the comparison is too thin to be a comparison");
    need((t.match(/^\|/gm) || []).length >= 10, "the comparison has no per section table");
    need(/aiwithremy\.com/.test(t), "the comparison does not cite the reference it is comparing against");
  }
  if (!fails.length) console.log("R14 VERIFIED");
}

if (which === "r15-rebuilt") {
  // the four he named as absolute shit, each must differ from the round 1 text
  const dead = [
    "Six weeks. Two hundred dollars.",
    "Come, or skip it.",
    "The five things people ask.",
  ];
  const still = dead.filter((d) => html.includes(d));
  need(still.length === 0,
    `${still.length} section headline(s) he called absolute shit are unchanged: ${still.map((s)=>`"${s}"`).join(", ")}`);
  if (!fails.length) console.log("R15 VERIFIED");
}

if (!["sources", "jargon", "assets", "sections", "clean", "layout", "icp", "structure", "motion", "spine", "tracking", "r1-qualifier", "r2-headline", "r3-wordmark", "r4-icp-repeat", "r5-not-just-copy", "r6-proof-composed", "r7-buckets", "r8-no-robot", "r9-no-dead-creatives", "r10-figures", "r11-portrait", "r12-motion-graphics", "r13-remotion", "r14-comparison", "r15-rebuilt"].includes(which)) {
  fails.push("usage: node sprint/verify.mjs sources|jargon|assets|sections|clean|layout|icp|structure|motion|spine|tracking");
}
if (fails.length) { console.error(fails.join("\n")); process.exit(1); }
