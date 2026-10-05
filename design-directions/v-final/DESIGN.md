# DESIGN.md: AIML /call

Tokens live in `DESIGN-TOKENS.css` (the build inlines it). Locked by Sandy on 12 Sep and re-ratified on 1 Oct 2026, in `company.yaml` `display_font`.

## Theme
White editorial page. The physical scene is an owner on a phone, between client calls, in daylight. That forces light: white ground, ink type, one teal.

## Colour (Restrained strategy, enforced by brand)
- Canvas #FFFFFF, ink #121212, body #3A3A3A, quiet #6B6B6B (text-safe), lines #E3E3E3.
- Paper #FAF7EE with edge #E5DECA, used as a full-bleed SECTION ground for rhythm (no longer only for letters).
- Surface #F8F8F8, only inside a visual, never as a wrapper card around one.
- Accent teal #00A19B (fills and strokes), with #00736E for text in the accent colour. Use one accent word or numeral per section, plus teal as the "working / done" state inside a visual.
- Urgent brick #B4241A appears once on the page: s5 "10 seats".

## Typography
- Space Mono 700 for h1, h2, h3, `.num` (proof numerals) and labels.
- Inter for body.
- The scale is in tokens. Labels are 12px minimum, rendered.

## Layout
- 12-column `.grid` inside `.wrap`, with a max width of 1120px. Text starts on the wrap's left edge.
- Visuals may break out: full-bleed paper bands, and art that spans 12 columns.
- Never nest cards. A visual is drawn straight on the section ground, or sits on ONE surface that it fills edge to edge.

## Motion
- Ease out expo, `--ease`. Plays once, and the finished frame arrives within about 4 seconds.
- The verbs are draw, fill, tick, land, stamp and grow. Fades are not motion graphics.
- The default (no JS, reduced motion, or not yet in view) is the finished, readable frame. JS may "arm" only decorative strokes and fills, never text or data.
