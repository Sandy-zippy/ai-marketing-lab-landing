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
