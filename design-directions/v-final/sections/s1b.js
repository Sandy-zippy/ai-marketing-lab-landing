/* s1b: the agency's path on a dotted globe (business-motion-film: persistent rails + continuous canvas).
   The actor is the arc of light that leaves Vancouver. Every state is render(t), t in [0, 11): seek with
   window.__seek_s1b(t). The camera only ever turns east, so the loop needs no rewind: it crosses the Pacific
   and arrives back over North America. Three.js r160 loads only when the stage is near view and never under
   reduced motion; without it the stage keeps assets/s1b-globe-still.webp (the finished, lit frame). */
var root = document.getElementById('s1b');
if (!root) return;
var viz = root.querySelector('.s1b-viz'), box = root.querySelector('.s1b-globe'), cv = document.getElementById('s1b-cv');
var rows = [].slice.call(root.querySelectorAll('.s1b-led>div'));
var tagV = document.getElementById('s1b-tv'), tagI = document.getElementById('s1b-ti');
var lead = document.getElementById('s1b-lp'), leadH = document.getElementById('s1b-lh'), ph = document.getElementById('s1b-ph'), phImg = ph.querySelector('img');
var D = 11;

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

/* ---------- ledger: each number appears at its moment and counts up once, in order (no rest on a false value) ---------- */
var NUM = rows.map(function (r) {
  var dt = r.querySelector('dt'), txt = dt.textContent;
  dt.innerHTML = '<span class="sr">' + txt + '</span><span class="cnt" aria-hidden="true">' + txt + '</span>';
  return dt.querySelector('.cnt');
});
var FMT = [function () { return '2017'; },
  function (x) { return x >= 1 ? '100+' : String(Math.round(100 * x)); },
  function (x) { return x >= 1 ? '$220,000' : '$' + Math.round(220000 * x).toLocaleString('en-US'); }];
function count(i, x, o) { var s = FMT[i](x); if (NUM[i].textContent !== s) NUM[i].textContent = s; NUM[i].style.opacity = o; }

/* ---------- places (client dots are illustrative; the stage says so) ---------- */
var VAN = [49.28, -123.12], HYD = [17.39, 78.49];
var NA = [[51.05, -114.07], [47.61, -122.33], [53.55, -113.49], [37.77, -122.42], [34.05, -118.24], [49.9, -97.14], [39.74, -104.99], [33.45, -112.07],
  [43.65, -79.38], [32.78, -96.8], [41.88, -87.63], [45.5, -73.57], [33.75, -84.39], [40.71, -74.0], [25.76, -80.19], [44.65, -63.57]];
var IN = [[19.08, 72.88], [28.61, 77.21], [12.97, 77.59], [18.52, 73.86], [13.08, 80.27], [22.57, 88.36], [23.02, 72.57]];
var NA0 = 1.0, NAS = 0.15, NAD = 0.5, IN0 = 6.7, INS = 0.11, IND = 0.35, MA0 = 4.3, MA1 = 6.5;
function litN(t) {                          /* lit-dot progress over both regions: 0..1 */
  var n = 0;
  for (var j = 0; j < NA.length; j++) n += sm(k(t, NA0 + j * NAS + NAD * .8, NA0 + j * NAS + NAD));
  for (j = 0; j < IN.length; j++) n += sm(k(t, IN0 + j * INS + IND * .8, IN0 + j * INS + IND));
  return n / (NA.length + IN.length);
}

var Z = 5.2;
/* camera pose: [lat, lon, distance], cubic Hermite through keys with chosen velocities (no stops, no reversal).
   Longitude only increases: t = 11 equals t = 0 (lon -108 + 360). The flight is framed from 50N over the Atlantic so the
   polar arc reads as a curve with Vancouver (left) and India (right) both in view. */
var KEYS = [ /* t, lat, lon, dist offset, lon velocity (deg/s) */
  [0, 38, -108, 0, 4], [3.85, 40, -96, 0, 6], [5.0, 45, -6, 0, 14], [6.2, 40, 20, 0, 22],
  [7.2, 23, 79, -.55, 4], [9.5, 22.5, 84, -.65, 3], [11, 38, 252, 0, 4]];
