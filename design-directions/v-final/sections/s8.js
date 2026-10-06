/* S8: the filter. Deterministic: every state is render(t), t in [0,9). Seek with window.__seek_s8(t).
   Frame 0 is the finished composition: both lists already sorted (the six real <li> are the chips) with the gate
   between them. Then, one at a time, each chip is pulled back through the gate: it goes neutral under the scan beam,
   the verdict stamps (tick or cross, the gate flashes teal or brick, a bounce recoils) and it returns to its slot.
   The last frame equals frame 0, so the loop is seamless.
   wide (stage >= 880): "This isn't for" | gate | "This is for".
   mid (600-879): gate on top, the two lists side by side below. narrow: gate on top, the lists stacked.
   Every layout: a chip fades out of its slot, appears in the gate, and fades back into its slot (a travel path
   would cross the gate's header or the neighbouring chip). */
var stage = document.getElementById('s8-stage'), scene = document.getElementById('s8-scene');
if (!stage || !scene) return;
var D = 9, RM = AIML.REDUCE, END = 0;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var noL = [].slice.call(stage.querySelectorAll('.s8-no li')), yesL = [].slice.call(stage.querySelectorAll('.s8-yes li'));
[].concat(noL, yesL).forEach(function (li) { li.innerHTML = '<span>' + li.innerHTML + '</span>'; });
/* gate order alternates pass / bounce; slot = DOM position in its own list */
var C = [
  { el: yesL[0], ok: 1, slot: 0 }, { el: noL[0], ok: 0, slot: 0 },
  { el: yesL[1], ok: 1, slot: 1 }, { el: noL[1], ok: 0, slot: 1 },
  { el: yesL[2], ok: 1, slot: 2 }, { el: noL[2], ok: 0, slot: 2 }
];
C.forEach(function (c, i) { var s = 0.3 + i * 1.42; c.T = [s, s + 0.35, s + 0.75, s + 1.0, s + 1.35]; });   /* leave, in gate, verdict, return, home */
var gate = scene.querySelector('.s8-gate'), scan = scene.querySelector('.s8-scan'), vd = scene.querySelector('.s8-vd');
var tagNo = stage.querySelector('.s8-no .s8-tag'), tagYes = stage.querySelector('.s8-yes .s8-tag');
var G = null;

function px(el, x, y, s, o) {
  el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (s && s !== 1 ? ' scale(' + s.toFixed(4) + ')' : '');
  if (o !== undefined) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }
}
function layout() {
  var W = stage.clientWidth; if (!W) return false;
  stage.classList.add('s8-live');
  var mode = W >= 880 ? 'wide' : W >= 600 ? 'mid' : 'narrow';
  stage.classList.toggle('s8-narrow', mode === 'narrow');
  var pad = mode === 'wide' ? 40 : mode === 'mid' ? 32 : 18, gap = 12, HD = 32, cw, xs;
  if (mode === 'wide') { var g3 = 32; cw = Math.floor((W - 2 * pad - 2 * g3) / 3); xs = { no: pad, c: pad + cw + g3, yes: pad + 2 * (cw + g3) }; }
  else if (mode === 'mid') { var g2 = 24; cw = Math.floor((W - 2 * pad - g2) / 2); xs = { no: pad, c: Math.round((W - cw) / 2), yes: pad + cw + g2 }; }
  else { cw = W - 2 * pad - 12; xs = { no: pad + 6, c: pad + 6, yes: pad + 6 }; }
  C.forEach(function (c) { c.el.style.width = cw + 'px'; c.el.style.height = ''; c.el.style.transform = 'none'; });
  C.forEach(function (c) { c.h = c.el.offsetHeight; });
  var H0 = Math.max.apply(null, C.map(function (c) { return c.h; }));
  if (mode === 'wide') C.forEach(function (c) { c.h = H0; c.el.style.height = H0 + 'px'; });   /* equal rows: both columns end level */
  var g = { W: W, mode: mode, cw: cw, xs: xs, H0: H0, sY: {} };
  var colH = function (ok) { return C.filter(function (c) { return c.ok === ok; }).reduce(function (a, c) { return a + c.h + gap; }, -gap); };
  var gh = HD + H0 + 24;
  if (mode === 'wide') {
    var top = pad + 30, ch = Math.max(colH(0), colH(1));
    g.sY.no = g.sY.yes = top; g.tags = { no: [xs.no, pad], yes: [xs.yes, pad] };
    g.gate = { x: xs.c - 12, y: top + Math.max(0, (ch - gh) / 2), w: cw + 24, h: gh };
    g.H = top + Math.max(ch, gh) + pad + 36;
  } else {
    g.gate = { x: xs.c - 12, y: pad, w: cw + 24, h: gh };
    var below = pad + gh + 26;
    if (mode === 'mid') { g.tags = { no: [xs.no, below], yes: [xs.yes, below] }; g.sY.no = g.sY.yes = below + 28; g.H = g.sY.no + Math.max(colH(0), colH(1)) + pad + 40; }
    else {
      g.tags = { yes: [xs.yes, below] }; g.sY.yes = below + 28;
      var noTag = g.sY.yes + colH(1) + 20; g.tags.no = [xs.no, noTag]; g.sY.no = noTag + 28;
      g.H = g.sY.no + colH(0) + pad + 40;
    }
  }
  /* each chip's home slot, plus a dashed outline that shows only while its chip is away */
  C.forEach(function (c) {
    var col = c.ok ? 'yes' : 'no', y = g.sY[col];
    C.forEach(function (o) { if (o.ok === c.ok && o.slot < c.slot) y += o.h + gap; });
    c.hx = xs[col]; c.hy = y;
    if (!c.ph) { c.ph = document.createElement('i'); c.ph.className = 's8-slot'; c.ph.setAttribute('aria-hidden', 'true'); scene.insertBefore(c.ph, scene.firstChild); }
    c.ph.style.width = cw + 'px'; c.ph.style.height = c.h + 'px';
  });
  scene.style.height = Math.round(g.H) + 'px';
  gate.style.width = g.gate.w + 'px'; gate.style.height = g.gate.h + 'px'; px(gate, g.gate.x, g.gate.y);
  scan.style.height = (H0 + 12) + 'px';
  px(tagNo, g.tags.no[0], g.tags.no[1]); px(tagYes, g.tags.yes[0], g.tags.yes[1]);
  G = g; return true;
}

