var root = document.getElementById('s2b');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* Arms only if the stacks are not on screen yet; plays when 15% of them are in view. Only folder surfaces and the
   bracket move (scale from .08); every pack name stays readable on the paper the whole time. */
var v = root.querySelector('.s2b-tiers');
if (v.offsetParent !== null && v.getBoundingClientRect().top < innerHeight) return;
v.classList.add('s2b-arm');
new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    io.disconnect(); v.classList.add('s2b-go');
    setTimeout(function () { v.classList.remove('s2b-arm', 's2b-go'); }, 2400);
  });
}, { threshold: 0.15 }).observe(v);
