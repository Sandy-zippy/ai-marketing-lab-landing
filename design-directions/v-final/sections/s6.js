var root = document.getElementById('s6');
if (!root) return;
/* Sami's video: with JS the native chrome waits for the first tap, so a drawn play glyph is the only play icon;
   without JS the native controls stay. The box is the button until the video has its own controls. */
var vb = root.querySelector('.vid-box'), vv = vb && vb.querySelector('video');
if (vv) {
  vv.controls = false; vb.classList.add('tap');
  vb.tabIndex = 0; vb.setAttribute('role', 'button'); vb.setAttribute('aria-label', 'Play: Sami, Scale Your Results');
  function start() { if (vv.controls) return; vv.controls = true; vb.removeAttribute('role'); vb.removeAttribute('tabindex'); vb.removeAttribute('aria-label'); vv.play(); }
  vb.addEventListener('click', start);
  vb.addEventListener('keydown', function (e) { if (!vv.controls && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(); } });
  vv.addEventListener('play', function () { vb.classList.add('on'); if (!vv.controls) start(); }, { once: true });
}

/* ---------- shared ---------- */
var REDUCE = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function vis(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

/* ================= 1. the case carousel: render(t), t in [0, 21); t = 0 is Medico, finished ================= */
var car = document.getElementById('s6-stage'), tabsEl = car.querySelector('.s6-tabs');
var tabs = [].slice.call(car.querySelectorAll('.s6-tab')), rows = [].slice.call(car.querySelectorAll('.row'));
var CASE = 3.4, D = 3 * CASE, OFF = 2.8;
tabsEl.hidden = false;
var R = rows.map(function (r) {
  var ns = [].slice.call(r.querySelectorAll('.n'));
  return { el: r, win: r.querySelector('.win'), info: r.querySelector('.info'), cap: r.querySelector('.cap'), mb: r.querySelector('.mb'),
    pd: ns[0], md: ns[1], txt: ns.map(function (n) { return n.textContent; }), base: null };
});
tabs.forEach(function (b, i) { b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; });

function fmt(el, x, orig) {
  if (x >= 1) return orig;
  var f = +(el.dataset.from || 0), v = Math.max(+(el.dataset.min || 0), f + (+el.dataset.v - f) * x), dec = el.dataset.dec ? 1 : 0;   /* Medico counts in M from 1 */
  if (Math.abs(+el.dataset.v - v) < .05 * (dec ? 1 : 10)) return orig;   /* the last step lands on the copy's own value (no ~$6.0M) */
  var s = el.dataset.sep ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
  return (el.dataset.pre || '') + s + (el.dataset.suf || '');
}
function setN(r, which, x) { var el = r[which], t = fmt(el, x, r.txt[which === 'pd' ? 0 : 1]); if (el.textContent !== t) el.textContent = t; }

var CW = 0;
function layoutCar() {
  CW = car.clientWidth; if (!CW) return;
  /* the active tab is always wide enough for the client name on one line; on tablets the neighbours peek */
  var tw = CW < 600 ? Math.min(260, CW * .64) : CW < 1000 ? Math.min(290, CW * .42) : Math.min(300, (CW - 64) * .31);
  tabsEl.style.setProperty('--tw', Math.round(tw) + 'px'); car._sp = CW < 600 ? tw + 12 : CW < 1000 ? tw + 20 : tw + 24; car._tw = tw;
  /* each window's resting rect, measured without transforms */
  R.forEach(function (r) { var tr = r.win.style.transform; r.win.style.transform = 'none'; r.base = r.win.getBoundingClientRect(); r.win.style.transform = tr; });
  /* how far each page can scroll in its window at full width (0 when the whole page fits) */
  R.forEach(function (r) { var im = r.win.querySelector('img'), vp = r.win.querySelector('.vp'); r.win.style.setProperty('--sc', Math.max(0, im.offsetHeight - vp.clientHeight) + 'px'); });
  car._base = car.getBoundingClientRect();
}

var activeI = -1;
function renderCar(t) {
  if (!CW || !car._base) return;
  t = ((t % D) + D) % D;
  var T = (t + OFF) % D, c = Math.floor(T / CASE), u = T - c * CASE, prev = (c + 2) % 3;
  /* the rail: continuous index s, every tab on a ring of three, wrapping out of sight */
  var s = c - 1 + sm(k(u, 0, .45));
  tabs.forEach(function (b, j) {
    var sl = ((j - s) % 3 + 4.5) % 3 - 1.5, a = Math.abs(sl), em = 1 - Math.min(1, a);
    var o = (1 - sm(cl((a - 1) / .5))) * (.5 + .5 * em);
    b.style.transform = 'translateX(' + (sl * car._sp - car._tw / 2).toFixed(1) + 'px) scale(' + (.94 + .06 * em).toFixed(3) + ')';
    b.style.opacity = o.toFixed(3); b.style.visibility = o < .01 ? 'hidden' : 'visible';
    b.classList.toggle('on', em > .75);
    b.querySelector('i').style.setProperty('--p', (j === c ? u / CASE : 0).toFixed(4));
  });
  if (activeI !== c) {
    activeI = c;
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', j === c ? 'true' : 'false'); b.tabIndex = j === c ? 0 : -1; });
    rows.forEach(function (r, j) { r.setAttribute('aria-hidden', j === c ? 'false' : 'true'); });
  }
  R.forEach(function (r, j) {
    var cur = j === c, old = j === prev && u < .45;
    vis(r.el, cur || old ? 1 : 0); r.el.style.zIndex = cur ? 2 : 1;   /* the incoming case draws over the outgoing one */
    if (!cur) {                                 /* the outgoing case steps back while the new one is already opening */
      if (!old) return;
      var oo = 1 - sm(k(u, .3, .42));    /* the outgoing screenshot stays until the incoming one is opaque and nearly full size */
      vis(r.win, oo); r.win.style.transform = 'scale(' + (1.035 - .03 * sm(k(u, 0, .42))).toFixed(4) + ')';
      vis(r.info, 1 - sm(k(u, .2, .27))); vis(r.cap, 1 - sm(k(u, 0, .15))); return;   /* the text hands over in ~0.1 s: a name and numbers are always on screen, never two names */
    }
    /* selection -> expansion: the window grows out of the active tab's thumbnail */
    var e = eo(k(u, .1, .5)), push = 1 + .035 * k(u, .7, CASE);
    var th = tabs[c].querySelector('img').getBoundingClientRect(), b = r.base, cb = car.getBoundingClientRect(), cb0 = car._base;
    var dy0 = cb.top - cb0.top, dx0 = cb.left - cb0.left;     /* page scrolled since layout */
    var s0 = Math.max(.05, th.width / b.width), tb = tabsEl.getBoundingClientRect().bottom + 10 + b.height * s0 / 2;   /* enters below the tab rail */
    var dx = (th.left + th.width / 2) - (b.left + dx0 + b.width / 2), dy = tb - (b.top + dy0 + b.height / 2);
    r.win.style.transform = 'translate(' + (dx * (1 - e)).toFixed(1) + 'px,' + (dy * (1 - e)).toFixed(1) + 'px) scale(' + ((s0 + (1 - s0) * e) * push).toFixed(4) + ')';
    vis(r.win, sm(k(u, .1, .22)));
    r.win.style.setProperty('--py', sm(k(u, .5, CASE + .2)).toFixed(4));   /* the page scrolls slowly in its window, like a person reading it (full width, 1:1) */
    r.win.style.setProperty('--a', (u * 75 % 360).toFixed(1) + 'deg'); r.win.style.setProperty('--bo', sm(k(u, .7, 1.1)).toFixed(3));
    vis(r.info, sm(k(u, .25, .33)));   /* the text hands over as the incoming screenshot covers the old one */ r.info.style.transform = 'none';   /* dissolves into the outgoing block on the same baseline */
    vis(r.cap, sm(k(u, .6, .9)));
    /* the ratio: the paid slice lands, then what they made grows out of it. Number and bar share ONE eased value,
       and Made counts up from the paid amount (never from zero). */
    var pp = eo(k(u, .35, .65)), xm = k(u, .5, 2.2), em = 1 - (1 - xm) * (1 - xm), w = parseFloat(r.mb.style.getPropertyValue('--w')) || 0;
    setN(r, 'pd', 1); setN(r, 'md', 1);   /* the figures are always the copy's own; the motion is the bar and the window */
    r.mb.style.setProperty('--pp', pp.toFixed(3));
    r.mb.style.setProperty('--mm', (w * pp + (1 - w) * em).toFixed(4));
    r.mb.style.setProperty('--bf', sm(k(u, .35, .7)).toFixed(3));
    r.mb.style.setProperty('--sw', (u > 2.2 ? ((u - 2.2) / 1.1 % 1) * 1.4 - .25 : -1).toFixed(3));   /* light sweeps the made bar while it is read */
  });
}

/* ================= 2. our own offer: 300 -> 50 -> 10+ (a 5.6 s loop; render2(t)) ================= */
var own = document.getElementById('s6-own'), cv = document.getElementById('s6-cv'), cx = cv.getContext('2d');
var frs = [].slice.call(own.querySelectorAll('.fr p'));
var D2 = 4.6, FW = 0, FH = 0, DPR = 1;
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var ORDER = Array.from({ length: 300 }, function (_, i) { return i; }).sort(function (a, b) { return hash(a) - hash(b); });
var QUAL = {}; ORDER.slice(0, 50).forEach(function (i, j) { QUAL[i] = j; });   /* j < 10: closed */
function layoutOwn() {
  FW = cv.clientWidth; FH = cv.clientHeight; if (!FW) return;
  DPR = Math.min(2, window.devicePixelRatio || 1);
  var w = Math.round(FW * DPR), h = Math.round(FH * DPR);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; render2(seekT !== null ? seekT : acc2, REDUCE); }   /* a resize clears the canvas: repaint at once */
}
/* render2(t): one 5.6 s loop. 0-4.4 the collapse (wall holds 0.6 s first), 4.4-5.0 the ten breathe, 5.0-5.6 the next
   wall crossfades in over them (no rewind). draw(a, alpha, breathe) paints the state at animation time a. */
