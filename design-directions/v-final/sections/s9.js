/* S9: animate the native <details>. Opening sets [open] first, then .on on the next frame (rows 0fr -> 1fr);
   closing drops .on and removes [open] once the rows have collapsed. Reduced motion: native, instant. */
var root = document.getElementById('s9');
if (!root || AIML.REDUCE) return;
root.classList.add('s9-js');
[].forEach.call(root.querySelectorAll('details'), function (d) {
  if (d.open) d.classList.add('on');
  var t = null;
  d.querySelector('summary').addEventListener('click', function (e) {
    e.preventDefault(); clearTimeout(t);
    if (!d.classList.contains('on')) {
      d.open = true;
      requestAnimationFrame(function () { requestAnimationFrame(function () { d.classList.add('on'); }); });
    } else {
      d.classList.remove('on');
      t = setTimeout(function () { d.open = false; }, 220);   // --d-micro close + a frame
    }
  });
});
