/* AIML /call: one page, two states (FUNNEL-FLOW-SPEC-2026-10-01 §2).
   A = qualify, B = watch. No PII in the URL; the lead lives in localStorage only. */
window.aimlTrack = window.aimlTrack || function () {};
var RELAY_URL = '{{RELAY_URL}}';
var PAY_LINK = 'https://rzp.io/rzp/aimarketinglab-call';
/* Reveal times in seconds. Set from the live VSL transcript (offers/accelerator/vsl/live-vsl-transcript-2026-10-01.json).
   0 = show at once (the "show everything" kill switch). */
var REVEAL_SOFT = {{REVEAL_SOFT}}, PITCH = {{PITCH}}, CTA_SPOKEN = {{CTA_SPOKEN}};
var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;
/* Two pages, one funnel (Sandy, 2 Oct): 'home' = aimarketinglabs.in, the opt-in only; 'call' = /call, the training.
   The form on home sends the lead to /call; /call without an opt-in sends the visitor back to home. utm/fbclid ride along. */
var PAGE = '{{PAGE}}';
function toTraining() { location.href = '/call/' + location.search + location.hash; }

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsPut(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
/* Meta pixel loads after the first paint: on idle after load (3 s cap) or on the first tap/key, whichever comes first.
   Anything that needs it (custom events, the Lead, utm/fbc for the beacon) waits for it, capped at 1.5 s. */
var pixelP = null;
function loadPixel() {
  if (!pixelP) pixelP = new Promise(function (res) {
    var s = document.createElement('script'); s.src = '{{ROOT}}assets/meta-pixel.js'; s.onload = s.onerror = function () { res(); };
    document.head.appendChild(s);
  });
  return pixelP;
}
function pixelReady(fn) {
  var done = false; function go() { if (!done) { done = true; fn(); } }
  loadPixel().then(go); setTimeout(go, 1500);
}
/* 2.5 s after load, not the first idle slot: fbevents.js + its config are ~700 ms of main thread on a throttled phone and
   landed before the hero still painted (Lighthouse mobile LCP 4.6 s with the pixel, 2.4 s without, 2 Oct 2026). */
addEventListener('load', function () { setTimeout(function () { if (window.requestIdleCallback) requestIdleCallback(loadPixel, { timeout: 2000 }); else loadPixel(); }, 2500); });
['pointerdown', 'keydown', 'touchstart'].forEach(function (t) { addEventListener(t, loadPixel, { once: true, passive: true }); });
function custom(ev, p) { pixelReady(function () { if (window.fbq) fbq('trackCustom', ev, p || {}); }); }

/* Shared helpers for section partials (js/sections.js). */
window.AIML = {
  REDUCE: REDUCE,
  /* fn(root) runs ONCE, when root has been revealed and its top is 15% into the viewport (a 30% threshold never fired on
     sections taller than ~3 viewports, e.g. s6 at 2,031px desktop / 3,294px mobile: BUGS-2026-10-02 #3). */
  onView: function (root, fn) {
    if (!root) return;
    var done = false;
    function go() { if (!done) { done = true; fn(root); } }
    if (!('IntersectionObserver' in window)) return go();
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) { if (e.isIntersecting && e.target.offsetParent !== null) { io.disconnect(); go(); } });
    }, { threshold: 0, rootMargin: '0px 0px -15% 0px' }).observe(root);
  },
  /* Adds the shared pause button to a .viz. ctl = {pause(), play()}. */
  pauseBtn: function (viz, ctl) {
    var b = document.createElement('button'), on = true;
    var P = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>';
    var G = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M7 4.5v15l13-7.5z"/></svg>';
    b.type = 'button'; b.className = 'mo-pause'; b.innerHTML = P; b.setAttribute('aria-label', 'Pause animation');
    b.addEventListener('click', function () {
      on = !on; if (on) ctl.play(); else ctl.pause();
      b.innerHTML = on ? P : G; b.setAttribute('aria-label', on ? 'Pause animation' : 'Play animation');
    });
    viz.appendChild(b);
    return b;
  }
};

