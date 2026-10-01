/* ---- s1 ---- */
;(function(){
var root = document.getElementById('s1');
if (root && !AIML.REDUCE) {
  root.classList.add('armed');
  AIML.onView(root, function (r) { r.classList.add('go'); });
}

})();
/* ---- s2 ---- */
;(function(){
var root = document.getElementById('s2');
if (root && !AIML.REDUCE) {
  root.classList.add('armed');
  AIML.onView(root, function (r) {
    r.classList.add('go');
    var btn = AIML.pauseBtn(r.querySelector('.s2-viz'), {
      pause: function () { r.classList.add('paused'); },
      play: function () { r.classList.remove('paused'); }
    });
    r.querySelector('.s2-slv b').addEventListener('animationend', function () { btn.remove(); });
  });
}

})();
/* ---- s2b ---- */
;(function(){
var root = document.getElementById('s2b');
if (root && !AIML.REDUCE) {
  root.classList.add('armed');
  var viz = root.querySelector('.s2b-viz');
  AIML.onView(viz, function () {
    root.classList.add('go');
    var btn = AIML.pauseBtn(viz, {
      pause: function () { root.classList.add('paused'); },
      play: function () { root.classList.remove('paused'); }
    });
    root.querySelector('.s2b-po0 .s2b-ink').addEventListener('animationend', function () { btn.remove(); });
  });
  root.querySelectorAll('.s2b-r').forEach(function (r) {
    AIML.onView(r, function () { r.classList.add('in'); });
  });
}

})();
/* ---- s3 ---- */
;(function(){
/* S3: Claude Code reads a skill file, the card flies to a station, the station wakes.
   Base CSS is the finished frame; .arm is the quiet first frame. Everything moves with WAAPI,
   so pause/play is one getAnimations() call and the end state is the plain CSS (= reduced motion). */
var root = document.getElementById('s3');
if (!root) return;
var viz = root.querySelector('.s3-viz'), scene = root.querySelector('.s3-scene');
if (!AIML.REDUCE) scene.classList.add('arm');
AIML.onView(root, function () { if (!AIML.REDUCE) play(); });

function play() {
  var E = 'cubic-bezier(.16,1,.3,1)', S = 560, T0 = 300;
  var $ = function (el, s) { return el.querySelector(s); }, $$ = function (el, s) { return [].slice.call(el.querySelectorAll(s)); };
  function A(el, kf, delay, dur, o) {
    if (!el) return null;
    o = o || {};
    return el.animate(kf, { delay: delay, duration: dur, easing: o.easing || E, fill: o.fill || 'both' });
  }
  var op = function (a, b) { return [{ opacity: a }, { opacity: b }]; };
  var from = function (t) { return [{ opacity: 0, transform: t }, { opacity: 1, transform: 'none' }]; };
  var dash = [{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }];

  /* each station's tiny action, delays relative to its wake */
  var ACT = {
    offer: function (a, w) { A($(a, '.x-sheet'), [{ transform: 'translateY(46px)' }, { transform: 'none' }], w + 80, 700); },
    content: function (a, w) { [1, 2, 3].forEach(function (n, i) { A($(a, '.x-t' + n), from('translate(-16px,10px)'), w + 80 + i * 100, 450); }); },
    email: function (a, w) {
      A($(a, '.x-e1'), from('translate(-46px,30px)'), w + 80, 650);
      A($(a, '.x-e2'), from('translate(-66px,4px)'), w + 220, 650);
    },
    linkedin: function (a, w) { A($(a, '.x-line'), dash, w + 80, 600); A($(a, '.x-dot'), op(0, 1), w + 450, 250); },
    ads: function (a, w) { [1, 2, 3].forEach(function (n, i) { A($(a, '.x-t' + n), from('translateY(-24px)'), w + 60 + i * 120, 420); }); },
    page: function (a, w) { [1, 2, 3, 4].forEach(function (n, i) { A($(a, '.x-b' + n), from('translateX(-12px)'), w + 60 + i * 90, 380); }); },
    callback: function (a, w) {
      A($(a, '.x-phone'), [0, -12, 12, -10, 10, -5, 0].map(function (d) { return { transform: 'rotate(' + d + 'deg)' }; }), w + 40, 700, { easing: 'linear' });
      A($(a, '.x-ring'), [{ opacity: 0 }, { opacity: 1, offset: .3 }, { opacity: .35, offset: .6 }, { opacity: 1 }], w + 40, 700, { easing: 'linear' });
    },
    followup: function (a, w) { [1, 2, 3].forEach(function (n, i) { A($(a, '.x-b' + n), from('translateY(10px)'), w + 60 + i * 150, 380); }); },
    sales: function (a, w, st) { A($(st, '.s3-flip-in'), [{ transform: 'rotateY(0deg)' }, { transform: 'rotateY(180deg)' }], w + 120, 700); },
    delivery: function (a, w) {
      A($(a, '.x-lid'), [{ transform: 'rotate(-38deg)' }, { transform: 'none' }], w + 60, 600);
      A($(a, '.x-check'), dash, w + 500, 300);
    },
    report: function (a, w) {
      A($(a, '.x-sheet'), [{ transform: 'translateY(50px)' }, { transform: 'none' }], w + 60, 600);
      $$(a, '.x-bar').forEach(function (b, i) { A(b, [{ transform: 'scaleY(0)' }, { transform: 'none' }], w + 420 + i * 80, 350); });
    },
    repeat: function (a, w, st) {
      A($(a, '.x-loop'), dash, w + 60, 700, { easing: 'cubic-bezier(.4,0,.2,1)' });
      A($(a, '.x-orb'), [{ transform: 'rotate(0deg)' }, { transform: 'rotate(360deg)' }], w + 60, 760, { easing: 'cubic-bezier(.4,0,.2,1)' });
      A($(a, '.x-head'), op(0, 1), w + 640, 200);
      A($(st, '.s3-tag'), op(0, 1), w + 660, 300);
    }
  };

  var sr = scene.getBoundingClientRect();
  var agent = $(scene, '.s3-agent'), card = $(scene, '.s3-card'), scan = $(scene, '.s3-scan');
  var ar = agent.getBoundingClientRect(), cr = card.getBoundingClientRect();
  var sts = $$(scene, '.s3-st'), gart = $(scene, '.s3-gart'), gr = gart.getBoundingClientRect();
  var path = [[0, 0, 0]], fly = [];
  var G = T0 + 6 * S, D = G + 900, last = 0;

  sts.forEach(function (st, i) {
    var t = i < 6 ? T0 + i * S : D + (i - 6) * S, w = t + 600, r = $(st, '.s3-art').getBoundingClientRect();
    var px = r.right - r.width * .14 - ar.left, py = r.top + r.height * .02 - ar.top;
    path.push([t + 300, px, py], [t + S, px, py]);
    /* read: a teal scan line passes over the held card */
    A(scan, [{ opacity: 0, transform: 'translateY(0)' }, { opacity: 1, offset: .2 }, { opacity: 0, transform: 'translateY(' + cr.height + 'px)' }], t + 160, 220, { fill: 'none', easing: 'linear' });
    /* the card peels off and flies into the station's plinth */
    var f = document.createElement('i'); f.className = 's3-fly'; scene.appendChild(f); fly.push(f);
    var fx = cr.left - sr.left, fy = cr.top - sr.top;
    f.style.left = fx + 'px'; f.style.top = fy + 'px';
    var tx = r.left + r.width * .5 - sr.left - fx - f.offsetWidth / 2, ty = r.top + r.height * .7 - sr.top - fy - f.offsetHeight / 2;
    A(f, [{ opacity: 1, transform: 'translate(' + px + 'px,' + py + 'px) rotate(-3deg)' },
          { opacity: 1, offset: .75, transform: 'translate(' + tx + 'px,' + ty + 'px) rotateX(55deg) scale(.55)' },
          { opacity: 0, transform: 'translate(' + tx + 'px,' + (ty + 6) + 'px) rotateX(70deg) scale(.4)' }], t + 330, 320, { fill: 'none' });
    /* wake */
    var a = $(st, '.a');
    A($(st, '.q'), op(1, 0), w, 300);
    A(a, op(0, 1), w, 300);
    A($(st, '.pl-on'), op(0, 1), w, 450);
    A($(st, '.s3-l'), op(.5, 1), w, 300);
    A($(st, '.s3-art'), [{ transform: 'translateY(6px)' }, { transform: 'none' }], w, 500);
    ACT[st.dataset.k](a, w, st);
    last = w;
  });

  /* the Yes gate: Claude Code hovers, a person token walks through, the gate lights */
  var gx = gr.left + gr.width * .62 - ar.left, gy = gr.top + gr.height * .08 - ar.top;
  path.splice(13, 0, [G + 300, gx, gy], [D, gx, gy]);
  A($(gart, '.g-tok'), [{ opacity: 0, transform: 'translate(-74px,-43px)' }, { opacity: 1, offset: .2, transform: 'translate(-58px,-34px)' }, { opacity: 1, transform: 'none' }], G + 150, 900, { easing: 'cubic-bezier(.3,0,.2,1)' });
  $$(gart, '.g-q').forEach(function (g) { A(g, op(1, 0), G + 600, 300); });
  $$(gart, '.g-a').forEach(function (g) { A(g, op(0, 1), G + 600, 300); });
  A($(gart, '.s3-yes i'), op(0, 1), G + 600, 300);

  /* Claude Code parks under Repeat buying once the last station is awake.
     The agent lives in the tilted Downstream tray, so screen deltas are corrected by measuring. */
  path.push([last + 100, path[path.length - 1][1], path[path.length - 1][2]], [last + 600, 0, 0]);
  path[0] = [0, path[1][1], path[1][2]];
  path.forEach(function (p) {
    var dx = p[1], dy = p[2], x = ar.left + p[1], y = ar.top + p[2], r;
    if (dx || dy) for (var k = 0; k < 2; k++) {
      agent.style.transform = 'translate(' + dx + 'px,' + dy + 'px)';
      r = agent.getBoundingClientRect(); dx += x - r.left; dy += y - r.top;
    }
    p[1] = dx; p[2] = dy;
  });
  agent.style.transform = '';
  var TOTAL = last + 800;
  A(agent, path.map(function (p) { return { offset: p[0] / TOTAL, transform: 'translate(' + p[1] + 'px,' + p[2] + 'px)', easing: E }; })
    .concat([{ offset: 1, transform: 'none' }]), 0, TOTAL, { easing: 'linear' });
  A(agent, op(0, 1), 0, 250, { fill: 'backwards' });

  var master = scene.animate([{ opacity: 1 }, { opacity: 1 }], { duration: TOTAL }), paused = [];
  var btn = AIML.pauseBtn(viz, {
    pause: function () { paused = scene.getAnimations({ subtree: true }).filter(function (x) { return x.playState === 'running'; }); paused.forEach(function (x) { x.pause(); }); },
    play: function () { paused.forEach(function (x) { x.play(); }); paused = []; }
  });
  master.finished.then(function () {
    scene.classList.remove('arm');
    scene.getAnimations({ subtree: true }).forEach(function (x) { x.cancel(); });
    fly.forEach(function (f) { f.remove(); });
    btn.hidden = true;
  });
}

})();
/* ---- s4 ---- */
;(function(){
/* S4: arm the scene (hidden), lay it once on view; reduced motion keeps the finished frame. */
var root = document.getElementById('s4');
var viz = root && root.querySelector('.s4-viz');
if (viz && !AIML.REDUCE) {
  viz.classList.add('armed');
  AIML.onView(root, function () {
    viz.classList.add('go');
    var btn = AIML.pauseBtn(viz, {
      pause: function () { viz.classList.add('paused'); },
      play: function () { viz.classList.remove('paused'); }
    });
    viz.querySelector('.s4-flag').addEventListener('animationend', function () { btn.remove(); });
  });
}

})();
/* ---- s5 ---- */
;(function(){
/* S5: ten seats (header band, always there) -> one lights "you" -> the desk drops in -> 8-week rail fills,
   each week drops its stations into your tray -> the key "yours" slides across the desk.
   The finished frame is plain CSS. Every animation runs FROM a start state (fill backwards) and only touches
   transform/opacity, so the frame height never changes and reduced motion / no JS = the finished frame. */
var root = document.getElementById('s5');
var viz = root && root.querySelector('.s5-viz');
if (!viz || AIML.REDUCE || !viz.animate) return;

var mob = matchMedia('(max-width:767px)').matches, EASE = 'cubic-bezier(.16,1,.3,1)', anims = [];
function A(el, kf, delay, dur) {
  var a = el.animate(kf, { duration: dur, delay: delay, easing: EASE, fill: 'backwards' });
  a.pause(); anims.push(a); return a;
}
var q = function (s) { return root.querySelector(s); };

/* 0 to 1.9 s: the room tilts flat under the camera, your seat lights, the view drops to your desk */
A(q('.s5-room'), [{ transform: 'rotateX(58deg) scale(.92)' }, { transform: 'none' }], 0, 1300);
[].forEach.call(root.querySelectorAll('.s5-lit i'), function (i) { A(i, [{ opacity: 0.25 }, { opacity: 1 }], 500, 400); });
A(q('.s5-card'), [{ opacity: 0, transform: 'translate(-50%,-12px)' }, { opacity: 1, transform: 'translate(-50%,0)' }], 750, 450);
A(q('.s5-desk'), [{ opacity: 0, transform: 'translateY(-24px) scale(1.03)' }, { opacity: 1, transform: 'none' }], 1250, 650);

/* 1.9 to 6.2 s: eight weeks, 480 ms apart */
[].forEach.call(root.querySelectorAll('.s5-wk'), function (wk, i) {
  var t = 1900 + i * 480;
  A(wk.querySelector('.s5-seg b'), [{ transform: mob ? 'scaleY(0)' : 'scaleX(0)' }, { transform: 'none' }], t, 480);
  A(wk.querySelector('.s5-wl'), [{ opacity: 0.3 }, { opacity: 1 }], t, 400);
  [].forEach.call(wk.querySelectorAll('.s5-tk'), function (tk, j) {
    A(tk, [{ opacity: 0, transform: 'translateY(-28px)' }, { opacity: 1, transform: 'none' }], t + 240 + j * 120, 480);
  });
});

/* 6.0 to 7.4 s: the closing beat, the key slides across the desk */
A(q('.s5-key'), [{ opacity: 0, transform: 'translateX(70vw)' }, { opacity: 1, transform: 'none' }], 6000, 1400);

AIML.onView(root, function () {
  anims.forEach(function (a) { a.play(); });
  var btn = AIML.pauseBtn(viz, {
    pause: function () { anims.forEach(function (a) { if (a.playState === 'running') a.pause(); }); },
    play: function () { anims.forEach(function (a) { if (a.playState === 'paused') a.play(); }); }
  });
  Promise.all(anims.map(function (a) { return a.finished; })).then(function () { btn.remove(); });
});

})();
/* ---- s6 ---- */
;(function(){
var root = document.getElementById('s6');
if (!root) return;
var R = AIML.REDUCE;

/* cutaways: wake the station, fill Made, then the nested Paid us block, when each comes into view */
root.querySelectorAll('.cut').forEach(function (cut) {
  if (R) return;
  cut.classList.add('arm');
  AIML.onView(cut, function () { void cut.offsetWidth; cut.classList.remove('arm'); });
});

/* sieve: 300 dots, 50 pass, then 10+ (teal). Drawn in real pixels so labels never scale. */
var box = root.querySelector('.sieve'), svg = box.querySelector('.sv'), NS = 'http://www.w3.org/2000/svg';
var W = 0, A = [], B = [], C = [], movers1 = [], movers2 = [], ghosts = [], labs = [], played = false, done = R, t0 = 0, off = false;
var PICK = []; for (var k = 0; k < 300 && PICK.length < 50; k++) if ((k * 37) % 6 === 0) PICK.push(k);

function el(n, a, p) { var e = document.createElementNS(NS, n); for (var x in a) e.setAttribute(x, a[x]); (p || svg).appendChild(e); return e; }
function grid(x, y, cols, n, step) { var o = []; for (var i = 0; i < n; i++) o.push([x + (i % cols) * step + 3, y + Math.floor(i / cols) * step + 3]); return o; }
function label(x, y, big, rest, acc) {
  /* one label = one hit-test unit: class on the <text>, the numeral marked by data-b (a classed tspan counts as a separate card in the overlap gate) */
  var t = el('text', { x: x, y: y, 'class': 'lab' });
  var b = el('tspan', { 'data-b': acc ? 'acc' : '' }, t); b.textContent = big;
  var r = el('tspan', {}, t); r.textContent = rest;
  return t;
}
function mesh(x1, y1, x2, y2) { el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'mesh' }); }

