/* ---- s1 ---- */
try{(function(){
/* s1 v6 pilot port: deterministic render(t), window.__seek_s1(t). */
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var names=['Medico Construction','Scale Your Results','Rumor Avenue','Agent Lions Den','Jas Oberoi','Riarh Group','Celestial Luxury Resorts','Walk Again Rehab','Swathi Veldandi Studio'];
  document.getElementById('s1-mq').innerHTML = names.concat(names).map(function(n){return '<span>'+n+'</span>'}).join('');
  /* WCAG 2.2.2: the names strip moves for more than 5 s, so it gets the page's pause control */
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(document.querySelector('#s1 .mq-w'), { pause: function () { document.getElementById('s1-mq').style.animationPlayState = 'paused'; }, play: function () { document.getElementById('s1-mq').style.animationPlayState = ''; } });

  /* ---------- everything below is a pure function of t (business-motion-film rule 4) ---------- */
  var D=12, $=function(i){return document.getElementById('s1-'+i)};
  function cl(x){return x<0?0:x>1?1:x}
  function k(t,a,b){return cl((t-a)/(b-a))}
  function ease(x){return 1-Math.pow(1-x,4)}
  function sm(x){return x*x*x*(x*(6*x-15)+10)}
  var STN=['Ad','Callback','Follow-up','Sales call','Client'];
  var SV='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
  var ICO=[SV+'<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M16 9a3 3 0 0 1 0 6M19 6a7 7 0 0 1 0 12"/></svg>',
    SV+'<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/></svg>',
    SV+'<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/></svg>',
    SV+'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/></svg>',
    SV+'<path d="M20 6L9 17l-5-5"/></svg>'];
  var stage=$('stage'), scene=$('scene'), G={};

  var ghost=null;
  function snap(){ if(ghost) ghost.remove(); ghost=null; render(0); scene.style.opacity=1; var g=scene.cloneNode(true); g.removeAttribute('id');
    [].forEach.call(g.querySelectorAll('[id]'),function(e){e.removeAttribute('id')}); g.style.opacity=0; g.style.pointerEvents='none'; g.setAttribute('aria-hidden','true');
    stage.appendChild(g); ghost=g; }
  function layout(){
    var w=stage.clientWidth, h=stage.clientHeight, vert=w<=600;
    G={w:w,h:h,vert:vert,pts:[]};
    for(var i=0;i<5;i++) G.pts.push(vert ? {x:46, y:h*.16+(h*.74)*i/4} : {x:w*.12+(w*.76)*i/4, y:h*.6});
    var d='M'+G.pts[0].x+' '+G.pts[0].y+'L'+G.pts[4].x+' '+G.pts[4].y;
    ['r0','r1','r2'].forEach(function(id){$(id).setAttribute('d',d)});
    G.len=vert?(G.pts[4].y-G.pts[0].y):(G.pts[4].x-G.pts[0].x);
    $('stns').innerHTML=STN.map(function(s,i){var p=G.pts[i];
      var lab=vert?'left:calc(var(--sd)/2 + 12px);top:-6px;transform:none':'left:0;top:calc(var(--sd)/2 + 22px);transform:translateX(-50%)';
      return '<div class="stn" id="s1-stn'+i+'" style="left:'+p.x+'px;top:'+p.y+'px"><i>'+ICO[i]+'</i><span id="s1-sl'+i+'" style="'+lab+'">'+s+'</span></div>'}).join('');
  }
  function at(p){var i=Math.max(0,Math.min(3,Math.floor(p))),f=p-i,a=G.pts[i],b=G.pts[i+1];return {x:a.x+(b.x-a.x)*f,y:a.y+(b.y-a.y)*f}}
  function place(el,x,y,ax,ay){el.style.transform='translate('+Math.round(x-el.offsetWidth*ax)+'px,'+Math.round(y-el.offsetHeight*ay)+'px)'}
  function clampX(x,wd){return Math.max(18+wd/2,Math.min(G.w-18-wd/2,x))}
  function show(el,o){el.style.opacity=o; el.style.visibility=o<=0.001?'hidden':'visible'}

  function render(t){
    t=((t%D)+D)%D;
    var GO=sm(k(t,11.3,12)); if(ghost) ghost.style.opacity=GO; scene.style.opacity=1-GO;
    if(ghost&&G.vert){ var gl=ghost.querySelectorAll('.stn span'); if(gl[4]) gl[4].style.opacity=sm(k(t,11.85,12)); }   /* ghost 'Client' waits until the outgoing card has gone */   /* true crossfade: end frame out, frame 0 in */
    if(t>=11.3) t=11.29;
    var vert=G.vert, sd=parseFloat(getComputedStyle(stage).getPropertyValue('--sd'))||56;
    /* card position: Ad -> Callback (works) -> Follow-up (stalls, leaks); after the fix: -> Sales call -> Client */
    var p=ease(k(t,.3,1.2))+ease(k(t,1.9,2.5))+ease(k(t,7.6,8.2))+ease(k(t,8.4,9.0));
    var X=sm(k(t,11.3,11.75)), IN=sm(k(t,11.65,12));                 /* loop: the end frame fades out, frame 0 fades in */
    if(t>=11.65){ p=0; }
    /* teal = steps that WORK. Ad and Callback work from the start; Follow-up only after the fix */
    var teal=Math.min(p,1); if(t>=6.6) teal=Math.max(2*sm(k(t,6.6,7.0))+0*1, Math.min(p,4)); if(t>=6.6&&t<7.0) teal=1+sm(k(t,6.6,7.0));
    if(t>=11.65) teal=0;
    var trail=(t>=1.9&&t<6.6)?Math.min(Math.max(p,1),2):0;          /* white = reached but not working */
    function dash(id,v,o){var el=$(id),L=G.len;el.style.strokeDasharray=L+' '+L;el.style.strokeDashoffset=L*(1-v/4);el.style.opacity=o}
    dash('r1',trail,1); dash('r2',teal,t>=11.3&&t<11.65?1-X:1);
    for(var i=0;i<5;i++){var s2=$('stn'+i), on=(i<=1? (i===0||t>=1.2) : (t>=6.6&&teal>=i-0.02));
      if(t>=11.3&&t<11.65) on=on&&X<0.5; if(t>=11.65) on=(i===0);
      s2.classList.toggle('on',on&&!(i===2&&t<7.0)); s2.classList.toggle('leak',i===2&&t>=3.6&&t<7.0); s2.classList.toggle('fixd',i===2&&t>=7.0&&t<11.0);}
    $('sl2').textContent=vert?'Follow-up':(t>=3.6&&t<7.0)?'Leak: follow-up':(t>=7.0&&t<11.0)?'Fixed: follow-up':'Follow-up';

    /* the card: one persistent actor, with a stem down to its station */
    if(vert){ var lensAt=2*ease(k(t,4.2,5.0)), lensOn=t>=4.1&&t<6.35, cardOn=!(t>=4.35&&t<6.4), stampOn=(t>=1.1&&t<1.95)||(t>=2.45&&t<4.05)||(t>=7.15&&t<7.65)||(t>=8.9);
      for(var j=0;j<5;j++){ var hide=(cardOn&&Math.abs(j-p)<0.75)||(stampOn&&(p>3.5?((p-j)>0&&(p-j)<1.4):((j-p)>0&&(j-p)<1.4)))||(lensOn&&Math.abs(j-lensAt)<0.75)||(j===2&&t>=5.0&&t<6.4)||(j===2&&t>=6.6&&t<7.3)||(t>=11.3)||(j===0&&t>=11.25);
        $('sl'+j).style.opacity=hide?0:1; } }
    var where=['from your ad','at callback','at follow-up','at sales call','now a client'][Math.max(0,Math.min(4,Math.round(p)))];
    $('csub').textContent=(t>=3.6&&t<6.3)?(vert?'at follow-up · gone cold':'gone cold'):(t>=9.0&&t<11.65)?'now a client':vert?where:'from your ad';
    var c=$('card'), cp=at(p), cw=c.offsetWidth, ch=c.offsetHeight;
    var cx=vert?(cp.x+sd/2+18+cw/2):clampX(cp.x,cw), cy=vert?cp.y:(cp.y-sd/2-34-ch/2);
    place(c,cx,cy,.5,.5);
    var grey=sm(k(t,3.4,3.8));
    var co=1; if(t>=4.0&&t<6.3) co=1-sm(k(t,4.0,4.3)); if(t>=6.3&&t<6.75) co=sm(k(t,6.45,6.75)); if(t>=11.3) co=t<11.65?1-X:IN;
    show(c,co);
    var g=grey>0.5&&t<6.3;
    c.style.borderColor=g?'rgba(150,170,168,.55)':'var(--teal-hi)'; c.style.background=g?'#1A2A2A':'#123836';
    c.style.boxShadow=g?'0 12px 28px -12px rgba(0,0,0,.6)':'0 12px 28px -12px rgba(0,0,0,.6),0 0 22px -6px rgba(63,224,214,.6)';
    $('cdot').style.background=g?'#7A8A88':'var(--teal-hi)';
    var stem=$('stem');
    if(vert){ stem.style.width=(sd/2+18)+'px'; stem.style.height='2px'; stem.style.background='linear-gradient(90deg,rgba(63,224,214,.15),var(--teal-hi))'; place(stem,cp.x+sd/2,cp.y,0,.5); }
    else { stem.style.height='34px'; stem.style.width='2px'; place(stem,cp.x,cp.y-sd/2-34,.5,0); }
    var settled=Math.abs(p-Math.round(p))<0.03;
    show(stem,co*(g?.35:1)*(vert&&!settled?0:1));

    /* one stamp at a time, below the rail (desktop) or under the card (phone) */
    var st=$('stamp'), txt='', cls='', o=0;
    if(t>=1.15&&t<1.9){txt='Called: send info';cls='good';o=sm(k(t,1.15,1.3))*(1-sm(k(t,1.75,1.9)))}
    else if(t>=2.5&&t<4.0){var day=Math.min(6,1+Math.floor((t-2.5)/0.18));txt=day<6?'Day '+day:'Day 6: no chase';cls=day<6?'':'bad';o=sm(k(t,2.5,2.65))*(1-sm(k(t,3.85,4.0)))}
    else if(t>=7.2&&t<7.6){txt='Replied';cls='good';o=sm(k(t,7.2,7.3))*(1-sm(k(t,7.5,7.6)))}
    else if(t>=8.95&&t<11.3){txt='Signed';cls='good';o=sm(k(t,8.95,9.1))*(1-sm(k(t,11.1,11.3)))}
    if(st.textContent!==txt) st.textContent=txt; st.className='stamp '+cls; show(st,o);
    if(vert) place(st,Math.min(cx-cw/2,G.w-14-st.offsetWidth),p>3.5?(cy-ch/2-10):(cy+ch/2+10),0,p>3.5?1:0);
    else place(st,clampX(cp.x,st.offsetWidth),cp.y+sd/2+44,.5,0);

    /* the 45-min call is the hero: a lens travels the rail (fast start, slowing arrival) and LOCKS on Follow-up */
    var f2=G.pts[2], ln=$('lens'), lp=at(2*ease(k(t,4.2,5.0))), lo=sm(k(t,4.1,4.3))*(1-sm(k(t,6.05,6.35)));
    var pulse=1+.06*Math.sin(Math.max(0,t-5.0)*7)*(1-k(t,5.0,6.0));
    ln.style.transform='translate('+Math.round(lp.x-ln.offsetWidth/2)+'px,'+Math.round(lp.y-ln.offsetHeight/2)+'px) scale('+pulse+')';
    show(ln,lo);
    var nt=$('note'), no=sm(k(t,5.05,5.3))*(1-sm(k(t,6.05,6.35))), rise=(1-ease(k(t,5.05,5.45)))*10;
    show(nt,no); if(vert) place(nt,Math.min(f2.x+sd/2+30,G.w-14-nt.offsetWidth),f2.y+8+rise,0,0); else place(nt,f2.x,f2.y+sd/2+44+rise,.5,0);

    /* the fix: three chase ticks, then "Replied" */
    var tk=$('ticks'), to2=sm(k(t,6.65,6.8))*(1-sm(k(t,7.1,7.2)));
    [].forEach.call(tk.children,function(el,i){var a=sm(k(t,6.7+i*.13,6.82+i*.13));el.style.transform='scale('+(.4+.6*a)+')';el.style.opacity=a});
    show(tk,to2); if(vert) place(tk,Math.min(cx-cw/2,G.w-14-tk.offsetWidth),cy+ch/2+10,0,0); else place(tk,f2.x,f2.y+sd/2+44,.5,0);

    /* slow push through the readable holds */
    scene.style.transform='scale('+(1+.02*sm(k(t,2.5,4.0))*(1-sm(k(t,4.0,4.6)))+.03*sm(k(t,9.0,10.4))*(1-sm(k(t,10.6,11.2))))+')';
  }

  var T0=performance.now(), seekT=null, running=false;
  window.__seek_s1=function(t){seekT=t;layout();snap();render(t)};
  var pausedAt=null;   /* WCAG 2.2.2: the 12 s loop gets its own pause control (page critic 2, 6 Oct) */
  function loop(now){ if(seekT===null && pausedAt===null) render((now-T0)/1000); requestAnimationFrame(loop) }
  if(!RM && window.AIML && AIML.pauseBtn) AIML.pauseBtn(stage, { pause: function(){ pausedAt=performance.now(); }, play: function(){ if(pausedAt!==null){ T0+=performance.now()-pausedAt; pausedAt=null; } } });
  function start(){ layout(); snap(); if(running||RM){ render(RM?10.5:0); return; } running=true; T0=performance.now(); requestAnimationFrame(loop) }
  layout(); snap(); render(RM?10.5:0);
  addEventListener('resize',function(){layout();snap();render(seekT!==null?seekT:running?(performance.now()-T0)/1000:(RM?10.5:0))});
  if(document.fonts) document.fonts.ready.then(function(){layout();snap();render(seekT!==null?seekT:RM?10.5:0)});
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)start()})},{threshold:.3}).observe(stage); else start();

  /* facts show their final values only: a count-up paints figures the copy never states (6 Oct, same rule as s1b) */

})();}catch(e){console.error('section s1 failed', e)}
/* ---- s1b ---- */
try{(function(){
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

/* ---------- ledger: the three numbers are always their true, final values; the motion lives in the globe and the bars ---------- */

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
  [7.2, 23, 79, -.32, 4], [9.5, 22.5, 84, -.38, 3], [11, 38, 252, 0, 4]];
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
  /* the loop never clears the globe: North America keeps its lit clients and faint arcs (re-traced in teal each loop), while
     India's arcs fade slowly as they turn away across the Pacific */
  var inO = still ? 1 : 1 - sm(k(t, 9.8, 10.8)), maO = still ? 1 : 1 - sm(k(t, 9.6, 10.7)), hi = 0;
  /* Vancouver: the origin, always lit; a ring at the start of every loop and as the long arc leaves */
  setMk(0, 9, still ? 1 : 1 - sm(k(t, 9.55, 9.9)) * (1 - sm(k(t, 10.3, 10.55))), still ? 0 : (t < 1 ? k(t, .1, .95) : k(t, MA0 - .05, MA0 + .7)), true);
  /* North America */
  NA.forEach(function (p, j) {
    var s0 = NA0 + j * NAS, before = !still && t < s0, pr = before ? 1 : eo(k(t, s0, s0 + NAD));
    setArc(G.A.na[j], still ? 1 : pr, still || before ? 1 : sm(k(t, s0 + NAD, s0 + NAD + .5)), still || before ? .45 : (.95 - .5 * sm(k(t, s0 + NAD, s0 + NAD + .5))), hi++);
    setMk(2 + j, 6, 1, still || before ? 0 : k(t, s0 + NAD * .9, s0 + NAD + .7), true);
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

})();}catch(e){console.error('section s1b failed', e)}
/* ---- s2b ---- */
try{(function(){
/* S2b v6: deterministic render(t), t in [0,9.5). window.__seek_s2b(t). Persistent actor = the deck of 13 cards.
   0-0.25 the deck, tilted on the table | 0.25-2.5 cards fan out in number order into a hand (desktop: every number
   corner stays visible; phone: a vertical cascade), each stamped with its tier as it lands | 2.9-4.9 dealt one by one,
   in number order, into the readable spread (the real grid) | 5.0-6.9 tiers light cumulatively: Free (2), Sprint adds
   (6), Accelerator all 13, under a slow push | 6.9-7.4 lights ease off | 7.4-8.0 the cards gather back into a deck
   that fills ~60% of the table, 12 first, so 00 ends on top (desktop: names hide in the fan) | 9.5 = 0: no crossfade. Reduced motion: the spread, static.
   The clock is offset by START (4.95 s) so the loop OPENS on the finished spread: seek t maps to story time t + 4.95. */
var root = document.getElementById('s2b');
if (!root) return;
var RM = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var stage = root.querySelector('.s2b-stage'), table = root.querySelector('.s2b-table'), deck = root.querySelector('.s2b-deck');
var cards = [].slice.call(root.querySelectorAll('.s2b-k')), keys = [].slice.call(root.querySelectorAll('.s2b-key li'));
if (!stage || !table || !deck || cards.length !== 13) return;
var D = 9.5, TIER = cards.map(function (c) { return c.classList.contains('s2b-t0') ? 0 : c.classList.contains('s2b-t1') ? 1 : 2; });
var slots = root.querySelector('.s2b-slots'), stamps = cards.map(function (c) { return c.querySelector('em'); }), names = cards.map(function (c) { return c.querySelector('span'); });
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function ease(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function mix(a, b, x) { var o = {}; for (var p in a) o[p] = a[p] + (b[p] - a[p]) * x; return o; }
var dep = function (i) { return 0.25 + 0.15 * i; }, settle = function (i) { return 2.9 + 0.13 * i; }, gath = function (i) { return 7.4 + 0.025 * (12 - i); }, gdur = function () { return 0.3; };   /* page critic 4: the collapse takes 0.6 s */
var LIT = [5.0, 5.6, 6.2], LOFF = 6.9, START = 4.95;

var G = null;
function layout() {
  if (!table.clientWidth) return false;
  cards.forEach(function (c) { c.style.transform = ''; });
  deck.style.transform = '';
  var W = table.clientWidth, H = table.clientHeight, narrow = W < 560;
  var P = cards.map(function (c) { return { x: c.offsetLeft + c.offsetWidth / 2, y: c.offsetTop + c.offsetHeight / 2 }; });
  var cw = cards[0].offsetWidth, ch = cards[0].offsetHeight;
  var Dc = { x: W / 2, y: narrow ? ch * 2 + 16 : H / 2 - 10 };   /* phone: clear of the tier key above the table */
  /* the gathered deck fills about 60% of the table (page critic 4: a card-sized stack left ~85% of the stage empty) */
  var DS = Math.max(narrow ? 1.25 : 1.22, Math.min(0.6 * W / cw, 0.68 * H / (cw * 0.36 + ch * 0.7)));   /* tilted 42 deg, turned ~20 deg: its box stays clear of the key */
  G = { P: P, Dc: Dc, narrow: narrow, W: W, H: H, cw: cw, ch: ch, DS: DS };
  return true;
}
function deckP(i, t) {
  var g = G, p = g.P[i], jit = ((i * 37) % 7 - 3) * 0.7;   /* a hand-squared deck: the edges show, deterministic */
  return { x: g.Dc.x - p.x, y: g.Dc.y - p.y, z: 64 + (12 - i) * 4,   /* lifted off the table: the tilted deck never cuts the flat cards */
     rx: g.narrow ? 50 : 42, rz: (g.narrow ? -10 : -18) + jit + 3 * Math.sin(2 * Math.PI * t / D) + 2.4 * Math.sin(t * 2.8 + i * 0.55), s: g.DS };   /* the resting deck riffles: its edges fan and close, so it never sits still */
}
function fanP(i, t) {
  var g = G, p = g.P[i], br = 1 + 0.03 * sm(k(t, 2.45, 2.9));   /* the full hand breathes open before the deal */
  if (g.narrow) {   /* phone: a vertical cascade down the table, every number and name visible */
    var top = 8 + g.ch * 0.33, step = Math.min(38, (g.H - top - g.ch * 0.33) / 12) * br;
    return { x: g.Dc.x + 14 * Math.sin((i / 12 - 0.5) * Math.PI) - p.x, y: top + i * step - p.y, z: i * 3, rx: 56, rz: (i / 12 - 0.5) * 8, s: 0.95 };
  }
  /* desktop: a hand of cards on a pivot below; the per-card offset is set so 13 fit and each number corner shows */
  /* flat on the table (rx 0) so the layering is by z alone: each card sits on the one before, number corner clear */
  var s = 0.74, off = Math.min(54, (g.W - g.cw * s - 24) / 12) * br, Rp = 560, a = (i - 6) * off / Rp;
  return { x: g.Dc.x + Rp * Math.sin(a) - p.x, y: g.Dc.y - 30 + Rp * (1 - Math.cos(a)) - p.y, z: i * 6, rx: 0, rz: a * 180 / Math.PI, s: s };
}
var SP = { x: 0, y: 0, z: 0, rx: 0, rz: 0, s: 1 };

function render(t) {
  if (!G) return;
  t = (((t + START) % D) + D) % D;   /* frame 0 = the finished spread (critic, 6 Oct): the loop starts where the tiers light */
  var lit = [0, 1, 2].map(function (n) { return sm(k(t, LIT[n], LIT[n] + 0.25)); });
  cards.forEach(function (c, i) {
    var p, a = dep(i), b = settle(i), g = gath(i), gd = gdur(i), lift = 0, zi;
    /* layering by z-index (deterministic): deck 00 on top; whatever is in flight above everything; the fan by index */
    if (t < a) { p = deckP(i, t); zi = 100 + 12 - i; }
    else if (t < a + 0.45) { p = mix(deckP(i, t), fanP(i, t), ease(k(t, a, a + 0.45))); zi = 300 + i; }
    else if (t < b) { p = fanP(i, t); zi = 200 + i; }
    else if (t < b + 0.4) { zi = 300 + i; var e = ease(k(t, b, b + 0.4)); p = mix(fanP(i, t), SP, e); lift = 30 * Math.sin(Math.PI * e); }
    else if (t < g) { p = mix(SP, SP, 0); p.s = 1 + 0.03 * (1 - sm(k(t, b + 0.4, b + 0.6))); zi = 10; }   /* a small landing settle */
    else if (t < g + gd) { var e2 = sm(k(t, g, g + gd)); p = mix(SP, deckP(i, t), e2); lift = 50 * Math.sin(Math.PI * e2); zi = 300 + 12 - i; }
    else { p = deckP(i, t); zi = 100 + 12 - i; }
    c.style.zIndex = zi;
    /* cumulative: a card lights when its own tier or any later tier is lit (Sprint includes Free, Accelerator all 13) */
    var L = Math.max.apply(null, lit.filter(function (_, n) { return n >= TIER[i]; })) * (1 - sm(k(t, LOFF + 0.03 * i, LOFF + 0.03 * i + 0.35)));
    c.style.transform = 'perspective(1400px) translate3d(' + p.x.toFixed(1) + 'px,' + (p.y - 6 * L).toFixed(1) + 'px,0) rotateX(' + p.rx.toFixed(2) + 'deg) rotateZ(' + p.rz.toFixed(2) + 'deg) translateZ(' + (p.z + 18 * L + lift).toFixed(1) + 'px) scale(' + p.s.toFixed(3) + ')';
    c.style.boxShadow = L > 0.01 ? '0 0 0 ' + (3 * L).toFixed(2) + 'px var(--accent),0 18px 30px -14px rgba(0,115,110,' + (0.55 * L).toFixed(2) + ')' : '';
    /* the tier stamp lands with the card (desktop: in the fan; phone: in the spread) and lifts off as it is gathered */
    var at = G.narrow ? b + 0.3 : a + 0.35, so = sm(k(t, at, at + 0.15)) * (1 - sm(k(t, g, g + 0.2)));
    stamps[i].style.opacity = so.toFixed(3);
    /* desktop: the name hides while the card sits in the overlapping fan (only the number corner shows there) */
    names[i].style.opacity = G.narrow ? '' : (1 - sm(k(t, a, a + 0.12)) + sm(k(t, b + 0.15, b + 0.4))).toFixed(3);
    stamps[i].style.transform = 'scale(' + (1 + 0.35 * (1 - ease(k(t, at, at + 0.3)))).toFixed(3) + ')';
  });
  keys.forEach(function (key, n) {
    var pulse = 0;
    cards.forEach(function (c, i) { if (TIER[i] === n) { var at = G.narrow ? settle(i) + 0.3 : dep(i) + 0.35; pulse = Math.max(pulse, Math.sin(Math.PI * k(t, at, at + 0.35))); } });
    var on = Math.max.apply(null, lit.filter(function (_, m) { return m >= n; })) * (1 - sm(k(t, LOFF, LOFF + 0.4)));
    key.style.background = on > 0.01 ? 'rgba(0,161,155,' + on.toFixed(3) + ')' : '';
    key.style.borderColor = on > 0.01 ? 'rgba(0,161,155,' + Math.max(on, 0.3).toFixed(3) + ')' : '';
    key.classList.toggle('lit', on > 0.5);
    key.style.transform = 'scale(' + (1 + 0.06 * pulse).toFixed(3) + ')';
    key.style.boxShadow = pulse > 0.01 ? '0 0 0 ' + (3 * pulse).toFixed(1) + 'px rgba(0,161,155,.35)' : '';
  });
  /* the empty slots stay quiet while the deck owns the frame, and come up as the deal starts */
  slots.style.opacity = (0.3 + 0.7 * sm(k(t, 2.7, 3.1)) * (1 - sm(k(t, 7.6, 9.0)))).toFixed(3);
  /* a slow push while the tiers light */
  deck.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 4.9, 6.9)) * (1 - sm(k(t, 6.9, 7.5)))).toFixed(4) + ')';
}

var T0 = 0, base = 0, running = false, paused = false, seekT = null, raf = 0, inView = false;
function now() { return base + (running ? (performance.now() - T0) / 1000 : 0); }
function tick() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(tick) : 0; }
function play() { if (running || RM || paused || !inView) return; if (!G && !layout()) return; running = true; T0 = performance.now(); raf = requestAnimationFrame(tick); }
function stop() { if (!running) return; base = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s2b = function (t) { seekT = t; if (!G) layout(); render(t); };
function relayout() { if (RM || !layout()) return; render(seekT !== null ? seekT : now()); }
function boot() { if (RM || G || !table.clientWidth) return; if (layout()) render(0); }
boot();
document.addEventListener('aiml:reveal', function () { setTimeout(boot, 0); });
addEventListener('resize', function () { if (G) relayout(); });
if (document.fonts) document.fonts.ready.then(function () { if (G) relayout(); else boot(); });
if (!RM && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting; if (inView) { boot(); play(); } else stop(); });
  }, { threshold: 0.25 }).observe(stage);
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; play(); } });
}

})();}catch(e){console.error('section s2b failed', e)}
/* ---- s3 ---- */
try{(function(){
/* S3 v6: deterministic render(t), t in [0,14). window.__seek_s3(t). Persistent actor = the SKILL.md card.
   0 frame 0: the card on Cold email | 0.4-1.1 the terminal opens a slot and the card docks, its path lights |
   1.2-2.8 the four recorded output lines | 2.5-3.9 three real drafts materialise, newest on top | 3.9-4.65 "You approve"
   is pressed | 4.7-5.25 pills flip to Approved | 5.6-6.3 the card arcs back to Cold email | 6.3-12.2 it rides the loop,
   re-written once per step (Landing page, Follow-up in full) | 12.2-13 end frame | 13-14 reset: the trail wipes along
   the track back to Cold email, the drafts file away. 14 == 0, so no crossfade. Reduced motion: the end frame, static.
   Laid out only when the stage has a width (sections are hidden until the VSL reveal). */
var root = document.getElementById('s3');
if (!root) return;
var stage = root.querySelector('.s3-stage'), scene = root.querySelector('.s3-scene');
if (!stage || !scene) return;
var RM = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
var D = 14, END = 12.6;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function ease(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function lerp(a, b, x) { return a + (b - a) * x; }
var Q = function (s) { return scene.querySelector(s); }, QA = function (s) { return [].slice.call(scene.querySelectorAll(s)); };

var NAMES = ['Offer', 'Content', 'Cold email', 'LinkedIn', 'Ads', 'Landing page', 'Fast callback', 'Follow-up', 'Sales call', 'Delivery', 'Reporting', 'Repeat buying'];
var FILES = ['offer', 'content', 'hot-outreach', 'linkedin', 'ads', 'landing-page', 'fast-callback', 'follow-up', 'sales-call', 'delivery', 'reporting', 'repeat-buying'];
var QUOTE = 'give the fix away free in message one';
var T_RIDE = 6.3;
/* the ride: from Cold email once round the loop. key = shown in full (drafting -> approved), yes = the gate */
var STOPS = [{ s: 2 }, { s: 3 }, { s: 4 }, { s: 5, key: 1 }, { s: 'yes' }, { s: 6 }, { s: 7, key: 1 }, { s: 8 }, { s: 9 }, { s: 10 }, { s: 11 }, { s: 0, far: 1 }, { s: 1 }, { s: 2, wrap: 1 }];
(function () {
  var t = T_RIDE;
  STOPS.forEach(function (p, j) {
    if (j) t += p.far ? 0.36 : 0.26;
    p.arr = t; t += p.key ? 0.55 : p.s === 'yes' ? 0.25 : 0.12; p.dep = t;
  });
})();

var G = null, laid = false;
var card = Q('.s3-card'), c1 = Q('.s3-c1 b'), cq = Q('.s3-cq'), cs = Q('.s3-cs'), csI = QA('.s3-cs i');
var sts = QA('.s3-st'), yes = Q('.s3-yes'), again = Q('.s3-again'), lead = Q('.s3-lead'), bc = Q('.s3-bc');
var t0p = Q('.s3-t0'), t1p = Q('.s3-t1'), now_ = Q('.s3-now'), nowZ = Q('.s3-now span'), nowN = Q('.s3-now b');
var lines = QA('.s3-ln'), em = Q('.s3-pr em'), drs = QA('.s3-dr'), btn = Q('.s3-ok'), ptr = Q('.s3-ptr');
var slots = QA('.s3-sl'), dock = Q('.s3-dock'), dock2 = Q('.s3-dock2'), paneT = Q('.s3-pa-t'), paneD = Q('.s3-pa-d'), paneL = Q('.s3-pa-l'), zup = Q('.s3-zl-up'), zdn = Q('.s3-zl-down');

function rel(el) {
  var s = scene.getBoundingClientRect(), r = el.getBoundingClientRect();
  return { l: r.left - s.left, t: r.top - s.top, w: r.width, h: r.height };
}
function place(el, x, y, extra) { el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (extra || ''); }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

function layout() {
  if (!stage.clientWidth) return false;
  var narrow = matchMedia('(max-width:899px)').matches, swap = narrow && !RM;
  stage.classList.add('s3-js');
  stage.classList.toggle('s3-swap', swap);
  [card, ptr, lead, bc, yes, again, zup, zdn, now_].concat(sts, drs, [paneT, paneD, paneL]).forEach(function (e) { e.style.transform = ''; });
  scene.style.transform = ''; scene.style.height = ''; scene.style.gridTemplateRows = ''; paneL.style.height = '';
  /* measure the card at its fullest, open both docks to fit it */
  card.style.width = '';
  c1.textContent = 'hot-outreach'; cq.textContent = QUOTE; show(cq, 1);
  dock.style.height = 'auto'; dock.style.marginBottom = '';
  card.style.width = Math.min(narrow ? 280 : 304, dock.clientWidth - 16) + 'px';
  var dh = card.offsetHeight + 16;
  dock.style.height = dh + 'px'; dock2.style.height = dh + 'px';
  if (narrow && !swap) { dock.style.height = '0px'; dock.style.marginBottom = '-8px'; paneL.style.height = '380px'; }   /* reduced motion on a phone: the finished frame never opens the dock */
  if (swap) { var H = Math.max(paneT.offsetHeight, paneD.offsetHeight, 340); scene.style.height = H + 'px'; paneL.style.height = H + 'px'; }
  else if (!narrow) scene.style.gridTemplateRows = paneT.offsetHeight + 'px auto';   /* the top row keeps its height while the dock opens and closes */

  var lw = paneL.clientWidth, lh = paneL.clientHeight, g = { narrow: narrow, swap: swap, dh: dh };
  var y0 = narrow ? 50 : 66, y1 = lh - y0, ym = (y0 + y1) / 2;
  var x0 = narrow ? 24 : 62, x1 = narrow ? lw - 24 : lw - 34, r = narrow ? 34 : (y1 - y0) / 2;
  var a = ym - y0 - r, q = Math.PI * r / 2, T = x1 - x0 - 2 * r, S = y1 - y0 - 2 * r, tot = 2 * a + S + 2 * T + 4 * q;
  var d = 'M' + x0 + ' ' + ym + 'L' + x0 + ' ' + (y0 + r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x0 + r) + ' ' + y0 + 'L' + (x1 - r) + ' ' + y0 +
    'A' + r + ' ' + r + ' 0 0 1 ' + x1 + ' ' + (y0 + r) + 'L' + x1 + ' ' + (y1 - r) + 'A' + r + ' ' + r + ' 0 0 1 ' + (x1 - r) + ' ' + y1 +
    'L' + (x0 + r) + ' ' + y1 + 'A' + r + ' ' + r + ' 0 0 1 ' + x0 + ' ' + (y1 - r) + 'L' + x0 + ' ' + ym;
  t0p.setAttribute('d', d);
  t1p.setAttribute('d', d + d.replace('M', 'L'));   /* drawn twice so the trail can run past the start */
  g.tot = tot; g.ym = ym; g.y0 = y0; g.y1 = y1; g.x0 = x0; g.x1 = x1; g.lw = lw;
  var pr = rel(paneL); g.pl = pr.l; g.pt = pr.t;
  g.len = []; g.pos = [];
  sts.forEach(function (st, i) {
    var up = i < 6, n = up ? i : i - 6, X = up ? (x0 + r) + T * n / 5 : x1 - r - T * n / 5;
    st.classList.toggle('up', up); st.classList.toggle('dn', !up);
    g.len[i] = up ? a + q + (X - x0 - r) : a + 2 * q + T + S + q + (x1 - r - X);
    g.pos[i] = { x: X, y: up ? y0 : y1 };
    place(st, X, up ? y0 : y1);
  });
  g.len.yes = a + 2 * q + T + S / 2;
  if (!narrow) place(again, x0 - again.offsetWidth / 2, ym - again.offsetHeight / 2);
  place(zup, 0, narrow ? 0 : 6); place(zdn, 0, lh - zdn.offsetHeight - (narrow ? 0 : 6));
  var base = g.len[2];
  STOPS.forEach(function (p) { var L = p.s === 'yes' ? g.len.yes : g.len[p.s]; if (L < base - 1 || p.wrap) L += tot; p.U = L; });
  g.base = base;

  var cw = card.offsetWidth, ch = card.offsetHeight; g.cw = cw; g.ch = ch; g.rs = narrow ? Math.min(0.78, (lw - 2 * (yes.offsetWidth / 2 + 24 + 8)) / cw) : 1;   /* phone: clear of Yes and the track */
  var dk = rel(dock), dk2 = rel(dock2);
  g.dock = { x: dk.l + (narrow ? (dk.w - cw) / 2 : 8), y: dk.t + 8 };
  g.dock2 = { x: dk2.l + (dk2.w - cw) / 2, y: dk2.t + 8 };
  var minC = narrow ? lw / 2 : x0 + again.offsetWidth / 2 + 16 + cw / 2, maxC = narrow ? lw / 2 : x1 - yes.offsetWidth / 2 - 16 - cw / 2;
  var cyRail = narrow ? ym + 26 : ym;   /* phone: the card sits a little low, the station name is printed above it */
  g.cyRail = cyRail;
  if (narrow) place(again, x0 - 12, Math.min(y1 - r - again.offsetHeight, cyRail + ch * g.rs / 2 + 12));   /* phone: a pill on the left side, below the card */
  g.rail = function (px) { return { x: g.pl + Math.max(minC, Math.min(maxC, px)) - cw / 2, y: g.pt + cyRail - ch / 2 }; };
  g.slot = drs[1].offsetTop - drs[0].offsetTop;
  g.btn = rel(btn); g.tw = rel(Q('.s3-tw'));
  G = g; laid = true;
  render(0);
  return true;
}

function typed(s, x) { return s.slice(0, Math.round(s.length * cl(x))); }

function render(t) {
  if (!laid) return;
  t = ((t % D) + D) % D;
  var g = G, swap = g.swap, RS = t >= 13 ? sm(k(t, 13.0, 13.9)) : 0;   /* RS = the reset at the end of the loop */

  /* phone: one panel at a time with a short crossfade slide, so the stage is never empty at a hand-off (loop -> terminal -> drafts -> loop) */
  if (swap) {
    var win = function (a, b) {   /* crossfade: the next panel is half in by the time the old one is half out (in over a +-.1, out over b +-.1: a 0.2 s double exposure, never an empty stage) */
      if (t < a - 0.1 || t > b + 0.1) return [0, 0];
      var i = sm(k(t, a - 0.1, a + 0.1)), o = 1 - sm(k(t, b - 0.1, b + 0.1));
      return [Math.min(i, o), i < 1 ? (1 - i) * 16 : -(1 - o) * 16];
    };
    var L = t < 1 ? win(-1, 0.55) : win(5.72, 15), Tn = win(0.55, 2.42), Dn = win(2.42, 5.72);
    [[paneL, L], [paneT, Tn], [paneD, Dn]].forEach(function (p) { show(p[0], p[1][0]); p[0].style.transform = 'translateX(' + p[1][1].toFixed(1) + 'px)'; });
  } else [paneL, paneT, paneD].forEach(function (p) { show(p, 1); p.style.transform = ''; });

  /* the ride: unwrapped length U along the loop */
  var U = STOPS[0].U, cur = 0;
  if (t >= T_RIDE) {
    for (var j = 0; j < STOPS.length; j++) if (t >= STOPS[j].arr) cur = j;
    var nx = STOPS[cur + 1];
    U = STOPS[cur].U;
    if (nx && t > STOPS[cur].dep) U = lerp(STOPS[cur].U, nx.U, ease(k(t, STOPS[cur].dep, nx.arr)));
  }
  var S0 = g.base + RS * g.tot, tr = Math.max(0, U - S0);
  if (t >= 13) { U = STOPS[STOPS.length - 1].U; tr = U - S0; }
  t1p.style.strokeDasharray = tr + ' ' + 3 * g.tot; t1p.style.strokeDashoffset = -S0; t1p.style.opacity = tr > 1 ? 1 : 0;
  var bp = t0p.getPointAtLength(((U % g.tot) + g.tot) % g.tot);
  place(bc, bp.x - 13, bp.y - 13);
  var docked = t >= 0.5 && t < 6.3;
  show(bc, docked ? 1 - sm(k(t, 0.5, 0.7)) * (1 - sm(k(t, 6.1, 6.3))) : 1);
  var lit = function (s) {   /* a station is lit once the card has been there, until the reset wipe passes it */
    if (s === 2) return true;
    if (t < T_RIDE) return false;
    for (var j = 1; j <= cur; j++) if (STOPS[j].s === s) return !(t >= 13 && S0 > STOPS[j].U + 1);
    return false;
  };
  sts.forEach(function (st, i) {
    st.classList.toggle('off', !lit(i));
    st.querySelector('span').style.opacity = g.narrow ? 0 : 1;   /* phone: the current station is printed large instead */
  });
  var ys = 1 + 0.35 * Math.sin(Math.PI * k(t, STOPS[4].arr, STOPS[4].arr + 0.3));
  yes.classList.toggle('off', !lit('yes'));
  place(yes, g.x1 - yes.offsetWidth / 2, g.ym - yes.offsetHeight / 2, ' scale(' + ys.toFixed(3) + ')');

  /* which file the card is writing: the last real station it reached */
  var m = cur; while (m > 0 && STOPS[m].s === 'yes') m--;
  var stp = STOPS[m], onRide = t >= T_RIDE && t < 13;

  /* the card: on Cold email, docked, arcs back, rides */
  var railP = g.rail(t >= T_RIDE ? bp.x : g.pos[2].x), dk = swap && t >= 2.3 ? g.dock2 : g.dock, pos;
  if (t < 0.5) pos = railP;
  else if (t < 1.1) { var e = ease(k(t, 0.5, 1.1)); pos = { x: lerp(railP.x, g.dock.x, e), y: lerp(railP.y, g.dock.y, e) - 30 * Math.sin(Math.PI * e) }; }
  else if (swap && t >= 2.3 && t < 2.6) { var e2 = ease(k(t, 2.3, 2.6)); pos = { x: lerp(g.dock.x, g.dock2.x, e2), y: lerp(g.dock.y, g.dock2.y, e2) }; }
  else if (t < 5.6) pos = dk;
  else if (t < 6.3) {   /* desktop: slide right along the dock row (over no text), then drop to the loop; phone: straight down */
    var ex = swap ? dk.x : g.tw.l + g.tw.w - g.cw - 8, e3 = sm(k(t, 5.6, 5.85)), e4 = ease(k(t, 5.85, 6.3));
    pos = t < 5.85 ? { x: lerp(dk.x, ex, e3), y: dk.y - 6 * Math.sin(Math.PI * e3) } : { x: lerp(ex, railP.x, e4), y: lerp(dk.y, railP.y, e4) };
  } else pos = railP;
  var onRail = t < 0.5 ? 1 : t < 1.1 ? 1 - ease(k(t, 0.5, 1.1)) : t < 5.6 ? 0 : sm(k(t, 5.6, 6.3));
  var flying = (t >= 0.5 && t < 1.1) || (t >= 5.6 && t < 6.3);
  var sc = (flying ? 1.04 : 1) * lerp(1, g.rs, onRail);
  place(card, pos.x, pos.y, ' scale(' + sc.toFixed(3) + ')');
  card.style.boxShadow = flying ? '0 26px 44px -16px rgba(0,0,0,.75),0 0 30px -6px rgba(63,224,214,.7)' : '';

  /* card text: name re-typed at every step it reaches on the ride; line 2 = the real skill line, then drafting -> approved */
  var name = FILES[stp.s], nxv = (t >= T_RIDE && m > 0 && !stp.wrap) ? k(t, stp.arr, stp.arr + (stp.key ? 0.25 : 0.12)) : 1;
  var nm = typed(name, nxv); if (c1.textContent !== nm) c1.textContent = nm;
  if (cq.textContent !== QUOTE) cq.textContent = QUOTE;
  /* one text layer at a time: the skill line goes, then the status comes (and the reverse at the reset) */
  var qO = t < 13 ? 1 - sm(k(t, 5.9, 6.1)) : sm(k(t, 13.45, 13.6)), sO = t < 13 ? sm(k(t, 6.1, 6.3)) : 1 - sm(k(t, 13.3, 13.45));
  show(cq, qO); show(cs, sO);
  var drafting = onRide && stp.key && t < stp.arr + 0.32;
  csI[0].style.display = drafting ? '' : 'none'; csI[1].style.display = drafting ? 'none' : '';

  /* phone: the station the card is on, printed large inside the loop */
  if (g.narrow) {
    nowN.textContent = NAMES[stp.s];
    nowZ.textContent = (stp.s < 6 ? zup : zdn).textContent.split('(')[0].trim();   /* the zone word fits inside the loop at 320 */
    var nh = now_.offsetHeight;
    place(now_, 0, g.cyRail - g.ch * g.rs / 2 - 14 - nh);
    show(now_, sm(k(onRail, 0.9, 1)) * (onRide && m > 0 ? sm(k(t, stp.arr, stp.arr + 0.12)) : 1));   /* only once the card has landed */
  } else show(now_, 0);

  /* tether: from the card to the station it is on */
  var cL = g.rail(bp.x).x - g.pl;
  var tether = onRail > 0.99 && STOPS[cur].s !== 'yes' && bp.x > cL + 10 && bp.x < cL + g.cw - 10;
  if (tether) {
    var top = bp.y < g.ym, h2 = g.ch * g.rs / 2, ya = top ? bp.y + 14 : g.cyRail + h2, yb = top ? g.cyRail - h2 : bp.y - 14;
    lead.style.height = Math.max(0, yb - ya) + 'px'; place(lead, bp.x - 1, ya);
  }
  show(lead, tether ? (t >= T_RIDE && t < 13 ? sm(k(t, STOPS[cur].arr, STOPS[cur].arr + 0.08)) : 1) : 0);

  /* the dock opens for the card and closes after it leaves */
  var dO = t < 5.6 ? sm(k(t, 0.4, 0.95)) : 1 - sm(k(t, 5.85, 6.35));
  dock.style.height = (g.dh * dO).toFixed(1) + 'px';
  dock.style.borderColor = 'rgba(160,230,225,' + (0.22 * Math.min(1, dO * 3)).toFixed(3) + ')';
  dock.style.marginBottom = dO < 0.01 ? '-8px' : '';

  /* terminal: the path lights as the card docks, then the four recorded lines run; at the reset they wind back */
  var hl = k(t, 1.0, 1.2) * (1 - k(t, 13.0, 13.3));
  em.style.background = 'rgba(63,224,214,' + (0.22 * hl).toFixed(3) + ')';
  em.style.boxShadow = '0 0 0 2px rgba(63,224,214,' + (0.5 * hl).toFixed(3) + ')';
  em.style.color = hl > 0.5 ? 'var(--teal-hi)' : '';
  lines.forEach(function (ln, i) {
    var x = k(t, 1.2 + 0.4 * i, 1.5 + 0.4 * i) * (1 - sm(k(t, 13.0, 13.4)));
    ln.style.clipPath = 'inset(0 ' + ((1 - x) * 100).toFixed(1) + '% 0 0)';
    ln.style.opacity = x > 0 ? 1 : 0;
  });

  /* the empty draft slots shimmer while outreach-drafts.md is being written */
  var shim = k(t, 1.2, 2.8), sOn = Math.sin(Math.PI * shim);
  slots.forEach(function (sl, n) {
    var x = ((shim * 1.6 - n * 0.2) * 140 - 20).toFixed(1);
    sl.style.background = sOn > 0.01 ? 'linear-gradient(100deg,transparent ' + (+x - 20) + '%,rgba(63,224,214,' + (0.1 * sOn).toFixed(3) + ') ' + x + '%,transparent ' + (+x + 20) + '%)' : '';
  });

  /* drafts: Magic UI animated-list, newest enters on top and pushes the rest down; filed away at the reset */
  var out = sm(k(t, 13.0, 13.35));
  drs.forEach(function (dr, s) {
    var i = +dr.dataset.i, a = 2.5 + 0.5 * i, p = 0;
    for (var jj = i + 1; jj < 3; jj++) p += ease(k(t, 2.5 + 0.5 * jj, 2.9 + 0.5 * jj));
    var o = sm(k(t, a, a + 0.3)) * (1 - out), scl = 0.95 + 0.05 * ease(k(t, a, a + 0.4));
    dr.style.transform = 'translateY(' + ((p - s) * g.slot - 10 * out).toFixed(1) + 'px) scale(' + scl.toFixed(3) + ')';
    show(dr, o);
    var f = 4.7 + 0.2 * (2 - i), fx = k(t, f, f + 0.15), pi = dr.querySelectorAll('.s3-pill i');
    pi[0].style.opacity = 1 - fx; pi[1].style.opacity = fx;
    pi[1].style.transform = 'scale(' + (1 + 0.12 * Math.sin(Math.PI * k(t, f, f + 0.3))).toFixed(3) + ')';
    var bk = k(t, f - 0.05, f + 0.55);
    dr.style.setProperty('--bo', Math.sin(Math.PI * bk).toFixed(3));
    dr.style.setProperty('--ba', (360 * bk).toFixed(1) + 'deg');
    dr.style.borderColor = fx > 0.5 ? 'rgba(63,224,214,.7)' : '';
  });

  /* You approve: outlined until pressed */
  var pressed = k(t, 4.52, 4.65) * (1 - k(t, 13.1, 13.3)), push = Math.sin(Math.PI * k(t, 4.5, 4.7)), hover = sm(k(t, 3.9, 4.45)) * (1 - k(t, 4.5, 4.6));
  btn.style.background = pressed > 0.5 ? 'var(--teal-hi)' : 'transparent';
  btn.style.color = pressed > 0.5 ? '#032220' : 'var(--teal-hi)';
  btn.style.boxShadow = pressed > 0.5 ? '' : '0 0 0 ' + (6 * hover).toFixed(1) + 'px rgba(63,224,214,' + (0.18 * hover).toFixed(3) + ')';
  btn.style.transform = 'scale(' + (1 - 0.03 * push).toFixed(3) + ')';
  var b = g.btn, pe = ease(k(t, 3.9, 4.45));
  var px = lerp(Math.min(b.l + b.w + 40, scene.clientWidth - 30), b.l + b.w * 0.62, pe), py = lerp(b.t - 30, b.t + b.h * 0.55, pe);
  place(ptr, px, py, ' scale(' + (1 - 0.12 * push).toFixed(3) + ')');
  show(ptr, sm(k(t, 3.85, 4.0)) * (1 - sm(k(t, 5.1, 5.3))));

  /* a slow push through the payoff, released during the reset */
  scene.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 12.0, 12.9)) * (1 - sm(k(t, 13.0, 13.8)))).toFixed(4) + ')';
}

/* clock: runs only while in view and not paused; __seek_s3 for gates */
var T0 = 0, base = 0, running = false, paused = false, seekT = null, raf = 0, inView = false;
function now() { return base + (running ? (performance.now() - T0) / 1000 : 0); }
function tick() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(tick) : 0; }
function play() { if (running || RM || paused || !inView) return; if (!laid && !layout()) return; running = true; T0 = performance.now(); raf = requestAnimationFrame(tick); }
function stop() { if (!running) return; base = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s3 = function (t) { seekT = t; if (!laid) layout(); render(t); };
function relayout() { if (!layout()) return; render(seekT !== null ? seekT : RM ? END : now()); }
function boot() {
  if (laid || !stage.clientWidth) return;
  if (!layout()) return;
  if (!G.swap && !RM) base = 3.9;   /* desktop: the viewer's first frame is a finished state (three drafts written, Not sent, about to be approved); the loop runs on from there */
  render(RM ? END : base);
}
boot();
document.addEventListener('aiml:reveal', function () { setTimeout(boot, 0); });
addEventListener('resize', function () { if (laid) relayout(); });
if (document.fonts) document.fonts.ready.then(function () { if (laid) relayout(); else boot(); });
if (!RM && 'IntersectionObserver' in window) {
  new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting; if (inView) { boot(); play(); } else stop(); });
  }, { threshold: 0.25 }).observe(stage);
  if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; play(); } });
}

})();}catch(e){console.error('section s3 failed', e)}
/* ---- s4 ---- */
try{(function(){
/* S4 v6: the Sprint builds in 3D. Every state is a pure function of t (render(t), t in [0, D)); seek with window.__seek_s4(t).
   Loop: finished structure -> drains to its blueprint -> 15 sessions land floor by floor, each Friday lands its outcome
   (Fri 30: enquiries caught, Fri 6: 100 out, Fri 13: Demo day flag) -> the floors breathe apart and settle -> finished again
   (t = D is the same frame as t = 0, so the loop has no seam). Starts in view; reduced motion = the finished frame, still. */
var st = document.getElementById('s4-stage');
if (!st) return;
var RM = window.AIML && AIML.REDUCE, D = 14.6, NS = 'http://www.w3.org/2000/svg';
var cam = document.getElementById('s4-cam'), fx = document.getElementById('s4-fx'), nEl = document.getElementById('s4-n');
var boxes = [].slice.call(cam.querySelectorAll('.s4-box'));
var wks = [].slice.call(cam.querySelectorAll('.s4-wk')), ancs = [].slice.call(cam.querySelectorAll('.s4-anc'));
var out = document.getElementById('s4-out'), flag = document.getElementById('s4-flag');
var pole = flag.querySelector('.s4-pole'), pen = flag.querySelector('.s4-pen');
var rows = [].slice.call(st.querySelectorAll('.s4-weeks p'));

/* blueprint: a dashed ghost of every block, so the build fills a visible plan */
var ghosts = boxes.map(function (b) { var g = b.cloneNode(true); g.classList.add('s4-gh'); g.classList.remove('s4-fri'); cam.insertBefore(g, boxes[0]); return g; });

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function eo(x) { return 1 - Math.pow(1 - x, 3); }
function rnd(i) { var s = Math.sin(i * 12.9898) * 43758.5453; return s - Math.floor(s); }   /* seeded, deterministic */

/* timeline */
var W = [0.8, 4.4, 7.8], STEP = 0.34, FALL = 0.42;
function land(i) { return W[(i / 5) | 0] + (i % 5) * STEP + FALL; }
var FRI = [land(4), land(9), land(14)];

/* fx: three leader lines, the 100-out stream, the enquiries that get caught */
var leads = [0, 1, 2].map(function () { var p = document.createElementNS(NS, 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke', '#3FE0D6'); p.setAttribute('stroke-width', '1.5'); fx.appendChild(p); return p; });
function dots(n, cls) { var a = []; for (var i = 0; i < n; i++) { var r = document.createElementNS(NS, 'rect'); r.setAttribute('class', cls); fx.appendChild(r); a.push(r); } return a; }
/* phones: the 100 OUT tag sits under the structure (below FRI) and a leader climbs the stack's right side into Fri 6 */
var tagLead = document.createElementNS(NS, 'path'); tagLead.setAttribute('fill', 'none'); tagLead.setAttribute('stroke', '#3FE0D6'); tagLead.setAttribute('stroke-width', '1.5'); fx.appendChild(tagLead);
var tagEnd = document.createElementNS(NS, 'circle'); tagEnd.setAttribute('r', 3); tagEnd.setAttribute('fill', '#3FE0D6'); fx.appendChild(tagEnd);
var dayFri = cam.querySelectorAll('.s4-day')[4];
var pulse = document.createElementNS(NS, 'circle'); pulse.setAttribute('r', 3.5); pulse.setAttribute('fill', '#3FE0D6'); pulse.style.filter = 'drop-shadow(0 0 6px #3FE0D6)'; fx.appendChild(pulse);
var mail = dots(30, 'm'), inq = dots(7, 'q');
mail.forEach(function (r) { r.setAttribute('width', 11); r.setAttribute('height', 8); r.setAttribute('rx', 1.5); r.setAttribute('fill', '#0B2224'); r.setAttribute('stroke', '#3FE0D6'); r.setAttribute('stroke-width', 1.2); });
inq.forEach(function (r) { r.setAttribute('width', 14); r.setAttribute('height', 10); r.setAttribute('rx', 2); r.setAttribute('fill', '#3FE0D6'); r.setAttribute('stroke', '#0B2224'); r.setAttribute('stroke-width', 1.2); });

var S = null;   /* stage rect, refreshed per render */
function ctr(el) { var r = el.getBoundingClientRect(); return { x: r.left + r.width / 2 - S.left, y: r.top + r.height / 2 - S.top, r: r }; }
function show(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

function render(t) {
  /* v6.2: frame 0 is the FINISHED structure (Demo day up, floors breathing, all lit); it holds about 2.5 s with the camera
     moving, then crossfades into the dated blueprint and builds again (internal clock = viewer time + 12.6 s) */
  t = (((t + 12.6) % D) + D) % D;
  if (!st.offsetWidth) return;
  S = st.getBoundingClientRect();
  var drain = sm(k(t, 0.5, 1.0)), fin = t < 1.0 ? 1 - drain : 0;          /* fin: the finished frame showing (seam) */
  var br = sm(k(t, 11.8, 12.5)) * (1 - sm(k(t, 12.9, 13.6)));             /* exploded-layer breath */
  var bh = boxes[0].firstChild.offsetHeight;
  var y0 = parseFloat(getComputedStyle(cam).getPropertyValue('--y0')) || 26;
  var swing = getComputedStyle(rows[0].parentNode).position === 'absolute' ? 10 : 6;   /* stacked: a smaller swing keeps the structure clear of the stage edge */
  var yaw = y0 + 3 * Math.sin(2 * Math.PI * t / D) - swing * Math.pow(Math.sin(Math.PI * k(t, 11.8, 13.6)), 2);
  cam.style.setProperty('--y', yaw.toFixed(3));
  var lift = getComputedStyle(rows[0].parentNode).position === 'absolute' ? 0.55 : 0.3;   /* stacked layouts keep the lifted flag inside the stage */
  var lf = [0, 1, 2].map(function (f) { return (br * f * lift * bh).toFixed(2) + 'px'; });

  /* blocks: fall from above (fast start, slowing landing), flash teal-hi on landing; Fridays stay lit */
  var count = 0;
  boxes.forEach(function (b, i) {
    var f = (i / 5) | 0, d = i % 5, L = land(i), fri = d === 4;
    var q = k(t, L - FALL, L), o, dy, hot;
    if (t < 1.0 && t < L - FALL) { o = 1 - drain; dy = 0; hot = fri ? 0.3 * (1 - drain) : 0; }
    else {
      o = sm(k(t, L - FALL, L - FALL + (i ? 0.14 : 0.08)));   /* block 1 fades in fast and starts while the finished frame is still draining: never an empty blueprint */ dy = (1 - eo(q)) * 1.7 * bh;
      var flash = t >= L ? 1 - sm(k(t, L, L + (fri ? 1.1 : 0.45))) : 0;
      var nowF = fri && t >= L && t < (f < 2 ? W[f + 1] : 11.8);   /* the newest Friday breathes while its outcome is read */
      hot = Math.max(flash, fri && t >= L ? 0.3 + (nowF ? 0.12 * (1 - Math.cos(2 * Math.PI * (t - L) / 0.9)) : 0) : 0);
      if (t >= L) count++;
      if (t > 13.4) hot = Math.max(hot, 0.55 * Math.sin(Math.PI * k(t, 13.4 + (d + f) * 0.08, 13.8 + (d + f) * 0.08)));   /* end light pass */
    }
    b.style.setProperty('--o', o.toFixed(3)); b.style.setProperty('--dy', dy.toFixed(2) + 'px'); b.style.setProperty('--hot', hot.toFixed(3)); b.style.setProperty('--lf', lf[f]);
    b.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
    b.classList.toggle('dk', hot > 0.62);
    var g = ghosts[i]; g.style.setProperty('--lf', lf[f]); g.style.setProperty('--o', (dy >= 1 ? 1 : 1 - o).toFixed(3));
  });
  if (t < 1.0) count = t < 0.75 ? 15 : 0;
  nEl.textContent = (count < 10 ? '0' : '') + count;
  wks.forEach(function (w, f) { w.style.setProperty('--lf', lf[f]); });
  ancs.forEach(function (a, f) { a.style.setProperty('--lf', lf[f]); });
  out.style.setProperty('--lf', lf[1]); flag.style.setProperty('--lf', lf[2]);

  /* 100 out tag on Fri 6, Demo day flag on Fri 13 */
  var oo = t < 1.0 ? 1 - drain : sm(k(t, FRI[1] + 0.05, FRI[1] + 0.25));
  var clamped = false;
  if (out.offsetParent !== null) {
    var an = ctr(ancs[1]), ox = an.x + 2, oy = an.y - out.offsetHeight * 0.85;
    clamped = ox > S.width - out.offsetWidth - 14;
    if (clamped) {   /* no room beside Fri 6: below the structure, under FRI, 14 px inside the edge, with a leader up the stack's right side */
      var rt6 = boxes[9].children[2].getBoundingClientRect(), rt30 = boxes[4].children[2].getBoundingClientRect(), df = dayFri.getBoundingClientRect();
      ox = S.width - out.offsetWidth - 14; oy = df.bottom - S.top + 8;
      var gx = Math.min(S.width - 8, Math.max(rt6.right, rt30.right) - S.left + 6), ey = rt6.top + rt6.height / 2 - S.top, ex = rt6.right - S.left - 3;
      tagLead.setAttribute('d', 'M' + gx.toFixed(1) + ' ' + oy.toFixed(1) + 'V' + ey.toFixed(1) + 'H' + ex.toFixed(1));
      tagEnd.setAttribute('cx', ex.toFixed(1)); tagEnd.setAttribute('cy', ey.toFixed(1));
    }
    out.style.transform = 'translate(' + ox.toFixed(1) + 'px,' + oy.toFixed(1) + 'px)';
  }
  tagLead.style.opacity = tagEnd.style.opacity = clamped ? oo.toFixed(3) : 0;
  show(out, oo);   /* 2D tag pinned to Fri 6 (floor 2): beside it on wide layouts, under the structure with a leader on phones */
  var fo = t < 1.0 ? 1 - drain : sm(k(t, 10.9, 11.0));
  show(flag, fo);
  var up = t < 1.0 ? 1 : sm(k(t, 10.9, 11.25)), un = t < 1.0 ? 1 : sm(k(t, 11.15, 11.55));
  pole.style.transform = 'scaleY(' + up.toFixed(3) + ')';
  pen.style.transform = 'scaleX(' + un.toFixed(3) + ') skewY(' + (1.6 * Math.sin(2 * Math.PI * 11 * t / D)).toFixed(2) + 'deg)';
  pen.style.opacity = un > 0.02 ? 1 : 0;

  /* directory: a row lights when its Friday lands; the newest one carries the dot */
  var lit = t < 1.0 ? (t < 0.75 ? 3 : 0) : FRI.filter(function (x) { return t >= x + 0.05; }).length;
  rows.forEach(function (r, f) { r.classList.toggle('on', f < lit); r.classList.toggle('now', t >= 1.0 && f === lit - 1 && t < 11.8); });

  /* leader lines (desktop, directory beside the structure) */
  var side = getComputedStyle(rows[0].parentNode).position === 'absolute', pulseOn = 0;
  leads.forEach(function (p, f) {
    var on = side && (t < 1.0 ? 1 - drain : (t >= FRI[f] ? 1 : 0));
    if (!on) { p.style.opacity = 0; return; }
    var a = f === 1 ? (function () { var r = out.getBoundingClientRect(); return { x: r.right - S.left + 4, y: r.top + r.height / 2 - S.top }; })() : ctr(ancs[f]);
    var rr = rows[f].firstChild.getBoundingClientRect(), ex = rr.left - S.left - 14, ey = rr.top + rr.height / 2 - S.top, mx = (a.x + ex) / 2;
    if (f === 0 && out.offsetParent !== null && +out.style.opacity > 0.05) { var orr = out.getBoundingClientRect(); mx = Math.max(mx, orr.right - S.left + 12); }   /* Fri 30's line rises only past the 100 OUT tag */
    p.setAttribute('d', 'M' + a.x.toFixed(1) + ' ' + a.y.toFixed(1) + 'C' + mx.toFixed(1) + ' ' + a.y.toFixed(1) + ' ' + mx.toFixed(1) + ' ' + ey.toFixed(1) + ' ' + ex.toFixed(1) + ' ' + ey.toFixed(1));
    var L = p.getTotalLength(), dr = t < 1.0 ? 1 : sm(k(t, FRI[f], FRI[f] + 0.4));
    p.style.strokeDasharray = L + ' ' + L; p.style.strokeDashoffset = (L * (1 - dr)).toFixed(1);
    var cur = f === lit - 1 && t >= 1.0 && t < 11.8;
    p.style.opacity = (on * (cur ? 1 : 0.45)).toFixed(3);
    if (cur) { var ph = ((t - FRI[f] - 0.4) / 0.9) % 1; if (t > FRI[f] + 0.4) { var q2 = p.getPointAtLength(L * sm(ph)); pulse.setAttribute('cx', q2.x.toFixed(1)); pulse.setAttribute('cy', q2.y.toFixed(1)); pulseOn = Math.sin(Math.PI * ph); } }
  });
  pulse.style.opacity = pulseOn.toFixed(3);

  /* Fri 30: enquiries come in along the Fri 30 line, from its outcome row into the Friday block ("every enquiry gets caught");
     stacked layouts: from the stage's right edge at the block's height. Always inside the stage. */
  var top = ctr(boxes[4].children[1]), l0 = leads[0], L0 = side && t >= FRI[0] ? l0.getTotalLength() : 0;
  inq.forEach(function (r, j) {
    var s0 = FRI[0] + 0.05 + j * 0.16, q = k(t, s0, s0 + 0.7), e = sm(q), x, y;
    if (L0) { var pt = l0.getPointAtLength(L0 * (1 - e)); x = pt.x; y = pt.y; }
    else { var x0 = S.width - 20; x = x0 + (top.x - x0) * e; y = top.y + 14 - 20 * Math.sin(Math.PI * e); }
    r.setAttribute('x', (x - 7).toFixed(1)); r.setAttribute('y', (y - 5).toFixed(1)); r.style.opacity = q > 0 && q < 1 ? Math.min(1, q / 0.12, q > 0.85 ? (1 - q) / 0.15 : 1).toFixed(2) : 0;
  });
  /* Fri 6: the messages go out as one spaced row of chips leaving the 100 OUT tag to the right ("your first 100 messages go
     out"); it fades 16 px before the directory text, and stacked layouts with no room on the right send it up instead */
  var o6 = out.offsetParent !== null ? out.getBoundingClientRect() : null, src = o6 ? { x: o6.right - S.left + 8, y: o6.top + o6.height / 2 - S.top } : ctr(boxes[9].children[2]);
  var side2 = getComputedStyle(rows[0].parentNode).position === 'absolute', wall = side2 ? rows[1].getBoundingClientRect().left - S.left - 16 : S.width - 16;
  var room = wall - src.x, up = room < 70;
  mail.forEach(function (r, j) {
    if (j >= 6) { r.style.opacity = 0; return; }
    var s0 = FRI[1] + 0.1 + j * 0.12, q = k(t, s0, s0 + 0.8), e = eo(q), x, y;
    if (clamped && o6) { x = o6.left - S.left - 10 - e * Math.max(0, o6.left - S.left - 50); y = src.y; }   /* phones: the row of messages leaves the tag leftwards, under the day labels, outside the stack */
    else if (up) { x = Math.min(S.width - 32, o6 ? o6.left - S.left + o6.width / 2 : src.x) + (j % 2 ? 9 : -9);   /* >= 12 px inside the edge */ y = src.y - 10 - e * Math.min(90, src.y - 70); }
    else { x = src.x + 6 + e * Math.max(0, room - 18); y = src.y; }
    r.setAttribute('x', (x - 5.5).toFixed(1)); r.setAttribute('y', (y - 4).toFixed(1)); r.style.opacity = q > 0 && q < 1 ? (q > 0.65 ? (1 - q) / 0.35 : 1).toFixed(2) : 0;
  });
}

/* clock: rAF only drives t; every pixel comes from render(t) */
var T0 = 0, tPaused = 0, running = false, paused = false, seekT = null, inView = false, raf = 0;
function now() { return running ? (performance.now() - T0) / 1000 : tPaused; }
function loop() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(loop) : 0; }
function play() { if (running || RM || paused) return; running = true; T0 = performance.now() - tPaused * 1000; raf = requestAnimationFrame(loop); }
function stop() { if (!running) return; tPaused = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s4 = function (t) { seekT = t; stop(); render(t); };
var FIN = 1.6;   /* viewer time of the finished, settled structure (reduced motion) */
function redraw() { render(seekT !== null ? seekT : RM ? FIN : now()); }
render(RM ? FIN : 0);
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(st); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if (RM) { addEventListener('load', redraw); if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) redraw(); }); }).observe(st); return; }   /* the still frame is drawn again once the stage is laid out */
if (window.AIML && AIML.pauseBtn) AIML.pauseBtn(st, { pause: function () { paused = true; stop(); }, play: function () { paused = false; if (inView) play(); } });
if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
  es.forEach(function (e) { inView = e.isIntersecting && st.offsetParent !== null; if (inView && seekT === null) { redraw(); play(); } else stop(); });
}, { threshold: 0.25 }).observe(st);
else play();

})();}catch(e){console.error('section s4 failed', e)}
/* ---- s5 ---- */
try{(function(){
/* S5 v6: persistent rails. The 1:1 call marker runs Upstream (weeks 1 to 4), steps down to Downstream (weeks 5 to 8), and each
   station it reaches gets installed (--k), cause -> effect. The marker never parks: it eases into each station and straight out,
   so the install shows the moment it leaves. Every state is a pure function of t; seek with window.__seek_s5(t). The loop ends
   by crossfading the installed frame back to frame 0 (no rewind). Reduced motion = everything installed, still. */
var st = document.getElementById('s5-stage');
if (!st) return;
var RM = window.AIML && AIML.REDUCE, D = 8.9, NS = 'http://www.w3.org/2000/svg';
var svg = document.getElementById('s5-rails'), mk = document.getElementById('s5-mk');
var r0 = svg.querySelector('.r0'), r1 = svg.querySelector('.r1'), r2 = svg.querySelector('.r2'), rm = svg.querySelector('.rm');
var wks = [].slice.call(st.querySelectorAll('.s5-wk')), nds = wks.map(function (w) { return w.querySelector('.s5-nd'); });
var heads = [].slice.call(st.querySelectorAll('.s5-gh'));
var seats = document.querySelector('#s5 .s5-seats');

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

/* timeline: TT[j] = when the marker reaches waypoint j (0 = rail start, 1..8 = stations, 9 = rail end) */
var TT = [0.15, 0.6, 1.75, 2.65, 3.55, 4.65, 5.55, 6.45, 7.35, 7.95], X0 = 8.2;
function A(i) { return TT[i + 1]; }

var G = null;
function layout() {
  var S = st.getBoundingClientRect(); if (!S.width) return false;
  var P = nds.map(function (n) { var r = n.getBoundingClientRect(); return { x: r.left + r.width / 2 - S.left, y: r.top + r.height / 2 - S.top }; });
  var vert = Math.abs(P[1].x - P[0].x) < 4, d = 10, r = 14, segs = [];
  function f(p) { return p.x.toFixed(1) + ' ' + p.y.toFixed(1); }
  var s0 = vert ? { x: P[0].x, y: P[0].y - d } : { x: P[0].x - d, y: P[0].y }, e = vert ? { x: P[7].x, y: P[7].y + d } : { x: P[7].x + d, y: P[7].y };
  segs.push('M' + f(s0) + 'L' + f(P[0]));
  for (var i = 1; i < 8; i++) {
    var a = P[i - 1], b = P[i];
    if (i !== 4) { segs.push('L' + f(b)); continue; }
    /* the step down from Upstream to Downstream, drawn with rounded corners */
    if (vert) { var ym = b.y - 22;
      segs.push('L' + f({ x: a.x, y: ym - r }) + 'Q' + f({ x: a.x, y: ym }) + ' ' + f({ x: a.x + r, y: ym }) + 'L' + f({ x: b.x - r, y: ym }) + 'Q' + f({ x: b.x, y: ym }) + ' ' + f({ x: b.x, y: ym + r }) + 'L' + f(b)); }
    else { var xm = b.x - nds[0].offsetWidth / 2 - 16 - 32;   /* the middle of the 64 px gutter column (node centre - half node - column gap - half gutter) */
      segs.push('L' + f({ x: xm - r, y: a.y }) + 'Q' + f({ x: xm, y: a.y }) + ' ' + f({ x: xm, y: a.y + r }) + 'L' + f({ x: xm, y: b.y - r }) + 'Q' + f({ x: xm, y: b.y }) + ' ' + f({ x: xm + r, y: b.y }) + 'L' + f(b)); }
  }
  segs.push('L' + f(e));
  var dd = segs.join(''); [r0, r1, r2, rm].forEach(function (p) { p.setAttribute('d', dd); });
  var tmp = document.createElementNS(NS, 'path'); svg.appendChild(tmp);
  var W = [0];
  for (var j = 0; j < 8; j++) { tmp.setAttribute('d', segs.slice(0, j + 1).join('')); W.push(tmp.getTotalLength()); }   /* W[j+1] = arc length at station j */
  svg.removeChild(tmp);
  var len = r0.getTotalLength(); W.push(len);
  G = { len: len, W: W };
  return true;
}

function render(t) {
  t = ((t % D) + D) % D;
  if (!G && !layout()) return;
  var X = sm(k(t, X0, D));                       /* crossfade: installed frame out, frame 0 in */
  var s = 0;
  if (t >= TT[9]) s = G.len; else if (t > TT[0]) { for (var j = 0; j < 9; j++) if (t < TT[j + 1]) break; var q = k(t, TT[j], TT[j + 1]); q = j === 0 ? q * q * (3 - 2 * q) : q; s = G.W[j] + (G.W[j + 1] - G.W[j]) * q; }   /* passes through the stations without parking: the tick lands in its wake */
  var start = t >= X0;                           /* during the crossfade the marker waits at the start, fading in */
  var pt = r0.getPointAtLength(start ? 0 : Math.max(0, Math.min(G.len, s)));
  var mo = start ? sm(k(t, D - 0.3, D)) : 1 - sm(k(t, TT[9] - 0.2, TT[9]));
  mk.style.transform = 'translate(' + (pt.x - mk.offsetWidth / 2).toFixed(1) + 'px,' + (pt.y - mk.offsetHeight / 2).toFixed(1) + 'px)';
  mk.style.opacity = mo.toFixed(3); mk.style.visibility = mo < 0.01 ? 'hidden' : 'visible';
  /* the rail behind the marker fills teal and carries flowing light */
  var fill = start ? G.len : s;
  r1.style.strokeDasharray = G.len + ' ' + G.len; r1.style.strokeDashoffset = (G.len - fill).toFixed(1);
  rm.style.strokeDasharray = r1.style.strokeDasharray; rm.style.strokeDashoffset = r1.style.strokeDashoffset;
  r1.style.opacity = r2.style.opacity = start ? (1 - X).toFixed(3) : 1;
  r2.style.strokeDashoffset = (-(t / D) * 16 * 22).toFixed(1);
  /* stations install as the marker reaches them */
  wks.forEach(function (w, i) {
    var kk = start ? 1 - X : sm(k(t, A(i), A(i) + 0.35)), rr = k(t, A(i), A(i) + 0.7);
    w.style.setProperty('--k', kk.toFixed(3)); w.style.setProperty('--r', (!start && rr > 0 && rr < 1 ? Math.sin(Math.PI * rr) : 0).toFixed(3));
  });
  heads[0].style.setProperty('--k', (start ? 1 - X : sm(k(t, A(3) + 0.35, A(3) + 0.65))).toFixed(3));
  heads[1].style.setProperty('--k', (start ? 1 - X : sm(k(t, A(7) + 0.45, A(7) + 0.75))).toFixed(3));   /* after week 8's own tick */
}

/* clock: rAF only advances t; pixels come from render(t). It starts at FIN, so the first play crossfades into frame 0 */
var FIN = 8.15, T0 = 0, tP = FIN, running = false, paused = false, seekT = null, inView = false, raf = 0;
function now() { return running ? (performance.now() - T0) / 1000 : tP; }
function loop() { if (seekT === null) render(now()); raf = running ? requestAnimationFrame(loop) : 0; }
function play() { if (running || RM || paused) return; running = true; T0 = performance.now() - tP * 1000; raf = requestAnimationFrame(loop); }
function stop() { if (!running) return; tP = now(); running = false; cancelAnimationFrame(raf); }
window.__seek_s5 = function (t) { seekT = t; stop(); G = null; render(t); };
function redraw() { G = null; render(seekT !== null ? seekT : RM ? FIN : now()); }
redraw();
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(st); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if (RM || !('IntersectionObserver' in window)) return;
AIML.pauseBtn(st, { pause: function () { paused = true; stop(); }, play: function () { paused = false; if (inView) play(); } });
new IntersectionObserver(function (es) {
  es.forEach(function (e) { inView = e.isIntersecting && st.offsetParent !== null; if (inView && seekT === null) { G = null; play(); } else stop(); });
}, { threshold: 0.3 }).observe(st);
/* the ten seats draw once, when the seats themselves are in view */
if (seats) {
  var sr = seats.getBoundingClientRect();
  if (!(sr.height && sr.top < innerHeight)) {
    seats.classList.add('armed');
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) { if (e.isIntersecting && seats.offsetParent !== null) { io.disconnect(); seats.classList.add('draw'); } });
    }, { threshold: 0.6 }).observe(seats);
  }
}

})();}catch(e){console.error('section s5 failed', e)}
/* ---- s6 ---- */
try{(function(){
var root = document.getElementById('s6');
if (!root) return;
/* Sami's video: with JS the native chrome waits for the first tap, so a drawn play glyph is the only play icon;
   without JS the native controls stay. The box is the button until the video has its own controls. */
var vb = root.querySelector('.vid-box'), vv = vb && vb.querySelector('video');
if (vv) {
  vv.controls = false; vb.classList.add('tap');
  vb.tabIndex = 0; vb.setAttribute('role', 'button'); vb.setAttribute('aria-label', 'Play: Sami, Scale Your Results');
  function start() { if (vv.controls) return; vv.controls = true; vb.removeAttribute('role'); vb.removeAttribute('tabindex'); vb.removeAttribute('aria-label'); vv.play(); }
  vb.addEventListener('click', start);
  vb.addEventListener('keydown', function (e) { if (!vv.controls && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); start(); } });
  vv.addEventListener('play', function () { vb.classList.add('on'); if (!vv.controls) start(); }, { once: true });
}

/* ---------- shared ---------- */
var REDUCE = window.AIML ? AIML.REDUCE : matchMedia('(prefers-reduced-motion: reduce)').matches;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function vis(el, o) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }

/* ================= 1. the case carousel: render(t), t in [0, 21); t = 0 is Medico, finished ================= */
var car = document.getElementById('s6-stage'), tabsEl = car.querySelector('.s6-tabs');
var tabs = [].slice.call(car.querySelectorAll('.s6-tab')), rows = [].slice.call(car.querySelectorAll('.row'));
var CASE = 3.4, D = 3 * CASE, OFF = 2.8;
tabsEl.hidden = false;
var R = rows.map(function (r) {
  var ns = [].slice.call(r.querySelectorAll('.n'));
  return { el: r, win: r.querySelector('.win'), info: r.querySelector('.info'), cap: r.querySelector('.cap'), mb: r.querySelector('.mb'),
    pd: ns[0], md: ns[1], txt: ns.map(function (n) { return n.textContent; }), base: null };
});
tabs.forEach(function (b, i) { b.setAttribute('aria-selected', 'false'); b.tabIndex = -1; });

function fmt(el, x, orig) {
  if (x >= 1) return orig;
  var f = +(el.dataset.from || 0), v = Math.max(+(el.dataset.min || 0), f + (+el.dataset.v - f) * x), dec = el.dataset.dec ? 1 : 0;   /* Medico counts in M from 1 */
  if (Math.abs(+el.dataset.v - v) < .05 * (dec ? 1 : 10)) return orig;   /* the last step lands on the copy's own value (no ~$6.0M) */
  var s = el.dataset.sep ? Math.round(v).toLocaleString('en-US') : v.toFixed(dec);
  return (el.dataset.pre || '') + s + (el.dataset.suf || '');
}
function setN(r, which, x) { var el = r[which], t = fmt(el, x, r.txt[which === 'pd' ? 0 : 1]); if (el.textContent !== t) el.textContent = t; }

var CW = 0;
function layoutCar() {
  CW = car.clientWidth; if (!CW) return;
  /* the active tab is always wide enough for the client name on one line; on tablets the neighbours peek */
  var tw = CW < 600 ? Math.min(280, CW * .87) : CW < 1000 ? Math.min(290, CW * .42) : Math.min(300, (CW - 64) * .31);
  tabsEl.style.setProperty('--tw', Math.round(tw) + 'px'); car._sp = CW < 600 ? tw + 12 : CW < 1000 ? tw + 20 : tw + 24; car._tw = tw;
  /* each window's resting rect, measured without transforms */
  /* every page reads by scrolling: the window shows at most 74% of the page's height at full width (never a crop of its
     width), and the page travels its own full height during the case */
  var wh = 0;
  R.forEach(function (r) {
    var im = r.win.querySelector('img'), vp = r.win.querySelector('.vp');
    r.win.parentElement.style.height = ''; vp.style.height = ''; var mh = parseFloat(getComputedStyle(vp).maxHeight) || 1e9;
    var h = Math.min(mh, Math.round(im.offsetHeight * .74)); vp.style.height = h + 'px';
    r.win.style.setProperty('--sc', Math.max(0, im.offsetHeight - h) + 'px');
    wh = Math.max(wh, r.win.offsetHeight);
  });
  /* the frame hugs the tallest window, so no empty floor sits between a window and its caption */
  R.forEach(function (r) { r.win.parentElement.style.height = wh + 'px'; });
  R.forEach(function (r) { var tr = r.win.style.transform; r.win.style.transform = 'none'; r.base = r.win.getBoundingClientRect(); r.win.style.transform = tr; });
  car._base = car.getBoundingClientRect();
}

var activeI = -1;
function renderCar(t) {
  if (!CW || !car._base) return;
  t = ((t % D) + D) % D;
  var T = (t + OFF) % D, c = Math.floor(T / CASE), u = T - c * CASE, prev = (c + 2) % 3;
  /* the rail: continuous index s, every tab on a ring of three, wrapping out of sight */
  var s = c - 1 + sm(k(u, 0, .45));
  tabs.forEach(function (b, j) {
    var sl = ((j - s) % 3 + 4.5) % 3 - 1.5, a = Math.abs(sl), em = 1 - Math.min(1, a);
    var o = (1 - sm(cl((a - 1) / .5))) * (.5 + .5 * em);
    b.style.transform = 'translateX(' + (sl * car._sp - car._tw / 2).toFixed(1) + 'px) scale(' + (.94 + .06 * em).toFixed(3) + ')';
    b.style.opacity = o.toFixed(3); b.style.visibility = o < .01 ? 'hidden' : 'visible';
    b.classList.toggle('on', em > .75);
    b.querySelector('i').style.setProperty('--p', (j === c ? u / CASE : 0).toFixed(4));
  });
  if (activeI !== c) {
    activeI = c;
    tabs.forEach(function (b, j) { b.setAttribute('aria-selected', j === c ? 'true' : 'false'); b.tabIndex = j === c ? 0 : -1; });
    rows.forEach(function (r, j) { r.setAttribute('aria-hidden', j === c ? 'false' : 'true'); });
  }
  R.forEach(function (r, j) {
    var cur = j === c, old = j === prev && u < .45;
    vis(r.el, cur || old ? 1 : 0); r.el.style.zIndex = cur ? 2 : 1;   /* the incoming case draws over the outgoing one */
    if (!cur) {                                 /* the outgoing case steps back while the new one is already opening */
      if (!old) return;
      var oo = 1 - sm(k(u, .3, .42));    /* the outgoing screenshot stays until the incoming one is opaque and nearly full size */
      vis(r.win, oo); r.win.style.transform = 'scale(' + (1.035 - .03 * sm(k(u, 0, .42))).toFixed(4) + ')';
      vis(r.info, 1 - sm(k(u, .2, .27))); vis(r.cap, 1 - sm(k(u, 0, .15))); return;   /* the text hands over in ~0.1 s: a name and numbers are always on screen, never two names */
    }
    /* selection -> expansion: the window grows out of the active tab's thumbnail */
    var e = eo(k(u, .1, .5)), push = 1 + .035 * k(u, .7, CASE);
    var th = tabs[c].querySelector('img').getBoundingClientRect(), b = r.base, cb = car.getBoundingClientRect(), cb0 = car._base;
    var dy0 = cb.top - cb0.top, dx0 = cb.left - cb0.left;     /* page scrolled since layout */
    var s0 = Math.max(.05, th.width / b.width), tb = tabsEl.getBoundingClientRect().bottom + 10 + b.height * s0 / 2;   /* enters below the tab rail */
    var dx = (th.left + th.width / 2) - (b.left + dx0 + b.width / 2), dy = tb - (b.top + dy0 + b.height / 2);
    r.win.style.transform = 'translate(' + (dx * (1 - e)).toFixed(1) + 'px,' + (dy * (1 - e)).toFixed(1) + 'px) scale(' + ((s0 + (1 - s0) * e) * push).toFixed(4) + ')';
    vis(r.win, sm(k(u, .1, .22)));
    r.win.style.setProperty('--py', sm(k(u, .5, CASE + .2)).toFixed(4));   /* the page scrolls slowly in its window, like a person reading it (full width, 1:1) */
    r.win.style.setProperty('--a', (u * 75 % 360).toFixed(1) + 'deg'); r.win.style.setProperty('--bo', sm(k(u, .7, 1.1)).toFixed(3));
    vis(r.info, sm(k(u, .25, .33)));   /* the text hands over as the incoming screenshot covers the old one */ r.info.style.transform = 'none';   /* dissolves into the outgoing block on the same baseline */
    vis(r.cap, sm(k(u, .6, .9)));
    /* the ratio: the paid slice lands, then what they made grows out of it. Number and bar share ONE eased value,
       and Made counts up from the paid amount (never from zero). */
    var pp = eo(k(u, .35, .65)), xm = k(u, .5, 2.2), em = 1 - (1 - xm) * (1 - xm), w = parseFloat(r.mb.style.getPropertyValue('--w')) || 0;
    setN(r, 'pd', 1); setN(r, 'md', 1);   /* the figures are always the copy's own; the motion is the bar and the window */
    r.mb.style.setProperty('--pp', pp.toFixed(3));
    r.mb.style.setProperty('--mm', (w * pp + (1 - w) * em).toFixed(4));
    r.mb.style.setProperty('--bf', sm(k(u, .35, .7)).toFixed(3));
    r.mb.style.setProperty('--sw', (u > 2.2 ? ((u - 2.2) / 1.1 % 1) * 1.4 - .25 : -1).toFixed(3));   /* light sweeps the made bar while it is read */
  });
}

/* ================= 2. our own offer: 300 -> 50 -> 10+ (a 5.6 s loop; render2(t)) ================= */
var own = document.getElementById('s6-own'), cv = document.getElementById('s6-cv'), cx = cv.getContext('2d');
var frs = [].slice.call(own.querySelectorAll('.fr p'));
var D2 = 4.6, FW = 0, FH = 0, DPR = 1;
function hash(i) { var x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); }
var ORDER = Array.from({ length: 300 }, function (_, i) { return i; }).sort(function (a, b) { return hash(a) - hash(b); });
var QUAL = {}; ORDER.slice(0, 50).forEach(function (i, j) { QUAL[i] = j; });   /* j < 10: closed */
function layoutOwn() {
  FW = cv.clientWidth; FH = cv.clientHeight; if (!FW) return;
  DPR = Math.min(2, window.devicePixelRatio || 1);
  var w = Math.round(FW * DPR), h = Math.round(FH * DPR);
  if (cv.width !== w || cv.height !== h) { cv.width = w; cv.height = h; render2(seekT !== null ? seekT : acc2, REDUCE); }   /* a resize clears the canvas: repaint at once */
}
/* render2(t): one 5.6 s loop. 0-4.4 the collapse (wall holds 0.6 s first), 4.4-5.0 the ten breathe, 5.0-5.6 the next
   wall crossfades in over them (no rewind). draw(a, alpha, breathe) paints the state at animation time a. */
