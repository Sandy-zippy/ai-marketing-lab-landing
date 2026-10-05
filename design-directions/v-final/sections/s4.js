/* S4: replay the build once (bricks lay floor by floor, envelopes pour, the flag lands). Only shapes move; every label
   is static. If the visual is already on screen when this runs, it stays finished. Reduced motion: never armed. */
var viz = document.querySelector('#s4 .s4-viz');
if (!viz || AIML.REDUCE || !('IntersectionObserver' in window)) return;
var r = viz.getBoundingClientRect();
if (r.height && r.top < innerHeight) return;
viz.classList.add('armed');
new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (e.isIntersecting && viz.offsetParent !== null) { io.disconnect(); viz.classList.add('go'); }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -30% 0px' }).observe(viz);   /* the ground floor is on screen when it lays */
