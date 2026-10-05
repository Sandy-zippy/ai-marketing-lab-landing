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
/* S3 system loop: poster + play only while in view, paused off screen, pause button (loop > 5 s, WCAG 2.2.2).
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
})(document.querySelector('#s3 .s3-loop'));
