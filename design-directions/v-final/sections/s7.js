/* S7: deterministic render(t), t in [0,7). Seek with window.__seek_s7(t). Reduced motion / no JS = the finished frame.
   Row 1 ticks at full speed, rows 2-5 cascade; every tick sends a pulse along a beam (Magic UI animated-beam, ported)
   into one segment of the 90-day dial. At 5 of 5 the seal locks (shackle drops, seal fills, a ring stamps out), then a
   border beam circles it. The loop resets by a ghost crossfade; the seal fades out before the unlocked one fades in,
   so no frame shows a lock opening. */
var stage = document.getElementById('s7-stage'), scene = document.getElementById('s7-scene');
if (!stage || !scene) return;
var D = 7, RM = AIML.REDUCE, END = 4.6, NS = 'http://www.w3.org/2000/svg';
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var rows = [].slice.call(scene.querySelectorAll('.s7-rows li')), seal = scene.querySelector('.s7-seal'), cnt = scene.querySelector('.s7-cnt');
var dial = scene.querySelector('.s7-dial'), arcG = scene.querySelector('.s7-arc'), trk = scene.querySelector('.s7-trk');
var beam = scene.querySelector('.s7-beam'), bp = scene.querySelector('.s7-bp'), bl = scene.querySelector('.s7-bl');
/* five segments, 4 degree gaps, clockwise from 12 o'clock (the svg is rotated -90deg) */
function seg(i) {
  var r = 86, a0 = (i * 72 + 2) * Math.PI / 180, a1 = ((i + 1) * 72 - 2) * Math.PI / 180;
  return 'M' + (100 + r * Math.cos(a0)).toFixed(2) + ' ' + (100 + r * Math.sin(a0)).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + (100 + r * Math.cos(a1)).toFixed(2) + ' ' + (100 + r * Math.sin(a1)).toFixed(2);
}
var arcs = [];
for (var i = 0; i < 5; i++) {
  var p0 = document.createElementNS(NS, 'path'); p0.setAttribute('d', seg(i)); trk.appendChild(p0);
  var p1 = document.createElementNS(NS, 'path'); p1.setAttribute('d', seg(i)); p1.setAttribute('pathLength', '1'); arcG.appendChild(p1); arcs.push(p1);
}
/* row i: start time and pace (row 1 full pace, rows 2-5 a faster cascade) */
function st(i) { return i === 0 ? 0.4 : 1.35 + (i - 1) * 0.42; }
function pace(i) { return i === 0 ? 1 : 0.7; }

