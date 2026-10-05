/* ---- s1 ---- */
;(function(){
/* s1 bento: static tile, no scene (the ticket tear went with the ticket, 5 Oct). */

})();
/* ---- s1b ---- */
;(function(){

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

})();
/* ---- s4 ---- */
;(function(){
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

})();
/* ---- s5 ---- */
;(function(){
/* S5: the eight week rail fills week by week.
   Only shapes move; every label is static. A rail already on screen when this runs stays finished.
   Reduced motion: never armed. */
if (AIML.REDUCE || !('IntersectionObserver' in window)) return;
[].forEach.call(document.querySelectorAll('#s5 .s5-rail'), function (el) {
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

/* case cards: when the ratio line arrives, the ink share (what they paid us) grows in from zero (s6-fill). Text never moves. */
root.querySelectorAll('.case').forEach(function (m) {
  var bar = m.querySelector('.bar');
  if (!bar || !below(bar)) return;
  m.classList.add('arm');
  watch(bar, function () { void m.offsetWidth; m.classList.remove('arm'); m.classList.add('go'); });
});
/* printing: never leave an armed fill on paper */
addEventListener('beforeprint', function () { root.querySelectorAll('.case.arm').forEach(function (r) { r.classList.remove('arm'); }); });

})();
/* ---- s7 ---- */
;(function(){
/* S7 guarantee loop (same pattern as s3): poster + play only while in view, paused off screen, pause button (loop > 5 s, WCAG 2.2.2).
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
})(document.querySelector('#s7 .s7-loop'));

})();
/* ---- s8 ---- */
;(function(){

})();
/* ---- s9 ---- */
;(function(){

})();
/* ---- s10 ---- */
;(function(){

})();
/* ---- s5b ---- */
;(function(){

})();