(function () {
  'use strict';

  var CONSENT_KEY = 'aiml_analytics_consent_v1';
  var ATTRIBUTION_KEY = 'aiml_attribution_v1';
  var CLARITY_ID = 'xgp3y420au';
  var POSTHOG_KEY = 'phc_rz66saz69eTnJxHgRJRBPyqDzNwDCdPY3mbJZkPqYLJe';
  var POSTHOG_HOST = 'https://us.i.posthog.com';
  var queue = [];
  var ready = false;

  function safeStorage(storage, method, key, value) {
    try {
      if (method === 'get') return storage.getItem(key);
      storage.setItem(key, value);
    } catch (_) {}
    return null;
  }

  function getVariant() {
    var route = window.location.pathname.match(/^\/(vsl|webinar)(?:\/|$)/);
    return route ? route[1] : (safeStorage(window.localStorage, 'get', 'aiml_funnel_variant') ||
      document.documentElement.getAttribute('data-funnel-variant') || 'direct');
  }

  function attribution() {
    var allow = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'gclid', 'gbraid', 'wbraid'];
    var params = new URLSearchParams(window.location.search);
    var current = {};
    allow.forEach(function (key) {
      var value = params.get(key);
      if (value) current[key] = value.slice(0, 240);
    });

    var stored = {};
    try { stored = JSON.parse(safeStorage(window.localStorage, 'get', ATTRIBUTION_KEY) || '{}'); } catch (_) {}
    var merged = Object.assign({}, stored, current);
    if (Object.keys(merged).length) safeStorage(window.localStorage, 'set', ATTRIBUTION_KEY, JSON.stringify(merged));
    return merged;
  }

  function properties(extra) {
    return Object.assign({
      page_path: window.location.pathname,
      page_title: document.title,
      funnel_variant: getVariant()
    }, attribution(), extra || {});
  }

  window.aimlTrack = function (name, props) {
    if (!ready) {
      queue.push([name, props || {}]);
      return;
    }
    try {
      window.clarity('event', name);
      window.posthog.capture(name, properties(props));
    } catch (_) {}
  };

  function loadClarity() {
    (function (c, l, a, r, i, t, y) {
      c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments); };
      t = l.createElement(r); t.async = 1; t.src = 'https://www.clarity.ms/tag/' + i;
      y = l.getElementsByTagName(r)[0]; y.parentNode.insertBefore(t, y);
    })(window, document, 'clarity', 'script', CLARITY_ID);
  }

  function loadPostHog() {
    !function (t, e) {
      var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) {
        function g(t, e) { var o = e.split('.'); if (o.length === 2) { t = t[o[0]]; e = o[1]; } t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments))); }; }
        p = t.createElement('script'); p.type = 'text/javascript'; p.async = true; p.src = s.api_host + '/static/array.js';
        r = t.getElementsByTagName('script')[0]; r.parentNode.insertBefore(p, r);
        var u = e; a = a || 'posthog'; u = e[a] = [];
        u.people = u.people || []; u.toString = function () { return 'posthog'; };
        o = 'capture identify register register_once opt_out_capturing opt_in_capturing reset'.split(' ');
        for (n = 0; n < o.length; n++) g(u, o[n]);
        e._i.push([i, s, a]);
      }, e.__SV = 1);
    }(document, window.posthog || []);
    window.posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      autocapture: false,
      capture_pageview: false,
      persistence: 'localStorage'
    });
  }

  function startAnalytics() {
    if (ready) return;
    loadClarity();
    loadPostHog();
    ready = true;
    var variant = getVariant();
    try {
      window.clarity('set', 'funnel_variant', variant);
      window.posthog.register(properties());
    } catch (_) {}
    window.aimlTrack('page_view');
    if (safeStorage(window.sessionStorage, 'get', 'aiml_experiment_id') === 'vsl_vs_webinar_v1' &&
        !safeStorage(window.sessionStorage, 'get', 'aiml_experiment_exposed_v1')) {
      safeStorage(window.sessionStorage, 'set', 'aiml_experiment_exposed_v1', '1');
      window.aimlTrack('experiment_exposure', { experiment: 'vsl_vs_webinar_v1', variant: variant });
    }
    queue.splice(0).forEach(function (item) { window.aimlTrack(item[0], item[1]); });
  }

  function consentBanner() {
    var style = document.createElement('style');
    style.textContent = '.aiml-consent{position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;max-width:680px;margin:auto;padding:16px;background:#13191B;color:#F5F5F0;border:1px solid rgba(0,161,155,.32);border-radius:12px;box-shadow:0 20px 60px rgba(0,0,0,.45);font:14px/1.5 Inter,system-ui,sans-serif}.aiml-consent p{margin:0}.aiml-consent a{color:#19C3B8}.aiml-consent__actions{display:flex;gap:10px;margin-top:12px;flex-wrap:wrap}.aiml-consent button{min-height:44px;padding:10px 16px;border-radius:8px;border:1px solid rgba(245,245,240,.2);font:600 13px/1 Inter,system-ui,sans-serif;cursor:pointer}.aiml-consent__allow{background:#00A19B;color:#04110F;border-color:#00A19B!important}.aiml-consent__decline{background:transparent;color:#F5F5F0}.aiml-consent button:focus-visible{outline:3px solid #FFE5A3;outline-offset:2px}';
    document.head.appendChild(style);

    var banner = document.createElement('aside');
    banner.className = 'aiml-consent';
    banner.setAttribute('aria-label', 'Analytics choice');
    banner.innerHTML = '<p>We use optional analytics to improve this site and compare the VSL and webinar journeys. <a href="/privacy.html">Privacy details</a>.</p><div class="aiml-consent__actions"><button class="aiml-consent__allow" type="button">Allow analytics</button><button class="aiml-consent__decline" type="button">Decline</button></div>';
    document.body.appendChild(banner);

    banner.querySelector('.aiml-consent__allow').addEventListener('click', function () {
      safeStorage(window.localStorage, 'set', CONSENT_KEY, 'allow');
      banner.remove();
      startAnalytics();
    });
    banner.querySelector('.aiml-consent__decline').addEventListener('click', function () {
      safeStorage(window.localStorage, 'set', CONSENT_KEY, 'decline');
      queue = [];
      banner.remove();
    });
  }

  function bindPageEvents() {
    document.addEventListener('click', function (event) {
      var element = event.target.closest('[data-track]');
      if (!element) return;
      window.aimlTrack(element.getAttribute('data-track'), {
        label: (element.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 120),
        destination: element.getAttribute('href') || '',
        section: element.closest('section[id]') ? element.closest('section[id]').id : ''
      });
    });

    document.querySelectorAll('form[data-track-form]').forEach(function (form) {
      var started = false;
      form.addEventListener('focusin', function () {
        if (started) return;
        started = true;
        window.aimlTrack('form_start', { form: form.getAttribute('data-track-form') });
      });
    });

    var fired = {};
    window.addEventListener('scroll', function () {
      var height = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      var percent = Math.round(window.scrollY / height * 100);
      [25, 50, 75, 100].forEach(function (depth) {
        if (percent >= depth && !fired[depth]) {
          fired[depth] = true;
          window.aimlTrack('scroll_depth', { depth: depth });
        }
      });
    }, { passive: true });
  }

  document.addEventListener('DOMContentLoaded', function () {
    bindPageEvents();
    var consent = safeStorage(window.localStorage, 'get', CONSENT_KEY);
    if (consent === 'allow') startAnalytics();
    else if (consent !== 'decline') consentBanner();
  });
})();