function herm(a, b, va, vb, h, s) { var s2 = s * s, s3 = s2 * s; return (2 * s3 - 3 * s2 + 1) * a + (s3 - 2 * s2 + s) * h * va + (-2 * s3 + 3 * s2) * b + (s3 - s2) * h * vb; }
function pose(t) {
  for (var i = 0; i < KEYS.length - 1 && t > KEYS[i + 1][0]; i++);
  var A = KEYS[i], B = KEYS[i + 1], h = B[0] - A[0], s = cl((t - A[0]) / h);
  return [herm(A[1], B[1], 0, 0, h, s), herm(A[2], B[2], A[4], B[4], h, s), Z + herm(A[3], B[3], 0, 0, h, s)];
}

/* ---------- ledger + overlays that do not need WebGL ---------- */
function ledger(t) {
  var a = (t >= 10.2 || t < 1.0) ? 0 : t < 7.8 ? 1 : 2;
  var f = [
    a === 0 ? sm(cl((t >= 10.2 ? t - 10.2 : t + 0.8) / 1.8)) : 1 - sm(k(t, 1.0, 1.3)),
    a === 1 ? litN(t) : t >= 7.8 && t < 8.1 ? 1 - sm(k(t, 7.8, 8.1)) : 0,
    a === 2 ? sm(k(t, 7.8, 9.6)) * (1 - sm(k(t, 9.9, 10.2))) : 0
  ];
  rows.forEach(function (r, i) { r.classList.toggle('on', i === a); r.querySelector('.s1b-bar').style.setProperty('--f', f[i].toFixed(4)); });
  var gone = sm(k(t, 10.2, 10.5));             /* the loop: both numbers leave while the globe crosses the Pacific */
  count(0, 1, 1);
  count(1, eo(k(t, 6.95, 7.75)), t < 6.95 ? 0 : sm(k(t, 6.95, 7.1)) * (1 - gone));
  count(2, eo(k(t, 7.85, 8.65)), t < 7.85 ? 0 : sm(k(t, 7.85, 8.0)) * (1 - gone));
}

