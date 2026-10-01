var root = document.getElementById('s1');
if (root && !AIML.REDUCE) {
  root.classList.add('armed');
  AIML.onView(root, function (r) { r.classList.add('go'); });
}