var L2 = 5.6;
function draw(t, A, bth) {
  var cols = 25, rws = 12, mx = FW * .04, my = FH * .08, cw = (FW - 2 * mx) / cols, ch = (FH - 2 * my) / rws, cell = Math.min(cw, ch), r0 = cell * .22;
  /* the 50 (10 x 5) sit centred in the field; as the ten leave for their row the block rises so block + row stay centred together */
  var bs = cell * 1.6, bx = FW / 2 - 4.5 * bs, gap = Math.max(cell * 3, FH * .16), byA = (FH - 4 * bs) / 2, byG = (FH - 4 * bs - gap) / 2;
  var by = byA + (byG - byA) * sm(k(t, 2.2, 2.9));
  var rs = Math.min(FW * .075, cell * 2.8), rx = FW / 2 - 5.5 * rs, ry = byG + 4 * bs + gap;
  for (var i = 0; i < 300; i++) {
    var c = i % cols, rr = Math.floor(i / cols), x0 = mx + (c + .5) * cw, y0 = my + (rr + .5) * ch, q = QUAL[i];
    var x = x0, y = y0, r = r0, al = .42 * (.78 + .22 * Math.sin(Math.PI * 2 * (bth2 / 1.4 + hash(i + 3)))), teal = 0, glow = 0;   /* the wall twinkles: it is never a still frame */
    if (q === undefined) {                       /* not qualified: drops away */
      var st = .8 + (c / cols) * .5 + hash(i + 7) * .15, f = eo(k(t, st, st + .7));
      y = y0 + f * FH * .3; al = .42 * (1 - sm(k(t, st, st + .6)));
      if (al <= .003) continue;
    } else {
      var e1 = sm(k(t, 1.0 + q * .008, 1.9 + q * .008)), bxq = bx + (q % 10) * bs, byq = by + Math.floor(q / 10) * bs;
      x = x0 + (bxq - x0) * e1; y = y0 + (byq - y0) * e1; al = .42 + .43 * e1;
      if (q >= 10) al *= 1 - .72 * sm(k(t, 2.2, 2.7));
      else {
        var e2 = sm(k(t, 2.3 + q * .035, 3.1 + q * .035)), xr = rx + (q + .5) * rs, b = bth * (.5 + .5 * Math.sin(Math.PI * 2 * (bth2 - q * .06) / 1.2));
        x = x + (xr - x) * e2; y = y + (ry - y) * e2; r = r0 * (1 + 1.4 * e2) * (1 + .3 * b); teal = e2; glow = e2 * (1 + 1.6 * b); al = .85 + .15 * e2;
        if (bth > 0) { var hp = ((bth2 - q * .07) / .9) % 1; if (hp > 0) { cx.globalAlpha = .5 * bth * (1 - hp) * A; cx.strokeStyle = '#3FE0D6'; cx.lineWidth = 1.5; cx.beginPath(); cx.arc(x, y, r * (1.3 + 1.6 * hp), 0, Math.PI * 2); cx.stroke(); } }   /* a ring travels along the ten */
      }
    }
    cx.globalAlpha = al * A;
    cx.shadowBlur = glow ? 16 * glow : 0; cx.shadowColor = 'rgba(63,224,214,.85)';
    cx.fillStyle = teal > .5 ? '#3FE0D6' : teal > 0 ? 'rgba(' + Math.round(234 - 171 * teal) + ',' + Math.round(245 - 21 * teal) + ',' + Math.round(244 - 30 * teal) + ',1)' : '#EAF5F4';
    cx.beginPath(); cx.arc(x, y, r, 0, Math.PI * 2); cx.fill();
  }
  cx.shadowBlur = 0;
  /* the "+": more than ten */
  var po = .55 * sm(k(t, 3.4, 3.8));
  if (po > 0) {
    cx.globalAlpha = po * A; cx.strokeStyle = '#8FB3B0'; cx.lineWidth = Math.max(1.5, r0 * .5); var px = rx + 10.5 * rs, pr = r0 * 1.4;
    cx.beginPath(); cx.moveTo(px - pr, ry); cx.lineTo(px + pr, ry); cx.moveTo(px, ry - pr); cx.lineTo(px, ry + pr); cx.stroke();
  }
  /* one ring as the ten land */
  var rg = k(t, 3.3, 4.2);
  if (rg > 0 && rg < 1) {
    cx.globalAlpha = .6 * (1 - rg) * A; cx.strokeStyle = '#3FE0D6'; cx.lineWidth = 1.5;
    for (var j = 0; j < 10; j++) { cx.beginPath(); cx.arc(rx + (j + .5) * rs, ry, r0 * (2.4 + 3 * eo(rg)), 0, Math.PI * 2); cx.stroke(); }
  }
  cx.globalAlpha = 1;
}
var bth2 = 0;
function render2(t, fin) {
  if (!FW) return;
  t = fin ? 4.4 : ((t % L2) + L2) % L2;
  var a = Math.min(D2, t + .55), x = fin ? 0 : sm(k(t, 4.9, 5.45));
  bth2 = t;                                       /* the ten breathe (glow + size, a wave along the row) through the hold */
  var lab = x > .5 ? 0 : a < 2.0 ? 0 : a < 3.4 ? 1 : 2;
  frs.forEach(function (p, i) { p.classList.toggle('on', i === lab); });
  cx.setTransform(DPR, 0, 0, DPR, 0, 0); cx.clearRect(0, 0, FW, FH);
  draw(a, 1 - x, fin ? 0 : sm(k(t, 3.1, 3.6)) * (1 - x));   /* the ten start to breathe as their landing ring fades */
  if (x > 0) draw(.55, x, 0);       /* the next wall of 300 crossfades in: frame 0 again, no rewind */
}

