/* S4 v6: the Sprint builds in 3D. Every state is a pure function of t (render(t), t in [0, D)); seek with window.__seek_s4(t).
   Loop: finished structure -> drains to its blueprint -> 15 sessions land floor by floor, each Friday lands its outcome
   (Fri 30: enquiries caught, Fri 6: 100 out, Fri 13: Demo day flag) -> the floors breathe apart and settle -> finished again
   (t = D is the same frame as t = 0, so the loop has no seam). Starts in view; reduced motion = the finished frame, still. */
var st = document.getElementById('s4-stage');
if (!st) return;
var RM = window.AIML && AIML.REDUCE, D = 14.6, NS = 'http://www.w3.org/2000/svg';
var cam = document.getElementById('s4-cam'), fx = document.getElementById('s4-fx'), nEl = document.getElementById('s4-n');
var boxes = [].slice.call(cam.querySelectorAll('.s4-box'));
var wks = [].slice.call(cam.querySelectorAll('.s4-wk')), ancs = [].slice.call(cam.querySelectorAll('.s4-anc'));
var out = document.getElementById('s4-out'), flag = document.getElementById('s4-flag');
var pole = flag.querySelector('.s4-pole'), pen = flag.querySelector('.s4-pen');
var rows = [].slice.call(st.querySelectorAll('.s4-weeks p'));

/* blueprint: a dashed ghost of every block, so the build fills a visible plan */
var ghosts = boxes.map(function (b) { var g = b.cloneNode(true); g.classList.add('s4-gh'); g.classList.remove('s4-fri'); cam.insertBefore(g, boxes[0]); return g; });

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function eo(x) { return 1 - Math.pow(1 - x, 3); }
function rnd(i) { var s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); }   /* seeded, deterministic */

/* timeline */
var W = [1.0, 4.4, 7.8], STEP = 0.34, FALL = 0.42;
function land(i) { return W[(i / 5) | 0] + (i % 5) * STEP + FALL; }
var FRI = [land(4), land(9), land(14)];

