[].slice.call(document.getElementsByTagName('input'))
.forEach(function DismissbleTooltipInterface(el) {
  /* loop through siblings to see if there is a tooltip */
  var sibling = el.nextElementSibling,
    dismissed = function (evt) {
      if (evt.key === 'Escape' || evt.keyCode === 27) {
        evt.className = [
          (evt.className || '').replace(/\bdismissed\b/, ' ').trim(),
          'dismissed'
        ].join(' ');
      }
    };
  
  while (sibling) {
    if (sibling.getAttribute('role') === 'tooltip') {
      el.addEventListener('keydown', dismissed);
      sibling.addEventListener('keydown', dismissed);
      break;
    }
    sibling = sibling.nextElementSibling;
  }
});
