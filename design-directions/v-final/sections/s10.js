/* S10: deterministic render(t), t in [0,8). Seek with window.__seek_s10(t). Reduced motion = the fixed end frame.
   The s1 rail replayed, with the ticket as the cause: the 45-min call drops out of the ticket as a lens, slides along
   the line, locks on the leak; the fix lands; the card runs on to Client. Only the rail layer loops (ghost
   crossfade); the ticket and its button never move or fade. */
var stage = document.getElementById('s10-stage'), scene = document.getElementById('s10-scene');
if (!stage || !scene) return;
var D = 8, RM = AIML.REDUCE, END = 4.6;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
var Q = function (s) { return stage.querySelector(s); };
var tk = Q('.s10-tk'), card = Q('.s10-card'), csub = card.querySelector('small'), mk = Q('.s10-mk'), stamp = Q('.s10-stamp');
var lens = Q('.s10-lens'), ring = Q('.s10-ring'), spark = Q('.s10-spark'), stns = Q('.s10-stns'), r1 = Q('.r1'), r2 = Q('.r2'), r0 = Q('.r0'), r3 = Q('.r3');
var STN = ['Ad', 'Callback', 'Follow-up', 'Sales call', 'Client'];
var SV = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var ICO = [SV + '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/></svg>',
  SV + '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
  SV + '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
  SV + '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
  SV + '<path d="M20 6L9 17l-5-5"/></svg>'];
stns.innerHTML = STN.map(function (s, i) { return '<div class="s10-stn"><i>' + ICO[i] + '</i><span>' + s + '</span></div>'; }).join('');
var S = [].slice.call(stns.children);

var G = null, ghost = null;
function place(el, x, y, ax, ay, sc) { el.style.transform = 'translate(' + Math.round(x - el.offsetWidth * ax) + 'px,' + Math.round(y - el.offsetHeight * ay) + 'px)' + (sc ? ' scale(' + sc.toFixed(4) + ')' : ''); }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }
function layout() {
  var w = scene.clientWidth, h = scene.clientHeight; if (!w) return false;
  scene.style.transform = 'none';
  var sd = parseFloat(getComputedStyle(stage).getPropertyValue('--sd')) || 52, narrow = w < 600, pts = [];
  var x0 = narrow ? sd / 2 + 4 : w * 0.07, x4 = narrow ? w - sd / 2 - 4 : w * 0.93, y = Math.round(h * (narrow ? 0.55 : 0.56));
  for (var i = 0; i < 5; i++) pts.push({ x: x0 + (x4 - x0) * i / 4, y: y });
  var d = 'M' + x0 + ' ' + y + 'L' + x4 + ' ' + y; [r0, r1, r2, r3].forEach(function (p) { p.setAttribute('d', d); });
  S.forEach(function (e, i) { e.style.left = pts[i].x + 'px'; e.style.top = pts[i].y + 'px'; });
  /* stage coordinates of the rail (the lens lives on the stage so it can leave the ticket) */
  var sr = stage.getBoundingClientRect(), cr = scene.getBoundingClientRect(), tr = tk.getBoundingClientRect();
  var ox = cr.left - sr.left, oy = cr.top - sr.top;
  var xd = narrow ? pts[4].x : Math.max(pts[3].x + (pts[4].x - pts[3].x) / 2, Math.min(pts[4].x, tr.left - sr.left + tr.width / 2 - ox));
  G = { w: w, h: h, sd: sd, narrow: narrow, pts: pts, len: x4 - x0, ox: ox, oy: oy, xd: xd,
        tk: { x: tr.left - sr.left, y: tr.top - sr.top, w: tr.width, h: tr.height } };
  ring.style.width = spark.style.width = (G.tk.w + 16) + 'px'; ring.style.height = spark.style.height = (G.tk.h + 16) + 'px';
  ring.style.left = spark.style.left = (G.tk.x - 8) + 'px'; ring.style.top = spark.style.top = (G.tk.y - 8) + 'px';
  return true;
}
function at(p) { var i = Math.max(0, Math.min(3, Math.floor(p))), f = p - i, a = G.pts[i], b = G.pts[i + 1]; return { x: a.x + (b.x - a.x) * f, y: a.y }; }

