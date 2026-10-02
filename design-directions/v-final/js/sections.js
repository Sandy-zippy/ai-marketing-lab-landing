/* ---- s1 ---- */
;(function(){
/* The ticket's default is the finished frame (stub torn and landed). Arm the tear only where the reader has not
   seen that frame yet: the section is revealed (it was hidden until now) or the stub is still below the fold.
   Only the stub's position is armed; no text is ever hidden. */
var root = document.getElementById('s1'), tk = root && root.querySelector('.s1-tk'), stub = root && root.querySelector('.s1-stub');
if (tk && !AIML.REDUCE) {
  var started = false;
  var play = function () {
    if (started) return; started = true;
    root.classList.add('armed');
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting) { io.disconnect(); root.classList.add('go'); }
    }, { threshold: 0.15, rootMargin: '0px 0px -25% 0px' }).observe(stub);   // the stub block, once it is in the upper three quarters of the screen
  };
  if (!tk.offsetParent) {
    document.addEventListener('aiml:reveal', function (e) { if (e.detail.stage === 'soft' && tk.offsetParent) play(); });
  } else if (stub.getBoundingClientRect().top > innerHeight) play();   // the reader has not seen the stub's resting place yet
}

})();
/* ---- s2 ---- */
;(function(){
/* S2: route draws from the teal pin, leak pins land on it, the flag plants, the stamp lands. ~2.7 s, once.
   Arms only if the map is below the viewport when this runs; reduced motion keeps the finished frame. */
var art = document.querySelector('#s2 .s2-art');
if (!art || AIML.REDUCE || !('IntersectionObserver' in window)) return;
if (art.getBoundingClientRect().top < innerHeight) return;
art.classList.add('s2-arm');
new IntersectionObserver(function (es, io) {
  if (!es.some(function (e) { return e.isIntersecting; })) return;
  io.disconnect();
  art.classList.add('s2-go');
}, { threshold: 0.15 }).observe(art);

})();
/* ---- s2b ---- */
;(function(){

})();
/* ---- s3 ---- */
;(function(){
/* S3 proof terminal: types the four output lines once when it scrolls in. Arms only if below the fold. */
(function () {
  var t = document.querySelector('#s3 .s3-tw');
  if (!t || AIML.REDUCE || !('IntersectionObserver' in window) || t.getBoundingClientRect().top < innerHeight) return;
  t.classList.add('s3-typ');
  new IntersectionObserver(function (es, io) {
    if (!es[0].isIntersecting) return;
    io.disconnect(); t.classList.add('s3-go');
  }, { threshold: 0.6 }).observe(t);
})();
/* S3: Claude Code rides the track with a skill file. Each station ticks as it passes, the Yes stamp lands and the
   client walks out from under it, and the track runs on into the "buys again" loop. Base CSS is the finished frame;
   JS arms only when the board is below the fold, and only strokes, the tick discs and the two decorative tokens.
   900px+: one run (~3.2 s) once the whole board is on screen. Phone: two legs (Upstream, then gate + Downstream +
   loop), each starting when its own lane scrolls in, so nothing plays below the fold.
   Pacing is per segment, not per pixel: a station hop and a long connector cost about the same. */
var root = document.getElementById('s3');
if (!root || AIML.REDUCE) return;
var board = root.querySelector('.s3-board');
var NS = 'http://www.w3.org/2000/svg';

function decide() {
  if (board.getBoundingClientRect().top < innerHeight) return;   /* already in view: leave it finished */
  board.classList.add('s3-arm');
  var wide = matchMedia('(min-width:900px)').matches, ready = null;
  function watch(el, i, opt) {
    new IntersectionObserver(function (es, io) {
      if (!es.some(function (e) { return e.isIntersecting; })) return;
      io.disconnect();
      if (!ready) ready = build();
      ready.go(i);
    }, opt).observe(el);
  }
  /* desktop: fire when (nearly) all of the board is visible, so the loop and the parking happen on screen */
  if (wide) watch(board, 0, { threshold: Math.min(0.98, (innerHeight - 24) / board.offsetHeight) });
  else {
    watch(board.querySelector('.s3-up'), 0, { rootMargin: '0px 0px -30% 0px' });
    watch(board.querySelector('.s3-down'), 1, { rootMargin: '0px 0px -30% 0px' });
  }
}
if (board.offsetParent !== null) decide();
else document.addEventListener('aiml:reveal', function f() {
  if (board.offsetParent === null) return;
  document.removeEventListener('aiml:reveal', f);
  decide();
});

/* geometry is measured once, at the first trigger; legs then play in order, never overlapping */
function build() {
  var B = board.getBoundingClientRect();
  var $ = function (s) { return board.querySelector(s); };
  var R = function (el) { var r = el.getBoundingClientRect(); return { l: r.left - B.left, t: r.top - B.top, r: r.right - B.left, b: r.bottom - B.top, w: r.width, h: r.height }; };
  var sts = [].slice.call(board.querySelectorAll('.s3-st'));
  var plinth = function (st) { var a = R(st.querySelector('.s3-art')); return [a.l + a.w / 2, a.t + a.h * 86 / 120]; };
  var wide = matchMedia('(min-width:900px)').matches;

  /* pts = the track the trace draws; the runner follows pts up to restAt, then (phone) steps off to its parking spot */
  var pts = [], marks = [], restAt, cut;
  function add(p, m) { pts.push(p); if (m) marks.push({ i: pts.length - 1, m: m }); }
  var y = R($('.s3-yes')), gc = [y.l + y.w / 2, y.t + y.h / 2];
  board.classList.add('s3-go');                      /* the runner's parked spot */
  var run = $('.s3-run'), rr = R(run), rest = [rr.l, rr.t];
  var h = (parseFloat(getComputedStyle(board).getPropertyValue('--tw')) || 3) / 2;   /* half the track width: border centre lines */
  if (wide) {
    var t1 = R($('.s3-t1')), t3 = R($('.s3-t3')), lp = R($('.s3-lp'));
    sts.slice(0, 6).forEach(function (st) { add(plinth(st), st); });
    var uy = pts[0][1];
    add([t1.r - h, uy]); add([t1.r - h, t1.b - h]); add([gc[0], t1.b - h], 'gate'); add([t3.l + h, t3.t + h]); add([t3.l + h, t3.b - h]);
    sts.slice(6).forEach(function (st) { add(plinth(st), st); });
    var dy = pts[pts.length - 1][1];
    /* the loop; Claude Code parks on its bottom-left corner, the trace runs on up into the track */
    add([lp.r - h, dy]); add([lp.r - h, lp.b - h]); add([lp.l + h, lp.b - h]); restAt = pts.length - 1;
    add([lp.l + h, dy]);
    cut = [0, pts.length - 1];
  } else {
    var l2 = R($('.s3-lp')), g0 = R($('.s3-up')).b;
    sts.slice(0, 6).forEach(function (st) { add(plinth(st), st); });
    add([pts[0][0], g0 + 50]); var park1 = pts.length - 1;     /* leg 1 parks in the empty band above the stamp */
    add([pts[0][0], gc[1]], 'gate');
    sts.slice(6).forEach(function (st) { add(plinth(st), st); });
    restAt = pts.length - 1;
    var ry = pts[restAt][1];
    add([l2.r - h, ry]); add([l2.r - h, l2.t + h]); add([l2.l, l2.t + h]);   /* the loop, round the right edge */
    cut = [0, park1, pts.length - 1];
  }

  /* the trace path: corners as true circular arcs so it lies exactly on the rounded track underneath.
     cum = distance along the REAL path (an arc corner is (2 - pi/2) * r shorter than the polyline). */
  var RAD = wide ? 24 : 12, f = function (p) { return p[0].toFixed(1) + ' ' + p[1].toFixed(1); }, d = 'M' + f(pts[0]);
  var cum = [0], saved = 0, tm = [0];
  for (var j = 1; j < pts.length; j++) {
    var a = pts[j - 1], p = pts[j], b = pts[j + 1], la = Math.hypot(p[0] - a[0], p[1] - a[1]);
    var lb = b ? Math.hypot(b[0] - p[0], b[1] - p[1]) : 0, cross = b ? (p[0] - a[0]) * (b[1] - p[1]) - (p[1] - a[1]) * (b[0] - p[0]) : 0;
    var r = Math.min(RAD, la / 2, lb / 2), corner = b && la && lb && Math.abs(cross) > 1e-3 * la * lb;
    cum.push(cum[j - 1] + la - (corner ? (2 - Math.PI / 2) * r / 2 : 0) - saved);
    saved = corner ? (2 - Math.PI / 2) * r / 2 : 0;
    tm.push(tm[j - 1] + Math.max(150, Math.min(260, 50 + la * 0.5)));  /* ms for this segment: never a flicker */
    if (!corner) { d += 'L' + f(p); continue; }
    d += 'L' + f([p[0] - (p[0] - a[0]) / la * r, p[1] - (p[1] - a[1]) / la * r]) +
         'A' + r + ' ' + r + ' 0 0 ' + (cross > 0 ? 1 : 0) + ' ' + f([p[0] + (b[0] - p[0]) / lb * r, p[1] + (b[1] - p[1]) / lb * r]);
  }
  var LEN = cum[cum.length - 1];
  var svg = document.createElementNS(NS, 'svg'), path = document.createElementNS(NS, 'path'), beam = document.createElementNS(NS, 'path');
  svg.setAttribute('class', 's3-trace'); svg.setAttribute('aria-hidden', 'true');
  [path, beam].forEach(function (q) { q.setAttribute('d', d); q.setAttribute('pathLength', LEN.toFixed(1)); svg.appendChild(q); });
  path.style.strokeDasharray = LEN + ' ' + LEN; path.style.strokeDashoffset = LEN;
  beam.setAttribute('class', 's3-beam'); beam.style.strokeDasharray = '72 ' + (LEN * 2); beam.style.strokeDashoffset = 72;
  board.insertBefore(svg, board.firstChild);

  var E = 'cubic-bezier(.16,1,.3,1)', who = $('.s3-who'), whoFrom = getComputedStyle(who).transform, stamp = $('.s3-yes');
  var played = 0, busy = Promise.resolve(), nLegs = cut.length - 1, runAnim = null;
  var kf = function (A, Z, val) {   /* keyframes A..Z on the leg's own clock */
    return pts.slice(A, Z + 1).map(function (q, n) { return { offset: Z > A ? (tm[A + n] - tm[A]) / (tm[Z] - tm[A]) : 1, v: val(A + n, q) }; });
  };

  function leg(k) {
    var A = cut[k], Z = cut[k + 1], dur = tm[Z] - tm[A], end = dur;
    path.animate(kf(A, Z, function (i) { return LEN - cum[i]; }).map(function (x) { return { offset: x.offset, strokeDashoffset: x.v }; }), { duration: dur, fill: 'forwards' });
    beam.animate(kf(A, Z, function (i) { return 72 - cum[i]; }).map(function (x) { return { offset: x.offset, strokeDashoffset: x.v }; }), { duration: dur, fill: 'forwards' });
    var rz = Math.min(Z, restAt);
    if (rz > A) {
      var frames = kf(A, rz, function (i, q) { return 'translate(' + (q[0] - rest[0]) + 'px,' + (q[1] - rest[1]) + 'px)'; })
        .map(function (x) { return { offset: x.offset, transform: x.v }; }), rdur = tm[rz] - tm[A];
      if (rz === restAt && (pts[restAt][0] !== rest[0] || pts[restAt][1] !== rest[1])) {   /* phone: step off the track into the park row */
        frames.forEach(function (x) { x.offset = x.offset * rdur / (rdur + 220); });
        frames.push({ offset: 1, transform: 'none' }); rdur += 220;
      }
      /* one runner animation at a time: a replaced fill-forward animation comes back when its successor is cancelled */
      if (runAnim) runAnim.cancel();
      runAnim = run.animate(frames, { duration: rdur, easing: 'linear', fill: 'both' });
    }
    marks.forEach(function (m) {
      if (m.i < A || m.i > Z || (m.i === A && A > 0)) return;
      var t = tm[m.i] - tm[A];
      if (m.m === 'gate') {
        stamp.animate([{ transform: 'scale(1.5)' }, { transform: 'scale(.94)', offset: .6 }, { transform: 'none' }], { delay: t - 60, duration: 360, easing: 'ease-out' });
        who.animate([{ transform: whoFrom }, { transform: 'none' }], { delay: t + 120, duration: 520, easing: E, fill: 'both' });
        end = Math.max(end, t + 640);
        return;
      }
      m.m.querySelector('.s3-bd').animate([{ opacity: 0, transform: 'scale(.5)' }, { opacity: 1, transform: 'scale(1)' }], { delay: t, duration: 260, easing: E, fill: 'both' });
      m.m.querySelector('.s3-ck').animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { delay: t + 90, duration: 240, easing: 'ease-out', fill: 'both' });
      m.m.querySelector('.s3-art').animate([{ transform: 'none' }, { transform: 'translateY(-6px)', offset: .35 }, { transform: 'none' }], { delay: t, duration: 380, easing: 'ease-out' });
      end = Math.max(end, t + 400);
    });
    return new Promise(function (res) { setTimeout(res, end); });
  }
  function finish() {
    board.classList.remove('s3-arm', 's3-go');
    board.getAnimations({ subtree: true }).forEach(function (x) { if (x.effect.target !== path && x.effect.target !== beam) x.cancel(); });
    beam.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 300, fill: 'forwards' });
    setTimeout(function () { svg.remove(); }, 400);   /* the track's own teal fades in under the trace first */
  }
  return {
    go: function (k) {
      busy = busy.then(function () {
        /* a later leg that triggers first (fast scroll) plays every leg before it */
        var chain = Promise.resolve();
        while (played <= k) { (function (n) { chain = chain.then(function () { return leg(n); }); })(played); played++; }
        return chain.then(function () { if (played === nLegs) finish(); });
      });
    }
  };
}

})();
/* ---- s4 ---- */
;(function(){
/* S4: replay the build once (bricks lay floor by floor, envelopes pour, the flag lands). Only shapes move; every label
   is static. If the visual is already on screen when this runs, it stays finished. Reduced motion: never armed. */
var viz = document.querySelector('#s4 .s4-viz');
if (!viz || AIML.REDUCE || !('IntersectionObserver' in window)) return;
var r = viz.getBoundingClientRect();
if (r.height && r.top < innerHeight) return;
viz.classList.add('armed');
new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (e.isIntersecting && viz.offsetParent !== null) { io.disconnect(); viz.classList.add('go'); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30% 0px' }).observe(viz);   /* the ground floor is on screen when it lays */

})();
/* ---- s5 ---- */
;(function(){
/* S5: the ten seats land and yours lights, then the eight week rail fills week by week and the key slides in.
   Only shapes move; every label is static. A block already on screen when this runs stays finished.
   Reduced motion: never armed. */
if (AIML.REDUCE || !('IntersectionObserver' in window)) return;
[].forEach.call(document.querySelectorAll('#s5 .s5-room, #s5 .s5-rail'), function (el) {
  var r = el.getBoundingClientRect();
  if (!r.height || r.top < innerHeight) return;
  el.classList.add('armed');
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); el.classList.add('go');
      setTimeout(function () { el.classList.remove('armed', 'go'); }, 4000); }   /* hand back the plain finished frame */ });
  }, { threshold: 0.15 }).observe(el);
});

})();
/* ---- s6 ---- */
;(function(){
var root = document.getElementById('s6');
if (!root) return;
/* Sami's video: with JS the native chrome waits for the first tap, so a drawn play glyph is the only play icon;
   without JS the native controls stay. The box is the button until the video has its own controls. */
var vb = root.querySelector('.vid-box'), vv = vb && vb.querySelector('video');
if (vv) {
  vv.controls = false; vb.classList.add('tap');
  vb.tabIndex = 0; vb.setAttribute('role', 'button'); vb.setAttribute('aria-label', 'Play: Sami, Scale Your Results');
  function start() { if (vv.controls) return; vv.controls = true; vb.removeAttribute('role'); vb.removeAttribute('tabindex'); vb.removeAttribute('aria-label'); vv.play(); }
  vb.addEventListener('click', start);
  vb.addEventListener('keydown', function (e) { if (!vv.controls && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(); } });
  vv.addEventListener('play', function () { vb.classList.add('on'); if (!vv.controls) start(); }, { once: true });
}

if (AIML.REDUCE) return;   /* reduced motion: the finished frame in the HTML/CSS is the whole story */

/* arm only what the reader has not seen yet: hidden (section not revealed) or below the fold */
function below(el) { return el.offsetParent === null || el.getBoundingClientRect().top > innerHeight; }
function watch(el, fn) {
  if (!('IntersectionObserver' in window)) return fn();
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting && e.target.offsetParent !== null) { io.disconnect(); fn(); } });
  }, { threshold: 0.15 }).observe(el);
}

