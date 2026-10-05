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
