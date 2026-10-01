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