var G = null, ghost = null, gSeal = null;
function layout() {
  if (!stage.clientWidth) return false;
  stage.classList.add('s7-live');
  var sr = scene.getBoundingClientRect(), dr = dial.getBoundingClientRect(), sc = sr.width / scene.offsetWidth || 1;
  var g = { paths: [], L: [] }, x1 = (dr.left - sr.left) / sc - 2, y1 = (dr.top + dr.height / 2 - sr.top) / sc;
  beam.setAttribute('viewBox', '0 0 ' + scene.offsetWidth + ' ' + scene.offsetHeight);
  rows.forEach(function (li) {
    var d = li.querySelector('.s7-done').getBoundingClientRect(), x0 = (d.right - sr.left) / sc + 8, y0 = (d.top + d.height / 2 - sr.top) / sc, dx = Math.max(24, (x1 - x0) * 0.6);
    g.paths.push('M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + (x0 + dx).toFixed(1) + ' ' + y0.toFixed(1) + ' ' + (x1 - dx).toFixed(1) + ' ' + y1.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1));
  });
  g.paths.forEach(function (d) { bl.setAttribute('d', d); g.L.push(bl.getTotalLength()); });
  G = g; return true;
}

function render(t) {
  t = ((t % D) + D) % D; var raw = t;
  var X = sm(k(t, 6.2, 7)); if (ghost) ghost.style.opacity = X; scene.style.opacity = 1 - X;
  if (gSeal) gSeal.style.opacity = sm(k(t, 6.7, 7));
  if (t >= 6.2) t = 6.2;
  var done = 0, glow = 0, beamOn = -1, beamP = 0;
  rows.forEach(function (li, i) {
    var s = st(i), m = pace(i);
    li.style.setProperty('--f', eo(k(t, s, s + 0.2 * m)).toFixed(3));
    li.style.setProperty('--s', eo(k(t, s + 0.05 * m, s + 0.3 * m)).toFixed(3));
    li.style.setProperty('--c', eo(k(t, s + 0.1 * m, s + 0.35 * m)).toFixed(3));
    li.style.setProperty('--d', eo(k(t, s + 0.2 * m, s + 0.45 * m)).toFixed(3));
    li.style.setProperty('--a', (sm(k(t, s - 0.05, s + 0.1)) * (1 - sm(k(t, s + 0.5 * m, s + 0.8 * m)))).toFixed(3));
    var b0 = s + 0.3 * m, b1 = b0 + 0.4 * m, a = eo(k(t, b1 - 0.1 * m, b1 + 0.25 * m));
    if (t >= b0 && t < b1 + 0.05) { beamOn = i; beamP = k(t, b0, b1); }
    arcs[i].style.strokeDashoffset = (1 - a).toFixed(4);
    if (a > 0 && a < 1) glow = Math.max(glow, 6);
    if (a >= 0.5) done++;
  });
  cnt.textContent = done + ' of 5';
  /* dial completes: one bright flash */
  glow = Math.max(glow, 12 * sm(k(t, 3.0, 3.15)) * (1 - sm(k(t, 3.3, 3.9))));
  arcG.style.setProperty('--glow', glow.toFixed(1) + 'px');
  /* the beam: a faint guide plus a travelling pulse, only while a pulse is in flight */
  if (G && beamOn >= 0) {
    var L = G.L[beamOn], dl = Math.min(60, L * 0.35);
    bp.setAttribute('d', G.paths[beamOn]); bl.setAttribute('d', G.paths[beamOn]);
    bl.style.strokeDasharray = dl + ' ' + (L + dl); bl.style.strokeDashoffset = (dl - eo(beamP) * (L + dl)).toFixed(1);
    beam.style.opacity = Math.min(1, beamP * 8, (1 - beamP) * 8 + 0.25);
  } else beam.style.opacity = 0;
  /* the lock */
  var locked = t >= 3.45;
  seal.classList.toggle('open', !locked);
  seal.style.setProperty('--sh', (-4 * (1 - sm(k(t, 3.3, 3.45)))).toFixed(2) + 'px');
  seal.style.transform = 'scale(' + (locked ? 1 + 0.07 * (1 - eo(k(t, 3.45, 3.8))) : 1) + ')';
  seal.style.setProperty('--ro', (0.7 * (1 - k(t, 3.5, 4.2)) * (t >= 3.5 ? 1 : 0)).toFixed(3));
  seal.style.setProperty('--rs', (1 + 0.4 * eo(k(t, 3.5, 4.2))).toFixed(3));
  seal.style.setProperty('--bo', (sm(k(t, 3.95, 4.25)) * (1 - sm(k(t, 5.9, 6.2)))).toFixed(3));
  seal.style.setProperty('--ba', ((t - 3.95) * 220).toFixed(1) + 'deg');
  seal.style.opacity = 1 - sm(k(raw, 6.2, 6.45));
  scene.style.transform = 'scale(' + (1 + 0.02 * sm(k(t, 3.9, 5.0)) * (1 - sm(k(t, 5.3, 6.1)))) + ')';   /* the push is back to 1 before the seam, so the crossfade never doubles text */
}
function snap() {
  if (ghost) ghost.remove(); ghost = gSeal = null;
  render(0); scene.style.opacity = 1;
  var gh = scene.cloneNode(true); gh.removeAttribute('id');
  [].forEach.call(gh.querySelectorAll('[id],[role]'), function (e) { e.removeAttribute('id'); e.removeAttribute('role'); e.removeAttribute('aria-label'); });
  gh.setAttribute('aria-hidden', 'true'); gh.style.cssText += ';position:absolute;left:0;top:0;width:100%;opacity:0;pointer-events:none';
  stage.appendChild(gh); ghost = gh; gSeal = gh.querySelector('.s7-seal');
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { if (RM) return; scene.style.transform = 'none'; render(END); var ok = layout(); if (ok) snap(); render(t); }
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
