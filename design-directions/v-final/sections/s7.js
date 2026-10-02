var root = document.getElementById('s7');
if (!root || AIML.REDUCE || !('IntersectionObserver' in window)) return;
/* Each block (the sheet, the fork) arms only if it is not on screen yet, and plays when 15% of it is in view.
   Nothing here touches text opacity: the armed frame only shortens strokes, shrinks fills and moves the notes. */
var sheet = root.querySelector('.s7-sheet'), fork = root.querySelector('.s7-fork'), armed = {};
[sheet, fork].forEach(function (b, i) {
  if (b.offsetParent !== null && b.getBoundingClientRect().top < innerHeight) return;
  armed[i] = true;
  b.classList.add('s7-arm');
  new IntersectionObserver(function (es, io) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.disconnect(); b.classList.add('s7-go');
      /* the longest chain (fork after the sheet) ends at 3.8 s; then hand back to the plain finished frame */
      setTimeout(function () { b.classList.remove('s7-arm', 's7-go', 's7-after'); }, 3900);
    });
  }, { threshold: 0.15 }).observe(b);
});
/* sheet first, then the fork: when both play, the fork waits for the last row to tick */
if (armed[0] && armed[1]) fork.classList.add('s7-after');
