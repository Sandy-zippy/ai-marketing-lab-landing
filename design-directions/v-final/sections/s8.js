/* S8: the filter. Deterministic: every state is render(t), t in [0,9). Seek with window.__seek_s8(t).
   The gate is never empty (page critic 3): exactly one chip holds it at a time, 1.5 s each, six chips = 9 s.
   Frame 0 is a resolved verdict: "B2B founders with an offer that sells" sits in the gate, passed (ring on its badge,
   gate lit teal). Each handover is one 0.25 s swap, like a slot machine: the outgoing chip slides down out of the gate's
   window (clipped by it, then back into its slot) while the next one (which left its slot just before) slides in
   from above, a chip height behind it, so the two never overlap. It goes neutral under the scan beam, gets its verdict
   (tick or cross, the gate flashes teal or brick, a bounce recoils) and holds it until the next swap.
   wide (stage >= 880): "This isn't for" | gate | "This is for".
   mid (600-879): gate on top, the two lists side by side below. narrow: gate on top, the lists stacked.
   Chips fade-jump between slot and gate (a travel path would cross the gate's header or the neighbouring chip). */
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
var P = 1.5;   /* each chip's turn in the gate */
C.forEach(function (c, i) { c.S = (((i - 4) * P - 1.0) % D + D) % D; });   /* chip 4 is mid-verdict at t = 0 */
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
  var g = G, verdict = '', vOn = 0, vS = 1, vx = 0, vy = 0, scanX = -1, sy0 = 0;
  var top = g.gate.y + 33, bot = g.gate.y + g.gate.h - 1, SW = g.H0 + 14;   /* the gate's window under its header; swap travel */
  C.forEach(function (c) {
    var u = ((t - c.S) % D + D) % D, e = c.el, cls = c.ok ? 'ok' : 'no', zi = 2, x = c.hx, y = c.hy, o = 1, po = 0, clip = 'none';
    var gy = g.gate.y + 32 + 12 + (g.H0 - c.h) / 2, gx = g.xs.c;
    if (u >= D - 0.2) { o = 1 - sm(k(u, D - 0.2, D - 0.05)); po = 0.9 * sm(k(u, D - 0.2, D - 0.05)); }   /* leaves its slot */
    else if (u < 1.75) {                                                                                 /* holds the gate */
      x = gx; y = gy; zi = 6; po = 0.9;
      if (u < 0.75) {                                     /* slides down into the window as the outgoing chip slides out below */
        cls = ''; y -= SW * (1 - sm(k(u, 0, 0.25)));
        if (u >= 0.3) { scanX = gx + k(u, 0.34, 0.71) * g.cw; sy0 = gy + c.h / 2; }
      } else {                                            /* the verdict, held until the next swap */
        verdict = cls; y += SW * sm(k(u, 1.5, 1.75));
        vOn = k(u, 0.75, 0.81) * (1 - k(u, 1.5, 1.58));
        vS = 1 + 0.35 * (1 - eo(k(u, 0.75, 0.95)));
        if (!c.ok) x += 7 * Math.sin((u - 0.75) * 52) * (1 - k(u, 0.75, 1.15));   /* recoil */
        vx = gx + 28 - 20; vy = y + c.h / 2 - 20;   /* centred on the chip's badge (left 16 + 12) */
      }
      /* ponytail: the chip is not a child of the gate, so the window is a clip-path in the chip's own box */
      var ct = Math.max(0, top - y), cb = Math.max(0, y + c.h - bot);
      if (ct > 0 || cb > 0) clip = 'inset(' + Math.min(ct, c.h).toFixed(1) + 'px -20px ' + Math.min(cb, c.h).toFixed(1) + 'px -20px)';
    } else if (u < 1.97) { o = sm(k(u, 1.75, 1.95)); po = 0.9 * (1 - o); }                               /* back home */
    e.className = cls; e.style.zIndex = zi; e.style.clipPath = clip; px(e, x, y, o < 1 ? 0.96 + 0.04 * o : 1, o);
    px(c.ph, c.hx, c.hy, 1, po);   /* the dashed slot shows while its chip is away */
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
