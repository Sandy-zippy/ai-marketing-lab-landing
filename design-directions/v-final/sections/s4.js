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