function draw() {
  W = Math.floor(svg.getBoundingClientRect().width);
  if (!W) return;
  svg.innerHTML = '';
  var wide = W >= 600, H, lab;
  if (wide) {
    var xC = W - 190, xB = Math.round((183 + xC - 87) / 2), mid = 66;
    A = grid(0, 0, 20, 300, 9); B = grid(xB, mid - 22, 10, 50, 9); C = grid(xC, mid - 12, 5, 10, 12);
    mesh((183 + xB) / 2, 0, (183 + xB) / 2, 132); mesh((xB + 87 + xC) / 2, 0, (xB + 87 + xC) / 2, 132);
    lab = [[0, 166], [xB, 166], [xC, 166]]; H = 176;
  } else {
    A = grid(0, 0, 20, 300, 9);
    mesh(0, 176, 177, 176); B = grid(0, 196, 10, 50, 9);
    mesh(0, 280, 177, 280); C = grid(0, 300, 5, 10, 12);
    lab = [[0, 160], [0, 264], [0, 346]]; H = 356;
  }
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('height', H);
  ghosts = A.map(function (p) { return el('circle', { cx: p[0], cy: p[1], r: 3, 'class': done ? 'g off' : 'g' }); });
  movers1 = PICK.map(function (a, i) { var p = done ? B[i] : A[a]; return el('circle', { cx: p[0], cy: p[1], r: 3, 'class': 'm' }); });
  movers2 = C.map(function (c, i) { var p = done ? c : B[i * 5]; return el('circle', { cx: p[0], cy: p[1], r: 4.5, 'class': 'w', opacity: done ? 1 : 0 }); });
  labs = [label(lab[0][0], lab[0][1], '300', ' leads'), label(lab[1][0], lab[1][1], '50', ' qualified'), label(lab[2][0], lab[2][1], '10+', ' closed at ₹1.5L', true)];
  if (!done) { labs[1].style.opacity = 0; labs[2].style.opacity = 0; }
  if (played && !done) { done = true; draw(); }   /* resized mid-play: jump to the finished frame */
}

