/* S2b v6: deterministic render(t), t in [0,9.6). window.__seek_s2b(t). Persistent actor = the deck of 13 cards.
   0-0.4 the deck, tilted on the table | 0.4-2.9 cards fan out in number order, each stamped with its tier as it lands |
   3.0-4.0 the fan settles into the readable spread (the real grid) | 4.1-6.8 tiers light cumulatively: Free (2), Sprint
   adds (6), Accelerator all 13 | 6.9-8.7 the cards gather back into the deck, 12 first, so 00 ends on top | sway to 9.6.
   The end state is the start state: the loop needs no crossfade. Reduced motion: the spread, static. */
var root = document.getElementById('s2b');
if (!root) return;
var RM = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var stage = root.querySelector('.s2b-stage'), table = root.querySelector('.s2b-table');
var cards = [].slice.call(root.querySelectorAll('.s2b-k')), keys = [].slice.call(root.querySelectorAll('.s2b-key li'));
if (!stage || !table || cards.length !== 13) return;
var D = 9.6, TIER = cards.map(function (c) { return c.classList.contains('s2b-t0') ? 0 : c.classList.contains('s2b-t1') ? 1 : 2; });
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function ease(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function mix(a, b, x) { var o = {}; for (var p in a) o[p] = a[p] + (b[p] - a[p]) * x; return o; }
var dep = function (i) { return 0.4 + 0.19 * i; }, settle = function (i) { return 3.0 + 0.025 * i; }, gath = function (i) { return 6.9 + 0.1 * (12 - i); };
var LIT = [4.1, 4.9, 5.7], LOFF = 6.6;

var G = null;
function layout() {
  if (!table.clientWidth) return false;
  cards.forEach(function (c) { c.style.transform = ''; });
  var W = table.clientWidth, H = table.clientHeight, narrow = W < 560;
  var P = cards.map(function (c) { return { x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2 }; });
  var cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
  /* the deck: centred on the table (phone: a little high so the vertical fan has room below it) */
  var Dc = { x: W / 2, y: narrow ? Math.min(H * 0.22, 110) : H / 2 + 6 };
  G = { P: P, Dc: Dc, narrow: narrow, W: W, H: H, cw: cw, ch: ch };
  return true;
}
function deckP(i, t) {
  var g = G, p = g.P[i];
  var jit = ((i * 37) % 7 - 3) * 0.7;   /* a hand-squared deck: edges show, deterministic */
  return { x: g.Dc.x - p.x, y: g.Dc.y - p.y, z: (12 - i) * 4, rx: g.narrow ? 50 : 42, rz: (g.narrow ? -10 : -18) + jit + 3 * Math.sin(2 * Math.PI * t / D), s: g.narrow ? 1.3 : 1.22 };
}
function fanP(i) {
  var g = G, p = g.P[i], f = i / 12 - 0.5;
  if (g.narrow) {   /* phone: a vertical fan, cards splay down the table */
    var y = g.Dc.y + 30 + i * Math.min(26, (g.H - g.Dc.y - 60) / 12);
    return { x: g.Dc.x + 18 * Math.sin(f * Math.PI) - p.x, y: y - p.y, z: i * 3, rx: 58, rz: f * 14, s: 1.04 };
  }
  var a = f * 120 * Math.PI / 180, R = Math.min(g.W * 0.42, 330);
  return { x: g.Dc.x + R * Math.sin(a) - p.x, y: g.Dc.y + R * (1 - Math.cos(a)) * 0.9 - 18 - p.y, z: i * 3, rx: 24, rz: f * 70, s: 1.08 };
}
var SP = { x: 0, y: 0, z: 0, rx: 0, rz: 0, s: 1 };

function render(t) {
  if (!G) return;
  t = ((t % D) + D) % D;
  var lit = [0, 1, 2].map(function (n) { return sm(k(t, LIT[n], LIT[n] + 0.25)) * (1 - sm(k(t, LOFF, LOFF + 0.2))); });
  cards.forEach(function (c, i) {
    var p, a = dep(i), b = settle(i), g = gath(i);
    if (t < a) p = deckP(i, t);
    else if (t < a + 0.5) p = mix(deckP(i, t), fanP(i), ease(k(t, a, a + 0.5)));
    else if (t < b) p = fanP(i);
    else if (t < b + 0.7) p = mix(fanP(i), SP, sm(k(t, b, b + 0.7)));
    else if (t < g) p = SP;
    else if (t < g + 0.55) p = mix(SP, deckP(i, t), sm(k(t, g, g + 0.55)));
    else p = deckP(i, t);
    /* cumulative: a card lights when its own tier or any later tier is lit (Sprint includes Free, Accelerator all 13) */
    var L = Math.max.apply(null, lit.filter(function (_, n) { return n >= TIER[i]; }));
    c.style.transform = 'translate3d(' + p.x.toFixed(1) + 'px,' + (p.y - 6 * L).toFixed(1) + 'px,0) rotateX(' + p.rx.toFixed(2) + 'deg) rotateZ(' + p.rz.toFixed(2) + 'deg) translateZ(' + (p.z + 18 * L).toFixed(1) + 'px) scale(' + p.s.toFixed(3) + ')';
    c.classList.toggle('lit', L > 0.5);
    /* the tier stamp lands with the card in the fan, and lifts off as it is gathered */
    var e = c.querySelector('em'), so = sm(k(t, a + 0.4, a + 0.55)) * (1 - sm(k(t, g, g + 0.2)));
    e.style.opacity = so.toFixed(3);
    e.style.transform = 'scale(' + (1 + 0.35 * (1 - ease(k(t, a + 0.4, a + 0.7)))).toFixed(3) + ')';
  });
  keys.forEach(function (key, n) {
    var pulse = 0;
    cards.forEach(function (c, i) { if (TIER[i] === n) pulse = Math.max(pulse, Math.sin(Math.PI * k(t, dep(i) + 0.4, dep(i) + 0.75))); });
    var on = Math.max.apply(null, lit.filter(function (_, m) { return m >= n; }));
    key.classList.toggle('lit', on > 0.5);
    key.style.transform = 'scale(' + (1 + 0.06 * pulse).toFixed(3) + ')';
    key.style.boxShadow = pulse > 0.01 ? '0 0 0 ' + (3 * pulse).toFixed(1) + 'px rgba(0,161,155,.35)' : '';
  });
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
