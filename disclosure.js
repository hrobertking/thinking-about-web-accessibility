[].slice.call(document.getElementsByClassName('disclosure'))
.forEach(function DisclosureInterface(ctrl) {
  var region = document.getElementById(
      ctrl.getAttribute('aria-controls')),
    initialState = region ?
      region.getAttribute('aria-hidden') === 'true' :
      false;

  if (ctrl && region) {
    region.className = [region.className.replace(/\bdisclosed\b/, ''),
      'disclosed'].join(' ');
    ctrl.setAttribute('aria-expanded', !initialState);

    ctrl.addEventListener('click', function toggleAriaHidden() {
      var hidden = region.getAttribute('aria-hidden') === 'true';

      region.setAttribute('aria-hidden', !hidden);
      ctrl.setAttribute('aria-expanded', hidden);
    });
  }
});
