"""Build /v2.1 from the live /call page (v1 motion sections, approved 5-6 Oct) in Sabri Suby's order.
Sandy, 9 Oct 2026: central alignment, motion graphics instead of copy where they explain it, free call, re-edited HD VSL.
Run from the repo root: python3 v2.1/build.py  ->  v2.1/index.html (review) + call/index.html (live /call, since 9 Oct)."""
import re, pathlib
ROOT = pathlib.Path(__file__).resolve().parent.parent
src = (ROOT / 'v2.1/v1-call.html').read_text()   # the v1 /call as it was live on 9 Oct, frozen: its sections are the source

def sec(i):
    a = src.index(f'<section id="{i}"'); b = src.index('</section>', a) + len('</section>')
    return src[a:b]
def sub(s, old, new, n=1):
    assert s.count(old) >= 1, old[:70]
    return s.replace(old, new) if n == 0 else s.replace(old, new, n)

# ---- head: the live tokens + base CSS, page-local paths re-pointed at /call ----
head = src[:src.index('</head>')]
head = re.sub(r'<title>.*?</title>', '<title>Your next client in 90 days | AI Marketing Lab</title>', head, flags=re.S)
CANON = re.search(r'<link rel="canonical"[^>]*>', head).group(0)
head = re.sub(r'<link rel="canonical"[^>]*>', '<meta name="robots" content="noindex, nofollow" />', head)
head = head.replace('<script defer src="/assets/posthog.js"></script>', '')
head = head.replace('href="css/sections.css"', 'href="../call/css/sections.css"')
head = head.replace("url('assets/", "url('../call/assets/").replace('url(assets/', 'url(../call/assets/')
CSS = (ROOT / 'v2.1/v21.css').read_text()
head += '<link rel="preconnect" href="https://app.cal.com" crossorigin />\n<link rel="preconnect" href="https://cal.com" crossorigin />\n'
head += '<link rel="preload" href="media/vsl-poster.jpg" as="image" />\n<style>\n' + CSS + '\n</style>\n'

CLAIM = 'Claim my free 45-minute growth map'
ARROW = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
def ask(q, p):   # Sabri step 9: proof directly above every ask
    return f'<div class="ask"><p class="ask-q">{q}</p><p class="ask-p">{p}</p><a class="btn js-claim" href="#claim">{CLAIM} {ARROW}</a></div>'

# ---- v1 sections, copy edited to the free call and Sandy's rulings ----
s1 = sec('s1')
s1 = sub(s1, '<span class="lbl">The &#8377;999 call</span>', '<span class="lbl">The free call</span>')
s1 = re.sub(r'<div class="facts">.*?</div>\s*</div>\s*<div class="cta">', '''<div class="facts">
          <div><b>1</b><span>Leak named: the link losing you the most clients</span></div>
          <div><b>1st</b><span>Thing to build, in order</span></div>
          <div><b class="acc">2</b><span>Skill packs, yours to keep</span></div>
        </div>
        <div class="cta">''', s1, flags=re.S)
s1 = re.sub(r'<a class="btn js-pay js-nudge" href="#">Book my ₹999 call', f'<a class="btn js-claim" href="#claim">{CLAIM}', s1)
s1 = sub(s1, '<p class="cr"><b>₹999</b>, credited if you join.</p>', '<p class="cr"><s>₹999</s> <b>Free.</b> You keep the map whether you join or not.</p>')

