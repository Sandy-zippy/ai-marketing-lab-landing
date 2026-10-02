var root = document.getElementById('s8');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* The block's home (no JS, reduced motion, finished frame) is seated on the ink base. JS only moves the block (a
   decorative token) and arms the strike strokes and the base's teal edge; every word stays readable throughout. */
var scene = root.querySelector('.s8-scene'), blk = root.querySelector('.s8-blk'), ics = root.querySelectorAll('.s8-ic');
if (scene.offsetParent !== null && scene.getBoundingClientRect().top < innerHeight) return;
var E = 'cubic-bezier(.16,1,.3,1)', HOVER = 28, running = false;
function tf(p) { return 'translate(' + p[0] + 'px,' + p[1] + 'px) rotate(' + (p[2] || 0) + 'deg)'; }
/* where the block rests on each base's top surface (data-top = fraction of the drawing's height), relative to home */
function pts() {
  var keep = blk.style.transform; blk.style.transform = '';
  var h = blk.getBoundingClientRect(); blk.style.transform = keep;
  if (!h.width) return null;
  return [].map.call(ics, function (ic) {
    var r = ic.getBoundingClientRect();
    return [Math.round(r.left + r.width / 2 - (h.left + h.width / 2)), Math.round(r.top + r.height * +ic.dataset.top - h.bottom)];
  });
}
function place() {
  if (running) return;
  var p = pts(); if (p) blk.style.transform = tf([p[0][0], p[0][1] - HOVER]);
}
scene.classList.add('s8-arm');
place();
addEventListener('load', place);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(place); });

new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting) return;
    io.disconnect();
    var p = pts(); if (!p) return;
    running = true; scene.classList.add('s8-go');
    var k = [], t = 0;
    function at(q, dt) { t += dt; k.push({ transform: tf(q), offset: t, easing: E }); }
    at([p[0][0], p[0][1] - HOVER], 0);
    at([p[0][0], p[0][1] - HOVER], 0.2);
    for (var i = 0; i < 3; i++) {
      at([p[i][0], p[i][1]], 0.35);                                  /* lands on the base */
      at([p[i][0] + 36, p[i][1] - 30, i % 2 ? 12 : -12], 0.3);       /* bounces off */
      if (i < 2) at([p[i + 1][0], p[i + 1][1] - HOVER], 0.3);        /* moves on to the next */
    }
    at([0, -HOVER * 2], 0.3);                                        /* over the ink base */
    at([0, 0], 0.3);                                                 /* lands and holds */
    k.forEach(function (f) { f.offset = f.offset / t; });
    var a = blk.animate(k, { duration: t * 1000, fill: 'forwards' });
    a.onfinish = function () { blk.style.transform = ''; a.cancel(); };
  });
}, { threshold: 0.15, rootMargin: '0px 0px -25% 0px' }).observe(scene);   /* the short desktop row must clear the fold before it hops */
