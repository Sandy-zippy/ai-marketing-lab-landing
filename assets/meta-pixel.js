/* Meta Pixel for /call and /call/booked. Empty = nothing loads and nothing errors, and the
   Pages workflow refuses to deploy. Paste the pixel ID here, nowhere else. */
const META_PIXEL_ID = "1398728291888113";

window.aimlTrack = function () {};
if (META_PIXEL_ID) {
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;
  n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;
  t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,
  document,'script','https://connect.facebook.net/en_US/fbevents.js');
  fbq('init', META_PIXEL_ID);
  fbq('track', 'PageView');
  window.aimlTrack = function (ev, params, opts) { fbq('track', ev, params, opts); };
}

/* Ad attribution. The click lands on /call or /sprint with utm_* and fbclid; Razorpay then sends
   the buyer to booked.html with none of it. Keep the last paid touch in localStorage so the
   Purchase event and the Cal.com booking can say which ad (utm_content = ad id) drove them. */
window.aimlAttr = function () {
  var a = {};
  try { a = JSON.parse(localStorage.getItem('aiml_attr') || '{}'); } catch (e) {}
  ['_fbp', '_fbc'].forEach(function (k) {
    var m = document.cookie.match(new RegExp('(?:^|; )' + k + '=([^;]+)'));
    if (m) a[k.slice(1)] = m[1];
  });
  return a;
};
try {
  var q = new URLSearchParams(location.search), hit = {};
  ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'utm_id', 'fbclid'].forEach(function (k) {
    if (q.get(k)) hit[k] = q.get(k);
  });
  if (Object.keys(hit).length) {
    hit.landed = new Date().toISOString();
    hit.page = location.pathname;
    localStorage.setItem('aiml_attr', JSON.stringify(hit));
  }
} catch (e) {}
