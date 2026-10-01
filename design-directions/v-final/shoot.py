"""python3 shoot.py [stage]  stage: a (qualify) | b (watch) | all (every section revealed, finished state).
Screenshots at 390/768/1440 into shots/, prints section left edges + overflow."""
import sys, json
from playwright.sync_api import sync_playwright
URL = 'http://127.0.0.1:4870/design-directions/v-final/index.html'
stage = sys.argv[1] if len(sys.argv) > 1 else 'all'
only = sys.argv[2] if len(sys.argv) > 2 else None
with sync_playwright() as p:
    b = p.chromium.launch()
    for w in (390, 768, 1440):
        pg = b.new_page(viewport={'width': w, 'height': 900}, reduced_motion='reduce' if stage == 'all' else 'no-preference')
        errs = []; pg.on('console', lambda m: errs.append(m.text) if m.type == 'error' else None); pg.on('pageerror', lambda e: errs.append(str(e)))
        pg.goto(URL)
        if stage != 'a':
            pg.evaluate("localStorage.setItem('aiml_lead', JSON.stringify({ok:true,fn:'Test'}))" + (";localStorage.setItem('aiml_vsl_seen','1')" if stage == 'all' else ''))
            pg.reload()
        pg.wait_for_timeout(1500)
        r = pg.evaluate("""() => {
          const out = {}; const wrap = [...document.querySelectorAll('main .wrap')].find(w => w.offsetParent);
          out.wrapLeft = Math.round(wrap.getBoundingClientRect().left + parseFloat(getComputedStyle(wrap).paddingLeft));
          out.docW = document.documentElement.scrollWidth; out.vw = innerWidth; out.h = document.documentElement.scrollHeight;
          out.sections = [...document.querySelectorAll('main section')].filter(s => s.offsetParent).map(s => {
            const kids = [...s.querySelectorAll('h1,h2,.label,.callout,p')].filter(e => e.offsetParent);
            const l = kids.length ? Math.round(Math.min(...kids.map(k => k.getBoundingClientRect().left))) : null;
            return [s.id, l];
          });
          return out; }""")
        print(w, json.dumps(r), 'console errors:', errs[:5])
        if only:
            el = pg.query_selector('#' + only)
            if el: el.screenshot(path=f'shots/{only}-{w}.png')
        else:
            pg.screenshot(path=f'shots/{stage}-{w}.png', full_page=True)
        pg.close()
    b.close()
