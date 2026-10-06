/* S7: deterministic render(t), t in [0,5.9). Seek with window.__seek_s7(t). Reduced motion / no JS = the finished frame.
   Row 1 ticks at full pace, rows 2-5 cascade; each tick sends a dot along a solid line (Magic UI animated-beam,
   ported) into the dial, and the dot's landing fills one of the five segments. At 5 of 5 the stamp drops and locks (shackle
   closes, one teal flash); the locked ring breathes. Loop: element-wise crossfade to frame 0. */
var stage = document.getElementById('s7-stage'), scene = document.getElementById('s7-scene');
if (!stage || !scene) return;
var D = 5.8, RM = AIML.REDUCE, END = 4.4, NS = 'http://www.w3.org/2000/svg';
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var rows = [].slice.call(scene.querySelectorAll('.s7-rows li')), seal = scene.querySelector('.s7-seal'), cnt = scene.querySelector('.s7-cnt');
var dial = scene.querySelector('.s7-dial'), arcG = scene.querySelector('.s7-arc'), trk = scene.querySelector('.s7-trk');
var beam = scene.querySelector('.s7-beam'), bl = scene.querySelector('.s7-bl'), dot = scene.querySelector('.s7-dot');
function seg(i) {   /* five segments, 4 degree gaps, clockwise from 12 o'clock (the svg is rotated -90deg) */
  var r = 86, a0 = (i * 72 + 2) * Math.PI / 180, a1 = ((i + 1) * 72 - 2) * Math.PI / 180;
  return 'M' + (100 + r * Math.cos(a0)).toFixed(2) + ' ' + (100 + r * Math.sin(a0)).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + (100 + r * Math.cos(a1)).toFixed(2) + ' ' + (100 + r * Math.sin(a1)).toFixed(2);
}
var arcs = [];
for (var i = 0; i < 5; i++) {
  var p0 = document.createElementNS(NS, 'path'); p0.setAttribute('d', seg(i)); trk.appendChild(p0);
  var p1 = document.createElementNS(NS, 'path'); p1.setAttribute('d', seg(i)); p1.setAttribute('pathLength', '1'); arcG.appendChild(p1); arcs.push(p1);
}
function st(i) { return i === 0 ? 0.25 : 1.15 + (i - 1) * 0.4; }
function pace(i) { return i === 0 ? 1 : 0.7; }
function beamT(i) { var s = st(i), m = pace(i), b0 = s + 0.25 * m; return [b0, b0 + 0.45 * m]; }

var G = null;
function layout() {
  if (!stage.clientWidth) return false;
  stage.classList.add('s7-live');
  var sw = scene.offsetWidth, sr = scene.getBoundingClientRect(), sc = sr.width / sw || 1, dr = dial.getBoundingClientRect();
  var cx = (dr.left + dr.width / 2 - sr.left) / sc, cy = (dr.top + dr.height / 2 - sr.top) / sc, R = dr.width / sc * 0.43 + 4;
  var below = (dr.bottom - sr.top) / sc < (rows[0].getBoundingClientRect().top - sr.top) / sc + 1;   /* phone: dial above the sheet */
  var g = { paths: [], L: [] };
  beam.setAttribute('viewBox', '0 0 ' + sw + ' ' + scene.offsetHeight);
  rows.forEach(function (li) {
    var r = li.getBoundingClientRect(), y0 = (r.top + r.height / 2 - sr.top) / sc, d;
    if (below) {
      /* out of the box's left side, up the panel's left gutter, into the dial's lower-left */
      var bx = (li.querySelector('.s7-box').getBoundingClientRect().left - sr.left) / sc - 4, gx = Math.max(6, bx - 12);
      var tx = cx - R * 0.707, ty = cy + R * 0.707;
      d = 'M' + bx.toFixed(1) + ' ' + y0.toFixed(1) + 'Q' + gx.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + gx.toFixed(1) + ' ' + (y0 - 14).toFixed(1) +
          'L' + gx.toFixed(1) + ' ' + (ty + 24).toFixed(1) + 'Q' + gx.toFixed(1) + ' ' + ty.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1);
    } else {
      /* out of the state cell's right side, curving into the nearest point of the ring */
      var s2 = li.querySelector('.s7-st').getBoundingClientRect(), x0 = (s2.right - sr.left) / sc + 10;
      var a = Math.atan2(y0 - cy, x0 - cx), x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a), dx = Math.max(20, (x1 - x0) * 0.55);
      d = 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + (x0 + dx).toFixed(1) + ' ' + y0.toFixed(1) + ' ' + (x1 - dx * 0.6).toFixed(1) + ' ' + y1.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    g.paths.push(d); bl.setAttribute('d', d); g.L.push(bl.getTotalLength());
  });
  G = g; return true;
}

