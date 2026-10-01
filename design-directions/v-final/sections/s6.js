var root = document.getElementById('s6');
if (!root) return;
var R = AIML.REDUCE;

/* cutaways: wake the station, fill Made, then the nested Paid us block, when each comes into view */
root.querySelectorAll('.cut').forEach(function (cut) {
  if (R) return;
  cut.classList.add('arm');
  AIML.onView(cut, function () { void cut.offsetWidth; cut.classList.remove('arm'); });
});

/* sieve: 300 dots, 50 pass, then 10+ (teal). Drawn in real pixels so labels never scale. */
var box = root.querySelector('.sieve'), svg = box.querySelector('.sv'), NS = 'http://www.w3.org/2000/svg';
var W = 0, A = [], B = [], C = [], movers1 = [], movers2 = [], ghosts = [], labs = [], played = false, done = R, t0 = 0, off = false;
var PICK = []; for (var k = 0; k < 300 && PICK.length < 50; k++) if ((k * 37) % 6 === 0) PICK.push(k);

function el(n, a, p) { var e = document.createElementNS(NS, n); for (var x in a) e.setAttribute(x, a[x]); (p || svg).appendChild(e); return e; }
function grid(x, y, cols, n, step) { var o = []; for (var i = 0; i < n; i++) o.push([x + (i % cols) * step + 3, y + Math.floor(i / cols) * step + 3]); return o; }
function label(x, y, big, rest, acc) {
  /* one label = one hit-test unit: class on the <text>, the numeral marked by data-b (a classed tspan counts as a separate card in the overlap gate) */
  var t = el('text', { x: x, y: y, 'class': 'lab' });
  var b = el('tspan', { 'data-b': acc ? 'acc' : '' }, t); b.textContent = big;
  var r = el('tspan', {}, t); r.textContent = rest;
  return t;
}
function mesh(x1, y1, x2, y2) { el('line', { x1: x1, y1: y1, x2: x2, y2: y2, 'class': 'mesh' }); }

function draw() {
  W = Math.floor(svg.getBoundingClientRect().width);
  if (!W) return;
  svg.innerHTML = '';
  var wide = W >= 600, H, lab;
  if (wide) {
    var xC = W - 190, xB = Math.round((183 + xC - 87) / 2), mid = 66;
    A = grid(0, 0, 20, 300, 9); B = grid(xB, mid - 22, 10, 50, 9); C = grid(xC, mid - 12, 5, 10, 12);
    mesh((183 + xB) / 2, 0, (183 + xB) / 2, 132); mesh((xB + 87 + xC) / 2, 0, (xB + 87 + xC) / 2, 132);
    lab = [[0, 166], [xB, 166], [xC, 166]]; H = 176;
  } else {
    A = grid(0, 0, 20, 300, 9);
    mesh(0, 176, 177, 176); B = grid(0, 196, 10, 50, 9);
    mesh(0, 280, 177, 280); C = grid(0, 300, 5, 10, 12);
    lab = [[0, 160], [0, 264], [0, 346]]; H = 356;
  }
  svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); svg.setAttribute('height', H);
  ghosts = A.map(function (p) { return el('circle', { cx: p[0], cy: p[1], r: 3, 'class': done ? 'g off' : 'g' }); });
  movers1 = PICK.map(function (a, i) { var p = done ? B[i] : A[a]; return el('circle', { cx: p[0], cy: p[1], r: 3, 'class': 'm' }); });
  movers2 = C.map(function (c, i) { var p = done ? c : B[i * 5]; return el('circle', { cx: p[0], cy: p[1], r: 4.5, 'class': 'w', opacity: done ? 1 : 0 }); });
  labs = [label(lab[0][0], lab[0][1], '300', ' leads'), label(lab[1][0], lab[1][1], '50', ' qualified'), label(lab[2][0], lab[2][1], '10+', ' closed at ₹1.5L', true)];
  if (!done) { labs[1].style.opacity = 0; labs[2].style.opacity = 0; }
  if (played && !done) { done = true; draw(); }   /* resized mid-play: jump to the finished frame */
}

function ease(t) { return t >= 1 ? 1 : 1 - Math.pow(2, -10 * t); }
function mv(c, a, b, t) { c.setAttribute('cx', a[0] + (b[0] - a[0]) * t); c.setAttribute('cy', a[1] + (b[1] - a[1]) * t); }
function frame(now) {
  if (done) return;
  var s = (now - t0) / 1000;
  movers1.forEach(function (c, i) { mv(c, A[PICK[i]], B[i], ease(Math.max(0, (s - 0.4 - i * 0.012) / 1.1))); });
  movers2.forEach(function (c, i) { var t = (s - 2.0 - i * 0.04) / 1.0; if (t > 0) c.setAttribute('opacity', 1); mv(c, B[i * 5], C[i], ease(Math.max(0, t))); });
  if (s > 0.4 && !off) { off = true; ghosts.forEach(function (g) { g.setAttribute('class', 'g off'); }); }
  if (s > 1.4) labs[1].style.opacity = 1;
  if (s > 3.0) labs[2].style.opacity = 1;
  if (s < 3.6) requestAnimationFrame(frame); else done = true;
}

if ('ResizeObserver' in window) {
  var lastW = -1;
  new ResizeObserver(function () { var w = Math.floor(svg.getBoundingClientRect().width); if (w && w !== lastW) { lastW = w; draw(); } }).observe(svg);
} else { draw(); }
if (!R) AIML.onView(box, function () { if (!W) draw(); played = true; t0 = performance.now(); requestAnimationFrame(frame); });