/* fx: three leader lines, the 100-out stream, the enquiries that get caught */
var leads = [0, 1, 2].map(function () { var p = document.createElementNS(NS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#3FE0D6'); p.setAttribute('stroke-width', '1.5'); fx.appendChild(p); return p; });
function dots(n, cls) { var a = []; for (var i = 0; i < n; i++) { var r = document.createElementNS(NS, 'rect'); r.setAttribute('class', cls); fx.appendChild(r); a.push(r); } return a; }
var pulse = document.createElementNS(NS, 'circle'); pulse.setAttribute('r', 3.5); pulse.setAttribute('fill', '#3FE0D6'); pulse.style.filter = 'drop-shadow(0 0 6px #3FE0D6)'; fx.appendChild(pulse);
var mail = dots(30, 'm'), inq = dots(7, 'q');
mail.forEach(function (r) { r.setAttribute('width', 11); r.setAttribute('height', 8); r.setAttribute('rx', 1.5); r.setAttribute('fill', '#0B2224'); r.setAttribute('stroke', '#3FE0D6'); r.setAttribute('stroke-width', 1.2); });
inq.forEach(function (r) { r.setAttribute('width', 10); r.setAttribute('height', 7); r.setAttribute('rx', 1.5); r.setAttribute('fill', '#3FE0D6'); });

var S = null;   /* stage rect, refreshed per render */
function ctr(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - S.left, y: r.top + r.height / 2 - S.top, r: r }; }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

function render(t) {
  t = ((t % D) + D) % D;
  if (!st.offsetWidth) return;
  S = st.getBoundingClientRect();
  var drain = sm(k(t, 0.5, 1.0)), fin = t < 1.0 ? 1 - drain : 0;          /* fin: the finished frame showing (seam) */
  var br = sm(k(t, 11.8, 12.5)) * (1 - sm(k(t, 12.9, 13.6)));             /* exploded-layer breath */
  var bh = boxes[0].firstChild.offsetHeight;
  var y0 = parseFloat(getComputedStyle(cam).getPropertyValue('--y0')) || 26;
  var yaw = y0 + 3 * Math.sin(2 * Math.PI * t / D) - 10 * Math.pow(Math.sin(Math.PI * k(t, 11.8, 13.6)), 2);
  cam.style.setProperty('--y', yaw.toFixed(3));
  var lf = [0, 1, 2].map(function (f) { return (br * f * 0.55 * bh).toFixed(2) + 'px'; });

  /* blocks: fall from above (fast start, slowing landing), flash teal-hi on landing; Fridays stay lit */
  var count = 0;
  boxes.forEach(function (b, i) {
    var f = (i / 5) | 0, d = i % 5, L = land(i), fri = d === 4;
    var q = k(t, L - FALL, L), o, dy, hot;
    if (t < 1.0) { o = 1 - drain; dy = 0; hot = fri ? 0.3 * (1 - drain) : 0; }
    else {
      o = sm(k(t, L - FALL, L - FALL + 0.14)); dy = (1 - eo(q)) * 1.7 * bh;
      var flash = t >= L ? 1 - sm(k(t, L, L + (fri ? 1.1 : 0.45))) : 0;
      var nowF = fri && t >= L && t < (f < 2 ? W[f + 1] : 11.8);   /* the newest Friday breathes while its outcome is read */
      hot = Math.max(flash, fri && t >= L ? 0.3 + (nowF ? 0.12 * (1 - Math.cos(2 * Math.PI * (t - L) / 0.9)) : 0) : 0);
      if (t >= L) count++;
      if (t > 13.4) hot = Math.max(hot, 0.55 * Math.sin(Math.PI * k(t, 13.4 + (d + f) * 0.08, 13.8 + (d + f) * 0.08)));   /* end light pass */
    }
    b.style.setProperty('--o', o.toFixed(3)); b.style.setProperty('--dy', dy.toFixed(2) + 'px'); b.style.setProperty('--hot', hot.toFixed(3)); b.style.setProperty('--lf', lf[f]);
    b.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
    b.classList.toggle('dk', hot > 0.62);
    var g = ghosts[i]; g.style.setProperty('--lf', lf[f]); g.style.setProperty('--o', (dy >= 1 ? 1 : 1 - o).toFixed(3));
  });
  if (t < 1.0) count = t < 0.75 ? 15 : 0;
  nEl.textContent = (count < 10 ? '0' : '') + count;
  wks.forEach(function (w, f) { w.style.setProperty('--lf', lf[f]); });
  ancs.forEach(function (a, f) { a.style.setProperty('--lf', lf[f]); });
  out.style.setProperty('--lf', lf[1]); flag.style.setProperty('--lf', lf[2]);

  /* 100 out tag on Fri 6, Demo day flag on Fri 13 */
  var oo = t < 1.0 ? 1 - drain : sm(k(t, FRI[1] + 0.05, FRI[1] + 0.25));
  show(out, oo);
  if (out.offsetParent !== null) { var an = ctr(ancs[1]); out.style.transform = 'translate(' + (an.x + 2).toFixed(1) + 'px,' + (an.y - out.offsetHeight / 2).toFixed(1) + 'px)'; }   /* 2D tag pinned to Fri 6 (floor 2) */
  var fo = t < 1.0 ? 1 - drain : sm(k(t, 10.9, 11.0));
  show(flag, fo);
  var up = t < 1.0 ? 1 : sm(k(t, 10.9, 11.25)), un = t < 1.0 ? 1 : sm(k(t, 11.15, 11.55));
  pole.style.transform = 'scaleY(' + up.toFixed(3) + ')';
  pen.style.transform = 'scaleX(' + un.toFixed(3) + ') skewY(' + (1.6 * Math.sin(2 * Math.PI * 11 * t / D)).toFixed(2) + 'deg)';
  pen.style.opacity = un > 0.02 ? 1 : 0;

  /* directory: a row lights when its Friday lands; the newest one carries the dot */
  var lit = t < 1.0 ? (t < 0.75 ? 3 : 0) : FRI.filter(function (x) { return t >= x + 0.05; }).length;
  rows.forEach(function (r, f) { r.classList.toggle('on', f < lit); r.classList.toggle('now', t >= 1.0 && f === lit - 1 && t < 11.8); });

  /* leader lines (desktop, directory beside the structure) */
  var side = getComputedStyle(rows[0].parentNode).position === 'absolute', pulseOn = 0;
  leads.forEach(function (p, f) {
    var on = side && (t < 1.0 ? 1 - drain : (t >= FRI[f] ? 1 : 0));
    if (!on) { p.style.opacity = 0; return; }
    var a = f === 1 ? (function () { var r = out.getBoundingClientRect(); return { x: r.right - S.left + 4, y: r.top + r.height / 2 - S.top }; })() : ctr(ancs[f]);
    var rr = rows[f].firstChild.getBoundingClientRect(), ex = rr.left - S.left - 14, ey = rr.top + rr.height / 2 - S.top, mx = (a.x + ex) / 2;
    p.setAttribute('d', 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'C' + mx.toFixed(1) + ' ' + a.y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + ey.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1));
    var L = p.getTotalLength(), dr = t < 1.0 ? 1 : sm(k(t, FRI[f], FRI[f] + 0.4));
    p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = (L * (1 - dr)).toFixed(1);
    var cur = f === lit - 1 && t >= 1.0 && t < 11.8;
    p.style.opacity = (on * (cur ? 1 : 0.45)).toFixed(3);
    if (cur) { var ph = ((t - FRI[f] - 0.4) / 0.9) % 1; if (t > FRI[f] + 0.4) { var q2 = p.getPointAtLength(L * sm(ph)); pulse.setAttribute('cx', q2.x.toFixed(1)); pulse.setAttribute('cy', q2.y.toFixed(1)); pulseOn = Math.sin(Math.PI * ph); } }
  });
  pulse.style.opacity = pulseOn.toFixed(3);

  /* Fri 30: enquiries fly in from the left edge and drop into the Friday block: every enquiry gets caught */
  var top = ctr(boxes[4].children[1]), SH = st.querySelector('.s4-scene').offsetHeight;
  inq.forEach(function (r, j) {
    var s0 = FRI[0] + 0.05 + j * 0.11, q = k(t, s0, s0 + 0.75), e = sm(q);
    var x0 = 6 + rnd(j) * 24, y0 = SH * (0.3 + rnd(j + 5) * 0.3), cx = (x0 + top.x) / 2, cy = Math.min(y0, top.y) - 60 - rnd(j + 9) * 40;
    var x = (1 - e) * (1 - e) * x0 + 2 * (1 - e) * e * cx + e * e * top.x, y = (1 - e) * (1 - e) * y0 + 2 * (1 - e) * e * cy + e * e * top.y;
    r.setAttribute('x', (x - 5).toFixed(1)); r.setAttribute('y', (y - 3.5).toFixed(1)); r.style.opacity = q > 0 && q < 1 ? (q > 0.85 ? (1 - q) / 0.15 : 1).toFixed(2) : 0;
  });
  /* Fri 6: a stream too dense to count leaves the block and runs to its outcome row ("your first 100 messages go out") */
  var src = ctr(boxes[9].children[2]), lp = leads[1], LL = side && t >= FRI[1] ? lp.getTotalLength() : 0;
  mail.forEach(function (r, j) {
    var s0 = FRI[1] + 0.1 + j * 0.035, q = k(t, s0, s0 + 0.9), e = eo(q), jx = (rnd(j + 3) - 0.5) * 14, jy = (rnd(j + 7) - 0.5) * 14, x, y;
    if (LL) { var pt = lp.getPointAtLength(LL * e * 0.94); x = pt.x + jx * (1 - e * 0.5); y = pt.y + jy * (1 - e * 0.5); }
    else { /* stacked layout: the stream leaves out of the top of the stage */ var ex = src.x - 10 + rnd(j + 3) * 36, cx = src.x + 14, cy = src.y - 40; x = (1 - e) * (1 - e) * src.x + 2 * (1 - e) * e * cx + e * e * ex; y = (1 - e) * (1 - e) * src.y + 2 * (1 - e) * e * cy + e * e * -20; }
    r.setAttribute('x', (x - 5.5).toFixed(1)); r.setAttribute('y', (y - 4).toFixed(1)); r.style.opacity = q > 0 && q < 1 ? (q > 0.8 ? (1 - q) / 0.2 : 1).toFixed(2) : 0;
  });
}

/* clock: rAF only drives t; every pixel comes from render(t) */
var T0 = 0, tPaused = 0, running = false, paused = false, seekT = null, inView = false, raf = 0;
function now() { return running ? (performance.now() - T0) / 1000 : tPaused; }
function loop() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(loop) : 0; }
function play() { if (running || RM || paused) return; running = true; T0 = performance.now() - tPaused * 1000; raf = requestAnimationFrame(loop); }
function stop() { if (!running) return; tPaused = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s4 = function (t) { seekT = t; stop(); render(t); };
function redraw() { render(seekT !== null ? seekT : RM ? 0.2 : now()); }
render(RM ? 0.2 : 0);
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(st); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if (RM) return;
if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(st, { pause: function () { paused = true; stop(); }, play: function () { paused = false; if (inView) play(); } });
if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
  es.forEach(function (e) { inView = e.isIntersecting && st.offsetParent !== null; if (inView && seekT === null) { redraw(); play(); } else stop(); });
}, { threshold: 0.25 }).observe(st);
else play();