/* Pay buttons: Razorpay chain unchanged. */
document.querySelectorAll('.js-pay').forEach(function (b) {
  b.href = PAY_LINK; b.rel = 'noopener';
  b.addEventListener('click', function () { aimlTrack('InitiateCheckout', { value: 999, currency: 'INR' }); });
});

/* Phone sticky bar: slides away while any other booking button is on screen (no two asks at once). */
(function () {
  var bar = document.querySelector('.stick'); if (!bar || !('IntersectionObserver' in window)) return;
  var seen = new Set();
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) seen.add(e.target); else seen.delete(e.target); });
    bar.classList.toggle('away', seen.size > 0);
  });
  document.querySelectorAll('.js-pay').forEach(function (b) { if (!bar.contains(b)) io.observe(b); });
})();

/* ---- state + reveals ---- */
var shown = {};
function reveal(stage) {
  if (shown[stage]) return; shown[stage] = true;
  document.querySelectorAll('[data-reveal="' + stage + '"]').forEach(function (el) {
    el.classList.add('on');
    el.querySelectorAll('video[data-poster]').forEach(function (v) { v.poster = v.dataset.poster; });
  });
  document.dispatchEvent(new CustomEvent('aiml:reveal', { detail: { stage: stage } }));
}
function stateB() {
  if (PAGE === 'home') return toTraining();
  document.body.dataset.state = 'b';
  reveal('watch');
  if (lsGet('aiml_vsl_seen') === '1') { reveal('soft'); reveal('pitch'); }
  if (REVEAL_SOFT === 0) reveal('soft');
  if (PITCH === 0) reveal('pitch');
}
function stateDQ() {
  document.body.dataset.state = 'dq';
  document.getElementById('qform').hidden = true;
  var d = document.getElementById('dq'); d.hidden = false;
  openModal(); d.focus();
}

/* ---- the popup: Get started opens it; Esc, the backdrop or the cross close it; Tab stays inside ---- */
var modal = document.getElementById('qmodal'), modalBox = modal.querySelector('.modal-box'), opener = document.getElementById('qopen');
function focusables() { return [].filter.call(modalBox.querySelectorAll('button:not([disabled]),input:not([disabled]),a[href],[tabindex="-1"]'), function (e) { return e.offsetParent !== null && !e.closest('.hp'); }); }
function openModal() {
  if (!modal.hidden) return;
  modal.hidden = false; document.body.classList.add('modal-open');
  var f = focusables().filter(function (e) { return e.tabIndex >= 0; }); (f[1] || f[0] || modalBox).focus({ preventScroll: true });   /* f[0] is the close cross */
}
function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true; document.body.classList.remove('modal-open');
  if (document.body.dataset.state === 'a') opener.focus();
}
opener.addEventListener('click', function () { custom('QualifyOpen'); openModal(); });
document.getElementById('qclose').addEventListener('click', closeModal);
document.getElementById('qmodal-bg').addEventListener('click', closeModal);
document.addEventListener('keydown', function (e) {
  if (modal.hidden) return;
  if (e.key === 'Escape') { e.preventDefault(); return closeModal(); }
  if (e.key !== 'Tab') return;
  var f = focusables().filter(function (x) { return x.tabIndex >= 0; }); if (!f.length) return;
  var first = f[0], last = f[f.length - 1];
  if (e.shiftKey && (document.activeElement === first || !modalBox.contains(document.activeElement))) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && (document.activeElement === last || !modalBox.contains(document.activeElement))) { e.preventDefault(); first.focus(); }
});

