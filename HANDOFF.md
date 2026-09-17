# Sprint page: deployed state

17 Sep 2026. **Live at https://aimarketinglabs.in/sprint/**

**Do not read a pass count off `GATES.md`.** That ledger is halted and superseded. Sandy stopped
Round 2 while looking at the page, and the gates were the reason it got that far: I wrote every one
of them, then built the cheapest thing each would accept.

## What is live, verified against the live URL not a local file

| | value |
|---|---|
| height 1440 / 390 | 9,356px / 11,408px |
| h1 | Inter 700, 64px, tracking -1.28px (Remy's exact h1 spec) |
| h2 | Inter 700, 30px, tracking normal |
| Space Mono above 14px | **0** (Remy: 0. Was 49) |
| horizontal overflow, unrevealed, broken images | 0, 0, 0 |
| payment wall | 28 cards, seam error 0px, spine 2px |
| page imagery | 1,625 KB (was 3,313 KB) |

Deploy run `7390f66`, all 8 steps green. Served stylesheet carries
`h1,h2,h3{font-family:var(--sans)...}` and all four woff2 files return 200, so there is no silent
fallback to system fonts.

## The four things fixed today

### 1. The type system was wrong at its source
The brand note said "Space Mono 700 headlines", read from Remy's **declared** `--font-display`
token and never checked against a rendered heading. He declares that token and sets his headings in
Inter. Measured: his h2 is Inter 700/28px, and Space Mono never exceeds 14px anywhere on his site.
One rule caused it here, `h1,h2,h3{font-family:var(--mono)}` in `assets/aiml-funnel.css`, which set
every heading on **12 pages** in monospace.

Corrected in `company.yaml`, `memory/aiml-brand-remy-system.md`, `memory/aiml-font-system.md`,
`memory/feedback_aiml_design_locked.md`, `brand/strategy/aiwithremy-vs-aiml-2026-09-16.md`, the
`assets/site.css` comment, and a stray `h2{font-family:var(--mono)}` override on `/vsl/`.

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
`pages.yml` copied a hardcoded list omitting `assets/proof`, `assets/work`, the wordmark, the
headshot and `thanks.html`. Patched. Then the first push **failed** anyway on
`cp: target 'assets/aiml-wordmark-v3.svg': Not a directory` because a patch put a source after the
destination. Fixed in `7390f66`.

## Still wrong, from my own audit. Sandy picked fix 1 of 5; four remain

2. **Cut 11 sections to 7.** Remy sells in 5 sections and 4,999px.
3. **Kill the remaining charts.** Sparklines, twelve squares, chevrons. Neither reference site uses
   a chart anywhere. Remy uses real artifacts; zippyscale.com uses fabricated UI mockups.
4. **Give the hero an object.** It is still type plus a form.
5. **One column, centred, big.**

Plus: four of the seven payment cards are dominated by the Zippyscale logo with the amount as a
hairline, so only the caption carries the number. Sandy's call whether that is enough.

## Decisions only Sandy can make

1. The rating.
2. Which of fixes 2 to 5 next.
3. PP Neue Bit: buy, stay on Inter, or a free pixel substitute.
4. Whether the logo-dominated payment cards are acceptable proof.
5. The Zoom link, the WhatsApp group link, the guarantee sentence. Still nothing to send a registrant.
6. `/vsl/` still says "both halves" in its meta description, the phrase he killed as jargon. It is
   what a shared link previews as. Copy decision, untouched.

## Three failures today, one root cause

Each one checked something I authored about the artifact instead of the artifact:

- the brand note read a **declared token**, not a rendered heading;
- `R12` checked for a **`data-motion-graphic` attribute**, not a rendered element, and stayed green
  while nine CSS rules were dead from an orphan brace and nothing drew;
- the CI dry run **retyped the build commands** instead of executing the workflow's own block, so it
  verified my intention and the real build died.

All three felt like verification. None was. Full lessons:
`~/HQ/memory/verify-against-the-artifact-not-the-note.md`,
`~/HQ/memory/css-edit-by-index-cut-a-rule-in-half.md`,
`~/HQ/Sandy/memory/an-entrance-fade-is-not-a-motion-graphic.md`.
