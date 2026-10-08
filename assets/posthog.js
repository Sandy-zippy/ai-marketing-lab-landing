/* PostHog for every page: pageviews (with utm_*), autocaptured clicks, and the funnel events the pages fire
   through ph(). The SDK starts after load so it never competes with the first paint; ph() queues until then. */
(function () {
  var KEY = 'phc_rz66saz69eTnJxHgRJRBPyqDzNwDCdPY3mbJZkPqYLJe', HOST = 'https://us.i.posthog.com', q = [], who = null, on = false;
  window.ph = function (ev, props) { if (on) window.posthog.capture(ev, props || {}); else q.push([ev, props]); };
  window.phIdentify = function (email, props) { if (on) window.posthog.identify(email, props); else who = [email, props]; };
  function start() {
    /* PostHog's official snippet: a stub that queues calls, then loads array.js from the assets host */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]),t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="init capture register register_once unregister identify alias reset opt_in_capturing opt_out_capturing get_distinct_id".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
    window.posthog.init(KEY, {
      api_host: HOST, person_profiles: 'identified_only', capture_pageview: true, autocapture: true,
      disable_session_recording: true   /* Clarity already records sessions */
    });
    on = true;   /* the stub queues these until array.js has loaded */
    if (who) window.posthog.identify(who[0], who[1]);
    q.splice(0).forEach(function (e) { window.posthog.capture(e[0], e[1] || {}); });
  }
  /* Sandy's own devices: open any page with ?me=on once per device (?me=off undoes it). That visit tags the device
     with 'internal_device_marked' so the dashboard drops its past events too; after that PostHog never loads there. */
  var me = null; try {
    var m = new URLSearchParams(location.search).get('me');
    if (m === 'on') localStorage.setItem('aiml_me', '1'); if (m === 'off') { localStorage.removeItem('aiml_me'); localStorage.removeItem('aiml_me_marked'); }
    if (m) { var u = new URL(location.href); u.searchParams.delete('me'); history.replaceState(null, '', u); badge(m === 'on' ? 'This device is now excluded from AIML analytics.' : 'This device is counted in AIML analytics again.'); }
    me = localStorage.getItem('aiml_me') ? (localStorage.getItem('aiml_me_marked') ? 'quiet' : 'mark') : null;
  } catch (e) {}
  function badge(t) { addEventListener('DOMContentLoaded', function () { var b = document.createElement('div'); b.textContent = t;
    b.style.cssText = 'position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:420px;margin:auto;padding:10px 14px;border-radius:8px;background:#121212;color:#fff;font:14px/1.4 Inter,system-ui,sans-serif;text-align:center';
    document.body.appendChild(b); setTimeout(function () { b.remove(); }, 5000); }); }
  if (me === 'quiet') { window.ph = window.phIdentify = function () {}; return; }
  function go() { start(); if (me === 'mark') { window.posthog.capture('internal_device_marked'); try { localStorage.setItem('aiml_me_marked', '1'); } catch (e) {} } }
  if (document.readyState === 'complete') go(); else addEventListener('load', go);
})();