/* ---- screen 1: qualify ---- */
(function () {
  var form = document.getElementById('qform'), err = document.getElementById('qerr');
  var lead = null; try { lead = JSON.parse(lsGet('aiml_lead') || 'null'); } catch (e) {}
  if (PAGE === 'call' && !(lead && lead.ok)) return location.replace('/' + location.search + location.hash);
  if (lead && lead.ok) return stateB();
  if (lead && lead.ok === false) return stateDQ();
  document.body.dataset.state = 'a';
  var ans = {}, dq = null;

  form.querySelectorAll('.q[data-q="1"], .q[data-q="2"]').forEach(function (fs) {
    var n = fs.dataset.q;
    fs.querySelectorAll('.chips button').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        fs.querySelectorAll('.chips button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        ans['q' + n] = b.dataset.v;
        custom('QualifyStep', { step: Number(n), answer: b.dataset.v });
        if (b.dataset.dq) { dq = 'q' + n + ':' + b.dataset.v; return finishDQ(); }
        var next = form.querySelector('.q[data-q="' + (+n + 1) + '"]');
        next.disabled = false;
        var first = next.querySelector('button, input'); if (first) first.focus({ preventScroll: true });
      });
    });
  });

  function finishDQ() {
    custom('Disqualified', { reason: dq });
    pixelReady(function () { var row = base(); row.ok = false; row.reason = dq; send(row); });
    lsPut('aiml_lead', JSON.stringify({ q1: ans.q1, q2: ans.q2 || '', ok: false, ts: Date.now() }));
    stateDQ();
  }

  function base() {
    var a = (window.aimlAttr && aimlAttr()) || {};
    return { q1: ans.q1 || '', q2: ans.q2 || '', utm_source: a.utm_source || '', utm_medium: a.utm_medium || '', utm_campaign: a.utm_campaign || '',
      utm_content: a.utm_content || '', utm_term: a.utm_term || '', fbclid: a.fbclid || '', fbc: a.fbc || '', fbp: a.fbp || '',
      page: location.origin + location.pathname, user_agent: navigator.userAgent };
  }
  function send(row) {
    if (!RELAY_URL || !navigator.sendBeacon) return;
    try { navigator.sendBeacon(RELAY_URL + '?src=lead', new Blob([JSON.stringify(row)], { type: 'text/plain' })); } catch (e) {}
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var f = form.elements, bad = null;
    var fn = f.fn.value.trim(), em = f.em.value.trim().toLowerCase(), ph = f.ph.value.replace(/[^\d+]/g, '');
    var phd = ph.replace(/\D/g, '').replace(/^0+/, ''); if (phd.length === 10) phd = '91' + phd;   /* India default, matches the relay's phone_() */
    [f.fn, f.em, f.ph].forEach(function (i) { i.removeAttribute('aria-invalid'); i.removeAttribute('aria-describedby'); });
    if (!fn) bad = [f.fn, 'Add your first name.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) bad = [f.em, 'That email looks off.'];
    else if (ph.replace(/\D/g, '').length < 10) bad = [f.ph, 'Add your WhatsApp number with the country code.'];
    /* the message sits directly under the field it is about */
    if (bad) { bad[0].setAttribute('aria-invalid', 'true'); bad[0].setAttribute('aria-describedby', 'qerr'); bad[0].parentNode.after(err); err.textContent = bad[1]; err.hidden = false; bad[0].focus(); return; }
    err.hidden = true;
    if (f.company.value) { closeModal(); return stateB(); }   /* honeypot: bots see the video, nothing is sent */
    var id = 'lead_' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).slice(2));
    pixelReady(function () {                                   /* same event_id in the beacon (CAPI) and the pixel = Meta dedups */
      var row = base(); row.ok = true; row.first_name = fn; row.email = em; row.whatsapp = ph; row.event_id = id;
      send(row);
      if (window.fbq && typeof META_PIXEL_ID !== 'undefined' && META_PIXEL_ID) {
        fbq('init', META_PIXEL_ID, { em: em, fn: fn.toLowerCase(), ph: phd });   /* advanced matching, pixel hashes */
        fbq('track', 'Lead', { content_name: 'AIML VSL optin' }, { eventID: id });
      }
      /* leave only after the Lead is on its way: the stub only queues it until fbevents.js has loaded (fbq.callMethod),
         and a queue dies with the page. Wait for the real pixel, 3 s cap, then 400 ms for the request to go. */
      if (PAGE === 'home') { var t0 = Date.now(); (function wait() {
        if ((window.fbq && window.fbq.callMethod) || Date.now() - t0 > 3000) return setTimeout(toTraining, 400);
        setTimeout(wait, 100); })(); }
    });
    lsPut('aiml_lead', JSON.stringify({ q1: ans.q1, q2: ans.q2, ok: true, fn: fn, ts: Date.now() }));
    if (PAGE === 'home') { var sb = form.querySelector('[type=submit]'); sb.disabled = true; sb.textContent = 'Opening the training...'; return; }
    closeModal(); stateB(); document.getElementById('watch').scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' });
  });
})();