var L2 = 5.6;
function draw(t, A, bth) {
  var cols = 25, rws = 12, mx = FW * .04, my = FH * .08, cw = (FW - 2 * mx) / cols, ch = (FH - 2 * my) / rws, cell = Math.min(cw, ch), r0 = cell * .22;
  var bs = cell * 1.6, bx = FW / 2 - 4.5 * bs, by = my + bs * .5;   /* the 50 settle at the top of the field, 10 x 5 */
  var rs = Math.min(FW * .075, cell * 2.8), rx = FW / 2 - 5.5 * rs, ry = Math.min(FH * .84, by + 4 * bs + Math.max(cell * 3, FH * .16));   /* the 10 (+) just under them */
  for (var i = 0; i < 300; i++) {
    var c = i % cols, rr = Math.floor(i / cols), x0 = mx + (c + .5) * cw, y0 = my + (rr + .5) * ch, q = QUAL[i];
    var x = x0, y = y0, r = r0, al = .42 * (.78 + .22 * Math.sin(Math.PI * 2 * (bth2 / 1.4 + hash(i + 3)))), teal = 0, glow = 0;   /* the wall twinkles: it is never a still frame */
    if (q === undefined) {                       /* not qualified: drops away */
      var st = .8 + (c / cols) * .5 + hash(i + 7) * .15, f = eo(k(t, st, st + .7));
      y = y0 + f * FH * .3; al = .42 * (1 - sm(k(t, st, st + .6)));
      if (al <= .003) continue;
    } else {
      var e1 = sm(k(t, 1.0 + q * .008, 1.9 + q * .008)), bxq = bx + (q % 10) * bs, byq = by + Math.floor(q / 10) * bs;
      x = x0 + (bxq - x0) * e1; y = y0 + (byq - y0) * e1; al = .42 + .43 * e1;
      if (q >= 10) al *= 1 - .72 * sm(k(t, 2.2, 2.7));
      else {
        var e2 = sm(k(t, 2.3 + q * .035, 3.1 + q * .035)), xr = rx + (q + .5) * rs, b = bth * (.5 + .5 * Math.sin(Math.PI * 2 * (bth2 - q * .06) / 1.2));
        x = x + (xr - x) * e2; y = y + (ry - y) * e2; r = r0 * (1 + 1.4 * e2) * (1 + .3 * b); teal = e2; glow = e2 * (1 + 1.6 * b); al = .85 + .15 * e2;
        if (bth > 0) { var hp = ((bth2 - q * .07) / .9) % 1; if (hp > 0) { cx.globalAlpha = .5 * bth * (1 - hp) * A; cx.strokeStyle = '#3FE0D6'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, r * (1.3 + 1.6 * hp), 0, Math.PI * 2); cx.stroke(); } }   /* a ring travels along the ten */
      }
    }
    cx.globalAlpha = al * A;
    cx.shadowBlur = glow ? 16 * glow : 0; cx.shadowColor = 'rgba(63,224,214,.85)';
    cx.fillStyle = teal > .5 ? '#3FE0D6' : teal > 0 ? 'rgba(' + Math.round(234 - 171 * teal) + ',' + Math.round(245 - 21 * teal) + ',' + Math.round(244 - 30 * teal) + ',1)' : '#EAF5F4';
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
  }
  cx.shadowBlur = 0;
  /* the "+": more than ten */
  var po = .55 * sm(k(t, 3.4, 3.8));
  if (po > 0) {
    cx.globalAlpha = po * A; cx.strokeStyle = '#8FB3B0'; cx.lineWidth = Math.max(1.5, r0 * .5); var px = rx + 10.5 * rs, pr = r0 * 1.4;
    cx.beginPath(); cx.moveTo(px - pr, ry); cx.lineTo(px + pr, ry); cx.moveTo(px, ry - pr); cx.lineTo(px, ry + pr); cx.stroke();
  }
  /* one ring as the ten land */
  var rg = k(t, 3.3, 4.2);
  if (rg > 0 && rg < 1) {
    cx.globalAlpha = .6 * (1 - rg) * A; cx.strokeStyle = '#3FE0D6'; cx.lineWidth = 1.5;
    for (var j = 0; j < 10; j++) { cx.beginPath(); cx.arc(rx + (j + .5) * rs, ry, r0 * (2.4 + 3 * eo(rg)), 0, Math.PI * 2); cx.stroke(); }
  }
  cx.globalAlpha = 1;
}
var bth2 = 0;
function render2(t, fin) {
  if (!FW) return;
  t = fin ? 4.4 : ((t % L2) + L2) % L2;
  var a = Math.min(D2, t + .55), x = fin ? 0 : sm(k(t, 4.9, 5.45));
  bth2 = t;                                       /* the ten breathe (glow + size, a wave along the row) through the hold */
  var lab = x > .5 ? 0 : a < 2.0 ? 0 : a < 3.4 ? 1 : 2;
  frs.forEach(function (p, i) { p.classList.toggle('on', i === lab); });
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, FW, FH);
  draw(a, 1 - x, fin ? 0 : sm(k(t, 3.1, 3.6)) * (1 - x));   /* the ten start to breathe as their landing ring fades */
  if (x > 0) draw(.55, x, 0);       /* the next wall of 300 crossfades in: frame 0 again, no rewind */
}