/* ledger rows: the bar fills (what they made), then the teal share grows in (s6-fill). Text never moves. */
root.querySelectorAll('.row').forEach(function (row) {
  var m = row.querySelector('.money');
  if (!below(m)) return;
  row.classList.add('arm');
  watch(m, function () { void row.offsetWidth; row.classList.remove('arm'); row.classList.add('go'); });
});

/* sieve: the dot grids are CSS and always on screen. Armed, the 300 are ink and the 50 / 10 slots are grey;
   on view, 50 ink tokens fly out of the 300 into their slots, then 10 teal tokens drop from the 50 into theirs.
   Labels are HTML and never touched. */
var box = root.querySelector('.sieve'), sg = box.querySelector('.sg'), NS = 'http://www.w3.org/2000/svg';
var PICK = []; for (var k = 0; k < 50; k++) PICK.push(k * 6 + k % 5);   /* 50 of 300, spread over every row at 20 or 30 columns */
var svg = null, run = false;

/* the tokens sit exactly on their now-coloured slots: fade the token layer out, then drop it */
function land() { run = false; if (!svg) return; var s = svg; svg = null; s.classList.add('out'); setTimeout(function () { s.remove(); }, 200); }
function finish() { run = false; box.classList.remove('a300', 'a50', 'a10'); if (svg) { svg.remove(); svg = null; } }
/* dot centres of a CSS grid: cols x n, tile t, measured from the grid's box relative to .sg */
function pts(sel, cols, n) {
  var d = sg.querySelector(sel + ' .dots'), cs = getComputedStyle(d), t = parseFloat(cs.getPropertyValue('--t')) || 9;
  cols = parseInt(cs.getPropertyValue('--c'), 10) || cols;
  var o = sg.getBoundingClientRect(), r = d.getBoundingClientRect(), a = [];
  a.t = t;
  for (var i = 0; i < n; i++) a.push([r.left - o.left + (i % cols) * t + t / 2, r.top - o.top + Math.floor(i / cols) * t + t / 2]);
  return a;
}
function play() {
  var A = pts('.s300', 20, 300), B = pts('.s50', 10, 50), C = pts('.s10', 5, 10);   /* cols are the fallback; CSS --c wins */
  svg = document.createElementNS(NS, 'svg'); svg.setAttribute('class', 'fly'); svg.setAttribute('aria-hidden', 'true');
  sg.appendChild(svg);
  function dot(p, r, c) { var e = document.createElementNS(NS, 'circle'); e.setAttribute('cx', p[0]); e.setAttribute('cy', p[1]); e.setAttribute('r', r); e.setAttribute('class', c); svg.appendChild(e); return e; }
  var m1 = PICK.map(function (a) { return dot(A[a], A.t * 0.3, 'm'); }), m2 = null;
  function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
  function mv(c, a, b, t) { c.setAttribute('cx', a[0] + (b[0] - a[0]) * t); c.setAttribute('cy', a[1] + (b[1] - a[1]) * t); }
  var t0 = performance.now(); run = true;
  (function frame(now) {
    if (!run) return;
    var s = (now - t0) / 1000;
        m1.forEach(function (c, i) { mv(c, A[PICK[i]], B[i], ease(Math.max(0, (s - 0.2 - (PICK[i] % 10) * 0.04 - i * 0.004) / 1.1))); });
    if (s > 1.0) box.classList.remove('a300');   /* the 300 grey out once the 50 are on their way */
    if (s > 1.9 && !m2) { box.classList.remove('a50'); m2 = C.map(function (c, i) { return dot(B[i * 5 + (i * 3) % 5], C.t / 3, 'w'); }); }
    if (m2) m2.forEach(function (c, i) { mv(c, B[i * 5 + (i * 3) % 5], C[i], ease(Math.max(0, (s - 2.0 - i * 0.04) / 1.0))); });
    if (s < 3.4) requestAnimationFrame(frame); else { box.classList.remove('a10'); land(); }
  })(t0);
}
if (below(box)) {
  box.classList.add('a300', 'a50', 'a10');
  watch(sg, play);
  var w0 = innerWidth;   /* phones fire resize when the URL bar collapses mid-scroll: only a width change moves the grids */
  addEventListener('resize', function () { if (innerWidth !== w0 && (run || box.classList.contains('a50'))) finish(); });
}
/* printing: never leave an armed fill on paper */
addEventListener('beforeprint', function () { finish(); root.querySelectorAll('.row.arm').forEach(function (r) { r.classList.remove('arm'); }); });

})();
/* ---- s7 ---- */
;(function(){
var root = document.getElementById('s7');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* Each block (the sheet, the fork) arms only if it is not on screen yet, and plays when 15% of it is in view.
   Nothing here touches text opacity: the armed frame only shortens strokes, shrinks fills and moves the notes. */
var sheet = root.querySelector('.s7-sheet'), fork = root.querySelector('.s7-fork'), armed = {};
[sheet, fork].forEach(function (b, i) {
  if (b.offsetParent !== null && b.getBoundingClientRect().top < innerHeight) return;
  armed[i] = true;
  b.classList.add('s7-arm');
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.disconnect(); b.classList.add('s7-go');
      /* the longest chain (fork after the sheet) ends at 3.8 s; then hand back to the plain finished frame */
      setTimeout(function () { b.classList.remove('s7-arm', 's7-go', 's7-after'); }, 3900);
    });
  }, { threshold: 0.15 }).observe(b);
});
/* sheet first, then the fork: when both play, the fork waits for the last row to tick */
if (armed[0] && armed[1]) fork.classList.add('s7-after');

})();
/* ---- s8 ---- */
;(function(){
var root = document.getElementById('s8');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* The block's home (no JS, reduced motion, finished frame) is seated on the ink base. JS only moves the block (a
   decorative token) and arms the strike strokes and the base's teal edge; every word stays readable throughout. */
var scene = root.querySelector('.s8-scene'), blk = root.querySelector('.s8-blk'), ics = root.querySelectorAll('.s8-ic');
if (scene.offsetParent !== null && scene.getBoundingClientRect().top < innerHeight) return;
var E = 'cubic-bezier(.16,1,.3,1)', HOVER = 28, running = false;
function tf(p) { return 'translate(' + p[0] + 'px,' + p[1] + 'px) rotate(' + (p[2] || 0) + 'deg)'; }
/* where the block rests on each base's top surface (data-top = fraction of the drawing's height), relative to home */
function pts() {
  var keep = blk.style.transform; blk.style.transform = '';
  var h = blk.getBoundingClientRect(); blk.style.transform = keep;
  if (!h.width) return null;
  return [].map.call(ics, function (ic) {
    var r = ic.getBoundingClientRect();
    return [Math.round(r.left + r.width / 2 - (h.left + h.width / 2)), Math.round(r.top + r.height * +ic.dataset.top - h.bottom)];
  });
}
function place() {
  if (running) return;
  var p = pts(); if (p) blk.style.transform = tf([p[0][0], p[0][1] - HOVER]);
}
scene.classList.add('s8-arm');
place();
addEventListener('load', place);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(place); });

