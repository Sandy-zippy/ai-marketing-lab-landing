/* The ticket's default is the finished frame (stub torn and landed). Arm the tear only where the reader has not
   seen that frame yet: the section is revealed (it was hidden until now) or the stub is still below the fold.
   Only the stub's position is armed; no text is ever hidden. */
var root = document.getElementById('s1'), tk = root && root.querySelector('.s1-tk'), stub = root && root.querySelector('.s1-stub');
if (tk && !AIML.REDUCE) {
  var started = false;
  var play = function () {
    if (started) return; started = true;
    root.classList.add('armed');
    new IntersectionObserver(function (es, io) {
      if (es[0].isIntersecting) { io.disconnect(); root.classList.add('go'); }
    }, { threshold: 0.15, rootMargin: '0px 0px -25% 0px' }).observe(stub);   // the stub block, once it is in the upper three quarters of the screen
  };
  if (!tk.offsetParent) {
    document.addEventListener('aiml:reveal', function (e) { if (e.detail.stage === 'soft' && tk.offsetParent) play(); });
  } else if (stub.getBoundingClientRect().top > innerHeight) play();   // the reader has not seen the stub's resting place yet
}
