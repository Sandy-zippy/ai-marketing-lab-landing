/* s1 v6 pilot port: deterministic render(t), window.__seek_s1(t). */
var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var names=['Medico Construction','Scale Your Results','Rumor Avenue','Agent Lions Den','Jas Oberoi','Riarh Group','Celestial Luxury Resorts','Walk Again Rehab','Swathi Veldandi Studio'];
  document.getElementById('s1-mq').innerHTML = names.concat(names).map(function(n){return '<span>'+n+'</span>'}).join('');

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
  function loop(now){ if(seekT===null) render((now-T0)/1000); requestAnimationFrame(loop) }
  function start(){ layout(); snap(); if(running||RM){ render(RM?10.5:0); return; } running=true; T0=performance.now(); requestAnimationFrame(loop) }
  layout(); snap(); render(RM?10.5:0);
  addEventListener('resize',function(){layout();snap();render(seekT!==null?seekT:running?(performance.now()-T0)/1000:(RM?10.5:0))});
  if(document.fonts) document.fonts.ready.then(function(){layout();snap();render(seekT!==null?seekT:RM?10.5:0)});
  if('IntersectionObserver' in window) new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)start()})},{threshold:.3}).observe(stage); else start();

  var bs=[].slice.call(document.querySelectorAll('#s1 .facts b'));
  function fmt(b,v){var s=b.hasAttribute('data-plain')?String(v):v.toLocaleString('en-US');return (b.dataset.pre||'')+s+(b.dataset.suf||'')}
  if(!RM && 'IntersectionObserver' in window){
    bs.forEach(function(b){b.textContent=fmt(b,b.hasAttribute('data-plain')?1990:0)});
    new IntersectionObserver(function(es,io){es.forEach(function(e){if(!e.isIntersecting)return;io.disconnect();
      var t0=performance.now(),Dn=1600;(function tick(tt){var q=Math.min(1,(tt-t0)/Dn),e2=1-Math.pow(1-q,4);
        bs.forEach(function(b){var to=+b.dataset.to,from=b.hasAttribute('data-plain')?1990:0;b.textContent=fmt(b,Math.round(from+(to-from)*e2))});
        if(q<1)requestAnimationFrame(tick)})(t0)})},{threshold:.4}).observe(document.querySelector('#s1 .facts'));
  }
