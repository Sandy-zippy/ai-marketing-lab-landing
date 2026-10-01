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
