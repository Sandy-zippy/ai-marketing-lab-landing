/* The swing, in 3D. render(t) is a pure function of t in [0, D). Time runs along x: two month slabs laid out like a
   contribution graph (weeks left to right, weekdays front to back), a pipeline ribbon extruded behind them by a "now"
   cursor. Chase: the ribbon rises, booked days rise out of the slab in teal. Deliver: the columns cool, the ribbon falls.
   The camera trucks into next month: flat, 0 booked. Back to chasing: the ribbon climbs at the far edge, the camera pulls
   back to show the whole swing. Usage: SW3(root, THREE, REDUCE) -> { play, pause, seek } */
window.SW3 = function (root, T, REDUCE) {
  var D = 12.6, P = 1.06, TS = .86, X0 = -3.45, X1 = 3.45, RZ = -3.5;
  var cv = root.querySelector('canvas'), box = root.querySelector('.s3-v');
  var stx = root.querySelector('.mo-st span'), st = root.querySelector('.mo-st');
  var tg = [].slice.call(root.querySelectorAll('.s3-tag')), cnt = root.querySelectorAll('.s3-tag em');
  var r; try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true }); } catch (e) { return null; }
  if (!r.getContext()) return null;
  r.setClearColor(0, 0);
  var scene = new T.Scene(), cam = new T.PerspectiveCamera(32, 1, .1, 100);
  scene.add(new T.HemisphereLight(0xcffcf8, 0x06191a, 1.1));
  var sun = new T.DirectionalLight(0xffffff, 1.6); sun.position.set(-4, 9, 6); scene.add(sun);
  var glow = new T.PointLight(0x3fe0d6, 0, 7, 1.6); scene.add(glow);

  function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
  function k(t, a, b) { return cl((t - a) / (b - a)); }
  function sm(x) { return x * x * (3 - 2 * x); }
  function eo(x) { return 1 - Math.pow(1 - x, 4); }
  function lerp(a, b, x) { return a + (b - a) * x; }

  /* weeks u in [0,10] -> x (a 1.6 gap between the months) */
  function ux(u) { return u <= 5 ? X0 - 2.5 * P + u * P : X1 - 2.5 * P + (u - 5) * P; }
  function xu(x) { var a = X0 - 2.5 * P, b = X1 - 2.5 * P; return x <= a + 5 * P ? (x - a) / P : x < b ? 5 : 5 + (x - b) / P; }
  /* the pipeline: rises while you chase, falls while you deliver, flat for a month, climbs when you chase again */
  function H(u) {
    if (u < 2.2) return lerp(.12, 2.4, sm(k(u, 0, 2.2)));
    if (u < 3.1) return 2.4 - .15 * sm(k(u, 2.2, 3.1));
    if (u < 4.6) return lerp(2.25, .06, sm(k(u, 3.1, 4.6)));
    if (u < 9.1) return .06;
    return lerp(.06, 1.9, sm(k(u, 9.1, 10)));
  }
  /* the cursor: weeks u as a function of t */
  function U(t) {
    if (t < .6) return 0;
    if (t < 3.9) return 3.4 * k(t, .6, 3.9);
    if (t < 5.6) return lerp(3.4, 5, k(t, 3.9, 5.6));
    if (t < 8.8) return lerp(5, 9.1, sm(k(t, 5.6, 8.8)));
    return lerp(9.1, 10, eo(k(t, 8.8, 10.4)));
  }

  var dark = new T.Color('#123b3a'), teal = new T.Color('#3FE0D6'), pale = new T.Color('#9fbfbb'), tmp = new T.Color();
  /* slabs + tiles */
  var tiles = [], slabs = [];
  [X0, X1].forEach(function (xm, m) {
    var g = new T.Mesh(new T.BoxGeometry(5 * P + .34, .16, 5 * P + .34), new T.MeshStandardMaterial({ color: 0x0c2b2b, roughness: .9 }));
    g.position.set(xm, -.08, 0); scene.add(g); slabs.push(g);
    var e = new T.LineSegments(new T.EdgesGeometry(g.geometry), new T.LineBasicMaterial({ color: 0x3fe0d6, transparent: true, opacity: .28 }));
    g.add(e); g.userData.e = e;
    for (var w = 0; w < 5; w++) for (var d = 0; d < 5; d++) {
      var mat = new T.MeshStandardMaterial({ color: dark.clone(), roughness: .55, metalness: .05, emissive: new T.Color(0), emissiveIntensity: 1 });
      var b = new T.Mesh(new T.BoxGeometry(TS, 1, TS), mat);
      b.position.set(xm - 2 * P + w * P, 0, -2 * P + d * P); scene.add(b);
      var ed = new T.LineSegments(new T.EdgesGeometry(b.geometry), new T.LineBasicMaterial({ color: 0x3fe0d6, transparent: true, opacity: .16 }));
      b.add(ed);
      tiles.push({ m: m, w: w, d: d, u: m * 5 + w + .5, b: b, ed: ed });
    }
  });
  /* booked days: (week, weekday), the cursor books each as it passes */
  var BOOK = [[0, 3], [1, 1], [1, 4], [2, 0], [2, 2], [2, 3], [3, 1], [3, 4]];
  var bookAt = {}; BOOK.forEach(function (p, i) { bookAt[p[0] * 5 + p[1]] = i; });

  /* the ribbon: an area wall behind the slabs, alpha fading to the floor, a bright crest */
  var N = 240, XA = ux(0) - .3, XB = ux(10) + .3;
  function strip(alphaTop, alphaBot, col) {
    var pos = new Float32Array((N + 1) * 2 * 3), al = new Float32Array((N + 1) * 2), idx = [];
    for (var i = 0; i <= N; i++) { al[i * 2] = alphaTop; al[i * 2 + 1] = alphaBot; if (i < N) { var a = i * 2; idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2); } }
    var g = new T.BufferGeometry(); g.setAttribute('position', new T.BufferAttribute(pos, 3)); g.setAttribute('aA', new T.BufferAttribute(al, 1)); g.setIndex(idx);
    var mat = new T.ShaderMaterial({ uniforms: { uC: { value: new T.Color(col) }, uO: { value: 1 } }, transparent: true, depthWrite: false, side: T.DoubleSide,
      vertexShader: 'attribute float aA;varying float vA;void main(){vA=aA;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
      fragmentShader: 'uniform vec3 uC;uniform float uO;varying float vA;void main(){gl_FragColor=vec4(uC,vA*uO);}' });
    var m = new T.Mesh(g, mat); m.frustumCulled = false; scene.add(m); return m;
  }
  var wall = strip(.34, 0, '#3FE0D6'), crest = strip(1, 1, '#3FE0D6');
  /* the cursor: a light standing on the ribbon's leading edge */
  var cur = new T.Mesh(new T.BoxGeometry(.035, 1, .035), new T.MeshBasicMaterial({ color: 0xeafffd, transparent: true, opacity: .9 }));
  scene.add(cur);
  var head = new T.Mesh(new T.SphereGeometry(.11, 20, 14), new T.MeshBasicMaterial({ color: 0xffffff }));
  scene.add(head);
  var halo = new T.Sprite(new T.SpriteMaterial({ map: (function () { var c = document.createElement('canvas'); c.width = c.height = 64; var x = c.getContext('2d'), gr = x.createRadialGradient(32, 32, 0, 32, 32, 32); gr.addColorStop(0, 'rgba(63,224,214,.9)'); gr.addColorStop(1, 'rgba(63,224,214,0)'); x.fillStyle = gr; x.fillRect(0, 0, 64, 64); return new T.CanvasTexture(c); })(), transparent: true, depthWrite: false }));
  halo.scale.set(1.1, 1.1, 1); scene.add(halo);

  var W = 0, Hh = 0;
  function layout() {
    W = box.clientWidth; Hh = box.clientHeight; if (!W) return;
    r.setPixelRatio(Math.min(2, window.devicePixelRatio || 1)); r.setSize(W, Hh, false);
    cam.aspect = W / Hh; cam.updateProjectionMatrix();
  }
  function fitDist(width) { var hf = 2 * Math.atan(Math.tan(cam.fov * Math.PI / 360) * cam.aspect); return width / 2 / Math.tan(hf / 2); }

  function say(s, warn) { if (stx.dataset.s !== s) { stx.dataset.s = s; stx.innerHTML = s.replace('follow-ups,', '<span style="white-space:nowrap">follow-ups,</span>'); } st.classList.toggle('warn', !!warn); }
  function proj(x, y, z) { var v = new T.Vector3(x, y, z).project(cam); return [(v.x + 1) / 2 * W, (1 - v.y) / 2 * Hh]; }
  function place(el, p, o) { el.style.transform = 'translate(' + Math.round(p[0]) + 'px,' + Math.round(p[1]) + 'px) translate(-50%,0)'; el.style.opacity = o; }

  function render(t) {
    t = ((t % D) + D) % D;
    var u = U(t), xn = ux(u), out = sm(k(t, 11.6, 12.5));   /* out: the reset at the loop's end */
    var cool = sm(k(t, 3.9, 4.9)), wide = sm(k(t, 8.8, 10.6)) * (1 - out);
    var narrow = W / Hh < 1.1;
    /* camera: trucks with the story, pulls back wide at the end */
    var tx = t < 5.6 ? X0 + .5 * Math.max(0, xn - X0) * .3 : lerp(X0 + .4, X1, sm(k(t, 5.6, 8.4)));
    tx = lerp(tx, 0, wide); tx = lerp(tx, X0, out);
    var dist = lerp(fitDist(narrow ? 8.4 : 11.8), fitDist(narrow ? 14.5 : 16.2), wide);
    var yaw = lerp(-24, -12, wide) * Math.PI / 180, pit = lerp(30, 34, wide) * Math.PI / 180;
    var ty = narrow ? .9 : .7;
    cam.position.set(tx + dist * Math.cos(pit) * Math.sin(yaw), ty + dist * Math.sin(pit), dist * Math.cos(pit) * Math.cos(yaw) + .3);
    cam.lookAt(tx, ty, -.4);

    /* ribbon */
    var wp = wall.geometry.attributes.position.array, cp = crest.geometry.attributes.position.array, hn = H(u);
    for (var i = 0; i <= N; i++) {
      var x = lerp(XA, XB, i / N), uu = xu(x), h = x <= xn ? H(Math.max(0, uu)) : null;
      if (h === null) h = 0;
      var top = x <= xn ? h : 0, j = i * 6;
      wp[j] = x; wp[j + 1] = top; wp[j + 2] = RZ; wp[j + 3] = x; wp[j + 4] = 0; wp[j + 5] = RZ;
      var c = x <= xn ? .045 : 0;
      cp[j] = x; cp[j + 1] = top + c; cp[j + 2] = RZ + .001; cp[j + 3] = x; cp[j + 4] = top - c; cp[j + 5] = RZ + .001;
    }
    wall.geometry.attributes.position.needsUpdate = true; crest.geometry.attributes.position.needsUpdate = true;
    wall.material.uniforms.uO.value = crest.material.uniforms.uO.value = 1 - out;
    var live = t > .6 && out < 1;
    cur.visible = head.visible = halo.visible = live;
    cur.scale.y = hn + .5; cur.position.set(xn, (hn + .5) / 2, RZ); head.position.set(xn, hn, RZ + .02); halo.position.copy(head.position);
    cur.material.opacity = head.material.opacity = 1 - out; halo.material.opacity = 1 - out;
    glow.position.set(xn, hn + .6, RZ + 1.4); glow.intensity = live ? (1 - out) * 6 * cl(hn / 1.2 + .15) : 0;

    /* tiles */
    var nb = 0;
    tiles.forEach(function (o) {
      var id = o.w * 5 + o.d, bi = o.m === 0 ? bookAt[id] : undefined, h = .1, col = dark, em = 0, edo = .16;
      if (bi !== undefined) {
        var at = .6 + (o.u - .5 + o.d * .08) / 3.4 * 3.3, rise = eo(k(t, at, at + .5));
        if (t >= at) nb++;
        h = lerp(.1, 1.4, rise); h = lerp(h, .8, cool);
        tmp.copy(dark).lerp(teal, rise).lerp(pale, cool); col = tmp.clone(); em = rise * (1 - cool) * .55; edo = .16 + .5 * rise;
      } else if (o.m === 0 && o.w >= 3) {
        /* delivery fills the rest of the month: you are busy, nobody is chasing */
        var at2 = 4.0 + (o.w - 3) * .55 + o.d * .07, f = eo(k(t, at2, at2 + .45));
        h = lerp(.1, .45, f); tmp.copy(dark).lerp(pale, f * .85); col = tmp.clone(); edo = .16 + .2 * f;
      }
      h = lerp(h, .1, out);
      o.b.scale.y = h; o.b.position.y = h / 2;
      o.b.material.color.copy(col).lerp(dark, out); o.b.material.emissive.copy(teal).multiplyScalar(em * (1 - out));
      o.ed.material.opacity = lerp(edo, .16, out);
    });
    nb = Math.round(nb * (1 - out));
    /* the next month slab outline warms to brick when it arrives empty */
    var empty = sm(k(t, 7.6, 8.2)) * (1 - out);
    slabs[1].userData.e.material.color.set(empty > .5 ? 0xff7a6e : 0x3fe0d6); slabs[1].userData.e.material.opacity = .28 + .5 * empty;

    r.render(scene, cam);

    /* overlays */
    if (cnt[0].textContent !== String(nb)) cnt[0].textContent = nb;
    tg[0].classList.toggle('hot', nb > 0 && cool < .5);
    tg[1].classList.toggle('warn', empty > .5);
    /* a tag only shows while its whole box is on the stage */
    function inside(p, w) { return cl(Math.min(p[0] - w / 2 - 8, W - 8 - p[0] - w / 2) / 24); }
    var p0 = proj(X0, 0, 2.5 * P + .5), p1 = proj(X1, 0, 2.5 * P + .5);
    place(tg[0], p0, inside(p0, tg[0].offsetWidth)); place(tg[1], p1, inside(p1, tg[1].offsetWidth));
    var pl = proj(XA + .1, H(0) + .3, RZ);
    tg[2].style.transform = 'translate(' + Math.round(pl[0]) + 'px,' + Math.round(pl[1]) + 'px) translate(0,-100%)';
    tg[2].style.opacity = (1 - out) * cl((pl[0] - 8) / 24) * (1 - sm(k(t, 5.4, 6)) * (1 - wide));
    if (t < 3.9) say('You: chasing. DMs, follow-ups, posts.');
    else if (t < 6.4) say('Clients sign. You deliver, the part you’re good at.');
    else if (t < 8.9) say('Four weeks later: next month is empty.', empty > .5);
    else say('Back to chasing.');
  }

  layout();
  if ('ResizeObserver' in window) new ResizeObserver(function () { layout(); render(acc); }).observe(box);
  var acc = 0, last = 0, raf = 0, on = false;
  function frame(now) { raf = 0; if (!on) return; if (last) acc += Math.min(.1, (now - last) / 1000); last = now; render(acc); raf = requestAnimationFrame(frame); }
  var api = {
    play: function () { if (on) return; on = true; last = 0; raf = requestAnimationFrame(frame); },
    pause: function () { on = false; if (raf) cancelAnimationFrame(raf); raf = 0; },
    seek: function (t) { acc = t; render(t); },
    still: function () { render(10.9); say('Four weeks later: next month is empty.', true); tg[1].classList.add('warn'); }
  };
  if (REDUCE) api.still(); else render(0);
  return api;
};