/* ================= clocks: start in view, pausable, seekable ================= */
var acc = 0, last = 0, raf = 0, inView = false, paused = false, hover = false, manual = -1, seekT = null;
var acc2 = 0, last2 = 0, raf2 = 0, ownStarted = false, inView2 = false, paused2 = false;
function tick(now) {
  raf = 0; if (seekT !== null || paused || hover || !inView) return;
  if (last) acc += Math.min(.1, (now - last) / 1000); last = now;
  if (manual >= 0) {                          /* a tapped tab plays its entrance, then holds */
    var T = (acc + OFF) % D; if (T - manual * CASE >= 2.8) { acc = manual * CASE + 2.8 - OFF; renderCar(acc); return; }
  }
  renderCar(acc); raf = requestAnimationFrame(tick);
}
function kick() { if (!raf && !REDUCE) { last = 0; raf = requestAnimationFrame(tick); } }
function tick2(now) {
  raf2 = 0; if (seekT !== null || paused2 || !inView2) return;
  if (last2) acc2 += Math.min(.1, (now - last2) / 1000); last2 = now;
  render2(acc2); raf2 = requestAnimationFrame(tick2);
}
function kick2() { if (!raf2 && !REDUCE && ownStarted) { last2 = 0; raf2 = requestAnimationFrame(tick2); } }
if (window.AIML && AIML.pauseBtn && !REDUCE) AIML.pauseBtn(own, { pause: function () { paused2 = true; }, play: function () { paused2 = false; kick2(); } });
tabs.forEach(function (b, i) {
  b.addEventListener('click', function () {
    manual = i; acc = ((i * CASE + (REDUCE ? 2.8 : .45) - OFF) % D + D) % D;
    layoutCar(); renderCar(acc); kick();
  });
  b.addEventListener('keydown', function (e) {
    var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0; if (!d) return;
    e.preventDefault(); var n = tabs[(i + d + 3) % 3]; n.focus(); n.click();
  });
});
car.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') hover = true; });
car.addEventListener('pointerleave', function () { if (hover) { hover = false; kick(); } });
car.addEventListener('focusin', function (e) { if (e.target.matches && e.target.matches(':focus-visible')) hover = true; });   // keyboard focus pauses; a mouse click on Play or a tab must not
car.addEventListener('focusout', function () { hover = false; kick(); });
if (window.AIML && AIML.pauseBtn && !REDUCE) AIML.pauseBtn(car, { pause: function () { paused = true; }, play: function () { paused = false; hover = false; kick(); } });

