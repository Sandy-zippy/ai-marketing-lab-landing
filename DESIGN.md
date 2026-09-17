# Design system

LOCKED by Sandy 12 Sep 2026. Values read out of aiwithremy.com's own stylesheet on 28 Aug 2026, not
from a screenshot. Do not redesign the palette or the typefaces.

Note on the `impeccable` reflex-reject font list: it names Space Mono and Inter. Its own
identity-preservation rule wins here, because this brand has already committed to both as its
identity. They stay.

## Colour

```css
--canvas:      #FFFFFF   /* ground, everywhere */
--text-high:   #121212
--text-mid:    #7E7E7E
--text-low:    #AAAAAA
--line:        #E3E3E3
--surface:     #F8F8F8
--elevated:    #F2F2F2
--paper:       #FAF7EE   /* letters, founder notes, quoted voices */
--paper-edge:  #E5DECA
--paper-ink:   #2A2A2A
--accent:      #00A19B   /* Petronas. THE ONLY ACCENT */
--accent-soft: rgba(0,161,155,.10)
--warm:        #B4241A   /* URGENCY ONLY, at most one element per surface */
```

**Sparse is the instruction**, carried over from Remy's own CSS comment. One accent word or numeral
per surface, never a field of it. Brick red is not a second accent: it marks urgency (a deadline, a
seat count) at most once per page, never a heading and never body text.

Colour strategy: **Restrained**. That is a deliberate choice, not timidity. The accent stays under
10% because the proof screenshots and the two photographs carry the visual weight.

## Typography

```css
--mono: 'Space Mono', 'Courier New', monospace   /* display AND labels */
--sans: 'Inter', -apple-system, sans-serif       /* body */
```

Headlines are Space Mono 700. The display face being a monospace is the whole character of the
brand. Self-hosted woff2 in `assets/fonts/`, both OFL.

PP Neue Bit appears in Remy's own rules. We have no licence. Never substitute a rip-site copy.

Scale: fluid `clamp()`, at least 1.25 between steps. Body measure capped at 65 to 75ch.

## Spacing rhythm

Three tiers, not one value. Uniform padding down a ten section page is the monotony that got the
build rejected on 16 Sep.

```css
--pad-open:  clamp(64px, 9vw, 132px)   /* hero, the close: a beginning and an end */
--pad-arg:   clamp(48px, 6.5vw, 92px)  /* the argument sections */
--pad-tight: clamp(34px, 4.5vw, 60px)  /* list and table sections that already have internal rhythm */
```

Inside a section, group tightly and separate generously. A heading sits close to its own lede and
far from the block above it.

## Composition

Each section gets its own composition. Ten sections sharing eyebrow, headline, lede, block reads as
a document, not a page.

| Section | Composition |
|---|---|
| Hero | Split, copy left, registration card right |
| Three buyers | Full width, three columns, rows aligned by subgrid |
| What it costs | Oversize pull quote, wide measure, then a tight three up row |
| The 90 minutes | Sticky heading left, numbered steps right |
| Proof | Four up, amount legible at card size |
| Six weeks | Full width rows on paper ground, bar per week |
| Who is running it | Paper ground, portrait left, letter right |
| Filter | Two columns, least motion on the page |
| FAQ | Narrow measure, centred |
| Close | Centred, same single action as the hero |

Two paper grounds break the white wall. Without them the page is nine identical white screens.

## Motion

Budget written before building, one element per section, every one obeying
`prefers-reduced-motion`. Two rules, both learned the hard way on 16 Sep:

1. **Motion never owns opacity.** A reveal defaulting to `opacity:0` rendered nine blank sections in
   a full page capture, which is what a crawler and a slow client see.
2. **Motion below the fold is gated on the reader arriving, and the gate is never a clock.** An
   animation on a class already in the HTML starts at load; 8,000px down it has finished before the
   reader exists. Measured: all nine non-hero sections read `playState:"finished"` at `t=duration`.

Ease out. No bounce, no elastic. Never animate layout properties.

## Bans specific to this surface

- No side stripe borders as decoration, no gradient text, no glassmorphism.
- No identical card grids with an icon above every heading.
- No em dashes anywhere, including in code comments that ship.
- No unconfigured custom domain in OG tags or canonical links.
