var root = document.getElementById('s7');
if (!root) return;
var viz = root.querySelector('.s7-viz'), box = root.querySelector('.s7-lines'), svg = box.querySelector('svg');
var win = root.querySelector('.s7-win'), front = root.querySelector('.s7-front'), days = root.querySelector('.s7-days');

/* Track + fork geometry is measured, so the lines meet the boxes at every width without stretching strokes. */
function draw() {
  var b = box.getBoundingClientRect();
  if (!b.width) return;
  var rw = win.getBoundingClientRect(), rf = front.getBoundingClientRect();
  var xu = rw.left - b.left, yu = rw.top + rw.height / 2 - b.top;
  var xl = rf.left - b.left, yl = rf.top + rf.height / 2 - b.top;
  var ym = Math.round((yu + yl) / 2), xf = Math.round(b.width * 0.42), k = xf + (Math.min(xu, xl) - xf) * 0.55;
  var P = {
    T: 'M4 ' + ym + 'H' + xf,
    U: 'M' + xf + ' ' + ym + 'C' + k + ' ' + ym + ' ' + k + ' ' + yu + ' ' + xu + ' ' + yu,
    L: 'M' + xf + ' ' + ym + 'C' + k + ' ' + ym + ' ' + k + ' ' + yl + ' ' + xl + ' ' + yl,
    K: [0.25, 0.5, 0.75].map(function (f) { var x = Math.round(4 + (xf - 4) * f); return 'M' + x + ' ' + (ym - 5) + 'v10'; }).join('')
  };
  svg.setAttribute('viewBox', '0 0 ' + b.width + ' ' + b.height);
  svg.querySelectorAll('[data-p]').forEach(function (p) { p.setAttribute('d', P[p.getAttribute('data-p')]); });
  var d = svg.querySelector('.s7-dot'), f = svg.querySelector('.s7-fk');
  d.setAttribute('cx', 4); d.setAttribute('cy', ym); f.setAttribute('cx', xf); f.setAttribute('cy', ym);
  days.style.top = (ym - 24) + 'px';
}
draw();
addEventListener('resize', draw);
addEventListener('load', draw);
document.addEventListener('aiml:reveal', function () { requestAnimationFrame(draw); });
if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);

if (!AIML.REDUCE) viz.classList.add('s7-arm');
AIML.onView(root, function () {
  draw();
  if (AIML.REDUCE) return;
  viz.classList.add('s7-go');
  var btn = AIML.pauseBtn(viz, { pause: function () { viz.classList.add('s7-hold'); }, play: function () { viz.classList.remove('s7-hold'); } });
  var notes = viz.querySelectorAll('.s7-note');
  notes[notes.length - 1].addEventListener('animationend', function () { viz.classList.remove('s7-arm', 's7-go', 's7-hold'); btn.remove(); });
});