window.__seek_s6 = function (t) { seekT = t; layoutCar(); renderCar(t); };
window.__seek_s6.dur = D;   /* the carousel loop length (10.2 s), for capture scripts */
window.__seek_s6o = function (t) { seekT = t; layoutOwn(); render2(t); };
function relayout() { layoutCar(); renderCar(seekT !== null ? seekT : acc); layoutOwn(); if (REDUCE) render2(0, true); else render2(seekT !== null ? seekT : ownStarted ? acc2 : 0); }
relayout();
if ('IntersectionObserver' in window) {
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView = e.isIntersecting && e.target.offsetParent !== null; if (inView) { relayout(); kick(); } }); }, { threshold: .25 }).observe(car);
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) {
      if (!e.isIntersecting || e.target.offsetParent === null) return;
      io.disconnect(); layoutOwn(); ownStarted = true;
      if (REDUCE) render2(0, true); else kick2();
    });
  }, { threshold: .7 }).observe(own);
  new IntersectionObserver(function (es) { es.forEach(function (e) { inView2 = e.isIntersecting; if (inView2) kick2(); }); }).observe(own);
} else { inView = true; inView2 = true; ownStarted = true; relayout(); kick(); kick2(); }
addEventListener('resize', relayout);
if (document.fonts) document.fonts.ready.then(relayout);
document.addEventListener('aiml:reveal', relayout);
window.__s6_ready = true;
/* printing: the finished frames */
addEventListener('beforeprint', function () { renderCar(0); render2(0, true); });

})();}catch(e){console.error('section s6 failed', e)}
/* ---- s7 ---- */
try{(function(){
/* S7: deterministic render(t), t in [0,5.0). Seek with window.__seek_s7(t). Reduced motion / no JS = the finished frame.
   Row 1 ticks at full pace, rows 2-5 cascade; each tick sends a dot along a solid line (Magic UI animated-beam,
   ported) into the dial, and the dot's landing fills one of the five segments. At 5 of 5 the stamp drops and locks (shackle
   closes, one teal flash); the locked ring breathes. Loop: element-wise crossfade to frame 0. */
var stage = document.getElementById('s7-stage'), scene = document.getElementById('s7-scene');
if (!stage || !scene) return;
var D = 5.0, RM = AIML.REDUCE, END = 4.0, NS = 'http://www.w3.org/2000/svg';
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var rows = [].slice.call(scene.querySelectorAll('.s7-rows li')), seal = scene.querySelector('.s7-seal'), cnt = scene.querySelector('.s7-cnt');
var dial = scene.querySelector('.s7-dial'), arcG = scene.querySelector('.s7-arc'), trk = scene.querySelector('.s7-trk');
var beam = scene.querySelector('.s7-beam'), bl = scene.querySelector('.s7-bl'), dot = scene.querySelector('.s7-dot');
function seg(i) {   /* five segments, 4 degree gaps, clockwise from 12 o'clock (the svg is rotated -90deg) */
  var r = 86, a0 = (i * 72 + 2) * Math.PI / 180, a1 = ((i + 1) * 72 - 2) * Math.PI / 180;
  return 'M' + (100 + r * Math.cos(a0)).toFixed(2) + ' ' + (100 + r * Math.sin(a0)).toFixed(2) + 'A' + r + ' ' + r + ' 0 0 1 ' + (100 + r * Math.cos(a1)).toFixed(2) + ' ' + (100 + r * Math.sin(a1)).toFixed(2);
}
var arcs = [];
for (var i = 0; i < 5; i++) {
  var p0 = document.createElementNS(NS, 'path'); p0.setAttribute('d', seg(i)); trk.appendChild(p0);
  var p1 = document.createElementNS(NS, 'path'); p1.setAttribute('d', seg(i)); p1.setAttribute('pathLength', '1'); arcG.appendChild(p1); arcs.push(p1);
}
function st(i) { return i === 0 ? 0.25 : 1.15 + (i - 1) * 0.4; }
function pace(i) { return i === 0 ? 1 : 0.7; }
function beamT(i) { var s = st(i), m = pace(i), b0 = s + 0.25 * m; return [b0, b0 + 0.45 * m]; }

var G = null;
function layout() {
  if (!stage.clientWidth) return false;
  stage.classList.add('s7-live');
  var sw = scene.offsetWidth, sr = scene.getBoundingClientRect(), sc = sr.width / sw || 1, dr = dial.getBoundingClientRect();
  var cx = (dr.left + dr.width / 2 - sr.left) / sc, cy = (dr.top + dr.height / 2 - sr.top) / sc, R = dr.width / sc * 0.43 + 4;
  var below = (dr.bottom - sr.top) / sc < (rows[0].getBoundingClientRect().top - sr.top) / sc + 1;   /* phone: dial above the sheet */
  var g = { paths: [], L: [] };
  beam.setAttribute('viewBox', '0 0 ' + sw + ' ' + scene.offsetHeight);
  var ledger = rows.length > 1 && Math.abs(rows[1].getBoundingClientRect().top - rows[0].getBoundingClientRect().top) < 2;   /* desktop: items in one row */
  var shb = (scene.querySelector('.s7-rows').getBoundingClientRect().bottom - sr.top) / sc, rail = shb + 16, gx2 = (dr.left - sr.left) / sc - 24;
  var f = function (v) { return v.toFixed(1); };
  rows.forEach(function (li) {
    var r = li.getBoundingClientRect(), y0 = (r.top + r.height / 2 - sr.top) / sc, d;
    if (ledger) {
      /* down out of the cell, along the rail under the ledger, up the gap beside the dial, into the ring's left side */
      var x0 = (r.left + r.width / 2 - sr.left) / sc, yb = (r.bottom - sr.top) / sc - 2, rr = 10;
      d = 'M' + f(x0) + ' ' + f(yb) + 'L' + f(x0) + ' ' + f(rail - rr) + 'Q' + f(x0) + ' ' + f(rail) + ' ' + f(x0 + rr) + ' ' + f(rail) +
          'L' + f(gx2 - rr) + ' ' + f(rail) + 'Q' + f(gx2) + ' ' + f(rail) + ' ' + f(gx2) + ' ' + f(rail - rr) +
          'L' + f(gx2) + ' ' + f(cy + rr) + 'Q' + f(gx2) + ' ' + f(cy) + ' ' + f(gx2 + rr) + ' ' + f(cy) + 'L' + f(cx - R) + ' ' + f(cy);
    } else if (below) {
      /* out of the box's left side, up the panel's left gutter, into the dial's lower-left */
      var bx = (li.querySelector('.s7-box').getBoundingClientRect().left - sr.left) / sc - 4, gx = Math.max(6, bx - 12);
      var tx = cx - R * 0.707, ty = cy + R * 0.707;
      d = 'M' + bx.toFixed(1) + ' ' + y0.toFixed(1) + 'Q' + gx.toFixed(1) + ' ' + y0.toFixed(1) + ' ' + gx.toFixed(1) + ' ' + (y0 - 14).toFixed(1) +
          'L' + gx.toFixed(1) + ' ' + (ty + 24).toFixed(1) + 'Q' + gx.toFixed(1) + ' ' + ty.toFixed(1) + ' ' + tx.toFixed(1) + ' ' + ty.toFixed(1);
    } else {
      /* out of the state cell's right side, curving into the nearest point of the ring */
      var s2 = li.querySelector('.s7-st').getBoundingClientRect(), x0 = (s2.right - sr.left) / sc + 10;
      var a = Math.atan2(y0 - cy, x0 - cx), x1 = cx + R * Math.cos(a), y1 = cy + R * Math.sin(a), dx = Math.max(20, (x1 - x0) * 0.55);
      d = 'M' + x0.toFixed(1) + ' ' + y0.toFixed(1) + 'C' + (x0 + dx).toFixed(1) + ' ' + y0.toFixed(1) + ' ' + (x1 - dx * 0.6).toFixed(1) + ' ' + y1.toFixed(1) + ' ' + x1.toFixed(1) + ' ' + y1.toFixed(1);
    }
    g.paths.push(d); bl.setAttribute('d', d); g.L.push(bl.getTotalLength());
  });
  G = g; return true;
}

function render(t) {
  t = ((t % D) + D) % D;
  /* seam (4.3 -> 4.8; page critic 4: the locked end held ~1.5 s, now ~0.5 s): a true crossfade from the end state to frame 0, element by element. Nothing blanks: the
     ticks and teal segments fade while "mapped" fades back in under "done", the count and the stamp swap at the
     midpoint. Then frame 0 holds a beat before the first tick. */
  var X = t >= 4.3 ? k(t, 4.3, 4.8) : 0, seam = t >= 4.3 && t < 4.8;
  var OUT = 1 - sm(k(X, 0, 0.42)), IN = sm(k(X, 0.58, 1));   /* old state fully out before the new one comes in */
  if (t >= 4.8) t = 0; else if (seam) t = 4.3;
  arcG.style.opacity = 1 - sm(X);
  var done = 0, glow = 0, bOn = -1, bP = 0;
  rows.forEach(function (li, i) {
    var s = st(i), m = pace(i), B = beamT(i);
    li.style.setProperty('--f', eo(k(t, s, s + 0.2 * m)).toFixed(3));
    li.style.setProperty('--c', eo(k(t, s + 0.1 * m, s + 0.35 * m)).toFixed(3));
    var dd = eo(k(t, s + 0.15 * m, s + 0.4 * m));
    li.style.setProperty('--d', dd.toFixed(3)); li.style.setProperty('--wy', (seam ? 0 : dd).toFixed(3));
    li.style.setProperty('--wo', (seam ? IN : cl(1 - dd * 2.2)).toFixed(3)); li.style.setProperty('--do', (seam ? OUT : cl(dd * 2.2 - 1.2)).toFixed(3));
    li.style.setProperty('--fo', (seam ? 1 - sm(X) : 1).toFixed(3));
    li.style.setProperty('--a', (sm(k(t, s - 0.05, s + 0.1)) * (1 - sm(k(t, B[1], B[1] + 0.3)))).toFixed(3));
    if (t >= B[0] && t < B[1] + 0.12) { bOn = i; bP = k(t, B[0], B[1]); }
    var a = eo(k(t, B[1] - 0.04, B[1] + 0.3 * m));
    arcs[i].style.strokeDashoffset = (1 - a).toFixed(4);
    if (a > 0 && a < 1) glow = Math.max(glow, 7);
    if (a >= 0.5) done++;
  });
  cnt.textContent = (seam && X >= 0.5 ? 0 : done) + ' of 5'; cnt.style.opacity = seam ? (X < 0.5 ? OUT : IN) : 1;
  glow = Math.max(glow, 12 * sm(k(t, 2.95, 3.1)) * (1 - sm(k(t, 3.2, 3.8))));
  if (t >= 3.8) glow = Math.max(glow, 3 + 4 * (0.5 - 0.5 * Math.cos((t - 3.8) * 4.2)));   /* locked: the ring breathes */
  arcG.style.setProperty('--glow', glow.toFixed(1) + 'px');
  /* the beam: the line draws behind the travelling dot, then fades once the dot has landed */
  if (G && bOn >= 0) {
    var L = G.L[bOn], e = eo(bP), pt;
    bl.setAttribute('d', G.paths[bOn]);
    bl.style.strokeDasharray = L + ' ' + L; bl.style.strokeDashoffset = (L * (1 - e)).toFixed(1);
    bl.style.opacity = 1 - k(t, beamT(bOn)[1], beamT(bOn)[1] + 0.12);
    pt = bl.getPointAtLength(L * e); dot.setAttribute('cx', pt.x.toFixed(1)); dot.setAttribute('cy', pt.y.toFixed(1));
    dot.style.opacity = bP < 1 ? 1 : 0; beam.style.opacity = 1;
  } else beam.style.opacity = 0;
  /* the lock: the shackle drops, the stamp lands (from 1.25x, tilting to -3deg) and flashes teal once */
  var locked = t >= 3.15 && !(seam && X >= 0.5);
  seal.style.opacity = seam ? (X < 0.5 ? OUT : IN) : 1;
  seal.classList.toggle('open', !locked);
  seal.style.setProperty('--sh', (-5 * (1 - sm(k(t, 3.15, 3.3)))).toFixed(2) + 'px');
  var land = eo(k(t, 3.15, 3.5));
  seal.style.transform = locked ? 'rotate(' + (-3 * land).toFixed(2) + 'deg) scale(' + (1.25 - 0.25 * land).toFixed(4) + ')' : 'none';
  seal.style.setProperty('--fl', (locked ? 0.35 * (1 - k(t, 3.2, 3.8)) : 0).toFixed(3));
  scene.style.transform = 'scale(' + (1 + 0.015 * sm(k(t, 3.5, 4.0)) * (1 - X)) + ')';
}
var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { scene.style.transform = 'none'; render(END); layout(); render(t); }
window.__seek_s7 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
if (!RM) {
  refresh();
  var lastW = 0;   /* also fires when the section is revealed (width 0 -> real width) */
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (stage.clientWidth !== lastW) { lastW = stage.clientWidth; refresh(); } }).observe(stage);
  else addEventListener('resize', refresh);
  if (document.fonts) document.fonts.ready.then(refresh);
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      inView = e.isIntersecting && stage.offsetParent !== null;
      if (inView && !G) refresh();
      if (inView) go(); else stop();
    });
  }, { threshold: 0.3 }).observe(stage);
  AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
}

})();}catch(e){console.error('section s7 failed', e)}
/* ---- s8 ---- */
try{(function(){
/* S8: the filter. Deterministic: every state is render(t), t in [0,9). Seek with window.__seek_s8(t).
   The gate is never empty (page critic 3): exactly one chip holds it at a time, 1.5 s each, six chips = 9 s.
   Frame 0 is a resolved verdict: "B2B founders with an offer that sells" sits in the gate, passed (ring on its badge,
   gate lit teal). Each handover is one 0.25 s swap, like a slot machine: the outgoing chip slides down out of the gate's
   window (clipped by it, then back into its slot) while the next one (which left its slot just before) slides in
   from above, a chip height behind it, so the two never overlap. It goes neutral under the scan beam, gets its verdict
   (tick or cross, the gate flashes teal or brick, a bounce recoils) and holds it until the next swap.
   wide (stage >= 880): "This isn't for" | gate | "This is for".
   mid (600-879): gate on top, the two lists side by side below. narrow: gate on top, the lists stacked.
   Chips fade-jump between slot and gate (a travel path would cross the gate's header or the neighbouring chip). */
var stage = document.getElementById('s8-stage'), scene = document.getElementById('s8-scene');
if (!stage || !scene) return;
var D = 9, RM = AIML.REDUCE, END = 0;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }

var noL = [].slice.call(stage.querySelectorAll('.s8-no li')), yesL = [].slice.call(stage.querySelectorAll('.s8-yes li'));
[].concat(noL, yesL).forEach(function (li) { li.innerHTML = '<span>' + li.innerHTML + '</span>'; });
/* gate order alternates pass / bounce; slot = DOM position in its own list */
var C = [
  { el: yesL[0], ok: 1, slot: 0 }, { el: noL[0], ok: 0, slot: 0 },
  { el: yesL[1], ok: 1, slot: 1 }, { el: noL[1], ok: 0, slot: 1 },
  { el: yesL[2], ok: 1, slot: 2 }, { el: noL[2], ok: 0, slot: 2 }
];
var P = 1.5;   /* each chip's turn in the gate */
C.forEach(function (c, i) { c.S = (((i - 4) * P - 1.0) % D + D) % D; });   /* chip 4 is mid-verdict at t = 0 */
var gate = scene.querySelector('.s8-gate'), scan = scene.querySelector('.s8-scan'), vd = scene.querySelector('.s8-vd');
var tagNo = stage.querySelector('.s8-no .s8-tag'), tagYes = stage.querySelector('.s8-yes .s8-tag');
var G = null;

function px(el, x, y, s, o) {
  el.style.transform = 'translate(' + Math.round(x) + 'px,' + Math.round(y) + 'px)' + (s && s !== 1 ? ' scale(' + s.toFixed(4) + ')' : '');
  if (o !== undefined) { el.style.opacity = o; el.style.visibility = o <= 0.001 ? 'hidden' : 'visible'; }
}
function layout() {
  var W = stage.clientWidth; if (!W) return false;
  stage.classList.add('s8-live');
  var mode = W >= 880 ? 'wide' : W >= 600 ? 'mid' : 'narrow';
  stage.classList.toggle('s8-narrow', mode === 'narrow');
  var pad = mode === 'wide' ? 40 : mode === 'mid' ? 32 : 18, gap = 12, HD = 32, cw, xs;
  if (mode === 'wide') { var g3 = 32; cw = Math.floor((W - 2 * pad - 2 * g3) / 3); xs = { no: pad, c: pad + cw + g3, yes: pad + 2 * (cw + g3) }; }
  else if (mode === 'mid') { var g2 = 24; cw = Math.floor((W - 2 * pad - g2) / 2); xs = { no: pad, c: Math.round((W - cw) / 2), yes: pad + cw + g2 }; }
  else { cw = W - 2 * pad - 12; xs = { no: pad + 6, c: pad + 6, yes: pad + 6 }; }
  C.forEach(function (c) { c.el.style.width = cw + 'px'; c.el.style.height = ''; c.el.style.transform = 'none'; });
  C.forEach(function (c) { c.h = c.el.offsetHeight; });
  var H0 = Math.max.apply(null, C.map(function (c) { return c.h; }));
  if (mode === 'wide') C.forEach(function (c) { c.h = H0; c.el.style.height = H0 + 'px'; });   /* equal rows: both columns end level */
  var g = { W: W, mode: mode, cw: cw, xs: xs, H0: H0, sY: {} };
  var colH = function (ok) { return C.filter(function (c) { return c.ok === ok; }).reduce(function (a, c) { return a + c.h + gap; }, -gap); };
  var gh = HD + H0 + 24;
  if (mode === 'wide') {
    var top = pad + 30, ch = Math.max(colH(0), colH(1));
    g.sY.no = g.sY.yes = top; g.tags = { no: [xs.no, pad], yes: [xs.yes, pad] };
    g.gate = { x: xs.c - 12, y: top + Math.max(0, (ch - gh) / 2), w: cw + 24, h: gh };
    g.H = top + Math.max(ch, gh) + pad + 36;
  } else {
    g.gate = { x: xs.c - 12, y: pad, w: cw + 24, h: gh };
    var below = pad + gh + 26;
    if (mode === 'mid') { g.tags = { no: [xs.no, below], yes: [xs.yes, below] }; g.sY.no = g.sY.yes = below + 28; g.H = g.sY.no + Math.max(colH(0), colH(1)) + pad + 40; }
    else {
      g.tags = { yes: [xs.yes, below] }; g.sY.yes = below + 28;
      var noTag = g.sY.yes + colH(1) + 20; g.tags.no = [xs.no, noTag]; g.sY.no = noTag + 28;
      g.H = g.sY.no + colH(0) + pad + 40;
    }
  }
  /* each chip's home slot, plus a dashed outline that shows only while its chip is away */
  C.forEach(function (c) {
    var col = c.ok ? 'yes' : 'no', y = g.sY[col];
    C.forEach(function (o) { if (o.ok === c.ok && o.slot < c.slot) y += o.h + gap; });
    c.hx = xs[col]; c.hy = y;
    if (!c.ph) { c.ph = document.createElement('i'); c.ph.className = 's8-slot'; c.ph.setAttribute('aria-hidden', 'true'); scene.insertBefore(c.ph, scene.firstChild); }
    c.ph.style.width = cw + 'px'; c.ph.style.height = c.h + 'px';
  });
  scene.style.height = Math.round(g.H) + 'px';
  gate.style.width = g.gate.w + 'px'; gate.style.height = g.gate.h + 'px'; px(gate, g.gate.x, g.gate.y);
  scan.style.height = (H0 + 12) + 'px';
  px(tagNo, g.tags.no[0], g.tags.no[1]); px(tagYes, g.tags.yes[0], g.tags.yes[1]);
  G = g; return true;
}

function render(t) {
  if (!G) return;
  t = ((t % D) + D) % D;
  var g = G, verdict = '', vOn = 0, vS = 1, vx = 0, vy = 0, scanX = -1, sy0 = 0;
  var top = g.gate.y + 33, bot = g.gate.y + g.gate.h - 1, SW = g.H0 + 14;   /* the gate's window under its header; swap travel */
  C.forEach(function (c) {
    var u = ((t - c.S) % D + D) % D, e = c.el, cls = c.ok ? 'ok' : 'no', zi = 2, x = c.hx, y = c.hy, o = 1, po = 0, clip = 'none';
    var gy = g.gate.y + 32 + 12 + (g.H0 - c.h) / 2, gx = g.xs.c;
    if (u >= D - 0.2) { o = 1 - sm(k(u, D - 0.2, D - 0.05)); po = 0.9 * sm(k(u, D - 0.2, D - 0.05)); }   /* leaves its slot */
    else if (u < 1.75) {                                                                                 /* holds the gate */
      x = gx; y = gy; zi = 6; po = 0.9;
      if (u < 0.75) {                                     /* slides down into the window as the outgoing chip slides out below */
        cls = ''; y -= SW * (1 - sm(k(u, 0, 0.25)));
        if (u >= 0.3) { scanX = gx + k(u, 0.34, 0.71) * g.cw; sy0 = gy + c.h / 2; }
      } else {                                            /* the verdict, held until the next swap */
        verdict = cls; y += SW * sm(k(u, 1.5, 1.75));
        vOn = k(u, 0.75, 0.81) * (1 - k(u, 1.5, 1.58));
        vS = 1 + 0.35 * (1 - eo(k(u, 0.75, 0.95)));
        if (!c.ok) x += 7 * Math.sin((u - 0.75) * 52) * (1 - k(u, 0.75, 1.15));   /* recoil */
        vx = gx + 28 - 20; vy = y + c.h / 2 - 20;   /* centred on the chip's badge (left 16 + 12) */
      }
      /* ponytail: the chip is not a child of the gate, so the window is a clip-path in the chip's own box */
      var ct = Math.max(0, top - y), cb = Math.max(0, y + c.h - bot);
      if (ct > 0 || cb > 0) clip = 'inset(' + Math.min(ct, c.h).toFixed(1) + 'px -20px ' + Math.min(cb, c.h).toFixed(1) + 'px -20px)';
    } else if (u < 1.97) { o = sm(k(u, 1.75, 1.95)); po = 0.9 * (1 - o); }                               /* back home */
    e.className = cls; e.style.zIndex = zi; e.style.clipPath = clip; px(e, x, y, o < 1 ? 0.96 + 0.04 * o : 1, o);
    px(c.ph, c.hx, c.hy, 1, po);   /* the dashed slot shows while its chip is away */
  });
  gate.className = 's8-gate' + (verdict === 'ok' ? ' pass' : verdict === 'no' ? ' fail' : '');
  scan.style.opacity = scanX >= 0 ? 1 : 0; if (scanX >= 0) px(scan, scanX - 2, sy0 - (g.H0 + 12) / 2);
  vd.className = 's8-vd ' + verdict;   /* a ring that stamps round the chip's own badge: one tick, never two */
  vd.style.opacity = vOn; px(vd, vx, vy, vS);
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM && G) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
function refresh() { if (layout()) render(seeking ? t : RM ? END : t); }
window.__seek_s8 = function (s) { seeking = true; stop(); t = s; refresh(); render(s); };
refresh();
var lastW = 0;   /* also fires when the section is revealed (width 0 -> real width) */
if ('ResizeObserver' in window) new ResizeObserver(function () { if (stage.clientWidth !== lastW) { lastW = stage.clientWidth; refresh(); } }).observe(stage);
else addEventListener('resize', refresh);
if (document.fonts) document.fonts.ready.then(refresh);
if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
  es.forEach(function (e) {
    inView = e.isIntersecting && stage.offsetParent !== null;
    if (inView && !G) refresh();
    if (inView) go(); else stop();
  });
}, { threshold: 0.25 }).observe(stage);
if (!RM) AIML.pauseBtn(stage, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });

})();}catch(e){console.error('section s8 failed', e)}
/* ---- s9 ---- */
try{(function(){
/* S9: animate the native <details>. Opening sets [open] first, then .on on the next frame (rows 0fr -> 1fr);
   closing drops .on and removes [open] once the rows have collapsed. The big numeral rolls to the opened question.
   Reduced motion: native, instant. */
var root = document.getElementById('s9');
if (!root || AIML.REDUCE) return;
root.classList.add('s9-js');
var big = root.querySelector('.s9-big span');
function roll(n) {
  if (!big || big.textContent === n) return;
  big.classList.add('out'); big.textContent = n;
  requestAnimationFrame(function () { requestAnimationFrame(function () { big.classList.remove('out'); }); });
}
[].forEach.call(root.querySelectorAll('details'), function (d) {
  if (d.open) d.classList.add('on');
  var t = null, n = d.querySelector('summary i').textContent;
  d.querySelector('summary').addEventListener('click', function (e) {
    e.preventDefault(); clearTimeout(t);
    if (!d.classList.contains('on')) {
      d.open = true; roll(n);
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
    } else {
      d.classList.remove('on');
      t = setTimeout(function () { d.open = false; }, 240);   /* 220ms close + a frame */
    }
  });
});

})();}catch(e){console.error('section s9 failed', e)}
/* ---- s10 ---- */
try{(function(){
/* S10 v2: deterministic render(t), t in [0,6.4). Seek with window.__seek_s10(t). Reduced motion = the finished frame.
   0.15-3.3 the counter runs to 45:00 while four tangled lines straighten (staggered) onto one route; the teal route
   draws over them and the flag plants. 3.65-4.35 the stub tears: a gap opens, it drops and tilts. 4.25-5.1 a light
   runs the route; the button gets one ink halo. 5.6-6.4 seam (page critic 3: the old one-layer fade left a near-blank
   frame): the finished route crossfades straight into the tangle, the counter and bar rewind to 00:00 and the stub
   slides back onto the seam. The ticket is never blank. */
var tk = document.getElementById('s10-tk'), root = document.getElementById('s10');
if (!tk || !root) return;
var D = 6.4, RM = AIML.REDUCE, END = 4.6;
function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function eo(x) { return 1 - Math.pow(1 - x, 4); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
var Q = function (s) { return tk.querySelector(s); };
var clock = Q('.s10-clock'), bar = Q('.s10-bar'), tang = [].slice.call(Q('.s10-tangle').children), route = Q('.s10-route'), run = Q('.s10-run');
var penOn = Q('.s10-on'), flag = Q('.s10-flag'), stub = Q('.s10-stub'), btn = root.querySelector('.s10-cta .btn');

/* every line is "M p0 C p1 p2 p3 C p4 p5 p6 C p7 p8 p9": ten points, so each tangle can morph onto the route */
var R = [30,180, 90,180, 110,130, 160,125, 210,120, 240,95, 280,80, 310,70, 330,62, 352,60];
var T = [
  [30,180, 150,40, 40,30, 200,170, 330,250, 380,120, 230,60, 120,20, 300,190, 352,60],
  [30,180, 20,60, 250,230, 300,150, 360,60, 80,90, 120,40, 170,0, 400,140, 352,60],
  [30,180, 200,210, 330,200, 260,110, 200,30, 20,120, 90,60, 150,10, 260,20, 352,60],
  [30,180, 60,90, 380,30, 330,170, 290,260, 170,40, 180,140, 190,210, 360,120, 352,60]
];
function d(a) {
  var f = function (i) { return a[i].toFixed(1) + ' ' + a[i + 1].toFixed(1); };
  return 'M' + f(0) + 'C' + f(2) + ' ' + f(4) + ' ' + f(6) + 'C' + f(8) + ' ' + f(10) + ' ' + f(12) + 'C' + f(14) + ' ' + f(16) + ' ' + f(18);
}
route.setAttribute('d', d(R)); run.setAttribute('d', d(R));
function mix(a, p) { return a.map(function (v, i) { return v + (R[i] - v) * p; }); }
function mmss(m) { var s = Math.round(m * 60), mm = Math.floor(s / 60), ss = s % 60; return (mm < 10 ? '0' : '') + mm + ':' + (ss < 10 ? '0' : '') + ss; }

function render(t) {
  t = ((t % D) + D) % D;
  /* seam 5.6-6.4: x runs 0 -> 1; route and teal pen fade out while the tangle fades in at its start shape */
  var u = t, x = t >= 5.6 ? k(t, 5.6, 6.3) : -1;
  if (x >= 0) u = 0;
  /* counter + progress (ink): close to even pace, so all 45 minutes read */
  var lin = k(u, 0.15, 3.3), p = x >= 0 ? 1 - sm(x) : 0.5 * lin + 0.5 * sm(lin), txt = mmss(45 * p);
  if (clock.textContent !== txt) clock.textContent = txt;
  bar.style.setProperty('--p', p.toFixed(4));
  /* the tangle straightens onto the route, staggered; grey lines fade as they merge */
  tang.forEach(function (el, i) {
    var q = eo(k(u, 0.15 + i * 0.2, 2.5 + i * 0.2));
    el.setAttribute('d', d(mix(T[i], q)));
    el.style.opacity = x >= 0 ? sm(k(x, 0, 0.6)) : 1 - sm(k(u, 2.7 + i * 0.15, 3.3 + i * 0.1));
  });
  /* the teal route draws over the merging lines, then the flag plants and flutters */
  var fade = x >= 0 ? 1 - sm(k(x, 0.35, 1)) : 1;
  route.style.strokeDashoffset = x >= 0 ? 0 : (1 - eo(k(u, 2.3, 3.3))).toFixed(4);
  route.style.opacity = fade.toFixed(3);
  var fp = x >= 0 ? 1 : eo(k(u, 3.2, 3.55));
  penOn.style.opacity = (fp * fade).toFixed(3);
  var wave = u >= 3.55 ? Math.sin((u - 3.55) * 7) * 8 * (1 - k(u, 5.0, 5.6)) : 0;
  flag.setAttribute('transform', 'translate(352 60) scale(' + (1 + 0.18 * Math.sin(Math.PI * fp) * (fp < 1 ? 1 : 0)).toFixed(3) + ') skewY(' + wave.toFixed(2) + ')');
  /* the stub tears: a clear gap opens at the seam, it drops and tilts, its shadow deepens; it slides back at the seam */
  var tr = eo(k(t, 3.65, 4.35)) * (1 - sm(k(t, 5.6, 6.2)));
  stub.style.transform = 'translate(' + (12 * tr).toFixed(2) + 'px,' + (18 * tr).toFixed(2) + 'px) rotate(' + (4 * tr).toFixed(2) + 'deg)';
  stub.style.setProperty('--sd', tr.toFixed(3));
  /* end frame alive: a light runs the route once; one ink halo on the button */
  var rl = k(u, 4.25, 5.1);
  run.style.opacity = rl > 0 && rl < 1 ? 1 : 0; run.style.strokeDashoffset = (0.16 - rl * 1.2).toFixed(4);
  var h = k(u, 4.6, 5.3);
  btn.style.boxShadow = h > 0 && h < 1 ? '0 0 0 ' + (12 * eo(h)).toFixed(1) + 'px rgba(18,18,18,' + (0.12 * (1 - h)).toFixed(3) + ')' : '';
}

var t = 0, last = null, raf = 0, inView = false, paused = false, seeking = false;
function tick(now) { raf = 0; if (last !== null) t += (now - last) / 1000; last = now; render(t); go(); }
function go() { if (!raf && inView && !paused && !seeking && !RM) raf = requestAnimationFrame(tick); }
function stop() { if (raf) cancelAnimationFrame(raf); raf = 0; last = null; }
window.__seek_s10 = function (s) { seeking = true; stop(); t = s; render(s); };
render(RM ? END : 0);
if (!RM) {
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) {
    es.forEach(function (e) { inView = e.isIntersecting && tk.offsetParent !== null; if (inView) go(); else stop(); });
  }, { threshold: 0.3 }).observe(tk);
  AIML.pauseBtn(tk, { pause: function () { paused = true; stop(); }, play: function () { paused = false; go(); } });
}

})();}catch(e){console.error('section s10 failed', e)}
/* ---- s5b ---- */
try{(function(){
/* S5b v6: the segmented control moves a teal highlight from one programme to the other, row after row (a wave), so the
   reader sees every answer swap. render(p, ps) is a pure function of the selection state; the one-shot intro is a pure
   function of t (window.__seek_s5b(t)): rests on Sprint, the wave runs to the Accelerator, settles there. It plays once when
   60% of the table is in view and is cancelled by the first click or key. No JS / reduced motion: the plain table. */
var sec = document.getElementById('s5b'), seg = document.getElementById('s5b-seg'), wrap = document.getElementById('s5b-t');
if (!sec || !seg || (window.AIML && AIML.REDUCE)) return;
var lay = document.getElementById('s5b-bands'), pill = seg.querySelector('.s5b-pill'), btns = [].slice.call(seg.querySelectorAll('button'));
var rows = [].slice.call(sec.querySelectorAll('thead tr, tbody tr:not(.s5b-g)'));
var pairs = rows.map(function (r) { return [r.querySelector('.s5b-spr'), r.querySelector('.s5b-acc')]; });
var bands = pairs.map(function () { var b = document.createElement('i'); b.className = 's5b-band'; lay.appendChild(b); return b; });
var card = document.createElement('i'); card.className = 's5b-card'; lay.insertBefore(card, lay.firstChild);   /* the elevated Accelerator column */
var frame = document.createElement('i'); frame.className = 's5b-frame'; lay.appendChild(frame);               /* outline, only once settled */
sec.classList.add('s5b-js');
seg.hidden = false;

function cl(x) { return x < 0 ? 0 : x > 1 ? 1 : x; }
function k(t, a, b) { return cl((t - a) / (b - a)); }
function sm(x) { return x * x * x * (x * (6 * x - 15) + 10); }
function lerp(a, b, q) { return a + (b - a) * q; }

/* draw: pill at pp (0 Sprint .. 1 Accelerator); each row's tint at its own position pr[i], UNDER the text (a wave of fills,
   no edges crossing words); when every row has arrived, one outline frames the whole column */
function box(el, W) { var r = el.getBoundingClientRect(); return { x: r.left - W.left, y: r.top - W.top, w: r.width, h: r.height }; }
function put(el, b) { el.style.transform = 'translate(' + b.x.toFixed(1) + 'px,' + b.y.toFixed(1) + 'px)'; el.style.width = b.w.toFixed(1) + 'px'; el.style.height = b.h.toFixed(1) + 'px'; }
function union(col, W) { var a = box(pairs[0][col], W), z = box(pairs[pairs.length - 1][col], W); return { x: a.x, y: a.y, w: a.w, h: z.y + z.h - a.y }; }
function draw(pp, pr) {
  var W = wrap.getBoundingClientRect(); if (!W.width) return;
  var stacked = getComputedStyle(wrap.querySelector('table')).display === 'block';
  sec.classList.toggle('s5b-stk', stacked);
  bands.forEach(function (b, i) {
    var a = box(pairs[i][0], W), c = box(pairs[i][1], W), q = pr[i];
    b.style.display = (stacked && i === 0) || a.w < 4 || c.w < 4 ? 'none' : '';   /* stacked: the column heads are visually hidden */
    put(b, { x: a.x + (c.x - a.x) * q, y: a.y + (c.y - a.y) * q, w: a.w + (c.w - a.w) * q, h: a.h + (c.h - a.h) * q });
  });
  if (!stacked) {
    put(card, union(1, W));
    var mean = pr.reduce(function (s, v) { return s + v; }, 0) / pr.length, col = mean >= 0.5 ? 1 : 0;
    var dev = Math.max.apply(null, pr.map(function (v) { return Math.abs(v - col); }));
    put(frame, union(col, W)); frame.style.opacity = (1 - Math.min(1, dev * 5)).toFixed(3);
  }
  var S = seg.getBoundingClientRect(), b0 = btns[0].getBoundingClientRect(), b1 = btns[1].getBoundingClientRect();
  pill.style.transform = 'translateX(' + (lerp(b0.left, b1.left, pp) - S.left - 1).toFixed(1) + 'px)'; pill.style.width = lerp(b0.width, b1.width, pp).toFixed(1) + 'px';
  btns[0].classList.toggle('on', pp < 0.5); btns[1].classList.toggle('on', pp >= 0.5);
}
var STAG = 0.045, RUN = 0.55;
/* the intro and every switch share one wave: rows start STAG apart */
function wave(t, from, to) { return rows.map(function (r, i) { return lerp(from, to, sm(k(t, i * STAG, i * STAG + RUN))); }); }
function render(t) { draw(sm(k(t, 0.45, 1.0)), wave(t - 0.5, 0, 1)); }   /* intro: t in [0, 2.4] */

var sel = 0, anim = 0, intro = 'idle', seekT = null;
function settle() { draw(sel, rows.map(function () { return sel; })); }
function go(to, focus) {
  cancelAnimationFrame(anim); intro = 'done';
  var from = sel; sel = to;
  btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === to ? 'true' : 'false'); b.tabIndex = i === to ? 0 : -1; });
  if (focus) btns[to].focus();
  if (from === to) return settle();
  var t0 = performance.now(), dur = (rows.length - 1) * STAG + RUN;
  (function step(now) {
    var t = (now - t0) / 1000;
    draw(lerp(from, to, sm(k(t, 0, 0.5))), wave(t, from, to));
    if (t < dur) anim = requestAnimationFrame(step);
  })(t0);
}
btns.forEach(function (b, i) { b.addEventListener('click', function () { go(i, false); }); });
seg.addEventListener('keydown', function (e) {
  var to = { ArrowLeft: 0, ArrowUp: 0, Home: 0, ArrowRight: 1, ArrowDown: 1, End: 1 }[e.key];
  if (to === undefined) return; e.preventDefault(); go(to, true);
});