/* ---------- the globe ---------- */
var THREE_URL = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/0.160.0/three.min.js';
var SRI = 'sha384-qOkzR5Ke/XkQxuGVJ9hpFEpDlcoLtWwVYhnJf06cLIZa2vaIptSqaubivErzmD5O';
var MASK = 'AAAAAAAIACEgJASMhJAVEpICAkLICQk6IQNgYAAMjJEDM3EADszYgZhxEvNm5tnce4tvea3t7v2dp7/29v//ytvffztve+/t/P+dtfv2Vt7+ytt5eytr9++tvN2Vt/P3VsbO20r5Oysj5+6k3JyRl3NzUnbOyGm5OSE/5+akzJyRk3NzQnbOzOmZOSG3Z+b0/JyYm3Nzcm7Ozem5OS235+b03Jyak3Nzem5Ozcm5OT0n5+b0nJyam3Nyak5Oze25OTU3p+bUnJyak3Mzek5Ozem4OTUn42bU3JyakXFyak7OzKg5OTEj42T0nJ6aUXMyYk7NyOg5OTGjYmTEnJqSU3FyakbNick5PSGnYuTEnJoRE3NySk7FiIkZNSEnYuTEnJoRk3NyQk7EiKkZNSEnZ+TUjJgRUzNyQkbPiKkZPSGiZuSUjJ4RUzNiQkbNiCkZPSGmZtSUjJoQUzJ6SkbNiSkZNSGm5NSUjJoSU3JqSk5NqSk5JSWm5NSUnJISU3IKSk7NKSk5JSWm5JSUjJJSUnIKSkzJKSk5BaWk5JSUiIpSUnIKSk1JKSk5BaWk5JSUiIJSUnAKSk1FKSkxJaWkoJSUipJSUmBKSklBKSkQNaWkgJSUGppSUmBKSkkBqSkUJKWkwJQUmgpSU2BISEkBKSkUBKSkwpCQmgJSU2hISkkBISkUFKSmgJCQmgJSUmgISE0BISkUBKSmoBCQmgJCUkgISE0BISgFBISmkBCQEgJCUUgISE0BISgFBISisBCQEgJCUUgICEFhISgFBISikBCQggJCUEgICAlhISAFFISikBAQEgpCQEgoCAFlISAlBYWCklAQEgpCQUooCAFloSAlFYSAklAQAopCQEkoCAFloSAlFYSAklAQAgpCQEkoCAAFoaAEFQSAklRUAApCQUEoCAAFoagAFQSAglRQAAoCUQEqCAAFoagAFASiAlQQAApCUQEoCEAFoKgAFASiAlQUAIpCUQEoCkQFoKAAFISiAlQQgApAUQEoCERFoKgAFICiAlRQiApAQREoAERFoKgAFIGCIlRQCApAUREoIkRFoKgYFJCCIlRADApAQREoIAQFoKAYFJCDIlBADIpIQTEoIAQFoIAYFZCCIlRACApIQREqIARFoIAQFZCiInBACApAQSEoIAUFoIAQFICCAlBADApAQSEoIAUFoIAQFICCAlBACApAASEoAgUFoIAQFIGCAlAECgpAASEoCgVFoIgUFICCAlAUCgpAASEoAAVFoAgUFIAiAlAUCopAESkoAkVFoCgUFIAiAlAEiopAUQkoAkVGoCgUFIEiAlAEiohAUQgoAkVEoAgUEYGiAlAEiohAUSgiAkVEoAgUEYGiAFQEiojAESgiAkVBqAgUEYGiUFQEioBQESgiAkVBqAgUAYEiUEQEioBQESgCAkVAiAgUAaEiUAQEioBQESgCAkXAiAgUAaEiUAQEioAQESgCAkWgCAgUAaEiUAQEioARESgCAkWgCAgUASEiUAQEioARECgCQkSgCAgUACMgUAAEiAARECgAQkSgAAgQACIgUACEiAABECAARgCAAAgAAAIhQAAEAAABECAABACAAAgAAAIhQAAMAAABEAAABACAAAAAAAIBAAAIAAABAAAABAAAABAAAAIAAAAIBAAAEAAABAAAABAAAAIgAAAIBAAAIAAABAAAABAIAAAAAAAIAAAAIBAAAAAAABAAAABAAAAAAAAAIAAAAAAAABAAAABAAAAAAAAAIAAAAIAAAAAAAABAAAAAAAAAIAAAAIAAAAAAAABAAAAAAAAAIAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA';
var G = null, W = 0, C = 0, DPR = 1;

function v3(T, ll, r) { var la = ll[0] * Math.PI / 180, lo = ll[1] * Math.PI / 180; return new T.Vector3(Math.cos(la) * Math.sin(lo), Math.sin(la), Math.cos(la) * Math.cos(lo)).multiplyScalar(r || 1); }
/* bend > 0 pushes the arc off its great circle (towards the Atlantic side for Vancouver -> India): a geodesic seen from any
   one camera is either a straight needle or hugs the rim; the bent arc crosses the visible disc as a readable curve. */
function arcPts(T, a, b, n, al, bend) {
  var A = v3(T, a), B = v3(T, b), om = Math.acos(Math.max(-1, Math.min(1, A.dot(B)))), so = Math.sin(om), alt = al || (.03 + .3 * om / Math.PI), out = [];
  var N = bend ? B.clone().cross(A).normalize() : null;
  for (var i = 0; i <= n; i++) {
    var s = i / n, p = A.clone().multiplyScalar(Math.sin((1 - s) * om) / so).add(B.clone().multiplyScalar(Math.sin(s * om) / so));
    if (N) p.normalize().add(N.clone().multiplyScalar(bend * Math.sin(Math.PI * s)));
    out.push(p.normalize().multiplyScalar(1.004 + alt * Math.sin(Math.PI * s)));
  }
  return out;
}

