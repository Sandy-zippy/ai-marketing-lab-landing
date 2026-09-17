# Sprint page section rebuild: shared brief

Read this whole file before writing anything. It is the same brief every section agent gets.
Sandy rated round 1 of this page 3/10 and stopped round 2 mid-build. The bar is 8/10 or it does
not ship.

## The one sentence

Rebuild ONE section of `sprint/index.html` so that it shows something real happening instead of
describing something in prose, on a locked brand, with motion that a viewer can actually see.

## What Sandy actually said, verbatim, about what is wrong

- "you're just bringing some animations and you're calling that motion graphics ... **what are these
  graphs**"
- "in the next section also you have only included **copy copy copy copy copy copy** everywhere"
- "there are three to four different type of fucking fonts in a fucking brand ... that's the reason
  this page is looking like an **absolute immature shit**"
- "you need to design **one section at a time** instead of trying to do all the landing page all at
  once. That's the reason you're fucking it up. You're trying to do the work fast. You're not
  caring about the quality."
- "**use design skills and all the skills you've skipped**"

Take all five literally. Prose density is a defect. A chart is a defect. An entrance fade counted
as a motion graphic is a defect.

## Brand: LOCKED. Do not redesign it.

Authority: `DESIGN.md` and `PRODUCT.md` in the repo root. Load them with
`node /Users/sandy/HQ/.claude/skills/impeccable/scripts/load-context.mjs`.

```css
--canvas:#FFFFFF  --text-high:#121212  --text-mid:#7E7E7E  --text-low:#AAAAAA
--line:rgba(33,33,33,.12)  --surface:#FFFFFF  --paper:#FAF7EE  --paper-edge:#E5DECA
--paper-ink:#2A2A2A  --accent:#00A19B  --accent-soft:rgba(0,161,155,.10)
--accent-line:rgba(0,161,155,.30)  --warm:#B4241A
--sans:'Inter'  --mono:'Space Mono'
```

**TYPOGRAPHY, corrected 17 Sep 2026, this is the thing that got the page called immature:**

- Headings are **Inter 700**. `h1` clamp(34px,5vw,64px)/-.02em. `h2` clamp(24px,2.6vw,30px), tracking normal.
- **Space Mono is LABELS ONLY and is hard capped at 14px.** Eyebrows, meta, form labels, buttons,
  source lines. Never a heading. `brand-guard.mjs` fails the build above 14px.
- The old note said "headlines are Space Mono 700". It was read off Remy's declared `--font-display`
  token and never checked against a rendered heading. It was wrong and it cost a full day.
- Teal is ONE accent word or numeral per surface. Never a field of it. Brick red `--warm` is
  urgency only, at most one element on the whole page, never a heading or body text.

## The two reference sites, and what they actually do

Sandy named both. Neither uses a chart anywhere.

- **aiwithremy.com** builds sections out of **real artifacts**: 20+ email screenshots auto
  scrolling, an ASCII portrait, a video inside browser chrome, a letter on lined paper with a stamp
  and a signature. 81 images. 7 keyframes. Zero stroke-dash drawing, zero clip-path.
- **zippyscale.com** builds sections out of **fabricated but realistic product UI**: mock lead
  records, a booking calendar, a dotted map. 37 SVGs.

Your section must be one or the other. A thing the reader can inspect, or a believable interface
showing the system working. Not a diagram of an idea.

## BANNED. These were shipped and explicitly rejected.

1. **Any chart.** Sparklines, revenue lines, bar charts, progress bars, square/cell grids, donut,
   gauge. All of them. "Twelve teal squares representing months" was rejected by name.
2. **Abstract vector decoration** that stands in for content: floating ticks, chevrons as ornament,
   drawn rules used to look busy.
3. **An entrance animation described as a motion graphic.** `translateY(18px) → none` is not motion
   graphics. 13 of those shipped in round 1 and Sandy counted the page as having zero motion.
4. **Icon + heading + paragraph card grids** repeated down the page.
5. **Side stripe borders**, gradient text, glassmorphism, em dashes, exclamation marks.
6. **Invented figures.** Every number traces to a named file or ad account, or it does not appear.
   No fake seat counters, no resetting countdowns, no testimonials Sandy has not confirmed.

## What DOES count as a motion graphic here

Something changes state on screen in a way the reader can watch. These primitives already exist in
the page's `<style>` block, already gated on viewport arrival, already reduced-motion safe. Reuse
them by class, do not reinvent:

| class | keyframe | what it does |
|---|---|---|
| `.mg-draw` | `draw` | `clip-path: inset(0 100% 0 0)` → `inset(0)`, wipes on left to right |
| `.mg-wipe` | `wipe` | same with a 14px radius, for images |
| `.mg-fill` | `fill-in` | fills bottom to top |
| `.mg-grow` | `grow` | `scaleX(0)` → `scaleX(1)`, transform-origin left |
| `.mg-rise` | `rise` | `scaleY(0)` → `scaleY(1)`, transform-origin top |
| `.mg-tick` | `tick` | `stroke-dashoffset` → 0, draws a stroke |
| `.mg-land` | `land` | `scale(.74)` → `none` |

Stagger with `style="--i:N"`. Gate everything on `.js .reveal.in`, never on a timer: an animation
on a class already in the HTML has finished before a reader 8,000px down the page ever arrives.
Measured: all nine non-hero sections read `playState:"finished"` at load in round 1.

