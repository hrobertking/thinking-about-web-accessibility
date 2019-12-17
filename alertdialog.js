[].slice.call(document.getElementsByClassName('overlay'))
.forEach(function AlertDialogInterface(modal) {
  var body = modal.getElementsByTagName('section').item(0),
    id = modal.id,
    position = document.body.style.position,
    close = function close() {
      document.body.style.position = position;
      modal.style.display = 'none';
    },
    open = function open() {
      document.body.style.position = 'fixed';
      modal.style.display = 'flex';
      body.focus();
    },
    trap = function trap(e) {
      var dest = e.relatedTarget;

      if (!modal.contains(dest)) {
        body.focus();
      }
    };

  if (!id) {
    id = 'dialog-' + (new Date()).getTime();
    modal.setAttribute('id', id);
  }

  modal.open = open;

  modal.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.keyCode === 27) {
      close();
    }
  });

  [].slice.call(modal.getElementsByClassName('close'))
  .forEach(el => {
    el.addEventListener('click', close);
  });

  [].slice.call(modal.getElementsByTagName('*'))
  .forEach( el => {
    el.addEventListener('blur', trap);
  });

  body.addEventListener('click', function (e) {
    e.stopPropagation();
  });

  close();
});