/* ---- screen 2: smart player (from call/index.html): nothing loads until tap, no seek ahead, resume ---- */
(function () {
  var v = document.getElementById('vsl'), HLS = '{{ROOT}}call/vsl/hls/master.m3u8', MP4 = '{{ROOT}}call/vsl/aiml-vsl.mp4';
  var play = document.getElementById('play'), playL = document.getElementById('play-l'), tap = document.getElementById('vtap');
  var bar = document.getElementById('vbar');
  if (!v) return;   /* home carries no player */
  var KT = 'aiml_vsl_t', saved = parseFloat(lsGet(KT)) || 0, live = false, max = 0, half = false, nudged = false;
  v.controls = false; play.hidden = false;
  if (saved > 10) playL.textContent = 'Continue where you left off';

  function load(cb) {
    if (v.canPlayType('application/vnd.apple.mpegurl')) { v.src = HLS; return cb(); }
    var s = document.createElement('script');
    s.src = '{{ROOT}}assets/vendor/hls.light.min.js';
    s.onload = function () {
      if (window.Hls && window.Hls.isSupported()) { var h = new window.Hls({ capLevelToPlayerSize: false, startLevel: 0, abrEwmaDefaultEstimate: 8000000 });   /* Sandy 5 Oct "it's not HD": start on the 1080p rung (index 0 in master.m3u8), never cap to the player's CSS size */ h.loadSource(HLS); h.attachMedia(v); }
      else v.src = MP4;
      cb();
    };
    s.onerror = function () { v.src = MP4; cb(); };
    document.head.appendChild(s);
  }
  play.addEventListener('click', function () {
    play.hidden = true; tap.hidden = false; live = true;
    load(function () {
      var start = saved > 10 ? saved : 0; max = start;
      if (start) v.addEventListener('loadedmetadata', function () { v.currentTime = start; }, { once: true });
      v.play().catch(function () {});
    });
  });
  tap.addEventListener('click', function () { if (v.paused) v.play(); else v.pause(); });
  v.addEventListener('seeking', function () { if (live && v.currentTime > max + 1) v.currentTime = max; });
  v.addEventListener('timeupdate', function () {
    var t = v.currentTime, d = v.duration || 0;
    if (!d || !live) return;
    bar.style.transform = 'scaleX(' + (1 - Math.pow(1 - t / d, 2.5)).toFixed(4) + ')';
    if (!v.seeking && t > max) max = t;
    if (Math.floor(t) % 2 === 0) lsPut(KT, String(Math.floor(t)));
    if (!shown.soft && t >= REVEAL_SOFT) { reveal('soft'); custom('VSLSoftCTA'); }
    if (!shown.pitch && t >= PITCH) { reveal('pitch'); custom('VSLPitch'); lsPut('aiml_vsl_seen', '1'); }
    if (!nudged && t >= CTA_SPOKEN) { nudged = true; document.querySelectorAll('.js-nudge').forEach(function (b) { b.classList.remove('nudge'); void b.offsetWidth; b.classList.add('nudge'); }); }
    if (!half && t / d >= 0.5) { half = true; aimlTrack('ViewContent', { content_name: 'AIML VSL 50%' }); }
  });
  v.addEventListener('ended', function () { lsPut(KT, '0'); lsPut('aiml_vsl_seen', '1'); reveal('soft'); reveal('pitch'); });
})();

/* Clarity after idle, as on call/index.html. */
addEventListener('load', function () { setTimeout(function () {
  (function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","xgp3y420au");
}, 3000); });
