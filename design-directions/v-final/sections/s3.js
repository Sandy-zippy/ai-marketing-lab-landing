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
