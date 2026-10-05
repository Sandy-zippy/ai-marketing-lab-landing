/* S8: the filter. Deterministic: every state is render(t), t in [0,9). Seek with window.__seek_s8(t).
   The six real <li> are the chips. Deck order is chosen so each list fills from the top down into its DOM order:
   new arrivals land in slot 0 and push the earlier ones down (Magic UI animated-list, ported).
   In the gate: a beam sweeps the chip, a verdict stamps, the gate flashes; a pass leaves through the right wall,
   a bounce recoils and leaves left. At the end the sorted chips fly back into the deck (no crossfade, no rewind).
   wide (stage >= 880): "This isn't for" | gate over the deck | "This is for".
   mid (600-879): gate on top with the deck tucked behind it, the two lists side by side below.
   narrow: gate on top, deck tucked behind it, then "This is for" and "This isn't for" stacked. */
var stage = document.getElementById('s8-stage'), scene = document.getElementById('s8-scene');
if (!stage || !scene) return;
var D = 9, RM = AIML.REDUCE, END = 7.0;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var noL = [].slice.call(stage.querySelectorAll('.s8-no li')), yesL = [].slice.call(stage.querySelectorAll('.s8-yes li'));
[].concat(noL, yesL).forEach(function (li) { li.innerHTML = '<span>' + li.innerHTML + '</span>'; });
/* deck order: a pass first, then the bounce (both slow, readable), then a fast run of four.
   T = [leave deck, in gate, verdict, exit starts, landed] */
function fast(s) { return [s, s + 0.22, s + 0.4, s + 0.5, s + 0.75]; }
var C = [
  { el: yesL[2], ok: 1, T: [0.25, 0.7, 1.3, 1.55, 1.95] },
  { el: noL[2],  ok: 0, T: [1.85, 2.25, 2.85, 3.1, 3.5] },
  { el: noL[1],  ok: 0, T: fast(3.45) },
  { el: yesL[1], ok: 1, T: fast(4.07) },
  { el: noL[0],  ok: 0, T: fast(4.69) },
  { el: yesL[0], ok: 1, T: fast(5.31) }
];
var HOLD_END = 7.65;   /* finished lists hold 6.05 -> 7.65, then the collect */
function c0(j) { return HOLD_END + (5 - j) * 0.09; }
var gate = scene.querySelector('.s8-gate'), scan = scene.querySelector('.s8-scan'), vd = scene.querySelector('.s8-vd');
var tagNo = stage.querySelector('.s8-no .s8-tag'), tagYes = stage.querySelector('.s8-yes .s8-tag');
var G = null;

function px(el, x, y, s, o, r) {
  el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (r ? ' rotate(' + r.toFixed(2) + 'deg)' : '') + (s && s !== 1 ? ' scale(' + s.toFixed(4) + ')' : '');
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
  var g = { W: W, mode: mode, cw: cw, xs: xs, gap: gap, H0: H0, sY: {} };
  g.gate = { x: xs.c - 12, y: pad, w: cw + 24, h: HD + H0 + 24 };
  g.chipY = function (c) { return g.gate.y + HD + 12 + (H0 - c.h) / 2; };
  var colH = function (ok) { return C.filter(function (c) { return c.ok === ok; }).reduce(function (a, c) { return a + c.h + gap; }, -gap); };
  if (mode === 'wide') {
    g.sY.no = g.sY.yes = g.gate.y + HD + 12;
    g.tags = { no: [xs.no, g.gate.y + 8], yes: [xs.yes, g.gate.y + 8] };
    g.deck = function (d) { return g.gate.y + g.gate.h + 26 + d * 10; };
    g.H = Math.max(g.sY.no + Math.max(colH(0), colH(1)), g.deck(3) + H0) + pad + 8;
  } else {
    /* the deck is tucked behind the gate: the front card IS the card in the gate, the rest peek out below it */
    var cy = g.gate.y + HD + 12;
    g.deck = function (d) { return cy + (d <= 1 ? 26 * d : 26 + 9 * (d - 1)); };
    var below = g.gate.y + g.gate.h + 2 * 9 + 14 + 26;
    if (mode === 'mid') {
      g.tags = { no: [xs.no, below], yes: [xs.yes, below] }; g.sY.no = g.sY.yes = below + 28;
      g.H = g.sY.no + Math.max(colH(0), colH(1)) + pad + 40;
    } else {
      g.tags = { yes: [xs.yes, below] }; g.sY.yes = below + 28;
      var noTag = g.sY.yes + colH(1) + 20; g.tags.no = [xs.no, noTag]; g.sY.no = noTag + 28;
      g.H = g.sY.no + colH(0) + pad + 40;
    }
  }
  scene.style.height = Math.round(g.H) + 'px';
  gate.style.width = g.gate.w + 'px'; gate.style.height = g.gate.h + 'px'; px(gate, g.gate.x, g.gate.y);
  scan.style.height = (H0 + 12) + 'px';
  px(tagNo, g.tags.no[0], g.tags.no[1]); px(tagYes, g.tags.yes[0], g.tags.yes[1]);
  G = g; return true;
}

