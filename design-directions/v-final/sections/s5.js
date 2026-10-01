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
