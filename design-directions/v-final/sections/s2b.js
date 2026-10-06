/* S2b v6: deterministic render(t), t in [0,9.5). window.__seek_s2b(t). Persistent actor = the deck of 13 cards.
   0-0.25 the deck, tilted on the table | 0.25-2.5 cards fan out in number order into a hand (desktop: every number
   corner stays visible; phone: a vertical cascade), each stamped with its tier as it lands | 2.9-4.9 dealt one by one,
   in number order, into the readable spread (the real grid) | 5.0-6.9 tiers light cumulatively: Free (2), Sprint adds
   (6), Accelerator all 13, under a slow push | 6.9-7.4 lights ease off | 7.5-9.2 the cards gather back into the deck,
   12 first, so 00 ends on top | 9.5 = 0: no crossfade. Reduced motion: the spread, static.
   The clock is offset by START (4.95 s) so the loop OPENS on the finished spread: seek t maps to story time t + 4.95. */
var root = document.getElementById('s2b');
if (!root) return;
var RM = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var stage = root.querySelector('.s2b-stage'), table = root.querySelector('.s2b-table'), deck = root.querySelector('.s2b-deck');
var cards = [].slice.call(root.querySelectorAll('.s2b-k')), keys = [].slice.call(root.querySelectorAll('.s2b-key li'));
if (!stage || !table || !deck || cards.length !== 13) return;
var D = 9.5, TIER = cards.map(function (c) { return c.classList.contains('s2b-t0') ? 0 : c.classList.contains('s2b-t1') ? 1 : 2; });
var slots = root.querySelector('.s2b-slots'), stamps = cards.map(function (c) { return c.querySelector('em'); });
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function ease(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function mix(a, b, x) { var o = {}; for (var p in a) o[p] = a[p] + (b[p] - a[p]) * x; return o; }
var dep = function (i) { return 0.25 + 0.15 * i; }, settle = function (i) { return 2.9 + 0.13 * i; }, gath = function (i) { return 7.4 + 0.1 * (12 - i); }, gdur = function (i) { return i < 2 ? 0.8 : 0.6; };
var LIT = [5.0, 5.6, 6.2], LOFF = 6.9, START = 4.95;

var G = null;
function layout() {
  if (!table.clientWidth) return false;
  cards.forEach(function (c) { c.style.transform = ''; });
  deck.style.transform = '';
  var W = table.clientWidth, H = table.clientHeight, narrow = W < 560;
  var P = cards.map(function (c) { return { x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2 }; });
  var cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
  var Dc = { x: W / 2, y: narrow ? ch * 2 + 16 : H / 2 - 10 };   /* phone: clear of the tier key above the table */
  G = { P: P, Dc: Dc, narrow: narrow, W: W, H: H, cw: cw, ch: ch };
  return true;
}
function deckP(i, t) {
  var g = G, p = g.P[i], jit = ((i * 37) % 7 - 3) * 0.7;   /* a hand-squared deck: the edges show, deterministic */
  return { x: g.Dc.x - p.x, y: g.Dc.y - p.y, z: 64 + (12 - i) * 4,   /* lifted off the table: the tilted deck never cuts the flat cards */
     rx: g.narrow ? 50 : 42, rz: (g.narrow ? -10 : -18) + jit + 3 * Math.sin(2 * Math.PI * t / D), s: g.narrow ? 1.25 : 1.22 };
}
function fanP(i, t) {
  var g = G, p = g.P[i], br = 1 + 0.03 * sm(k(t, 2.45, 2.9));   /* the full hand breathes open before the deal */
  if (g.narrow) {   /* phone: a vertical cascade down the table, every number and name visible */
    var top = 8 + g.ch * 0.33, step = Math.min(38, (g.H - top - g.ch * 0.33) / 12) * br;
    return { x: g.Dc.x + 14 * Math.sin((i / 12 - 0.5) * Math.PI) - p.x, y: top + i * step - p.y, z: i * 3, rx: 56, rz: (i / 12 - 0.5) * 8, s: 0.95 };
  }
  /* desktop: a hand of cards on a pivot below; the per-card offset is set so 13 fit and each number corner shows */
  /* flat on the table (rx 0) so the layering is by z alone: each card sits on the one before, number corner clear */
  var s = 0.74, off = Math.min(54, (g.W - g.cw * s - 24) / 12) * br, Rp = 560, a = (i - 6) * off / Rp;
  return { x: g.Dc.x + Rp * Math.sin(a) - p.x, y: g.Dc.y - 30 + Rp * (1 - Math.cos(a)) - p.y, z: i * 6, rx: 0, rz: a * 180 / Math.PI, s: s };
}
var SP = { x: 0, y: 0, z: 0, rx: 0, rz: 0, s: 1 };

function render(t) {
  if (!G) return;
  t = (((t + START) % D) + D) % D;   /* frame 0 = the finished spread (critic, 6 Oct): the loop starts where the tiers light */
  var lit = [0, 1, 2].map(function (n) { return sm(k(t, LIT[n], LIT[n] + 0.25)); });
  cards.forEach(function (c, i) {
    var p, a = dep(i), b = settle(i), g = gath(i), gd = gdur(i), lift = 0, zi;
    /* layering by z-index (deterministic): deck 00 on top; whatever is in flight above everything; the fan by index */
    if (t < a) { p = deckP(i, t); zi = 100 + 12 - i; }
    else if (t < a + 0.45) { p = mix(deckP(i, t), fanP(i, t), ease(k(t, a, a + 0.45))); zi = 300 + i; }
    else if (t < b) { p = fanP(i, t); zi = 200 + i; }
    else if (t < b + 0.4) { zi = 300 + i; var e = ease(k(t, b, b + 0.4)); p = mix(fanP(i, t), SP, e); lift = 30 * Math.sin(Math.PI * e); }
    else if (t < g) { p = mix(SP, SP, 0); p.s = 1 + 0.03 * (1 - sm(k(t, b + 0.4, b + 0.6))); zi = 10; }   /* a small landing settle */
    else if (t < g + gd) { var e2 = sm(k(t, g, g + gd)); p = mix(SP, deckP(i, t), e2); lift = 50 * Math.sin(Math.PI * e2); zi = 300 + 12 - i; }
    else { p = deckP(i, t); zi = 100 + 12 - i; }
    c.style.zIndex = zi;
    /* cumulative: a card lights when its own tier or any later tier is lit (Sprint includes Free, Accelerator all 13) */
    var L = Math.max.apply(null, lit.filter(function (_, n) { return n >= TIER[i]; })) * (1 - sm(k(t, LOFF + 0.03 * i, LOFF + 0.03 * i + 0.35)));
    c.style.transform = 'perspective(1400px) translate3d(' + p.x.toFixed(1) + 'px,' + (p.y - 6 * L).toFixed(1) + 'px,0) rotateX(' + p.rx.toFixed(2) + 'deg) rotateZ(' + p.rz.toFixed(2) + 'deg) translateZ(' + (p.z + 18 * L + lift).toFixed(1) + 'px) scale(' + p.s.toFixed(3) + ')';
    c.style.boxShadow = L > 0.01 ? '0 0 0 ' + (3 * L).toFixed(2) + 'px var(--accent),0 18px 30px -14px rgba(0,115,110,' + (0.55 * L).toFixed(2) + ')' : '';
    /* the tier stamp lands with the card (desktop: in the fan; phone: in the spread) and lifts off as it is gathered */
    var at = G.narrow ? b + 0.3 : a + 0.35, so = sm(k(t, at, at + 0.15)) * (1 - sm(k(t, g, g + 0.2)));
    stamps[i].style.opacity = so.toFixed(3);
    stamps[i].style.transform = 'scale(' + (1 + 0.35 * (1 - ease(k(t, at, at + 0.3)))).toFixed(3) + ')';
  });
  keys.forEach(function (key, n) {
    var pulse = 0;
    cards.forEach(function (c, i) { if (TIER[i] === n) { var at = G.narrow ? settle(i) + 0.3 : dep(i) + 0.35; pulse = Math.max(pulse, Math.sin(Math.PI * k(t, at, at + 0.35))); } });
    var on = Math.max.apply(null, lit.filter(function (_, m) { return m >= n; })) * (1 - sm(k(t, LOFF, LOFF + 0.4)));
    key.style.background = on > 0.01 ? 'rgba(0,161,155,' + on.toFixed(3) + ')' : '';
    key.style.borderColor = on > 0.01 ? 'rgba(0,161,155,' + Math.max(on, 0.3).toFixed(3) + ')' : '';
    key.classList.toggle('lit', on > 0.5);
    key.style.transform = 'scale(' + (1 + 0.06 * pulse).toFixed(3) + ')';
    key.style.boxShadow = pulse > 0.01 ? '0 0 0 ' + (3 * pulse).toFixed(1) + 'px rgba(0,161,155,.35)' : '';
  });
  /* the empty slots stay quiet while the deck owns the frame, and come up as the deal starts */
  slots.style.opacity = (0.3 + 0.7 * sm(k(t, 2.7, 3.1)) * (1 - sm(k(t, 7.6, 9.0)))).toFixed(3);
  /* a slow push while the tiers light */
  deck.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 4.9, 6.9)) * (1 - sm(k(t, 6.9, 7.5)))).toFixed(4) + ')';
}

var T0 = 0, base = 0, running = false, paused = false, seekT = null, raf = 0, inView = false;
function now() { return base + (running ? (performance.now() - T0) / 1000 : 0); }
function tick() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(tick) : 0; }
function play() { if (running || RM || paused || !inView) return; if (!G && !layout()) return; running = true; T0 = performance.now(); raf = requestAnimationFrame(tick); }
function stop() { if (!running) return; base = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s2b = function (t) { seekT = t; if (!G) layout(); render(t); };
function relayout() { if (RM || !layout()) return; render(seekT !== null ? seekT : now()); }
function boot() { if (RM || G || !table.clientWidth) return; if (layout()) render(0); }
boot();
document.addEventListener('aiml:reveal', function () { setTimeout(boot, 0); });
addEventListener('resize', function () { if (G) relayout(); });
if (document.fonts) document.fonts.ready.then(function () { if (G) relayout(); else boot(); });
if (!RM && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting; if (inView) { boot(); play(); } else stop(); });
  }, { threshold: 0.25 }).observe(stage);
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; play(); } });
}