/* where chip j sits in its column at time t: slot 0, pushed down by every newer arrival that has landed */
function slotY(j, t) {
  var c = C[j], y = G.sY[c.ok ? 'yes' : 'no'];
  for (var n = j + 1; n < C.length; n++) if (C[n].ok === c.ok) y += (C[n].h + G.gap) * eo(k(t, C[n].T[3] - 0.12, C[n].T[3] + 0.18));   /* make room before the newcomer arrives */
  return y;
}
function deckPose(j, d) {   /* x, y, scale, rotation, opacity, text opacity, z for a card at deck depth d */
  var g = G, tucked = g.mode !== 'wide';
  return { x: g.xs.c, y: g.deck(d), s: 1 - 0.04 * d, r: (j % 2 ? 2 : -2) * cl(d), o: d > 3.3 ? 0 : 1 - Math.max(0, d - 2.3),
           txt: cl(1 - d), z: tucked ? (d < 0.5 ? 6 : 2) : 5 - Math.round(d) };
}
function render(t) {
  if (!G) return;
  t = ((t % D) + D) % D;
  var g = G, wide = g.mode === 'wide', verdict = '', vOn = 0, vS = 1, vx = 0, vy = 0, scanX = -1, sy0 = 0;
  C.forEach(function (c, j) {
    var T = c.T, e = c.el, col = c.ok ? 'yes' : 'no', cls = '', zi = 6, txt = 1, cs = c0(j);
    /* deck depth: wide = cards that have left the deck; tucked = cards that have left the gate (the front card IS in the gate) */
    var depth = j; for (var i = 0; i < j; i++) depth -= wide ? eo(k(t, C[i].T[0], C[i].T[1])) : eo(k(t, C[i].T[3], C[i].T[3] + Math.min(0.3, C[i + 1].T[0] - C[i].T[3])));
    var gy = g.chipY(c), x, y, s = 1, o = 1, r = 0, P;
    if (t < T[0] || t >= cs + 0.5) {                       /* in the deck */
      P = deckPose(j, t < T[0] ? depth : j); x = P.x; y = P.y; s = P.s; r = P.r; o = P.o; txt = P.txt; zi = P.z; cls = P.txt < 0.5 ? 'bk' : '';
    } else if (t < T[1]) {                                  /* deck -> gate */
      var p = eo(k(t, T[0], T[1])); P = deckPose(j, depth); x = P.x; y = P.y + (gy - P.y) * p; s = P.s + (1 - P.s) * p; r = P.r * (1 - p);
    } else if (t < T[3]) {                                  /* in the gate: scan, then the verdict */
      x = g.xs.c; y = gy;
      if (t < T[2]) { scanX = g.xs.c + k(t, T[1] + 0.04, T[2] - 0.04) * g.cw; sy0 = gy + c.h / 2; }
      else {
        cls = c.ok ? 'ok' : 'no'; verdict = cls;
        vOn = Math.min(1, k(t, T[2], T[2] + 0.06)) * (1 - sm(k(t, T[3] - 0.02, T[3] + 0.12)));
        vS = 1 + 0.35 * (1 - eo(k(t, T[2], T[2] + 0.2)));
        vx = g.xs.c - 4; vy = gy + c.h / 2 - 20;   /* the stamp lands on the chip's icon, clear of its words */
        if (!c.ok) x += 7 * Math.sin((t - T[2]) * 52) * (1 - k(t, T[2], T[3]));   /* recoil */
      }
    } else if (t < cs) {                                    /* exit, land, then sit in the list */
      cls = c.ok ? 'ok' : 'no';
      var tl = slotY(j, t), f2 = k(t, T[3], T[4]);
      if (t >= T[4]) { x = g.xs[col]; y = tl; zi = 2; }
      else if (wide) { var a2 = eo(f2); x = g.xs.c + (g.xs[col] - g.xs.c) * a2; y = gy + (tl - gy) * a2; }
      else if (f2 < 0.4) { var a3 = sm(f2 / 0.4); x = g.xs.c + (c.ok ? 48 : -48) * a3; y = gy; o = 1 - a3; }
      else { var b3 = eo((f2 - 0.4) / 0.6); x = g.xs[col]; y = tl; s = 0.96 + 0.04 * b3; o = b3; zi = 2; }
    } else {                                                /* the collect: fly home to the deck; words off while crossing */
      var cp = sm(k(t, cs, cs + 0.5)), hx = g.xs[col], hy = slotY(j, t); P = deckPose(j, j);
      x = hx + (P.x - hx) * cp; y = hy + (P.y - hy) * cp; s = 1 + (P.s - 1) * cp; r = P.r * cp;
      o = j > 3.3 ? 1 - cp : 1; txt = j === 0 ? 1 - sm(k(cp, 0.08, 0.25)) + sm(k(cp, 0.8, 0.97)) : 1 - sm(k(t, cs, cs + 0.15)); zi = 9 - j;
      cls = cp < 0.5 ? (c.ok ? 'ok' : 'no') : (j ? 'bk' : '');
    }
    e.className = cls;
    e.style.zIndex = zi;
    px(e, x, y, s, o, r);
    e.firstChild.style.opacity = txt;
    if (c.ok && t >= T[4] && t < cs) {   /* the finished list breathes: teal glow pulses through the three passes */
      var ph = Math.max(0, t - 6.05), br = 0.5 - 0.5 * Math.cos(ph * 3 - j * 0.9);
      e.style.setProperty('--g', (22 + 16 * br * cl(ph * 2)).toFixed(1) + 'px');
    } else e.style.removeProperty('--g');
  });
  gate.className = 's8-gate' + (verdict === 'ok' ? ' pass' : verdict === 'no' ? ' fail' : '');
  var so = 1;
  if (scanX < 0 && t >= 6.15 && t < HOLD_END - 0.1) {   /* while the lists hold, the empty gate keeps scanning */
    var ip = ((t - 6.15) % 1.3) / 1.3; scanX = g.xs.c + ip * g.cw; sy0 = g.chipY(C[0]) + g.H0 / 2; so = 0.55 * Math.sin(ip * Math.PI);
  }
  scan.style.opacity = scanX >= 0 ? so : 0; if (scanX >= 0) px(scan, scanX - 2, sy0 - (G.H0 + 12) / 2);
  vd.className = 's8-vd ' + verdict; vd.textContent = verdict === 'ok' ? '✓' : verdict === 'no' ? '×' : '';
  vd.style.opacity = vOn; px(vd, vx, vy, vS);
  tagYes.classList.toggle('lit', t >= 6.05 && t < HOLD_END);
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
