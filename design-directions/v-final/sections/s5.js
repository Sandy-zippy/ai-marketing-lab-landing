/* S5 v6: persistent rails. The 1:1 call marker runs Upstream (weeks 1 to 4), drops to Downstream (weeks 5 to 8), and each
   station it reaches gets installed (--k), cause -> effect. Every state is a pure function of t; seek with window.__seek_s5(t).
   The loop ends by crossfading the installed frame back to frame 0 (no rewind). Reduced motion = everything installed, still. */
var st = document.getElementById('s5-stage');
if (!st) return;
var RM = window.AIML && AIML.REDUCE, D = 9.9;
var svg = document.getElementById('s5-rails'), r0 = svg.querySelector('.r0'), r1 = svg.querySelector('.r1'), r2 = svg.querySelector('.r2'), rm = svg.querySelector('.rm'), mk = document.getElementById('s5-mk');
var wks = [].slice.call(st.querySelectorAll('.s5-wk')), nds = wks.map(function (w) { return w.querySelector('.s5-nd'); });
var heads = [].slice.call(st.querySelectorAll('.s5-gh'));
var seats = st.querySelector('.s5-seats');

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

/* arrivals at the 8 stations; the marker dwells 0.45 s, then leaves (fast start, slowing arrival) */
var A = [0.9, 1.9, 2.9, 3.9, 5.15, 6.15, 7.15, 8.15], DW = 0.45, START = 0.35, END = 8.95, X0 = 9.2;

