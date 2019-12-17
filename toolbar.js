[].slice.call(document.getElementsByClassName('toolbar'))
.forEach(function ToolbarInterface(bar) {
  [].slice.call(bar.getElementsByTagName('*'))
  .forEach(function (tag) {
    var ctrlId = tag.getAttribute('aria-controls'),
      controls = document.getElementById(ctrlId);

    if (controls) {
      tag.controls = controls;

      // if the tag is an input, update value, else use innerHTML
      controls.addEventListener('change', function () {
        if (tag.nodeName.toLowerCase() === 'input') {
          tag.value = controls.value;
        } else {
          tag.innerHTML = controls.value;
        }
        tag.pressed = false;
      });
    }
    if (tag.getAttribute('aria-pressed')) {
      Object.defineProperty(tag, 'pressed', {
        enumerable: true,
        get: function () {
          return Boolean(JSON.parse(this.getAttribute('aria-pressed')));
        },
        set: function (value) {
          this.setAttribute('aria-pressed', Boolean(JSON.parse(value)));
        }
      });

      tag.addEventListener('click', function (e) {
        tag.pressed = !tag.pressed;
        tag.pressed && tag.controls.focus();
      });
    }
  });
});
