# Section agent brief (AIML /call v-final)

Folder: `/Users/sandy/HQ/Sandy/website/.call-release/design-directions/v-final/` (preview: http://127.0.0.1:4870/design-directions/v-final/index.html, server already running, bound to 127.0.0.1; if it is down: `cd /Users/sandy/HQ/Sandy/website/.call-release && python3 -m http.server 4870 --bind 127.0.0.1`).

## Read first
1. `DESIGN-TOKENS.css` (grid, spacing, type, motion, colours, `.viz`, `.btn`, `.label`, `.note`, `.lede`, `.num`). Use ONLY these tokens: every font-size, gap, padding, margin, radius, colour is a `var(--...)`. No loose px except borders (1px), SVG geometry and canvas math.
2. `/Users/sandy/HQ/Sandy/offers/accelerator/funnel/LP-COPY-v2-2026-10-01.md`: your section's Copy (use the words EXACTLY, add none) and its Visual brief (build THAT visual, new, for this section only).
3. `shell.html` + `js/app.js` to see how sections are revealed and the `window.AIML` helpers.

## What you write (ONLY these files; never edit shell.html, DESIGN-TOKENS.css, css/shell.css, js/app.js, build.py, shoot.py or another section's files)
- `sections/sN.html`: exactly one root
  ```html
  <section id="sN" class="sec" aria-labelledby="sN-h">
    <div class="wrap"><div class="grid"> ...children with .c-* span classes... </div></div>
  </section>
  ```
  The heading (`<h2 id="sN-h">`) and every text block start on the `.wrap` left edge (the grid's column 1). Never add horizontal margin/padding to make things "line up"; use the grid spans (`c-1-6`, `c-7-12`, `c-1-5`, `c-6-12`, `c-1-7`, `c-8-12`, `c-1-8`, `c-9-12`, `c-1-4`, `c-5-8`; below 1024px everything is full width). Labels: `<p class="label">`. Section H: `<h2>`. Line: `<p class="lede">`. Micro: `<p class="note">`.
- `sections/sN.css`: every selector starts with `#sN`. No global rules, no @font-face, no new colours.
- `sections/sN.js`: plain ES5-ish browser JS, wrapped in an IIFE by the build (do not wrap it yourself). Start your scene with `AIML.onView(document.getElementById('sN'), function(root){...})` (fires once, after the section is revealed and 30% on screen). Motion over 5 s: `AIML.pauseBtn(vizEl, {pause:fn, play:fn})`. `AIML.REDUCE` true = render the FINISHED frame immediately, no motion.
- Section-only images: `assets/sN-*.{jpg,png,svg,webp}` (reference as `assets/...`). Shared site assets: `{{ROOT}}assets/...` (the build fills ROOT), e.g. `{{ROOT}}assets/photos/sandy-headshot-hd.jpg`, `{{ROOT}}assets/brand/...`.

## Rules (Sandy's; a breach fails the section)
- Brand: white ground, ink #121212, quiet #7E7E7E, paper #FAF7EE (only for letter/sheet-like surfaces), lines #E3E3E3. Headlines Space Mono 700 (already set on h2/h3). Teal `var(--accent)` / `var(--accent-ink)` is the ONLY accent: one accent word or numeral per section, plus teal as the "active/working" state inside the visual. **Brick red `--urgent` is owned by S5 ("10 seats") ONLY; nobody else uses red.** "Bad/leak" states use ink or quiet greys.
- The visual does the talking; copy only labels. Do not add words beyond your section's Copy + the labels named in its Visual brief. No em dashes, no exclamation marks.
- Every visual is NEW for this section. Never reuse a calendar grid, a draining pipeline, or a dial/gauge.
- No payment screenshots. No programme prices. No payment totals.
- Motion: the scene plays ONCE when it comes into view (total ≤ `--d-scene` 6 s), then HOLDS its finished last frame. Ease out expo (`var(--ease)`), no bounce/elastic. Animate transform/opacity/stroke-dashoffset, not layout properties. Reduced motion = the finished frame, everything readable.
- The FINISHED frame must be readable on its own: every label legible at 390px (min 12px rendered), nothing overlapping text, nothing clipped. A wide diagram gets a stacked mobile layout behind a media query, never a scale-down.
- 3D: prefer CSS 3D (`perspective`, `transform-style:preserve-3d`, `rotateX/Y`) + inline SVG. three.js only if CSS truly cannot do it: dynamic `import('https://cdn.jsdelivr.net/npm/three@0.169.0/build/three.module.min.js')` INSIDE your onView callback (never at load), one renderer, `devicePixelRatio` capped at 2, render loop stops when the scene finishes or leaves view. Page budget: Lighthouse mobile ≥ 75, so nothing heavy before your section is in view.
- Accessibility: the visual has a text alternative (`role="img"` + `aria-label` on the visual wrapper, or visually readable labels). Interactive things are buttons with labels. Contrast ≥ 4.5:1 for text.
- Logos: never fake one. Use a real file or plain text in Inter at body size, never styled to look like a logo.

## Verify before you report (you own your section's quality)
1. `python3 build.py` (rebuilds index.html with whatever sections exist; safe to run concurrently).
2. `python3 shoot.py all sN` writes `shots/sN-390.png`, `shots/sN-768.png`, `shots/sN-1440.png` (reduced motion = finished state) and prints every visible section's text left edge vs `wrapLeft`. Your section's left edge must EQUAL wrapLeft at all three widths, `docW` must equal `vw` (no horizontal overflow), console errors must be empty. Read your three screenshots and fix what you see.
3. Prove the motion: in your own scratch Playwright script (not shoot.py), load the page with `localStorage.aiml_lead={"ok":true}` and `aiml_vsl_seen=1`, no reduced motion, scroll your section into view, screenshot your `.viz` at 0.3 s, 2 s and after 6.5 s; the three must differ, and the 6.5 s frame must equal the reduced-motion finished frame in content. Also prove the pause button stops it if your scene is > 5 s.
4. Rate it 0-10 harshly against the brief (does the visual alone explain the section's job in 3 seconds?). Below 8, fix and repeat.

## Report back (≤ 10 lines)
Files written, what the visual does in one sentence, word count of visible copy, left-edge numbers at 390/768/1440, motion proof (frame diffs), screenshot paths, anything you could not do.
