/* S10 v2: deterministic render(t), t in [0,6.4). Seek with window.__seek_s10(t). Reduced motion = the finished frame.
   0.15-3.3 the counter runs to 45:00 while four tangled lines straighten (staggered) onto one route; the teal route
   draws over them and the flag plants. 3.65-4.35 the stub tears: a gap opens, it drops and tilts. 4.25-5.1 a light
   runs the route; the button gets one ink halo. 5.6-6.25 the ticket body fades out and back in as one layer (all of
   it resets while invisible) and the stub slides back onto the seam. */
var tk = document.getElementById('s10-tk'), root = document.getElementById('s10');
if (!tk || !root) return;
var D = 6.4, RM = AIML.REDUCE, END = 4.6;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
var Q = function (s) { return tk.querySelector(s); };
var clock = Q('.s10-clock'), bar = Q('.s10-bar'), tang = [].slice.call(Q('.s10-tangle').children), route = Q('.s10-route'), run = Q('.s10-run');
var body = Q('.s10-lay'), penOn = Q('.s10-on'), flag = Q('.s10-flag'), stub = Q('.s10-stub'), btn = root.querySelector('.s10-cta .btn');

/* every line is "M p0 C p1 p2 p3 C p4 p5 p6 C p7 p8 p9": ten points, so each tangle can morph onto the route */
var R = [30,180, 90,180, 110,130, 160,125, 210,120, 240,95, 280,80, 310,70, 330,62, 352,60];
var T = [
  [30,180, 150,40, 40,30, 200,170, 330,250, 380,120, 230,60, 120,20, 300,190, 352,60],
  [30,180, 20,60, 250,230, 300,150, 360,60, 80,90, 120,40, 170,0, 400,140, 352,60],
  [30,180, 200,210, 330,200, 260,110, 200,30, 20,120, 90,60, 150,10, 260,20, 352,60],
  [30,180, 60,90, 380,30, 330,170, 290,260, 170,40, 180,140, 190,210, 360,120, 352,60]
];
function d(a) {
  var f = function (i) { return a[i].toFixed(1) + ' ' + a[i + 1].toFixed(1); };
  return 'M' + f(0) + 'C' + f(2) + ' ' + f(4) + ' ' + f(6) + 'C' + f(8) + ' ' + f(10) + ' ' + f(12) + 'C' + f(14) + ' ' + f(16) + ' ' + f(18);
}
route.setAttribute('d', d(R)); run.setAttribute('d', d(R));
function mix(a, p) { return a.map(function (v, i) { return v + (R[i] - v) * p; }); }
function mmss(m) { var s = Math.round(m * 60), mm = Math.floor(s / 60), ss = s % 60; return (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss; }

function render(t) {
  t = ((t % D) + D) % D;
  /* seam: the whole ticket body fades as ONE layer (5.6-5.85), counter, bar, route and tangle all reset while it is
     invisible, then it fades back in (5.9-6.25). The stub never fades: it slides back onto the seam meanwhile. */
  var lay = 1, u = t;
  if (t >= 5.6 && t < 5.88) { lay = 1 - sm(k(t, 5.6, 5.85)); u = 5.6; } else if (t >= 5.88) { lay = sm(k(t, 5.9, 6.25)); u = 0; }
  body.style.opacity = lay.toFixed(3);
  /* counter + progress (ink): close to even pace, so all 45 minutes read */
  var lin = k(u, 0.15, 3.3), p = 0.5 * lin + 0.5 * sm(lin), txt = mmss(45 * p);
  if (clock.textContent !== txt) clock.textContent = txt;
  bar.style.setProperty('--p', p.toFixed(4));
  /* the tangle straightens onto the route, staggered; grey lines fade as they merge */
  tang.forEach(function (el, i) {
    var q = eo(k(u, 0.15 + i * 0.2, 2.5 + i * 0.2));
    el.setAttribute('d', d(mix(T[i], q)));
    el.style.opacity = 1 - sm(k(u, 2.7 + i * 0.15, 3.3 + i * 0.1));
  });
  /* the teal route draws over the merging lines, then the flag plants and flutters */
  route.style.strokeDashoffset = (1 - eo(k(u, 2.3, 3.3))).toFixed(4);
  var fp = eo(k(u, 3.2, 3.55));
  penOn.style.opacity = fp.toFixed(3);
  var wave = u >= 3.55 ? Math.sin((u - 3.55) * 7) * 8 * (1 - k(u, 5.0, 5.6)) : 0;
  flag.setAttribute('transform', 'translate(352 60) scale(' + (1 + 0.18 * Math.sin(Math.PI * fp) * (fp < 1 ? 1 : 0)).toFixed(3) + ') skewY(' + wave.toFixed(2) + ')');
  /* the stub tears: a clear gap opens at the seam, it drops and tilts, its shadow deepens; it slides back at the seam */
  var tr = eo(k(t, 3.65, 4.35)) * (1 - sm(k(t, 5.6, 6.2)));
  stub.style.transform = 'translate(' + (12 * tr).toFixed(2) + 'px,' + (18 * tr).toFixed(2) + 'px) rotate(' + (4 * tr).toFixed(2) + 'deg)';
  stub.style.setProperty('--sd', tr.toFixed(3));
  /* end frame alive: a light runs the route once; one ink halo on the button */
  var rl = k(u, 4.25, 5.1);
  run.style.opacity = rl > 0 && rl < 1 ? 1 : 0; run.style.strokeDashoffset = (0.16 - rl * 1.2).toFixed(4);
  var h = k(u, 4.6, 5.3);
  btn.style.boxShadow = h > 0 && h < 1 ? '0 0 0 ' + (12 * eo(h)).toFixed(1) + 'px rgba(18,18,18,' + (0.12 * (1 - h)).toFixed(3) + ')' : '';
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
window.__seek_s10 = function (s) { seeking = true; stop(); t = s; render(s); };
render(RM ? END : 0);
if (!RM) {
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting && tk.offsetParent !== null; if (inView) go(); else stop(); });
  }, { threshold: 0.3 }).observe(tk);
  AIML.pauseBtn(tk, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
}
