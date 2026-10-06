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
var CASE = 7, D = 3 * CASE, OFF = 3.0;
tabsEl.hidden = false;
var R = rows.map(function (r) {
  var ns = [].slice.call(r.querySelectorAll('.n'));
  return { el: r, win: r.querySelector('.win'), info: r.querySelector('.info'), cap: r.querySelector('.cap'), mb: r.querySelector('.mb'),
    pd: ns[0], md: ns[1], txt: ns.map(function (n) { return n.textContent; }), base: null };
});
tabs.forEach(function (b, i) { b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; });

function fmt(el, x, orig) {
  if (x >= 1) return orig;
  var f = +(el.dataset.from || 0), v = f + (+el.dataset.v - f) * x, dec = el.dataset.dec ? 1 : 0;
  var s = el.dataset.sep ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
  return (el.dataset.pre || '') + s + (el.dataset.suf || '');
}
function setN(r, which, x) { var el = r[which], t = fmt(el, x, r.txt[which === 'pd' ? 0 : 1]); if (el.textContent !== t) el.textContent = t; }

var CW = 0;
function layoutCar() {
  CW = car.clientWidth; if (!CW) return;
  var tw = CW < 600 ? Math.min(260, CW * .64) : Math.min(300, (CW - 64) * .31);
  tabsEl.style.setProperty('--tw', Math.round(tw) + 'px'); car._sp = CW < 600 ? tw + 12 : tw + 24; car._tw = tw;
  /* each window's resting rect, measured without transforms */
  R.forEach(function (r) { var tr = r.win.style.transform; r.win.style.transform = 'none'; r.base = r.win.getBoundingClientRect(); r.win.style.transform = tr; });
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
    var cur = j === c, old = j === prev && u < .35;
    vis(r.el, cur || old ? 1 : 0);
    if (!cur) {                                 /* the outgoing case steps back while the new one is already opening */
      if (!old) return;
      var oo = 1 - sm(k(u, .05, .3));
      vis(r.win, oo); r.win.style.transform = 'scale(' + (1.035 - .05 * sm(k(u, 0, .3))).toFixed(4) + ')';
      vis(r.info, 1 - sm(k(u, 0, .2))); vis(r.cap, 1 - sm(k(u, 0, .2))); return;
    }
    /* selection -> expansion: the window grows out of the active tab's thumbnail */
    var e = eo(k(u, .05, .7)), push = 1 + .04 * k(u, .7, CASE);
    var th = tabs[c].querySelector('img').getBoundingClientRect(), b = r.base, cb = car.getBoundingClientRect(), cb0 = car._base;
    var dy0 = cb.top - cb0.top, dx0 = cb.left - cb0.left;     /* page scrolled since layout */
    var s0 = Math.max(.05, th.width / b.width), dx = (th.left + th.width / 2) - (b.left + dx0 + b.width / 2), dy = (th.top + th.height / 2) - (b.top + dy0 + b.height / 2);
    r.win.style.transform = 'translate(' + (dx * (1 - e)).toFixed(1) + 'px,' + (dy * (1 - e)).toFixed(1) + 'px) scale(' + ((s0 + (1 - s0) * e) * push).toFixed(4) + ')';
    vis(r.win, sm(k(u, .05, .18)));
    r.win.style.setProperty('--a', (u * 75 % 360).toFixed(1) + 'deg'); r.win.style.setProperty('--bo', sm(k(u, .7, 1.1)).toFixed(3));
    vis(r.info, sm(k(u, .3, .6))); r.info.style.transform = 'translateY(' + (10 * (1 - eo(k(u, .3, .7)))).toFixed(1) + 'px)';
    vis(r.cap, sm(k(u, .6, .9)));
    /* the ratio: the paid slice lands, then what they made grows out of it. Number and bar share ONE eased value,
       and Made counts up from the paid amount (never from zero). */
    var pp = eo(k(u, .7, 1.0)), em = sm(k(u, 1.0, 2.4)), w = parseFloat(r.mb.style.getPropertyValue('--w')) || 0;
    setN(r, 'pd', 1); setN(r, 'md', em);
    r.mb.style.setProperty('--pp', pp.toFixed(3));
    r.mb.style.setProperty('--mm', (w * pp + (1 - w) * em).toFixed(4));
    r.mb.style.setProperty('--bf', sm(k(u, .7, 1.05)).toFixed(3));
    r.mb.style.setProperty('--sw', (u > 2.4 ? ((u - 2.4) / 1.6 % 1) * 1.4 - .25 : -1).toFixed(3));   /* light sweeps the made bar while it is read */
  });
}