new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    io.disconnect();
    var p = pts(); if (!p) return;
    running = true; scene.classList.add('s8-go');
    var k = [], t = 0;
    function at(q, dt) { t += dt; k.push({ transform: tf(q), offset: t, easing: E }); }
    at([p[0][0], p[0][1] - HOVER], 0);
    at([p[0][0], p[0][1] - HOVER], 0.2);
    for (var i = 0; i < 3; i++) {
      at([p[i][0], p[i][1]], 0.35);                                  /* lands on the base */
      at([p[i][0] + 36, p[i][1] - 30, i % 2 ? 12 : -12], 0.3);       /* bounces off */
      if (i < 2) at([p[i + 1][0], p[i + 1][1] - HOVER], 0.3);        /* moves on to the next */
    }
    at([0, -HOVER * 2], 0.3);                                        /* over the ink base */
    at([0, 0], 0.3);                                                 /* lands and holds */
    k.forEach(function (f) { f.offset = f.offset / t; });
    var a = blk.animate(k, { duration: t * 1000, fill: 'forwards' });
    a.onfinish = function () { blk.style.transform = ''; a.cancel(); };
  });
}, { threshold: 0.15, rootMargin: '0px 0px -25% 0px' }).observe(scene);   /* the short desktop row must clear the fold before it hops */

})();
/* ---- s9 ---- */
;(function(){

})();
/* ---- s10 ---- */
;(function(){

})();