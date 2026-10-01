/* AIML /call: one page, two states (FUNNEL-FLOW-SPEC-2026-10-01 §2).
   A = qualify, B = watch. No PII in the URL; the lead lives in localStorage only. */
window.aimlTrack = window.aimlTrack || function () {};
var RELAY_URL = '{{RELAY_URL}}';
var PAY_LINK = 'https://rzp.io/rzp/aimarketinglab-call';
/* Reveal times in seconds. Set from the live VSL transcript (offers/accelerator/vsl/live-vsl-transcript-2026-10-01.json).
   0 = show at once (the "show everything" kill switch). */
var REVEAL_SOFT = {{REVEAL_SOFT}}, PITCH = {{PITCH}}, CTA_SPOKEN = {{CTA_SPOKEN}};
var REDUCE = matchMedia('(prefers-reduced-motion: reduce)').matches;

function lsGet(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }
function lsPut(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
function custom(ev, p) { if (window.fbq) fbq('trackCustom', ev, p || {}); }

/* Shared helpers for section partials (js/sections.js). */
window.AIML = {
  REDUCE: REDUCE,
  /* fn(root) runs ONCE, when root has been revealed and is at least 30% on screen. */
  onView: function (root, fn) {
    if (!root) return;
    var done = false;
    function go() { if (!done) { done = true; fn(root); } }
    if (!('IntersectionObserver' in window)) return go();
    new IntersectionObserver(function (es, io) {
      es.forEach(function (e) { if (e.isIntersecting && e.target.offsetParent !== null) { io.disconnect(); go(); } });
    }, { threshold: 0.3 }).observe(root);
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

/* ---- state + reveals ---- */
var shown = {};
function reveal(stage) {
  if (shown[stage]) return; shown[stage] = true;
  document.querySelectorAll('[data-reveal="' + stage + '"]').forEach(function (el) { el.classList.add('on'); });
  document.dispatchEvent(new CustomEvent('aiml:reveal', { detail: { stage: stage } }));
}
function stateB() {
  document.body.dataset.state = 'b';
  reveal('watch');
  if (lsGet('aiml_vsl_seen') === '1') { reveal('soft'); reveal('pitch'); }
  if (REVEAL_SOFT === 0) reveal('soft');
  if (PITCH === 0) reveal('pitch');
}
function stateDQ() {
  document.body.dataset.state = 'dq';
  document.getElementById('qform').hidden = true;
  var d = document.getElementById('dq'); d.hidden = false; d.focus();
}

/* ---- screen 1: qualify ---- */
(function () {
  var form = document.getElementById('qform'), still = document.getElementById('still'), err = document.getElementById('qerr');
  var lead = null; try { lead = JSON.parse(lsGet('aiml_lead') || 'null'); } catch (e) {}
  if (lead && lead.ok) return stateB();
  if (lead && lead.ok === false) return stateDQ();
  document.body.dataset.state = 'a';
  var ans = {}, dq = null;
  var locks = still.querySelectorAll('.lock');

  form.querySelectorAll('.q[data-q="1"], .q[data-q="2"]').forEach(function (fs) {
    var n = fs.dataset.q;
    fs.querySelectorAll('.chips button').forEach(function (b) {
      b.setAttribute('aria-pressed', 'false');
      b.addEventListener('click', function () {
        fs.querySelectorAll('.chips button').forEach(function (x) { x.setAttribute('aria-pressed', String(x === b)); });
        ans['q' + n] = b.dataset.v;
        custom('QualifyStep', { step: Number(n), answer: b.dataset.v });
        if (b.dataset.dq) { dq = 'q' + n + ':' + b.dataset.v; return finishDQ(); }
        locks[n - 1].classList.add('open');
        still.dataset.open = String(still.querySelectorAll('.lock.open').length);
        var next = form.querySelector('.q[data-q="' + (+n + 1) + '"]');
        next.disabled = false;
        var first = next.querySelector('button, input'); if (first) first.focus({ preventScroll: true });
      });
    });
  });

  function finishDQ() {
    custom('Disqualified', { reason: dq });
    var row = base(); row.ok = false; row.reason = dq;
    send(row);
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
    [f.fn, f.em, f.ph].forEach(function (i) { i.removeAttribute('aria-invalid'); });
    if (!fn) bad = [f.fn, 'Add your first name.'];
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) bad = [f.em, 'That email looks off.'];
    else if (ph.replace(/\D/g, '').length < 10) bad = [f.ph, 'Add your WhatsApp number with the country code.'];
    if (bad) { bad[0].setAttribute('aria-invalid', 'true'); err.textContent = bad[1]; err.hidden = false; bad[0].focus(); return; }
    err.hidden = true;
    if (f.company.value) return stateB();                     /* honeypot: bots see the video, nothing is sent */
    var id = 'lead_' + (crypto.randomUUID ? crypto.randomUUID() : Date.now() + '_' + Math.random().toString(36).slice(2));
    var row = base(); row.ok = true; row.first_name = fn; row.email = em; row.whatsapp = ph; row.event_id = id;
    send(row);
    if (window.fbq && typeof META_PIXEL_ID !== 'undefined' && META_PIXEL_ID) {
      fbq('init', META_PIXEL_ID, { em: em, fn: fn.toLowerCase(), ph: phd });   /* advanced matching, pixel hashes */
      fbq('track', 'Lead', { content_name: 'AIML VSL optin' }, { eventID: id });
    }
    lsPut('aiml_lead', JSON.stringify({ q1: ans.q1, q2: ans.q2, ok: true, fn: fn, ts: Date.now() }));
    still.classList.add('lift');
    setTimeout(function () { stateB(); document.getElementById('watch').scrollIntoView({ behavior: REDUCE ? 'auto' : 'smooth' }); }, REDUCE ? 0 : 450);
  });
})();

/* ---- screen 2: smart player (from call/index.html): nothing loads until tap, no seek ahead, resume ---- */
(function () {
  var v = document.getElementById('vsl'), HLS = '{{ROOT}}call/vsl/hls/master.m3u8', MP4 = '{{ROOT}}call/vsl/aiml-vsl.mp4';
  var play = document.getElementById('play'), playL = document.getElementById('play-l'), tap = document.getElementById('vtap');
  var bar = document.getElementById('vbar');
  var KT = 'aiml_vsl_t', saved = parseFloat(lsGet(KT)) || 0, live = false, max = 0, half = false, nudged = false;
  v.controls = false; play.hidden = false;
  if (saved > 10) playL.textContent = 'Continue where you left off';

  function load(cb) {
    if (v.canPlayType('application/vnd.apple.mpegurl')) { v.src = HLS; return cb(); }
    var s = document.createElement('script');
    s.src = '{{ROOT}}assets/vendor/hls.light.min.js';
    s.onload = function () {
      if (window.Hls && window.Hls.isSupported()) { var h = new window.Hls({ capLevelToPlayerSize: true }); h.loadSource(HLS); h.attachMedia(v); }
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