/* ================= 2. our own offer: 300 -> 50 -> 10+ (plays once; render2(t), t in [0, 4.6]) ================= */
var own = document.getElementById('s6-own'), cv = document.getElementById('s6-cv'), cx = cv.getContext('2d');
var frs = [].slice.call(own.querySelectorAll('.fr p'));
var D2 = 4.6, FW = 0, FH = 0, DPR = 1;
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var ORDER = Array.from({ length: 300 }, function (_, i) { return i; }).sort(function (a, b) { return hash(a) - hash(b); });
var QUAL = {}; ORDER.slice(0, 50).forEach(function (i, j) { QUAL[i] = j; });   /* j < 10: closed */
function layoutOwn() {
  FW = cv.clientWidth; FH = cv.clientHeight; if (!FW) return;
  DPR = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(FW * DPR); cv.height = Math.round(FH * DPR);
}
function render2(t) {
  if (!FW) return;
  t = Math.max(0, Math.min(D2, t + .2));           /* the wall holds 0.6 s, then moves */
  var a = t < 2.0 ? 0 : t < 3.4 ? 1 : 2;
  frs.forEach(function (p, i) { p.classList.toggle('on', i === a); });
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, FW, FH);
  var cols = 25, rws = 12, mx = FW * .04, my = FH * .08, cw = (FW - 2 * mx) / cols, ch = (FH - 2 * my) / rws, cell = Math.min(cw, ch), r0 = cell * .22;
  var bs = cell * 1.6, bx = FW / 2 - 4.5 * bs, by = FH * .4 - 2 * bs;     /* the block of 50: 10 x 5 */
  var rs = Math.min(FW * .075, cell * 2.8), rx = FW / 2 - 5.5 * rs, ry = FH * .84;   /* the row of 10 (+) */
  for (var i = 0; i < 300; i++) {
    var c = i % cols, rr = Math.floor(i / cols), x0 = mx + (c + .5) * cw, y0 = my + (rr + .5) * ch, q = QUAL[i];
    var x = x0, y = y0, r = r0, al = .42, teal = 0, glow = 0;
    if (q === undefined) {                       /* not qualified: drops away */
      var st = .8 + (c / cols) * .5 + hash(i + 7) * .15, f = eo(k(t, st, st + .7));
      y = y0 + f * FH * .3; al = .42 * (1 - sm(k(t, st, st + .6)));
      if (al <= .003) continue;
    } else {
      var e1 = sm(k(t, 1.0 + q * .008, 1.9 + q * .008)), bxq = bx + (q % 10) * bs, byq = by + Math.floor(q / 10) * bs;
      x = x0 + (bxq - x0) * e1; y = y0 + (byq - y0) * e1; al = .42 + .43 * e1;
      if (q >= 10) al *= 1 - .72 * sm(k(t, 2.4, 2.9));
      else {
        var e2 = sm(k(t, 2.5 + q * .035, 3.3 + q * .035)), xr = rx + (q + .5) * rs;
        x = x + (xr - x) * e2; y = y + (ry - y) * e2; r = r0 * (1 + 1.4 * e2); teal = e2; glow = e2; al = .85 + .15 * e2;
      }
    }
    cx.globalAlpha = al;
    cx.shadowBlur = glow ? 16 * glow : 0; cx.shadowColor = 'rgba(63,224,214,.85)';
    cx.fillStyle = teal > .5 ? '#3FE0D6' : teal > 0 ? 'rgba(' + Math.round(234 - 171 * teal) + ',' + Math.round(245 - 21 * teal) + ',' + Math.round(244 - 30 * teal) + ',1)' : '#EAF5F4';
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
  }
  cx.shadowBlur = 0;
  /* the "+": more than ten */
  var po = .55 * sm(k(t, 3.4, 3.8));
  if (po > 0) {
    cx.globalAlpha = po; cx.strokeStyle = '#8FB3B0'; cx.lineWidth = Math.max(1.5, r0 * .5); var px = rx + 10.5 * rs, pr = r0 * 1.4;
    cx.beginPath(); cx.moveTo(px - pr, ry); cx.lineTo(px + pr, ry); cx.moveTo(px, ry - pr); cx.lineTo(px, ry + pr); cx.stroke();
  }
  /* one ring as the ten land */
  var rg = k(t, 3.3, 4.2);
  if (rg > 0 && rg < 1) {
    cx.globalAlpha = .6 * (1 - rg); cx.strokeStyle = '#3FE0D6'; cx.lineWidth = 1.5;
    for (var j = 0; j < 10; j++) { cx.beginPath(); cx.arc(rx + (j + .5) * rs, ry, r0 * (2.4 + 3 * eo(rg)), 0, Math.PI * 2); cx.stroke(); }
  }
  cx.globalAlpha = 1;
}

