/* S2: route draws from the teal pin, leak pins land on it, the flag plants, the stamp lands. ~2.7 s, once.
   Arms only if the map is below the viewport when this runs; reduced motion keeps the finished frame. */
var art = document.querySelector('#s2 .s2-art');
if (!art || AIML.REDUCE || !('IntersectionObserver' in window)) return;
if (art.getBoundingClientRect().top < innerHeight) return;
art.classList.add('s2-arm');
new IntersectionObserver(function (es, io) {
  if (!es.some(function (e) { return e.isIntersecting; })) return;
  io.disconnect();
  art.classList.add('s2-go');
}, { threshold: 0.15 }).observe(art);