var DOT_V = 'uniform float uS;varying float vF;void main(){vF=normalize(normalMatrix*position).z;gl_PointSize=uS;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
var DOT_F = 'varying float vF;void main(){float d=length(gl_PointCoord-.5);if(d>.5)discard;gl_FragColor=vec4(.165,.165,.165,(1.-smoothstep(.32,.5,d))*smoothstep(.0,.35,vF)*.6);}';
/* arcs fade as they turn away: nothing that has passed over the horizon is drawn outside the globe's outline */
var ARC_V = 'varying float vF;void main(){vF=normalize(normalMatrix*position).z;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
var ARC_F = 'uniform vec3 uC;uniform float uO;varying float vF;void main(){gl_FragColor=vec4(uC,uO*smoothstep(.0,.2,vF));}';
var MK_V = 'attribute float aS;attribute float aA;attribute float aR;attribute float aG;attribute vec3 aC;uniform float uK;varying float vA;varying float vR;varying float vG;varying vec3 vC;' +
  'void main(){vec3 n=normalize(normalMatrix*position);vA=aA*smoothstep(-.02,.22,n.z);vR=aR;vG=aG;vC=aC;gl_PointSize=aS*uK*3.;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}';
var MK_F = 'varying float vA;varying float vR;varying float vG;varying vec3 vC;void main(){float d=length(gl_PointCoord-.5)*2.;if(d>1.)discard;' +
  'float core=1.-smoothstep(.27,.333,d);float rr=.333+vR*.6;float ring=step(.001,vR)*(1.-vR)*(1.-smoothstep(.0,.07,abs(d-rr)));float glow=vG*exp(-d*d*7.)*.55;' +
  'vec3 teal=vec3(0.,.631,.608);vec3 c=core>.5?vC:teal;float a=max(core,max(ring*.95,glow));gl_FragColor=vec4(c,a*vA);}';

function build() {
  var T = window.THREE, r;
  try { r = new T.WebGLRenderer({ canvas: cv, alpha: true, antialias: true, preserveDrawingBuffer: true }); } catch (e) { return false; }
  if (!r.getContext()) return false;
  r.setClearColor(0x000000, 0);
  var scene = new T.Scene(), cam = new T.PerspectiveCamera(30, 1, .1, 20), globe = new T.Group();
  globe.rotation.order = 'XYZ'; scene.add(globe);
  /* the sphere: paper, a shade darker toward the rim; it occludes the far side */
  globe.add(new T.Mesh(new T.SphereGeometry(1, 96, 64), new T.ShaderMaterial({
    vertexShader: 'varying float vz;void main(){vz=normalize(normalMatrix*normal).z;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader: 'varying float vz;void main(){float r=1.-clamp(vz,0.,1.);gl_FragColor=vec4(mix(vec3(.953,.933,.878),vec3(.851,.812,.718),r*r*r),1.);}'
  })));
  /* land: Fibonacci dots kept by the baked Natural Earth mask (bit i = point i is land) */
  var bits = atob(MASK), N = 12000, GA = Math.PI * (3 - Math.sqrt(5)), lp = [];
  for (var i = 0; i < N; i++) {
    if (!(bits.charCodeAt(i >> 3) & (1 << (i & 7)))) continue;
    var y = 1 - (i + .5) / N * 2, lon = ((i * GA) % (2 * Math.PI)) - Math.PI, rr = Math.sqrt(1 - y * y) * 1.003;
    lp.push(rr * Math.sin(lon), y * 1.003, rr * Math.cos(lon));
  }
  var lg = new T.BufferGeometry(); lg.setAttribute('position', new T.Float32BufferAttribute(lp, 3));
  var dotM = new T.ShaderMaterial({ uniforms: { uS: { value: 2 } }, vertexShader: DOT_V, fragmentShader: DOT_F, transparent: true, depthWrite: false });
  globe.add(new T.Points(lg, dotM));
  /* arcs: Vancouver -> each North American dot, Vancouver -> India (over the Arctic), India -> each Indian dot */
  var teal = new T.Color('#00A19B'), ink = new T.Color('#2A2A2A');
  function arc(a, b, n, rad, alt, bend) {
    var pts = arcPts(T, a, b, n, alt, bend), crv = new T.CatmullRomCurve3(pts), geo = new T.TubeGeometry(crv, n, rad, 6, false);
    var m = new T.Mesh(geo, new T.ShaderMaterial({ uniforms: { uC: { value: new T.Vector3(0, .631, .608) }, uO: { value: 0 } },
      vertexShader: ARC_V, fragmentShader: ARC_F, transparent: true, depthWrite: false }));
    m.userData = { crv: crv, n: n }; globe.add(m); return m;
  }
  var A = { na: NA.map(function (p) { return arc(VAN, p, 40, .0042); }), main: arc(VAN, HYD, 140, .0062, .045, 1.2), inn: IN.map(function (p) { return arc(HYD, p, 24, .0036); }) };
  /* markers: pins, client dots, travelling heads */
  var MK = [VAN, HYD].concat(NA, IN), nm = MK.length + NA.length + 1 + IN.length;
  var mg = new T.BufferGeometry(), pos = new Float32Array(nm * 3), aS = new Float32Array(nm), aA = new Float32Array(nm), aR = new Float32Array(nm), aG = new Float32Array(nm), aC = new Float32Array(nm * 3);
  MK.forEach(function (p, j) { var v = v3(T, p, 1.006); pos.set([v.x, v.y, v.z], j * 3); });
  mg.setAttribute('position', new T.BufferAttribute(pos, 3)); mg.setAttribute('aS', new T.BufferAttribute(aS, 1)); mg.setAttribute('aA', new T.BufferAttribute(aA, 1));
  mg.setAttribute('aR', new T.BufferAttribute(aR, 1)); mg.setAttribute('aG', new T.BufferAttribute(aG, 1)); mg.setAttribute('aC', new T.BufferAttribute(aC, 3));
  var mkM = new T.ShaderMaterial({ uniforms: { uK: { value: 1 } }, vertexShader: MK_V, fragmentShader: MK_F, transparent: true, depthWrite: false });
  var mk = new T.Points(mg, mkM); mk.frustumCulled = false; mk.renderOrder = 3; globe.add(mk);
  G = { T: T, r: r, scene: scene, cam: cam, globe: globe, dotM: dotM, A: A, mg: mg, mkM: mkM, pos: pos, aS: aS, aA: aA, aR: aR, aG: aG, aC: aC, nmk: MK.length, teal: teal, ink: ink,
    van: v3(T, VAN, 1.006), hyd: v3(T, HYD, 1.006) };
  return true;
}

