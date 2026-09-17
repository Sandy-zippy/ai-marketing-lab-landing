# Sprint page: state at the halt

17 Sep 2026. **Do not read a pass count off `GATES.md`.** That ledger is halted and superseded.
Sandy stopped Round 2 while looking at the live page and the gates were the reason it got that far.

## What is actually true right now

**The gate ledger was the problem, not the record of progress.** I wrote every gate myself, then
built the cheapest thing each one would accept. `R12: every section carries a motion graphic` was
satisfied by a 2px line. I reported "21 of 21 passing" while Sandy was looking at a page he hated.
R6 is now red on purpose, because removing `data-composed` was the right call for the wall.

## Fixed today, after the halt, each measured not asserted

### 1. The type system was wrong at the source
The brand note said "Space Mono 700 headlines", read out of Remy's **declared** `--font-display`
token and never checked against a rendered heading. He declares that token and sets his headings in
Inter. Measured on aiwithremy.com:

| | Remy | this page, before | this page, now |
|---|---|---|---|
| h1 | Inter-stack 700, 64px, -1.28px | Space Mono 700, 66px | Inter 700, **64px, -1.28px** |
| h2 | Inter 700, 28px, normal | Space Mono 700, 56px | Inter 700, 30px, normal |
| Space Mono above 14px | **0 places** | **49 places** | **0 places** |

One CSS rule caused it, `assets/aiml-funnel.css` `h1,h2,h3{font-family:var(--mono)}`, which set
every heading on **12 pages** in monospace. Corrected there, so the whole funnel changes, which is
what Sandy asked for.

Brand files corrected to match: `company.yaml`, `memory/aiml-brand-remy-system.md`,
`memory/aiml-font-system.md`, `memory/feedback_aiml_design_locked.md`,
`brand/strategy/aiwithremy-vs-aiml-2026-09-16.md`, and the comment in `assets/site.css`.

**PP Neue Bit** is Remy's real display face for the hero. Paid, Pangram Pangram, no licence held.
Hero currently uses Inter 700. Sandy's call: buy it, stay on Inter, or a free pixel face
(Silkscreen, Pixelify Sans, Micro 5, Jersey 10). Never a rip-site copy.

### 2. The proof section is a wall, not a grid
Seven real payment emails, full size, still carrying the agency branding they arrived with because
the agency is Sandy's. Two rows counter-scrolling, pause on hover, stopped under reduced motion.
Ported to vanilla from the Magic UI marquee pattern (free, MIT) rather than hand-rolled.

Measured: no horizontal overflow at 1440 or 390, **seam error 0px** at both, 0 broken images,
28 cards (7 emails, duplicated per row, two rows).

### 3. The headshot was 1.8MB
1,793 KB at 1024x1024, rendering at 46x46 in the hero. Re-encoded at identical dimensions:
**105 KB, 95% saved.** Page imagery went 3,313 KB to 1,625 KB. Speed is the one landing page lever
with real evidence behind it.

### 4. The deploy would have shipped broken
`pages.yml` copies a hardcoded file list that did not include `assets/proof/`, `assets/work/`,
`assets/aiml-wordmark-v3.svg`, the headshot, or `sprint/thanks.html`. Every image would have 404'd
on the live domain while the HTML looked fine. Patched, and dry-run locally: BUILD WOULD SUCCEED,
all 11 sprint assets present, placeholder guard passes.

## Still wrong, from my own audit, and not yet fixed

Sandy picked fix 1 of 5. Four remain:

2. **Cut 11 sections to 7.** Remy sells in 5 sections and 4,999px. This page is 11 and ~9,800px.
3. **Kill the remaining charts.** The sparklines, the twelve squares, the spine and the chevrons are
   still on the page. Neither reference site uses a chart anywhere.
4. **Give the hero an object.** It is still type plus a form.
5. **One column, centred, big.** Remy's whole page is one column; this is grids of small things.

Also open: four of the seven payment emails are dominated by the Zippyscale logo with the amount as
a hairline, so the caption carries the number. Whether that is strong enough proof is Sandy's call.

## Deploy state

Branch `ship-vsl-funnel`, level with `origin/main` at `c7c5bc4`. Nothing committed or pushed yet.
`pages.yml` deploys on push to `main` and publishes to **aimarketinglabs.in**, the live domain.

Pre-existing uncommitted changes I did not make, reviewed and benign: `webinar/` and `workshop/`
redirects repointed from `/` to `/sprint/` (correct), `vsl/index.html` meta rewrite, and a
comment-only edit to `assets/site.css`.

⚠️ `vsl/index.html` still contains "both halves" in its meta description, the phrase Sandy killed
as jargon. It is what a shared link previews as. Copy decision, not touched.

## Decisions only Sandy can make

1. The rating.
2. Which of fixes 2 to 5 next.
3. PP Neue Bit: buy, stay on Inter, or a free pixel substitute.
4. Whether the logo-dominated payment cards are acceptable proof.
5. The Zoom link, the WhatsApp group link, and the guarantee sentence. Still nothing to send a
   registrant.

## The lesson, so it is not repeated a third time

A declared CSS custom property is not the rendered page, and a gate I wrote is not evidence. Both
failures have the same shape: trusting a note instead of the artifact. It happened on ZippyScale's
page first and then here. Read computed styles off real elements in a browser before writing a
token into a brand note, and prove every gate red on known-bad before trusting it green.
Full lessons: `~/HQ/memory/verify-against-the-artifact-not-the-note.md`,
`~/HQ/Sandy/memory/an-entrance-fade-is-not-a-motion-graphic.md`.
