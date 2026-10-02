/* S5: the ten seats land and yours lights, then the eight week rail fills week by week and the key slides in.
   Only shapes move; every label is static. A block already on screen when this runs stays finished.
   Reduced motion: never armed. */
if (AIML.REDUCE || !('IntersectionObserver' in window)) return;
[].forEach.call(document.querySelectorAll('#s5 .s5-room, #s5 .s5-rail'), function (el) {
  var r = el.getBoundingClientRect();
  if (!r.height || r.top < innerHeight) return;
  el.classList.add('armed');
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) { if (e.isIntersecting) { io.disconnect(); el.classList.add('go');
      setTimeout(function () { el.classList.remove('armed', 'go'); }, 4000); }   /* hand back the plain finished frame */ });
  }, { threshold: 0.15 }).observe(el);
});