function render(t) {
  if (!G) return;
  t = ((t % D) + D) % D;
  var g = G, wide = false, verdict = '', vOn = 0, vS = 1, vx = 0, vy = 0, scanX = -1, sy0 = 0;
  C.forEach(function (c) {
    var T = c.T, e = c.el, cls = c.ok ? 'ok' : 'no', zi = 2, x = c.hx, y = c.hy, o = 1, s = 1;
    var gy = g.gate.y + 32 + 12 + (g.H0 - c.h) / 2, gx = g.xs.c, away = 0;
    if (t >= T[0] && t < T[4]) {
      zi = 6; away = 1;
      if (t < T[1]) {                                       /* to the gate */
        var a = k(t, T[0], T[1]);
        if (wide) { var e1 = eo(a); x = c.hx + (gx - c.hx) * e1; y = c.hy + (gy - c.hy) * e1; }
        else if (a < 0.45) { o = 1 - sm(a / 0.45); s = 1 - 0.04 * sm(a / 0.45); }
        else { x = gx; y = gy; o = sm((a - 0.45) / 0.55); }
      } else if (t < T[3]) {                                /* in the gate: neutral under the scan, then the verdict */
        x = gx; y = gy;
        if (t < T[2]) { cls = ''; scanX = gx + k(t, T[1] + 0.04, T[2] - 0.04) * g.cw; sy0 = gy + c.h / 2; }
        else {
          verdict = cls;
          vOn = Math.min(1, k(t, T[2], T[2] + 0.06)) * (1 - sm(k(t, T[3] - 0.04, T[3] + 0.1)));
          vS = 1 + 0.35 * (1 - eo(k(t, T[2], T[2] + 0.2)));
          vx = gx + 28 - 20; vy = gy + c.h / 2 - 20;   /* centred on the chip's badge (left 16 + 12) */
          if (!c.ok) x += 7 * Math.sin((t - T[2]) * 52) * (1 - k(t, T[2], T[3]));   /* recoil */
        }
      } else {                                              /* home again */
        var b = k(t, T[3], T[4]);
        if (wide) { var e2 = eo(b); x = gx + (c.hx - gx) * e2; y = gy + (c.hy - gy) * e2; }
        else if (b < 0.45) { x = gx; y = gy; o = 1 - sm(b / 0.45); }
        else { o = sm((b - 0.45) / 0.55); s = 0.96 + 0.04 * sm((b - 0.45) / 0.55); }
      }
    }
    e.className = cls; e.style.zIndex = zi; px(e, x, y, s, o);
    /* the dashed slot shows while the chip is away (wide: once it has left the slot) */
    var po = away ? Math.min(sm(k(t, T[0], T[0] + 0.15)), 1 - sm(k(t, T[4] - 0.15, T[4]))) * 0.9 : 0;
    px(c.ph, c.hx, c.hy, 1, po);
  });
  gate.className = 's8-gate' + (verdict === 'ok' ? ' pass' : verdict === 'no' ? ' fail' : '');
  scan.style.opacity = scanX >= 0 ? 1 : 0; if (scanX >= 0) px(scan, scanX - 2, sy0 - (g.H0 + 12) / 2);
  vd.className = 's8-vd ' + verdict;   /* a ring that stamps round the chip's own badge: one tick, never two */
  vd.style.opacity = vOn; px(vd, vx, vy, vS);
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { if (layout()) render(seeking ? t : RM ? END : t); }
window.__seek_s8 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
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
}, { threshold: 0.25 }).observe(stage);
if (!RM) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
