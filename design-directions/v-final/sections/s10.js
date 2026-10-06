/* S10: deterministic render(t), t in [0,8). Seek with window.__seek_s10(t). Reduced motion = the fixed frame (3.9 s).
   The s1 rail replayed with the ticket as the cause: a ring pulses off the ticket, the 45-min call drops out of it as
   a lens and locks on the leak; the fix lands; the card runs on to Client, is signed, then rises up a teal line and
   docks in the ticket, and the button answers with one pulse. Seam: the rail layer fades out, swaps to frame 0 while
   invisible, fades back in (never two cards or two pills at once). The ticket and its button never move or fade. */
var stage = document.getElementById('s10-stage'), scene = document.getElementById('s10-scene');
if (!stage || !scene) return;
var D = 8, RM = AIML.REDUCE, END = 3.9;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
var Q = function (s) { return stage.querySelector(s); };
var exl = Q('.s10-ex'), tk = Q('.s10-tk'), btn = Q('.s10-tk .btn'), card = Q('.s10-card'), csub = card.querySelector('small'), mk = Q('.s10-mk'), stamp = Q('.s10-stamp');
var railSvg = Q('.s10-rail'), ltag = Q('.s10-lens span'), lens = Q('.s10-lens'), ring = Q('.s10-ring'), spark = Q('.s10-spark'), cn = Q('.s10-cn'), stns = Q('.s10-stns');
var r1 = Q('.r1'), r2 = Q('.r2'), r0 = Q('.r0'), r3 = Q('.r3');
var STN = ['Ad', 'Callback', 'Follow-up', 'Sales call', 'Client'];
var SV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var ICO = [SV + '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/></svg>',
  SV + '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  SV + '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  SV + '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  SV + '<path d="M20 6L9 17l-5-5"/></svg>'];
stns.innerHTML = STN.map(function (s, i) { return '<div class="s10-stn"><i>' + ICO[i] + '</i><span>' + s + '</span></div>'; }).join('');
var S = [].slice.call(stns.children);

var G = null;
function place(el, x, y, ax, ay, sc) { el.style.transform = 'translate(' + Math.round(x - el.offsetWidth * ax) + 'px,' + Math.round(y - el.offsetHeight * ay) + 'px)' + (sc ? ' scale(' + sc.toFixed(4) + ')' : ''); }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }
function layout() {
  var w = scene.clientWidth, h = scene.clientHeight; if (!w) return false;
  var sd = parseFloat(getComputedStyle(stage).getPropertyValue('--sd')) || 52, narrow = w < 600, pts = [];
  var x0 = narrow ? sd / 2 + 4 : w * 0.07, x4 = narrow ? w - sd / 2 - 4 : w * 0.93, y = Math.round(h * (narrow ? 0.55 : 0.56));
  for (var i = 0; i < 5; i++) pts.push({ x: x0 + (x4 - x0) * i / 4, y: y });
  var d = 'M' + x0 + ' ' + y + 'L' + x4 + ' ' + y; [r0, r1, r2, r3].forEach(function (p) { p.setAttribute('d', d); });
  S.forEach(function (e, i) { e.style.left = pts[i].x + 'px'; e.style.top = pts[i].y + 'px'; });
  var sr = stage.getBoundingClientRect(), cr = scene.getBoundingClientRect(), tr = tk.getBoundingClientRect();
  var ox = cr.left - sr.left, oy = cr.top - sr.top, T = { x: tr.left - sr.left, y: tr.top - sr.top, w: tr.width, h: tr.height };
  /* where the lens lands on the line: the first point right of Follow-up that keeps it clear of the stalled card */
  /* the lens lands halfway between Follow-up and Sales call (no station) and slides onto Follow-up; while the card is
     stalled it hangs to the left of its station so the lens's path stays clear of it */
  var cw = card.offsetWidth, lr = (sd + 14) / 2, xd = pts[2].x + (pts[3].x - pts[2].x) / 2;
  var cxCold = Math.max(cw / 2, Math.min(pts[2].x, xd - lr - 10 - cw / 2));
  G = { w: w, h: h, sd: sd, narrow: narrow, pts: pts, len: x4 - x0, ox: ox, oy: oy, xd: xd, cxCold: cxCold, tk: T };
  ring.style.width = spark.style.width = (T.w + 16) + 'px'; ring.style.height = spark.style.height = (T.h + 16) + 'px';
  ring.style.left = spark.style.left = (T.x - 8) + 'px'; ring.style.top = spark.style.top = (T.y - 8) + 'px';
  /* the teal line from Client up into the ticket's lower edge */
  var cx = ox + x4, top = T.y + T.h - 6, bot = oy + y - sd / 2;
  cn.style.left = Math.round(cx - 1.5) + 'px'; cn.style.top = Math.round(top) + 'px'; cn.style.height = Math.max(0, Math.round(bot - top)) + 'px';
  return true;
}
function at(p) { var i = Math.max(0, Math.min(3, Math.floor(p))), f = p - i, a = G.pts[i], b = G.pts[i + 1]; return { x: a.x + (b.x - a.x) * f, y: a.y }; }

