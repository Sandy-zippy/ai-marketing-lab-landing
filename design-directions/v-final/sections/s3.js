/* S3 v6: deterministic render(t), t in [0,14). window.__seek_s3(t). Persistent actor = the SKILL.md card.
   0 frame 0: the card on Cold email | 0.4-1.1 the terminal opens a slot and the card docks, its path lights |
   1.2-2.8 the four recorded output lines | 2.5-3.9 three real drafts materialise, newest on top | 3.9-4.65 "You approve"
   is pressed | 4.7-5.25 pills flip to Approved | 5.6-6.3 the card arcs back to Cold email | 6.3-12.2 it rides the loop,
   re-written once per step (Landing page, Follow-up in full) | 12.2-13 end frame | 13-14 reset: the trail wipes along
   the track back to Cold email, the drafts file away. 14 == 0, so no crossfade. Reduced motion: the end frame, static.
   Laid out only when the stage has a width (sections are hidden until the VSL reveal). */
var root = document.getElementById('s3');
if (!root) return;
var stage = root.querySelector('.s3-stage'), scene = root.querySelector('.s3-scene');
if (!stage || !scene) return;
var RM = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var D = 14, END = 12.6;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function ease(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function lerp(a, b, x) { return a + (b - a) * x; }
var Q = function (s) { return scene.querySelector(s); }, QA = function (s) { return [].slice.call(scene.querySelectorAll(s)); };

var NAMES = ['Offer', 'Content', 'Cold email', 'LinkedIn', 'Ads', 'Landing page', 'Fast callback', 'Follow-up', 'Sales call', 'Delivery', 'Reporting', 'Repeat buying'];
var FILES = ['offer', 'content', 'hot-outreach', 'linkedin', 'ads', 'landing-page', 'fast-callback', 'follow-up', 'sales-call', 'delivery', 'reporting', 'repeat-buying'];
var QUOTE = 'give the fix away free in message one';
var T_RIDE = 6.3;
/* the ride: from Cold email once round the loop. key = shown in full (drafting -> approved), yes = the gate */
var STOPS = [{ s: 2 }, { s: 3 }, { s: 4 }, { s: 5, key: 1 }, { s: 'yes' }, { s: 6 }, { s: 7, key: 1 }, { s: 8 }, { s: 9 }, { s: 10 }, { s: 11 }, { s: 0, far: 1 }, { s: 1 }, { s: 2, wrap: 1 }];
(function () {
  var t = T_RIDE;
  STOPS.forEach(function (p, j) {
    if (j) t += p.far ? 0.36 : 0.26;
    p.arr = t; t += p.key ? 0.55 : p.s === 'yes' ? 0.25 : 0.12; p.dep = t;
  });
})();

var G = null, laid = false;
var card = Q('.s3-card'), c1 = Q('.s3-c1 b'), cq = Q('.s3-cq'), cs = Q('.s3-cs'), csI = QA('.s3-cs i');
var sts = QA('.s3-st'), yes = Q('.s3-yes'), again = Q('.s3-again'), lead = Q('.s3-lead'), bc = Q('.s3-bc');
var t0p = Q('.s3-t0'), t1p = Q('.s3-t1'), now_ = Q('.s3-now'), nowZ = Q('.s3-now span'), nowN = Q('.s3-now b');
var lines = QA('.s3-ln'), em = Q('.s3-pr em'), drs = QA('.s3-dr'), btn = Q('.s3-ok'), ptr = Q('.s3-ptr');
var slots = QA('.s3-sl'), dock = Q('.s3-dock'), dock2 = Q('.s3-dock2'), paneT = Q('.s3-pa-t'), paneD = Q('.s3-pa-d'), paneL = Q('.s3-pa-l'), zup = Q('.s3-zl-up'), zdn = Q('.s3-zl-down');

function rel(el) {
  var s = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { l: r.left - s.left, t: r.top - s.top, w: r.width, h: r.height };
}
function place(el, x, y, extra) { el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (extra || ''); }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

function layout() {
  if (!stage.clientWidth) return false;
  var narrow = matchMedia('(max-width:899px)').matches, swap = narrow && !RM;
  stage.classList.add('s3-js');
  stage.classList.toggle('s3-swap', swap);
  [card, ptr, lead, bc, yes, again, zup, zdn, now_].concat(sts, drs, [paneT, paneD, paneL]).forEach(function (e) { e.style.transform = ''; });
  scene.style.transform = ''; scene.style.height = ''; scene.style.gridTemplateRows = ''; paneL.style.height = '';
  /* measure the card at its fullest, open both docks to fit it */
  card.style.width = '';
  c1.textContent = 'hot-outreach'; cq.textContent = QUOTE; show(cq, 1);
  dock.style.height = 'auto'; dock.style.marginBottom = '';
  card.style.width = Math.min(narrow ? 280 : 304, dock.clientWidth - 16) + 'px';
  var dh = card.offsetHeight + 16;
  dock.style.height = dh + 'px'; dock2.style.height = dh + 'px';
  if (narrow && !swap) { dock.style.height = '0px'; dock.style.marginBottom = '-8px'; paneL.style.height = '380px'; }   /* reduced motion on a phone: the finished frame never opens the dock */
  if (swap) { var H = Math.max(paneT.offsetHeight, paneD.offsetHeight, 340); scene.style.height = H + 'px'; paneL.style.height = H + 'px'; }
  else if (!narrow) scene.style.gridTemplateRows = paneT.offsetHeight + 'px auto';   /* the top row keeps its height while the dock opens and closes */

  var lw = paneL.clientWidth, lh = paneL.clientHeight, g = { narrow: narrow, swap: swap, dh: dh };
  var y0 = narrow ? 50 : 66, y1 = lh - y0, ym = (y0 + y1) / 2;
  var x0 = narrow ? 24 : 62, x1 = narrow ? lw - 24 : lw - 34, r = narrow ? 34 : (y1 - y0) / 2;
  var a = ym - y0 - r, q = Math.PI * r / 2, T = x1 - x0 - 2 * r, S = y1 - y0 - 2 * r, tot = 2 * a + S + 2 * T + 4 * q;
  var d = 'M' + x0 + ' ' + ym + 'L' + x0 + ' ' + (y0 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y0 + 'L' + (x1 - r) + ' ' + y0 +
    'A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + (y0 + r) + 'L' + x1 + ' ' + (y1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x1 - r) + ' ' + y1 +
    'L' + (x0 + r) + ' ' + y1 + 'A' + r + ' ' + r + ' 0 0 1 ' + x0 + ' ' + (y1 - r) + 'L' + x0 + ' ' + ym;
  t0p.setAttribute('d', d);
  t1p.setAttribute('d', d + d.replace('M', 'L'));   /* drawn twice so the trail can run past the start */
  g.tot = tot; g.ym = ym; g.y0 = y0; g.y1 = y1; g.x0 = x0; g.x1 = x1; g.lw = lw;
  var pr = rel(paneL); g.pl = pr.l; g.pt = pr.t;
  g.len = []; g.pos = [];
  sts.forEach(function (st, i) {
    var up = i < 6, n = up ? i : i - 6, X = up ? (x0 + r) + T * n / 5 : x1 - r - T * n / 5;
    st.classList.toggle('up', up); st.classList.toggle('dn', !up);
    g.len[i] = up ? a + q + (X - x0 - r) : a + 2 * q + T + S + q + (x1 - r - X);
    g.pos[i] = { x: X, y: up ? y0 : y1 };
    place(st, X, up ? y0 : y1);
  });
  g.len.yes = a + 2 * q + T + S / 2;
  if (!narrow) place(again, x0 - again.offsetWidth / 2, ym - again.offsetHeight / 2);
  place(zup, 0, narrow ? 0 : 6); place(zdn, 0, lh - zdn.offsetHeight - (narrow ? 0 : 6));
  var base = g.len[2];
  STOPS.forEach(function (p) { var L = p.s === 'yes' ? g.len.yes : g.len[p.s]; if (L < base - 1 || p.wrap) L += tot; p.U = L; });
  g.base = base;

  var cw = card.offsetWidth, ch = card.offsetHeight; g.cw = cw; g.ch = ch; g.rs = narrow ? Math.min(0.78, (lw - 2 * (yes.offsetWidth / 2 + 24 + 8)) / cw) : 1;   /* phone: clear of Yes and the track */
  var dk = rel(dock), dk2 = rel(dock2);
  g.dock = { x: dk.l + (narrow ? (dk.w - cw) / 2 : 8), y: dk.t + 8 };
  g.dock2 = { x: dk2.l + (dk2.w - cw) / 2, y: dk2.t + 8 };
  var minC = narrow ? lw / 2 : x0 + again.offsetWidth / 2 + 16 + cw / 2, maxC = narrow ? lw / 2 : x1 - yes.offsetWidth / 2 - 16 - cw / 2;
  var cyRail = narrow ? ym + 26 : ym;   /* phone: the card sits a little low, the station name is printed above it */
  g.cyRail = cyRail;
  if (narrow) place(again, x0 - 12, Math.min(y1 - r - again.offsetHeight, cyRail + ch * g.rs / 2 + 12));   /* phone: a pill on the left side, below the card */
  g.rail = function (px) { return { x: g.pl + Math.max(minC, Math.min(maxC, px)) - cw / 2, y: g.pt + cyRail - ch / 2 }; };
  g.slot = drs[1].offsetTop - drs[0].offsetTop;
  g.btn = rel(btn); g.tw = rel(Q('.s3-tw'));
  G = g; laid = true;
  render(0);
  return true;
}

function typed(s, x) { return s.slice(0, Math.round(s.length * cl(x))); }

function render(t) {
  if (!laid) return;
  t = ((t % D) + D) % D;
  var g = G, swap = g.swap, RS = t >= 13 ? sm(k(t, 13.0, 13.9)) : 0;   /* RS = the reset at the end of the loop */

  /* phone: one panel at a time, a short slide, never two at once (loop -> terminal -> drafts -> loop) */
  if (swap) {
    var win = function (a, b) {   /* in over [a, a+.15], out over [b-.12, b] */
      if (t < a || t > b) return [0, 0];
      var i = sm(k(t, a, a + 0.15)), o = 1 - sm(k(t, b - 0.12, b));
      return [Math.min(i, o), i < 1 ? (1 - i) * 24 : -(1 - o) * 24];
    };
    var L = t < 1 ? win(-1, 0.55) : win(5.72, 15), Tn = win(0.55, 2.42), Dn = win(2.42, 5.72);
    [[paneL, L], [paneT, Tn], [paneD, Dn]].forEach(function (p) { show(p[0], p[1][0]); p[0].style.transform = 'translateX(' + p[1][1].toFixed(1) + 'px)'; });
  } else [paneL, paneT, paneD].forEach(function (p) { show(p, 1); p.style.transform = ''; });

  /* the ride: unwrapped length U along the loop */
  var U = STOPS[0].U, cur = 0;
  if (t >= T_RIDE) {
    for (var j = 0; j < STOPS.length; j++) if (t >= STOPS[j].arr) cur = j;
    var nx = STOPS[cur + 1];
    U = STOPS[cur].U;
    if (nx && t > STOPS[cur].dep) U = lerp(STOPS[cur].U, nx.U, ease(k(t, STOPS[cur].dep, nx.arr)));
  }
  var S0 = g.base + RS * g.tot, tr = Math.max(0, U - S0);
  if (t >= 13) { U = STOPS[STOPS.length - 1].U; tr = U - S0; }
  t1p.style.strokeDasharray = tr + ' ' + 3 * g.tot; t1p.style.strokeDashoffset = -S0; t1p.style.opacity = tr > 1 ? 1 : 0;
  var bp = t0p.getPointAtLength(((U % g.tot) + g.tot) % g.tot);
  place(bc, bp.x - 13, bp.y - 13);
  var docked = t >= 0.5 && t < 6.3;
  show(bc, docked ? 1 - sm(k(t, 0.5, 0.7)) * (1 - sm(k(t, 6.1, 6.3))) : 1);
  var lit = function (s) {   /* a station is lit once the card has been there, until the reset wipe passes it */
    if (s === 2) return true;
    if (t < T_RIDE) return false;
    for (var j = 1; j <= cur; j++) if (STOPS[j].s === s) return !(t >= 13 && S0 > STOPS[j].U + 1);
    return false;
  };
  sts.forEach(function (st, i) {
    st.classList.toggle('off', !lit(i));
    st.querySelector('span').style.opacity = g.narrow ? 0 : 1;   /* phone: the current station is printed large instead */
  });
  var ys = 1 + 0.35 * Math.sin(Math.PI * k(t, STOPS[4].arr, STOPS[4].arr + 0.3));
  yes.classList.toggle('off', !lit('yes'));
  place(yes, g.x1 - yes.offsetWidth / 2, g.ym - yes.offsetHeight / 2, ' scale(' + ys.toFixed(3) + ')');

  /* which file the card is writing: the last real station it reached */
  var m = cur; while (m > 0 && STOPS[m].s === 'yes') m--;
  var stp = STOPS[m], onRide = t >= T_RIDE && t < 13;

  /* the card: on Cold email, docked, arcs back, rides */
  var railP = g.rail(t >= T_RIDE ? bp.x : g.pos[2].x), dk = swap && t >= 2.3 ? g.dock2 : g.dock, pos;
  if (t < 0.5) pos = railP;
  else if (t < 1.1) { var e = ease(k(t, 0.5, 1.1)); pos = { x: lerp(railP.x, g.dock.x, e), y: lerp(railP.y, g.dock.y, e) - 30 * Math.sin(Math.PI * e) }; }
  else if (swap && t >= 2.3 && t < 2.6) { var e2 = ease(k(t, 2.3, 2.6)); pos = { x: lerp(g.dock.x, g.dock2.x, e2), y: lerp(g.dock.y, g.dock2.y, e2) }; }
  else if (t < 5.6) pos = dk;
  else if (t < 6.3) {   /* desktop: slide right along the dock row (over no text), then drop to the loop; phone: straight down */
    var ex = swap ? dk.x : g.tw.l + g.tw.w - g.cw - 8, e3 = sm(k(t, 5.6, 5.85)), e4 = ease(k(t, 5.85, 6.3));
    pos = t < 5.85 ? { x: lerp(dk.x, ex, e3), y: dk.y - 6 * Math.sin(Math.PI * e3) } : { x: lerp(ex, railP.x, e4), y: lerp(dk.y, railP.y, e4) };
  } else pos = railP;
  var onRail = t < 0.5 ? 1 : t < 1.1 ? 1 - ease(k(t, 0.5, 1.1)) : t < 5.6 ? 0 : sm(k(t, 5.6, 6.3));
  var flying = (t >= 0.5 && t < 1.1) || (t >= 5.6 && t < 6.3);
  var sc = (flying ? 1.04 : 1) * lerp(1, g.rs, onRail);
  place(card, pos.x, pos.y, ' scale(' + sc.toFixed(3) + ')');
  card.style.boxShadow = flying ? '0 26px 44px -16px rgba(0,0,0,.75),0 0 30px -6px rgba(63,224,214,.7)' : '';

  /* card text: name re-typed at every step it reaches on the ride; line 2 = the real skill line, then drafting -> approved */
  var name = FILES[stp.s], nxv = (t >= T_RIDE && m > 0 && !stp.wrap) ? k(t, stp.arr, stp.arr + (stp.key ? 0.25 : 0.12)) : 1;
  var nm = typed(name, nxv); if (c1.textContent !== nm) c1.textContent = nm;
  if (cq.textContent !== QUOTE) cq.textContent = QUOTE;
  /* one text layer at a time: the skill line goes, then the status comes (and the reverse at the reset) */
  var qO = t < 13 ? 1 - sm(k(t, 5.9, 6.1)) : sm(k(t, 13.45, 13.6)), sO = t < 13 ? sm(k(t, 6.1, 6.3)) : 1 - sm(k(t, 13.3, 13.45));
  show(cq, qO); show(cs, sO);
  var drafting = onRide && stp.key && t < stp.arr + 0.32;
  csI[0].style.display = drafting ? '' : 'none'; csI[1].style.display = drafting ? 'none' : '';

  /* phone: the station the card is on, printed large inside the loop */
  if (g.narrow) {
    nowN.textContent = NAMES[stp.s];
    nowZ.textContent = (stp.s < 6 ? zup : zdn).textContent.split('(')[0].trim();   /* the zone word fits inside the loop at 320 */
    var nh = now_.offsetHeight;
    place(now_, 0, g.cyRail - g.ch * g.rs / 2 - 14 - nh);
    show(now_, sm(k(onRail, 0.9, 1)) * (onRide && m > 0 ? sm(k(t, stp.arr, stp.arr + 0.12)) : 1));   /* only once the card has landed */
  } else show(now_, 0);

  /* tether: from the card to the station it is on */
  var cL = g.rail(bp.x).x - g.pl;
  var tether = onRail > 0.99 && STOPS[cur].s !== 'yes' && bp.x > cL + 10 && bp.x < cL + g.cw - 10;
  if (tether) {
    var top = bp.y < g.ym, h2 = g.ch * g.rs / 2, ya = top ? bp.y + 14 : g.cyRail + h2, yb = top ? g.cyRail - h2 : bp.y - 14;
    lead.style.height = Math.max(0, yb - ya) + 'px'; place(lead, bp.x - 1, ya);
  }
  show(lead, tether ? (t >= T_RIDE && t < 13 ? sm(k(t, STOPS[cur].arr, STOPS[cur].arr + 0.08)) : 1) : 0);

  /* the dock opens for the card and closes after it leaves */
  var dO = t < 5.6 ? sm(k(t, 0.4, 0.95)) : 1 - sm(k(t, 5.85, 6.35));
  dock.style.height = (g.dh * dO).toFixed(1) + 'px';
  dock.style.borderColor = 'rgba(160,230,225,' + (0.22 * Math.min(1, dO * 3)).toFixed(3) + ')';
  dock.style.marginBottom = dO < 0.01 ? '-8px' : '';

  /* terminal: the path lights as the card docks, then the four recorded lines run; at the reset they wind back */
  var hl = k(t, 1.0, 1.2) * (1 - k(t, 13.0, 13.3));
  em.style.background = 'rgba(63,224,214,' + (0.22 * hl).toFixed(3) + ')';
  em.style.boxShadow = '0 0 0 2px rgba(63,224,214,' + (0.5 * hl).toFixed(3) + ')';
  em.style.color = hl > 0.5 ? 'var(--teal-hi)' : '';
  lines.forEach(function (ln, i) {
    var x = k(t, 1.2 + 0.4 * i, 1.5 + 0.4 * i) * (1 - sm(k(t, 13.0, 13.4)));
    ln.style.clipPath = 'inset(0 ' + ((1 - x) * 100).toFixed(1) + '% 0 0)';
    ln.style.opacity = x > 0 ? 1 : 0;
  });

  /* the empty draft slots shimmer while outreach-drafts.md is being written */
  var shim = k(t, 1.2, 2.8), sOn = Math.sin(Math.PI * shim);
  slots.forEach(function (sl, n) {
    var x = ((shim * 1.6 - n * 0.2) * 140 - 20).toFixed(1);
    sl.style.background = sOn > 0.01 ? 'linear-gradient(100deg,transparent ' + (+x - 20) + '%,rgba(63,224,214,' + (0.1 * sOn).toFixed(3) + ') ' + x + '%,transparent ' + (+x + 20) + '%)' : '';
  });

  /* drafts: Magic UI animated-list, newest enters on top and pushes the rest down; filed away at the reset */
  var out = sm(k(t, 13.0, 13.35));
  drs.forEach(function (dr, s) {
    var i = +dr.dataset.i, a = 2.5 + 0.5 * i, p = 0;
    for (var jj = i + 1; jj < 3; jj++) p += ease(k(t, 2.5 + 0.5 * jj, 2.9 + 0.5 * jj));
    var o = sm(k(t, a, a + 0.3)) * (1 - out), scl = 0.95 + 0.05 * ease(k(t, a, a + 0.4));
    dr.style.transform = 'translateY(' + ((p - s) * g.slot - 10 * out).toFixed(1) + 'px) scale(' + scl.toFixed(3) + ')';
    show(dr, o);
    var f = 4.7 + 0.2 * (2 - i), fx = k(t, f, f + 0.15), pi = dr.querySelectorAll('.s3-pill i');
    pi[0].style.opacity = 1 - fx; pi[1].style.opacity = fx;
    pi[1].style.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * k(t, f, f + 0.3))).toFixed(3) + ')';
    var bk = k(t, f - 0.05, f + 0.55);
    dr.style.setProperty('--bo', Math.sin(Math.PI * bk).toFixed(3));
    dr.style.setProperty('--ba', (360 * bk).toFixed(1) + 'deg');
    dr.style.borderColor = fx > 0.5 ? 'rgba(63,224,214,.7)' : '';
  });

  /* You approve: outlined until pressed */
  var pressed = k(t, 4.52, 4.65) * (1 - k(t, 13.1, 13.3)), push = Math.sin(Math.PI * k(t, 4.5, 4.7)), hover = sm(k(t, 3.9, 4.45)) * (1 - k(t, 4.5, 4.6));
  btn.style.background = pressed > 0.5 ? 'var(--teal-hi)' : 'transparent';
  btn.style.color = pressed > 0.5 ? '#032220' : 'var(--teal-hi)';
  btn.style.boxShadow = pressed > 0.5 ? '' : '0 0 0 ' + (6 * hover).toFixed(1) + 'px rgba(63,224,214,' + (0.18 * hover).toFixed(3) + ')';
  btn.style.transform = 'scale(' + (1 - 0.03 * push).toFixed(3) + ')';
  var b = g.btn, pe = ease(k(t, 3.9, 4.45));
  var px = lerp(Math.min(b.l + b.w + 40, scene.clientWidth - 30), b.l + b.w * 0.62, pe), py = lerp(b.t - 30, b.t + b.h * 0.55, pe);
  place(ptr, px, py, ' scale(' + (1 - 0.12 * push).toFixed(3) + ')');
  show(ptr, sm(k(t, 3.85, 4.0)) * (1 - sm(k(t, 5.1, 5.3))));

  /* a slow push through the payoff, released during the reset */
  scene.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 12.0, 12.9)) * (1 - sm(k(t, 13.0, 13.8)))).toFixed(4) + ')';
}

/* clock: runs only while in view and not paused; __seek_s3 for gates */
var T0 = 0, base = 0, running = false, paused = false, seekT = null, raf = 0, inView = false;
function now() { return base + (running ? (performance.now() - T0) / 1000 : 0); }
function tick() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(tick) : 0; }
function play() { if (running || RM || paused || !inView) return; if (!laid && !layout()) return; running = true; T0 = performance.now(); raf = requestAnimationFrame(tick); }
function stop() { if (!running) return; base = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s3 = function (t) { seekT = t; if (!laid) layout(); render(t); };
function relayout() { if (!layout()) return; render(seekT !== null ? seekT : RM ? END : now()); }
function boot() { if (laid || !stage.clientWidth) return; if (layout()) render(RM ? END : 0); }
boot();
document.addEventListener('aiml:reveal', function () { setTimeout(boot, 0); });
addEventListener('resize', function () { if (laid) relayout(); });
if (document.fonts) document.fonts.ready.then(function () { if (laid) relayout(); else boot(); });
if (!RM && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting; if (inView) { boot(); play(); } else stop(); });
  }, { threshold: 0.25 }).observe(stage);
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; play(); } });
}
