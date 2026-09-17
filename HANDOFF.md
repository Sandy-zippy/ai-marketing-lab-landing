# Sprint page: deployed

17 Sep 2026. **Live at https://aimarketinglabs.in/sprint/**

**Do not read a pass count off `GATES.md`.** That ledger is halted and superseded. Sandy stopped
Round 2 while looking at the page, and the gates were the reason it got that far: I wrote every one
of them, then built the cheapest thing each would accept.

## What is live, measured against the live URL

| | value |
|---|---|
| height 1440 / 390 | 9,356px / 11,408px |
| h1 | Inter 700, 64px, tracking -1.28px (Remy's exact h1 spec) |
| h2 | Inter 700, 30px, tracking normal |
| Space Mono above 14px | **0** across the whole funnel (Remy: 0. Was 49 on this page alone) |
| overflow, unrevealed, broken images | 0, 0, 0 |
| payment wall | 28 cards, seam error 0px |
| page imagery | 1,625 KB (was 3,313 KB) |

## What changed

### 1. The type system was wrong at its source
The brand note said "Space Mono 700 headlines", read from Remy's **declared** `--font-display`
token and never checked against a rendered heading. He declares that token and sets his headings in
Inter. Measured: his h2 is Inter 700/28px, and Space Mono never exceeds 14px anywhere on his site.
One rule caused it, `h1,h2,h3{font-family:var(--mono)}` in `assets/aiml-funnel.css`, setting every
heading on **12 pages** in monospace.

Corrected in `company.yaml`, `memory/aiml-brand-remy-system.md`, `memory/aiml-font-system.md`,
`memory/feedback_aiml_design_locked.md`, `brand/strategy/aiwithremy-vs-aiml-2026-09-16.md`, the
`assets/site.css` comment, and then across the funnel: `/vsl/` h2 and stat strip,
`vsl/watch.html` `.line` (38px mono), `contact.html`, the home page CTA, `sprint/thanks.html`.

Three `[data-fallback]` wordmark rules at 15-16px are **declared exceptions**, with the reason
written beside them in each file: that text renders only if the logo SVG fails, and a wordmark is a
display element.

**PP Neue Bit** is Remy's real hero face. Paid (Pangram Pangram), no licence held. Hero is Inter 700
meanwhile. Sandy's call: buy it, stay on Inter, or a free pixel face (Silkscreen, Pixelify Sans,
Micro 5, Jersey 10). Never a rip-site copy.

### 2. Proof is a wall, not a grid
Seven real payment emails at full size, still carrying the agency branding they arrived with because
the agency is Sandy's. Two rows counter-scrolling, pause on hover, stopped under reduced motion.
Ported to vanilla from the Magic UI marquee pattern rather than hand-rolled.

### 3. The headshot was 1.8MB
1,793 KB at 1024x1024, rendering at 46x46. Re-encoded at identical dimensions: 105 KB, 95% smaller.

### 4. The deploy would have shipped every image 404ing
`pages.yml` omitted `assets/proof`, `assets/work`, the wordmark, the headshot and `thanks.html`.
Patched, then the first push failed anyway on `cp: target '...svg': Not a directory` because a patch
put a source after the destination.

## Still wrong. Sandy picked fix 1 of 5; four remain

2. **Cut 11 sections to 7.** Remy sells in 5 sections and 4,999px.
3. **Kill the remaining charts.** Sparklines, twelve squares, chevrons. Neither reference uses a
   chart: Remy uses real artifacts, zippyscale.com uses fabricated UI mockups.
4. **Give the hero an object.** Still type plus a form.
5. **One column, centred, big.**

Plus: four of the seven payment cards are dominated by the Zippyscale logo with the amount as a
hairline, so only the caption carries the number. Sandy's call whether that is enough proof.

## Decisions only Sandy can make

1. The rating.
2. Which of fixes 2 to 5 next.
3. PP Neue Bit: buy, stay on Inter, or a free pixel substitute.
4. Whether the logo-dominated payment cards are acceptable proof.
5. The Zoom link, WhatsApp group link, guarantee sentence. Still nothing to send a registrant.
6. `/vsl/` and `vsl/watch.html` still say "both halves", the phrase he killed as jargon. It is in
   the meta description, so it is what a shared link previews as. Copy decision, untouched.

## Four failures today, one root cause

Each checked something I authored about the artifact instead of the artifact itself:

- the brand note read a **declared token**, not a rendered heading;
- `R12` checked for a **`data-motion-graphic` attribute**, not a rendered element, and stayed green
  while nine CSS rules were dead from an orphan brace and nothing drew;
- the CI dry run **retyped the build commands** instead of executing the workflow's own block, so it
  verified my intention and the real build died;
- the mono audit walked `querySelectorAll`, which **cannot select pseudo-elements**, so it reported
  "0 above 14px" three times while five `+` markers rendered at 19px on the live page.

All four felt like verification. None was. Lessons:
`~/HQ/memory/verify-against-the-artifact-not-the-note.md`,
`~/HQ/memory/css-edit-by-index-cut-a-rule-in-half.md`,
`~/HQ/memory/dom-measurement-traps-gates.md` (trap 9),
`~/HQ/Sandy/memory/an-entrance-fade-is-not-a-motion-graphic.md`.

`brand-guard.mjs` now exists in the repo and is the check none of today's failures had.
Run `node brand-guard.mjs` (exit 0 clean, 1 breach). It asserts brace balance on every HTML
and CSS file, and flags Space Mono declared above 14px including in pseudo-element rules,
with `[data-fallback]` wordmarks as a declared exception. Proven to fire: on a deliberately
broken file it catches both an orphan brace and a 56px monospace rule and exits 1. On first
run against the repo it found a 22px breach in `assets/site.css` that every manual scan I
did today had missed, because that file is linked by no page.

It is a script, not a hook. Nothing runs it automatically yet.