function render(raw) {
  if (!G) return;
  raw = ((raw % D) + D) % D;
  /* seam: fade the rail layer out on the end state, swap to frame 0 while it is invisible, fade back in */
  var t = raw, lay = 1;
  if (raw >= 6.6 && raw < 7.0) { t = 6.6; lay = 1 - sm(k(raw, 6.6, 6.95)); }
  else if (raw >= 7.0) { t = 0; lay = sm(k(raw, 7.05, 7.65)); }
  /* the label stays through the seam; everything else on the rail fades */
  railSvg.style.opacity = stns.style.opacity = mk.style.opacity = lay;
  var g = G, sd = g.sd;
  var p = 2 + eo(k(t, 2.2, 2.8)) + eo(k(t, 3.0, 3.6));          /* the card: stalled at Follow-up, then Sales call, Client */
  var fixed = t >= 1.8;
  var teal = fixed ? Math.max(1 + sm(k(t, 1.8, 2.1)), Math.min(p, 4)) : 1;
  function dash(el, v) { el.style.strokeDasharray = g.len + ' ' + g.len; el.style.strokeDashoffset = g.len * (1 - v / 4); }
  dash(r1, fixed ? 0 : 2); dash(r2, teal);
  var live = Math.round(p);
  S.forEach(function (e, i) {
    var leak = i === 2 && !fixed;
    e.classList.toggle('leak', leak); e.classList.toggle('on', !leak && teal >= i - 0.02);
    e.lastChild.style.opacity = g.narrow ? (i === live ? 1 : 0) : 1;   /* phone: one live label */
  });
  card.classList.toggle('cold', t < 1.9);
  var sub = t < 1.9 ? 'gone cold' : p < 3.5 ? 'replied' : 'now a client';
  if (csub.textContent !== sub) csub.textContent = sub;
  var cp = at(p), cw = card.offsetWidth, ch = card.offsetHeight;
  var cx = Math.max(cw / 2, Math.min(g.w - cw / 2, cp.x)), cy = cp.y - sd / 2 - 18 - ch / 2;
  cx += (g.cxCold - g.pts[2].x) * (1 - eo(k(t, 1.9, 2.5))) * (p < 2.001 || t < 2.5 ? 1 : 0);
  /* the dock: the signed card rises up the teal line into the ticket's lower edge */
  var dk = eo(k(t, 4.0, 4.7)), tkBottom = g.tk.y + g.tk.h - g.oy;
  var dy = tkBottom + ch * 0.3;
  place(card, cx, cy + (dy - cy) * dk, 0.5, 0.5, 1 - 0.4 * dk);
  show(card, (1 - sm(k(t, 4.45, 4.75))) * lay);
  exl.style.opacity = g.narrow ? 1 - 0.85 * sm(k(t, 3.95, 4.15)) * (1 - sm(k(t, 4.7, 4.9))) : 1;   /* phone: the rising card passes the label */
  cn.style.transform = 'scaleY(' + eo(k(t, 3.95, 4.65)).toFixed(3) + ')';
  show(cn, (t >= 3.95 ? 1 : 0) * lay);
  var hit = k(t, 4.62, 5.4);   /* the button answers the dock with one ring */
  var hit2 = k(t, 5.9, 6.6);   /* and a softer second ring before the loop resets */
  btn.style.boxShadow = hit > 0 && hit < 1 ? '0 0 0 ' + (14 * eo(hit)).toFixed(1) + 'px rgba(0,161,155,' + (0.45 * (1 - hit)).toFixed(3) + ')'
    : hit2 > 0 && hit2 < 1 ? '0 0 0 ' + (10 * eo(hit2)).toFixed(1) + 'px rgba(0,161,155,' + (0.28 * (1 - hit2)).toFixed(3) + ')' : '';
  /* the marker under Follow-up: Leak (brick) -> the fix (teal) */
  var mt = fixed ? 'Fix: chase 3x' : 'Leak'; if (mk.textContent !== mt) mk.textContent = mt; mk.classList.toggle('fix', fixed);
  var my = g.pts[2].y + sd / 2 + (g.narrow ? 34 : 36), mw = mk.offsetWidth;
  place(mk, Math.max(mw / 2, Math.min(g.w - mw / 2, g.pts[2].x)), my + (fixed ? 8 * (1 - eo(k(t, 1.8, 2.1))) : 0), 0.5, 0, fixed ? 1 + 0.06 * (1 - eo(k(t, 1.8, 2.1))) : 0);
  var so = sm(k(t, 3.6, 3.8)), sw = stamp.offsetWidth;
  show(stamp, so * lay); place(stamp, Math.min(g.w - sw / 2, g.pts[4].x), my + (matchMedia('(max-width:380px)').matches ? 32 : 0) + 8 * (1 - eo(k(t, 3.6, 3.9))), 0.5, 0);
  /* the ticket emits the call: a ring pulse, then the lens arcs out of the ticket onto the line and slides to the leak */
  var rp = k(t, 0.15, 0.85); ring.style.opacity = (t < 0.15 ? 0 : 0.9 * (1 - rp) * lay).toFixed(3); ring.style.transform = 'scale(' + (1 + 0.06 * eo(rp)) + ')';
  var lo = sm(k(t, 0.3, 0.5)) * (1 - sm(k(t, 2.15, 2.45))) * lay, ry = g.oy + g.pts[0].y;
  var bx = Math.max(g.tk.x + 40, Math.min(g.tk.x + g.tk.w - 40, g.ox + g.xd)), by = g.tk.y + g.tk.h - 10, ex = g.ox + g.xd, lx, ly, ls = 1;
  if (t < 0.95) { var a = k(t, 0.35, 0.95); lx = bx + (ex - bx) * sm(a); ly = by + (ry - by) * eo(a); ls = 0.6 + 0.4 * sm(k(t, 0.3, 0.6)); }
  else { var b2 = eo(k(t, 0.95, 1.45)); lx = ex + (g.ox + g.pts[2].x - ex) * b2; ly = ry; ls = 1 + 0.06 * Math.sin(Math.max(0, t - 1.45) * 14) * (1 - k(t, 1.45, 2.0)); }
  place(lens, lx, ly, 0.5, 0.5, ls); show(lens, lo); ltag.style.opacity = sm(k(t, 0.85, 1.0)) * (1 - sm(k(t, 1.65, 1.9)));   /* named once it has landed on the line */
  /* end frame alive: a spark circles the ticket while a light pulse runs the finished line */
  spark.style.opacity = (sm(k(t, 4.7, 5.0)) * lay).toFixed(3);
  spark.style.setProperty('--ba', ((t - 4.7) * 160).toFixed(1) + 'deg');
  var pl = k(t, 5.0, 6.3), pd = 70;
  r3.style.strokeDasharray = pd + ' ' + (g.len + pd); r3.style.strokeDashoffset = (pd - sm(pl) * (g.len + pd)).toFixed(1); r3.style.opacity = t >= 5.0 && t < 6.3 ? 1 : 0;
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { if (layout()) render(seeking ? t : RM ? END : t); }
window.__seek_s10 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
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
if (!RM) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
