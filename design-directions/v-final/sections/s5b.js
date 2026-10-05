/* S5b v6: the segmented control moves a teal highlight from one programme to the other, row after row (a wave), so the
   reader sees every answer swap. render(p, ps) is a pure function of the selection state; the one-shot intro is a pure
   function of t (window.__seek_s5b(t)): rests on Sprint, the wave runs to the Accelerator, settles there. It plays once when
   60% of the table is in view and is cancelled by the first click or key. No JS / reduced motion: the plain table. */
var sec = document.getElementById('s5b'), seg = document.getElementById('s5b-seg'), wrap = document.getElementById('s5b-t');
if (!sec || !seg || (window.AIML && AIML.REDUCE)) return;
var lay = document.getElementById('s5b-bands'), pill = seg.querySelector('.s5b-pill'), btns = [].slice.call(seg.querySelectorAll('button'));
var rows = [].slice.call(sec.querySelectorAll('thead tr, tbody tr:not(.s5b-g)'));
var pairs = rows.map(function (r) { return [r.querySelector('.s5b-spr'), r.querySelector('.s5b-acc')]; });
var bands = pairs.map(function () { var b = document.createElement('i'); b.className = 's5b-band'; lay.appendChild(b); return b; });
seg.hidden = false;

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function lerp(a, b, q) { return a + (b - a) * q; }

/* draw: pill at pp (0 Sprint .. 1 Accelerator), each row band at its own position pr[i] */
function draw(pp, pr) {
  var W = wrap.getBoundingClientRect(); if (!W.width) return;
  bands.forEach(function (b, i) {
    var a = pairs[i][0].getBoundingClientRect(), c = pairs[i][1].getBoundingClientRect(), q = pr[i], pad = 3;
    b.style.display = a.width < 4 || c.width < 4 ? 'none' : '';   /* phone: the column heads are visually hidden */
    var x = lerp(a.left, c.left, q) - W.left + pad, y = lerp(a.top, c.top, q) - W.top + pad, w = lerp(a.width, c.width, q) - 2 * pad, h = lerp(a.height, c.height, q) - 2 * pad;
    b.style.transform = 'translate(' + x.toFixed(1) + 'px,' + y.toFixed(1) + 'px)'; b.style.width = w.toFixed(1) + 'px'; b.style.height = h.toFixed(1) + 'px';
  });
  var S = seg.getBoundingClientRect(), b0 = btns[0].getBoundingClientRect(), b1 = btns[1].getBoundingClientRect();
  pill.style.transform = 'translateX(' + (lerp(b0.left, b1.left, pp) - S.left - 1).toFixed(1) + 'px)'; pill.style.width = lerp(b0.width, b1.width, pp).toFixed(1) + 'px';
  btns[0].classList.toggle('on', pp < 0.5); btns[1].classList.toggle('on', pp >= 0.5);
}
var STAG = 0.045, RUN = 0.55;
/* the intro and every switch share one wave: rows start STAG apart */
function wave(t, from, to) { return rows.map(function (r, i) { return lerp(from, to, sm(k(t, i * STAG, i * STAG + RUN))); }); }
function render(t) { draw(sm(k(t, 0.45, 1.0)), wave(t - 0.5, 0, 1)); }   /* intro: t in [0, 2.4] */

var sel = 0, anim = 0, intro = 'idle', seekT = null;
function settle() { draw(sel, rows.map(function () { return sel; })); }
function go(to, focus) {
  cancelAnimationFrame(anim); intro = 'done';
  var from = sel; sel = to;
  btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === to ? 'true' : 'false'); b.tabIndex = i === to ? 0 : -1; });
  if (focus) btns[to].focus();
  if (from === to) return settle();
  var t0 = performance.now(), dur = (rows.length - 1) * STAG + RUN;
  (function step(now) {
    var t = (now - t0) / 1000;
    draw(lerp(from, to, sm(k(t, 0, 0.5))), wave(t, from, to));
    if (t < dur) anim = requestAnimationFrame(step);
  })(t0);
}
btns.forEach(function (b, i) { b.addEventListener('click', function () { go(i, false); }); });
seg.addEventListener('keydown', function (e) {
  var to = { ArrowLeft: 0, ArrowUp: 0, Home: 0, ArrowRight: 1, ArrowDown: 1, End: 1 }[e.key];
  if (to === undefined) return; e.preventDefault(); go(to, true);
});

/* before the intro: rest on Sprint (frame 0 of the intro) */
sel = 0; btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === 0 ? 'true' : 'false'); b.tabIndex = i === 0 ? 0 : -1; });
settle();
window.__seek_s5b = function (t) { seekT = t; intro = 'done'; cancelAnimationFrame(anim); render(t); };
function redraw() { if (seekT !== null) render(seekT); else if (intro !== 'run') settle(); }
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(wrap); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if ('IntersectionObserver' in window) new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting || wrap.offsetParent === null) return;
    if (e.intersectionRect.height < 0.6 * Math.min(e.boundingClientRect.height, innerHeight)) return;   /* 60% of the table, or of the screen on a phone */
    redraw();
    if (intro !== 'idle') return io.disconnect();
    io.disconnect(); intro = 'run';
    var t0 = performance.now();
    (function step(now) {
      if (intro !== 'run') return;
      var t = (now - t0) / 1000; render(t);
      if (t < 2.4) anim = requestAnimationFrame(step);
      else { intro = 'done'; sel = 1; btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === 1 ? 'true' : 'false'); b.tabIndex = i === 1 ? 0 : -1; }); settle(); }
    })(t0);
  });
}, { threshold: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1] }).observe(wrap);
