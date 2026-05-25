# v11 Asset Manifest (for Wave 2 use)

## Parent brand marks (NEW — Wave 1)
- `anthropic-parent-light.svg` — simpleicons (#F5F5F0)
- `openai-parent-light.svg` — simpleicons via fallback (slug 404 on cdn; copied from existing `openai-light.svg` which already uses #F5F5F0)
- `google-parent-light.svg` — simpleicons (#F5F5F0)

## Product marks (existing + NEW)
- `claude-light.svg` — Anthropic / Claude Code (Opus 4.7)
- `openai-parent-light.svg` — used for Codex + ChatGPT + Voice (all OpenAI products share the OpenAI mark; label each separately in UI)
- `gemini-light.svg` — Google / Gemini Flash 2.5
- `antigravity-light.svg` — Google / Antigravity (Gemini 2.5)

## Infrastructure layer (Tier 2 — NEW)
- `composio-light.svg` — hand-written (interlocking-rings glyph, neon-green center join). simpleicons has no entry.
- `mem0-light.svg` — hand-written (3-stacked-layers glyph, neon-green persistent-memory dots). simpleicons has no entry.
- `gbrain-light.svg` — hand-written (Sandy custom — neural-cluster inside 'g' ring)

## Runtime (Tier 3 — Hermes)
- `hermes-v11.svg` — horizontal lockup, ~240×80 (5-node winged glyph + JetBrains Mono wordmark)
- `hermes-v11-square.svg` — 256×256 profile-pic variant (glyph centered on dark canvas)

## Routing (Tier 4 — Open Claw)
- `openclaw-v11.svg` — horizontal lockup (3 angular strokes converging + wordmark)
- `openclaw-v11-square.svg` — 256×256 square (glyph only on dark canvas)

## OpenAI Voice
- `openai-voice-light.svg` — same OpenAI mark, separate file so Wave 2 can label it "Voice"

## OpenBot video (Tier 5 ref)
- `/assets/openbot/thankyou-video-01.mp4` — pawmebot.com/thank-you/ video (`pawme-wakeup.mp4`, 540×960 portrait, 865KB, autoplay/loop/muted). REPLACES `video-02-workshop.mp4` per Sandy's directive for Wave 5.
- `/assets/openbot/thankyou-page-screenshot.png` — verification screenshot of the actual thank-you page.

## Brand tokens (locked)
- Canvas: `#0A0E0D`
- Accent: `#00FF94`
- Text: `#F5F5F0`
- Wordmark font: JetBrains Mono, medium 500, letter-spacing 0.06em

## Fallback notes for Wave 2
- Composio + Mem0 are hand-crafted SVGs (not official brand marks). They read as "infrastructure" glyphs intentionally — neutral white outline + neon-green accent — so they sit harmoniously between official brand logos on the LP.
- OpenAI products (Codex, ChatGPT, Voice) all share the OpenAI parent mark; differentiate via card label/model badge, not separate logos.