var G = null;   /* layout: path + the arc length at each station */
function layout() {
  var S = st.getBoundingClientRect(); if (!S.width) return false;
  var P = nds.map(function (n) { var r = n.getBoundingClientRect(); return { x: r.left + r.width / 2 - S.left, y: r.top + r.height / 2 - S.top }; });
  var vert = Math.abs(P[1].x - P[0].x) < 4, d = 22, segs = [];
  var s0 = vert ? { x: P[0].x, y: P[0].y - d } : { x: P[0].x - d, y: P[0].y }, e = vert ? { x: P[7].x, y: P[7].y + d } : { x: P[7].x + d, y: P[7].y };
  function f(p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
  segs.push('M' + f(s0) + 'L' + f(P[0]));
  for (var i = 1; i < 8; i++) {
    var a = P[i - 1], b = P[i];
    /* the drop: desktop runs on along the upstream line into the gutter before week 5, falls, and turns into the downstream line */
    if (i === 4 && !vert) { var xm = b.x - 28, r = 14;
      segs.push('L' + f({ x: xm - r, y: a.y }) + 'Q' + f({ x: xm, y: a.y }) + ' ' + f({ x: xm, y: a.y + r }) + 'L' + f({ x: xm, y: b.y - r }) + 'Q' + f({ x: xm, y: b.y }) + ' ' + f({ x: xm + r, y: b.y }) + 'L' + f(b)); }
    else segs.push('L' + f(b));
  }
  segs.push('L' + f(e));
  var dd = segs.join(''); [r0, r1, r2, rm].forEach(function (p) { p.setAttribute('d', dd); });
  /* arc length at each station: measure the path up to it */
  var tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path'); svg.appendChild(tmp);
  var L = [];
  for (var j = 0; j <= 8; j++) { tmp.setAttribute('d', segs.slice(0, j + 1).join('')); L.push(tmp.getTotalLength()); }
  svg.removeChild(tmp);
  G = { len: r0.getTotalLength(), at: L.slice(0, 8) };   /* L[j] = arc length at station j */
  return true;
}

function render(t) {
  t = ((t % D) + D) % D;
  if (!G && !layout()) return;
  var X = sm(k(t, X0, D));          /* crossfade: installed frame out, frame 0 in */
  /* marker arc position */
  var s;
  if (t < A[0]) s = G.at[0] * sm(k(t, START, A[0]));
  else if (t >= A[7] + DW) s = G.at[7] + (G.len - G.at[7]) * sm(k(t, A[7] + DW, END));
  else { for (var i = 0; i < 8; i++) if (t < A[i] + DW || i === 7) break;
    s = t < A[i] ? G.at[i] : (i < 7 ? G.at[i] + (G.at[i + 1] - G.at[i]) * sm(k(t, A[i] + DW, A[i + 1])) : G.at[7]); }
  if (t >= X0) s = 0;
  var pt = r0.getPointAtLength(Math.max(0, Math.min(G.len, s)));
  mk.style.transform = 'translate(' + (pt.x - mk.offsetWidth / 2).toFixed(1) + 'px,' + (pt.y - mk.offsetHeight / 2).toFixed(1) + 'px)';
  mk.style.opacity = t >= X0 ? X : (1 - sm(k(t, END - 0.2, END + 0.15))).toFixed(3);
  /* the rail behind the marker fills teal */
  var fill = t >= X0 ? G.len * 1 : s;
  r1.style.strokeDasharray = G.len + ' ' + G.len; r1.style.strokeDashoffset = (G.len - fill).toFixed(1);
  r1.style.opacity = t >= X0 ? (1 - X).toFixed(3) : 1;
  /* light flows along the installed rail (masked to the teal part): the systems are running */
  rm.style.strokeDasharray = r1.style.strokeDasharray; rm.style.strokeDashoffset = r1.style.strokeDashoffset;
  r2.style.strokeDashoffset = (-(t / D) * 18 * 22).toFixed(1); r2.style.opacity = r1.style.opacity;
  /* stations install as the marker lands on them */
  wks.forEach(function (w, i) {
    var kk = sm(k(t, A[i] + 0.05, A[i] + 0.4)), rr = k(t, A[i] + 0.05, A[i] + 0.65);
    if (t >= X0) kk = 1 - X;
    w.style.setProperty('--k', kk.toFixed(3)); w.style.setProperty('--r', (rr > 0 && rr < 1 && t < X0 ? Math.sin(Math.PI * rr) : 0).toFixed(3));
  });
  heads[0].style.setProperty('--k', (t >= X0 ? 1 - X : sm(k(t, A[3] + DW, A[3] + DW + 0.3))).toFixed(3));
  heads[1].style.setProperty('--k', (t >= X0 ? 1 - X : sm(k(t, A[7] + 0.5, A[7] + 0.8))).toFixed(3));
}

/* clock: rAF only advances t; pixels come from render(t) */
var T0 = 0, tP = 9.0, running = false, paused = false, seekT = null, inView = false, raf = 0;
function now() { return running ? (performance.now() - T0) / 1000 : tP; }
function loop() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(loop) : 0; }
function play() { if (running || RM || paused) return; running = true; T0 = performance.now() - tP * 1000; raf = requestAnimationFrame(loop); }
function stop() { if (!running) return; tP = now(); running = false; cancelAnimationFrame(raf); }
var FIN = 9.0;   /* the installed frame (reduced motion, before the first play) */
window.__seek_s5 = function (t) { seekT = t; stop(); G = null; render(t); };
function redraw() { G = null; render(seekT !== null ? seekT : RM ? FIN : now()); }   /* the clock starts at FIN: first play crossfades into frame 0 */
redraw();
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(st); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if (RM || !('IntersectionObserver' in window)) return;
AIML.pauseBtn(st, { pause: function () { paused = true; stop(); }, play: function () { paused = false; if (inView) play(); } });
new IntersectionObserver(function (es) {
  es.forEach(function (e) { inView = e.isIntersecting && st.offsetParent !== null; if (inView && seekT === null) { G = null; play(); } else stop(); });
}, { threshold: 0.3 }).observe(st);
/* the ten seats draw once, when the seats themselves are in view */
if (seats) {
  var sr = seats.getBoundingClientRect();
  if (!(sr.height && sr.top < innerHeight)) {
    seats.classList.add('armed');
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) { if (e.isIntersecting && seats.offsetParent !== null) { io.disconnect(); seats.classList.add('draw'); } });
    }, { threshold: 0.6 }).observe(seats);
  }
}