function layout() {
  if (!G) return;
  W = box.clientWidth; if (!W) return; C = Math.round(W * 1.16);
  DPR = Math.min(2, window.devicePixelRatio || 1);
  G.r.setPixelRatio(DPR); G.r.setSize(C, C, false);
  var s = W / 600;
  G.dotM.uniforms.uS.value = Math.max(2, 3.1 * s) * DPR;
  G.mkM.uniforms.uK.value = Math.max(.7, s) * DPR;
}

/* arc state: progress p (0..1 drawn), colour mix c (0 teal .. 1 settled ink), opacity o */
function setArc(m, p, c, o, hi) {
  var n = m.userData.n, segs = Math.floor(p * n + 1e-6);
  m.geometry.setDrawRange(0, segs * 6 * 6);
  m.material.uniforms.uC.value.set(.165 * c, .631 + (.165 - .631) * c, .608 + (.165 - .608) * c); m.material.uniforms.uO.value = o * (p > 0 ? 1 : 0);
  var j = G.nmk + hi, P = m.userData.crv.getPointAt(Math.min(1, segs / n)), head = p > 0 && p < 1;
  G.pos[j * 3] = P.x; G.pos[j * 3 + 1] = P.y; G.pos[j * 3 + 2] = P.z;
  G.aS[j] = 5; G.aA[j] = head ? o : 0; G.aR[j] = 0; G.aG[j] = 1; G.aC.set([0, .631, .608], j * 3);
}
function setMk(j, size, a, ring, inkDot) {
  G.aS[j] = size; G.aA[j] = a; G.aR[j] = ring; G.aG[j] = 0;
  G.aC.set(inkDot ? [.165, .165, .165] : [0, .631, .608], j * 3);
}
function proj(v) {
  var p = v.clone().applyMatrix4(G.globe.matrixWorld), n = p.clone().normalize(), c = G.cam.position.clone().sub(p).normalize();
  var s = p.project(G.cam);
  return { x: (s.x + 1) / 2 * C - (C - W) / 2, y: (1 - s.y) / 2 * C - (C - W) / 2, f: n.dot(c) };
}