/* ================= clocks: start in view, pausable, seekable ================= */
var acc = 0, last = 0, raf = 0, inView = false, paused = false, hover = false, manual = -1, seekT = null;
var acc2 = 0, last2 = 0, raf2 = 0, ownStarted = false;
function tick(now) {
  raf = 0; if (seekT !== null || paused || hover || !inView) return;
  if (last) acc += Math.min(.1, (now - last) / 1000); last = now;
  if (manual >= 0) {                          /* a tapped tab plays its entrance, then holds */
    var T = (acc + OFF) % D; if (T - manual * CASE >= 3.0) { acc = manual * CASE + 3.0 - OFF; renderCar(acc); return; }
  }
  renderCar(acc); raf = requestAnimationFrame(tick);
}
function kick() { if (!raf && !REDUCE) { last = 0; raf = requestAnimationFrame(tick); } }
function tick2(now) {
  raf2 = 0; if (seekT !== null) return;
  if (last2) acc2 += Math.min(.1, (now - last2) / 1000); last2 = now;
  render2(acc2); if (acc2 < D2) raf2 = requestAnimationFrame(tick2);
}
tabs.forEach(function (b, i) {
  b.addEventListener('click', function () {
    manual = i; acc = ((i * CASE + (REDUCE ? 3.0 : .45) - OFF) % D + D) % D;
    layoutCar(); renderCar(acc); kick();
  });
  b.addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault(); var n = tabs[(i + d + 3) % 3]; n.focus(); n.click();
  });
});
car.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
car.addEventListener('pointerleave', function () { if (hover) { hover = false; kick(); } });
car.addEventListener('focusin', function () { hover = true; });
car.addEventListener('focusout', function () { hover = false; kick(); });
if (window.AIML && AIML.pauseBtn && !REDUCE) AIML.pauseBtn(car, { pause: function () { paused = true; }, play: function () { paused = false; kick(); } });

window.__seek_s6 = function (t) { seekT = t; layoutCar(); renderCar(t); };
window.__seek_s6o = function (t) { seekT = t; layoutOwn(); render2(t); };
function relayout() { layoutCar(); renderCar(seekT !== null ? seekT : acc); layoutOwn(); render2(seekT !== null ? D2 : (REDUCE || ownStarted) ? (REDUCE ? D2 : acc2) : 0); }
relayout();
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting && e.target.offsetParent !== null; if (inView) { relayout(); kick(); } }); }, { threshold: .25 }).observe(car);
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) {
      if (!e.isIntersecting || e.target.offsetParent === null) return;
      io.disconnect(); layoutOwn(); ownStarted = true;
      if (REDUCE) render2(D2); else { last2 = 0; raf2 = requestAnimationFrame(tick2); }
    });
  }, { threshold: .7 }).observe(own);
} else { inView = true; ownStarted = true; acc2 = D2; relayout(); kick(); }
addEventListener('resize', relayout);
if (document.fonts) document.fonts.ready.then(relayout);
document.addEventListener('aiml:reveal', relayout);
window.__s6_ready = true;
/* printing: the finished frames */
addEventListener('beforeprint', function () { renderCar(0); render2(D2); });
