[].slice.call(document.getElementsByClassName('tristate'))
.forEach(function TristateCheckboxInterface(group) {
  var legend = group.getElementsByTagName('legend').item(0),
    indicator = [].slice.call(legend.getElementsByTagName('input'))
      .filter(function (el) { return el.type === 'checkbox'; }).pop(),
    inputs = [].slice.call(group.getElementsByTagName('input'))
      .filter(function (el) { return el !== indicator }),
    update = function update() {
      var checked = inputs.checked;

      indicator.checked = checked;
      if (checked === true || checked === false) {
        indicator.indeterminate = false;
        indicator.removeAttribute('aria-checked');
      } else {
        indicator.indeterminate = true;
        indicator.setAttribute('aria-checked', 'mixed');
      }
    };

  Object.defineProperty(inputs, 'checked', {
    enumerable: true,
    get: function () {
      var count = this.filter(function (el) { return el.checked; }).length;

      if (count === 0) {
        return false;
      } else if (count === this.length) {
        return true;
      }
      return null;
    },
    set: function (value) {
      this.forEach(function (input) {
        input.checked = value;
      });
      update();
    }
  });

  indicator.addEventListener('change', function (e) {
    inputs.checked = e.target.checked;
  });
  inputs.forEach(function (input) {
    input.addEventListener('change', update);
  });
});
