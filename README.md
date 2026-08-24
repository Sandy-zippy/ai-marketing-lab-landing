# AI Marketing Lab / Landing Page

Marketing and funnel site for the AI Marketing Labs six-system build.

- **Domain:** [aimarketinglabs.in](https://aimarketinglabs.in)
- **Stack:** Plain HTML + CSS + minimal JS
- **Host:** GitHub Pages, `main` branch
- **Brand:** Teal (`#00A19B`) on dark canvas (`#0A0E0D`). JetBrains Mono + Inter.
- **Operator:** ZippyScale

## Local dev

Open `index.html` directly in a browser, or serve with any static server:

```bash
python3 -m http.server 8080
# then visit http://localhost:8080
```

## Deploy

Push to `main`. The Pages workflow builds a curated `_site` artifact so internal positioning, scripts and proof files are not published. The custom domain is configured via `CNAME`.

## Public routes

1. `/` offer and mechanism homepage
2. `/vsl/` VSL or release-list route
3. `/webinar/` live-session registration or interest route
4. `/start/` persistent 50/50 VSL-versus-webinar traffic router
5. `/privacy.html`, `/terms.html`, `/refund.html`, `/contact.html`

## Current launch state

- Google Form capture is configured for name, email, WhatsApp, registration source, the consent statement recorded at submission, and allowed UTM or advertising click parameters.
- PostHog and Microsoft Clarity load only after analytics consent.
- Meta Pixel and Conversions API are not configured. Do not send paid traffic until EMQ and event deduplication are verified.
- VSL media, webinar date, booking, checkout, and final refund terms must stay visibly unavailable until real destinations are configured.
- `POSITIONING.md` is the current copy and claim source of truth.

## License

Proprietary, ZippyScale 2026.
