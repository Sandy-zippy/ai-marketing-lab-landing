/* S4 sprint loop (same pattern as s3): poster + play only while in view, paused off screen, pause button (loop > 5 s, WCAG 2.2.2).
   Reduced motion: poster only, never plays. */
(function (f) {
  var v = f && f.querySelector('video');
  if (!v || !('IntersectionObserver' in window)) { if (v && v.dataset.poster) v.poster = v.dataset.poster; return; }
  var want = !AIML.REDUCE;
  if (want) AIML.pauseBtn(f, { pause: function () { want = false; v.pause(); }, play: function () { want = true; v.play().catch(function () {}); } });
  new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return v.pause();
      if (!v.poster && v.dataset.poster) v.poster = v.dataset.poster;
      if (want) { v.preload = 'auto'; v.play().catch(function () {}); }
    });
  }, { threshold: 0.25 }).observe(f);
})(document.querySelector('#s4 .s4-loop'));