s1b = sec('s1b').replace('skill files Claude Code runs.', 'skill files Claude Code drafts from.')
s3 = sub(sec('s3'), 'Write each step <span class="accent">once</span>.', 'Upstream Downstream: write each step <span class="accent">once</span>.')
s6 = sec('s6').replace('skill files Claude Code runs.', 'skill files Claude Code drafts from.')
s6 = sub(s6, 'data-v="5000" data-pre="$" data-sep="1">$5,000', 'data-v="5000" data-pre="CA$" data-sep="1">CA$5,000')
cards = ''.join(f'<img src="../assets/proof/redacted/card-{n}.png" alt="Payment received email, payer name hidden" width="500" height="100" loading="lazy" />' for n in (1, 4, 2, 3, 5, 6))
s6 = s6.replace('</ul>\n  </div></div>\n</section>', '</ul>\n    <div class="paycards"><p class="label">The payment emails, straight from our account</p><div class="pc-grid">' + cards + '</div></div>\n  </div></div>\n</section>')
s4, s5, s2b, s8 = sec('s4'), sec('s5'), sec('s2b'), sec('s8')
s5b = sec('s5b').replace('<a class="btn js-pay" href="#">Book my &#8377;999 call</a>', f'<a class="btn js-claim" href="#claim">{CLAIM}</a>')
s7 = sec('s7').replace('<a class="btn js-pay" href="#">Book my &#8377;999 call</a>', f'<a class="btn js-claim" href="#claim">{CLAIM}</a>')

# FAQ: biggest objection first (Sabri step 13), the paid-call answer replaced
s9 = sub(sec('s9'), '<h2 id="s9-h">Questions</h2>', '<h2 id="s9-h">What you\'re probably thinking</h2>')
items = re.findall(r'<details.*?</details>', s9, flags=re.S)
by = {re.search(r'<span>(.*?)</span>', d).group(1): d for d in items}
by['Why is the call free?'] = re.sub(r'<span>Why ₹999 for the call\?</span>(.*?)<p>.*?</p>', r"<span>Why is the call free?</span>\1<p>Because you should see your own map before you decide anything. I still take every call myself, and if neither program fits, I'll tell you.</p>", by.pop('Why ₹999 for the call?'), flags=re.S)
order = ["I need clients, not automation.", "I've bought courses and built nothing.", "I'm not technical.", 'Why is the call free?',
         "Why isn't the price here?", 'My business is different.', "I don't have time.", 'Will I pay for tools?']
faq = []
for n, k in enumerate(order, 1):
    d = re.sub(r'<i aria-hidden="true">\d\d</i>', f'<i aria-hidden="true">{n:02d}</i>', by[k]).replace('<details open>', '<details>')
    faq.append(d.replace('<details>', '<details open>') if n == 1 else d)
s9 = s9[:s9.index(items[0])] + '\n      '.join(faq) + s9[s9.index(items[-1]) + len(items[-1]):]

# s10: the call ticket, the ₹999 stub becomes "Free"
s10 = re.sub(r'<!--.*?-->', '', sec('s10'), flags=re.S)
s10 = re.sub(r'<b class="s10-price">.*?</b>\s*<span class="s10-cr">credited if you join</span>', '<b class="s10-price s10-free">Free</b>\n        <span class="s10-cr">the map is yours either way</span>', s10, flags=re.S)
s10 = s10.replace('The ₹999 stub tears off: credited if you join.', 'The stub reads Free: the map is yours either way.')
s10 = s10.replace('<a class="btn js-pay" href="#">Book my &#8377;999 call</a>', f'<a class="btn js-claim" href="#claim">{CLAIM}</a>')

for _n, _x in (('s1', s1), ('s5b', s5b), ('s7', s7), ('s9', s9), ('s10', s10)):
    _y = _x.replace('<s>₹999</s>', '')
    assert '999' not in _y, (_n, _y[max(0, _y.find('999') - 160):_y.find('999') + 40])

body = (ROOT / 'v2.1/body.html').read_text()
for k, v in {'{{S1}}': s1, '{{S1B}}': s1b, '{{S3}}': s3, '{{S6}}': s6, '{{S4}}': s4, '{{S5}}': s5, '{{S5B}}': s5b, '{{S2B}}': s2b,
             '{{S7}}': s7, '{{S8}}': s8, '{{S9}}': s9, '{{S10}}': s10,
             '{{ASK_PROOF}}': ask('Medico · Scale Your Results · Rumor Avenue', 'Want this mapped to your business? 45 minutes with me, free.'),
             '{{ASK_OFFER}}': ask('2017 · 100+ businesses · $220,000 in 6 months', 'The call tells you which of the two fits, or that neither does yet.'),
             '{{CLAIM}}': CLAIM, '{{ARROW}}': ARROW}.items():
    assert k in body, k; body = body.replace(k, v)
