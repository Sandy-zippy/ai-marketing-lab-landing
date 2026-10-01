var root = document.getElementById('s8');
if (!root) return;
var viz = root.querySelector('.s8-viz'), scene = root.querySelector('.s8-scene'), blk = root.querySelector('.s8-blk');
var objs = root.querySelectorAll('.s8-obj'), stages = root.querySelectorAll('.s8-stage');
var E = 'cubic-bezier(.16,1,.3,1)', state = AIML.REDUCE ? 'end' : 'pre';

function tf(x, y, r) { return 'translate(' + x + 'px,' + y + 'px) rotate(' + (r || 0) + 'deg)'; }
/* For each base: where the block rests on it (x, y) and where it hovers above it (hy). Measured, so 4-up and 2x2 both work. */
function pts() {
  var s = scene.getBoundingClientRect(), bw = blk.offsetWidth, bh = blk.offsetHeight;
  return [].map.call(objs, function (o, i) {
    var r = o.getBoundingClientRect(), st = stages[i].getBoundingClientRect();
    return { x: Math.round(r.left + r.width / 2 - bw / 2 - s.left), y: Math.round(r.top - s.top - bh), hy: Math.round(st.top - s.top + 4) };
  });
}
function place() {
  if (!scene.offsetWidth || state === 'run') return;
  var p = pts(), q = state === 'end' ? p[3] : p[0];
  blk.style.transform = tf(q.x, state === 'end' ? q.y : q.hy);
  viz.classList.toggle('s8-on', state === 'end');
}
place();
addEventListener('resize', place);
addEventListener('load', place);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(place); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(place);

AIML.onView(root, function () {
  if (AIML.REDUCE) return place();
  var p = pts(), k = [], t = 0;
  function at(x, y, r, dt) { t += dt; k.push({ transform: tf(x, y, r), offset: t, easing: E }); }
  at(p[0].x, p[0].hy, 0, 0);
  at(p[0].x, p[0].hy, 0, 0.2);
  for (var i = 0; i < 3; i++) {
    at(p[i].x, p[i].y, 0, 0.4);                                              /* lands */
    at(p[i].x, Math.max(p[i].hy, p[i].y - 34), i % 2 ? 7 : -7, 0.35);        /* bounces off */
    at(p[i + 1].x, p[i + 1].hy, 0, 0.45);                                    /* moves on */
  }
  at(p[3].x, p[3].y, 0, 0.5);                                                /* locks */
  k.forEach(function (f) { f.offset = f.offset / t; });
  state = 'run';
  var a = blk.animate(k, { duration: t * 1000, fill: 'none' });
  a.onfinish = function () { state = 'end'; place(); };
});