function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function mv(c, a, b, t) { c.setAttribute('cx', a[0] + (b[0] - a[0]) * t); c.setAttribute('cy', a[1] + (b[1] - a[1]) * t); }
function frame(now) {
  if (done) return;
  var s = (now - t0) / 1000;
  movers1.forEach(function (c, i) { mv(c, A[PICK[i]], B[i], ease(Math.max(0, (s - 0.4 - i * 0.012) / 1.1))); });
  movers2.forEach(function (c, i) { var t = (s - 2.0 - i * 0.04) / 1.0; if (t > 0) c.setAttribute('opacity', 1); mv(c, B[i * 5], C[i], ease(Math.max(0, t))); });
  if (s > 0.4 && !off) { off = true; ghosts.forEach(function (g) { g.setAttribute('class', 'g off'); }); }
  if (s > 1.4) labs[1].style.opacity = 1;
  if (s > 3.0) labs[2].style.opacity = 1;
  if (s < 3.6) requestAnimationFrame(frame); else done = true;
}

if ('ResizeObserver' in window) {
  var lastW = -1;
  new ResizeObserver(function () { var w = Math.floor(svg.getBoundingClientRect().width); if (w && w !== lastW) { lastW = w; draw(); } }).observe(svg);
} else { draw(); }
if (!R) AIML.onView(box, function () { if (!W) draw(); played = true; t0 = performance.now(); requestAnimationFrame(frame); });

})();
/* ---- s7 ---- */
;(function(){
var root = document.getElementById('s7');
if (!root) return;
var viz = root.querySelector('.s7-viz'), box = root.querySelector('.s7-lines'), svg = box.querySelector('svg');
var win = root.querySelector('.s7-win'), front = root.querySelector('.s7-front'), days = root.querySelector('.s7-days');

/* Track + fork geometry is measured, so the lines meet the boxes at every width without stretching strokes. */
function draw() {
  var b = box.getBoundingClientRect();
  if (!b.width) return;
  var rw = win.getBoundingClientRect(), rf = front.getBoundingClientRect();
  var xu = rw.left - b.left, yu = rw.top + rw.height / 2 - b.top;
  var xl = rf.left - b.left, yl = rf.top + rf.height / 2 - b.top;
  var ym = Math.round((yu + yl) / 2), xf = Math.round(b.width * 0.42), k = xf + (Math.min(xu, xl) - xf) * 0.55;
  var P = {
    T: 'M4 ' + ym + 'H' + xf,
    U: 'M' + xf + ' ' + ym + 'C' + k + ' ' + ym + ' ' + k + ' ' + yu + ' ' + xu + ' ' + yu,
    L: 'M' + xf + ' ' + ym + 'C' + k + ' ' + ym + ' ' + k + ' ' + yl + ' ' + xl + ' ' + yl,
    K: [0.25, 0.5, 0.75].map(function (f) { var x = Math.round(4 + (xf - 4) * f); return 'M' + x + ' ' + (ym - 5) + 'v10'; }).join('')
  };
  svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
  svg.querySelectorAll('[data-p]').forEach(function (p) { p.setAttribute('d', P[p.getAttribute('data-p')]); });
  var d = svg.querySelector('.s7-dot'), f = svg.querySelector('.s7-fk');
  d.setAttribute('cx', 4); d.setAttribute('cy', ym); f.setAttribute('cx', xf); f.setAttribute('cy', ym);
  days.style.top = (ym - 24) + 'px';
}
draw();
addEventListener('resize', draw);
addEventListener('load', draw);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(draw); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

if (!AIML.REDUCE) viz.classList.add('s7-arm');
AIML.onView(root, function () {
  draw();
  if (AIML.REDUCE) return;
  viz.classList.add('s7-go');
  var btn = AIML.pauseBtn(viz, { pause: function () { viz.classList.add('s7-hold'); }, play: function () { viz.classList.remove('s7-hold'); } });
  var notes = viz.querySelectorAll('.s7-note');
  notes[notes.length - 1].addEventListener('animationend', function () { viz.classList.remove('s7-arm', 's7-go', 's7-hold'); btn.remove(); });
});

})();
/* ---- s8 ---- */
;(function(){
var root = document.getElementById('s8');
if (!root) return;
var viz = root.querySelector('.s8-viz'), scene = root.querySelector('.s8-scene'), blk = root.querySelector('.s8-blk');
var objs = root.querySelectorAll('.s8-obj'), stages = root.querySelectorAll('.s8-stage');
var E = 'cubic-bezier(.16,1,.3,1)', state = AIML.REDUCE ? 'end' : 'pre';

function tf(x, y, r) { return 'translate(' + x + 'px,' + y + 'px) rotate(' + (r || 0) + 'deg)'; }
/* For each base: where the block rests on it (x, y) and where it hovers above it (hy). Measured, so 4-up and 2x2 both work. */
function pts() {
  var s = scene.getBoundingClientRect(), bw = blk.offsetWidth, bh = blk.offsetHeight;
  return [].map.call(objs, function (o, i) {
    var r = o.getBoundingClientRect(), st = stages[i].getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2 - bw / 2 - s.left), y: Math.round(r.top - s.top - bh), hy: Math.round(st.top - s.top + 4) };
  });
}
function place() {
  if (!scene.offsetWidth || state === 'run') return;
  var p = pts(), q = state === 'end' ? p[3] : p[0];
  blk.style.transform = tf(q.x, state === 'end' ? q.y : q.hy);
  viz.classList.toggle('s8-on', state === 'end');
}
place();
addEventListener('resize', place);
addEventListener('load', place);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(place); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

AIML.onView(root, function () {
  if (AIML.REDUCE) return place();
  var p = pts(), k = [], t = 0;
  function at(x, y, r, dt) { t += dt; k.push({ transform: tf(x, y, r), offset: t, easing: E }); }
  at(p[0].x, p[0].hy, 0, 0);
  at(p[0].x, p[0].hy, 0, 0.2);
  for (var i = 0; i < 3; i++) {
    at(p[i].x, p[i].y, 0, 0.4);                                              /* lands */
    at(p[i].x, Math.max(p[i].hy, p[i].y - 34), i % 2 ? 7 : -7, 0.35);        /* bounces off */
    at(p[i + 1].x, p[i + 1].hy, 0, 0.45);                                    /* moves on */
  }
  at(p[3].x, p[3].y, 0, 0.5);                                                /* locks */
  k.forEach(function (f) { f.offset = f.offset / t; });
  state = 'run';
  var a = blk.animate(k, { duration: t * 1000, fill: 'none' });
  a.onfinish = function () { state = 'end'; place(); };
});

})();
/* ---- s9 ---- */
;(function(){

})();
/* ---- s10 ---- */
;(function(){

})();