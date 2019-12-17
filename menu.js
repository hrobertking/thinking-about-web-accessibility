[].slice.call(document.getElementsByClassName('menu'))
.forEach(function MenuInterface(bar) {
  [].slice.call(bar.getElementsByTagName('*'))
  .forEach(function (tag) {
    if (tag.getAttribute('aria-pressed')) {
      tag.addEventListener('click', function (e) {
        var aria = 'aria-pressed',
          ctrl = e.target,
          pressed = ctrl.getAttribute(aria) === 'true';

        function onBlur() {
          var cls = ctrl.className;

          ctrl.className = cls
            .replace(/\bclicked\b/, ' ')
            .trim();
          
          ctrl
              .removeEventListener('blur', onBlur);
        }

        while (
          ctrl &&
          ctrl.nodeName !== 'BUTTON' &&
          ctrl.nodeName !== 'INPUT'
        ) {
          ctrl = ctrl.parentNode;
          pressed = ctrl.getAttribute(aria) === 'true';
        }

        ctrl.setAttribute(aria, !pressed);
        ctrl.className = [
          ctrl.className,
          'clicked'
        ].join(' ').trim();
        
        ctrl.addEventListener('blur', onBlur);
      });
    }
  });
});
[].slice.call(document.getElementsByClassName('popup'))
.forEach(function PopupInterface(btn) {
  var popupId = btn.getAttribute('aria-controls'),
    popup,
    opts;

  if (popupId) {
    popup = document.getElementById(popupId);
    opts = popup.getElementsByTagName('li');

    function selectOpt(evt) {
      var selected,
        target = (evt || {}).target;

      switch (evt.key || evt.keyCode) {
        case 'Enter':
        case 13:
        case ' ':
        case 32:
          selected = true;
          break;
        default:
      }
      [].slice.call(opts)
      .forEach(function (opt) {
        opt.setAttribute(
          'aria-current',
          opt === target
        );
      });

      if (target && selected) {
        btn.innerHTML = target.innerHTML;
        btn.setAttribute('aria-pressed', false);
      }
    }
  
    [].slice.call(opts)
    .forEach(function (opt) {
      opt.setAttribute('tabindex', 0);
      opt.addEventListener('click', selectOpt);
      opt.addEventListener('keydown', selectOpt);
    });
  }
});
