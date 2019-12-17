[].slice.call(document.getElementsByClassName('skip-to'))
.forEach(function SkipToInterface(anchor) {
  var id = (/^#([^"']+)/i.exec(anchor.href) || [])[1],
    node;

  if (id) {
    node = document.getElementById(id);
    if (node) {
      function blur() {
        node.removeAttribute('tabindex');
        node.removeEventListener('blur', blur);
      }
      function click() {
        node.setAttribute('tabindex', -1);
      }

      anchor.addEventListener('click', click);
      node.addEventListener('blur', blur);
    }
  }
});
