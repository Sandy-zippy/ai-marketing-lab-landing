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

if (AIML.REDUCE) return;   /* reduced motion: the finished frame in the HTML/CSS is the whole story */

/* arm only what the reader has not seen yet: hidden (section not revealed) or below the fold */
function below(el) { return el.offsetParent === null || el.getBoundingClientRect().top > innerHeight; }
function watch(el, fn) {
  if (!('IntersectionObserver' in window)) return fn();
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting && e.target.offsetParent !== null) { io.disconnect(); fn(); } });
  }, { threshold: 0.15 }).observe(el);
}

/* ledger rows: the bar fills (what they made), then the teal share grows in (s6-fill). Text never moves. */
root.querySelectorAll('.row').forEach(function (row) {
  var m = row.querySelector('.money');
  if (!below(m)) return;
  row.classList.add('arm');
  watch(m, function () { void row.offsetWidth; row.classList.remove('arm'); row.classList.add('go'); });
});

/* sieve: the dot grids are CSS and always on screen. Armed, the 300 are ink and the 50 / 10 slots are grey;
   on view, 50 ink tokens fly out of the 300 into their slots, then 10 teal tokens drop from the 50 into theirs.
   Labels are HTML and never touched. */
var box = root.querySelector('.sieve'), sg = box.querySelector('.sg'), NS = 'http://www.w3.org/2000/svg';
var PICK = []; for (var k = 0; k < 50; k++) PICK.push(k * 6 + k % 5);   /* 50 of 300, spread over every row at 20 or 30 columns */
var svg = null, run = false;

/* the tokens sit exactly on their now-coloured slots: fade the token layer out, then drop it */
function land() { run = false; if (!svg) return; var s = svg; svg = null; s.classList.add('out'); setTimeout(function () { s.remove(); }, 200); }
function finish() { run = false; box.classList.remove('a300', 'a50', 'a10'); if (svg) { svg.remove(); svg = null; } }
/* dot centres of a CSS grid: cols x n, tile t, measured from the grid's box relative to .sg */
function pts(sel, cols, n) {
  var d = sg.querySelector(sel + ' .dots'), cs = getComputedStyle(d), t = parseFloat(cs.getPropertyValue('--t')) || 9;
  cols = parseInt(cs.getPropertyValue('--c'), 10) || cols;
  var o = sg.getBoundingClientRect(), r = d.getBoundingClientRect(), a = [];
  a.t = t;
  for (var i = 0; i < n; i++) a.push([r.left - o.left + (i % cols) * t + t / 2, r.top - o.top + Math.floor(i / cols) * t + t / 2]);
  return a;
}
function play() {
  var A = pts('.s300', 20, 300), B = pts('.s50', 10, 50), C = pts('.s10', 5, 10);   /* cols are the fallback; CSS --c wins */
  svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fly'); svg.setAttribute('aria-hidden', 'true');
  sg.appendChild(svg);
  function dot(p, r, c) { var e = document.createElementNS(NS, 'circle'); e.setAttribute('cx', p[0]); e.setAttribute('cy', p[1]); e.setAttribute('r', r); e.setAttribute('class', c); svg.appendChild(e); return e; }
  var m1 = PICK.map(function (a) { return dot(A[a], A.t * 0.3, 'm'); }), m2 = null;
  function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function mv(c, a, b, t) { c.setAttribute('cx', a[0] + (b[0] - a[0]) * t); c.setAttribute('cy', a[1] + (b[1] - a[1]) * t); }
  var t0 = performance.now(); run = true;
  (function frame(now) {
    if (!run) return;
    var s = (now - t0) / 1000;
        m1.forEach(function (c, i) { mv(c, A[PICK[i]], B[i], ease(Math.max(0, (s - 0.2 - (PICK[i] % 10) * 0.04 - i * 0.004) / 1.1))); });
    if (s > 1.0) box.classList.remove('a300');   /* the 300 grey out once the 50 are on their way */
    if (s > 1.9 && !m2) { box.classList.remove('a50'); m2 = C.map(function (c, i) { return dot(B[i * 5 + (i * 3) % 5], C.t / 3, 'w'); }); }
    if (m2) m2.forEach(function (c, i) { mv(c, B[i * 5 + (i * 3) % 5], C[i], ease(Math.max(0, (s - 2.0 - i * 0.04) / 1.0))); });
    if (s < 3.4) requestAnimationFrame(frame); else { box.classList.remove('a10'); land(); }
  })(t0);
}
if (below(box)) {
  box.classList.add('a300', 'a50', 'a10');
  watch(sg, play);
  var w0 = innerWidth;   /* phones fire resize when the URL bar collapses mid-scroll: only a width change moves the grids */
  addEventListener('resize', function () { if (innerWidth !== w0 && (run || box.classList.contains('a50'))) finish(); });
}
/* printing: never leave an armed fill on paper */
addEventListener('beforeprint', function () { finish(); root.querySelectorAll('.row.arm').forEach(function (r) { r.classList.remove('arm'); }); });
