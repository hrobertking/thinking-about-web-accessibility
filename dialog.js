[].slice.call(document.getElementsByClassName('dialog'))
.forEach(function DialogInterface(overlay) {
  var position;

  overlay.cancel = function cancel() {
    if (overlay.opener && overlay.opener.focus) {
      overlay.opener.focus();
    }

    document.body.style.position = position;
    overlay.style.display = 'none';

    if (typeof overlay.onCancel === 'function') {
      overlay.onCancel();
    }
  };
  overlay.confirm = function confirm() {
    if (overlay.opener && overlay.opener.focus) {
      overlay.opener.focus();
    }

    document.body.style.position = position;
    overlay.style.display = 'none';

    if (typeof overlay.onConfirm === 'function') {
      overlay.onConfirm();
    }
  };
  overlay.open = function open() {
    position = document.body.style.position;
    document.body.style = 'fixed';

    overlay.opener = document.activeElement;
    overlay.style.display = 'flex';
    overlay.dialog.focus();
  };
  overlay.trap = function trap(blurred) {
    var focused = blurred.relatedTarget;
    if (!overlay.contains(focused)) {
      overlay.dialog.focus();
    }
  };

  if (!overlay.id) {
    overlay.setAttribute('id', 'dialog-' + (new Date()).getTime());
  }

  overlay.dialog = overlay.getElementsByTagName('section').item(0);

  overlay.dialog.addEventListener('click', function stopClick(e) {
    e.stopPropagation();
  });

  [].slice.call(overlay.dialog.getElementsByTagName('*'))
    .forEach(function assignTrap(el) {
      el.addEventListener('focusout', overlay.trap);
    });

  [].slice.call(overlay.dialog.getElementsByClassName('close'))
    .forEach(function assignClose(el) {
      el.addEventListener('click', overlay.cancel);
    });
  [].slice.call(overlay.dialog.getElementsByClassName('confirm'))
    .forEach(function assignConfirm(el) {
      el.addEventListener('click', overlay.confirm);
    });

  overlay.addEventListener('click', overlay.cancel);
  overlay.addEventListener('keydown', function keydown(e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      overlay.cancel();
    }
  });

  overlay.style.display = 'none';
  /* allows you to call window[overlay.id].open(); */
  window[overlay.id] = overlay;
});
