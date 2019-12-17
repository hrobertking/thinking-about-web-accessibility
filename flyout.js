[].slice.call(document.getElementsByClassName('flyout'))
.forEach(function FlyoutInterface(ctrl) {
  var region = document.getElementById(
      ctrl.getAttribute('aria-controls')),
    initialState = region ?
      region.getAttribute('aria-hidden') === 'true' :
      false,
    list = region.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]'
    ),
    focusable = [].slice.call(list);

  function trap(evt) {
    var next = evt.relatedTarget;

    if (next && !region.contains(next)) {
      region.setAttribute('aria-hidden', true);
    }
  }

  if (ctrl && region) {
    region.className = [
      region.className.replace(/\bflyout-content\b/, ''),
      'flyout-content'
    ].join(' ');

    ctrl.setAttribute('aria-expanded', !initialState);

    ctrl.addEventListener('click', function toggleAriaHidden() {
      var hidden = region.getAttribute('aria-hidden') === 'true';

      region.setAttribute('aria-hidden', !hidden);
      ctrl.setAttribute('aria-expanded', hidden);
    });

    /* hide the flyout when focus moves out of the region */
    focusable.forEach(function FocusableInterface(el) {
      el.addEventListener('focusout', trap);
    });
  }
});