/* before the intro: rest on Sprint (frame 0 of the intro) */
sel = 0; btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === 0 ? 'true' : 'false'); b.tabIndex = i === 0 ? 0 : -1; });
settle();
window.__seek_s5b = function (t) { seekT = t; intro = 'done'; cancelAnimationFrame(anim); render(t); };
function redraw() { if (seekT !== null) render(seekT); else if (intro !== 'run') settle(); }
if ('ResizeObserver' in window) new ResizeObserver(redraw).observe(wrap); else addEventListener('resize', redraw);
if (document.fonts) document.fonts.ready.then(redraw);
if ('IntersectionObserver' in window) new IntersectionObserver(function (es, io) {
  es.forEach(function (e) {
    if (!e.isIntersecting || wrap.offsetParent === null) return;
    if (e.intersectionRect.height < 0.6 * Math.min(e.boundingClientRect.height, innerHeight)) return;   /* 60% of the table, or of the screen on a phone */
    redraw();
    if (intro !== 'idle') return io.disconnect();
    io.disconnect(); intro = 'run';
    var t0 = performance.now();
    (function step(now) {
      if (intro !== 'run') return;
      var t = (now - t0) / 1000; render(t);
      if (t < 2.4) anim = requestAnimationFrame(step);
      else { intro = 'done'; sel = 1; btns.forEach(function (b, i) { b.setAttribute('aria-checked', i === 1 ? 'true' : 'false'); b.tabIndex = i === 1 ? 0 : -1; }); settle(); }
    })(t0);
  });
}, { threshold: [0, .1, .2, .3, .4, .5, .6, .7, .8, .9, 1] }).observe(wrap);

})();}catch(e){console.error('section s5b failed', e)}