### The component you should probably use

`assets/aiml-funnel.css` already contains a **complete, unused operator console**: `.console`,
`.console-head` (with a `.dot` that blinks and a `.cursor` that blinks), `.console-body`, `.log`
rows with `.op` / `.txt` / `.tick` that stagger in on the `logIn` keyframe via `style="--d:.4s"`,
and `.console-foot`. Keyframes `blink` and `logIn` are defined at `assets/aiml-funnel.css:76` and
`:133`. It is referenced by **zero** HTML files in the funnel. It is brand correct, it is already
animated, and it is continuous rather than a one shot entrance. This is the terminal Sandy pointed
at on zippyscale.com.

### Motion rules with numbers (from `impeccable/references/motion-polish.md`)

- Entering or exiting → `ease-out`. Use the page's `var(--ease)`, which is `cubic-bezier(.23,1,.32,1)`.
- Constant motion (a marquee, a blinking cursor) → `linear`, infinite.
- **Never `ease-in` for UI.** It delays the initial movement, the moment the eye is on it.
- UI transitions stay **under 300ms**. Explanatory/marketing motion may run longer.
- Animate **only `transform` and `opacity`**. Anything else triggers layout.
- **Never enter from `scale(0)`.** Start at `scale(.95)` with `opacity:0`. Nothing real appears from nothing.
- Press feedback on any pressable: `transform:scale(.97)`, 160ms.
- Every animated element needs a `prefers-reduced-motion: reduce` off switch.

## Real material available. Use it before inventing anything.

Buyer quotes, real and public, keyed `Q1..Qn`:
`/Users/sandy/HQ/Sandy/offers/sprint/research/india-voices-2026-08/RAW.md`
The page already cites Q50, Q134, Q129, Q9. **Quote exactly, keep the `data-q` key, keep the source
line.** Never write a pain sentence for a buyer type without a real quote from that buyer type open
in front of you.

Images, all under `assets/`, paths relative to `sprint/` are `../assets/...`:

- `proof/deck-1..7.png` and `proof/crop-1..7.png` — the seven real payment notifications.
  Keep the ZippyScale branding on them. Sandy: "it's my agency." Use the ORIGINAL size, do not crop.
- `work/design-riarh.jpg` — a real client site, live on their own domain
- `work/content-funnel.jpg`, `work/content-home.jpg` — our own funnel
- `photos/sandy-headshot-hd.jpg` (105 KB, already optimised), `photos/sandy-claudecode-post.jpg`
- `aiml-wordmark-v3.svg` — carries its own base64 woff2 internally, so it survives being inlined

**Do NOT use:** anything under `assets/openbot/` or `assets/openpaw/` (the PawMe robot: "we are a
robotics company and this is what we are building", wrong brand, removed by instruction), and the
six Riarh creatives ("I never fucking used these creatives").

## Copy rules

- No em dashes. No exclamation marks. No adjectives where a number would do.
- Plain, specific, slightly understated. The reader is a working owner in India, sold to constantly,
  believes almost none of it. Sophistication stage 4 to 5: a claim-led line cannot work here.
  Identification and a visible mechanism, or nothing.
- Cut your own prose first. If a sentence describes what a visual already shows, delete the sentence.
- AI Marketing Lab is Sandy personally. ZippyScale is the agency. Never mix them in copy. The one
  exception Sandy granted: the payment screenshots keep their ZippyScale branding.

## Ownership. Read this twice.

**You do not edit `sprint/index.html`.** Multiple agents are working in parallel and a shared file
gets silently overwritten. Write exactly two files, both under `sprint/rebuild/`:

- `sprint/rebuild/<your-section>.html` — the `<section>` element only, complete, ready to paste
- `sprint/rebuild/<your-section>.css` — only the NEW rules your section needs

In the CSS file: every selector must be scoped so it cannot leak (`section[data-motion="x"] ...`
or a class unique to your section). Do not restyle `h2`, `.lede`, `.eyebrow` or anything global.
Assert your own brace balance before you finish. One orphan `}` killed nine rules this morning and
took the page from 9,336px to 126,962px, and five of six checks stayed green while it did.

Keep the section's existing `data-motion` value so the spacing tier and reveal observer still bind.
Write a real `data-job` describing what the section does for the buyer, and a real
`data-motion-graphic` describing what visibly moves.

## Quality bar: 8/10. Self check before you report.

Report honestly. A fail you name is worth more than a pass you assert; every wrong claim today came
from checking something I wrote about the page instead of the page.

1. Zero charts. Zero graphs. Zero abstract vector ornament.
2. At least one element that visibly changes state, gated on arrival, not a plain entrance fade.
3. Space Mono nowhere above 14px. Headings Inter 700.
4. Teal used once as a word or numeral, not as a field.
5. Fewer words than the section it replaces. Count both and state both numbers.
6. Every quote real, keyed, sourced. Every figure traceable. Nothing invented.
7. Brace balanced, selectors scoped, `prefers-reduced-motion` handled.
8. Works at 390px and 1440px. State what happens at each.

Your report: what you built, the word count before and after, which motion primitive does what, and
anything you could not do. Do not claim a check you did not run.
