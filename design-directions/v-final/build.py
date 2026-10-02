"""Assemble index.html from shell.html + tokens + sections/sN.{html,css,js}.
   python3 build.py            -> index.html here (ROOT ../../, preview inside .call-release)
   python3 build.py --root ../ --out ../../call/index.html -> the /call page; add --home --out ../../index.html for the homepage copy (pages.yml copies
   this folder's assets/ css/ js/ media/ next to it). Sandy approves before any push."""
import json, os, re, sys
H = os.path.dirname(os.path.abspath(__file__))
ROOT = sys.argv[sys.argv.index('--root') + 1] if '--root' in sys.argv else '../../'
OUT = sys.argv[sys.argv.index('--out') + 1] if '--out' in sys.argv else 'index.html'   # e.g. --root ../ --out ../../call/index.html
rd = lambda p: open(os.path.join(H, p)).read() if os.path.exists(os.path.join(H, p)) else ''

def env(p):
    d = {}
    try:
        for l in open(os.path.expanduser(p)):
            if '=' in l and not l.startswith('#'): k, v = l.strip().split('=', 1); d[k] = v.strip('"\'')
    except FileNotFoundError: pass
    return d

# reveal times: live transcript if present, else the defaults below
T = {}
tp = os.path.join(H, '../../../../offers/accelerator/vsl/live-vsl-transcript-2026-10-01.json')
if os.path.exists(tp):
    try: T = json.load(open(tp))
    except Exception: T = {}
# lead's ruling 1 Oct from vsl/edit/final/CHAPTERS-v3.txt: 7:24 "The call" = book block, 7:55 sections, 8:01 CTA pulse
pitch = int(T.get('pitch_s', 475)); cta = int(T.get('final_cta_s', 481)); soft = int(T.get('soft_cta_s', 444))

secs = ['s1', 's2', 's2b'] + [f's{i}' for i in range(3, 11)]
page = rd('shell.html')
sub = {'TOKENS': rd('DESIGN-TOKENS.css'), 'SHELL_CSS': rd('css/shell.css'), 'APP_JS': rd('js/app.js')}
for s in secs:
    sub[s.upper()] = rd(f'sections/{s}.html') or f'<section id="{s}" class="sec"></section>'
    # sections stay hidden until the video reveals them: never let their images compete with the first paint
    sub[s.upper()] = re.sub(r'<img(?![^>]*loading=)', '<img loading="lazy"', sub[s.upper()]).replace(' poster="', ' data-poster="')
for k, v in sub.items(): page = page.replace('{{%s}}' % k, v)
page = (page.replace('{{RELAY_URL}}', env('~/.secrets/aiml-tracking.env').get('APPS_SCRIPT_URL', ''))
            .replace('{{REVEAL_SOFT}}', str(soft)).replace('{{PITCH}}', str(pitch)).replace('{{CTA_SPOKEN}}', str(cta))
            .replace('{{ROOT}}', ROOT))
# Sandy, 2 Oct: aimarketinglabs.in is the opt-in, the form sends the lead to /call (the training).
#   --home : opt-in only (no player, no sections), served at /. Files stay in /call/; <base> resolves them.
#   --call : the training page; app.js sends anyone without an opt-in back to /.
#   neither: local preview, no redirects (agents' shots and gates load it straight).
PAGE = 'home' if '--home' in sys.argv else 'call' if '--call' in sys.argv else 'preview'
page = page.replace('{{PAGE}}', PAGE)
if PAGE == 'home':
    a, b = page.index('<!-- SCREEN 2'), page.index('</main>')
    page = page[:a] + page[b:]
    page = re.sub(r'<link rel="stylesheet" href="css/sections.css"[^>]*/>\n<noscript>.*?</noscript>\n', '', page)
    page = re.sub(r'<script>/\* section scenes.*?</script>\n', '', page, flags=re.S)
    page = (page.replace('<meta charset="UTF-8" />', '<meta charset="UTF-8" />\n<base href="/call/" />', 1)
                .replace('<meta name="robots" content="noindex" />', '<meta name="robots" content="index,follow" />'))
    assert 'id="watch"' not in page and "s.src = 'js/sections.js'" not in page and 'href="css/sections.css"' not in page, 'home kept training parts'
# the homepage is the URL to index
page = page.replace('https://aimarketinglabs.in/call/"', 'https://aimarketinglabs.in/"')
left = re.findall(r'\{\{[A-Z0-9_]+\}\}', page)
assert not left, f'unfilled slots: {left}'
K = env('~/.secrets/aiml-tracking.env').get('APPS_SCRIPT_URL_SECRET')
assert not K or K not in page, 'relay secret key leaked into the page'
os.makedirs(os.path.join(H, 'css'), exist_ok=True); os.makedirs(os.path.join(H, 'js'), exist_ok=True)
css = '\n'.join(f'/* ---- {s} ---- */\n' + rd(f'sections/{s}.css') for s in secs).replace('{{ROOT}}', ROOT)
js = '\n'.join('/* ---- %s ---- */\n;(function(){\n' % s + rd(f'sections/{s}.js') + '\n})();' for s in secs).replace('{{ROOT}}', ROOT)
open(os.path.join(H, 'css/sections.css'), 'w').write(css)
open(os.path.join(H, 'js/sections.js'), 'w').write(js)
open(os.path.join(H, OUT), 'w').write(page)
print(f'index.html built: soft={soft} pitch={pitch} cta={cta} root={ROOT} relay={"set" if "script.google" in page else "MISSING"}')