function render(t) {
  if (!G) return;
  t = ((t % D) + D) % D; var raw = t;
  var X = sm(k(t, 6.9, 8)); if (ghost) ghost.style.opacity = X; scene.style.opacity = 1 - X;
  if (t >= 6.9) t = 6.9;
  var g = G, sd = g.sd;
  /* the card: stalled at Follow-up, then after the fix -> Sales call -> Client */
  var p = 2 + eo(k(t, 2.2, 2.8)) + eo(k(t, 3.0, 3.6));
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
  var cx = Math.max(cw / 2, Math.min(g.w - cw / 2, cp.x));
  place(card, cx, cp.y - sd / 2 - 18 - ch / 2, 0.5, 0.5);
  /* the marker under Follow-up: Leak (brick) -> the fix (teal) */
  var mt = fixed ? 'Fix: chase 3x' : 'Leak'; if (mk.textContent !== mt) mk.textContent = mt; mk.classList.toggle('fix', fixed);
  var my = g.pts[2].y + sd / 2 + (g.narrow ? 34 : 36), mw = mk.offsetWidth;
  place(mk, Math.max(mw / 2, Math.min(g.w - mw / 2, g.pts[2].x)), my + (fixed ? 8 * (1 - eo(k(t, 1.8, 2.1))) : 0), 0.5, 0, fixed ? 1 + 0.06 * (1 - eo(k(t, 1.8, 2.1))) : 0);
  /* Signed under Client */
  var so = sm(k(t, 3.6, 3.8)), sw = stamp.offsetWidth;
  show(stamp, so); place(stamp, Math.min(g.w - sw / 2, g.pts[4].x), my + 8 * (1 - eo(k(t, 3.6, 3.9))), 0.5, 0);
  /* the ticket emits the call: a ring pulse, then the lens drops onto the line and slides to the leak */
  var rp = k(raw, 0.45, 1.15); ring.style.opacity = raw < 0.45 ? 0 : (0.9 * (1 - rp)).toFixed(3); ring.style.transform = 'scale(' + (1 + 0.06 * eo(rp)) + ')';
  var lx, ly, ls = 1, lo = sm(k(t, 0.6, 0.8)) * (1 - sm(k(t, 2.15, 2.45)));
  var ry = g.oy + g.pts[0].y, bx = g.ox + g.xd, by = g.tk.y + g.tk.h;
  if (t < 1.15) { var a = eo(k(t, 0.7, 1.15)); lx = bx; ly = by + (ry - by) * a; ls = 0.55 + 0.45 * sm(k(t, 0.6, 0.9)); }
  else { var b2 = eo(k(t, 1.15, 1.65)); lx = bx + (g.ox + g.pts[2].x - bx) * b2; ly = ry; ls = 1 + 0.08 * Math.sin(Math.max(0, t - 1.65) * 14) * (1 - k(t, 1.65, 2.1)); }
  place(lens, lx, ly, 0.5, 0.5, ls); show(lens, lo);
  /* end frame alive: a spark circles the ticket, and a slow push on the rail (back to 1 before the seam) */
  spark.style.opacity = (sm(k(raw, 3.9, 4.2)) * (1 - sm(k(raw, 6.3, 6.7)))).toFixed(3);
  spark.style.setProperty('--ba', ((raw - 3.9) * 150).toFixed(1) + 'deg');
  /* a light pulse runs the finished line, Ad -> Client, twice while the end frame holds */
  var pl = k(t, 4.0, 5.3) < 1 ? k(t, 4.0, 5.3) : k(t, 5.3, 6.6), pd = 70, pon = t >= 4.0 && t < 6.6;
  r3.style.strokeDasharray = pd + ' ' + (g.len + pd); r3.style.strokeDashoffset = (pd - sm(pl) * (g.len + pd)).toFixed(1); r3.style.opacity = pon ? 1 : 0;
  scene.style.transform = 'scale(' + (1 + 0.025 * sm(k(t, 3.7, 5.0)) * (1 - sm(k(t, 5.6, 6.6)))) + ')';
}
function snap() {
  if (ghost) ghost.remove(); ghost = null; if (!G) return;
  render(0); scene.style.opacity = 1;
  var gh = scene.cloneNode(true); gh.removeAttribute('id'); gh.removeAttribute('role'); gh.removeAttribute('aria-label');
  gh.setAttribute('aria-hidden', 'true'); gh.style.cssText += ';position:absolute;opacity:0;pointer-events:none;left:0;top:0;width:' + G.w + 'px;height:' + G.h + 'px';   /* same grid area (rail) as the scene */
  stage.appendChild(gh); ghost = gh;
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { if (layout()) { snap(); render(seeking ? t : RM ? END : t); } }
window.__seek_s10 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
render(RM ? END : 0); refresh();
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
