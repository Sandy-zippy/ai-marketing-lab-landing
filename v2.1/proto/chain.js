/* The chain, in 3D. render(t) is a pure function of t in [0, D). Six forged links, alternating planes like a real chain.
   An open link has a visible gap where it should hold the next one. Each pass: the links that fix repairs forge shut, a
   lead runs along the chain and falls through the first open link (the reason in brick under it). The fifth pass forges
   every link, the lead reaches Client, the counter lands on 1. Usage: CH3(root, THREE, REDUCE, cards) -> { play, pause, seek } */
window.CH3 = function (root, T, REDUCE, cards) {
  var cv = root.querySelector('canvas'), box = root.querySelector('.c3-v');
  var kx = root.querySelector('.ch-k'), fx = root.querySelector('.ch-f'), out = root.querySelector('.ch-out'), ob = out.querySelector('b');
  var tags = [].slice.call(root.querySelectorAll('.c3-tag'));
  var r; try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { return null; }
  if (!r.getContext()) return null;
  r.setClearColor(0, 0);
  var scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 100);
  scene.add(new T.HemisphereLight(0xd8fffb, 0x041314, 1.0));
  var key = new T.DirectionalLight(0xffffff, 2.2); key.position.set(-3, 6, 7); scene.add(key);
  var rim = new T.DirectionalLight(0x3fe0d6, 1.6); rim.position.set(4, -2, -5); scene.add(rim);
  var glow = new T.PointLight(0x3fe0d6, 0, 4, 1.5); scene.add(glow);

  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function k(t, a, b) { return cl((t - a) / (b - a)); }
  function sm(x) { return x * x * (3 - 2 * x); }
  function eo(x) { return 1 - Math.pow(1 - x, 4); }
  function lerp(a, b, x) { return a + (b - a) * x; }

  var PASS = [
    { k: 'Fix 1 of 4:', f: 'More content', fix: [0], brk: 1, why: 'nowhere to land' },
    { k: 'Fix 2 of 4:', f: 'An agency for the ads', fix: [0, 1], brk: 2, why: 'nobody calls back' },
    { k: 'Fix 3 of 4:', f: 'Doing it yourself', fix: [0, 1, 2], brk: 3, why: 'you’re delivering' },
    { k: 'Fix 4 of 4:', f: 'A chat window', fix: [0], brk: 1, why: 'a caption, no list' },
    { k: 'Upstream Downstream:', f: 'every link written down', fix: [0, 1, 2, 3, 4, 5], brk: -1 }
  ];
  var FG = .26, SEG = .36, FALL = .95;
  /* timeline: each pass = intro .35, forge, travel, (fall + hold | win hold), reopen .35 */
  var t0 = 0;
  PASS.forEach(function (p) {
    p.t0 = t0; p.fs = t0 + .35; p.fe = p.fs + p.fix.length * FG + .15;
    p.n = p.brk < 0 ? 5.6 : p.brk + .45;            /* links travelled */
    p.te = p.fe + p.n * SEG;
    p.end = p.te + (p.brk < 0 ? 2.9 : FALL + 1.25) + .35;
    t0 = p.end;
  });
  var D = t0;

  /* links */
  var PITCH = 1.5, R = .6, TUBE = .12, SX = 1.42, GAP = 1.15, Q = 18, geos = [];
  function geo(c) { var q = Math.round(cl(c) * Q); if (!geos[q]) { var g = GAP * (1 - q / Q); geos[q] = new T.TorusGeometry(R, TUBE, 18, 72, Math.PI * 2 - g); geos[q].rotateZ(g / 2 + .95); } return geos[q]; }
  var chain = new T.Group(); chain.rotation.order = 'ZYX'; scene.add(chain);
  var teal = new T.Color('#33d6cb'), dull = new T.Color('#2b4847'), brick = new T.Color('#ff7a6e');
  var links = [];
  for (var i = 0; i < 6; i++) {
    var m = new T.Mesh(geo(0), new T.MeshStandardMaterial({ color: dull.clone(), metalness: .35, roughness: .32, emissive: new T.Color(0) }));
    m.scale.x = SX; m.position.x = (i - 2.5) * PITCH; if (i % 2) m.rotation.x = Math.PI / 2;
    chain.add(m); links.push(m);
  }
  function A(j) { return (j - 2.5) * PITCH; }   /* axis position of link j */

  /* the lead */
  var lead = new T.Mesh(new T.SphereGeometry(.13, 24, 16), new T.MeshBasicMaterial({ color: 0xffffff, transparent: true }));
  scene.add(lead);
  var halo = new T.Sprite(new T.SpriteMaterial({ map: (function () { var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(63,224,214,.95)'); gr.addColorStop(1, 'rgba(63,224,214,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })(), transparent: true, depthWrite: false, depthTest: false }));
  scene.add(halo);

  var W = 0, H = 0, vert = false;
  function layout() {
    W = box.clientWidth; H = box.clientHeight; if (!W) return;
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(W, H, false);
    cam.aspect = W / H; cam.updateProjectionMatrix();
    vert = W / H < .9;
    chain.rotation.z = vert ? -Math.PI / 2 : 0; chain.rotation.x = vert ? .5 : .18;
    chain.position.set(vert ? -.55 : 0, 0, 0);
    root.classList.toggle('c3-vert', vert);
  }
  var v = new T.Vector3();
  function world(a) { v.set(a, 0, 0); chain.updateMatrixWorld(true); return chain.localToWorld(v.clone()); }
  function proj(p) { var q = p.clone().project(cam); return [(q.x + 1) / 2 * W, (1 - q.y) / 2 * H]; }

  function render(t) {
    t = ((t % D) + D) % D;
    var n = 0; while (n < PASS.length - 1 && t >= PASS[n].end) n++;
    var p = PASS[n], win = p.brk < 0, reopen = sm(k(t, p.end - .35, p.end));
    /* link state: closed amount c, flash f */
    var lit = [];
    links.forEach(function (m, j) {
      var fi = p.fix.indexOf(j), c = 0, f = 0;
      if (fi > -1) { var a = p.fs + fi * FG; c = eo(k(t, a, a + .3)); f = k(t, a + .1, a + .3) * (1 - k(t, a + .3, a + .9)); }
      c *= 1 - reopen;
      m.geometry = geo(c);
      var col = m.material.color.copy(dull).lerp(teal, c), em = m.material.emissive.setRGB(0, 0, 0);
      em.copy(teal).multiplyScalar(.15 * c + .9 * f);
      if (j === p.brk) { var b = sm(k(t, p.te, p.te + .25)) * (1 - reopen); col.lerp(brick, .55 * b); em.copy(brick).multiplyScalar(.35 * b); }
      if (win && j === 5) { var wv = sm(k(t, p.te - .1, p.te + .4)) * (1 - reopen); em.copy(teal).multiplyScalar(.15 + .85 * wv); }
      lit.push(c);
    });

    /* lead: travels the axis, falls through the open link or lands on Client */
    var a0 = A(0) - .95, a1 = win ? A(5) : A(p.brk) + .5;
    var tr = k(t, p.fe, p.te), a = lerp(a0, a1, sm(tr)), pos = world(a), op = sm(k(t, p.fe - .25, p.fe));
    if (!win && t > p.te) {
      var tf = t - p.te; pos.y -= 4.2 * tf * tf; pos.z += 1.1 * tf; pos.x += (vert ? 1.6 : .5) * tf;
      op *= 1 - k(tf, .45, FALL);
    }
    if (win) op *= 1 - k(t, p.te + 1.2, p.te + 1.6);
    op *= 1 - reopen;
    lead.position.copy(pos); halo.position.copy(pos);
    lead.material.opacity = op; halo.material.opacity = op; halo.scale.setScalar(win && t > p.te ? .9 + 1.4 * sm(k(t, p.te, p.te + .5)) : .9);
    glow.position.set(pos.x, pos.y + .3, pos.z + .9); glow.intensity = 5 * op;

    /* camera: a slow dolly that leans toward the lead */
    var lx = vert ? 0 : cl((a - a0) / (A(5) - a0)) - .5, drift = Math.sin(t * .35) * .5;
    var fitW = vert ? 5.2 : 10.4, hf = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect), dist = fitW / 2 / Math.tan(hf / 2);
    if (vert) dist = Math.max(dist, 10.2 / 2 / Math.tan(cam.fov * Math.PI / 360));
    var yaw = (vert ? -8 : -5 + 6 * lx + drift * 3) * Math.PI / 180, pit = (vert ? 10 : 14) * Math.PI / 180, tx = vert ? .35 : lx * .5, ty = vert ? 0 : -.15;
    cam.position.set(tx + dist * Math.cos(pit) * Math.sin(yaw), ty + dist * Math.sin(pit), dist * Math.cos(pit) * Math.cos(yaw));
    cam.lookAt(tx, ty, 0);
    r.render(scene, cam);

    /* overlays */
    var why = !win && t > p.te + .15 && reopen < .5;
    tags.forEach(function (el, j) {
      var w = world(A(j));
      if (vert) { w.x += R + TUBE + .3; var s = proj(w); el.style.transform = 'translate(' + Math.round(s[0]) + 'px,' + Math.round(s[1]) + 'px) translate(0,-50%)'; }
      else { w.y -= R + TUBE + .22; var s2 = proj(w); el.style.transform = 'translate(' + Math.round(s2[0]) + 'px,' + Math.round(s2[1]) + 'px) translate(-50%,0)'; }
      el.classList.toggle('on', lit[j] > .5);
      el.classList.toggle('brk', why && j === p.brk);
      var e = el.querySelector('em'), txt = j === p.brk ? p.why : '';
      if (e.textContent !== txt) e.textContent = txt;
    });
    if (kx.textContent !== p.k) { kx.textContent = p.k; fx.textContent = p.f; }
    var won = win && t > p.te + .1 && reopen < .5;
    ob.textContent = won ? '1' : '0'; out.classList.toggle('won', won);
    if (cards) cards.forEach(function (li, j) { li.classList.toggle('on', j === n); });
  }

  layout();
  if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); render(acc); }).observe(box);
  var acc = 0, last = 0, raf = 0, on = false;
  function frame(now) { raf = 0; if (!on) return; if (last) acc += Math.min(.1, (now - last) / 1000); last = now; render(acc); raf = requestAnimationFrame(frame); }
  var api = {
    D: D,
    play: function () { if (on) return; on = true; last = 0; raf = requestAnimationFrame(frame); },
    pause: function () { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    seek: function (t) { acc = t; render(t); },
    still: function () { var p = PASS[4]; acc = p.te + .9; render(acc); }
  };
  if (REDUCE) api.still(); else render(0);
  return api;
};