html = head + '</head>\n' + body
# page-local assets of the v1 sections live under /call
html = re.sub(r'(src|data-poster|poster)="(assets|media)/', r'\1="../call/\2/', html)
# Sandy 9 Oct: professional face-locked ChatGPT portrait (brand/face-lock/teach-candid-9oct.png) replaces the casual poolside still,
# so the caption no longer names that event.
html = sub(html, 'src="../call/assets/s1b-teach-graded.webp"', 'src="media/sandy-teach.webp" style="object-position:96% 40%"')
html = sub(html, 'alt="Sandy at a whiteboard by a pool, teaching founders the 5 M\'s: money, market, model, manpower, metrics, split into sales and operations"',
           'alt="Sandy at a glass board with founders, walking through the 5 M\'s: money, market, model, manpower, metrics"')
html = sub(html, "Teaching founders at Founder's House Bootcamp, India", "The 5 M's: the first thing I map with every founder")
html = html.replace('data-poster="../call/media/sami-testimonial-poster.jpg"', 'poster="../call/media/sami-testimonial-poster.jpg"')
html = html.replace('href="../privacy"', 'href="/privacy"').replace('href="../contact"', 'href="/contact"').replace('href="../terms"', 'href="/terms"').replace('href="../refund"', 'href="/refund"')
assert 'js-pay' not in html and 'Book my' not in html
(ROOT / 'v2.1/index.html').write_text(html)   # review copy at /v2.1 (noindex, no gate)

# ---- the live /call (Sandy 9 Oct: "replace it with the main funnel"). Same page plus the funnel wiring. ----
live = sub(html, '<meta name="robots" content="noindex, nofollow" />', CANON)
GATE = '''<script>/* /call needs the homepage opt-in (Sandy 2 Oct); ?in=1 carries it across Instagram's in-app browser (8 Oct) */
(function () { var q = new URLSearchParams(location.search), L = null; try { L = JSON.parse(localStorage.getItem('aiml_lead') || 'null'); } catch (e) {}
  if (!(L && L.ok) && (q.get('in') === '1' || q.get('utm_source') === 'email')) {   /* our own nurture emails go only to opted-in people, often on another device */ L = { ok: true, ts: Date.now() }; try { localStorage.setItem('aiml_lead', JSON.stringify(L)); } catch (e) {} }
  if (!(L && L.ok)) location.replace('/' + location.search + location.hash); })();</script>
'''
live = sub(live, '</head>', GATE + '</head>')
# the opt-in's name + email prefill the calendar, so the relay matches the booking to the lead by email
live = sub(live, "cfg['metadata[page]'] = 'v2.1';", "cfg['metadata[page]'] = 'call'; cfg['metadata[event_key]'] = EVK;\n  try { var L = JSON.parse(localStorage.getItem('aiml_lead') || '{}') || {}; if (L.fn) cfg.name = L.fn; if (L.em) cfg.email = L.em; } catch (e) {}")
# the relay sends the server Schedule as schedule_<metadata.event_key>; the browser one carries the same id, so Meta counts it once
live = sub(live, "function loadCal() {", "var EVK = 'web_' + Date.now().toString(36) + Math.random().toString(36).slice(2, 8);\nfunction loadCal() {")
live = sub(live, "fbq('track', 'Schedule'); } });", "fbq('track', 'Schedule', { content_name: 'AIML free 45 min call' }, { eventID: 'schedule_' + EVK }); setTimeout(function () { location.href = '/call/booked?b=1'; }, 700); } });")
live = sub(live, "track('VSL' + q); }", "track('VSL' + q); if (q === 50 && window.aimlTrack) aimlTrack('ViewContent', { content_name: 'AIML VSL 50%' }); }")
assert 'noindex, nofollow' not in live and 'rzp.io' not in live and '₹999 call' not in live
(ROOT / 'call/index.html').write_text(live)
print('ok', len(html), 'live', len(live))