/* ================= clocks: start in view, pausable, seekable ================= */
var acc = 0, last = 0, raf = 0, inView = false, paused = false, hover = false, manual = -1, seekT = null;
var acc2 = 0, last2 = 0, raf2 = 0, ownStarted = false, inView2 = false, paused2 = false;
function tick(now) {
  raf = 0; if (seekT !== null || paused || hover || !inView) return;
  if (last) acc += Math.min(.1, (now - last) / 1000); last = now;
  if (manual >= 0) {                          /* a tapped tab plays its entrance, then holds */
    var T = (acc + OFF) % D; if (T - manual * CASE >= 2.8) { acc = manual * CASE + 2.8 - OFF; renderCar(acc); return; }
  }
  renderCar(acc); raf = requestAnimationFrame(tick);
}
function kick() { if (!raf && !REDUCE) { last = 0; raf = requestAnimationFrame(tick); } }
function tick2(now) {
  raf2 = 0; if (seekT !== null || paused2 || !inView2) return;
  if (last2) acc2 += Math.min(.1, (now - last2) / 1000); last2 = now;
  render2(acc2); raf2 = requestAnimationFrame(tick2);
}
function kick2() { if (!raf2 && !REDUCE && ownStarted) { last2 = 0; raf2 = requestAnimationFrame(tick2); } }
if (window.AIML && AIML.pauseBtn && !REDUCE) AIML.pauseBtn(own, { pause: function () { paused2 = true; }, play: function () { paused2 = false; kick2(); } });
tabs.forEach(function (b, i) {
  b.addEventListener('click', function () {
    manual = i; acc = ((i * CASE + (REDUCE ? 2.8 : .45) - OFF) % D + D) % D;
    layoutCar(); renderCar(acc); kick();
  });
  b.addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault(); var n = tabs[(i + d + 3) % 3]; n.focus(); n.click();
  });
});
car.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
car.addEventListener('pointerleave', function () { if (hover) { hover = false; kick(); } });
car.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) hover = true; });   // keyboard focus pauses; a mouse click on Play or a tab must not
car.addEventListener('focusout', function () { hover = false; kick(); });
if (window.AIML && AIML.pauseBtn && !REDUCE) AIML.pauseBtn(car, { pause: function () { paused = true; }, play: function () { paused = false; hover = false; kick(); } });

window.__seek_s6 = function (t) { seekT = t; layoutCar(); renderCar(t); };
window.__seek_s6o = function (t) { seekT = t; layoutOwn(); render2(t); };
function relayout() { layoutCar(); renderCar(seekT !== null ? seekT : acc); layoutOwn(); if (REDUCE) render2(0, true); else render2(seekT !== null ? seekT : ownStarted ? acc2 : 0); }
relayout();
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting && e.target.offsetParent !== null; if (inView) { relayout(); kick(); } }); }, { threshold: .25 }).observe(car);
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) {
      if (!e.isIntersecting || e.target.offsetParent === null) return;
      io.disconnect(); layoutOwn(); ownStarted = true;
      if (REDUCE) render2(0, true); else kick2();
    });
  }, { threshold: .7 }).observe(own);
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView2 = e.isIntersecting; if (inView2) kick2(); }); }).observe(own);
} else { inView = true; inView2 = true; ownStarted = true; relayout(); kick(); kick2(); }
addEventListener('resize', relayout);
if (document.fonts) document.fonts.ready.then(relayout);
document.addEventListener('aiml:reveal', relayout);
window.__s6_ready = true;
/* printing: the finished frames */
addEventListener('beforeprint', function () { renderCar(0); render2(0, true); });
