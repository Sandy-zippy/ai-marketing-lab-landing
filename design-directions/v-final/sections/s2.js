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
