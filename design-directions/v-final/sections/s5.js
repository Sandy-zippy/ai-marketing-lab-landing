/* S5 v6: persistent rails. The 1:1 call marker runs Upstream (weeks 1 to 4), steps down to Downstream (weeks 5 to 8), and each
   station it reaches gets installed (--k), cause -> effect. The marker never parks: it eases into each station and straight out,
   so the install shows the moment it leaves. Every state is a pure function of t; seek with window.__seek_s5(t). The loop ends
   by crossfading the installed frame back to frame 0 (no rewind). Reduced motion = everything installed, still. */
var st = document.getElementById('s5-stage');
if (!st) return;
var RM = window.AIML && AIML.REDUCE, D = 8.9, NS = 'http://www.w3.org/2000/svg';
var svg = document.getElementById('s5-rails'), mk = document.getElementById('s5-mk');
var r0 = svg.querySelector('.r0'), r1 = svg.querySelector('.r1'), r2 = svg.querySelector('.r2'), rm = svg.querySelector('.rm');
var wks = [].slice.call(st.querySelectorAll('.s5-wk')), nds = wks.map(function (w) { return w.querySelector('.s5-nd'); });
var heads = [].slice.call(st.querySelectorAll('.s5-gh'));
var seats = document.querySelector('#s5 .s5-seats');

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

/* timeline: TT[j] = when the marker reaches waypoint j (0 = rail start, 1..8 = stations, 9 = rail end) */
var TT = [0.15, 0.85, 1.75, 2.65, 3.55, 4.65, 5.55, 6.45, 7.35, 7.95], X0 = 8.2;
function A(i) { return TT[i + 1]; }

var G = null;
function layout() {
  var S = st.getBoundingClientRect(); if (!S.width) return false;
  var P = nds.map(function (n) { var r = n.getBoundingClientRect(); return { x: r.left + r.width / 2 - S.left, y: r.top + r.height / 2 - S.top }; });
  var vert = Math.abs(P[1].x - P[0].x) < 4, d = 10, r = 14, segs = [];
  function f(p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
  var s0 = vert ? { x: P[0].x, y: P[0].y - d } : { x: P[0].x - d, y: P[0].y }, e = vert ? { x: P[7].x, y: P[7].y + d } : { x: P[7].x + d, y: P[7].y };
  segs.push('M' + f(s0) + 'L' + f(P[0]));
  for (var i = 1; i < 8; i++) {
    var a = P[i - 1], b = P[i];
    if (i !== 4) { segs.push('L' + f(b)); continue; }
    /* the step down from Upstream to Downstream, drawn with rounded corners */
    if (vert) { var ym = b.y - 22;
      segs.push('L' + f({ x: a.x, y: ym - r }) + 'Q' + f({ x: a.x, y: ym }) + ' ' + f({ x: a.x + r, y: ym }) + 'L' + f({ x: b.x - r, y: ym }) + 'Q' + f({ x: b.x, y: ym }) + ' ' + f({ x: b.x, y: ym + r }) + 'L' + f(b)); }
    else { var xm = b.x - 14 - 16 - 32;   /* the middle of the 64 px gutter column (node centre - half node - column gap - half gutter) */
      segs.push('L' + f({ x: xm - r, y: a.y }) + 'Q' + f({ x: xm, y: a.y }) + ' ' + f({ x: xm, y: a.y + r }) + 'L' + f({ x: xm, y: b.y - r }) + 'Q' + f({ x: xm, y: b.y }) + ' ' + f({ x: xm + r, y: b.y }) + 'L' + f(b)); }
  }
  segs.push('L' + f(e));
  var dd = segs.join(''); [r0, r1, r2, rm].forEach(function (p) { p.setAttribute('d', dd); });
  var tmp = document.createElementNS(NS, 'path'); svg.appendChild(tmp);
  var W = [0];
  for (var j = 0; j < 8; j++) { tmp.setAttribute('d', segs.slice(0, j + 1).join('')); W.push(tmp.getTotalLength()); }   /* W[j+1] = arc length at station j */
  svg.removeChild(tmp);
  var len = r0.getTotalLength(); W.push(len);
  G = { len: len, W: W };
  return true;
}

function render(t) {
  t = ((t % D) + D) % D;
  if (!G && !layout()) return;
  var X = sm(k(t, X0, D));                       /* crossfade: installed frame out, frame 0 in */
  var s = 0;
  if (t >= TT[9]) s = G.len; else if (t > TT[0]) { for (var j = 0; j < 9; j++) if (t < TT[j + 1]) break; var q = k(t, TT[j], TT[j + 1]); q = j === 0 ? q * q * (3 - 2 * q) : q; s = G.W[j] + (G.W[j + 1] - G.W[j]) * q; }   /* passes through the stations without parking: the tick lands in its wake */
  var start = t >= X0;                           /* during the crossfade the marker waits at the start, fading in */
  var pt = r0.getPointAtLength(start ? 0 : Math.max(0, Math.min(G.len, s)));
  var mo = start ? sm(k(t, D - 0.3, D)) : 1 - sm(k(t, TT[9] - 0.2, TT[9]));
  mk.style.transform = 'translate(' + (pt.x - mk.offsetWidth / 2).toFixed(1) + 'px,' + (pt.y - mk.offsetHeight / 2).toFixed(1) + 'px)';
  mk.style.opacity = mo.toFixed(3); mk.style.visibility = mo < 0.01 ? 'hidden' : 'visible';
  /* the rail behind the marker fills teal and carries flowing light */
  var fill = start ? G.len : s;
  r1.style.strokeDasharray = G.len + ' ' + G.len; r1.style.strokeDashoffset = (G.len - fill).toFixed(1);
  rm.style.strokeDasharray = r1.style.strokeDasharray; rm.style.strokeDashoffset = r1.style.strokeDashoffset;
  r1.style.opacity = r2.style.opacity = start ? (1 - X).toFixed(3) : 1;
  r2.style.strokeDashoffset = (-(t / D) * 16 * 22).toFixed(1);
  /* stations install as the marker reaches them */
  wks.forEach(function (w, i) {
    var kk = start ? 1 - X : sm(k(t, A(i), A(i) + 0.35)), rr = k(t, A(i), A(i) + 0.7);
    w.style.setProperty('--k', kk.toFixed(3)); w.style.setProperty('--r', (!start && rr > 0 && rr < 1 ? Math.sin(Math.PI * rr) : 0).toFixed(3));
  });
  heads[0].style.setProperty('--k', (start ? 1 - X : sm(k(t, A(3) + 0.35, A(3) + 0.65))).toFixed(3));
  heads[1].style.setProperty('--k', (start ? 1 - X : sm(k(t, A(7) + 0.45, A(7) + 0.75))).toFixed(3));   /* after week 8's own tick */
}

/* clock: rAF only advances t; pixels come from render(t). It starts at FIN, so the first play crossfades into frame 0 */
var FIN = 8.15, T0 = 0, tP = FIN, running = false, paused = false, seekT = null, inView = false, raf = 0;
function now() { return running ? (performance.now() - T0) / 1000 : tP; }
function loop() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(loop) : 0; }
function play() { if (running || RM || paused) return; running = true; T0 = performance.now() - tP * 1000; raf = requestAnimationFrame(loop); }
function stop() { if (!running) return; tP = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s5 = function (t) { seekT = t; stop(); G = null; render(t); };
function redraw() { G = null; render(seekT !== null ? seekT : RM ? FIN : now()); }
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
