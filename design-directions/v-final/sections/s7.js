var root = document.getElementById('s7');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* The sheet arms only if it is not on screen yet, and plays when 15% of it is in view.
   Nothing here touches text opacity: the armed frame only shrinks fills and shortens strokes. */
var b = root.querySelector('.s7-sheet');
if (!b || (b.offsetParent !== null && b.getBoundingClientRect().top < innerHeight)) return;
b.classList.add('s7-arm');
new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    io.disconnect(); b.classList.add('s7-go');
    /* the last row ticks by ~1.7 s; then hand back to the plain finished frame */
    setTimeout(function () { b.classList.remove('s7-arm', 's7-go'); }, 1900);
  });
}, { threshold: 0.15 }).observe(b);