function render(t) {
  t = ((t % D) + D) % D;
  /* seam (5.1 -> 5.6): a true crossfade from the end state to frame 0, element by element. Nothing blanks: the
     ticks and teal segments fade while "mapped" fades back in under "done", the count and the stamp swap at the
     midpoint. Then frame 0 holds a beat before the first tick. */
  var X = t >= 5.1 ? k(t, 5.1, 5.6) : 0, seam = t >= 5.1 && t < 5.6;
  var OUT = 1 - sm(k(X, 0, 0.42)), IN = sm(k(X, 0.58, 1));   /* old state fully out before the new one comes in */
  if (t >= 5.6) t = 0; else if (seam) t = 5.1;
  arcG.style.opacity = 1 - sm(X);
  var done = 0, glow = 0, bOn = -1, bP = 0;
  rows.forEach(function (li, i) {
    var s = st(i), m = pace(i), B = beamT(i);
    li.style.setProperty('--f', eo(k(t, s, s + 0.2 * m)).toFixed(3));
    li.style.setProperty('--c', eo(k(t, s + 0.1 * m, s + 0.35 * m)).toFixed(3));
    var dd = eo(k(t, s + 0.15 * m, s + 0.4 * m));
    li.style.setProperty('--d', dd.toFixed(3)); li.style.setProperty('--wy', (seam ? 0 : dd).toFixed(3));
    li.style.setProperty('--wo', (seam ? IN : cl(1 - dd * 2.2)).toFixed(3)); li.style.setProperty('--do', (seam ? OUT : cl(dd * 2.2 - 1.2)).toFixed(3));
    li.style.setProperty('--fo', (seam ? 1 - sm(X) : 1).toFixed(3));
    li.style.setProperty('--a', (sm(k(t, s - 0.05, s + 0.1)) * (1 - sm(k(t, B[1], B[1] + 0.3)))).toFixed(3));
    if (t >= B[0] && t < B[1] + 0.12) { bOn = i; bP = k(t, B[0], B[1]); }
    var a = eo(k(t, B[1] - 0.04, B[1] + 0.3 * m));
    arcs[i].style.strokeDashoffset = (1 - a).toFixed(4);
    if (a > 0 && a < 1) glow = Math.max(glow, 7);
    if (a >= 0.5) done++;
  });
  cnt.textContent = (seam && X >= 0.5 ? 0 : done) + ' of 5'; cnt.style.opacity = seam ? (X < 0.5 ? OUT : IN) : 1;
  glow = Math.max(glow, 12 * sm(k(t, 2.95, 3.1)) * (1 - sm(k(t, 3.2, 3.8))));
  if (t >= 3.8) glow = Math.max(glow, 3 + 4 * (0.5 - 0.5 * Math.cos((t - 3.8) * 4.2)));   /* locked: the ring breathes */
  arcG.style.setProperty('--glow', glow.toFixed(1) + 'px');
  /* the beam: the line draws behind the travelling dot, then fades once the dot has landed */
  if (G && bOn >= 0) {
    var L = G.L[bOn], e = eo(bP), pt;
    bl.setAttribute('d', G.paths[bOn]);
    bl.style.strokeDasharray = L + ' ' + L; bl.style.strokeDashoffset = (L * (1 - e)).toFixed(1);
    bl.style.opacity = 1 - k(t, beamT(bOn)[1], beamT(bOn)[1] + 0.12);
    pt = bl.getPointAtLength(L * e); dot.setAttribute('cx', pt.x.toFixed(1)); dot.setAttribute('cy', pt.y.toFixed(1));
    dot.style.opacity = bP < 1 ? 1 : 0; beam.style.opacity = 1;
  } else beam.style.opacity = 0;
  /* the lock: the shackle drops, the stamp lands (from 1.25x, tilting to -3deg) and flashes teal once */
  var locked = t >= 3.15 && !(seam && X >= 0.5);
  seal.style.opacity = seam ? (X < 0.5 ? OUT : IN) : 1;
  seal.classList.toggle('open', !locked);
  seal.style.setProperty('--sh', (-5 * (1 - sm(k(t, 3.15, 3.3)))).toFixed(2) + 'px');
  var land = eo(k(t, 3.15, 3.5));
  seal.style.transform = locked ? 'rotate(' + (-3 * land).toFixed(2) + 'deg) scale(' + (1.25 - 0.25 * land).toFixed(4) + ')' : 'none';
  seal.style.setProperty('--fl', (locked ? 0.35 * (1 - k(t, 3.2, 3.8)) : 0).toFixed(3));
  scene.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 3.5, 4.2)) * (1 - sm(k(t, 4.4, 5.1)))) + ')';
}
var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { scene.style.transform = 'none'; render(END); layout(); render(t); }
window.__seek_s7 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
if (!RM) {
  refresh();
  var lastW = 0;   /* also fires when the section is revealed (width 0 -> real width) */
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (stage.clientWidth !== lastW) { lastW = stage.clientWidth; refresh(); } }).observe(stage);
  else addEventListener('resize', refresh);
  if (document.fonts) document.fonts.ready.then(refresh);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      inView = e.isIntersecting && stage.offsetParent !== null;
      if (inView && !G) refresh();
      if (inView) go(); else stop();
    });
  }, { threshold: 0.3 }).observe(stage);
  AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
}