var STILL = -1, PINS = null;
window.__s1b_pins = function () { return PINS; };
function render(t) {
  t = ((t % D) + D) % D;
  ledger(STILL >= 0 ? 10.15 : t);
  if (!G || !W) return;
  var still = STILL >= 0, P = pose(still ? 9.0 : t);   /* the still is the landing: India, the arc arriving from Vancouver */
  G.globe.rotation.set(P[0] * Math.PI / 180, -P[1] * Math.PI / 180, 0);
  G.cam.position.set(0, 0, P[2]); G.cam.lookAt(0, 0, 0); G.cam.updateProjectionMatrix();
  G.globe.updateMatrixWorld(true);
  if (still) t = 9.0;
  /* fades for the loop: North America's lights dim only while it faces away (t 9.7 to 10.1), India's from 10.3 */
  var naO = still ? 1 : 1 - sm(k(t, 9.5, 9.85)), inO = still ? 1 : 1 - sm(k(t, 9.55, 9.9)), maO = still ? 1 : 1 - sm(k(t, 9.55, 9.9)), hi = 0;
  /* Vancouver: the origin, always lit; a ring at the start of every loop and as the long arc leaves */
  setMk(0, 9, still ? 1 : 1 - sm(k(t, 9.55, 9.9)) * (1 - sm(k(t, 10.3, 10.55))), still ? 0 : (t < 1 ? k(t, .1, .95) : k(t, MA0 - .05, MA0 + .7)), true);
  /* North America */
  NA.forEach(function (p, j) {
    var s0 = NA0 + j * NAS, pr = eo(k(t, s0, s0 + NAD)), lit = k(t, s0 + NAD * .8, s0 + NAD);
    setArc(G.A.na[j], still ? 1 : pr, still ? 1 : sm(k(t, s0 + NAD, s0 + NAD + .5)), (still ? .45 : (.95 - .5 * sm(k(t, s0 + NAD, s0 + NAD + .5)))) * naO, hi++);
    setMk(2 + j, 6, (still ? 1 : lit) * naO, still ? 0 : k(t, s0 + NAD * .9, s0 + NAD + .7), true);
  });
  /* the long arc: the camera follows its head over the Arctic */
  var mp = still ? 1 : sm(k(t, MA0, MA1));
  setArc(G.A.main, mp, still ? .2 : sm(k(t, MA1, MA1 + 1.2)) * .7, maO, hi++);
  setMk(1, 9, still ? 1 : sm(k(t, MA1 - .1, MA1)) * inO, still ? 0 : k(t, MA1, MA1 + .8), true);
  IN.forEach(function (p, j) {
    var s0 = IN0 + j * INS, pr = eo(k(t, s0, s0 + IND)), lit = k(t, s0 + IND * .8, s0 + IND);
    setArc(G.A.inn[j], still ? 1 : pr, still ? 1 : sm(k(t, s0 + IND, s0 + IND + .5)), (still ? .45 : (.95 - .5 * sm(k(t, s0 + IND, s0 + IND + .5)))) * inO, hi++);
    setMk(2 + NA.length + j, 6, (still ? 1 : lit) * inO, still ? 0 : k(t, s0 + IND * .9, s0 + IND + .7), true);
  });
  ['position', 'aS', 'aA', 'aR', 'aG', 'aC'].forEach(function (n) { G.mg.attributes[n].needsUpdate = true; });
  G.r.render(G.scene, G.cam);

  /* overlays: one tag at a time, the leader from India to the photo */
  var pv = proj(G.van), pi = proj(G.hyd); PINS = [pv.x / W * 100, pv.y / W * 100, pi.x / W * 100, pi.y / W * 100];
  var tvO = still ? 1 : (t < 4.1 ? 1 - sm(k(t, 3.8, 4.1)) : sm(k(t, 10.35, 10.7))) * sm(k(pv.f, .1, .3));
  show(tagV, tvO); tagV.style.transform = 'translate(' + Math.round(Math.max(2 - box.offsetLeft, pv.x - tagV.offsetWidth - 12)) + 'px,' + Math.round(pv.y - tagV.offsetHeight / 2) + 'px)';
  var tiO = still ? 1 : sm(k(t, 6.5, 6.75)) * (1 - sm(k(t, 9.55, 9.9))) * sm(k(pi.f, .1, .3));
  show(tagI, tiO); tagI.style.transform = 'translate(' + Math.round(pi.x + 14) + 'px,' + Math.round(pi.y - tagI.offsetHeight / 2) + 'px)';
  var br = box.getBoundingClientRect(), ir = phImg.getBoundingClientRect();
  var ex = ir.right - br.left - 6, ey = ir.top - br.top + 6, mx = (pi.x + ex) / 2 + 30, my = Math.min(pi.y, ey) - 10;
  var d = 'M' + pi.x.toFixed(1) + ' ' + pi.y.toFixed(1) + 'Q' + mx.toFixed(1) + ' ' + my.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1);
  if (lead.getAttribute('d') !== d) lead.setAttribute('d', d);
  var L = lead.getTotalLength(), ld = still ? 1 : eo(k(t, 8.1, 8.6)), lo = still ? 1 : (t >= 8.1 ? 1 - sm(k(t, 9.55, 9.9)) : 0);
  lead.style.strokeDasharray = L + ' ' + L; lead.style.strokeDashoffset = L * (1 - ld); lead.style.opacity = lo;
  var hp = lead.getPointAtLength(L * ld); leadH.setAttribute('cx', hp.x.toFixed(1)); leadH.setAttribute('cy', hp.y.toFixed(1)); leadH.style.opacity = ld > 0 && ld < 1 ? 1 : 0;
  ph.classList.toggle('hit', !still && t >= 8.45 && t < 9.7);
}

/* ---------- clock: starts when in view, pausable, seekable ---------- */
var REDUCE = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var acc = 0, last = 0, playing = false, paused = false, inView = false, seekT = null, raf = 0;
function frame(now) {
  raf = 0; if (!playing || paused || !inView || seekT !== null) return;
  if (last) acc += Math.min(.1, (now - last) / 1000); last = now;
  render(acc); raf = requestAnimationFrame(frame);
}
function kick() { if (!raf && G && playing && !paused && inView && seekT === null) { last = 0; raf = requestAnimationFrame(frame); } }
window.__seek_s1b = function (t) { seekT = t; layout(); render(t); };
window.__s1b_still = function () { STILL = 1; layout(); render(0); STILL = -1; return cv.toDataURL('image/png'); };

function ready() {
  if (!build()) return;
  viz.classList.add('gl'); layout(); render(seekT !== null ? seekT : acc);
  playing = true; window.__s1b_ready = true;
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(box, { pause: function () { paused = true; }, play: function () { paused = false; kick(); } });
  kick();
}
ledger(10.15);                                 /* the finished numbers, until the globe runs */
if (REDUCE) return;
var loading = false;
function load() {
  if (loading) return; loading = true;
  if (window.THREE) return ready();
  var s = document.createElement('script'); s.src = THREE_URL; s.integrity = SRI; s.crossOrigin = 'anonymous'; s.referrerPolicy = 'no-referrer';
  s.onload = ready; document.head.appendChild(s);
}
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting && e.target.offsetParent !== null) load(); }); }, { rootMargin: '600px 0px' }).observe(box);   /* the globe box: on phones the stage is display:contents */
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting; if (inView) { layout(); kick(); } }); }, { threshold: .2 }).observe(box);
} else { inView = true; load(); }
addEventListener('resize', function () { layout(); render(seekT !== null ? seekT : acc); });
if (document.fonts) document.fonts.ready.then(function () { render(seekT !== null ? seekT : acc); });
document.addEventListener('aiml:reveal', function () { layout(); render(seekT !== null ? seekT : acc); });
